'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RecipeSummary } from '@/lib/types';

interface HorizontalRecipeListProps {
    recipes: RecipeSummary[];
}

export function HorizontalRecipeList({ recipes }: HorizontalRecipeListProps) {
    const [visibleCount, setVisibleCount] = useState(10);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + 10, recipes.length));
                }
            },
            { root: null, rootMargin: '0px', threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [recipes.length]);

    const visibleRecipes = recipes.slice(0, visibleCount);

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 pr-6 snap-x snap-mandatory hide-scrollbar">
            {visibleRecipes.map((recipe) => (
                <Link
                    key={recipe.id}
                    href={`/receitas/${recipe.slug}`}
                    className="min-w-[160px] max-w-[160px] snap-start shrink-0 block hover:opacity-95 transition-opacity"
                >
                    <div className="relative h-40 rounded-2xl overflow-hidden mb-3 shadow-sm group">
                        <Image
                            src={recipe.image_url}
                            alt={recipe.title}
                            fill
                            sizes="160px"
                            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 text-white font-bold text-sm">
                            {recipe.calories} kcal
                        </div>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1 truncate">
                        {recipe.title}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        {recipe.tags[0]
                            ? recipe.tags[0].charAt(0).toUpperCase() + recipe.tags[0].slice(1)
                            : 'Geral'}
                    </p>
                </Link>
            ))}

            {/* Sentinel for Intersection Observer */}
            {visibleCount < recipes.length && (
                <div
                    ref={loadMoreRef}
                    className="min-w-[40px] flex items-center justify-center"
                >
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
