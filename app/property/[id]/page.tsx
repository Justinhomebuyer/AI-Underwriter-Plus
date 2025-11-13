'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { CompsList } from '@/components/comps-list';
import { AdjustmentsTable } from '@/components/adjustments-table';
import { RehabEstimator } from '@/components/rehab-estimator';
import type { CompsResponse, PropertyDossier, RehabResponse } from '@/lib/types';

async function fetchStack(id: string) {
  const headers = { 'Content-Type': 'application/json' };
  const [dossier, comps, rehab] = await Promise.all([
    fetch('/api/dossier', { method: 'POST', headers, body: JSON.stringify({ subjectId: id }) }),
    fetch('/api/comps', { method: 'POST', headers, body: JSON.stringify({ subjectId: id }) }),
    fetch('/api/rehab', { method: 'POST', headers, body: JSON.stringify({ subjectId: id }) })
  ]);
  if (!dossier.ok || !comps.ok || !rehab.ok) {
    throw new Error('Unable to load property stack');
  }
  const [dossierJson, compsJson, rehabJson] = await Promise.all([
    dossier.json(),
    comps.json(),
    rehab.json()
  ]);
  return { dossier: dossierJson as PropertyDossier, comps: compsJson as CompsResponse, rehab: rehabJson as RehabResponse };
}

const discount = Number(process.env.NEXT_PUBLIC_OFFER_DISCOUNT ?? 0.7);

export default function PropertyPage({ params }: { params: { id: string } }) {
  const [dossier, setDossier] = useState<PropertyDossier | null>(null);
  const [comps, setComps] = useState<CompsResponse | null>(null);
  const [rehab, setRehab] = useState<RehabResponse | null>(null);
  const [mode, setMode] = useState<'strict' | 'smart'>('strict');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const payload = await fetchStack(params.id);
        setDossier(payload.dossier);
        setComps(payload.comps);
        setRehab(payload.rehab);
        setSelectedIds(payload.comps.strict.slice(0, 2).map((comp) => comp.id));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params.id]);

  useEffect(() => {
    if (!comps) return;
    const nextPool = mode === 'strict' ? comps.strict : comps.smartFallback;
    setSelectedIds((prev) => {
      const existing = prev.filter((id) => nextPool.some((comp) => comp.id === id));
      if (existing.length > 0) return existing;
      return nextPool.slice(0, 1).map((comp) => comp.id);
    });
  }, [mode, comps]);

  const currentComps = useMemo(() => {
    if (!comps) return [];
    return mode === 'strict' ? comps.strict : comps.smartFallback;
  }, [comps, mode]);

  const selectedComps = currentComps.filter((comp) => selectedIds.includes(comp.id));

  const arv = useMemo(() => {
    if (selectedComps.length === 0) return 0;
    const avg =
      selectedComps.reduce((sum, comp) => sum + comp.price, 0) / selectedComps.length;
    const avgAdj = selectedComps.reduce(
      (sum, comp) =>
        sum + comp.adjustments.reduce((adjSum, adjustment) => adjSum + adjustment.value, 0),
      0
    ) / selectedComps.length;
    return Math.round(avg + avgAdj);
  }, [selectedComps]);

  const mao = useMemo(() => {
    if (!rehab) return 0;
    return Math.max(Math.round(arv * discount - rehab.likely), 0);
  }, [arv, rehab]);

  const handleOfferPdf = () => {
    const body = `Offer Summary\nProperty: ${params.id}\nARV: $${arv}\nMAO: $${mao}`;
    const blob = new Blob([body], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Offer-${params.id}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    {
      id: 'dossier',
      label: 'Dossier',
      content: dossier ? (
        <div className="space-y-4 text-sm text-white/80">
          <p>
            <span className="text-white/60">Owner:</span> {dossier.owner}
          </p>
          <p>
            <span className="text-white/60">Heated GLA:</span> {dossier.assessor.gla} sqft
          </p>
          <div>
            <p className="text-white/60">Liens & mortgages</p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {dossier.liens.map((lien) => (
                <div key={lien.type} className="rounded-2xl border border-white/10 p-3">
                  {lien.type}: ${lien.amount.toLocaleString()}
                </div>
              ))}
              {dossier.mortgages.map((mortgage) => (
                <div key={mortgage.lender} className="rounded-2xl border border-white/10 p-3">
                  {mortgage.lender}: ${mortgage.balance.toLocaleString()} @ {mortgage.rate}%
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-white/60">Dossier still syncing…</p>
      )
    },
    {
      id: 'comps',
      label: 'Comps',
      content: (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                mode === 'strict' ? 'brand-button' : 'bg-white/10'
              }`}
              onClick={() => setMode('strict')}
            >
              True comps (strict window)
            </button>
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                mode === 'smart' ? 'accent-button' : 'bg-white/10'
              }`}
              onClick={() => setMode('smart')}
            >
              Smart fallback (penalized)
            </button>
          </div>
          <p className="text-xs uppercase text-white/60">
            Strict requires ±15% GLA, 0.5/1.5/5mi rings, same school district, ≤6mo. Smart widens to 12mo
            and cross-boundary comps but tags penalties for exterior, schools, or arterials.
          </p>
          <CompsList
            comps={currentComps}
            selectedIds={selectedIds}
            onChange={(ids) => setSelectedIds(ids)}
          />
          <AdjustmentsTable comps={currentComps} />
        </div>
      )
    },
    {
      id: 'calc',
      label: 'ARV / MAO',
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 p-4 text-center">
              <p className="text-xs uppercase text-white/60">Selected comps</p>
              <p className="text-2xl font-bold text-white">{selectedComps.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-4 text-center">
              <p className="text-xs uppercase text-white/60">ARV</p>
              <p className="text-3xl font-bold text-brand">${arv.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-4 text-center">
              <p className="text-xs uppercase text-white/60">MAO ({(discount * 100).toFixed(0)}%)</p>
              <p className="text-3xl font-bold text-accent">${mao.toLocaleString()}</p>
            </div>
          </div>
          {rehab && <RehabEstimator data={rehab} />}
          <button onClick={handleOfferPdf} className="brand-button rounded-full px-5 py-3">
            Offer PDF (placeholder)
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Card
        title={`Property dossier · ${params.id}`}
        action={
          <button className="accent-button rounded-full px-4 py-2" onClick={handleOfferPdf}>
            Export Offer
          </button>
        }
      >
        {isLoading ? <p className="text-white/60">Pulling county + MLS data…</p> : <Tabs tabs={tabs} />}
      </Card>
    </div>
  );
}
