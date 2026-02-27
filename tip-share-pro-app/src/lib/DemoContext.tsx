'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import {
  DemoState,
  Settings,
  Employee,
  DistributionResult,
  DEFAULT_SETTINGS,
  DEFAULT_EMPLOYEES,
  JobCategory,
  VariableWeight,
  ContributionMethod,
  CategoryColor,
  getDefaultRateForMethod,
  getDefaultAmountForMethod,
  isSalesBasedMethod,
  ALL_PREDEFINED_CATEGORIES,
  DEFAULT_CATEGORY_WEIGHTS,
} from './types';
import {
  isAuthenticated as checkAuth,
  clearToken,
  getSession,
  validateSession,
  getEmployees,
  getJobCategories,
  getSettings as apiGetSettings,
  createEmployee as apiCreateEmployee,
  updateEmployee as apiUpdateEmployee,
  deleteEmployee as apiDeleteEmployee,
  updateSettings as apiUpdateSettings,
  createJobCategory as apiCreateJobCategory,
  updateJobCategory as apiUpdateJobCategory,
  deleteJobCategory as apiDeleteJobCategory,
  dollarsToCents,
  getPayPeriods as apiGetPayPeriods,
  getCurrentPayPeriod as apiGetCurrentPayPeriod,
  createPayPeriod as apiCreatePayPeriod,
  updatePayPeriod as apiUpdatePayPeriod,
  getEntriesForDate as apiGetEntriesForDate,
  getEmployeesForDate as apiGetEmployeesForDate,
  bulkUpsertEntries as apiBulkUpsertEntries,
  apiCalculateDistribution,
  getDistribution as apiGetDistribution,
} from './api';
import type {
  PayPeriod,
  DailyEntry,
  DateEntriesResponse,
  RunningTotals,
  EmployeeForDate,
  CalculationResult,
  EmployeeHours,
} from './api';
import {
  mapApiEmployeeToFrontend,
  mapApiJobCategoryToFrontend,
  mapApiSettingsToFrontend,
  mapFrontendSettingsToUpdateRequest,
  categoryColorToHex,
} from './api/mappers';
import { getLocations } from './api/locations';

// Subscription status type
type SubscriptionStatus = 'DEMO' | 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';

// Auth user type
export interface AuthUser {
  name: string;
  companyName: string;
  role: string;
  email?: string;
  locationId?: string | null;
  organization?: {
    subscriptionStatus: string;
    trialEndsAt: string | null;
  };
  twoFactorEnabled?: boolean;
  twoFactorMethod?: string | null;
}

// Extended state type with auth
interface ExtendedDemoState extends DemoState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: string | null;
  isExpired: boolean;
  daysRemaining: number | null;
  isReadOnly: boolean;
  // Pay period state (real accounts only)
  activePayPeriod: PayPeriod | null;
  payPeriods: PayPeriod[];
  selectedDate: string | null;
  dailyEntries: DailyEntry[];
  dateNavigation: DateEntriesResponse['navigation'] | null;
  runningTotals: RunningTotals | null;
  employeesForDate: EmployeeForDate[];
  calculationResult: CalculationResult | null;
  payPeriodLoading: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  // Multi-location support
  locations: Array<{ id: string; name: string }>;
  activeLocationId: string | null;
  switchLocation?: (locationId: string) => void;
}

// Internal state that includes demo/real tracking
interface InternalState extends ExtendedDemoState {
  isDemo: boolean;
  locationId: string | null;
}

// Subscription helper functions
function isSubscriptionExpired(status: SubscriptionStatus, trialEndsAt: string | null): boolean {
  if (status === 'SUSPENDED' || status === 'CANCELLED') return true;
  if ((status === 'DEMO' || status === 'TRIAL') && trialEndsAt) {
    return new Date(trialEndsAt).getTime() < Date.now();
  }
  return false;
}

