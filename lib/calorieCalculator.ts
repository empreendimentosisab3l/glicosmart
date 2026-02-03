/**
 * Calcula calorias e carboidratos baseado nos ingredientes reais
 * Cruza com o banco de alimentos (alimentos.json)
 */

import alimentosData from '@/src/data/alimentos.json';

interface Alimento {
  id: number;
  name: string;
  category: string;
  serving_size: string;
  net_carbs: number;
  calories: number;
  glycemic_index: number;
  fiber: number;
  protein: number;
  fat: number;
  gi_level: string;
}

interface NutritionResult {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  matchedIngredients: string[];
  unmatchedIngredients: string[];
}

// Mapeamento de sinônimos para normalizar ingredientes
const INGREDIENT_ALIASES: Record<string, string> = {
  // Frutas
  'banana': 'Banana Prata',
  'maçã': 'Maçã',
  'maca': 'Maçã',
  'limao': 'Limão',
  'laranja': 'Laranja',
  'morango': 'Morango',
  'abacate': 'Abacate',
  'abacaxi': 'Abacaxi',
  'manga': 'Manga',
  'mamão': 'Mamão Papaia',
  'mamao': 'Mamão Papaia',
  'melancia': 'Melancia',
  'melão': 'Melão',
  'melao': 'Melão',
  'uva': 'Uva (Verde/Rubi)',
  'kiwi': 'Kiwi',
  'pera': 'Pera',
  'pêssego': 'Pêssego',
  'pessego': 'Pêssego',
  'goiaba': 'Goiaba',
  'coco': 'Coco (Polpa)',
  'blueberries': 'Morango', // Aproximação
  'blueberry': 'Morango',
  'frutas vermelhas': 'Morango',

  // Vegetais
  'abobrinha': 'Abobrinha',
  'abóbora': 'Abóbora Cabotiá',
  'abobora': 'Abóbora Cabotiá',
  'alface': 'Alface',
  'tomate': 'Tomate',
  'cenoura': 'Cenoura',
  'brócolis': 'Brócolis',
  'brocolis': 'Brócolis',
  'espinafre': 'Espinafre',
  'couve': 'Couve Manteiga',
  'couve-flor': 'Couve-Flor',
  'couve flor': 'Couve-Flor',
  'pepino': 'Pepino',
  'pimentão': 'Pimentão',
  'pimentao': 'Pimentão',
  'berinjela': 'Berinjela',
  'beterraba': 'Beterraba',
  'vagem': 'Vagem',
  'repolho': 'Repolho',
  'chuchu': 'Chuchu',
  'quiabo': 'Quiabo',
  'cebola': 'Tomate', // Aproximação (sem cebola no banco)
  'alho': 'Alho Poró',

  // Tubérculos
  'batata': 'Batata Inglesa',
  'batata doce': 'Batata Doce',
  'batata-doce': 'Batata Doce',
  'mandioca': 'Mandioca (Aipim)',
  'aipim': 'Mandioca (Aipim)',
  'inhame': 'Inhame',
  'mandioquinha': 'Batata Baroa (Mandioquinha)',

  // Proteínas
  'frango': 'Frango (Peito)',
  'peito de frango': 'Frango (Peito)',
  'sobrecoxa': 'Frango (Sobrecoxa)',
  'carne': 'Alcatra',
  'carne moída': 'Carne Moída (Patinho)',
  'carne moida': 'Carne Moída (Patinho)',
  'bife': 'Contrafilé',
  'alcatra': 'Alcatra',
  'contrafilé': 'Contrafilé',
  'contrafile': 'Contrafilé',
  'lombo': 'Porco (Lombo)',
  'porco': 'Porco (Lombo)',
  'bacon': 'Bacon',
  'salsicha': 'Salsicha',
  'peixe': 'Peixe (Tilápia)',
  'tilápia': 'Peixe (Tilápia)',
  'tilapia': 'Peixe (Tilápia)',
  'salmão': 'Peixe (Salmão)',
  'salmao': 'Peixe (Salmão)',
  'camarão': 'Camarão',
  'camarao': 'Camarão',

  // Ovos e laticínios
  'ovo': 'Ovo',
  'ovos': 'Ovo',
  'clara': 'Clara de Ovo',
  'gema': 'Ovo',
  'leite': 'Leite Integral',
  'leite integral': 'Leite Integral',
  'leite desnatado': 'Leite Desnatado',
  'leite de amêndoas': 'Leite de Amêndoas',
  'leite de amendoas': 'Leite de Amêndoas',
  'leite de coco': 'Coco (Polpa)', // Aproximação
  'iogurte': 'Iogurte Natural',
  'iogurte natural': 'Iogurte Natural',
  'iogurte grego': 'Iogurte Grego',
  'queijo': 'Queijo Muçarela',
  'queijo minas': 'Queijo Minas Frescal',
  'mussarela': 'Queijo Muçarela',
  'muçarela': 'Queijo Muçarela',
  'parmesão': 'Queijo Parmesão',
  'parmesao': 'Queijo Parmesão',
  'requeijão': 'Requeijão',
  'requeijao': 'Requeijão',
  'manteiga': 'Manteiga',
  'cream cheese': 'Requeijão',

  // Grãos e leguminosas
  'arroz': 'Arroz Integral',
  'arroz branco': 'Arroz Branco',
  'arroz integral': 'Arroz Integral',
  'feijão': 'Feijão Carioca',
  'feijao': 'Feijão Carioca',
  'feijão preto': 'Feijão Preto',
  'feijao preto': 'Feijão Preto',
  'lentilha': 'Lentilha',
  'grão de bico': 'Grão de Bico',
  'grao de bico': 'Grão de Bico',
  'ervilha': 'Ervilha',
  'milho': 'Milho Verde',
  'quinoa': 'Quinoa',
  'quinua': 'Quinoa',
  'aveia': 'Aveia (Flocos)',
  'farinha de aveia': 'Aveia (Flocos)',
  'farinha': 'Trigo (Farinha)',
  'farinha de trigo': 'Trigo (Farinha)',
  'farinha de amêndoas': 'Amendoim', // Aproximação
  'farinha de amendoas': 'Amendoim',
  'tapioca': 'Tapioca',
  'pão': 'Pão Integral',
  'pao': 'Pão Integral',
  'pão integral': 'Pão Integral',
  'pao integral': 'Pão Integral',
  'pão francês': 'Pão Francês',
  'pao frances': 'Pão Francês',
  'macarrão': 'Macarrão Comum',
  'macarrao': 'Macarrão Comum',
  'massa': 'Macarrão Comum',

  // Oleaginosas
  'amendoim': 'Amendoim',
  'castanha': 'Castanha de Caju',
  'castanha de caju': 'Castanha de Caju',
  'castanha do pará': 'Castanha do Pará',
  'castanha do para': 'Castanha do Pará',
  'nozes': 'Nozes',
  'amêndoas': 'Amendoim', // Aproximação
  'amendoas': 'Amendoim',
  'chia': 'Chia',

  // Óleos e gorduras
  'azeite': 'Azeite de Oliva',
  'azeite de oliva': 'Azeite de Oliva',
  'óleo': 'Azeite de Oliva', // Aproximação
  'oleo': 'Azeite de Oliva',
  'óleo de coco': 'Coco (Polpa)', // Aproximação

  // Adoçantes e doces
  'mel': 'Mel',
  'açúcar': 'Açúcar Branco',
  'acucar': 'Açúcar Branco',
  'chocolate': 'Chocolate ao Leite',
};

