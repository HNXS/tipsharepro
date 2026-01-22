# Table Components - Final Edition

**Version:** 1.0
**Date:** January 15, 2026
**Status:** Active

---

## Table Philosophy

Tables in TipSharePro display critical financial data. They must be:
- **Scannable** — Clear rows, aligned numbers
- **Dark-themed** — Consistent with the overall design
- **Responsive** — Usable on tablets and mobile
- **Accessible** — Proper semantic markup

---

## Distribution Table

The primary table showing tip pool distribution.

### Visual Specification

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  DISTRIBUTION TABLE                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                          │
│  ┌──────────────┬─────────┬────────┬─────────┬──────────┬─────────────┐  │
│  │ EMPLOYEE     │ ROLE    │ HOURS  │ RATE    │ SHARE %  │ RECEIVED    │  │
│  │ #C4B9A4      │ Badge   │ mono   │ mono    │ mono     │ mono        │  │
│  ├──────────────┼─────────┼────────┼─────────┼──────────┼─────────────┤  │
│  │ Maria Santos │ Server  │   32   │  $8.50  │  12.4%   │    $102     │  │
│  │ #F7F3EA      │ Orange  │ right  │ right   │ right    │ right       │  │
│  ├──────────────┼─────────┼────────┼─────────┼──────────┼─────────────┤  │
│  │ James Chen   │ Cook    │   40   │ $16.00  │  18.3%   │    $150     │  │
│  │              │ Green   │        │         │          │             │  │
│  ├──────────────┼─────────┼────────┼─────────┼──────────┼─────────────┤  │
│  │ Ana Rodriguez│ Busser  │   28   │  $7.25  │   5.8%   │     $48     │  │
│  │              │ Cyan    │        │         │          │             │  │
│  ├──────────────┴─────────┴────────┴─────────┴──────────┴─────────────┤  │
│  │ TOTAL                     320              100%          $812      │  │
│  │ #F7F3EA bold                                                       │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Specifications

