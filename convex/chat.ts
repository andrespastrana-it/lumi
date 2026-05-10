import { v } from 'convex/values';
import { internalMutation, internalQuery, mutation, query } from './_generated/server';
import { getUserOrNull, requireUser } from './lib/auth';
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

export const ensureThread = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const existing = await ctx.db
      .query('chatThreads')
      .withIndex('by_user_lastMessageAt', (q) => q.eq('userId', user._id))
      .order('desc')
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert('chatThreads', {
      userId: user._id,
      title: 'Pip',
      lastMessageAt: Date.now(),
    });
  },
});

export const sendUserMessage = mutation({
  args: { threadId: v.id('chatThreads'), text: v.string() },
  handler: async (ctx, { threadId, text }) => {
    const user = await requireUser(ctx);
    const trimmed = text.trim();
    if (!trimmed) throw appError('INVALID_ARGUMENT', 'Message is empty');
    if (trimmed.length > 2000) {
      throw appError('INVALID_ARGUMENT', 'Message too long', { field: 'text' });
    }
    const thread = await ctx.db.get(threadId);
    if (!thread || thread.userId !== user._id) {
      throw appError('NOT_FOUND', 'Thread not found');
    }
    const messageId = await ctx.db.insert('chatMessages', {
      threadId,
      userId: user._id,
      role: 'user',
      content: trimmed,
    });
    await ctx.db.patch(threadId, { lastMessageAt: Date.now() });
    return messageId;
  },
});

export const recentForThread = internalQuery({
  args: { threadId: v.id('chatThreads'), limit: v.optional(v.number()) },
  handler: async (ctx, { threadId, limit }) => {
    const cap = Math.min(limit ?? 12, 40);
    const rows = await ctx.db
      .query('chatMessages')
      .withIndex('by_thread', (q) => q.eq('threadId', threadId))
      .order('desc')
      .take(cap);
    return rows.reverse().map((r) => ({
      role: r.role,
      content: r.content,
    }));
  },
});

export const threadOwnerCheck = internalQuery({
  args: { threadId: v.id('chatThreads'), userId: v.id('users') },
  handler: async (ctx, { threadId, userId }) => {
    const thread = await ctx.db.get(threadId);
    return !!thread && thread.userId === userId;
  },
});
