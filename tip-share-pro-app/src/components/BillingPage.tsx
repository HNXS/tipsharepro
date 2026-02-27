'use client';

import { useState, useEffect } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { getSubscription, createCheckoutSession, createPortalSession } from '@/lib/api';
import type { SubscriptionInfo } from '@/lib/api';
import { CreditCard, ExternalLink, Loader2, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  ACTIVE: { label: 'Active', className: 'badge-success', icon: CheckCircle2 },
  TRIAL: { label: 'Trial', className: 'badge-warning', icon: Clock },
  DEMO: { label: 'Demo', className: 'badge-muted', icon: Clock },
  SUSPENDED: { label: 'Suspended', className: 'badge-error', icon: AlertCircle },
  CANCELLED: { label: 'Cancelled', className: 'badge-error', icon: XCircle },
};

export default function BillingPage() {
  const { state } = useDemo();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const info = await getSubscription();
      setSubscription(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load billing info');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setActionLoading('checkout');
      setError(null);
      const { url } = await createCheckoutSession();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create checkout session');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePortal = async () => {
    try {
      setActionLoading('portal');
      setError(null);
      const { url } = await createPortalSession();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open billing portal');
    } finally {
      setActionLoading(null);
    }
  };

  const statusKey = subscription?.status || state.subscriptionStatus;
  const statusInfo = STATUS_CONFIG[statusKey] || STATUS_CONFIG.DEMO;
  const StatusIcon = statusInfo.icon;

  if (loading) {
    return (
      <div className="content-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Loader2 size={32} className="loading-spinner" />
          <p className="text-secondary" style={{ marginTop: '1rem' }}>Loading billing info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <h1 className="page-title">Billing</h1>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Subscription Status Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <CreditCard size={20} />
            Subscription
          </h2>
          <span className={`badge ${statusInfo.className}`}>
            <StatusIcon size={12} />
            {statusInfo.label}
          </span>
        </div>

        <div className="billing-details">
          {subscription?.plan && (
            <div className="billing-row">
              <span className="billing-label">Plan</span>
              <span className="billing-value">{subscription.plan}</span>
            </div>
          )}

          {subscription?.currentPeriodEnd && (
            <div className="billing-row">
              <span className="billing-label">
                {subscription.cancelAtPeriodEnd ? 'Access until' : 'Next billing date'}
              </span>
              <span className="billing-value">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {subscription?.cancelAtPeriodEnd && (
            <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
              <AlertCircle size={14} />
              <span>Your subscription will not renew. Access continues until the end of the current period.</span>
            </div>
          )}

          {state.trialEndsAt && statusKey === 'TRIAL' && (
            <div className="billing-row">
              <span className="billing-label">Trial ends</span>
              <span className="billing-value">
                {new Date(state.trialEndsAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {state.daysRemaining !== null && ` (${state.daysRemaining} days remaining)`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions Card */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>Actions</h3>

        {subscription?.stripeConfigured === false ? (
          <p className="form-help">
            Online billing is not yet configured. Your subscription is managed by TipSharePro support.
            Contact us if you have questions about your account status.
          </p>
        ) : (
          <>
            <div className="billing-actions">
              {(statusKey === 'DEMO' || statusKey === 'TRIAL' || statusKey === 'CANCELLED') && (
                <button
                  className="btn btn-primary"
                  onClick={handleCheckout}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === 'checkout' ? (
                    <Loader2 size={16} className="loading-spinner" />
                  ) : (
                    <CreditCard size={16} />
                  )}
                  {statusKey === 'CANCELLED' ? 'Resubscribe' : 'Subscribe Now'}
                </button>
              )}

              {statusKey === 'ACTIVE' && (
                <button
                  className="btn btn-outline"
                  onClick={handlePortal}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === 'portal' ? (
                    <Loader2 size={16} className="loading-spinner" />
                  ) : (
                    <ExternalLink size={16} />
                  )}
                  Manage Billing
                </button>
              )}
            </div>

            <p className="form-help" style={{ marginTop: '1rem' }}>
              {statusKey === 'ACTIVE'
                ? 'Manage your payment method, view invoices, and update subscription through the Stripe billing portal.'
                : 'Subscribe to TipSharePro to unlock all features. Payment is handled securely through Stripe.'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
