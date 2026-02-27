/**
 * Locations API Client
 *
 * Org-scoped location management.
 */

import { get, post, put } from './client';

// ============================================================================
// Types
// ============================================================================

export interface OrgLocation {
  id: string;
  name: string;
  number: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  employeeCount: number;
  userCount: number;
}

export interface CreateLocationRequest {
  name: string;
  number?: string;
}

export interface UpdateLocationRequest {
  name?: string;
  number?: string | null;
  status?: 'ACTIVE' | 'INACTIVE';
}

// ============================================================================
// API Functions
// ============================================================================

export async function getLocations(): Promise<OrgLocation[]> {
  const data = await get<{ locations: OrgLocation[] }>('/locations');
  return data.locations;
}

export async function createLocation(request: CreateLocationRequest): Promise<OrgLocation> {
  return post<OrgLocation>('/locations', request);
}

export async function updateLocation(id: string, request: UpdateLocationRequest): Promise<OrgLocation> {
  return put<OrgLocation>(`/locations/${id}`, request);
}
