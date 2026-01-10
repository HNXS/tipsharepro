# TipSharePro Alert Components

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

Alerts in TipSharePro provide feedback to users about actions, system states, and important information. The system includes toast notifications for transient messages, inline alerts for contextual information, and banner alerts for persistent warnings.

---

## Toast Notifications

Temporary messages that appear and auto-dismiss.

### Toast Anatomy

| Property | Value |
|----------|-------|
| Position | Top-right (desktop), Top-center (mobile) |
| Min Width | `280px` |
| Max Width | `400px` |
| Border Radius | `8px` |
| Shadow | `0 4px 12px rgba(0,0,0,0.15)` |
| Duration | `3000ms` (configurable) |

### Base Toast Styles

```css
.toast-container {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 1100;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.toast {
  min-width: 280px;
  max-width: 400px;
  padding: var(--space-4);
  background: var(--color-white);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  animation: slideIn 200ms ease-out;
}

.toast.exiting {
  animation: slideOut 150ms ease-in forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.toast-message {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: var(--space-1);
  cursor: pointer;
  color: var(--color-text-muted);
  border-radius: 4px;
  transition: all 150ms ease-out;
}

.toast-close:hover {
  background: var(--color-stone);
  color: var(--color-text-primary);
}
```

### Toast Variants

```css
/* Success Toast */
.toast-success {
  border-left: 4px solid var(--color-success);
}

.toast-success .toast-icon {
  color: var(--color-success);
}

/* Error Toast */
.toast-error {
  border-left: 4px solid var(--color-error);
}

.toast-error .toast-icon {
  color: var(--color-error);
}

/* Warning Toast */
.toast-warning {
  border-left: 4px solid var(--color-warning);
}

.toast-warning .toast-icon {
  color: var(--color-warning);
}

/* Info Toast */
.toast-info {
  border-left: 4px solid var(--color-accent);
}

.toast-info .toast-icon {
  color: var(--color-accent);
}
```

### HTML Examples

```html
<div class="toast-container" aria-live="polite" aria-atomic="true">
  <!-- Success Toast -->
  <div class="toast toast-success" role="alert">
    <svg class="toast-icon"><!-- Check circle icon --></svg>
    <div class="toast-content">
      <div class="toast-title">Changes Saved</div>
      <p class="toast-message">Your settings have been updated successfully.</p>
    </div>
    <button class="toast-close" aria-label="Dismiss">
      <svg><!-- X icon --></svg>
    </button>
  </div>

  <!-- Error Toast -->
  <div class="toast toast-error" role="alert">
    <svg class="toast-icon"><!-- X circle icon --></svg>
    <div class="toast-content">
      <div class="toast-title">Error Saving</div>
      <p class="toast-message">Unable to save changes. Please try again.</p>
    </div>
    <button class="toast-close" aria-label="Dismiss">
      <svg><!-- X icon --></svg>
    </button>
  </div>
</div>
```

### Toast with Action

```html
<div class="toast toast-info" role="alert">
  <svg class="toast-icon"><!-- Info icon --></svg>
  <div class="toast-content">
    <div class="toast-title">Distribution Ready</div>
    <p class="toast-message">The distribution calculation is complete.</p>
    <button class="toast-action">View Results</button>
  </div>
  <button class="toast-close" aria-label="Dismiss">
    <svg><!-- X icon --></svg>
  </button>
</div>
```

```css
.toast-action {
  margin-top: var(--space-2);
  padding: var(--space-1) var(--space-3);
  background: none;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.toast-action:hover {
  background: var(--color-primary);
  color: var(--color-white);
}
```

---

## Inline Alerts

Contextual alerts that appear within the page content.

### Base Inline Alert

```css
.alert {
  padding: var(--space-4);
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.alert-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  margin-bottom: var(--space-1);
}

.alert-text {
  font-size: 0.875rem;
  line-height: 1.5;
}

.alert-dismiss {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-1);
  opacity: 0.6;
  transition: opacity 150ms ease-out;
}

.alert-dismiss:hover {
  opacity: 1;
}
```

