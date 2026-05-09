import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { requireUser } from './lib/auth';
import { appError } from './lib/errors';

export const register = mutation({
  args: {
    expoPushToken: v.string(),
    platform: v.union(v.literal('ios'), v.literal('android')),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const existing = await ctx.db
      .query('pushTokens')
      .withIndex('by_token', (q) => q.eq('expoPushToken', args.expoPushToken))
      .first();
    if (existing) {
      if (existing.userId !== user._id) {
        throw appError('CONFLICT', 'Push token already belongs to another user');
      }
      await ctx.db.patch(existing._id, {
        platform: args.platform,
        lastSeenAt: Date.now(),
      });
      return existing._id;
    }
    return await ctx.db.insert('pushTokens', {
      userId: user._id,
      expoPushToken: args.expoPushToken,
      platform: args.platform,
      lastSeenAt: Date.now(),
    });
  },
});

export const unregister = mutation({
  args: { expoPushToken: v.string() },
  handler: async (ctx, { expoPushToken }) => {
    const user = await requireUser(ctx);
    const existing = await ctx.db
      .query('pushTokens')
      .withIndex('by_token', (q) => q.eq('expoPushToken', expoPushToken))
      .first();
    if (existing?.userId === user._id) {
      await ctx.db.delete(existing._id);
    }
  },
});
