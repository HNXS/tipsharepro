---
title: Tip Calculation Feature Design
description: UX specifications for the core tip calculation engine
last-updated: 2026-01-08
version: 1.0.0
status: approved
---

# Tip Calculation Feature

## Overview

The tip calculation engine is the heart of Tip Share Pro. It transforms raw data (tips collected, hours worked, position rates) into fair, transparent distributions. The UI must make complex calculations feel simple and trustworthy.

---

## User Story

> *As a restaurant manager, I want to calculate tip distributions automatically so that my team gets paid fairly without me spending hours on spreadsheets.*

---

## Core Algorithm

```
Tip Share = (Hours × Rate × Variable Weight) / Total Points × Total Pool

Where:
- Hours = Individual hours worked
- Rate = Position-based multiplier (1.0 for servers, 0.6 for bussers, etc.)
- Variable Weight = Optional daily adjustment factor
- Points = Hours × Rate × Variable Weight
- Total Points = Sum of all team member points
- Total Pool = Total tips to distribute
```

**Note:** The "Basis" (Hours × Rate × Variable Weight) is calculated but NOT shown to team members—only the final tip share amount.

---

## Primary Flow

### Calculate Tips Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  1. SELECT PAY PERIOD                                                   │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  Pay Period: [Jan 1-15, 2026 ▼]                                │ │
│     │  Status: Active • 12 team members • $4,892.50 pool             │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              ↓                                          │
│  2. REVIEW DATA                                                         │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  ┌─────────────────────────────────────────────────────────┐   │ │
│     │  │  Total Pool     │  Team Hours  │  Team Members          │   │ │
│     │  │  $4,892.50     │  284.5 hrs   │  12 people             │   │ │
│     │  └─────────────────────────────────────────────────────────┘   │ │
│     │                                                                 │ │
│     │  [Validate Data] ← Check for missing entries                   │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              ↓                                          │
│  3. CALCULATE                                                           │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │                                                                 │ │
│     │              [ Calculate Tips ]  (Primary CTA)                 │ │
│     │                                                                 │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              ↓                                          │
│  4. REVIEW RESULTS (Modal)                                              │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  Distribution Preview                                          │ │
│     │  ─────────────────────────────────────────────────────────────│ │
│     │  Maria Santos      Server     32.5 hrs    $558.28              │ │
│     │  James Chen        Bartender  28.0 hrs    $577.46              │ │
│     │  ...                                                           │ │
│     │  ─────────────────────────────────────────────────────────────│ │
│     │  [Export]  [Save Draft]          [Confirm Distribution]       │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Screen Designs

### 1. Calculation Dashboard

The main view for initiating calculations.

**Layout:**
```
┌───────────────────────────────────────────────────────────────────────────┐
│  Sidebar  │  Pay Period: Jan 1-15, 2026                     [Actions ▼]  │
│           │  ─────────────────────────────────────────────────────────── │
│  ...      │                                                              │
│           │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐│
│           │  │ Total Pool │ │ Team Hours │ │Hourly Rate │ │Team Members││
│           │  │ $4,892.50  │ │   284.5    │ │   $17.19   │ │     12     ││
│           │  │   +12.4%   │ │   +3.2%    │ │   +8.9%    │ │     —      ││
│           │  └────────────┘ └────────────┘ └────────────┘ └────────────┘│
│           │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐│
│           │  │ Team Member │ Position │ Hours │ Rate │ Est. Share     ││
│           │  │─────────────────────────────────────────────────────────││
│           │  │ M. Santos   │ Server   │ 32.5  │ 1.0x │   $558.28      ││
│           │  │ J. Chen     │ Bartender│ 28.0  │ 1.2x │   $577.46      ││
│           │  │ ...         │          │       │      │                ││
│           │  │─────────────────────────────────────────────────────────││
│           │  │ TOTAL       │          │ 284.5 │      │ $4,892.50      ││
│           │  └─────────────────────────────────────────────────────────┘│
│           │                                                              │
│           │                      [ Calculate Tips ]                      │
│           │                                                              │
└───────────┴──────────────────────────────────────────────────────────────┘
```

**Stat Cards:**
- Total Pool: Sum of all daily contributions (displays in brass/gold)
- Team Hours: Sum of all hours worked
- Hourly Rate: Total Pool / Team Hours (calculated value)
- Team Members: Count of active participants

**Table Columns:**
- Team Member: Full name, sortable
- Position: Job category
- Hours: Total hours for period (monospace, right-aligned)
- Rate: Position multiplier (e.g., 1.0x, 1.2x)
- Est. Share: Calculated amount (brass color, monospace)

---

### 2. Calculation Results Modal

Displays after "Calculate Tips" is pressed.

