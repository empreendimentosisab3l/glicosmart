import { GlucoseReading, GlucoseStatus } from './types';

// --- Frame Processing (PPG) ---

export function analyzeFrame(imageData: ImageData): { r: number; g: number; b: number } {
  const { data, width, height } = imageData;
  // Sample center region (middle 40% of frame)
  const startX = Math.floor(width * 0.3);
  const endX = Math.floor(width * 0.7);
  const startY = Math.floor(height * 0.3);
  const endY = Math.floor(height * 0.7);

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let count = 0;

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const i = (y * width + x) * 4;
      totalR += data[i];     // Red
      totalG += data[i + 1]; // Green
      totalB += data[i + 2]; // Blue
      count++;
    }
  }

  if (count === 0) return { r: 0, g: 0, b: 0 };
  return {
    r: totalR / count,
    g: totalG / count,
    b: totalB / count,
  };
}

export function isFingerDetected(rgb: { r: number; g: number; b: number }): boolean {
  // Robust check: Red must be significantly brighter than Blue and Green
  // and have a minimum brightness to avoid dark noise.
  // Thresholds: Red > 60 (brightness), Red > Green * 1.5, Red > Blue * 1.5
  const { r, g, b } = rgb;
  return r > 60 && r > (g * 1.5) && r > (b * 1.5);
}

// --- BPM Detection ---

export function detectPeaks(samples: number[], minDistance: number = 10): number[] {
  const peaks: number[] = [];
  if (samples.length < 3) return peaks;

  // Smooth signal with moving average
  const smoothed = movingAverage(samples, 5);

  // Find mean and threshold
  const mean = smoothed.reduce((a, b) => a + b, 0) / smoothed.length;
  const threshold = mean * 1.02; // Slightly above mean

  for (let i = 1; i < smoothed.length - 1; i++) {
    if (
      smoothed[i] > smoothed[i - 1] &&
      smoothed[i] > smoothed[i + 1] &&
      smoothed[i] > threshold
    ) {
      // Check min distance from last peak
      if (peaks.length === 0 || i - peaks[peaks.length - 1] >= minDistance) {
        peaks.push(i);
      }
    }
  }

  return peaks;
}

function movingAverage(data: number[], windowSize: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.floor(windowSize / 2) + 1);
    const window = data.slice(start, end);
    result.push(window.reduce((a, b) => a + b, 0) / window.length);
  }
  return result;
}

