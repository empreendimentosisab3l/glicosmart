'use client';

import { GILevel } from '@/lib/types';
import { getGILabel } from '@/lib/foodUtils';

const GI_LEVELS: (GILevel | 'all')[] = ['all', 'low', 'medium', 'high'];

const GI_COLORS: Record<GILevel | 'all', { active: string; inactive: string }> = {
  all: { active: 'bg-slate-800 text-white shadow-lg shadow-slate-500/25', inactive: 'bg-slate-100 text-slate-500 hover:bg-slate-200' },
  low: { active: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25', inactive: 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100' },
  medium: { active: 'bg-amber-400 text-white shadow-lg shadow-amber-500/25', inactive: 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100' },
  high: { active: 'bg-rose-500 text-white shadow-lg shadow-rose-500/25', inactive: 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' },
};

interface FoodGIFilterProps {
  active: GILevel | 'all';
  onChange: (level: GILevel | 'all') => void;
}

export default function FoodGIFilter({ active, onChange }: FoodGIFilterProps) {
  return (
    <div className="flex gap-2">
      {GI_LEVELS.map((level) => {
        const isActive = active === level;
        const colors = GI_COLORS[level];
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${isActive ? colors.active + ' scale-105' : colors.inactive
              }`}
          >
            {getGILabel(level)}
          </button>
        );
      })}
    </div>
  );
}
