'use node';
import { createHash } from 'node:crypto';
import { v } from 'convex/values';
import { z } from 'zod';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import {
  dailyKcal,
  macros,
  slotBudgets,
  slotSplitFor,
  weeksToTarget,
  type Sex,
  type Activity,
  type Goal,
  type Slot,
  type SlotBudget,
} from './lib/nutrition';
import { appError } from './lib/errors';
import { withAiTelemetry } from './lib/aiTelemetry';
import {
  buildCorrectionPrompt,
  computeDrift,
  type Drift,
  type DriftRecipe,
} from './lib/planValidation';
import { scaleRecipe } from './lib/recipeScaler';
import { validateDietBatch } from './lib/dietValidator';
import { ai } from './ai';

const SLOTS: Slot[] = ['breakfast', 'lunch', 'dinner'];

const RecipeOut = z.object({
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
type RecipeOut = z.infer<typeof RecipeOut>;

const ResultSchema = z
  .object({ recipes: z.array(RecipeOut).length(21) })
  .refine(
    (r) => new Set(r.recipes.map((x) => `${x.day}-${x.slot}`)).size === 21,
    { message: 'Each (day, slot) must appear exactly once' },
  );

function describeGoal(g: Goal): string {
  if (g === 'lose') return 'sustainable fat loss';
  if (g === 'gain') return 'lean muscle gain';
  return 'maintenance';
}

function describeActivity(a: Activity): string {
  if (a === 'sed') return 'sedentary (desk-bound)';
  if (a === 'light') return 'lightly active (some walking, 1-3 light sessions/week)';
  if (a === 'mod') return 'moderately active (3-5 training sessions/week)';
  return 'highly active (daily training or physical job)';
}

const SYSTEM_PROMPT = `You build personal weekly meal plans.

Hard rules:
- Output EXACTLY 21 recipes covering days 0-6, with slots breakfast, lunch, dinner for each day (3 per day).
- Every (day, slot) pair must appear exactly once.
- No 'snack' slot.
- Each recipe MUST stay within ±10% of its slot's kcal target.
- Respect dietary tags strictly — substitute, never violate.
- Use metric ingredient quantities (g, ml) or integer counts (e.g. "2 eggs").
- Recipes must be simple and real-world, not invented.

Dietary tag handling:
- 'vegetarian': no meat, poultry, fish, shellfish; dairy + eggs OK.
- 'pescatarian': no meat or poultry; fish + dairy + eggs OK.
- 'vegan': vegetarian + no dairy, eggs, honey, gelatin, whey.
- 'no-pork': no pork, bacon, ham, prosciutto, chorizo, pepperoni, lard.
- 'no-beef': no beef, veal.
- 'no-fish': no fish, shellfish.
- 'gluten-free': no wheat, barley, rye, bulgur, couscous, seitan; use tamari instead of soy sauce.
- 'dairy-free' / 'no-dairy' / 'lactose-free': no milk, cheese, yogurt, butter, cream, whey.
- 'no-nuts' / 'nut-free': no tree nuts.

Example recipe shape for ['vegetarian','no-nuts'], target ~550 kcal:
{
  "day": 0,
  "slot": "breakfast",
  "name": "Halloumi & Chickpea Bowl",
  "kcal": 540,
  "proteinG": 30,
  "carbG": 45,
  "fatG": 24,
  "ingredients": [
    {"name": "halloumi", "qty": "120g"},
    {"name": "chickpeas, cooked", "qty": "150g"},
    {"name": "cherry tomatoes", "qty": "100g"},
    {"name": "olive oil", "qty": "10ml"}
  ],
  "method": [
    "Pan-fry halloumi until golden, 2 min per side.",
    "Toss chickpeas with halved tomatoes and olive oil.",
    "Plate together and season."
  ]
}`;

function buildUserPrompt(args: {
  dk: number;
  m: { proteinG: number; carbG: number; fatG: number };
  perSlot: Record<Slot, SlotBudget>;
  draft: {
    goal: Goal;
    weightKg: number;
    heightCm: number;
    age: number;
    sex: Sex;
    activity: Activity;
    diet: string[];
    mealTimes: { wake: string; breakfast: string; lunch: string; dinner: string; sleep: string };
  };
}): string {
  const { dk, m, perSlot, draft } = args;
  const userContext =
    `Building a 7-day plan for a ${draft.age}-year-old ${draft.sex} user. ` +
    `Goal: ${describeGoal(draft.goal)}. ` +
    `Body: ${draft.weightKg}kg, ${draft.heightCm}cm, ${describeActivity(draft.activity)}. ` +
    `Dietary preferences: ${draft.diet.length ? draft.diet.join(', ') : 'none'}. ` +
    `Schedule: wakes ${draft.mealTimes.wake}, eats breakfast ${draft.mealTimes.breakfast}, ` +
    `lunch ${draft.mealTimes.lunch}, dinner ${draft.mealTimes.dinner}, sleeps ${draft.mealTimes.sleep}.`;

  const lines = [
    userContext,
    '',
    `Daily target: ${dk} kcal · ${m.proteinG}g P / ${m.carbG}g C / ${m.fatG}g F.`,
    '',
    'Per-slot targets (each recipe ±10%):',
    `- breakfast: ${perSlot.breakfast.kcal} kcal · ${perSlot.breakfast.proteinG}g P / ${perSlot.breakfast.carbG}g C / ${perSlot.breakfast.fatG}g F`,
    `- lunch: ${perSlot.lunch.kcal} kcal · ${perSlot.lunch.proteinG}g P / ${perSlot.lunch.carbG}g C / ${perSlot.lunch.fatG}g F`,
    `- dinner: ${perSlot.dinner.kcal} kcal · ${perSlot.dinner.proteinG}g P / ${perSlot.dinner.carbG}g C / ${perSlot.dinner.fatG}g F`,
    '',
    'Return exactly 21 recipes — days 0..6, each with breakfast + lunch + dinner.',
  ];
  return lines.join('\n');
}

function recipeIdFor(planSeed: string, day: number, slot: Slot): string {
  return createHash('sha1').update(`${planSeed}:${day}:${slot}`).digest('hex').slice(0, 12);
}

function ingredientIdFor(planSeed: string, day: number, slot: Slot, idx: number): string {
  return createHash('sha1')
    .update(`${planSeed}:${day}:${slot}:i${idx}`)
    .digest('hex')
    .slice(0, 12);
}

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
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) {
      throw appError('UNAUTHENTICATED', 'Sign in required', {
        detail:
          'Auth identity missing in action. JWT template "convex" likely not being sent. ' +
          'On web this is expected (out of scope). Test on iOS/Android.',
      });
    }

    const userId: any = await ctx.runMutation(internal.users.ensureMeFromIdentity, {});

    let dk: number;
    let m: ReturnType<typeof macros>;
    try {
      dk = dailyKcal({
        weightKg: draft.weightKg,
        heightCm: draft.heightCm,
        age: draft.age,
        sex: draft.sex as Sex,
        activity: draft.activity as Activity,
        goal: draft.goal as Goal,
      });
      m = macros(dk, draft.goal as Goal);
    } catch (err) {
      throw appError('INPUT_OUT_OF_RANGE', 'Body inputs outside safe range', {
        detail: String(err).slice(0, 200),
      });
    }

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

    await ctx.runMutation(internal.onboarding.seedDefaults, { userId });

    const split = slotSplitFor(draft.mealTimes);
    const perSlot = slotBudgets(dk, m, split);
    const prompt = buildUserPrompt({ dk, m, perSlot, draft: { ...draft, goal: draft.goal as Goal, sex: draft.sex as Sex, activity: draft.activity as Activity } });

    const planTask = ai.task('plan-gen');

    const runOnce = async (override?: string) =>
      withAiTelemetry(
        ctx,
        { userId, task: 'plan-gen', modelId: planTask.modelId },
        async () => {
          const result = await planTask.generateObject({
            schema: ResultSchema,
            system: SYSTEM_PROMPT,
            prompt: override ?? prompt,
          });
          return { value: result.object.recipes as RecipeOut[], usage: result.usage };
        },
      );

    let recipes: RecipeOut[];
    let drift: Drift;
    try {
      recipes = await runOnce();
      drift = computeDrift(recipes as DriftRecipe[], perSlot, dk);

      if (drift.needsRetry) {
        const correction = buildCorrectionPrompt(drift, perSlot) + '\n\n---\nOriginal request:\n' + prompt;
        try {
          const retry = await runOnce(correction);
          const retryDrift = computeDrift(retry as DriftRecipe[], perSlot, dk);
          if (retryDrift.slotErrors.length < drift.slotErrors.length) {
            recipes = retry;
            drift = retryDrift;
          }
        } catch (retryErr) {
          console.warn('plan-gen retry failed, keeping first result', retryErr);
        }
      }
    } catch (err) {
      console.error('plan-gen failed', err);
      throw appError('AI_FAILED', 'Plan generation failed, please retry', {
        detail: String(err).slice(0, 200),
      });
    }

    const planSeed = `${userId}:${Date.now()}`;
    const bySlot = new Map<string, RecipeOut>();
    for (const r of recipes) bySlot.set(`${r.day}-${r.slot}`, r);

    const persisted: Array<{
      id: string;
      day: number;
      slot: Slot;
      name: string;
      kcal: number;
      proteinG: number;
      carbG: number;
      fatG: number;
      ingredients: { id: string; name: string; qty: string }[];
      method: string[];
    }> = [];

    for (const day of [0, 1, 2, 3, 4, 5, 6]) {
      for (const slot of SLOTS) {
        const raw = bySlot.get(`${day}-${slot}`);
        if (!raw) continue;
        const scaled = scaleRecipe(
          {
            kcal: raw.kcal,
            proteinG: raw.proteinG,
            carbG: raw.carbG,
            fatG: raw.fatG,
            ingredients: raw.ingredients,
            name: raw.name,
            method: raw.method,
          },
          perSlot[slot].kcal,
        );
        const final = scaled.recipe;
        persisted.push({
          id: recipeIdFor(planSeed, day, slot),
          day,
          slot,
          name: final.name,
          kcal: final.kcal,
          proteinG: final.proteinG,
          carbG: final.carbG,
          fatG: final.fatG,
          ingredients: final.ingredients.map((ing: { name: string; qty: string }, idx: number) => ({
            id: ingredientIdFor(planSeed, day, slot, idx),
            name: ing.name,
            qty: ing.qty,
          })),
          method: final.method,
        });
      }
    }

    const dietViolations = validateDietBatch(
      persisted.map((r) => ({ name: r.name, ingredients: r.ingredients })),
      draft.diet,
    );
    if (dietViolations.length > 0) {
      console.warn(
        `plan-gen diet violations (${dietViolations.length}): ${JSON.stringify(
          dietViolations.slice(0, 3),
        )}`,
      );
    }

    await ctx.runMutation(internal.plan.create, {
      userId,
      dailyKcal: dk,
      proteinG: m.proteinG,
      carbG: m.carbG,
      fatG: m.fatG,
      recipes: persisted,
      generator: 'llm',
    });

    return {
      userId,
      dailyKcal: dk,
      weeksToFinish: weeksToTarget(draft.weightKg, draft.targetKg),
    };
  },
});
