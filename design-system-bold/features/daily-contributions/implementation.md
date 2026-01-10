# Daily Contributions - Implementation Notes

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document provides technical implementation guidance for the Daily Contributions feature.

---

## Data Structures

### Daily Entry Object

```typescript
interface DailyEntry {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  locationId: string;
  entries: ContributionEntry[];
  totals: DailyTotals;
  status: 'draft' | 'saved' | 'locked';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface ContributionEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  jobCategoryId: string;
  jobCategoryName: string;
  salesAmount: number;
  calculatedContribution: number;
  actualContribution: number;
  variance: number;
  notes?: string;
}

interface DailyTotals {
  totalSales: number;
  totalCalculated: number;
  totalActual: number;
  totalVariance: number;
  contributorCount: number;
}
```

### Calculation Context

```typescript
interface ContributionContext {
  contributionRate: number; // From settings (e.g., 0.03)
  contributionMethod: ContributionMethod;
  contributors: Employee[]; // Employees who contribute
}

type ContributionMethod = 'cc_sales' | 'cc_tips' | 'all_tips' | 'all_sales';
```

---

## API Contracts

### GET /api/daily/:date

Retrieve daily entries for a specific date.

**Parameters:**
- `date`: ISO date string (YYYY-MM-DD)
- `locationId`: Location ID (optional, defaults to current)

**Response:**
```json
{
  "date": "2026-01-10",
  "entries": [
    {
      "id": "entry_123",
      "employeeId": "emp_456",
      "employeeName": "Maria Santos",
      "jobCategoryId": "cat_server",
      "jobCategoryName": "Server",
      "salesAmount": 2450.00,
      "calculatedContribution": 73.50,
      "actualContribution": 73.50,
      "variance": 0
    }
  ],
  "totals": {
    "totalSales": 7525.00,
    "totalCalculated": 225.75,
    "totalActual": 231.75,
    "totalVariance": 6.00,
    "contributorCount": 3
  },
  "status": "saved"
}
```

### PUT /api/daily/:date

Save daily entries.

**Request:**
```json
{
  "entries": [
    {
      "employeeId": "emp_456",
      "salesAmount": 2450.00,
      "actualContribution": 73.50
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2026-01-10",
    "entries": [...],
    "totals": {...},
    "status": "saved"
  }
}
```

### GET /api/daily/:date/copy-previous

Get previous day's data for copying.

**Response:**
```json
{
  "previousDate": "2026-01-09",
  "entries": [
    {
      "employeeId": "emp_456",
      "salesAmount": 2300.00
    }
  ],
  "canCopy": true
}
```

---

## Component Architecture

### Page Component

```jsx
// DailyContributionsPage.jsx
function DailyContributionsPage() {
  const [date, setDate] = useState(getToday());
  const [entries, setEntries] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { contributionRate, contributors } = useContributionContext();

  // Load data on date change
  useEffect(() => {
    loadDailyEntries(date);
  }, [date]);

  // Warn on unsaved changes
  useUnsavedChangesWarning(isDirty);

  const handleDateChange = async (newDate) => {
    if (isDirty) {
      const shouldSave = await showUnsavedWarning();
      if (shouldSave) await save();
    }
    setDate(newDate);
  };

  const handleEntryChange = (employeeId, field, value) => {
    setEntries(prev => updateEntry(prev, employeeId, field, value));
    setIsDirty(true);
  };

  return (
    <main className="daily-contributions">
      <PageHeader
        title="Daily Contributions"
        date={date}
        onDateChange={handleDateChange}
        onCopyPrevious={handleCopyPrevious}
        onSave={save}
        isSaving={isSaving}
        isDirty={isDirty}
      />
      <ContributionGrid
        entries={entries}
        contributionRate={contributionRate}
        onChange={handleEntryChange}
      />
      <DailySummary entries={entries} />
    </main>
  );
}
```

### Grid Component

```jsx
// ContributionGrid.jsx
function ContributionGrid({ entries, contributionRate, onChange }) {
  return (
    <table className="contribution-grid" role="grid">
      <thead>
        <tr>
          <th scope="col">Employee</th>
          <th scope="col">Sales</th>
          <th scope="col">Calculated</th>
          <th scope="col">Actual</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => (
          <ContributionRow
            key={entry.employeeId}
            entry={entry}
            contributionRate={contributionRate}
            onChange={(field, value) => onChange(entry.employeeId, field, value)}
          />
        ))}
      </tbody>
    </table>
  );
}
```

