'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { AlertTriangle, Clock, X } from 'lucide-react';

export default function SubscriptionBanner() {
  const { state } = useDemo();
  const [dismissed, setDismissed] = useState(false);

  const { subscriptionStatus, isExpired, daysRemaining } = state;

  // ACTIVE accounts or no subscription status (demo@tipsharepro.com local demo) — no banner
  if (subscriptionStatus === 'ACTIVE' || !subscriptionStatus) return null;

  // Expired — full lockout banner (never dismissible)
  if (isExpired) {
    const label = subscriptionStatus === 'SUSPENDED' ? 'expired' : 'cancelled';
    return (
      <div className="subscription-banner subscription-banner-expired">
        <AlertTriangle size={18} />
        <span>
          Your access has {label}. Your data is safe — contact TipSharePro to continue.
        </span>
      </div>
    );
  }

  // Dismissed (only allowed if > 3 days remaining)
  if (dismissed && daysRemaining !== null && daysRemaining > 3) return null;

  // Active DEMO or TRIAL with countdown
  if (daysRemaining === null) return null;

  const isUrgent = daysRemaining <= 3;
  const label = subscriptionStatus === 'DEMO' ? 'Demo account' : 'Trial';

  return (
    <div className={`subscription-banner ${isUrgent ? 'subscription-banner-warning' : 'subscription-banner-info'}`}>
      <Clock size={16} />
      <span>
        {label} · {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining · Contact TipSharePro to upgrade
      </span>
      {!isUrgent && (
        <button
          onClick={() => setDismissed(true)}
          className="subscription-banner-dismiss"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
