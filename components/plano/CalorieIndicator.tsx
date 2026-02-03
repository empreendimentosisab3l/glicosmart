'use client';

interface CalorieIndicatorProps {
  current: number;
  target: number;
}

export default function CalorieIndicator({ current, target }: CalorieIndicatorProps) {
  const percentage = Math.min((current / target) * 100, 100); // Allow max 100 visual, logic handles diff
  const diff = Math.abs(current - target);
  const diffPercent = target > 0 ? diff / target : 0;

  let barColor = 'bg-gi-low';
  let textColor = 'text-gi-low';
  let statusText = 'Dentro da meta';

  if (diffPercent > 0.2) {
    barColor = 'bg-gi-high';
    textColor = 'text-gi-high';
    statusText = 'Fora da meta';
  } else if (diffPercent > 0.1) {
    barColor = 'bg-gi-medium';
    textColor = 'text-gi-medium';
    statusText = 'Próximo da meta';
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-2xl font-bold text-gray-900">{current}</span>
          <span className="text-xs text-gray-400 ml-1">/ {target} kcal</span>
        </div>
        <span className={`text-xs font-bold ${textColor}`}>{statusText}</span>
      </div>

      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
