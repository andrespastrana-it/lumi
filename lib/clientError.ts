export function describeConvexError(e: unknown): string {
  const err = e as { data?: { code?: string; field?: string; task?: string; message?: string }; message?: string } | null;
  const code = err?.data?.code;
  switch (code) {
    case 'UNAUTHENTICATED':
      return 'Please sign in to continue.';
    case 'INVALID_STATE':
      return err?.data?.task ? 'AI usage limit reached. Try again in a bit.' : 'Action not allowed right now.';
    case 'INVALID_ARGUMENT':
      return err?.data?.field ? `Out of range: ${err.data.field}.` : 'Invalid input.';
    case 'NOT_FOUND':
      return 'Not found.';
    case 'CONFLICT':
      return err?.data?.message ?? 'That item is already taken.';
    case 'NO_ACTIVE_PLAN':
      return 'No active plan. Finish onboarding first.';
    case 'ACCOUNT_DELETED':
      return 'This account has been deleted.';
    case 'USER_NOT_SYNCED':
      return 'Account still syncing — try again in a moment.';
    default:
      return err?.message ?? 'Something went wrong.';
  }
}
