/**
 * API ↔ Frontend Type Mappers
 *
 * Converts between backend API types and frontend DemoContext types.
 */

import type { Employee as ApiEmployee } from './employees';
import type { JobCategory as ApiJobCategory } from './jobCategories';
import type { SettingsResponse, ContributionMethod as ApiContributionMethod, PayPeriodType } from './settings';
import { toFrontendPayPeriodType, toBackendPayPeriodType } from './settings';
import { centsToDollars, dollarsToCents } from './employees';
import type {
  Employee,
  JobCategory,
  Settings,
  CategoryColor,
  VariableWeight,
  ContributionMethod,
} from '../types';
import {
  CATEGORY_COLOR_MAP,
  DEFAULT_CATEGORY_WEIGHTS,
  DEFAULT_CATEGORY_NAMES,
} from '../types';

// ============================================================================
// Hex ↔ CategoryColor mapping
// ============================================================================

const HEX_TO_CATEGORY_COLOR: Record<string, CategoryColor> = Object.fromEntries(
  Object.entries(CATEGORY_COLOR_MAP).map(([slug, { hex }]) => [hex.toUpperCase(), slug as CategoryColor])
) as Record<string, CategoryColor>;

/**
 * Convert a hex badge color from the API to a frontend CategoryColor slug.
 * Falls back to 'custom' for unknown colors.
 */
export function hexToCategoryColor(hex: string): CategoryColor {
  return HEX_TO_CATEGORY_COLOR[hex.toUpperCase()] || 'custom';
}

/**
 * Convert a frontend CategoryColor slug to the hex string the API expects.
 */
export function categoryColorToHex(color: CategoryColor): string {
  return CATEGORY_COLOR_MAP[color]?.hex || CATEGORY_COLOR_MAP.custom.hex;
}

// ============================================================================
// Employee mappers
// ============================================================================

const CATEGORY_COLOR_TO_GROUP: Record<CategoryColor, JobCategory['group']> = {
  boh: 'kitchen',
  foh: 'frontOfHouse',
  bar: 'bar',
  support: 'support',
  custom: 'custom',
};

/**
 * Map a backend API employee to a frontend Employee.
 */
export function mapApiEmployeeToFrontend(apiEmp: ApiEmployee): Employee {
  return {
    id: apiEmp.id,
    name: apiEmp.name,
    jobCategoryId: apiEmp.jobCategory.id,
    hourlyRate: apiEmp.hourlyRate,
    hoursWorked: 0,
    weightAdjustment: 0,
    status: 'active',
  };
}

/**
 * Build a CreateEmployeeRequest from frontend data.
 */
export function mapFrontendEmployeeToCreateRequest(
  emp: Employee,
  locationId: string
): { name: string; locationId: string; jobCategoryId: string; hourlyRateCents: number } {
  return {
    name: emp.name,
    locationId,
    jobCategoryId: emp.jobCategoryId,
    hourlyRateCents: dollarsToCents(emp.hourlyRate),
  };
}

// ============================================================================
// Job Category mappers
// ============================================================================

/**
 * Map a backend API job category to a frontend JobCategory.
 */
export function mapApiJobCategoryToFrontend(apiCat: ApiJobCategory): JobCategory {
  const color = hexToCategoryColor(apiCat.badgeColor);
  return {
    id: apiCat.id,
    name: apiCat.name,
    variableWeight: apiCat.weight as VariableWeight,
    categoryColor: color,
    group: CATEGORY_COLOR_TO_GROUP[color],
  };
}

/**
 * Derive categoryWeights from a list of frontend JobCategories.
 * Uses the weight of the first job found in each color group,
 * falling back to defaults for groups with no jobs.
 */
export function deriveCategoryWeights(
  jobs: JobCategory[]
): Record<CategoryColor, number> {
  const weights = { ...DEFAULT_CATEGORY_WEIGHTS };
  const seen = new Set<CategoryColor>();

  for (const job of jobs) {
    if (!seen.has(job.categoryColor)) {
      seen.add(job.categoryColor);
      weights[job.categoryColor] = job.variableWeight;
    }
  }
  return weights;
}

/**
 * Derive categoryNames from a list of frontend JobCategories.
 * Falls back to defaults.
 */
export function deriveCategoryNames(): Record<CategoryColor, string> {
  return { ...DEFAULT_CATEGORY_NAMES };
}

// ============================================================================
// Settings mappers
// ============================================================================

/**
 * Map backend settings response + job categories into frontend Settings.
 */
export function mapApiSettingsToFrontend(
  settingsResp: SettingsResponse,
  jobCategories: JobCategory[]
): Settings {
  const s = settingsResp.settings;
  return {
    companyName: settingsResp.organizationName,
    contributionMethod: s.contributionMethod as ContributionMethod,
    contributionRate: s.contributionRate,
    estimatedMonthlySales: s.estimatedMonthlySales,
    payPeriodType: toFrontendPayPeriodType(s.payPeriodType),
    jobCategories,
    selectedCategories: jobCategories.map(j => j.id),
    categoryWeights: deriveCategoryWeights(jobCategories),
    categoryNames: deriveCategoryNames(),
  };
}

/**
 * Build a partial backend settings update from frontend Settings changes.
 */
export function mapFrontendSettingsToUpdateRequest(
  updates: Partial<Settings>
): Partial<{
  contributionMethod: ApiContributionMethod;
  contributionRate: number;
  payPeriodType: PayPeriodType;
  estimatedMonthlySales: number;
}> {
  const req: Record<string, unknown> = {};

  if (updates.contributionMethod !== undefined) {
    req.contributionMethod = updates.contributionMethod;
  }
  if (updates.contributionRate !== undefined) {
    req.contributionRate = updates.contributionRate;
  }
  if (updates.payPeriodType !== undefined) {
    req.payPeriodType = toBackendPayPeriodType(updates.payPeriodType);
  }
  if (updates.estimatedMonthlySales !== undefined) {
    req.estimatedMonthlySales = updates.estimatedMonthlySales;
  }

  return req;
}
