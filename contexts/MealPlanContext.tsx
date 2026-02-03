'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { DayOfWeek, WeeklyPlan, RecipeSummary, MealSlot } from '@/lib/types';
import { useRecipe } from './RecipeContext';
import {
  generateWeekPlan,
  calculateDayTotals,
  savePlanToStorage,
  loadPlanFromStorage,
  calculateCalorieTarget,
} from '@/lib/mealPlanUtils';

interface MealPlanContextType {
  weeklyPlan: WeeklyPlan | null;
  selectedDay: DayOfWeek;
  setSelectedDay: (day: DayOfWeek) => void;
  generateWeeklyPlan: () => void;
  swapMeal: (day: DayOfWeek, mealIndex: number, newRecipe: RecipeSummary) => void;
  isLoading: boolean;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const { allRecipes, currentUser } = useRecipe();
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('seg');
  const [isLoading, setIsLoading] = useState(true);

  // Load plan on mount
  useEffect(() => {
    const saved = loadPlanFromStorage();
    if (saved) setWeeklyPlan(saved);
    setIsLoading(false);
  }, []);

  const generateWeeklyPlan = useCallback(() => {
    if (allRecipes.length === 0) return;

    const target = calculateCalorieTarget(currentUser);
    const newPlan = generateWeekPlan(allRecipes, target, currentUser);
    setWeeklyPlan(newPlan);
    savePlanToStorage(newPlan);
    setSelectedDay('seg'); // Reset to Monday
  }, [allRecipes, currentUser]);

  const swapMeal = useCallback((day: DayOfWeek, mealIndex: number, newRecipe: RecipeSummary) => {
    setWeeklyPlan(current => {
      if (!current) return null;

      const updatedDays = { ...current.days };
      const dayPlan = { ...updatedDays[day] };
      const newMeals = [...dayPlan.meals];

      newMeals[mealIndex] = { ...newMeals[mealIndex], recipe: newRecipe };

      const totals = calculateDayTotals(newMeals);
      dayPlan.meals = newMeals;
      dayPlan.totalCalories = totals.calories;
      dayPlan.totalCarbs = totals.carbs;

      updatedDays[day] = dayPlan;

      const updatedPlan = { ...current, days: updatedDays };
      savePlanToStorage(updatedPlan);
      return updatedPlan;
    });
  }, []);

  const contextValue = useMemo(() => ({
    weeklyPlan,
    selectedDay,
    setSelectedDay,
    generateWeeklyPlan,
    swapMeal,
    isLoading
  }), [weeklyPlan, selectedDay, generateWeeklyPlan, swapMeal, isLoading]);

  return (
    <MealPlanContext.Provider value={contextValue}>
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlan() {
  const context = useContext(MealPlanContext);
  if (context === undefined) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
}
