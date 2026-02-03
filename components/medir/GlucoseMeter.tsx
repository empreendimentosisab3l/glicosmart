'use client';

import { useState } from 'react';
import { MeasurementPhase, GlucoseReading } from '@/lib/types';
import MeasurementOnboarding from './MeasurementOnboarding';
import MeasurementScreen from './MeasurementScreen';
import MeasurementResult from './MeasurementResult';

export default function GlucoseMeter() {
  const [phase, setPhase] = useState<MeasurementPhase>('onboarding');
  const [reading, setReading] = useState<GlucoseReading | null>(null);

  const handleStartMeasuring = () => {
    setPhase('measuring');
  };

  const handleResult = (result: GlucoseReading) => {
    setReading(result);
    setPhase('result');
  };

  const handleRetest = () => {
    setReading(null);
    setPhase('measuring');
  };

  const handleBackToOnboarding = () => {
    setReading(null);
    setPhase('onboarding');
  };

  switch (phase) {
    case 'onboarding':
      return <MeasurementOnboarding onStart={handleStartMeasuring} />;

    case 'measuring':
      return (
        <MeasurementScreen
          onResult={handleResult}
          onBack={handleBackToOnboarding}
        />
      );

    case 'result':
      return reading ? (
        <MeasurementResult
          reading={reading}
          onRetest={handleRetest}
          onBack={handleBackToOnboarding}
        />
      ) : null;

    default:
      return null;
  }
}
