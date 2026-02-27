/**
 * Pay Periods API
 *
 * CRUD operations for pay periods.
 */

import { get, post, put } from './client';

// ============================================================================
// Types
// ============================================================================

export type PayPeriodStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface PayPeriod {
  id: string;
  locationId: string;
  locationName?: string;
  startDate: string;
  endDate: string;
  status: PayPeriodStatus;
  totalPool: number | null;
  totalPoolCents: number | null;
  daysEntered: number;
  totalDays: number;
  calculatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayPeriodRequest {
  locationId: string;
  startDate: string;
  endDate: string;
}

export interface UpdatePayPeriodRequest {
  status?: PayPeriodStatus;
  totalPoolCents?: number;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all pay periods for a location
 */
export async function getPayPeriods(
  locationId?: string
): Promise<{ payPeriods: PayPeriod[] }> {
  const params = new URLSearchParams();
  if (locationId) params.set('locationId', locationId);

  const queryString = params.toString();
  const endpoint = queryString ? `/pay-periods?${queryString}` : '/pay-periods';

  return get<{ payPeriods: PayPeriod[] }>(endpoint);
}

/**
 * Get the current DRAFT/ACTIVE pay period
 */
export async function getCurrentPayPeriod(
  locationId?: string
): Promise<PayPeriod | null> {
  const params = new URLSearchParams();
  if (locationId) params.set('locationId', locationId);

  const queryString = params.toString();
  const endpoint = queryString ? `/pay-periods/current?${queryString}` : '/pay-periods/current';

  try {
    const resp = await get<{ payPeriod: PayPeriod | null }>(endpoint);
    return resp.payPeriod;
  } catch {
    // 404 means no current period — that's fine
    return null;
  }
}

/**
 * Get a single pay period
 */
export async function getPayPeriod(periodId: string): Promise<PayPeriod> {
  return get<PayPeriod>(`/pay-periods/${periodId}`);
}

/**
 * Create a new pay period
 */
export async function createPayPeriod(
  data: CreatePayPeriodRequest
): Promise<PayPeriod> {
  return post<PayPeriod>('/pay-periods', data);
}

/**
 * Update a pay period (status, totalPoolCents)
 */
export async function updatePayPeriod(
  periodId: string,
  data: UpdatePayPeriodRequest
): Promise<PayPeriod> {
  return put<PayPeriod>(`/pay-periods/${periodId}`, data);
}
