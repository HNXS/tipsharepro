/**
 * Auth API
 *
 * Authentication-related API calls.
 */

import { post, get, setToken, clearToken, getToken } from './client';

// ============================================================================
// Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  companyName?: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    companyName: string;
    locationId: string | null;
    locationName: string | null;
    mustChangePassword?: boolean;
  };
  organization: {
    id: string;
    name: string;
    subscriptionStatus: 'DEMO' | 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
    trialEndsAt: string | null;
  };
}

export interface TwoFactorRequiredResponse {
  requires2FA: true;
  tempToken: string;
  method: 'EMAIL' | 'SMS';
}

export interface SessionResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    companyName: string;
    locationId: string | null;
    locationName: string | null;
    twoFactorEnabled?: boolean;
    twoFactorMethod?: string | null;
  };
  organization: {
    id: string;
    name: string;
    subscriptionStatus: 'DEMO' | 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
    trialEndsAt: string | null;
  };
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Login with email and password.
 * Returns LoginResponse on success, or TwoFactorRequiredResponse if 2FA is enabled.
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse | TwoFactorRequiredResponse> {
  const response = await post<LoginResponse | TwoFactorRequiredResponse>('/auth/login', credentials);

  // If 2FA is required, don't store token yet — return the temp response
  if ('requires2FA' in response && response.requires2FA) {
    return response;
  }

  // Normal login — store the token
  setToken((response as LoginResponse).token);

  return response;
}

/**
 * Register a new account
 */
export async function register(data: RegisterRequest): Promise<LoginResponse> {
  const response = await post<LoginResponse>('/auth/register', data);

  // Store the token
  setToken(response.token);

  return response;
}

/**
 * Logout (clears token)
 */
export async function logout(): Promise<void> {
  try {
    await post('/auth/logout');
  } finally {
    // Always clear token, even if API call fails
    clearToken();
  }
}

/**
 * Get current session info
 */
export async function getSession(): Promise<SessionResponse> {
  return get<SessionResponse>('/auth/session');
}

/**
 * Change password (first-login or voluntary)
 */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await post('/auth/change-password', { currentPassword, newPassword });
}

/**
 * Check if current session is valid
 */
export async function validateSession(): Promise<boolean> {
  try {
    await getSession();
    return true;
  } catch {
    clearToken();
    return false;
  }
}

/**
 * Refresh the JWT token (extends session)
 */
export async function refreshToken(): Promise<boolean> {
  if (!getToken()) return false;
  try {
    const result = await post<{ token: string }>('/auth/refresh');
    setToken(result.token);
    return true;
  } catch {
    return false;
  }
}
