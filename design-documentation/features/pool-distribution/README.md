---
title: Pool Distribution Feature Design
description: UX specifications for tip pool distribution and reporting
last-updated: 2026-01-08
version: 1.0.0
status: approved
---

# Pool Distribution Feature

## Overview

Pool Distribution shows team members their tip shares. This is the "payday" view—where the numbers matter most. The design emphasizes clarity, transparency, and the satisfaction of seeing earnings.

---

## User Stories

> *As a team member, I want to see my tip share clearly so that I know exactly what I earned this period.*

> *As a manager, I want to distribute tips fairly and have documentation for records.*

> *As an administrator, I want to generate reports for payroll and tax purposes.*

---

## Distribution Views

### 1. Manager View

Full details with ability to adjust and confirm.

### 2. Team Member View

Individual view showing personal earnings without revealing others' details.

### 3. Report View

Printable/exportable summary for records.

---

## Screen Designs

### 1. Distribution Overview (Manager)

**Layout:**
```
┌───────────────────────────────────────────────────────────────────────────┐
│  Sidebar  │  Distribution: Jan 1-15, 2026                   [Actions ▼]  │
│           │  ─────────────────────────────────────────────────────────── │
│  ...      │                                                              │
│           │  Status: Ready to Distribute                                 │
│           │                                                              │
│           │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐│
│           │  │ Total Pool │ │Team Members│ │  Avg Share │ │ Eff. Rate  ││
│           │  │ $4,892.50  │ │     12     │ │  $407.71   │ │ $17.19/hr  ││
│           │  └────────────┘ └────────────┘ └────────────┘ └────────────┘│
│           │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐│
│           │  │                    DISTRIBUTION                         ││
│           │  │─────────────────────────────────────────────────────────││
│           │  │  Name          │ Position │ Hours│ Rate │  TIP SHARE   ││
│           │  │─────────────────────────────────────────────────────────││
│           │  │  Maria Santos  │ Server   │ 32.5 │ 1.0x │   $558.28    ││
│           │  │  James Chen    │ Bartender│ 28.0 │ 1.2x │   $577.46    ││
│           │  │  Sarah Williams│ Host     │ 24.5 │ 0.8x │   $337.06    ││
│           │  │  ...           │          │      │      │              ││
│           │  │─────────────────────────────────────────────────────────││
│           │  │  TOTAL                    │284.5 │      │ $4,892.50    ││
│           │  └─────────────────────────────────────────────────────────┘│
│           │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐│
│           │  │ [Export PDF]  [Export CSV]     [Confirm Distribution]  ││
│           │  └─────────────────────────────────────────────────────────┘│
│           │                                                              │
└───────────┴──────────────────────────────────────────────────────────────┘
```

---

### 2. Team Member Personal View

What an individual team member sees.

**Layout:**
```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │                     Your Tip Share                                │   │
│  │                   January 1-15, 2026                              │   │
│  │                                                                   │   │
│  │                      ┌─────────────┐                              │   │
│  │                      │             │                              │   │
│  │                      │  $558.28    │                              │   │
│  │                      │             │                              │   │
│  │                      └─────────────┘                              │   │
│  │                                                                   │   │
│  │                   +$42.17 vs last period                          │   │
│  │                                                                   │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐   │
│  │  YOUR DETAILS                                                     │   │
│  │  ─────────────────────────────────────────────────────────────── │   │
│  │                                                                   │   │
│  │  Position           Server                                        │   │
│  │  Hours Worked       32.5 hours                                    │   │
│  │  Pool Rate          1.0x                                          │   │
│  │  ─────────────────────────────────────────────────────────────── │   │
│  │  Effective Rate     $17.18/hr                                     │   │
│  │                                                                   │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐   │
│  │  PERIOD SUMMARY                                                   │   │
│  │  ─────────────────────────────────────────────────────────────── │   │
│  │                                                                   │   │
│  │  Total Pool         $4,892.50                                     │   │
│  │  Team Hours         284.5 hours                                   │   │
│  │  Participants       12 team members                               │   │
│  │                                                                   │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐   │
│  │                       [ View History ]                            │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

**Hero Amount Design:**
```css
.hero-amount {
  text-align: center;
  padding: var(--space-6);
  background: linear-gradient(
    135deg,
    var(--espresso) 0%,
    rgba(212, 164, 32, 0.08) 100%
  );
  border-radius: var(--radius-xl);
  border: 1px solid var(--walnut);
}

