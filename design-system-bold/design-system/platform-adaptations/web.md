# TipSharePro Web Platform Specifications

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

TipSharePro is built as a responsive web application optimized for the restaurant industry. This document covers web-specific design considerations, browser support, and responsive behavior.

---

## Browser Support

### Supported Browsers

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 90+ | Full |
| Firefox | 88+ | Full |
| Safari | 14+ | Full |
| Edge | 90+ | Full |
| Samsung Internet | 14+ | Full |
| iOS Safari | 14+ | Full |

### Not Supported

- Internet Explorer (all versions)
- Opera Mini
- Browsers older than 2 years

---

## Responsive Design

### Breakpoint System

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### Mobile (< 640px)

**Layout Adaptations:**
- Single-column layouts
- Full-width buttons
- Stacked form elements
- Bottom navigation bar
- Collapsible sections
- Swipe gestures for tables

**Typography:**
- Base font size: 16px (prevents zoom on iOS)
- Reduced heading sizes
- Adequate line height for readability

```css
@media (max-width: 639px) {
  .container {
    padding: var(--space-4);
  }

  .page-title {
    font-size: 1.5rem;
  }

  .btn {
    width: 100%;
  }

  .form-group {
    margin-bottom: var(--space-4);
  }

  /* Stack card grids */
  .stat-grid {
    grid-template-columns: 1fr;
  }

  /* Show quick actions bar */
  .quick-actions {
    display: flex;
  }
}
```

### Tablet (640px - 1023px)

**Layout Adaptations:**
- Two-column layouts where appropriate
- Side-by-side button groups
- Horizontal form layouts
- Standard navigation
- Touch-optimized targets

```css
@media (min-width: 640px) and (max-width: 1023px) {
  .container {
    max-width: 720px;
    padding: var(--space-6);
  }

  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
}
```

### Desktop (≥ 1024px)

**Layout Adaptations:**
- Multi-column layouts
- Fixed sidebar navigation (optional)
- Hover states enabled
- Full table views
- Keyboard shortcuts active

```css
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    padding: var(--space-8);
  }

  .stat-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .page-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: var(--space-6);
  }
}
```

---

## Touch Optimization

### Touch Targets

All interactive elements meet minimum touch target size:

| Element | Minimum Size |
|---------|--------------|
| Buttons | 44px × 44px |
| Form inputs | 44px height |
| Links | 44px tap area |
| Icons | 44px × 44px |

```css
/* Ensure touch targets */
.btn {
  min-height: 44px;
  min-width: 44px;
}

.form-input,
.form-select {
  min-height: 44px;
}

/* Expand small link tap areas */
.link-sm {
  padding: var(--space-2);
  margin: calc(var(--space-2) * -1);
}
```

### Touch Feedback

```css
/* Immediate feedback on touch */
@media (hover: none) {
  .btn:active {
    transform: scale(0.98);
    opacity: 0.9;
  }

  /* Disable hover effects */
  .card:hover {
    transform: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}
```

---

## Input Handling

### Form Input Types

Use appropriate HTML5 input types for mobile optimization:

```html
<!-- Numeric keypad for currency -->
<input type="number" inputmode="decimal" step="0.01">

<!-- Numeric keypad for hours -->
<input type="number" inputmode="decimal" step="0.5">

<!-- Email keyboard -->
<input type="email" autocomplete="email">

<!-- Password with show/hide -->
<input type="password" autocomplete="current-password">

<!-- Date picker -->
<input type="date">
```

### Input Mode Optimization

```html
<!-- For currency/percentage fields -->
<input type="text"
       inputmode="decimal"
       pattern="[0-9]*\.?[0-9]*"
       placeholder="0.00">
```

---

## Performance Optimization

### Critical Rendering

- Inline critical CSS
- Defer non-critical JavaScript
- Preload key fonts
- Optimize images (WebP with fallback)

```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/outfit-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/jetbrains-mono-var.woff2" as="font" type="font/woff2" crossorigin>

<!-- Critical CSS inline -->
<style>
  /* Critical above-fold styles */
</style>

<!-- Deferred stylesheets -->
<link rel="stylesheet" href="/css/main.css" media="print" onload="this.media='all'">
```

### Image Optimization

```html
<!-- Responsive images -->
<picture>
  <source srcset="logo.webp" type="image/webp">
  <img src="logo.png" alt="TipSharePro" width="200" height="50">
</picture>

<!-- Lazy loading for below-fold images -->
<img src="chart.png" loading="lazy" alt="Distribution chart">
```

### Bundle Size Targets

| Resource | Target | Max |
|----------|--------|-----|
| Initial HTML | < 15KB | 30KB |
| Critical CSS | < 10KB | 20KB |
| Total CSS | < 50KB | 100KB |
| JavaScript | < 100KB | 200KB |
| Fonts | < 100KB | 150KB |

---

## Print Optimization

TipSharePro includes print styles for distribution reports:

```css
@media print {
  /* Hide non-essential elements */
  .nav-hub,
  .quick-actions,
  .btn-ghost,
  .no-print {
    display: none !important;
  }

  /* Reset colors for print */
  body {
    background: white;
    color: black;
  }

  /* Ensure tables fit */
  .table {
    font-size: 10pt;
    box-shadow: none;
  }

  /* Add page breaks */
  .page-break {
    page-break-before: always;
  }

  /* Prevent row breaks */
  .table tr {
    page-break-inside: avoid;
  }

  /* Hide sensitive wage data */
  .hide-on-print {
    display: none !important;
  }

  /* Add print header */
  .print-header {
    display: block !important;
  }
}
```

---

## Offline Considerations

### Future PWA Features

```javascript
// Service worker registration (future)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

### Current Offline Handling

```html
<!-- Show offline message -->
<div class="offline-banner" hidden>
  <p>You appear to be offline. Some features may be unavailable.</p>
</div>

<script>
  window.addEventListener('offline', () => {
    document.querySelector('.offline-banner').hidden = false;
  });
  window.addEventListener('online', () => {
    document.querySelector('.offline-banner').hidden = true;
  });
</script>
```

---

## Accessibility on Web

See `/accessibility/` documentation for full details. Key web-specific considerations:

- Keyboard navigation for all interactive elements
- Skip links for screen readers
- Reduced motion support
- High contrast mode support

```css
/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --color-fog: #000000;
    --color-text-secondary: #000000;
  }
}
```

---

## URL Structure

### Clean URLs

```
/                     → Login (Page 1)
/nav                  → Navigation Hub (Page 2)
/settings             → Settings (Page 3)
/sandbox              → Scenario Sandbox (Page 4)
/daily                → Daily Contributions (Page 5)
/ppe                  → PPE Contributions (Page 6)
/distribution         → PPE Distribution (Page 7)
/ytd                  → YTD Data (Page 8)
/allocations          → PP Allocations (Page 9)
```

### Query Parameters

```
/daily?date=2026-01-10
/distribution?period=2026-01-15
/ytd?year=2025
```

---

## Security Considerations

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               font-src 'self' https://fonts.gstatic.com;
               script-src 'self';
               img-src 'self' data:;">
```

### Secure Cookies

```
Set-Cookie: session=xyz; Secure; HttpOnly; SameSite=Strict
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial web platform specifications |
