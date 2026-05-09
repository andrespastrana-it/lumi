'use node';
import { internalAction } from './_generated/server';
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

export const testPlanGen = internalAction({
  args: {},
  handler: async () => {
    const t0 = Date.now();
    const task = ai.task('plan-gen');
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
    try {
      const result = await task.generateObject({
        schema: ResultSchema,
        system:
          'You build personal weekly meal plans. Return 7 days × 3 meals (breakfast/lunch/dinner). Optionally add 1 snack/day. Respect dietary tags strictly. Recipes must be simple, real-world. Use metric ingredient quantities (g, ml, count).',
        prompt:
          'Daily target: 2200 kcal · 165g P / 220g C / 70g F.\nDietary tags: high-protein.\nMeal times: {"breakfast":"08:00","lunch":"13:00","dinner":"19:00"}.\nReturn a varied balanced 7-day plan.',
      });
      return {
        ok: true,
        modelId: task.modelId,
        ms: Date.now() - t0,
        usage: result.usage,
        recipeCount: result.object.recipes.length,
        sample: result.object.recipes.slice(0, 2),
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