.hero-amount-value {
  font-family: var(--font-mono);
  font-size: 4rem;
  font-weight: 500;
  color: var(--brass);
  line-height: 1;
  margin-bottom: var(--space-3);
  text-shadow: 0 0 40px var(--brass-glow);
}

.hero-amount-change {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--sage);
}

.hero-amount-change.negative {
  color: var(--sienna);
}
```

**Animation on Load:**
1. Card fades in with settle animation
2. Amount counts up from $0 to final (1.5s)
3. Change percentage fades in after amount settles

---

### 3. Distribution History

View past distributions.

**Layout:**
```
┌───────────────────────────────────────────────────────────────────────────┐
│  Sidebar  │  Distribution History                          [Filter ▼]   │
│           │  ─────────────────────────────────────────────────────────── │
│  ...      │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐│
│           │  │  PAY PERIOD        │  POOL    │ MEMBERS│ YOUR SHARE    ││
│           │  │─────────────────────────────────────────────────────────││
│           │  │  Jan 16-31, 2026   │ $5,234.00│   12   │  $612.45      ││
│           │  │  ─────────────────────────────────────────────────────────││
│           │  │  Jan 1-15, 2026    │ $4,892.50│   12   │  $558.28      ││
│           │  │  ─────────────────────────────────────────────────────────││
│           │  │  Dec 16-31, 2025   │ $5,867.25│   14   │  $516.11      ││
│           │  │  ─────────────────────────────────────────────────────────││
│           │  │  Dec 1-15, 2025    │ $4,123.00│   11   │  $489.50      ││
│           │  │  ...                                                   ││
│           │  └─────────────────────────────────────────────────────────┘│
│           │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐│
│           │  │  YTD SUMMARY                                           ││
│           │  │                                                         ││
│           │  │  Total Earned    $4,892.50                              ││
│           │  │  Total Hours     284.5                                  ││
│           │  │  Avg per Period  $612.81                                ││
│           │  └─────────────────────────────────────────────────────────┘│
│           │                                                              │
└───────────┴──────────────────────────────────────────────────────────────┘
```

---

### 4. Export/Print View

Clean layout for printing or PDF export.

**Print Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ╔═══════════════════════════════════════════════════════════════════╗ │
│  ║                     TIP SHARE PRO                                  ║ │
│  ║                 TIP DISTRIBUTION REPORT                            ║ │
│  ╚═══════════════════════════════════════════════════════════════════╝ │
│                                                                         │
│  Restaurant:    The Golden Fork                                         │
│  Pay Period:    January 1-15, 2026                                     │
│  Generated:     January 16, 2026 at 2:34 PM                            │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────│
│                                                                         │
│  SUMMARY                                                                │
│  ───────                                                                │
│  Total Tip Pool:        $4,892.50                                      │
│  Total Team Hours:      284.5                                           │
│  Effective Hourly Rate: $17.19                                         │
│  Team Members:          12                                              │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────│
│                                                                         │
│  DISTRIBUTION                                                           │
│  ────────────                                                           │
│                                                                         │
│  Name              Position     Hours    Rate    Tip Share             │
│  ─────────────────────────────────────────────────────────────────────│
│  Maria Santos      Server       32.50    1.0x    $558.28              │
│  James Chen        Bartender    28.00    1.2x    $577.46              │
│  Sarah Williams    Host         24.50    0.8x    $337.06              │
│  Miguel Rodriguez  Busser       18.00    0.6x    $185.76              │
│  Emily Johnson     Server       30.00    1.0x    $515.64              │
│  ...                                                                    │
│  ─────────────────────────────────────────────────────────────────────│
│  TOTAL                          284.50           $4,892.50             │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────│
│                                                                         │
│  Manager Signature: _______________________  Date: ______________       │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────│
│  Generated by Tip Share Pro • tipshare.pro                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

```css
@media print {
  body {
    background: white;
    color: black;
    font-size: 12pt;
  }

  .no-print {
    display: none;
  }

  .table {
    border: 1px solid #333;
  }

  .table th,
  .table td {
    border: 1px solid #ccc;
    padding: 8px;
  }
}
```

---

## Interaction Specifications

### Distribution Confirmation

**Confirmation Modal:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Confirm Distribution                                           [X]    │
│  ───────────────────────────────────────────────────────────────────── │
│                                                                         │
│  You are about to finalize tip distribution for:                       │
│                                                                         │
│  Pay Period: January 1-15, 2026                                        │
│  Total Pool: $4,892.50                                                 │
│  Team Members: 12                                                       │
│                                                                         │
│  ⚠ This action cannot be undone.                                       │
│  Once confirmed, this period will be locked.                           │
│                                                                         │
│  ───────────────────────────────────────────────────────────────────── │
│                                                                         │
│  [ Cancel ]                          [ Confirm Distribution ]          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Export Options

**Export Menu:**
```
┌─────────────────────────┐
│  Export As              │
│  ─────────────────────│
│  📄 PDF Report         │
│  📊 Excel Spreadsheet  │
│  📋 CSV Data           │
│  🖨️ Print              │
└─────────────────────────┘
```

---

## Status Badges

**Distribution Status:**

| Status | Badge | Description |
|--------|-------|-------------|
| Draft | Yellow/Brass | Calculations done, not finalized |
| Pending | Orange/Ember | Awaiting manager review |
| Confirmed | Green/Sage | Distribution finalized |
| Paid | Gray/Stone | Marked as paid out |

```css
.status-draft {
  background: rgba(212, 164, 32, 0.15);
  color: var(--brass);
}

