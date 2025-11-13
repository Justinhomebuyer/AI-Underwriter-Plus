'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CompAdjustment, CompRecord } from '@/lib/types';

const categories: CompAdjustment['category'][] = [
  'GLA',
  'Lot',
  'Exterior',
  'Location',
  'Condition',
  'Time',
  'Rehab Delta'
];

export function AdjustmentsTable({ comps }: { comps: CompRecord[] }) {
  const [overrides, setOverrides] = useState<Record<string, Record<string, number>>>(() => ({}));

  useEffect(() => {
    setOverrides(
      Object.fromEntries(
        comps.map((comp) => [
          comp.id,
          Object.fromEntries(comp.adjustments.map((adj) => [adj.category, adj.value]))
        ])
      )
    );
  }, [comps]);

  const totals = useMemo(
    () =>
      comps.map((comp) => ({
        id: comp.id,
        total: categories.reduce((sum, category) => sum + (overrides[comp.id]?.[category] ?? 0), 0)
      })),
    [comps, overrides]
  );

  const handleChange = (compId: string, category: CompAdjustment['category'], value: number) => {
    setOverrides((prev) => ({
      ...prev,
      [compId]: { ...prev[compId], [category]: value }
    }));
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-white/5 text-left text-xs uppercase text-white/70">
            <th className="px-4 py-3">Comp</th>
            {categories.map((category) => (
              <th key={category} className="px-4 py-3">
                {category}
              </th>
            ))}
            <th className="px-4 py-3">Total Adj.</th>
          </tr>
        </thead>
        <tbody>
          {comps.map((comp) => (
            <tr key={comp.id} className="border-t border-white/5">
              <td className="px-4 py-3 font-semibold text-white">{comp.address}</td>
              {categories.map((category) => (
                <td key={category} className="px-4 py-3">
                  <input
                    type="number"
                    className="w-28 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-right"
                    value={overrides[comp.id]?.[category] ?? 0}
                    onChange={(event) =>
                      handleChange(comp.id, category, Number(event.target.value) || 0)
                    }
                  />
                  <p className="mt-1 text-[10px] text-white/60">
                    {comp.adjustments.find((adj) => adj.category === category)?.reason ?? '—'}
                  </p>
                </td>
              ))}
              <td className="px-4 py-3 text-right text-brand">
                {totals.find((total) => total.id === comp.id)?.total.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
