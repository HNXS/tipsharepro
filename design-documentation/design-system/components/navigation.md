---
title: Navigation Components
description: Sidebar, tabs, breadcrumbs, and wayfinding for Tip Share Pro
last-updated: 2026-01-08
version: 1.0.0
related-files:
  - ../tokens/colors.md
  - ./buttons.md
status: approved
---

# Navigation Components

## Overview

Navigation in Tip Share Pro is designed for efficiency. Restaurant managers need to move quickly between sections, often while multitasking. Our navigation is clear, predictable, and always accessible.

---

## App Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Top Bar (Logo, User Menu, Notifications)                               │
├───────────────┬─────────────────────────────────────────────────────────┤
│               │                                                         │
│   Sidebar     │   Main Content Area                                    │
│   Navigation  │                                                         │
│               │   ┌─────────────────────────────────────────────────┐   │
│   • Dashboard │   │  Page Header / Breadcrumbs                      │   │
│   • Pay Period│   ├─────────────────────────────────────────────────┤   │
│   • Team      │   │                                                 │   │
│   • Reports   │   │  Page Content                                   │   │
│   • Settings  │   │                                                 │   │
│               │   │                                                 │   │
│               │   └─────────────────────────────────────────────────┘   │
│               │                                                         │
└───────────────┴─────────────────────────────────────────────────────────┘
```

---

## Sidebar Navigation

### Visual Specs

| Property | Value |
|----------|-------|
| Width | 280px (desktop), 0 (mobile collapsed) |
| Background | `--espresso` |
| Border | 1px solid `--walnut` (right edge) |
| Item Padding | 12px 18px |
| Item Gap | 6px |

### CSS Implementation

```css
.sidebar {
  width: 280px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: var(--espresso);
  border-right: 1px solid var(--walnut);
  display: flex;
  flex-direction: column;
  z-index: var(--z-sticky);
  transition: transform var(--duration-slow) var(--ease-standard);
}

/* Logo area */
.sidebar-header {
  padding: var(--space-4);
  border-bottom: 1px solid var(--walnut);
}

.sidebar-logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--cream);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sidebar-logo-icon {
  color: var(--brass);
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: var(--space-3);
  overflow-y: auto;
}

.nav-section {
  margin-bottom: var(--space-4);
}

.nav-section-label {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--stone);
  padding: var(--space-2) var(--space-3);
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--linen);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

.nav-item:hover {
  background: var(--mahogany);
  color: var(--cream);
}

.nav-item[aria-current="page"],
.nav-item.active {
  background: rgba(212, 164, 32, 0.1);
  color: var(--brass);
}

.nav-item[aria-current="page"]::before,
.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: var(--brass);
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  opacity: 0.8;
}

.nav-item[aria-current="page"] .nav-icon,
.nav-item.active .nav-icon {
  opacity: 1;
  color: var(--brass);
}

/* Badge for notifications */
.nav-badge {
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: var(--ember);
  color: var(--cream);
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Sidebar footer */
.sidebar-footer {
  padding: var(--space-3);
  border-top: 1px solid var(--walnut);
}
```

### Collapsed Sidebar (Mobile)

```css
@media (max-width: 1023px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar[data-open="true"] {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(12, 10, 7, 0.8);
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--duration-normal) var(--ease-standard);
  }

  .sidebar[data-open="true"] + .sidebar-overlay {
    opacity: 1;
    visibility: visible;
  }
}
```

---

## Top Bar

### Visual Specs

| Property | Value |
|----------|-------|
| Height | 64px |
| Background | `--midnight` |
| Border | 1px solid `--walnut` (bottom) |

```css
.topbar {
  height: 64px;
  background: var(--midnight);
  border-bottom: 1px solid var(--walnut);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

/* Mobile menu toggle */
.topbar-menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--linen);
  padding: var(--space-2);
  cursor: pointer;
}

@media (max-width: 1023px) {
  .topbar-menu-toggle {
    display: flex;
  }
}

/* Search */
.topbar-search {
  position: relative;
  width: 280px;
}

.topbar-search-input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  padding-left: var(--space-6);
  background: var(--espresso);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--cream);
}

.topbar-search-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--stone);
  pointer-events: none;
}

/* User menu */
.user-menu {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard);
}

.user-menu:hover {
  background: var(--mahogany);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: var(--mahogany);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--cream);
}

.user-name {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--cream);
}

.user-role {
  font-size: 0.75rem;
  color: var(--stone);
}
```

---

## Breadcrumbs

For showing location in hierarchy:

```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol class="breadcrumbs-list">
    <li><a href="/">Dashboard</a></li>
    <li><a href="/pay-periods">Pay Periods</a></li>
    <li aria-current="page">January 1-15, 2026</li>
  </ol>
</nav>
```

```css
.breadcrumbs {
  margin-bottom: var(--space-4);
}

.breadcrumbs-list {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.breadcrumbs-list li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--stone);
}

.breadcrumbs-list li:not(:last-child)::after {
  content: '/';
  color: var(--walnut);
}

.breadcrumbs-list a {
  color: var(--linen);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-standard);
}

.breadcrumbs-list a:hover {
  color: var(--brass);
}

.breadcrumbs-list li[aria-current="page"] {
  color: var(--cream);
  font-weight: 500;
}
```

---

## Tab Navigation

For switching between views within a page:

### Visual Specs

```
┌─────────────────────────────────────────────────────────────┐
│  [ Tab 1 ]  [ Tab 2 ]  [ Tab 3 ]                           │
│  ═══════════                                                │
└─────────────────────────────────────────────────────────────┘
```

```css
.tabs {
  border-bottom: 1px solid var(--walnut);
  margin-bottom: var(--space-4);
}

