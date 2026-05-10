import { describe, expect, test } from 'vitest';
import { buildCorrectionPrompt, computeDrift } from './planValidation';
import type { Slot, SlotBudget } from './nutrition';

const PER_SLOT: Record<Slot, SlotBudget> = {
  breakfast: { kcal: 500, proteinG: 30, carbG: 50, fatG: 20 },
  lunch: { kcal: 800, proteinG: 50, carbG: 80, fatG: 30 },
  dinner: { kcal: 700, proteinG: 45, carbG: 70, fatG: 25 },
};

function fullPlan(name = 'Recipe', kcalForSlot = (s: Slot) => PER_SLOT[s].kcal) {
  const out: any[] = [];
  for (let d = 0; d < 7; d++) {
    for (const slot of ['breakfast', 'lunch', 'dinner'] as Slot[]) {
      out.push({
        day: d,
        slot,
        name: `${name} d${d}-${slot}`,
        kcal: kcalForSlot(slot),
        proteinG: PER_SLOT[slot].proteinG,
        carbG: PER_SLOT[slot].carbG,
        fatG: PER_SLOT[slot].fatG,
      });
    }
  }
  return out;
}

describe('computeDrift', () => {
  test('clean plan needs no retry', () => {
    const drift = computeDrift(fullPlan(), PER_SLOT, 2000);
    expect(drift.missing).toHaveLength(0);
    expect(drift.duplicates).toHaveLength(0);
    expect(drift.slotErrors).toHaveLength(0);
    expect(drift.needsRetry).toBe(false);
  });

  test('detects missing slots', () => {
    const p = fullPlan();
    p.pop();
    const drift = computeDrift(p, PER_SLOT, 2000);
    expect(drift.missing).toHaveLength(1);
    expect(drift.needsRetry).toBe(true);
  });

  test('detects duplicates', () => {
    const p = fullPlan();
    p.push({ ...p[0] });
    const drift = computeDrift(p, PER_SLOT, 2000);
    expect(drift.duplicates).toHaveLength(1);
    expect(drift.needsRetry).toBe(true);
  });

  test('flags slot errors >10% but tolerates a couple', () => {
    const p = fullPlan(undefined, (s) => PER_SLOT[s].kcal + 25);
    const drift = computeDrift(p, PER_SLOT, 2000);
    expect(drift.slotErrors.length).toBe(0);
  });

  test('triggers retry once slot errors > 3', () => {
    const p = fullPlan();
    for (let i = 0; i < 4; i++) p[i].kcal = PER_SLOT[p[i].slot as Slot].kcal * 2;
    const drift = computeDrift(p, PER_SLOT, 2000);
    expect(drift.slotErrors.length).toBeGreaterThan(3);
    expect(drift.needsRetry).toBe(true);
  });
});

describe('buildCorrectionPrompt', () => {
  test('mentions missing and over/under slots', () => {
    const drift = {
      missing: [{ day: 2, slot: 'lunch' as Slot }],
      duplicates: [],
      slotErrors: [
        { day: 3, slot: 'dinner' as Slot, err: -0.3, kcal: 490, target: 700 },
      ],
      weekKcalErrorPct: 0,
      needsRetry: true,
    };
    const text = buildCorrectionPrompt(drift, PER_SLOT);
    expect(text).toMatch(/Day 2 lunch.*MISSING/);
    expect(text).toMatch(/Day 3 dinner.*30%.*under/);
  });
});
