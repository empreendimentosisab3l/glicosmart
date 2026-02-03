'use client';

import { useState, useMemo } from 'react';
import { Recipe } from '@/lib/types';
import { RecipeCard } from '@/components/ui/recipe-card';
import { Search } from 'lucide-react';

const PAGE_SIZE = 20;

interface RecipesGridProps {
    initialRecipes: Recipe[];
}

export function RecipesGrid({ initialRecipes }: RecipesGridProps) {
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const filteredRecipes = useMemo(() => {
        if (!search) return initialRecipes;
        const lowerSearch = search.toLowerCase();
        return initialRecipes.filter(r =>
            r.title.toLowerCase().includes(lowerSearch) ||
            r.ingredients.toLowerCase().includes(lowerSearch)
        );
    }, [search, initialRecipes]);

    // Reset visible count when search changes
    const visibleRecipes = filteredRecipes.slice(0, visibleCount);
    const hasMore = visibleCount < filteredRecipes.length;

    return (
        <div className="w-full">
            {/* Search Bar - Glass Pill Style */}
            <div className="relative max-w-xl mx-auto mb-12">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-100 to-primary/20 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white rounded-full shadow-lg shadow-emerald-500/5 ring-1 ring-slate-100 flex items-center pr-2 transition-transform active:scale-[0.99] duration-200">
                        <div className="pl-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-3 pr-4 py-4 bg-transparent border-none rounded-full leading-5 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-0 sm:text-sm"
                            placeholder="Buscar receitas (ex: peixe, low carb...)"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setVisibleCount(PAGE_SIZE);
                            }}
                        />
                        <div className="flex items-center">
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                {filteredRecipes.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {visibleRecipes.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 gap-4">
                        {visibleRecipes.map((recipe, idx) => (
                            <RecipeCard key={recipe.slug || idx} recipe={recipe} />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                                className="px-6 py-3 bg-white rounded-full shadow-sm ring-1 ring-slate-100 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all active:scale-95"
                            >
                                Carregar mais ({filteredRecipes.length - visibleCount} restantes)
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20">
                    <p className="text-slate-500 text-lg">Nenhuma receita encontrada para &quot;{search}&quot;</p>
                </div>
            )}
        </div>
    );
}
