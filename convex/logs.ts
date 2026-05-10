import { v } from 'convex/values';
import { query, mutation, internalQuery, internalMutation } from './_generated/server';
import { requireUser, getUserOrNull } from './lib/auth';
import { appError } from './lib/errors';
import { assertRange, FOOD_BOUNDS } from './lib/bounds';
import type { Doc, Id } from './_generated/dataModel';

function assertFoodBounds(food: {
  kcal?: number;
  proteinG?: number;
  carbG?: number;
  fatG?: number;
  servingSizeG?: number;
}) {
  if (food.kcal !== undefined) assertRange('kcal', food.kcal, ...FOOD_BOUNDS.kcal);
  if (food.proteinG !== undefined) assertRange('proteinG', food.proteinG, ...FOOD_BOUNDS.macroG);
  if (food.carbG !== undefined) assertRange('carbG', food.carbG, ...FOOD_BOUNDS.macroG);
  if (food.fatG !== undefined) assertRange('fatG', food.fatG, ...FOOD_BOUNDS.macroG);
  if (food.servingSizeG !== undefined)
    assertRange('servingSizeG', food.servingSizeG, ...FOOD_BOUNDS.servingSizeG);
}

function logDto(row: Doc<'foodLogs'>) {
  return {
    id: row._id,
    _id: row._id,
    consumedAt: row.consumedAt,
    source: row.source,
    name: row.name,
    kcal: row.kcal,
    proteinG: row.proteinG,
    carbG: row.carbG,
    fatG: row.fatG,
    servingSizeG: row.servingSizeG,
    barcode: row.barcode,
    confidence: row.confidence,
    status: row.status,
    fromPlanId: (row as any).fromPlanId,
    fromPlanRecipeId: (row as any).fromPlanRecipeId,
  };
}

const draftShape = v.object({
  source: v.union(
    v.literal('photo'),
    v.literal('voice'),
    v.literal('barcode'),
    v.literal('search'),
    v.literal('manual'),
  ),
  name: v.string(),
  kcal: v.number(),
  proteinG: v.number(),
  carbG: v.number(),
  fatG: v.number(),
  servingSizeG: v.optional(v.number()),
  barcode: v.optional(v.string()),
  photoAssetId: v.optional(v.id('mediaAssets')),
  audioAssetId: v.optional(v.id('mediaAssets')),
  rawAi: v.optional(v.any()),
  confidence: v.optional(v.number()),
  fromRecipeId: v.optional(v.string()),
});

function startOfLocalDay(date: string): { from: number; to: number } {
  // date is YYYY-MM-DD; treat as UTC midnight (close-enough; per-tz refinement later).
  const [y, m, d] = date.split('-').map((s) => parseInt(s, 10));
  const from = Date.UTC(y, m - 1, d, 0, 0, 0);
  const to = from + 86400 * 1000;
  return { from, to };
}

export const byDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const user = await getUserOrNull(ctx);
    if (!user) return [];
    const { from, to } = startOfLocalDay(date);
    const rows = await ctx.db
      .query('foodLogs')
      .withIndex('by_user_consumedAt', (q) =>
        q.eq('userId', user._id).gte('consumedAt', from).lt('consumedAt', to),
      )
      .filter((q) => q.eq(q.field('status'), 'confirmed'))
      .collect();
    return rows.map(logDto);
  },
});

export const draftById = query({
  args: { id: v.id('foodLogs') },
  handler: async (ctx, { id }) => {
    const user = await requireUser(ctx);
    const row = await ctx.db.get(id);
    if (!row || row.userId !== user._id) return null;
    if (row.status !== 'draft') return null;
    return logDto(row);
  },
});

export const recordAsset = internalMutation({
  args: {
    userId: v.id('users'),
    storageId: v.id('_storage'),
    kind: v.union(v.literal('photo'), v.literal('audio')),
    bytes: v.number(),
    mime: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('mediaAssets', args);
  },
});

export const getAssetForAction = internalQuery({
  args: { assetId: v.id('mediaAssets') },
  handler: async (ctx, { assetId }) => {
    return await ctx.db.get(assetId);
  },
});

export const findDraftByAsset = internalQuery({
  args: {
    userId: v.id('users'),
    assetId: v.id('mediaAssets'),
    kind: v.union(v.literal('photo'), v.literal('audio')),
  },
  handler: async (ctx, { userId, assetId, kind }) => {
    const indexName = kind === 'photo' ? 'by_photo_asset' : 'by_audio_asset';
    const fieldName = kind === 'photo' ? 'photoAssetId' : 'audioAssetId';
    const row = await ctx.db
      .query('foodLogs')
      .withIndex(indexName, (q: any) => q.eq(fieldName, assetId))
      .first();
    if (!row || row.userId !== userId || row.status !== 'draft') return null;
    return row._id;
  },
});

export const recordAiCall = internalMutation({
  args: {
    userId: v.id('users'),
    task: v.string(),
    providerModel: v.string(),
    inputTokens: v.number(),
    outputTokens: v.number(),
    ms: v.number(),
    ok: v.boolean(),
    errorCode: v.optional(v.string()),
    costUsd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('aiCalls', args);
  },
});