// Converte aliases para busca mais eficiente
const aliasesLower = Object.fromEntries(
  Object.entries(INGREDIENT_ALIASES).map(([k, v]) => [k.toLowerCase(), v])
);

// Índice do banco de alimentos por nome normalizado
const alimentosByName: Map<string, Alimento> = new Map();
(alimentosData as Alimento[]).forEach(a => {
  // Indexa pelo nome original
  alimentosByName.set(a.name.toLowerCase(), a);
  // Indexa também por versões simplificadas
  const simplified = a.name
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, '') // Remove parênteses
    .trim();
  if (simplified !== a.name.toLowerCase()) {
    alimentosByName.set(simplified, a);
  }
});

/**
 * Tenta encontrar um alimento no banco de dados
 */
function findAlimento(ingredientText: string): Alimento | null {
  const text = ingredientText.toLowerCase().trim();

  // 1. Busca direta por alias
  if (aliasesLower[text]) {
    const aliasTarget = aliasesLower[text].toLowerCase();
    const found = alimentosByName.get(aliasTarget);
    if (found) return found;
  }

  // 2. Busca parcial no texto por aliases
  for (const [alias, target] of Object.entries(aliasesLower)) {
    if (text.includes(alias)) {
      const found = alimentosByName.get(target.toLowerCase());
      if (found) return found;
    }
  }

  // 3. Busca direta no banco
  const direct = alimentosByName.get(text);
  if (direct) return direct;

  // 4. Busca parcial no banco
  const entries = Array.from(alimentosByName.entries());
  for (const [name, alimento] of entries) {
    if (text.includes(name) || name.includes(text)) {
      return alimento;
    }
  }

  return null;
}

