import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';
import { api, internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import schema from './schema';
import { modules } from './test.setup';

function testDb() {
  return convexTest(schema, modules);
}

function asUser(t: ReturnType<typeof testDb>, subject: string, email = `${subject}@example.com`) {
  return t.withIdentity({ subject, email });
}

async function seedUser(
  t: ReturnType<typeof testDb>,
  subject: string,
  email = `${subject}@example.com`,
) {
  return await t.mutation(internal.users.upsert, { clerkUserId: subject, email });
}

async function seedProfile(t: ReturnType<typeof testDb>, userId: Id<'users'>, activePlanId?: Id<'plans'>) {
  await t.run(async (ctx) => {
    await ctx.db.insert('profiles', {
      userId,
      goal: 'lose',
      heightCm: 175,
      startWeightKg: 90,
      targetWeightKg: 80,
      age: 35,
      sex: 'unspecified',
      activity: 'mod',
      diet: [],
      mealTimes: {
        wake: '07:00',
        breakfast: '08:00',
        lunch: '12:30',
        dinner: '19:00',
        sleep: '23:00',
      },
      coachTone: 'Warm',
      units: {
        mass: 'kg',
        height: 'cm',
        energy: 'kcal',
        volume: 'L',
        firstDay: 'Monday',
        lang: 'English',
      },
      privacy: { analytics: true, share: false, research: false },
      tz: 'UTC',
      ...(activePlanId ? { activePlanId } : {}),
    });
  });
}

async function seedPlan(
  t: ReturnType<typeof testDb>,
  userId: Id<'users'>,
  activeFrom: number,
  name: string,
) {
  return await t.run(async (ctx) => {
    return await ctx.db.insert('plans', {
      userId,
      dailyKcal: name === 'current' ? 1800 : 2600,
      proteinG: 120,
      carbG: 180,
      fatG: 60,
      recipes: [],
      shopping: [],
      generator: 'rules',
      activeFrom,
      activeTo: activeFrom + 7 * 86400 * 1000,
    });
  });
}

describe('database model contracts', () => {
  test('me.get never exposes legacy integration tokens', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'user_tokens');
    await seedProfile(t, userId);
    await t.run(async (ctx) => {
      await ctx.db.insert('integrations', {
        userId,
        appleHealth: true,
        googleFit: false,
        fitbit: false,
        withings: false,
        strava: false,
        glovo: false,
        tokens: { fitbit: 'secret-token' },
      });
      await ctx.db.insert('permissionGrants', {
        userId,
        notif: true,
        health: false,
        cam: true,
        mic: false,
      });
      await ctx.db.insert('notifPrefs', {
        userId,
        summary: true,
        mealNudge: true,
        weighIn: true,
        wins: true,
        plateauAlert: false,
        weekly: true,
        quiet: true,
      });
    });

    const me = await asUser(t, 'user_tokens').query(api.me.get);

    expect(JSON.stringify(me)).not.toContain('secret-token');
    expect(me?.integrations).not.toHaveProperty('tokens');
    expect(me?.profile).not.toHaveProperty('userId');
    expect(me?.permissionGrants).not.toHaveProperty('userId');
    expect(me?.notifPrefs).not.toHaveProperty('userId');
  });

  test('log queries return DTOs without private diagnostic or media fields', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'user_logs');
    await t.run(async (ctx) => {
      await ctx.db.insert('foodLogs', {
        userId,
        consumedAt: Date.UTC(2026, 0, 2, 12),
        source: 'photo',
        name: 'Bowl',
        kcal: 450,
        proteinG: 25,
        carbG: 55,
        fatG: 12,
        rawAi: { transcript: 'private raw payload' },
        confidence: 0.8,
        status: 'confirmed',
      });
    });

    const rows = await asUser(t, 'user_logs').query(api.logs.byDate, { date: '2026-01-02' });

    expect(rows).toHaveLength(1);
    expect(JSON.stringify(rows)).not.toContain('private raw payload');
    expect(rows[0]).not.toHaveProperty('rawAi');
    expect(rows[0]).not.toHaveProperty('photoAssetId');
    expect(rows[0]).not.toHaveProperty('audioAssetId');
    expect(rows[0]).not.toHaveProperty('userId');
  });

  test('active plan follows profile.activePlanId instead of latest plan by date', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'user_plans');
    const currentPlanId = await seedPlan(t, userId, Date.UTC(2026, 0, 1), 'current');
    await seedPlan(t, userId, Date.UTC(2030, 0, 1), 'future');
    await seedProfile(t, userId, currentPlanId);

    const plan = await asUser(t, 'user_plans').query(api.plan.active);

    expect(plan?._id).toEqual(currentPlanId);
    expect(plan?.dailyKcal).toBe(1800);
    expect(plan).not.toHaveProperty('userId');
  });

  test('deleted user is not revived by ensureMe or late Clerk upsert', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'user_deleted');
    await t.mutation(internal.users.softDelete, { clerkUserId: 'user_deleted' });

    await expect(asUser(t, 'user_deleted').mutation(api.users.ensureMe)).rejects.toThrow(
      /deleted/i,
    );
    await t.mutation(internal.users.upsert, {
      clerkUserId: 'user_deleted',
      email: 'late-update@example.com',
    });

    const user = await t.run(async (ctx) => await ctx.db.get(userId));
    expect(user?.deletedAt).toBeTypeOf('number');
  });

  test('errors expose a structured code on .data', async () => {
    const t = testDb();
    await expect(t.mutation(api.users.ensureMe)).rejects.toMatchObject({
      data: { code: 'UNAUTHENTICATED' },
    });
  });

  test('logs.draftSearchPick inserts a draft with source=search and respects bounds', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'search_pick_user');

    const logId = await asUser(t, 'search_pick_user').mutation(api.logs.draftSearchPick, {
      name: 'Greek yogurt',
      kcal: 150,
      proteinG: 18,
      carbG: 10,
      fatG: 4,
      servingSizeG: 200,
      confidence: 0.7,
    });

    const log = await t.run(async (ctx) => await ctx.db.get(logId));
    expect(log).toMatchObject({
      userId,
      name: 'Greek yogurt',
      kcal: 150,
      proteinG: 18,
      source: 'search',
      status: 'draft',
      confidence: 0.7,
      servingSizeG: 200,
    });

    await expect(
      asUser(t, 'search_pick_user').mutation(api.logs.draftSearchPick, {
        name: 'absurd',
        kcal: 99999,
        proteinG: 0,
        carbG: 0,
        fatG: 0,
      }),
    ).rejects.toMatchObject({ data: { code: 'INVALID_ARGUMENT', field: 'kcal' } });
  });

  test('weighIns.create rejects out-of-range body weights', async () => {
    const t = testDb();
    await seedUser(t, 'bounds_user');
    await expect(
      asUser(t, 'bounds_user').mutation(api.weighIns.create, { weightKg: 9999 }),
    ).rejects.toMatchObject({ data: { code: 'INVALID_ARGUMENT', field: 'weightKg' } });

    const rows = await t.run(async (ctx) => await ctx.db.query('weighIns').collect());
    expect(rows).toHaveLength(0);
  });

  test('findDraftByAsset returns existing draft so retried photo logs are idempotent', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'idem_user');
    const intruderId = await seedUser(t, 'idem_intruder');
    const { assetId, draftId } = await t.run(async (ctx) => {
      const storageId = await ctx.storage.store(new Blob(['x'], { type: 'image/jpeg' }));
      const assetId = await ctx.db.insert('mediaAssets', {
        userId,
        storageId,
        kind: 'photo',
        mime: 'image/jpeg',
        bytes: 1,
      });
      const draftId = await ctx.db.insert('foodLogs', {
        userId,
        consumedAt: Date.now(),
        source: 'photo',
        name: 'Existing draft',
        kcal: 400,
        proteinG: 20,
        carbG: 50,
        fatG: 12,
        photoAssetId: assetId,
        status: 'draft',
      });
      return { assetId, draftId };
    });

    const found = await t.query(internal.logs.findDraftByAsset, {
      userId,
      assetId,
      kind: 'photo',
    });
    expect(found).toEqual(draftId);

    const intruderFound = await t.query(internal.logs.findDraftByAsset, {
      userId: intruderId,
      assetId,
      kind: 'photo',
    });
    expect(intruderFound).toBeNull();

    await t.run(async (ctx) => {
      await ctx.db.patch(draftId, { status: 'confirmed' });
    });
    const afterConfirm = await t.query(internal.logs.findDraftByAsset, {
      userId,
      assetId,
      kind: 'photo',
    });
    expect(afterConfirm).toBeNull();
  });

  test('aiCalls.countSince scopes by user, task, and time window', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'rl_user');
    const otherUserId = await seedUser(t, 'rl_other');
    await t.run(async (ctx) => {
      await ctx.db.insert('aiCalls', {
        userId, task: 'vision', providerModel: 'x', inputTokens: 0, outputTokens: 0, ms: 1, ok: true,
      });
      await ctx.db.insert('aiCalls', {
        userId, task: 'vision', providerModel: 'x', inputTokens: 0, outputTokens: 0, ms: 1, ok: true,
      });
      await ctx.db.insert('aiCalls', {
        userId, task: 'coach', providerModel: 'x', inputTokens: 0, outputTokens: 0, ms: 1, ok: true,
      });
      await ctx.db.insert('aiCalls', {
        userId: otherUserId, task: 'vision', providerModel: 'x', inputTokens: 0, outputTokens: 0, ms: 1, ok: true,
      });
    });

    const visionRecent = await t.query(internal.aiCalls.countSince, {
      userId,
      task: 'vision',
      since: Date.now() - 60_000,
    });
    expect(visionRecent).toBe(2);

    const visionStale = await t.query(internal.aiCalls.countSince, {
      userId,
      task: 'vision',
      since: Date.now() + 60_000,
    });
    expect(visionStale).toBe(0);

    const coachCount = await t.query(internal.aiCalls.countSince, {
      userId,
      task: 'coach',
      since: Date.now() - 60_000,
    });
    expect(coachCount).toBe(1);
  });

  test('upload claim binds a storage object to one user and rejects reuse by others', async () => {
    const t = testDb();
    await seedUser(t, 'user_asset_a');
    await seedUser(t, 'user_asset_b');
    const storageId = await t.run(async (ctx) => {
      return await ctx.storage.store(new Blob(['image-bytes'], { type: 'image/jpeg' }));
    });

    const claimed = await asUser(t, 'user_asset_a').mutation(api.upload.claim, {
      storageId,
      kind: 'photo',
      mime: 'image/jpeg',
      bytes: 11,
    });

    expect(claimed.assetId).toBeTruthy();
    await expect(
      asUser(t, 'user_asset_b').mutation(api.upload.claim, {
        storageId,
        kind: 'photo',
        mime: 'image/jpeg',
        bytes: 11,
      }),
    ).rejects.toThrow(/already claimed/i);
  });

  test('upload claim rejects invalid metadata before binding asset', async () => {
    const t = testDb();
    await seedUser(t, 'user_bad_asset');
    const storageId = await t.run(async (ctx) => {
      return await ctx.storage.store(new Blob(['audio-bytes'], { type: 'audio/mpeg' }));
    });

    await expect(
      asUser(t, 'user_bad_asset').mutation(api.upload.claim, {
        storageId,
        kind: 'photo',
        mime: 'audio/mpeg',
        bytes: 11,
      }),
    ).rejects.toThrow(/mime/i);

    const assets = await t.run(async (ctx) => await ctx.db.query('mediaAssets').collect());
    expect(assets).toHaveLength(0);
  });

  test('push token registration cannot reassign another user token', async () => {
    const t = testDb();
    await seedUser(t, 'push_owner');
    await seedUser(t, 'push_attacker');
    await asUser(t, 'push_owner').mutation(api.pushTokens.register, {
      expoPushToken: 'ExponentPushToken[shared]',
      platform: 'ios',
    });

    await expect(
      asUser(t, 'push_attacker').mutation(api.pushTokens.register, {
        expoPushToken: 'ExponentPushToken[shared]',
        platform: 'android',
      }),
    ).rejects.toThrow(/token/i);
  });

  test('logging a plan recipe creates a confirmed log with durable recipe refs', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'user_recipe');
    await seedProfile(t, userId);
    const planId = await seedPlan(t, userId, Date.UTC(2026, 0, 1), 'current');
    const recipeId = await t.run(async (ctx) => {
      return await ctx.db.insert('planRecipes', {
        userId,
        planId,
        legacyRecipeId: 'legacy-1',
        day: 0,
        slot: 'lunch',
        name: 'Chicken bowl',
        kcal: 520,
        proteinG: 38,
        carbG: 48,
        fatG: 18,
        ingredients: [{ id: 'ing-1', name: 'Chicken', qty: '180g' }],
        method: ['Cook and plate.'],
      });
    });

    const result = await asUser(t, 'user_recipe').mutation(api.logs.logRecipe, {
      planRecipeId: recipeId,
      consumedAt: Date.UTC(2026, 0, 2, 13),
    });
    const log = await t.run(async (ctx) => await ctx.db.get(result.logId));
    const recipe = await t.run(async (ctx) => await ctx.db.get(recipeId));

    expect(log).toMatchObject({
      status: 'confirmed',
      source: 'manual',
      name: 'Chicken bowl',
      kcal: 520,
      fromPlanId: planId,
      fromPlanRecipeId: recipeId,
    });
    expect(recipe?.doneAt).toBeTypeOf('number');
  });

  test('profile.patch rejects activePlanId owned by another user', async () => {
    const t = testDb();
    const ownerId = await seedUser(t, 'plan_owner');
    const attackerId = await seedUser(t, 'plan_attacker');
    const ownerPlanId = await seedPlan(t, ownerId, Date.UTC(2026, 0, 1), 'current');
    await seedProfile(t, attackerId);

    await expect(
      asUser(t, 'plan_attacker').mutation(api.profile.patch, {
        partial: { activePlanId: ownerPlanId },
      }),
    ).rejects.toThrow(/plan/i);

    const attackerProfile = await t.run(async (ctx) =>
      await ctx.db
        .query('profiles')
        .withIndex('by_user', (q) => q.eq('userId', attackerId))
        .unique(),
    );
    expect(attackerProfile?.activePlanId).toBeUndefined();
  });

  test('legacy plan recipe mutations reject unknown recipe ids', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'legacy_recipe_user');
    const planId = await t.run(async (ctx) => {
      return await ctx.db.insert('plans', {
        userId,
        dailyKcal: 1800,
        proteinG: 120,
        carbG: 180,
        fatG: 60,
        recipes: [
          {
            id: 'known-recipe',
            day: 0,
            slot: 'lunch',
            name: 'Known recipe',
            kcal: 500,
            proteinG: 35,
            carbG: 45,
            fatG: 15,
            ingredients: [{ id: 'ing-1', name: 'Rice', qty: '100g' }],
            method: ['Cook.'],
          },
        ],
        shopping: [],
        generator: 'rules',
        activeFrom: Date.UTC(2026, 0, 1),
        activeTo: Date.UTC(2026, 0, 8),
        status: 'active',
      });
    });
    await seedProfile(t, userId, planId);

    await expect(
      asUser(t, 'legacy_recipe_user').mutation(api.plan.markRecipeDone, {
        recipeId: 'missing-recipe',
      }),
    ).rejects.toThrow(/recipe/i);
    await expect(
      asUser(t, 'legacy_recipe_user').mutation(api.plan.toggleRecipeFavorite, {
        recipeId: 'missing-recipe',
      }),
    ).rejects.toThrow(/recipe/i);
  });

  test('logs.confirm only confirms owned draft logs', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'confirm_user');
    const confirmedId = await t.run(async (ctx) => {
      return await ctx.db.insert('foodLogs', {
        userId,
        consumedAt: Date.UTC(2026, 0, 2, 12),
        source: 'manual',
        name: 'Already confirmed',
        kcal: 200,
        proteinG: 10,
        carbG: 20,
        fatG: 5,
        status: 'confirmed',
      });
    });

    await expect(
      asUser(t, 'confirm_user').mutation(api.logs.confirm, { id: confirmedId }),
    ).rejects.toThrow(/draft/i);
  });

  test('logs.draftById only returns draft logs', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'draft_user');
    const confirmedId = await t.run(async (ctx) => {
      return await ctx.db.insert('foodLogs', {
        userId,
        consumedAt: Date.UTC(2026, 0, 2, 12),
        source: 'manual',
        name: 'Already confirmed',
        kcal: 200,
        proteinG: 10,
        carbG: 20,
        fatG: 5,
        status: 'confirmed',
      });
    });

    const draft = await asUser(t, 'draft_user').query(api.logs.draftById, {
      id: confirmedId,
    });

    expect(draft).toBeNull();
  });

  test('read APIs return DTOs without owner or internal fields', async () => {
    const t = testDb();
    const userId = await seedUser(t, 'dto_user');
    const threadId = await t.mutation(internal.chat.createThread, {
      userId,
      title: 'Coach',
    });
    await t.mutation(internal.chat.appendMessage, {
      threadId,
      role: 'assistant',
      content: 'Hello',
      toolCalls: { secret: 'internal-tool-payload' },
    });
    await t.run(async (ctx) => {
      await ctx.db.insert('weighIns', {
        userId,
        measuredAt: Date.UTC(2026, 0, 3),
        weightKg: 88,
        source: 'manual',
      });
      await ctx.db.insert('forecastSnapshots', {
        userId,
        range: '7d',
        generatedAt: Date.UTC(2026, 0, 3),
        payload: { trend: 'down' },
      });
    });

    const weighIns = await asUser(t, 'dto_user').query(api.weighIns.recent, {});
    const forecast = await asUser(t, 'dto_user').query(api.forecast.get, { range: '7d' });
    const messages = await asUser(t, 'dto_user').query(api.chat.messages, { threadId });

    expect(weighIns[0]).not.toHaveProperty('userId');
    expect(forecast).not.toHaveProperty('userId');
    expect(messages[0]).not.toHaveProperty('userId');
    expect(messages[0]).not.toHaveProperty('toolCalls');
    expect(JSON.stringify(messages)).not.toContain('internal-tool-payload');
  });
});
