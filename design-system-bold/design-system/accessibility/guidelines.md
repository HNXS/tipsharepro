# TipSharePro Accessibility Guidelines

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document provides detailed implementation guidelines for meeting WCAG 2.1 Level AA accessibility standards in TipSharePro.

---

## 1. Perceivable

### 1.1 Text Alternatives

**All non-text content must have text alternatives.**

```html
<!-- Images with meaningful content -->
<img src="chart.png" alt="Distribution chart showing Server at 45%, Cook at 30%, Busser at 25%">

<!-- Decorative images -->
<img src="divider.png" alt="" role="presentation">

<!-- Icon buttons -->
<button aria-label="Delete employee">
  <svg aria-hidden="true"><!-- trash icon --></svg>
</button>

<!-- Charts and graphs -->
<figure>
  <img src="pie-chart.png" alt="Tip distribution breakdown">
  <figcaption>
    <details>
      <summary>View distribution data</summary>
      <table><!-- Data table --></table>
    </details>
  </figcaption>
</figure>
```

### 1.2 Time-Based Media

TipSharePro does not include audio or video content. If added in the future:
- Provide captions for all audio content
- Provide audio descriptions for video

### 1.3 Adaptable

**Content must be presentable in different ways without losing meaning.**

```html
<!-- Use semantic structure -->
<main>
  <h1>Distribution Report</h1>
  <section aria-labelledby="summary-heading">
    <h2 id="summary-heading">Summary</h2>
    <!-- Content -->
  </section>
  <section aria-labelledby="details-heading">
    <h2 id="details-heading">Details</h2>
    <!-- Content -->
  </section>
</main>

<!-- Use proper table markup -->
<table>
  <caption>Pay period distribution for January 1-15, 2026</caption>
  <thead>
    <tr>
      <th scope="col">Employee</th>
      <th scope="col">Share</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Maria Santos</th>
      <td>$178.00</td>
    </tr>
  </tbody>
</table>
```

### 1.4 Distinguishable

**Make it easy for users to see and hear content.**

#### Color Contrast

