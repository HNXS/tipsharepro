'use client';

import { useDemo } from '@/lib/DemoContext';
import { canAccess } from '@/lib/permissions';
import { LogOut, User, HelpCircle, BookOpen, MapPin } from 'lucide-react';
import Image from 'next/image';

const TIER_SUBTITLE: Record<string, string | null> = {
  DEMO: 'Demo Mode',
  TRIAL: 'Trial',
  ACTIVE: null,
  SUSPENDED: 'Account Suspended',
  CANCELLED: 'Account Cancelled',
};

export default function Header() {
  const { state, handleLogout, setShowWelcomeDialog, setShowHelpLibrary } = useDemo();
  const subtitle = TIER_SUBTITLE[state.subscriptionStatus] ?? null;
  const userRole = state.user?.role;

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
            {subtitle && <p className="header-subtitle">{subtitle}</p>}
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
              {userRole && userRole !== 'ADMIN' && (
                <span className="header-role-badge" data-role={userRole}>
                  {userRole === 'MANAGER' ? 'Manager' : 'Designee'}
                </span>
              )}
            </div>
          )}

          {/* Location Switcher — shown when multiple locations and admin/manager */}
          {state.locations && state.locations.length > 1 && canAccess(userRole, 'locations') && (
            <div className="header-location-switcher">
              <MapPin size={14} />
              <select
                className="form-select header-location-select"
                value={state.activeLocationId || ''}
                onChange={e => state.switchLocation?.(e.target.value)}
              >
                {state.locations.map((loc: { id: string; name: string }) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
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
