'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { previewDistribution } from '@/lib/api/calculations';
import type { PreviewEmployee, DistributionEmployee, DistributionSummary } from '@/lib/api/calculations';
import { InlineCategoryDot } from './CategoryBadge';
import { CategoryColor } from '@/lib/types';
import { hexToCategoryColor, categoryColorToHex } from '@/lib/api/mappers';
import { X, Calculator, RotateCcw, Download, Upload, Loader2, AlertCircle, FlaskConical } from 'lucide-react';

interface SandboxProps {
  onClose: () => void;
}

export default function ScenarioSandbox({ onClose }: SandboxProps) {
  const { state, updateEmployee, updateCategoryWeight } = useDemo();

  // Pre-populate from current real data
  const initialPool = useMemo(() => {
    return Math.round(state.projectedPool * 100); // cents
  }, [state.projectedPool]);

  const initialEmployees: PreviewEmployee[] = useMemo(() => {
    return state.employees.map(emp => {
      const cat = state.settings.jobCategories.find(j => j.id === emp.jobCategoryId);
      const catColor = cat?.categoryColor || 'custom';
      const catWeight = state.settings.categoryWeights[catColor as CategoryColor] || 1;
      return {
        employeeId: emp.id,
        employeeName: emp.name,
        locationId: 'sandbox',
        locationName: 'Sandbox',
        jobCategoryId: emp.jobCategoryId,
        jobCategoryName: cat?.name || 'Unknown',
        badgeColor: categoryColorToHex(catColor as CategoryColor),
        hoursWorked: emp.hoursWorked || 40,
        hourlyRateCents: Math.round(emp.hourlyRate * 100),
        weight: catWeight + (emp.weightAdjustment || 0),
      };
    });
  }, [state.employees, state.settings]);

  const [poolCents, setPoolCents] = useState(initialPool);
  const [employees, setEmployees] = useState<PreviewEmployee[]>(initialEmployees);
  const [results, setResults] = useState<DistributionEmployee[] | null>(null);
  const [summary, setSummary] = useState<DistributionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState(false);

  const handleCalculate = useCallback(async () => {
    if (poolCents <= 0 || employees.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const result = await previewDistribution(poolCents, employees);
      setResults(result.distribution);
      setSummary(result.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setLoading(false);
    }
  }, [poolCents, employees]);

  const handleReset = () => {
    setPoolCents(initialPool);
    setEmployees(initialEmployees);
    setResults(null);
    setSummary(null);
    setError(null);
  };

  const handleExportCSV = () => {
    if (!results) return;
    const header = 'Employee,Category,Hours,Rate,Weight,Share %,Share $\n';
    const rows = results.map(r =>
      `"${r.employeeName}","${r.jobCategory.name}",${r.hoursWorked},${r.hourlyRate},${r.percentage.toFixed(2)}%,$${(r.receivedCents / 100).toFixed(2)}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scenario-sandbox.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyToReal = () => {
    // Apply sandbox employee data back to actual employees
    for (const sandboxEmp of employees) {
      const realEmp = state.employees.find(e => e.id === sandboxEmp.employeeId);
      if (!realEmp) continue;

      const updates: Record<string, number> = {};
      if (sandboxEmp.hoursWorked !== realEmp.hoursWorked) {
        updates.hoursWorked = sandboxEmp.hoursWorked;
      }
      const sandboxRate = sandboxEmp.hourlyRateCents / 100;
      if (sandboxRate !== realEmp.hourlyRate) {
        updates.hourlyRate = sandboxRate;
      }

      if (Object.keys(updates).length > 0) {
        updateEmployee(sandboxEmp.employeeId, updates);
      }
    }

    // Apply sandbox weights back to category weights
    const catWeightMap: Record<string, number[]> = {};
    for (const emp of employees) {
      const catColor = hexToCategoryColor(emp.badgeColor);
      if (!catWeightMap[catColor]) catWeightMap[catColor] = [];
      catWeightMap[catColor].push(emp.weight);
    }
    for (const [catColor, weights] of Object.entries(catWeightMap)) {
      const avgWeight = Math.round(weights.reduce((a, b) => a + b, 0) / weights.length);
      const currentWeight = state.settings.categoryWeights[catColor as CategoryColor] || 1;
      if (avgWeight !== currentWeight) {
        updateCategoryWeight(catColor as CategoryColor, avgWeight);
      }
    }

    setImported(true);
    setTimeout(() => setImported(false), 3000);
  };

  const updateEmployeeField = (idx: number, field: keyof PreviewEmployee, value: number) => {
    setEmployees(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
    // Clear stale results
    setResults(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content sandbox-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FlaskConical size={18} />
            Scenario Sandbox
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body sandbox-body">
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Pool Amount */}
          <div className="sandbox-pool-input">
            <label className="form-label">Total Pool Amount ($)</label>
            <input
              type="number"
              className="form-input"
              value={(poolCents / 100).toFixed(2)}
              onChange={e => setPoolCents(Math.round(parseFloat(e.target.value || '0') * 100))}
              min="0"
              step="0.01"
            />
          </div>

          {/* Employee Table */}
          <div className="sandbox-table-wrap">
            <table className="table sandbox-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Category</th>
                  <th>Hours</th>
                  <th>Rate ($)</th>
                  <th>Weight</th>
                  {results && <th>Share %</th>}
                  {results && <th>Share $</th>}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => {
                  const result = results?.find(r => r.employeeId === emp.employeeId);
                  return (
                    <tr key={emp.employeeId}>
                      <td>{emp.employeeName}</td>
                      <td>
                        <InlineCategoryDot categoryColor={hexToCategoryColor(emp.badgeColor)} />
                        {emp.jobCategoryName}
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-input table-input"
                          value={emp.hoursWorked}
                          onChange={e => updateEmployeeField(idx, 'hoursWorked', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.5"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-input table-input"
                          value={(emp.hourlyRateCents / 100).toFixed(2)}
                          onChange={e => updateEmployeeField(idx, 'hourlyRateCents', Math.round(parseFloat(e.target.value || '0') * 100))}
                          min="0"
                          step="0.25"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-input table-input"
                          value={emp.weight}
                          onChange={e => updateEmployeeField(idx, 'weight', parseFloat(e.target.value) || 1)}
                          min="1"
                          max="5"
                          step="0.25"
                        />
                      </td>
                      {results && <td className="text-mono">{result?.percentage.toFixed(2) || '0.00'}%</td>}
                      {results && <td className="text-mono">${((result?.receivedCents || 0) / 100).toFixed(2)}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {summary && (
            <div className="sandbox-summary">
              <div className="sandbox-summary-item">
                <span>Participants</span>
                <strong>{summary.totalParticipants}</strong>
              </div>
              <div className="sandbox-summary-item">
                <span>Total Hours</span>
                <strong>{summary.totalHours}</strong>
              </div>
              <div className="sandbox-summary-item">
                <span>Pool</span>
                <strong>${(summary.totalPoolCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="sandbox-summary-item">
                <span>Distributed</span>
                <strong>${(summary.distributedCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={handleReset}>
            <RotateCcw size={16} />
            Reset
          </button>
          {results && (
            <>
              <button className="btn btn-outline" onClick={handleExportCSV}>
                <Download size={16} />
                Export CSV
              </button>
              <button
                className={`btn ${imported ? 'btn-outline' : 'btn-outline'}`}
                onClick={handleApplyToReal}
                disabled={imported}
                title="Apply sandbox hours, rates, and weights to your actual data"
              >
                <Upload size={16} />
                {imported ? 'Applied!' : 'Apply to Real Data'}
              </button>
            </>
          )}
          <button className="btn btn-primary" onClick={handleCalculate} disabled={loading || poolCents <= 0}>
            {loading ? <Loader2 size={16} className="loading-spinner" /> : <Calculator size={16} />}
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
}
