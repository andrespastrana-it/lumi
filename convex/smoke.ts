'use node';
import { v } from 'convex/values';
import { internalAction } from './_generated/server';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { z } from 'zod';
import { ai } from './ai';

// Smoke tests for the AI router. Mirror the call shape of real frontend flows
// in logsActions.ts (vision, coach) and profileSetup.ts (plan-gen). Run via:
//   npx convex dev --once
//   npx convex run smoke:testCoach
//   npx convex run smoke:testVision
//   npx convex run smoke:testPlanGen

const FoodEstimate = z.object({
  name: z.string(),
  kcal: z.number(),
  proteinG: z.number(),
  carbG: z.number(),
  fatG: z.number(),
  servingSizeG: z.number().optional(),
  confidence: z.number().min(0).max(1),
});

function describeError(err: any) {
  return {
    error: String(err?.message ?? err).slice(0, 800),
    name: err?.name,
    statusCode: err?.statusCode,
    responseBody: err?.responseBody?.toString?.().slice(0, 800),
    url: err?.url,
    text: typeof err?.text === 'string' ? err.text.slice(0, 1500) : undefined,
    cause: err?.cause ? String(err.cause).slice(0, 400) : undefined,
    finishReason: err?.finishReason,
    usage: err?.usage,
    issues: err?.issues
      ? JSON.stringify(err.issues).slice(0, 1500)
      : undefined,
  };
}

export const testCoach = internalAction({
  args: {},
  handler: async () => {
    const t0 = Date.now();
    const task = ai.task('coach');
    try {
      const result = await task.generateObject({
        schema: FoodEstimate,
        system:
          'You parse a spoken meal description into kcal/macros. Use real-world averages. Confidence 0-1.',
        prompt:
          'User said: "I had a grilled chicken wrap with avocado and a side salad". Estimate kcal and macros.',
      });
      return {
        ok: true,
        modelId: task.modelId,
        ms: Date.now() - t0,
        usage: result.usage,
        object: result.object,
      };
    } catch (err: any) {
      return {
        ok: false,
        modelId: task.modelId,
        ms: Date.now() - t0,
        ...describeError(err),
      };
    }
  },
});

export const testVision = internalAction({
  args: {},
  handler: async () => {
    const t0 = Date.now();
    const task = ai.task('vision');
    const url =
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640&q=80';
    try {
      const result = await task.generateObject({
        schema: FoodEstimate,
        system:
          'You estimate kcal + macros from a meal photo. Return one JSON object. Confidence 0-1 reflects certainty. If multiple items visible, sum them and use a descriptive composite name.',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Estimate kcal and macros for this meal.' },
              { type: 'image', image: new URL(url) },
            ],
          },
        ],
      });
      return {
        ok: true,
        modelId: task.modelId,
        ms: Date.now() - t0,
        usage: result.usage,
        object: result.object,
      };
    } catch (err: any) {
      return {
        ok: false,
        modelId: task.modelId,
        ms: Date.now() - t0,
        ...describeError(err),
      };
    }
  },
});

const PlanRecipeOut = z.object({
  day: z.number().int().min(0).max(6),
  slot: z.enum(['breakfast', 'lunch', 'dinner']),
  name: z.string().min(3).max(120),
  kcal: z.number().int().min(150).max(1500),
  proteinG: z.number().min(0).max(150),
  carbG: z.number().min(0).max(200),
  fatG: z.number().min(0).max(100),
  ingredients: z
    .array(z.object({ name: z.string().min(1), qty: z.string().min(1) }))
    .min(1)
    .max(20),
  method: z.array(z.string().min(3)).min(1).max(15),
});
const PlanResultSchema = z
  .object({ recipes: z.array(PlanRecipeOut).length(21) })
  .refine(
    (r) => new Set(r.recipes.map((x) => `${x.day}-${x.slot}`)).size === 21,
    { message: 'Each (day, slot) must appear exactly once' },
  );

async function runPlanGenOnce() {
  const t0 = Date.now();
  const task = ai.task('plan-gen');
  try {
    const result = await task.generateObject({
      schema: PlanResultSchema,
      system:
        'You build personal weekly meal plans. You MUST output exactly 21 recipes covering days 0,1,2,3,4,5,6 with slots breakfast, lunch, dinner for each day (3 recipes per day). Do not stop until all 21 recipes are emitted. Respect dietary tags strictly. Recipes must be simple, real-world. Use metric ingredient quantities (g, ml, count).',
      prompt:
        'Daily target: 2200 kcal · 165g P / 220g C / 70g F.\nDietary tags: high-protein.\nMeal times: {"breakfast":"08:00","lunch":"13:00","dinner":"19:00"}.\nReturn the full 7-day plan now (21 recipes total, days 0-6, each with breakfast+lunch+dinner).',
    });
    return {
      ok: true as const,
      modelId: task.modelId,
      ms: Date.now() - t0,
      usage: result.usage,
      recipeCount: result.object.recipes.length,
      sample: result.object.recipes.slice(0, 2),
    };
  } catch (err: any) {
    return {
      ok: false as const,
      modelId: task.modelId,
      ms: Date.now() - t0,
      ...describeError(err),
    };
  }
}

