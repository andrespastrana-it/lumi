import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { requireUser } from './lib/auth';
import { getSingletonByUser } from './lib/singleton';

const partialPrefs = v.object({
  summary: v.optional(v.boolean()),
  mealNudge: v.optional(v.boolean()),
  weighIn: v.optional(v.boolean()),
  wins: v.optional(v.boolean()),
  plateauAlert: v.optional(v.boolean()),
  weekly: v.optional(v.boolean()),
  quiet: v.optional(v.boolean()),
});

export const set = mutation({
  args: { partial: partialPrefs },
  handler: async (ctx, { partial }) => {
    const user = await requireUser(ctx);
    const existing = await getSingletonByUser(ctx, 'notifPrefs', user._id);
    if (existing) {
      await ctx.db.patch(existing._id, partial);
      return existing._id;
    }
    return await ctx.db.insert('notifPrefs', {
      userId: user._id,
      summary: partial.summary ?? true,
      mealNudge: partial.mealNudge ?? true,
      weighIn: partial.weighIn ?? true,
      wins: partial.wins ?? true,
      plateauAlert: partial.plateauAlert ?? false,
      weekly: partial.weekly ?? true,
      quiet: partial.quiet ?? true,
    });
  },
});
