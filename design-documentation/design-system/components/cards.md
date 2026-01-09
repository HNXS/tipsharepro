---
title: Card Components
description: Container components for Tip Share Pro
last-updated: 2026-01-08
version: 1.0.0
related-files:
  - ../tokens/colors.md
  - ../tokens/spacing.md
status: approved
---

# Card Components

## Overview

Cards are the primary container for grouping related content. They create visual hierarchy through elevation and borders, establishing the "layers" of the interface like papers stacked on a desk.

---

## Base Card

### Anatomy

```
┌─────────────────────────────────────────────────┐
│  Card Container                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  Header (optional)                        │ │
│  │  Title               [Actions/Status]    │ │
│  ├───────────────────────────────────────────┤ │
│  │                                           │ │
│  │  Content Area                             │ │
│  │                                           │ │
│  ├───────────────────────────────────────────┤ │
│  │  Footer (optional)                        │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Visual Specs

| Property | Value |
|----------|-------|
| Background | `--espresso` (#1A1510) |
| Border | 1px solid `--walnut` (#3D3225) |
| Border Radius | `--radius-lg` (12px) |
| Padding | `--space-4` (24px) |
| Shadow | none (elevation via border) |

### CSS Implementation

```css
.card {
  background: var(--espresso);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition:
    transform var(--duration-normal) var(--ease-standard),
    box-shadow var(--duration-normal) var(--ease-standard),
    border-color var(--duration-normal) var(--ease-standard);
}

/* Interactive card hover */
.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--brass);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--walnut);
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--cream);
  margin: 0;
}

.card-subtitle {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--stone);
  margin-top: var(--space-1);
}

.card-actions {
  display: flex;
  gap: var(--space-2);
}

.card-body {
  color: var(--linen);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--walnut);
}
```

---

## Card Variants

### Compact Card

Less padding for denser layouts:

```css
.card-compact {
  padding: var(--space-3);
}

.card-compact .card-header {
  margin-bottom: var(--space-2);
  padding-bottom: var(--space-2);
}

.card-compact .card-title {
  font-size: 1.125rem;
}
```

### Highlighted Card

For important or featured content:

```css
.card-highlighted {
  border-color: var(--brass);
  background: linear-gradient(
    135deg,
    var(--espresso) 0%,
    rgba(212, 164, 32, 0.05) 100%
  );
}

.card-highlighted::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--brass);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
```

### Elevated Card

For modals and overlays:

```css
.card-elevated {
  box-shadow: var(--shadow-xl);
  border-color: var(--stone);
}
```

### Flat Card

No border, relies on background contrast:

```css
.card-flat {
  border: none;
  background: var(--mahogany);
}
```

---

## Stat Card

For displaying key metrics:

### Anatomy

```
┌─────────────────────────────┐
│  LABEL                      │
│                             │
│     $4,892.50              │
│                             │
│        +12.4%              │
└─────────────────────────────┘
```

### CSS Implementation

```css
.stat-card {
  background: var(--espresso);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  text-align: center;
  transition: border-color var(--duration-fast) var(--ease-standard);
}

.stat-card:hover {
  border-color: var(--brass);
}

.stat-label {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--stone);
  margin-bottom: var(--space-2);
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--brass);
  font-variant-numeric: tabular-nums;
  line-height: 1;
  margin-bottom: var(--space-2);
}

.stat-change {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.stat-change-positive {
  color: var(--sage);
}

.stat-change-positive::before {
  content: '+';
}

.stat-change-negative {
  color: var(--sienna);
}

.stat-change-negative::before {
  content: '−'; /* Proper minus sign */
}

.stat-change-neutral {
  color: var(--stone);
}
```

### Stat Card Sizes

```css
/* Large stat card - hero metrics */
.stat-card-lg .stat-value {
  font-size: 3.5rem;
}

/* Small stat card - compact grids */
.stat-card-sm {
  padding: var(--space-3);
}

.stat-card-sm .stat-value {
  font-size: 1.75rem;
}

.stat-card-sm .stat-label {
  font-size: 0.625rem;
}
```

### Stat Card Grid

```css
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
}

/* 4-column fixed grid */
.stat-grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1024px) {
  .stat-grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stat-grid-4 {
    grid-template-columns: 1fr;
  }
}
```

---

## Summary Card

For pay period and distribution summaries:

```html
<div class="card summary-card">
  <div class="summary-header">
    <h3 class="summary-title">Pay Period Summary</h3>
    <span class="summary-status status-active">Active</span>
  </div>

  <div class="summary-stats">
    <div class="summary-stat">
      <span class="summary-stat-label">Total Pool</span>
      <span class="summary-stat-value">$4,892.50</span>
    </div>
    <div class="summary-stat">
      <span class="summary-stat-label">Team Hours</span>
      <span class="summary-stat-value">284.5</span>
    </div>
    <div class="summary-stat">
      <span class="summary-stat-label">Hourly Rate</span>
      <span class="summary-stat-value">$17.19</span>
    </div>
  </div>

  <div class="summary-footer">
    <span class="summary-date">Jan 1 - Jan 15, 2026</span>
    <button class="btn btn-primary btn-sm">Calculate</button>
  </div>