### Alert Variants

```css
/* Info Alert */
.alert-info {
  background: var(--color-accent-light);
  border: 1px solid rgba(53, 160, 210, 0.3);
  color: var(--color-text-primary);
}

.alert-info .alert-icon {
  color: var(--color-accent);
}

/* Success Alert */
.alert-success {
  background: var(--color-success-light);
  border: 1px solid rgba(130, 181, 54, 0.3);
  color: var(--color-text-primary);
}

.alert-success .alert-icon {
  color: var(--color-success);
}

/* Warning Alert */
.alert-warning {
  background: var(--color-warning-light);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: var(--color-text-primary);
}

.alert-warning .alert-icon {
  color: var(--color-warning);
}

/* Error Alert */
.alert-error {
  background: var(--color-error-light);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: var(--color-text-primary);
}

.alert-error .alert-icon {
  color: var(--color-error);
}
```

### HTML Examples

```html
<!-- Info Alert -->
<div class="alert alert-info" role="alert">
  <svg class="alert-icon"><!-- Info icon --></svg>
  <div class="alert-content">
    <div class="alert-title">Tip</div>
    <p class="alert-text">
      You can copy data from the previous day by clicking "Copy Previous Day" in the header.
    </p>
  </div>
</div>

<!-- Warning Alert -->
<div class="alert alert-warning" role="alert">
  <svg class="alert-icon"><!-- Warning icon --></svg>
  <div class="alert-content">
    <div class="alert-title">Unsaved Changes</div>
    <p class="alert-text">
      You have unsaved changes. Please save before leaving this page.
    </p>
  </div>
  <button class="alert-dismiss" aria-label="Dismiss">
    <svg><!-- X icon --></svg>
  </button>
</div>

<!-- Error Alert with List -->
<div class="alert alert-error" role="alert">
  <svg class="alert-icon"><!-- Error icon --></svg>
  <div class="alert-content">
    <div class="alert-title">Validation Errors</div>
    <ul class="alert-list">
      <li>Employee name is required</li>
      <li>Contribution amount must be positive</li>
      <li>Hours cannot exceed 24 per day</li>
    </ul>
  </div>
</div>
```

```css
.alert-list {
  margin: var(--space-2) 0 0;
  padding-left: var(--space-4);
  font-size: 0.875rem;
}

.alert-list li {
  margin-bottom: var(--space-1);
}

.alert-list li:last-child {
  margin-bottom: 0;
}
```

---

## Banner Alerts

Full-width alerts for important persistent messages.

```css
.banner {
  padding: var(--space-3) var(--space-4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  font-size: 0.875rem;
  font-weight: 500;
}

.banner-info {
  background: var(--color-secondary);
  color: var(--color-white);
}

.banner-warning {
  background: var(--color-warning);
  color: var(--color-charcoal);
}

.banner-error {
  background: var(--color-error);
  color: var(--color-white);
}

.banner-success {
  background: var(--color-success);
  color: var(--color-white);
}

.banner a {
  color: inherit;
  text-decoration: underline;
  font-weight: 600;
}

.banner-close {
  position: absolute;
  right: var(--space-4);
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: var(--space-1);
  opacity: 0.8;
}

.banner-close:hover {
  opacity: 1;
}
```

### Trial Expiration Banner

Special banner for trial countdown (shown during last 10 days).

```html
<div class="banner banner-trial" role="alert">
  <span class="banner-icon">⏰</span>
  <span>Your trial expires in <strong>5 days</strong>.</span>
  <a href="/upgrade" class="banner-link">Upgrade Now</a>
  <button class="banner-close" aria-label="Dismiss">×</button>
</div>
```