| Element | Style |
|---------|-------|
| Container bg | `--bg-surface` (#1A1510) |
| Container border | 1px solid `--bg-border` (#3D3225) |
| Container radius | 12px |
| Header bg | `--bg-elevated` (#2A2318) |
| Header text | `--text-secondary` (#C4B9A4) |
| Header font | 12px / 600 / uppercase / 0.05em tracking |
| Row bg | `--bg-surface` (#1A1510) |
| Row hover bg | `--bg-elevated` (#2A2318) |
| Row border | 1px solid `--bg-border` (#3D3225) |
| Cell padding | 12px 16px |
| Text | `--text-primary` (#F7F3EA) |
| Numbers font | JetBrains Mono |
| Total row bg | `--bg-elevated` (#2A2318) |
| Total row text | `--text-primary` / 600 weight |

### CSS

```css
.table-container {
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background: var(--bg-elevated);
}

.table-header th {
  padding: 12px 16px;
  font-family: var(--font-primary);
  font-size: var(--text-label);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  text-align: left;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--bg-border);
}

.table-header th.numeric {
  text-align: right;
}

.table-body tr {
  border-bottom: 1px solid var(--bg-border);
  transition: background-color var(--transition-fast);
}

.table-body tr:hover {
  background: var(--bg-elevated);
}

.table-body tr:last-child {
  border-bottom: none;
}

.table-body td {
  padding: 12px 16px;
  font-family: var(--font-primary);
  font-size: var(--text-body);
  color: var(--text-primary);
  vertical-align: middle;
}

.table-body td.numeric {
  font-family: var(--font-mono);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.table-body td.currency {
  font-family: var(--font-mono);
  text-align: right;
  font-weight: var(--font-medium);
}

/* Total row */
.table-footer {
  background: var(--bg-elevated);
}

.table-footer td {
  padding: 14px 16px;
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  border-top: 2px solid var(--bg-border);
}

/* Editable cells */
.table-body td.editable {
  padding: 8px 12px;
}

.table-body td.editable input {
  width: 100%;
  padding: 6px 10px;
  background: var(--bg-body);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--text-body-sm);
  color: var(--text-primary);
  text-align: right;
}

.table-body td.editable input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}
```

---

## Contribution Summary Table

For pay period contribution summaries.

```
┌──────────────────────────────────────────────────────────────────┐
│ SERVER          │ TOTAL SALES │ CALCULATED │ ACTUAL CONTRIB.    │
├──────────────────────────────────────────────────────────────────┤
│ Maria Santos    │   $4,200    │   $136.50  │      $140.00       │
│ Marcus Williams │   $3,800    │   $123.50  │      $125.00       │
├──────────────────────────────────────────────────────────────────┤
│ TOTAL           │   $8,000    │   $260.00  │      $265.00       │
└──────────────────────────────────────────────────────────────────┘
```

---

## Daily Tip Grid

Calendar-style grid showing daily contributions.

```
┌─────────────────────────────────────────────────────────────────────────┐
│          │ Mon 1/6 │ Tue 1/7 │ Wed 1/8 │ Thu 1/9 │ Fri 1/10 │ Sat 1/11│
├─────────────────────────────────────────────────────────────────────────┤
│ Maria S. │   $42   │   $38   │    —    │   $55   │   $62    │   $71   │
│ Marcus W.│   $38   │   $41   │   $45   │   $48   │    —     │   $68   │
│ Emily D. │    —    │   $35   │   $39   │   $42   │   $58    │   $65   │
├─────────────────────────────────────────────────────────────────────────┤
│ DAILY    │  $80    │  $114   │   $84   │  $145   │  $120    │  $204   │
└─────────────────────────────────────────────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| "—" (no work) | `--text-disabled` |
| Daily totals | `--color-success` or `--text-primary` |

---

## Table States

### Empty State

```css
.table-empty {
  padding: 48px 24px;
  text-align: center;
  color: var(--text-secondary);
}

.table-empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  color: var(--text-tertiary);
}

.table-empty-text {
  font-size: var(--text-body);
  margin-bottom: 16px;
}
```

### Loading State

```css
.table-loading {
  position: relative;
  min-height: 200px;
}

.table-loading::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Skeleton rows */
.table-skeleton-row {
  height: 48px;
  background: linear-gradient(
    90deg,
    var(--bg-surface) 0%,
    var(--bg-elevated) 50%,
    var(--bg-surface) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## Responsive Tables

### Mobile (< 768px)

Option 1: Horizontal scroll
```css
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

Option 2: Card layout
```css
@media (max-width: 767px) {
  .table-card-layout thead {
    display: none;
  }

  .table-card-layout tr {
    display: block;
    margin-bottom: 16px;
    padding: 16px;
    background: var(--bg-surface);
    border: 1px solid var(--bg-border);
    border-radius: var(--radius-md);
  }

  .table-card-layout td {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--bg-border);
  }

  .table-card-layout td::before {
    content: attr(data-label);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
  }
}
```

---

## Print Styles

```css
@media print {
  .table-container {
    background: white;
    border: 1px solid #ccc;
  }

  .table-header {
    background: #f0f0f0;
  }

  .table-header th,
  .table-body td {
    color: #1a1a1a;
    border-bottom: 1px solid #ddd;
  }

  /* Hide wage column for confidentiality */
  .table th.rate-column,
  .table td.rate-column {
    display: none;
  }
}
```

---

## Accessibility

- Use semantic `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`
- Add `scope="col"` to header cells
- Use `aria-sort` for sortable columns
- Ensure focus visible on editable cells
- Add row hover for better tracking

```html
<table class="table" role="table" aria-label="Tip Distribution">
  <thead class="table-header">
    <tr>
      <th scope="col">Employee</th>
      <th scope="col">Role</th>
      <th scope="col" class="numeric">Hours</th>
      <th scope="col" class="numeric">Share %</th>
      <th scope="col" class="numeric">Received</th>
    </tr>
  </thead>
  <tbody class="table-body">
    <!-- rows -->
  </tbody>
</table>
```

---

## Related Files

- [Typography](../tokens/typography.md) — For number formatting
- [Colors](../tokens/colors.md) — For row states
- [Badges](./badges.md) — For role badges in tables