/**
 * Extrai quantidade aproximada do texto do ingrediente
 * Retorna um multiplicador (1 = porção padrão)
 */
function extractQuantityMultiplier(text: string): number {
  const lowerText = text.toLowerCase();

  // Padrões de quantidade
  const patterns: [RegExp, number][] = [
    [/(\d+)\s*xícaras?/i, 1.5],        // 1 xícara = ~1.5 porções
    [/(\d+)\s*colheres?\s*de\s*sopa/i, 0.5], // 1 colher sopa = ~0.5 porção
    [/(\d+)\s*colheres?\s*de\s*chá/i, 0.15], // 1 colher chá = ~0.15 porção
    [/1\/2\s*xícara/i, 0.75],          // 1/2 xícara
    [/1\/4\s*xícara/i, 0.4],           // 1/4 xícara
    [/(\d+)\s*unidades?/i, 1],         // unidades = 1 por unidade
    [/(\d+)\s*fatias?/i, 0.5],         // fatias
    [/(\d+)\s*g\b/i, 0.01],            // gramas (dividir por 100)
    [/(\d+)\s*ml\b/i, 0.005],          // ml (dividir por 200)
  ];

  for (const [pattern, baseMultiplier] of patterns) {
    const match = lowerText.match(pattern);
    if (match && match[1]) {
      const num = parseFloat(match[1]);
      if (!isNaN(num)) {
        return num * baseMultiplier;
      }
    }
  }

  // Frações
  if (lowerText.includes('1/2') || lowerText.includes('meia')) return 0.5;
  if (lowerText.includes('1/4')) return 0.25;
  if (lowerText.includes('1/3')) return 0.33;

  // Padrão: 1 porção
  return 1;
}

/**
 * Calcula as informações nutricionais de uma receita baseado nos ingredientes
 */
export function calculateRecipeNutrition(ingredientsText: string): NutritionResult {
  const result: NutritionResult = {
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    matchedIngredients: [],
    unmatchedIngredients: [],
  };

  if (!ingredientsText || typeof ingredientsText !== 'string') {
    return result;
  }

  // Divide ingredientes por linha ou vírgula
  const lines = ingredientsText
    .split(/[\n,]/)
    .map(l => l.trim())
    .filter(l => l.length > 2);

  for (const line of lines) {
    const alimento = findAlimento(line);

    if (alimento) {
      const multiplier = extractQuantityMultiplier(line);

      result.calories += Math.round(alimento.calories * multiplier);
      result.carbs += Math.round(alimento.net_carbs * multiplier);
      result.protein += Math.round(alimento.protein * multiplier);
      result.fat += Math.round(alimento.fat * multiplier);
      result.fiber += Math.round(alimento.fiber * multiplier);
      result.matchedIngredients.push(alimento.name);
    } else {
      // Não encontrou - ignora ingredientes muito curtos ou genéricos
      if (line.length > 5 && !line.match(/^(sal|água|a gosto|pitada)/i)) {
        result.unmatchedIngredients.push(line);
      }
    }
  }

  return result;
}

