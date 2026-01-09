'use client';

import { useDemo } from '@/lib/DemoContext';

export default function Header() {
  const { state } = useDemo();

  const stepTitles = {
    1: 'Settings',
    2: 'Data Entry',
    3: 'Distribution Results',
  };

  return (
    <header className="bg-[var(--background-secondary)] border-b border-[var(--border)] px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center text-white font-bold text-xl">
              $
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Tip Share Pro</h1>
              <p className="text-xs text-[var(--foreground-muted)]">Demo Mode</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[var(--foreground-muted)] text-sm">
            Step {state.currentStep} of 3:
          </span>
          <span className="text-[var(--accent)] font-semibold">
            {stepTitles[state.currentStep]}
          </span>
        </div>

        <div className="text-right">
          <p className="text-xs text-[var(--foreground-muted)]">Sharing The Customers Appreciation</p>
        </div>
      </div>
    </header>
  );
}
