'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect, ReactNode } from 'react';
import { useRecipe } from '@/contexts/RecipeContext';
import { ChevronRight, User, Heart } from 'lucide-react';
import { HorizontalRecipeList } from './HorizontalRecipeList';

// Lazy-render wrapper: only mounts children when visible in viewport
function LazySection({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={visible ? undefined : { minHeight: 220 }}>
      {visible ? children : null}
    </div>
  );
}

export default function Dashboard() {
  const { currentUser, currentPlan, sections, generateDailyPlan, isLoading } = useRecipe();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-20 glass-panel border-b-0 shadow-sm/50">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Olá, {currentUser?.name || 'Visitante'}
            </h1>
            <p className="text-sm text-slate-500 font-medium">Descubra suas opções para hoje</p>
          </div>
          <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 shadow-inner">
            <User className="h-6 w-6" />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-8 pt-6">
        {/* Measurement Feature */}
        <section className="px-6">
          <Link href="/medir">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-4 shadow-lg shadow-rose-200 flex items-center justify-between group active:scale-95 transition-all">
              <div className="text-white">
                <h3 className="font-bold text-lg leading-tight">Medir Glicose</h3>
                <p className="text-red-50 text-xs font-medium mt-1">Registre seus níveis agora</p>
              </div>
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                <Heart className="h-6 w-6 text-white fill-white/20" />
              </div>
            </div>
          </Link>
        </section>

        {/* Daily Plan Feature */}
        <section className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Sua Sugestão do Dia</h2>
            <button
              onClick={generateDailyPlan}
              className="text-sm font-bold text-primary hover:text-green-700 transition-all active:scale-95"
            >
              Atualizar
            </button>
          </div>

          {currentPlan && Array.isArray(currentPlan) && (
            <div className="space-y-4">
              {currentPlan.map((slot: any, index: number) => {
                if (!slot.recipe) return null;

                // Map internal type to friendly label
                const labels: Record<string, string> = {
                  breakfast: 'Café da Manhã',
                  lunch: 'Almoço',
                  dinner: 'Jantar',
                  snack: 'Lanche',
                };

                return (
                  <div key={`${slot.type}-${index}`} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm relative shrink-0">
                      <Image
                        src={slot.recipe.image_url}
                        alt={slot.recipe.title}
                        fill
                        sizes="64px"
                        priority={index < 3}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{labels[slot.type] || slot.type}</p>
                      <h3 className="font-bold text-slate-900 leading-tight truncate">{slot.recipe.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{slot.recipe.calories} kcal</p>
                    </div>
                    <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all active:scale-90 shrink-0">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Dynamic Sections (Discovery) - lazy rendered for performance */}
        {sections.map(section => (
          <LazySection key={section.title} className="pl-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">{section.title}</h2>

            {/* Horizontal Scroll Container */}
            <HorizontalRecipeList recipes={section.recipes} />
          </LazySection>
        ))}
      </main>


    </div>
  );
}
