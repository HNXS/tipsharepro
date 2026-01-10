# Daily Contributions - Accessibility

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document details accessibility requirements and implementation for the Daily Contributions feature, ensuring WCAG 2.1 Level AA compliance for this data entry interface.

---

## Page Structure

### Semantic HTML

```html
<main id="main-content" aria-labelledby="page-title">
  <header class="page-header">
    <button class="btn-back" aria-label="Back to Navigation Hub">
      <svg aria-hidden="true"><!-- arrow --></svg>
    </button>
    <h1 id="page-title">Daily Contributions</h1>
    <nav aria-label="Date navigation" class="date-navigator">
      <button aria-label="Previous day, January 9, 2026">
        <svg aria-hidden="true"><!-- left arrow --></svg>
      </button>
      <span aria-live="polite" aria-atomic="true">January 10, 2026</span>
      <button aria-label="Next day, January 11, 2026">
        <svg aria-hidden="true"><!-- right arrow --></svg>
      </button>
    </nav>
  </header>

  <section aria-labelledby="entry-heading">
    <h2 id="entry-heading" class="sr-only">Contribution Entry</h2>
    <!-- Data grid -->
  </section>

  <section aria-labelledby="summary-heading">
    <h2 id="summary-heading">Daily Summary</h2>
    <!-- Summary content -->
  </section>
</main>
```

### Skip Links

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<a href="#entry-grid" class="skip-link">Skip to data entry</a>
```

---

## Data Grid Accessibility

### Grid Role Implementation

```html
<table class="contribution-grid"
       role="grid"
       aria-label="Daily contribution entry for January 10, 2026"
       aria-describedby="grid-instructions">

  <caption class="sr-only">
    Enter sales and tip contributions for each employee
  </caption>

  <thead>
    <tr>
      <th scope="col" id="col-employee">Employee</th>
      <th scope="col" id="col-sales">Sales</th>
      <th scope="col" id="col-calc">Calculated</th>
      <th scope="col" id="col-actual">Actual Contribution</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row" id="row-maria">
        Maria Santos
        <span class="employee-role">Server</span>
      </th>
      <td headers="col-sales row-maria">
        <label for="sales-maria" class="sr-only">Sales for Maria Santos</label>
        <input id="sales-maria"
               type="text"
               inputmode="decimal"
               aria-describedby="sales-help"
               value="$2,450.00">
      </td>
      <td headers="col-calc row-maria" aria-live="polite">
        $73.50
      </td>
      <td headers="col-actual row-maria">
        <label for="actual-maria" class="sr-only">Actual contribution for Maria Santos</label>
        <input id="actual-maria"
               type="text"
               inputmode="decimal"
               class="input-editable"
               aria-describedby="actual-help"
               value="$73.50">
      </td>
    </tr>
  </tbody>
</table>

<p id="grid-instructions" class="sr-only">
  Use Tab to move between fields. Enter sales amounts and the contribution will be calculated automatically.
  You can override the actual contribution if needed.
</p>
```

### Keyboard Navigation

**Grid Navigation Pattern:**
- `Tab`: Enter/exit grid
- `Arrow keys`: Navigate within grid
- `Enter`: Edit cell / confirm edit
- `Escape`: Cancel edit

```javascript
// Grid navigation handler
grid.addEventListener('keydown', (e) => {
  const cell = e.target.closest('[role="gridcell"], td');
  if (!cell) return;

  switch (e.key) {
    case 'ArrowRight':
      moveFocus(cell, 'right');
      e.preventDefault();
      break;
    case 'ArrowLeft':
      moveFocus(cell, 'left');
      e.preventDefault();
      break;
    case 'ArrowDown':
      moveFocus(cell, 'down');
      e.preventDefault();
      break;
    case 'ArrowUp':
      moveFocus(cell, 'up');
      e.preventDefault();
      break;
  }
});
```

---

## Form Field Accessibility

### Input Labels

Every input has an associated label:

```html
<!-- Visible label option -->
<div class="form-group">
  <label for="sales-maria">Sales</label>
  <input id="sales-maria" type="text">
</div>

<!-- Hidden label for grid context -->
<td>
  <label for="sales-maria" class="sr-only">Sales amount for Maria Santos</label>
  <input id="sales-maria" type="text">
</td>
```

### Input Descriptions

```html
<input id="sales-maria"
       aria-describedby="sales-format sales-maria-error">

<p id="sales-format" class="sr-only">
  Enter amount in dollars, for example 2450.00
</p>

<p id="sales-maria-error" class="form-error" role="alert" hidden>
  <!-- Error message appears here -->
</p>
```

### Editable Field Indication

```html
<input class="input-editable"
       aria-label="Actual contribution for Maria Santos (editable override)"
       aria-describedby="override-help">

<p id="override-help" class="sr-only">
  This field allows you to enter a different amount than the calculated contribution
</p>
```

---

## Dynamic Content Announcements

### Live Regions

```html
<!-- Date change announcement -->
<div aria-live="polite" aria-atomic="true" id="date-announcer" class="sr-only">
  <!-- "Now showing January 10, 2026" -->
</div>

<!-- Calculation update -->
<td aria-live="polite" aria-atomic="true">
  $73.50
  <span class="sr-only">calculated contribution</span>
</td>

<!-- Save status -->
<div aria-live="polite" aria-atomic="true" id="save-status" class="sr-only">
  <!-- "Changes saved successfully" -->
</div>

