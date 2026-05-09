import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import schema from './schema';
import { modules } from './test.setup';
import { claimCronRun } from './lib/cronGuard';
import { OWNED_TABLES } from './lib/ownership';

function testDb() {
  return convexTest(schema, modules);
}

async function seedUser(t: ReturnType<typeof testDb>, subject: string) {
  return await t.mutation(internal.users.upsert, {
    clerkUserId: subject,
    email: `${subject}@example.com`,
  });
}

describe('cronGuard.claimCronRun', () => {
  test('first claim returns true and inserts a cronRuns row; duplicate claim returns false', async () => {
    const t = testDb();

    const first = await t.run(async (ctx) =>
      claimCronRun(ctx, 'purgeAiCalls', '2026-05-09'),
    );
    expect(first).toBe(true);

    const rows = await t.run(async (ctx) => await ctx.db.query('cronRuns').collect());
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ jobName: 'purgeAiCalls', scopeKey: '2026-05-09' });

    const second = await t.run(async (ctx) =>
      claimCronRun(ctx, 'purgeAiCalls', '2026-05-09'),
    );
    expect(second).toBe(false);

    const rowsAfter = await t.run(async (ctx) => await ctx.db.query('cronRuns').collect());
    expect(rowsAfter).toHaveLength(1);
  });

  test('different scopeKey claims independently', async () => {
    const t = testDb();
    const a = await t.run(async (ctx) => claimCronRun(ctx, 'purgeAiCalls', '2026-05-09'));
    const b = await t.run(async (ctx) => claimCronRun(ctx, 'purgeAiCalls', '2026-05-10'));
    expect(a).toBe(true);
    expect(b).toBe(true);
  });
});

