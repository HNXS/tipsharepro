'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  DemoState,
  Settings,
  Employee,
  DistributionResult,
  DEFAULT_SETTINGS,
  DEFAULT_EMPLOYEES,
  JobCategory,
  VariableWeight,
} from './types';

interface DemoContextType {
  state: DemoState;
  setCurrentStep: (step: 1 | 2 | 3) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  updateJobCategory: (categoryId: string, updates: Partial<JobCategory>) => void;
  addJobCategory: (category: JobCategory) => void;
  removeJobCategory: (categoryId: string) => void;
  updateEmployee: (employeeId: string, updates: Partial<Employee>) => void;
  addEmployee: (employee: Employee) => void;
  removeEmployee: (employeeId: string) => void;
  setEstimatedMonthlySales: (amount: number) => void;
  calculateDistribution: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const initialState: DemoState = {
  currentStep: 1,
  settings: DEFAULT_SETTINGS,
  employees: DEFAULT_EMPLOYEES,
  estimatedMonthlySales: 80000,
  projectedPool: 0,
  distributionResults: [],
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => {
    // Calculate initial projected pool
    const projectedPool = (80000 / 2) * (DEFAULT_SETTINGS.contributionRate / 100);
    return { ...initialState, projectedPool };
  });

  const setCurrentStep = useCallback((step: 1 | 2 | 3) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setState(prev => {
      const newSettings = { ...prev.settings, ...updates };
      const projectedPool = (prev.estimatedMonthlySales / 2) * (newSettings.contributionRate / 100);
      return { ...prev, settings: newSettings, projectedPool };
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

  const setEstimatedMonthlySales = useCallback((amount: number) => {
    setState(prev => {
      const projectedPool = (amount / 2) * (prev.settings.contributionRate / 100);
      return { ...prev, estimatedMonthlySales: amount, projectedPool };
    });
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
        setCurrentStep,
        updateSettings,
        updateJobCategory,
        addJobCategory,
        removeJobCategory,
        updateEmployee,
        addEmployee,
        removeEmployee,
        setEstimatedMonthlySales,
        calculateDistribution,
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
