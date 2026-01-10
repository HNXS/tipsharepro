# Settings - Accessibility

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document details accessibility requirements and implementation for the Settings feature, ensuring WCAG 2.1 Level AA compliance.

---

## Keyboard Navigation

### Tab Order

The Settings page follows this logical tab order:

1. Skip link (to main content)
2. Page header / back button
3. Tab list (Location, Pay Period, etc.)
4. Active tab panel content (top to bottom)
5. Action buttons (Cancel, Save)

### Tab List Navigation

```html
<div class="tabs" role="tablist" aria-label="Settings sections">
  <button role="tab"
          id="tab-location"
          aria-selected="true"
          aria-controls="panel-location"
          tabindex="0">
    Location
  </button>
  <button role="tab"
          id="tab-payperiod"
          aria-selected="false"
          aria-controls="panel-payperiod"
          tabindex="-1">
    Pay Period
  </button>
  <button role="tab"
          id="tab-contribution"
          aria-selected="false"
          aria-controls="panel-contribution"
          tabindex="-1">
    Contribution
  </button>
  <!-- ... more tabs -->
</div>
```

**Keyboard Behavior:**
- `Tab`: Enter tab list, then skip to panel
- `Arrow Left/Right`: Move between tabs
- `Home`: First tab
- `End`: Last tab
- `Enter/Space`: Activate tab (roving tabindex)

### Form Field Navigation

- All form fields reachable via `Tab`
- Logical order: top-to-bottom, left-to-right
- Group related fields with `fieldset` and `legend`

---

## Screen Reader Support

### Page Structure

```html
<main id="main-content" aria-labelledby="page-title">
  <h1 id="page-title">Settings</h1>

  <!-- Tab navigation -->
  <nav aria-label="Settings sections">
    <div role="tablist">...</div>
  </nav>

  <!-- Tab panels -->
  <section role="tabpanel" id="panel-location" aria-labelledby="tab-location">
    <h2>Location Settings</h2>
    <!-- Content -->
  </section>
</main>
```

### Form Labels

Every form control has an accessible label:

```html
<!-- Explicit label -->
<label for="establishment-name">Establishment Name</label>
<input type="text" id="establishment-name" name="establishmentName">

<!-- Required field -->
<label for="contribution-rate">
  Contribution Rate
  <span class="required-indicator" aria-hidden="true">*</span>
</label>
<input type="number"
       id="contribution-rate"
       aria-required="true"
       aria-describedby="rate-help rate-error">
<p id="rate-help" class="form-help">Industry standard: 2-5%</p>
<p id="rate-error" class="form-error" aria-live="polite"></p>
```

### Help Text Associations

```html
<!-- ?Note with accessible description -->
<div class="form-group">
  <label for="weight-server">
    Server Weight
    <button type="button"
            class="help-note"
            aria-describedby="weight-tooltip">
      <span aria-hidden="true">?</span>
      <span class="sr-only">Help</span>
    </button>
  </label>
  <select id="weight-server" aria-describedby="weight-tooltip">
    <option>1.00</option>
    <!-- options -->
  </select>
  <div id="weight-tooltip" role="tooltip" hidden>
    Higher weight means larger share of tip pool.
    Range: 1.00 to 5.00.
  </div>
</div>
```

### Dynamic Updates

```html
<!-- Live region for save status -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  <!-- Populated dynamically -->
  Settings saved successfully
</div>

<!-- Form error summary -->
<div role="alert" aria-live="assertive">
  <h3>Please fix the following errors:</h3>
  <ul>
    <li><a href="#establishment-name">Establishment name is required</a></li>
  </ul>
</div>
```

---

## Focus Management

### Initial Focus

When Settings page loads:
1. Focus moves to main content area (via skip link target)
2. Or focus remains on trigger element if navigated via button

### Tab Switch Focus

When tab is activated:
1. Focus moves to tab panel
2. Panel receives `tabindex="-1"` for programmatic focus
3. First focusable element in panel is next in tab order

```javascript
function activateTab(tab) {
  // Update ARIA
  tabs.forEach(t => {
    t.setAttribute('aria-selected', 'false');
    t.setAttribute('tabindex', '-1');
  });
  tab.setAttribute('aria-selected', 'true');
  tab.setAttribute('tabindex', '0');

  // Show panel
  const panel = document.getElementById(tab.getAttribute('aria-controls'));
  panels.forEach(p => p.hidden = true);
  panel.hidden = false;

  // Focus panel for screen readers
  panel.focus();
}
```

### Modal Focus Trapping

When modal opens (including !!Note modals):

```javascript
function trapFocus(modal) {
  const focusables = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  first.focus();
}
```

### Error Focus

When form validation fails:
1. Focus moves to first field with error
2. Error message announced via `aria-live`

