# Demo Settings Page - Feature Specification

**Version:** 1.0
**Date:** January 15, 2026
**Status:** Ready for Implementation

---

## Overview

The Demo Settings Page is the primary UI for the standalone Demo application. It combines a 5-step settings configuration with an inline Distribution Preview, allowing prospects to immediately see the effect of their choices.

> "What if they change the numbers on the settings, but after changing any setting they can just scroll down and see the effect on a scaled down distribution table."
> — Tom LaChaussee

---

## User Flow

```
Email Link → Login (TipSharePro-issued) → Settings Page → Distribution Preview → Print
                                              ↓
                                         [Scroll Down]
                                              ↓
                                    Inline Distribution Table
```

---

## Page Structure

```
┌──────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  [Logo]  TipSharePro          Welcome Admin (Contact Name & Co.)  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  SETTINGS SECTION                                                        │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  STEP 1: Method for Contribution %  ⓘ                             │  │
│  │  ┌──────────────────────────────────────────────────────────────┐ │  │
│  │  │  ☐ CC Sales   ☐ CC Tips   ☐ All Tips   ● All Sales          │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  │                                                                    │  │
│  │  STEP 2: Estimate Monthly $ Amount  ⓘ                             │  │
│  │  ┌──────────────────────────────────────────────────────────────┐ │  │
│  │  │  $ 25,000                                                    │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  │                                                                    │  │
│  │  STEP 3: Enter Contribution %  ⓘ                                  │  │
│  │  ┌──────────────────────────────────────────────────────────────┐ │  │
│  │  │  3.25%                                                    ▼  │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  │                                                                    │  │
│  │  STEP 4: Enter Job Categories  ⓘ                                  │  │
│  │  ┌──────────────────────────────────────────────────────────────┐ │  │
│  │  │  ☑ Server  ☑ Cook  ☑ Busser  ☐ Host  ☐ Bartender  ...      │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  │                                                                    │  │
│  │  STEP 5: Job Category Weights  ⓘ                                  │  │
│  │  ┌──────────────────────────────────────────────────────────────┐ │  │
│  │  │  Server:  [3.00 ▼]   Cook:  [2.50 ▼]   Busser:  [1.50 ▼]    │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  NAVIGATION BUTTONS                                                      │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  [Go To Distribution Table]    [Log Out]                          │  │
│  │   Primary                       Secondary                          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  FADED FULL VERSION CONTROLS (Tease)                                     │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Location ▼    Pay Period ▼    Scenario SSB    Users/Permissions  │  │
│  │   (faded)        (faded)         (faded)           (faded)        │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  PDF LINKS                                                               │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  📄 Why Sales-Based Contributions    📄 Job Categories Guide      │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  DISTRIBUTION PREVIEW (Inline)                                           │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  DISTRIBUTION TABLE                            [🖨️ Print Table]   │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  │
│  │                                                                    │  │
│  │  │ Employee      │ Role    │ Hours │ Rate  │ Share % │ Received │ │  │
│  │  ├───────────────┼─────────┼───────┼───────┼─────────┼──────────┤ │  │
│  │  │ Maria Santos  │ Server  │  32   │ $8.50 │  12.4%  │   $102   │ │  │
│  │  │ James Chen    │ Cook    │  40   │ $16.00│  18.3%  │   $150   │ │  │
│  │  │ Ana Rodriguez │ Busser  │  28   │ $7.25 │   5.8%  │    $48   │ │  │
│  │  │ ...           │ ...     │  ...  │ ...   │   ...   │    ...   │ │  │
│  │  ├───────────────┼─────────┼───────┼───────┼─────────┼──────────┤ │  │
│  │  │ TOTAL         │         │ 320   │       │  100%   │   $812   │ │  │
│  │  └───────────────┴─────────┴───────┴───────┴─────────┴──────────┘ │  │
│  │                                                                    │  │
│  │  💡 Set hours to zero to remove an employee from the pool.        │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Step Specifications

### Step 1: Method for Contribution %

| Element | Specification |
|---------|---------------|
| Type | Radio buttons (styled as checkboxes per Tom's spec) |
| Options | CC Sales, CC Tips, All Tips, All Sales |
| Default | All Sales (recommended) |
| ?Note | "TipSharePro recommends a percentage of sales. The taxing authorities require 8% of sales be reported for tip income as a true up (allocations) at the end of the year." |

### Step 2: Estimate Monthly $ Amount

| Element | Specification |
|---------|---------------|
| Type | Currency input (whole dollars) |
| Font | JetBrains Mono |
| Default | Empty |
| ?Note | "Use whichever criteria you used above. Any relatively close estimate will suffice." |

### Step 3: Enter Contribution %

| Element | Specification |
|---------|---------------|
| Type | Dropdown |
| Options (if Tips) | 5% to 25% in 0.5% increments |
| Options (if Sales) | 1% to 5% in 0.25% increments |
| Label | Shows "of Tips Only" or "of (adj) Sales" based on Step 1 |
| ?Note | (linked to Step 1 explanation) |

### Step 4: Enter Job Categories

| Element | Specification |
|---------|---------------|
| Type | Checkbox list |
| Predefined | Lead Cook, Line Cook, Pastry Chef, Prep Cook, Pantry Chef, Maitre D, Host/Hostess, Cashier, Runner, Busser, Barista, Bartender, Sommelier, Bar Back, Dishwasher |
| Custom | 5 write-in fields |
| ?Note | "Check the job categories you intend to use. Keep it simple and use as few positions as possible at first." |

### Step 5: Job Category Weights

| Element | Specification |
|---------|---------------|
| Type | Dropdown per selected category |
| Options | 1.00 to 5.00 in 0.25 increments (17 options) |
| Default | 2.50 (middle) |
| Display | Only show categories selected in Step 4 |
| ?Note | "1 is the lowest category in the pool. 5 is the highest. Don't get bogged down the first time." |

---

## Distribution Table (10 Pre-set Employees)

### Sample Data

| # | Name | Default Role | Default Hours | Default Rate |
|---|------|-------------|---------------|--------------|
| 1 | Maria Santos | Server | 32 | $8.50 |
| 2 | James Chen | Cook | 40 | $16.00 |
| 3 | Ana Rodriguez | Busser | 28 | $7.25 |
| 4 | Marcus Williams | Server | 36 | $9.00 |
| 5 | Lin Wei | Cook | 38 | $15.00 |
| 6 | Carlos Mendez | Busser | 24 | $7.25 |
| 7 | Sophia Kim | Host | 20 | $8.00 |
| 8 | David Johnson | Bartender | 35 | $12.00 |
| 9 | Emily Davis | Server | 30 | $8.75 |
| 10 | Michael Brown | Cook | 42 | $17.00 |

### Editable Columns
- Hours (number input, 0-168)
- Rate (currency input)
- Role (dropdown of selected categories from Step 4)

### Calculated Columns (Hidden "Basis")
- Share % (calculated, shown)
- Received $ (calculated, shown)
- Basis = Hours × Rate × Weight (NEVER shown)

### Dialog Box
When page loads, show dialog:
> "You can set hours to zero on any employee you want to eliminate from the pool if it holds too many recipients."

---

## Faded Full Version Controls

These buttons are visible but disabled/faded to tease the Full Version:

| Control | State |
|---------|-------|
| Location | Faded, tooltip: "Available in Full Version" |
| Pay Period | Faded |
| Scenario Sand Box | Faded |
| Users/Permissions | Faded |
| Date/Time Settings | Faded |
| Launch Date | Faded |

### Visual Treatment
```css
.btn-full-version-tease {
  background: var(--bg-surface);
  color: var(--text-disabled);
  border: 1px dashed var(--bg-border);
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## Print Functionality

**Print Distribution Table button:**
- Prints only the Distribution Table section
- Hides: Settings section, navigation, faded controls
- Shows: Logo, table with calculations
- Does NOT show: Wage column (per PRD confidentiality)

---

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Desktop (1024px+) | Settings and table side by side or stacked |
| Tablet (768-1023px) | Stacked, full width |
| Mobile (< 768px) | Stacked, scrollable table |

---

## Color Application

| Element | Color Token |
|---------|-------------|
| Page background | `--bg-body` (#0C0A07) |
| Settings card | `--bg-surface` (#1A1510) |
| Table container | `--bg-surface` (#1A1510) |
| Primary button | `--color-primary` (#E85D04) |
| Secondary button | `--color-secondary` (#1A4B7C) |
| ?Note icon | `--color-info` (#35A0D2) |
| Role badges | Per job category color |
| Currency values | `--text-primary` (default) or `--color-success` (positive) |

---

## Implementation Notes

1. **Real-time calculation**: Distribution updates immediately when settings change
2. **No backend needed**: Demo is fully client-side
3. **Login**: Simple form check against TipSharePro-issued credentials
4. **Hosting**: Could be Replit, Vercel, or static hosting
5. **Code reuse**: Components should be reusable for Full Version

---

## Related Files

- [PRD Demo Section](../../../project-documentation/product-manager-output.md)
- [Buttons Component](../../design-system/components/buttons.md)
- [Forms Component](../../design-system/components/forms.md)
- [Help System](../../design-system/components/help-system.md)
