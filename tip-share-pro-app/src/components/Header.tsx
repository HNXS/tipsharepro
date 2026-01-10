'use client';

import { useDemo } from '@/lib/DemoContext';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  const { state, handleLogout } = useDemo();

  const stepTitles: Record<number, string> = {
    1: 'Settings',
    2: 'Data Entry',
    3: 'Distribution Results',
  };

  const currentStepNumber = state.currentStep as 1 | 2 | 3;

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo and Branding */}
        <div className="header-brand">
          <div className="header-logo">
            <span className="header-logo-icon">$</span>
          </div>
          <div className="header-text">
            <h1 className="header-title">Tip Share Pro</h1>
            <p className="header-subtitle">Demo Mode</p>
          </div>
        </div>

        {/* Current Step Indicator */}
        <div className="header-step">
          <span className="header-step-label">
            Step {currentStepNumber} of 3:
          </span>
          <span className="header-step-title">
            {stepTitles[currentStepNumber] || 'Settings'}
          </span>
        </div>

        {/* User Info and Logout */}
        <div className="header-user">
          {state.user && (
            <div className="header-user-info">
              <User className="w-4 h-4 text-slate-400" />
              <span className="header-user-welcome">
                Welcome, <strong>{state.user.name}</strong>
              </span>
              {state.user.companyName && (
                <span className="header-user-company">
                  ({state.user.companyName})
                </span>
              )}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="header-logout-btn"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
