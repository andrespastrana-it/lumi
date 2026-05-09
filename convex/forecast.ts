import { v } from 'convex/values';
import { query } from './_generated/server';
import { getUserOrNull } from './lib/auth';
import type { Doc } from './_generated/dataModel';

function forecastDto(row: Doc<'forecastSnapshots'>) {
  return {
    id: row._id,
    _id: row._id,
    range: row.range,
    generatedAt: row.generatedAt,
    payload: row.payload,
  };
}

export const get = query({
  args: { range: v.union(v.literal('7d'), v.literal('30d')) },
  handler: async (ctx, { range }) => {
    const user = await getUserOrNull(ctx);
    if (!user) return null;
    const row = await ctx.db
      .query('forecastSnapshots')
      .withIndex('by_user_range', (q) => q.eq('userId', user._id).eq('range', range))
      .order('desc')
      .first();
    return row ? forecastDto(row) : null;
  },
});
