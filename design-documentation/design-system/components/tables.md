---
title: Table Components
description: Financial data display tables for Tip Share Pro
last-updated: 2026-01-08
version: 1.0.0
related-files:
  - ../tokens/colors.md
  - ../tokens/typography.md
status: approved
---

# Table Components

## Overview

Tables are central to Tip Share Pro—they display the financial data that restaurant managers need to see at a glance. Every table is optimized for scanability, with clear typography and smart use of the monospace font for numerical alignment.

---

## Table Anatomy

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Table Container (--espresso background, rounded corners)               │
├─────────────────────────────────────────────────────────────────────────┤
│  HEADER    HEADER      HEADER      HEADER         HEADER               │
├─────────────────────────────────────────────────────────────────────────┤
│  Cell      Cell        Cell        Cell           $123.45              │
│  Cell      Cell        Cell        Cell           $234.56              │
│  Cell      Cell        Cell        Cell           $345.67              │
├─────────────────────────────────────────────────────────────────────────┤
│  TOTAL                                            $703.68              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Base Table

### Visual Specs

| Element | Property | Value |
|---------|----------|-------|
| Container | Background | `--espresso` |
| Container | Border | 1px solid `--walnut` |
| Container | Border Radius | `--radius-lg` (12px) |
| Header | Background | `--mahogany` |
| Header | Text | `--stone`, uppercase, 11px |
| Row | Text | `--linen`, 16px |
| Row Hover | Background | `--mahogany` |
| Currency | Font | `--font-mono` |
| Currency | Color | `--brass` |

### CSS Implementation

```css
.table-container {
  background: var(--espresso);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

/* Headers */
.table th {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--stone);
  text-align: left;
  padding: var(--space-3) var(--space-4);
  background: var(--mahogany);
  border-bottom: 1px solid var(--walnut);
  white-space: nowrap;
}

.table th.text-right {
  text-align: right;
}

.table th.text-center {
  text-align: center;
}

/* Cells */
.table td {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--linen);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--walnut);
  vertical-align: middle;
}

.table tr:last-child td {
  border-bottom: none;
}

/* Row hover */
.table tbody tr {
  transition: background-color var(--duration-fast) var(--ease-standard);
}

.table tbody tr:hover td {
  background: var(--mahogany);
}

/* Row selection */
.table tbody tr[data-selected="true"] td {
  background: rgba(212, 164, 32, 0.1);
}

/* Currency cells */
.table .currency,
.table [data-type="currency"] {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--brass);
  text-align: right;
}

/* Number cells */
.table .numeric,
.table [data-type="number"] {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

/* Text muted */
.table .text-muted {
  color: var(--stone);
}
```

---

## Table Variants

### Compact Table

For dense data display:

```css
.table-compact th,
.table-compact td {
  padding: var(--space-2) var(--space-3);
  font-size: 0.875rem;
}

.table-compact th {
  font-size: 0.625rem;
}
```

### Relaxed Table

For fewer rows with more breathing room:

```css
.table-relaxed th,
.table-relaxed td {
  padding: var(--space-4) var(--space-4);
}
```

### Striped Table

Alternating row colors for large datasets:

```css
.table-striped tbody tr:nth-child(even) td {
  background: rgba(42, 35, 24, 0.5);
}

.table-striped tbody tr:hover td {
  background: var(--mahogany);
}
```

---

## Special Row Types

### Total Row

For summary/total rows at the bottom:

```css
.table .total-row td {
  font-weight: 600;
  background: rgba(212, 164, 32, 0.08);
  border-top: 2px solid var(--brass);
  border-bottom: none;
}

.table .total-row .currency {
  font-weight: 600;
  font-size: 1.125rem;
}
```

### Subtotal Row

For intermediate summaries:

```css
.table .subtotal-row td {
  font-weight: 500;
  background: rgba(212, 164, 32, 0.04);
  border-top: 1px solid var(--walnut);
}
```

### Highlighted Row

For drawing attention to specific rows:

```css
.table .highlighted-row td {
  background: rgba(212, 164, 32, 0.1);
  border-left: 3px solid var(--brass);
}
```

### Error Row

For rows with issues:

```css
.table .error-row td {
  background: rgba(199, 75, 75, 0.1);
  border-left: 3px solid var(--sienna);
}
```

---

## Tip Distribution Table

The primary table for displaying tip calculations:

```html
<div class="table-container">
  <table class="table table-distribution">
    <thead>
      <tr>
        <th>Team Member</th>
        <th>Position</th>
        <th class="text-right">Hours</th>
        <th class="text-right">Rate</th>
        <th class="text-right">Points</th>
        <th class="text-right">Tip Share</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Maria Santos</td>
        <td class="text-muted">Server</td>
        <td class="numeric">32.5</td>
        <td class="numeric">1.0x</td>
        <td class="numeric">32.50</td>
        <td class="currency">$558.28</td>
      </tr>
      <!-- More rows... -->
    </tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="2"><strong>Period Total</strong></td>
        <td class="numeric"><strong>127.5</strong></td>
        <td></td>
        <td class="numeric"><strong>145.25</strong></td>
        <td class="currency"><strong>$2,847.50</strong></td>
      </tr>
    </tfoot>
  </table>
</div>
```

```css
.table-distribution .currency {
  min-width: 100px;
}

.table-distribution td:first-child {
  font-weight: 500;
  color: var(--cream);
}
```

---

## Daily Entry Table

For entering daily tip contributions:

