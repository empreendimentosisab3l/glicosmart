'use client';

import { Food } from '@/lib/types';
import { getGIColor } from '@/lib/foodUtils';
import { X, Scale, Flame, Wheat, Leaf, Drumstick, Droplets } from 'lucide-react';

interface FoodDetailPopupProps {
  food: Food;
  onClose: () => void;
  onCompare: (food: Food) => void;
  isComparing: boolean;
  compareFood?: Food | null;
}

export default function FoodDetailPopup({
  food,
  onClose,
  onCompare,
  isComparing,
  compareFood
}: FoodDetailPopupProps) {
  const giColorClass = getGIColor(food.gi_level);

  const giLabel = food.gi_level === 'low' ? 'Baixo' : food.gi_level === 'medium' ? 'Médio' : 'Alto';

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl shadow-xl animate-in slide-in-from-bottom duration-300 mb-20 sm:mb-0">
        {/* Header com badge de IG */}
        <div className="p-4 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{food.name}</h3>
              <p className="text-xs text-gray-500 mt-1">Porção: {food.serving_size}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors -mr-1 -mt-1"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Badge de IG grande */}
          <div className={`inline-flex items-center gap-2 mt-3 px-3 py-2 rounded-xl ${giColorClass}`}>
            <span className="text-2xl font-bold">{food.glycemic_index}</span>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold opacity-80">Índice Glicêmico</p>
              <p className="text-xs font-semibold">{giLabel}</p>
            </div>
          </div>
        </div>

        {/* Nutrientes em grid compacto */}
        <div className="p-4 grid grid-cols-3 gap-2">
          <NutrientCard
            icon={<Flame className="h-4 w-4" />}
            value={food.calories}
            unit="kcal"
            label="Calorias"
            color="text-orange-500 bg-orange-50"
          />
          <NutrientCard
            icon={<Wheat className="h-4 w-4" />}
            value={food.net_carbs}
            unit="g"
            label="Carbs"
            color="text-amber-500 bg-amber-50"
          />
          <NutrientCard
            icon={<Leaf className="h-4 w-4" />}
            value={food.fiber ?? 0}
            unit="g"
            label="Fibras"
            color="text-green-500 bg-green-50"
          />
          <NutrientCard
            icon={<Drumstick className="h-4 w-4" />}
            value={food.protein ?? 0}
            unit="g"
            label="Proteína"
            color="text-red-500 bg-red-50"
          />
          <NutrientCard
            icon={<Droplets className="h-4 w-4" />}
            value={food.fat ?? 0}
            unit="g"
            label="Gordura"
            color="text-blue-500 bg-blue-50"
          />
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50">
            <span className="text-xs text-gray-400 mb-1">Categoria</span>
            <span className="text-[10px] font-bold text-gray-600 text-center leading-tight">
              {formatCategory(food.category)}
            </span>
          </div>
        </div>

        {/* Botão de comparar */}
        <div className="p-4 pt-0">
          {isComparing && compareFood ? (
            <div className="text-center py-2 text-sm text-gray-500">
              Selecione outro alimento para comparar com <span className="font-semibold">{compareFood.name}</span>
            </div>
          ) : (
            <button
              onClick={() => onCompare(food)}
              className="w-full h-12 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
            >
              <Scale className="h-5 w-5" />
              Comparar com outro alimento
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NutrientCard({
  icon,
  value,
  unit,
  label,
  color
}: {
  icon: React.ReactNode;
  value: number;
  unit: string;
  label: string;
  color: string;
}) {
  return (
    <div className={`flex flex-col items-center p-2 rounded-xl ${color.split(' ')[1]}`}>
      <div className={`${color.split(' ')[0]} mb-1`}>{icon}</div>
      <span className="text-sm font-bold text-gray-900">
        {value}<span className="text-[10px] text-gray-400 ml-0.5">{unit}</span>
      </span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  );
}

function formatCategory(category: string): string {
  const map: Record<string, string> = {
    'frutas': 'Frutas',
    'vegetais': 'Vegetais',
    'graos_leguminosas': 'Grãos',
    'carnes': 'Carnes',
    'frutos_do_mar': 'Frutos do Mar',
    'ovos_laticinios': 'Laticínios',
    'oleaginosas_sementes': 'Oleaginosas',
    'acucares': 'Açúcares',
  };
  return map[category] || category;
}
