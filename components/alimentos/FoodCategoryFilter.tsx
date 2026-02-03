'use client';

import { FoodCategory } from '@/lib/types';
import { getCategoryLabel } from '@/lib/foodUtils';

const CATEGORIES: (FoodCategory | 'all')[] = [
  'all',
  'vegetais',
  'frutas',
  'carnes',
  'frutos_do_mar',
  'ovos_laticinios',
  'graos_leguminosas',
  'oleaginosas_sementes',
  'acucares',
];

interface FoodCategoryFilterProps {
  active: FoodCategory | 'all';
  onChange: (cat: FoodCategory | 'all') => void;
}

export default function FoodCategoryFilter({ active, onChange }: FoodCategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${isActive
              ? 'bg-primary text-white shadow-lg shadow-emerald-500/25 scale-105'
              : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300'
              }`}
          >
            {getCategoryLabel(cat)}
          </button>
        );
      })}
    </div>
  );
}
