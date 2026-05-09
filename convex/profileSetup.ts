'use node';
import { v } from 'convex/values';
import { z } from 'zod';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import { dailyKcal, macros, weeksToTarget, type Sex, type Activity, type Goal } from './lib/nutrition';
import { appError } from './lib/errors';
import { checkAiRateLimit } from './lib/rateLimit';
import { ai } from './ai';

export const commit = action({
  args: {
    draft: v.object({
      goal: v.union(v.literal('lose'), v.literal('maintain'), v.literal('gain')),
      weightKg: v.number(),
      targetKg: v.number(),
      heightCm: v.number(),
      age: v.number(),
      sex: v.union(v.literal('male'), v.literal('female'), v.literal('unspecified')),
      activity: v.union(v.literal('sed'), v.literal('light'), v.literal('mod'), v.literal('active')),
      diet: v.array(v.string()),
      mealTimes: v.object({
        wake: v.string(),
        breakfast: v.string(),
        lunch: v.string(),
        dinner: v.string(),
        sleep: v.string(),
      }),
      tz: v.string(),
    }),
  },
  handler: async (ctx, { draft }): Promise<{ userId: string; dailyKcal: number; weeksToFinish: number }> => {
    // 0. Fail loudly if no identity — clearer than a generic Unauthenticated.
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) {
      throw appError('UNAUTHENTICATED', 'Sign in required', {
        detail:
          'Auth identity missing in action. JWT template "convex" likely not being sent. ' +
          'On web this is expected (out of scope). Test on iOS/Android.',
      });
    }

    // 1. Ensure user row (idempotent — covers webhook race).
    const userId: any = await ctx.runMutation(internal.users.ensureMeFromIdentity, {});
    await checkAiRateLimit(ctx, userId, 'plan-gen');

    // 2. Persist profile.
    await ctx.runMutation(internal.profile.create, {
      userId,
      goal: draft.goal,
      heightCm: draft.heightCm,
      startWeightKg: draft.weightKg,
      targetWeightKg: draft.targetKg,
      age: draft.age,
      sex: draft.sex,
      activity: draft.activity,
      diet: draft.diet,
      mealTimes: draft.mealTimes,
      coachTone: 'Warm',
      units: { mass: 'kg', height: 'cm', energy: 'kcal', volume: 'L', firstDay: 'Monday', lang: 'English' },
      privacy: { analytics: true, share: false, research: true },
      tz: draft.tz,
    });

    // 3. Seed default permissionGrants/notifPrefs/integrations.
    await ctx.runMutation(internal.onboarding.seedDefaults, { userId });

    // 4. Compute kcal targets deterministically.
    const dk = dailyKcal({
      weightKg: draft.weightKg,
      heightCm: draft.heightCm,
      age: draft.age,
      sex: draft.sex as Sex,
      activity: draft.activity as Activity,
      goal: draft.goal as Goal,
    });
    const m = macros(dk);

    // 5. LLM-pick recipes.
    const RecipeOut = z.object({
      day: z.number().int().min(0).max(6),
      slot: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
      name: z.string(),
      kcal: z.number(),
      proteinG: z.number(),
      carbG: z.number(),
      fatG: z.number(),
      ingredients: z.array(z.object({ name: z.string(), qty: z.string() })).min(1),
      method: z.array(z.string()).min(1),
    });
    const ResultSchema = z.object({ recipes: z.array(RecipeOut).min(14).max(28) });

    let recipes: z.infer<typeof RecipeOut>[];
    try {
      const result = await ai.task('plan-gen').generateObject({
        schema: ResultSchema,
        system: `You build personal weekly meal plans. Return 7 days × 3 meals (breakfast/lunch/dinner). Optionally add 1 snack/day. Respect dietary tags strictly. Recipes must be simple, real-world. Use metric ingredient quantities (g, ml, count).`,
        prompt: `Daily target: ${dk} kcal · ${m.proteinG}g P / ${m.carbG}g C / ${m.fatG}g F.\nDietary tags: ${draft.diet.join(', ') || 'none'}.\nMeal times: ${JSON.stringify(draft.mealTimes)}.\nReturn a varied balanced 7-day plan.`,
      });
      recipes = result.object.recipes;
    } catch (err) {
      console.error('plan-gen failed', err);
      // Minimal stub plan as fallback so user isn't blocked.
      recipes = Array.from({ length: 21 }, (_, i) => ({
        day: Math.floor(i / 3),
        slot: (['breakfast', 'lunch', 'dinner'] as const)[i % 3],
        name: 'Generated meal',
        kcal: Math.round(dk / 3),
        proteinG: Math.round(m.proteinG / 3),
        carbG: Math.round(m.carbG / 3),
        fatG: Math.round(m.fatG / 3),
        ingredients: [{ name: 'TBD', qty: '1 portion' }],
        method: ['Plan generation failed; placeholder used.'],
      }));
    }

    // 6. Persist plan.
    await ctx.runMutation(internal.plan.create, {
      userId,
      dailyKcal: dk,
      proteinG: m.proteinG,
      carbG: m.carbG,
      fatG: m.fatG,
      recipes: recipes.map((r, idx) => ({
        id: `${draft.tz}-${idx}-${r.day}-${r.slot}`,
        day: r.day,
        slot: r.slot,
        name: r.name,
        kcal: r.kcal,
        proteinG: r.proteinG,
        carbG: r.carbG,
        fatG: r.fatG,
        ingredients: r.ingredients.map((ing, i) => ({
          id: `${idx}-${i}`,
          name: ing.name,
          qty: ing.qty,
        })),
        method: r.method,
      })),
      generator: 'llm',
    });

    return {
      userId,
      dailyKcal: dk,
      weeksToFinish: weeksToTarget(draft.weightKg, draft.targetKg),
    };
  },
});