export const testPlanGen = internalAction({
  args: {},
  handler: async () => runPlanGenOnce(),
});

// Dev-only: list active users with their Clerk IDs so you can pick one to seed.
//   npx convex run smoke:listUsers
export const listUsers = internalAction({
  args: {},
  handler: async (
    ctx,
  ): Promise<{ _id: Id<'users'>; clerkUserId: string; email: string }[]> => {
    return await ctx.runQuery(internal.users.listAllWithClerk, {});
  },
});

// Seed a signed-in dev user with profile + 2 weigh-ins, then run the forecast
// producer for them. Exercises the AI narrative path end-to-end. Run via:
//   npx convex run smoke:seedForForecast '{"clerkUserId":"user_XXXX"}'
export const seedForForecast = internalAction({
  args: {
    clerkUserId: v.string(),
    startKg: v.optional(v.number()),
    endKg: v.optional(v.number()),
    daysApart: v.optional(v.number()),
    targetKg: v.optional(v.number()),
    heightCm: v.optional(v.number()),
    age: v.optional(v.number()),
    goal: v.optional(
      v.union(v.literal('lose'), v.literal('maintain'), v.literal('gain')),
    ),
  },
  handler: async (
    ctx,
    args,
  ): Promise<
    | { ok: false; reason: 'user_not_found' | 'user_deleted' }
    | {
        ok: true;
        userId: Id<'users'>;
        seededWeighIns: number;
        existingWeighIns: number;
        result:
          | { ok: true; snapshotId: Id<'forecastSnapshots'> }
          | { skipped: 'no_profile' | 'insufficient_data' };
      }
  > => {
    const user = await ctx.runQuery(internal.users.getByClerkId, {
      clerkUserId: args.clerkUserId,
    });
    if (!user) return { ok: false, reason: 'user_not_found' };
    if (user.deletedAt !== undefined) {
      return { ok: false, reason: 'user_deleted' };
    }

    const startKg = args.startKg ?? 82.0;
    const endKg = args.endKg ?? 80.6;
    const targetKg = args.targetKg ?? 75.0;
    const daysApart = args.daysApart ?? 14;

    await ctx.runMutation(internal.profile.create, {
      userId: user._id,
      goal: args.goal ?? 'lose',
      heightCm: args.heightCm ?? 178,
      startWeightKg: startKg,
      targetWeightKg: targetKg,
      age: args.age ?? 32,
      activity: 'mod',
      diet: [],
      mealTimes: {
        wake: '07:00',
        breakfast: '08:00',
        lunch: '13:00',
        dinner: '19:00',
        sleep: '23:00',
      },
      coachTone: 'Warm',
      units: {
        mass: 'kg',
        height: 'cm',
        energy: 'kcal',
        volume: 'ml',
        firstDay: 'mon',
        lang: 'en',
      },
      privacy: { analytics: true, share: false, research: false },
      tz: 'Europe/Madrid',
    });

    const existingCount = await ctx.runQuery(internal.weighIns.countForUser, {
      userId: user._id,
    });
    let seededWeighIns = 0;
    if (existingCount < 2) {
      const now = Date.now();
      const earlier = now - daysApart * 24 * 60 * 60 * 1000;
      await ctx.runMutation(internal.weighIns.createForUser, {
        userId: user._id,
        weightKg: startKg,
        measuredAt: earlier,
      });
      await ctx.runMutation(internal.weighIns.createForUser, {
        userId: user._id,
        weightKg: endKg,
        measuredAt: now,
      });
      seededWeighIns = 2;
    }

    const result = await ctx.runAction(
      internal.forecastActions.generateForUser,
      { userId: user._id },
    );

    return {
      ok: true,
      userId: user._id,
      seededWeighIns,
      existingWeighIns: existingCount,
      result,
    };
  },
});

export const testPlanGenRepeat = internalAction({
  args: { n: v.optional(v.number()) },
  handler: async (_ctx, { n }) => {
    const count = Math.max(1, Math.min(10, n ?? 5));
    const runs = [] as Awaited<ReturnType<typeof runPlanGenOnce>>[];
    for (let i = 0; i < count; i++) {
      runs.push(await runPlanGenOnce());
    }
    const pass = runs.filter((r) => r.ok).length;
    return {
      pass,
      fail: runs.length - pass,
      avgMs: Math.round(runs.reduce((a, r) => a + r.ms, 0) / runs.length),
      runs: runs.map((r) => ({ ok: r.ok, ms: r.ms, modelId: r.modelId })),
    };
  },
});
