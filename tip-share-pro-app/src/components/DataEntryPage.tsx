'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { HELP_TEXT, Employee } from '@/lib/types';
import HelpTooltip from './HelpTooltip';
import { Plus, Trash2, ChevronLeft, ChevronRight, DollarSign, TrendingUp } from 'lucide-react';

export default function DataEntryPage() {
  const {
    state,
    updateEmployee,
    addEmployee,
    removeEmployee,
    setEstimatedMonthlySales,
    setCurrentStep,
    calculateDistribution,
  } = useDemo();
  const [newEmployeeName, setNewEmployeeName] = useState('');

  const handleAddEmployee = () => {
    if (newEmployeeName.trim()) {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: newEmployeeName.trim(),
        jobCategoryId: state.settings.jobCategories[0]?.id || 'server',
        hourlyRate: 15.00,
        hoursWorked: 40,
      };
      addEmployee(newEmployee);
      setNewEmployeeName('');
    }
  };

  const handleContinue = () => {
    calculateDistribution();
    setCurrentStep(3);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const totalHours = state.employees.reduce((sum, emp) => sum + emp.hoursWorked, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Estimated Sales & Projected Pool Card */}
      <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-xl p-6 text-white shadow-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={20} />
              <label className="text-sm font-medium opacity-90">
                Estimated Monthly Sales
              </label>
              <HelpTooltip text={HELP_TEXT.estimatedMonthlySales} position="right" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">$</span>
              <input
                type="number"
                value={state.estimatedMonthlySales}
                onChange={(e) => setEstimatedMonthlySales(parseFloat(e.target.value) || 0)}
                className="text-3xl font-bold bg-white/10 border border-white/20 rounded-lg px-4 py-2 w-48 focus:bg-white/20 focus:border-white/40 transition-colors"
                step="1000"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} />
              <span className="text-sm font-medium opacity-90">Projected Pool (per pay period)</span>
              <HelpTooltip text={HELP_TEXT.projectedPool} position="left" />
            </div>
            <div className="text-4xl font-bold">
              {formatCurrency(state.projectedPool)}
            </div>
            <p className="text-sm opacity-75 mt-1">
              = (${state.estimatedMonthlySales.toLocaleString()} / 2) × {state.settings.contributionRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Employee Data Entry */}
      <div className="bg-[var(--background-secondary)] rounded-xl p-6 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white">Employee Data</h2>
            <HelpTooltip text="Enter employee information for this pay period. Hours and rates are used to calculate each person's share of the tip pool." />
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            {state.employees.length} employees | {totalHours} total hours
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] border-b border-[var(--border)]">
          <div className="col-span-3">Employee Name</div>
          <div className="col-span-3">Job Category</div>
          <div className="col-span-2 flex items-center gap-1">
            Hourly Rate
            <HelpTooltip text={HELP_TEXT.hourlyRate} position="bottom" />
          </div>
          <div className="col-span-2 flex items-center gap-1">
            Hours Worked
            <HelpTooltip text={HELP_TEXT.hoursWorked} position="bottom" />
          </div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Employee Rows */}
        <div className="space-y-2 mt-2">
          {state.employees.map((employee) => {
            const category = state.settings.jobCategories.find(c => c.id === employee.jobCategoryId);

            return (
              <div
                key={employee.id}
                className="grid grid-cols-12 gap-4 items-center p-4 bg-[var(--background-tertiary)] rounded-lg border border-[var(--border)] hover:border-[var(--border-light)] transition-colors"
              >
                <div className="col-span-3">
                  <input
                    type="text"
                    value={employee.name}
                    onChange={(e) => updateEmployee(employee.id, { name: e.target.value })}
                    className="w-full bg-transparent text-white font-medium focus:outline-none focus:text-[var(--accent)]"
                    placeholder="Employee name"
                  />
                </div>

                <div className="col-span-3">
                  <select
                    value={employee.jobCategoryId}
                    onChange={(e) => updateEmployee(employee.id, { jobCategoryId: e.target.value })}
                    className="w-full bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-white focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                  >
                    {state.settings.jobCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} (×{cat.variableWeight.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[var(--foreground-muted)]">$</span>
                    <input
                      type="number"
                      value={employee.hourlyRate}
                      onChange={(e) => updateEmployee(employee.id, { hourlyRate: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-white text-right focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] wage-column"
                      step="0.25"
                      min="0"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <input
                    type="number"
                    value={employee.hoursWorked}
                    onChange={(e) => updateEmployee(employee.id, { hoursWorked: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-white text-right focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                    step="0.5"
                    min="0"
                  />
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  <span className="text-sm text-[var(--foreground-dim)] px-2 py-1 bg-[var(--background-secondary)] rounded">
                    ×{category?.variableWeight.toFixed(2) || '2.50'}
                  </span>
                  <button
                    onClick={() => removeEmployee(employee.id)}
                    className="p-2 text-[var(--foreground-dim)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-lg transition-colors"
                    aria-label="Remove employee"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Employee */}
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={newEmployeeName}
            onChange={(e) => setNewEmployeeName(e.target.value)}
            placeholder="Add new employee..."
            className="flex-1 bg-[var(--background-tertiary)] border border-[var(--border)] border-dashed rounded-lg px-4 py-3 text-white placeholder-[var(--foreground-dim)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleAddEmployee()}
          />
          <button
            onClick={handleAddEmployee}
            disabled={!newEmployeeName.trim()}
            className="px-4 py-3 bg-[var(--accent-muted)] text-[var(--accent)] rounded-lg hover:bg-[var(--accent)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={18} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-[var(--background-secondary)] rounded-xl p-6 border border-[var(--border)]">
        <h3 className="text-lg font-semibold text-white mb-4">Pay Period Summary</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[var(--background-tertiary)] rounded-lg">
            <div className="text-3xl font-bold text-white">{state.employees.length}</div>
            <div className="text-sm text-[var(--foreground-muted)]">Employees</div>
          </div>
          <div className="text-center p-4 bg-[var(--background-tertiary)] rounded-lg">
            <div className="text-3xl font-bold text-white">{totalHours}</div>
            <div className="text-sm text-[var(--foreground-muted)]">Total Hours</div>
          </div>
          <div className="text-center p-4 bg-[var(--success-bg)] rounded-lg border border-[var(--success)]/20">
            <div className="text-3xl font-bold text-[var(--success)]">
              {formatCurrency(state.projectedPool)}
            </div>
            <div className="text-sm text-[var(--foreground-muted)]">Pool to Distribute</div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3 bg-[var(--background-tertiary)] text-white rounded-lg hover:bg-[var(--border)] transition-colors font-medium flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          Back to Settings
        </button>
        <button
          onClick={handleContinue}
          className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors font-medium flex items-center gap-2 shadow-lg"
        >
          Calculate Distribution
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
