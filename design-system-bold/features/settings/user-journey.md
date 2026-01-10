# Settings - User Journey

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document maps the user journey through the Settings feature, including entry points, task flows, and exit points.

---

## Entry Points

### Primary Entry
1. User logs in → Navigation Hub
2. Clicks "Settings" card in Administration section
3. Arrives at Settings page, Location tab active

### Secondary Entry
- Direct URL: `/settings`
- Deep link to specific tab: `/settings?tab=weights`
- From other pages via breadcrumb/back navigation

---

## User Personas

### Admin (Primary User)
- **Goal:** Configure all system settings
- **Frequency:** Initial setup + occasional updates
- **Context:** Office environment, desktop

### Manager (Secondary User)
- **Goal:** Adjust operational settings
- **Frequency:** Monthly/quarterly
- **Context:** Office or floor, desktop/tablet

---

## Core User Journeys

### Journey 1: Initial Setup

**Scenario:** New account, first-time configuration

```
1. LOGIN
   └── New user logs in for first time

2. NAVIGATION HUB
   └── System prompts: "Complete your setup"
   └── Settings card highlighted

3. SETTINGS - LOCATION TAB
   ├── Enter establishment name
   ├── Enter address
   ├── Toggle multi-location (if applicable)
   └── Click "Save & Continue"

4. SETTINGS - PAY PERIOD TAB
   ├── Select period type (Weekly/Bi-weekly/Semi-monthly)
   ├── Set period start date
   ├── Review preview of next periods
   └── Click "Save & Continue"

5. SETTINGS - CONTRIBUTION TAB
   ├── Select contribution method
   │   └── ?Note explains each option
   ├── Set contribution rate
   │   └── ?Note shows industry ranges
   └── Click "Save & Continue"

6. SETTINGS - JOB CATEGORIES TAB
   ├── Enable/disable default categories
   ├── Add custom categories (up to 5)
   ├── Assign role types (FOH/BOH/Bar/Support)
   └── Click "Save & Continue"

7. SETTINGS - WEIGHTS TAB
   ├── Review default weights
   ├── Adjust weights per category (1.00-5.00)
   │   └── ?Note explains weight impact
   └── Click "Save & Continue"

8. SETTINGS - USERS TAB (Admin only)
   ├── Review admin account
   ├── Invite additional users (optional)
   └── Click "Complete Setup"

9. SUCCESS
   └── Toast: "Setup complete! Ready to enter data."
   └── Redirect to Navigation Hub
```

### Journey 2: Adjust Contribution Rate

**Scenario:** Manager needs to change tip pool percentage

```
1. NAVIGATION HUB
   └── Click "Settings"

2. SETTINGS - LOCATION TAB (default)
   └── Click "Contribution" tab

3. SETTINGS - CONTRIBUTION TAB
   ├── Current rate displayed
   ├── Click rate dropdown
   ├── Select new rate
   │   └── ?Note shows calculation preview
   ├── !!Note: "Changes affect future periods only"
   │   └── Must acknowledge checkbox
   └── Click "Save Changes"

4. SUCCESS
   └── Toast: "Contribution rate updated"
   └── Stay on page or navigate away
```

### Journey 3: Add Custom Job Category

**Scenario:** Restaurant adds new role not in defaults

```
1. SETTINGS - JOB CATEGORIES TAB
   └── Scroll to "Custom Categories" section

2. ADD CATEGORY
   ├── Enter category name in empty field
   ├── Select role type from dropdown
   ├── System auto-saves or shows "Add" button
   └── Category appears in list

3. SET WEIGHT
   └── Navigate to Weights tab
   └── New category appears with default weight
   └── Adjust weight as needed
   └── Save changes

4. DONE
   └── Category available for employee assignment
```

### Journey 4: Manage Users (Admin)

**Scenario:** Admin needs to add a new manager

```
1. SETTINGS - USERS TAB
   └── Click "Add User" button

2. ADD USER MODAL
   ├── Enter name
   ├── Enter email
   ├── Select role (Manager)
   ├── Set location access (if multi-location)
   └── Click "Send Invite"

3. CONFIRMATION
   └── Toast: "Invitation sent to [email]"
   └── User appears in list as "Pending"

4. USER ACCEPTS
   └── Status changes to "Active"
   └── User can now access assigned features
```

---

## Decision Points

### Contribution Method Selection

```
User needs to choose method
├── CC Sales → Simple, credit card only
├── CC Tips → Reported tips from CC
├── All Tips → CC + Cash tips
└── All Sales → RECOMMENDED - Most comprehensive
```

### Weight Adjustment

```
Should weight be changed?
├── Higher traffic role → Consider increasing
├── More responsibility → Consider increasing
├── Training/entry role → Consider decreasing
└── Unsure → Keep default, monitor distribution
```

---

## Error Scenarios

### Validation Errors
- Empty required fields → Inline error, prevent save
- Invalid date format → Inline error with correct format
- Weight out of range → Prevent invalid input

### Conflict Errors
- Duplicate category name → Error message, suggest rename
- Deactivate category with active employees → Warning, require reassignment

### System Errors
- Save failure → Toast error, retain form data
- Session timeout → Prompt re-login, preserve changes

---

## Exit Points

### Successful Exits
- Save and stay on page
- Save and return to Navigation Hub
- Complete setup flow

### Cancel/Abandon Exits
- Navigate away without saving → Unsaved changes warning
- Browser back → Unsaved changes warning
- Session timeout → Auto-save draft (if supported)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Setup completion rate | > 90% |
| Average setup time | < 10 minutes |
| Settings change errors | < 5% |
| User-reported confusion | < 2% |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial user journey documentation |