### Row Component

```jsx
// ContributionRow.jsx
function ContributionRow({ entry, contributionRate, onChange }) {
  const [sales, setSales] = useState(entry.salesAmount);
  const [actual, setActual] = useState(entry.actualContribution);

  const calculated = sales * contributionRate;
  const variance = actual - calculated;

  const handleSalesChange = (value) => {
    const numValue = parseFloat(value) || 0;
    setSales(numValue);

    const newCalculated = numValue * contributionRate;
    if (actual === entry.calculatedContribution) {
      // Auto-fill actual if not overridden
      setActual(newCalculated);
    }

    onChange('salesAmount', numValue);
    onChange('calculatedContribution', newCalculated);
  };

  const handleActualChange = (value) => {
    const numValue = parseFloat(value) || 0;
    setActual(numValue);
    onChange('actualContribution', numValue);
  };

  return (
    <tr>
      <th scope="row">
        {entry.employeeName}
        <span className="badge">{entry.jobCategoryName}</span>
      </th>
      <td>
        <CurrencyInput
          value={sales}
          onChange={handleSalesChange}
          aria-label={`Sales for ${entry.employeeName}`}
        />
      </td>
      <td aria-live="polite">
        {formatCurrency(calculated)}
      </td>
      <td>
        <CurrencyInput
          value={actual}
          onChange={handleActualChange}
          className="input-editable"
          aria-label={`Actual contribution for ${entry.employeeName}`}
        />
        {variance !== 0 && (
          <VarianceIndicator variance={variance} />
        )}
      </td>
    </tr>
  );
}
```

---

## Calculation Logic

### Contribution Calculation

```javascript
function calculateContribution(salesAmount, rate) {
  // Round to 2 decimal places
  return Math.round(salesAmount * rate * 100) / 100;
}
```

### Totals Calculation

```javascript
function calculateTotals(entries) {
  return entries.reduce((totals, entry) => ({
    totalSales: totals.totalSales + entry.salesAmount,
    totalCalculated: totals.totalCalculated + entry.calculatedContribution,
    totalActual: totals.totalActual + entry.actualContribution,
    totalVariance: totals.totalVariance + (entry.actualContribution - entry.calculatedContribution),
    contributorCount: totals.contributorCount + (entry.salesAmount > 0 ? 1 : 0)
  }), {
    totalSales: 0,
    totalCalculated: 0,
    totalActual: 0,
    totalVariance: 0,
    contributorCount: 0
  });
}
```

---

## State Management

### Local State

```javascript
// useDailyEntries.js
function useDailyEntries(date) {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const savedRef = useRef(null);
  const isDirty = JSON.stringify(entries) !== JSON.stringify(savedRef.current);

  useEffect(() => {
    loadEntries();
  }, [date]);

  const loadEntries = async () => {
    setStatus('loading');
    try {
      const data = await api.get(`/daily/${date}`);
      setEntries(data.entries);
      savedRef.current = data.entries;
      setStatus('loaded');
    } catch (err) {
      setError(err);
      setStatus('error');
    }
  };

  const save = async () => {
    try {
      await api.put(`/daily/${date}`, { entries });
      savedRef.current = entries;
      return true;
    } catch (err) {
      throw err;
    }
  };

  return { entries, setEntries, isDirty, status, error, save, reload: loadEntries };
}
```

### Draft Auto-Save

```javascript
// useAutoDraft.js
function useAutoDraft(key, data, isDirty) {
  // Save draft to localStorage
  useEffect(() => {
    if (isDirty) {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    }
  }, [data, isDirty]);

  // Restore draft on mount
  const restoreDraft = () => {
    const draft = localStorage.getItem(key);
    if (draft) {
      const { data, timestamp } = JSON.parse(draft);
      // Only restore if less than 24 hours old
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        return data;
      }
    }
    return null;
  };

  // Clear draft after successful save
  const clearDraft = () => {
    localStorage.removeItem(key);
  };

  return { restoreDraft, clearDraft };
}
```

---

## Date Navigation

### Date Utilities

