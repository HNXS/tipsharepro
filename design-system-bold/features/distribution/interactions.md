# PPE Distribution - Interactions

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document details all user interactions within the PPE Distribution feature, including viewing, navigation, and export behaviors.

---

## !!Note Critical Acknowledgment

### Trigger
First access to full distribution view in session (or after 24 hours)

### Flow
1. Page loads with distribution data
2. Before displaying admin view, !!Note modal appears
3. User reads confidentiality notice
4. User must check acknowledgment checkbox
5. Continue button becomes enabled
6. User clicks Continue
7. Modal closes, full view displayed
8. Acknowledgment stored in session/localStorage

### Blocking Behavior
- Modal cannot be dismissed without acknowledgment
- No X close button (or disabled)
- Clicking outside modal does not close it
- Escape key disabled for this modal

### Code Behavior
```javascript
function showWageConfidentialityNotice() {
  return new Promise((resolve) => {
    const modal = createCriticalModal({
      title: 'Wage Confidentiality Notice',
      content: wageNoticeContent,
      requireCheckbox: true,
      checkboxLabel: 'I understand that wage information is confidential...',
      buttonLabel: 'Continue',
      onAcknowledge: () => {
        localStorage.setItem('wage_notice_acknowledged', Date.now());
        resolve(true);
      }
    });
    modal.show();
  });
}
```

---

## View Toggle

### Admin View / Employee View Toggle

**Location:** Header, next to period selector

**Interaction:**
1. Toggle switch or radio buttons
2. Click to switch views
3. View changes immediately
4. Table columns update
5. No data refetch needed

**Behavior:**
```javascript
function toggleView(viewType) {
  if (viewType === 'admin' && !hasAcknowledgedWageNotice()) {
    showWageConfidentialityNotice().then(() => {
      setView('admin');
    });
  } else {
    setView(viewType);
  }
}
```

**Column Visibility:**
| Column | Admin View | Employee View |
|--------|------------|---------------|
| Employee | ✓ | ✓ |
| Category | ✓ | ✓ |
| Hours | ✓ | ✓ |
| Rate | ✓ | ✗ |
| Share % | ✓ | ✓ |
| Amount | ✓ | ✓ |
| Received | ✓ | ✓ |

---

## Period Selector

### Open Dropdown

**Trigger:** Click on period selector

**Behavior:**
1. Dropdown expands downward
2. Current period highlighted
3. Historical periods listed chronologically
4. Keyboard focus moves to list

### Select Period

**Trigger:** Click on period option

**Behavior:**
1. Dropdown closes
2. Loading state shown
3. Fetch distribution for selected period
4. Update summary cards
5. Update table data
6. Update period display

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter/Space` | Open dropdown / select option |
| `Arrow Down` | Next period |
| `Arrow Up` | Previous period |
| `Escape` | Close dropdown |
| `Home` | First (most recent) period |
| `End` | Last (oldest) period |

---

## Table Interactions

### Row Hover

**Trigger:** Mouse over table row

**Behavior:**
- Background changes to light orange (#FFF7ED)
- Left border highlight (3px primary)
- Subtle transition (150ms)

### Row Click (Future Enhancement)

**Potential Behavior:**
- Expand row to show detailed breakdown
- Navigate to employee profile
- Show contribution history

### Column Sorting

**Trigger:** Click sortable column header

**Behavior:**
1. First click: Sort ascending
2. Second click: Sort descending
3. Third click: Reset to default order
4. Sort indicator updates (↑/↓)
5. Table re-renders with sorted data

**Sortable Columns:**
- Employee (alphabetical)
- Hours (numeric)
- Share % (numeric)
- Received (numeric)

### Table Scroll (Mobile)

**Trigger:** Swipe horizontally on table

**Behavior:**
- Smooth horizontal scroll
- First column (Employee) may be sticky
- Scroll indicator if content overflows

---

## Export Interactions

### Export Button Menu

**Trigger:** Click Export button

**Behavior:**
1. Dropdown menu appears
2. Options displayed:
   - PDF (Full) - includes wage data
   - PDF (Employee) - excludes wage data
   - Print - excludes wage data
   - CSV - includes wage data

### Export PDF

**Trigger:** Select PDF option

**Flow:**
1. Validate wage acknowledgment (if Full)
2. Show "Generating..." state
3. Generate PDF on server/client
4. Trigger download
5. Show success toast
6. Return button to default state

**Loading State:**
```html
<button class="btn btn-primary" disabled>
  <span class="spinner-sm"></span>
  Generating...
</button>
```

### Print

**Trigger:** Select Print option

**Flow:**
1. Apply print styles
2. Hide wage data column
3. Open browser print dialog
4. User selects printer/options
5. Print or cancel

**Print Styles Applied:**
```css
@media print {
  .hide-on-print { display: none; }
  .page-header-actions { display: none; }
  .summary-cards { page-break-after: avoid; }
  .distribution-table { page-break-inside: avoid; }
}
```

---

## Summary Card Interactions

### Card Hover

**Trigger:** Mouse over summary card

**Behavior:**
- Border color changes to primary
- Subtle elevation increase
- Cursor remains default (not interactive)

### Stat Change Animation

**Trigger:** Period change causes stat update

**Behavior:**
- Number animates from old to new value
- Duration: 300ms
- Easing: ease-out

```javascript
function animateNumber(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const current = start + (end - start) * easeOut(progress);
    element.textContent = formatCurrency(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
```

---

## Navigation Interactions

### Back Button

**Trigger:** Click back arrow

**Behavior:**
1. Navigate to Navigation Hub
2. No unsaved changes to warn about (view-only page)

### Period Navigation (if arrow buttons)

**Previous Period:**
1. Check if previous period exists
2. If yes: Load previous period
3. If no: Disable button

**Next Period:**
1. Check if next period exists
2. If yes: Load next period
3. If current: Disable button

---

## Error Handling Interactions

### Retry on Error

**Trigger:** Click Retry button on error state

**Behavior:**
1. Clear error state
2. Show loading state
3. Attempt to fetch data again
4. Success: Display data
5. Failure: Show error again with option

### Export Error Recovery

**Trigger:** Export fails

**Behavior:**
1. Show error toast with message
2. Return button to default state
3. Allow user to retry
4. If repeated failures: Show contact support message

---

## Accessibility Interactions

### Screen Reader Announcements

| Action | Announcement |
|--------|--------------|
| Page load | "PPE Distribution for January 1 through 15, 2026" |
| View toggle | "Switched to Employee view, wage data hidden" |
| Period change | "Now showing distribution for [period]" |
| Sort column | "Table sorted by [column], ascending" |
| Export start | "Generating PDF, please wait" |
| Export complete | "PDF downloaded successfully" |

### Keyboard Navigation

| Element | Key | Action |
|---------|-----|--------|
| View toggle | `Space` | Toggle view |
| Period selector | `Enter` | Open/close |
| Table header | `Enter` | Sort by column |
| Export menu | `Enter` | Open menu |
| Export option | `Enter` | Start export |

---

## Animation Specifications

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Row hover | background | 150ms | ease-out |
| View toggle | opacity | 200ms | ease-out |
| Period change | opacity | 150ms | ease-out |
| Number animation | content | 300ms | ease-out |
| Export button | opacity | 150ms | ease-out |
| Dropdown open | height, opacity | 200ms | ease-out |
| Toast appear | transform, opacity | 200ms | ease-out |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial interactions documentation |
