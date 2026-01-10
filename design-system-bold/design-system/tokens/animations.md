# TipSharePro Animation & Motion

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

Motion in TipSharePro is purposeful and professional. Animations provide feedback, guide attention, and create a polished user experience without being distracting or delaying workflows.

---

## Core Principles

1. **Purposeful** - Every animation serves a function
2. **Quick** - Respect users' time with snappy interactions
3. **Subtle** - Enhance without overwhelming
4. **Accessible** - Respect reduced motion preferences

---

## Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 75ms | Instant feedback, micro-interactions |
| `--duration-fast` | 150ms | Hover states, button presses |
| `--duration-normal` | 250ms | Standard transitions, reveals |
| `--duration-slow` | 400ms | Complex animations, modals |
| `--duration-slower` | 600ms | Page transitions, large reveals |

```css
:root {
  --duration-instant: 75ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --duration-slower: 600ms;
}
```

---

## Easing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0.0, 0, 0.2, 1)` | Entrances, expansions |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exits, collapses |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | State changes |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful, bouncy effects |
| `--ease-linear` | `linear` | Progress indicators |

```css
:root {
  --ease-out: cubic-bezier(0.0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-linear: linear;
}
```

---

## Standard Transitions

### Buttons

```css
.btn {
  transition:
    background-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(232, 93, 4, 0.35);
}

.btn:active {
  transform: translateY(0);
}
```

### Cards

```css
.card {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

### Links

```css
a {
  transition: color var(--duration-fast) var(--ease-out);
}
```

### Form Inputs

```css
.form-input {
  transition:
    border-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.1);
}
```

---

## Component Animations

### Modal Enter/Exit

```css
/* Backdrop */
.modal-backdrop {
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.modal-backdrop.active {
  opacity: 1;
}

/* Modal Content */
.modal-content {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
  transition:
    opacity var(--duration-normal) var(--ease-out),
    transform var(--duration-normal) var(--ease-out);
}

.modal-content.active {
  opacity: 1;
  transform: scale(1) translateY(0);
}
```

### Toast Notifications

```css
.toast {
  transform: translateX(100%);
  opacity: 0;
  transition:
    transform var(--duration-normal) var(--ease-out),
    opacity var(--duration-normal) var(--ease-out);
}

.toast.visible {
  transform: translateX(0);
  opacity: 1;
}

/* Auto-dismiss after 3 seconds */
.toast.dismissing {
  transform: translateX(100%);
  opacity: 0;
  transition-duration: var(--duration-slow);
}
```

### Dropdown/Select

```css
.dropdown-menu {
  opacity: 0;
  transform: translateY(-8px);
  transition:
    opacity var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
  pointer-events: none;
}

.dropdown-menu.open {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
```

### Accordion/Collapse

```css
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--duration-normal) var(--ease-out);
}

.accordion-content.expanded {
  max-height: 500px; /* Adjust based on content */
}
```

---

## Loading States

### Spinner

```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--color-fog);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}
```

### Skeleton Loading

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-fog) 25%,
    var(--color-stone) 50%,
    var(--color-fog) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}
```

### Progress Bar

```css
@keyframes progress-indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-bar {
  overflow: hidden;
  background: var(--color-fog);
  border-radius: var(--radius-full);
}

.progress-bar-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width var(--duration-normal) var(--ease-out);
}

.progress-bar-indeterminate .progress-bar-fill {
  width: 50%;
  animation: progress-indeterminate 1.5s infinite var(--ease-in-out);
}
```

---

## Page Transitions

### Fade In

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}
```

### Slide Up

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideUp {
  animation: slideUp var(--duration-normal) var(--ease-out);
}
```

---

## Accessibility

### Reduced Motion

Always respect user preferences for reduced motion:

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

### Focus Transitions

Focus states should be instant for accessibility:

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  /* No transition on focus for immediate feedback */
}
```

---

## Usage Guidelines

### DO
- Use `ease-out` for entrances (elements appearing)
- Use `ease-in` for exits (elements leaving)
- Keep most transitions under 300ms
- Provide loading feedback for operations > 500ms

### DON'T
- Don't animate properties that cause layout shifts (width, height)
- Don't use animations that loop indefinitely (except loading)
- Don't delay important user feedback
- Don't use motion that could trigger vestibular disorders

---

## Performance Tips

1. **Animate only transform and opacity** - These are GPU-accelerated
2. **Use `will-change` sparingly** - Only for complex animations
3. **Avoid animating during scroll** - Can cause jank
4. **Test on low-end devices** - Ensure smooth 60fps

```css
/* Good - GPU accelerated */
.card:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* Avoid - Causes layout recalculation */
.card:hover {
  margin-top: -2px;
  width: 102%;
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial animation specifications |
