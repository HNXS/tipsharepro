'use client';

import { useDemo } from '@/lib/DemoContext';
import Header from '@/components/Header';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import LoginPage from '@/components/LoginPage';
import SettingsPage from '@/components/SettingsPage';
import DistributionTable from '@/components/DistributionTable';
import WelcomeDialog from '@/components/WelcomeDialog';
import HelpLibraryDialog from '@/components/HelpLibraryDialog';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { state, handleLoginSuccess, setShowWelcomeDialog, setShowHelpLibrary } = useDemo();

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

  // Login page
  if (state.currentStep === 0) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Main app: Settings + Distribution Table on same page
  return (
    <div className="app-container">
      <SubscriptionBanner />
      <Header />
      <main className="main-content">
        {/* Settings Section */}
        <section id="settings-section">
          <SettingsPage />
        </section>
        
        {/* Divider */}
        <div className="section-divider" />
        
        {/* Distribution Table Section */}
        <section id="distribution-section">
          <DistributionTable />
        </section>
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
      {state.showHelpLibrary && (
        <HelpLibraryDialog onClose={() => setShowHelpLibrary(false)} />
      )}
    </div>
  );
}
