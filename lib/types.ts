export interface Recipe {
  id: number;
  title: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  carbs: number;
  ingredients: string;
  preparation_method: string;
  tags: string[];
  image_url: string;
  slug: string;
  metadata?: {
    difficulty?: string;
    time?: string;
    yield?: string;
  };
}

export type RecipeSummary = Pick<Recipe, 'id' | 'title' | 'type' | 'calories' | 'carbs' | 'tags' | 'image_url' | 'slug' | 'ingredients'>;

export interface UserProfile {
  name: string;
  diabetes_type: 'type2' | 'pre_diabetes' | 'type1' | 'unknown';
  diet_type: 'omnivore' | 'vegetarian' | 'vegan';
  allergies: string[];
  disliked_foods: string[];
  goal: string;
  restrictions: string[];
  meals_per_day: number;
  weight: number;
}

export interface RecipeSection {
  title: string;
  recipes: Recipe[];
}

export interface RecipeSectionSummary {
  title: string;
  recipes: RecipeSummary[];
}

// DailyPlan now matches DayPlan structure (array of slots) for consistency
export type DailyPlan = MealSlot[];

// === Banco de Alimentos ===

export type FoodCategory =
  | 'vegetais'
  | 'frutas'
  | 'frutos_do_mar'
  | 'carnes'
  | 'ovos_laticinios'
  | 'graos_leguminosas'
  | 'oleaginosas_sementes'
  | 'acucares';

export type GILevel = 'low' | 'medium' | 'high';

export interface Food {
  id: number;
  name: string;
  category: FoodCategory;
  serving_size: string;
  net_carbs: number;
  calories: number;
  glycemic_index: number;
  gi_level: GILevel;
  fiber?: number;
  protein?: number;
  fat?: number;
}

export interface FoodFilters {
  search: string;
  category: FoodCategory | 'all';
  giLevel: GILevel | 'all';
}

// === Plano Semanal ===

export type DayOfWeek = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';

export interface MealSlot {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe: RecipeSummary | null;
}

export interface DayPlan {
  day: DayOfWeek;
  meals: MealSlot[];
  totalCalories: number;
  totalCarbs: number;
}

export interface WeeklyPlan {
  id: string;
  createdAt: string;
  days: Record<DayOfWeek, DayPlan>;
  calorieTarget: number;
}

export interface ShoppingItem {
  ingredient: string;
  recipes: string[];
}

// === Simulador de Medicao de Glicose ===

export type MeasurementPhase = 'onboarding' | 'measuring' | 'result';

export type GlucoseStatus = 'low' | 'normal' | 'pre_diabetic' | 'high';

export interface GlucoseReading {
  id: string;
  timestamp: string;
  bpm: number;
  glucoseValue: number;
  glucoseMgDl: number;
  status: GlucoseStatus;
  stressLevel: number | null;
}
