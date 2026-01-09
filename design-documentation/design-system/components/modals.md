---
title: Modal Components
description: Dialogs, overlays, and modal patterns for Tip Share Pro
last-updated: 2026-01-08
version: 1.0.0
related-files:
  - ../tokens/animations.md
  - ./buttons.md
status: approved
---

# Modal Components

## Overview

Modals capture user attention for important decisions, confirmations, or focused tasks. In Tip Share Pro, modals feel substantial—like a document being placed on a desk for review.

---

## Modal Anatomy

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Overlay (--midnight at 90% opacity)                                    │
│                                                                         │
│       ┌───────────────────────────────────────────────────────┐        │
│       │  Modal Container                                      │        │
│       │  ┌─────────────────────────────────────────────────┐ │        │
│       │  │  Header                              [X Close]  │ │        │
│       │  │  Title                                          │ │        │
│       │  ├─────────────────────────────────────────────────┤ │        │
│       │  │                                                 │ │        │
│       │  │  Body Content                                   │ │        │
│       │  │                                                 │ │        │
│       │  ├─────────────────────────────────────────────────┤ │        │
│       │  │  Footer Actions          [Cancel] [Confirm]    │ │        │
│       │  └─────────────────────────────────────────────────┘ │        │
│       └───────────────────────────────────────────────────────┘        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Base Modal

### Visual Specs

| Property | Value |
|----------|-------|
| Overlay | `--midnight` at 90% opacity |
| Container Background | `--espresso` |
| Container Border | 1px solid `--walnut` |
| Container Shadow | `--shadow-xl` |
| Border Radius | `--radius-xl` (18px) |
| Max Width | 480px (small), 640px (medium), 900px (large) |
| Padding | 24px |

### CSS Implementation

```css
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(12, 10, 7, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  z-index: var(--z-overlay);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity var(--duration-normal) var(--ease-standard),
    visibility var(--duration-normal);
}

.modal-overlay[data-open="true"] {
  opacity: 1;
  visibility: visible;
}

/* Container */
.modal {
  background: var(--espresso);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - var(--space-8));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateY(20px) scale(0.95);
  opacity: 0;
  transition:
    transform var(--duration-slower) var(--ease-settle),
    opacity var(--duration-slower) var(--ease-settle);
}

.modal-overlay[data-open="true"] .modal {
  transform: translateY(0) scale(1);
  opacity: 1;
}

/* Sizes */
.modal-sm { max-width: 400px; }
.modal-md { max-width: 560px; }
.modal-lg { max-width: 720px; }
.modal-xl { max-width: 900px; }
.modal-full { max-width: calc(100vw - var(--space-8)); }

/* Header */
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--walnut);
}

.modal-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--cream);
  margin: 0;
  padding-right: var(--space-4);
}

.modal-subtitle {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--stone);
  margin-top: var(--space-1);
}

.modal-close {
  background: none;
  border: none;
  padding: var(--space-2);
  margin: calc(var(--space-2) * -1);
  color: var(--stone);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

.modal-close:hover {
  background: var(--mahogany);
  color: var(--cream);
}

.modal-close-icon {
  width: 20px;
  height: 20px;
}

/* Body */
.modal-body {
  flex: 1;
  padding: var(--space-4);
  overflow-y: auto;
  color: var(--linen);
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: var(--midnight);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--walnut);
  border-radius: 4px;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4);
  border-top: 1px solid var(--walnut);
  background: var(--midnight);
}

.modal-footer-split {
  justify-content: space-between;
}
```

---

## Modal Variants

### Confirmation Modal

For confirming important actions:

```html
<div class="modal-overlay" data-open="true">
  <div class="modal modal-sm" role="alertdialog" aria-labelledby="modal-title" aria-describedby="modal-desc">
    <div class="modal-header">
      <h2 id="modal-title" class="modal-title">Close Pay Period?</h2>
      <button class="modal-close" aria-label="Close">
        <svg class="modal-close-icon"><!-- X icon --></svg>
      </button>
    </div>
    <div class="modal-body">
      <p id="modal-desc">This will finalize tip calculations and lock the pay period. This action cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost">Cancel</button>
      <button class="btn btn-primary">Close Pay Period</button>
    </div>
  </div>
</div>
```