<!-- Total update -->
<div aria-live="polite" aria-atomic="true" id="total-announcer">
  Daily total: $231.75
</div>
```

### Announcement Examples

```javascript
function announceCalculation(employee, amount) {
  announcer.textContent = `Calculated contribution for ${employee}: ${formatCurrency(amount)}`;
}

function announceDateChange(date) {
  dateAnnouncer.textContent = `Now showing ${formatDate(date)}`;
}

function announceSave() {
  saveStatus.textContent = 'All changes saved successfully';
}

function announceError(message) {
  // Use assertive for errors
  errorAnnouncer.setAttribute('aria-live', 'assertive');
  errorAnnouncer.textContent = message;
}
```

---

## Variance Indicator Accessibility

### Visual + Text Indication

```html
<div class="variance-indicator">
  <span aria-hidden="true">+$6.00</span>
  <span class="sr-only">
    Variance: actual contribution is $6.00 more than calculated
  </span>
  <button class="help-note"
          aria-label="Why is there a variance?"
          aria-describedby="variance-tooltip">
    <span aria-hidden="true">?</span>
  </button>
  <div id="variance-tooltip" role="tooltip" hidden>
    Actual differs from calculated. This is acceptable if the server
    reported different tips than the calculation expected.
  </div>
</div>
```

### Warning States

```html
<!-- Warning icon needs text alternative -->
<span class="warning-icon" role="img" aria-label="Warning">⚠</span>

<!-- Or use hidden text -->
<span class="warning-icon" aria-hidden="true">⚠</span>
<span class="sr-only">Warning: variance detected</span>
```

---

## Focus Management

### Initial Focus

On page load:
1. Focus moves to main content area (via skip link target)
2. Screen reader announces page title and date

### Date Navigation Focus

After date change:
1. Focus remains on date navigation
2. New date announced via live region
3. Grid data updates without focus change

### Save Focus

After successful save:
1. Focus remains in place
2. Success announced via live region
3. User can continue working

### Error Focus

On validation error:
1. Focus moves to first field with error
2. Error message announced
3. Clear indication of what's wrong

```javascript
function handleValidationErrors(errors) {
  const firstErrorField = document.getElementById(errors[0].fieldId);
  firstErrorField.focus();
  firstErrorField.setAttribute('aria-invalid', 'true');

  announceError(`Error in ${errors[0].fieldLabel}: ${errors[0].message}`);
}
```

---

## Color & Contrast

### Text Contrast

| Element | Foreground | Background | Ratio |
|---------|------------|------------|-------|
| Employee name | #292524 | #FFFFFF | 13.5:1 |
| Sales amount | #292524 | #FFFFFF | 13.5:1 |
| Calculated amount | #57534E | #FFFFFF | 7.3:1 |
| Actual input | #292524 | #F0F7E6 | 12.8:1 |
| Variance text | #F59E0B | #FFFFFF | 4.5:1 |
| Error text | #DC2626 | #FFFFFF | 5.5:1 |

### Non-Color Indicators

Don't rely on green background alone for editable fields:

```html
<!-- Color + label + icon -->
<td class="editable-cell">
  <span class="sr-only">Editable: </span>
  <span class="edit-icon" aria-hidden="true">✏️</span>
  <input ...>
</td>
```

---

## Mobile Accessibility

### Touch Targets

All interactive elements ≥ 44×44px:

```css
/* Grid inputs */
.contribution-grid input {
  min-height: 44px;
  padding: 0.75rem;
}

/* Navigation buttons */
.date-navigator button {
  min-width: 44px;
  min-height: 44px;
}

/* Action buttons */
.btn {
  min-height: 44px;
  padding: 0.75rem 1.5rem;
}
```

### Swipe Gestures

Provide button alternatives:
```html
<!-- Swipe works but buttons also available -->
<nav aria-label="Date navigation">
  <button aria-label="Previous day">←</button>
  <span>January 10, 2026</span>
  <button aria-label="Next day">→</button>
</nav>
```

---

## Screen Reader Testing

### NVDA Announcements (Expected)

| Action | Expected Announcement |
|--------|----------------------|
| Page load | "Daily Contributions, heading level 1, January 10, 2026" |
| Focus sales input | "Sales for Maria Santos, edit, $2,450.00" |
| Change sales value | "Calculated contribution for Maria Santos: $73.50" |
| Focus actual input | "Actual contribution for Maria Santos, editable override, edit, $73.50" |
| Enter variance | "Variance: actual is $6.00 more than calculated" |
| Save | "All changes saved successfully" |
| Date change | "Now showing January 9, 2026" |

### VoiceOver Testing

- Grid navigation works with VO+Arrow keys
- Forms mode enters automatically on inputs
- Live regions announce updates

---

## Testing Checklist

### Keyboard Testing
- [ ] All fields reachable via Tab
- [ ] Arrow keys navigate grid
- [ ] Enter confirms input
- [ ] Escape cancels edit
- [ ] Ctrl+S saves form
- [ ] Date navigation via keyboard

### Screen Reader Testing
- [ ] Page structure announced
- [ ] Grid headers associated with cells
- [ ] Labels read with inputs
- [ ] Calculations announced
- [ ] Errors announced
- [ ] Save status announced

### Visual Testing
- [ ] Focus indicators visible
- [ ] Editable fields distinguishable
- [ ] Error states clear
- [ ] Works at 200% zoom
- [ ] No horizontal scroll at 320px

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial accessibility documentation |