</div>
```

```css
.summary-card {
  position: relative;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.summary-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--cream);
  margin: 0;
}

.summary-status {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-active {
  background: rgba(45, 155, 110, 0.15);
  color: var(--sage);
}

.status-closed {
  background: rgba(139, 123, 101, 0.15);
  color: var(--stone);
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-top: 1px solid var(--walnut);
  border-bottom: 1px solid var(--walnut);
}

.summary-stat {
  text-align: center;
}

.summary-stat-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--stone);
  margin-bottom: var(--space-1);
}

.summary-stat-value {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--brass);
}

.summary-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-4);
}

.summary-date {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--stone);
}
```

---

## Team Member Card

For displaying individual team members:

```html
<div class="card member-card">
  <div class="member-avatar">
    <span class="member-initials">MS</span>
  </div>
  <div class="member-info">
    <h4 class="member-name">Maria Santos</h4>
    <span class="member-position">Server</span>
  </div>
  <div class="member-stats">
    <div class="member-stat">
      <span class="member-stat-label">Rate</span>
      <span class="member-stat-value">1.0x</span>
    </div>
    <div class="member-stat">
      <span class="member-stat-label">Hours</span>
      <span class="member-stat-value">32.5</span>
    </div>
  </div>
</div>
```

```css
.member-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
}

.member-avatar {
  width: 48px;
  height: 48px;
  background: var(--mahogany);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.member-initials {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--cream);
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  color: var(--cream);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-position {
  font-size: 0.875rem;
  color: var(--stone);
}

.member-stats {
  display: flex;
  gap: var(--space-4);
}

.member-stat {
  text-align: right;
}

.member-stat-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--stone);
}

.member-stat-value {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--linen);
}
```

---

## Empty State Card

For when there's no content:

```html
<div class="card card-empty">
  <div class="empty-icon">
    <svg><!-- icon --></svg>
  </div>
  <h3 class="empty-title">No pay periods yet</h3>
  <p class="empty-message">Create your first pay period to start tracking tips</p>
  <button class="btn btn-primary">Create Pay Period</button>
</div>
```

```css
.card-empty {
  text-align: center;
  padding: var(--space-7);
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-4);
  color: var(--stone);
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--cream);
  margin-bottom: var(--space-2);
}

.empty-message {
  color: var(--stone);
  margin-bottom: var(--space-4);
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}
```

---

## Card Grid Layouts

### Dashboard Grid

```css
.card-grid {
  display: grid;
  gap: var(--space-4);
}

.card-grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.card-grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

/* Full width card in grid */
.card-full {
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .card-grid-2,
  .card-grid-3 {
    grid-template-columns: 1fr;
  }
}
```

### Masonry-style Grid

```css
.card-masonry {
  columns: 3;
  column-gap: var(--space-4);
}

.card-masonry .card {
  break-inside: avoid;
  margin-bottom: var(--space-4);
}

@media (max-width: 1024px) {
  .card-masonry {
    columns: 2;
  }
}

@media (max-width: 640px) {
  .card-masonry {
    columns: 1;
  }
}
```

---

## Card Animations

### Card Entry

```css
.card-animate-in {
  animation: card-settle 0.4s var(--ease-settle);
}

@keyframes card-settle {
  0% {
    opacity: 0;
    transform: translateY(-12px) scale(0.98);
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
```

### Staggered Card Grid

```css
.card-grid .card:nth-child(1) { animation-delay: 0ms; }
.card-grid .card:nth-child(2) { animation-delay: 50ms; }
.card-grid .card:nth-child(3) { animation-delay: 100ms; }
.card-grid .card:nth-child(4) { animation-delay: 150ms; }
```

---

## Accessibility

### Focus States

```css
.card-interactive:focus-visible {
  outline: none;
  box-shadow: var(--shadow-glow);
}
```

### Card as Link

```html
<a href="/pay-period/123" class="card card-interactive">
  <h3 class="card-title">Pay Period Jan 1-15</h3>
  <p class="card-body">4 team members • $2,847.50 total</p>
</a>
```

### Card with Actions

```html
<div class="card" role="region" aria-labelledby="card-title">
  <h3 id="card-title" class="card-title">Pay Period</h3>
  <button class="btn btn-ghost" aria-label="Edit pay period">Edit</button>
</div>
```

---

## Do's and Don'ts

### Do:
- Use consistent padding within cards
- Group related information in cards
- Use stat cards for key metrics
- Animate cards on entry for delight

### Don't:
- Nest cards within cards
- Use more than one highlighted card per section
- Mix card variants in the same grid
- Overload cards with too much content

---

## Related Documentation

- [Tables](./tables.md)
- [Spacing Tokens](../tokens/spacing.md)
- [Animation Tokens](../tokens/animations.md)
