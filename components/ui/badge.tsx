import clsx from 'clsx';
import type { ReactNode } from 'react';

type BadgeVariant = 'brand' | 'accent' | 'muted';

export function Badge({ variant = 'muted', children }: { variant?: BadgeVariant; children: ReactNode }) {
  const variantClass =
    variant === 'brand' ? 'badge-brand' : variant === 'accent' ? 'badge-accent' : 'badge-muted';

  return <span className={clsx('badge-base', variantClass)}>{children}</span>;
}
