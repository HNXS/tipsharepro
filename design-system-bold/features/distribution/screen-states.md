# PPE Distribution - Screen States

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document describes all possible screen states for the PPE Distribution feature, including loading, populated, empty, and error states.

---

## Page-Level States

### Loading State

**When:** Initial page load, period change

```
┌─────────────────────────────────────────────────────────┐
│ ← PPE Distribution          Jan 1-15, 2026 ▼  [Export] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ ▓▓▓▓▓▓▓▓ │ │ ▓▓▓▓▓▓▓▓ │ │ ▓▓▓▓▓▓▓▓ │ │ ▓▓▓▓▓▓▓▓ │   │
│  │ ▓▓▓▓▓▓   │ │ ▓▓▓▓     │ │ ▓▓▓▓▓    │ │ ▓▓▓▓▓▓   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                         │
│  Loading distribution data...                           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  │ ▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Empty State (Period Not Complete)

**When:** Pay period hasn't ended yet

```
┌─────────────────────────────────────────────────────────┐
│ ← PPE Distribution          Jan 1-15, 2026 ▼  [Export] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    📊                                   │
│                                                         │
│             Period Not Yet Complete                     │
│                                                         │
│   Distribution will be available after the pay period   │
│   ends on January 15, 2026.                             │
│                                                         │
│   Current progress: 8 of 14 days entered                │
│                                                         │
│              [Go to Daily Contributions]                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Empty State (No Data)

**When:** Period complete but no contributions

```
┌─────────────────────────────────────────────────────────┐
│ ← PPE Distribution          Jan 1-15, 2026 ▼  [Export] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    📋                                   │
│                                                         │
│              No Distribution Data                       │
│                                                         │
│   No contributions were recorded for this pay period.   │
│   Enter contribution data to generate distribution.     │
│                                                         │
│              [Go to PPE Contributions]                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Populated State (Admin View)

**When:** Distribution calculated, admin/manager viewing

```
┌─────────────────────────────────────────────────────────┐
│ ← PPE Distribution          Jan 1-15, 2026 ▼  [Export] │
│                              ○ Admin View  ● Emp View   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ $2,847   │ │    12    │ │  $237    │ │   15     │   │
│  │ TOTAL    │ │ RECIP.   │ │ AVG      │ │ DAYS     │   │
│  │ POOL     │ │          │ │ SHARE    │ │          │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                         │
│ ┌───────────────────────────────────────────────────────┐
│ │ EMPLOYEE      CAT.    HRS   RATE   %     AMT   RCVD  │
│ ├───────────────────────────────────────────────────────┤
│ │ Maria Santos  Server  32.5  $18.50  14.2%  $404  $404│
│ │ James Chen    Cook    40.0  $22.00  18.6%  $530  $530│
│ │ Sarah Kim     Server  28.5  $17.00  10.8%  $308  $308│
│ │ ...                                                   │
│ ├───────────────────────────────────────────────────────┤
│ │ TOTAL                 452.5         100%  $2,847 $2,847
│ └───────────────────────────────────────────────────────┘
│                                                         │
│ Last calculated: Jan 16, 2026 8:30 AM                   │
└─────────────────────────────────────────────────────────┘
```

### Populated State (Employee View)

**When:** Distribution shown without wage data

```
┌─────────────────────────────────────────────────────────┐
│ ← PPE Distribution          Jan 1-15, 2026 ▼  [Export] │
│                              ● Admin View  ○ Emp View   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Same summary cards]                                   │
│                                                         │
│ ┌───────────────────────────────────────────────────────┐
│ │ EMPLOYEE      CATEGORY    HRS    %      AMT    RCVD  │
│ ├───────────────────────────────────────────────────────┤
│ │ Maria Santos  Server      32.5   14.2%  $404   $404  │
│ │ James Chen    Lead Cook   40.0   18.6%  $530   $530  │
│ │ Sarah Kim     Server      28.5   10.8%  $308   $308  │
│ │ ...                                                   │
│ ├───────────────────────────────────────────────────────┤
│ │ TOTAL                     452.5  100%  $2,847  $2,847│
│ └───────────────────────────────────────────────────────┘
│                                                         │
│ ⓘ Hourly rates hidden for employee privacy              │
└─────────────────────────────────────────────────────────┘
```

---

## Summary Cards States

### Card - Loading

```
┌──────────────┐
│ ▓▓▓▓▓▓▓▓▓▓   │
│ ▓▓▓▓▓▓       │
└──────────────┘
```

### Card - Populated

```
┌──────────────┐
│   $2,847     │  ← Large, monospace, primary color
│  TOTAL POOL  │  ← Small, uppercase, secondary
└──────────────┘
```

### Card - With Change Indicator

```
┌──────────────┐
│   $2,847     │
│  TOTAL POOL  │
│  ↑ 8.2%      │  ← Green for increase
└──────────────┘
```

---

## Table Row States

### Standard Row

```
┌─────────────────────────────────────────────────────────┐
│ Maria Santos     Server     32.5  $18.50  14.2%  $404  │
└─────────────────────────────────────────────────────────┘
```

### Row - Hover State

```
┌─────────────────────────────────────────────────────────┐
│ Maria Santos     Server     32.5  $18.50  14.2%  $404  │  ← Light orange bg
└─────────────────────────────────────────────────────────┘
Border left: 3px solid #E85D04
```

### Row - Highest Share Indicator

```
┌─────────────────────────────────────────────────────────┐
│ James Chen    Lead Cook   40.0  $22.00  18.6%  $530 ⭐ │
└─────────────────────────────────────────────────────────┘
```

### Total Row

```
┌─────────────────────────────────────────────────────────┐
│ TOTAL                     452.5         100%  $2,847   │
└─────────────────────────────────────────────────────────┘
Background: #F5F5F4 (stone)
Font-weight: 600
Border-top: 2px solid
```

---

## !!Note Modal States

### Initial Display

```
┌─────────────────────────────────────────────────────────┐
│ !! Wage Confidentiality Notice                    [×]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ IMPORTANT: The hourly wage rates displayed in this  │ │
│ │ distribution report are confidential employee       │ │
│ │ information protected by labor law.                 │ │
│ │                                                     │ │
│ │ • Do not share wage data with employees            │ │
│ │ • Use "Employee View" for posting                  │ │
│ │ • Exported PDFs can exclude wage data              │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [ ] I understand that wage information is           │ │
│ │     confidential and will handle it appropriately   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                               [Continue] (disabled)     │
└─────────────────────────────────────────────────────────┘
```

### After Acknowledgment

```
┌─────────────────────────────────────────────────────────┐
│ ...                                                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [✓] I understand that wage information is           │ │
│ │     confidential and will handle it appropriately   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                               [Continue] (enabled)      │
└─────────────────────────────────────────────────────────┘
```

---

## Period Selector States

### Default (Closed)

```
┌───────────────────────┐
│ Jan 1-15, 2026    ▼  │
└───────────────────────┘
```

### Expanded

```
┌───────────────────────┐
│ Jan 1-15, 2026    ▲  │
├───────────────────────┤
│ ● Jan 1-15, 2026     │  Current
│ ○ Dec 15-31, 2025    │
│ ○ Dec 1-14, 2025     │
│ ○ Nov 15-30, 2025    │
│ ○ Nov 1-14, 2025     │
│ ─────────────────────│
│ [View All Periods]    │
└───────────────────────┘
```

### Historical Period Selected

```
┌───────────────────────┐
│ Dec 15-31, 2025   ▼  │  Historical
└───────────────────────┘

