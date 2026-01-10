# TipSharePro Card Components

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

Cards are versatile containers used throughout TipSharePro for grouping related content, displaying statistics, and presenting information in a scannable format.

---

## Card Variants

### Standard Card

Basic container for content grouping.

| Property | Value |
|----------|-------|
| Background | `#FFFFFF` |
| Border | `1px solid #E5E5E5` |
| Border Radius | `12px` |
| Padding | `24px` |
| Shadow | `0 1px 3px rgba(0,0,0,0.1)` |

```css
.card {
  background: var(--color-white);
  border: 1px solid var(--color-fog);
  border-radius: 12px;
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

```html
<div class="card">
  <h3 class="card-title">Card Title</h3>
  <p class="card-text">Card content goes here...</p>
</div>
```

---

### Featured Card

Card with left accent border for emphasis.

```css
.card-featured {
  border-left: 4px solid var(--color-primary);
}

.card-featured.success {
  border-left-color: var(--color-success);
}

.card-featured.warning {
  border-left-color: var(--color-warning);
}

.card-featured.info {
  border-left-color: var(--color-accent);
}
```

```html
<div class="card card-featured">
  <h3 class="card-title">Important Notice</h3>
  <p class="card-text">This card has visual emphasis...</p>
</div>
```

---

### Stat Card

For displaying key metrics and statistics.

```html
<div class="stat-card">
  <div class="stat-value">$1,254</div>
  <div class="stat-label">Total Pool</div>
  <div class="stat-change positive">
    <span class="change-icon">↑</span>
    <span>12.5% vs last period</span>
  </div>
</div>
```

```css
.stat-card {
  background: var(--color-white);
  border: 1px solid var(--color-fog);
  border-radius: 12px;
  padding: var(--space-6);
  text-align: center;
  transition: border-color 150ms ease-out;
}

.stat-card:hover {
  border-color: var(--color-primary);
}

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.1;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-top: var(--space-2);
}

.stat-change {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: 0.875rem;
  margin-top: var(--space-3);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
}

.stat-change.positive {
  color: var(--color-success);
  background: var(--color-success-light);
}

.stat-change.negative {
  color: var(--color-error);
  background: var(--color-error-light);
}

.stat-change .change-icon {
  font-weight: 700;
}
```

---

### Stat Card Grid

For displaying multiple stats together.

```html
<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-value">$1,254</div>
    <div class="stat-label">Total Pool</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">12</div>
    <div class="stat-label">Recipients</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">$104.50</div>
    <div class="stat-label">Avg. Share</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">7</div>
    <div class="stat-label">Days in Period</div>
  </div>
</div>
```

```css
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-4);
}
```

---

### Info Card

For displaying informational content with icon.

```html
<div class="info-card">
  <div class="info-card-icon">
    <svg><!-- Icon --></svg>
  </div>
  <div class="info-card-content">
    <h4 class="info-card-title">Powerful Calculations</h4>
    <p class="info-card-text">
      Hours x Rate x Weight ensures fair distribution based on actual contribution.
    </p>
  </div>
</div>
```

```css
.info-card {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-5);
  background: var(--color-white);
  border: 1px solid var(--color-fog);
  border-radius: 12px;
}

.info-card-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 12px;
}

.info-card-icon svg {
  width: 24px;
  height: 24px;
}

.info-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
}

.info-card-text {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}
```

---

### Employee Card

For displaying employee information in lists.

```html
<div class="employee-card">
  <div class="employee-info">
    <div class="employee-avatar">MS</div>
    <div>
      <div class="employee-name">Maria Santos</div>
      <span class="badge badge-server">Server</span>
    </div>
  </div>
  <div class="employee-stats">
    <div class="employee-stat">
      <span class="stat-number">32.5</span>
      <span class="stat-unit">hrs</span>
    </div>
    <div class="employee-stat">
      <span class="stat-number">$178</span>
      <span class="stat-unit">share</span>
    </div>
  </div>
</div>
```

```css
.employee-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  background: var(--color-white);
  border: 1px solid var(--color-fog);
  border-radius: 8px;
  transition: border-color 150ms ease-out;
}

.employee-card:hover {
  border-color: var(--color-primary);
}

.employee-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.employee-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-secondary);
  color: var(--color-white);
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 50%;
}

.employee-name {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.employee-stats {
  display: flex;
  gap: var(--space-6);
}

.employee-stat {
  text-align: right;
}

.employee-stat .stat-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.employee-stat .stat-unit {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
```

---

### Interactive Card

Cards that act as clickable links or buttons.

```css
.card-interactive {
  cursor: pointer;
  transition: all 150ms ease-out;
}

.card-interactive:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(232, 93, 4, 0.15);
  transform: translateY(-2px);
}

.card-interactive:active {
  transform: translateY(0);
}

.card-interactive:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

### Card with Header

Card with distinct header section.

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-header-title">Pay Period Summary</h3>
    <button class="btn btn-ghost btn-sm">Export PDF</button>
  </div>
  <div class="card-body">
    <!-- Content -->
  </div>
  <div class="card-footer">
    <span class="text-muted">Last updated: 5 minutes ago</span>
  </div>
</div>
```

```css
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-fog);
}

.card-header-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.card-body {
  /* Default card padding applies */
}

.card-footer {
  padding-top: var(--space-4);
  margin-top: var(--space-4);
  border-top: 1px solid var(--color-fog);
}
```

---

## Card Sizes

### Compact

```css
.card-compact {
  padding: var(--space-4);
}

.card-compact .card-title {
  font-size: 1rem;
}
```

### Large

```css
.card-lg {
  padding: var(--space-8);
  border-radius: 16px;
}
```

---

## Responsive Behavior

```css
/* Stack cards on mobile */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

@media (max-width: 640px) {
  .card {
    padding: var(--space-4);
  }

  .stat-value {
    font-size: 2rem;
  }
}
```

---

## Accessibility

- Use semantic headings within cards
- Ensure sufficient color contrast
- Make interactive cards keyboard accessible
- Include focus states for clickable cards

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial card specifications |