describe('retention sweeps', () => {
  test('purgeAiCalls deletes rows older than the cutoff and leaves recent ones', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'rt_aicalls');
    const NOW = Date.now();
    const OLD = NOW - 100 * 24 * 60 * 60 * 1000;
    const RECENT = NOW - 10 * 24 * 60 * 60 * 1000;

    const oldId = await t.run(async (ctx) => {
      return await ctx.db.insert('aiCalls', {
        userId,
        task: 'vision',
        providerModel: 'x',
        inputTokens: 0,
        outputTokens: 0,
        ms: 1,
        ok: true,
      });
    });
    const recentId = await t.run(async (ctx) => {
      return await ctx.db.insert('aiCalls', {
        userId,
        task: 'vision',
        providerModel: 'x',
        inputTokens: 0,
        outputTokens: 0,
        ms: 1,
        ok: true,
      });
    });

    // Patch _creationTime by re-anchoring via a dedicated field — convex-test does
    // not let us set _creationTime directly, so we use an explicit cutoff arg.
    const result = await t.mutation(internal.retention.purgeAiCalls, {
      olderThan: NOW - 30 * 24 * 60 * 60 * 1000,
    });

    expect(result).toMatchObject({ deleted: expect.any(Number), more: expect.any(Boolean) });
    const remaining = await t.run(async (ctx) => await ctx.db.query('aiCalls').collect());
    // both rows have _creationTime ~= NOW (just inserted), so cutoff in the past
    // means none qualify → 0 deleted, both remain.
    expect(remaining.map((r) => r._id).sort()).toEqual([oldId, recentId].sort());
    expect(result.deleted).toBe(0);

    // With cutoff in the future, both qualify and are deleted.
    const result2 = await t.mutation(internal.retention.purgeAiCalls, {
      olderThan: NOW + 60_000,
    });
    expect(result2.deleted).toBe(2);
    const after = await t.run(async (ctx) => await ctx.db.query('aiCalls').collect());
    expect(after).toHaveLength(0);
  });

  test('purgeForecastSnapshots deletes by generatedAt, not creation time', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'rt_forecast');
    const NOW = Date.now();
    const STALE = NOW - 60 * 24 * 60 * 60 * 1000;
    const FRESH = NOW - 5 * 24 * 60 * 60 * 1000;

    await t.run(async (ctx) => {
      await ctx.db.insert('forecastSnapshots', {
        userId, range: '7d', generatedAt: STALE, payload: { trend: 'down' },
      });
      await ctx.db.insert('forecastSnapshots', {
        userId, range: '30d', generatedAt: FRESH, payload: { trend: 'flat' },
      });
    });

    const result = await t.mutation(internal.retention.purgeForecastSnapshots, {
      olderThan: NOW - 30 * 24 * 60 * 60 * 1000,
    });
    expect(result.deleted).toBe(1);

    const remaining = await t.run(async (ctx) =>
      await ctx.db.query('forecastSnapshots').collect(),
    );
    expect(remaining).toHaveLength(1);
    expect(remaining[0].generatedAt).toBe(FRESH);
  });

  test('purgeCronRuns deletes by ranAt', async () => {
    const t = testDb();
    const NOW = Date.now();
    await t.run(async (ctx) => {
      await ctx.db.insert('cronRuns', { jobName: 'j', scopeKey: 'old', ranAt: NOW - 60 * 86400_000 });
      await ctx.db.insert('cronRuns', { jobName: 'j', scopeKey: 'fresh', ranAt: NOW - 5 * 86400_000 });
    });

    const result = await t.mutation(internal.retention.purgeCronRuns, {
      olderThan: NOW - 30 * 86400_000,
    });
    expect(result.deleted).toBe(1);

    const remaining = await t.run(async (ctx) => await ctx.db.query('cronRuns').collect());
    expect(remaining).toHaveLength(1);
    expect(remaining[0].scopeKey).toBe('fresh');
  });

  test('purgeFoodLogDiagnostics deletes when expiresAt is past or createdAt is past cutoff', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'rt_diag');
    const NOW = Date.now();
    const logId = await t.run(async (ctx) => {
      return await ctx.db.insert('foodLogs', {
        userId, consumedAt: NOW, source: 'manual', name: 'x',
        kcal: 0, proteinG: 0, carbG: 0, fatG: 0, status: 'confirmed',
      });
    });

    const expiredId = await t.run(async (ctx) =>
      await ctx.db.insert('foodLogDiagnostics', {
        userId, foodLogId: logId, task: 'vision',
        payload: {}, createdAt: NOW, expiresAt: NOW - 1000,
      }),
    );
    const oldUnboundedId = await t.run(async (ctx) =>
      await ctx.db.insert('foodLogDiagnostics', {
        userId, foodLogId: logId, task: 'vision',
        payload: {}, createdAt: NOW - 60 * 86400_000,
      }),
    );
    const freshId = await t.run(async (ctx) =>
      await ctx.db.insert('foodLogDiagnostics', {
        userId, foodLogId: logId, task: 'vision',
        payload: {}, createdAt: NOW - 5 * 86400_000,
      }),
    );

    const result = await t.mutation(internal.retention.purgeFoodLogDiagnostics, {
      olderThan: NOW - 30 * 86400_000,
    });
    expect(result.deleted).toBe(2);

    const remaining = await t.run(async (ctx) =>
      await ctx.db.query('foodLogDiagnostics').collect(),
    );
    expect(remaining.map((r) => r._id)).toEqual([freshId]);
  });

  test('purgeArchivedPlans removes archived plans older than cutoff and their planRecipes; leaves active plans', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'rt_plans');
    const NOW = Date.now();
    const oldArchivedActiveTo = NOW - 100 * 86400_000;
    const recentArchivedActiveTo = NOW - 5 * 86400_000;

    const oldArchivedId = await t.run(async (ctx) => {
      return await ctx.db.insert('plans', {
        userId, dailyKcal: 1800, proteinG: 120, carbG: 180, fatG: 60,
        recipes: [], shopping: [], generator: 'rules',
        activeFrom: oldArchivedActiveTo - 7 * 86400_000,
        activeTo: oldArchivedActiveTo,
        status: 'archived',
      });
    });
    const recentArchivedId = await t.run(async (ctx) => {
      return await ctx.db.insert('plans', {
        userId, dailyKcal: 2000, proteinG: 130, carbG: 200, fatG: 65,
        recipes: [], shopping: [], generator: 'rules',
        activeFrom: recentArchivedActiveTo - 7 * 86400_000,
        activeTo: recentArchivedActiveTo,
        status: 'archived',
      });
    });
    const activeId = await t.run(async (ctx) => {
      return await ctx.db.insert('plans', {
        userId, dailyKcal: 2200, proteinG: 140, carbG: 220, fatG: 70,
        recipes: [], shopping: [], generator: 'llm',
        activeFrom: NOW - 86400_000,
        activeTo: NOW + 6 * 86400_000,
        status: 'active',
      });
    });
    await t.run(async (ctx) => {
      await ctx.db.insert('planRecipes', {
        userId, planId: oldArchivedId, day: 0, slot: 'lunch',
        name: 'r1', kcal: 0, proteinG: 0, carbG: 0, fatG: 0,
        ingredients: [], method: [],
      });
      await ctx.db.insert('planRecipes', {
        userId, planId: activeId, day: 0, slot: 'lunch',
        name: 'r-active', kcal: 0, proteinG: 0, carbG: 0, fatG: 0,
        ingredients: [], method: [],
      });
    });

    const result = await t.mutation(internal.retention.purgeArchivedPlans, {
      olderThan: NOW - 30 * 86400_000,
    });
    expect(result.deleted).toBe(1);

    const remainingPlans = await t.run(async (ctx) =>
      await ctx.db.query('plans').collect(),
    );
    expect(remainingPlans.map((p) => p._id).sort()).toEqual([recentArchivedId, activeId].sort());

    const remainingRecipes = await t.run(async (ctx) =>
      await ctx.db.query('planRecipes').collect(),
    );
    expect(remainingRecipes).toHaveLength(1);
    expect(remainingRecipes[0].planId).toBe(activeId);
  });

  test('purgeDeletedFoodLogs cascades diagnostics, media assets, and storage; leaves confirmed logs', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'rt_logs');
    const NOW = Date.now();

    const seeded = await t.run(async (ctx) => {
      const storageId = await ctx.storage.store(new Blob(['photo'], { type: 'image/jpeg' }));
      const assetId = await ctx.db.insert('mediaAssets', {
        userId, storageId, kind: 'photo', mime: 'image/jpeg', bytes: 5,
      });
      const deletedLogId = await ctx.db.insert('foodLogs', {
        userId, consumedAt: NOW, source: 'photo', name: 'gone',
        kcal: 100, proteinG: 5, carbG: 10, fatG: 2,
        photoAssetId: assetId, status: 'deleted',
      });
      const diagId = await ctx.db.insert('foodLogDiagnostics', {
        userId, foodLogId: deletedLogId, task: 'vision', payload: {}, createdAt: NOW,
      });
      const keepLogId = await ctx.db.insert('foodLogs', {
        userId, consumedAt: NOW, source: 'manual', name: 'keep',
        kcal: 100, proteinG: 5, carbG: 10, fatG: 2, status: 'confirmed',
      });
      return { storageId, assetId, deletedLogId, diagId, keepLogId };
    });

    const result = await t.mutation(internal.retention.purgeDeletedFoodLogs, {
      olderThan: NOW + 60_000,
    });
    expect(result.deleted).toBe(1);

    const logs = await t.run(async (ctx) => await ctx.db.query('foodLogs').collect());
    expect(logs.map((l) => l._id)).toEqual([seeded.keepLogId]);

    const diags = await t.run(async (ctx) => await ctx.db.query('foodLogDiagnostics').collect());
    expect(diags).toHaveLength(0);

    const assets = await t.run(async (ctx) => await ctx.db.query('mediaAssets').collect());
    expect(assets).toHaveLength(0);

    const storageMeta = await t.run(async (ctx) => await ctx.db.system.query('_storage').collect());
    expect(storageMeta).toHaveLength(0);
  });
});