**Modal Content:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Tip Distribution                                            [X]       │
│  Pay Period: Jan 1-15, 2026                                            │
│  ───────────────────────────────────────────────────────────────────── │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │   Total Pool    │  │  Team Members   │  │  Effective Rate │         │
│  │   $4,892.50    │  │       12        │  │   $17.19/hr    │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ TEAM MEMBER      │ POSITION  │  HOURS │    RATE │   TIP SHARE  │   │
│  │───────────────────────────────────────────────────────────────────│   │
│  │ Maria Santos     │ Server    │  32.5  │   1.0x  │    $558.28   │   │
│  │ James Chen       │ Bartender │  28.0  │   1.2x  │    $577.46   │   │
│  │ Sarah Williams   │ Host      │  24.5  │   0.8x  │    $337.06   │   │
│  │ Miguel Rodriguez │ Busser    │  18.0  │   0.6x  │    $185.76   │   │
│  │ Emily Johnson    │ Server    │  30.0  │   1.0x  │    $515.64   │   │
│  │ ...              │           │        │         │              │   │
│  │───────────────────────────────────────────────────────────────────│   │
│  │ PERIOD TOTAL     │           │ 284.5  │         │  $4,892.50   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ───────────────────────────────────────────────────────────────────── │
│  [Export PDF]  [Save as Draft]               [Confirm Distribution]    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Animations:**
1. Modal slides in with "cash-settle" animation
2. Numbers count up from 0 to final values (1.5s duration)
3. Table rows appear in sequence (50ms stagger)

**Actions:**
- Export PDF: Generates printable report
- Save as Draft: Saves calculation but doesn't finalize
- Confirm Distribution: Locks the period and marks complete

---

### 3. Data Validation Screen

Shows when there are issues with the data before calculation.

**Warning States:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⚠ Data Issues Found                                                   │
│  ───────────────────────────────────────────────────────────────────── │
│                                                                         │
│  The following issues may affect calculation accuracy:                  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ⚠ Missing Hours                                                 │   │
│  │   2 team members have no hours entered for this period          │   │
│  │   • David Kim (Server)                                          │   │
│  │   • Lisa Park (Bartender)                                       │   │
│  │                                                     [Fix Now]   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ⚠ Missing Daily Entries                                        │   │
│  │   3 days have no tip contributions recorded                     │   │
│  │   • Jan 5, Jan 8, Jan 12                                        │   │
│  │                                                     [Fix Now]   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [Calculate Anyway (Excludes Incomplete Data)]    [Fix All Issues]     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Interaction Specifications

### Calculate Button

**States:**
- Default: Brass background, ready to click
- Hover: Brass glow, subtle lift
- Loading: Spinner, "Calculating..." text
- Success: Green pulse, checkmark icon (brief)
- Disabled: When no data or period is closed

**Loading Animation:**
```css
.btn-calculating {
  position: relative;
  color: transparent;
}

.btn-calculating::after {
  content: 'Calculating...';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--midnight);
  animation: calculating-pulse 1s ease infinite;
}

@keyframes calculating-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

### Number Counter Animation

When results appear, numbers count up:

```javascript
// Pseudo-code for counter
function countUp(element, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    const current = start + (target - start) * eased;

    element.textContent = formatCurrency(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
```

### Table Row Highlighting

When hovering or focusing on a team member row:
- Background shifts to `--mahogany`
- Row gets subtle left border in `--brass`
- Tip share amount gets slightly brighter

---

## Edge Cases

### Zero Hours

If a team member has zero hours for the period:
- They are excluded from calculations
- Shown with grayed-out row in preview
- Warning indicator in validation

### Negative Tips (Chargebacks)

If daily entry includes negative values:
- Show as red/sienna color
- Display warning before calculating
- Still include in total (reduces pool)

### Large Teams (20+ members)

- Table becomes scrollable within card
- Pagination or "Show all" option
- Summary stats remain visible (sticky)

### Rounding

- Individual amounts rounded to cents
- Rounding differences applied to highest earner
- Total always matches exactly

---

## Accessibility

### Keyboard Navigation

- Tab through interactive elements
- Enter triggers calculate
- Escape closes result modal
- Arrow keys navigate table rows (when focused)

### Screen Reader

- Live region announces calculation results
- Table has proper column headers
- Currency values announced with labels

### Visual

- All text meets WCAG AA contrast
- Focus indicators visible
- Color not sole indicator of state

---

## Error States

### Calculation Error

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✗ Calculation Failed                                                  │
│                                                                         │
│  Unable to complete tip calculation. Please try again.                 │
│                                                                         │
│  Error: Division by zero - no valid hours entered                      │
│                                                                         │
│  [Try Again]  [Contact Support]                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Network Error

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✗ Connection Lost                                                     │
│                                                                         │
│  Your calculation has been saved locally. It will sync when            │
│  connection is restored.                                               │
│                                                                         │
│  [Retry Now]  [Work Offline]                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Related Documentation

- [Daily Entry Feature](../daily-entry/README.md)
- [Pool Distribution Feature](../pool-distribution/README.md)
- [Tables Component](../../design-system/components/tables.md)
- [Modals Component](../../design-system/components/modals.md)
