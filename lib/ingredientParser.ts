import { KNOWN_INGREDIENTS } from './knownIngredients';

// Sort by length (descending) once to ensure greedy matching
// e.g. Match "Leite de Coco" before "Leite"
const SORTED_INGREDIENTS = [...KNOWN_INGREDIENTS].sort((a, b) => b.length - a.length);

// Categorias de ingredientes
export const INGREDIENT_CATEGORIES: Record<string, string[]> = {
    'Proteínas': [
        'Frango', 'Peito de Frango', 'Coxa de Frango', 'Carne Moída', 'Carne', 'Picanha', 'Alcatra',
        'Porco', 'Lombo', 'Bacon', 'Linguiça', 'Linguiça Calabresa', 'Presunto',
        'Peixe', 'Tilápia', 'Salmão', 'Atum', 'Sardinha', 'Camarão', 'Bacalhau',
        'Ovos', 'Ovo', 'Clara de Ovo', 'Gema'
    ],
    'Laticínios': [
        'Leite', 'Leite Desnatado', 'Leite Integral', 'Leite de Coco', 'Leite de Amêndoas', 'Leite de Soja', 'Leite em Pó',
        'Iogurte', 'Iogurte Natural', 'Iogurte Grego',
        'Queijo', 'Queijo Muçarela', 'Queijo Parmesão', 'Queijo Minas', 'Queijo Cottage', 'Ricota', 'Cream Cheese', 'Requeijão',
        'Manteiga', 'Manteiga Ghee', 'Creme de Leite', 'Nata'
    ],
    'Vegetais': [
        'Cebola', 'Cebola Roxa', 'Alho', 'Alho-Poró',
        'Tomate', 'Tomate Cereja', 'Cenoura', 'Batata', 'Batata Doce', 'Batata Inglesa', 'Batata Baroa', 'Mandioquinha',
        'Abobrinha', 'Abóbora', 'Cabotiá', 'Pepino', 'Chuchu', 'Berinjela',
        'Pimentão', 'Pimentão Vermelho', 'Pimentão Amarelo', 'Pimentão Verde',
        'Brócolis', 'Couve-Flor', 'Couve', 'Espinafre', 'Alface', 'Rúcula', 'Repolho', 'Acelga',
        'Beterraba', 'Rabanete', 'Nabo', 'Vagem', 'Quiabo', 'Milho', 'Ervilha', 'Grão de Bico', 'Feijão', 'Lentilha',
        'Cogumelo', 'Shimeji', 'Shitake', 'Champignon', 'Palmito'
    ],
    'Frutas': [
        'Limão', 'Laranja', 'Banana', 'Maçã', 'Pera', 'Uva', 'Morango', 'Abacaxi', 'Manga', 'Mamão', 'Melancia', 'Melão',
        'Abacate', 'Coco', 'Coco Ralado', 'Maracujá', 'Kiwi', 'Ameixa', 'Pêssego', 'Caqui', 'Goiaba'
    ],
    'Grãos e Farinhas': [
        'Arroz', 'Arroz Integral', 'Arroz Branco',
        'Aveia', 'Farinha de Aveia', 'Farelo de Aveia', 'Aveia em Flocos',
        'Farinha de Trigo', 'Farinha de Trigo Integral',
        'Farinha de Amêndoas', 'Farinha de Coco', 'Farinha de Arroz', 'Farinha de Linhaça',
        'Amido de Milho', 'Polvilho', 'Polvilho Doce', 'Polvilho Azedo', 'Tapioca',
        'Quinoa', 'Chia', 'Linhaça', 'Gergelim'
    ],
    'Óleos e Gorduras': [
        'Azeite', 'Azeite de Oliva',
        'Óleo de Coco', 'Óleo de Soja', 'Óleo de Girassol', 'Óleo de Canola',
        'Banha'
    ],
    'Temperos': [
        'Sal', 'Pimenta', 'Pimenta do Reino', 'Pimenta Caiena', 'Pimenta Dedo de Moça',
        'Orégano', 'Manjericão', 'Salsinha', 'Cebolinha', 'Coentro', 'Alecrim', 'Tomilho', 'Hortelã', 'Louro',
        'Açafrão', 'Cúrcuma', 'Colorau', 'Páprica', 'Páprica Doce', 'Páprica Defumada',
        'Cominho', 'Noz-Moscada', 'Canela', 'Canela em Pó', 'Cravo', 'Gengibre', 'Gengibre em Pó',
        'Vinagre', 'Vinagre de Maçã', 'Vinagre de Álcool', 'Vinagre Balsâmico',
        'Shoyu', 'Molho Inglês', 'Mostarda', 'Ketchup', 'Maionese',
        'Molho de Tomate', 'Extrato de Tomate', 'Passata de Tomate'
    ],
    'Doces e Outros': [
        'Açúcar', 'Adoçante', 'Mel', 'Melado',
        'Fermento', 'Fermento em Pó', 'Fermento Biológico', 'Bicarbonato de Sódio',
        'Cacau', 'Cacau em Pó', 'Chocolate', 'Chocolate Amargo', 'Chocolate em Pó',
        'Essência de Baunilha', 'Extrato de Baunilha',
        'Água de Coco'
    ],
    'Oleaginosas': [
        'Amêndoas', 'Castanha de Caju', 'Castanha do Pará', 'Nozes', 'Amendoim', 'Pasta de Amendoim',
        'Avelã', 'Pistache'
    ]
};

