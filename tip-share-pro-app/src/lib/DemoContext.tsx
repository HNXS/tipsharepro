'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
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
import { isAuthenticated as checkAuth, clearToken } from './api';

// Auth user type
export interface AuthUser {
  name: string;
  companyName: string;
  role: string;
}

// Extended state type with auth
interface ExtendedDemoState extends DemoState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
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
  setPrintIncludeSharePerHour: (include: boolean) => void;
  // Loading state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Calculate initial projected pool
const calculateProjectedPool = (monthlySales: number, rate: number): number => {
  return (monthlySales / 2) * (rate / 100);
};

const initialProjectedPool = calculateProjectedPool(
  DEFAULT_SETTINGS.estimatedMonthlySales,
  DEFAULT_SETTINGS.contributionRate
);

const initialState: ExtendedDemoState = {
  // Auth state
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
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
  printIncludeSharePerHour: false,
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ExtendedDemoState>(initialState);

  // Check for existing session on mount
  useEffect(() => {
    const hasToken = checkAuth();
    setState(prev => ({
      ...prev,
      isLoading: false,
      currentStep: hasToken ? 1 : 0,
    }));
  }, []);

  // Recalculate distribution when relevant state changes
  useEffect(() => {
    if (state.currentStep > 0 && state.employees.length > 0) {
      // Auto-calculate distribution when settings or employees change
      const timer = setTimeout(() => {
        calculateDistributionInternal();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [state.currentStep, state.settings, state.employees, state.prePaidAmount]);

  // Auth handlers
  const handleLoginSuccess = useCallback((user: AuthUser) => {
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      user,
      currentStep: 1,
      isLoading: false,
      error: null,
      showWelcomeDialog: true, // Show welcome dialog on login
    }));
  }, []);

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

  const updateSettings = useCallback((updates: Partial<Settings>) => {
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
  }, []);

  const setContributionMethod = useCallback((method: ContributionMethod) => {
    setState(prev => {
      const oldMethod = prev.settings.contributionMethod;
      const waseSalesBased = isSalesBasedMethod(oldMethod);
      const isSalesBased = isSalesBasedMethod(method);

      const defaultRate = getDefaultRateForMethod(method);

      // If switching between sales-based and tips-based, update the amount
      let newAmount = prev.settings.estimatedMonthlySales;
      if (waseSalesBased !== isSalesBased) {
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
  }, []);

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

  // Update a category's weight and sync all jobs in that category
  const updateCategoryWeight = useCallback((color: CategoryColor, weight: number) => {
    setState(prev => {
      const newCategoryWeights = { ...prev.settings.categoryWeights, [color]: weight };
      // Update all jobs in this category to use the new weight
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
  }, []);

  // Update a category's display name
  const updateCategoryName = useCallback((color: CategoryColor, name: string) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        categoryNames: { ...prev.settings.categoryNames, [color]: name },
      },
    }));
  }, []);

  // Move a job from one category to another
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
  }, []);

  // Add a new job to a specific category
  const addJobToCategory = useCallback((name: string, categoryColor: CategoryColor) => {
    if (!name.trim()) return;
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
  }, []);

  // Remove a job
  const removeJob = useCallback((jobId: string) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        jobCategories: prev.settings.jobCategories.filter(j => j.id !== jobId),
        selectedCategories: prev.settings.selectedCategories.filter(id => id !== jobId),
      },
    }));
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
  }, []);

  const updateEmployee = useCallback((employeeId: string, updates: Partial<Employee>) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.map(emp =>
        emp.id === employeeId ? { ...emp, ...updates } : emp
      ),
    }));
  }, []);

  const addEmployee = useCallback((employee: Employee) => {
    setState(prev => ({
      ...prev,
      employees: [...prev.employees, employee],
    }));
  }, []);

  const removeEmployee = useCallback((employeeId: string) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.filter(emp => emp.id !== employeeId),
    }));
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

  // Set pre-paid amount and recalculate net pool
  const setPrePaidAmount = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      prePaidAmount: amount,
      netPool: prev.projectedPool - amount,
    }));
  }, []);

  // Reset everything to default demo values
  const resetToDefaults = useCallback(() => {
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
  }, []);

  // Reset only settings to defaults (keeps distribution table employees)
  const resetSettingsToDefaults = useCallback(() => {
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
  }, []);

  // Reset only distribution table to defaults (keeps settings)
  const resetDistributionToDefaults = useCallback(() => {
    setState(prev => ({
      ...prev,
      employees: DEFAULT_EMPLOYEES.map(emp => ({ ...emp, weightAdjustment: 0 })),
      prePaidAmount: 0,
      netPool: prev.projectedPool,
      distributionResults: [],
    }));
  }, []);

  // Show/hide welcome dialog
  const setShowWelcomeDialog = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showWelcomeDialog: show }));
  }, []);

  // Toggle print option for $/Hr column
  const setPrintIncludeSharePerHour = useCallback((include: boolean) => {
    setState(prev => ({ ...prev, printIncludeSharePerHour: include }));
  }, []);

  // Internal calculate distribution function (called by effect)
  const calculateDistributionInternal = () => {
    setState(prev => {
      const { employees, settings, netPool } = prev;

      // Filter employees with hours > 0
      const activeEmployees = employees.filter(emp => emp.hoursWorked > 0);

      if (activeEmployees.length === 0) {
        return { ...prev, distributionResults: [] };
      }

      // Calculate basis for each employee (HIDDEN from users!)
      // Basis = Hours × Rate × (Category Weight + Individual Adjustment)
      const employeesWithBasis = activeEmployees.map(emp => {
        const category = settings.jobCategories.find(cat => cat.id === emp.jobCategoryId);
        // Use category-level weight from categoryWeights map
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

      // Calculate total basis
      const totalBasis = employeesWithBasis.reduce((sum, emp) => sum + emp.basis, 0);

      // Calculate share percentage and amount for each employee
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

      // Adjust received amounts to match pool exactly
      const adjustedResults = adjustReceivedAmounts(results, netPool);

      return { ...prev, distributionResults: adjustedResults };
    });
  };

  // Public calculate distribution (explicit call)
  const calculateDistribution = useCallback(() => {
    calculateDistributionInternal();
  }, []);

  return (
    <DemoContext.Provider
      value={{
        state,
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
        // Demo
        resetToDefaults,
        resetSettingsToDefaults,
        resetDistributionToDefaults,
        setShowWelcomeDialog,
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
  // Round each share to whole dollars, preserving original order
  const rounded = results.map((r, index) => ({
    ...r,
    receivedAmount: Math.round(r.shareAmount),
    dollarsPerHour: r.hoursWorked > 0 ? Math.round(r.shareAmount) / r.hoursWorked : 0,
    _originalIndex: index, // Track original order
  }));

  // Calculate the difference between total pool and sum of rounded amounts
  const totalRounded = rounded.reduce((sum, r) => sum + r.receivedAmount, 0);
  let diff = Math.round(totalPool) - totalRounded;

  if (diff !== 0) {
    // Sort by the fractional part of the original amount (for rounding fairness)
    const withError = rounded.map(r => ({
      ...r,
      error: r.shareAmount - r.receivedAmount,
    }));

    if (diff > 0) {
      // Need to add - prioritize those rounded down the most
      withError.sort((a, b) => b.error - a.error);
    } else {
      // Need to subtract - prioritize those rounded up the most
      withError.sort((a, b) => a.error - b.error);
    }

    // Apply adjustments one dollar at a time
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

    // Restore original order before returning
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
