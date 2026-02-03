'use client';

import { useState, useMemo } from 'react';
import { Food, FoodFilters } from '@/lib/types';
import { filterFoods } from '@/lib/foodUtils';
import FoodSearchBar from './FoodSearchBar';
import FoodCategoryFilter from './FoodCategoryFilter';
import FoodGIFilter from './FoodGIFilter';
import FoodCard from './FoodCard';
import FoodDetailPopup from './FoodDetailPopup';
import FoodCompare from './FoodCompare';
import { X, Scale } from 'lucide-react';

interface FoodDatabaseProps {
  foods: Food[];
}

export default function FoodDatabase({ foods }: FoodDatabaseProps) {
  const [filters, setFilters] = useState<FoodFilters>({
    search: '',
    category: 'all',
    giLevel: 'all',
  });

  // Estado para o popup de detalhes
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  // Estado para comparação
  const [compareMode, setCompareMode] = useState(false);
  const [compareFood1, setCompareFood1] = useState<Food | null>(null);
  const [compareFood2, setCompareFood2] = useState<Food | null>(null);

  const filteredFoods = useMemo(() => filterFoods(foods, filters), [foods, filters]);

  // Handler para clique no card
  const handleFoodSelect = (food: Food) => {
    if (compareMode && compareFood1) {
      // Está no modo comparação e já tem o primeiro alimento
      if (food.id !== compareFood1.id) {
        setCompareFood2(food);
        setSelectedFood(null);
      }
    } else {
      // Abre o popup de detalhes
      setSelectedFood(food);
    }
  };

  // Handler para iniciar comparação
  const handleStartCompare = (food: Food) => {
    setCompareMode(true);
    setCompareFood1(food);
    setCompareFood2(null);
    setSelectedFood(null);
  };

  // Handler para fechar tudo
  const handleCloseAll = () => {
    setSelectedFood(null);
    setCompareMode(false);
    setCompareFood1(null);
    setCompareFood2(null);
  };

  // Handler para cancelar comparação
  const handleCancelCompare = () => {
    setCompareMode(false);
    setCompareFood1(null);
    setCompareFood2(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-800">
      <header className="sticky top-0 z-20 px-6 py-4 glass-panel border-b-0 shadow-sm/50">
        <h1 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Banco de Alimentos</h1>
        <FoodSearchBar
          value={filters.search}
          onChange={(s) => setFilters((p) => ({ ...p, search: s }))}
        />
      </header>

      <main className="max-w-md mx-auto px-6 py-6 space-y-8 md:max-w-none">
        <div className="space-y-6">
          <section className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Categorias</label>
            <FoodCategoryFilter
              active={filters.category}
              onChange={(c) => setFilters((p) => ({ ...p, category: c }))}
            />
          </section>

          <section className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Índice Glicêmico</label>
            <FoodGIFilter
              active={filters.giLevel}
              onChange={(l) => setFilters((p) => ({ ...p, giLevel: l }))}
            />
          </section>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-slate-900">Resultados</h2>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{filteredFoods.length}</span>
          </div>

          <div className="space-y-3">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                isSelected={compareFood1?.id === food.id}
                onSelect={handleFoodSelect}
                isCompareMode={compareMode}
              />
            ))}

            {filteredFoods.length === 0 && (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <span className="text-2xl">🥦</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">Nenhum alimento encontrado.</p>
                <p className="text-slate-400 text-xs mt-1">Tente outros filtros.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Popup de detalhes */}
      {selectedFood && !compareMode && (
        <FoodDetailPopup
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          onCompare={handleStartCompare}
          isComparing={false}
        />
      )}

      {/* Banner de modo comparação */}
      {compareMode && compareFood1 && !compareFood2 && (
        <div className="fixed bottom-20 inset-x-0 z-40 px-4 md:max-w-md md:mx-auto">
          <div className="bg-primary text-white rounded-2xl shadow-xl p-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Scale className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{compareFood1.name}</p>
                <p className="text-xs text-white/80">Selecione outro alimento para comparar</p>
              </div>
              <button
                onClick={handleCancelCompare}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tela de comparação */}
      {compareFood1 && compareFood2 && (
        <FoodCompare
          foods={[compareFood1, compareFood2]}
          onClose={handleCloseAll}
        />
      )}
    </div>
  );
}
