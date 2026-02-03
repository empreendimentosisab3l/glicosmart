'use client';

import { Food } from '@/lib/types';
import { getGIColor } from '@/lib/foodUtils';
import { X, ArrowLeft, Flame, Wheat, Leaf, Drumstick, Droplets, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface FoodCompareProps {
  foods: Food[];
  onClose: () => void;
}

function CompareIndicator({ value1, value2, lowerIsBetter = true }: { value1: number; value2: number; lowerIsBetter?: boolean }) {
  if (value1 === value2) return <Minus className="h-4 w-4 text-gray-400" />;

  const firstIsBetter = lowerIsBetter ? value1 < value2 : value1 > value2;

  if (firstIsBetter) {
    return <TrendingDown className="h-4 w-4 text-green-500" />;
  }
  return <TrendingUp className="h-4 w-4 text-red-500" />;
}

function StatRow({
  icon,
  label,
  values,
  unit,
  lowerIsBetter = true
}: {
  icon: React.ReactNode;
  label: string;
  values: [number, number];
  unit: string;
  lowerIsBetter?: boolean;
}) {
  const [v1, v2] = values;
  const betterIdx = lowerIsBetter
    ? (v1 <= v2 ? 0 : 1)
    : (v1 >= v2 ? 0 : 1);

  return (
    <div className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
      <div className="w-24 flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <span className={`text-sm font-bold ${betterIdx === 0 ? 'text-green-600' : 'text-gray-700'}`}>
          {v1}
          <span className="text-[10px] text-gray-400 ml-0.5">{unit}</span>
        </span>
      </div>
      <div className="w-10 flex justify-center">
        <CompareIndicator value1={v1} value2={v2} lowerIsBetter={lowerIsBetter} />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <span className={`text-sm font-bold ${betterIdx === 1 ? 'text-green-600' : 'text-gray-700'}`}>
          {v2}
          <span className="text-[10px] text-gray-400 ml-0.5">{unit}</span>
        </span>
      </div>
    </div>
  );
}

export default function FoodCompare({ foods, onClose }: FoodCompareProps) {
  const [f1, f2] = foods;

  if (!f1 || !f2) return null;

  const giLabel = (level: string) => level === 'low' ? 'Baixo' : level === 'medium' ? 'Médio' : 'Alto';

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300 mb-0 sm:mb-0 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h3 className="font-bold text-gray-900 text-lg">Comparação</h3>
          </div>
        </div>

        {/* Food headers */}
        <div className="flex p-4 pb-2 gap-2">
          {[f1, f2].map((food, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-2 ${getGIColor(food.gi_level)}`}>
                IG {food.glycemic_index}
                <span className="opacity-70">({giLabel(food.gi_level)})</span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm leading-tight">{food.name}</h4>
              <p className="text-[10px] text-gray-500 mt-1">{food.serving_size}</p>
            </div>
          ))}
        </div>

        {/* Comparison stats */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="bg-gray-50 rounded-2xl p-4">
            <StatRow
              icon={<div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-orange-400" />}
              label="Índ. Glic."
              values={[f1.glycemic_index, f2.glycemic_index]}
              unit=""
              lowerIsBetter={true}
            />
            <StatRow
              icon={<Flame className="h-4 w-4 text-orange-500" />}
              label="Calorias"
              values={[f1.calories, f2.calories]}
              unit="kcal"
              lowerIsBetter={true}
            />
            <StatRow
              icon={<Wheat className="h-4 w-4 text-amber-500" />}
              label="Carbs"
              values={[f1.net_carbs, f2.net_carbs]}
              unit="g"
              lowerIsBetter={true}
            />
            <StatRow
              icon={<Leaf className="h-4 w-4 text-green-500" />}
              label="Fibras"
              values={[f1.fiber ?? 0, f2.fiber ?? 0]}
              unit="g"
              lowerIsBetter={false}
            />
            <StatRow
              icon={<Drumstick className="h-4 w-4 text-red-500" />}
              label="Proteína"
              values={[f1.protein ?? 0, f2.protein ?? 0]}
              unit="g"
              lowerIsBetter={false}
            />
            <StatRow
              icon={<Droplets className="h-4 w-4 text-blue-500" />}
              label="Gordura"
              values={[f1.fat ?? 0, f2.fat ?? 0]}
              unit="g"
              lowerIsBetter={true}
            />
          </div>

          {/* Winner summary */}
          <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100">
            <p className="text-sm text-green-800 text-center">
              {(() => {
                // Calcular qual é melhor para diabéticos (menor IG e carbs)
                const score1 = f1.glycemic_index + f1.net_carbs;
                const score2 = f2.glycemic_index + f2.net_carbs;

                if (Math.abs(score1 - score2) < 5) {
                  return (
                    <>
                      <span className="font-bold">Ambos são similares</span> para controle glicêmico.
                    </>
                  );
                }

                const better = score1 < score2 ? f1 : f2;
                return (
                  <>
                    <span className="font-bold">{better.name}</span> é a melhor escolha para controle glicêmico.
                  </>
                );
              })()}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full h-12 bg-primary text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all active:scale-[0.98]"
          >
            Fechar Comparação
          </button>
        </div>
      </div>
    </div>
  );
}
