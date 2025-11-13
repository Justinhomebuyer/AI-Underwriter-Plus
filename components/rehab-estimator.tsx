'use client';

import type { RehabResponse } from '@/lib/types';

export function RehabEstimator({ data }: { data: RehabResponse }) {
  const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: 'Low', value: data.low },
          { label: 'Likely', value: data.likely },
          { label: 'High', value: data.high }
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 p-4 text-center">
            <p className="text-xs uppercase text-white/60">{item.label}</p>
            <p className="text-2xl font-bold text-brand">{formatCurrency(item.value)}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-white/70">
        Contingency applied: {(data.contingencyPct * 100).toFixed(0)}%.
      </p>
      <div className="space-y-3">
        {data.lineItems.map((line) => (
          <div key={line.item} className="rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between text-sm text-white/70">
              <p className="font-semibold text-white">{line.item}</p>
              <span className="badge-muted">{line.scope} scope</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
              <p>Low: {formatCurrency(line.low)}</p>
              <p>Likely: {formatCurrency(line.likely)}</p>
              <p>High: {formatCurrency(line.high)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
