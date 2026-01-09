---
title: Animation & Motion Tokens
description: The "Cash Flow" animation library for Tip Share Pro
last-updated: 2026-01-08
version: 1.0.0
related-files:
  - ../style-guide.md
  - ./spacing.md
status: approved
---

# Animation & Motion Tokens

## The "Cash Flow" Philosophy

Animations in Tip Share Pro tell the story of money moving through the system. Every motion is purposeful, satisfying, and grounded in the physical world of restaurant finance:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ANIMATION METAPHORS                                               │
│   ━━━━━━━━━━━━━━━━━━━                                               │
│                                                                     │
│   💰 Tips settling into place → gravity, weight, satisfaction      │
│   📑 Paper sliding into a tray → smooth, confident motion          │
│   🔔 Cash register ding → crisp, celebratory micro-feedback        │
│   ✨ Brass catching light → subtle shimmer, warmth                 │
│   📊 Columns tallying → sequential, rhythmic counting              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Principles

### 1. Physical Weight
Elements have mass. Larger elements move slower; smaller elements can be quick. Money feels substantial.

### 2. Purposeful Motion
Every animation communicates something. No animation for animation's sake.

### 3. Sequential Flow
Related elements animate in sequence, like bills being counted. This creates rhythm and helps users track changes.

### 4. Night-Shift Appropriate
Animations are smooth and non-jarring—appropriate for tired eyes at 1 AM.

### 5. Respect for Reduced Motion
All animations honor `prefers-reduced-motion`. Essential feedback uses color/opacity instead.

---

## Timing Functions

### Custom Easing Curves

```css
:root {
  /* Standard ease - most interactions */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

  /* Decelerate - elements entering/appearing */
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);

  /* Accelerate - elements leaving/exiting */
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);

  /* Settle - heavy elements coming to rest (like cash settling) */
  --ease-settle: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Snap - quick, decisive actions */
  --ease-snap: cubic-bezier(0.2, 0, 0, 1);

  /* Flow - smooth, continuous motion (like counting money) */
  --ease-flow: cubic-bezier(0.45, 0, 0.15, 1);
}
```

### Visual Reference

```
Standard:   ──────────╮
                       ╰─────
Decelerate: ───────────────╮
                            ╰
Accelerate: ╭───────────────
            ╰
Settle:     ──────╮   ╭──
                  ╰───╯
Snap:       ──────────────╮
                          ╰
Flow:       ─────────────────
```

---

## Duration Scale

| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-instant` | 50ms | Micro-feedback (color changes) |
| `--duration-fast` | 100ms | Button presses, checkboxes |
| `--duration-normal` | 200ms | Standard transitions |
| `--duration-slow` | 300ms | Complex transforms |
| `--duration-slower` | 400ms | Modal appearances |
| `--duration-slowest` | 500ms | Page transitions |
| `--duration-count` | 1500ms | Number counting animations |

```css
:root {
  --duration-instant: 50ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;
  --duration-slowest: 500ms;
  --duration-count: 1500ms;
}
```

---

## Keyframe Animations

### Paper Slide In

Elements entering like paper sliding across a surface:

```css
@keyframes paper-slide-in {
  from {
    opacity: 0;
    transform: translateY(-8px) rotate(-0.5deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
}

.slide-in {
  animation: paper-slide-in var(--duration-slow) var(--ease-decelerate);
}
```

### Cash Settle

Heavy elements landing with satisfying weight:

```css
@keyframes cash-settle {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  60% {
    opacity: 1;
    transform: translateY(2px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.settle {
  animation: cash-settle var(--duration-slower) var(--ease-settle);
}
```

### Coin Drop

For small value indicators:

```css
@keyframes coin-drop {
  0% {
    opacity: 0;
    transform: translateY(-30px) rotateX(30deg);
  }
  50% {
    opacity: 1;
  }
  70% {
    transform: translateY(3px) rotateX(-5deg);
  }
  85% {
    transform: translateY(-1px) rotateX(2deg);
  }
  100% {
    transform: translateY(0) rotateX(0);
  }
}

.coin-drop {
  animation: coin-drop var(--duration-slow) var(--ease-settle);
}
```

### Register Ding

Celebratory pulse for success states:

```css
@keyframes register-ding {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 var(--brass-glow);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 8px transparent;
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 transparent;
  }
}

.success-ding {
  animation: register-ding var(--duration-slow) var(--ease-standard);
}
```

### Brass Shimmer

Subtle highlight animation for gold/brass elements:

```css
@keyframes brass-shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    var(--brass) 0%,
    var(--brass-light) 50%,
    var(--brass) 100%
  );
  background-size: 200% auto;
  animation: brass-shimmer 2s var(--ease-flow) infinite;
}
```

### Count Up

For animated number counting:

```css
@keyframes count-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.counting {
  animation: count-pulse var(--duration-fast) var(--ease-standard) infinite;
}
```

### Tally Mark

Sequential appearance for list items:

```css
@keyframes tally-in {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tally-item {
  animation: tally-in var(--duration-normal) var(--ease-decelerate);
}

/* Staggered delays */
.tally-item:nth-child(1) { animation-delay: 0ms; }
.tally-item:nth-child(2) { animation-delay: 50ms; }
.tally-item:nth-child(3) { animation-delay: 100ms; }
.tally-item:nth-child(4) { animation-delay: 150ms; }
.tally-item:nth-child(5) { animation-delay: 200ms; }
/* ... continue as needed */
```

---

## Transition Presets

### Standard Transition

```css
.transition-standard {
  transition: all var(--duration-normal) var(--ease-standard);
}
```

### Color Transitions

```css
.transition-colors {
  transition:
    color var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}
```

### Transform Transitions

```css
.transition-transform {
  transition: transform var(--duration-normal) var(--ease-standard);
}
```

### Opacity Transitions

```css
.transition-opacity {
  transition: opacity var(--duration-normal) var(--ease-standard);
}
```

---

## Component Animations

### Button States

```css
.btn {
  transition:
    transform var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(1px);
  transition-duration: var(--duration-instant);
}

/* Primary button glow on hover */
.btn-primary:hover {
  box-shadow: 0 4px 12px var(--brass-glow);
}
```

### Card Hover

```css
.card {
  transition:
    transform var(--duration-normal) var(--ease-standard),
    box-shadow var(--duration-normal) var(--ease-standard),
    border-color var(--duration-normal) var(--ease-standard);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--walnut);
}
```

### Table Row Hover

```css
.table-row {
  transition: background-color var(--duration-fast) var(--ease-standard);
}

.table-row:hover {
  background-color: var(--mahogany);
}
```

### Input Focus

```css
.input {
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.input:focus {
  border-color: var(--brass);
  box-shadow: var(--shadow-glow);
}
```

### Modal Entrance

```css
.modal-backdrop {
  animation: fade-in var(--duration-normal) var(--ease-standard);
}

.modal-content {
  animation: cash-settle var(--duration-slower) var(--ease-settle);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Dropdown Menu

```css
.dropdown-menu {
  transform-origin: top center;
  animation: dropdown-open var(--duration-normal) var(--ease-decelerate);
}

@keyframes dropdown-open {
  from {
    opacity: 0;
    transform: scaleY(0.9) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: scaleY(1) translateY(0);
  }
}
```

### Toast Notification

```css
.toast {
  animation: toast-in var(--duration-slow) var(--ease-settle);
}

.toast-exit {
  animation: toast-out var(--duration-normal) var(--ease-accelerate);
}

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

@keyframes toast-out {
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
```

---

## Number Animations

### Counting Numbers

For animating dollar amounts changing:

```css
.counting-number {
  font-variant-numeric: tabular-nums;
  transition: color var(--duration-fast) var(--ease-standard);
}

/* Add subtle pulse while counting */
.counting-number[data-counting="true"] {
  animation: count-pulse var(--duration-fast) var(--ease-standard) infinite;
}
```

### Value Change Indicators

```css
.value-changed {
  position: relative;
}

.value-increased::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: var(--sage);
  opacity: 0;
  border-radius: inherit;
  animation: highlight-flash var(--duration-slow) var(--ease-standard);
}

.value-decreased::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: var(--sienna);
  opacity: 0;
  border-radius: inherit;
  animation: highlight-flash var(--duration-slow) var(--ease-standard);
}

@keyframes highlight-flash {
  0% { opacity: 0.3; }
  100% { opacity: 0; }
}
```

---

## Loading States

### Skeleton Pulse

```css
@keyframes skeleton-pulse {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--espresso) 0%,
    var(--mahogany) 50%,
    var(--espresso) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s var(--ease-flow) infinite;
  border-radius: var(--radius-sm);
}
```

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
  border: 2px solid var(--walnut);
  border-top-color: var(--brass);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

### Progress Bar Fill

```css
@keyframes progress-fill {
  from {
    transform: scaleX(0);
  }
}

.progress-bar {
  transform-origin: left center;
  animation: progress-fill var(--duration-count) var(--ease-flow);
}
```

---

## Page Transitions

### Page Enter

```css
.page-enter {
  animation: page-enter var(--duration-slower) var(--ease-decelerate);
}

@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Page Exit

```css
.page-exit {
  animation: page-exit var(--duration-normal) var(--ease-accelerate);
}

@keyframes page-exit {
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}
```

---

## Reduced Motion

**Critical:** Respect user preferences for reduced motion.

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

  /* Keep essential feedback via opacity */
  .btn:hover,
  .card:hover {
    opacity: 0.9;
  }

  /* Remove transform-based animations */
  .btn:hover,
  .btn:active,
  .card:hover {
    transform: none;
  }
}
```

---

## Performance Guidelines

### Hardware Acceleration

Only animate `transform` and `opacity` when possible:

```css
/* Good - GPU accelerated */
.animate-good {
  transform: translateY(10px);
  opacity: 0.5;
}

/* Avoid - triggers layout */
.animate-avoid {
  top: 10px;
  height: 100px;
  margin: 20px;
}
```

### Will-Change Hints

Use sparingly for known animations:

```css
.will-animate {
  will-change: transform, opacity;
}

/* Remove after animation */
.animation-complete {
  will-change: auto;
}
```

### Staggering Large Lists

For lists with many items, batch animations:

```css
/* Only animate visible items */
.list-item {
  animation: tally-in var(--duration-normal) var(--ease-decelerate);
  animation-fill-mode: both;
}

/* Cap the stagger delay */
.list-item:nth-child(n+10) {
  animation-delay: 450ms; /* Max delay for items 10+ */
}
```

---

## CSS Implementation Summary

```css
:root {
  /* Timing */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --ease-settle: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-snap: cubic-bezier(0.2, 0, 0, 1);
  --ease-flow: cubic-bezier(0.45, 0, 0.15, 1);

  /* Durations */
  --duration-instant: 50ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;
  --duration-slowest: 500ms;
  --duration-count: 1500ms;
}
```

---

## Do's and Don'ts

### Do:
- Use animations to provide feedback and context
- Honor reduced motion preferences
- Keep animations short (under 500ms for most)
- Use staggered animations for lists
- Animate transform/opacity for performance

### Don't:
- Animate for decoration alone
- Use bouncy animations (too playful for financial data)
- Block user interaction during animations
- Animate layout properties (width, height, margin)
- Use infinite animations except for loaders

---

## Related Documentation

- [Style Guide](../style-guide.md)
- [Spacing Tokens](./spacing.md)
- [Color Tokens](./colors.md)

---

## Last Updated

| Date | Changes |
|------|---------|
| 2026-01-08 | Initial animation system |
