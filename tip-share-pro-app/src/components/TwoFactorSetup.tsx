'use client';

import { useState } from 'react';
import { setup2FA, verifySetup2FA, disable2FA } from '@/lib/api/twoFactor';
import { Shield, ShieldCheck, ShieldOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TwoFactorSetupProps {
  enabled: boolean;
  currentMethod?: string;
  onStatusChange?: (enabled: boolean) => void;
}

export default function TwoFactorSetup({ enabled, currentMethod, onStatusChange }: TwoFactorSetupProps) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [step, setStep] = useState<'idle' | 'setup' | 'verify' | 'disable'>('idle');
  const [method, setMethod] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleStartSetup = async () => {
    try {
      setLoading(true);
      setError(null);
      await setup2FA(method, method === 'SMS' ? phone : undefined);
      setStep('verify');
      setSuccess('Verification code sent!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    try {
      setLoading(true);
      setError(null);
      await verifySetup2FA(code);
      setIsEnabled(true);
      setStep('idle');
      setSuccess('Two-factor authentication enabled!');
      setCode('');
      onStatusChange?.(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDisable = async () => {
    try {
      setLoading(true);
      setError(null);
      // First send a code, then they need to enter it
      await setup2FA(currentMethod as 'EMAIL' | 'SMS' || 'EMAIL');
      setStep('disable');
      setSuccess('Verification code sent for disabling 2FA.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDisable = async () => {
    try {
      setLoading(true);
      setError(null);
      await disable2FA(code);
      setIsEnabled(false);
      setStep('idle');
      setSuccess('Two-factor authentication disabled.');
      setCode('');
      onStatusChange?.(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="two-factor-setup">
      <div className="two-factor-setup-header">
        <h4>
          {isEnabled ? <ShieldCheck size={18} /> : <Shield size={18} />}
          Two-Factor Authentication
        </h4>
        <span className={`badge ${isEnabled ? 'badge-success' : 'badge-muted'}`}>
          {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginTop: '0.75rem' }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="alert alert-success" style={{ marginTop: '0.75rem' }}>
          <CheckCircle2 size={14} />
          <span>{success}</span>
        </div>
      )}

      {step === 'idle' && !isEnabled && (
        <div className="two-factor-setup-form">
          <p className="form-help">
            Add an extra layer of security. We&apos;ll send a code to your email or phone each time you log in.
          </p>
          <div className="form-group">
            <label className="form-label">Method</label>
            <select
              className="form-select"
              value={method}
              onChange={e => setMethod(e.target.value as 'EMAIL' | 'SMS')}
            >
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS (Text Message)</option>
            </select>
          </div>
          {method === 'SMS' && (
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          )}
          <button
            className="btn btn-primary btn-sm"
            onClick={handleStartSetup}
            disabled={loading || (method === 'SMS' && phone.length < 10)}
          >
            {loading ? <Loader2 size={14} className="loading-spinner" /> : <Shield size={14} />}
            Enable 2FA
          </button>
        </div>
      )}

      {step === 'idle' && isEnabled && (
        <div className="two-factor-setup-form">
          <p className="form-help">
            2FA is active via {currentMethod === 'SMS' ? 'SMS' : 'Email'}. You&apos;ll need to enter a code when logging in.
          </p>
          <button
            className="btn btn-outline btn-sm btn-danger-text"
            onClick={handleStartDisable}
            disabled={loading}
          >
            {loading ? <Loader2 size={14} className="loading-spinner" /> : <ShieldOff size={14} />}
            Disable 2FA
          </button>
        </div>
      )}

      {(step === 'verify' || step === 'disable') && (
        <div className="two-factor-setup-form">
          <p className="form-help">
            Enter the 6-digit code we just sent.
          </p>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              inputMode="numeric"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={step === 'verify' ? handleVerifySetup : handleConfirmDisable}
              disabled={loading || code.length !== 6}
            >
              {loading ? <Loader2 size={14} className="loading-spinner" /> : <CheckCircle2 size={14} />}
              {step === 'verify' ? 'Confirm Setup' : 'Confirm Disable'}
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => { setStep('idle'); setCode(''); setError(null); setSuccess(null); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
