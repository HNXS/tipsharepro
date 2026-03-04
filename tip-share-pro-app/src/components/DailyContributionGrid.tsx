'use client';

import { useState, useEffect } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { getEntriesForPeriod } from '@/lib/api/dailyEntries';
import type { DailyEntry } from '@/lib/api/dailyEntries';

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDateColumn(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${days[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`;
}

function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate + 'T12:00:00');
  const end = new Date(endDate + 'T12:00:00');
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function DailyContributionGrid() {
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
  if (loading) return <div className="card"><div className="card-header"><h3>Daily Tip Contributions</h3></div><p style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Loading...</p></div>;

  const dates = generateDateRange(period.startDate, period.endDate);

  // Pivot: Map<employeeName, Map<dateString, sales>>
  const employeeMap = new Map<string, { name: string; salesByDate: Map<string, number> }>();
  for (const entry of entries) {
    if (!employeeMap.has(entry.employeeId)) {
      employeeMap.set(entry.employeeId, { name: entry.employeeName, salesByDate: new Map() });
    }
    const emp = employeeMap.get(entry.employeeId)!;
    if (entry.sales != null) {
      emp.salesByDate.set(entry.date, (emp.salesByDate.get(entry.date) || 0) + entry.sales);
    }
  }

  // Sort employees alphabetically
  const employees = Array.from(employeeMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  // Column totals
  const dateTotals = new Map<string, number>();
  for (const date of dates) {
    let sum = 0;
    for (const emp of employees) {
      sum += emp.salesByDate.get(date) || 0;
    }
    dateTotals.set(date, sum);
  }

  const endDateFormatted = new Date(period.endDate + 'T12:00:00').toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3>Daily Tip Contributions</h3>
        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-caption)' }}>
          {state.selectedLocationName && <span>Location: {state.selectedLocationName} &nbsp;|&nbsp; </span>}
          PPE: {endDateFormatted}
        </div>
      </div>
      <div className="contribution-grid-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              {dates.map((d) => (
                <th key={d} style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatDateColumn(d)}</th>
              ))}
              <th style={{ textAlign: 'right' }}>Total Sales</th>
              <th style={{ textAlign: 'right' }}>Total Pool</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const totalSales = Array.from(emp.salesByDate.values()).reduce((s, v) => s + v, 0);
              const totalPool = totalSales * contributionRate / 100;
              return (
                <tr key={emp.name}>
                  <td style={{ whiteSpace: 'nowrap' }}>{emp.name}</td>
                  {dates.map((d) => {
                    const val = emp.salesByDate.get(d);
                    return (
                      <td key={d} style={{ textAlign: 'right' }}>
                        {val != null ? formatCurrency(val) : ''}
                      </td>
                    );
                  })}
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(totalSales)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(totalPool)}</td>
                </tr>
              );
            })}
            {/* Totals row */}
            <tr className="table-total">
              <td>TOTALS</td>
              {dates.map((d) => (
                <td key={d} style={{ textAlign: 'right' }}>{formatCurrency(dateTotals.get(d) || 0)}</td>
              ))}
              <td style={{ textAlign: 'right' }}>
                {formatCurrency(Array.from(dateTotals.values()).reduce((s, v) => s + v, 0))}
              </td>
              <td style={{ textAlign: 'right' }}>
                {formatCurrency(Array.from(dateTotals.values()).reduce((s, v) => s + v, 0) * contributionRate / 100)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
