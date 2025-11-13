import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import clsx from 'clsx';

export const metadata: Metadata = {
  title: 'AI Underwrite',
  description: 'Justin Homebuyer underwriting cockpit'
};

const navItems = [
  { href: '/', label: 'Ops Console' },
  { href: '/pipeline', label: 'Pipeline' }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'AI Underwrite';

  return (
    <html lang="en">
      <body>
        <header className="border-b border-white/10 bg-dark/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-brand">
              {appName}
            </Link>
            <nav className="flex gap-4 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'rounded-full px-3 py-1 font-semibold transition-colors',
                    'text-white hover:bg-white/10'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
