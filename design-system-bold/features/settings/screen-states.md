# Settings - Screen States

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document describes all possible screen states for the Settings feature, including loading, empty, populated, error, and edge case states.

---

## Page-Level States

### Loading State

**When:** Initial page load, tab switch with data fetch

```html
<div class="settings-page">
  <div class="tabs">
    <div class="tab-skeleton"></div>
  </div>
  <div class="tab-content">
    <div class="skeleton skeleton-form">
      <div class="skeleton skeleton-label"></div>
      <div class="skeleton skeleton-input"></div>
      <div class="skeleton skeleton-label"></div>
      <div class="skeleton skeleton-input"></div>
    </div>
  </div>
</div>
```

### Error State (Page Level)

**When:** Failed to load settings data

```html
<div class="settings-page">
  <div class="error-state">
    <div class="error-icon">⚠️</div>
    <h2>Unable to Load Settings</h2>
    <p>We couldn't retrieve your settings. Please try again.</p>
    <button class="btn btn-primary">Retry</button>
  </div>
</div>
```

### Unauthorized State

**When:** User doesn't have permission to access Settings

```html
<div class="settings-page">
  <div class="unauthorized-state">
    <div class="lock-icon">🔒</div>
    <h2>Access Restricted</h2>
    <p>You don't have permission to access Settings. Contact your administrator.</p>
    <button class="btn btn-ghost">Return to Home</button>
  </div>
</div>
```

---

## Tab States

### Tab - Default

```html
<button class="tab" role="tab" aria-selected="false">
  Pay Period
</button>
```

### Tab - Active

```html
<button class="tab active" role="tab" aria-selected="true">
  Location
</button>
```

### Tab - Disabled (Insufficient Permission)

```html
<button class="tab tab-disabled" role="tab" aria-disabled="true" disabled>
  Users
  <span class="tab-badge">Admin</span>
</button>
```

### Tab - With Unsaved Indicator

```html
<button class="tab" role="tab" aria-selected="false">
  Contribution
  <span class="unsaved-dot" aria-label="Has unsaved changes"></span>
</button>
```

---

## Location Tab States

### Default State

```
┌─────────────────────────────────────────────────────────┐
│ ESTABLISHMENT NAME                                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Downtown Bistro                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ADDRESS                                                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 123 Main Street, Cityville, ST 12345               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ MULTI-LOCATION ACCOUNT                     [Toggle OFF] │
│ Enable to manage multiple locations                     │
│                                                         │
│                              [Cancel] [Save Changes]    │
└─────────────────────────────────────────────────────────┘
```

### Multi-Location Enabled

```
┌─────────────────────────────────────────────────────────┐
│ MULTI-LOCATION ACCOUNT                      [Toggle ON] │
│ You have 3 locations configured                         │
│                                                         │
│ LOCATIONS                                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ● Downtown Bistro (Primary)              [Edit]    │ │
│ │ ● Waterfront Grill                       [Edit]    │ │
│ │ ● Airport Café                           [Edit]    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [+ Add Location]                                        │
└─────────────────────────────────────────────────────────┘
```

---

## Pay Period Tab States

### Default State

```
┌─────────────────────────────────────────────────────────┐
│ PAY PERIOD TYPE                                    [?]  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Bi-weekly                                     ▼    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ PERIOD START DATE                                  [?]  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 01/01/2026                                    📅   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ UPCOMING PERIODS                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Jan 1-14, 2026  │  Jan 15-28, 2026  │  Jan 29-...  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│                              [Cancel] [Save Changes]    │
└─────────────────────────────────────────────────────────┘
```

### With Validation Error

```
┌─────────────────────────────────────────────────────────┐
│ PERIOD START DATE                                  [?]  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 13/01/2026                                    📅   │ │
│ └─────────────────────────────────────────────────────┘ │
│ ⚠️ Invalid date format. Use MM/DD/YYYY                  │
└─────────────────────────────────────────────────────────┘
```

---

## Contribution Tab States

### Default State

```
┌─────────────────────────────────────────────────────────┐
│ CONTRIBUTION METHOD                               [?]   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ○ CC Sales                                         │ │
│ │ ○ CC Tips                                          │ │
│ │ ○ All Tips                                         │ │
│ │ ● All Sales (Recommended)                          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ CONTRIBUTION RATE                                 [?]   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 3%                                            ▼    │ │
│ └─────────────────────────────────────────────────────┘ │
│ Industry standard: 2-5% for All Sales method            │
│                                                         │
│                              [Cancel] [Save Changes]    │
└─────────────────────────────────────────────────────────┘
```

### Rate Dropdown Expanded

