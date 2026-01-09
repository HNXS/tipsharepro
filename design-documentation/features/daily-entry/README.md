---
title: Daily Entry Feature Design
description: UX specifications for daily tip contribution entry
last-updated: 2026-01-08
version: 1.0.0
status: approved
---

# Daily Entry Feature

## Overview

Daily Entry is where tip pool contributions are recorded each day. This is the most frequently used feature—managers or designees will access this daily to enter tip amounts and (optionally) individual hours.

---

## User Stories

> *As a manager, I want to quickly enter today's tip pool and team hours so that I can calculate accurate distributions at pay period end.*

> *As a designee, I want to enter just the daily tip total so that I can hand off detailed entry to the manager.*

---

## Primary Flow

### Daily Entry Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  1. SELECT DATE                                                         │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  [◀]  January 8, 2026  [▶]    Today: ●                         │ │
│     │         Wednesday                                               │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              ↓                                          │
│  2. ENTER TIP TOTAL                                                     │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │                                                                 │ │
│     │  TOTAL TIPS FOR TODAY                                           │ │
│     │  ┌───────────────────────────────────────────────────────────┐ │ │
│     │  │  $  [ 847.50                                             ]│ │ │
│     │  └───────────────────────────────────────────────────────────┘ │ │
│     │                                                                 │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              ↓                                          │
│  3. ENTER HOURS (Optional/Expandable)                                   │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  [▼] Team Hours    12 members • 38.5 total hours               │ │
│     │  ─────────────────────────────────────────────────────────────│ │
│     │  Maria Santos      Server       [ 6.5 ] hrs                    │ │
│     │  James Chen        Bartender    [ 5.5 ] hrs                    │ │
│     │  ...                                                           │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              ↓                                          │
│  4. SAVE                                                                │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │                [ Save Entry ]                                   │ │
│     │                                                                 │ │
│     │  Auto-saves as you type • Last saved 2 min ago                 │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Screen Designs

### 1. Daily Entry Main View

The primary interface for entering daily data.

**Layout:**
```
┌───────────────────────────────────────────────────────────────────────────┐
│  Sidebar  │  Daily Entry                               [View Calendar]   │
│           │  ─────────────────────────────────────────────────────────── │
│  ...      │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐ │
│           │  │       [◀]   Wednesday, January 8, 2026   [▶]           │ │
│           │  │                                                         │ │
│           │  │            ●  ●  ●  ●  ●  ○  ○                        │ │
│           │  │           Mon Tue Wed Thu Fri Sat Sun                   │ │
│           │  │           ✓   ✓   •   —   —   —   —                    │ │
│           │  └─────────────────────────────────────────────────────────┘ │
│           │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐ │
│           │  │  TODAY'S TIP POOL                                      │ │
│           │  │                                                         │ │
│           │  │  ┌─────────────────────────────────────────────────┐   │ │
│           │  │  │  $  847.50                                      │   │ │
│           │  │  └─────────────────────────────────────────────────┘   │ │
│           │  │                                                         │ │
│           │  │  Week Average: $792.30 │ Same Day Last Week: $823.00  │ │
│           │  └─────────────────────────────────────────────────────────┘ │
│           │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐ │
│           │  │  ▼ TEAM HOURS               38.5 total │ 12 members   │ │
│           │  │─────────────────────────────────────────────────────────│ │
│           │  │  Maria Santos      Server          [ 6.5 ]  hrs       │ │
│           │  │  James Chen        Bartender       [ 5.5 ]  hrs       │ │
│           │  │  Sarah Williams    Host            [ 4.0 ]  hrs       │ │
│           │  │  Miguel Rodriguez  Busser          [ 3.5 ]  hrs       │ │
│           │  │  Emily Johnson     Server          [ 6.0 ]  hrs       │ │
│           │  │  ...                                                   │ │
│           │  └─────────────────────────────────────────────────────────┘ │
│           │                                                              │
│           │  ┌─────────────────────────────────────────────────────────┐ │
│           │  │  [ Clear Day ]              [ Save Entry ]             │ │
│           │  │                                                         │ │
│           │  │  ✓ Auto-saved 2 minutes ago                            │ │
│           │  └─────────────────────────────────────────────────────────┘ │
│           │                                                              │
└───────────┴──────────────────────────────────────────────────────────────┘
```

