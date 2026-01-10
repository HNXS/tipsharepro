# PPE Distribution - Accessibility

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document details accessibility requirements and implementation for the PPE Distribution feature, ensuring WCAG 2.1 Level AA compliance for this data display interface.

---

## Page Structure

### Semantic HTML

```html
<main id="main-content" aria-labelledby="page-title">
  <header class="page-header">
    <button class="btn-back" aria-label="Back to Navigation Hub">
      <svg aria-hidden="true"><!-- arrow --></svg>
    </button>
    <h1 id="page-title">PPE Distribution</h1>
    <div class="period-selector">
      <label id="period-label" class="sr-only">Select pay period</label>
      <select aria-labelledby="period-label">
        <option>Jan 1-15, 2026</option>
      </select>
    </div>
  </header>

  <section aria-labelledby="summary-heading">
    <h2 id="summary-heading" class="sr-only">Distribution Summary</h2>
    <!-- Summary cards -->
  </section>

  <section aria-labelledby="table-heading">
    <h2 id="table-heading" class="sr-only">Distribution Details</h2>
    <!-- Distribution table -->
  </section>
</main>
```

### Skip Links

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<a href="#distribution-table" class="skip-link">Skip to distribution table</a>
```

---

## Distribution Table Accessibility

### Table Structure

```html
<table id="distribution-table"
       class="distribution-table"
       aria-label="Tip distribution for January 1 through 15, 2026"
       aria-describedby="table-caption">

  <caption id="table-caption" class="sr-only">
    Distribution of $2,847.00 tip pool among 12 employees for pay period
    January 1 through 15, 2026. Columns show employee name, job category,
    hours worked, share percentage, and amount received.
  </caption>

  <thead>
    <tr>
      <th scope="col" id="col-employee">Employee</th>
      <th scope="col" id="col-category">Category</th>
      <th scope="col" id="col-hours" class="text-right">Hours</th>
      <th scope="col" id="col-rate" class="text-right hide-employee-view">Rate</th>
      <th scope="col" id="col-share" class="text-right">Share %</th>
      <th scope="col" id="col-amount" class="text-right">Amount</th>
      <th scope="col" id="col-received" class="text-right">Received</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row" id="row-maria" headers="col-employee">
        Maria Santos
      </th>
      <td headers="col-category row-maria">
        <span class="badge badge-server">Server</span>
      </td>
      <td headers="col-hours row-maria" class="text-right text-mono">
        32.5
      </td>
      <td headers="col-rate row-maria" class="text-right text-mono hide-employee-view">
        $18.50
      </td>
      <td headers="col-share row-maria" class="text-right text-mono">
        14.2%
      </td>
      <td headers="col-amount row-maria" class="text-right text-mono">
        $404.26
      </td>
      <td headers="col-received row-maria" class="text-right text-mono font-bold">
        $404
      </td>
    </tr>
    <!-- More rows -->
  </tbody>

  <tfoot>
    <tr class="total-row">
      <th scope="row" colspan="2">Total</th>
      <td headers="col-hours" class="text-right text-mono">452.5</td>
      <td headers="col-rate" class="text-right hide-employee-view">—</td>
      <td headers="col-share" class="text-right text-mono">100%</td>
      <td headers="col-amount" class="text-right text-mono">$2,847.00</td>
      <td headers="col-received" class="text-right text-mono font-bold">$2,847</td>
    </tr>
  </tfoot>
</table>
```

### Sortable Columns

```html
<th scope="col"
    id="col-hours"
    aria-sort="none"
    class="sortable">
  <button aria-label="Sort by hours worked">
    Hours
    <span aria-hidden="true" class="sort-indicator">⇅</span>
  </button>
</th>

<!-- When sorted ascending -->
<th scope="col"
    id="col-hours"
    aria-sort="ascending"
    class="sortable sorted">
  <button aria-label="Sort by hours worked, currently ascending">
    Hours
    <span aria-hidden="true" class="sort-indicator">↑</span>
  </button>
