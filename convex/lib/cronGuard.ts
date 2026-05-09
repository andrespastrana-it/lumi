import type { MutationCtx } from '../_generated/server';

export async function claimCronRun(
  ctx: MutationCtx,
  jobName: string,
  scopeKey: string,
): Promise<boolean> {
  const existing = await ctx.db
    .query('cronRuns')
    .withIndex('by_job_scope', (q) => q.eq('jobName', jobName).eq('scopeKey', scopeKey))
    .first();
  if (existing) return false;
  await ctx.db.insert('cronRuns', { jobName, scopeKey, ranAt: Date.now() });
  return true;
}
