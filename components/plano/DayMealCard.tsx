'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MealSlot } from '@/lib/types';
import { MEAL_LABELS } from '@/lib/mealPlanUtils';
import { RefreshCw } from 'lucide-react';

interface DayMealCardProps {
  meal: MealSlot;
  onSwap: () => void;
}

export default function DayMealCard({ meal, onSwap }: DayMealCardProps) {
  const label = MEAL_LABELS[meal.type] || meal.type;

  if (!meal.recipe) {
    return (
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-slate-200 transition-colors">
        <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
          <span className="text-2xl font-bold">?</span>
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
          <h3 className="font-bold text-slate-400 italic text-sm">Nenhuma receita selecionada</h3>
        </div>
        <button
          onClick={onSwap}
          className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all duration-300">
      <Link href={`/receitas/${meal.recipe.slug}`} className="block relative w-16 h-16 rounded-xl overflow-hidden shadow-sm shrink-0 group">
        <Image
          src={meal.recipe.image_url}
          alt={meal.recipe.title}
          fill
          sizes="64px"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <Link href={`/receitas/${meal.recipe.slug}`}>
          <h3 className="font-bold text-slate-900 leading-tight text-sm line-clamp-2 mb-1 hover:text-primary transition-colors">{meal.recipe.title}</h3>
        </Link>
        <p className="text-xs text-slate-500 font-medium">{meal.recipe.calories} kcal</p>
      </div>

      <button
        onClick={onSwap}
        className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-primary hover:bg-emerald-50 transition-all shrink-0 active:scale-95"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
}
