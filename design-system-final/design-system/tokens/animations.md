# Animation System - Final Edition

**Version:** 1.0
**Date:** January 15, 2026

---

## Animation Philosophy

Animations should be:
- **Purposeful** — Guide attention, confirm actions
- **Quick** — Respect user's time
- **Smooth** — 60fps minimum
- **Accessible** — Respect prefers-reduced-motion

---

## Timing Functions

```css
:root {
  /* Standard ease out - for entrances, expansions */
  --ease-out: cubic-bezier(0.0, 0, 0.2, 1);

  /* Standard ease in-out - for movements */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Spring - for playful interactions */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 100ms | State changes, hovers |
| `--duration-base` | 150ms | Buttons, micro-interactions |
| `--duration-normal` | 200ms | Dropdowns, tooltips |
| `--duration-slow` | 300ms | Modals, drawers |
| `--duration-slower` | 400ms | Page transitions |

---

## Transition Presets

```css
:root {
  /* Quick state change (buttons, links) */
  --transition-fast: 150ms var(--ease-out);

  /* Standard transition */
  --transition-base: 200ms var(--ease-out);

  /* Larger movements */
  --transition-slow: 300ms var(--ease-in-out);

  /* Modal/overlay */
  --transition-modal: 250ms var(--ease-in-out);
}
```

---

## Common Animations

### Button Hover
```css
.btn {
  transition: background-color var(--transition-fast),
              transform var(--transition-fast);
}

.btn:active {
  transform: translateY(1px);
}
```

### Card Hover
```css
.card {
  transition: background-color var(--transition-base),
              border-color var(--transition-base);
}

.card:hover {
  background-color: var(--bg-elevated);
  border-color: var(--color-primary);
}
```

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}
```

### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp var(--duration-normal) var(--ease-out);
}
```

### Focus Glow
```css
.focus-glow {
  transition: box-shadow var(--transition-fast);
}

.focus-glow:focus-visible {
  box-shadow: var(--shadow-focus);
}
```

### Loading Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 600ms linear infinite;
}
```

---

## Reduced Motion

Always respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## CSS Custom Properties

```css
:root {
  /* Easing */
  --ease-out: cubic-bezier(0.0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Durations */
  --duration-fast: 100ms;
  --duration-base: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;

  /* Presets */
  --transition-fast: 150ms var(--ease-out);
  --transition-base: 200ms var(--ease-out);
  --transition-slow: 300ms var(--ease-in-out);
  --transition-modal: 250ms var(--ease-in-out);
}
```
