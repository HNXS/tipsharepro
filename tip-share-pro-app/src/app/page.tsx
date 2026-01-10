'use client';

import { useDemo } from '@/lib/DemoContext';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import LoginPage from '@/components/LoginPage';
import SettingsPage from '@/components/SettingsPage';
import DataEntryPage from '@/components/DataEntryPage';
import ResultsPage from '@/components/ResultsPage';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { state, handleLoginSuccess } = useDemo();

  // Show loading spinner while checking auth
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated (step 0)
  if (state.currentStep === 0) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Main app layout (authenticated)
  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        {/* Step Indicator */}
        <div className="no-print">
          <StepIndicator />
        </div>

        {/* Page Content */}
        <div className="page-content">
          {state.currentStep === 1 && <SettingsPage />}
          {state.currentStep === 2 && <DataEntryPage />}
          {state.currentStep === 3 && <ResultsPage />}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer no-print">
        <p className="footer-brand">
          <span className="footer-brand-name">Tip Share Pro</span> - Sharing The Customers Appreciation
        </p>
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Tip Share Pro. Fair and transparent tip pooling for your team.
        </p>
      </footer>
    </div>
  );
}
