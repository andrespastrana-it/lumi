import { v } from 'convex/values';
import { query, mutation, internalMutation } from './_generated/server';
import { getUserOrNull, requireUser } from './lib/auth';
import { appError } from './lib/errors';
import { getActivePlan, toActivePlanDto } from './lib/plans';

const recipeShape = v.object({
  id: v.string(),
  day: v.number(),
  slot: v.union(
    v.literal('breakfast'),
    v.literal('lunch'),
    v.literal('dinner'),
    v.literal('snack'),
  ),
  name: v.string(),
  kcal: v.number(),
  proteinG: v.number(),
  carbG: v.number(),
  fatG: v.number(),
  ingredients: v.array(
    v.object({ id: v.string(), name: v.string(), qty: v.string() }),
  ),
  method: v.array(v.string()),
  heroTone: v.optional(v.string()),
  isFavorite: v.optional(v.boolean()),
  doneAt: v.optional(v.number()),
});

export const active = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUserOrNull(ctx);
    if (!user) return null;
    return await toActivePlanDto(ctx, await getActivePlan(ctx, user._id));
  },
});

async function getActivePlanRow(ctx: any, userId: any) {
  return await getActivePlan(ctx, userId);
}

export const markRecipeDone = mutation({
  args: {
    planRecipeId: v.optional(v.id('planRecipes')),
    recipeId: v.optional(v.string()),
    doneAt: v.optional(v.number()),
  },
  handler: async (ctx, { planRecipeId, recipeId, doneAt }) => {
    const user = await requireUser(ctx);
    if (planRecipeId) {
      const recipe = await ctx.db.get(planRecipeId);
      if (!recipe || recipe.userId !== user._id) throw appError('NOT_FOUND', 'Recipe not found');
      await ctx.db.patch(recipe._id, { doneAt: doneAt ?? Date.now() });
      return;
    }
    if (!recipeId) throw appError('NOT_FOUND', 'Recipe not found');
    const plan = await getActivePlanRow(ctx, user._id);
    if (!plan) throw appError('NO_ACTIVE_PLAN', 'No active plan');
    if (!plan.recipes.some((r: any) => r.id === recipeId)) {
      throw appError('NOT_FOUND', 'Recipe not found');
    }
    const recipes = plan.recipes.map((r: any) =>
      r.id === recipeId ? { ...r, doneAt: doneAt ?? Date.now() } : r,
    );
    await ctx.db.patch(plan._id, { recipes });
  },
});

export const toggleRecipeFavorite = mutation({
  args: {
    planRecipeId: v.optional(v.id('planRecipes')),
    recipeId: v.optional(v.string()),
  },
  handler: async (ctx, { planRecipeId, recipeId }) => {
    const user = await requireUser(ctx);
    if (planRecipeId) {
      const recipe = await ctx.db.get(planRecipeId);
      if (!recipe || recipe.userId !== user._id) throw appError('NOT_FOUND', 'Recipe not found');
      await ctx.db.patch(recipe._id, { isFavorite: !recipe.isFavorite });
      return;
    }
    if (!recipeId) throw appError('NOT_FOUND', 'Recipe not found');
    const plan = await getActivePlanRow(ctx, user._id);
    if (!plan) throw appError('NO_ACTIVE_PLAN', 'No active plan');
    if (!plan.recipes.some((r: any) => r.id === recipeId)) {
      throw appError('NOT_FOUND', 'Recipe not found');
    }
    const recipes = plan.recipes.map((r: any) =>
      r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r,
    );
    await ctx.db.patch(plan._id, { recipes });
  },
});

export const addToShopping = mutation({
  args: {
    planRecipeId: v.optional(v.id('planRecipes')),
    recipeId: v.optional(v.string()),
  },
  handler: async (ctx, { planRecipeId, recipeId }) => {
    const user = await requireUser(ctx);
    const plan = await getActivePlanRow(ctx, user._id);
    if (!plan) throw appError('NO_ACTIVE_PLAN', 'No active plan');
    let recipe: any;
    let shoppingRecipeId: string | undefined = recipeId;
    if (planRecipeId) {
      const row = await ctx.db.get(planRecipeId);
      if (!row || row.userId !== user._id || row.planId !== plan._id) {
        throw appError('NOT_FOUND', 'Recipe not found');
      }
      recipe = row;
      shoppingRecipeId = row._id;
    } else if (recipeId) {
      recipe = plan.recipes.find((r: any) => r.id === recipeId);
    }
    if (!recipe || !shoppingRecipeId) throw appError('NOT_FOUND', 'Recipe not found');

    const shopping = [...plan.shopping];
    for (const ing of recipe.ingredients) {
      const existing = shopping.find((s) => s.name.toLowerCase() === ing.name.toLowerCase());
      if (existing) {
        if (!existing.recipeIds.includes(shoppingRecipeId)) {
          existing.recipeIds = [...existing.recipeIds, shoppingRecipeId];
          existing.qty = `${existing.qty} + ${ing.qty}`;
        }
      } else {
        shopping.push({
          id: `${shoppingRecipeId}-${ing.id}`,
          name: ing.name,
          qty: ing.qty,
          recipeIds: [shoppingRecipeId],
          checked: false,
        });
      }
    }
    await ctx.db.patch(plan._id, { shopping });
  },
});

export const toggleShoppingItem = mutation({
  args: { itemId: v.string() },
  handler: async (ctx, { itemId }) => {
    const user = await requireUser(ctx);
    const plan = await getActivePlanRow(ctx, user._id);
    if (!plan) throw appError('NO_ACTIVE_PLAN', 'No active plan');
    const shopping = plan.shopping.map((s: any) =>
      s.id === itemId ? { ...s, checked: !s.checked, checkedAt: s.checked ? undefined : Date.now() } : s,
    );
    if (!plan.shopping.some((s: any) => s.id === itemId)) {
      throw appError('NOT_FOUND', 'Shopping item not found');
    }
    await ctx.db.patch(plan._id, { shopping });
  },
});

export const create = internalMutation({
  args: {
    userId: v.id('users'),
    dailyKcal: v.number(),
    proteinG: v.number(),
    carbG: v.number(),
    fatG: v.number(),
    recipes: v.array(recipeShape),
    generator: v.union(v.literal('rules'), v.literal('llm')),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const sevenDays = 7 * 86400 * 1000;
    const previous = await getActivePlan(ctx, args.userId);
    if (previous) {
      await ctx.db.patch(previous._id, { status: 'archived', activeTo: now });
    }

    const planId = await ctx.db.insert('plans', {
      userId: args.userId,
      dailyKcal: args.dailyKcal,
      proteinG: args.proteinG,
      carbG: args.carbG,
      fatG: args.fatG,
      recipes: args.recipes,
      shopping: [],
      generator: args.generator,
      activeFrom: now,
      activeTo: now + sevenDays,
      status: 'active',
    });

    for (const recipe of args.recipes) {
      await ctx.db.insert('planRecipes', {
        userId: args.userId,
        planId,
        legacyRecipeId: recipe.id,
        day: recipe.day,
        slot: recipe.slot,
        name: recipe.name,
        kcal: recipe.kcal,
        proteinG: recipe.proteinG,
        carbG: recipe.carbG,
        fatG: recipe.fatG,
        ingredients: recipe.ingredients,
        method: recipe.method,
        heroTone: recipe.heroTone,
        isFavorite: recipe.isFavorite,
        doneAt: recipe.doneAt,
      });
    }

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();
    if (profile) {
      await ctx.db.patch(profile._id, { activePlanId: planId });
    }

    return planId;
  },
});
