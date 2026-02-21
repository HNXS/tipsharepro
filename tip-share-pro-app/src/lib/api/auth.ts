/**
 * Auth API
 *
 * Authentication-related API calls.
 */

import { post, get, setToken, clearToken } from './client';

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
    locationName: string | null;
  };
}

export interface SessionResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    companyName: string;
    locationName: string | null;
  };
  organization: {
    id: string;
    name: string;
    subscriptionStatus: string;
  };
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Login with email and password
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await post<LoginResponse>('/auth/login', credentials);

  // Store the token
  setToken(response.token);

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
