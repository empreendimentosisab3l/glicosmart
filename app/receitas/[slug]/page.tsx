import { getRecipeBySlug, getAllRecipes } from '@/lib/recipeUtils';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Clock, Users, ChefHat, CheckCircle2, Flame, Wheat, AlertCircle } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const recipes = await getAllRecipes();
    return recipes.map((recipe) => ({
        slug: recipe.slug,
    }));
}

export default async function RecipePage({ params }: PageProps) {
    const { slug } = await params;
    const recipe = await getRecipeBySlug(slug);

    if (!recipe) {
        notFound();
    }

    // Adapt content (handle string vs array if mixed, but adapter returns strings)
    const ingredientsList = typeof recipe.ingredients === 'string'
        ? recipe.ingredients.split('\n').filter(line => line.trim().length > 0)
        : recipe.ingredients; // Fallback

    const instructionsList = typeof recipe.preparation_method === 'string'
        ? recipe.preparation_method.split('\n').filter(line => line.trim().length > 0)
        : [];

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
            {/* Hero Section with Image - optimized for mobile container */}
            <div className="relative h-56 w-full">
                <Image
                    src={recipe.image_url}
                    alt={recipe.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 430px"
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="absolute top-4 left-4 z-20">
                    <BackButton />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 text-white">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {recipe.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider border border-white/10">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-2xl font-extrabold mb-3 leading-tight text-white drop-shadow-sm">
                        {recipe.title}
                    </h1>

                    <div className="flex flex-wrap gap-3 text-xs font-medium text-white/90">
                        {recipe.metadata?.time && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-amber-400" />
                                <span>{recipe.metadata.time}</span>
                            </div>
                        )}
                        {recipe.metadata?.yield && (
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-blue-400" />
                                <span>{recipe.metadata.yield}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span>{recipe.calories} kcal</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Wheat className="w-4 h-4 text-amber-300" />
                            <span>{recipe.carbs}g carbs</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Card */}
            <div className="px-4 -mt-4 relative z-10">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
                    {/* Ingredients Section */}
                    <div className="p-5 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <ChefHat className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">Ingredientes</h2>
                        </div>

                        <ul className="space-y-2">
                            {ingredientsList.map((ing, i) => (
                                <li key={i} className="flex items-start gap-2.5 py-1.5">
                                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                    <span className="text-slate-700 text-sm leading-relaxed">{ing}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Instructions Section */}
                    <div className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-amber-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">Modo de Preparo</h2>
                        </div>

                        {instructionsList.length > 0 ? (
                            <div className="space-y-4">
                                {instructionsList.map((step, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 text-sm font-bold flex items-center justify-center shrink-0 border border-amber-100">
                                            {i + 1}
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed pt-1">
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="p-3 bg-slate-100 rounded-full mb-3">
                                    <AlertCircle className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="text-slate-500 text-sm font-medium mb-1">
                                    Instrucoes nao disponiveis
                                </p>
                                <p className="text-slate-400 text-xs max-w-[200px]">
                                    Use os ingredientes como guia e prepare conforme sua preferencia.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
