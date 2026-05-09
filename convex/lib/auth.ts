import type { Doc } from '../_generated/dataModel';
import type { QueryCtx, MutationCtx } from '../_generated/server';
import { appError } from './errors';

export async function requireUser(
  ctx: QueryCtx | MutationCtx,
): Promise<Doc<'users'>> {
  const ident = await ctx.auth.getUserIdentity();
  if (!ident) throw appError('UNAUTHENTICATED', 'Sign in required');
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk', (q) => q.eq('clerkUserId', ident.subject))
    .unique();
  if (!user) throw appError('USER_NOT_SYNCED', 'User not synced');
  if (user.deletedAt) throw appError('ACCOUNT_DELETED', 'Account deleted');
  return user;
}

export async function getUserOrNull(
  ctx: QueryCtx | MutationCtx,
): Promise<Doc<'users'> | null> {
  const ident = await ctx.auth.getUserIdentity();
  if (!ident) return null;
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk', (q) => q.eq('clerkUserId', ident.subject))
    .unique();
  if (!user || user.deletedAt) return null;
  return user;
}
