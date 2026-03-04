/**
 * Users API Client
 *
 * Org-scoped user management (Admin only).
 */

import { get, post, put, del } from './client';

// ============================================================================
// Types
// ============================================================================

export interface OrgUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'DATA';
  mustChangePassword: boolean;
  twoFactorEnabled: boolean;
  locationId: string | null;
  location: { id: string; name: string } | null;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface CreateUserRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'DATA';
  locationId?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: 'ADMIN' | 'MANAGER' | 'DATA';
  locationId?: string | null;
  twoFactorEnabled?: boolean;
  adminAcknowledgment?: boolean;
}

// ============================================================================
// API Functions
// ============================================================================

export async function getUsers(): Promise<OrgUser[]> {
  const data = await get<{ users: OrgUser[] }>('/users');
  return data.users;
}

export async function createUser(request: CreateUserRequest): Promise<OrgUser> {
  return post<OrgUser>('/users', request);
}

export async function updateUser(id: string, request: UpdateUserRequest): Promise<OrgUser> {
  return put<OrgUser>(`/users/${id}`, request);
}

export async function deleteUser(id: string): Promise<void> {
  await del(`/users/${id}`);
}
