'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { refreshToken } from '@/lib/api';
import { useDemo } from '@/lib/DemoContext';

const INACTIVITY_LIMIT = 5 * 60 * 1000;
const WARNING_COUNTDOWN = 60;
const CHECK_INTERVAL = 10 * 1000;

export default function SessionMonitor() {
  const { state, handleLogout } = useDemo();
  const lastActivity = useRef(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_COUNTDOWN);
  const warningShown = useRef(false);

  const isDemo = state.subscriptionStatus === 'DEMO';
  const isLoggedIn = state.currentStep > 0;

  const updateActivity = useCallback(() => {
    lastActivity.current = Date.now();
    if (warningShown.current) {
      warningShown.current = false;
      setShowWarning(false);
      setCountdown(WARNING_COUNTDOWN);
      refreshToken();
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || isDemo) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, updateActivity, { passive: true }));

    const interval = setInterval(() => {
      const idle = Date.now() - lastActivity.current;
      if (idle >= INACTIVITY_LIMIT && !warningShown.current) {
        warningShown.current = true;
        setShowWarning(true);
        setCountdown(WARNING_COUNTDOWN);
      }
    }, CHECK_INTERVAL);

    return () => {
      events.forEach(e => window.removeEventListener(e, updateActivity));
      clearInterval(interval);
    };
  }, [isLoggedIn, isDemo, updateActivity]);

  useEffect(() => {
    if (!showWarning) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          sessionStorage.setItem('tsp_inactivity_logout', '1');
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning, handleLogout]);

  if (!showWarning) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} data-testid="session-timeout-overlay">
      <div style={{
        background: '#fff', borderRadius: '0.75rem', padding: '1.5rem 2rem',
        maxWidth: '22rem', width: '90%', textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      }} data-testid="session-timeout-dialog">
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>&#x23F3;</div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#1a1a1a' }}>
          Still there?
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1rem', lineHeight: 1.4 }}>
          You&apos;ve been inactive. You&apos;ll be logged out in{' '}
          <span style={{ fontWeight: 700, color: countdown <= 10 ? '#ef4444' : '#1a1a1a' }}>
            {countdown}s
          </span>
        </p>
        <button
          onClick={updateActivity}
          style={{
            background: '#22c55e', color: '#fff', border: 'none',
            borderRadius: '0.4rem', padding: '0.6rem 1.5rem',
            fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
            width: '100%',
          }}
          data-testid="session-stay-logged-in-btn"
        >
          Stay Logged In
        </button>
      </div>
    </div>
  );
}
