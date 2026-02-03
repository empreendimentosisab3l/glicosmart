'use client';

import { DayPlan } from '@/lib/types';
import CalorieIndicator from './CalorieIndicator';

interface DailySummaryProps {
  dayPlan: DayPlan;
  calorieTarget: number;
}

export default function DailySummary({ dayPlan, calorieTarget }: DailySummaryProps) {
  const totalMeals = dayPlan.meals.filter((m) => m.recipe).length;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">Resumo do Dia</h3>
        <span className="text-xs text-gray-400">{totalMeals} refeições</span>
      </div>
      <CalorieIndicator current={dayPlan.totalCalories} target={calorieTarget} />
    </div>
  );
}
