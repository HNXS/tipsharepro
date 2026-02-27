/**
 * Calculations API
 *
 * Distribution calculation and preview endpoints.
 */

import { get, post } from './client';

// ============================================================================
// Types
// ============================================================================

export interface EmployeeHours {
  employeeId: string;
  hours: number;
}

export interface DistributionEmployee {
  employeeId: string;
  employeeName: string;
  locationId: string;
  locationName: string;
  jobCategory: {
    id: string;
    name: string;
    badgeColor: string;
  };
  hoursWorked: number;
  hourlyRate: number;
  percentage: number;
  shareCents: number;
  receivedCents: number;
}

export interface DistributionSummary {
  totalParticipants: number;
  totalHours: number;
  totalPoolCents: number;
  distributedCents: number;
  varianceCents: number;
}

export interface CalculationResult {
  payPeriod: {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  distribution: DistributionEmployee[];
  summary: DistributionSummary;
  calculatedAt: string;
  isPreview?: boolean;
}

export interface PreviewEmployee {
  employeeId: string;
  employeeName: string;
  locationId: string;
  locationName: string;
  jobCategoryId: string;
  jobCategoryName: string;
  badgeColor: string;
  hoursWorked: number;
  hourlyRateCents: number;
  weight: number;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Run final calculation for a pay period (saves results)
 */
export async function calculateDistribution(
  periodId: string,
  employeeHours: EmployeeHours[]
): Promise<CalculationResult> {
  return post<CalculationResult>(
    `/pay-periods/${periodId}/calculate`,
    { employeeHours }
  );
}

/**
 * Get stored distribution results for a finalized pay period
 */
export async function getDistribution(
  periodId: string
): Promise<CalculationResult | null> {
  try {
    return await get<CalculationResult>(`/pay-periods/${periodId}/distribution`);
  } catch {
    return null;
  }
}

/**
 * Preview distribution without saving (for what-if scenarios)
 */
export async function previewDistribution(
  totalPoolCents: number,
  employees: PreviewEmployee[]
): Promise<CalculationResult> {
  return post<CalculationResult>('/calculate/preview', {
    totalPoolCents,
    employees,
  });
}
