# TipSharePro Modal Components

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

Modals in TipSharePro handle critical user interactions including confirmations, warnings, and required acknowledgments. The unique "!!Note" modal system ensures users acknowledge important compliance information before proceeding.

---

## Modal Types

### Standard Dialog

Basic modal for general interactions.

| Property | Value |
|----------|-------|
| Background | `#FFFFFF` |
| Border Radius | `16px` |
| Shadow | `0 25px 50px rgba(0,0,0,0.25)` |
| Max Width | `480px` |
| Padding | `32px` |

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 75, 124, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 150ms ease-out;
}

.modal {
  background: var(--color-white);
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-width: 480px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  animation: slideUp 200ms ease-out;
}

.modal-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-fog);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.modal-body {
  padding: var(--space-6);
}

.modal-footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-fog);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

```html
<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal">
    <div class="modal-header">
      <h2 id="modal-title" class="modal-title">Dialog Title</h2>
    </div>
    <div class="modal-body">
      <p>Modal content goes here...</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

---

### Confirmation Dialog

For confirming user actions before execution.

```html
<div class="modal-overlay" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc">
  <div class="modal modal-confirm">
    <div class="modal-header">
      <div class="modal-icon modal-icon-warning">
        <svg><!-- Warning icon --></svg>
      </div>
      <h2 id="confirm-title" class="modal-title">Confirm Distribution</h2>
    </div>
    <div class="modal-body">
      <p id="confirm-desc">
        You are about to finalize the distribution for Pay Period January 1-15, 2026.
        This action cannot be undone.
      </p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost">Cancel</button>
      <button class="btn btn-primary">Confirm Distribution</button>
    </div>
  </div>
</div>
```

```css
.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-4);
}

.modal-icon svg {
  width: 24px;
  height: 24px;
}

.modal-icon-warning {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.modal-icon-danger {
  background: var(--color-error-light);
  color: var(--color-error);
}

.modal-icon-success {
  background: var(--color-success-light);
  color: var(--color-success);
}

.modal-icon-info {
  background: var(--color-accent-light);
  color: var(--color-accent);
}
```

---

### Danger/Destructive Dialog

For actions that cannot be undone or may cause data loss.

```html
<div class="modal-overlay" role="alertdialog" aria-modal="true">
  <div class="modal modal-danger">
    <div class="modal-header">
      <div class="modal-icon modal-icon-danger">
        <svg><!-- Danger icon --></svg>
      </div>
      <h2 class="modal-title">Delete Employee?</h2>
    </div>
    <div class="modal-body">
      <p>This will permanently remove <strong>Maria Santos</strong> and all associated records. This action cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost">Cancel</button>
      <button class="btn btn-danger">Delete Employee</button>
    </div>
  </div>
</div>
```

```css
.modal-danger .modal-title {
  color: var(--color-error);
}
```

---

### !!Note Critical Warning Modal

**UNIQUE TO TIPSHAREPRO** - Modal that requires explicit acknowledgment via checkbox before user can proceed. Used for compliance-critical information.

```html
<div class="modal-overlay" role="alertdialog" aria-modal="true">
  <div class="modal modal-critical">
    <div class="modal-header modal-header-critical">
      <span class="critical-badge">!!</span>
      <h2 class="modal-title">Important Compliance Notice</h2>
    </div>
    <div class="modal-body">
      <div class="critical-content">
        <p>
          <strong>Wage Confidentiality:</strong> The hourly rates shown in this
          distribution report are confidential employee information. Sharing
          this information with employees or third parties may violate labor
          laws and company policy.
        </p>
        <p>
          Only authorized personnel should have access to the detailed
          distribution breakdown. When sharing distribution results with
          employees, use the "Employee View" which omits wage data.
        </p>
      </div>
      <label class="critical-acknowledgment">
        <input type="checkbox" class="form-checkbox" id="acknowledge-critical">
        <span>I understand and acknowledge this information</span>
      </label>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" disabled id="critical-continue">
        Continue
      </button>
    </div>
  </div>
</div>
```

```css
.modal-critical {
  border-top: 4px solid var(--color-error);
}

.modal-header-critical {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.critical-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-error), var(--color-primary));
  color: var(--color-white);
  font-weight: 800;
  font-size: 1rem;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.critical-content {
  background: var(--color-error-light);
  border-left: 4px solid var(--color-error);
  padding: var(--space-4);
  border-radius: 0 8px 8px 0;
  margin-bottom: var(--space-5);
}

.critical-content p {
  margin: 0 0 var(--space-3);
  color: var(--color-text-primary);
  line-height: 1.6;
}

