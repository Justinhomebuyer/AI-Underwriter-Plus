'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';

type LeadStatus = 'New' | 'Working' | 'Offer Sent' | 'Under Contract' | 'Closed/Lost';

type Lead = {
  id: string;
  address: string;
  status: LeadStatus;
  arv: number;
  mao: number;
};

const statusOrder: LeadStatus[] = ['New', 'Working', 'Offer Sent', 'Under Contract', 'Closed/Lost'];

const seed: Lead[] = [
  { id: 'JUSTIN-123', address: '218 Market St', status: 'Working', arv: 420000, mao: 210000 },
  { id: 'JUSTIN-128', address: '701 Pine St', status: 'Offer Sent', arv: 398000, mao: 205000 },
  { id: 'JUSTIN-135', address: '917 Federal St', status: 'New', arv: 365000, mao: 185000 }
];

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>(seed);

  const grouped = useMemo(
    () => statusOrder.map((status) => ({ status, leads: leads.filter((lead) => lead.status === status) })),
    [leads]
  );

  const advance = (lead: Lead) => {
    const currentIndex = statusOrder.indexOf(lead.status);
    const nextStatus = statusOrder[Math.min(currentIndex + 1, statusOrder.length - 1)];
    setLeads((prev) => prev.map((item) => (item.id === lead.id ? { ...item, status: nextStatus } : item)));
  };

  return (
    <div className="space-y-6">
      <Card title="Pipeline">
        <div className="grid gap-4 md:grid-cols-3">
          {grouped.map(({ status, leads: column }) => (
            <div key={status} className="rounded-3xl border border-white/10 p-4">
              <p className="text-sm font-semibold uppercase text-white/60">{status}</p>
              <div className="mt-3 space-y-3">
                {column.map((lead) => (
                  <div key={lead.id} className="rounded-2xl bg-white/5 p-3 text-sm">
                    <p className="text-white">{lead.address}</p>
                    <p className="text-xs text-white/60">ARV ${lead.arv.toLocaleString()} · MAO ${lead.mao.toLocaleString()}</p>
                    {status !== 'Closed/Lost' && (
                      <button
                        className="mt-2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground"
                        onClick={() => advance(lead)}
                      >
                        Move to {statusOrder[statusOrder.indexOf(status) + 1] ?? 'Closed/Lost'}
                      </button>
                    )}
                  </div>
                ))}
                {column.length === 0 && <p className="text-xs text-white/50">No leads</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
