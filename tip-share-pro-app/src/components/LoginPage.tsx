'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
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
          <div className="login-logo">
            <Image
              src="/logo-icon.png"
              alt="TipSharePro"
              width={80}
              height={80}
              className="login-logo-image"
              priority
            />
          </div>
          <h1 className="login-brand-name">TipSharePro</h1>
          <p className="login-tagline">
            Powerful &bull; Fair &bull; Transparent
          </p>
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
                placeholder="demo@tipsharepro.com"
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
