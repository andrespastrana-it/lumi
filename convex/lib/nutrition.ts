export type Sex = 'male' | 'female' | 'unspecified';
export type Activity = 'sed' | 'light' | 'mod' | 'active';
export type Goal = 'lose' | 'maintain' | 'gain';
export type Slot = 'breakfast' | 'lunch' | 'dinner';

export type MealTimes = {
  wake: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  sleep: string;
};

const ACTIVITY_MULT: Record<Activity, number> = {
  sed: 1.2,
  light: 1.375,
  mod: 1.55,
  active: 1.725,
};

const MIN_KCAL: Record<Sex, number> = {
  male: 1500,
  female: 1200,
  unspecified: 1350,
};

const MAX_DEFICIT_PCT = 0.25;
const MAX_SURPLUS_PCT = 0.15;

const GOAL_DELTA: Record<Goal, number> = {
  lose: -500,
  maintain: 0,
  gain: 400,
};

const MACRO_RATIOS: Record<Goal, { p: number; c: number; f: number }> = {
  lose: { p: 0.40, c: 0.35, f: 0.25 },
  maintain: { p: 0.30, c: 0.40, f: 0.30 },
  gain: { p: 0.30, c: 0.45, f: 0.25 },
};

const BMI_MIN = 16;
const BMI_MAX = 50;

export function bmrMifflin(kg: number, cm: number, age: number, sex: Sex) {
  const base = 10 * kg + 6.25 * cm - 5 * age;
  if (sex === 'male') return base + 5;
  if (sex === 'female') return base - 161;
  return base - 78;
}

export function assertBodyInRange(weightKg: number, heightCm: number) {
  const m = heightCm / 100;
  if (m <= 0) {
    throw new Error('INPUT_OUT_OF_RANGE: heightCm must be > 0');
  }
  const bmi = weightKg / (m * m);
  if (bmi < BMI_MIN || bmi > BMI_MAX) {
    throw new Error(
      `INPUT_OUT_OF_RANGE: BMI ${bmi.toFixed(1)} outside safe range [${BMI_MIN}, ${BMI_MAX}]`,
    );
  }
}

export function dailyKcal(args: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
  activity: Activity;
  goal: Goal;
}) {
  assertBodyInRange(args.weightKg, args.heightCm);
  const tdee = bmrMifflin(args.weightKg, args.heightCm, args.age, args.sex) *
    ACTIVITY_MULT[args.activity];
  let dk = tdee + GOAL_DELTA[args.goal];

  if (args.goal === 'lose') {
    dk = Math.max(dk, tdee * (1 - MAX_DEFICIT_PCT), MIN_KCAL[args.sex]);
  } else if (args.goal === 'gain') {
    dk = Math.min(dk, tdee * (1 + MAX_SURPLUS_PCT));
  }
  return Math.round(dk);
}

export function macros(kcal: number, goal: Goal = 'maintain') {
  const r = MACRO_RATIOS[goal];
  return {
    proteinG: Math.round((kcal * r.p) / 4),
    carbG: Math.round((kcal * r.c) / 4),
    fatG: Math.round((kcal * r.f) / 9),
  };
}

export function weeksToTarget(currentKg: number, targetKg: number, weeklyKgRate = 0.5) {
  const delta = Math.abs(currentKg - targetKg);
  if (delta < 0.1) return 0;
  return Math.ceil(delta / weeklyKgRate);
}

const BASE_SLOT_SPLIT: Record<Slot, number> = {
  breakfast: 0.25,
  lunch: 0.40,
  dinner: 0.35,
};

function parseHm(hm: string): number {
  const [h, m] = hm.split(':').map((s) => parseInt(s, 10));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return h * 60 + m;
}

function diffMinutes(from: string, to: string): number {
  const a = parseHm(from);
  const b = parseHm(to);
  const d = b - a;
  return d < 0 ? d + 24 * 60 : d;
}

function shift(
  split: Record<Slot, number>,
  from: Slot,
  delta: number,
  to: Slot,
): Record<Slot, number> {
  return { ...split, [from]: split[from] + delta, [to]: split[to] - delta };
}

export function slotSplitFor(mealTimes: MealTimes): Record<Slot, number> {
  let split = { ...BASE_SLOT_SPLIT };
  const wakeBfast = diffMinutes(mealTimes.wake, mealTimes.breakfast);
  const gapLD = diffMinutes(mealTimes.lunch, mealTimes.dinner);
  const dinnerSleep = diffMinutes(mealTimes.dinner, mealTimes.sleep);

  if (wakeBfast < 30) split = shift(split, 'breakfast', -0.05, 'lunch');
  if (dinnerSleep < 120) split = shift(split, 'dinner', -0.05, 'lunch');
  if (gapLD > 360) split = shift(split, 'dinner', -0.05, 'lunch');

  const sum = split.breakfast + split.lunch + split.dinner;
  return {
    breakfast: split.breakfast / sum,
    lunch: split.lunch / sum,
    dinner: split.dinner / sum,
  };
}

export type SlotBudget = { kcal: number; proteinG: number; carbG: number; fatG: number };

export function slotBudgets(
  dk: number,
  m: { proteinG: number; carbG: number; fatG: number },
  split: Record<Slot, number>,
): Record<Slot, SlotBudget> {
  const out: Record<Slot, SlotBudget> = {} as any;
  for (const slot of ['breakfast', 'lunch', 'dinner'] as Slot[]) {
    const pct = split[slot];
    out[slot] = {
      kcal: Math.round(dk * pct),
      proteinG: Math.round(m.proteinG * pct),
      carbG: Math.round(m.carbG * pct),
      fatG: Math.round(m.fatG * pct),
    };
  }
  return out;
}
