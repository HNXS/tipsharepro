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
export type { LoginRequest, RegisterRequest, LoginResponse, TwoFactorRequiredResponse, SessionResponse } from './auth';

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

// Pay Periods
export {
  getPayPeriods,
  getCurrentPayPeriod,
  getPayPeriod,
  createPayPeriod,
  updatePayPeriod,
} from './payPeriods';
export type {
  PayPeriod,
  PayPeriodStatus,
  CreatePayPeriodRequest,
  UpdatePayPeriodRequest,
} from './payPeriods';

// Daily Entries
export {
  getEntriesForPeriod,
  getEntriesForDate,
  getEmployeesForDate,
  bulkUpsertEntries,
  deleteEntry,
} from './dailyEntries';
export type {
  DailyEntry,
  DateEntriesResponse,
  EntriesResponse,
  RunningTotals,
  BulkUpsertEntry,
  BulkUpsertResult,
  EmployeeForDate,
} from './dailyEntries';

// Calculations
export {
  calculateDistribution as apiCalculateDistribution,
  getDistribution,
  previewDistribution,
} from './calculations';
export type {
  EmployeeHours,
  DistributionEmployee,
  DistributionSummary,
  CalculationResult,
  PreviewEmployee,
} from './calculations';

// Users
export {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from './users';
export type {
  OrgUser,
  CreateUserRequest,
  UpdateUserRequest,
} from './users';

// Locations
export {
  getLocations,
  createLocation,
  updateLocation,
} from './locations';
export type {
  OrgLocation,
  CreateLocationRequest,
  UpdateLocationRequest,
} from './locations';

// Two-Factor Authentication
export {
  setup2FA,
  verifySetup2FA,
  disable2FA,
  sendLoginCode,
  verifyLoginCode,
} from './twoFactor';

// Billing
export {
  createCheckoutSession,
  createPortalSession,
  getSubscription,
} from './billing';
export type { SubscriptionInfo } from './billing';

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