/**
 * Estima calorias quando não há ingredientes detalhados
 * Baseado no tipo de refeição
 */
export function estimateCaloriesByType(
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  title: string
): { calories: number; carbs: number } {
  const lowerTitle = title.toLowerCase();

  // Estimativas base por tipo
  const baseEstimates: Record<string, { calories: number; carbs: number }> = {
    breakfast: { calories: 350, carbs: 40 },
    lunch: { calories: 500, carbs: 50 },
    dinner: { calories: 450, carbs: 45 },
    snack: { calories: 150, carbs: 20 },
  };

  let estimate = { ...baseEstimates[type] };

  // Ajustes por palavras-chave no título
  if (lowerTitle.includes('salada')) {
    estimate.calories = Math.round(estimate.calories * 0.6);
    estimate.carbs = Math.round(estimate.carbs * 0.5);
  }
  if (lowerTitle.includes('sopa') || lowerTitle.includes('caldo')) {
    estimate.calories = Math.round(estimate.calories * 0.7);
    estimate.carbs = Math.round(estimate.carbs * 0.6);
  }
  if (lowerTitle.includes('grelhado') || lowerTitle.includes('assado')) {
    estimate.carbs = Math.round(estimate.carbs * 0.7);
  }
  if (lowerTitle.includes('frito') || lowerTitle.includes('empanado')) {
    estimate.calories = Math.round(estimate.calories * 1.3);
  }
  if (lowerTitle.includes('light') || lowerTitle.includes('fit')) {
    estimate.calories = Math.round(estimate.calories * 0.7);
    estimate.carbs = Math.round(estimate.carbs * 0.7);
  }
  if (lowerTitle.includes('panqueca') || lowerTitle.includes('waffle')) {
    estimate.carbs = Math.round(estimate.carbs * 1.2);
  }
  if (lowerTitle.includes('omelete') || lowerTitle.includes('ovos')) {
    estimate.carbs = Math.round(estimate.carbs * 0.3); // Ovos têm poucos carbs
    estimate.calories = Math.round(estimate.calories * 0.9);
  }
  if (lowerTitle.includes('smoothie') || lowerTitle.includes('vitamina')) {
    estimate.calories = 200;
    estimate.carbs = 30;
  }
  if (lowerTitle.includes('bolo') || lowerTitle.includes('torta') || lowerTitle.includes('doce')) {
    estimate.calories = 280;
    estimate.carbs = 35;
  }
  if (lowerTitle.includes('molho') || lowerTitle.includes('tempero')) {
    estimate.calories = 80;
    estimate.carbs = 5;
  }
  if (lowerTitle.includes('suco') || lowerTitle.includes('chá')) {
    estimate.calories = 50;
    estimate.carbs = 12;
  }

  return estimate;
}

/**
 * Calcula nutrição para uma receita, tentando usar ingredientes reais
 * e caindo para estimativa se não houver dados suficientes
 */
export function getRecipeNutrition(
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  title: string,
  ingredients: string
): { calories: number; carbs: number } {
  // Tenta calcular com ingredientes reais
  const calculated = calculateRecipeNutrition(ingredients);

  // Se encontrou pelo menos 2 ingredientes, usa o cálculo
  if (calculated.matchedIngredients.length >= 2 && calculated.calories > 50) {
    return {
      calories: calculated.calories,
      carbs: calculated.carbs,
    };
  }

  // Caso contrário, usa estimativa
  return estimateCaloriesByType(type, title);
}
