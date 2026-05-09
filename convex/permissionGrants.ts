import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { requireUser } from './lib/auth';
import { getSingletonByUser } from './lib/singleton';

const keyValidator = v.union(
  v.literal('notif'),
  v.literal('health'),
  v.literal('cam'),
  v.literal('mic'),
);

export const set = mutation({
  args: { key: keyValidator, value: v.boolean() },
  handler: async (ctx, { key, value }) => {
    const user = await requireUser(ctx);
    const existing = await getSingletonByUser(ctx, 'permissionGrants', user._id);
    if (existing) {
      await ctx.db.patch(existing._id, { [key]: value });
      return existing._id;
    }
    return await ctx.db.insert('permissionGrants', {
      userId: user._id,
      notif: key === 'notif' ? value : false,
      health: key === 'health' ? value : false,
      cam: key === 'cam' ? value : false,
      mic: key === 'mic' ? value : false,
    });
  },
});