```css
.banner-trial {
  background: linear-gradient(135deg, var(--color-primary), var(--color-warning));
  color: var(--color-white);
  position: relative;
}

.banner-trial.urgent {
  background: var(--color-error);
  animation: pulse-bg 2s infinite;
}

@keyframes pulse-bg {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.9; }
}

.banner-link {
  background: var(--color-white);
  color: var(--color-primary);
  padding: var(--space-1) var(--space-3);
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  margin-left: var(--space-2);
}

.banner-link:hover {
  background: var(--color-stone);
}
```

---

## Form Validation Alerts

Inline validation feedback for form fields.

```html
<div class="form-group has-error">
  <label class="form-label">Contribution Amount</label>
  <input type="number" class="form-input error" value="-50">
  <div class="field-error">
    <svg class="field-error-icon"><!-- Error icon --></svg>
    <span>Amount must be a positive number</span>
  </div>
</div>
```

```css
.field-error {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-top: var(--space-2);
  font-size: 0.875rem;
  color: var(--color-error);
}

.field-error-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.field-success {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-top: var(--space-2);
  font-size: 0.875rem;
  color: var(--color-success);
}
```

---

## Empty States

For when there's no data to display.

```html
<div class="empty-state">
  <div class="empty-state-icon">
    <svg><!-- Empty clipboard icon --></svg>
  </div>
  <h3 class="empty-state-title">No Contributions Yet</h3>
  <p class="empty-state-text">
    Start entering daily contributions to see them listed here.
  </p>
  <button class="btn btn-primary">Add First Entry</button>
</div>
```

```css
.empty-state {
  text-align: center;
  padding: var(--space-10) var(--space-6);
}

.empty-state-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-4);
  color: var(--color-text-muted);
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.empty-state-text {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
}
```

---

## Loading States

For async operations.

```html
<!-- Inline Loading -->
<div class="loading-inline">
  <span class="spinner-sm"></span>
  <span>Calculating distribution...</span>
</div>

<!-- Full Page Loading -->
<div class="loading-overlay">
  <div class="loading-content">
    <div class="spinner"></div>
    <p>Loading pay period data...</p>
  </div>
</div>

<!-- Skeleton Loading -->
<div class="skeleton-card">
  <div class="skeleton skeleton-title"></div>
  <div class="skeleton skeleton-text"></div>
  <div class="skeleton skeleton-text skeleton-short"></div>
</div>
```

```css
.loading-inline {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-fog);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-fog);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
}

.loading-content p {
  margin-top: var(--space-4);
  color: var(--color-text-secondary);
}

/* Skeleton Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-fog) 25%,
    var(--color-stone) 50%,
    var(--color-fog) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-title {
  height: 24px;
  width: 60%;
  margin-bottom: var(--space-3);
}

.skeleton-text {
  height: 16px;
  width: 100%;
  margin-bottom: var(--space-2);
}

.skeleton-short {
  width: 40%;
}

@keyframes shimmer {
  from { background-position: -200% 0; }
  to { background-position: 200% 0; }
}
```

---

## Mobile Responsive

```css
@media (max-width: 640px) {
  .toast-container {
    left: var(--space-4);
    right: var(--space-4);
  }

  .toast {
    max-width: none;
  }

  .banner {
    flex-direction: column;
    text-align: center;
    padding: var(--space-4);
  }

  .banner-close {
    position: static;
    margin-top: var(--space-2);
  }
}
```

---

## Accessibility

- Use `role="alert"` for important notifications
- Use `aria-live="polite"` for toast containers
- Ensure sufficient color contrast
- Don't rely solely on color to convey meaning
- Provide dismiss buttons for persistent alerts
- Auto-dismiss toasts should have adequate duration (3+ seconds)

---

## Usage Guidelines

### DO
- Use toasts for transient, non-critical feedback
- Use inline alerts for contextual information
- Use banners for important, persistent messages
- Provide clear, actionable messages
- Allow users to dismiss non-critical alerts

### DON'T
- Don't use multiple alert types for the same message
- Don't auto-dismiss critical error messages
- Don't stack too many toasts at once (max 3)
- Don't use alerts for content that should be inline
- Don't use red for non-error states

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial alert specifications |
