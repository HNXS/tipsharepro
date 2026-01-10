# TipSharePro Navigation Components

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

Navigation in TipSharePro guides users through a 9-page application flow, with access controlled by user permissions. Navigation components include the main navigation hub, tab navigation, breadcrumbs, and page navigation controls.

---

## Navigation Hub (Page 2)

The central navigation page that appears after login, showing available pages based on user role.

### Structure

```html
<nav class="nav-hub">
  <h1 class="nav-hub-title">Where to Next?</h1>
  <p class="nav-hub-subtitle">Select a destination based on your permissions</p>

  <div class="nav-hub-grid">
    <!-- Data Entry Section -->
    <div class="nav-section">
      <h2 class="nav-section-title">Data Entry</h2>
      <ul class="nav-list">
        <li>
          <a href="/daily-contributions" class="nav-card">
            <span class="nav-card-icon">📊</span>
            <span class="nav-card-label">Daily Contributions</span>
            <span class="nav-card-desc">Enter daily sales and tips</span>
          </a>
        </li>
        <li>
          <a href="/ppe-contributions" class="nav-card">
            <span class="nav-card-icon">📋</span>
            <span class="nav-card-label">PPE Contributions</span>
            <span class="nav-card-desc">Pay period summary</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- Reports Section -->
    <div class="nav-section">
      <h2 class="nav-section-title">Reports</h2>
      <ul class="nav-list">
        <li>
          <a href="/distribution" class="nav-card">
            <span class="nav-card-icon">💰</span>
            <span class="nav-card-label">PPE Distribution</span>
            <span class="nav-card-desc">View tip distribution</span>
          </a>
        </li>
        <li>
          <a href="/ytd" class="nav-card">
            <span class="nav-card-icon">📈</span>
            <span class="nav-card-label">YTD Data</span>
            <span class="nav-card-desc">Year-to-date reports</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- Admin Section (Admin only) -->
    <div class="nav-section nav-section-admin">
      <h2 class="nav-section-title">Administration</h2>
      <ul class="nav-list">
        <li>
          <a href="/settings" class="nav-card nav-card-admin">
            <span class="nav-card-icon">⚙️</span>
            <span class="nav-card-label">Settings</span>
            <span class="nav-card-desc">Configure system</span>
          </a>
        </li>
        <li>
          <a href="/sandbox" class="nav-card nav-card-admin">
            <span class="nav-card-icon">🧪</span>
            <span class="nav-card-label">Scenario Sand Box</span>
            <span class="nav-card-desc">Test what-if scenarios</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

### Styles

```css
.nav-hub {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-8);
}

.nav-hub-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.nav-hub-subtitle {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
}

.nav-hub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
}

.nav-section-title {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

.nav-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.nav-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-5);
  background: var(--color-white);
  border: 1px solid var(--color-fog);
  border-radius: 12px;
  text-decoration: none;
  transition: all 150ms ease-out;
}

.nav-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(232, 93, 4, 0.15);
  transform: translateY(-2px);
}

.nav-card-icon {
  font-size: 2rem;
  margin-bottom: var(--space-3);
}

.nav-card-label {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.nav-card-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

/* Admin-only cards */
.nav-card-admin {
  border-left: 3px solid var(--color-warning);
}
```

---

## Tab Navigation

For settings and multi-step workflows.

```html
<nav class="tabs" role="tablist">
  <button class="tab active" role="tab" aria-selected="true" aria-controls="panel-location">
    Location
  </button>
  <button class="tab" role="tab" aria-selected="false" aria-controls="panel-payperiod">
    Pay Period
  </button>
  <button class="tab" role="tab" aria-selected="false" aria-controls="panel-contribution">
    Contribution
  </button>
  <button class="tab" role="tab" aria-selected="false" aria-controls="panel-categories">
    Job Categories
  </button>
  <button class="tab" role="tab" aria-selected="false" aria-controls="panel-weights">
    Weights
  </button>
  <button class="tab tab-disabled" role="tab" aria-disabled="true" disabled>
    Users
    <span class="tab-badge">Admin</span>
  </button>
</nav>

<div class="tab-panels">
  <div id="panel-location" class="tab-panel active" role="tabpanel">
    <!-- Panel content -->
  </div>
  <!-- More panels... -->
</div>
```

```css
.tabs {
  display: flex;
  gap: var(--space-1);
  border-bottom: 2px solid var(--color-fog);
  margin-bottom: var(--space-6);
  overflow-x: auto;
}

.tab {
  padding: var(--space-3) var(--space-5);
  font-family: 'Outfit', sans-serif;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 150ms ease-out;
}

.tab:hover {
  color: var(--color-primary);
}

.tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: 600;
}

