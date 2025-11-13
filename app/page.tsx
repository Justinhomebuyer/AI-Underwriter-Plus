'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import type { CompsResponse, PropertyDossier, RehabResponse } from '@/lib/types';

async function postJson<T>(endpoint: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Request failed');
  }

  return response.json();
}

export default function Home() {
  const [subjectId, setSubjectId] = useState('JUSTIN-123');
  const [dossier, setDossier] = useState<PropertyDossier | null>(null);
  const [comps, setComps] = useState<CompsResponse | null>(null);
  const [rehab, setRehab] = useState<RehabResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = async () => {
    try {
      setError(null);
      const [dossierData, compsData, rehabData] = await Promise.all([
        postJson<PropertyDossier>('/api/dossier', { subjectId }),
        postJson<CompsResponse>('/api/comps', { subjectId }),
        postJson<RehabResponse>('/api/rehab', { subjectId })
      ]);
      setDossier(dossierData);
      setComps(compsData);
      setRehab(rehabData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="space-y-6">
      <Card
        title="Quick dossier pull"
        action={
          <button className="brand-button rounded-full px-4 py-2" onClick={execute}>
            Fetch stack
          </button>
        }
      >
        <div className="space-y-3 text-sm text-white/80">
          <label className="flex flex-col gap-1 text-xs uppercase text-white/60">
            Subject ID
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
            />
          </label>
          {error && <p className="text-brand">{error}</p>}
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Owner & liens">
          {dossier ? (
            <div className="space-y-4 text-sm text-white/80">
              <p>
                <span className="text-white/60">Owner:</span> {dossier.owner}
              </p>
              <p>
                <span className="text-white/60">Assessed GLA:</span> {dossier.assessor.gla} sqft
              </p>
              <div>
                <p className="text-white/60">Liens</p>
                <ul className="mt-2 space-y-2">
                  {dossier.liens.map((lien) => (
                    <li key={lien.type} className="rounded-xl bg-white/5 p-2">
                      {lien.type} · ${lien.amount.toLocaleString()} (priority {lien.priority})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-white/50">Run dossier to see ownership, liens, taxes.</p>
          )}
        </Card>
        <Card title="Fast comps">
          {comps ? (
            <div className="space-y-3 text-sm text-white/80">
              <p>
                Strict comps: {comps.strict.length} · Smart fallback: {comps.smartFallback.length}
              </p>
              <ul className="space-y-2">
                {comps.strict.concat(comps.smartFallback).map((comp) => (
                  <li key={comp.id} className="rounded-2xl border border-white/10 p-3">
                    <p className="font-semibold text-white">{comp.address}</p>
                    <p className="text-xs text-white/60">
                      {comp.mode === 'strict' ? 'Strict window' : 'Smart fallback'} · {comp.inclusionReasons[0]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-white/50">Strict first, then smart fallback with explicit penalties.</p>
          )}
        </Card>
      </div>

      <Card title="Rehab estimator">
        {rehab ? (
          <div className="space-y-3 text-sm text-white/80">
            <p>
              Range: ${rehab.low.toLocaleString()} – ${rehab.high.toLocaleString()} ({rehab.scope} scope)
            </p>
            <ul className="space-y-2">
              {rehab.lineItems.map((line) => (
                <li key={line.item} className="rounded-2xl border border-white/10 p-3">
                  <p className="font-semibold text-white">{line.item}</p>
                  <p className="text-xs text-white/60">Likely: ${line.likely.toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-white/50">Scope Lite/Mid/Full with big-ticket callouts.</p>
        )}
      </Card>
    </div>
  );
}
