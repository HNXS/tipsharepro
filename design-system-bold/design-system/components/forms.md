# TipSharePro Form Components

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

Forms in TipSharePro handle critical data entry tasks including login, settings configuration, daily tip contributions, and employee management. All form components are designed for efficiency, with clear validation feedback and accessibility support.

---

## Form Elements

### Text Input

Standard single-line text input for names, values, and general data.

| Property | Value |
|----------|-------|
| Background | `#FFFFFF` |
| Border | `1px solid #E5E5E5` |
| Border Radius | `8px` |
| Padding | `12px 16px` |
| Font Size | `16px` |
| Font Family | Outfit |

**States:**

| State | Border | Background | Shadow |
|-------|--------|------------|--------|
| Default | `#E5E5E5` | `#FFFFFF` | none |
| Hover | `#D4D4D4` | `#FFFFFF` | none |
| Focus | `#E85D04` (2px) | `#FFFFFF` | `0 0 0 3px rgba(232,93,4,0.1)` |
| Disabled | `#E5E5E5` | `#F5F5F4` | none |
| Error | `#DC2626` (2px) | `#FFFFFF` | `0 0 0 3px rgba(220,38,38,0.1)` |
| Success | `#82B536` (2px) | `#FFFFFF` | `0 0 0 3px rgba(130,181,54,0.1)` |

```css
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-text-primary);
  background-color: var(--color-white);
  border: 1px solid var(--color-fog);
  border-radius: 8px;
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
}

.form-input:hover {
  border-color: #D4D4D4;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  border-width: 2px;
  padding: calc(0.75rem - 1px) calc(1rem - 1px);
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.1);
}

.form-input:disabled {
  background-color: var(--color-stone);
  cursor: not-allowed;
  color: var(--color-text-muted);
}

.form-input.error {
  border-color: var(--color-error);
  border-width: 2px;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
```

---

### Number Input (Currency/Hours)

For monetary values and numeric data. Uses monospace font for alignment.

```css
.form-input-currency {
  font-family: 'JetBrains Mono', monospace;
  text-align: right;
}

/* Green highlight for editable "Actual Contribution" fields */
.form-input-editable {
  background-color: #F0F7E6;
  border-color: var(--color-success);
}
```

**HTML Example:**
```html
<div class="form-group">
  <label class="form-label">Actual Contribution</label>
  <div class="input-with-prefix">
    <span class="input-prefix">$</span>
    <input type="number" class="form-input form-input-currency form-input-editable"
           value="125.00" step="0.01">
  </div>
</div>
```

---

### Select Dropdown

For choosing from predefined options like contribution rates, job categories, and pay periods.

```css
.form-select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  color: var(--color-text-primary);
  background-color: var(--color-white);
  background-image: url("data:image/svg+xml,..."); /* Chevron icon */
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  border: 1px solid var(--color-fog);
  border-radius: 8px;
  appearance: none;
  cursor: pointer;
  transition: border-color 150ms ease-out;
}

.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  border-width: 2px;
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.1);
}
```

**Weight Dropdown (1-5 in 0.25 increments):**
```html
<select class="form-select">
  <option value="1">1.00</option>
  <option value="1.25">1.25</option>
  <option value="1.5">1.50</option>
  <!-- ... 17 options total ... -->
  <option value="5">5.00</option>
</select>
```

**Contribution Rate Dropdown:**
```html
<!-- For Tips (5-25% in 0.5 increments) -->
<select class="form-select">
  <option value="5">5%</option>
  <option value="5.5">5.5%</option>
  <!-- ... -->
  <option value="25">25%</option>
</select>

<!-- For Sales (1-5% in 0.25 increments) -->
<select class="form-select">
  <option value="1">1%</option>
  <option value="1.25">1.25%</option>
  <!-- ... -->
  <option value="5">5%</option>
</select>
```

---

### Checkbox

For multiple selections like job categories and acknowledgments.

```css
.form-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-fog);
  border-radius: 4px;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.form-checkbox:checked {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  background-image: url("data:image/svg+xml,..."); /* Checkmark */
}

.form-checkbox:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.3);
}
```

**Job Category Checkbox Group:**
```html
<fieldset class="checkbox-group">
  <legend class="form-label">Job Categories</legend>
  <label class="checkbox-item">
    <input type="checkbox" class="form-checkbox" checked>
    <span>Server</span>
  </label>
  <label class="checkbox-item">
    <input type="checkbox" class="form-checkbox" checked>
    <span>Bartender</span>
  </label>
  <label class="checkbox-item">
    <input type="checkbox" class="form-checkbox">
    <span>Lead Cook</span>
  </label>
  <!-- Plus 5 write-in fields -->
</fieldset>
```