function getDaysRemaining(trialEndsAt: string | null): number | null {
  if (!trialEndsAt) return null;
  const diff = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

interface DemoContextType {
  state: ExtendedDemoState;
  // Auth actions
  handleLoginSuccess: (user: AuthUser) => void;
  handleLogout: () => void;
  // Step navigation
  setCurrentStep: (step: 0 | 1 | 2 | 3) => void;
  // Settings actions
  updateSettings: (settings: Partial<Settings>) => void;
  setContributionMethod: (method: ContributionMethod) => void;
  toggleCategorySelection: (categoryId: string) => void;
  updateJobCategory: (categoryId: string, updates: Partial<JobCategory>) => void;
  addJobCategory: (category: JobCategory) => void;
  removeJobCategory: (categoryId: string) => void;
  addCustomCategory: (name: string) => void;
  // Category-level actions
  updateCategoryWeight: (color: CategoryColor, weight: number) => void;
  updateCategoryName: (color: CategoryColor, name: string) => void;
  moveJobToCategory: (jobId: string, newCategoryColor: CategoryColor) => void;
  addJobToCategory: (name: string, categoryColor: CategoryColor) => void;
  removeJob: (jobId: string) => void;
  // Employee actions
  updateEmployee: (employeeId: string, updates: Partial<Employee>) => void;
  addEmployee: (employee: Employee) => void;
  removeEmployee: (employeeId: string) => void;
  adjustIndividualWeight: (employeeId: string, delta: number) => void;
  reorderEmployees: (orderedIds: string[]) => void;
  // Distribution actions
  calculateDistribution: () => void;
  setPrePaidAmount: (amount: number) => void;
  // Demo actions
  resetToDefaults: () => void;
  resetSettingsToDefaults: () => void;
  resetDistributionToDefaults: () => void;
  setShowWelcomeDialog: (show: boolean) => void;
  setShowHelpLibrary: (show: boolean) => void;
  setPrintIncludeSharePerHour: (include: boolean) => void;
  // Pay period actions (real accounts only)
  loadPayPeriods: () => Promise<void>;
  createNewPayPeriod: (startDate: string, endDate: string) => Promise<void>;
  selectPayPeriod: (periodId: string) => Promise<void>;
  activatePayPeriod: () => Promise<void>;
  archivePayPeriod: () => Promise<void>;
  selectDate: (date: string) => Promise<void>;
  saveDailyEntries: (entries: { employeeId: string; salesCents: number | null }[]) => Promise<void>;
  runCalculation: (employeeHours: EmployeeHours[]) => Promise<void>;
  clearPayPeriodSelection: () => void;
  // Loading state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const DEMO_EMAIL = 'demo@tipsharepro.com';

// Calculate initial projected pool
const calculateProjectedPool = (monthlySales: number, rate: number): number => {
  return (monthlySales / 2) * (rate / 100);
};

const initialProjectedPool = calculateProjectedPool(
  DEFAULT_SETTINGS.estimatedMonthlySales,
  DEFAULT_SETTINGS.contributionRate
);

const initialState: InternalState = {
  // Auth state
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
  // Subscription state
  subscriptionStatus: 'DEMO',
  trialEndsAt: null,
  isExpired: false,
  daysRemaining: null,
  isReadOnly: false,
  // Demo/real tracking
  isDemo: true,
  locationId: null,
  // App state
  currentStep: 0,
  settings: DEFAULT_SETTINGS,
  employees: DEFAULT_EMPLOYEES,
  estimatedMonthlySales: DEFAULT_SETTINGS.estimatedMonthlySales,
  projectedPool: initialProjectedPool,
  distributionResults: [],
  // Demo-specific state
  prePaidAmount: 0,
  netPool: initialProjectedPool,
  showWelcomeDialog: true,
  showHelpLibrary: false,
  printIncludeSharePerHour: false,
  // Pay period state
  activePayPeriod: null,
  payPeriods: [],
  selectedDate: null,
  dailyEntries: [],
  dateNavigation: null,
  runningTotals: null,
  employeesForDate: [],
  calculationResult: null,
  payPeriodLoading: false,
  saveStatus: 'idle' as const,
  // Multi-location
  locations: [],
  activeLocationId: null,
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InternalState>(initialState);

  // Ref to access latest state in async callbacks without stale closures
  const stateRef = useRef(state);
  stateRef.current = state;

  // ============================================================================
  // Data loading from API (real accounts only)
  // ============================================================================

  const loadUserData = useCallback(async () => {
    try {
      const locId = stateRef.current.locationId;
      const [employeesResp, categoriesResp, settingsResp] = await Promise.all([
        getEmployees({ status: 'ACTIVE', locationId: locId || undefined }),
        getJobCategories(),
        apiGetSettings(),
      ]);

      // Map API types to frontend types
      const frontendCategories = categoriesResp.categories.map(mapApiJobCategoryToFrontend);
      const frontendEmployees = employeesResp.employees.map(mapApiEmployeeToFrontend);
      const frontendSettings = mapApiSettingsToFrontend(settingsResp, frontendCategories);

      const projectedPool = calculateProjectedPool(
        frontendSettings.estimatedMonthlySales,
        frontendSettings.contributionRate
      );

      // Load pay periods and locations in parallel (non-blocking)
      let currentPeriod: PayPeriod | null = null;
      let allPeriods: PayPeriod[] = [];
      let locationsList: Array<{ id: string; name: string }> = [];
      try {
        const locationId = stateRef.current.locationId;
        const [periodsResp, current, locationsResp] = await Promise.all([
          apiGetPayPeriods(locationId || undefined),
          apiGetCurrentPayPeriod(locationId || undefined),
          getLocations().catch(() => []),
        ]);
        allPeriods = periodsResp.payPeriods;
        currentPeriod = current;
        locationsList = locationsResp.map((l: { id: string; name: string }) => ({ id: l.id, name: l.name }));
      } catch (err) {
        console.error('Failed to load pay periods:', err);
      }

      setState(prev => ({
        ...prev,
        settings: frontendSettings,
        employees: frontendEmployees,
        estimatedMonthlySales: frontendSettings.estimatedMonthlySales,
        projectedPool,
        prePaidAmount: 0,
        netPool: projectedPool,
        distributionResults: [],
        isLoading: false,
        payPeriods: allPeriods,
        activePayPeriod: currentPeriod,
        locations: locationsList,
        activeLocationId: stateRef.current.locationId || (locationsList.length > 0 ? locationsList[0].id : null),
      }));
    } catch (err) {
      console.error('Failed to load user data:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load your data. Please try refreshing.',
      }));
    }
  }, []);

  // ============================================================================
  // Session restore on mount
  // ============================================================================

  useEffect(() => {
    const restoreSession = async () => {
      const hasToken = checkAuth();
      if (!hasToken) {
        setState(prev => ({ ...prev, isLoading: false, currentStep: 0 }));
        return;
      }

      try {
        const isValid = await validateSession();
        if (!isValid) {
          setState(prev => ({ ...prev, isLoading: false, currentStep: 0 }));
          return;
        }

        const session = await getSession();
        const email = session.user.email;
        const isDemo = email === DEMO_EMAIL;
        const subStatus = (session.organization.subscriptionStatus || 'DEMO') as SubscriptionStatus;
        const trialEnd = session.organization.trialEndsAt || null;

        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: {
            name: session.user.name,
            companyName: session.user.companyName,
            role: session.user.role,
            email,
            locationId: session.user.locationId,
            twoFactorEnabled: session.user.twoFactorEnabled,
            twoFactorMethod: session.user.twoFactorMethod,
          },
          currentStep: 1,
          isDemo,
          locationId: session.user.locationId || null,
          subscriptionStatus: subStatus,
          trialEndsAt: trialEnd,
          isExpired: isSubscriptionExpired(subStatus, trialEnd),
          daysRemaining: getDaysRemaining(trialEnd),
          isReadOnly: isSubscriptionExpired(subStatus, trialEnd),
          // For demo, keep defaults; for real, isLoading stays true until loadUserData finishes
          isLoading: !isDemo,
        }));

        if (!isDemo) {
          // Load real data from API
          await loadUserData();
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch {
        // Session invalid or network error
        clearToken();
        setState(prev => ({ ...prev, isLoading: false, currentStep: 0 }));
      }
    };

    restoreSession();
  }, [loadUserData]);

  // ============================================================================
  // Recalculate distribution when relevant state changes
  // ============================================================================

  useEffect(() => {
    if (state.currentStep > 0 && state.employees.length > 0) {
      const timer = setTimeout(() => {
        calculateDistributionInternal();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [state.currentStep, state.settings, state.employees, state.prePaidAmount]);

  // ============================================================================
  // Auth handlers
  // ============================================================================

  const handleLoginSuccess = useCallback((user: AuthUser) => {
    const isDemo = user.email === DEMO_EMAIL;
    const subStatus = (user.organization?.subscriptionStatus || 'DEMO') as SubscriptionStatus;
    const trialEnd = user.organization?.trialEndsAt || null;

    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      user,
      currentStep: 1,
      isLoading: !isDemo, // Real accounts need to load data
      error: null,
      isDemo,
      locationId: user.locationId || null,
      subscriptionStatus: subStatus,
      trialEndsAt: trialEnd,
      isExpired: isSubscriptionExpired(subStatus, trialEnd),
      daysRemaining: getDaysRemaining(trialEnd),
      isReadOnly: isSubscriptionExpired(subStatus, trialEnd),
      showWelcomeDialog: subStatus !== 'ACTIVE',
    }));

    if (!isDemo) {
      // Load real data from API
      loadUserData();
    }
  }, [loadUserData]);

  const handleLogout = useCallback(() => {
    clearToken();
    setState({
      ...initialState,
      isLoading: false,
    });
  }, []);

  const setCurrentStep = useCallback((step: 0 | 1 | 2 | 3) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  // ============================================================================
  // Settings mutations (with background API sync for real accounts)
  // ============================================================================

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    if (isSubscriptionExpired(stateRef.current.subscriptionStatus, stateRef.current.trialEndsAt)) return;
    setState(prev => {
      const newSettings = { ...prev.settings, ...updates };
      const monthlySales = newSettings.estimatedMonthlySales || prev.settings.estimatedMonthlySales;
      const projectedPool = calculateProjectedPool(monthlySales, newSettings.contributionRate);
      const netPool = projectedPool - prev.prePaidAmount;
      return {
        ...prev,
        settings: newSettings,
        projectedPool,
        netPool,
        estimatedMonthlySales: monthlySales,
      };
    });

    // Background sync for real accounts
    if (!stateRef.current.isDemo) {
      const apiUpdates = mapFrontendSettingsToUpdateRequest(updates);
      if (Object.keys(apiUpdates).length > 0) {
        apiUpdateSettings(apiUpdates).catch(err =>
          console.error('Failed to sync settings:', err)
        );
      }
    }
  }, []);

  const setContributionMethod = useCallback((method: ContributionMethod) => {
    if (isSubscriptionExpired(stateRef.current.subscriptionStatus, stateRef.current.trialEndsAt)) return;
    setState(prev => {
      const oldMethod = prev.settings.contributionMethod;
      const wasSalesBased = isSalesBasedMethod(oldMethod);
      const isSalesBased = isSalesBasedMethod(method);

      const defaultRate = getDefaultRateForMethod(method);

      let newAmount = prev.settings.estimatedMonthlySales;
      if (wasSalesBased !== isSalesBased) {
        newAmount = getDefaultAmountForMethod(method);
      }

      const newSettings = {
        ...prev.settings,
        contributionMethod: method,
        contributionRate: defaultRate,
        estimatedMonthlySales: newAmount,
      };
      const projectedPool = calculateProjectedPool(newAmount, defaultRate);
      const netPool = projectedPool - prev.prePaidAmount;
      return {
        ...prev,
        settings: newSettings,
        projectedPool,
        netPool,
        estimatedMonthlySales: newAmount,
      };
    });

    // Background sync for real accounts
    if (!stateRef.current.isDemo) {
      const defaultRate = getDefaultRateForMethod(method);
      const oldMethod = stateRef.current.settings.contributionMethod;
      const wasSalesBased = isSalesBasedMethod(oldMethod);
      const isSalesBased = isSalesBasedMethod(method);
      let newAmount = stateRef.current.settings.estimatedMonthlySales;
      if (wasSalesBased !== isSalesBased) {
        newAmount = getDefaultAmountForMethod(method);
      }

      apiUpdateSettings({
        contributionMethod: method,
        contributionRate: defaultRate,
        estimatedMonthlySales: newAmount,
      }).catch(err => console.error('Failed to sync contribution method:', err));
    }
  }, []);

  // ============================================================================
  // Category selection & custom categories (local-only, no API sync needed)
  // ============================================================================

  const toggleCategorySelection = useCallback((categoryId: string) => {
    setState(prev => {
      const isSelected = prev.settings.selectedCategories.includes(categoryId);
      let newSelectedCategories: string[];
      let newJobCategories = [...prev.settings.jobCategories];

      if (isSelected) {
        newSelectedCategories = prev.settings.selectedCategories.filter(id => id !== categoryId);
        newJobCategories = newJobCategories.filter(cat => cat.id !== categoryId);
      } else {
        newSelectedCategories = [...prev.settings.selectedCategories, categoryId];
        if (!newJobCategories.find(cat => cat.id === categoryId)) {
          const predefined = ALL_PREDEFINED_CATEGORIES.find(cat => cat.id === categoryId);
          if (predefined) {
            newJobCategories.push(predefined);
          }
        }
      }

      return {
        ...prev,
        settings: {
          ...prev.settings,
          selectedCategories: newSelectedCategories,
          jobCategories: newJobCategories,
        },
      };
    });
  }, []);

  const addCustomCategory = useCallback((name: string) => {
    if (!name.trim()) return;

    setState(prev => {
      const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      const newCategory: JobCategory = {
        id,
        name: name.trim(),
        variableWeight: 3,
        categoryColor: 'custom',
        group: 'custom',
      };

      return {
        ...prev,
        settings: {
          ...prev.settings,
          selectedCategories: [...prev.settings.selectedCategories, id],
          jobCategories: [...prev.settings.jobCategories, newCategory],
        },
      };
    });
  }, []);

  // ============================================================================
  // Category weight & name mutations (with background API sync)
  // ============================================================================

  const updateCategoryWeight = useCallback((color: CategoryColor, weight: number) => {
    setState(prev => {
      const newCategoryWeights = { ...prev.settings.categoryWeights, [color]: weight };
      const newJobCategories = prev.settings.jobCategories.map(job =>
        job.categoryColor === color
          ? { ...job, variableWeight: weight as VariableWeight }
          : job
      );
      return {
        ...prev,
        settings: {
          ...prev.settings,
          categoryWeights: newCategoryWeights,
          jobCategories: newJobCategories,
        },
      };
    });

    // Background sync: update weight for all jobs in this category
    if (!stateRef.current.isDemo) {
      const jobsInCategory = stateRef.current.settings.jobCategories.filter(
        j => j.categoryColor === color
      );
      for (const job of jobsInCategory) {
        apiUpdateJobCategory(job.id, { weight }).catch(err =>
          console.error(`Failed to sync weight for job ${job.id}:`, err)
        );
      }
    }
  }, []);

  const updateCategoryName = useCallback((color: CategoryColor, name: string) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        categoryNames: { ...prev.settings.categoryNames, [color]: name },
      },
    }));
  }, []);

  // ============================================================================
  // Job mutations (with background API sync)
  // ============================================================================

  const moveJobToCategory = useCallback((jobId: string, newCategoryColor: CategoryColor) => {
    setState(prev => {
      const newWeight = prev.settings.categoryWeights[newCategoryColor] || 1;
      const groupMap: Record<CategoryColor, string> = {
        boh: 'kitchen', foh: 'frontOfHouse', bar: 'bar', support: 'support', custom: 'custom',
      };
      const newJobCategories = prev.settings.jobCategories.map(job =>
        job.id === jobId
          ? { ...job, categoryColor: newCategoryColor, variableWeight: newWeight as VariableWeight, group: groupMap[newCategoryColor] as JobCategory['group'] }
          : job
      );
      return {
        ...prev,
        settings: { ...prev.settings, jobCategories: newJobCategories },
      };
    });

    // Background sync
    if (!stateRef.current.isDemo) {
      const newWeight = stateRef.current.settings.categoryWeights[newCategoryColor] || 1;
      apiUpdateJobCategory(jobId, {
        weight: newWeight,
        badgeColor: categoryColorToHex(newCategoryColor),
      }).catch(err => console.error(`Failed to sync job move for ${jobId}:`, err));
    }
  }, []);

  const addJobToCategory = useCallback((name: string, categoryColor: CategoryColor) => {
    if (!name.trim()) return;
    if (isSubscriptionExpired(stateRef.current.subscriptionStatus, stateRef.current.trialEndsAt)) return;

    const isDemo = stateRef.current.isDemo;

    if (isDemo) {
      // Demo mode: local-only with timestamp ID
      setState(prev => {
        const id = name.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        const weight = prev.settings.categoryWeights[categoryColor] || 1;
        const groupMap: Record<CategoryColor, string> = {
          boh: 'kitchen', foh: 'frontOfHouse', bar: 'bar', support: 'support', custom: 'custom',
        };
        const newJob: JobCategory = {
          id,
          name: name.trim(),
          variableWeight: weight as VariableWeight,
          categoryColor,
          group: groupMap[categoryColor] as JobCategory['group'],
        };
        return {
          ...prev,
          settings: {
            ...prev.settings,
            jobCategories: [...prev.settings.jobCategories, newJob],
            selectedCategories: [...prev.settings.selectedCategories, id],
          },
        };
      });
    } else {
      // Real account: create via API, then update state with real ID
      const weight = stateRef.current.settings.categoryWeights[categoryColor] || 1;
      const tempId = name.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      const groupMap: Record<CategoryColor, string> = {
        boh: 'kitchen', foh: 'frontOfHouse', bar: 'bar', support: 'support', custom: 'custom',
      };

      // Optimistic local update with temp ID
      setState(prev => {
        const newJob: JobCategory = {
          id: tempId,
          name: name.trim(),
          variableWeight: weight as VariableWeight,
          categoryColor,
          group: groupMap[categoryColor] as JobCategory['group'],
        };
        return {
          ...prev,
          settings: {
            ...prev.settings,
            jobCategories: [...prev.settings.jobCategories, newJob],
            selectedCategories: [...prev.settings.selectedCategories, tempId],
          },
        };
      });

      // Create via API and replace temp ID with real ID
      apiCreateJobCategory({
        name: name.trim(),
        weight,
        badgeColor: categoryColorToHex(categoryColor),
      }).then(created => {
        const frontendCat = mapApiJobCategoryToFrontend(created);
        setState(prev => ({
          ...prev,
          settings: {
            ...prev.settings,
            jobCategories: prev.settings.jobCategories.map(j =>
              j.id === tempId ? { ...frontendCat } : j
            ),
            selectedCategories: prev.settings.selectedCategories.map(id =>
              id === tempId ? frontendCat.id : id
            ),
          },
        }));
      }).catch(err => {
        console.error('Failed to create job category:', err);
        // Rollback optimistic update
        setState(prev => ({
          ...prev,
          settings: {
            ...prev.settings,
            jobCategories: prev.settings.jobCategories.filter(j => j.id !== tempId),
            selectedCategories: prev.settings.selectedCategories.filter(id => id !== tempId),
          },
        }));
      });
    }
  }, []);

  const removeJob = useCallback((jobId: string) => {
    if (isSubscriptionExpired(stateRef.current.subscriptionStatus, stateRef.current.trialEndsAt)) return;
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        jobCategories: prev.settings.jobCategories.filter(j => j.id !== jobId),
        selectedCategories: prev.settings.selectedCategories.filter(id => id !== jobId),
      },
    }));

    // Background sync
    if (!stateRef.current.isDemo) {
      apiDeleteJobCategory(jobId).catch(err =>
        console.error(`Failed to delete job category ${jobId}:`, err)
      );
    }
  }, []);

  const updateJobCategory = useCallback((categoryId: string, updates: Partial<JobCategory>) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        jobCategories: prev.settings.jobCategories.map(cat =>
          cat.id === categoryId ? { ...cat, ...updates } : cat
        ),
      },
    }));
  }, []);

  const addJobCategory = useCallback((category: JobCategory) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        jobCategories: [...prev.settings.jobCategories, category],
      },
    }));
  }, []);

  const removeJobCategory = useCallback((categoryId: string) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        jobCategories: prev.settings.jobCategories.filter(cat => cat.id !== categoryId),
      },
    }));

    // Background sync
    if (!stateRef.current.isDemo) {
      apiDeleteJobCategory(categoryId).catch(err =>
        console.error(`Failed to delete job category ${categoryId}:`, err)
      );
    }
  }, []);

  // ============================================================================
  // Employee mutations (with background API sync)
  // ============================================================================

  const updateEmployee = useCallback((employeeId: string, updates: Partial<Employee>) => {
    if (isSubscriptionExpired(stateRef.current.subscriptionStatus, stateRef.current.trialEndsAt)) return;
    setState(prev => ({
      ...prev,
      employees: prev.employees.map(emp =>
        emp.id === employeeId ? { ...emp, ...updates } : emp
      ),
    }));

    // Background sync for persistent fields only
    if (!stateRef.current.isDemo) {
      const apiUpdates: Record<string, unknown> = {};
      if (updates.hourlyRate !== undefined) {
        apiUpdates.hourlyRateCents = dollarsToCents(updates.hourlyRate);
      }
      if (updates.jobCategoryId !== undefined) {
        apiUpdates.jobCategoryId = updates.jobCategoryId;
      }
      if (Object.keys(apiUpdates).length > 0) {
        apiUpdateEmployee(employeeId, apiUpdates as { hourlyRateCents?: number; jobCategoryId?: string }).catch(err =>
          console.error(`Failed to sync employee ${employeeId}:`, err)
        );
      }
    }
  }, []);

  const addEmployee = useCallback((employee: Employee) => {
    if (isSubscriptionExpired(stateRef.current.subscriptionStatus, stateRef.current.trialEndsAt)) return;
    const isDemo = stateRef.current.isDemo;

    if (isDemo) {
      setState(prev => ({
        ...prev,
        employees: [...prev.employees, employee],
      }));
    } else {
      // Optimistic local update
      setState(prev => ({
        ...prev,
        employees: [...prev.employees, employee],
      }));

      const locationId = stateRef.current.locationId;
      if (!locationId) {
        console.error('Cannot create employee: no locationId');
        return;
      }

      // Create via API and replace temp ID with real ID
      apiCreateEmployee({
        name: employee.name,
        locationId,
        jobCategoryId: employee.jobCategoryId,
        hourlyRateCents: dollarsToCents(employee.hourlyRate),
      }).then(created => {
        const frontendEmp = mapApiEmployeeToFrontend(created);
        setState(prev => ({
          ...prev,
          employees: prev.employees.map(emp =>
            emp.id === employee.id
              ? { ...frontendEmp, hoursWorked: employee.hoursWorked, weightAdjustment: employee.weightAdjustment || 0 }
              : emp
          ),
        }));
      }).catch(err => {
        console.error('Failed to create employee:', err);
        // Rollback and show error
        setState(prev => ({
          ...prev,
          employees: prev.employees.filter(emp => emp.id !== employee.id),
          error: `Failed to save employee "${employee.name}". Please try again.`,
        }));
      });
    }
  }, []);

  const removeEmployee = useCallback((employeeId: string) => {
    if (isSubscriptionExpired(stateRef.current.subscriptionStatus, stateRef.current.trialEndsAt)) return;
    setState(prev => ({
      ...prev,
      employees: prev.employees.filter(emp => emp.id !== employeeId),
    }));

    // Background sync: soft-delete via API
    if (!stateRef.current.isDemo) {
      apiDeleteEmployee(employeeId).catch(err =>
        console.error(`Failed to delete employee ${employeeId}:`, err)
      );
    }
  }, []);

  // Adjust individual employee weight by delta (±0.25 increments, max +0.75 above base, never below base)
  const adjustIndividualWeight = useCallback((employeeId: string, delta: number) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.map(emp => {
        if (emp.id !== employeeId) return emp;

        const currentAdjustment = emp.weightAdjustment || 0;
        const newAdjustment = currentAdjustment + delta;

        // Clamp: can only go UP from base (0 to +0.75), never below base
        const clampedAdjustment = Math.max(0, Math.min(0.75, newAdjustment));

        return { ...emp, weightAdjustment: clampedAdjustment };
      }),
    }));
  }, []);

  // Reorder employees: accepts a new ordered list of employee IDs and assigns sortOrder
  const reorderEmployees = useCallback((orderedIds: string[]) => {
    setState(prev => {
      const idToOrder = new Map(orderedIds.map((id, i) => [id, i]));
      const updated = prev.employees.map(emp => ({
        ...emp,
        sortOrder: idToOrder.get(emp.id) ?? emp.sortOrder ?? 0,
      }));
      return { ...prev, employees: updated };
    });
  }, []);

  // ============================================================================
  // Distribution & pre-paid (always local-only)
  // ============================================================================

  const setPrePaidAmount = useCallback((amount: number) => {
    if (isSubscriptionExpired(stateRef.current.subscriptionStatus, stateRef.current.trialEndsAt)) return;
    setState(prev => ({
      ...prev,
      prePaidAmount: amount,
      netPool: prev.projectedPool - amount,
    }));
  }, []);

  // ============================================================================
  // Reset functions (demo = defaults, real = re-fetch from API)
  // ============================================================================

  const resetToDefaults = useCallback(() => {
    if (stateRef.current.isDemo) {
      setState(prev => {
        const projectedPool = calculateProjectedPool(
          DEFAULT_SETTINGS.estimatedMonthlySales,
          DEFAULT_SETTINGS.contributionRate
        );
        return {
          ...prev,
          settings: DEFAULT_SETTINGS,
          employees: DEFAULT_EMPLOYEES.map(emp => ({ ...emp, weightAdjustment: 0 })),
          estimatedMonthlySales: DEFAULT_SETTINGS.estimatedMonthlySales,
          projectedPool,
          prePaidAmount: 0,
          netPool: projectedPool,
          distributionResults: [],
        };
      });
    } else {
      setState(prev => ({ ...prev, isLoading: true }));
      loadUserData();
    }
  }, [loadUserData]);

  const resetSettingsToDefaults = useCallback(() => {
    if (stateRef.current.isDemo) {
      setState(prev => {
        const projectedPool = calculateProjectedPool(
          DEFAULT_SETTINGS.estimatedMonthlySales,
          DEFAULT_SETTINGS.contributionRate
        );
        const netPool = projectedPool - prev.prePaidAmount;
        return {
          ...prev,
          settings: DEFAULT_SETTINGS,
          estimatedMonthlySales: DEFAULT_SETTINGS.estimatedMonthlySales,
          projectedPool,
          netPool,
        };
      });
    } else {
      setState(prev => ({ ...prev, isLoading: true }));
      loadUserData();
    }
  }, [loadUserData]);

  const resetDistributionToDefaults = useCallback(() => {
    if (stateRef.current.isDemo) {
      setState(prev => ({
        ...prev,
        employees: DEFAULT_EMPLOYEES.map(emp => ({ ...emp, weightAdjustment: 0 })),
        prePaidAmount: 0,
        netPool: prev.projectedPool,
        distributionResults: [],
      }));
    } else {
      // For real accounts, re-fetch employees from API (resets hours/weights to 0)
      setState(prev => ({ ...prev, isLoading: true }));
      loadUserData();
    }
  }, [loadUserData]);

  // ============================================================================
  // UI state toggles (always local-only)
  // ============================================================================

  const setShowWelcomeDialog = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showWelcomeDialog: show }));
  }, []);

  const setShowHelpLibrary = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showHelpLibrary: show }));
  }, []);

  const setPrintIncludeSharePerHour = useCallback((include: boolean) => {
    setState(prev => ({ ...prev, printIncludeSharePerHour: include }));
  }, []);

  // ============================================================================
  // Pay Period actions (real accounts only)
  // ============================================================================

  const loadPayPeriods = useCallback(async () => {
    if (stateRef.current.isDemo) return;
    const locationId = stateRef.current.locationId;
    try {
      setState(prev => ({ ...prev, payPeriodLoading: true }));
      const [periodsResp, current] = await Promise.all([
        apiGetPayPeriods(locationId || undefined),
        apiGetCurrentPayPeriod(locationId || undefined),
      ]);
      setState(prev => ({
        ...prev,
        payPeriods: periodsResp.payPeriods,
        activePayPeriod: current,
        payPeriodLoading: false,
      }));
    } catch (err) {
      console.error('Failed to load pay periods:', err);
      setState(prev => ({ ...prev, payPeriodLoading: false }));
    }
  }, []);

  const createNewPayPeriod = useCallback(async (startDate: string, endDate: string) => {
    if (stateRef.current.isDemo) return;
    const locationId = stateRef.current.locationId;
    if (!locationId) return;
    try {
      setState(prev => ({ ...prev, payPeriodLoading: true }));
      const created = await apiCreatePayPeriod({ locationId, startDate, endDate });
      setState(prev => ({
        ...prev,
        activePayPeriod: created,
        payPeriods: [created, ...prev.payPeriods],
        payPeriodLoading: false,
        selectedDate: null,
        dailyEntries: [],
        dateNavigation: null,
        runningTotals: null,
        employeesForDate: [],
        calculationResult: null,
      }));
    } catch (err) {
      console.error('Failed to create pay period:', err);
      setState(prev => ({ ...prev, payPeriodLoading: false, error: 'Failed to create pay period.' }));
    }
  }, []);

  const selectPayPeriod = useCallback(async (periodId: string) => {
    if (stateRef.current.isDemo) return;
    try {
      setState(prev => ({ ...prev, payPeriodLoading: true }));
      const found = stateRef.current.payPeriods.find(p => p.id === periodId);
      if (!found) {
        setState(prev => ({ ...prev, payPeriodLoading: false }));
        return;
      }
      // If archived, load stored distribution
      let calcResult: CalculationResult | null = null;
      if (found.status === 'ARCHIVED') {
        calcResult = await apiGetDistribution(periodId);
      }
      setState(prev => ({
        ...prev,
        activePayPeriod: found,
        payPeriodLoading: false,
        selectedDate: null,
        dailyEntries: [],
        dateNavigation: null,
        runningTotals: null,
        employeesForDate: [],
        calculationResult: calcResult,
      }));
    } catch (err) {
      console.error('Failed to select pay period:', err);
      setState(prev => ({ ...prev, payPeriodLoading: false }));
    }
  }, []);

  const activatePayPeriod = useCallback(async () => {
    if (stateRef.current.isDemo || !stateRef.current.activePayPeriod) return;
    const periodId = stateRef.current.activePayPeriod.id;
    try {
      const updated = await apiUpdatePayPeriod(periodId, { status: 'ACTIVE' });
      setState(prev => ({
        ...prev,
        activePayPeriod: updated,
        payPeriods: prev.payPeriods.map(p => p.id === periodId ? updated : p),
      }));
    } catch (err) {
      console.error('Failed to activate pay period:', err);
    }
  }, []);

  const archivePayPeriod = useCallback(async () => {
    if (stateRef.current.isDemo || !stateRef.current.activePayPeriod) return;
    const periodId = stateRef.current.activePayPeriod.id;
    try {
      const updated = await apiUpdatePayPeriod(periodId, { status: 'ARCHIVED' });
      setState(prev => ({
        ...prev,
        activePayPeriod: updated,
        payPeriods: prev.payPeriods.map(p => p.id === periodId ? updated : p),
      }));
    } catch (err) {
      console.error('Failed to archive pay period:', err);
    }
  }, []);

  const selectDate = useCallback(async (date: string) => {
    if (stateRef.current.isDemo || !stateRef.current.activePayPeriod) return;
    const periodId = stateRef.current.activePayPeriod.id;
    try {
      setState(prev => ({ ...prev, payPeriodLoading: true, selectedDate: date }));
      const [dateResp, empsResp] = await Promise.all([
        apiGetEntriesForDate(periodId, date),
        apiGetEmployeesForDate(periodId, date),
      ]);
      setState(prev => ({
        ...prev,
        dailyEntries: dateResp.entries,
        dateNavigation: dateResp.navigation,
        runningTotals: dateResp.runningTotals,
        employeesForDate: empsResp.employees,
        payPeriodLoading: false,
      }));
    } catch (err) {
      console.error('Failed to load date entries:', err);
      setState(prev => ({ ...prev, payPeriodLoading: false }));
    }
  }, []);

  const saveDailyEntries = useCallback(async (entries: { employeeId: string; salesCents: number | null }[]) => {
    if (stateRef.current.isDemo || !stateRef.current.activePayPeriod || !stateRef.current.selectedDate) return;
    const periodId = stateRef.current.activePayPeriod.id;
    const date = stateRef.current.selectedDate;
    try {
      setState(prev => ({ ...prev, saveStatus: 'saving' }));
      const result = await apiBulkUpsertEntries(periodId, date, entries);
      setState(prev => ({
        ...prev,
        dailyEntries: result.entries,
        runningTotals: result.runningTotals,
        saveStatus: 'saved',
      }));
      // Reset save status after 2s
      setTimeout(() => {
        setState(prev => prev.saveStatus === 'saved' ? { ...prev, saveStatus: 'idle' } : prev);
      }, 2000);
    } catch (err) {
      console.error('Failed to save entries:', err);
      setState(prev => ({ ...prev, saveStatus: 'error' }));
    }
  }, []);

  const runCalculation = useCallback(async (employeeHours: EmployeeHours[]) => {
    if (stateRef.current.isDemo || !stateRef.current.activePayPeriod) return;
    const periodId = stateRef.current.activePayPeriod.id;
    try {
      setState(prev => ({ ...prev, payPeriodLoading: true }));
      const result = await apiCalculateDistribution(periodId, employeeHours);
      setState(prev => ({
        ...prev,
        calculationResult: result,
        payPeriodLoading: false,
      }));
    } catch (err) {
      console.error('Failed to run calculation:', err);
      setState(prev => ({ ...prev, payPeriodLoading: false, error: 'Calculation failed.' }));
    }
  }, []);

  const clearPayPeriodSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      activePayPeriod: null,
      selectedDate: null,
      dailyEntries: [],
      dateNavigation: null,
      runningTotals: null,
      employeesForDate: [],
      calculationResult: null,
    }));
  }, []);

  // ============================================================================
  // Distribution calculation (always local-only)
  // ============================================================================

  const calculateDistributionInternal = () => {
    setState(prev => {
      const { employees, settings, netPool } = prev;

      const activeEmployees = employees.filter(emp => emp.hoursWorked > 0);

      if (activeEmployees.length === 0) {
        return { ...prev, distributionResults: [] };
      }

      const employeesWithBasis = activeEmployees.map(emp => {
        const category = settings.jobCategories.find(cat => cat.id === emp.jobCategoryId);
        const categoryColor = category?.categoryColor || 'support';
        const baseWeight = settings.categoryWeights?.[categoryColor] ?? category?.variableWeight ?? 2;
        const weightAdjustment = emp.weightAdjustment || 0;
        const effectiveWeight = baseWeight + weightAdjustment;
        const basis = emp.hoursWorked * emp.hourlyRate * effectiveWeight;

        return {
          ...emp,
          basis,
          baseWeight,
          weightAdjustment,
          effectiveWeight,
          categoryName: category?.name || 'Unknown',
          categoryColor: category?.categoryColor || 'support' as CategoryColor,
        };
      });

      const totalBasis = employeesWithBasis.reduce((sum, emp) => sum + emp.basis, 0);

      const results: DistributionResult[] = employeesWithBasis.map(emp => {
        const sharePercentage = totalBasis > 0 ? (emp.basis / totalBasis) * 100 : 0;
        const shareAmount = netPool * (sharePercentage / 100);
        const dollarsPerHour = emp.hoursWorked > 0 ? shareAmount / emp.hoursWorked : 0;

        return {
          employeeId: emp.id,
          employeeName: emp.name,
          jobCategory: emp.categoryName,
          categoryColor: emp.categoryColor,
          hoursWorked: emp.hoursWorked,
          hourlyRate: emp.hourlyRate,
          variableWeight: emp.baseWeight as VariableWeight,
          weightAdjustment: emp.weightAdjustment,
          effectiveWeight: emp.effectiveWeight,
          sharePercentage,
          shareAmount,
          receivedAmount: shareAmount,
          dollarsPerHour,
        };
      });

      const adjustedResults = adjustReceivedAmounts(results, netPool);

      return { ...prev, distributionResults: adjustedResults };
    });
  };

  const calculateDistribution = useCallback(() => {
    calculateDistributionInternal();
  }, []);

  // ============================================================================
  // Context value — expose ExtendedDemoState (not InternalState) to consumers
  // ============================================================================

  const exposedState: ExtendedDemoState = {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    subscriptionStatus: state.subscriptionStatus,
    trialEndsAt: state.trialEndsAt,
    isExpired: isSubscriptionExpired(state.subscriptionStatus, state.trialEndsAt),
    daysRemaining: getDaysRemaining(state.trialEndsAt),
    isReadOnly: isSubscriptionExpired(state.subscriptionStatus, state.trialEndsAt),
    currentStep: state.currentStep,
    settings: state.settings,
    employees: state.employees,
    estimatedMonthlySales: state.estimatedMonthlySales,
    projectedPool: state.projectedPool,
    distributionResults: state.distributionResults,
    prePaidAmount: state.prePaidAmount,
    netPool: state.netPool,
    showWelcomeDialog: state.showWelcomeDialog,
    showHelpLibrary: state.showHelpLibrary,
    printIncludeSharePerHour: state.printIncludeSharePerHour,
    // Pay period state
    activePayPeriod: state.activePayPeriod,
    payPeriods: state.payPeriods,
    selectedDate: state.selectedDate,
    dailyEntries: state.dailyEntries,
    dateNavigation: state.dateNavigation,
    runningTotals: state.runningTotals,
    employeesForDate: state.employeesForDate,
    calculationResult: state.calculationResult,
    payPeriodLoading: state.payPeriodLoading,
    saveStatus: state.saveStatus,
    // Multi-location
    locations: state.locations,
    activeLocationId: state.activeLocationId,
    switchLocation: (locationId: string) => {
      setState(prev => ({ ...prev, activeLocationId: locationId, locationId }));
      // Reload data for new location
      loadUserData();
    },
  };

  return (
    <DemoContext.Provider
      value={{
        state: exposedState,
        // Auth
        handleLoginSuccess,
        handleLogout,
        // Navigation
        setCurrentStep,
        // Settings
        updateSettings,
        setContributionMethod,
        toggleCategorySelection,
        updateJobCategory,
        addJobCategory,
        removeJobCategory,
        addCustomCategory,
        // Category-level
        updateCategoryWeight,
        updateCategoryName,
        moveJobToCategory,
        addJobToCategory,
        removeJob,
        // Employees
        updateEmployee,
        addEmployee,
        removeEmployee,
        adjustIndividualWeight,
        reorderEmployees,
        // Distribution
        calculateDistribution,
        setPrePaidAmount,
        // Pay periods
        loadPayPeriods,
        createNewPayPeriod,
        selectPayPeriod,
        activatePayPeriod,
        archivePayPeriod,
        selectDate,
        saveDailyEntries,
        runCalculation,
        clearPayPeriodSelection,
        // Demo
        resetToDefaults,
        resetSettingsToDefaults,
        resetDistributionToDefaults,
        setShowWelcomeDialog,
        setShowHelpLibrary,
        setPrintIncludeSharePerHour,
        // Loading/Error
        setLoading,
        setError,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

// Helper function to adjust received amounts so they sum exactly to the pool total
function adjustReceivedAmounts(results: DistributionResult[], totalPool: number): DistributionResult[] {
  const rounded = results.map((r, index) => ({
    ...r,
    receivedAmount: Math.round(r.shareAmount),
    dollarsPerHour: r.hoursWorked > 0 ? Math.round(r.shareAmount) / r.hoursWorked : 0,
    _originalIndex: index,
  }));

  const totalRounded = rounded.reduce((sum, r) => sum + r.receivedAmount, 0);
  let diff = Math.round(totalPool) - totalRounded;

  if (diff !== 0) {
    const withError = rounded.map(r => ({
      ...r,
      error: r.shareAmount - r.receivedAmount,
    }));

    if (diff > 0) {
      withError.sort((a, b) => b.error - a.error);
    } else {
      withError.sort((a, b) => a.error - b.error);
    }

    let i = 0;
    while (diff !== 0 && i < withError.length) {
      const adjustment = diff > 0 ? 1 : -1;
      withError[i].receivedAmount += adjustment;
      withError[i].dollarsPerHour = withError[i].hoursWorked > 0
        ? withError[i].receivedAmount / withError[i].hoursWorked
        : 0;
      diff -= adjustment;
      i++;
    }

    withError.sort((a, b) => a._originalIndex - b._originalIndex);
    return withError.map(({ error, _originalIndex, ...r }) => r);
  }

  return rounded.map(({ _originalIndex, ...r }) => r);
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
