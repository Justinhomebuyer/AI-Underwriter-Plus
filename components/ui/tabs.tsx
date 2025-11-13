'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useState } from 'react';

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

export function Tabs({ tabs, defaultTab }: { tabs: Tab[]; defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={clsx(
              'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              active === tab.id ? 'bg-brand text-brand-foreground' : 'bg-white/10 text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} hidden={tab.id !== active}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
