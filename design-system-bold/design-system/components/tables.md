# TipSharePro Table Components

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

Tables are central to TipSharePro, displaying distribution data, contribution logs, and financial summaries. All tables are designed for data clarity with support for sorting, scrolling, and print optimization.

---

## Table Variants

### Standard Data Table

The default table for displaying structured data.

| Property | Value |
|----------|-------|
| Background | `#FFFFFF` |
| Border Radius | `8px` |
| Shadow | `0 1px 3px rgba(0,0,0,0.1)` |
| Header Background | `#1A4B7C` (Navy) |
| Header Text | `#FFFFFF` |
| Row Border | `1px solid #E5E5E5` |

```css
.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-white);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table th {
  background: var(--color-secondary);
  color: var(--color-white);
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.75rem 1rem;
  text-align: left;
}

.table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-fog);
  color: var(--color-text-primary);
}

.table tr:last-child td {
  border-bottom: none;
}

.table tr:hover {
  background: var(--color-primary-light);
}
```

---

### Distribution Table

The primary table showing tip pool distribution to employees.

**Columns:**
1. Employee Name
2. Location (multi-location only)
3. Job Category (with badge)
4. Hours Worked
5. Hourly Rate (hidden on print)
6. Share %
7. Share Amount
8. Received (whole dollars)

**Note:** The "Basis" column is NEVER shown (proprietary algorithm).

```html
<table class="table table-distribution">
  <thead>
    <tr>
      <th>Employee</th>
      <th>Job Category</th>
      <th>Hours</th>
      <th class="hide-on-print">Rate</th>
      <th>Share %</th>
      <th>Share Amount</th>
      <th>Received</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Maria Santos</td>
      <td><span class="badge badge-server">Server</span></td>
      <td class="text-mono">32.5</td>
      <td class="text-mono hide-on-print">$18.50</td>
      <td class="text-mono">14.2%</td>
      <td class="text-mono">$178.25</td>
      <td class="text-mono text-bold">$178.00</td>
    </tr>
    <tr>
      <td>James Chen</td>
      <td><span class="badge badge-cook">Lead Cook</span></td>
      <td class="text-mono">40.0</td>
      <td class="text-mono hide-on-print">$22.00</td>
      <td class="text-mono">18.6%</td>
      <td class="text-mono">$233.50</td>
      <td class="text-mono text-bold">$234.00</td>
    </tr>
  </tbody>
  <tfoot>
    <tr class="table-total">
      <td colspan="4">Total Pool</td>
      <td class="text-mono">100%</td>
      <td class="text-mono">$1,254.00</td>
      <td class="text-mono text-bold">$1,254.00</td>
    </tr>
  </tfoot>
</table>
```

```css
.table-distribution .text-mono {
  font-family: 'JetBrains Mono', monospace;
  text-align: right;
}

.table-distribution .text-bold {
  font-weight: 600;
}

.table-total {
  background: var(--color-stone);
  font-weight: 600;
}

.table-total td {
  border-top: 2px solid var(--color-fog);
}

/* Hide wage column when printing */
@media print {
  .hide-on-print {
    display: none !important;
  }
}
```

---

### Daily Contribution Grid

Matrix showing servers (columns) × dates (rows) for daily entry.

```html
<table class="table table-grid">
  <thead>
    <tr>
      <th>Date</th>
      <th>Maria S.</th>
      <th>John D.</th>
      <th>Sarah K.</th>
      <th>Daily Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Jan 1</td>
      <td class="cell-editable">
        <input type="number" value="125.00" class="grid-input">
      </td>
      <td class="cell-editable">
        <input type="number" value="98.50" class="grid-input">
      </td>
      <td class="cell-editable">
        <input type="number" value="142.00" class="grid-input">
      </td>
      <td class="cell-total text-mono">$365.50</td>
    </tr>
    <!-- More rows... -->
  </tbody>
  <tfoot>
    <tr class="table-total">
      <td>Period Total</td>
      <td class="text-mono">$875.00</td>
      <td class="text-mono">$692.50</td>
      <td class="text-mono">$994.00</td>
      <td class="text-mono text-bold">$2,561.50</td>
    </tr>
  </tfoot>
</table>
```

```css
.table-grid .grid-input {
  width: 100%;
  padding: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  text-align: right;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
}

.table-grid .grid-input:focus {
  border-color: var(--color-primary);
  background: var(--color-white);
  outline: none;
}

.table-grid .cell-editable {
  background: var(--color-success-light);
}

.table-grid .cell-total {
  background: var(--color-stone);
  font-weight: 600;
}
```

