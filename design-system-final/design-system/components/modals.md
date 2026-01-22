# Modal Components - Final Edition

**Version:** 1.0
**Date:** January 15, 2026
**Status:** Active

---

## Modal Philosophy

Modals in TipSharePro are used for:
- !!Note critical warnings (requires acknowledgment)
- Confirmation dialogs (delete, submit)
- Demo intro dialog
- Print previews

---

## Base Modal

### Visual Specification

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  BACKDROP                                                                │
│  rgba(12, 10, 7, 0.9) - semi-transparent midnight                        │
│                                                                          │
│           ┌────────────────────────────────────────────────┐             │
│           │                                                │             │
│           │  Modal Title                               ✕   │             │
│           │  ────────────────────────────────────────────  │             │
│           │                                                │             │
│           │  Modal content goes here. This can include     │             │
│           │  text, forms, or other components.             │             │
│           │                                                │             │
│           │                                                │             │
│           │  ────────────────────────────────────────────  │             │
│           │                        [Cancel]  [Confirm]     │             │
│           │                                                │             │
│           └────────────────────────────────────────────────┘             │
│                                                                          │
│           #1A1510 bg / #3D3225 border / 16px radius                      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Specifications

| Property | Value |
|----------|-------|
| Backdrop | `rgba(12, 10, 7, 0.9)` |
| Background | `--bg-surface` (#1A1510) |
| Border | 1px solid `--bg-border` (#3D3225) |
| Border Radius | 16px (`--radius-xl`) |
| Max Width | 480px (small), 640px (medium), 800px (large) |
| Padding | 24px |
| Shadow | `--shadow-lg` |

### CSS

```css
/* Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 10, 7, 0.9);
  z-index: var(--z-modal-backdrop);
  padding: var(--space-4);
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal Container */
.modal {
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - 48px);
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: slideUp var(--duration-normal) var(--ease-out);
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

.modal-sm { max-width: 400px; }
.modal-md { max-width: 560px; }
.modal-lg { max-width: 720px; }

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-5);
  border-bottom: 1px solid var(--bg-border);
}

.modal-title {
  font-family: var(--font-primary);
  font-size: var(--text-h4);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.modal-close:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

/* Modal Body */
.modal-body {
  padding: var(--space-5);
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.modal-body p {
  margin: 0 0 var(--space-3);
  line-height: var(--leading-relaxed);
  color: var(--text-primary);
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--bg-border);
}
```

---

## !!Note Warning Modal

For critical compliance warnings that require acknowledgment.

### Visual Specification

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│           ┌────────────────────────────────────────────────┐             │
│           │                                                │             │
│           │  ⚠️ IMPORTANT NOTICE                           │             │
│           │  ────────────────────────────────────────────  │             │
│           │                                                │             │
│           │  Changing job category weights after Launch    │             │
│           │  Date requires proper employee notification.   │             │
│           │                                                │             │
│           │  Affected employees must receive:              │             │
│           │  • 1 full pay period written notice            │             │
│           │  • Signed acknowledgment form                  │             │
│           │                                                │             │
│           │  ┌────────────────────────────────────────┐    │             │
│           │  │  ☐ I Have Read and Agree               │    │             │
│           │  └────────────────────────────────────────┘    │             │
│           │                                                │             │
│           │  ────────────────────────────────────────────  │             │
│           │                      [Cancel]  [Continue →]    │             │
│           │                                                │             │
│           └────────────────────────────────────────────────┘             │
│                                                                          │
│           #F59E0B border accent                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### CSS

```css
.modal-warning {
  border: 2px solid var(--color-warning);
}

.modal-warning .modal-header {
  background: rgba(245, 158, 11, 0.1);
}

.modal-warning .modal-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-warning);
}

.modal-warning .modal-title svg {
  width: 24px;
  height: 24px;
}

/* Checkbox acknowledgment */
.modal-acknowledge {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  margin-top: var(--space-4);
}

.modal-acknowledge input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary);
}

.modal-acknowledge label {
  font-size: var(--text-body);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  cursor: pointer;
}

/* Continue button disabled until checked */
.modal-footer .btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## Confirmation Modal

For delete/destructive actions.

```css
.modal-danger .modal-header {
  background: rgba(220, 38, 38, 0.1);
}

.modal-danger .modal-title {
  color: var(--color-error);
}

.modal-danger .btn-danger {
  background: var(--color-error);
  color: white;
}
```

---

## Demo Intro Modal

For the demo welcome dialog.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│           ┌────────────────────────────────────────────────┐             │
│           │                                                │             │
│           │  👋 Welcome to TipSharePro Demo!               │             │
│           │  ────────────────────────────────────────────  │             │
│           │                                                │             │
│           │  Configure your settings and see the           │             │
│           │  distribution table update in real-time.       │             │
│           │                                                │             │
│           │  💡 TIP: Set hours to zero to remove an        │             │
│           │  employee from the pool.                       │             │
│           │                                                │             │
│           │  ────────────────────────────────────────────  │             │
│           │                           [Get Started →]      │             │
│           │                                                │             │
│           └────────────────────────────────────────────────┘             │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Modal Sizes

| Size | Max Width | Use Case |
|------|-----------|----------|
| Small | 400px | Simple confirmations |
| Medium | 560px | !!Note warnings, forms |
| Large | 720px | Complex forms, print preview |

---

## Animation

```css
/* Enter */
.modal-enter {
  animation: modalEnter 250ms var(--ease-out);
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(16px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Exit */
.modal-exit {
  animation: modalExit 200ms var(--ease-in-out);
}

@keyframes modalExit {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

---

## Accessibility

- Focus trapped inside modal when open
- ESC key closes modal
- Body scroll locked when modal open
- Return focus to trigger element on close
- Aria attributes for screen readers

```html
<div
  class="modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-body"
>
  <div class="modal-header">
    <h2 id="modal-title" class="modal-title">Modal Title</h2>
    <button class="modal-close" aria-label="Close modal">✕</button>
  </div>
  <div id="modal-body" class="modal-body">
    <!-- content -->
  </div>
</div>
```

```javascript
// Focus trap example
const focusableElements = modal.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);
const firstElement = focusableElements[0];
const lastElement = focusableElements[focusableElements.length - 1];

modal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
});
```

---

## Related Files

- [Buttons](./buttons.md)
- [Forms](./forms.md)
- [Help System](./help-system.md) — For !!Note patterns
- [Colors](../tokens/colors.md)