```
┌─────────────────────────────────────────────────────────┐
│ CONTRIBUTION RATE                                 [?]   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 3%                                            ▲    │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ 1%                                                 │ │
│ │ 1.25%                                              │ │
│ │ 1.5%                                               │ │
│ │ ...                                                │ │
│ │ 3% ✓                                               │ │
│ │ ...                                                │ │
│ │ 5%                                                 │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Job Categories Tab States

### Default State

```
┌─────────────────────────────────────────────────────────┐
│ DEFAULT CATEGORIES                                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [✓] Server                      FOH                │ │
│ │ [✓] Bartender                   Bar                │ │
│ │ [✓] Lead Cook                   BOH                │ │
│ │ [✓] Line Cook                   BOH                │ │
│ │ [✓] Prep Cook                   BOH                │ │
│ │ [✓] Busser                      Support            │ │
│ │ [ ] Food Runner                 Support            │ │
│ │ [✓] Host                        FOH                │ │
│ │ [ ] Expo                        Support            │ │
│ │ [ ] Dishwasher                  BOH                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ CUSTOM CATEGORIES (5 available)                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Barback_______________]        [Bar     ▼]        │ │
│ │ [_____________________]         [Select  ▼]        │ │
│ │ [_____________________]         [Select  ▼]        │ │
│ │ [_____________________]         [Select  ▼]        │ │
│ │ [_____________________]         [Select  ▼]        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│                              [Cancel] [Save Changes]    │
└─────────────────────────────────────────────────────────┘
```

### Category With Active Employees Warning

```
┌─────────────────────────────────────────────────────────┐
│ │ [ ] Server                      FOH       ⚠️       │ │
│ │     3 active employees assigned                    │ │
│ └─────────────────────────────────────────────────────┘ │
```

---

## Weights Tab States

### Default State

```
┌─────────────────────────────────────────────────────────┐
│ CATEGORY WEIGHTS                                   [?]  │
│ Higher weight = larger share of tip pool                │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ CATEGORY              WEIGHT                       │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ Server                [1.00 ▼]                     │ │
│ │ Bartender             [1.25 ▼]                     │ │
│ │ Lead Cook             [1.50 ▼]                     │ │
│ │ Line Cook             [1.25 ▼]                     │ │
│ │ Prep Cook             [1.00 ▼]                     │ │
│ │ Busser                [0.75 ▼]                     │ │
│ │ Host                  [0.75 ▼]                     │ │
│ │ Barback (custom)      [1.00 ▼]                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│                              [Cancel] [Save Changes]    │
└─────────────────────────────────────────────────────────┘
```

### Weight Dropdown Expanded

```
┌─────────────────────────────────────────────────────────┐
│ │ Server                [1.00 ▲]                     │ │
│ │                       ┌────────┐                   │ │
│ │                       │ 1.00 ✓ │                   │ │
│ │                       │ 1.25   │                   │ │
│ │                       │ 1.50   │                   │ │
│ │                       │ 1.75   │                   │ │
│ │                       │ 2.00   │                   │ │
│ │                       │ ...    │                   │ │
│ │                       │ 5.00   │                   │ │
│ │                       └────────┘                   │ │
└─────────────────────────────────────────────────────────┘
```

---

## Users Tab States

### Default State (Admin View)

```
┌─────────────────────────────────────────────────────────┐
│ TEAM MEMBERS                              [+ Add User]  │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 👤 John Smith                                      │ │
│ │    admin@restaurant.com         [Admin]  [Active]  │ │
│ │                                          [Edit ▼]  │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ 👤 Jane Doe                                        │ │
│ │    manager@restaurant.com       [Manager] [Active] │ │
│ │                                          [Edit ▼]  │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ 👤 Bob Wilson                                      │ │
│ │    bob@restaurant.com          [Designee] [Active] │ │
│ │                                          [Edit ▼]  │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Add User Modal

```
┌─────────────────────────────────────────────────────────┐
│ Add New User                                      [×]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ NAME                                                    │
│ [_____________________________________]                 │
│                                                         │
│ EMAIL                                                   │
│ [_____________________________________]                 │
│                                                         │
│ ROLE                                                    │
│ [Manager                              ▼]                │
│                                                         │
│ LOCATION ACCESS (multi-location only)                   │
│ [✓] Downtown Bistro                                     │
│ [✓] Waterfront Grill                                    │
│ [ ] Airport Café                                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                              [Cancel] [Send Invitation] │
└─────────────────────────────────────────────────────────┘
```

### Pending User State

```
┌─────────────────────────────────────────────────────────┐
│ │ 👤 New User                                        │ │
│ │    newuser@restaurant.com      [Manager] [Pending] │ │
│ │    Invitation sent Jan 10, 2026         [Resend]   │ │
└─────────────────────────────────────────────────────────┘
```

---

## Save States

### Saving State

```
┌─────────────────────────────────────────────────────────┐
│                    [Cancel] [Saving... ⟳]               │
└─────────────────────────────────────────────────────────┘
```

### Save Success

```
Toast notification:
┌─────────────────────────────────────────────────────────┐
│ ✓ Settings saved successfully                      [×] │
└─────────────────────────────────────────────────────────┘
```

### Save Error

```
Toast notification:
┌─────────────────────────────────────────────────────────┐
│ ⚠️ Unable to save. Please try again.               [×] │
│                                          [Retry]        │
└─────────────────────────────────────────────────────────┘
```

---

## Unsaved Changes Warning

```
┌─────────────────────────────────────────────────────────┐
│ Unsaved Changes                                   [×]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ You have unsaved changes. Do you want to save before    │
│ leaving?                                                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                  [Discard] [Cancel] [Save & Continue]   │
└─────────────────────────────────────────────────────────┘
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial screen states documentation |
