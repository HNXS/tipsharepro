'use client';

import { useState, useEffect } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { getEntriesForPeriod } from '@/lib/api/dailyEntries';
import type { DailyEntry } from '@/lib/api/dailyEntries';

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

interface EmployeeSummary {
  name: string;
  adjSales: number;
  actual: number;
}

export default function PayPeriodContributionSummary() {
  const { state } = useDemo();
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const period = state.activePayPeriod;
  const contributionRate = state.settings.contributionRate;

  useEffect(() => {
    if (!period) return;
    setLoading(true);
    getEntriesForPeriod(period.id)
      .then((res) => setEntries(res.entries))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [period?.id]);

  if (!period) return null;
  if (loading) return <div className="card"><div className="card-header"><h3>Pay Period Contributions</h3></div><p style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Loading...</p></div>;

  // Group by employee
  const employeeMap = new Map<string, EmployeeSummary>();
  for (const entry of entries) {
    if (!employeeMap.has(entry.employeeId)) {
      employeeMap.set(entry.employeeId, { name: entry.employeeName, adjSales: 0, actual: 0 });
    }
    const emp = employeeMap.get(entry.employeeId)!;
    if (entry.sales != null) emp.adjSales += entry.sales;
    if (entry.actualContribution != null) emp.actual += entry.actualContribution;
  }

  const employees = Array.from(employeeMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  // Totals
  const totalAdjSales = employees.reduce((s, e) => s + e.adjSales, 0);
  const totalCalculated = totalAdjSales * contributionRate / 100;
  const totalActual = employees.reduce((s, e) => s + e.actual, 0);
  const totalDifference = totalActual - totalCalculated;
  const totalPool = totalActual; // allocation pool = sum of actual contributions

  const endDateFormatted = new Date(period.endDate + 'T12:00:00').toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3>Pay Period Contributions</h3>
        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-caption)' }}>
          {state.selectedLocationName && <span>Location: {state.selectedLocationName} &nbsp;|&nbsp; </span>}
          PPE: {endDateFormatted}
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ textAlign: 'right' }}>Adj Sales</th>
              <th style={{ textAlign: 'right' }}>{contributionRate}%</th>
              <th style={{ textAlign: 'right' }}>Actual</th>
              <th style={{ textAlign: 'right' }}>Difference</th>
              <th style={{ textAlign: 'right' }}>Allocation</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const calculated = emp.adjSales * contributionRate / 100;
              const difference = emp.actual - calculated;
              const allocation = totalActual > 0 ? (emp.actual / totalActual) * totalPool : 0;
              return (
                <tr key={emp.name}>
                  <td style={{ whiteSpace: 'nowrap' }}>{emp.name}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(emp.adjSales)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(calculated)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(emp.actual)}</td>
                  <td style={{ textAlign: 'right', color: difference < 0 ? 'var(--color-error, #dc3545)' : difference > 0 ? 'var(--color-success, #28a745)' : undefined }}>
                    {formatCurrency(difference)}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(allocation)}</td>
                </tr>
              );
            })}
            {/* Totals row */}
            <tr className="table-total">
              <td>TOTALS</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(totalAdjSales)}</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(totalCalculated)}</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(totalActual)}</td>
              <td style={{ textAlign: 'right', color: totalDifference < 0 ? 'var(--color-error, #dc3545)' : totalDifference > 0 ? 'var(--color-success, #28a745)' : undefined }}>
                {formatCurrency(totalDifference)}
              </td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(totalPool)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
