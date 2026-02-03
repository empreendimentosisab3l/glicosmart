'use client';

import { useState } from 'react';
import { ArrowLeft, Star, ChevronUp, ChevronDown } from 'lucide-react';
import { GlucoseReading } from '@/lib/types';
import {
  getStatusLabel,
  getMarkerPosition,
  getRecommendations,
  saveReading,
  type Recommendation,
} from '@/lib/measurementUtils';

interface MeasurementResultProps {
  reading: GlucoseReading;
  onRetest: () => void;
  onBack: () => void;
}

function RecommendationCard({ rec, defaultOpen }: { rec: Recommendation; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-start gap-2"
      >
        <span className={`mt-1 w-3 h-3 rounded-full shrink-0 ${rec.color === 'red' ? 'bg-red-400' : 'bg-blue-400'}`} />
        <span className={`font-bold text-sm flex-1 ${rec.color === 'red' ? 'text-red-500' : 'text-blue-500'}`}>
          {rec.title}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        )}
      </button>
      {open && (
        <p className="text-sm text-slate-600 mt-2 ml-5 leading-relaxed">
          {rec.description}
        </p>
      )}
    </div>
  );
}

export default function MeasurementResult({ reading, onRetest, onBack }: MeasurementResultProps) {
  const [saved, setSaved] = useState(false);
  const statusLabel = getStatusLabel(reading.status);
  const markerPos = getMarkerPosition(reading.glucoseValue);
  const recommendations = getRecommendations(reading.status);

  const date = new Date(reading.timestamp);
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  const handleSave = () => {
    saveReading(reading);
    setSaved(true);
  };

  const statusColorMap = {
    low: 'text-blue-500',
    normal: 'text-green-500',
    pre_diabetic: 'text-yellow-500',
    high: 'text-red-500',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-700 font-sans pb-32 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute top-1/3 -left-10 w-60 h-60 bg-emerald-300 rounded-full blur-3xl mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between relative z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
          <span className="font-bold text-lg tracking-tight">Resultado</span>
        </button>
        <button
          onClick={onRetest}
          className="text-white/80 font-bold text-sm bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm border border-white/20"
        >
          Reteste
        </button>
      </header>

      {/* Value Section - Centered & Premium */}
      <div className="px-6 py-8 flex flex-col items-center relative z-10">
        <div className="text-center mb-2">
          <span className="text-white/70 text-sm uppercase tracking-wider font-medium">{dateStr}</span>
        </div>
        <div className="flex items-baseline justify-center">
          <span className="text-[5rem] font-bold text-white leading-none tracking-tighter drop-shadow-sm">
            {Math.round(reading.glucoseValue)}
          </span>
          <span className="text-emerald-100 text-xl font-medium ml-2">mg/dL</span>
        </div>

        <div className="mt-2 flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white font-bold text-sm">Medição Estimada</span>
        </div>
      </div>

      {/* Glass Status Card */}
      <div className="mx-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-xl relative z-10">
        <h3 className={`text-3xl font-bold text-center mb-1 drop-shadow-sm ${reading.status === 'low' ? 'text-blue-200' :
          reading.status === 'normal' ? 'text-emerald-200' :
            reading.status === 'pre_diabetic' ? 'text-yellow-200' : 'text-red-200'
          }`}>
          {statusLabel}
        </h3>
        <p className="text-center text-white/60 text-sm font-medium">Faixa Ideal: 70 ~ 99</p>

        {/* Gradient Bar - Custom Look */}
        <div className="mt-6 relative px-2">
          <div className="h-4 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500 opacity-90 shadow-inner ring-1 ring-black/5" />
          {/* Marker */}
          <div
            className="absolute -top-1.5 transition-all duration-700 ease-out flex flex-col items-center"
            style={{ left: `${markerPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-7 h-7 bg-white rounded-full border-4 border-slate-900 shadow-xl" />
          </div>
          {/* Labels */}
          <div className="flex justify-between mt-3 text-[10px] uppercase font-bold text-white/40 tracking-wider">
            <span>70</span>
            <span>100</span>
            <span>126</span>
          </div>
        </div>
      </div>

      {/* Additional info - Grid */}
      <div className="mx-6 mt-4 grid grid-cols-3 gap-3 relative z-10">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-white font-bold text-xl tracking-tight">{reading.bpm}</p>
          <p className="text-emerald-100/60 text-[10px] uppercase font-bold mt-1">BPM</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-white font-bold text-xl tracking-tight">{reading.stressLevel ?? '--'}%</p>
          <p className="text-emerald-100/60 text-[10px] uppercase font-bold mt-1">Estresse</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-white font-bold text-xl tracking-tight">{reading.glucoseMgDl}</p>
          <p className="text-emerald-100/60 text-[10px] uppercase font-bold mt-1">mg/dL</p>
        </div>
      </div>

      {/* Recommendations - Clean White Card */}
      <div className="mx-6 mt-6 bg-white rounded-3xl p-6 shadow-xl relative z-10 ring-1 ring-black/5">
        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-lg shadow-sm">
            👩‍⚕️
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Assessoria IA</h3>
        </div>

        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          Olá! Seu resultado indica um nível <span className="font-bold text-slate-900">{statusLabel.toLowerCase()}</span>.
          {reading.status === 'normal'
            ? ' Ótimo trabalho mantendo sua saúde em dia!'
            : ' Separei algumas dicas importantes para você:'}
        </p>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 mb-6 flex gap-3">
          <div className="text-orange-500 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <p className="text-xs text-orange-800 leading-relaxed">
            <strong>Importante:</strong> Este resultado é apenas uma estimativa. Para precisão clínica, utilize sempre um <strong>glicosímetro</strong>. Este recurso não substitui equipamentos médicos profissionais.
          </p>
        </div>

        <div className="space-y-1">
          {recommendations.map((rec, i) => (
            <RecommendationCard key={i} rec={rec} defaultOpen={i === 0} />
          ))}
        </div>
      </div>

      {/* Save button - Premium Action */}
      {!saved && (
        <div className="mx-6 mt-6 relative z-10">
          <button
            onClick={handleSave}
            className="w-full h-14 bg-white text-emerald-600 rounded-2xl font-bold text-base hover:bg-emerald-50 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
          >
            <span>Salvar Resultado</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      )}
      {saved && (
        <p className="text-center text-white/80 text-sm mt-6 font-medium">
          Resultado salvo com sucesso!
        </p>
      )}

      {/* Disclaimer */}
      <p className="text-center text-white/40 text-[10px] mt-6 mx-6 leading-relaxed">
        Esta medição é uma estimativa simulada baseada em fotopletismografia e NÃO substitui exames laboratoriais reais. Consulte sempre seu médico.
      </p>
    </div>
  );
}
