import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { requireUser } from './lib/auth';
import { appError } from './lib/errors';

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const PHOTO_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);
const AUDIO_MIME_TYPES = new Set([
  'audio/aac',
  'audio/m4a',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav',
  'audio/webm',
  'audio/x-m4a',
]);

function validateClaimMetadata(kind: 'photo' | 'audio', mime: string, bytes: number) {
  const normalizedMime = mime.toLowerCase();
  if (!Number.isFinite(bytes) || bytes <= 0) {
    throw appError('INVALID_ARGUMENT', 'Invalid upload size');
  }
  if (kind === 'photo') {
    if (!PHOTO_MIME_TYPES.has(normalizedMime)) throw appError('INVALID_ARGUMENT', 'Invalid photo mime type');
    if (bytes > MAX_PHOTO_BYTES) throw appError('INVALID_ARGUMENT', 'Photo upload too large');
    return normalizedMime;
  }
  if (!AUDIO_MIME_TYPES.has(normalizedMime)) throw appError('INVALID_ARGUMENT', 'Invalid audio mime type');
  if (bytes > MAX_AUDIO_BYTES) throw appError('INVALID_ARGUMENT', 'Audio upload too large');
  return normalizedMime;
}

export const generate = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const claim = mutation({
  args: {
    storageId: v.id('_storage'),
    kind: v.union(v.literal('photo'), v.literal('audio')),
    mime: v.string(),
    bytes: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const mime = validateClaimMetadata(args.kind, args.mime, args.bytes);
    const existing = await ctx.db
      .query('mediaAssets')
      .withIndex('by_storage', (q) => q.eq('storageId', args.storageId))
      .first();
    if (existing) throw appError('CONFLICT', 'Storage object already claimed');

    const assetId = await ctx.db.insert('mediaAssets', {
      userId: user._id,
      storageId: args.storageId,
      kind: args.kind,
      mime,
      bytes: args.bytes,
    });
    return { assetId };
  },
});