---

### 2. Date Navigation

**Calendar Strip Component:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  [◀]          Wednesday, January 8, 2026          [▶]                  │
│                                                                         │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐               │
│  │ 6  │  │ 7  │  │ 8  │  │ 9  │  │ 10 │  │ 11 │  │ 12 │               │
│  │Mon │  │Tue │  │Wed │  │Thu │  │Fri │  │Sat │  │Sun │               │
│  │ ✓  │  │ ✓  │  │ ●  │  │    │  │    │  │    │  │    │               │
│  └────┘  └────┘  └────┘  └────┘  └────┘  └────┘  └────┘               │
│                                                                         │
│  Legend: ✓ Entered  ● Today (editing)  — No entry  ✕ Issue             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Day States:**
- **Entered** (✓): Green checkmark, `--sage` indicator
- **Today** (●): Brass ring, currently selected
- **Empty** (—): No indicator, neutral
- **Issue** (✕): Red/sienna, needs attention
- **Future**: Grayed out, not selectable

**Interactions:**
- Click day to jump to it
- Arrow keys navigate days
- Swipe on mobile
- Today button returns to current date

---

### 3. Tip Input Field

**Large Currency Input:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  TODAY'S TIP POOL                                                       │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │   $   847.50                                                    │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Avg: $792.30 this week    │    +6.9% vs same day last week            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Visual Specs:**
- Font: `--font-mono`, 2.5rem
- Color: `--brass` when filled, `--stone` when empty
- Border: 2px, transitions to `--brass` on focus
- Glow: `--shadow-glow` on focus

**Behavior:**
- Auto-formats as currency
- Strips non-numeric characters
- Allows decimal input
- Maximum 2 decimal places
- Validates on blur

---

### 4. Hours Entry Section

**Expandable List:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ▼ TEAM HOURS                                    38.5 total │ 12 ppl   │
│  ───────────────────────────────────────────────────────────────────── │
│                                                                         │
│  ┌─────────┬────────────┬─────────────────────────────────────────┐    │
│  │  Name   │  Position  │  Hours                                  │    │
│  ├─────────┼────────────┼─────────────────────────────────────────┤    │
│  │ Maria S │ Server     │  [ 6.5 ]  avg: 6.2                      │    │
│  │ James C │ Bartender  │  [ 5.5 ]  avg: 5.8                      │    │
│  │ Sarah W │ Host       │  [ 4.0 ]  avg: 4.0                      │    │
│  │ Miguel R│ Busser     │  [ 3.5 ]  avg: 3.2                      │    │
│  │ Emily J │ Server     │  [ 6.0 ]  avg: 5.5                      │    │
│  │ ...     │            │                                         │    │
│  └─────────┴────────────┴─────────────────────────────────────────┘    │
│                                                                         │
│  [+ Add Team Member]                                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Hours Input Specs:**
- Font: `--font-mono`
- Width: 60px
- Right-aligned
- Step: 0.5 (for half hours)
- Min: 0, Max: 24

**Inline Validation:**
- Shows average for context
- Highlights if significantly different from average (±50%)
- Warning icon if over 12 hours

---

### 5. Quick Entry Mode

For busy nights when only the total matters:

**Minimal Interface:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                     Wednesday, January 8                                │
│                                                                         │
│                         $ [ 847.50 ]                                    │
│                                                                         │
│                         [ Save & Next → ]                               │
│                                                                         │
│                      [Expand for hours entry]                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Save advances to next date
- Perfect for catching up on multiple days
- Hours can be entered later

---

## Interaction Specifications

### Auto-Save

