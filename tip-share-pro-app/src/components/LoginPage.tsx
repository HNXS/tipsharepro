'use client';

import { useState, useEffect } from 'react';
import { LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { login, register, ApiError } from '@/lib/api';
import type { TwoFactorRequiredResponse } from '@/lib/api';
import TwoFactorVerify from './TwoFactorVerify';

interface LoginPageProps {
  onLoginSuccess: (user: {
    name: string;
    companyName: string;
    role: string;
    email?: string;
    locationId?: string | null;
    organization?: {
      subscriptionStatus: string;
      trialEndsAt: string | null;
    };
  }) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorRequiredResponse | null>(null);

  // Check URL param for signup mode (campaign links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === 'true') {
      setMode('signup');
    }
  }, []);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCompanyName('');
    setError(null);
  };

  const toggleMode = () => {
    resetForm();
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (mode === 'signup') {
      // Validate confirm password
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }

      try {
        const response = await register({
          email,
          password,
          companyName: companyName.trim() || undefined,
        });

        onLoginSuccess({
          name: response.user.name,
          companyName: response.user.companyName,
          role: response.user.role,
          email: response.user.email,
          locationId: response.user.locationId,
          organization: response.organization,
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Unable to connect to the server. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Sign-in mode — all logins go through the real API
    try {
      const response = await login({ email, password });

      // Check if 2FA is required
      if ('requires2FA' in response && response.requires2FA) {
        setTwoFactorData(response);
        setIsLoading(false);
        return;
      }

      // Normal login success
      const loginResponse = response as Exclude<typeof response, TwoFactorRequiredResponse>;
      onLoginSuccess({
        name: loginResponse.user.name,
        companyName: loginResponse.user.companyName,
        role: loginResponse.user.role,
        email: loginResponse.user.email,
        locationId: loginResponse.user.locationId,
        organization: loginResponse.organization,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to connect to the server. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show 2FA verification screen
  if (twoFactorData) {
    return (
      <div className="login-page">
        <div className="login-bg-pattern" />
        <TwoFactorVerify
          tempToken={twoFactorData.tempToken}
          method={twoFactorData.method}
          onVerified={(data) => {
            onLoginSuccess({
              name: data.user.name,
              companyName: data.user.companyName,
              role: data.user.role,
              email: data.user.email,
              locationId: data.user.locationId,
              organization: data.organization,
            });
          }}
          onCancel={() => {
            setTwoFactorData(null);
            setError(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="login-page">
      {/* Background pattern */}
      <div className="login-bg-pattern" />

      <div className="login-container">
        {/* Logo Section */}
        <div className="login-header">
          <Image
            src="/logo-full.png"
            alt="TipSharePro - Powerful * Fair * Transparent"
            width={280}
            height={200}
            priority
            className="login-logo-image"
          />
        </div>

        {/* Login Card */}
        <div className="login-card">
          <h2 className="login-card-title">
            {mode === 'signin' ? 'Sign in to continue' : 'Create your account'}
          </h2>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Error Message */}
            {error && (
              <div className="login-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email"
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                required
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                disabled={isLoading}
              />
            </div>

            {/* Sign-up only fields */}
            {mode === 'signup' && (
              <>
                {/* Confirm Password */}
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    placeholder="Re-enter your password"
                    required
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>

                {/* Company Name */}
                <div className="form-group">
                  <label htmlFor="companyName" className="form-label">
                    Company Name <span className="form-label-optional">(optional)</span>
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="form-input"
                    placeholder="Your restaurant or business name"
                    autoComplete="organization"
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password || (mode === 'signup' && !confirmPassword)}
              className="btn btn-primary btn-lg btn-full"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : mode === 'signin' ? (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="login-mode-toggle">
            {mode === 'signin' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={toggleMode} className="login-toggle-link">
                  Create one
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button type="button" onClick={toggleMode} className="login-toggle-link">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="login-footer">
          &copy; {new Date().getFullYear()} TipSharePro. All rights reserved.
        </p>
      </div>
    </div>
  );
}
