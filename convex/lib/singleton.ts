import type { MutationCtx, QueryCtx } from '../_generated/server';
import type { Id } from '../_generated/dataModel';

type Ctx = QueryCtx | MutationCtx;
type SingletonTable = 'profiles' | 'permissionGrants' | 'notifPrefs' | 'integrations';

export async function getSingletonByUser(
  ctx: Ctx,
  table: SingletonTable,
  userId: Id<'users'>,
) {
  return await ctx.db
    .query(table)
    .withIndex('by_user' as never, (q: any) => q.eq('userId', userId))
    .order('desc')
    .first();
}

export async function repairSingletonByUser(
  ctx: MutationCtx,
  table: SingletonTable,
  userId: Id<'users'>,
) {
  const rows = await ctx.db
    .query(table)
    .withIndex('by_user' as never, (q: any) => q.eq('userId', userId))
    .order('desc')
    .collect();
  const [keeper, ...duplicates] = rows;
  for (const row of duplicates) {
    await ctx.db.delete(row._id);
  }
  return keeper ?? null;
}
