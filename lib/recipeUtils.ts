import { getAdaptedRecipes } from './recipeAdapter';
import { Recipe } from './types';

// Clean slate logic
// Actually clean slate is better.

export async function getAllRecipes(): Promise<Recipe[]> {
    return getAdaptedRecipes();
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
    const recipes = getAdaptedRecipes();
    return recipes.find(r => r.slug === slug) || null;
}
