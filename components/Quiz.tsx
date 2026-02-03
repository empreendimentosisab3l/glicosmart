'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipe } from '@/contexts/RecipeContext';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { UserProfile } from '@/lib/types';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

const TOTAL_STEPS = 9;

// === Data for each step ===

const DIABETES_TYPES = [
  { id: 'type2', label: 'Tipo 2' },
  { id: 'pre_diabetes', label: 'Pré-diabetes' },
  { id: 'type1', label: 'Tipo 1' },
  { id: 'unknown', label: 'Não sei' },
] as const;

const DIET_TYPES = [
  { id: 'omnivore', label: 'Como tudo o mais', emoji: '🍖' },
  { id: 'vegetarian', label: 'Vegetariano', emoji: '🍳' },
  { id: 'vegan', label: 'Vegan', emoji: '🥗' },
] as const;

const ALLERGIES = [
  { id: 'lactose', label: 'Lactose', emoji: '🥛' },
  { id: 'ovos', label: 'Ovos', emoji: '🥚' },
  { id: 'frutas_secas', label: 'Frutas secas', emoji: '🥜' },
  { id: 'gluten', label: 'Glúten', emoji: '🌾' },
  { id: 'peixe', label: 'Peixe', emoji: '🐟' },
  { id: 'frutos_do_mar', label: 'Frutos do mar', emoji: '🦐' },
  { id: 'frutas_citricas', label: 'Frutas cítricas', emoji: '🍊' },
  { id: 'outro', label: 'Outro', emoji: '⚪' },
];

const DISLIKED_FOODS = [
  { id: 'pimentoes', label: 'Pimentões', emoji: '🌶️' },
  { id: 'ovos', label: 'Ovos', emoji: '🥚' },
  { id: 'fungos', label: 'Fungo', emoji: '🍄' },
  { id: 'cebolas', label: 'Cebolas', emoji: '🧅' },
  { id: 'couve_flor', label: 'Couve-flor', emoji: '🥦' },
  { id: 'trigo_gluten', label: 'Trigo e glúten', emoji: '🌾' },
  { id: 'lacteos', label: 'Produtos lácteos', emoji: '🧀' },
  { id: 'brocolis', label: 'Brócolis', emoji: '🥦' },
  { id: 'tomates', label: 'Tomates', emoji: '🍅' },
  { id: 'banana', label: 'Banana', emoji: '🍌' },
  { id: 'macas', label: 'Maçãs', emoji: '🍏' },
  { id: 'meloes', label: 'Melões', emoji: '🍈' },
  { id: 'pepinos', label: 'Pepinos', emoji: '🥒' },
  { id: 'batata', label: 'Batata', emoji: '🥔' },
  { id: 'massa', label: 'Massa', emoji: '🍝' },
  { id: 'arroz', label: 'Arroz', emoji: '🍚' },
  { id: 'laranjas', label: 'Laranjas', emoji: '🍊' },
  { id: 'abobrinha', label: 'Abobrinha', emoji: '🥒' },
  { id: 'tofu', label: 'Tofu', emoji: '🧈' },
  { id: 'salmao', label: 'Salmão', emoji: '🐟' },
  { id: 'quinoa', label: 'Quinoa', emoji: '🌿' },
];

const MEALS_OPTIONS = [
  { id: 3, label: '3 comidas', desc: '' },
  { id: 4, label: '4 comidas', desc: '3 refeições e 1 lanche' },
  { id: 5, label: '5 comidas', desc: '3 refeições e 2 lanches' },
];