describe('cascade registry', () => {
  test('OWNED_TABLES contains every userId-scoped table; softDelete clears each', async () => {
    expect(OWNED_TABLES).toEqual(
      expect.arrayContaining([
        'profiles', 'plans', 'planRecipes', 'foodLogs', 'weighIns',
        'chatThreads', 'chatMessages', 'pushTokens',
        'permissionGrants', 'notifPrefs', 'integrations',
        'forecastSnapshots', 'aiCalls', 'integrationSecrets',
        'foodLogDiagnostics', 'cronRuns',
      ]),
    );
    expect(OWNED_TABLES).not.toContain('users');
    expect(OWNED_TABLES).not.toContain('mediaAssets');

    const t = testDb();
    const userId = await seedUser(t, 'cascade_user');
    const NOW = Date.now();

    await t.run(async (ctx) => {
      await ctx.db.insert('weighIns', {
        userId, measuredAt: NOW, weightKg: 80, source: 'manual',
      });
      await ctx.db.insert('plans', {
        userId, dailyKcal: 1800, proteinG: 120, carbG: 180, fatG: 60,
        recipes: [], shopping: [], generator: 'rules',
        activeFrom: NOW, activeTo: NOW + 86400_000, status: 'active',
      });
      await ctx.db.insert('chatThreads', { userId, title: 'x', lastMessageAt: NOW });
      await ctx.db.insert('aiCalls', {
        userId, task: 'vision', providerModel: 'x',
        inputTokens: 0, outputTokens: 0, ms: 1, ok: true,
      });
    });

    await t.mutation(internal.users.softDelete, { clerkUserId: 'cascade_user' });

    for (const table of ['weighIns', 'plans', 'chatThreads', 'aiCalls'] as const) {
      const rows = await t.run(async (ctx) =>
        await ctx.db
          .query(table)
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .collect(),
      );
      expect(rows, `table ${table} not cascaded`).toHaveLength(0);
    }
  });
});

describe('daily cron wrappers', () => {
  test('purgeAiCallsDaily skips when scope already claimed', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'cron_skip');
    await t.run(async (ctx) => {
      await ctx.db.insert('aiCalls', {
        userId, task: 'vision', providerModel: 'x',
        inputTokens: 0, outputTokens: 0, ms: 1, ok: true,
      });
    });
    const scope = new Date().toISOString().slice(0, 10);
    await t.run(async (ctx) => {
      await ctx.db.insert('cronRuns', {
        jobName: 'purgeAiCalls', scopeKey: scope, ranAt: Date.now(),
      });
    });

    const result = await t.mutation(internal.retention.purgeAiCallsDaily);
    expect(result).toMatchObject({ skipped: true });

    const rows = await t.run(async (ctx) => await ctx.db.query('aiCalls').collect());
    expect(rows).toHaveLength(1);
  });
});
