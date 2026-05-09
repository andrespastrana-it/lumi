import { v } from 'convex/values';
import { internalQuery } from './_generated/server';

export const countSince = internalQuery({
  args: {
    userId: v.id('users'),
    task: v.string(),
    since: v.number(),
  },
  handler: async (ctx, { userId, task, since }) => {
    const rows = await ctx.db
      .query('aiCalls')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) =>
        q.and(q.eq(q.field('task'), task), q.gte(q.field('_creationTime'), since)),
      )
      .collect();
    return rows.length;
  },
});
