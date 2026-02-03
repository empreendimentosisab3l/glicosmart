'use client';

import { Food } from '@/lib/types';
import { getGIColor } from '@/lib/foodUtils';
import { Check } from 'lucide-react';

interface FoodCardProps {
  food: Food;
  isSelected: boolean;
  onSelect: (food: Food) => void;
  isCompareMode: boolean;
}

export default function FoodCard({ food, isSelected, onSelect, isCompareMode }: FoodCardProps) {
  return (
    <button
      onClick={() => onSelect(food)}
      className={`w-full text-left bg-white rounded-2xl p-4 shadow-sm border transition-all duration-200 group ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
          : 'border-slate-100 hover:border-slate-200 hover:shadow-md active:scale-[0.98]'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-sm truncate">{food.name}</h3>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 border border-transparent shadow-sm ${getGIColor(food.gi_level)}`}>
              IG {food.glycemic_index}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-2 font-medium">Porção: {food.serving_size}</p>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-slate-900">{food.net_carbs}g</span>
              <span className="text-slate-400">Carbs</span>
            </div>
            <div className="w-px h-3 bg-slate-200"></div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-slate-900">{food.calories}</span>
              <span className="text-slate-400">Kcal</span>
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
            <Check className="h-4 w-4" strokeWidth={3} />
          </div>
        )}

        {isCompareMode && !isSelected && (
          <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 shrink-0" />
        )}
      </div>
    </button>
  );
}