.critical-content p:last-child {
  margin-bottom: 0;
}

.critical-acknowledgment {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-stone);
  border-radius: 8px;
  cursor: pointer;
}

.critical-acknowledgment span {
  font-weight: 500;
  color: var(--color-text-primary);
}

/* Enable button when checkbox is checked */
.critical-acknowledgment input:checked ~ .modal-footer .btn-primary {
  opacity: 1;
  pointer-events: auto;
}
```

**JavaScript Behavior:**
```javascript
// Enable continue button only when checkbox is checked
document.getElementById('acknowledge-critical').addEventListener('change', (e) => {
  document.getElementById('critical-continue').disabled = !e.target.checked;
});
```

---

### Information Modal

For displaying helpful information without requiring action.

```html
<div class="modal-overlay" role="dialog" aria-modal="true">
  <div class="modal modal-info">
    <div class="modal-header">
      <div class="modal-icon modal-icon-info">
        <svg><!-- Info icon --></svg>
      </div>
      <h2 class="modal-title">How Distribution Works</h2>
      <button class="modal-close" aria-label="Close">
        <svg><!-- Close X --></svg>
      </button>
    </div>
    <div class="modal-body">
      <p>The tip distribution is calculated using the formula:</p>
      <code class="formula">Hours × Rate × Weight = Basis</code>
      <p>Each employee's share is their basis divided by the total pool basis.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary">Got It</button>
    </div>
  </div>
</div>
```

```css
.modal-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
  color: var(--color-text-muted);
  border-radius: 8px;
  transition: all 150ms ease-out;
}

.modal-close:hover {
  background: var(--color-stone);
  color: var(--color-text-primary);
}

.modal-info .formula {
  display: block;
  background: var(--color-secondary);
  color: var(--color-white);
  padding: var(--space-4);
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  margin: var(--space-4) 0;
}
```

---

## Modal Sizes

### Small Modal

```css
.modal-sm {
  max-width: 360px;
}
```

### Large Modal

```css
.modal-lg {
  max-width: 640px;
}

.modal-xl {
  max-width: 800px;
}
```

### Full Screen Modal (Mobile)

```css
@media (max-width: 640px) {
  .modal-fullscreen-mobile {
    max-width: 100%;
    width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
    margin: 0;
  }
}
```

---

## Modal with Form

For modals containing form inputs.

```html
<div class="modal-overlay" role="dialog" aria-modal="true">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Add Employee</h2>
    </div>
    <form>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label form-label-required">Employee Name</label>
          <input type="text" class="form-input" required>
        </div>
        <div class="form-group">
          <label class="form-label form-label-required">Job Category</label>
          <select class="form-select" required>
            <option value="">Select category...</option>
            <option>Server</option>
            <option>Bartender</option>
            <option>Lead Cook</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Hourly Rate</label>
          <div class="input-with-prefix">
            <span class="input-prefix">$</span>
            <input type="number" class="form-input form-input-currency" step="0.01">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost">Cancel</button>
        <button type="submit" class="btn btn-primary">Add Employee</button>
      </div>
    </form>
  </div>
</div>
```

---

## Loading State

Modal with loading indicator during async operations.

```html
<div class="modal-overlay">
  <div class="modal modal-loading">
    <div class="modal-body">
      <div class="spinner"></div>
      <p class="loading-text">Processing distribution...</p>
    </div>
  </div>
</div>
```

```css
.modal-loading {
  max-width: 280px;
  text-align: center;
}

.modal-loading .modal-body {
  padding: var(--space-8);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-fog);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-4);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: var(--color-text-secondary);
  margin: 0;
}
```

---

## Accessibility

- Use `role="dialog"` or `role="alertdialog"` appropriately
- Include `aria-modal="true"` to indicate modal behavior
- Use `aria-labelledby` to reference the modal title
- Use `aria-describedby` for confirmation dialogs
- Trap focus within the modal
- Return focus to trigger element on close
- Close on Escape key press
- Prevent body scroll when modal is open

```css
/* Prevent body scroll when modal is open */
body.modal-open {
  overflow: hidden;
}
```

**Focus Trap JavaScript:**
```javascript
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  firstElement.focus();
}
```

---

## Usage Guidelines

### DO
- Use modals sparingly for important interactions
- Provide clear titles and actions
- Allow closing via overlay click (non-critical modals)
- Use appropriate modal type for context
- Require acknowledgment for compliance-critical info

### DON'T
- Don't nest modals
- Don't use modals for simple messages (use toasts)
- Don't disable overlay close for non-critical modals
- Don't auto-close modals without user action
- Don't use modals for content that should be inline

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial modal specifications |
