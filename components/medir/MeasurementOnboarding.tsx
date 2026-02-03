'use client';

import { useState } from 'react';
import { Smartphone, Activity, Sun } from 'lucide-react';

interface MeasurementOnboardingProps {
  onStart: () => void;
}

const steps = [
  {
    number: 1,
    icon: Smartphone,
    title: 'Coloque delicadamente a ponta de um dedo sobre a câmera do celular.',
    subtitle: 'Certifique-se de que ela cubra totalmente a lente (NÃO a lanterna, que é quente).',
    tip: 'Quando o visor ficar vermelho, você está realizando a ação correta',
    illustration: 'finger',
  },
  {
    number: 2,
    icon: Activity,
    title: 'Fique parado até que a medição seja concluída!',
    subtitle: 'A medição leva cerca de 30 segundos. Mantenha o dedo firme sobre a câmera.',
    tip: 'Quando o visor ficar vermelho, você está realizando a ação correta',
    illustration: 'measuring',
  },
  {
    number: 3,
    icon: Sun,
    title: 'Para obter resultados precisos, meça com boa iluminação ou com a lanterna ligada.',
    subtitle: 'Boa iluminação ajuda a câmera a detectar as variações de cor na ponta do dedo.',
    tip: 'Quando o visor ficar vermelho, você está realizando a ação correta',
    illustration: 'light',
  },
];

function StepIllustration({ type }: { type: string }) {
  if (type === 'finger') {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        {/* Phone body */}
        <div className="relative w-28 h-48 bg-slate-700 rounded-[1.5rem] border-[3px] border-slate-600 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Screen glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-800 to-slate-600 opacity-50"></div>

          {/* Camera lens */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            <div className="w-5 h-5 bg-black rounded-full border border-slate-500 shadow-inner" />
            <div className="w-3 h-3 bg-black rounded-full border border-slate-500 shadow-inner mt-1" />
          </div>

          {/* Red glow on camera - Interaction Point */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-12 bg-red-500/30 rounded-full blur-xl animate-pulse" />

          {/* Finger - Placing */}
          <div className="absolute top-2 right-12 z-20 animate-[pulse_3s_ease-in-out_infinite]">
            <div className="w-12 h-24 bg-amber-200 rounded-full border-4 border-amber-100/20 transform rotate-12 shadow-xl origin-bottom">
              <div className="absolute top-2 left-2 w-8 h-12 bg-white/20 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'measuring') {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-[#4A90D9] to-blue-600 flex items-center justify-center overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

        {/* Central Pulse */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 blur-xl rounded-full animate-ping"></div>
            <svg viewBox="0 0 40 36" className="w-20 h-20 text-white drop-shadow-lg animate-[pulse_0.8s_ease-in-out_infinite]">
              <path
                fill="currentColor"
                d="M20 35.7l-2.2-2C7.1 24.2 0 17.8 0 10 0 4.5 4.5 0 10 0c3.1 0 6.1 1.5 8 3.8C21.9 1.5 24.9 0 28 0c5.5 0 10 4.5 10 10 0 7.8-7.1 14.2-17.8 23.7L20 35.7z"
              />
            </svg>
          </div>
          <div className="mt-4 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/20">
            <span className="text-white font-mono text-sm font-bold tracking-widest">DETECTANDO...</span>
          </div>
        </div>

        {/* ECG Line Background */}
        <svg className="absolute bottom-0 left-0 w-full h-24 opacity-30" preserveAspectRatio="none">
          <path d="M0,50 L40,50 L50,20 L60,80 L70,50 L300,50" fill="none" stroke="white" strokeWidth="2" strokeDasharray="300" strokeDashoffset="0">
            <animate attributeName="stroke-dashoffset" from="300" to="0" dur="2s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>
    );
  }

  // light
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden">
      {/* Sun Rays */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[150%] h-[150%] bg-[conic-gradient(from_0deg,transparent_0_10deg,rgba(255,255,255,0.2)_10deg_20deg)_repeat] animate-[spin_20s_linear_infinite] opacity-30"></div>
      </div>

      <div className="relative z-10 bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-2xl flex flex-col items-center">
        <Sun className="w-16 h-16 text-yellow-100 drop-shadow-md animate-[spin_10s_linear_infinite]" />
        <div className="mt-3 text-white font-bold text-center leading-tight">
          <p className="text-lg">Ambiente</p>
          <p className="text-2xl">Iluminado</p>
        </div>
      </div>
    </div>
  );
}

export default function MeasurementOnboarding({ onStart }: MeasurementOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  // Swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && !isLast) {
      setCurrentStep(s => s + 1);
    }
    if (isRightSwipe && currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  return (
    <div
      className="h-[100dvh] bg-gradient-to-br from-emerald-500 to-teal-700 font-sans flex flex-col overflow-hidden relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute top-1/3 -left-10 w-60 h-60 bg-emerald-300 rounded-full blur-3xl mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <header className="px-6 pt-6 pb-2 shrink-0 relative z-10">
        <h1 className="text-lg font-bold text-white tracking-tight opacity-90">Como Medir</h1>
      </header>

      {/* Content - scrollable middle */}
      <div className="flex-1 overflow-y-auto px-6 relative z-10 flex flex-col justify-center">

        {/* Step Indicator Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>

          <div className="flex gap-4">
            <span className="shrink-0 w-10 h-10 bg-white text-emerald-600 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
              {step.number}
            </span>
            <div>
              <p className="text-white font-bold text-lg leading-snug tracking-tight mb-2">{step.title}</p>
              {step.subtitle && (
                <p className="text-sm text-emerald-50/70 leading-relaxed font-medium">{step.subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Illustration Container - Glass Effect */}
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black/20 backdrop-blur-sm">
          <StepIllustration type={step.illustration} />

          {/* Tip Overlay */}
          <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-md p-3 text-center border-t border-white/10">
            <p className="text-xs text-white/90 font-medium">
              Dica: <span className="text-emerald-300">Visor vermelho</span> = Posição correta
            </p>
          </div>
        </div>
      </div>

      {/* Footer - always pinned at bottom */}
      <div className="px-6 pb-36 pt-6 shrink-0 relative z-10">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/20'
                }`}
            />
          ))}
        </div>

        {/* Button */}
        {isLast ? (
          <button
            onClick={onStart}
            className="w-full bg-white text-emerald-600 py-4.5 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
          >
            <span>Começar Agora</span>
            <Activity className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep((s) => s + 1)}
            className="w-full py-4.5 text-white font-bold text-lg hover:bg-white/10 transition-colors bg-white/5 rounded-2xl active:scale-[0.98] border border-white/10 backdrop-blur-sm"
          >
            Próximo
          </button>
        )}
      </div>
    </div>
  );
}