| Text Type | Minimum Ratio | TipSharePro Value |
|-----------|---------------|-------------------|
| Normal text (< 18pt) | 4.5:1 | 13.5:1 (#292524 on #FFFFFF) |
| Large text (≥ 18pt) | 3:1 | 13.5:1 |
| UI components | 3:1 | 4.8:1 (Primary button) |

```css
/* Ensure all text meets contrast requirements */
.text-primary { color: #292524; } /* 13.5:1 on white */
.text-secondary { color: #57534E; } /* 7.3:1 on white */
.text-muted { color: #78716C; } /* 5.1:1 on white */

/* Error and success states */
.text-error { color: #DC2626; } /* 5.5:1 on white */
.text-success { color: #82B536; } /* Paired with darker backgrounds */
```

#### Don't Rely on Color Alone

```html
<!-- Bad: Color only -->
<span style="color: red;">Required</span>

<!-- Good: Color + text + icon -->
<span class="required-indicator">
  <svg aria-hidden="true"><!-- asterisk icon --></svg>
  <span class="text-error">Required</span>
</span>

<!-- Error states: color + border + icon + text -->
<div class="form-group has-error">
  <input class="form-input error" aria-invalid="true" aria-describedby="name-error">
  <p id="name-error" class="form-error">
    <svg aria-hidden="true"><!-- error icon --></svg>
    Name is required
  </p>
</div>
```

#### Text Spacing

```css
/* Support user text spacing adjustments */
body {
  line-height: 1.5; /* 150% of font size */
  letter-spacing: normal; /* Allow override */
}

p {
  margin-bottom: 1.5em; /* Paragraph spacing */
}
```

---

## 2. Operable

### 2.1 Keyboard Accessible

**All functionality must be available via keyboard.**

```css
/* Visible focus indicators */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}

/* Custom focus styles */
.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(232, 93, 4, 0.2);
}
```

#### Keyboard Navigation Order

```html
<!-- Skip links at start of page -->
<a href="#main-content" class="skip-link">Skip to main content</a>
<a href="#nav" class="skip-link">Skip to navigation</a>

<header><!-- ... --></header>
<nav id="nav"><!-- ... --></nav>
<main id="main-content" tabindex="-1"><!-- ... --></main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: var(--space-2) var(--space-4);
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

#### Tab Order

- Follow logical reading order (top to bottom, left to right)
- Don't use positive `tabindex` values
- Use `tabindex="0"` for custom interactive elements
- Use `tabindex="-1"` for programmatically focused elements

### 2.2 Enough Time

**Users must have enough time to read and use content.**

TipSharePro does not use:
- Auto-advancing content
- Session timeouts without warning
- Time limits on form submission

```javascript
// If session timeout is needed (future)
// Warn user 2 minutes before timeout
setTimeout(() => {
  showWarning('Your session will expire in 2 minutes. Would you like to continue?');
}, sessionDuration - 120000);
```

### 2.3 Seizures and Physical Reactions

- No content flashes more than 3 times per second
- Animations respect `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 2.4 Navigable

**Help users navigate and find content.**

```html
<!-- Page title reflects content -->
<title>Daily Contributions - January 10, 2026 | TipSharePro</title>

<!-- Clear heading hierarchy -->
<h1>Settings</h1>
  <h2>Location Settings</h2>
  <h2>Pay Period Settings</h2>
    <h3>Pay Period Type</h3>
    <h3>Start Date</h3>
```

#### Focus Management

```javascript
// Move focus after navigation
function navigateToPage(pageId) {
  loadPage(pageId);
  document.getElementById('main-content').focus();
}

// Return focus after modal closes
function closeModal(modal, triggerElement) {
  modal.hidden = true;
  triggerElement.focus();
}
```

### 2.5 Input Modalities

**Support various input methods beyond keyboard.**

```css
/* Touch targets at least 44x44px */
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-3) var(--space-5);
}

/* Spacing between adjacent targets */
.btn + .btn {
  margin-left: var(--space-2);
}

/* For icon-only buttons */
.btn-icon {
  width: 44px;
  height: 44px;
  padding: var(--space-2);
}
```

---

## 3. Understandable

### 3.1 Readable

**Content must be readable and understandable.**

```html
<!-- Declare language -->
<html lang="en">

<!-- Mark language changes -->
<p>The term <span lang="fr">mise en place</span> refers to preparation.</p>
```

### 3.2 Predictable

**Pages must behave predictably.**

```javascript
// Don't change context on focus
// Bad:
input.addEventListener('focus', () => navigateAway());

// Good: Change context on explicit action
input.addEventListener('change', () => updateResults());
```

### 3.3 Input Assistance

**Help users avoid and correct mistakes.**

```html
<!-- Clear labels -->
<label for="contribution">Contribution Rate (%)</label>
<input id="contribution" type="number" min="0" max="100">

<!-- Instructions before input -->
<p id="rate-help" class="form-help">Enter a value between 0 and 100</p>
<input aria-describedby="rate-help">

<!-- Error identification -->
<input aria-invalid="true" aria-describedby="rate-error">
<p id="rate-error" class="form-error">
  Rate must be between 0 and 100
</p>

<!-- Confirmation for critical actions -->
<button onclick="confirmDelete()">Delete Employee</button>

<!-- Prevent data loss -->
window.addEventListener('beforeunload', (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    e.returnValue = '';
  }
});
```

---

## 4. Robust

### 4.1 Compatible

**Content must work with current and future tools.**

```html
<!-- Valid HTML -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<!-- Proper ARIA usage -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2">Tab 2</button>
</div>
<div id="panel-1" role="tabpanel" aria-labelledby="tab-1">
  <!-- Content -->
</div>

<!-- Status messages -->
<div role="status" aria-live="polite" aria-atomic="true">
  Changes saved successfully
</div>

<div role="alert" aria-live="assertive">
  Error: Could not save changes
</div>
```

---

## ARIA Pattern Library

### Tabs

```html
<div class="tabs">
  <div role="tablist" aria-label="Settings sections">
    <button role="tab"
            id="tab-location"
            aria-selected="true"
            aria-controls="panel-location">
      Location
    </button>
    <button role="tab"
            id="tab-payperiod"
            aria-selected="false"
            aria-controls="panel-payperiod"
            tabindex="-1">
      Pay Period
    </button>
  </div>
  <div role="tabpanel"
       id="panel-location"
       aria-labelledby="tab-location">
    <!-- Location content -->
  </div>
  <div role="tabpanel"
       id="panel-payperiod"
       aria-labelledby="tab-payperiod"
       hidden>
    <!-- Pay period content -->
  </div>
</div>
```

### Modal Dialog

```html
<div role="dialog"
     aria-modal="true"
     aria-labelledby="modal-title"
     aria-describedby="modal-desc">
  <h2 id="modal-title">Confirm Distribution</h2>
  <p id="modal-desc">This action cannot be undone.</p>
  <button>Cancel</button>
  <button>Confirm</button>
</div>
```

### Alert Dialog

```html
<div role="alertdialog"
     aria-modal="true"
     aria-labelledby="alert-title"
     aria-describedby="alert-desc">
  <h2 id="alert-title">Warning</h2>
  <p id="alert-desc">You have unsaved changes.</p>
  <button>Discard</button>
  <button>Save</button>
</div>
```

### Tooltip

```html
<button aria-describedby="tooltip-1">
  <svg aria-hidden="true"><!-- icon --></svg>
</button>
<div id="tooltip-1" role="tooltip">
  Helpful tooltip text
</div>
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial accessibility guidelines |
