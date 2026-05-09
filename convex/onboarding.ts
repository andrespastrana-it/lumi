import { v } from 'convex/values';
import { internalMutation } from './_generated/server';
import { getSingletonByUser } from './lib/singleton';

export const seedDefaults = internalMutation({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const existingPerms = await getSingletonByUser(ctx, 'permissionGrants', userId);
    if (!existingPerms) {
      await ctx.db.insert('permissionGrants', {
        userId,
        notif: false,
        health: false,
        cam: false,
        mic: false,
      });
    }

    const existingPrefs = await getSingletonByUser(ctx, 'notifPrefs', userId);
    if (!existingPrefs) {
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
    }

    const existingInteg = await getSingletonByUser(ctx, 'integrations', userId);
    if (!existingInteg) {
      await ctx.db.insert('integrations', {
        userId,
        appleHealth: false,
        googleFit: false,
        fitbit: false,
        withings: false,
        strava: false,
        glovo: false,
      });
    }
  },
});
