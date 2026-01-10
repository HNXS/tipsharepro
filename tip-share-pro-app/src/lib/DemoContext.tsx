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
  getDefaultRateForMethod,
  ALL_PREDEFINED_CATEGORIES,
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
  // Employee actions
  updateEmployee: (employeeId: string, updates: Partial<Employee>) => void;
  addEmployee: (employee: Employee) => void;
  removeEmployee: (employeeId: string) => void;
  // Data actions
  calculateDistribution: () => void;
  // Loading state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const initialState: ExtendedDemoState = {
  // Auth state
  isAuthenticated: false,
  user: null,
  isLoading: true, // Start loading to check for existing session
  error: null,
  // App state
  currentStep: 0, // 0 = login, 1-3 = app steps
  settings: DEFAULT_SETTINGS,
  employees: DEFAULT_EMPLOYEES,
  estimatedMonthlySales: DEFAULT_SETTINGS.estimatedMonthlySales,
  projectedPool: 0,
  distributionResults: [],
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ExtendedDemoState>(() => {
    // Calculate initial projected pool based on settings
    const projectedPool = (DEFAULT_SETTINGS.estimatedMonthlySales / 2) * (DEFAULT_SETTINGS.contributionRate / 100);
    return { ...initialState, projectedPool, estimatedMonthlySales: DEFAULT_SETTINGS.estimatedMonthlySales };
  });

  // Check for existing session on mount
  useEffect(() => {
    const hasToken = checkAuth();
    if (hasToken) {
      // TODO: Validate session with API and fetch user info
      // For now, just check if token exists
      setState(prev => ({
        ...prev,
        isLoading: false,
        // If we have a token but no user info, we'll need to fetch it
        // For demo, we'll just mark as authenticated
      }));
    } else {
      setState(prev => ({
        ...prev,
        isLoading: false,
        currentStep: 0,
      }));
    }
  }, []);

  // Auth handlers
  const handleLoginSuccess = useCallback((user: AuthUser) => {
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      user,
      currentStep: 1,
      isLoading: false,
      error: null,
    }));
  }, []);

  const handleLogout = useCallback(() => {
    clearToken();
    setState(prev => ({
      ...initialState,
      isLoading: false,
      projectedPool: prev.projectedPool,
    }));
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
      const projectedPool = (monthlySales / 2) * (newSettings.contributionRate / 100);
      return {
        ...prev,
        settings: newSettings,
        projectedPool,
        estimatedMonthlySales: monthlySales,
      };
    });
  }, []);

  // Set contribution method and update rate to default for that method
  const setContributionMethod = useCallback((method: ContributionMethod) => {
    setState(prev => {
      const defaultRate = getDefaultRateForMethod(method);
      const newSettings = {
        ...prev.settings,
        contributionMethod: method,
        contributionRate: defaultRate,
      };
      const projectedPool = (prev.settings.estimatedMonthlySales / 2) * (defaultRate / 100);
      return { ...prev, settings: newSettings, projectedPool };
    });
  }, []);

  // Toggle category selection
  const toggleCategorySelection = useCallback((categoryId: string) => {
    setState(prev => {
      const isSelected = prev.settings.selectedCategories.includes(categoryId);
      let newSelectedCategories: string[];
      let newJobCategories = [...prev.settings.jobCategories];

      if (isSelected) {
        // Remove from selected
        newSelectedCategories = prev.settings.selectedCategories.filter(id => id !== categoryId);
        // Remove from jobCategories
        newJobCategories = newJobCategories.filter(cat => cat.id !== categoryId);
      } else {
        // Add to selected
        newSelectedCategories = [...prev.settings.selectedCategories, categoryId];
        // Add to jobCategories if not already there
        if (!newJobCategories.find(cat => cat.id === categoryId)) {
          // Find in predefined categories
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

  // Add a custom category
  const addCustomCategory = useCallback((name: string) => {
    if (!name.trim()) return;

    setState(prev => {
      const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      const newCategory: JobCategory = {
        id,
        name: name.trim(),
        variableWeight: 2.5,
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


  const calculateDistribution = useCallback(() => {
    setState(prev => {
      const { employees, settings, projectedPool } = prev;

      // Calculate basis for each employee (NEVER shown to users!)
      // Basis = Hours × Rate × Variable Weight
      const employeesWithBasis = employees.map(emp => {
        const category = settings.jobCategories.find(cat => cat.id === emp.jobCategoryId);
        const variableWeight = category?.variableWeight || 2.5;
        const basis = emp.hoursWorked * emp.hourlyRate * variableWeight;
        return { ...emp, basis, variableWeight, categoryName: category?.name || 'Unknown' };
      });

      // Calculate total basis
      const totalBasis = employeesWithBasis.reduce((sum, emp) => sum + emp.basis, 0);

      // Calculate share percentage and amount for each employee
      const results: DistributionResult[] = employeesWithBasis.map(emp => {
        const sharePercentage = totalBasis > 0 ? (emp.basis / totalBasis) * 100 : 0;
        const shareAmount = projectedPool * (sharePercentage / 100);
        return {
          employeeId: emp.id,
          employeeName: emp.name,
          jobCategory: emp.categoryName,
          hoursWorked: emp.hoursWorked,
          hourlyRate: emp.hourlyRate,
          variableWeight: emp.variableWeight as VariableWeight,
          sharePercentage,
          shareAmount,
          receivedAmount: shareAmount, // Will be adjusted for exact matching
        };
      });

      // Adjust received amounts to match pool exactly (round and redistribute difference)
      const adjustedResults = adjustReceivedAmounts(results, projectedPool);

      return { ...prev, distributionResults: adjustedResults };
    });
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
        // Employees
        updateEmployee,
        addEmployee,
        removeEmployee,
        // Data
        calculateDistribution,
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
  // Round each share to 2 decimal places
  const rounded = results.map(r => ({
    ...r,
    receivedAmount: Math.round(r.shareAmount * 100) / 100,
  }));

  // Calculate the difference between total pool and sum of rounded amounts
  const totalRounded = rounded.reduce((sum, r) => sum + r.receivedAmount, 0);
  let diff = Math.round((totalPool - totalRounded) * 100) / 100;

  if (Math.abs(diff) > 0.001) {
    // Sort by the fractional part of the original amount (ascending if diff < 0, descending if diff > 0)
    const withError = rounded.map(r => ({
      ...r,
      error: r.shareAmount - r.receivedAmount, // positive = rounded down
    }));

    if (diff > 0) {
      // Need to add - prioritize those rounded down the most
      withError.sort((a, b) => b.error - a.error);
    } else {
      // Need to subtract - prioritize those rounded up the most
      withError.sort((a, b) => a.error - b.error);
    }

    // Apply adjustments one cent at a time
    let i = 0;
    while (Math.abs(diff) >= 0.01 && i < withError.length) {
      const adjustment = diff > 0 ? 0.01 : -0.01;
      withError[i].receivedAmount = Math.round((withError[i].receivedAmount + adjustment) * 100) / 100;
      diff = Math.round((diff - adjustment) * 100) / 100;
      i++;
    }

    return withError.map(({ error, ...r }) => r);
  }

  return rounded;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
