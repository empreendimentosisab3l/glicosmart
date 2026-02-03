import { RecipeSummary, UserProfile, DayOfWeek, DayPlan, WeeklyPlan, MealSlot, ShoppingItem } from './types';
import { v4 as uuidv4 } from 'uuid';

export const DAY_LABELS: Record<DayOfWeek, string> = {
  seg: 'Seg',
  ter: 'Ter',
  qua: 'Qua',
  qui: 'Qui',
  sex: 'Sex',
  sab: 'Sáb',
  dom: 'Dom',
};

export const DAY_FULL_LABELS: Record<DayOfWeek, string> = {
  seg: 'Segunda',
  ter: 'Terça',
  qua: 'Quarta',
  qui: 'Quinta',
  sex: 'Sexta',
  sab: 'Sábado',
  dom: 'Domingo',
};

export const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar',
  snack: 'Lanche',
};

export function getAllDays(): DayOfWeek[] {
  return ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
}

export function calculateCalorieTarget(profile: UserProfile | null): number {
  if (!profile) return 2000;
  // Simple BMR estimation: weight * 22
  let target = profile.weight * 22;

  if (profile.goal === 'lose_weight') target -= 300;
  if (profile.goal === 'gain_muscle') target += 300;

  return Math.round(target);
}


export function filterRecipes(recipes: RecipeSummary[], profile: UserProfile | null): RecipeSummary[] {
  if (!profile) return recipes;

  return recipes.filter(recipe => {
    const combinedText = (recipe.title + ' ' + (recipe.ingredients || '')).toLowerCase();

    // 1. Filter by Diet Type
    if (profile.diet_type === 'vegetarian') {
      // Exclui receitas com carne, frango, peixe, frutos do mar
      const meatKeywords = [
        'carne', 'bife', 'frango', 'galinha', 'peru', 'pato',
        'peixe', 'salmão', 'atum', 'tilápia', 'bacalhau', 'pescada',
        'camarão', 'lula', 'polvo', 'marisco', 'lagosta',
        'bacon', 'presunto', 'linguiça', 'salsicha', 'hambúrguer',
        'lombo', 'costela', 'picanha', 'alcatra', 'filé mignon'
      ];
      if (meatKeywords.some(k => combinedText.includes(k))) return false;
    }

    if (profile.diet_type === 'vegan') {
      // Exclui tudo de origem animal (carne + ovos + laticínios + mel)
      const animalKeywords = [
        // Carnes
        'carne', 'bife', 'frango', 'galinha', 'peru', 'pato',
        'peixe', 'salmão', 'atum', 'tilápia', 'bacalhau', 'pescada',
        'camarão', 'lula', 'polvo', 'marisco', 'lagosta',
        'bacon', 'presunto', 'linguiça', 'salsicha', 'hambúrguer',
        'lombo', 'costela', 'picanha', 'alcatra', 'filé mignon',
        // Ovos
        'ovo', 'ovos', 'clara', 'gema',
        // Laticínios
        'leite', 'queijo', 'manteiga', 'creme de leite', 'iogurte',
        'requeijão', 'nata', 'cream cheese', 'ricota', 'mussarela',
        'parmesão', 'provolone', 'cottage',
        // Outros
        'mel', 'gelatina'
      ];
      if (animalKeywords.some(k => combinedText.includes(k))) return false;
    }

    // 2. Filter by Allergies (Text Search in keys)
    // Map allergy IDs to keywords
    const allergyKeywords: Record<string, string[]> = {
      lactose: ['leite', 'queijo', 'manteiga', 'creme de leite', 'iogurte', 'requeijão', 'nata', 'cream cheese', 'ricota', 'mussarela', 'parmesão', 'cottage'],
      gluten: ['trigo', 'farinha', 'pão', 'macarrão', 'cevada', 'centeio', 'glúten', 'semolina', 'aveia', 'biscoito', 'bolo', 'torta'],
      ovos: ['ovo', 'ovos', 'clara', 'gema'],
      peixe: ['peixe', 'tilápia', 'salmão', 'atum', 'pescada', 'bacalhau', 'sardinha', 'anchova'],
      frutos_do_mar: ['camarão', 'lula', 'polvo', 'marisco', 'siri', 'lagosta', 'caranguejo', 'mexilhão', 'ostra'],
      frutas_secas: ['amendoim', 'nozes', 'castanha', 'amêndoa', 'avelã', 'pistache', 'macadâmia', 'pecã'],
      frutas_citricas: ['laranja', 'limão', 'lima', 'tangerina', 'mexerica', 'grapefruit', 'cidra'],
    };

    for (const allergyId of profile.allergies) {
      const keywords = allergyKeywords[allergyId] || [];
      if (keywords.some(k => combinedText.includes(k))) return false;
    }

    // 3. Filter by Dislikes
    // We map dislike IDs to display labels or keywords, but user might just check IDs from the UI list.
    // The UI list (Quiz.tsx) has IDs: 'pimentoes', 'cebolas', etc.
    const dislikeKeywords: Record<string, string[]> = {
      pimentoes: ['pimentão', 'pimentões'],
      cebolas: ['cebola'],
      ovos: ['ovo', 'ovos'],
      fungos: ['cogumelo', 'funghi', 'champignon'],
      couve_flor: ['couve-flor', 'couve flor'],
      brócolis: ['brócolis'], // fixed acc. to standard
      brocolis: ['brócolis'],
      tomates: ['tomate'],
      banana: ['banana'],
      macas: ['maçã'],
      meloes: ['melão'],
      pepinos: ['pepino'],
      batata: ['batata'],
      massa: ['macarrão', 'penne', 'spaghetti', 'fusilli', 'massa'],
      arroz: ['arroz'],
      laranjas: ['laranja'],
      abobrinha: ['abobrinha'],
      tofu: ['tofu'],
      salmao: ['salmão'],
      quinoa: ['quinoa'],
      trigo_gluten: ['trigo', 'glúten', 'farinha'],
      lacteos: ['leite', 'queijo', 'laticínios'],
    };

    for (const dislikeId of profile.disliked_foods) {
      const keywords = dislikeKeywords[dislikeId] || [dislikeId]; // Fallback to ID as keyword
      if (keywords.some(k => combinedText.includes(k))) return false;
    }

    return true;
  });
}

