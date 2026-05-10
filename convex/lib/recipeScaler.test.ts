import { describe, expect, test } from 'vitest';
import { scaleQuantityString, scaleRecipe } from './recipeScaler';

describe('scaleQuantityString', () => {
  test('scales gram quantities', () => {
    expect(scaleQuantityString('150g', 1.1)).toBe('165g');
  });
  test('scales millilitre quantities', () => {
    expect(scaleQuantityString('200ml', 0.9)).toBe('180ml');
  });
  test('rounds tbsp/tsp/cup to nearest 0.5', () => {
    expect(scaleQuantityString('2 tbsp', 1.1)).toBe('2 tbsp');
    expect(scaleQuantityString('3 tsp', 1.5)).toBe('4.5 tsp');
  });
  test('scales integer counts', () => {
    expect(scaleQuantityString('2 eggs', 1.5)).toBe('3 eggs');
    expect(scaleQuantityString('4 eggs', 0.5)).toBe('2 eggs');
    expect(scaleQuantityString('1 egg', 0.4)).toBe('1 egg');
  });
  test('passes through unparseable strings', () => {
    expect(scaleQuantityString('a handful', 1.5)).toBe('a handful');
  });
});

describe('scaleRecipe', () => {
  const recipe = {
    name: 'Test',
    kcal: 500,
    proteinG: 30,
    carbG: 50,
    fatG: 20,
    ingredients: [
      { name: 'oats', qty: '60g' },
      { name: 'milk', qty: '200ml' },
      { name: 'eggs', qty: '2 eggs' },
    ],
    method: ['mix', 'cook'],
  };

  test('scales within [0.85, 1.15]', () => {
    const { recipe: out, scaled, factor } = scaleRecipe(recipe, 550);
    expect(scaled).toBe(true);
    expect(factor).toBeCloseTo(1.1, 2);
    expect(out.kcal).toBe(550);
    expect(out.ingredients[0].qty).toBe('66g');
  });

  test('skips when factor < 0.85', () => {
    const { scaled, recipe: out } = scaleRecipe(recipe, 400);
    expect(scaled).toBe(false);
    expect(out.kcal).toBe(500);
  });

  test('skips when factor > 1.15', () => {
    const { scaled } = scaleRecipe(recipe, 700);
    expect(scaled).toBe(false);
  });

  test('skips on zero kcal input', () => {
    const { scaled } = scaleRecipe({ ...recipe, kcal: 0 }, 500);
    expect(scaled).toBe(false);
  });
});
