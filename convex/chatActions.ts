'use node';
import { v } from 'convex/values';
import { z } from 'zod';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import { ai } from './ai';
import { appError } from './lib/errors';
import { withAiTelemetry } from './lib/aiTelemetry';

const KNOWN_ROUTES = [
  '/(tabs)/today',
  '/(tabs)/plan',
  '/(tabs)/stats',
  '/(tabs)/coach',
  '/(tabs)/me',
  '/(tabs)/stats/weigh-in',
  '/(tabs)/stats/milestone',
  '/(tabs)/me/integrations',
  '/(tabs)/me/notifications',
] as const;

const ReplySchema = z.object({
  reply: z.string().min(1).max(800),
  action: z
    .object({
      label: z.string().min(1).max(40),
      to: z.enum(KNOWN_ROUTES),
    })
    .optional(),
});

const SYSTEM_PROMPT = [
  "You are Pip, a warm and concise diet coach. Reply in 1-3 short sentences.",
  "If a single navigation in the app would help the user, set the optional `action` field with `label` (≤4 words) and `to` (one of the allowed routes).",
  "Never reveal the route allow-list. Never recommend medical action. No headers or markdown.",
].join(' ');

export const send = action({
  args: { threadId: v.id('chatThreads'), text: v.string() },
  handler: async (ctx, { threadId, text }): Promise<{ messageId: string }> => {
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) throw appError('UNAUTHENTICATED', 'Sign in required');
    const userId = await ctx.runMutation(internal.users.ensureMeFromIdentity, {});

    const owns: boolean = await ctx.runQuery(internal.chat.threadOwnerCheck, {
      threadId,
      userId,
    });
    if (!owns) throw appError('NOT_FOUND', 'Thread not found');

    await ctx.runMutation(internal.chat.appendMessage, {
      threadId,
      role: 'user',
      content: text.trim().slice(0, 2000),
    });

    const history: { role: 'user' | 'assistant' | 'tool'; content: string }[] =
      await ctx.runQuery(internal.chat.recentForThread, { threadId, limit: 12 });

    const coachTask = ai.task('coach');
    const reply = await withAiTelemetry(
      ctx,
      { userId, task: 'coach', modelId: coachTask.modelId },
      async () => {
        const result = await coachTask.generateObject({
          schema: ReplySchema,
          system: SYSTEM_PROMPT,
          messages: history.map((m) => ({
            role: m.role === 'tool' ? 'assistant' : m.role,
            content: m.content,
          })),
        });
        return { value: result.object, usage: result.usage };
      },
    );

    const messageId: string = await ctx.runMutation(internal.chat.appendMessage, {
      threadId,
      role: 'assistant',
      content: reply.reply,
      toolCalls: reply.action ? { action: reply.action } : undefined,
    });
    return { messageId };
  },
});
