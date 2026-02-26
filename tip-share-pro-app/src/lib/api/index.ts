/**
 * API Module Index
 *
 * Exports all API functions and types.
 */

// Client utilities
export {
  apiRequest,
  get,
  post,
  put,
  del,
  getToken,
  setToken,
  clearToken,
  isAuthenticated,
  ApiError,
} from './client';
export type { ApiResponse } from './client';

// Auth
export {
  login,
  register,
  logout,
  getSession,
  validateSession,
} from './auth';
export type { LoginRequest, RegisterRequest, LoginResponse, SessionResponse } from './auth';

// Settings
export {
  getSettings,
  updateSettings,
  getContributionRateOptions,
  toBackendPayPeriodType,
  toFrontendPayPeriodType,
  getContributionMethodLabel,
} from './settings';
export type {
  ContributionMethod,
  PayPeriodType,
  OrganizationSettings,
  SettingsResponse,
  ContributionRateOptionsResponse,
} from './settings';

// Job Categories
export {
  getJobCategories,
  getPredefinedCategories,
  getJobCategory,
  createJobCategory,
  updateJobCategory,
  deleteJobCategory,
} from './jobCategories';
export type {
  JobCategory as ApiJobCategory,
  CreateJobCategoryRequest,
  UpdateJobCategoryRequest,
  PredefinedCategoriesResponse,
} from './jobCategories';

// Employees
export {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  dollarsToCents,
  centsToDollars,
} from './employees';
export type {
  Employee as ApiEmployee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeListOptions,
} from './employees';

// Mappers (API ↔ Frontend type conversion)
export {
  hexToCategoryColor,
  categoryColorToHex,
  mapApiEmployeeToFrontend,
  mapFrontendEmployeeToCreateRequest,
  mapApiJobCategoryToFrontend,
  deriveCategoryWeights,
  deriveCategoryNames,
  mapApiSettingsToFrontend,
  mapFrontendSettingsToUpdateRequest,
} from './mappers';
