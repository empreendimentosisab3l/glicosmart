import { getAllRecipes } from '@/lib/recipeUtils';
import { RecipesGrid } from '@/components/recipes-grid';

export default async function ReceitasPage() {
    const recipes = await getAllRecipes(); // Server-side fetch

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
            {/* Hero Section with Fresh Gradient */}
            <div className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-100/50">
                <div className="max-w-7xl mx-auto text-center md:max-w-none">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4 relative inline-block">
                        Livro de Receitas
                        <span className="absolute -top-1 -right-6 text-2xl animate-bounce">🥗</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-500 leading-relaxed">
                        Explore nossa coleção de <span className="font-bold text-emerald-600">{recipes.length} receitas</span> saudáveis e deliciosas.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8 md:max-w-none md:px-4">
                <RecipesGrid initialRecipes={recipes} />
            </div>
        </main>
    );
}
