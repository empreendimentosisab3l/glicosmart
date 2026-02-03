import rawData from '@/src/data/recipes.json';
import { Recipe } from './types';
import { getRecipeNutrition } from './calorieCalculator';

// Map file sources to Dashboard Categories
const PDF_MAP: Record<string, Recipe['type']> = {
  'Parte+1+-+Café+da+Manhã+.pdf': 'breakfast',
  'Parte+2+-+Almoço.pdf': 'lunch',
  'Parte+3+-+Jantar.pdf': 'dinner',
  'Parte+4+-+Sobremesas.pdf': 'snack',
  'Parte+5+-+Molhos+e+Temperos.pdf': 'snack', // Treat as snack/side
  'Parte+6+-+Bebidas.pdf': 'snack' // Treat as snack/drink
};

// Placeholder images to make the UI look alive
const PLACEHOLDERS = {
  breakfast: {
    pancakes: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80',
      'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=500&q=80',
      'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500&q=80',
    ],
    eggs: [
      'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500&q=80',
      'https://images.unsplash.com/photo-1593584785033-9c7604d0863f?w=500&q=80', // Fried Egg
      'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500&q=80',
    ],
    bread: [
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80',
      'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=500&q=80', // Fixed Bread (Loaf)
    ],
    bowl: [
      'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&q=80', // Oatmeal
      'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=500&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', // Fixed Bowl (Generic)
    ],
    cake: [
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80', // Fixed Muffins (Duplicate of working cake)
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80', // Cupcake (New ID)
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80',
    ],
    generic: [
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=500&q=80', // Food Spread
      'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=500&q=80',
    ]
  },
  lunch: {
    salad: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80', // Bowl
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', // Salad
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80', // Avocado Salad
    ],
    meat: [
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80', // Steak
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80', // Roast
    ],
    chicken: [
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&q=80', // Chicken Grill
      'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&q=80', // Chicken Plate
    ],
    fish: [
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80', // Salmon
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&q=80', // Meat/Fish dish
      'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&q=80', // Grilled
    ],
    soup: [
      'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=500&q=80', // Soup L
      'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&q=80', // Fixed Soup 2 (Using working generic)
    ],
    generic: [
      'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80',
    ]
  },
  snack: {
    cake: [
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
    ],
    drink: [
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80', // Cocktails/Juice
      'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80', // Green Smoothie
      'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=500&q=80', // Green Smoothie
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80', // Iced Tea/Water
    ],
    sauce: [
      'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=500&q=80', // Pouring Sauce/Ketchup
      'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=500&q=80', // White Sauce
      'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=500&q=80', // Texture/Sauce Close-up
    ],
    generic: [
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80',
      'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?w=500&q=80',
    ],
  },
  // Re-use lunch logic for dinner but maybe different default
  get dinner() { return this.lunch; }
};

