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
  const { estimatedMonthlySales, contributionRate } = state.settings;

  return (
    <div className="content-container">
      {/* Projected Pool Card (Read-only - configured in Settings) */}
      <div className="card card-hero">
        <div className="hero-grid">
          <div className="hero-input-group">
            <div className="hero-label">
              <DollarSign size={20} />
              <label>Estimated Monthly Sales</label>
              <HelpTooltip text="Configured in Settings (Step 2)" position="right" />
            </div>
            <div className="hero-amount hero-amount-muted">
              {formatCurrency(estimatedMonthlySales)}
            </div>
          </div>

          <div className="hero-result">
            <div className="hero-label">
              <TrendingUp size={20} />
              <span>Projected Pool (per pay period)</span>
              <HelpTooltip text={HELP_TEXT.projectedPool} position="left" />
            </div>
            <div className="hero-amount">
              {formatCurrency(state.projectedPool)}
            </div>
            <p className="hero-formula">
              = (${estimatedMonthlySales.toLocaleString('en-US')} / 2) x {contributionRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Employee Data Entry */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <h2 className="card-title">Employee Data</h2>
            <HelpTooltip text="Enter employee information for this pay period. Hours and rates are used to calculate each person's share of the tip pool." />
          </div>
          <div className="card-subtitle">
            {state.employees.length} employees | {totalHours} total hours
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="table table-distribution">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Job Category</th>
                <th className="hide-on-print">
                  <span className="flex items-center gap-1">
                    Hourly Rate
                    <HelpTooltip text={HELP_TEXT.hourlyRate} position="bottom" />
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    Hours Worked
                    <HelpTooltip text={HELP_TEXT.hoursWorked} position="bottom" />
                  </span>
                </th>
                <th>Weight</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.employees.map((employee) => {
                const category = state.settings.jobCategories.find(c => c.id === employee.jobCategoryId);

                return (
                  <tr key={employee.id}>
                    <td>
                      <span className="table-input employee-name-static">
                        {employee.name}
                      </span>
                    </td>
                    <td>
                      <select
                        value={employee.jobCategoryId}
                        onChange={(e) => updateEmployee(employee.id, { jobCategoryId: e.target.value })}
                        className="form-select table-select"
                      >
                        {state.settings.jobCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="hide-on-print">
                      <div className="input-with-prefix">
                        <span className="input-prefix">$</span>
                        <input
                          type="number"
                          value={employee.hourlyRate}
                          onChange={(e) => updateEmployee(employee.id, { hourlyRate: parseFloat(e.target.value) || 0 })}
                          className="form-input form-input-currency table-input-number wage-column"
                          step="0.25"
                          min="0"
                        />
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={employee.hoursWorked}
                        onChange={(e) => updateEmployee(employee.id, { hoursWorked: parseFloat(e.target.value) || 0 })}
                        className="form-input form-input-currency table-input-number"
                        step="0.5"
                        min="0"
                      />
                    </td>
                    <td>
                      <span className="badge badge-weight">
                        x{category?.variableWeight.toFixed(2) || '2.50'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => removeEmployee(employee.id)}
                        className="btn-icon btn-danger"
                        aria-label="Remove employee"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add New Employee */}
        <div className="add-category-form">
          <input
            type="text"
            value={newEmployeeName}
            onChange={(e) => setNewEmployeeName(e.target.value)}
            placeholder="Add new employee..."
            className="form-input form-input-dashed"
            onKeyDown={(e) => e.key === 'Enter' && handleAddEmployee()}
          />
          <button
            onClick={handleAddEmployee}
            disabled={!newEmployeeName.trim()}
            className="btn btn-secondary"
          >
            <Plus size={18} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="card">
        <h3 className="card-title mb-4">Pay Period Summary</h3>
        <div className="summary-grid">
          <div className="summary-stat">
            <div className="summary-value">{state.employees.length}</div>
            <div className="summary-label">Employees</div>
          </div>
          <div className="summary-stat">
            <div className="summary-value">{totalHours}</div>
            <div className="summary-label">Total Hours</div>
          </div>
          <div className="summary-stat summary-stat-success">
            <div className="summary-value text-success">
              {formatCurrency(state.projectedPool)}
            </div>
            <div className="summary-label">Pool to Distribute</div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="nav-buttons">
        <button
          onClick={() => setCurrentStep(1)}
          className="btn btn-ghost"
        >
          <ChevronLeft size={20} />
          Back to Settings
        </button>
        <button
          onClick={handleContinue}
          className="btn btn-primary btn-lg"
        >
          Calculate Distribution
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
