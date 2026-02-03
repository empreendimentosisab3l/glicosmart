'use client';

import { Search } from 'lucide-react';

interface FoodSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function FoodSearchBar({ value, onChange }: FoodSearchBarProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-100 to-primary/20 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-white rounded-full shadow-lg shadow-emerald-500/5 ring-1 ring-slate-100 flex items-center transition-transform active:scale-[0.99] duration-200">
        <div className="pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar alimento..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-3 pr-4 py-3 bg-transparent border-none rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}
