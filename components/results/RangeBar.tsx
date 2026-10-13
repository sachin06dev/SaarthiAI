import React from 'react';
import { ComparisonStatus, ReferenceRangeOrigin } from '@/lib/types/test.types';

interface Props {
  value: number;
  unit: string;
  rangeOrigin: ReferenceRangeOrigin;
  status: ComparisonStatus;
}

export function RangeBar({ value, unit, rangeOrigin, status }: Props) {
  const low = rangeOrigin.lowValue;
  const high = rangeOrigin.highValue;

  // If one-sided or bounds not available, render clean text representation
  if (low === undefined || high === undefined || low >= high) {
    return (
      <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
        <span className="text-slate-500 font-medium">Applied Interval:</span>{' '}
        <span className="font-mono text-slate-200">
          {rangeOrigin.rawRangeText || `${rangeOrigin.comparator || ''} ${high ?? low ?? ''} ${unit}`}
        </span>
      </div>
    );
  }

  // Calculate percentage position on scale: spread from (low - padding) to (high + padding)
  const rangeSpan = high - low;
  const padding = rangeSpan * 0.25;
  const minScale = Math.max(0, low - padding);
  const maxScale = high + padding;
  const totalScaleSpan = maxScale - minScale;

  const clampPercent = (val: number) => {
    const pct = ((val - minScale) / totalScaleSpan) * 100;
    return Math.max(3, Math.min(97, pct));
  };

  const lowPercent = clampPercent(low);
  const highPercent = clampPercent(high);
  const valuePercent = clampPercent(value);

  const getMarkerColor = () => {
    switch (status) {
      case 'IN_RANGE':
        return 'bg-emerald-400 ring-emerald-500/30';
      case 'ABOVE_RANGE':
        return 'bg-red-400 ring-red-500/30';
      case 'BELOW_RANGE':
        return 'bg-amber-400 ring-amber-500/30';
      default:
        return 'bg-sky-400 ring-sky-500/30';
    }
  };

  return (
    <div
      role="region"
      aria-label={`Visual range scale for ${value} ${unit} within range ${low} to ${high}`}
      className="space-y-1.5 pt-1"
    >
      {/* Visual Bar Track */}
      <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-visible">
        {/* Normal In-Range Zone */}
        <div
          style={{ left: `${lowPercent}%`, width: `${highPercent - lowPercent}%` }}
          className="absolute top-0 bottom-0 bg-emerald-500/30 border-x border-emerald-500/60"
          title={`Normal reference interval: ${low} to ${high} ${unit}`}
        />

        {/* Observed Value Pin Marker */}
        <div
          style={{ left: `${valuePercent}%` }}
          className={`absolute -top-1 -translate-x-1/2 w-4 h-4 rounded-full ring-4 shadow-md ${getMarkerColor()} transition-all`}
          title={`Observed value: ${value} ${unit}`}
        />
      </div>

      {/* Axis Labels */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
        <span>Low: {low} {unit}</span>
        <span className="font-bold text-white">Value: {value} {unit}</span>
        <span>High: {high} {unit}</span>
      </div>
    </div>
  );
}
