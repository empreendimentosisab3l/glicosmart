'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { RecipeSummary } from '@/lib/types';
import { MEAL_LABELS } from '@/lib/mealPlanUtils';
import { X, Search } from 'lucide-react';

interface MealSwapModalProps {
  mealType: string;
  recipes: RecipeSummary[];
  onSelect: (recipe: RecipeSummary) => void;
  onClose: () => void;
}

export default function MealSwapModal({ mealType, recipes, onSelect, onClose }: MealSwapModalProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    // Filter by type primarily, but allowing flexibility could be handled here if needed.
    // For now, strict type matching to keep it simple.
    const byType = recipes.filter((r) => r.type === mealType);

    if (!search) return byType;

    const lower = search.toLowerCase();
    return byType.filter(r => r.title.toLowerCase().includes(lower));
  }, [recipes, mealType, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trocar Refeição</span>
            <h3 className="font-bold text-gray-900 text-lg">{MEAL_LABELS[mealType] || mealType}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar opção..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary focus:ring-0 text-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-3">
          {filtered.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => onSelect(recipe)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                <Image src={recipe.image_url} alt={recipe.title} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-primary transition-colors">
                  {recipe.title}
                </h4>
                <p className="text-xs text-gray-500">{recipe.calories} kcal</p>
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-xs">
              Nenhuma receita encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