.tab-list {
  display: flex;
  gap: var(--space-4);
  list-style: none;
  margin: 0;
  padding: 0;
}

.tab-item {
  position: relative;
  padding: var(--space-3) 0;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--stone);
  text-decoration: none;
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-standard);
}

.tab-item:hover {
  color: var(--linen);
}

.tab-item[aria-selected="true"],
.tab-item.active {
  color: var(--cream);
}

.tab-item[aria-selected="true"]::after,
.tab-item.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--brass);
  border-radius: 1px 1px 0 0;
}

/* Tab with counter */
.tab-count {
  margin-left: var(--space-1);
  padding: 2px 8px;
  background: var(--mahogany);
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--linen);
}

.tab-item.active .tab-count {
  background: var(--brass);
  color: var(--midnight);
}
```

### Pill Tabs

Alternative style for segmented controls:

```css
.tabs-pill {
  display: inline-flex;
  background: var(--espresso);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-md);
  padding: var(--space-1);
  gap: var(--space-1);
}

.tabs-pill .tab-item {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
}

.tabs-pill .tab-item:hover {
  background: var(--mahogany);
}

.tabs-pill .tab-item.active {
  background: var(--mahogany);
  color: var(--cream);
}

.tabs-pill .tab-item.active::after {
  display: none;
}
```

---

## Pagination

For navigating through lists:

```html
<nav class="pagination" aria-label="Pagination">
  <button class="pagination-btn" aria-label="Previous page">
    <svg><!-- chevron left --></svg>
  </button>
  <span class="pagination-info">Page 2 of 5</span>
  <button class="pagination-btn" aria-label="Next page">
    <svg><!-- chevron right --></svg>
  </button>
</nav>
```

```css
.pagination {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.pagination-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--mahogany);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-md);
  color: var(--linen);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--walnut);
  border-color: var(--stone);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--stone);
}

/* Number-based pagination */
.pagination-numbers {
  display: flex;
  gap: var(--space-1);
}

.pagination-number {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--linen);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard);
}

.pagination-number:hover {
  background: var(--mahogany);
  border-color: var(--walnut);
}

.pagination-number.active {
  background: var(--brass);
  color: var(--midnight);
  border-color: var(--brass);
}
```

---

## Dropdown Menu

For user menus and action menus:

```css
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--space-1);
  min-width: 200px;
  background: var(--espresso);
  border: 1px solid var(--walnut);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition:
    opacity var(--duration-normal) var(--ease-standard),
    transform var(--duration-normal) var(--ease-standard),
    visibility var(--duration-normal);
}

.dropdown[data-open="true"] .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-header {
  padding: var(--space-3);
  border-bottom: 1px solid var(--walnut);
}

.dropdown-section {
  padding: var(--space-2);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--linen);
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard);
}

.dropdown-item:hover {
  background: var(--mahogany);
  color: var(--cream);
}

.dropdown-item-icon {
  width: 18px;
  height: 18px;
  opacity: 0.7;
}

.dropdown-item-danger {
  color: var(--sienna);
}

.dropdown-item-danger:hover {
  background: rgba(199, 75, 75, 0.1);
  color: var(--sienna);
}

.dropdown-divider {
  height: 1px;
  background: var(--walnut);
  margin: var(--space-2) 0;
}
```

---

## Mobile Bottom Navigation

For mobile, primary navigation moves to the bottom:

```css
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--espresso);
  border-top: 1px solid var(--walnut);
  z-index: var(--z-sticky);
}

@media (max-width: 767px) {
  .bottom-nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  main {
    padding-bottom: 80px; /* Space for bottom nav */
  }
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2);
  color: var(--stone);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-standard);
}

.bottom-nav-item:hover,
.bottom-nav-item.active {
  color: var(--brass);
}

.bottom-nav-icon {
  width: 24px;
  height: 24px;
}

.bottom-nav-label {
  font-family: var(--font-body);
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## Accessibility

### Keyboard Navigation

- Tab moves between interactive elements
- Arrow keys navigate within menus
- Escape closes dropdowns and menus
- Enter/Space activates items

### ARIA Attributes

```html
<!-- Sidebar navigation -->
<nav aria-label="Main navigation">
  <ul role="list">
    <li>
      <a href="/dashboard" aria-current="page">Dashboard</a>
    </li>
  </ul>
</nav>

<!-- Tabs -->
<div role="tablist" aria-label="Pay period views">
  <button role="tab" aria-selected="true" aria-controls="panel-1">Overview</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2">Team</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">...</div>

<!-- Dropdown -->
<div class="dropdown">
  <button aria-haspopup="true" aria-expanded="false">Menu</button>
  <div role="menu" aria-hidden="true">
    <button role="menuitem">Option 1</button>
  </div>
</div>
```

---

## Do's and Don'ts

### Do:
- Keep navigation consistent across pages
- Highlight current location clearly
- Use icons with text labels
- Provide keyboard shortcuts for power users

### Don't:
- Hide primary navigation in dropdowns
- Use more than 2 levels of navigation
- Change navigation order between pages
- Remove navigation on mobile

---

## Related Documentation

- [Buttons](./buttons.md)
- [Typography Tokens](../tokens/typography.md)
- [Animation Tokens](../tokens/animations.md)