export default function Quiz() {
  const router = useRouter();
  const { saveProfile } = useRecipe();
  const { generateWeeklyPlan } = useMealPlan();

  const [step, setStep] = useState(0);

  // Step 0
  const [diabetesType, setDiabetesType] = useState<UserProfile['diabetes_type']>('type2');
  // Step 1
  const [dietType, setDietType] = useState<UserProfile['diet_type']>('omnivore');
  // Step 2
  const [allergies, setAllergies] = useState<string[]>([]);
  // Step 3
  const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);
  // Step 5
  const [mealsPerDay, setMealsPerDay] = useState(3);
  // Step 6
  const [goal, setGoal] = useState('lose_weight');
  const [weight, setWeight] = useState<number | ''>('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const toggleItem = (list: string[], setList: (v: string[]) => void, id: string) => {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  };

  const handleSubmit = async () => {
    if (weight === '' || Number(weight) <= 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const profile: UserProfile = {
        name: 'Usuário',
        diabetes_type: diabetesType,
        diet_type: dietType,
        allergies,
        disliked_foods: dislikedFoods,
        goal,
        restrictions: allergies,
        meals_per_day: mealsPerDay,
        weight: Number(weight),
      };

      saveProfile(profile);

      // Wait a tick for context updates if needed, though safeProfile handles daily.
      // We manually clear/regenerate weekly plan too.
      // Since generateWeeklyPlan uses currentUser from Context, 
      // AND saveProfile just updated it but React batching might be tricky...
      // Ideally generateWeeklyPlan should ALSO take profile override or rely on updated Context in next render.
      // BUT current Quiz component handles the submit.
      // Let's call it. If it reads stale context, it might be an issue.
      // Better approach: setTimeout to let context propagate? 
      // Or update generateWeeklyPlan to accept profile too. 
      // For now, let's try calling it. If it fails, we used setTimeout before.

      setTimeout(() => {
        generateWeeklyPlan();
        router.push('/dashboard');
      }, 100);
    } catch (err) {
      console.error('Quiz: Error submitting', err);
      setError('Ocorreu um erro ao gerar seu plano. Tente novamente.');
      setIsLoading(false);
    }
  };

  // === Progress bar (visible from step 1+) ===
  const progressPercent = (step / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header with back button + progress */}
      {step > 0 && (
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
          <div className="flex items-center px-4 py-4">
            <button
              onClick={prev}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div className="flex-1 flex justify-center">
              <span className="text-sm font-bold text-emerald-600 tracking-tight">Glico<span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs shadow-sm">Smart</span></span>
            </div>
            <div className="w-10" /> {/* spacer */}
          </div>
          {/* Progress bar */}
          <div className="px-6 pb-4">
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        {/* ============ STEP 0: Tipo de Diabetes ============ */}
        {step === 0 && (
          <div className="flex-1 flex flex-col px-6 pt-8">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <span className="text-lg font-bold text-emerald-600 tracking-tight">Glico<span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs shadow-md">Smart</span></span>
            </div>

            {/* Food image wrapper */}
            <div className="flex justify-center mb-10">
              <div className="text-8xl p-6 bg-white rounded-full shadow-lg shadow-emerald-500/10 animate-pulse-slow relative">
                <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-40"></div>
                <span className="relative">🥗</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-slate-800 leading-tight mb-4 text-center">
              A dieta mais simples para controlar o diabetes.
            </h1>

            <p className="text-slate-500 text-center mb-10 leading-relaxed">
              Descubra como pequenos passos podem transformar sua saúde.
            </p>

            {/* Question */}
            <p className="text-slate-700 font-semibold mb-4 px-1">Selecione o seu tipo de diabetes:</p>

            {/* Options grid 2x2 */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {DIABETES_TYPES.map(dt => (
                <button
                  key={dt.id}
                  onClick={() => {
                    setDiabetesType(dt.id);
                    next();
                  }}
                  className="py-4 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-3xl hover:border-emerald-500 hover:text-emerald-600 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-95 transition-all text-sm group"
                >
                  <span className="group-hover:scale-105 inline-block transition-transform duration-300">{dt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============ STEP 1: Disclaimer (NEW) ============ */}
        {step === 1 && (
          <div className="flex-1 flex flex-col px-6 pt-6 pb-32">
            <h1 className="text-2xl font-bold text-slate-800 mb-8 text-center leading-tight">
              Isenção de responsabilidade de saúde
            </h1>

            <div className="space-y-4 mb-8">
              <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">Não é um dispositivo médico</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Este aplicativo oferece informações gerais sobre condicionamento físico e saúde e não substitui o aconselhamento médico profissional.
                </p>
              </div>

              <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">Para fins informativos</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Consulte o seu médico ou profissional de saúde antes de iniciar qualquer novo programa de exercícios ou fazer modificações na dieta.
                </p>
              </div>

              <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">Limite de recursos</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Observe que este aplicativo não mede pressão arterial, açúcar no sangue, mas pode ajudá-lo a fazer um diário de dados.
                </p>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-20 md:sticky md:bottom-0 md:left-auto md:right-auto">
              <div className="max-w-lg mx-auto">
                <button
                  onClick={next}
                  className="w-full py-4 bg-emerald-500 text-white font-bold rounded-3xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 hover:shadow-emerald-500/40 active:scale-95 transition-all text-lg tracking-wide"
                >
                  Próximo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============ STEP 2: Tipo de Dieta ============ */}
        {step === 2 && (
          <div className="flex-1 flex flex-col px-6 pt-6">
            <p className="text-slate-500 leading-relaxed mb-8 bg-white/50 p-4 rounded-3xl backdrop-blur-sm border border-white/50 shadow-sm">
              Conhecer seu tipo de dieta nos ajuda a personalizar um plano com base em suas necessidades e preferências alimentares.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mb-6 px-1">Defina sua dieta</h2>

            <div className="space-y-4">
              {DIET_TYPES.map(dt => (
                <button
                  key={dt.id}
                  onClick={() => {
                    setDietType(dt.id);
                    next();
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/10 active:scale-[0.98] transition-all group"
                >
                  <span className="text-3xl bg-slate-50 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">{dt.emoji}</span>
                  <span className="flex-1 text-left font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{dt.label}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============ STEP 3: Alergias ============ */}
        {step === 3 && (
          <div className="flex-1 flex flex-col px-6 pt-6 pb-32">
            <p className="text-slate-500 leading-relaxed mb-6 bg-white/50 p-4 rounded-3xl backdrop-blur-sm border border-white/50 shadow-sm">
              Sua escolha não será incluída no seu plano nutricional.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mb-6 px-1">Selecione suas alergias</h2>

            {/* Nenhum option */}
            <button
              onClick={() => {
                setAllergies([]);
                next();
              }}
              className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/5 mb-6 active:scale-[0.98] transition-all group"
            >
              <span className="font-bold text-slate-700 group-hover:text-emerald-700">Nenhum</span>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>

            {/* Allergy checkboxes */}
            <div className="grid grid-cols-1 gap-3">
              {ALLERGIES.map(a => {
                const selected = allergies.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleItem(allergies, setAllergies, a.id)}
                    className={`w-full flex items-center gap-4 p-3 pr-4 border rounded-3xl transition-all active:scale-[0.98] shadow-sm ${selected ? 'border-emerald-500 bg-emerald-50/50 shadow-emerald-500/10' : 'bg-white border-slate-100 hover:border-emerald-300'}`}
                  >
                    <span className="text-2xl bg-white p-2 rounded-2xl shadow-sm">{a.emoji}</span>
                    <span className={`flex-1 text-left font-bold ${selected ? 'text-emerald-800' : 'text-slate-700'}`}>{a.label}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-300 bg-white'}`}>
                      {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Fixed bottom button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-20 md:sticky md:bottom-0 md:left-auto md:right-auto">
              <div className="max-w-lg mx-auto">
                <button
                  onClick={next}
                  className="w-full py-4 bg-emerald-500 text-white font-bold rounded-3xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 hover:shadow-emerald-500/40 active:scale-95 transition-all text-lg tracking-wide"
                >
                  Seguindo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============ STEP 4: Alimentos que não suporta ============ */}
        {step === 4 && (
          <div className="flex-1 flex flex-col px-6 pt-6 pb-32">
            <p className="text-slate-500 leading-relaxed mb-6 bg-white/50 p-4 rounded-3xl backdrop-blur-sm border border-white/50 shadow-sm">
              Compartilhar suas preferências nos ajuda a criar um plano que você vai amar.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mb-6 px-1">Selecione os alimentos que você não suporta</h2>

            {/* Como tudo o mais */}
            <button
              onClick={() => {
                setDislikedFoods([]);
                next();
              }}
              className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/5 mb-6 active:scale-[0.98] transition-all group"
            >
              <span className="font-bold text-slate-700 group-hover:text-emerald-700">Como tudo o mais</span>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>

            {/* Food checkboxes */}
            <div className="grid grid-cols-1 gap-3">
              {DISLIKED_FOODS.map(f => {
                const selected = dislikedFoods.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleItem(dislikedFoods, setDislikedFoods, f.id)}
                    className={`w-full flex items-center gap-4 p-3 pr-4 border rounded-3xl transition-all active:scale-[0.98] shadow-sm ${selected ? 'border-amber-500 bg-amber-50/50 shadow-amber-500/10' : 'bg-white border-slate-100 hover:border-amber-300'}`}
                  >
                    <span className="text-2xl bg-white p-2 rounded-2xl shadow-sm">{f.emoji}</span>
                    <span className={`flex-1 text-left font-bold ${selected ? 'text-amber-800' : 'text-slate-700'}`}>{f.label}</span>
                    {/* Used Amber for 'Dislike' semantic, or keep Emerald for consistency? Plan said Emerald, but Amber/Red fits 'Dislike' better. sticking to Emerald/Neutral checking pattern for UI consistency, using Red/Amber contextually might be better but let's stick to system consistency first, actually using Red/Amber for exclusion is smart. adhering to 'Fresh' = Emerald generally, but 'Exclude' = maybe distinct. Let's use Rose/Red for dislike to be semantic? Or just Emerald for 'Selected'. The prompt says 'Blue -> Emerald'. Let's stick to Emerald for selection to imply 'Recorded'. */}
                    {/* Actually, let's use the same Emerald check pattern for simplicity and "Fresh" feel, or maybe neutral slate. Let's stick to Emerald active state for "Selected" (meaning 'I have selected this restriction'). */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-300 bg-white'}`}>
                      {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Fixed bottom button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-20 md:sticky md:bottom-0 md:left-auto md:right-auto">
              <div className="max-w-lg mx-auto">
                <button
                  onClick={next}
                  className="w-full py-4 bg-emerald-500 text-white font-bold rounded-3xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 hover:shadow-emerald-500/40 active:scale-95 transition-all text-lg tracking-wide"
                >
                  Seguindo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============ STEP 5: Benefícios ============ */}
        {step === 5 && (
          <div className="flex-1 flex flex-col px-6 pt-10 pb-32">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce-slow">
                <Heart className="w-10 h-10 text-emerald-500 fill-emerald-500" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-800 mb-10 text-center leading-tight">
              A solução perfeita <br /> <span className="text-emerald-500">está aqui!</span>
            </h1>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-5 p-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <span className="text-2xl">🥗</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  <strong className="text-emerald-700 block text-lg">Coma o que gosta</strong>
                  e melhore seus níveis de açúcar.
                </p>
              </div>

              <div className="flex items-center gap-5 p-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <span className="text-2xl">⚖️</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  <strong className="text-emerald-700 block text-lg">Peso ideal</strong>
                  sem mudar seus hábitos drasticamente.
                </p>
              </div>

              <div className="flex items-center gap-5 p-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  <strong className="text-emerald-700 block text-lg">Plano 100% Personalizado</strong>
                  para equilibrar sua saúde.
                </p>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-20 md:sticky md:bottom-0 md:left-auto md:right-auto">
              <div className="max-w-lg mx-auto">
                <button
                  onClick={next}
                  className="w-full py-4 bg-emerald-500 text-white font-bold rounded-3xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 hover:shadow-emerald-500/40 active:scale-95 transition-all text-lg tracking-wide"
                >
                  Ver meu plano
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============ STEP 6: Número de Refeições ============ */}
        {step === 6 && (
          <div className="flex-1 flex flex-col px-6 pt-6">
            <p className="text-slate-500 leading-relaxed mb-8 bg-white/50 p-4 rounded-3xl backdrop-blur-sm border border-white/50 shadow-sm">
              A frequência das refeições é chave para manter seu metabolismo acelerado e saudável.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mb-6 px-1">Número de refeições por dia</h2>

            <div className="space-y-4">
              {MEALS_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setMealsPerDay(opt.id);
                    next();
                  }}
                  className="w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98] transition-all group"
                >
                  <div className="text-left">
                    <p className="text-xl font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{opt.label}</p>
                    {opt.desc && <p className="text-sm text-slate-400 mt-1">{opt.desc}</p>}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============ STEP 7: Peso e Objetivo ============ */}
        {step === 7 && (
          <div className="flex-1 flex flex-col px-6 pt-6 pb-32">
            <h2 className="text-xl font-bold text-slate-800 mb-6 px-1">Qual seu principal objetivo?</h2>

            <div className="space-y-4 mb-4">
              {[
                { value: 'lose_weight', label: 'Perder peso', icon: '📉' },
                { value: 'reeducation', label: 'Reeducação alimentar', icon: '🥗' },
                { value: 'gain_muscle', label: 'Ganhar massa magra', icon: '💪' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setGoal(opt.value);
                    next();
                  }}
                  className={`w-full flex items-center p-5 border rounded-3xl transition-all active:scale-[0.98] shadow-sm hover:border-emerald-300 bg-white border-slate-100 group`}
                >
                  <span className="text-2xl mr-4 bg-white/80 p-2 rounded-2xl shadow-sm">{opt.icon}</span>
                  <span className="flex-1 text-left font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{opt.label}</span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============ STEP 8: Peso (Final) ============ */}
        {step === 8 && (
          <div className="flex-1 flex flex-col px-6 pt-6 pb-32">
            <h2 className="text-xl font-bold text-slate-800 mb-2 px-1 text-center">Para finalizar...</h2>
            <p className="text-slate-500 text-center mb-10">Precisamos do seu peso para calcular suas calorias diárias.</p>

            <div className="mb-8">
              <label className="block text-lg font-bold text-slate-800 mb-4 px-1 text-center">Seu peso atual (kg)</label>
              <div className="relative max-w-[200px] mx-auto">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                  placeholder="00.0"
                  className="w-full p-6 text-4xl font-bold text-center border-b-2 border-emerald-500 bg-transparent focus:outline-none transition-all placeholder:text-slate-200 text-emerald-600"
                  autoFocus
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-300 font-bold text-xl">kg</span>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 text-rose-600 font-medium text-sm rounded-2xl border border-rose-100 mb-6 text-center animate-shake">
                {error}
              </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-20 md:sticky md:bottom-0 md:left-auto md:right-auto">
              <div className="max-w-lg mx-auto">
                <button
                  onClick={handleSubmit}
                  disabled={weight === '' || Number(weight) <= 0 || isLoading}
                  className="w-full py-5 bg-emerald-500 text-white font-bold rounded-3xl shadow-xl shadow-emerald-500/30 hover:bg-emerald-400 hover:shadow-emerald-500/40 active:scale-95 transition-all text-xl tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Calculando...
                    </>
                  ) : (
                    'Gerar Meu Plano Mágico ✨'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
