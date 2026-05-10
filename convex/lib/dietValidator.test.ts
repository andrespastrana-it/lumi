import { describe, expect, test } from 'vitest';
import { validateDiet, validateDietBatch } from './dietValidator';

describe('validateDiet', () => {
  test('flags pork for no-pork', () => {
    const v = validateDiet(
      { name: 'BLT Salad', ingredients: [{ name: 'bacon', qty: '50g' }] },
      ['no-pork'],
    );
    expect(v.length).toBeGreaterThanOrEqual(1);
    expect(v[0].tag).toBe('no-pork');
  });

  test('flags fish for vegetarian', () => {
    const v = validateDiet(
      { name: 'Tuna Bowl', ingredients: [{ name: 'tuna', qty: '100g' }] },
      ['vegetarian'],
    );
    expect(v.length).toBeGreaterThanOrEqual(1);
  });

  test('allows fish for pescatarian', () => {
    const v = validateDiet(
      { name: 'Salmon Plate', ingredients: [{ name: 'salmon', qty: '120g' }] },
      ['pescatarian'],
    );
    expect(v).toHaveLength(0);
  });

  test('vegan flags eggs and dairy', () => {
    const v = validateDiet(
      {
        name: 'Omelette',
        ingredients: [
          { name: 'eggs', qty: '3 eggs' },
          { name: 'milk', qty: '50ml' },
        ],
      },
      ['vegan'],
    );
    const tags = v.map((x) => x.tag);
    expect(tags).toContain('vegan');
    expect(v.length).toBeGreaterThanOrEqual(2);
  });

  test('gluten-free flags wheat flour', () => {
    const v = validateDiet(
      { name: 'Pancakes', ingredients: [{ name: 'flour', qty: '100g' }] },
      ['gluten-free'],
    );
    expect(v.length).toBeGreaterThanOrEqual(1);
  });

  test('normalises tag spacing', () => {
    const v = validateDiet(
      { name: 'Cashew Stir Fry', ingredients: [{ name: 'cashews', qty: '30g' }] },
      ['No Nuts'],
    );
    expect(v.length).toBeGreaterThanOrEqual(1);
  });

  test('unknown tag yields no violations', () => {
    const v = validateDiet(
      { name: 'Steak', ingredients: [{ name: 'beef', qty: '200g' }] },
      ['mediterranean'],
    );
    expect(v).toHaveLength(0);
  });
});

describe('validateDietBatch', () => {
  test('returns per-recipe results only when violations exist', () => {
    const out = validateDietBatch(
      [
        { name: 'Veg Soup', ingredients: [{ name: 'carrot', qty: '100g' }] },
        { name: 'Chicken Wrap', ingredients: [{ name: 'chicken', qty: '120g' }] },
      ],
      ['vegetarian'],
    );
    expect(out).toHaveLength(1);
    expect(out[0].recipeIndex).toBe(1);
  });
});
