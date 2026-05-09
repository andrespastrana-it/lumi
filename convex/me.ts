import { query } from './_generated/server';
import { getUserOrNull } from './lib/auth';
import { getActivePlan, toActivePlanDto } from './lib/plans';
import type { Doc } from './_generated/dataModel';

function integrationDto(row: any) {
  if (!row) return null;
  return {
    appleHealth: row.appleHealth,
    googleFit: row.googleFit,
    fitbit: row.fitbit,
    withings: row.withings,
    strava: row.strava,
    glovo: row.glovo,
  };
}

function profileDto(row: Doc<'profiles'> | null) {
  if (!row) return null;
  return {
    id: row._id,
    _id: row._id,
    goal: row.goal,
    heightCm: row.heightCm,
    startWeightKg: row.startWeightKg,
    targetWeightKg: row.targetWeightKg,
    age: row.age,
    sex: row.sex,
    activity: row.activity,
    diet: row.diet,
    mealTimes: row.mealTimes,
    coachTone: row.coachTone,
    units: row.units,
    privacy: row.privacy,
    tz: row.tz,
    activePlanId: row.activePlanId,
  };
}

function permissionGrantsDto(row: Doc<'permissionGrants'> | null) {
  if (!row) return null;
  return {
    id: row._id,
    _id: row._id,
    notif: row.notif,
    health: row.health,
    cam: row.cam,
    mic: row.mic,
  };
}

function notifPrefsDto(row: Doc<'notifPrefs'> | null) {
  if (!row) return null;
  return {
    id: row._id,
    _id: row._id,
    summary: row.summary,
    mealNudge: row.mealNudge,
    weighIn: row.weighIn,
    wins: row.wins,
    plateauAlert: row.plateauAlert,
    weekly: row.weekly,
    quiet: row.quiet,
  };
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUserOrNull(ctx);
    if (!user) return null;

    const [profile, integrations, permissionGrants, notifPrefs, activePlan] =
      await Promise.all([
        ctx.db
          .query('profiles')
          .withIndex('by_user', (q) => q.eq('userId', user._id))
          .unique(),
        ctx.db
          .query('integrations')
          .withIndex('by_user', (q) => q.eq('userId', user._id))
          .unique(),
        ctx.db
          .query('permissionGrants')
          .withIndex('by_user', (q) => q.eq('userId', user._id))
          .unique(),
        ctx.db
          .query('notifPrefs')
          .withIndex('by_user', (q) => q.eq('userId', user._id))
          .unique(),
        getActivePlan(ctx, user._id),
      ]);

    return {
      user: { _id: user._id, email: user.email },
      profile: profileDto(profile),
      integrations: integrationDto(integrations),
      permissionGrants: permissionGrantsDto(permissionGrants),
      notifPrefs: notifPrefsDto(notifPrefs),
      activePlan: await toActivePlanDto(ctx, activePlan),
    };
  },
});
