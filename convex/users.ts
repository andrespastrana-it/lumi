import { v } from 'convex/values';
import { internalMutation, internalQuery, mutation } from './_generated/server';
import { appError } from './lib/errors';
import { OWNED_TABLES, MEDIA_TABLE } from './lib/ownership';

export const ensureMe = mutation({
  args: {},
  handler: async (ctx) => {
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) throw appError('UNAUTHENTICATED', 'Sign in required');
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk', (q) => q.eq('clerkUserId', ident.subject))
      .unique();
    if (existing) {
      if (existing.deletedAt !== undefined) throw appError('ACCOUNT_DELETED', 'Account deleted');
      return existing._id;
    }
    return await ctx.db.insert('users', {
      clerkUserId: ident.subject,
      email: (ident.email as string | undefined) ?? '',
    });
  },
});

export const ensureMeFromIdentity = internalMutation({
  args: {},
  handler: async (ctx) => {
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) throw appError('UNAUTHENTICATED', 'Sign in required');
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk', (q) => q.eq('clerkUserId', ident.subject))
      .unique();
    if (existing) {
      if (existing.deletedAt !== undefined) throw appError('ACCOUNT_DELETED', 'Account deleted');
      return existing._id;
    }
    return await ctx.db.insert('users', {
      clerkUserId: ident.subject,
      email: (ident.email as string | undefined) ?? '',
    });
  },
});

export const upsert = internalMutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique();

    if (existing) {
      if (existing.deletedAt !== undefined) {
        return existing._id;
      }
      if (existing.email !== args.email) {
        await ctx.db.patch(existing._id, {
          email: args.email,
        });
      }
      return existing._id;
    }

    return await ctx.db.insert('users', {
      clerkUserId: args.clerkUserId,
      email: args.email,
    });
  },
});

export const listActive = internalQuery({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const cap = Math.min(limit ?? 1000, 5000);
    const rows = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('deletedAt'), undefined))
      .take(cap);
    return rows.map((r) => r._id);
  },
});

export const softDelete = internalMutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique();
    if (!user) return;

    const now = Date.now();
    await ctx.db.patch(user._id, {
      deletedAt: user.deletedAt ?? now,
      deletionStartedAt: now,
      purgeStatus: 'pending',
    });

    for (const table of OWNED_TABLES) {
      const rows = await ctx.db
        .query(table)
        .withIndex('by_user' as never, (q: any) => q.eq('userId', user._id))
        .collect();
      for (const row of rows) {
        await ctx.db.delete(row._id);
      }
    }

    const assets = await ctx.db
      .query(MEDIA_TABLE)
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();
    for (const asset of assets) {
      await ctx.storage.delete(asset.storageId);
      await ctx.db.delete(asset._id);
    }

    await ctx.db.patch(user._id, { purgeStatus: 'complete' });
  },
});
