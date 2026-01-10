# Daily Contributions - Screen States

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document describes all possible screen states for the Daily Contributions feature, including empty, populated, loading, and error states.

---

## Page-Level States

### Loading State

**When:** Initial page load, date change

```
┌─────────────────────────────────────────────────────────┐
│ ← Daily Contributions        ◀ Jan 10, 2026 ▶   [Save] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  │ ▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  │ ▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Loading today's data...                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Empty State (No Contributors)

**When:** No employees configured as contributors

```
┌─────────────────────────────────────────────────────────┐
│ ← Daily Contributions        ◀ Jan 10, 2026 ▶   [Save] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    📋                                   │
│                                                         │
│             No Contributors Set Up                      │
│                                                         │
│   You haven't configured any job categories as          │
│   contributors yet. Go to Settings to set up job        │
│   categories and weights.                               │
│                                                         │
│              [Go to Settings]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Empty State (No Data for Date)

**When:** Date selected but no entries yet

```
┌─────────────────────────────────────────────────────────┐
│ ← Daily Contributions        ◀ Jan 10, 2026 ▶   [Save] │
│                              [Copy Previous Day]        │
├─────────────────────────────────────────────────────────┤
│ EMPLOYEE           SALES     CALC CONT.    ACTUAL CONT. │
├─────────────────────────────────────────────────────────┤
│ Maria Santos       $______    $0.00        [$0.00____]  │
│ Server                                                  │
│─────────────────────────────────────────────────────────│
│ John Davis         $______    $0.00        [$0.00____]  │
│ Server                                                  │
│─────────────────────────────────────────────────────────│
│ Sarah Kim          $______    $0.00        [$0.00____]  │
│ Bartender                                               │
├─────────────────────────────────────────────────────────┤
│ DAILY TOTAL                   $0.00        $0.00        │
└─────────────────────────────────────────────────────────┘
```

### Populated State

**When:** Data has been entered

```
┌─────────────────────────────────────────────────────────┐
│ ← Daily Contributions        ◀ Jan 10, 2026 ▶   [Save] │
│                              [Copy Previous Day]        │
├─────────────────────────────────────────────────────────┤
│ EMPLOYEE           SALES     CALC CONT.    ACTUAL CONT. │
├─────────────────────────────────────────────────────────┤
│ Maria Santos       $2,450.00  $73.50       [$73.50___]  │
│ Server                                                  │
│─────────────────────────────────────────────────────────│
│ John Davis         $1,875.00  $56.25       [$56.25___]  │
│ Server                                                  │
│─────────────────────────────────────────────────────────│
│ Sarah Kim          $3,200.00  $96.00       [$102.00__]  │
│ Bartender                                    +$6.00 ⚠   │
├─────────────────────────────────────────────────────────┤
│ DAILY TOTAL        $7,525.00  $225.75      $231.75      │
│ 3 contributors                                          │
└─────────────────────────────────────────────────────────┘
```

### Saved State

**When:** Data successfully saved

```
┌─────────────────────────────────────────────────────────┐
│ ✓ Saved                                                 │
│ ← Daily Contributions        ◀ Jan 10, 2026 ▶   [Save] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   [Same populated grid with checkmark indicator]        │
│                                                         │
│   Toast: ✓ Daily contributions saved                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Header States

### Date Navigator

**Default:**
```
◀  January 10, 2026  ▶
```

**At Period Start (left disabled):**
```
◁  January 1, 2026  ▶
   Period start
```

**At Today (right shows warning):**
```
◀  January 10, 2026  ▷
                     Today
