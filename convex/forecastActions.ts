'use node';
import { v } from 'convex/values';
import { z } from 'zod';
import { internalAction } from './_generated/server';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { ai } from './ai';
import { withAiTelemetry } from './lib/aiTelemetry';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const NarrativeSchema = z.object({
  headline: z.string().min(1).max(100),
  detail: z.string().min(1).max(200),
});

function todayScopeKey() {
  return new Date().toISOString().slice(0, 10);
}

function weekIsoFromTs(ts: number): string {
  const d = new Date(ts);
  const day = d.getUTCDay() || 7;
  if (day !== 1) d.setUTCDate(d.getUTCDate() - (day - 1));
  return d.toISOString().slice(0, 10);
}

function weeklyDeltaKgFromWeighIns(
  points: { measuredAt: number; weightKg: number }[],
): number {
  if (points.length < 2) return 0;
  const sorted = [...points].sort((a, b) => a.measuredAt - b.measuredAt);
  const tail = sorted.slice(-4);
  const first = tail[0];
  const last = tail[tail.length - 1];
  const days = Math.max(1, (last.measuredAt - first.measuredAt) / (24 * 60 * 60 * 1000));
  return ((last.weightKg - first.weightKg) / days) * 7;
}

function projectWeeks(
  startKg: number,
  weeklyDeltaKg: number,
  weeks: number,
  startTs: number,
): { weekIso: string; kg: number }[] {
  const out: { weekIso: string; kg: number }[] = [];
  for (let i = 1; i <= weeks; i++) {
    out.push({
      weekIso: weekIsoFromTs(startTs + i * WEEK_MS),
      kg: Math.round((startKg + weeklyDeltaKg * i) * 10) / 10,
    });
  }
  return out;
}

function etaWeekIso(
  latestKg: number,
  targetKg: number,
  weeklyDeltaKg: number,
  startTs: number,
): string | null {
  if (weeklyDeltaKg === 0) return null;
  const towardTarget = targetKg < latestKg ? -1 : 1;
  const goalDirectionMatches = Math.sign(weeklyDeltaKg) === towardTarget;
  if (!goalDirectionMatches) return null;
  const weeks = Math.ceil(Math.abs(latestKg - targetKg) / Math.abs(weeklyDeltaKg));
  if (weeks <= 0 || weeks > 104) return null;
  return weekIsoFromTs(startTs + weeks * WEEK_MS);
}

export const generateForUser = internalAction({
  args: { userId: v.id('users') },
  handler: async (
    ctx,
    { userId },
  ): Promise<
    | { ok: true; snapshotId: Id<'forecastSnapshots'> }
    | { skipped: 'no_profile' | 'insufficient_data' }
  > => {
    const profile = await ctx.runQuery(internal.profile.getForUser, { userId });
    if (!profile) return { skipped: 'no_profile' };

    const points = await ctx.runQuery(internal.weighIns.recentForUser, {
      userId,
      limit: 30,
    });
    if (points.length < 2) return { skipped: 'insufficient_data' };

    const sorted = [...points].sort((a, b) => a.measuredAt - b.measuredAt);
    const latestKg = sorted[sorted.length - 1].weightKg;
    const weeklyDeltaKg = weeklyDeltaKgFromWeighIns(sorted);
    const targetKg = profile.targetWeightKg;
    const now = Date.now();
    const projection = projectWeeks(latestKg, weeklyDeltaKg, 12, now);
    const eta = etaWeekIso(latestKg, targetKg, weeklyDeltaKg, now);
    const onTrack =
      eta !== null &&
      Math.sign(weeklyDeltaKg) === (targetKg < latestKg ? -1 : 1);

    const coachTask = ai.task('coach');
    let narrative: { headline: string; detail: string };
    try {
      narrative = await withAiTelemetry(
        ctx,
        { userId, task: 'coach', modelId: coachTask.modelId },
        async () => {
          const result = await coachTask.generateObject({
            schema: NarrativeSchema,
            system:
              "You are Pip, the user's diet coach. In 1-2 short, warm sentences, summarize their forecast for the next 12 weeks. Headline ≤ 8 words. Detail ≤ 30 words. Avoid medical claims.",
            prompt: [
              `Current: ${latestKg.toFixed(1)} kg`,
              `Target: ${targetKg.toFixed(1)} kg`,
              `Weekly change (last 4 weigh-ins): ${weeklyDeltaKg >= 0 ? '+' : ''}${weeklyDeltaKg.toFixed(2)} kg/week`,
              `Goal direction: ${profile.goal}`,
              `On-track: ${onTrack ? 'yes' : 'no'}`,
              eta ? `ETA week (ISO): ${eta}` : 'ETA: not within 2 years at current pace',
            ].join('\n'),
          });
          return { value: result.object, usage: result.usage };
        },
      );
    } catch (err) {
      narrative = onTrack
        ? {
            headline: 'On track',
            detail: `Keep this pace and you'll hit ${targetKg.toFixed(1)} kg by ${eta ?? 'soon'}.`,
          }
        : {
            headline: 'Steady week',
            detail: `Logged ${sorted.length} weigh-ins. Let's revisit next week.`,
          };
      console.error('forecast narrative failed', err);
    }

    const snapshotId = await ctx.runMutation(internal.forecast.upsertSnapshot, {
      userId,
      range: '30d',
      payload: {
        kind: 'weight',
        latestKg,
        targetKg,
        weeklyDeltaKg,
        onTrack,
        etaWeekIso: eta,
        projection,
        headline: narrative.headline,
        detail: narrative.detail,
        generatedAt: now,
      },
    });
    return { ok: true, snapshotId };
  },
});

export const produceSnapshotsDaily = internalAction({
  args: {},
  handler: async (
    ctx,
  ): Promise<{ ran: number; skipped: number; failed: number; idempotent?: true }> => {
    const claimed = await ctx.runMutation(internal.forecast.claimProducerRun, {
      jobName: 'produceForecastSnapshots',
      scopeKey: todayScopeKey(),
    });
    if (!claimed) return { ran: 0, skipped: 0, failed: 0, idempotent: true };

    const userIds = await ctx.runQuery(internal.users.listActive, { limit: 1000 });
    let ran = 0;
    let skipped = 0;
    let failed = 0;
    for (const userId of userIds) {
      try {
        const res = await ctx.runAction(internal.forecastActions.generateForUser, {
          userId,
        });
        if ('ok' in res) ran += 1;
        else skipped += 1;
      } catch (err) {
        failed += 1;
        console.error('forecast generate failed', userId, err);
      }
    }
    return { ran, skipped, failed };
  },
});
