import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Card({
  title,
  children,
  className,
  action
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section
      className={clsx(
        'card-gradient rounded-3xl border border-white/10 p-5 shadow-card',
        className
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