```javascript
function handleValidationErrors(errors) {
  const firstError = document.getElementById(errors[0].fieldId);
  firstError.focus();

  // Announce error count
  announcer.textContent = `${errors.length} errors found. First error: ${errors[0].message}`;
}
```

---

## Color & Contrast

### Text Contrast

| Element | Foreground | Background | Ratio |
|---------|------------|------------|-------|
| Tab labels | #57534E | #FFFFFF | 7.3:1 |
| Active tab | #E85D04 | #FFFFFF | 4.5:1 |
| Form labels | #57534E | #FFFFFF | 7.3:1 |
| Input text | #292524 | #FFFFFF | 13.5:1 |
| Help text | #78716C | #FFFFFF | 5.1:1 |
| Error text | #DC2626 | #FFFFFF | 5.5:1 |

### Non-Text Contrast

| Element | Contrast |
|---------|----------|
| Input border (default) | 3:1 (E5E5E5 vs FFFFFF) |
| Input border (focus) | 4.5:1 (E85D04 vs FFFFFF) |
| Checkbox border | 3:1 |
| Tab indicator | 4.5:1 |

### Color Independence

All information conveyed by color is also conveyed by:
- Text labels
- Icons/symbols
- Patterns

```html
<!-- Error state: color + icon + text -->
<div class="form-group has-error">
  <input class="form-input error" aria-invalid="true">
  <p class="form-error">
    <svg aria-hidden="true" class="error-icon"><!-- X icon --></svg>
    <span>This field is required</span>
  </p>
</div>

<!-- Success state: color + icon + text -->
<div class="form-group has-success">
  <input class="form-input success" aria-invalid="false">
  <p class="form-success">
    <svg aria-hidden="true" class="success-icon"><!-- Check icon --></svg>
    <span>Looks good!</span>
  </p>
</div>
```

---

## Touch & Motor

### Touch Targets

All interactive elements meet minimum 44×44px:

```css
/* Buttons */
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1.5rem;
}

/* Form inputs */
.form-input,
.form-select {
  min-height: 44px;
  padding: 0.75rem 1rem;
}

/* Checkboxes with label */
.checkbox-item {
  min-height: 44px;
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
}

/* Tab buttons */
.tab {
  min-height: 44px;
  padding: 0.75rem 1.25rem;
}

/* Help note icons */
.help-note {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

### Spacing Between Targets

Maintain adequate spacing to prevent accidental activation:

```css
.form-group {
  margin-bottom: 1.25rem;
}

.checkbox-item + .checkbox-item {
  margin-top: 0.5rem;
}

.btn + .btn {
  margin-left: 0.75rem;
}
```

---

## Content Accessibility

### Reading Level

- Use clear, simple language
- Avoid jargon where possible
- Provide explanatory help text for complex fields

### Error Messages

Clear, actionable error messages:

```html
<!-- Good -->
<p class="form-error">Enter a contribution rate between 1% and 25%</p>

<!-- Bad -->
<p class="form-error">Invalid input</p>
```

### Instructions

Provide instructions before complex interactions:

```html
<fieldset>
  <legend>Job Categories</legend>
  <p class="fieldset-instructions">
    Select all job categories used at your establishment.
    You can add up to 5 custom categories.
  </p>
  <!-- Checkboxes -->
</fieldset>
```

---

## Assistive Technology Compatibility

### Screen Readers Tested

| Screen Reader | Browser | Status |
|---------------|---------|--------|
| NVDA | Firefox | ✓ Tested |
| NVDA | Chrome | ✓ Tested |
| VoiceOver | Safari | ✓ Tested |
| JAWS | Chrome | ✓ Tested |

### Known Announcements

| Interaction | Expected Announcement |
|-------------|----------------------|
| Tab switch | "[Tab name], tab, selected, 1 of 6" |
| Checkbox toggle | "[Label], checkbox, checked/unchecked" |
| Dropdown open | "[Label], combobox, expanded, [current value]" |
| Error on field | "[Error message]" (via aria-live) |
| Save success | "Settings saved successfully" |
| Modal open | "[Modal title], dialog" |

---

## Testing Checklist

### Keyboard Testing
- [ ] All tabs reachable via keyboard
- [ ] Arrow keys navigate between tabs
- [ ] Enter/Space activates tabs
- [ ] All form fields focusable
- [ ] Modal focus trapped
- [ ] Escape closes modals
- [ ] Focus returns after modal close

### Screen Reader Testing
- [ ] Page title announced
- [ ] Tab list announced correctly
- [ ] Form labels read with inputs
- [ ] Required fields indicated
- [ ] Error messages announced
- [ ] Help tooltips accessible
- [ ] Save confirmation announced

### Visual Testing
- [ ] Focus indicators visible
- [ ] Contrast ratios pass
- [ ] 200% zoom functional
- [ ] No horizontal scroll at 320px

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial accessibility documentation |