export function calculateBPM(peaks: number[], fps: number): number {
  if (peaks.length < 2) return 0;

  const intervals: number[] = [];
  for (let i = 1; i < peaks.length; i++) {
    intervals.push(peaks[i] - peaks[i - 1]);
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const bpm = (60 * fps) / avgInterval;

  // Clamp to reasonable range
  return Math.round(Math.max(40, Math.min(200, bpm)));
}

// --- Glucose Simulation ---
// DISCLAIMER: This is a SIMULATION. Real glucose cannot be measured via camera.
// The value is generated based on BPM as a rough entertainment/demo feature.

export function simulateGlucose(bpm: number): number {
  // User request: Random result, different every time, avoiding extremes.
  // Target range: 4.5 to 6.4 mmol/L (Normal to Pre-diabetic border)
  // Extremes to avoid: < 4.0 (Low) and > 7.0 (High)

  // Generate a random base between 80 and 115 (mg/dL)
  const min = 80;
  const max = 115;
  const randomValue = min + Math.random() * (max - min);

  // Add a tiny bit of BPM influence just to make it "feel" connected (optional)
  // If BPM is high (>90), add 2 or 3 mg/dL.
  const bpmAdjustment = bpm > 90 ? 3 : 0;

  const finalValue = randomValue + bpmAdjustment;

  return Math.round(finalValue); // Integer for mg/dL
}

export function mmolToMgDl(mmol: number): number {
  return Math.round(mmol * 18);
}

export function getGlucoseStatus(value: number): GlucoseStatus {
  if (value < 70) return 'low';
  if (value <= 99) return 'normal';
  if (value <= 125) return 'pre_diabetic';
  return 'high';
}

export function getStatusLabel(status: GlucoseStatus): string {
  switch (status) {
    case 'low': return 'Baixo';
    case 'normal': return 'Normal';
    case 'pre_diabetic': return 'Atenção';
    case 'high': return 'Elevado';
  }
}

export function getStatusColor(status: GlucoseStatus): string {
  switch (status) {
    case 'low': return 'text-blue-500';
    case 'normal': return 'text-green-500';
    case 'pre_diabetic': return 'text-yellow-500';
    case 'high': return 'text-red-500';
  }
}

export function simulateStress(bpm: number): number {
  // Simple stress simulation based on BPM
  if (bpm <= 70) return Math.round(10 + Math.random() * 20);
  if (bpm <= 85) return Math.round(25 + Math.random() * 25);
  if (bpm <= 100) return Math.round(45 + Math.random() * 25);
  return Math.round(65 + Math.random() * 30);
}

export function createReading(bpm: number): GlucoseReading {
  const glucoseValue = simulateGlucose(bpm);
  return {
    id: `reading_${Date.now()}`,
    timestamp: new Date().toISOString(),
    bpm,
    glucoseValue,
    glucoseMgDl: glucoseValue, // Now same value
    status: getGlucoseStatus(glucoseValue),
    stressLevel: simulateStress(bpm),
  };
}

// --- Recommendations ---

export interface Recommendation {
  title: string;
  description: string;
  color: 'blue' | 'red';
}

export function getRecommendations(status: GlucoseStatus): Recommendation[] {
  const base: Recommendation[] = [
    {
      title: 'Manter uma alimentação equilibrada',
      description: 'Continue a seguir uma dieta equilibrada rica em frutas, legumes, cereais integrais e proteínas magras. Limite o consumo de alimentos açucarados e processados para ajudar a manter os níveis de açúcar no sangue estáveis.',
      color: 'blue',
    },
    {
      title: 'Manter-se Ativo Fisicamente',
      description: 'Engaje-se em atividade física regular, como caminhadas, corridas, ciclismo ou qualquer exercício de sua preferência. O exercício regular pode ajudar a melhorar a sensibilidade à insulina e promover o bem-estar geral.',
      color: 'blue',
    },
    {
      title: 'Monitorar regularmente a glicemia',
      description: 'Se você tem diabetes ou está em risco de desenvolver diabetes, acompanhe regularmente os níveis de açúcar no sangue, conforme orientado pelo seu profissional de saúde.',
      color: 'blue',
    },
    {
      title: 'Manter um Peso Saudável',
      description: 'Se você está com sobrepeso ou obeso, trabalhe para alcançar e manter um peso saudável por meio de uma combinação de dieta e exercícios. Isso pode reduzir o risco de desenvolver diabetes e outras condições crônicas.',
      color: 'blue',
    },
    {
      title: 'Gerenciar o Estresse',
      description: 'Pratique técnicas de redução de estresse, como meditação, yoga ou exercícios de respiração profunda, para ajudar a controlar o estresse, pois o estresse crônico pode afetar os níveis de açúcar no sangue.',
      color: 'blue',
    },
    {
      title: 'Limite o Consumo de Álcool e Cafeína',
      description: 'Consuma álcool e cafeína com moderação, pois a ingestão excessiva pode afetar os níveis de açúcar no sangue.',
      color: 'blue',
    },
    {
      title: 'Realize exames regulares',
      description: 'Agende consultas regulares com seu médico para monitorar sua saúde geral, incluindo níveis de açúcar no sangue, colesterol e pressão arterial.',
      color: 'blue',
    },
    {
      title: 'Mantenha-se hidratado',
      description: 'Beber bastante água ao longo do dia para se manter hidratado e apoiar a saúde geral.',
      color: 'blue',
    },
    {
      title: 'Siga as orientações do seu médico',
      description: 'Se você tiver alguma condição de saúde subjacente ou estiver em risco de desenvolver diabetes, siga os conselhos e recomendações do seu médico para cuidar da sua saúde.',
      color: 'blue',
    },
    {
      title: 'Levar um Estilo de Vida Saudável',
      description: 'Faça escolhas saudáveis em todos os aspectos da sua vida, incluindo o sono, a alimentação e a atividade física.',
      color: 'blue',
    },
  ];

  const disclaimer: Recommendation = {
    title: 'Nota importante',
    description: 'Lembre-se de que os níveis de açúcar no sangue "normais" podem variar com base em fatores individuais, portanto, é essencial trabalhar em conjunto com seu provedor de cuidados de saúde para determinar o que é considerado normal para você. Esta medição é apenas uma estimativa simulada e NÃO substitui exames laboratoriais reais.',
    color: 'red',
  };

  return [...base, disclaimer];
}

// --- Local Storage ---

const READINGS_KEY = 'diabetic_app_glucose_readings';

export function saveReading(reading: GlucoseReading): void {
  if (typeof window === 'undefined') return;
  const existing = loadReadings();
  existing.unshift(reading);
  // Keep last 100 readings
  const trimmed = existing.slice(0, 100);
  localStorage.setItem(READINGS_KEY, JSON.stringify(trimmed));
}

export function loadReadings(): GlucoseReading[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(READINGS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// --- Marker position on gradient bar ---

export function getMarkerPosition(value: number): number {
  // Bar goes from 60 to 150 mg/dL
  const min = 60;
  const max = 150;
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * 100;
}