### Danger Modal

For destructive actions:

```css
.modal-danger .modal-header {
  border-bottom-color: var(--sienna);
}

.modal-danger .modal-title {
  color: var(--sienna);
}

.modal-danger .modal-icon {
  color: var(--sienna);
  margin-bottom: var(--space-3);
}
```

### Success Modal

For confirmation of completed actions:

```css
.modal-success .modal-header {
  border-bottom-color: var(--sage);
}

.modal-success .modal-icon {
  color: var(--sage);
  margin-bottom: var(--space-3);
}
```

### Form Modal

For data entry within a modal:

```css
.modal-form .modal-body {
  padding: var(--space-5);
}

.modal-form .form-group:last-child {
  margin-bottom: 0;
}
```

---

## Specialized Modals

### Calculator Modal

For displaying tip calculation results:

```html
<div class="modal modal-lg calculator-modal">
  <div class="modal-header">
    <div>
      <h2 class="modal-title">Tip Distribution</h2>
      <p class="modal-subtitle">Pay Period: Jan 1-15, 2026</p>
    </div>
    <button class="modal-close" aria-label="Close">×</button>
  </div>
  <div class="modal-body">
    <div class="calculator-summary">
      <div class="calculator-stat">
        <span class="calculator-stat-label">Total Pool</span>
        <span class="calculator-stat-value">$4,892.50</span>
      </div>
      <div class="calculator-stat">
        <span class="calculator-stat-label">Team Members</span>
        <span class="calculator-stat-value">12</span>
      </div>
      <div class="calculator-stat">
        <span class="calculator-stat-label">Total Hours</span>
        <span class="calculator-stat-value">284.5</span>
      </div>
    </div>
    <!-- Distribution table -->
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost">Export PDF</button>
    <button class="btn btn-primary">Confirm Distribution</button>
  </div>
</div>
```

```css
.calculator-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--midnight);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
}

.calculator-stat {
  text-align: center;
}

.calculator-stat-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--stone);
  margin-bottom: var(--space-1);
}

.calculator-stat-value {
  font-family: var(--font-mono);
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--brass);
}
```

### Team Member Modal

For adding/editing team members:

```html
<div class="modal modal-md">
  <div class="modal-header">
    <h2 class="modal-title">Add Team Member</h2>
    <button class="modal-close" aria-label="Close">×</button>
  </div>
  <div class="modal-body">
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">First Name</label>
        <input type="text" class="form-input" placeholder="Maria">
      </div>
      <div class="form-group">
        <label class="form-label">Last Name</label>
        <input type="text" class="form-input" placeholder="Santos">
      </div>
      <div class="form-group form-group-full">
        <label class="form-label">Position</label>
        <select class="form-select">
          <option>Server</option>
          <option>Bartender</option>
          <option>Host</option>
          <option>Busser</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Tip Rate</label>
        <input type="text" class="form-input form-input-percentage" value="1.0">
      </div>
      <div class="form-group">
        <label class="form-label">Start Date</label>
        <input type="date" class="form-input">
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost">Cancel</button>
    <button class="btn btn-primary">Add Member</button>
  </div>
</div>
```

---

## Toast Notifications

For non-blocking feedback messages:

