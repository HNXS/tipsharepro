/**
 * Two-Factor Authentication API Client
 */

import { post } from './client';

export interface TwoFactorSetupResponse {
  message: string;
  method: 'EMAIL' | 'SMS';
}

export async function setup2FA(method: 'EMAIL' | 'SMS', phone?: string): Promise<TwoFactorSetupResponse> {
  return post<TwoFactorSetupResponse>('/auth/2fa/setup', { method, phone });
}

export async function verifySetup2FA(code: string): Promise<{ message: string; method: string }> {
  return post('/auth/2fa/verify-setup', { code });
}

export async function disable2FA(code: string): Promise<{ message: string }> {
  return post('/auth/2fa/disable', { code });
}

export async function sendLoginCode(tempToken: string): Promise<{ message: string; method: string }> {
  return post('/auth/2fa/send-code', { tempToken });
}

export async function verifyLoginCode(tempToken: string, code: string): Promise<{
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    companyName: string;
    role: string;
    locationId: string | null;
  };
  organization: {
    id: string;
    name: string;
    subscriptionStatus: string;
    trialEndsAt: string | null;
  };
}> {
  return post('/auth/2fa/verify', { tempToken, code });
}
