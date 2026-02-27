'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { X, ChevronLeft, ChevronRight, Save, Check, AlertCircle, Loader2 } from 'lucide-react';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function SaveStatusIndicator({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null;
  return (
    <span className={`daily-entry-save-indicator save-${status}`}>
      {status === 'saving' && <><Save size={14} /> Saving...</>}
      {status === 'saved' && <><Check size={14} /> Saved</>}
      {status === 'error' && <><AlertCircle size={14} /> Error</>}
    </span>
  );
}

interface DailyEntryModalProps {
  onClose: () => void;
}

export default function DailyEntryModal({ onClose }: DailyEntryModalProps) {
  const { state, saveDailyEntries, selectDate } = useDemo();
  const { employeesForDate, dailyEntries, saveStatus, selectedDate, dateNavigation, runningTotals, payPeriodLoading } = state;

  // Local sales state for editing — keyed by employeeId
  const [localSales, setLocalSales] = useState<Record<string, string>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local sales from entries when date changes
  useEffect(() => {
    const salesMap: Record<string, string> = {};
    for (const emp of employeesForDate) {
      const entry = emp.existingEntry || dailyEntries.find((e: { employeeId: string }) => e.employeeId === emp.id);
      salesMap[emp.id] = entry?.sales != null ? String(entry.sales) : '';
    }
    setLocalSales(salesMap);
  }, [employeesForDate, dailyEntries]);

  const handleSalesChange = useCallback((employeeId: string, value: string) => {
    setLocalSales(prev => ({ ...prev, [employeeId]: value }));
  }, []);

  const handleSave = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const entries = Object.entries(localSales)
        .filter(([, val]) => val !== '' && !isNaN(parseFloat(val)))
        .map(([employeeId, val]) => ({
          employeeId,
          salesCents: Math.round(parseFloat(val) * 100),
        }));
      if (entries.length > 0) {
        saveDailyEntries(entries);
      }
    }, 500);
  }, [localSales, saveDailyEntries]);

  const handleBlur = useCallback(() => {
    handleSave();
  }, [handleSave]);

  // Calculate today's totals from local sales
  const todaySales = Object.values(localSales).reduce((sum, val) => {
    const n = parseFloat(val);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  // Calculate today's contribution from entries
  const todayContrib = employeesForDate.reduce((sum, emp) => {
    const entry = emp.existingEntry || dailyEntries.find((e: { employeeId: string }) => e.employeeId === emp.id);
    return sum + (entry?.actualContribution ?? entry?.calculatedContribution ?? 0);
  }, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content panel-modal daily-entry-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>Daily Sales Entry</h3>
          <div className="daily-entry-modal-header-right">
            <SaveStatusIndicator status={saveStatus} />
            <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        {/* Date Navigator */}
        <div className="daily-entry-modal-nav">
          <button
            className="btn btn-outline btn-icon"
            onClick={() => dateNavigation?.previousDate && selectDate(dateNavigation.previousDate)}
            disabled={!dateNavigation?.previousDate || payPeriodLoading}
            title="Previous day"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="daily-entry-modal-nav-center">
            {payPeriodLoading ? (
              <Loader2 size={16} className="loading-spinner" />
            ) : (
              <>
                <span className="daily-entry-modal-nav-date">{selectedDate ? formatDate(selectedDate) : ''}</span>
                {dateNavigation && (
                  <span className="daily-entry-modal-nav-count">
                    Day {dateNavigation.dayNumber} of {dateNavigation.totalDays}
                  </span>
                )}
              </>
            )}
          </div>
          <button
            className="btn btn-outline btn-icon"
            onClick={() => dateNavigation?.nextDate && selectDate(dateNavigation.nextDate)}
            disabled={!dateNavigation?.nextDate || payPeriodLoading}
            title="Next day"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Entry Table */}
        <div className="modal-body daily-entry-modal-body">
          {payPeriodLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Loader2 size={24} className="loading-spinner" />
            </div>
          ) : employeesForDate.length === 0 ? (
            <div className="daily-entry-empty-state">
              <p className="daily-entry-empty-title">No active employees found for this date.</p>
              <p className="daily-entry-empty-hint">
                Add employees in the Distribution Table first, then come back to enter daily sales.
              </p>
            </div>
          ) : (
            <table className="distribution-table daily-entry-table">
              <thead>
                <tr>
                  <th className="col-name">Name</th>
                  <th className="col-category">Category</th>
                  <th className="col-sales">Sales ($)</th>
                  <th className="col-contribution">Contribution ($)</th>
                </tr>
              </thead>
              <tbody>
                {employeesForDate.map(emp => {
                  const entry = emp.existingEntry || dailyEntries.find((e: { employeeId: string }) => e.employeeId === emp.id);
                  const contribution = entry?.actualContribution ?? entry?.calculatedContribution ?? null;

                  return (
                    <tr key={emp.id}>
                      <td className="col-name">
                        <span className="employee-name-static">{emp.name}</span>
                      </td>
                      <td className="col-category">
                        <span className="daily-entry-category">{emp.jobCategory.name}</span>
                      </td>
                      <td className="col-sales">
                        <div className="daily-entry-cell">
                          <span className="daily-entry-prefix">$</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={localSales[emp.id] || ''}
                            onChange={e => handleSalesChange(emp.id, e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={e => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                            className="table-input daily-entry-input"
                            placeholder="0.00"
                          />
                        </div>
                      </td>
                      <td className="col-contribution">
                        <span className="daily-entry-contribution">
                          {contribution != null ? `$${contribution.toFixed(2)}` : '—'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary Footer */}
        {employeesForDate.length > 0 && (
          <div className="daily-entry-modal-footer">
            <div className="daily-entry-modal-summary">
              <span>Today: <strong>${todaySales.toFixed(2)}</strong> sales</span>
              <span>Contrib: <strong>${todayContrib.toFixed(2)}</strong></span>
            </div>
            {runningTotals && (
              <div className="daily-entry-modal-summary daily-entry-modal-summary-period">
                <span>Period total: <strong>${(runningTotals.totalSalesCents / 100).toFixed(2)}</strong></span>
                <span><strong>{runningTotals.daysEntered}</strong>/{runningTotals.daysTotal} days entered</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
