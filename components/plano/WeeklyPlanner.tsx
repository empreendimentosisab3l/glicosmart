'use client';

import { useState } from 'react';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { useRecipe } from '@/contexts/RecipeContext';
import { RecipeSummary } from '@/lib/types';
import { DAY_FULL_LABELS, getTargetStatus } from '@/lib/mealPlanUtils';
import DayTab from './DayTab';
import DayMealCard from './DayMealCard';
import DailySummary from './DailySummary';
import MealSwapModal from './MealSwapModal';
import ShoppingList from './ShoppingList';
import { RefreshCw, ShoppingCart, Loader2, CalendarDays } from 'lucide-react';

export default function WeeklyPlanner() {
  const {
    weeklyPlan,
    selectedDay,
    setSelectedDay,
    generateWeeklyPlan,
    swapMeal,
    isLoading: isPlanLoading
  } = useMealPlan();

  const { allRecipes } = useRecipe();

  const [swapModal, setSwapModal] = useState<{ day: any, index: number, type: string } | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);

  if (isPlanLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!weeklyPlan) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center font-sans">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-primary shadow-lg shadow-green-200 animate-in zoom-in duration-500">
          <CalendarDays className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Começe seu Plano</h1>
        <p className="text-slate-500 text-center mb-8 max-w-xs leading-relaxed">
          Gere um cardápio personalizado para a semana toda com um clique.
        </p>
        <button
          onClick={generateWeeklyPlan}
          className="w-full max-w-xs h-14 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/30 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 active:scale-95 group"
        >
          <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
          Gerar Plano Mágico
        </button>

      </div>
    );
  }

  const currentDayPlan = weeklyPlan.days[selectedDay];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-800">
      <header className="sticky top-0 z-20 px-6 py-4 glass-panel border-b-0 shadow-sm/50 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seu Plano</span>
          <h1 className="text-xl font-bold text-slate-900 leading-none mt-0.5">{DAY_FULL_LABELS[selectedDay]}</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowShoppingList(true)}
            className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-600 hover:text-primary active:scale-90"
          >
            <ShoppingCart className="h-6 w-6" />
          </button>
          <button
            onClick={generateWeeklyPlan}
            className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-600 hover:text-primary active:scale-90"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-6 space-y-6 md:max-w-none">
        <DayTab
          selectedDay={selectedDay}
          onSelect={setSelectedDay}
          getStatus={(day) => getTargetStatus(weeklyPlan.days[day].totalCalories, weeklyPlan.calorieTarget)}
        />

        <DailySummary
          dayPlan={currentDayPlan}
          calorieTarget={weeklyPlan.calorieTarget}
        />

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Refeições</h2>
          <div className="space-y-3">
            {currentDayPlan.meals.map((meal, index) => (
              <DayMealCard
                key={index}
                meal={meal}
                onSwap={() => setSwapModal({ day: selectedDay, index, type: meal.type })}
              />
            ))}
          </div>
        </div>
      </main>

      {swapModal && (
        <MealSwapModal
          mealType={swapModal.type}
          recipes={allRecipes}
          onClose={() => setSwapModal(null)}
          onSelect={(recipe) => {
            swapMeal(swapModal.day, swapModal.index, recipe);
            setSwapModal(null);
          }}
        />
      )}

      {showShoppingList && (
        <ShoppingList plan={weeklyPlan} onClose={() => setShowShoppingList(false)} />
      )}


    </div>
  );
}