export const recordFoodLogDiagnostic = internalMutation({
  args: {
    userId: v.id('users'),
    foodLogId: v.id('foodLogs'),
    task: v.string(),
    providerModel: v.optional(v.string()),
    payload: v.any(),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('foodLogDiagnostics', {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Internal: insert a draft. Called by action files after AI parsing.
export const insertDraft = internalMutation({
  args: {
    userId: v.id('users'),
    consumedAt: v.number(),
    draft: draftShape,
  },
  handler: async (ctx, { userId, consumedAt, draft }) => {
    const { rawAi, ...safeDraft } = draft;
    const logId = await ctx.db.insert('foodLogs', {
      userId,
      consumedAt,
      status: 'draft',
      ...safeDraft,
    });
    if (rawAi !== undefined) {
      await ctx.db.insert('foodLogDiagnostics', {
        userId,
        foodLogId: logId,
        task: draft.source,
        payload: rawAi,
        createdAt: Date.now(),
      });
    }
    return logId;
  },
});

// Public: confirm a draft → flips status='confirmed' + applies edits.
export const confirm = mutation({
  args: {
    id: v.id('foodLogs'),
    edits: v.optional(
      v.object({
        name: v.optional(v.string()),
        kcal: v.optional(v.number()),
        proteinG: v.optional(v.number()),
        carbG: v.optional(v.number()),
        fatG: v.optional(v.number()),
        servingSizeG: v.optional(v.number()),
        consumedAt: v.optional(v.number()),
      }),
    ),
  },
  handler: async (ctx, { id, edits }) => {
    const user = await requireUser(ctx);
    if (edits) assertFoodBounds(edits);
    const row = await ctx.db.get(id);
    if (!row || row.userId !== user._id) throw appError('NOT_FOUND', 'Not found');
    if (row.status !== 'draft') throw appError('INVALID_STATE', 'Only draft logs can be confirmed');
    await ctx.db.patch(id, { status: 'confirmed', ...(edits ?? {}) });
    return id;
  },
});

// Public: confirm a manual entry (no draft) — single-step path for quick-add.
export const confirmManual = mutation({
  args: {
    consumedAt: v.optional(v.number()),
    name: v.string(),
    kcal: v.number(),
    proteinG: v.number(),
    carbG: v.number(),
    fatG: v.number(),
    servingSizeG: v.optional(v.number()),
    fromRecipeId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    assertFoodBounds(args);
    return await ctx.db.insert('foodLogs', {
      userId: user._id,
      consumedAt: args.consumedAt ?? Date.now(),
      source: 'manual',
      name: args.name,
      kcal: args.kcal,
      proteinG: args.proteinG,
      carbG: args.carbG,
      fatG: args.fatG,
      servingSizeG: args.servingSizeG,
      fromRecipeId: args.fromRecipeId,
      status: 'confirmed',
    });
  },
});

export const draftSearchPick = mutation({
  args: {
    name: v.string(),
    kcal: v.number(),
    proteinG: v.number(),
    carbG: v.number(),
    fatG: v.number(),
    servingSizeG: v.optional(v.number()),
    confidence: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    assertFoodBounds(args);
    return await ctx.db.insert('foodLogs', {
      userId: user._id,
      consumedAt: Date.now(),
      source: 'search',
      name: args.name,
      kcal: args.kcal,
      proteinG: args.proteinG,
      carbG: args.carbG,
      fatG: args.fatG,
      servingSizeG: args.servingSizeG,
      confidence: args.confidence,
      status: 'draft',
    });
  },
});

export const logRecipe = mutation({
  args: {
    planRecipeId: v.id('planRecipes'),
    consumedAt: v.optional(v.number()),
  },
  handler: async (ctx, { planRecipeId, consumedAt }) => {
    const user = await requireUser(ctx);
    const recipe = await ctx.db.get(planRecipeId);
    if (!recipe || recipe.userId !== user._id) throw appError('NOT_FOUND', 'Recipe not found');

    const logId = await ctx.db.insert('foodLogs', {
      userId: user._id,
      consumedAt: consumedAt ?? Date.now(),
      source: 'manual',
      name: recipe.name,
      kcal: recipe.kcal,
      proteinG: recipe.proteinG,
      carbG: recipe.carbG,
      fatG: recipe.fatG,
      status: 'confirmed',
      fromPlanId: recipe.planId,
      fromPlanRecipeId: recipe._id,
      fromRecipeId: recipe.legacyRecipeId,
    });

    if (!recipe.doneAt) {
      await ctx.db.patch(recipe._id, { doneAt: Date.now() });
    }

    return { logId };
  },
});

export const remove = mutation({
  args: { id: v.id('foodLogs') },
  handler: async (ctx, { id }) => {
    const user = await requireUser(ctx);
    const row = await ctx.db.get(id);
    if (!row || row.userId !== user._id) throw appError('NOT_FOUND', 'Not found');
    await ctx.db.patch(id, { status: 'deleted' });
  },
});
