/**
 * Job Categories API
 *
 * CRUD operations for job categories.
 */

import { get, post, put, del } from './client';

// ============================================================================
// Types
// ============================================================================

export interface JobCategory {
  id: string;
  name: string;
  weight: number;
  badgeColor: string;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobCategoryRequest {
  name: string;
  weight: number;
  badgeColor?: string;
}

export interface UpdateJobCategoryRequest {
  name?: string;
  weight?: number;
  badgeColor?: string;
}

export interface PredefinedCategoriesResponse {
  predefined: Array<{
    group: string;
    categories: string[];
  }>;
  weightOptions: number[];
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all job categories
 */
export async function getJobCategories(): Promise<{ categories: JobCategory[] }> {
  return get<{ categories: JobCategory[] }>('/job-categories');
}

/**
 * Get predefined category list and weight options
 */
export async function getPredefinedCategories(): Promise<PredefinedCategoriesResponse> {
  return get<PredefinedCategoriesResponse>('/job-categories/predefined');
}

/**
 * Get a single job category
 */
export async function getJobCategory(categoryId: string): Promise<JobCategory> {
  return get<JobCategory>(`/job-categories/${categoryId}`);
}

/**
 * Create a new job category
 */
export async function createJobCategory(
  data: CreateJobCategoryRequest
): Promise<JobCategory> {
  return post<JobCategory>('/job-categories', data);
}

/**
 * Update a job category
 */
export async function updateJobCategory(
  categoryId: string,
  data: UpdateJobCategoryRequest
): Promise<JobCategory> {
  return put<JobCategory>(`/job-categories/${categoryId}`, data);
}

/**
 * Delete a job category
 */
export async function deleteJobCategory(
  categoryId: string
): Promise<{ message: string }> {
  return del<{ message: string }>(`/job-categories/${categoryId}`);
}
