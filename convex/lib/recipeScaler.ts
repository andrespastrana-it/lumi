export type ScalableRecipe = {
  kcal: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  ingredients: { name: string; qty: string; id?: string }[];
  [k: string]: any;
};

const SCALE_MIN = 0.85;
const SCALE_MAX = 1.15;

const QTY_NUM_UNIT = /^\s*(\d+(?:\.\d+)?)\s*(g|kg|ml|l|tbsp|tsp|cup|cups|oz)\b\s*(.*)$/i;
const QTY_INT_NAME = /^\s*(\d+)\s+(.+)$/;

export function scaleQuantityString(qty: string, factor: number): string {
  const mUnit = qty.match(QTY_NUM_UNIT);
  if (mUnit) {
    const n = parseFloat(mUnit[1]);
    const unit = mUnit[2];
    const tail = mUnit[3] ? ' ' + mUnit[3].trim() : '';
    const scaled = roundQuantity(n * factor, unit);
    const lower = unit.toLowerCase();
    const compactUnit = lower === 'g' || lower === 'kg' || lower === 'ml' || lower === 'l';
    const sep = compactUnit ? '' : ' ';
    return `${scaled}${sep}${unit}${tail}`.trim();
  }
  // integer-count items (e.g. "2 eggs") — only scale if it crosses a whole number boundary.
  const mCount = qty.match(QTY_INT_NAME);
  if (mCount) {
    const n = parseInt(mCount[1], 10);
    const rest = mCount[2];
    const scaled = Math.max(1, Math.round(n * factor));
    return `${scaled} ${rest}`;
  }
  return qty;
}

function roundQuantity(n: number, unit: string): string {
  const lower = unit.toLowerCase();
  if (lower === 'kg' || lower === 'l') {
    return n.toFixed(2).replace(/\.?0+$/, '');
  }
  if (lower === 'g' || lower === 'ml') {
    return String(Math.round(n));
  }
  if (lower === 'tbsp' || lower === 'tsp' || lower === 'cup' || lower === 'cups' || lower === 'oz') {
    const rounded = Math.round(n * 2) / 2;
    return rounded.toFixed(1).replace(/\.0$/, '');
  }
  return n.toFixed(1).replace(/\.0$/, '');
}

export function scaleRecipe<R extends ScalableRecipe>(
  recipe: R,
  targetKcal: number,
): { recipe: R; factor: number; scaled: boolean } {
  if (recipe.kcal <= 0) return { recipe, factor: 1, scaled: false };
  const factor = targetKcal / recipe.kcal;
  if (factor < SCALE_MIN || factor > SCALE_MAX) {
    return { recipe, factor, scaled: false };
  }
  const next: R = {
    ...recipe,
    kcal: Math.round(recipe.kcal * factor),
    proteinG: Math.round(recipe.proteinG * factor),
    carbG: Math.round(recipe.carbG * factor),
    fatG: Math.round(recipe.fatG * factor),
    ingredients: recipe.ingredients.map((ing) => ({
      ...ing,
      qty: scaleQuantityString(ing.qty, factor),
    })),
  };
  return { recipe: next, factor, scaled: true };
}