```css
.table-daily-entry input {
  background: transparent;
  border: 1px solid transparent;
  padding: var(--space-1) var(--space-2);
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  color: var(--brass);
  text-align: right;
  width: 100px;
  border-radius: var(--radius-sm);
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard);
}

.table-daily-entry input:hover {
  background: var(--midnight);
  border-color: var(--walnut);
}

.table-daily-entry input:focus {
  background: var(--midnight);
  border-color: var(--brass);
  outline: none;
  box-shadow: var(--shadow-glow);
}

.table-daily-entry input::placeholder {
  color: var(--ash);
}
```

---

## Column Types

### Name Column

```css
.col-name {
  font-weight: 500;
  color: var(--cream);
  min-width: 150px;
}
```

### Position Column

```css
.col-position {
  color: var(--stone);
  min-width: 100px;
}
```

### Hours Column

```css
.col-hours {
  font-family: var(--font-mono);
  text-align: right;
  min-width: 60px;
}
```

### Rate Column

```css
.col-rate {
  font-family: var(--font-mono);
  text-align: right;
  min-width: 50px;
  color: var(--linen);
}

.col-rate::after {
  content: 'x';
  opacity: 0.6;
  font-size: 0.75em;
  margin-left: 0.1em;
}
```

### Currency Column

```css
.col-currency {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  text-align: right;
  color: var(--brass);
  min-width: 100px;
}
```

### Date Column

```css
.col-date {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--stone);
  white-space: nowrap;
}
```

### Status Column

```css
.col-status {
  text-align: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge-active {
  background: rgba(45, 155, 110, 0.15);
  color: var(--sage);
}

.status-badge-pending {
  background: rgba(212, 164, 32, 0.15);
  color: var(--brass);
}

.status-badge-closed {
  background: rgba(139, 123, 101, 0.15);
  color: var(--stone);
}
```

---

## Sorting

```css
.table th[data-sortable] {
  cursor: pointer;
  user-select: none;
  transition: color var(--duration-fast) var(--ease-standard);
}

.table th[data-sortable]:hover {
  color: var(--linen);
}

.table th[data-sortable]::after {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: var(--space-1);
  vertical-align: middle;
  opacity: 0.3;
  background-image: url("data:image/svg+xml,...");
}

.table th[data-sort="asc"]::after {
  opacity: 1;
  background-image: url("data:image/svg+xml,..."); /* Up arrow */
}

.table th[data-sort="desc"]::after {
  opacity: 1;
  background-image: url("data:image/svg+xml,..."); /* Down arrow */
}
```

---

## Responsive Tables

### Horizontal Scroll

```css
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: var(--midnight);
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: var(--walnut);
  border-radius: 4px;
}
```

### Sticky First Column

```css
.table-sticky-col th:first-child,
.table-sticky-col td:first-child {
  position: sticky;
  left: 0;
  background: var(--espresso);
  z-index: 1;
}

.table-sticky-col th:first-child {
  background: var(--mahogany);
}

.table-sticky-col tr:hover td:first-child {
  background: var(--mahogany);
}
```

### Card View (Mobile)

For mobile, tables can transform into card stacks:

```css
@media (max-width: 640px) {
  .table-card-mobile thead {
    display: none;
  }

  .table-card-mobile tbody tr {
    display: block;
    background: var(--espresso);
    border: 1px solid var(--walnut);
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-3);
    padding: var(--space-3);
  }

  .table-card-mobile td {
    display: flex;
    justify-content: space-between;
    padding: var(--space-1) 0;
    border: none;
  }

  .table-card-mobile td::before {
    content: attr(data-label);
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--stone);
  }
}
```

---

## Empty State

```html
<div class="table-container">
  <div class="table-empty">
    <svg class="table-empty-icon"><!-- icon --></svg>
    <p class="table-empty-title">No team members yet</p>
    <p class="table-empty-message">Add team members to start calculating tip distribution</p>
    <button class="btn btn-primary">Add Team Member</button>
  </div>
</div>
```

```css
.table-empty {
  text-align: center;
  padding: var(--space-7);
}

.table-empty-icon {
  width: 48px;
  height: 48px;
  color: var(--stone);
  margin-bottom: var(--space-4);
}

.table-empty-title {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--cream);
  margin-bottom: var(--space-2);
}

.table-empty-message {
  color: var(--stone);
  margin-bottom: var(--space-4);
}
```

---

## Loading State

```css
.table-loading {
  position: relative;
  min-height: 200px;
}

.table-loading::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--espresso);
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-skeleton-row {
  animation: skeleton-pulse 1.5s var(--ease-flow) infinite;
}

.table-skeleton-cell {
  height: 16px;
  background: linear-gradient(
    90deg,
    var(--mahogany) 0%,
    var(--walnut) 50%,
    var(--mahogany) 100%
  );
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
}
```

---

## Accessibility

### Table Structure

```html
<table class="table" role="table" aria-label="Tip distribution for Pay Period Jan 1-15">
  <thead>
    <tr>
      <th scope="col">Team Member</th>
      <th scope="col">Position</th>
      <th scope="col" class="text-right">Hours</th>
      <th scope="col" class="text-right">Tip Share</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Maria Santos</th>
      <td>Server</td>
      <td class="numeric">32.5</td>
      <td class="currency">$558.28</td>
    </tr>
  </tbody>
</table>
```

### Sortable Headers

```html
<th scope="col" data-sortable aria-sort="ascending" aria-label="Sort by Hours">
  Hours
</th>
```

---

## Do's and Don'ts

### Do:
- Use monospace font for all numerical data
- Right-align currency and numbers
- Include totals for financial data
- Use hover states for interactive rows
- Provide empty states with clear CTAs

### Don't:
- Mix fonts within numerical columns
- Center-align currency values
- Use zebra striping for small tables (<5 rows)
- Hide critical data on mobile

---

## Related Documentation

- [Typography Tokens](../tokens/typography.md)
- [Color Tokens](../tokens/colors.md)
- [Forms](./forms.md)