// Mapeamento reverso: ingrediente -> categoria
const ingredientToCategory: Map<string, string> = new Map();
Object.entries(INGREDIENT_CATEGORIES).forEach(([category, ingredients]) => {
    ingredients.forEach(ing => ingredientToCategory.set(ing.toLowerCase(), category));
});

// Interface para ingrediente parseado
export interface ParsedIngredient {
    name: string;           // Nome canônico do ingrediente
    quantity: number;       // Quantidade numérica
    unit: string;           // Unidade (xícara, colher, g, ml, unidade)
    category: string;       // Categoria do ingrediente
    original: string;       // Texto original
}

// Padrões de quantidade
const QUANTITY_PATTERNS: { pattern: RegExp; unit: string; multiplier?: number }[] = [
    // Frações
    { pattern: /(\d+)\s*\/\s*(\d+)/, unit: 'fração' },
    // Xícaras
    { pattern: /(\d+(?:[.,]\d+)?)\s*x[íi]caras?/i, unit: 'xícara' },
    { pattern: /(\d+(?:[.,]\d+)?)\s*cups?/i, unit: 'xícara' },
    // Colheres de sopa
    { pattern: /(\d+(?:[.,]\d+)?)\s*colh(?:er(?:es)?)?\.?\s*(?:de\s*)?sopa/i, unit: 'colher de sopa' },
    { pattern: /(\d+(?:[.,]\d+)?)\s*col\.?\s*(?:de\s*)?sopa/i, unit: 'colher de sopa' },
    { pattern: /(\d+(?:[.,]\d+)?)\s*tbsp/i, unit: 'colher de sopa' },
    // Colheres de chá
    { pattern: /(\d+(?:[.,]\d+)?)\s*colh(?:er(?:es)?)?\.?\s*(?:de\s*)?ch[áa]/i, unit: 'colher de chá' },
    { pattern: /(\d+(?:[.,]\d+)?)\s*col\.?\s*(?:de\s*)?ch[áa]/i, unit: 'colher de chá' },
    { pattern: /(\d+(?:[.,]\d+)?)\s*tsp/i, unit: 'colher de chá' },
    // Gramas
    { pattern: /(\d+(?:[.,]\d+)?)\s*g(?:ramas?)?(?:\s|$)/i, unit: 'g' },
    // Quilos
    { pattern: /(\d+(?:[.,]\d+)?)\s*kg/i, unit: 'kg', multiplier: 1000 },
    // Mililitros
    { pattern: /(\d+(?:[.,]\d+)?)\s*ml/i, unit: 'ml' },
    // Litros
    { pattern: /(\d+(?:[.,]\d+)?)\s*l(?:itros?)?(?:\s|$)/i, unit: 'L', multiplier: 1000 },
    // Unidades
    { pattern: /(\d+(?:[.,]\d+)?)\s*unidades?/i, unit: 'unidade' },
    { pattern: /(\d+(?:[.,]\d+)?)\s*fatias?/i, unit: 'fatia' },
    { pattern: /(\d+(?:[.,]\d+)?)\s*dentes?/i, unit: 'dente' },
    { pattern: /(\d+(?:[.,]\d+)?)\s*folhas?/i, unit: 'folha' },
    { pattern: /(\d+(?:[.,]\d+)?)\s*ramos?/i, unit: 'ramo' },
    { pattern: /(\d+(?:[.,]\d+)?)\s*punhados?/i, unit: 'punhado' },
    // Número simples no início
    { pattern: /^(\d+(?:[.,]\d+)?)\s+/, unit: 'unidade' },
];

// Frações comuns
const FRACTION_MAP: Record<string, number> = {
    '1/2': 0.5,
    '1/3': 0.33,
    '1/4': 0.25,
    '2/3': 0.67,
    '3/4': 0.75,
    'meia': 0.5,
    'meio': 0.5,
};

/**
 * Extrai quantidade e unidade do texto
 */
function extractQuantity(text: string): { quantity: number; unit: string } {
    const lowerText = text.toLowerCase();

    // Verificar frações por texto
    for (const [fractionText, value] of Object.entries(FRACTION_MAP)) {
        if (lowerText.includes(fractionText)) {
            return { quantity: value, unit: 'unidade' };
        }
    }

    // Tentar cada padrão
    for (const { pattern, unit, multiplier } of QUANTITY_PATTERNS) {
        const match = text.match(pattern);
        if (match) {
            let value: number;

            // Se for fração como "1/2"
            if (unit === 'fração' && match[1] && match[2]) {
                value = parseFloat(match[1]) / parseFloat(match[2]);
                return { quantity: value, unit: 'unidade' };
            }

            // Número normal
            value = parseFloat(match[1].replace(',', '.'));
            if (multiplier) value *= multiplier;

            return { quantity: value, unit };
        }
    }

    // Default: 1 unidade
    return { quantity: 1, unit: 'unidade' };
}

