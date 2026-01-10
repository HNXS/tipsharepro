# PPE Distribution - User Journey

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This document maps the user journey through the PPE Distribution feature, including entry points, viewing flows, and export scenarios.

---

## Entry Points

### Primary Entry
1. User logs in → Navigation Hub
2. Clicks "PPE Distribution" card in Reports section
3. Arrives at Distribution page showing most recent completed period

### Secondary Entries
- Direct URL: `/distribution` (current period)
- Deep link: `/distribution?period=2026-01-15` (specific period)
- From PPE Contributions page (after period is complete)
- From YTD Data page (drill-down to specific period)

---

## User Personas

### Admin (Primary User)
- **Goal:** Review and verify distribution before payroll
- **Frequency:** Each pay period
- **Context:** Office, desktop
- **Needs:** Full data access, export capability

### Manager (Power User)
- **Goal:** Review team distributions, handle questions
- **Frequency:** Each pay period + ad-hoc
- **Context:** Office or floor
- **Needs:** Full view, print reports

### Employee (End User)
- **Goal:** See their tip share
- **Frequency:** Each pay period
- **Context:** Mobile or shared kiosk
- **Needs:** Simple view, their share only

---

## Core User Journeys

### Journey 1: Review Current Distribution

**Scenario:** Admin reviews distribution before payroll processing

```
1. LOGIN
   └── Admin logs in after contributions are complete

2. NAVIGATION HUB
   └── Clicks "PPE Distribution"

3. DISTRIBUTION PAGE
   ├── Current period shown (Jan 1-15, 2026)
   ├── Summary cards display:
   │   ├── Total Pool: $2,847.50
   │   ├── Recipients: 12
   │   └── Avg Share: $237.29
   └── Distribution table loads

4. !!NOTE ACKNOWLEDGMENT (First view)
   ├── Wage confidentiality modal appears
   ├── Admin reads notice
   ├── Checks acknowledgment box
   └── Clicks "Continue"

5. REVIEW DISTRIBUTION
   ├── Scan employee list
   ├── Verify amounts look reasonable
   ├── Check any flagged items
   └── Compare to previous period (optional)

6. EXPORT FOR PAYROLL
   ├── Click "Export PDF"
   ├── Select options (with/without wages)
   ├── Download PDF
   └── Forward to payroll processor

7. DONE
   └── Distribution reviewed and exported
```

### Journey 2: Answer Employee Question

**Scenario:** Employee asks why their share seems low

```
1. DISTRIBUTION PAGE
   └── Manager opens distribution

2. FIND EMPLOYEE
   ├── Scroll to find employee
   ├── Or use search/filter (if available)
   └── Locate "Sarah Kim"

3. REVIEW DETAILS
   ├── Hours: 28.5 (less than usual)
   ├── Category: Server
   ├── Share %: 8.2%
   └── Received: $234

4. COMPARE
   ├── Look at others in same category
   ├── Note: Other servers have 35-40 hours
   └── Hours explain lower share

5. EXPLAIN
   └── "Your share is proportional to hours worked.
        You worked 28.5 hours vs. others at 35+."
```

### Journey 3: Export Employee-Safe Report

**Scenario:** Print distribution for posting without wage data

```
1. DISTRIBUTION PAGE
   └── Full admin view displayed

2. SWITCH VIEW
   ├── Click "Employee View" toggle
   ├── View changes to hide wage column
   └── Verify no sensitive data shown

3. PRINT/EXPORT
   ├── Click "Print"
   ├── Browser print dialog opens
   ├── Select printer
   └── Print report

4. POST
   └── Post printed report in break room
```

### Journey 4: View Historical Period

**Scenario:** Need to reference distribution from 3 periods ago

```
1. DISTRIBUTION PAGE
   └── Current period shown

2. SELECT PERIOD
   ├── Click period selector dropdown
   ├── See list of past periods
   ├── Select "Dec 1-15, 2025"
   └── Page updates with historical data

3. REVIEW
   ├── Historical data displays
   ├── "Historical" badge shown
   └── Data is read-only

4. EXPORT IF NEEDED
   └── Can still export historical data
```

---

## Decision Points

### View Selection Decision

```
Which view do I need?
├── ADMIN VIEW if:
│   ├── Need to verify calculations
│   ├── Preparing for payroll
│   └── Investigating discrepancy
└── EMPLOYEE VIEW if:
    ├── Showing to employees
    ├── Printing for posting
    └── Compliance with wage privacy
```

### Export Format Decision

```
How should I export?
├── PDF with Wages:
│   └── For payroll, internal records
├── PDF without Wages:
│   └── For employees, posting
├── Print:
│   └── For physical posting
└── CSV (if available):
    └── For payroll system import
```

---

## Error Scenarios

### No Data Available
- Period not yet complete → "Distribution will be available after period closes"
- No contributions entered → "No contribution data for this period"

### Access Denied
- Viewer accessing admin view → Automatically shows employee view
- Unauthorized period → "You don't have access to this period"

### Export Errors
- PDF generation fails → "Unable to generate PDF. Please try again."
- Printer unavailable → Standard browser print error

---

## Exit Points

### Successful Exits
- Export complete → Stay on page or return to hub
- Review complete → Navigate to hub or next task
- Print complete → Page remains for additional actions

### Navigation Exits
- Back to Navigation Hub
- To PPE Contributions (edit data)
- To YTD Data (broader context)

---

## Compliance Touchpoints

### !!Note Trigger Points
1. **First access** to full distribution view in session
2. **Before export** with wage data
3. **After 24 hours** since last acknowledgment

### Privacy Considerations
- Wage data never shown to non-admin/manager roles
- Print view automatically excludes wages
- Employee view excludes individual rate data

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to review distribution | < 5 minutes |
| Export success rate | > 99% |
| User questions about calculations | < 10% of periods |
| !!Note acknowledgment compliance | 100% |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial user journey documentation |
