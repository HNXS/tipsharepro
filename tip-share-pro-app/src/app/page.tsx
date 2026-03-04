'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { canAccess } from '@/lib/permissions';
import Header from '@/components/Header';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import LoginPage from '@/components/LoginPage';
import SettingsPage from '@/components/SettingsPage';
import DistributionTable from '@/components/DistributionTable';
import WelcomeDialog from '@/components/WelcomeDialog';
import HelpLibraryDialog from '@/components/HelpLibraryDialog';
import UserManagement from '@/components/UserManagement';
import LocationManagement from '@/components/LocationManagement';
import ScenarioSandbox from '@/components/ScenarioSandbox';
import TwoFactorSetup from '@/components/TwoFactorSetup';
import BillingPage from '@/components/BillingPage';
import DailyEntryModal from '@/components/DailyEntryModal';
import SessionMonitor from '@/components/SessionMonitor';
import { X, Calculator, AlertCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';

// Panel types that can be opened from the "More" menu
export type PanelType = 'team' | 'locations' | 'rounding' | 'sandbox' | '2fa' | 'billing' | null;

export default function Home() {
  const { state, handleLoginSuccess, setShowWelcomeDialog, setShowHelpLibrary, updateSettings, setError, closeDailyEntry } = useDemo();
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const isDemo = state.subscriptionStatus === 'DEMO';
  const userRole = state.user?.role;

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

  const closePanel = () => setActivePanel(null);

  // Main app: Settings + Distribution Table on same page
  return (
    <div className="app-container">
      <SessionMonitor />
      <SubscriptionBanner />
      <Header onOpenPanel={setActivePanel} />
      <main className="main-content">
        {/* Error Banner */}
        {state.error && (
          <div className="alert alert-error" style={{ margin: '0.5rem 1rem' }}>
            <AlertCircle size={16} />
            <span>{state.error}</span>
            <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setError(null)}>
              <X size={14} />
            </button>
          </div>
        )}

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

      {/* Welcome / Help dialogs */}
      {state.showWelcomeDialog && (
        <WelcomeDialog onClose={() => setShowWelcomeDialog(false)} subscriptionStatus={state.subscriptionStatus} />
      )}
      {state.showHelpLibrary && (
        <HelpLibraryDialog onClose={() => setShowHelpLibrary(false)} />
      )}

      {/* ================================================================
          Secondary Feature Panels (opened from Header "More" menu)
          ================================================================ */}

      {/* Team Members */}
      {activePanel === 'team' && !isDemo && canAccess(userRole, 'users') && (
        <div className="modal-overlay" onClick={closePanel}>
          <div className="modal-content panel-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Team Members</h3>
              <button className="modal-close-btn" onClick={closePanel}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <UserManagement />
            </div>
          </div>
        </div>
      )}

      {/* Locations */}
      {activePanel === 'locations' && !isDemo && canAccess(userRole, 'locations') && (
        <div className="modal-overlay" onClick={closePanel}>
          <div className="modal-content panel-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Locations</h3>
              <button className="modal-close-btn" onClick={closePanel}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <LocationManagement />
            </div>
          </div>
        </div>
      )}

      {/* Scenario Sandbox */}
      {activePanel === 'sandbox' && !isDemo && canAccess(userRole, 'scenarioSandbox') && (
        <ScenarioSandbox onClose={closePanel} />
      )}

      {/* Rounding Mode */}
      {activePanel === 'rounding' && !isDemo && canAccess(userRole, 'settings.rounding') && (
        <div className="modal-overlay" onClick={closePanel}>
          <div className="modal-content panel-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Calculator size={18} /> Rounding Mode</h3>
              <button className="modal-close-btn" onClick={closePanel}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="rounding-mode-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="roundingMode"
                    value="NEAREST"
                    checked={!state.settings.roundingMode || state.settings.roundingMode === 'NEAREST'}
                    onChange={() => updateSettings({ roundingMode: 'NEAREST' } as Partial<typeof state.settings>)}
                  />
                  <div>
                    <strong>Standard Rounding</strong>
                    <p className="form-help">Rounds to the nearest cent (Math.round). Most common.</p>
                  </div>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="roundingMode"
                    value="DOWN"
                    checked={state.settings.roundingMode === 'DOWN'}
                    onChange={() => updateSettings({ roundingMode: 'DOWN' } as Partial<typeof state.settings>)}
                  />
                  <div>
                    <strong>Floor Rounding</strong>
                    <p className="form-help">Always rounds down (Math.floor). Cents may vary by $0.01 per employee.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication */}
      {activePanel === '2fa' && !isDemo && (
        <div className="modal-overlay" onClick={closePanel}>
          <div className="modal-content panel-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Two-Factor Authentication</h3>
              <button className="modal-close-btn" onClick={closePanel}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <TwoFactorSetup
                enabled={state.user?.twoFactorEnabled || false}
                currentMethod={state.user?.twoFactorMethod || undefined}
                onStatusChange={(enabled) => {
                  if (state.user) {
                    state.user.twoFactorEnabled = enabled;
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Billing */}
      {activePanel === 'billing' && !isDemo && canAccess(userRole, 'billing') && (
        <div className="modal-overlay" onClick={closePanel}>
          <div className="modal-content panel-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Billing</h3>
              <button className="modal-close-btn" onClick={closePanel}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <BillingPage />
            </div>
          </div>
        </div>
      )}

      {/* Daily Sales Entry Modal */}
      {!isDemo && state.selectedDate && state.activePayPeriod && state.activePayPeriod.status !== 'ARCHIVED' && (
        <DailyEntryModal onClose={closeDailyEntry} />
      )}
    </div>
  );
}
