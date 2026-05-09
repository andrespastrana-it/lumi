import { appError } from './errors';

export function assertRange(field: string, n: number, lo: number, hi: number) {
  if (!Number.isFinite(n) || n < lo || n > hi) {
    throw appError('INVALID_ARGUMENT', `${field} out of range`, { field, lo, hi });
  }
}

export const FOOD_BOUNDS = {
  kcal: [0, 5000] as const,
  macroG: [0, 500] as const,
  servingSizeG: [0, 5000] as const,
};

export const BODY_BOUNDS = {
  weightKg: [20, 400] as const,
  heightCm: [80, 250] as const,
  age: [10, 120] as const,
};
