import { describe, expect, test } from 'vitest';
import {
  assertBodyInRange,
  bmrMifflin,
  dailyKcal,
  macros,
  slotBudgets,
  slotSplitFor,
  weeksToTarget,
} from './nutrition';

describe('bmrMifflin', () => {
  test('male offset is +5', () => {
    expect(bmrMifflin(80, 180, 30, 'male')).toBe(10 * 80 + 6.25 * 180 - 5 * 30 + 5);
  });
  test('female offset is -161', () => {
    expect(bmrMifflin(70, 170, 30, 'female')).toBe(10 * 70 + 6.25 * 170 - 5 * 30 - 161);
  });
  test('unspecified offset is -78', () => {
    expect(bmrMifflin(70, 170, 30, 'unspecified')).toBe(10 * 70 + 6.25 * 170 - 5 * 30 - 78);
  });
});

describe('assertBodyInRange', () => {
  test('accepts healthy BMI', () => {
    expect(() => assertBodyInRange(70, 175)).not.toThrow();
  });
  test('rejects BMI < 16', () => {
    expect(() => assertBodyInRange(35, 180)).toThrow(/INPUT_OUT_OF_RANGE/);
  });
  test('rejects BMI > 50', () => {
    expect(() => assertBodyInRange(200, 170)).toThrow(/INPUT_OUT_OF_RANGE/);
  });
  test('rejects non-positive height', () => {
    expect(() => assertBodyInRange(70, 0)).toThrow(/INPUT_OUT_OF_RANGE/);
  });
});

describe('dailyKcal clamps', () => {
  test('lose floors to female minimum 1200', () => {
    const dk = dailyKcal({
      weightKg: 45, heightCm: 160, age: 30,
      sex: 'female', activity: 'sed', goal: 'lose',
    });
    expect(dk).toBeGreaterThanOrEqual(1200);
  });

  test('lose floors to male minimum 1500', () => {
    const dk = dailyKcal({
      weightKg: 55, heightCm: 175, age: 30,
      sex: 'male', activity: 'sed', goal: 'lose',
    });
    expect(dk).toBeGreaterThanOrEqual(1500);
  });

  test('lose deficit does not exceed 25% of TDEE', () => {
    const dk = dailyKcal({
      weightKg: 95, heightCm: 180, age: 30,
      sex: 'male', activity: 'mod', goal: 'lose',
    });
    const tdee = bmrMifflin(95, 180, 30, 'male') * 1.55;
    expect(dk).toBeGreaterThanOrEqual(Math.round(tdee * 0.75) - 1);
  });

  test('gain surplus does not exceed 15% of TDEE', () => {
    const dk = dailyKcal({
      weightKg: 60, heightCm: 170, age: 25,
      sex: 'male', activity: 'sed', goal: 'gain',
    });
    const tdee = bmrMifflin(60, 170, 25, 'male') * 1.2;
    expect(dk).toBeLessThanOrEqual(Math.round(tdee * 1.15) + 1);
  });

  test('maintain returns TDEE rounded', () => {
    const dk = dailyKcal({
      weightKg: 75, heightCm: 175, age: 30,
      sex: 'male', activity: 'mod', goal: 'maintain',
    });
    const tdee = bmrMifflin(75, 175, 30, 'male') * 1.55;
    expect(dk).toBe(Math.round(tdee));
  });
});

describe('macros — goal-aware', () => {
  test('lose tilts protein to 40%', () => {
    const m = macros(2000, 'lose');
    expect(m.proteinG).toBe(Math.round((2000 * 0.40) / 4));
    expect(m.carbG).toBe(Math.round((2000 * 0.35) / 4));
    expect(m.fatG).toBe(Math.round((2000 * 0.25) / 9));
  });
  test('maintain uses 30/40/30', () => {
    const m = macros(2000, 'maintain');
    expect(m.proteinG).toBe(Math.round((2000 * 0.30) / 4));
    expect(m.carbG).toBe(Math.round((2000 * 0.40) / 4));
    expect(m.fatG).toBe(Math.round((2000 * 0.30) / 9));
  });
  test('gain raises carbs to 45%', () => {
    const m = macros(2000, 'gain');
    expect(m.carbG).toBe(Math.round((2000 * 0.45) / 4));
  });
});

describe('weeksToTarget', () => {
  test('returns 0 if delta < 0.1', () => {
    expect(weeksToTarget(80, 80.05)).toBe(0);
  });
  test('ceil at 0.5 kg/wk default', () => {
    expect(weeksToTarget(80, 75)).toBe(10);
  });
});

const TIMES = {
  wake: '07:00',
  breakfast: '07:30',
  lunch: '13:00',
  dinner: '20:00',
  sleep: '23:00',
};

describe('slotSplitFor', () => {
  test('sums to 1', () => {
    const s = slotSplitFor(TIMES);
    expect(s.breakfast + s.lunch + s.dinner).toBeCloseTo(1, 5);
  });
  test('short wake→breakfast lightens breakfast', () => {
    const tight = { ...TIMES, breakfast: '07:10' };
    const a = slotSplitFor(TIMES);
    const b = slotSplitFor(tight);
    expect(b.breakfast).toBeLessThan(a.breakfast);
  });
  test('late dinner lightens dinner', () => {
    const late = { ...TIMES, dinner: '22:00', sleep: '23:00' };
    const a = slotSplitFor(TIMES);
    const b = slotSplitFor(late);
    expect(b.dinner).toBeLessThan(a.dinner);
  });
});

describe('slotBudgets', () => {
  test('per-slot kcal approximates daily total', () => {
    const m = macros(2000, 'maintain');
    const b = slotBudgets(2000, m, { breakfast: 0.25, lunch: 0.40, dinner: 0.35 });
    const sum = b.breakfast.kcal + b.lunch.kcal + b.dinner.kcal;
    expect(Math.abs(sum - 2000)).toBeLessThanOrEqual(2);
  });
});
