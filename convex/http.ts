import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { Webhook } from 'svix';

const http = httpRouter();

http.route({
  path: '/webhooks/clerk',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      return new Response('Server misconfigured', { status: 500 });
    }

    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');
    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response('Missing Svix headers', { status: 400 });
    }

    const body = await request.text();
    let evt: { type: string; data: Record<string, unknown> };
    try {
      const wh = new Webhook(secret);
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as typeof evt;
    } catch {
      return new Response('Bad signature', { status: 400 });
    }

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const data = evt.data as {
        id: string;
        email_addresses?: { email_address: string }[];
      };
      const email = data.email_addresses?.[0]?.email_address ?? '';
      await ctx.runMutation(internal.users.upsert, {
        clerkUserId: data.id,
        email,
      });
    } else if (evt.type === 'user.deleted') {
      const data = evt.data as { id: string };
      await ctx.runMutation(internal.users.softDelete, {
        clerkUserId: data.id,
      });
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;