Badge: "Historical" next to period
```

---

## Export States

### Export Menu Open

```
┌──────────┐
│ [Export] │
└────┬─────┘
     │
┌────┴─────────────────┐
│ 📄 PDF (Full)        │  Includes wage data
│ 📄 PDF (Employee)    │  No wage data
│ 🖨️ Print             │  No wage data
│ 📊 CSV               │  Includes wage data
└──────────────────────┘
```

### Exporting State

```
┌────────────────────┐
│ ⟳ Generating...    │
└────────────────────┘
Button disabled, spinner shown
```

### Export Complete

```
Toast:
┌─────────────────────────────────────────────────────────┐
│ ✓ PDF downloaded: distribution-jan-2026.pdf        [×] │
└─────────────────────────────────────────────────────────┘
```

---

## Mobile States

### Mobile Summary Cards (2x2 Grid)

```
┌─────────────────────────────────────────────────────────┐
│ ← Distribution   Jan 1-15 ▼                [⋮ Menu]    │
├─────────────────────────────────────────────────────────┤
│ ┌────────────────────┐ ┌────────────────────┐          │
│ │     $2,847         │ │        12          │          │
│ │    Total Pool      │ │    Recipients      │          │
│ └────────────────────┘ └────────────────────┘          │
│ ┌────────────────────┐ ┌────────────────────┐          │
│ │      $237          │ │        15          │          │
│ │    Avg Share       │ │       Days         │          │
│ └────────────────────┘ └────────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

### Mobile Table (Stacked Cards)

```
┌─────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Maria Santos                          Server        │ │
│ │─────────────────────────────────────────────────────│ │
│ │ Hours        32.5                                   │ │
│ │ Share        14.2%                                  │ │
│ │ Received     $404                                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ James Chen                         Lead Cook        │ │
│ │ ...                                                 │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Print Preview State

```
┌─────────────────────────────────────────────────────────┐
│                    TipSharePro Logo                     │
│                    Downtown Bistro                      │
│                                                         │
│              Tip Distribution Report                    │
│           Pay Period: Jan 1-15, 2026                    │
│                                                         │
│ ┌───────────────────────────────────────────────────────┐
│ │ Employee       Category    Hours   Share%   Received │
│ ├───────────────────────────────────────────────────────┤
│ │ Maria Santos   Server      32.5    14.2%    $404     │
│ │ James Chen     Lead Cook   40.0    18.6%    $530     │
│ │ ...                                                   │
│ └───────────────────────────────────────────────────────┘
│                                                         │
│ Total Pool: $2,847.00       Recipients: 12              │
│                                                         │
│ Generated: Jan 16, 2026 8:30 AM                         │
│ ─────────────────────────────────────────────────────── │
│ Confidential - For Internal Use Only                    │
└─────────────────────────────────────────────────────────┘
```

---

## Error States

### Calculation Error

```
┌─────────────────────────────────────────────────────────┐
│                    ⚠️                                   │
│                                                         │
│          Distribution Calculation Error                 │
│                                                         │
│   Unable to calculate distribution. Please verify       │
│   that all required data has been entered.              │
│                                                         │
│   Error: Missing hours for 2 employees                  │
│                                                         │
│           [View Details]  [Go to PPE Data]              │
└─────────────────────────────────────────────────────────┘
```

### Load Error

```
┌─────────────────────────────────────────────────────────┐
│                    ⚠️                                   │
│                                                         │
│          Unable to Load Distribution                    │
│                                                         │
│   We couldn't retrieve the distribution data.           │
│   Please try again.                                     │
│                                                         │
│                     [Retry]                             │
└─────────────────────────────────────────────────────────┘
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial screen states documentation |
