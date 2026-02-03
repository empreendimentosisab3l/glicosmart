'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { Recipe, RecipeSummary, UserProfile, RecipeSection, DailyPlan, MealSlot } from '@/lib/types';
import { fetchRecipeSummaries } from '@/app/actions';
import { filterRecipes } from '@/lib/mealPlanUtils';

interface RecipeSectionSummary {
  title: string;
  recipes: RecipeSummary[];
}

interface RecipeContextType {
  currentUser: UserProfile | null;
  currentPlan: DailyPlan | null; // Keep full recipe for plan? Or fetch it? Let's use Summary for plan display too, it has Image/Title/Cals
  sections: RecipeSectionSummary[];
  allRecipes: RecipeSummary[];
  saveProfile: (profile: UserProfile) => void;
  generateDailyPlan: () => void;
  isLoading: boolean;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentPlan, setCurrentPlan] = useState<DailyPlan | null>(null); // Plan might need full recipe if we show ingredients, currently dashboard only shows card info.
  // Actually dashboard plan shows title/image/cals. Summary is enough. But DailyPlan type expects Recipe. 
  // For now let's keep DailyPlan expecting Recipe but cast Summary to it effectively (missing props are undefined).
  // OR update DailyPlan type. Let's cast for now to minimize changes.

  const [allRecipes, setAllRecipes] = useState<RecipeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchRecipeSummaries();
        setAllRecipes(data);
      } catch (e) {
        console.error("Failed to load recipes", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const sections = useMemo<RecipeSectionSummary[]>(() => {
    if (allRecipes.length === 0) return [];

    return [
      { title: 'Café da Manhã Energético', recipes: allRecipes.filter(r => r.type === 'breakfast') },
      { title: 'Almoço Low Carb', recipes: allRecipes.filter(r => r.type === 'lunch') },
      { title: 'Jantar Leve', recipes: allRecipes.filter(r => r.type === 'dinner') },
      { title: 'Sobremesas Saudáveis', recipes: allRecipes.filter(r => r.tags.includes('dessert')) },
      { title: 'Bebidas Refrescantes', recipes: allRecipes.filter(r => r.tags.includes('drink')) },
      { title: 'Molhos e Temperos', recipes: allRecipes.filter(r => r.tags.includes('sauce')) },
      { title: 'Receitas Rápidas', recipes: allRecipes.filter(r => r.id % 5 === 0) }
    ];
  }, [allRecipes]);

  const getRandomRecipe = (type: string): Recipe => {
    // This logic is tricky now. We only have summaries.
    // If we need FULL recipe for the plan (unlikely if just display), Summary is fine.
    // BUT types matter. 
    // Let's assume for Dashboard display, Summary is OK.
    const list = allRecipes.filter(r => r.type === type);
    if (list.length === 0) return {} as Recipe;
    const item = list[Math.floor(Math.random() * list.length)];
    // Cast to Recipe to satisfy TS constraint of DailyPlan. 
    // Danger: if any component tries to access 'ingredients' from currentPlan, it will be undefined.
    // Checking Dashboard.tsx: it uses image_url, title, calories. SAFE.
    return item as unknown as Recipe;
  };

  // Load Profile and Plan on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) setCurrentUser(JSON.parse(savedProfile));

      const savedPlan = localStorage.getItem('daily_plan');
      if (savedPlan) setCurrentPlan(JSON.parse(savedPlan));
    }
  }, []);

  const generateDailyPlan = useCallback(() => {
    if (allRecipes.length === 0 || !currentUser) return;

    try {
      // Filtra receitas baseado no perfil do usuário (alergias, dieta, etc.)
      const filteredRecipes = filterRecipes(allRecipes, currentUser);

      // Categoriza receitas filtradas
      const breakfasts = filteredRecipes.filter(r => r.type === 'breakfast');
      const lunches = filteredRecipes.filter(r => r.type === 'lunch');
      const dinners = filteredRecipes.filter(r => r.type === 'dinner');
      const snacks = filteredRecipes.filter(r => !['breakfast', 'lunch', 'dinner'].includes(r.type));

      // Fallback: se filtro for muito restritivo, usa lista original por tipo
      const getSafeList = (list: RecipeSummary[], type: string): RecipeSummary[] => {
        if (list.length > 0) return list;
        return allRecipes.filter(r => r.type === type || (type === 'snack' && !['breakfast', 'lunch', 'dinner'].includes(r.type)));
      };

      const safeBreakfasts = getSafeList(breakfasts, 'breakfast');
      const safeLunches = getSafeList(lunches, 'lunch');
      const safeDinners = getSafeList(dinners, 'dinner');
      const safeSnacks = getSafeList(snacks, 'snack');

      const getRandom = (list: RecipeSummary[]) => list[Math.floor(Math.random() * list.length)] || null;

      const mealCount = currentUser.meals_per_day || 3;
      const meals: MealSlot[] = [];

      // 1. Breakfast
      meals.push({ type: 'breakfast', recipe: getRandom(safeBreakfasts) });

      // 2. Lunch
      meals.push({ type: 'lunch', recipe: getRandom(safeLunches) });

      // 3. Snack (if 4+)
      if (mealCount >= 4) {
        meals.push({ type: 'snack', recipe: getRandom(safeSnacks) });
      }

      // 4. Second Snack (if 5)
      if (mealCount >= 5) {
        meals.push({ type: 'snack', recipe: getRandom(safeSnacks) });
      }

      // 5. Dinner
      meals.push({ type: 'dinner', recipe: getRandom(safeDinners) });

      setCurrentPlan(meals);

      if (typeof window !== 'undefined') {
        localStorage.setItem('daily_plan', JSON.stringify(meals));
      }
    } catch (error) {
      console.error('RecipeContext: Error generating daily plan', error);
    }
  }, [allRecipes, currentUser]);

  const saveProfile = useCallback((profile: UserProfile) => {
    console.log('RecipeContext: saveProfile called', profile);
    try {
      setCurrentUser(profile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_profile', JSON.stringify(profile));
      }
      generateDailyPlan(); // Generate plan on signup
    } catch (e) {
      console.error('RecipeContext: Error in saveProfile', e);
      throw e; // Re-throw so Quiz can catch it
    }
  }, [generateDailyPlan]);

  const contextValue = useMemo(() => ({
    currentUser,
    currentPlan,
    sections,
    allRecipes,
    saveProfile,
    generateDailyPlan,
    isLoading
  }), [currentUser, currentPlan, sections, allRecipes, saveProfile, generateDailyPlan, isLoading]);

  return (
    <RecipeContext.Provider value={contextValue}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipe() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
}