```javascript
function getPayPeriodBounds(date, periodConfig) {
  const { type, startDate } = periodConfig;

  switch (type) {
    case 'weekly':
      return getWeekBounds(date, startDate);
    case 'biweekly':
      return getBiweeklyBounds(date, startDate);
    case 'semimonthly':
      return getSemimonthlyBounds(date);
    default:
      throw new Error(`Unknown period type: ${type}`);
  }
}

function canNavigateToDate(targetDate, periodBounds, today) {
  const target = new Date(targetDate);
  const start = new Date(periodBounds.start);
  const end = new Date(periodBounds.end);
  const now = new Date(today);

  // Can't go before period start
  if (target < start) return { allowed: false, reason: 'before_period' };

  // Can't go after today
  if (target > now) return { allowed: false, reason: 'future_date' };

  // Can navigate
  return { allowed: true };
}
```

---

## Copy Previous Day

```javascript
async function copyPreviousDay(currentDate) {
  const previousDate = subtractDays(currentDate, 1);

  // Fetch previous day data
  const previousData = await api.get(`/daily/${previousDate}`);

  if (!previousData.entries.length) {
    throw new Error('No data from previous day to copy');
  }

  // Map to current date entries (preserve employee matching)
  const copiedEntries = previousData.entries.map(entry => ({
    employeeId: entry.employeeId,
    salesAmount: entry.salesAmount,
    calculatedContribution: entry.salesAmount * contributionRate,
    actualContribution: entry.salesAmount * contributionRate,
    variance: 0
  }));

  return copiedEntries;
}
```

---

## Validation

### Entry Validation

```javascript
const entryValidation = {
  salesAmount: {
    required: true,
    min: 0,
    max: 100000,
    message: 'Sales amount must be between $0 and $100,000'
  },
  actualContribution: {
    required: false,
    min: 0,
    max: 10000,
    message: 'Contribution must be between $0 and $10,000'
  }
};

function validateEntry(entry) {
  const errors = {};

  if (entry.salesAmount < 0) {
    errors.salesAmount = 'Amount must be positive';
  }

  if (entry.salesAmount > 100000) {
    errors.salesAmount = 'Amount seems unusually high. Please verify.';
  }

  if (entry.actualContribution < 0) {
    errors.actualContribution = 'Amount must be positive';
  }

  return errors;
}
```

---

## Performance

### Optimistic Updates

```javascript
async function saveEntry(entry) {
  // Update UI immediately
  setEntries(prev => updateEntry(prev, entry));

  try {
    // Save to server
    await api.put(`/daily/${date}`, { entries: [entry] });
  } catch (error) {
    // Rollback on failure
    setEntries(prev => rollbackEntry(prev, entry));
    throw error;
  }
}
```

### Debounced Auto-Calculate

```javascript
const debouncedCalculate = useMemo(
  () => debounce((entries) => {
    const totals = calculateTotals(entries);
    setTotals(totals);
  }, 100),
  []
);
```

---

## Testing

### Unit Tests

```javascript
describe('calculateContribution', () => {
  test('calculates 3% correctly', () => {
    expect(calculateContribution(2450, 0.03)).toBe(73.50);
  });

  test('rounds to 2 decimal places', () => {
    expect(calculateContribution(100.33, 0.03)).toBe(3.01);
  });

  test('handles zero', () => {
    expect(calculateContribution(0, 0.03)).toBe(0);
  });
});

describe('calculateTotals', () => {
  test('sums all entries', () => {
    const entries = [
      { salesAmount: 1000, calculatedContribution: 30, actualContribution: 30 },
      { salesAmount: 2000, calculatedContribution: 60, actualContribution: 65 }
    ];
    const totals = calculateTotals(entries);
    expect(totals.totalSales).toBe(3000);
    expect(totals.totalVariance).toBe(5);
  });
});
```

### Integration Tests

```javascript
describe('Daily Contributions Page', () => {
  test('loads entries for date', async () => {
    render(<DailyContributionsPage />);
    await waitFor(() => {
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    });
  });

  test('calculates contribution on sales change', async () => {
    render(<DailyContributionsPage />);
    const salesInput = screen.getByLabelText('Sales for Maria Santos');
    await userEvent.clear(salesInput);
    await userEvent.type(salesInput, '2500');
    expect(screen.getByText('$75.00')).toBeInTheDocument();
  });
});
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial implementation notes |
