import { v } from 'convex/values';
import { mutation, query, internalQuery } from './_generated/server';
import { getUserOrNull, requireUser } from './lib/auth';
import { assertRange, BODY_BOUNDS } from './lib/bounds';
import type { Doc } from './_generated/dataModel';

function weighInDto(row: Doc<'weighIns'>) {
  return {
    id: row._id,
    _id: row._id,
    measuredAt: row.measuredAt,
    weightKg: row.weightKg,
    source: row.source,
  };
}

export const create = mutation({
  args: {
    weightKg: v.number(),
    measuredAt: v.optional(v.number()),
    source: v.optional(v.union(v.literal('manual'), v.literal('health_sync'))),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    assertRange('weightKg', args.weightKg, ...BODY_BOUNDS.weightKg);
    return await ctx.db.insert('weighIns', {
      userId: user._id,
      measuredAt: args.measuredAt ?? Date.now(),
      weightKg: args.weightKg,
      source: args.source ?? 'manual',
    });
  },
});

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const user = await getUserOrNull(ctx);
    if (!user) return [];
    const rows = await ctx.db
      .query('weighIns')
      .withIndex('by_user_measuredAt', (q) => q.eq('userId', user._id))
      .order('desc')
      .take(Math.min(limit ?? 10, 50));
    return rows.map(weighInDto);
  },
});

export const recentForUser = internalQuery({
  args: { userId: v.id('users'), limit: v.optional(v.number()) },
  handler: async (ctx, { userId, limit }) => {
    const rows = await ctx.db
      .query('weighIns')
      .withIndex('by_user_measuredAt', (q) => q.eq('userId', userId))
      .order('desc')
      .take(Math.min(limit ?? 30, 100));
    return rows.map(weighInDto);
  },
});
