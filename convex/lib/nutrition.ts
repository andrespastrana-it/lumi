export type Sex = 'male' | 'female' | 'unspecified';
export type Activity = 'sed' | 'light' | 'mod' | 'active';
export type Goal = 'lose' | 'maintain' | 'gain';

const ACTIVITY_MULT: Record<Activity, number> = {
  sed: 1.2,
  light: 1.375,
  mod: 1.55,
  active: 1.725,
};

export function bmrMifflin(kg: number, cm: number, age: number, sex: Sex) {
  const base = 10 * kg + 6.25 * cm - 5 * age;
  if (sex === 'male') return base + 5;
  if (sex === 'female') return base - 161;
  // unspecified → average of male + female (off by ~83 kcal from either)
  return base - 78;
}

export function dailyKcal(args: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
  activity: Activity;
  goal: Goal;
}) {
  const tdee = bmrMifflin(args.weightKg, args.heightCm, args.age, args.sex) *
    ACTIVITY_MULT[args.activity];
  const adj = args.goal === 'lose' ? -500 : args.goal === 'gain' ? 400 : 0;
  return Math.round(tdee + adj);
}

export function macros(kcal: number, split = { p: 0.30, c: 0.40, f: 0.30 }) {
  return {
    proteinG: Math.round((kcal * split.p) / 4),
    carbG: Math.round((kcal * split.c) / 4),
    fatG: Math.round((kcal * split.f) / 9),
  };
}

export function weeksToTarget(currentKg: number, targetKg: number, weeklyKgRate = 0.5) {
  const delta = Math.abs(currentKg - targetKg);
  if (delta < 0.1) return 0;
  return Math.ceil(delta / weeklyKgRate);
}
