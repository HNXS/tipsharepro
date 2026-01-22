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

  // Show login page if not authenticated (step 0)
  if (state.currentStep === 0) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Main app layout (authenticated)
  // Demo version: Settings + Distribution Table on same page
  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        {/* Settings Section */}
        <SettingsPage />

        {/* Distribution Table Section (inline below settings) */}
        <DistributionTable />
      </main>

      {/* Footer */}
      <footer className="app-footer no-print">
        <p className="footer-brand">
          <span className="footer-brand-name">TipSharePro</span> - Sharing The Customer&apos;s Appreciation
        </p>
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} TipSharePro. Fair and transparent tip pooling for your team.
        </p>
      </footer>

      {/* Welcome Dialog (shown on first login) */}
      {state.showWelcomeDialog && (
        <WelcomeDialog onClose={() => setShowWelcomeDialog(false)} />
      )}
    </div>
  );
}
