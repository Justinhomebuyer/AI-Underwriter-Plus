'use client';

import type { CompRecord } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export function CompsList({
  comps,
  selectedIds,
  onChange
}: {
  comps: CompRecord[];
  selectedIds: string[];
  onChange?: (ids: string[], comp: CompRecord) => void;
}) {
  const rehabMix = comps.reduce(
    (tally, comp) => ({
      ...tally,
      [comp.rehabLevel]: (tally[comp.rehabLevel] ?? 0) + 1
    }),
    {} as Record<CompRecord['rehabLevel'], number>
  );

  const toggleComp = (comp: CompRecord) => {
    const ids = selectedIds.includes(comp.id)
      ? selectedIds.filter((id) => id !== comp.id)
      : [...selectedIds, comp.id];
    onChange?.(ids, comp);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs text-white/70">
        {Object.entries(rehabMix).map(([level, count]) => (
          <span key={level} className="badge-muted">
            {level} comps · {count}
          </span>
        ))}
      </div>
      {comps.map((comp) => (
        <button
          key={comp.id}
          onClick={() => toggleComp(comp)}
          className={`w-full rounded-2xl border border-white/10 p-4 text-left transition hover:border-brand ${
            selectedIds.includes(comp.id) ? 'bg-white/10' : 'bg-white/5'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-lg font-semibold text-white">{comp.address}</p>
              <p className="text-sm text-white/70">
                {comp.distanceMiles} mi · DOM {comp.dom} · {comp.schoolDistrict} ·
                {comp.distanceMiles <= 0.5
                  ? 'Core ring (0.5mi)'
                  : comp.distanceMiles <= 1.5
                    ? 'Neighborhood ring (1.5mi)'
                    : 'Metro ring (5mi)'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-brand text-xl font-bold">
                {comp.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
              <Badge variant={comp.mode === 'strict' ? 'brand' : 'accent'}>
                {comp.mode === 'strict' ? 'Strict' : 'Smart Fallback'}
              </Badge>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/80">
            {comp.inclusionReasons.map((reason) => (
              <Badge key={reason} variant="brand">
                Included: {reason}
              </Badge>
            ))}
            {comp.exclusionReasons.map((reason) => (
              <Badge key={reason} variant="accent">
                Excluded: {reason}
              </Badge>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-white/70 md:grid-cols-4">
            <div>
              <p className="text-xs uppercase text-white/50">GLA</p>
              <p>{comp.gla} sqft</p>
            </div>
            <div>
              <p className="text-xs uppercase text-white/50">Lot</p>
              <p>{comp.lot} sqft</p>
            </div>
            <div>
              <p className="text-xs uppercase text-white/50">Exterior</p>
              <p>{comp.exterior}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-white/50">Rehab Level</p>
              <p>{comp.rehabLevel}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
