'use client';

import { DayOfWeek } from '@/lib/types';
import { DAY_LABELS, getAllDays } from '@/lib/mealPlanUtils';

interface DayTabProps {
  selectedDay: DayOfWeek;
  onSelect: (day: DayOfWeek) => void;
  getStatus: (day: DayOfWeek) => 'on_target' | 'close' | 'off_target';
}

const STATUS_COLORS = {
  on_target: 'bg-gi-low',
  close: 'bg-gi-medium',
  off_target: 'bg-gi-high',
};

export default function DayTab({ selectedDay, onSelect, getStatus }: DayTabProps) {
  const days = getAllDays();

  return (

    <div className="flex justify-between glass-panel p-2 rounded-3xl shadow-sm overflow-x-auto hide-scrollbar">
      {days.map((day) => {
        const isSelected = selectedDay === day;
        const status = getStatus(day);

        return (
          <button
            key={day}
            onClick={() => onSelect(day)}
            className={`flex flex-col items-center justify-center w-10 h-12 rounded-2xl transition-all duration-300 ${isSelected
              ? 'bg-primary text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'bg-transparent text-slate-400 hover:bg-slate-100/50 hover:text-slate-600'
              }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-tight">{DAY_LABELS[day]}</span>
            <div className={`w-1.5 h-1.5 rounded-full mt-1 transition-colors ${isSelected ? 'bg-white' : STATUS_COLORS[status] || 'bg-slate-200'
              }`} />
          </button>
        );
      })}
    </div>
  );
}