```

**Outside Period Warning:**
```
⚠ This date is outside the current pay period
```

---

## Grid Row States

### Default Row (Empty)

```
┌─────────────────────────────────────────────────────────┐
│ Maria Santos       $[________]  $0.00    [$0.00_____]   │
│ Server             (empty)                (editable)    │
└─────────────────────────────────────────────────────────┘
```

### Row with Data

```
┌─────────────────────────────────────────────────────────┐
│ Maria Santos       $2,450.00   $73.50    [$73.50____]   │
│ Server             ✓ entered             (green bg)     │
└─────────────────────────────────────────────────────────┘
```

### Row with Override

```
┌─────────────────────────────────────────────────────────┐
│ Sarah Kim          $3,200.00   $96.00    [$102.00___]   │
│ Bartender                                 +$6.00 ⚠ [?]  │
│                                          (variance)     │
└─────────────────────────────────────────────────────────┘
```

### Row with Validation Error

```
┌─────────────────────────────────────────────────────────┐
│ John Davis         $[-500.00]  ⚠         [__________]  │
│ Server              ⛔ Amount must be positive          │
└─────────────────────────────────────────────────────────┘
```

### Row - Focused/Active

```
┌─────────────────────────────────────────────────────────┐
│ Maria Santos       $[2,450.00] $73.50    [$73.50____]   │
│ Server              ▲ focused            (green bg)     │
│                     blue border                         │
└─────────────────────────────────────────────────────────┘
```

---

## Input Field States

### Sales Input - Default

```
┌────────────────┐
│ $              │
└────────────────┘
Border: #E5E5E5
```

### Sales Input - Focused

```
┌────────────────┐
│ $2,450.00     │
└────────────────┘
Border: #E85D04 (2px)
Shadow: orange glow
```

### Sales Input - Filled

```
┌────────────────┐
│ $2,450.00      │
└────────────────┘
Border: #E5E5E5
Text: Monospace, right-aligned
```

### Actual Contribution - Editable

```
┌────────────────┐
│ $73.50        │  ← Green background
└────────────────┘
Background: #F0F7E6
Border: #82B536
```

### Actual Contribution - With Variance

```
┌────────────────┐
│ $102.00       │ +$6.00 ⚠
└────────────────┘
Shows variance from calculated
```

---

## Summary Section States

### Empty Summary

```
┌─────────────────────────────────────────────────────────┐
│ DAILY SUMMARY                                           │
├─────────────────────────────────────────────────────────┤
│ Total Sales          $0.00                              │
│ Calculated Total     $0.00                              │
│ Actual Total         $0.00                              │
│ Contributors         0                                  │
└─────────────────────────────────────────────────────────┘
```

### Populated Summary

```
┌─────────────────────────────────────────────────────────┐
│ DAILY SUMMARY                                           │
├─────────────────────────────────────────────────────────┤
│ Total Sales          $7,525.00                          │
│ Calculated Total     $225.75                            │
│ Actual Total         $231.75                            │
│ Variance             +$6.00 ⚠                           │
│ Contributors         3                                  │
└─────────────────────────────────────────────────────────┘
```

### Summary with Warning

```
┌─────────────────────────────────────────────────────────┐
│ DAILY SUMMARY                             ⚠ Variances   │
├─────────────────────────────────────────────────────────┤
│ ...                                                     │
│ 2 entries have overrides                    [Review]    │
└─────────────────────────────────────────────────────────┘
```

---

## Modal States

### Copy Previous Day Confirmation

```
┌─────────────────────────────────────────────────────────┐
│ Copy Previous Day                                  [×]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Copy sales data from January 9, 2026?                   │
│                                                         │
│ This will:                                              │
│ • Copy all sales figures                                │
│ • Recalculate contributions                             │
│ • Preserve any existing overrides for today             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                          [Cancel] [Copy Data]           │
└─────────────────────────────────────────────────────────┘
```

### Unsaved Changes Warning

```
┌─────────────────────────────────────────────────────────┐
│ Unsaved Changes                                    [×]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ You have unsaved changes for January 10, 2026.          │
│ Do you want to save before navigating?                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                    [Discard] [Cancel] [Save & Continue] │
└─────────────────────────────────────────────────────────┘
```

### Future Date Warning

```
┌─────────────────────────────────────────────────────────┐
│ Future Date                                        [×]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ⚠ You cannot enter data for future dates.              │
│                                                         │
│ Today's date is January 10, 2026.                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                           [OK]          │
└─────────────────────────────────────────────────────────┘
```

---

## Mobile States

### Mobile Grid (Stacked)

```
┌─────────────────────────────────────────────────────────┐
│ ← Daily Contributions                                   │
│   January 10, 2026        ◀  ▶                          │
│                                     [Copy] [Save]       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Maria Santos              Server                    │ │
│ │─────────────────────────────────────────────────────│ │
│ │ Sales          [$2,450.00_________________]         │ │
│ │ Calculated     $73.50                               │ │
│ │ Actual         [$73.50____________________]         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ John Davis                Server                    │ │
│ │ ...                                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Total: $231.75                          3 contributors  │
└─────────────────────────────────────────────────────────┘
```

---

## Error States

### Save Error

```
Toast:
┌─────────────────────────────────────────────────────────┐
│ ⚠ Unable to save. Please try again.               [×]  │
│                                          [Retry]        │
└─────────────────────────────────────────────────────────┘
```

### Network Error

```
┌─────────────────────────────────────────────────────────┐
│ Connection Lost                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ⚠ Unable to connect. Your changes are saved locally.   │
│                                                         │
│ [Try Again]                                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial screen states documentation |
