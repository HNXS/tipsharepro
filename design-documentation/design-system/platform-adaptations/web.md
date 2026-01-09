---
title: Web Platform Adaptations
description: Web-specific implementation guidelines for Tip Share Pro
last-updated: 2026-01-08
version: 1.0.0
status: approved
---

# Web Platform Guidelines

## Overview

This document covers web-specific implementation details for Tip Share Pro, including browser support, responsive design, and web-specific optimizations.

---

## Browser Support

### Target Browsers

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | Last 2 versions | Primary development target |
| Firefox | Last 2 versions | Full support |
| Safari | Last 2 versions | Test iOS Safari separately |
| Edge | Last 2 versions | Chromium-based |

### Feature Requirements

**Required:**
- CSS Custom Properties
- CSS Grid and Flexbox
- ES2020+ JavaScript
- Variable fonts

**Progressive Enhancement:**
- CSS `backdrop-filter` (frosted glass effects)
- CSS `container-queries` (component-based responsive)
- View Transitions API (page transitions)

---

## Responsive Design

### Breakpoints

```css
/* Mobile First */
--bp-sm: 480px;   /* Large phones */
--bp-md: 768px;   /* Tablets */
--bp-lg: 1024px;  /* Small desktops */
--bp-xl: 1280px;  /* Large desktops */
--bp-2xl: 1536px; /* Extra large screens */
```

### Breakpoint Usage

```css
/* Base styles (mobile) */
.container {
  padding: var(--space-3);
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--space-5);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: var(--space-8);
    max-width: 1400px;
    margin: 0 auto;
  }
}
```

### Layout Patterns

#### Mobile (< 768px)
- Single column layout
- Bottom navigation bar
- Collapsible sections
- Full-width cards
- Stack form elements vertically

#### Tablet (768px - 1023px)
- Two-column layouts where appropriate
- Side navigation (collapsible)
- Card grid (2 columns)
- Inline form labels

#### Desktop (1024px+)
- Multi-column layouts
- Fixed sidebar navigation
- Card grid (3-4 columns)
- Data tables with all columns visible

---

## Typography for Web

### Font Loading Strategy

```html
<!-- Preconnect for faster font loading -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Load variable fonts -->
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap" rel="stylesheet">
```

### Fluid Typography

Use `clamp()` for responsive type scaling:

```css
:root {
  --text-display: clamp(2rem, 5vw, 3rem);      /* 32px - 48px */
  --text-h1: clamp(1.75rem, 4vw, 2.25rem);     /* 28px - 36px */
  --text-h2: clamp(1.5rem, 3vw, 1.75rem);      /* 24px - 28px */
  --text-h3: clamp(1.25rem, 2.5vw, 1.375rem);  /* 20px - 22px */
  --text-body: clamp(0.9375rem, 1.5vw, 1rem);  /* 15px - 16px */
}
```

---

## CSS Implementation

### Custom Properties Setup

```css
:root {
  /* ===== COLORS ===== */
  --midnight: #0C0A07;
  --espresso: #1A1510;
  --mahogany: #2A2318;
  --walnut: #3D3225;

  --cream: #F7F3EA;
  --linen: #C4B9A4;
  --stone: #8B7B65;
  --ash: #5C5145;

  --brass: #D4A420;
  --brass-light: #E8C150;
  --brass-glow: rgba(212, 164, 32, 0.15);
  --ember: #E85D35;
  --ember-dark: #C44A28;
  --sage: #2D9B6E;
  --sage-dark: #248558;
  --sienna: #C74B4B;
  --sienna-dark: #A33B3B;
  --info: #6B8CAE;

  /* Semantic */
  --success: var(--sage);
  --warning: var(--brass);
  --error: var(--sienna);

  /* ===== TYPOGRAPHY ===== */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Newsreader', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* ===== SPACING ===== */
  --space-1: 6px;
  --space-2: 12px;
  --space-3: 18px;
  --space-4: 24px;
  --space-5: 30px;
  --space-6: 36px;
  --space-8: 48px;
  --space-10: 60px;
  --space-12: 72px;

  /* ===== BORDERS ===== */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-full: 9999px;

  /* ===== SHADOWS ===== */
  --shadow-sm: 0 1px 2px rgba(12, 10, 7, 0.4);
  --shadow-md: 0 4px 8px rgba(12, 10, 7, 0.5), 0 1px 2px rgba(12, 10, 7, 0.3);
  --shadow-lg: 0 12px 24px rgba(12, 10, 7, 0.6), 0 4px 8px rgba(12, 10, 7, 0.4);
  --shadow-glow: 0 0 20px rgba(212, 164, 32, 0.25);

  /* ===== MOTION ===== */
  --ease-out: cubic-bezier(0.0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-snap: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-settle: cubic-bezier(0.22, 1, 0.36, 1);

  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-reveal: 700ms;
}
```

