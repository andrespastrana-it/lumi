import type { ActionCtx } from '../_generated/server';
import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import { appError } from './errors';

export type AiTask = 'vision' | 'coach' | 'plan-gen' | 'stt' | 'embed';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const LIMITS: Record<AiTask, { max: number; windowMs: number }> = {
  vision: { max: 30, windowMs: HOUR },
  coach: { max: 60, windowMs: HOUR },
  'plan-gen': { max: 10, windowMs: DAY },
  stt: { max: 30, windowMs: HOUR },
  embed: { max: 200, windowMs: HOUR },
};

export async function checkAiRateLimit(
  ctx: ActionCtx,
  userId: Id<'users'>,
  task: AiTask,
) {
  const { max, windowMs } = LIMITS[task];
  const since = Date.now() - windowMs;
  const count: number = await ctx.runQuery(internal.aiCalls.countSince, {
    userId,
    task,
    since,
  });
  if (count >= max) {
    throw appError('INVALID_STATE', 'AI usage limit reached, try later', {
      task,
      retryAfterMs: windowMs,
    });
  }
}
