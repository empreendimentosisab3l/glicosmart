'use client';

import { useState, useEffect, useMemo } from 'react';
import { WeeklyPlan, DayOfWeek } from '@/lib/types';
import { fetchRecipeIngredientsDetailed } from '@/app/actions';
import { AggregatedIngredient, formatQuantity } from '@/lib/ingredientParser';
import { X, Copy, Check, Loader2, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';

interface ShoppingListProps {
  plan: WeeklyPlan;
  onClose: () => void;
}

// Ícones por categoria
const CATEGORY_ICONS: Record<string, string> = {
  'Proteínas': '🥩',
  'Laticínios': '🥛',
  'Vegetais': '🥬',
  'Frutas': '🍎',
  'Grãos e Farinhas': '🌾',
  'Óleos e Gorduras': '🫒',
  'Temperos': '🧂',
  'Doces e Outros': '🍯',
  'Oleaginosas': '🥜',
  'Outros': '📦'
};

// Cores por categoria
const CATEGORY_COLORS: Record<string, string> = {
  'Proteínas': 'bg-red-50 border-red-200 text-red-700',
  'Laticínios': 'bg-blue-50 border-blue-200 text-blue-700',
  'Vegetais': 'bg-green-50 border-green-200 text-green-700',
  'Frutas': 'bg-orange-50 border-orange-200 text-orange-700',
  'Grãos e Farinhas': 'bg-amber-50 border-amber-200 text-amber-700',
  'Óleos e Gorduras': 'bg-yellow-50 border-yellow-200 text-yellow-700',
  'Temperos': 'bg-purple-50 border-purple-200 text-purple-700',
  'Doces e Outros': 'bg-pink-50 border-pink-200 text-pink-700',
  'Oleaginosas': 'bg-stone-50 border-stone-200 text-stone-700',
  'Outros': 'bg-gray-50 border-gray-200 text-gray-700'
};

// Storage key para persistir estado
const STORAGE_KEY = 'glicosmart_shopping_list_checked';

export default function ShoppingList({ plan, onClose }: ShoppingListProps) {
  const [ingredients, setIngredients] = useState<AggregatedIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Carregar itens marcados do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Verificar se é do mesmo plano (comparar por ID)
          if (parsed.planId === plan.id) {
            setCheckedItems(new Set(parsed.items));
          }
        } catch (e) {
          // Ignorar erros de parse
        }
      }
    }
  }, [plan.id]);

  // Salvar itens marcados no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && checkedItems.size > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        planId: plan.id,
        items: Array.from(checkedItems)
      }));
    }
  }, [checkedItems, plan.id]);

  // Carregar ingredientes
  useEffect(() => {
    async function loadIngredients() {
      const recipeMap = new Map<string, string>();
      const days = Object.keys(plan.days) as DayOfWeek[];

      days.forEach(day => {
        const dayPlan = plan.days[day];
        dayPlan.meals.forEach(mealSlot => {
          if (mealSlot.recipe) {
            recipeMap.set(mealSlot.recipe.slug, mealSlot.recipe.title);
          }
        });
      });

      const slugs = Array.from(recipeMap.keys());
      if (slugs.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const { aggregated } = await fetchRecipeIngredientsDetailed(slugs);
        setIngredients(aggregated);

        // Expandir todas as categorias por padrão
        const categories = new Set(aggregated.map(i => i.category));
        setExpandedCategories(categories);
      } catch (err) {
        console.error("Failed to load ingredients", err);
      } finally {
        setLoading(false);
      }
    }

    loadIngredients();
  }, [plan]);

  // Agrupar ingredientes por categoria
  const groupedIngredients = useMemo(() => {
    const groups: Record<string, AggregatedIngredient[]> = {};

    ingredients.forEach(ing => {
      if (!groups[ing.category]) {
        groups[ing.category] = [];
      }
      groups[ing.category].push(ing);
    });

    // Ordenar categorias
    const orderedCategories = [
      'Proteínas', 'Laticínios', 'Vegetais', 'Frutas',
      'Grãos e Farinhas', 'Óleos e Gorduras', 'Temperos',
      'Doces e Outros', 'Oleaginosas', 'Outros'
    ];

    return orderedCategories
      .filter(cat => groups[cat]?.length > 0)
      .map(cat => ({ category: cat, items: groups[cat] }));
  }, [ingredients]);

  // Toggle item marcado
  const toggleItem = (itemKey: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  // Toggle categoria expandida
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Copiar lista para clipboard
  const copyToClipboard = () => {
    let text = '🛒 Lista de Compras - GlicoSmart\n\n';

    groupedIngredients.forEach(({ category, items }) => {
      text += `${CATEGORY_ICONS[category]} ${category}\n`;
      items.forEach(item => {
        const isChecked = checkedItems.has(`${item.name}|${item.unit}`);
        const checkMark = isChecked ? '✓ ' : '○ ';
        text += `  ${checkMark}${formatQuantity(item.totalQuantity, item.unit)} de ${item.name}\n`;
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Limpar itens marcados
  const clearChecked = () => {
    setCheckedItems(new Set());
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Contadores
  const totalItems = ingredients.length;
  const checkedCount = checkedItems.size;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[85vh] mb-20 sm:mb-0 flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Lista de Compras</h3>
                <span className="text-xs text-gray-400">
                  {loading ? 'Calculando...' : `${totalItems} itens • ${checkedCount} marcados`}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Progress bar */}
          {!loading && totalItems > 0 && (
            <div className="relative">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="absolute right-0 -top-5 text-xs font-medium text-primary">{progress}%</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-gray-400">Organizando ingredientes...</p>
            </div>
          ) : ingredients.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              Nenhum item encontrado no plano.
            </div>
          ) : (
            <div className="space-y-4">
              {groupedIngredients.map(({ category, items }) => (
                <div key={category} className="rounded-2xl border border-gray-100 overflow-hidden">
                  {/* Category header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className={`w-full flex items-center justify-between p-3 ${CATEGORY_COLORS[category]} border-b transition-colors`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{CATEGORY_ICONS[category]}</span>
                      <span className="font-semibold text-sm">{category}</span>
                      <span className="text-xs opacity-70">({items.length})</span>
                    </div>
                    {expandedCategories.has(category) ? (
                      <ChevronUp className="h-4 w-4 opacity-70" />
                    ) : (
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    )}
                  </button>

                  {/* Category items */}
                  {expandedCategories.has(category) && (
                    <div className="divide-y divide-gray-50">
                      {items.map((item) => {
                        const itemKey = `${item.name}|${item.unit}`;
                        const isChecked = checkedItems.has(itemKey);

                        return (
                          <label
                            key={itemKey}
                            className={`flex items-center justify-between p-3 cursor-pointer transition-all duration-200 ${
                              isChecked ? 'bg-gray-50' : 'hover:bg-gray-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleItem(itemKey)}
                                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-lg checked:bg-primary checked:border-primary transition-all duration-200 cursor-pointer"
                                />
                                <Check
                                  className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-all duration-200 pointer-events-none"
                                  strokeWidth={3}
                                />
                              </div>
                              <div className={`transition-all duration-200 ${isChecked ? 'opacity-50' : ''}`}>
                                <span className={`text-sm font-medium text-gray-700 ${isChecked ? 'line-through' : ''}`}>
                                  {item.name}
                                </span>
                                <p className="text-xs text-gray-400">
                                  {item.recipes.length === 1
                                    ? item.recipes[0]
                                    : `${item.recipes.length} receitas`}
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                              isChecked
                                ? 'bg-gray-200 text-gray-500'
                                : 'bg-primary/10 text-primary'
                            }`}>
                              {formatQuantity(item.totalQuantity, item.unit)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 shrink-0 space-y-2">
          {checkedCount > 0 && (
            <button
              onClick={clearChecked}
              className="w-full h-10 text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors"
            >
              Limpar itens marcados
            </button>
          )}
          <button
            onClick={copyToClipboard}
            disabled={loading || ingredients.length === 0}
            className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5" />
                <span>Lista Copiada!</span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                <span>Copiar Lista Completa</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