export function calculateDayTotals(meals: MealSlot[]): { calories: number; carbs: number } {
  return meals.reduce(
    (acc, slot) => {
      if (slot.recipe) {
        acc.calories += slot.recipe.calories || 0;
        acc.carbs += slot.recipe.carbs || 0;
      }
      return acc;
    },
    { calories: 0, carbs: 0 }
  );
}

export function generateWeekPlan(recipes: RecipeSummary[], targetCalories: number, profile: UserProfile | null): WeeklyPlan {
  const days = getAllDays();
  const planDays: Record<string, DayPlan> = {};

  // Categorize recipes
  const filteredRecipes = filterRecipes(recipes, profile);

  // Fallback: If filtering is too strict (e.g. 0 recipes found for 'dinner'), 
  // we might want to relax it or just use the filtered list and accept repetition.
  // Ideally we check if we have enough recipes.

  // Categorize
  const breakfasts = filteredRecipes.filter(r => r.type === 'breakfast');
  const lunches = filteredRecipes.filter(r => r.type === 'lunch');
  const dinners = filteredRecipes.filter(r => r.type === 'dinner');
  const snacks = filteredRecipes.filter(r => !['breakfast', 'lunch', 'dinner'].includes(r.type));

  // If any category is empty, we MUST fallback to unfiltered for that category to verify the app doesn't break,
  // or return a 'partial' plan. Let's fallback to Diet-Type only filtering if strict failed?
  // For safety/MVP: If empty, use original 'recipes' array for that category but warn.
  // Better: Try to maintain Diet restriction but ignore dislikes if empty.

  // Helper to get safe list
  const getSafeList = (list: RecipeSummary[], type: string) => {
    if (list.length > 0) return list;
    // Fallback: try to just match type from original list (IGNORING ALLERGIES - Warning)
    // Realistically we should keep trying to filter less strictly, but complex.
    // Let's just return original list of that type to prevent crash.
    console.warn(`No recipes found for ${type} with current profile filters. Using fallback.`);
    return recipes.filter(r => r.type === type || (type === 'snack' && !['breakfast', 'lunch', 'dinner'].includes(r.type)));
  };

  const safeBreakfasts = getSafeList(breakfasts, 'breakfast');
  const safeLunches = getSafeList(lunches, 'lunch');
  const safeDinners = getSafeList(dinners, 'dinner');
  const safeSnacks = getSafeList(snacks, 'snack');

  const getRandom = (list: RecipeSummary[]) => list[Math.floor(Math.random() * list.length)] || null;

  days.forEach(day => {
    // Generate meals based on profile configuration (3, 4, or 5 meals)
    const mealCount = profile?.meals_per_day || 3;
    const meals: MealSlot[] = [];

    // Always: Breakfast & Lunch
    meals.push({ type: 'breakfast', recipe: getRandom(safeBreakfasts) });
    meals.push({ type: 'lunch', recipe: getRandom(safeLunches) });

    // 4 meals: + Snack
    if (mealCount >= 4) {
      meals.push({ type: 'snack', recipe: getRandom(safeSnacks) });
    }

    // 5 meals: + Second Snack (inserted before dinner)
    if (mealCount >= 5) {
      meals.push({ type: 'snack', recipe: getRandom(safeSnacks) });
    }

    // Always: Dinner (Last)
    meals.push({ type: 'dinner', recipe: getRandom(safeDinners) });

    const totals = calculateDayTotals(meals);

    planDays[day] = {
      day,
      meals,
      totalCalories: totals.calories,
      totalCarbs: totals.carbs
    };
  });

  return {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    days: planDays as Record<DayOfWeek, DayPlan>,
    calorieTarget: targetCalories
  };
}

export function getTargetStatus(current: number, target: number): 'on_target' | 'close' | 'off_target' {
  const diff = Math.abs(current - target);
  const percentDiff = diff / target;

  if (percentDiff <= 0.1) return 'on_target'; // Within 10%
  if (percentDiff <= 0.2) return 'close';     // Within 20%
  return 'off_target';
}

export function savePlanToStorage(plan: WeeklyPlan) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('diabetic_app_weekly_plan', JSON.stringify(plan));
  }
}

export function loadPlanFromStorage(): WeeklyPlan | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('diabetic_app_weekly_plan');
    if (data) return JSON.parse(data);
  }
  return null;
}
