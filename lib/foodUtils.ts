import { Food, FoodCategory, FoodFilters, GILevel } from './types';

export function filterFoods(foods: Food[], filters: FoodFilters): Food[] {
  return foods.filter((food) => {
    if (filters.search) {
      const term = filters.search.toLowerCase();
      if (!food.name.toLowerCase().includes(term)) return false;
    }
    if (filters.category !== 'all' && food.category !== filters.category) return false;
    if (filters.giLevel !== 'all' && food.gi_level !== filters.giLevel) return false;
    return true;
  });
}

export function getCategoryLabel(cat: FoodCategory | 'all'): string {
  const labels: Record<FoodCategory | 'all', string> = {
    all: 'Todos',
    vegetais: 'Vegetais',
    frutas: 'Frutas',
    frutos_do_mar: 'Frutos do Mar',
    carnes: 'Carnes',
    ovos_laticinios: 'Ovos e Laticínios',
    graos_leguminosas: 'Grãos e Leguminosas',
    oleaginosas_sementes: 'Oleaginosas',
    acucares: 'Açúcares',
  };
  return labels[cat];
}

export function getGILabel(level: GILevel | 'all'): string {
  const labels: Record<GILevel | 'all', string> = {
    all: 'Todos',
    low: 'Baixo',
    medium: 'Médio',
    high: 'Alto',
  };
  return labels[level];
}

export function getGIColor(level: GILevel): string {
  switch (level) {
    case 'low':
      return 'bg-gi-low text-white';
    case 'medium':
      return 'bg-gi-medium text-white';
    case 'high':
      return 'bg-gi-high text-white';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}
