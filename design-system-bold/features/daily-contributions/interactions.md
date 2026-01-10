# Daily Contributions - Interactions

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document details all user interactions within the Daily Contributions feature, including input behaviors, calculations, and navigation.

---

## Date Navigation

### Previous Day Button

**Trigger:** Click/tap left arrow

**Behavior:**
1. Check for unsaved changes
2. If changes: Show save prompt
3. If no changes or after save: Navigate to previous day
4. Update date display
5. Load data for new date

**Disabled State:**
- At start of current pay period
- Visual: Grayed out arrow
- Tooltip: "Period start"

### Next Day Button

**Trigger:** Click/tap right arrow

**Behavior:**
1. Check if target date is in future
2. If future: Show warning modal, don't navigate
3. If within period: Navigate to next day
4. Load data for new date

**At Today:**
- Arrow shows but warns on click
- Tooltip: "Today"

### Date Picker (if implemented)

**Trigger:** Click on date text

**Behavior:**
1. Calendar popup appears
2. Current date highlighted
3. Dates outside period dimmed/disabled
4. Select date to navigate

---

## Data Entry

### Sales Amount Input

**Focus:**
1. Border changes to primary color
2. Focus ring appears
3. Cursor in field
4. On mobile: Numeric keypad opens

**Input:**
1. Accept numeric input only
2. Auto-format with currency symbol
3. Auto-add decimal places
4. Support paste from clipboard

**On Change (Blur or Enter):**
1. Validate input (positive number)
2. Calculate contribution:
   ```
   Calculated = Sales × Rate
   ```
3. Update "Calculated Contribution" display
4. Pre-fill "Actual Contribution" if empty
5. Update daily totals

**Formatting:**
```javascript
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}
// $2,450.00
```

### Actual Contribution Input (Override)

**Visual Indicator:**
- Green background (#F0F7E6)
- Green border (#82B536)
- Indicates "editable override field"

**Focus:**
1. Border changes to primary orange
2. Focus ring appears
3. Green background remains

**On Change:**
1. Accept numeric input
2. Calculate variance from calculated amount
3. Show variance indicator if different:
   - `+$X.XX` if actual > calculated (yellow warning)
   - `-$X.XX` if actual < calculated (yellow warning)
4. Update totals

**Variance Indicator:**
```html
<div class="variance-indicator warning">
  <span>+$6.00</span>
  <span class="help-note" data-tooltip="Actual differs from calculated. This is OK if server reported different tips.">?</span>
</div>
```

---

## Keyboard Navigation

### Tab Order

1. Back button
2. Date navigator (left arrow, date, right arrow)
3. Copy Previous Day button
4. For each row: Sales input → Actual input
5. Save button

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Next field |
| `Shift+Tab` | Previous field |
| `Enter` | Move to next row (from last field in row) |
| `Escape` | Cancel edit, revert to saved value |
| `Ctrl/Cmd+S` | Save all changes |
| `Ctrl/Cmd+←` | Previous day |
| `Ctrl/Cmd+→` | Next day |

### Arrow Key Navigation (Grid)

| Key | Action |
|-----|--------|
| `Arrow Down` | Move to same field in next row |
| `Arrow Up` | Move to same field in previous row |
| `Arrow Left` | Move to previous field in row |
| `Arrow Right` | Move to next field in row |

---

## Copy Previous Day

### Trigger
Click "Copy Previous Day" button

### Flow
1. Show confirmation modal
2. User confirms
3. Fetch previous day's data
4. Populate sales amounts
5. Recalculate contributions
6. Preserve any existing overrides for today
7. Show success toast
8. Mark form as dirty (needs save)

### Modal Content
```
Copy Previous Day

Copy sales data from January 9, 2026?

This will:
• Copy all sales figures
• Recalculate contributions
• Preserve any existing overrides for today

[Cancel] [Copy Data]
```

### Edge Cases
- No previous day data: "No data from previous day to copy"
- Different employees: "Employee list differs from previous day"
- Copy failure: Error toast with retry option

---

## Auto-Calculation

### Trigger
Sales amount changed (on blur or Enter)

### Calculation
```javascript
function calculateContribution(sales, rate) {
  return Math.round(sales * rate * 100) / 100;
}

// Example: $2,450.00 × 0.03 = $73.50
```

### Update Flow
1. Calculate contribution
2. Update calculated display
3. If actual field is empty: Copy calculated to actual
4. Update row totals
5. Update daily totals

### Visual Feedback
- Brief highlight animation on calculated field
- Totals update smoothly (no flicker)

---

## Save Interaction

### Save Button

**Default State:**
- Primary button styling
- Text: "Save & Continue" or "Save"

**Loading State:**
```html
<button class="btn btn-primary" disabled>
  <span class="spinner-sm"></span>
  Saving...
</button>
```

**Click Flow:**
1. Validate all entries
2. If errors: Focus first error, show messages
3. If valid: Show loading state
4. Send data to API
5. On success: Toast + update saved state
6. On error: Error toast + preserve data

### Auto-Save (Optional)

**Trigger:** 30 seconds of inactivity after change

**Behavior:**
- Silent save (no toast unless error)
- Update "Last saved" indicator
- Keep user on page

---

## Validation

### Field Validation

**Sales Amount:**
```javascript
const salesValidation = {
  required: true,
  min: 0,
  max: 100000, // Reasonable max
  numeric: true
};
```

**Actual Contribution:**
```javascript
const actualValidation = {
  required: false, // Can use calculated
  min: 0,
  max: 10000,
  numeric: true
};
```

### Validation Timing
- **On blur:** Validate field
- **On submit:** Validate all fields
- **Real-time:** After first error shown

### Error Display
```html
<div class="grid-row has-error">
  <input class="form-input error" aria-invalid="true" aria-describedby="sales-error">
  <p id="sales-error" class="form-error">Amount must be positive</p>
</div>
```

---

## Touch Interactions

### Swipe Navigation

**On mobile:**
- Swipe left: Next day
- Swipe right: Previous day

**Implementation:**
```javascript
let startX;

grid.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

grid.addEventListener('touchend', (e) => {
  const diff = e.changedTouches[0].clientX - startX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? navigatePreviousDay() : navigateNextDay();
  }
});
```

### Touch Targets

All interactive elements: minimum 44×44px
- Input fields: Full row height
- Buttons: Adequate padding
- Navigation arrows: Large tap area

---

## Real-Time Updates

### Total Calculations

**Trigger:** Any input change

**Updates:**
1. Row total (if applicable)
2. Daily total sales
3. Daily total calculated
4. Daily total actual
5. Variance total

**Animation:**
- Smooth number transition (150ms)
- No layout shift

### Contributor Count

Updates dynamically as rows are filled:
- Empty row: Not counted
- Any value entered: Counted
- Display: "3 contributors"

---

## Unsaved Changes Handling

### Detecting Changes
```javascript
const isDirty = JSON.stringify(currentData) !== JSON.stringify(savedData);
```

### Navigation Intercept
```javascript
window.addEventListener('beforeunload', (e) => {
  if (isDirty) {
    e.preventDefault();
    e.returnValue = '';
  }
});
```

### In-App Navigation
1. Intercept navigation click
2. Show unsaved changes modal
3. Options: Discard, Cancel, Save & Continue

---

## Animation Specifications

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Date transition | opacity, transform | 200ms | ease-out |
| Input focus | border, shadow | 150ms | ease-out |
| Calculation update | opacity | 150ms | ease-out |
| Total update | transform | 150ms | ease-out |
| Row add/remove | height, opacity | 200ms | ease-out |
| Toast appear | transform, opacity | 200ms | ease-out |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial interactions documentation |
