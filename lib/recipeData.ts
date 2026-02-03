import { Recipe } from './types';
import { estimateCaloriesByType } from './calorieCalculator';

const images = {
  breakfast: [
    '/images/avocado_toast.webp',
    '/images/smoothie_bowl.webp',
    '/images/oatmeal.webp',
    '/images/pancakes.webp'
  ],
  lunch: [
    '/images/grilled_chicken.webp',
    '/images/salmon.webp',
    '/images/steak.webp',
    '/images/pasta.webp',
    '/images/quinoa.webp'
  ],
  dinner: [
    '/images/caesar_salad.webp',
    '/images/soup.webp',
    '/images/steak.webp',
    '/images/salmon.webp'
  ],
  snack: [
    '/images/fruit_salad.webp',
    '/images/smoothie_bowl.webp'
  ]
};

const bases = [
  { type: 'breakfast' as const, titles: ['Ovos Mexidos', 'Panqueca de Aveia', 'Smoothie Detox', 'Iogurte com Frutas', 'Torrada Integral', 'Mingau de Aveia'] },
  { type: 'lunch' as const, titles: ['Frango Grelhado', 'Salmão Assado', 'Carne com Legumes', 'Bowl de Quinoa', 'Salada Proteica', 'Macarrão ao Pesto'] },
  { type: 'dinner' as const, titles: ['Sopa de Abóbora', 'Omelete de Forno', 'Wrap de Couve', 'Abobrinha Recheada', 'Salada Caesar', 'Filé de Peixe'] }
];

const tagsList = ['lowcarb', 'vegan', 'gluten_free', 'high_protein', 'ketogenic', 'balanced'];

export function generateMockRecipes(): Recipe[] {
  const generated: Recipe[] = [];

  for (let i = 0; i < 300; i++) {
    const base = bases[i % bases.length];
    const titleVariant = base.titles[i % base.titles.length];
    const randomTag = tagsList[i % tagsList.length];

    const typeImages = images[base.type] || images.breakfast;
    const img = typeImages[i % typeImages.length];

    // Usa estimativa baseada no tipo e título da receita
    const nutrition = estimateCaloriesByType(base.type, titleVariant);

    generated.push({
      id: i,
      title: `${titleVariant} ${i + 1}`,
      type: base.type,
      calories: nutrition.calories,
      carbs: nutrition.carbs,
      ingredients: 'Ingredientes variados para simulação...',
      preparation_method: 'Modo de preparo detalhado...',
      tags: [randomTag, i % 3 === 0 ? 'gluten_free' : 'balanced'],
      image_url: img,
      slug: `${titleVariant.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`
    });
  }

  return generated;
}