```css
.toast-container {
  position: fixed;
  bottom: var(--space-4);
  right: var(--space-4);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--espresso);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 400px;
  animation: toast-in var(--duration-slow) var(--ease-settle);
}

.toast-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--cream);
  margin-bottom: var(--space-1);
}

.toast-message {
  font-size: 0.875rem;
  color: var(--linen);
}

.toast-close {
  background: none;
  border: none;
  color: var(--stone);
  padding: var(--space-1);
  margin: calc(var(--space-1) * -1);
  cursor: pointer;
}

.toast-close:hover {
  color: var(--cream);
}

/* Toast variants */
.toast-success .toast-icon { color: var(--sage); }
.toast-error .toast-icon { color: var(--sienna); }
.toast-warning .toast-icon { color: var(--brass); }
.toast-info .toast-icon { color: var(--info); }

/* Animations */
@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(100%) scale(0.9);
  }
  60% {
    transform: translateY(-4px) scale(1.02);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.toast-exit {
  animation: toast-out var(--duration-normal) var(--ease-accelerate) forwards;
}

@keyframes toast-out {
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
```

---

## Tooltips

For contextual help and information:

```css
.tooltip-trigger {
  position: relative;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  padding: var(--space-2) var(--space-3);
  background: var(--mahogany);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--cream);
  white-space: nowrap;
  z-index: var(--z-dropdown);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard),
    visibility var(--duration-fast);
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--walnut);
}

.tooltip-trigger:hover .tooltip,
.tooltip-trigger:focus .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-4px);
}

/* Tooltip positions */
.tooltip-right {
  bottom: auto;
  left: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(8px);
}

.tooltip-left {
  bottom: auto;
  left: auto;
  right: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(-8px);
}

.tooltip-bottom {
  bottom: auto;
  top: 100%;
  transform: translateX(-50%) translateY(8px);
}
```

---

## Popover

For rich contextual content:

```css
.popover {
  position: absolute;
  z-index: var(--z-dropdown);
  background: var(--espresso);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  max-width: 320px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition:
    opacity var(--duration-normal) var(--ease-standard),
    transform var(--duration-normal) var(--ease-standard),
    visibility var(--duration-normal);
}

.popover[data-open="true"] {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.popover-header {
  padding: var(--space-3);
  border-bottom: 1px solid var(--walnut);
  font-weight: 600;
  color: var(--cream);
}

.popover-body {
  padding: var(--space-3);
  color: var(--linen);
  font-size: 0.875rem;
}

.popover-footer {
  padding: var(--space-2) var(--space-3);
  border-top: 1px solid var(--walnut);
  background: var(--midnight);
}
```

---

## Loading Overlay

For blocking the UI during operations:

```css
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(12, 10, 7, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--walnut);
  border-top-color: var(--brass);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: var(--space-4);
}

.loading-text {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--linen);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## Accessibility

### Focus Management

```javascript
// On modal open:
// 1. Store last focused element
// 2. Move focus to modal (or first focusable element)
// 3. Trap focus within modal

// On modal close:
// 1. Return focus to stored element
```

### ARIA Attributes

```html
<!-- Standard modal -->
<div
  class="modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal description...</p>
</div>

<!-- Alert dialog -->
<div
  class="modal"
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="alert-title"
  aria-describedby="alert-desc"
>
  ...
</div>
```

### Keyboard Navigation

- Escape closes the modal
- Tab moves between focusable elements
- Focus is trapped within modal while open
- First focusable element receives focus on open

---

## Animation Timing

### Modal Enter

```css
/* Overlay fades in */
.modal-overlay {
  transition: opacity 200ms ease;
}

/* Modal slides up with settle effect */
.modal {
  transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Modal Exit

```css
/* Faster exit for responsive feel */
.modal-overlay.closing {
  transition: opacity 150ms ease;
}

.modal.closing {
  transition: transform 150ms ease,
              opacity 150ms ease;
}
```

---

## Do's and Don'ts

### Do:
- Use modals sparingly for important actions
- Provide clear close mechanisms (X, Cancel, Escape)
- Trap focus within the modal
- Return focus after closing
- Use appropriate size for content

### Don't:
- Open modals on page load
- Nest modals within modals
- Use modals for simple confirmations (use inline)
- Block the close button during loading
- Make modals unclosable

---

## Related Documentation

- [Buttons](./buttons.md)
- [Forms](./forms.md)
- [Animation Tokens](../tokens/animations.md)