.tab:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.tab-disabled {
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.tab-badge {
  font-size: 0.625rem;
  padding: 2px 6px;
  background: var(--color-warning-light);
  color: var(--color-warning);
  border-radius: 4px;
  text-transform: uppercase;
  margin-left: var(--space-2);
}

.tab-panel {
  display: none;
}

.tab-panel.active {
  display: block;
}
```

---

## Breadcrumbs

For showing location within the application hierarchy.

```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li>
      <a href="/nav">Home</a>
    </li>
    <li>
      <a href="/settings">Settings</a>
    </li>
    <li aria-current="page">
      Job Categories
    </li>
  </ol>
</nav>
```

```css
.breadcrumbs ol {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
}

.breadcrumbs li {
  display: flex;
  align-items: center;
}

.breadcrumbs li:not(:last-child)::after {
  content: '/';
  margin-left: var(--space-2);
  color: var(--color-text-muted);
}

.breadcrumbs a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 150ms ease-out;
}

.breadcrumbs a:hover {
  color: var(--color-primary);
}

.breadcrumbs [aria-current="page"] {
  color: var(--color-text-primary);
  font-weight: 500;
}
```

---

## Page Header with Navigation

Standard page header with back button and actions.

```html
<header class="page-header">
  <div class="page-header-left">
    <button class="btn btn-ghost btn-icon" aria-label="Go back">
      <svg><!-- Back arrow --></svg>
    </button>
    <div>
      <h1 class="page-title">Daily Contributions</h1>
      <p class="page-subtitle">January 10, 2026</p>
    </div>
  </div>
  <div class="page-header-right">
    <button class="btn btn-ghost">Copy Previous Day</button>
    <button class="btn btn-primary">Save & Continue</button>
  </div>
</header>
```

```css
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) 0;
  margin-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-fog);
}

.page-header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.page-header-right {
  display: flex;
  gap: var(--space-3);
}
```

---

## Location Selector

Dropdown for multi-location accounts.

```html
<div class="location-selector">
  <label class="sr-only" for="location">Select Location</label>
  <select id="location" class="location-select">
    <option value="loc1">Downtown Bistro</option>
    <option value="loc2">Waterfront Grill</option>
    <option value="all">All Locations</option>
  </select>
</div>
```

```css
.location-selector {
  position: relative;
}

.location-select {
  padding: var(--space-2) var(--space-8) var(--space-2) var(--space-4);
  font-family: 'Outfit', sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary);
  background: var(--color-white);
  border: 1px solid var(--color-fog);
  border-radius: 8px;
  appearance: none;
  cursor: pointer;
}

.location-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.1);
}
```

---

## Quick Actions Bar

Bottom navigation for common actions on mobile.

```html
<nav class="quick-actions" aria-label="Quick actions">
  <a href="/daily" class="quick-action">
    <svg><!-- Icon --></svg>
    <span>Daily</span>
  </a>
  <a href="/distribution" class="quick-action">
    <svg><!-- Icon --></svg>
    <span>Distribute</span>
  </a>
  <a href="/settings" class="quick-action">
    <svg><!-- Icon --></svg>
    <span>Settings</span>
  </a>
  <button class="quick-action" onclick="logout()">
    <svg><!-- Icon --></svg>
    <span>Log Out</span>
  </button>
</nav>
```

```css
.quick-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background: var(--color-white);
  border-top: 1px solid var(--color-fog);
  padding: var(--space-2) 0 var(--space-4);
  z-index: 100;
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
}

.quick-action:hover,
.quick-action.active {
  color: var(--color-primary);
}

.quick-action svg {
  width: 24px;
  height: 24px;
}

@media (min-width: 768px) {
  .quick-actions {
    display: none;
  }
}
```

---

## Permission-Based Visibility

Navigation items show/hide based on user role.

```css
/* Hide admin-only items for non-admins */
[data-role="designee"] .nav-admin-only,
[data-role="manager"] .nav-admin-only {
  display: none;
}

/* Show restricted indicator */
.nav-restricted::after {
  content: '🔒';
  margin-left: var(--space-2);
  font-size: 0.75rem;
}
```

---

## Accessibility

- Use semantic `<nav>` elements with `aria-label`
- Include `role="tablist"`, `role="tab"`, `role="tabpanel"` for tabs
- Maintain focus management when switching tabs
- Support keyboard navigation (arrow keys for tabs)
- Use `aria-current="page"` for current location

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial navigation specifications |
