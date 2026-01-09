'use client';

import { useDemo } from '@/lib/DemoContext';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import SettingsPage from '@/components/SettingsPage';
import DataEntryPage from '@/components/DataEntryPage';
import ResultsPage from '@/components/ResultsPage';

export default function Home() {
  const { state } = useDemo();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="py-6">
        {/* Step Indicator */}
        <div className="no-print">
          <StepIndicator />
        </div>

        {/* Page Content */}
        <div className="px-6 py-4">
          {state.currentStep === 1 && <SettingsPage />}
          {state.currentStep === 2 && <DataEntryPage />}
          {state.currentStep === 3 && <ResultsPage />}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-[var(--foreground-dim)] text-sm border-t border-[var(--border)] no-print">
        <p className="mb-2">
          <span className="text-[var(--accent)] font-semibold">Tip Share Pro</span> - Sharing The Customers Appreciation
        </p>
        <p>
          &copy; {new Date().getFullYear()} Tip Share Pro. Fair and transparent tip pooling for your team.
        </p>
      </footer>
    </div>
  );
}