function getImageForRecipe(type: Recipe['type'], title: string, tags: string[] = []) {
  const t = title.toLowerCase();

  // Select Category Bucket
  let category: { generic: string[]; [key: string]: string[] } = PLACEHOLDERS.breakfast;
  if (type === 'lunch' || type === 'dinner') category = PLACEHOLDERS.lunch;
  if (type === 'snack') category = PLACEHOLDERS.snack;

  let list = category.generic;

  // PRIORITY: Logic based on explicit Tags (from filename)
  if (tags.includes('drink')) {
    list = (PLACEHOLDERS.snack as any).drink;
    return list[title.length % list.length];
  }
  if (tags.includes('sauce')) {
    list = (PLACEHOLDERS.snack as any).sauce;
    return list[title.length % list.length];
  }
  if (tags.includes('dessert')) {
    list = (PLACEHOLDERS.snack as any).cake;
    // Fallthrough to keyword refinement for specific desserts
  }

  // Logic for Breakfast
  if (type === 'breakfast') {
    const b = category as any;
    if (t.includes('panqueca') || t.includes('waffle')) list = b.pancakes;
    else if (t.includes('ovo') || t.includes('omelete') || t.includes('frittata')) list = b.eggs;
    else if (t.includes('pão') || t.includes('pao') || t.includes('tosta') || t.includes('sanduiche')) list = b.bread;
    else if (t.includes('bolo') || t.includes('muffin') || t.includes('torta') || t.includes('cookie') || t.includes('biscoito')) list = b.cake;
    else if (t.includes('iogurte') || t.includes('mingau') || t.includes('aveia') || t.includes('bowl') || t.includes('granola')) list = b.bowl;
  }
  // Logic for Lunch/Dinner
  else if (type === 'lunch' || type === 'dinner') {
    const l = category as any;
    if (t.includes('salada') || t.includes('legumes') || t.includes('vegetais')) list = l.salad;
    else if (t.includes('frango') || t.includes('galinha') || t.includes('peru')) list = l.chicken;
    else if (t.includes('carne') || t.includes('bife') || t.includes('hamburguer') || t.includes('picadinho') || t.includes('lombo')) list = l.meat;
    else if (t.includes('peixe') || t.includes('salmão') || t.includes('atum') || t.includes('camarão')) list = l.fish;
    else if (t.includes('sopa') || t.includes('caldo') || t.includes('creme')) list = l.soup;
  }
  // Logic for Snacks/Desserts (only if not caught by tags above)
  else if (type === 'snack') {
    const s = category as any;
    if (t.includes('suco') || t.includes('vitamina') || t.includes('chá') || t.includes('smoothie') || t.includes('café') || t.includes('drink') || t.includes('shake')) list = s.drink;
    else if (t.includes('bolo') || t.includes('torta') || t.includes('doce') || t.includes('mousse') || t.includes('pudim')) list = s.cake;
    else if (t.includes('molho') || t.includes('pesto') || t.includes('maionese') || t.includes('ketchup') || t.includes('pasta')) list = s.sauce;
  }

  // Deterministic selection
  const index = title.length % list.length;
  return list[index];
}

function normalizeTitle(title: string) {
  let normalized = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase().replace(/\s+/g, ' ').trim();

  // Remove títulos incompletos que terminam com conectivos
  if (normalized.endsWith(' e')) normalized = normalized.slice(0, -2).trim();
  if (normalized.endsWith(' de')) normalized = normalized.slice(0, -3).trim();
  if (normalized.endsWith(' com')) normalized = normalized.slice(0, -4).trim();

  return normalized;
}

// Verifica se uma linha parece ser instrução (não ingrediente)
function looksLikeInstruction(line: string): boolean {
  const lower = line.toLowerCase().trim();

  // Padrões que indicam instruções
  const instructionPatterns = [
    /^(em uma|numa|no|na|adicione|misture|bata|mexa|aqueça|coloque|despeje|deixe|sirva|decore|asse|cozinhe|frite|leve|retire|reserve|peneire|unte)/i,
    /^(até obter|até ficar|até que|até dourar)/i,
    /(misture|bata|mexa|adicione)\s+(até|bem|tudo)/i,
    /uma (tigela|panela|frigideira|assadeira|forma)/i,
    /fogo (baixo|médio|alto)/i,
    /\.$/, // Termina com ponto (geralmente instrução)
  ];

  for (const pattern of instructionPatterns) {
    if (pattern.test(lower)) return true;
  }

  return false;
}

// Verifica se uma linha é apenas um fragmento solto (não um ingrediente válido)
function isFragmentOrJunk(line: string): boolean {
  const lower = line.toLowerCase().trim();

  // Fragmentos comuns que sobram do parsing
  const junkPatterns = [
    /^açúcar$/,
    /^pimenta\.?$/,
    /^sal\.?$/,
    /^baunilha\.?$/,
    /^canela\.?$/,
    /^cozidas?\.?$/,
    /^picadas?\.?$/,
    /^descascadas?\.?$/,
    /^de oliva$/,
    /^para diabéticos\)?$/,
    /^usar\)/,
  ];

  for (const pattern of junkPatterns) {
    if (pattern.test(lower)) return true;
  }

  // Linha muito curta que não começa com número (provavelmente não é ingrediente)
  if (line.length < 8 && !/^\d/.test(line) && !/^(sal|óleo|água)/i.test(lower)) {
    return true;
  }

  return false;
}

