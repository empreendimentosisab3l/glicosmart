'use server';

import { getAllRecipes } from '@/lib/recipeUtils';
import { RecipeSummary } from '@/lib/types';
import { parseIngredient, parseAllIngredients, aggregateIngredients, AggregatedIngredient, ParsedIngredient } from '@/lib/ingredientParser';

export async function fetchRecipeSummaries(): Promise<RecipeSummary[]> {
    const allRecipes = await getAllRecipes();

    // Strip heavy fields (preparation_method) to reduce payload
    return allRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        type: recipe.type,
        calories: recipe.calories,
        carbs: recipe.carbs,
        tags: recipe.tags,
        image_url: recipe.image_url,
        slug: recipe.slug,
        ingredients: recipe.ingredients
    }));
}

export async function fetchRecipeIngredients(slugs: string[]): Promise<Record<string, string[]>> {
    const allRecipes = await getAllRecipes();
    const result: Record<string, string[]> = {};

    slugs.forEach(slug => {
        const recipe = allRecipes.find(r => r.slug === slug);
        if (recipe) {
            // Check if ingredients is string or array, handle both
            const lines = typeof recipe.ingredients === 'string'
                ? recipe.ingredients.split('\n')
                : (Array.isArray(recipe.ingredients) ? recipe.ingredients : []);

            // Clean and filter ingredients
            const cleanIngredients = lines
                .map(l => parseIngredient(l))
                .filter((l): l is string => l !== null);

            if (cleanIngredients.length > 0) {
                result[slug] = cleanIngredients;
            }
        }
    });

    return result;
}

// Nova função para buscar ingredientes com quantidades e categorias
export async function fetchRecipeIngredientsDetailed(slugs: string[]): Promise<{
    aggregated: AggregatedIngredient[];
    unrecognized: { text: string; recipeTitle: string }[];
}> {
    const allRecipes = await getAllRecipes();
    const recipeIngredients: { recipeTitle: string; ingredients: ParsedIngredient[] }[] = [];
    const unrecognized: { text: string; recipeTitle: string }[] = [];

    slugs.forEach(slug => {
        const recipe = allRecipes.find(r => r.slug === slug);
        if (recipe) {
            const lines = typeof recipe.ingredients === 'string'
                ? recipe.ingredients.split('\n')
                : (Array.isArray(recipe.ingredients) ? recipe.ingredients : []);

            const parsed = parseAllIngredients(lines.join('\n'));

            if (parsed.length > 0) {
                recipeIngredients.push({
                    recipeTitle: recipe.title,
                    ingredients: parsed
                });
            }

            // Encontrar ingredientes não reconhecidos
            lines.forEach(line => {
                const trimmed = line.trim();
                if (trimmed.length > 3 && !trimmed.match(/^(sal|água|a gosto|pitada)/i)) {
                    const result = parseIngredient(trimmed);
                    if (!result) {
                        unrecognized.push({ text: trimmed, recipeTitle: recipe.title });
                    }
                }
            });
        }
    });

    return {
        aggregated: aggregateIngredients(recipeIngredients),
        unrecognized
    };
}
