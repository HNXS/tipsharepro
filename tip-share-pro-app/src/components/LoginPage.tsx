'use client';

import { useState } from 'react';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { login, ApiError } from '@/lib/api';

interface LoginPageProps {
  onLoginSuccess: (user: {
    name: string;
    companyName: string;
    role: string;
  }) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Demo mode: bypass API for demo credentials
    const isDemoMode = email === 'demo@tipsharepro.com' && password === 'demo123';

    if (isDemoMode) {
      // Simulate brief loading delay for realism
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
            Sign in to continue
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
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="btn btn-primary btn-lg btn-full"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Hint */}
          <div className="login-demo-hint">
            <p className="login-demo-label">Demo credentials:</p>
            <p className="login-demo-credentials">
              demo@tipsharepro.com / demo123
            </p>
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
