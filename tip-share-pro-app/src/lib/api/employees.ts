/**
 * Employees API
 *
 * CRUD operations for employees.
 */

import { get, post, put, del } from './client';

// ============================================================================
// Types
// ============================================================================

export interface Employee {
  id: string;
  name: string;
  locationId: string;
  locationName: string;
  jobCategory: {
    id: string;
    name: string;
    weight: number;
    badgeColor: string;
  };
  hourlyRate: number;          // Dollars
  hourlyRateCents: number;     // Cents
  status: 'ACTIVE' | 'TERMINATED';
  isSample: boolean;
  hiredAt: string;
  terminatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  name: string;
  locationId: string;
  jobCategoryId: string;
  hourlyRateCents: number;
  hiredAt?: string;
}

export interface UpdateEmployeeRequest {
  jobCategoryId?: string;
  hourlyRateCents?: number;
  status?: 'ACTIVE' | 'TERMINATED';
}

export interface EmployeeListOptions {
  locationId?: string;
  status?: 'ACTIVE' | 'TERMINATED';
  jobCategoryId?: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all employees
 */
export async function getEmployees(
  options: EmployeeListOptions = {}
): Promise<{ employees: Employee[] }> {
  const params = new URLSearchParams();
  if (options.locationId) params.set('locationId', options.locationId);
  if (options.status) params.set('status', options.status);
  if (options.jobCategoryId) params.set('jobCategoryId', options.jobCategoryId);

  const queryString = params.toString();
  const endpoint = queryString ? `/employees?${queryString}` : '/employees';

  return get<{ employees: Employee[] }>(endpoint);
}

/**
 * Get a single employee
 */
export async function getEmployee(employeeId: string): Promise<Employee> {
  return get<Employee>(`/employees/${employeeId}`);
}

/**
 * Create a new employee
 */
export async function createEmployee(
  data: CreateEmployeeRequest
): Promise<Employee> {
  return post<Employee>('/employees', data);
}

/**
 * Update an employee
 */
export async function updateEmployee(
  employeeId: string,
  data: UpdateEmployeeRequest
): Promise<Employee> {
  return put<Employee>(`/employees/${employeeId}`, data);
}

/**
 * Delete an employee (soft-delete)
 */
export async function deleteEmployee(
  employeeId: string
): Promise<{ message: string }> {
  return del<{ message: string }>(`/employees/${employeeId}`);
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Convert dollars to cents for API
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars for display
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}
