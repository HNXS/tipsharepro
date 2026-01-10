/**
 * Settings API
 *
 * Organization settings management.
 */

import { get, put } from './client';

// ============================================================================
// Types
// ============================================================================

export type ContributionMethod = 'CC_SALES' | 'CC_TIPS' | 'ALL_TIPS' | 'ALL_SALES';
export type PayPeriodType = 'WEEKLY' | 'BIWEEKLY' | 'SEMIMONTHLY' | 'MONTHLY';

export interface OrganizationSettings {
  contributionMethod: ContributionMethod;
  contributionRate: number;
  payPeriodType: PayPeriodType;
  estimatedMonthlySales: number;
  autoArchiveDays: number;
  roundingMode: 'NEAREST' | 'DOWN';
}

export interface SettingsResponse {
  organizationId: string;
  organizationName: string;
  settings: OrganizationSettings;
  updatedAt: string;
}

export interface ContributionRateOptionsResponse {
  method: ContributionMethod;
  options: number[];
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get organization settings
 */
export async function getSettings(): Promise<SettingsResponse> {
  return get<SettingsResponse>('/settings');
}

/**
 * Update organization settings
 */
export async function updateSettings(
  updates: Partial<OrganizationSettings>
): Promise<SettingsResponse> {
  return put<SettingsResponse>('/settings', updates);
}

/**
 * Get valid contribution rate options based on method
 */
export async function getContributionRateOptions(
  method: ContributionMethod
): Promise<ContributionRateOptionsResponse> {
  return get<ContributionRateOptionsResponse>(`/settings/contribution-rates?method=${method}`);
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Map frontend pay period type to backend format
 */
export function toBackendPayPeriodType(
  frontendType: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly'
): PayPeriodType {
  const mapping: Record<string, PayPeriodType> = {
    'weekly': 'WEEKLY',
    'bi-weekly': 'BIWEEKLY',
    'semi-monthly': 'SEMIMONTHLY',
    'monthly': 'MONTHLY',
  };
  return mapping[frontendType] || 'BIWEEKLY';
}

/**
 * Map backend pay period type to frontend format
 */
export function toFrontendPayPeriodType(
  backendType: PayPeriodType
): 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly' {
  const mapping: Record<PayPeriodType, 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly'> = {
    'WEEKLY': 'weekly',
    'BIWEEKLY': 'bi-weekly',
    'SEMIMONTHLY': 'semi-monthly',
    'MONTHLY': 'monthly',
  };
  return mapping[backendType] || 'bi-weekly';
}

/**
 * Get display label for contribution method
 */
export function getContributionMethodLabel(method: ContributionMethod): string {
  const labels: Record<ContributionMethod, string> = {
    'CC_SALES': 'CC Sales',
    'CC_TIPS': 'CC Tips',
    'ALL_TIPS': 'All Tips',
    'ALL_SALES': 'All Sales',
  };
  return labels[method] || method;
}
