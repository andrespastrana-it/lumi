'use node';
import { v } from 'convex/values';
import { z } from 'zod';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import { ai } from './ai';
import { appError } from './lib/errors';
import { withAiTelemetry } from './lib/aiTelemetry';

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
    const storageId = asset.storageId;
    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw appError('NOT_FOUND', 'Photo not found');

    const visionTask = ai.task('vision');
    const estimate: z.infer<typeof FoodEstimate> = await withAiTelemetry(
      ctx,
      { userId, task: 'vision', modelId: visionTask.modelId },
      async () => {
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
        return { value: result.object, usage: result.usage };
      },
    );

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
    const storageId = asset.storageId;
    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw appError('NOT_FOUND', 'Audio not found');

    // STT (groq whisper).
    const transcript: string = await withAiTelemetry(
      ctx,
      { userId, task: 'stt', modelId: 'groq:whisper-large-v3' },
      async () => {
        const sttRes = await fetch(
          'https://api.groq.com/openai/v1/audio/transcriptions',
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
            body: (() => {
              const form = new FormData();
              form.append('model', 'whisper-large-v3');
              form.append('file', url);
              return form;
            })(),
          },
        ).catch(() => null);
        let text = '';
        if (sttRes?.ok) {
          const data = (await sttRes.json()) as { text?: string };
          text = data.text ?? '';
        }
        if (!text) text = 'unknown meal';
        return { value: text };
      },
    );

    // Parse transcript → food fields.
    const coachTask = ai.task('coach');
    const parsedObject = await withAiTelemetry(
      ctx,
      { userId, task: 'coach', modelId: coachTask.modelId },
      async () => {
        const parsed = await coachTask.generateObject({
          schema: FoodEstimate,
          system:
            'You parse a spoken meal description into kcal/macros. Use real-world averages. Confidence 0-1.',
          prompt: `User said: "${transcript}". Estimate kcal and macros.`,
        });
        return { value: parsed.object, usage: parsed.usage };
      },
    );

    const logId: string = await ctx.runMutation(internal.logs.insertDraft, {
      userId,
      consumedAt: Date.now(),
      draft: {
        source: 'voice',
        name: parsedObject.name,
        kcal: Math.round(parsedObject.kcal),
        proteinG: parsedObject.proteinG,
        carbG: parsedObject.carbG,
        fatG: parsedObject.fatG,
        audioAssetId: assetId,
        confidence: parsedObject.confidence,
        rawAi: { transcript, parsed: parsedObject },
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

    const ResultsSchema = z.object({ items: z.array(FoodEstimate).max(8) });
    const coachTask = ai.task('coach');
    const items = await withAiTelemetry(
      ctx,
      { userId, task: 'coach', modelId: coachTask.modelId },
      async () => {
        const out = await coachTask.generateObject({
          schema: ResultsSchema,
          system:
            'Return up to 8 likely food matches for the search query. kcal/macros are typical-serving averages.',
          prompt: `Search: "${q}"`,
        });
        return { value: out.object.items, usage: out.usage };
      },
    );
    return { results: items };
  },
});
