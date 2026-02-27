'use client';

import { useState, useRef, useEffect } from 'react';
import { verifyLoginCode, sendLoginCode } from '@/lib/api/twoFactor';
import { setToken } from '@/lib/api/client';
import { Shield, Loader2, AlertCircle } from 'lucide-react';

interface TwoFactorVerifyProps {
  tempToken: string;
  method: 'EMAIL' | 'SMS';
  onVerified: (data: {
    token: string;
    user: { name: string; companyName: string; role: string; email: string; locationId: string | null };
    organization: { subscriptionStatus: string; trialEndsAt: string | null };
  }) => void;
  onCancel: () => void;
}

export default function TwoFactorVerify({ tempToken, method, onVerified, onCancel }: TwoFactorVerifyProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    try {
      setLoading(true);
      setError(null);
      const result = await verifyLoginCode(tempToken, code);

      // Store the real JWT
      setToken(result.token);

      onVerified({
        token: result.token,
        user: {
          name: result.user.name,
          companyName: result.user.companyName || result.organization.name,
          role: result.user.role,
          email: result.user.email,
          locationId: result.user.locationId,
        },
        organization: {
          subscriptionStatus: result.organization.subscriptionStatus,
          trialEndsAt: result.organization.trialEndsAt,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError(null);
      await sendLoginCode(tempToken);
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Shield size={32} className="login-icon" />
          <h2>Two-Factor Verification</h2>
          <p className="text-secondary">
            Enter the 6-digit code sent to your {method === 'EMAIL' ? 'email' : 'phone'}.
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label className="form-label">Verification Code</label>
            <input
              ref={inputRef}
              type="text"
              className="form-input two-factor-code-input"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              autoComplete="one-time-code"
              inputMode="numeric"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || code.length !== 6}
          >
            {loading ? <Loader2 size={16} className="loading-spinner" /> : <Shield size={16} />}
            Verify
          </button>
        </form>

        <div className="two-factor-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
