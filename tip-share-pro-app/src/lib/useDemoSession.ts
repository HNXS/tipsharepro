'use client';

import { useState, useCallback } from 'react';

interface DemoSessionData {
  code: string;
  userName?: string;
  companyName?: string;
  settings?: unknown;
  employees?: unknown;
}

interface UseDemoSessionReturn {
  isLoading: boolean;
  error: string | null;
  sessionCode: string | null;
  saveSession: (data: Omit<DemoSessionData, 'code'> & { code?: string }) => Promise<string | null>;
  loadSession: (code: string) => Promise<DemoSessionData | null>;
  clearError: () => void;
}

export function useDemoSession(): UseDemoSessionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionCode, setSessionCode] = useState<string | null>(null);

  const saveSession = useCallback(async (data: Omit<DemoSessionData, 'code'> & { code?: string }): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save session');
      }

      const result = await response.json();
      setSessionCode(result.code);
      return result.code;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save session';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSession = useCallback(async (code: string): Promise<DemoSessionData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/demo?code=${encodeURIComponent(code)}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Session not found. Check your code and try again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load session');
      }

      const data = await response.json();
      setSessionCode(data.code);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load session';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    sessionCode,
    saveSession,
    loadSession,
    clearError,
  };
}
