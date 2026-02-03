'use client';

import Link from 'next/link';

import { useRecipe } from '@/contexts/RecipeContext';
import { User, Settings, Scale, Target, Utensils, ChevronRight, LogOut, Heart, Sparkles } from 'lucide-react';

export default function ProfilePage() {
    const { currentUser } = useRecipe();

    // Mock data if user is not set (for preview)
    const user = currentUser || {
        name: 'Visitante',
        email: 'visitante@exemplo.com',
        weight: 70,
        height: 1.75,
        goal: 'lose_weight',
        restrictions: ['Sem Glúten'],
        meals_per_day: 3
    };

    const getGoalLabel = (goal: string) => {
        switch (goal) {
            case 'lose_weight': return 'Perder Peso';
            case 'gain_muscle': return 'Ganhar Massa';
            case 'reeducation': return 'Reeducação';
            default: return goal;
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
            {/* Header with Fresh Gradient */}
            <div className="bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 pt-16 pb-24 px-6 rounded-b-[3rem] shadow-xl shadow-emerald-500/20 relative overflow-hidden">
                {/* Decor elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl"></div>

                <div className="flex items-center justify-between relative z-10 text-white mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
                    <button className="p-2.5 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all active:scale-95">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-5 relative z-10">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-300 to-emerald-300 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                        <div className="w-20 h-20 rounded-full bg-slate-100 p-1 relative shadow-lg">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                <User className="w-9 h-9 text-slate-300" />
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1.5">{user.name}</h2>
                        <span className="inline-flex items-center px-3 py-1 bg-white/25 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/20 shadow-sm">
                            <Sparkles className="w-3 h-3 mr-1.5" />
                            Membro Premium
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-12 relative z-20">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center gap-2 transition-transform hover:-translate-y-1 duration-300">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center mb-1 rotate-3 hover:rotate-6 transition-transform">
                            <Scale className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Peso Atual</span>
                        <span className="text-xl font-extrabold text-slate-800">{user.weight} <span className="text-sm font-semibold text-slate-400">kg</span></span>
                    </div>

                    <div className="bg-white p-5 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center gap-2 transition-transform hover:-translate-y-1 duration-300">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center mb-1 -rotate-3 hover:-rotate-6 transition-transform">
                            <Target className="w-5 h-5 text-purple-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Objetivo</span>
                        <span className="text-xl font-extrabold text-slate-800 text-center leading-tight">{getGoalLabel(user.goal)}</span>
                    </div>
                </div>

                {/* Info Section */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-6 group">
                    <div className="p-6">
                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                            Informações de Dieta
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between group/item">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                                        <Utensils className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <span className="text-slate-600 font-medium">Refeições ao dia</span>
                                </div>
                                <span className="font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{user.meals_per_day}</span>
                            </div>

                            <div className="h-px bg-slate-50 w-full"></div>

                            <div className="flex items-center justify-between group/item">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                                        <Heart className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <span className="text-slate-600 font-medium">Restrições</span>
                                </div>
                                <div className="flex gap-1.5 flex-wrap justify-end max-w-[50%]">
                                    {user.restrictions.length > 0 ? user.restrictions.map((r, i) => (
                                        <span key={i} className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold uppercase tracking-wide">{r}</span>
                                    )) : <span className="text-sm text-slate-400">Nenhuma</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                {/* Edit Profile Button - Prominent */}
                <Link href="/quiz" className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-[2rem] shadow-lg shadow-emerald-500/30 mb-6 group transition-all active:scale-[0.98]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg leading-none mb-1">Recalcular meu Plano</h3>
                                <p className="text-emerald-100 text-xs font-medium">Atualizar peso e preferências</p>
                            </div>
                        </div>
                        <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                            <ChevronRight className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </Link>

                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <button className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                                <Settings className="w-5 h-5 text-slate-600" />
                            </div>
                            <span className="font-bold text-slate-700 text-sm">Configurações do App</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                    </button>
                    <button className="w-full p-5 flex items-center justify-between hover:bg-rose-50/50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                                <LogOut className="w-5 h-5 text-rose-500" />
                            </div>
                            <span className="font-bold text-rose-600 text-sm">Sair da Conta</span>
                        </div>
                    </button>
                </div>

                <div className="mt-8 text-center pb-8">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">App Receitas • Versão 1.0.2</p>
                </div>

            </div>
        </main>
    );
}
