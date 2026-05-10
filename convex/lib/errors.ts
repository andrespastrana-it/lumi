import { ConvexError } from 'convex/values';

export type ErrorCode =
  | 'UNAUTHENTICATED'
  | 'USER_NOT_SYNCED'
  | 'ACCOUNT_DELETED'
  | 'NOT_FOUND'
  | 'INVALID_ARGUMENT'
  | 'INVALID_STATE'
  | 'CONFLICT'
  | 'NO_ACTIVE_PLAN'
  | 'AI_FAILED';

export function appError(
  code: ErrorCode,
  message: string,
  extra?: Record<string, unknown>,
) {
  return new ConvexError({ code, message, ...extra });
}
