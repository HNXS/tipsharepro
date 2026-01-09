/**
 * Tip Share Pro - Type Definitions
 *
 * All monetary values are stored and calculated as INTEGER CENTS
 * to avoid floating-point precision issues.
 */

import { Request } from 'express';
import { UserRole } from '@prisma/client';

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface AuthenticatedUser {
  id: string;
  organizationId: string;
  locationId: string | null;
  role: UserRole;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export interface JwtPayload {
  sub: string;           // User ID
  org: string;           // Organization ID
  loc: string | null;    // Location ID (null for admins)
  role: UserRole;
  email: string;
  iat: number;
  exp: number;
}

// ============================================================================
// Calculation Engine Types
// ============================================================================

/**
 * Input for calculating an employee's share of the tip pool
 */
export interface EmployeeCalculationInput {
  employeeId: string;
  employeeName: string;
  locationId: string;
  locationName: string;
  jobCategoryId: string;
  jobCategoryName: string;
  badgeColor: string;
  hoursWorked: number;           // Decimal hours (e.g., 32.5)
  hourlyRateCents: number;       // Rate in cents (e.g., 1850 = $18.50)
  weight: number;                // Job category weight (1.0 - 5.0)
}

/**
 * Result of calculating an employee's share
 * NOTE: 'basis' is calculated internally but NEVER exposed via API
 */
export interface EmployeeDistributionResult {
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
  hourlyRate: number;            // In dollars for display (e.g., 18.50)
  percentage: number;            // 0-100 percentage (e.g., 15.23 means 15.23%)
  shareCents: number;            // Exact calculated share in cents
  receivedCents: number;         // Rounded whole dollars in cents
}

/**
 * Internal calculation result (includes basis - never exposed)
 * @internal
 */
export interface InternalDistributionResult extends EmployeeDistributionResult {
  /**
   * CRITICAL: This value must NEVER be exposed via API responses.
   * It is the proprietary Hours × Rate × Weight calculation.
   */
  _basis: number;
  weightAtTime: number;
  rateAtTimeCents: number;
}

/**
 * Complete distribution calculation result
 */
export interface PoolDistributionResult {
  payPeriod: {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  distribution: EmployeeDistributionResult[];
  summary: {
    totalParticipants: number;
    totalHours: number;
    totalPoolCents: number;
    distributedCents: number;
    varianceCents: number;       // Should always be 0 after reconciliation
  };
  calculatedAt: string;
}

/**
 * Request to calculate pool distribution
 */
export interface CalculateDistributionRequest {
  payPeriodId: string;
  employeeHours: Array<{
    employeeId: string;
    hours: number;
  }>;
}

// ============================================================================
// Daily Entry Types
// ============================================================================

export interface DailyEntryInput {
  employeeId: string;
  salesCents: number | null;
  actualContribCents: number | null;
}

export interface BulkDailyEntryRequest {
  date: string;  // YYYY-MM-DD format
  entries: DailyEntryInput[];
}

// ============================================================================
// Settings Types
// ============================================================================

export interface OrganizationSettings {
  contributionRate: number;      // Percentage (e.g., 3.25)
  payPeriodType: 'WEEKLY' | 'BIWEEKLY' | 'SEMIMONTHLY' | 'MONTHLY';
  autoArchiveDays: number;       // Days after payday to auto-archive
  roundingMode: 'NEAREST' | 'DOWN';  // How to round final amounts
}

// ============================================================================
// Error Codes
// ============================================================================

export const ErrorCodes = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TWO_FACTOR_REQUIRED: 'TWO_FACTOR_REQUIRED',
  INVALID_2FA_CODE: 'INVALID_2FA_CODE',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // Business Logic
  PERIOD_ALREADY_ARCHIVED: 'PERIOD_ALREADY_ARCHIVED',
  INSUFFICIENT_DATA: 'INSUFFICIENT_DATA',
  CALCULATION_ERROR: 'CALCULATION_ERROR',

  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
