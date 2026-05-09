import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { requireUser } from './lib/auth';
import { getSingletonByUser } from './lib/singleton';

const providerValidator = v.union(
  v.literal('appleHealth'),
  v.literal('googleFit'),
  v.literal('fitbit'),
  v.literal('withings'),
  v.literal('strava'),
  v.literal('glovo'),
);

export const toggle = mutation({
  args: { provider: providerValidator, enabled: v.boolean() },
  handler: async (ctx, { provider, enabled }) => {
    const user = await requireUser(ctx);
    const existing = await getSingletonByUser(ctx, 'integrations', user._id);
    if (existing) {
      await ctx.db.patch(existing._id, { [provider]: enabled });
      return existing._id;
    }
    return await ctx.db.insert('integrations', {
      userId: user._id,
      appleHealth: provider === 'appleHealth' ? enabled : false,
      googleFit: provider === 'googleFit' ? enabled : false,
      fitbit: provider === 'fitbit' ? enabled : false,
      withings: provider === 'withings' ? enabled : false,
      strava: provider === 'strava' ? enabled : false,
      glovo: provider === 'glovo' ? enabled : false,
    });
  },
});
