import type { QueryCtx, MutationCtx } from '../_generated/server';
import type { Doc, Id } from '../_generated/dataModel';

type Ctx = QueryCtx | MutationCtx;

export async function getProfile(ctx: Ctx, userId: Id<'users'>) {
  return await ctx.db
    .query('profiles')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .order('desc')
    .first();
}

export async function getActivePlan(ctx: Ctx, userId: Id<'users'>) {
  const profile = await getProfile(ctx, userId);
  const activePlanId = (profile as any)?.activePlanId as Id<'plans'> | undefined;
  if (activePlanId) {
    const plan = await ctx.db.get(activePlanId);
    if (plan?.userId === userId) {
      return plan;
    }
  }

  return await ctx.db
    .query('plans')
    .withIndex('by_user_active', (q) => q.eq('userId', userId))
    .order('desc')
    .first();
}

export async function getPlanRecipes(ctx: Ctx, plan: Doc<'plans'>) {
  const rows = await ctx.db
    .query('planRecipes')
    .withIndex('by_plan', (q) => q.eq('planId', plan._id))
    .collect();

  if (rows.length > 0) {
    return rows
      .sort((a, b) => a.day - b.day || a.slot.localeCompare(b.slot) || a._creationTime - b._creationTime)
      .map((r) => ({
        _id: r._id,
        id: r._id,
        legacyRecipeId: r.legacyRecipeId,
        day: r.day,
        slot: r.slot,
        name: r.name,
        kcal: r.kcal,
        proteinG: r.proteinG,
        carbG: r.carbG,
        fatG: r.fatG,
        ingredients: r.ingredients,
        method: r.method,
        heroTone: r.heroTone,
        isFavorite: r.isFavorite,
        doneAt: r.doneAt,
      }));
  }

  return plan.recipes;
}

export async function toActivePlanDto(ctx: Ctx, plan: Doc<'plans'> | null) {
  if (!plan) return null;
  return {
    id: plan._id,
    _id: plan._id,
    dailyKcal: plan.dailyKcal,
    proteinG: plan.proteinG,
    carbG: plan.carbG,
    fatG: plan.fatG,
    recipes: await getPlanRecipes(ctx, plan),
    shopping: plan.shopping,
    generator: plan.generator,
    activeFrom: plan.activeFrom,
    activeTo: plan.activeTo,
    status: plan.status,
  };
}
