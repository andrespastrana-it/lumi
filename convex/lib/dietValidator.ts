const MEAT_TERMS = [
  'chicken', 'beef', 'pork', 'lamb', 'veal', 'turkey', 'duck', 'goose',
  'bacon', 'ham', 'prosciutto', 'chorizo', 'pepperoni', 'salami', 'sausage',
  'gelatin',
];

const FISH_TERMS = [
  'fish', 'salmon', 'tuna', 'cod', 'haddock', 'trout', 'sardine', 'anchovy',
  'mackerel', 'shrimp', 'prawn', 'crab', 'lobster', 'oyster', 'mussel', 'clam',
  'squid', 'octopus', 'caviar',
];

const PORK_TERMS = [
  'pork', 'bacon', 'ham', 'prosciutto', 'chorizo', 'pepperoni', 'lard',
  'pancetta', 'gelatin',
];

const DAIRY_TERMS = [
  'milk', 'cheese', 'yogurt', 'yoghurt', 'butter', 'cream', 'whey', 'casein',
  'ghee', 'kefir', 'halloumi', 'feta', 'mozzarella', 'cheddar', 'parmesan',
  'ricotta', 'mascarpone',
];

const EGG_TERMS = ['egg', 'eggs', 'mayonnaise', 'mayo'];

const GLUTEN_TERMS = [
  'wheat', 'flour', 'barley', 'rye', 'bulgur', 'couscous', 'seitan', 'soy sauce',
  'bread', 'pasta', 'noodle', 'noodles', 'cracker', 'crackers',
];

const NUT_TERMS = [
  'almond', 'almonds', 'cashew', 'cashews', 'walnut', 'walnuts',
  'pecan', 'pecans', 'hazelnut', 'hazelnuts', 'pistachio', 'pistachios',
  'macadamia', 'brazil nut', 'pine nut',
];

const BANNED: Record<string, string[]> = {
  vegetarian: [...MEAT_TERMS, ...FISH_TERMS],
  pescatarian: MEAT_TERMS,
  vegan: [
    ...MEAT_TERMS, ...FISH_TERMS, ...DAIRY_TERMS, ...EGG_TERMS,
    'honey', 'gelatin',
  ],
  'no-pork': PORK_TERMS,
  'no-beef': ['beef', 'veal', 'steak'],
  'no-fish': FISH_TERMS,
  'gluten-free': GLUTEN_TERMS,
  'dairy-free': DAIRY_TERMS,
  'no-dairy': DAIRY_TERMS,
  'lactose-free': DAIRY_TERMS,
  'no-nuts': NUT_TERMS,
  'nut-free': NUT_TERMS,
};

export type DietRecipe = {
  name: string;
  ingredients: { name: string; qty: string }[];
};

export type DietViolation = {
  tag: string;
  term: string;
  recipeName: string;
  field: 'name' | 'ingredient';
  ingredientName?: string;
};

function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim().replace(/\s+/g, '-');
}

function containsTerm(haystack: string, term: string): boolean {
  const pattern = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'i');
  return pattern.test(haystack);
}

export function validateDiet(recipe: DietRecipe, tags: string[]): DietViolation[] {
  const violations: DietViolation[] = [];
  const nameLc = recipe.name.toLowerCase();
  for (const rawTag of tags) {
    const tag = normalizeTag(rawTag);
    const banned = BANNED[tag];
    if (!banned) continue;
    for (const term of banned) {
      if (containsTerm(nameLc, term)) {
        violations.push({ tag, term, recipeName: recipe.name, field: 'name' });
      }
      for (const ing of recipe.ingredients) {
        if (containsTerm(ing.name.toLowerCase(), term)) {
          violations.push({
            tag,
            term,
            recipeName: recipe.name,
            field: 'ingredient',
            ingredientName: ing.name,
          });
        }
      }
    }
  }
  return violations;
}

export function validateDietBatch(
  recipes: DietRecipe[],
  tags: string[],
): { recipeIndex: number; violations: DietViolation[] }[] {
  const out: { recipeIndex: number; violations: DietViolation[] }[] = [];
  for (let i = 0; i < recipes.length; i++) {
    const v = validateDiet(recipes[i], tags);
    if (v.length > 0) out.push({ recipeIndex: i, violations: v });
  }
  return out;
}
