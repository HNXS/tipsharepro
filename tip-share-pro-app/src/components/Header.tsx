'use client';

import { useDemo } from '@/lib/DemoContext';
import { LogOut, User, HelpCircle, BookOpen } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const { state, handleLogout, setShowWelcomeDialog, setShowHelpLibrary } = useDemo();

  return (
    <header className="header no-print">
      <div className="header-container">
        {/* Logo and Branding */}
        <div className="header-brand">
          <Image
            src="/logo-icon.png"
            alt="TipSharePro"
            width={48}
            height={36}
            className="header-logo-image"
          />
          <div className="header-text">
            <h1 className="header-title">TipSharePro</h1>
            <p className="header-subtitle">Demo Mode</p>
          </div>
        </div>

        {/* User Info and Actions */}
        <div className="header-actions">
          {state.user && (
            <div className="header-user-info">
              <User size={16} className="header-user-icon" />
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

          <div className="header-buttons">
            <button
              onClick={() => setShowWelcomeDialog(true)}
              className="btn btn-outline btn-sm"
              title="Show help"
            >
              <HelpCircle size={16} />
              <span className="hide-mobile">Help</span>
            </button>

            <button
              onClick={() => setShowHelpLibrary(true)}
              className="btn btn-outline btn-sm"
              title="Help library"
            >
              <BookOpen size={16} />
              <span className="hide-mobile">Library</span>
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
              title="Log out"
            >
              <LogOut size={16} />
              <span className="hide-mobile">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
