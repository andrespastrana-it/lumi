import { v } from 'convex/values';
import { internalMutation, query } from './_generated/server';
import { getUserOrNull } from './lib/auth';
import { appError } from './lib/errors';
import type { Doc } from './_generated/dataModel';

function messageDto(row: Doc<'chatMessages'>) {
  return {
    id: row._id,
    _id: row._id,
    threadId: row.threadId,
    role: row.role,
    content: row.content,
  };
}

export const createThread = internalMutation({
  args: { userId: v.id('users'), title: v.string() },
  handler: async (ctx, { userId, title }) => {
    return await ctx.db.insert('chatThreads', {
      userId,
      title,
      lastMessageAt: Date.now(),
    });
  },
});

export const appendMessage = internalMutation({
  args: {
    threadId: v.id('chatThreads'),
    role: v.union(v.literal('user'), v.literal('assistant'), v.literal('tool')),
    content: v.string(),
    toolCalls: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId);
    if (!thread) throw appError('NOT_FOUND', 'Thread not found');
    const messageId = await ctx.db.insert('chatMessages', {
      threadId: thread._id,
      userId: thread.userId,
      role: args.role,
      content: args.content,
      toolCalls: args.toolCalls,
    });
    await ctx.db.patch(thread._id, { lastMessageAt: Date.now() });
    return messageId;
  },
});

export const messages = query({
  args: { threadId: v.id('chatThreads') },
  handler: async (ctx, { threadId }) => {
    const user = await getUserOrNull(ctx);
    if (!user) return [];
    const thread = await ctx.db.get(threadId);
    if (!thread || thread.userId !== user._id) return [];
    const rows = await ctx.db
      .query('chatMessages')
      .withIndex('by_thread', (q) => q.eq('threadId', threadId))
      .collect();
    return rows.map(messageDto);
  },
});
