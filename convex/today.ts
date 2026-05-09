import { query } from './_generated/server';
import { getUserOrNull } from './lib/auth';
import { getActivePlan } from './lib/plans';

export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUserOrNull(ctx);
    if (!user) return null;

    const [profile, plan] = await Promise.all([
      ctx.db
        .query('profiles')
        .withIndex('by_user', (q) => q.eq('userId', user._id))
        .unique(),
      getActivePlan(ctx, user._id),
    ]);

    if (!profile || !plan) {
      return null;
    }

    // Today window — UTC for now; per-tz refinement Phase 6.
    const now = Date.now();
    const today = new Date(now);
    const startOfDay = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0,
    );
    const endOfDay = startOfDay + 86400 * 1000;

    const logs = await ctx.db
      .query('foodLogs')
      .withIndex('by_user_consumedAt', (q) =>
        q.eq('userId', user._id).gte('consumedAt', startOfDay).lt('consumedAt', endOfDay),
      )
      .filter((q) => q.eq(q.field('status'), 'confirmed'))
      .collect();

    const eaten = logs.reduce(
      (acc, l) => ({
        kcal: acc.kcal + l.kcal,
        proteinG: acc.proteinG + l.proteinG,
        carbG: acc.carbG + l.carbG,
        fatG: acc.fatG + l.fatG,
      }),
      { kcal: 0, proteinG: 0, carbG: 0, fatG: 0 },
    );

    const kcalLeft = Math.max(0, plan.dailyKcal - eaten.kcal);
    const ringPct = Math.min(1, eaten.kcal / plan.dailyKcal);

    // Streak calc — count consecutive prior days where eaten <= dailyKcal*1.05.
    // Cheap version: just last 30 days.
    const thirtyDaysAgo = startOfDay - 30 * 86400 * 1000;
    const recentLogs = await ctx.db
      .query('foodLogs')
      .withIndex('by_user_consumedAt', (q) =>
        q.eq('userId', user._id).gte('consumedAt', thirtyDaysAgo).lt('consumedAt', startOfDay),
      )
      .filter((q) => q.eq(q.field('status'), 'confirmed'))
      .collect();

    const dailyTotals = new Map<string, number>();
    for (const log of recentLogs) {
      const dayKey = new Date(log.consumedAt).toISOString().slice(0, 10);
      dailyTotals.set(dayKey, (dailyTotals.get(dayKey) ?? 0) + log.kcal);
    }
    let streakDays = 0;
    const cap = plan.dailyKcal * 1.05;
    for (let i = 1; i <= 30; i++) {
      const day = new Date(startOfDay - i * 86400 * 1000).toISOString().slice(0, 10);
      const total = dailyTotals.get(day) ?? 0;
      if (total > 0 && total <= cap) streakDays++;
      else break;
    }

    // Mascot mood from progress.
    const mascotMood: 'happy' | 'proud' | 'thinking' | 'worried' =
      eaten.kcal > plan.dailyKcal * 1.1
        ? 'worried'
        : eaten.kcal > plan.dailyKcal * 0.9
        ? 'proud'
        : eaten.kcal === 0
        ? 'thinking'
        : 'happy';

    return {
      kcalTotal: plan.dailyKcal,
      kcalLeft,
      kcalEaten: eaten.kcal,
      ringPct,
      macros: {
        proteinG: { eaten: eaten.proteinG, target: plan.proteinG },
        carbG: { eaten: eaten.carbG, target: plan.carbG },
        fatG: { eaten: eaten.fatG, target: plan.fatG },
      },
      streakDays,
      mascotMood,
      meals: logs
        .sort((a, b) => a.consumedAt - b.consumedAt)
        .map((l) => ({
          id: l._id,
          name: l.name,
          kcal: l.kcal,
          source: l.source,
          consumedAt: l.consumedAt,
        })),
    };
  },
});