---

### Radio Button

For single selection from mutually exclusive options.

```css
.form-radio {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-fog);
  border-radius: 50%;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.form-radio:checked {
  border-color: var(--color-primary);
  background: radial-gradient(var(--color-primary) 40%, transparent 40%);
}
```

**Contribution Method Selection:**
```html
<fieldset class="radio-group">
  <legend class="form-label">Contribution Method</legend>
  <label class="radio-item">
    <input type="radio" name="method" class="form-radio" value="cc_sales">
    <span>CC Sales</span>
  </label>
  <label class="radio-item">
    <input type="radio" name="method" class="form-radio" value="cc_tips">
    <span>CC Tips</span>
  </label>
  <label class="radio-item">
    <input type="radio" name="method" class="form-radio" value="all_tips">
    <span>All Tips</span>
  </label>
  <label class="radio-item">
    <input type="radio" name="method" class="form-radio" value="all_sales" checked>
    <span>All Sales (Recommended)</span>
  </label>
</fieldset>
```

---

### Form Labels

```css
.form-label {
  display: block;
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.form-label-required::after {
  content: ' *';
  color: var(--color-error);
}
```

---

### Form Group

Container for label + input + help text + error message.

```css
.form-group {
  margin-bottom: 1.25rem;
}

.form-help {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-top: 0.5rem;
}

.form-error {
  font-size: 0.875rem;
  color: var(--color-error);
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
```

**Complete Example:**
```html
<div class="form-group">
  <label class="form-label form-label-required">Contribution Rate</label>
  <div class="input-with-suffix">
    <select class="form-select">
      <option>3%</option>
    </select>
    <span class="help-note" data-tooltip="Based on adjusted sales...">?</span>
  </div>
  <p class="form-help">Percentage of sales contributed to the tip pool</p>
</div>
```

---

## Special Form Patterns

### Login Form

```html
<form class="login-form">
  <div class="form-group">
    <label class="form-label">Username</label>
    <input type="text" class="form-input" placeholder="Enter username">
  </div>
  <div class="form-group">
    <label class="form-label">Password</label>
    <input type="password" class="form-input" placeholder="Enter password">
  </div>
  <button type="submit" class="btn btn-primary btn-full">Log In</button>
</form>
```

### Settings Tabs

```html
<div class="settings-tabs">
  <nav class="tab-nav">
    <button class="tab-btn active">Location</button>
    <button class="tab-btn">Pay Period</button>
    <button class="tab-btn">Contribution</button>
    <button class="tab-btn">Job Categories</button>
    <button class="tab-btn">Weights</button>
  </nav>
  <div class="tab-content">
    <!-- Tab panel content -->
  </div>
</div>
```

### Date Navigator

```html
<div class="date-navigator">
  <button class="btn btn-ghost" aria-label="Previous day">
    <svg><!-- Left arrow --></svg>
  </button>
  <span class="date-display">January 10, 2026</span>
  <button class="btn btn-ghost" aria-label="Next day">
    <svg><!-- Right arrow --></svg>
  </button>
</div>
```

---

## Validation

### Inline Validation

```css
.form-input.valid {
  border-color: var(--color-success);
}

.form-input.invalid {
  border-color: var(--color-error);
}

.validation-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.validation-icon.valid {
  color: var(--color-success);
}

.validation-icon.invalid {
  color: var(--color-error);
}
```

### Error Messages

```html
<div class="form-group has-error">
  <label class="form-label">Employee Name</label>
  <input type="text" class="form-input error" value="">
  <p class="form-error">
    <svg class="error-icon">...</svg>
    Employee name is required
  </p>
</div>
```

---

## Accessibility

- All inputs have associated `<label>` elements
- Required fields marked with `aria-required="true"`
- Error states use `aria-invalid="true"` and `aria-describedby`
- Focus order follows visual order
- Touch targets minimum 44x44px

```html
<div class="form-group">
  <label for="contribution" class="form-label">Contribution Rate</label>
  <select id="contribution"
          class="form-select"
          aria-required="true"
          aria-describedby="contribution-help">
    <option>3%</option>
  </select>
  <p id="contribution-help" class="form-help">
    Percentage of sales contributed to pool
  </p>
</div>
```

---

## Usage Guidelines

### DO
- Use clear, descriptive labels
- Show validation feedback immediately
- Provide help text for complex fields
- Group related fields together
- Use appropriate input types (number, email, etc.)

### DON'T
- Don't use placeholder text as labels
- Don't disable submit without explanation
- Don't clear form on validation error
- Don't use red for non-error states

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial form component specifications |