### Base Styles

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: 1.6;
  color: var(--cream);
  background-color: var(--midnight);
}

/* Focus visible for keyboard navigation */
:focus-visible {
  outline: 2px solid var(--brass);
  outline-offset: 2px;
}

/* Remove focus outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

## Interaction States

### Hover States (Desktop Only)

```css
@media (hover: hover) {
  .button:hover {
    background-color: var(--brass-light);
  }

  .card:hover {
    background-color: var(--mahogany);
  }

  .link:hover {
    color: var(--brass);
  }
}
```

### Touch Targets

Minimum touch target size of 44x44px for mobile:

```css
.button,
.input,
.nav-item {
  min-height: 44px;
  min-width: 44px;
}

@media (min-width: 1024px) {
  .button,
  .input {
    min-height: 36px;
  }
}
```

### Focus States

```css
.button:focus-visible,
.input:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--midnight),
    0 0 0 4px var(--brass);
}
```

---

## Motion & Animation

### Reduced Motion Support

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

### Page Transitions

```css
/* Receipt Roll animation for page elements */
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity var(--duration-slow) var(--ease-settle),
    transform var(--duration-slow) var(--ease-settle);
}

/* Staggered reveal for lists */
.list-item {
  opacity: 0;
  animation: receiptRoll var(--duration-slow) var(--ease-settle) forwards;
}

.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 75ms; }
.list-item:nth-child(3) { animation-delay: 150ms; }
.list-item:nth-child(4) { animation-delay: 225ms; }
.list-item:nth-child(5) { animation-delay: 300ms; }

@keyframes receiptRoll {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Forms

### Input Styles

```css
.input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--cream);
  background-color: var(--espresso);
  border: 1px solid var(--walnut);
  border-radius: var(--border-radius-sm);
  transition:
    border-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.input:hover {
  border-color: var(--stone);
}

.input:focus {
  border-color: var(--brass);
  box-shadow: 0 0 0 3px var(--brass-glow);
}

.input::placeholder {
  color: var(--stone);
}

/* Numeric inputs */
.input[type="number"],
.input--currency {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
```

### Form Validation

```css
.input--error {
  border-color: var(--sienna);
}

.input--error:focus {
  box-shadow: 0 0 0 3px rgba(199, 75, 75, 0.15);
}

.input--success {
  border-color: var(--sage);
}

.error-message {
  color: var(--sienna);
  font-size: var(--text-caption);
  margin-top: var(--space-1);
}
```

---

## Tables

### Responsive Tables

```css
/* Wrapper for horizontal scroll on mobile */
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}

.table th,
.table td {
  padding: var(--space-2) var(--space-3);
  text-align: left;
  border-bottom: 1px solid var(--walnut);
}

.table th {
  font-family: var(--font-body);
  font-weight: 600;
  color: var(--linen);
  background-color: var(--espresso);
}

/* Numeric columns right-aligned */
.table td[data-type="currency"],
.table td[data-type="number"] {
  font-family: var(--font-mono);
  text-align: right;
}

/* Currency styling */
.table td[data-type="currency"] {
  color: var(--brass);
}
```

---

## Performance Optimization

### Critical CSS

Inline critical styles for above-the-fold content:

```html
<head>
  <style>
    /* Critical styles for initial render */
    :root { --midnight: #0C0A07; --cream: #F7F3EA; }
    body { background: var(--midnight); color: var(--cream); }
  </style>
  <link rel="stylesheet" href="/styles/main.css" media="print" onload="this.media='all'">
</head>
```

### Image Optimization

```html
<!-- Responsive images -->
<img
  src="image-800.webp"
  srcset="image-400.webp 400w, image-800.webp 800w, image-1200.webp 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Description"
  loading="lazy"
  decoding="async"
>
```

### Font Loading

```css
/* Font display swap for faster perceived load */
@font-face {
  font-family: 'Fraunces';
  font-display: swap;
  src: url('/fonts/fraunces-var.woff2') format('woff2');
}
```

---

## Accessibility

### Keyboard Navigation

```css
/* Skip link */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  padding: var(--space-2) var(--space-4);
  background: var(--brass);
  color: var(--midnight);
  z-index: 9999;
}

.skip-link:focus {
  top: 0;
}
```

### Screen Reader Utilities

```css
/* Visually hidden but accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Show on focus for skip links */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## Related Documentation

- [Platform Overview](./README.md)
- [Style Guide](../style-guide.md)
- [Components](../components/README.md)
- [Accessibility Guidelines](../../accessibility/guidelines.md)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-08 | Initial web platform documentation |
