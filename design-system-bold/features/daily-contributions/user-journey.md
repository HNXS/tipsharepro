# Daily Contributions - User Journey

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document maps the user journey through the Daily Contributions feature, including entry points, task flows, and common scenarios.

---

## Entry Points

### Primary Entry
1. User logs in → Navigation Hub
2. Clicks "Daily Contributions" card in Data Entry section
3. Arrives at Daily Contributions page for current date

### Secondary Entries
- Direct URL: `/daily` (current date)
- Deep link: `/daily?date=2026-01-10` (specific date)
- From PPE Contributions page (drill-down)

---

## User Personas

### Designee (Primary User)
- **Goal:** Enter daily tip data for all servers
- **Frequency:** Daily, end of shift
- **Context:** Back office, tablet or desktop
- **Time constraint:** Quick entry, shift ending

### Manager (Secondary User)
- **Goal:** Review and correct entries
- **Frequency:** As needed
- **Context:** Office, desktop

---

## Core User Journeys

### Journey 1: Standard Daily Entry

**Scenario:** Designee enters tips at end of night shift

```
1. LOGIN
   └── Designee logs in after closing

2. NAVIGATION HUB
   └── Clicks "Daily Contributions"

3. DAILY CONTRIBUTIONS PAGE
   ├── System shows current date (today)
   ├── All contributing employees listed
   └── Sales/contribution fields ready for input

4. DATA ENTRY
   ├── FOR EACH SERVER:
   │   ├── Enter total sales amount
   │   │   └── System auto-calculates contribution
   │   ├── Review calculated contribution
   │   └── Adjust "Actual Contribution" if needed
   │       └── ?Note explains when to adjust
   └── Repeat for all servers

5. REVIEW
   ├── Check daily totals at bottom
   ├── Verify contributor count
   └── Scan for any variance indicators

6. SAVE
   ├── Click "Save & Continue"
   ├── System validates entries
   ├── Success toast appears
   └── Option to continue to next page or exit

7. EXIT
   └── Navigate to Hub or log out
```

### Journey 2: Copy Previous Day

**Scenario:** Similar staffing to yesterday, quick start

```
1. DAILY CONTRIBUTIONS PAGE
   └── Today's date, empty entries

2. COPY ACTION
   ├── Click "Copy Previous Day"
   ├── Confirmation modal appears
   │   └── "Copy sales data from January 9?"
   └── Confirm copy

3. DATA POPULATED
   ├── All sales figures copied from yesterday
   ├── Contributions auto-calculated
   └── Toast: "Data copied from January 9"

4. ADJUST AS NEEDED
   ├── Update any changed sales figures
   ├── Add/remove employees if different
   └── Modify actual contributions

5. SAVE
   └── Save & Continue
```

### Journey 3: Navigate Between Days

**Scenario:** Manager reviewing multiple days' entries

```
1. DAILY CONTRIBUTIONS PAGE
   └── Current date displayed

2. NAVIGATE TO PAST DATE
   ├── Click left arrow (previous day)
   ├── Page updates to previous day
   └── Previous day's data displayed

3. REVIEW/EDIT
   ├── Review entries
   ├── Make corrections if needed
   └── Save changes

4. CONTINUE NAVIGATION
   ├── Click right arrow (next day)
   ├── Or use date picker for specific date
   └── Navigate through pay period

5. BOUNDARY HANDLING
   ├── At period start: Left arrow disabled
   ├── At today: Right arrow shows "future" warning
   └── Outside period: Modal warning
```

### Journey 4: Override Calculated Contribution

**Scenario:** Server's actual tips differ from calculated amount

```
1. ENTER SALES
   ├── Enter sales: $2,500
   ├── Rate: 3%
   └── Calculated: $75.00

2. ACTUAL DIFFERS
   ├── Server reports actual tips: $82.00
   └── Need to record actual amount

3. OVERRIDE ENTRY
   ├── Click "Actual Contribution" field (green)
   ├── Change from $75.00 to $82.00
   ├── System shows variance indicator (+$7.00)
   └── ?Note explains variance is OK

4. SAVE
   └── Both calculated and actual stored
   └── Actual used for distribution
```

---

## Decision Points

### Copy Previous Day Decision

```
Should I copy previous day?
├── YES if:
│   ├── Similar staffing
│   ├── Sales patterns consistent
│   └── Want faster data entry
└── NO if:
    ├── Different servers worked
    ├── Significantly different sales
    └── Special event day
```

### Override Contribution Decision

```
Should I override calculated contribution?
├── YES if:
│   ├── Actual tips differ from calculation
│   ├── Cash tips to add
│   └── Comp adjustments needed
└── NO if:
    ├── Calculated amount is accurate
    └── Using pure sales-based method
```

---

## Error Scenarios

### Validation Errors
- Empty required fields → "Enter sales amount for [Employee]"
- Negative values → "Amount must be positive"
- Unrealistic amounts → Warning (not error): "Verify: Amount seems high"

### Navigation Errors
- Future date selected → "Cannot enter data for future dates"
- Outside pay period → "This date is outside the current pay period"

### Save Errors
- Network failure → "Unable to save. Check connection and try again."
- Concurrent edit → "Data was updated by another user. Refresh to see changes."

---

## Exit Points

### Successful Exits
- Save & Continue → Goes to next logical step
- Save & Return to Hub → Navigates to Navigation Hub
- Save & Stay → Stays on page for more edits

### Abandon Exits
- Navigate away without saving → Unsaved changes warning
- Session timeout → Auto-save draft (if enabled)

---

## Efficiency Features

### Quick Entry Mode
- Tab through fields in logical order
- Enter key moves to next row
- Numeric keypad optimized

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Tab` | Next field |
| `Enter` | Next row / Save |
| `Ctrl+S` | Save |
| `Ctrl+Left` | Previous day |
| `Ctrl+Right` | Next day |

### Auto-Features
- Auto-calculate on sales entry
- Auto-save draft every 30 seconds
- Auto-focus on first empty field

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to complete daily entry | < 5 minutes |
| Data entry errors | < 2% |
| Copy feature usage | > 50% of entries |
| Override usage | < 15% of entries |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial user journey documentation |
