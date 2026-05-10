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

// Admin-only spend rollup. Run via:
//   npx convex run aiCalls:summarizeSpend '{"since":<ms>,"groupBy":"task"}'
export const summarizeSpend = internalQuery({
  args: {
    since: v.number(),
    groupBy: v.union(v.literal('task'), v.literal('user'), v.literal('model')),
  },
  handler: async (ctx, { since, groupBy }) => {
    const rows = await ctx.db
      .query('aiCalls')
      .filter((q) => q.gte(q.field('_creationTime'), since))
      .collect();
    type Bucket = {
      key: string;
      calls: number;
      inTokens: number;
      outTokens: number;
      usd: number;
      okCalls: number;
    };
    const buckets = new Map<string, Bucket>();
    for (const r of rows) {
      const key =
        groupBy === 'task'
          ? r.task
          : groupBy === 'user'
            ? String(r.userId)
            : r.providerModel;
      const cur =
        buckets.get(key) ??
        ({ key, calls: 0, inTokens: 0, outTokens: 0, usd: 0, okCalls: 0 } as Bucket);
      cur.calls += 1;
      cur.okCalls += r.ok ? 1 : 0;
      cur.inTokens += r.inputTokens;
      cur.outTokens += r.outputTokens;
      cur.usd += r.costUsd ?? 0;
      buckets.set(key, cur);
    }
    return Array.from(buckets.values()).sort((a, b) => b.usd - a.usd);
  },
});