/**
 * Encontra a categoria de um ingrediente
 */
export function getIngredientCategory(ingredientName: string): string {
    const lower = ingredientName.toLowerCase();

    // Busca direta
    const direct = ingredientToCategory.get(lower);
    if (direct) return direct;

    // Busca parcial
    const entries = Array.from(ingredientToCategory.entries());
    for (const [ing, cat] of entries) {
        if (lower.includes(ing) || ing.includes(lower)) {
            return cat;
        }
    }

    return 'Outros';
}

/**
 * Parseia uma linha de ingrediente e retorna informações estruturadas
 */
export function parseIngredientFull(raw: string): ParsedIngredient | null {
    if (!raw || raw.trim().length === 0) return null;

    const text = raw.toLowerCase();
    const trimmedRaw = raw.trim();

    // Strategy: Scan for known ingredients.
    for (const ingredient of SORTED_INGREDIENTS) {
        const escaped = ingredient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}(s|es)?\\b`, 'i');

        if (regex.test(text)) {
            // Canonical Aliases
            const aliases: Record<string, string> = {
                'Ovo': 'Ovos',
                'Azeite de Oliva': 'Azeite',
                'Suco de Limão': 'Limão',
                'Suco de Laranja': 'Laranja',
                'Farinha de Aveia': 'Aveia',
                'Xilitol': 'Adoçante',
                'Eritritol': 'Adoçante',
                'Stevia': 'Adoçante',
                'Açúcar Demerara': 'Açúcar',
                'Açúcar Mascavo': 'Açúcar',
                'Açúcar de Coco': 'Açúcar'
            };

            const canonicalName = aliases[ingredient] || ingredient;
            const { quantity, unit } = extractQuantity(trimmedRaw);
            const category = getIngredientCategory(canonicalName);

            return {
                name: canonicalName,
                quantity,
                unit,
                category,
                original: trimmedRaw
            };
        }
    }

    return null;
}

/**
 * Parseia ingrediente e retorna apenas o nome (compatibilidade com código existente)
 */
export function parseIngredient(raw: string): string | null {
    const parsed = parseIngredientFull(raw);
    return parsed ? parsed.name : null;
}

/**
 * Parseia todos os ingredientes de uma receita
 */
export function parseAllIngredients(ingredientsText: string): ParsedIngredient[] {
    if (!ingredientsText) return [];

    const lines = ingredientsText
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);

    const parsed: ParsedIngredient[] = [];

    for (const line of lines) {
        const result = parseIngredientFull(line);
        if (result) {
            parsed.push(result);
        }
    }

    return parsed;
}

/**
 * Agrega ingredientes de múltiplas receitas
 */
export interface AggregatedIngredient {
    name: string;
    category: string;
    totalQuantity: number;
    unit: string;
    recipes: string[];
}

export function aggregateIngredients(
    recipeIngredients: { recipeTitle: string; ingredients: ParsedIngredient[] }[]
): AggregatedIngredient[] {
    const aggregated: Map<string, AggregatedIngredient> = new Map();

    for (const { recipeTitle, ingredients } of recipeIngredients) {
        for (const ing of ingredients) {
            const key = `${ing.name}|${ing.unit}`;

            if (aggregated.has(key)) {
                const existing = aggregated.get(key)!;
                existing.totalQuantity += ing.quantity;
                if (!existing.recipes.includes(recipeTitle)) {
                    existing.recipes.push(recipeTitle);
                }
            } else {
                aggregated.set(key, {
                    name: ing.name,
                    category: ing.category,
                    totalQuantity: ing.quantity,
                    unit: ing.unit,
                    recipes: [recipeTitle]
                });
            }
        }
    }

    // Converter para array e ordenar por categoria
    return Array.from(aggregated.values()).sort((a, b) => {
        const catOrder = ['Proteínas', 'Laticínios', 'Vegetais', 'Frutas', 'Grãos e Farinhas', 'Óleos e Gorduras', 'Temperos', 'Doces e Outros', 'Oleaginosas', 'Outros'];
        const catA = catOrder.indexOf(a.category);
        const catB = catOrder.indexOf(b.category);
        if (catA !== catB) return catA - catB;
        return a.name.localeCompare(b.name);
    });
}

/**
 * Formata quantidade para exibição
 */
export function formatQuantity(quantity: number, unit: string): string {
    // Arredondar para uma casa decimal se necessário
    const rounded = Math.round(quantity * 10) / 10;

    // Converter para fração se apropriado
    if (rounded === 0.5) return `½ ${unit}`;
    if (rounded === 0.25) return `¼ ${unit}`;
    if (rounded === 0.75) return `¾ ${unit}`;
    if (rounded === 0.33) return `⅓ ${unit}`;
    if (rounded === 0.67) return `⅔ ${unit}`;

    // Número inteiro
    if (Number.isInteger(rounded)) {
        return `${rounded} ${unit}${rounded > 1 && !unit.endsWith('s') ? 's' : ''}`;
    }

    return `${rounded} ${unit}`;
}