</th>
```

---

## Summary Cards Accessibility

### Card Structure

```html
<section aria-labelledby="summary-heading" class="summary-cards">
  <h2 id="summary-heading" class="sr-only">Distribution Summary</h2>

  <div class="stat-card" role="group" aria-labelledby="total-label">
    <span id="total-label" class="stat-label">Total Pool</span>
    <span class="stat-value" aria-describedby="total-label">$2,847</span>
  </div>

  <div class="stat-card" role="group" aria-labelledby="recipients-label">
    <span id="recipients-label" class="stat-label">Recipients</span>
    <span class="stat-value" aria-describedby="recipients-label">12</span>
  </div>

  <div class="stat-card" role="group" aria-labelledby="avg-label">
    <span id="avg-label" class="stat-label">Average Share</span>
    <span class="stat-value" aria-describedby="avg-label">$237</span>
  </div>

  <div class="stat-card" role="group" aria-labelledby="days-label">
    <span id="days-label" class="stat-label">Days in Period</span>
    <span class="stat-value" aria-describedby="days-label">15</span>
  </div>
</section>
```

---

## !!Note Modal Accessibility

### Alert Dialog Implementation

```html
<div role="alertdialog"
     aria-modal="true"
     aria-labelledby="modal-title"
     aria-describedby="modal-content"
     class="modal modal-critical">

  <div class="modal-header">
    <span class="critical-badge" aria-hidden="true">!!</span>
    <h2 id="modal-title">Wage Confidentiality Notice</h2>
  </div>

  <div id="modal-content" class="modal-body">
    <div class="critical-content">
      <p>
        <strong>Important:</strong> The hourly wage rates displayed in this
        distribution report are confidential employee information.
      </p>
      <ul>
        <li>Do not share wage data with employees</li>
        <li>Use "Employee View" for posting</li>
        <li>Exported PDFs can exclude wage data</li>
      </ul>
    </div>

    <div class="acknowledgment-group">
      <input type="checkbox"
             id="acknowledge-checkbox"
             required
             aria-describedby="ack-help">
      <label for="acknowledge-checkbox">
        I understand that wage information is confidential and will handle it appropriately
      </label>
      <p id="ack-help" class="sr-only">
        You must check this box to continue viewing the distribution with wage data
      </p>
    </div>
  </div>

  <div class="modal-footer">
    <button id="continue-btn"
            class="btn btn-primary"
            disabled
            aria-describedby="continue-help">
      Continue
    </button>
    <p id="continue-help" class="sr-only">
      Button will be enabled after checking the acknowledgment box
    </p>
  </div>
</div>
```

### Focus Management

```javascript
function openCriticalModal(modal) {
  // Store trigger element
  const trigger = document.activeElement;

  // Show modal
  modal.hidden = false;
  document.body.classList.add('modal-open');

  // Trap focus
  const focusables = modal.querySelectorAll(
    'button, input, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusables[0];
  const lastFocusable = focusables[focusables.length - 1];

  // Focus first element (checkbox)
  firstFocusable.focus();

  // Trap focus within modal
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
    // Note: Escape is intentionally NOT handled for critical modals
  });

  // Store for cleanup
  modal._trigger = trigger;
}

function closeCriticalModal(modal) {
  modal.hidden = true;
  document.body.classList.remove('modal-open');

  // Return focus to trigger
  if (modal._trigger) {
    modal._trigger.focus();
  }
}
```

---

## View Toggle Accessibility

### Toggle Implementation

```html
<fieldset class="view-toggle" role="radiogroup" aria-label="Distribution view">
  <label class="toggle-option">
    <input type="radio"
           name="view"
           value="admin"
           checked
           aria-describedby="admin-desc">
    <span>Admin View</span>
  </label>
  <span id="admin-desc" class="sr-only">
    Shows all columns including hourly wage rates
  </span>

  <label class="toggle-option">
    <input type="radio"
           name="view"
           value="employee"
           aria-describedby="employee-desc">
    <span>Employee View</span>
  </label>
  <span id="employee-desc" class="sr-only">
    Hides hourly wage rates for privacy
  </span>
</fieldset>
```

### View Change Announcement

```html
<div aria-live="polite" aria-atomic="true" id="view-announcer" class="sr-only">
  <!-- "Now showing Employee View. Wage data is hidden." -->
