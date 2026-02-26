'use client';

import { useState, useEffect } from 'react';
import { LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { login, register, ApiError } from '@/lib/api';

interface LoginPageProps {
  onLoginSuccess: (user: {
    name: string;
    companyName: string;
    role: string;
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

    // Sign-in mode
    // Demo mode: bypass API for demo credentials
    const isDemoMode = email === 'demo@tipsharepro.com' && password === 'demo123';

    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      onLoginSuccess({
        name: 'Sarah Chen',
        companyName: 'The Golden Fork',
        role: 'manager',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await login({ email, password });

      onLoginSuccess({
        name: response.user.name,
        companyName: response.user.companyName,
        role: response.user.role,
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
