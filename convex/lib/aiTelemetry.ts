import type { ActionCtx } from '../_generated/server';
import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import { checkAiRateLimit, type AiTask } from './rateLimit';
import { estimateCostUsd } from '../ai/pricing';

type Usage = { inputTokens?: number; outputTokens?: number };

export async function withAiTelemetry<T>(
  ctx: ActionCtx,
  args: { userId: Id<'users'>; task: AiTask; modelId: string },
  run: () => Promise<{ value: T; usage?: Usage }>,
): Promise<T> {
  await checkAiRateLimit(ctx, args.userId, args.task);
  const t0 = Date.now();
  try {
    const { value, usage } = await run();
    const inputTokens = usage?.inputTokens ?? 0;
    const outputTokens = usage?.outputTokens ?? 0;
    await ctx
      .runMutation(internal.logs.recordAiCall, {
        userId: args.userId,
        task: args.task,
        providerModel: args.modelId,
        inputTokens,
        outputTokens,
        ms: Date.now() - t0,
        ok: true,
        costUsd: estimateCostUsd(args.modelId, inputTokens, outputTokens),
      })
      .catch(() => {});
    return value;
  } catch (err) {
    await ctx
      .runMutation(internal.logs.recordAiCall, {
        userId: args.userId,
        task: args.task,
        providerModel: args.modelId,
        inputTokens: 0,
        outputTokens: 0,
        ms: Date.now() - t0,
        ok: false,
        errorCode: String(err).slice(0, 200),
      })
      .catch(() => {});
    throw err;
  }
}
