# PPE Distribution - Implementation Notes

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document provides technical implementation guidance for the PPE Distribution feature.

---

## Data Structures

### Distribution Object

```typescript
interface Distribution {
  id: string;
  periodId: string;
  periodStart: string;
  periodEnd: string;
  locationId: string;
  totalPool: number;
  totalHours: number;
  recipientCount: number;
  entries: DistributionEntry[];
  status: 'draft' | 'final' | 'posted';
  calculatedAt: string;
  postedAt?: string;
  postedBy?: string;
}

interface DistributionEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  jobCategoryId: string;
  jobCategoryName: string;
  hours: number;
  hourlyRate: number;
  weight: number;
  basis: number; // NEVER exposed to UI
  sharePercentage: number;
  shareAmount: number;
  receivedAmount: number; // Rounded to whole dollars
}

interface DistributionSummary {
  totalPool: number;
  recipientCount: number;
  averageShare: number;
  periodDays: number;
  highestShare: DistributionEntry;
  lowestShare: DistributionEntry;
}
```

---

## API Contracts

### GET /api/distribution/:periodId

Retrieve distribution for a specific pay period.

**Parameters:**
- `periodId`: Pay period identifier
- `view`: 'admin' | 'employee' (optional, defaults to user's max access)

**Response (Admin View):**
```json
{
  "id": "dist_123",
  "periodId": "period_456",
  "periodStart": "2026-01-01",
  "periodEnd": "2026-01-15",
  "totalPool": 2847.00,
  "totalHours": 452.5,
  "recipientCount": 12,
  "status": "posted",
  "calculatedAt": "2026-01-16T08:30:00Z",
  "entries": [
    {
      "id": "entry_789",
      "employeeId": "emp_123",
      "employeeName": "Maria Santos",
      "jobCategoryId": "cat_server",
      "jobCategoryName": "Server",
      "hours": 32.5,
      "hourlyRate": 18.50,
      "weight": 1.00,
      "sharePercentage": 14.2,
      "shareAmount": 404.26,
      "receivedAmount": 404
    }
  ]
}
```

**Response (Employee View):**
Same structure but `hourlyRate` and `weight` are omitted.

**Note:** The `basis` field is NEVER included in API responses.

### GET /api/distribution/periods

List available pay periods with distribution status.

**Response:**
```json
{
  "periods": [
    {
      "id": "period_456",
      "start": "2026-01-01",
      "end": "2026-01-15",
      "hasDistribution": true,
      "status": "posted"
    },
    {
      "id": "period_455",
      "start": "2025-12-15",
      "end": "2025-12-31",
      "hasDistribution": true,
      "status": "posted"
    }
  ]
}
```

### POST /api/distribution/:periodId/export

Generate export file.

**Request:**
```json
{
  "format": "pdf",
  "view": "employee",
  "includeHeader": true
}
```

**Response:**
```json
{
  "downloadUrl": "/api/exports/dist_123_employee.pdf",
  "expiresAt": "2026-01-16T09:30:00Z"
}
```

---

## Distribution Calculation

### Algorithm Overview

**IMPORTANT:** The exact basis calculation is proprietary and simplified here.

```javascript
function calculateDistribution(contributions, employees, settings) {
  const { contributionRate, weights } = settings;

  // 1. Calculate total pool
  const totalPool = contributions.reduce((sum, c) => sum + c.actualContribution, 0);

  // 2. Calculate basis for each eligible employee
  const entries = employees.map(emp => {
    const hours = getEmployeeHours(emp.id, contributions);
    const rate = emp.hourlyRate;
    const weight = weights[emp.jobCategoryId] || 1.0;

    // Proprietary calculation
    const basis = calculateBasis(hours, rate, weight);

    return {
      employeeId: emp.id,
      employeeName: emp.name,
      jobCategoryId: emp.jobCategoryId,
      jobCategoryName: emp.jobCategory,
      hours,
      hourlyRate: rate,
      weight,
      basis // Internal only
    };
  });

  // 3. Calculate total basis
  const totalBasis = entries.reduce((sum, e) => sum + e.basis, 0);

  // 4. Calculate shares
  const distributionEntries = entries.map(entry => {
    const sharePercentage = (entry.basis / totalBasis) * 100;
    const shareAmount = totalPool * (entry.basis / totalBasis);
    const receivedAmount = roundToWholeDollar(shareAmount);

    return {
      ...entry,
      sharePercentage: Math.round(sharePercentage * 10) / 10,
      shareAmount: Math.round(shareAmount * 100) / 100,
      receivedAmount,
      basis: undefined // Remove before returning
    };
  });

  // 5. Adjust rounding to match total pool
  const adjustedEntries = adjustRounding(distributionEntries, totalPool);

  return {
    totalPool,
    totalHours: entries.reduce((sum, e) => sum + e.hours, 0),
    recipientCount: entries.length,
    entries: adjustedEntries
  };
}

// Proprietary rounding algorithm
function roundToWholeDollar(amount) {
  // Implementation hidden
  return Math.round(amount);
}

// Adjust to ensure total matches pool
function adjustRounding(entries, totalPool) {
  // Implementation hidden
  return entries;
}
```

---

## Component Architecture

### Page Component

```jsx
// DistributionPage.jsx
function DistributionPage() {
  const [periodId, setPeriodId] = useState(getCurrentPeriodId());
  const [view, setView] = useState('admin');
  const [showWageNotice, setShowWageNotice] = useState(false);

  const { data: distribution, isLoading, error } = useDistribution(periodId, view);
  const { user } = useAuth();

  // Check wage notice requirement
  useEffect(() => {
    if (view === 'admin' && !hasAcknowledgedWageNotice()) {
      setShowWageNotice(true);
    }
  }, [view]);

  const handleViewChange = (newView) => {
    if (newView === 'admin' && !hasAcknowledgedWageNotice()) {
      setShowWageNotice(true);
    } else {
      setView(newView);
    }
  };

  const handleWageAcknowledge = () => {
    acknowledgeWageNotice();
    setShowWageNotice(false);
    setView('admin');
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!distribution) return <EmptyState />;

  return (
    <main className="distribution-page">
      <PageHeader
        title="PPE Distribution"
        periodId={periodId}
        onPeriodChange={setPeriodId}
        view={view}
        onViewChange={handleViewChange}
        onExport={handleExport}
      />

      <SummaryCards distribution={distribution} />

      <DistributionTable
        entries={distribution.entries}
        view={view}
        totalPool={distribution.totalPool}
      />

      {showWageNotice && (
        <WageConfidentialityModal
          onAcknowledge={handleWageAcknowledge}
        />
      )}
    </main>
  );
}
```

### Distribution Table Component

```jsx
// DistributionTable.jsx
function DistributionTable({ entries, view, totalPool }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const sortedEntries = useMemo(() => {
    if (!sortColumn) return entries;

    return [...entries].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [entries, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <table className="distribution-table" aria-label="Tip distribution">
      <thead>
        <tr>
          <SortableHeader
            column="employeeName"
            label="Employee"
            sorted={sortColumn === 'employeeName'}
            direction={sortDirection}
            onSort={handleSort}
          />
          <th>Category</th>
          <SortableHeader
            column="hours"
            label="Hours"
            sorted={sortColumn === 'hours'}
            direction={sortDirection}
            onSort={handleSort}
          />
          {view === 'admin' && <th className="hide-on-print">Rate</th>}
          <SortableHeader
            column="sharePercentage"
            label="Share %"
            sorted={sortColumn === 'sharePercentage'}
            direction={sortDirection}
            onSort={handleSort}
          />
          <th>Amount</th>
          <SortableHeader
            column="receivedAmount"
            label="Received"
            sorted={sortColumn === 'receivedAmount'}
            direction={sortDirection}
            onSort={handleSort}
          />
        </tr>
      </thead>
      <tbody>
        {sortedEntries.map(entry => (
          <DistributionRow key={entry.id} entry={entry} view={view} />
        ))}
      </tbody>
      <tfoot>
        <TotalRow entries={entries} view={view} totalPool={totalPool} />
      </tfoot>
    </table>
  );
}
```

---

## Wage Notice Management

### Storage

```javascript
const WAGE_NOTICE_KEY = 'tsp_wage_notice_acknowledged';
const WAGE_NOTICE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

function hasAcknowledgedWageNotice() {
  const acknowledged = localStorage.getItem(WAGE_NOTICE_KEY);
  if (!acknowledged) return false;

  const timestamp = parseInt(acknowledged, 10);
  const elapsed = Date.now() - timestamp;

  return elapsed < WAGE_NOTICE_EXPIRY;
}

function acknowledgeWageNotice() {
  localStorage.setItem(WAGE_NOTICE_KEY, Date.now().toString());
}
```

### Modal Component

```jsx
// WageConfidentialityModal.jsx
function WageConfidentialityModal({ onAcknowledge }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const checkboxRef = useRef(null);

  // Focus checkbox on mount
  useEffect(() => {
    checkboxRef.current?.focus();
  }, []);

  return (
    <div className="modal-overlay" role="alertdialog" aria-modal="true">
      <div className="modal modal-critical">
        <div className="modal-header">
          <span className="critical-badge">!!</span>
          <h2>Wage Confidentiality Notice</h2>
        </div>

        <div className="modal-body">
          <div className="critical-content">
            <p><strong>Important:</strong> The hourly wage rates...</p>
            <ul>
              <li>Do not share wage data with employees</li>
              <li>Use "Employee View" for posting</li>
              <li>Exported PDFs can exclude wage data</li>
            </ul>
          </div>

          <label className="critical-acknowledgment">
            <input
              ref={checkboxRef}
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
            />
            <span>I understand that wage information is confidential...</span>
          </label>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-primary"
            disabled={!acknowledged}
            onClick={onAcknowledge}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Export Implementation

### PDF Generation

```javascript
async function exportPDF(distribution, options) {
  const { view, includeHeader } = options;

  // Filter data based on view
  const exportData = prepareExportData(distribution, view);

  // Generate PDF (using library like jsPDF or server-side)
  const pdf = await generatePDF({
    title: 'Tip Distribution Report',
    subtitle: `Pay Period: ${distribution.periodStart} - ${distribution.periodEnd}`,
    data: exportData,
    includeHeader,
    includeFooter: true,
    footerText: 'Confidential - For Internal Use Only'
  });

  // Trigger download
  downloadFile(pdf, `distribution-${distribution.periodId}.pdf`);
}

function prepareExportData(distribution, view) {
  return distribution.entries.map(entry => ({
    employee: entry.employeeName,
    category: entry.jobCategoryName,
    hours: entry.hours,
    ...(view === 'admin' && { rate: entry.hourlyRate }),
    sharePercent: `${entry.sharePercentage}%`,
    amount: formatCurrency(entry.shareAmount),
    received: formatCurrency(entry.receivedAmount)
  }));
}
```

### Print Styles

```css
@media print {
  /* Hide non-essential elements */
  .page-header-actions,
  .view-toggle,
  .period-selector,
  .no-print {
    display: none !important;
  }

  /* Always hide rate column on print */
  .hide-on-print {
    display: none !important;
  }

  /* Reset backgrounds for print */
  body {
    background: white;
  }

  .distribution-table {
    box-shadow: none;
    border: 1px solid #000;
  }

  .distribution-table th {
    background: #333 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Prevent row breaks */
  .distribution-table tr {
    page-break-inside: avoid;
  }

  /* Add print header */
  .print-header {
    display: block !important;
  }
}
```

---

## Testing

### Unit Tests

```javascript
describe('Distribution Calculation', () => {
  test('calculates share percentages correctly', () => {
    const entries = [
      { basis: 100 },
      { basis: 200 },
      { basis: 300 }
    ];

    const shares = calculateShares(entries);

    expect(shares[0].sharePercentage).toBeCloseTo(16.67, 1);
    expect(shares[1].sharePercentage).toBeCloseTo(33.33, 1);
    expect(shares[2].sharePercentage).toBeCloseTo(50.00, 1);
  });

  test('rounds received amounts to whole dollars', () => {
    const amount = 404.26;
    const received = roundToWholeDollar(amount);
    expect(received).toBe(404);
  });
});
```

### Integration Tests

```javascript
describe('Distribution Page', () => {
  test('shows wage notice for admin view', async () => {
    localStorage.clear();
    render(<DistributionPage />);

    // Click admin view toggle
    await userEvent.click(screen.getByLabelText('Admin View'));

    // Modal should appear
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  test('hides rate column in employee view', async () => {
    render(<DistributionPage defaultView="employee" />);

    await waitFor(() => {
      expect(screen.queryByText('Rate')).not.toBeInTheDocument();
    });
  });
});
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial implementation notes |
