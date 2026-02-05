'use client';

import { useDemo } from '@/lib/DemoContext';
import Header from '@/components/Header';
import LoginPage from '@/components/LoginPage';
import SettingsPage from '@/components/SettingsPage';
import DistributionTable from '@/components/DistributionTable';
import WelcomeDialog from '@/components/WelcomeDialog';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { state, handleLoginSuccess, setShowWelcomeDialog } = useDemo();

  // Show loading spinner while checking auth
  if (state.isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <Loader2 className="loading-spinner" />
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  // Page 1: Login
  if (state.currentStep === 0) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Page 2: Settings
  if (state.currentStep === 1) {
    return (
      <div className="app-container">
        <Header />
        <main className="main-content">
          <SettingsPage />
        </main>
        <footer className="app-footer no-print">
          <p className="footer-brand">
            <span className="footer-brand-name">TipSharePro</span> - Sharing The Customer&apos;s Appreciation
          </p>
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} TipSharePro. Fair and transparent tip sharing for your team.
          </p>
        </footer>
        {state.showWelcomeDialog && (
          <WelcomeDialog onClose={() => setShowWelcomeDialog(false)} />
        )}
      </div>
    );
  }

  // Page 3: Distribution Table
  if (state.currentStep === 2) {
    return (
      <div className="app-container">
        <Header />
        <main className="main-content">
          <DistributionTable />
        </main>
        <footer className="app-footer no-print">
          <p className="footer-brand">
            <span className="footer-brand-name">TipSharePro</span> - Sharing The Customer&apos;s Appreciation
          </p>
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} TipSharePro. Fair and transparent tip sharing for your team.
          </p>
        </footer>
      </div>
    );
  }

  // Fallback (shouldn't happen)
  return null;
}