**Debounced Save:**
- Triggers 2 seconds after last input change
- Shows "Saving..." indicator briefly
- Shows "Saved" confirmation with checkmark
- Persists to local storage immediately, syncs to server

```css
.save-status {
  font-size: 0.75rem;
  color: var(--stone);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.save-status-saving::before {
  content: '';
  width: 12px;
  height: 12px;
  border: 2px solid var(--walnut);
  border-top-color: var(--brass);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.save-status-saved {
  color: var(--sage);
}

.save-status-saved::before {
  content: '✓';
  margin-right: var(--space-1);
}
```

### Tab Navigation

Order of focus:
1. Tip total input
2. First team member hours
3. Each subsequent team member
4. Save button

**Keyboard Shortcuts:**
- Tab: Next field
- Shift+Tab: Previous field
- Enter: Save (when on button)
- Arrow Left/Right: Previous/next day

### Hours Bulk Entry

**Preset Templates:**
- "Copy from yesterday": Fills hours from previous day
- "Use scheduled hours": Pulls from POS/schedule integration
- "Clear all": Resets all hours to 0

---

## Edge Cases

### No Team Members

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ℹ No team members added yet                                           │
│                                                                         │
│  Add team members to track individual hours.                           │
│  You can still enter total tips without individual hours.              │
│                                                                         │
│  [Add Team Member]                                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Future Date Selected

- Input fields disabled
- Message: "You can't enter data for future dates"
- "Jump to today" button

### Past Pay Period

- Read-only view
- "This pay period is closed" banner
- Edit button requires manager permission

### Negative Entry

- Allowed (for chargebacks/corrections)
- Displays in `--sienna` color
- Confirmation prompt on save

---

## Mobile Design

### Compact Layout

```
┌─────────────────────────────────────┐
│  ◀  Wed, Jan 8, 2026  ▶           │
│  ● ● ● ○ ○ ○ ○                     │
├─────────────────────────────────────┤
│                                     │
│  TODAY'S TIPS                       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   $   847.50                  │ │
│  └───────────────────────────────┘ │
│                                     │
│  Avg: $792.30                      │
│                                     │
├─────────────────────────────────────┤
│  TEAM HOURS        38.5 hrs │ 12  │
│  ─────────────────────────────────│
│  Maria S    Server     [ 6.5 ]    │
│  James C    Bartender  [ 5.5 ]    │
│  Sarah W    Host       [ 4.0 ]    │
│  ─────────────────────────────────│
│                                     │
├─────────────────────────────────────┤
│        [ Save Entry ]              │
│                                     │
│  ✓ Auto-saved                      │
└─────────────────────────────────────┘
```

**Touch Optimizations:**
- Larger touch targets (48px minimum)
- Swipe between days
- Pull to refresh
- Native number keyboard for inputs

---

## Accessibility

### Labels

```html
<label for="tip-total" class="form-label">
  Today's Tip Pool
  <span class="sr-only">in dollars</span>
</label>
<input
  type="text"
  id="tip-total"
  inputmode="decimal"
  pattern="[0-9]*\.?[0-9]{0,2}"
  aria-describedby="tip-hint"
>
<span id="tip-hint" class="form-helper">
  Enter the total tips collected today
</span>
```

### Announcements

- "Saved successfully" announced on auto-save
- Date change announced when navigating
- Validation errors announced immediately

---

## Error States

### Save Failed

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✗ Couldn't save your entry                                            │
│                                                                         │
│  Your changes have been saved locally and will sync                    │
│  when connection is restored.                                          │
│                                                                         │
│  [Try Again]  [Work Offline]                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Invalid Input

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⚠ Invalid amount                                                      │
│                                                                         │
│  Please enter a valid dollar amount (e.g., 847.50)                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Related Documentation

- [Tip Calculation Feature](../tip-calculation/README.md)
- [Forms Component](../../design-system/components/forms.md)
- [Cards Component](../../design-system/components/cards.md)
