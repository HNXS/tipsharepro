/**
 * Daily Entries API
 *
 * CRUD operations for daily sales entries within pay periods.
 */

import { get, put, del } from './client';

// ============================================================================
// Types
// ============================================================================

export interface DailyEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  jobCategory: {
    id: string;
    name: string;
    badgeColor: string;
  };
  date: string;
  sales: number | null;
  calculatedContribution: number | null;
  actualContribution: number | null;
  enteredBy: string | null;
  updatedAt: string;
}

export interface EntriesResponse {
  payPeriod: {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  entries: DailyEntry[];
  summary: RunningTotals;
}

export interface RunningTotals {
  totalSalesCents: number;
  totalCalculatedContribCents: number;
  totalActualContribCents: number;
  daysEntered: number;
  daysTotal: number;
}

export interface DateEntriesResponse {
  payPeriod: {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  date: string;
  entries: DailyEntry[];
  navigation: {
    currentDate: string;
    previousDate: string | null;
    nextDate: string | null;
    isFirstDay: boolean;
    isLastDay: boolean;
    dayNumber: number;
    totalDays: number;
  };
  runningTotals: RunningTotals;
}

export interface BulkUpsertEntry {
  employeeId: string;
  salesCents: number | null;
  actualContribCents?: number | null;
}

export interface BulkUpsertResult {
  created: number;
  updated: number;
  entries: DailyEntry[];
  runningTotals: RunningTotals;
}

export interface EmployeeForDate {
  id: string;
  name: string;
  jobCategory: {
    id: string;
    name: string;
    badgeColor: string;
  };
  existingEntry: DailyEntry | null;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all entries for a pay period (optionally filter by date or employee)
 */
export async function getEntriesForPeriod(
  periodId: string,
  options: { date?: string; employeeId?: string } = {}
): Promise<EntriesResponse> {
  const params = new URLSearchParams();
  if (options.date) params.set('date', options.date);
  if (options.employeeId) params.set('employeeId', options.employeeId);

  const queryString = params.toString();
  const endpoint = queryString
    ? `/pay-periods/${periodId}/entries?${queryString}`
    : `/pay-periods/${periodId}/entries`;

  return get<EntriesResponse>(endpoint);
}

/**
 * Get entries for a specific date with navigation info
 */
export async function getEntriesForDate(
  periodId: string,
  date: string
): Promise<DateEntriesResponse> {
  return get<DateEntriesResponse>(`/pay-periods/${periodId}/entries/${date}`);
}

/**
 * Get employees with their existing entries for a date
 */
export async function getEmployeesForDate(
  periodId: string,
  date: string
): Promise<{ employees: EmployeeForDate[] }> {
  return get<{ employees: EmployeeForDate[] }>(
    `/pay-periods/${periodId}/entries/${date}/employees`
  );
}

/**
 * Bulk upsert entries for a date
 */
export async function bulkUpsertEntries(
  periodId: string,
  date: string,
  entries: BulkUpsertEntry[]
): Promise<BulkUpsertResult> {
  return put<BulkUpsertResult>(`/pay-periods/${periodId}/entries`, {
    date,
    entries,
  });
}

/**
 * Delete a single entry
 */
export async function deleteEntry(
  periodId: string,
  entryId: string
): Promise<{ message: string }> {
  return del<{ message: string }>(`/pay-periods/${periodId}/entries/${entryId}`);
}
