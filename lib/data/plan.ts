import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function useActivePlan() {
  return useQuery(api.plan.active);
}
