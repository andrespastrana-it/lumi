'use node';
import { v } from 'convex/values';
import { z } from 'zod';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import { ai } from './ai';
import { appError } from './lib/errors';
import { checkAiRateLimit } from './lib/rateLimit';

const FoodEstimate = z.object({
  name: z.string(),
  kcal: z.number().int().min(0).max(5000),
  proteinG: z.number().min(0).max(500),
  carbG: z.number().min(0).max(500),
  fatG: z.number().min(0).max(500),
  servingSizeG: z.number().min(0).max(5000).optional(),
  confidence: z.number().min(0).max(1),
});

async function ensureUser(ctx: any): Promise<any> {
  const ident = await ctx.auth.getUserIdentity();
  if (!ident) throw appError('UNAUTHENTICATED', 'Sign in required');
  return await ctx.runMutation(internal.users.ensureMeFromIdentity, {});
}

async function logAi(
  ctx: any,
  args: {
    userId: any;
    task: string;
    providerModel: string;
    inputTokens: number;
    outputTokens: number;
    ms: number;
    ok: boolean;
    errorCode?: string;
  },
): Promise<void> {
  await ctx.runMutation(internal.logs.recordAiCall, args).catch(() => {});
}

export const draftFromPhoto = action({
  args: { assetId: v.id('mediaAssets') },
  handler: async (ctx, { assetId }): Promise<{ logId: string }> => {
    const userId = await ensureUser(ctx);
    const asset: any = await ctx.runQuery(internal.logs.getAssetForAction, { assetId });
    if (!asset || asset.userId !== userId || asset.kind !== 'photo') {
      throw appError('NOT_FOUND', 'Photo asset not found');
    }
    const existingDraftId: string | null = await ctx.runQuery(internal.logs.findDraftByAsset, {
      userId,
      assetId,
      kind: 'photo',
    });
    if (existingDraftId) return { logId: existingDraftId };
    await checkAiRateLimit(ctx, userId, 'vision');
    const storageId = asset.storageId;
    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw appError('NOT_FOUND', 'Photo not found');

    const t0 = Date.now();
    const visionTask = ai.task('vision');
    let estimate: z.infer<typeof FoodEstimate>;
    try {
      const result = await visionTask.generateObject({
        schema: FoodEstimate,
        system:
          'You estimate kcal + macros from a meal photo. Return one JSON object. Confidence 0-1 reflects certainty. If multiple items visible, sum them and use a descriptive composite name.',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Estimate kcal and macros for this meal.' },
              { type: 'image', image: new URL(url) },
            ],
          },
        ],
      });
      estimate = result.object;
      await logAi(ctx, {
        userId,
        task: 'vision',
        providerModel: visionTask.modelId,
        inputTokens: result.usage?.inputTokens ?? 0,
        outputTokens: result.usage?.outputTokens ?? 0,
        ms: Date.now() - t0,
        ok: true,
      });
    } catch (err) {
      await logAi(ctx, {
        userId,
        task: 'vision',
        providerModel: visionTask.modelId,
        inputTokens: 0,
        outputTokens: 0,
        ms: Date.now() - t0,
        ok: false,
        errorCode: String(err).slice(0, 200),
      });
      throw err;
    }

    const logId: string = await ctx.runMutation(internal.logs.insertDraft, {
      userId,
      consumedAt: Date.now(),
      draft: {
        source: 'photo',
        name: estimate.name,
        kcal: Math.round(estimate.kcal),
        proteinG: estimate.proteinG,
        carbG: estimate.carbG,
        fatG: estimate.fatG,
        servingSizeG: estimate.servingSizeG,
        photoAssetId: assetId,
        confidence: estimate.confidence,
        rawAi: estimate,
      },
    });
    return { logId };
  },
});