</div>
```

```javascript
function announceViewChange(view) {
  const announcer = document.getElementById('view-announcer');
  if (view === 'employee') {
    announcer.textContent = 'Now showing Employee View. Wage data is hidden for privacy.';
  } else {
    announcer.textContent = 'Now showing Admin View with all columns including wage data.';
  }
}
```

---

## Export Menu Accessibility

### Menu Implementation

```html
<div class="export-menu">
  <button id="export-trigger"
          aria-haspopup="menu"
          aria-expanded="false"
          aria-controls="export-options">
    Export
    <svg aria-hidden="true"><!-- dropdown icon --></svg>
  </button>

  <ul id="export-options"
      role="menu"
      aria-labelledby="export-trigger"
      hidden>
    <li role="none">
      <button role="menuitem" data-export="pdf-full">
        PDF (Full)
        <span class="sr-only">Includes wage data, for internal use</span>
      </button>
    </li>
    <li role="none">
      <button role="menuitem" data-export="pdf-employee">
        PDF (Employee)
        <span class="sr-only">Excludes wage data, safe to share</span>
      </button>
    </li>
    <li role="none">
      <button role="menuitem" data-export="print">
        Print
        <span class="sr-only">Excludes wage data</span>
      </button>
    </li>
    <li role="none">
      <button role="menuitem" data-export="csv">
        CSV
        <span class="sr-only">Includes wage data, for payroll systems</span>
      </button>
    </li>
  </ul>
</div>
```

### Export Status Announcements

```javascript
function announceExportStatus(status, filename) {
  const announcer = document.getElementById('export-announcer');

  switch (status) {
    case 'generating':
      announcer.textContent = 'Generating export, please wait.';
      break;
    case 'complete':
      announcer.textContent = `Export complete. ${filename} has been downloaded.`;
      break;
    case 'error':
      announcer.setAttribute('aria-live', 'assertive');
      announcer.textContent = 'Export failed. Please try again.';
      break;
  }
}
```

---

## Color & Contrast

### Text Contrast

| Element | Foreground | Background | Ratio |
|---------|------------|------------|-------|
| Employee name | #292524 | #FFFFFF | 13.5:1 |
| Table data | #292524 | #FFFFFF | 13.5:1 |
| Table header | #FFFFFF | #1A4B7C | 10.2:1 |
| Total row | #292524 | #F5F5F4 | 12.8:1 |
| Badge text (Server) | #35A0D2 | light blue | 4.5:1 |

### Badge Accessibility

Don't rely on badge color alone:

```html
<td>
  <span class="badge badge-server">Server</span>
  <!-- Badge includes text label, not just color -->
</td>
```

---

## Mobile Accessibility

### Responsive Table

On mobile, table converts to stacked cards:

```html
<div class="distribution-card" role="article" aria-labelledby="card-maria">
  <h3 id="card-maria">Maria Santos</h3>
  <dl>
    <dt>Category</dt>
    <dd><span class="badge badge-server">Server</span></dd>

    <dt>Hours Worked</dt>
    <dd>32.5</dd>

    <dt>Share Percentage</dt>
    <dd>14.2%</dd>

    <dt>Amount Received</dt>
    <dd>$404</dd>
  </dl>
</div>
```

### Touch Targets

All interactive elements ≥ 44×44px on mobile.

---

## Screen Reader Testing

### Expected Announcements

| Action | NVDA Announcement |
|--------|-------------------|
| Page load | "PPE Distribution, heading level 1" |
| Table navigation | "Table with 12 rows, 7 columns. Employee, column header" |
| Row read | "Maria Santos, row 1. Server. 32.5 hours. 14.2%. $404 received" |
| View toggle | "Employee View, radio button, 2 of 2" |
| Export menu | "Export, button, has popup menu" |
| Modal open | "Wage Confidentiality Notice, alert dialog" |

---

## Testing Checklist

### Keyboard Testing
- [ ] All controls reachable via Tab
- [ ] Table sortable via keyboard
- [ ] View toggle via keyboard
- [ ] Export menu navigable
- [ ] Modal focus trapped
- [ ] Period selector accessible

### Screen Reader Testing
- [ ] Page structure announced
- [ ] Table headers associated
- [ ] Summary stats readable
- [ ] Badges have text labels
- [ ] View change announced
- [ ] Export status announced

### Visual Testing
- [ ] Focus indicators visible
- [ ] Contrast ratios pass
- [ ] 200% zoom works
- [ ] Print view hides wage data

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial accessibility documentation |