---

### PPE Summary Table

Pay Period Ending summary showing server contributions.

```html
<table class="table table-ppe">
  <thead>
    <tr>
      <th>Server</th>
      <th>Total Sales</th>
      <th>Calc. Contribution</th>
      <th>Actual Contribution</th>
      <th>Attested</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Maria Santos</td>
      <td class="text-mono">$4,250.00</td>
      <td class="text-mono text-muted">$127.50</td>
      <td class="text-mono">$125.00</td>
      <td class="cell-attested">
        <span class="checkmark">✓</span>
        <span class="initials">MS</span>
      </td>
    </tr>
  </tbody>
</table>
```

```css
.table-ppe .text-muted {
  color: var(--color-text-muted);
}

.table-ppe .cell-attested {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-ppe .checkmark {
  color: var(--color-success);
  font-weight: bold;
}

.table-ppe .initials {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}
```

---

### YTD Report Table

Year-to-date summary for W2 reporting.

```html
<table class="table table-ytd">
  <thead>
    <tr>
      <th>Employee</th>
      <th>Total Hours</th>
      <th>Total Contributed</th>
      <th>Total Received</th>
      <th>Net +/-</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Maria Santos (Server)</td>
      <td class="text-mono">1,456.5</td>
      <td class="text-mono text-negative">-$8,250.00</td>
      <td class="text-mono text-positive">+$6,125.00</td>
      <td class="text-mono text-negative">-$2,125.00</td>
    </tr>
    <tr>
      <td>James Chen (Lead Cook)</td>
      <td class="text-mono">1,820.0</td>
      <td class="text-mono">$0.00</td>
      <td class="text-mono text-positive">+$12,450.00</td>
      <td class="text-mono text-positive">+$12,450.00</td>
    </tr>
  </tbody>
</table>
```

```css
.table-ytd .text-positive {
  color: var(--color-success);
}

.table-ytd .text-negative {
  color: var(--color-error);
}
```

---

## Table Features

### Sortable Columns

```css
.table th.sortable {
  cursor: pointer;
  user-select: none;
}

.table th.sortable:hover {
  background: var(--color-secondary-hover);
}

.table th.sortable::after {
  content: '⇅';
  margin-left: 0.5rem;
  opacity: 0.5;
}

.table th.sorted-asc::after {
  content: '↑';
  opacity: 1;
}

.table th.sorted-desc::after {
  content: '↓';
  opacity: 1;
}
```

### Horizontal Scroll (Mobile)

```css
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-wrapper .table {
  min-width: 600px;
}
```

### Sticky Header

```css
.table-sticky thead {
  position: sticky;
  top: 0;
  z-index: 10;
}
```

### Row Selection

```css
.table tr.selected {
  background: var(--color-primary-light);
}

.table tr.selected td:first-child {
  border-left: 3px solid var(--color-primary);
}
```

---

## Print Optimization

```css
@media print {
  .table {
    box-shadow: none;
    border: 1px solid #000;
  }

  .table th {
    background: #333 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .table tr {
    page-break-inside: avoid;
  }

  .hide-on-print {
    display: none !important;
  }

  /* Ensure readable on paper */
  .table td,
  .table th {
    font-size: 10pt;
    padding: 0.5rem;
  }
}
```

---

## Responsive Behavior

### Mobile Stack

For complex tables on small screens:

```css
@media (max-width: 640px) {
  .table-responsive thead {
    display: none;
  }

  .table-responsive tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid var(--color-fog);
    border-radius: 8px;
  }

  .table-responsive td {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-fog);
  }

  .table-responsive td::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--color-text-secondary);
  }
}
```

---

## Accessibility

- Use `<th scope="col">` for column headers
- Use `<th scope="row">` for row headers
- Include `<caption>` for table description
- Ensure sufficient color contrast
- Support keyboard navigation for sortable columns

```html
<table class="table" role="grid" aria-label="Tip Distribution Report">
  <caption class="sr-only">
    Pay period distribution for January 1-15, 2026
  </caption>
  <thead>
    <tr>
      <th scope="col">Employee</th>
      <th scope="col">Share Amount</th>
    </tr>
  </thead>
  <!-- ... -->
</table>
```

---

## Usage Guidelines

### DO
- Right-align numeric data
- Use monospace font for currency/numbers
- Include totals row for financial data
- Provide clear column headers
- Hide sensitive data on print (wages)

### DON'T
- Don't show the Basis column (proprietary)
- Don't show weights on posted distribution
- Don't allow editing of calculated fields
- Don't use horizontal scroll on desktop

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial table specifications |
