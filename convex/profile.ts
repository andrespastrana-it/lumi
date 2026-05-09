import { v } from 'convex/values';
import { mutation, internalMutation } from './_generated/server';
import { requireUser } from './lib/auth';
import { appError } from './lib/errors';
import { assertRange, BODY_BOUNDS } from './lib/bounds';
import { getSingletonByUser } from './lib/singleton';

const profileFields = {
  goal: v.union(v.literal('lose'), v.literal('maintain'), v.literal('gain')),
  heightCm: v.number(),
  startWeightKg: v.number(),
  targetWeightKg: v.number(),
  age: v.number(),
  sex: v.optional(v.string()),
  activity: v.union(
    v.literal('sed'),
    v.literal('light'),
    v.literal('mod'),
    v.literal('active'),
  ),
  diet: v.array(v.string()),
  mealTimes: v.object({
    wake: v.string(),
    breakfast: v.string(),
    lunch: v.string(),
    dinner: v.string(),
    sleep: v.string(),
  }),
  coachTone: v.union(
    v.literal('Warm'),
    v.literal('Direct'),
    v.literal('Cheerleader'),
    v.literal('Stoic'),
  ),
  units: v.object({
    mass: v.string(),
    height: v.string(),
    energy: v.string(),
    volume: v.string(),
    firstDay: v.string(),
    lang: v.string(),
  }),
  privacy: v.object({
    analytics: v.boolean(),
    share: v.boolean(),
    research: v.boolean(),
  }),
  tz: v.string(),
  activePlanId: v.optional(v.id('plans')),
};

export const create = internalMutation({
  args: { userId: v.id('users'), ...profileFields },
  handler: async (ctx, args) => {
    const { userId, ...rest } = args;
    const existing = await getSingletonByUser(ctx, 'profiles', userId);
    if (existing) {
      await ctx.db.patch(existing._id, rest);
      return existing._id;
    }
    return await ctx.db.insert('profiles', { userId, ...rest });
  },
});

export const patch = mutation({
  args: {
    partial: v.object({
      goal: v.optional(profileFields.goal),
      heightCm: v.optional(v.number()),
      startWeightKg: v.optional(v.number()),
      targetWeightKg: v.optional(v.number()),
      age: v.optional(v.number()),
      sex: v.optional(v.string()),
      activity: v.optional(profileFields.activity),
      diet: v.optional(v.array(v.string())),
      mealTimes: v.optional(profileFields.mealTimes),
      coachTone: v.optional(profileFields.coachTone),
      units: v.optional(profileFields.units),
      privacy: v.optional(profileFields.privacy),
      tz: v.optional(v.string()),
      activePlanId: v.optional(v.id('plans')),
    }),
  },
  handler: async (ctx, { partial }) => {
    const user = await requireUser(ctx);
    if (partial.heightCm !== undefined) assertRange('heightCm', partial.heightCm, ...BODY_BOUNDS.heightCm);
    if (partial.startWeightKg !== undefined) assertRange('startWeightKg', partial.startWeightKg, ...BODY_BOUNDS.weightKg);
    if (partial.targetWeightKg !== undefined) assertRange('targetWeightKg', partial.targetWeightKg, ...BODY_BOUNDS.weightKg);
    if (partial.age !== undefined) assertRange('age', partial.age, ...BODY_BOUNDS.age);
    const existing = await getSingletonByUser(ctx, 'profiles', user._id);
    if (!existing) throw appError('NOT_FOUND', 'Profile not found');
    if (partial.activePlanId) {
      const plan = await ctx.db.get(partial.activePlanId);
      if (!plan || plan.userId !== user._id) {
        throw appError('NOT_FOUND', 'Plan not found');
      }
    }
    await ctx.db.patch(existing._id, partial);
  },
});