.status-pending {
  background: rgba(232, 93, 53, 0.15);
  color: var(--ember);
}

.status-confirmed {
  background: rgba(45, 155, 110, 0.15);
  color: var(--sage);
}

.status-paid {
  background: rgba(139, 123, 101, 0.15);
  color: var(--stone);
}
```

---

## Edge Cases

### Adjustment After Distribution

If an error is found after confirmation:
1. Manager can request adjustment
2. Admin approval required
3. Creates audit trail entry
4. Recalculates affected amounts

### Zero Tip Share

If someone has 0 hours:
- Show as $0.00 in gray
- Include note: "No hours recorded"
- Still included in team count

### Partial Distribution

If some team members haven't been paid:
- Show checkboxes for paid status
- Track individual payment status
- Allow partial exports

---

## Animations

### Hero Amount Counter

```javascript
// Counter animation for big number reveal
const heroAmount = document.querySelector('.hero-amount-value');
const targetValue = parseFloat(heroAmount.dataset.value);

anime({
  targets: heroAmount,
  innerHTML: [0, targetValue],
  round: 2,
  duration: 1500,
  easing: 'easeOutExpo',
  update: function(anim) {
    heroAmount.innerHTML = '$' + parseFloat(heroAmount.innerHTML).toFixed(2);
  }
});
```

### Success Celebration

On distribution confirmation:
1. Modal closes with success message
2. Brass shimmer effect on header
3. "Distribution Complete" toast appears
4. Confetti/sparkle effect (subtle)

```css
@keyframes distribution-success {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.distribution-success-header {
  background: linear-gradient(
    90deg,
    var(--brass) 0%,
    var(--brass-light) 50%,
    var(--brass) 100%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: distribution-success 2s ease-in-out;
}
```

---

## Accessibility

### Screen Reader Support

- Distribution amounts announced with currency labels
- Table has proper headers and scope
- Status changes announced via live region
- Navigation landmarks for sections

### Visual

- High contrast for amounts
- Status indicated by icon + color + text
- Print view is high contrast black/white

---

## Related Documentation

- [Tip Calculation Feature](../tip-calculation/README.md)
- [Tables Component](../../design-system/components/tables.md)
- [Cards Component](../../design-system/components/cards.md)
