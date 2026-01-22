# Navigation Components - Final Edition

**Version:** 1.0
**Date:** January 15, 2026
**Status:** Active

---

## Navigation Philosophy

Navigation in TipSharePro follows the "Pilot's Cockpit" metaphor:
- All destinations visible (grayed out if no permission)
- Clear indication of current location
- Quick access to key actions

> "A place to see all destinations available whether or not it's in their repertoire."
> — Tom LaChaussee

---

## Primary Header

The main navigation bar across all pages.

### Visual Specification

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  PRIMARY HEADER                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  [Logo]  TipSharePro.com        Welcome Admin (Name & Co.)  [Log Out]│
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│  #1A1510 bg / bottom border #3D3225                                      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Specifications

| Property | Value |
|----------|-------|
| Background | `--bg-surface` (#1A1510) |
| Border Bottom | 1px solid `--bg-border` (#3D3225) |
| Height | 64px |
| Padding | 0 24px |
| Logo Height | 40px |
| Welcome Text | `--text-secondary` |
| Log Out | Secondary button style |

### CSS

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 var(--space-6);
  background: var(--bg-surface);
  border-bottom: 1px solid var(--bg-border);
}

.header-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.header-logo img {
  height: 40px;
  width: auto;
}

.header-logo-text {
  font-family: var(--font-primary);
  font-size: var(--text-h4);
  font-weight: var(--font-bold);
  color: var(--color-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header-welcome {
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
}

.header-welcome strong {
  color: var(--text-primary);
}
```

---

## Navigation Hub (Page 2)

The main navigation page showing all available destinations.

### Visual Specification

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  WHERE TO NEXT?                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │     Settings    │  │ Daily Contrib.  │  │ PPE Contributions│         │
│  │       ⚙️        │  │       📅        │  │       📊        │          │
│  │    Admin Only   │  │  All Users      │  │   All Users     │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │ PPE Distribution│  │    YTD Data     │  │ All Allocations │          │
│  │       💰        │  │       📈        │  │       📋        │          │
│  │   All Users     │  │   All Users     │  │   All Users     │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐                               │
│  │  Scenario SSB   │  │ Print Reports   │                               │
│  │       🧪        │  │       🖨️        │                               │
│  │ Admin/Manager   │  │   All Users     │  ← Faded if no permission     │
│  └─────────────────┘  └─────────────────┘                               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Navigation Card

```css
.nav-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-5);
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav-card:hover {
  background: var(--bg-elevated);
  border-color: var(--color-primary);
}

.nav-card:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.nav-card-icon {
  font-size: 2rem;
  margin-bottom: var(--space-3);
}

.nav-card-title {
  font-size: var(--text-body);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.nav-card-permission {
  font-size: var(--text-caption);
  color: var(--text-tertiary);
}

/* Disabled/No Permission */
.nav-card-disabled {
  opacity: 0.4;
  pointer-events: none;
  cursor: not-allowed;
}

.nav-card-disabled:hover {
  background: var(--bg-surface);
  border-color: var(--bg-border);
}
```

---

## Tab Navigation

For sub-page navigation within a section.

### Visual Specification

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  TAB NAVIGATION                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Settings   Daily Entry   Distribution   Reports         │  │
│  │  ━━━━━━━━   ──────────   ────────────   ───────          │  │
│  │  (active)                                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### CSS

```css
.tabs {
  display: flex;
  gap: var(--space-1);
  border-bottom: 1px solid var(--bg-border);
}

.tab {
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-primary);
  font-size: var(--text-body);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab:hover {
  color: var(--text-primary);
}

.tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--color-primary-glow);
}

.tab:disabled {
  color: var(--text-disabled);
  cursor: not-allowed;
}
```

---

## Breadcrumbs

For showing location hierarchy.

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  Home  /  Settings  /  Job Categories                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

```css
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-body-sm);
}

.breadcrumb-item {
  color: var(--text-secondary);
}

.breadcrumb-item a {
  color: var(--color-info);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.breadcrumb-item a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.breadcrumb-separator {
  color: var(--text-tertiary);
}

.breadcrumb-current {
  color: var(--text-primary);
  font-weight: var(--font-medium);
}
```

---

## Demo Navigation Buttons

For the Demo Settings Page.

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  DEMO NAV BUTTONS                                              │
│                                                                │
│  [Go To Distribution Table]  [Log Out]                         │
│        Primary                 Secondary                       │
│                                                                │
│  PDF LINKS                                                     │
│  📄 Why Sales-Based   📄 Job Categories Guide                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

```css
.demo-nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding: var(--space-4) 0;
}

.demo-nav-pdf-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-3);
}

.pdf-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-info);
  text-decoration: none;
  font-size: var(--text-body-sm);
  transition: color var(--transition-fast);
}

.pdf-link:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.pdf-link svg {
  width: 16px;
  height: 16px;
}
```

---

## Mobile Navigation

Hamburger menu for mobile devices.

```css
.mobile-nav-toggle {
  display: none;
  width: 44px;
  height: 44px;
  padding: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
}

@media (max-width: 767px) {
  .mobile-nav-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-links {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-body);
    padding: var(--space-4);
    transform: translateX(-100%);
    transition: transform var(--transition-slow);
  }

  .nav-links.open {
    transform: translateX(0);
  }
}
```

---

## Accessibility

- All navigation elements are keyboard accessible
- Current page/tab indicated with aria-current
- Skip to main content link at the top
- Focus trap in mobile menu when open

```html
<a href="#main-content" class="skip-link">Skip to main content</a>

<nav aria-label="Main navigation">
  <ul>
    <li><a href="/settings" aria-current="page">Settings</a></li>
    <li><a href="/daily">Daily Entry</a></li>
  </ul>
</nav>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary);
  color: var(--color-midnight);
  z-index: 1000;
}

.skip-link:focus {
  top: 0;
}
```

---

## Related Files

- [Buttons](./buttons.md)
- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
