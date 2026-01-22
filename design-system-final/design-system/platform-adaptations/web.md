# Web Platform Adaptations - Final Edition

**Version:** 1.0
**Date:** January 15, 2026
**Status:** Active

---

## Overview

TipSharePro is a web-first application. This document covers web-specific implementation guidelines, browser support, and responsive design patterns.

---

## Browser Support

### Tier 1 (Full Support)
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Tier 2 (Functional Support)
- Chrome 80+
- Firefox 78+
- Safari 13+
- Edge 80+

### Not Supported
- Internet Explorer (any version)
- Opera Mini

---

## Responsive Breakpoints

```css
/* Mobile First Approach */

/* Extra small (phones) */
/* Default styles - no media query */

/* Small (large phones, small tablets) */
@media (min-width: 640px) { /* sm */ }

/* Medium (tablets) */
@media (min-width: 768px) { /* md */ }

/* Large (laptops) */
@media (min-width: 1024px) { /* lg */ }

/* Extra large (desktops) */
@media (min-width: 1280px) { /* xl */ }

/* 2XL (large desktops) */
@media (min-width: 1536px) { /* 2xl */ }
```

---

## Layout Patterns

### Container

```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding-left: var(--space-6);
    padding-right: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

### Grid System

```css
.grid {
  display: grid;
  gap: var(--space-4);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}
```

---

## Touch Targets

Minimum touch target size: **44x44px**

```css
/* Ensure all interactive elements meet minimum size */
button,
a,
input,
select,
[role="button"] {
  min-height: 44px;
  min-width: 44px;
}

/* For inline links, use padding */
.inline-link {
  padding: 8px 0;
  margin: -8px 0;
}
```

---

## Form Handling

### Input Zoom Prevention (iOS)

```css
/* Prevent zoom on focus for iOS Safari */
input,
select,
textarea {
  font-size: 16px; /* 16px or larger prevents zoom */
}
```

### Autocomplete Styling

```css
/* Style autofilled inputs */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--text-primary);
  -webkit-box-shadow: 0 0 0 1000px var(--bg-surface) inset;
  transition: background-color 5000s ease-in-out 0s;
}
```

---

## Print Styles

```css
@media print {
  /* Hide non-essential elements */
  .no-print,
  .header,
  .sidebar,
  .navigation,
  button:not(.print-include) {
    display: none !important;
  }

  /* Reset colors for printing */
  body {
    background: white !important;
    color: black !important;
  }

  .card,
  .table-container {
    background: white !important;
    border: 1px solid #ccc !important;
    box-shadow: none !important;
  }

  /* Page breaks */
  .page-break-before {
    page-break-before: always;
  }

  .page-break-after {
    page-break-after: always;
  }

  .avoid-break {
    page-break-inside: avoid;
  }

  /* Table printing */
  table {
    width: 100%;
  }

  th, td {
    padding: 8px;
    border-bottom: 1px solid #ddd;
  }

  /* Hide wage column for confidentiality */
  .rate-column {
    display: none !important;
  }
}
```

---

## Performance Guidelines

### CSS

```css
/* Use efficient selectors */
/* Good */
.button { }
.card-title { }

/* Avoid */
div.container > ul > li > a { }
*:hover { }

/* Use transform/opacity for animations */
.animate {
  /* Good - GPU accelerated */
  transform: translateX(0);
  opacity: 1;
  transition: transform 200ms, opacity 200ms;
}

.animate:hover {
  transform: translateX(4px);
  opacity: 0.9;
}

/* Avoid animating layout properties */
/* Bad */
.animate-bad {
  width: 100px;
  margin-left: 0;
  transition: width 200ms, margin-left 200ms;
}
```

### Loading

```css
/* Skeleton loading states */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-surface) 0%,
    var(--bg-elevated) 50%,
    var(--bg-surface) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## Font Loading

```html
<!-- Preload critical fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" as="style">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
```

```css
/* Font display strategy */
body {
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Fallback while loading */
.fonts-loading body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## Scroll Behavior

```css
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

/* Scroll padding for fixed header */
html {
  scroll-padding-top: 80px; /* header height + buffer */
}

/* Custom scrollbar for dark theme */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-body);
}

::-webkit-scrollbar-thumb {
  background: var(--bg-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
```

---

## Focus Management

```css
/* Remove default outline, add custom */
:focus {
  outline: none;
}

:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

/* Skip link for accessibility */
.skip-link {
  position: absolute;
  top: -100px;
  left: 16px;
  padding: 8px 16px;
  background: var(--color-primary);
  color: var(--color-midnight);
  border-radius: var(--radius-md);
  z-index: 9999;
  transition: top 200ms;
}

.skip-link:focus {
  top: 16px;
}
```

---

## Dark Mode

TipSharePro is dark-only, but CSS is structured to support future light mode:

```css
:root {
  color-scheme: dark;
}

/* If light mode is ever added:
@media (prefers-color-scheme: light) {
  :root {
    --bg-body: #FFFFFF;
    --bg-surface: #F5F5F5;
    --text-primary: #1A1A1A;
    // etc.
  }
}
*/
```

---

## Meta Tags

```html
<head>
  <!-- Viewport -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

  <!-- Theme color (affects browser UI) -->
  <meta name="theme-color" content="#0C0A07">

  <!-- Disable auto-detection on mobile -->
  <meta name="format-detection" content="telephone=no">

  <!-- PWA hints -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
```

---

## Related Files

- [Style Guide](../style-guide.md)
- [Animations](../tokens/animations.md)
- [Accessibility](../accessibility/guidelines.md)
