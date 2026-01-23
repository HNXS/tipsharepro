/**
 * Admin API
 *
 * API calls for the Expert Command Center (platform owner only).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
const ADMIN_KEY_STORAGE = 'admin_key';

// Types
export interface Organization {
  id: string;
  name: string;
  subscriptionStatus: 'DEMO' | 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  trialEndsAt?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    locations: number;
    employees: number;
  };
  users?: Array<{
    id: string;
    email: string;
    role: string;
    lastLoginAt?: string;
  }>;
  locations?: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'VIEWER';
  organizationId: string;
  locationId?: string;
  lastLoginAt?: string;
  createdAt: string;
  organization?: { name: string };
  location?: { name: string };
}

export interface AdminStats {
  totalOrganizations: number;
  organizationsByStatus: Record<string, number>;
  totalUsers: number;
  totalLocations: number;
  recentLogins: Array<{
    email: string;
    lastLoginAt: string;
    organization: { name: string };
  }>;
}

// Admin key management
export function getAdminKey(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ADMIN_KEY_STORAGE);
}

export function setAdminKey(key: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
}

export function clearAdminKey(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_KEY_STORAGE);
}

// API request with admin auth
async function adminRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const adminKey = getAdminKey();

  if (!adminKey) {
    throw new Error('Admin key not set');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-admin-key': adminKey,
    ...(options.headers as Record<string, string>),
  };

  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || data.status === 'error') {
    throw new Error(data.error?.message || 'Admin request failed');
  }

  return data.data as T;
}

// Verify admin key
export async function verifyAdminKey(key: string): Promise<boolean> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-admin-key': key,
  };

  try {
    const response = await fetch(`${API_BASE}/admin/stats`, { headers });
    return response.ok;
  } catch {
    return false;
  }
}

// Organizations
export async function getOrganizations(): Promise<Organization[]> {
  return adminRequest<Organization[]>('/admin/organizations');
}

export async function createOrganization(data: {
  name: string;
  subscriptionStatus?: string;
}): Promise<Organization> {
  return adminRequest<Organization>('/admin/organizations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOrganization(
  id: string,
  data: {
    name?: string;
    subscriptionStatus?: string;
    trialEndsAt?: string;
  }
): Promise<Organization> {
  return adminRequest<Organization>(`/admin/organizations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteOrganization(id: string): Promise<void> {
  return adminRequest<void>(`/admin/organizations/${id}`, {
    method: 'DELETE',
  });
}

// Locations
export async function createLocation(
  orgId: string,
  data: { name: string; number?: string }
): Promise<{ id: string; name: string }> {
  return adminRequest<{ id: string; name: string }>(
    `/admin/organizations/${orgId}/locations`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

// Users
export async function getUsers(organizationId?: string): Promise<User[]> {
  const query = organizationId ? `?organizationId=${organizationId}` : '';
  return adminRequest<User[]>(`/admin/users${query}`);
}

export async function createUser(data: {
  organizationId: string;
  locationId?: string;
  email: string;
  password: string;
  role?: string;
}): Promise<User> {
  return adminRequest<User>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUser(
  id: string,
  data: {
    email?: string;
    password?: string;
    role?: string;
    locationId?: string;
  }
): Promise<User> {
  return adminRequest<User>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: string): Promise<void> {
  return adminRequest<void>(`/admin/users/${id}`, {
    method: 'DELETE',
  });
}

// Stats
export async function getAdminStats(): Promise<AdminStats> {
  return adminRequest<AdminStats>('/admin/stats');
}
