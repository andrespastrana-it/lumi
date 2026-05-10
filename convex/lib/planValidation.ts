import type { Slot, SlotBudget } from './nutrition';

const SLOTS: Slot[] = ['breakfast', 'lunch', 'dinner'];
const DAYS = [0, 1, 2, 3, 4, 5, 6];

export type DriftRecipe = {
  day: number;
  slot: string;
  kcal: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  name: string;
};

export type Drift = {
  missing: { day: number; slot: Slot }[];
  duplicates: { day: number; slot: Slot }[];
  slotErrors: {
    day: number;
    slot: Slot;
    err: number;
    kcal: number;
    target: number;
  }[];
  weekKcalErrorPct: number;
  needsRetry: boolean;
};

export const SLOT_TOLERANCE = 0.10;
const MAX_SLOT_ERRORS_BEFORE_RETRY = 3;

export function computeDrift(
  recipes: DriftRecipe[],
  perSlot: Record<Slot, SlotBudget>,
  dk: number,
): Drift {
  const byDaySlot = new Map<string, DriftRecipe[]>();
  for (const r of recipes) {
    const k = `${r.day}-${r.slot}`;
    const arr = byDaySlot.get(k) ?? [];
    arr.push(r);
    byDaySlot.set(k, arr);
  }

  const missing: { day: number; slot: Slot }[] = [];
  const duplicates: { day: number; slot: Slot }[] = [];
  const slotErrors: Drift['slotErrors'] = [];
  let weekKcal = 0;

  for (const d of DAYS) {
    for (const slot of SLOTS) {
      const k = `${d}-${slot}`;
      const arr = byDaySlot.get(k) ?? [];
      if (arr.length === 0) {
        missing.push({ day: d, slot });
        continue;
      }
      if (arr.length > 1) duplicates.push({ day: d, slot });
      const r = arr[0];
      const t = perSlot[slot];
      const err = (r.kcal - t.kcal) / t.kcal;
      weekKcal += r.kcal;
      if (Math.abs(err) > SLOT_TOLERANCE) {
        slotErrors.push({ day: d, slot, err, kcal: r.kcal, target: t.kcal });
      }
    }
  }

  const weekKcalErrorPct = dk > 0 ? (weekKcal - dk * 7) / (dk * 7) : 0;
  const needsRetry =
    missing.length > 0 ||
    duplicates.length > 0 ||
    slotErrors.length > MAX_SLOT_ERRORS_BEFORE_RETRY;

  return { missing, duplicates, slotErrors, weekKcalErrorPct, needsRetry };
}

export function buildCorrectionPrompt(
  drift: Drift,
  perSlot: Record<Slot, SlotBudget>,
): string {
  const lines: string[] = [
    'Your previous plan had these issues. Fix only these slots, keep the rest unchanged.',
    'Return the FULL 21-recipe plan again with the fixes applied.',
    '',
  ];
  for (const m of drift.missing) {
    const t = perSlot[m.slot];
    lines.push(`- Day ${m.day} ${m.slot}: MISSING, add a recipe at ~${t.kcal} kcal.`);
  }
  for (const dup of drift.duplicates) {
    lines.push(`- Day ${dup.day} ${dup.slot}: duplicated, keep only one.`);
  }
  for (const e of drift.slotErrors) {
    const pct = Math.round(e.err * 100);
    const direction = e.err > 0 ? 'over' : 'under';
    lines.push(
      `- Day ${e.day} ${e.slot}: ${e.kcal} kcal, target ${e.target} kcal (${Math.abs(pct)}% ${direction}).`,
    );
  }
  return lines.join('\n');
}
