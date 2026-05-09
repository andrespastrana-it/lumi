import { v } from 'convex/values';
import { internalMutation } from './_generated/server';
import type { MutationCtx } from './_generated/server';
import { claimCronRun } from './lib/cronGuard';

const PAGE = 500;
const DAY = 24 * 60 * 60 * 1000;

const WINDOWS = {
  aiCalls: 90,
  forecastSnapshots: 30,
  cronRuns: 30,
  foodLogDiagnostics: 30,
  archivedPlans: 90,
  deletedFoodLogs: 30,
} as const;

async function purgeAiCallsImpl(ctx: MutationCtx, olderThan: number) {
  const rows = await ctx.db
    .query('aiCalls')
    .filter((q) => q.lt(q.field('_creationTime'), olderThan))
    .take(PAGE);
  for (const row of rows) await ctx.db.delete(row._id);
  return { deleted: rows.length, more: rows.length === PAGE };
}

async function purgeForecastSnapshotsImpl(ctx: MutationCtx, olderThan: number) {
  const rows = await ctx.db
    .query('forecastSnapshots')
    .filter((q) => q.lt(q.field('generatedAt'), olderThan))
    .take(PAGE);
  for (const row of rows) await ctx.db.delete(row._id);
  return { deleted: rows.length, more: rows.length === PAGE };
}

async function purgeCronRunsImpl(ctx: MutationCtx, olderThan: number) {
  const rows = await ctx.db
    .query('cronRuns')
    .filter((q) => q.lt(q.field('ranAt'), olderThan))
    .take(PAGE);
  for (const row of rows) await ctx.db.delete(row._id);
  return { deleted: rows.length, more: rows.length === PAGE };
}

async function purgeFoodLogDiagnosticsImpl(ctx: MutationCtx, olderThan: number) {
  const now = Date.now();
  const rows = await ctx.db
    .query('foodLogDiagnostics')
    .filter((q) =>
      q.or(
        q.and(q.neq(q.field('expiresAt'), undefined), q.lt(q.field('expiresAt'), now)),
        q.lt(q.field('createdAt'), olderThan),
      ),
    )
    .take(PAGE);
  for (const row of rows) await ctx.db.delete(row._id);
  return { deleted: rows.length, more: rows.length === PAGE };
}

async function purgeDeletedFoodLogsImpl(ctx: MutationCtx, olderThan: number) {
  const rows = await ctx.db
    .query('foodLogs')
    .filter((q) =>
      q.and(
        q.eq(q.field('status'), 'deleted'),
        q.lt(q.field('_creationTime'), olderThan),
      ),
    )
    .take(PAGE);
  for (const log of rows) {
    const diags = await ctx.db
      .query('foodLogDiagnostics')
      .withIndex('by_log', (q) => q.eq('foodLogId', log._id))
      .collect();
    for (const d of diags) await ctx.db.delete(d._id);
    for (const assetId of [log.photoAssetId, log.audioAssetId]) {
      if (!assetId) continue;
      const asset = await ctx.db.get(assetId);
      if (asset) {
        await ctx.storage.delete(asset.storageId);
        await ctx.db.delete(asset._id);
      }
    }
    await ctx.db.delete(log._id);
  }
  return { deleted: rows.length, more: rows.length === PAGE };
}

async function purgeArchivedPlansImpl(ctx: MutationCtx, olderThan: number) {
  const rows = await ctx.db
    .query('plans')
    .filter((q) =>
      q.and(
        q.eq(q.field('status'), 'archived'),
        q.lt(q.field('activeTo'), olderThan),
      ),
    )
    .take(PAGE);
  for (const plan of rows) {
    const recipes = await ctx.db
      .query('planRecipes')
      .withIndex('by_plan', (q) => q.eq('planId', plan._id))
      .collect();
    for (const r of recipes) await ctx.db.delete(r._id);
    await ctx.db.delete(plan._id);
  }
  return { deleted: rows.length, more: rows.length === PAGE };
}

export const purgeAiCalls = internalMutation({
  args: { olderThan: v.number() },
  handler: (ctx, { olderThan }) => purgeAiCallsImpl(ctx, olderThan),
});

export const purgeForecastSnapshots = internalMutation({
  args: { olderThan: v.number() },
  handler: (ctx, { olderThan }) => purgeForecastSnapshotsImpl(ctx, olderThan),
});

export const purgeCronRuns = internalMutation({
  args: { olderThan: v.number() },
  handler: (ctx, { olderThan }) => purgeCronRunsImpl(ctx, olderThan),
});

export const purgeFoodLogDiagnostics = internalMutation({
  args: { olderThan: v.number() },
  handler: (ctx, { olderThan }) => purgeFoodLogDiagnosticsImpl(ctx, olderThan),
});

export const purgeDeletedFoodLogs = internalMutation({
  args: { olderThan: v.number() },
  handler: (ctx, { olderThan }) => purgeDeletedFoodLogsImpl(ctx, olderThan),
});

export const purgeArchivedPlans = internalMutation({
  args: { olderThan: v.number() },
  handler: (ctx, { olderThan }) => purgeArchivedPlansImpl(ctx, olderThan),
});

function todayScopeKey() {
  return new Date().toISOString().slice(0, 10);
}

async function runDaily<T>(
  ctx: MutationCtx,
  jobName: string,
  windowDays: number,
  impl: (ctx: MutationCtx, olderThan: number) => Promise<T>,
): Promise<T | { skipped: true }> {
  const scope = todayScopeKey();
  const claimed = await claimCronRun(ctx, jobName, scope);
  if (!claimed) return { skipped: true };
  return await impl(ctx, Date.now() - windowDays * DAY);
}

export const purgeAiCallsDaily = internalMutation({
  handler: (ctx) => runDaily(ctx, 'purgeAiCalls', WINDOWS.aiCalls, purgeAiCallsImpl),
});

export const purgeForecastSnapshotsDaily = internalMutation({
  handler: (ctx) =>
    runDaily(ctx, 'purgeForecastSnapshots', WINDOWS.forecastSnapshots, purgeForecastSnapshotsImpl),
});

export const purgeCronRunsDaily = internalMutation({
  handler: (ctx) => runDaily(ctx, 'purgeCronRuns', WINDOWS.cronRuns, purgeCronRunsImpl),
});

export const purgeFoodLogDiagnosticsDaily = internalMutation({
  handler: (ctx) =>
    runDaily(ctx, 'purgeFoodLogDiagnostics', WINDOWS.foodLogDiagnostics, purgeFoodLogDiagnosticsImpl),
});

export const purgeDeletedFoodLogsDaily = internalMutation({
  handler: (ctx) =>
    runDaily(ctx, 'purgeDeletedFoodLogs', WINDOWS.deletedFoodLogs, purgeDeletedFoodLogsImpl),
});

export const purgeArchivedPlansDaily = internalMutation({
  handler: (ctx) =>
    runDaily(ctx, 'purgeArchivedPlans', WINDOWS.archivedPlans, purgeArchivedPlansImpl),
});
