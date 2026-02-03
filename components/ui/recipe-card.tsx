import Link from 'next/link';
import { Recipe } from '@/lib/types';
import { Clock, ChefHat, Users, ArrowRight } from 'lucide-react';

interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    if (!recipe.slug) return null;

    return (
        <Link
            href={`/receitas/${recipe.slug}`}
            className="group block bg-white rounded-3xl shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border border-slate-100 overflow-hidden hover:-translate-y-1"
        >
            <div className="p-5">
                <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] leading-tight">
                    {recipe.title}
                </h3>

                <div className="flex flex-wrap gap-2 mt-4 text-xs font-medium text-slate-500">
                    {recipe.metadata?.time && (
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-full border border-slate-100">
                            <Clock className="w-3.5 h-3.5 text-orange-400" />
                            <span>{recipe.metadata.time}</span>
                        </div>
                    )}
                    {recipe.metadata?.yield && (
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-full border border-slate-100">
                            <Users className="w-3.5 h-3.5 text-blue-400" />
                            <span>{recipe.metadata.yield}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex items-center justify-between group-hover:bg-emerald-50/30 transition-colors">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {recipe.metadata?.difficulty || 'Fácil'}
                </span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
    );
}