// Limpa ingrediente removendo TABs duplicados e normalizando
function cleanIngredient(ing: string): string | null {
  let cleaned = ing.trim();

  // Remove padrão TAB duplicado (ex: "CANELA\tCANELA" -> "Canela")
  if (cleaned.includes('\t')) {
    const parts = cleaned.split('\t').map(p => p.trim()).filter(p => p.length > 0);
    if (parts.length >= 2 && parts[0].toLowerCase() === parts[1].toLowerCase()) {
      cleaned = parts[0];
    } else {
      cleaned = parts.join(' ');
    }
  }

  // Filtra linhas que parecem ser instruções perdidas
  if (looksLikeInstruction(cleaned)) return null;

  // Filtra fragmentos e lixo
  if (isFragmentOrJunk(cleaned)) return null;

  // Normaliza MAIÚSCULAS
  if (cleaned === cleaned.toUpperCase() && cleaned.length > 3) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  }

  return cleaned;
}

// Junta linhas de ingredientes que foram quebradas incorretamente no parsing do PDF
function mergeIngredientLines(ingredients: string[]): string[] {
  const merged: string[] = [];

  for (let i = 0; i < ingredients.length; i++) {
    const current = ingredients[i].trim();
    if (!current) continue;

    // Verifica se a linha atual é continuação da anterior
    const startsWithLowercase = /^[a-záàâãéèêíïóôõöúç]/.test(current);
    const startsWithParenOrConnector = /^(\(|e |ou |para |a gosto)/.test(current.toLowerCase());
    const isShortFragment = current.length < 20 && !current.match(/^\d/);

    // Se parece ser continuação e existe linha anterior
    if (merged.length > 0 && (startsWithLowercase || startsWithParenOrConnector || (isShortFragment && startsWithLowercase))) {
      // Junta com a linha anterior
      merged[merged.length - 1] = merged[merged.length - 1] + ' ' + current;
    } else {
      merged.push(current);
    }
  }

  return merged;
}

// Verifica se uma linha de instrução é inválida (fragmento, ingrediente perdido, etc)
function isInvalidInstruction(line: string): boolean {
  const lower = line.toLowerCase().trim();

  // Padrão TAB duplicado (ex: "BATATA DOCE\tBATATA DOCE") - é título de receita perdido
  if (line.includes('\t')) {
    const parts = line.split('\t').map(p => p.trim()).filter(p => p.length > 0);
    if (parts.length >= 2 && parts[0].toLowerCase() === parts[1].toLowerCase()) {
      return true;
    }
  }

  // Fragmentos comuns que não são instruções válidas
  const invalidPatterns = [
    /^açúcar$/,
    /^pimenta\.?$/,
    /^sal\.?$/,
    /^baunilha\.?$/,
    /^picada\.?$/,
    /^untada\.?$/,
    /^cozidas?\.?$/,
    /^ralada\.?$/,
    /^dica:?$/i,
    /^para diabéticos/,
    /^de oliva$/,  // Fragmento de "azeite de oliva"
    /^com óleo/,   // Fragmento solto
  ];

  for (const pattern of invalidPatterns) {
    if (pattern.test(lower)) return true;
  }

  // Linha que parece ser ingrediente (começa com número/medida)
  if (/^(\d|½|¼|¾|uma |um |suco |raspas )/.test(lower)) return true;

  // Linha muito curta sem contexto (mas não se parecer parte de frase)
  if (line.length < 5) return true;

  return false;
}

// Junta linhas de instruções que foram quebradas incorretamente no parsing do PDF
function mergeInstructionLines(instructions: string[]): string[] {
  const merged: string[] = [];

  for (let i = 0; i < instructions.length; i++) {
    const current = instructions[i].trim();
    if (!current) continue;

    // Pula instruções inválidas
    if (isInvalidInstruction(current)) continue;

    // Verifica se a linha atual é continuação da anterior
    const startsWithLowercase = /^[a-záàâãéèêíïóôõöúç]/.test(current);
    const isShortFragment = current.length < 25;
    const endsWithoutPunctuation = merged.length > 0 && !/[.!?:;]$/.test(merged[merged.length - 1]);
    const looksLikeContinuation = startsWithLowercase || (isShortFragment && !current.match(/^[A-Z]/));

    // Se parece ser continuação e existe linha anterior
    if (merged.length > 0 && (looksLikeContinuation || endsWithoutPunctuation)) {
      // Junta com a linha anterior
      merged[merged.length - 1] = merged[merged.length - 1] + ' ' + current;
    } else {
      merged.push(current);
    }
  }

  // Filtra instruções que começam no meio (não fazem sentido sozinhas)
  return merged.filter(instruction => {
    const lower = instruction.toLowerCase().trim();

    // Remove instruções que começam com artigo/preposição (indicam meio de frase)
    if (/^(o |a |os |as |ao |à |do |da |dos |das |no |na |nos |nas |pelo |pela )/.test(lower)) {
      return false;
    }

    // Remove instruções que começam com substantivo seguido de vírgula (lista de ingredientes)
    if (/^[a-záàâãéèêíïóôõöúç]+,/.test(lower)) {
      return false;
    }

    // Remove instruções muito curtas que não começam com maiúscula
    if (instruction.length < 20 && !/^[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ]/.test(instruction)) return false;

    // Mantém instruções completas
    return instruction.length > 15;
  });
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

// Module-level cache: computed once, reused across all requests
let _cachedRecipes: Recipe[] | null = null;

export function getAdaptedRecipes(): Recipe[] {
  if (_cachedRecipes) return _cachedRecipes;

  // @ts-ignore - rawData is inferred as any[] by TS in some envs, but valid JSON
  _cachedRecipes = rawData.map((raw: any, index: number) => {
    // Determine type based on file string
    let type: Recipe['type'] = 'snack';
    if (raw.file) {
      // Simplified matching
      if (raw.file.includes('Cafe')) type = 'breakfast';
      else if (raw.file.includes('Almo')) type = 'lunch';
      else if (raw.file.includes('Jantar')) type = 'dinner';
    }

    // Tags heuristics
    const tags: string[] = [type];
    if (raw.file?.includes('Sobremesas')) tags.push('dessert');
    if (raw.file?.includes('Molhos')) tags.push('sauce');
    if (raw.file?.includes('Bebidas')) tags.push('drink');

    const lowerTitle = raw.title.toLowerCase();
    if (raw.metadata?.difficulty) tags.push(raw.metadata.difficulty.toLowerCase());
    if (lowerTitle.includes('frango') || lowerTitle.includes('carne') || lowerTitle.includes('peixe')) tags.push('high_protein');
    if (lowerTitle.includes('salada') || lowerTitle.includes('legumes')) tags.push('vegan');
    if (lowerTitle.includes('doce') || lowerTitle.includes('bolo')) tags.push('sugar_free'); // Assuming all are healthy

    const finalTitle = normalizeTitle(raw.title || 'Receita Sem Título');

    // Limpa e junta ingredientes quebrados
    const rawIngredients = (raw.ingredients || [])
      .map((ing: string) => cleanIngredient(ing))
      .filter((ing: string | null): ing is string => ing !== null);
    const mergedIngredients = mergeIngredientLines(rawIngredients);
    const cleanedIngredients = mergedIngredients.filter((ing: string) => ing.length > 1);

    const ingredientsText = cleanedIngredients.join('\n');

    // Calcula calorias e carboidratos baseado nos ingredientes reais
    const nutrition = getRecipeNutrition(type, finalTitle, ingredientsText);

    return {
      id: index + 1000, // Offset to avoid conflicts with mock data if mixed
      title: finalTitle,
      type: type,
      calories: nutrition.calories,
      carbs: nutrition.carbs,
      ingredients: ingredientsText,
      preparation_method: mergeInstructionLines(raw.instructions || []).join('\n'),
      tags: tags,
      image_url: getImageForRecipe(type, finalTitle, tags),
      slug: generateSlug(finalTitle),
      metadata: raw.metadata
    };
  }).filter(r => r.title.length > 3); // Filter basic noise/empty items

  return _cachedRecipes;
}