export const draftFromVoice = action({
  args: { assetId: v.id('mediaAssets') },
  handler: async (ctx, { assetId }): Promise<{ logId: string; transcript: string }> => {
    const userId = await ensureUser(ctx);
    const asset: any = await ctx.runQuery(internal.logs.getAssetForAction, { assetId });
    if (!asset || asset.userId !== userId || asset.kind !== 'audio') {
      throw appError('NOT_FOUND', 'Audio asset not found');
    }
    const existingDraftId: string | null = await ctx.runQuery(internal.logs.findDraftByAsset, {
      userId,
      assetId,
      kind: 'audio',
    });
    if (existingDraftId) {
      return { logId: existingDraftId, transcript: '' };
    }
    await checkAiRateLimit(ctx, userId, 'stt');
    await checkAiRateLimit(ctx, userId, 'coach');
    const storageId = asset.storageId;
    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw appError('NOT_FOUND', 'Audio not found');

    // STT.
    const sttRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: (() => {
        const form = new FormData();
        form.append('model', 'whisper-large-v3');
        form.append('file', url);
        return form;
      })(),
    }).catch(() => null);

    let transcript = '';
    if (sttRes?.ok) {
      const data = (await sttRes.json()) as { text?: string };
      transcript = data.text ?? '';
    }
    if (!transcript) transcript = 'unknown meal';

    // Parse transcript → food fields.
    const parsed = await ai.task('coach').generateObject({
      schema: FoodEstimate,
      system:
        'You parse a spoken meal description into kcal/macros. Use real-world averages. Confidence 0-1.',
      prompt: `User said: "${transcript}". Estimate kcal and macros.`,
    });

    const logId: string = await ctx.runMutation(internal.logs.insertDraft, {
      userId,
      consumedAt: Date.now(),
      draft: {
        source: 'voice',
        name: parsed.object.name,
        kcal: Math.round(parsed.object.kcal),
        proteinG: parsed.object.proteinG,
        carbG: parsed.object.carbG,
        fatG: parsed.object.fatG,
        audioAssetId: assetId,
        confidence: parsed.object.confidence,
        rawAi: { transcript, parsed: parsed.object },
      },
    });
    return { logId, transcript };
  },
});

const OFF_BASE = 'https://world.openfoodfacts.org/api/v2/product';

export const draftFromBarcode = action({
  args: { ean: v.string() },
  handler: async (ctx, { ean }): Promise<{ logId: string }> => {
    const userId = await ensureUser(ctx);
    const res = await fetch(`${OFF_BASE}/${ean}.json`).catch(() => null);
    let name = `Product ${ean}`;
    let kcal = 0;
    let proteinG = 0;
    let carbG = 0;
    let fatG = 0;
    let servingSizeG: number | undefined = undefined;

    if (res?.ok) {
      const data = (await res.json()) as any;
      const p = data?.product;
      if (p) {
        name = p.product_name ?? name;
        const n = p.nutriments ?? {};
        const factor = (p.serving_quantity ?? 100) / 100;
        kcal = Math.round((n['energy-kcal_100g'] ?? 0) * factor);
        proteinG = Math.round((n.proteins_100g ?? 0) * factor);
        carbG = Math.round((n.carbohydrates_100g ?? 0) * factor);
        fatG = Math.round((n.fat_100g ?? 0) * factor);
        servingSizeG = p.serving_quantity ?? undefined;
      }
    }

    const logId: string = await ctx.runMutation(internal.logs.insertDraft, {
      userId,
      consumedAt: Date.now(),
      draft: {
        source: 'barcode',
        name,
        kcal,
        proteinG,
        carbG,
        fatG,
        servingSizeG,
        barcode: ean,
        confidence: kcal > 0 ? 0.9 : 0.2,
      },
    });
    return { logId };
  },
});

export const draftFromSearch = action({
  args: { q: v.string() },
  handler: async (ctx, { q }): Promise<{ results: z.infer<typeof FoodEstimate>[] }> => {
    const userId = await ensureUser(ctx);
    if (!q.trim()) return { results: [] };
    await checkAiRateLimit(ctx, userId, 'coach');

    const ResultsSchema = z.object({ items: z.array(FoodEstimate).max(8) });
    const out = await ai.task('coach').generateObject({
      schema: ResultsSchema,
      system: 'Return up to 8 likely food matches for the search query. kcal/macros are typical-serving averages.',
      prompt: `Search: "${q}"`,
    });
    return { results: out.object.items };
  },
});
