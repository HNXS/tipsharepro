# Tip Share Pro - Product Requirements Document

**Document Version:** 4.3
**Date:** January 15, 2026
**Author:** Product Management
**Client:** Tom LaChaussee (tlachaussee)
**Developer:** Tim Heineccius (Heineccius Consulting)
**Last Updated:** January 15, 2026 - **DISTRIBUTION TABLE SPECS:** Complete Demo Distribution Page and Full Version Page 7 PP Distribution specifications. Table columns, stat cards, employee entry workflow, print options, and calculation formulas documented.

---

## Executive Summary

### Elevator Pitch
Tip Share Pro is a fair tip distribution calculator that helps restaurants split pooled tips based on each employee's hours, pay rate, and job impact - making everyone's share transparent and compliant.

### Problem Statement
Restaurant tip pooling is broken. Existing methods either treat all employees equally regardless of contribution (unfair to high performers), exclude kitchen staff entirely (illegal in many states), or expose servers to unnecessary tax burden because contributions aren't properly tracked. Restaurant managers lack the tools to create fair, transparent, legally defensible tip distributions that satisfy both the Department of Labor and the IRS.

### Target Audience

| Segment | Description | Pain Points |
|---------|-------------|-------------|
| **Primary: Restaurant Owners** | Multi-location and single-location operators | Need compliance, fairness, retention tool, operational efficiency |
| **Secondary: Restaurant Managers** | Day-to-day operations, scheduling, payroll | Need simple data entry, clear reports, staff transparency |
| **Tertiary: Restaurant Staff** | Servers, cooks, bussers, hosts | Want fair compensation, visibility into tip distribution, tax documentation |

**Demographics:**
- Restaurant industry professionals
- Single-location operators to multi-unit chains (1-20+ locations)
- Tech-savvy younger workforce (servers, line cooks)
- Non-tech-savvy older owners/managers
- US-based (California regulations focus initially)

### Unique Selling Proposition
Tip Share Pro uses a proprietary **Hours x Rate x Variable Weight** algorithm that ensures distributions are fair, legal, and tax-efficient - while keeping the calculation hidden so competitors can't replicate it. Unlike basic tip pooling that treats everyone equally, this system rewards experience, hours worked, and job category impact on customer satisfaction.

**Key Differentiators:**
1. **Sales-based contributions** (same method IRS uses) - not percentage of tips
2. **Hidden algorithm** (the "Basis" calculation is never shown to users)
3. **Tax benefit tracking** - servers get credit for contributions, reducing taxable income
4. **Multi-tenant SaaS** - each restaurant is isolated, but owners can view all locations
5. **Scenario Sandbox** - test changes without affecting live data

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Customer Acquisition** | 50 paid locations in Year 1 | Stripe subscription count |
| **Retention Rate** | >90% monthly retention | Churn analysis |
| **User Activation** | 80% of trials complete first pay period | Usage tracking |
| **Time to Value** | <30 minutes from signup to first calculation | Onboarding funnel |
| **NPS Score** | >40 | Quarterly surveys |
| **Support Tickets** | <2 per customer per month | Helpdesk metrics |

---

## Problem Analysis

### What Specific Problem Does This Solve?

**For Restaurant Owners:**
- Compliance risk with Department of Labor regulations
- Inability to defend tip pooling decisions if challenged
- Staff retention issues (especially kitchen staff) due to compensation disparity
- No visibility into what's happening across multiple locations

**For Managers:**
- Time-consuming manual calculations with Excel
- Errors in tip distribution leading to staff disputes
- No audit trail for who entered/changed data
- Difficulty explaining distribution logic to staff

**For Staff:**
- Unfair distribution methods that reward mediocrity
- No transparency in how their share is calculated
- Servers taxed on money they give away (no contribution tracking)
- Kitchen staff excluded from tips despite contributing to service

### Why Is This the Right Solution?

**Validated by Experience:**
- Tom LaChaussee used this system for 12 years across multiple restaurant locations
- The Excel-based version worked but wasn't scalable or sellable
- Government compliance requirements (DOL, IRS) are increasingly strict

**Market Gap:**
- Existing solutions are either too simple (equal split) or too complex (enterprise software)
- No SaaS product specifically addresses the Hours x Rate x Weight algorithm
- Competition doesn't hide the calculation logic

**Alternatives Considered:**

| Alternative | Why Rejected |
|-------------|--------------|
| Enhanced Excel | Not scalable, formulas exposed, no multi-user support |
| Enterprise payroll add-on | Too expensive, overkill for single locations |
| Equal-split apps | Don't address fairness or compliance needs |
| Custom development per client | Not scalable as a business |

---

## Feature Specifications

### Feature Overview Map

```
DEMO (Phase 1) - REVISED      FREE TRIAL (Phase 2)        FULL VERSION (Phase 3)
--------------------------    --------------------        ---------------------
STANDALONE Application        All Demo Features +         All Free Trial Features +
Login via TipSharePro link    Real Authentication         Payment Processing
Settings Page (5 steps)       2FA Security                Multi-Location Support
10 Pre-Set Employees          Cloud Storage               YTD Archiving
Inline Distribution Preview   Full Calculations           W2 Reporting
Print Distribution Table      45-Day Trial                Admin Command Center
NO SSB Upload                 Scenario Sand Box           Expert Portal
Easily Email-Distributable
Faded Full Version Controls
```

**IMPORTANT CHANGE (January 15, 2026):** Demo is now a STANDALONE marketing tool that does NOT upload to Scenario Sand Box. Goal: "Wet their whistle" - if they want more, sign up for free trial (it's free). Keep Demo as uncomplicated as possible.

---

### Application Page Flow (9 Pages)

Based on Tom's flow chart, the full application consists of 9 pages:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FULL APPLICATION FLOW                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PAGE 1: Login                    PAGE 2: Navigation Hub               │
│  ┌─────────────────┐              ┌─────────────────────┐              │
│  │ TipSharePro     │              │ Where to Next?      │              │
│  │ Logo            │              │ - All Page Links    │              │
│  │                 │      →       │ - By Log In         │              │
│  │ Log In:         │              │   Permissions       │              │
│  │ Password:       │              │ - Data & Archived   │              │
│  └─────────────────┘              └─────────────────────┘              │
│           │                                │                           │
│           ▼                                ▼                           │
│  PAGE 3: Settings                 PAGE 4: Scenario Sand Box            │
│  ┌─────────────────┐              ┌─────────────────────┐              │
│  │ Admin Only or   │              │ New Scenario        │              │
│  │ Designee w/     │              │ Sand Box            │              │
│  │ Permission      │              │ Admin Only or       │              │
│  └─────────────────┘              │ Designee w/Perm     │              │
│                                   └─────────────────────┘              │
│           │                                                            │
│           ▼                                                            │
│  PAGE 5: Daily Contributions      PAGE 6: PPE Contributions Log        │
│  ┌─────────────────┐              ┌─────────────────────┐              │
│  │ Daily           │              │ PPE                 │              │
│  │ Contributions   │      →       │ Contributions Log   │              │
│  │ Log             │              │ Some Auto Fill      │              │
│  │ Some Auto Fill  │              │ Some Data Entry     │              │
│  │ Data Entry      │              │ All Permissions     │              │
│  │ All Permissions │              └─────────────────────┘              │
│  └─────────────────┘                       │                           │
│                                            ▼                           │
│  PAGE 7: PPE Distribution         PAGE 8: YTD Data                     │
│  ┌─────────────────┐              ┌─────────────────────┐              │
│  │ PPE             │              │ YTD Data            │              │
│  │ Distribution    │      →       │ Contributions &     │              │
│  │ Log             │              │ Distributions       │              │
│  │ Some Auto Fill  │              │ All Auto Fill       │              │
│  │ Data Entry      │              │ All Permissions     │              │
│  │ All Permissions │              │ Print For Payroll & │              │
│  └─────────────────┘              │ Auto Archive at EOY │              │
│                                   └─────────────────────┘              │
│                                            │                           │
│                                            ▼                           │
│                          PAGE 9: All Allocations                       │
│                          ┌─────────────────────┐                       │
│                          │ All Allocations     │                       │
│                          │ Contributors and    │                       │
│                          │ Recipients          │                       │
│                          │ Some Auto Fill      │                       │
│                          │ Some Data Entry     │                       │
│                          │ All Permissions     │                       │
│                          │ PDF Library         │                       │
│                          └─────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────────┘
```

**Demo Application Flow (Simplified):**
```
Page 1: Login (supplied by TipSharePro)
    ↓
Page 2: Settings (limited version of Page 3)
    ↓
Page 3: Distribution Table (scaled back version)
```

### Demo Settings Page - Detailed Specification (REVISED January 15, 2026)

**⚠️ MAJOR CHANGE:** Demo is now a STANDALONE marketing tool. No SSB upload. Goal is simplicity - "wet their whistle."

**New Demo Concept:**
- Standalone application distributed via email link
- Could potentially reside on Replit (lightweight hosting)
- Does NOT need to reside in the full app codebase
- Programming can be reused to reduce production time

**Access Method:**
- User clicks link in email from TipSharePro
- Enters login/password issued by TipSharePro
- Goes directly to Settings Page

**Welcome Display:** "Welcome Admin (Name of Contact & Company)"

**Settings Steps (Same as before, but with INLINE preview):**

| Step | Tab/Feature | Description | ?NOTE Help Text |
|------|-------------|-------------|-----------------|
| **Step 1** | Method for Contribution % | Check box for: CC Sales, CC Tips, All Tips, or All Sales | "TipSharePro recommends a percentage of sales. The taxing authorities require 8% of sales be reported for tip income as a true up (allocations) at the end of the year." |
| **Step 2** | Estimate Monthly $ Amount | Open entry box (whole dollars) | "Use whichever criteria you used above. Any relatively close estimate will suffice." |
| **Step 3** | Enter Contribution % | Dropdown selection | Dropdown varies by Step 1 choice - see below |
| **Step 4** | Enter Job Categories | Checkbox selection from predefined list + 5 write-ins | "Check the job categories you intend to use. Keep it simple and use as few positions as possible at first." |
| **Step 5** | Job Category Weights | Dropdown 1-5 in 0.25 increments per category | "1 is the lowest category in the pool. 5 is the highest. Don't get bogged down the first time." |

**Step 3 Contribution % Logic:**
- If CC Sales, CC Tips, or All Tips selected in Step 1: Dropdown of 5-25% in 0.5 increments of **Tips Only**
- If All Sales selected in Step 1: Dropdown of 1-5% in 0.25 increments of **(adj) Sales**

**NEW: Inline Distribution Preview:**
- 10 Pre-Set sample employees built into Demo
- Wages and Hours are fully editable by user
- Job roles come from Settings (only selected roles appear as choices)
- **After changing ANY setting, user scrolls down to see effect on scaled-down Distribution Table**
- Real-time calculation preview as settings change

**Navigation & Controls:**
- Faded-out control buttons of Full Version visible (as a TEASE)
- Creates "Pilot's Cockpit" desire for Full Version
- Tab – Go To Distribution Table (scrolls to inline preview)
- Tab – Log Out
- Links to PDF's used on this page
- Print button: Prints Demo Distribution Table ONLY (just the table)

**REMOVED (No longer in Demo):**
- ~~"Upload Demo to Scenario Sand Box" button~~ - REMOVED
- ~~SSB integration~~ - REMOVED
- Demo is 100% standalone

**Demo Dialog Box:**
- "You can set hours to zero on any employee you want to eliminate from the pool if it holds too many recipients."
- Purpose: Explain how to reduce the 10 pre-set employees if desired

---

### Demo Distribution Table - Detailed Specification (January 14, 2026)

After scrolling down from Demo Settings, the user sees the **Distribution Table** with colorful preset employees.

#### Stat Cards (Above Table)

All stat cards auto-fill for Demo. Some from Settings choices, some display "Demo":

| Stat Card | Demo Value | Full Version |
|-----------|------------|--------------|
| **Day/Date** | "Demo" (static) | Auto-fill current date |
| **Location** | "Demo" (static) | Selectable by Admin |
| **Pay Period** | "Demo" (static) | Clickable to view 2 prior archived PPs |
| **Contrib. Method** | From Demo Settings | Sales, CC Sales, CC Tips, All Tips |
| **Gross Pool** | From Demo Settings | From PP Contribution page |
| **Pre-Paid** | "Demo" with ?Note | Alters Net Pool if entered |
| **Net Pool** | Same as Gross | Gross − Pre-Paid |
| **Top Contributors** | Static: "Barb B (aka: Malibu), Ken Dahl" | Real-time from PP Contributions |

**Pre-Paid ?Note:** "Early termination payment" - Link to PDF "What Does Pre-Paid Mean..."

#### Welcome Dialog Box

A large dialog box explains what the user sees. Can be dismissed and brought back up.

**??Note Content:**
> "The table displayed assumes your distribution employee's data is up to date and all that is needed is the hours entered. This is a good representation of the finalizing of Distributions. All updating of any employee data (new employee, wage increase, category change etc) can be accomplished before PPE so as not to hold up Pay Day.
>
> Enter Hours, Double Check for Errors, Print for posting and Email to Payroll.
>
> At this point just enter hours and see how your settings affected the pool. You can change wages, hours and if you click on the name cell, change category weights by .25 increments up to .75. Whole number Category weights are changeable in the Demo settings above. Return to the original Distribution table settings by pressing the 'default settings' button."

#### Distribution Table Columns

| Column | Data Type | Editable | Print | Notes |
|--------|-----------|----------|-------|-------|
| **Name** | Text | Static (preset) | Yes | Cell background = Category Color |
| **Wages** | Decimal (20.0, 20.25) | Yes | **HIDDEN** | Confidential |
| **Hours** | Decimal (64.0, 64.25) | Yes | Yes | |
| **Category Weight** | Whole number 1-5 | Via Settings | Yes | Cell shows category color |
| **Share %** | Auto-calculated | No | Yes | Real-time when Hours + Wages entered |
| **Share $** | Auto-calculated | No | Yes | Real-time, rounded to nearest $ |
| **$/Hr** | Auto-calculated | No | **HIDDEN** (optional) | Pool Share ÷ Hours |

#### Column Totals (Real-time at bottom)

| Column | Total Requirement |
|--------|-------------------|
| Hours | Sum (for reference/average) |
| Share % | **Must = 100%** |
| Share $ | **Must = Net Pool** |

#### Name Cell Interaction

When name cell is clicked:
1. Dropdown shows colorful categories (static in Demo)
2. Next to category name (e.g., "BOH-Orange") is the assigned Category Weight
3. **+** or **−** buttons allow adjustment by 0.25 increments (up to +0.75)
4. Whole number weights changeable in Demo Settings only

#### Demo Controls

| Control | Action |
|---------|--------|
| **Default Settings Button** | Reset to original preset values |
| **Go To Distribution Table** | Scroll down from Settings |
| **Print** | Checkbox: "Include Share/Hr Column?" (default: NOT printed) |
| **Log Out** | End session |

---

### Free Trial/Full Version Settings Page (Page 3) - Detailed Specification

**Access Control:** Admin Only or by Permissions - requires Admin Login/Password with 2FA

**Important Note for Admin (!!Note - First Visit):**
> "It is highly recommended that you take time to Read about the Powerful features of the SCENARIO SAND BOX. If you started with DEMO and are happy with the Data you entered, the Data can be uploaded to SCENARIO SAND BOX."

**Auto-Save:** If Admin clicks off this page, data should be automatically saved.

**Settings Tabs - Full Version:**

| Tab | Description | Type | Notes |
|-----|-------------|------|-------|
| **Locations** | Force completion of location data on first entry | Required First | Nickname, Restaurant Name, Address - saved choices appear in dropdown |
| **Choose Location** | Dropdown to select location | Display | Single location shows "Welcome: Name of Restaurant" |
| **Date, Time and Zone** | System date/time settings | Required | |
| **Set Launch Date** | First Day of First Pay Period collecting contributions | Required | Always visible after set; requires 30-day employee notification |
| **Pay Periods** | Weekly, Bi-Weekly, BiMonthly, Monthly | Required | |
| **Last PPE Date** | Establishes spread of dates | Required | |
| **Enter Pay Days** | Day of week or days of month | Required | BiMonthly requires 2 days (usually 5th and 20th) |
| **Set Contribution Criteria** | CC Sales, CC Tips, All Tips, or All Sales | Required | Same as Demo Step 1 |
| **Enter Contribution %** | Based on criteria above | Required | 5-25% in 0.5 increments (tips) OR 1-5% in 0.25 increments (sales) |
| **Enter Job Categories** | Checkbox selection | Required | Same predefined list + 5 write-ins |
| **Job Category Weights** | 1-5 in 0.25 increments per category | Required | |
| **User Permissions** | Set user roles and access | Admin Only | Critical Note must be acknowledged - see Admin Role section |
| **Implement Change Date** | Schedule changes for future PP Beginning | Admin Only | Changes to starred items must be saved with PP Beginning date |
| **Email Choices for Users** | Communication permissions | Admin | |
| **Scenario Sand Box** | Access to experimentation module | Admin/Manager | |
| **Go To All Data Links** | Navigation | All | |
| **Log Out** | Session end | All | |

**Features BLOCKED in Demo but available in Full Version:**
- Location
- Date, Time and Zone
- Pay Period Type
- Last PPE date
- Pay Day
- Launch Date
- Users/Permissions
- Email permissions
- Scenario Sand Box
- Go To All Data Links

---

### Help System: ?Notes and !!Notes

The application uses two types of contextual help:

| Type | Display | Behavior | Use Case |
|------|---------|----------|----------|
| **?Note** | Yellow highlighted "?" | Hover tooltip with explanation | General help, recommendations |
| **!!Note** | Red/orange highlighted "!!" | Modal with "I Have Read and Agree" checkbox required | Critical compliance warnings, legal requirements |

**!!Note Critical Requirements:**
- Must be acknowledged before proceeding with that setting
- Should only appear after Launch Date for certain compliance warnings
- Log acknowledgment with timestamp and user ID
- Examples: Changing contribution rate, modifying job category weights

---

### Full Version PP Distribution Table (Page 7) - Detailed Specification (January 14, 2026)

Page 7 in the flow chart. This is where the actual tip pool distributions are calculated and posted.

#### Entry Point ?Note (SSB Reminder)

**??Note - Scenario Sand Box:**
> "If you have data in The Scenario Sand Box and you want to upload all that data to both the Settings Page and Here in the Distribution Page you may upload it any time before Launch Date. Go to Scenario Sand Box and click *Upload to Free Trial/Full Version*. This Upload data Button can only be activated once before Launch Day."

*Tim Note: Can these ??Note be timed to disappear? After First Pay Day has occurred after Launch Date (Archive Day), this ??Note can go bye bye.*

#### Stat Cards (Above Table)

| Stat Card | Source | Notes |
|-----------|--------|-------|
| **Day/Date** | Auto-fill current date | Override option for POS outages |
| **Location** | Forced choice if Admin + multiple locations | |
| **Pay Period** | Step 1 selection | Clickable for 2 prior archived PPs (view/print only) |
| **Contrib. Method** | From Settings | Static |
| **Gross Pool** | From PP Contribution page | |
| **Pre-Paid** | Manual entry | Alters Net Pool. ?Note: "early termination payment" |
| **Net Pool** | Gross − Pre-Paid | |
| **Top Contributors** | Real-time from PP Contributions | "Be sure to thank our Top Contributors this Pay Period!" on print |
| **Pool $ Amount** | Real-time from current PP Contribution Log | |
| **Countdown to PPE** | Days remaining (e.g., "3 days To PPE") or "Complete" | |

#### Step 1: Choose Pay Period

Upon entering Distribution page, user is **forced to choose** from dropdown of 2 PP choices (overlap from PPE to Pay Day).

- Once archived (day after Pay Day), new PP dates load and archived dates removed from dropdown
- Once chosen, Pool amount and Countdown auto-fill accordingly
- Table loads with last PP known data **except Hours** (which clears Share % and $)

#### Step 2: First Time Entries (Full Version Only)

This is where all Recipients' data is entered after Launch Date, ideally before End of First Pay Period.

**Employee Status Checkbox (when entering new name):**
- [ ] New
- [ ] Rehired
- [ ] Borrowed (earnings need to be combined with another location)
- [ ] Split Job/Category/Wage (combine lines to one name in YTD)
- [ ] Name Change (If yes, Old Name: _______)

**Data Entry Flow:**

1. **Type Name** → Press Enter
2. **Choose Category** → Dropdown of colorful categories
   - Admin/Manager sees weight with +/− buttons (0.25 increments up to +0.75)
   - Users do NOT see weight adjustments unless granted permission
   - Entire Name cell gets category color background
3. **Enter Wage/Hr** → Decimal (20.0, 20.25, etc.) - **HIDDEN on print**
4. **Enter Hours** → Decimal (14.25, 32.65, etc.)
5. **Auto-fill columns:** Category Color + Base Weight, Share %, Share $

**??Note for Salaried Employees:**
> "If the person is OT exempt and paid a salary get as close as you can with an hourly wage estimate. This does not get revealed on the postings for confidentiality reasons. The important thing is if this person is salaried they will be scrutinized on their duties. They must NOT be an Owner, Manager, Assistant Manager or Supervisor... This is the one mistake that can trigger guaranteed Civil Money Penalties!"

#### Distribution Table Columns (Full Version)

| Column | Data Type | Editable | Print | Notes |
|--------|-----------|----------|-------|-------|
| **Name** | Text | Yes | Yes | Cell background = Category Color |
| **Wages** | Decimal | Yes | **HIDDEN** | Confidential |
| **Hours** | Decimal | Yes | Yes | From timekeeping system |
| **Category Weight** | 1-5 (shows base, calculates actual) | +/− by Admin/Manager | Yes | Shows base weight, actual may include +0.25-0.75 |
| **Share %** | Auto-calculated | No | Yes | Real-time |
| **Share $** | Auto-calculated | No | Yes | Rounded to nearest $ |
| **$/Hr** | Auto-calculated | No | **HIDDEN** (optional) | Pool Share ÷ Hours |

**Important:** If actual weight has +0.25 to +0.75 added, it calculates at that rate but **shows base rate** to avoid infighting within category.

#### Calculation Formula

```
Total Tipped Employee Contribution (matches PP Contribution Posting)
  − Pre-Paid Pool $ (Prior Pool Mistake or Terminated Employee)
    [Must have a name attached as beneficiary]
  = Net Pool

Individual:
  Hours × Wage × Weight = Basis
  Individual Basis ÷ Total Basis = Share %
  Share % Column Always = 100%
  Share % × Net Pool = Share → Round to nearest $
  Total of all Rounded Shares must = Net Pool
```

#### Full Version Controls

| Control | Action |
|---------|--------|
| **Print** | Checkbox: "Include Share/Hr Column?" (default: NOT printed) |
| **Share** | Email to permissible addresses |
| **Scenario Sand Box** | Navigate to SSB |
| **Go To All Data Links** | Navigate to data pages |
| **Log Out** | End session |

#### Post-Print Workflow

1. **Posted Employee Notice for Transparency** - gives recipients time to review for mistakes before Payroll
2. **Reminder:** Any changes after initial printing will need to be Reprinted and Reposted
3. **Auto Archive:** Day after Pay Day for that pay period
4. **Next PP:** When archived, next PP dates become available in dropdown

---

### P0 Features (Must Have - MVP)

#### Feature 1: Core Tip Calculation Engine

**User Story:**
As a restaurant manager, I want to enter daily contribution data and have the system automatically calculate each employee's share of the tip pool, so that I can distribute tips fairly and efficiently.

**Acceptance Criteria:**
- Given a list of employees with hours worked, pay rates, and job categories
- When the manager triggers calculation
- Then the system computes each employee's share using Hours x Rate x Weight
- And the total shares equal exactly the total pool amount (no rounding errors)
- And the "Basis" value is never displayed to any user

**Edge Cases:**
- Employee with 0 hours = $0 share (no division by zero)
- Single employee = 100% of pool
- Pool amount of $0 = all shares $0
- Decimal rounding must reconcile to exact total (adjust smallest share if needed)

**Priority Justification:** Without accurate calculations, the product has no value.

**Dependencies:** None

**Technical Constraints:**
- Floating-point arithmetic must handle currency precisely
- Rounding logic: round to whole dollars, adjust one employee if total doesn't match

**UX Considerations:**
- "Share" column shows calculated amount
- "Received" column shows rounded amount (or eliminate if totals match)
- Visual indication when calculation is complete
- Print version auto-hides wage column (confidential)

---

#### Feature 2: Daily Contribution Entry

**User Story:**
As a data entry designee, I want to quickly enter each server's daily sales and tip contribution, so that the pay period totals are accurate.

**Acceptance Criteria:**
- Given the daily entry page
- When I select a date and enter server sales amounts
- Then the system calculates the contribution at the configured rate (e.g., 3.25%)
- And allows me to override with actual contribution amount
- And the "Actual Contribution" is what enters the pool (not calculated)

**Edge Cases:**
- Server worked but had no sales = $0 contribution
- Server didn't work that day = no entry (null, not $0)
- Copy previous day's roster (convenience feature)

**Priority Justification:** Core data input required for all calculations.

**Dependencies:** Employee roster must exist

**UX Considerations:**
- Date navigator (previous/next day buttons)
- Calculated field shown for reference only
- Actual contribution field is editable (green highlight)
- Running totals updated in real-time

---

#### Feature 3: Pay Period Summary

**User Story:**
As a manager, I want to see all server contributions for a pay period in one view, so that I can verify totals before calculating distribution.

**Acceptance Criteria:**
- Given a selected pay period
- When I view the pay period summary
- Then I see each server's total sales, calculated contribution, and actual contribution
- And the totals match the pool calculation input
- And I can print a PDF report

**Edge Cases:**
- Pay period with no data = empty state with helpful message
- Partial data entry = clear indication of missing days

**Priority Justification:** Verification step before distribution.

**Dependencies:** Daily entries must exist

**UX Considerations:**
- Grid showing servers in rows, with totals column
- "Attested" column with checkmark + initials
- Print button generates PDF without wage data

---

#### Feature 4: Pool Distribution Report

**User Story:**
As a restaurant owner, I want to see how the tip pool is distributed to each employee, so that I can verify fairness and post for staff review.

**Acceptance Criteria:**
- Given a calculated pool distribution
- When I view the distribution report
- Then I see employee name, location, role, hours, rate, share %, and share amount
- And the "Received" column shows whole-dollar amounts
- And totals match exactly
- And I can print a professional PDF for posting

**Edge Cases:**
- Employee terminated mid-period = shares calculated up to last day worked
- New employee mid-period = shares calculated from start date

**Priority Justification:** This is the "money shot" - what users actually care about.

**Dependencies:** Contribution data, employee data, calculation engine

**UX Considerations:**
- NO "Basis" column (proprietary algorithm)
- Role badges with color coding (Server=blue, Cook=yellow, Busser=green, Host=purple)
- Variance input field for admin adjustments
- Print hides wage column

---

#### Feature 5: Settings Configuration

**User Story:**
As an admin, I want to configure contribution rates, job categories, and weights, so that the system reflects my restaurant's specific policies.

**Acceptance Criteria:**
- Given the settings page
- When I set contribution rate to 3.25%
- Then all daily calculations use this rate as default
- When I create job categories (Server, Cook, Busser, Host)
- Then each category appears in employee assignment dropdown
- When I set variable weights (1.0-5.0 in 0.25 increments)
- Then pool distribution uses these weights

**Edge Cases:**
- Changing rate mid-period = only affects new entries
- Deleting a job category with assigned employees = error, must reassign first

**Priority Justification:** Configuration required before any data entry.

**Dependencies:** None

**UX Considerations:**
- Dropdown for rate: 1-5 with 0.25 increments + static % sign
- Dropdown for weights: 1-5 with 0.25 increments (17 options)
- Help (?) icons next to each setting with tooltip explanations
- Some features visible but blocked in demo (tease full version)

---

### P1 Features (Should Have - Post-MVP)

#### Feature 6: User Authentication & Authorization

**User Story:**
As a restaurant owner, I want role-based access control so that data entry staff can only enter data, managers can only see their location, and I can see everything.

**Acceptance Criteria:**
- Given three user roles: Admin, Manager, Designee
- When a Designee logs in
- Then they can only enter/edit current period data, cannot change weights or settings
- When a Manager logs in
- Then they can do everything a Designee can, plus assign/unassign Designees, correct current period data
- When an Admin logs in
- Then they have full access including settings, weights, archived data, all locations

**Role Permissions Matrix:**

| Action | Designee | Manager | Admin |
|--------|----------|---------|-------|
| Enter daily data | Yes | Yes | Yes |
| Edit current period | Yes | Yes | Yes |
| Edit archived data | No | No | Yes |
| Change weights | No | No | Yes |
| Change settings | No | No | Yes |
| Assign users | No | Yes (Designees only) | Yes |
| View other locations | No | No | Yes |
| Access Scenario Sandbox | No | Yes | Yes |

**Priority Justification:** Security is critical for production use but not needed for demo.

**Dependencies:** Database user model

**Technical Constraints:**
- 2FA via email or SMS only (no authenticator app per client request)
- Session timeout with countdown warning
- Device authorization for Admin/Manager

---

#### Feature 7: Multi-Location Support

**User Story:**
As a multi-unit restaurant owner, I want to manage all my locations from one login while keeping each location's tip pool separate.

**Acceptance Criteria:**
- Given a restaurant group with 3 locations
- When the admin logs in
- Then they see a location selector dropdown
- And can switch between locations or view "All Locations"
- And each location's pool is calculated independently
- And data from one location never affects another

**Edge Cases:**
- Employee works at multiple locations = separate entries per location
- Location added mid-period = only new data going forward

**Priority Justification:** Key differentiator for scaling the business.

**Dependencies:** Authentication system, database structure

**Technical Constraints:**
- Tenant isolation must be absolute (no data leakage)
- Performance must scale to 20+ locations per account

---

#### Feature 8: Scenario Sand Box (Detailed Specification)

**User Story:**
As a manager, I want to test different contribution rates or weight changes without affecting live data, so that I can see the impact before committing. I also want to use this to calculate corrections for missed employees or terminated employees.

**Acceptance Criteria:**
- Given the Scenario Sand Box module
- When I modify settings or data
- Then calculations run on sandbox data only
- And I can see "what if" scenarios
- And no changes affect production data
- And I can load the last saved distribution for quick mistake calculations

**Critical Data Flow Rules:**

| Phase | Data Flow Direction | Allowed |
|-------|---------------------|---------|
| Before Launch Date | Sandbox → Production | ONE TIME ONLY via "Upload To Free Trial/Full Version" button |
| After Launch Date | Sandbox → Production | NEVER - changes cannot flow to live data |
| After Each Payday | Production → Sandbox | AUTOMATIC - archiving replaces sandbox data |

**Key Functionality:**

1. **Experimentation After Launch Date:**
   - Admin/Manager can test effect of new contribution % on complete pay period data
   - Can test changes to job category weights
   - NO effect on live pages or current data
   - Changes stay in Sandbox until replaced by next archive

2. **Automatic Data Refresh:**
   - Day after payday: current data is archived
   - Archived data (last paid distribution pool + settings) flows TO Scenario Sand Box
   - Sandbox data becomes changeable but has no effect on archived data

3. **Mistake Rectification Use Cases:**

   **Use Case A: Forgotten Employee (e.g., Johnny the dishwasher left out)**
   - Load last paid pool in Sandbox
   - Add Johnny's Wage, Hours, Job Role
   - See what his share would have been
   - Print for documentation
   - Options for correction:
     - Option 1: Pay Johnny from house funds, enter as prepaid in next pool
     - Option 2: Pay Johnny, add forgotten hours to next pool, note on report

   **Use Case B: Employee Terminates Before First Pool**
   - Plug new employee's Hours, Wage, Job Role into last period's Sandbox data
   - Calculate estimated share
   - Print as proof of estimated earnings
   - Include in final check

4. **Final Pool Payout Calculations (Without Sandbox):**
   - Employee in last pool: Calculate $/Hr from last pool, multiply by current hours
   - Employee before first pool: Use average $/Hr from same job category/wage level

**Edge Cases:**
- Demo data can upload to Sandbox multiple times until Demo expires
- Sandbox can only upload to Production ONCE (before Launch Date)
- After experimenting, Sandbox data stays as changed until next archive replaces it
- Terminated employees MUST be paid pool money on FINAL CHECK (check state rules)
- Prepaid entries must track to YTD and EOY totals

**Priority Justification:** Critical for mistake correction, experimentation, and training. "This is why Scenario Sand Box is a handy tool."

**Dependencies:** Core calculation engine, archiving system

**UX Considerations:**
- Clear visual indicator that user is in Sandbox mode (not live data)
- "Upload To Free Trial/Full Version" button only active before Launch Date
- Print capability for documentation purposes
- Warning dialogs when data would be lost

---

#### Feature 9: Daily Tip Grid View

**User Story:**
As a manager, I want to see all daily contributions in a calendar grid format, so that I can spot missing days or unusual patterns.

**Acceptance Criteria:**
- Given a pay period
- When I view the Daily Tip Grid
- Then I see dates as rows, servers as columns
- And each cell shows that server's contribution for that day
- And null values show "-" (server didn't work)
- And column totals match pay period summary

**Priority Justification:** Audit and verification tool.

**Dependencies:** Daily entry data

---

#### Feature 10: YTD Reports

**User Story:**
As a restaurant owner, I want year-to-date summaries for each employee, so that I can prepare W2 information and see who's contributing vs. receiving.

**Acceptance Criteria:**
- Given completed pay periods
- When I view YTD report
- Then I see each employee's total hours, contributed amount, received amount, and net +/-
- And servers (contributors) show negative net
- And non-servers (recipients) show positive net
- And I can export to CSV for payroll service

**Edge Cases:**
- Employee terminated mid-year = shows data through termination
- New employee = shows data from start date

**Priority Justification:** Required for compliance and W2 reporting.

**Dependencies:** Archived pay period data

---

### P2 Features (Nice to Have - Future)

#### Feature 11: Expert Admin Panel (Command Center)

**User Story:**
As the Tip Share Pro platform owner, I want a back-office admin panel to manage all customer accounts, subscriptions, and trial conversions.

**Acceptance Criteria:**
- Given the "Expert" login
- When I view Command Center
- Then I see all customer accounts with subscription status
- And can flip Demo to Free Trial to Full App
- And see payment status, expired cards, contact info
- And manage trial countdowns (45 days, marketed as 30)

**Priority Justification:** Business operations tool, not customer-facing.

**Dependencies:** Stripe integration, customer database

---

#### Feature 12: Email/SMS Notifications

**User Story:**
As a user with 2FA enabled, I want to receive alerts for important events like trial expiration, so that I don't lose my data.

**Acceptance Criteria:**
- Given a free trial user
- When 15 days remain in trial
- Then they receive email/SMS countdown alerts
- And alerts repeat at 7 days, 3 days, 1 day

**Priority Justification:** Conversion optimization.

**Dependencies:** 2FA system, notification infrastructure

---

#### Feature 13: Audit Logging

**User Story:**
As an admin, I want to see who entered or changed data and when, so that I can trace errors and prevent sabotage.

**Acceptance Criteria:**
- Given any data modification
- Then the system logs: user, timestamp, action, before/after values
- When I view audit log
- Then I can filter by date, user, action type

**Priority Justification:** Security and accountability.

**Dependencies:** User authentication

---

## Requirements Documentation

### Functional Requirements

#### User Flows

**1. New Restaurant Onboarding Flow:**
```
Landing Page → Demo (no login)
       ↓
  Free Trial (signup required)
       ↓
  Settings Configuration
       ↓
  Employee Setup
       ↓
  First Daily Entry
       ↓
  First Calculation
       ↓
  Paid Subscription (Stripe checkout)
```

**2. Daily Manager Workflow:**
```
Login (2FA) → Dashboard
       ↓
  Select Location (if multi)
       ↓
  Daily Entry → Enter sales/contributions
       ↓
  Save Day → Move to Next Day
       ↓
  End of Period: Calculate Distribution
       ↓
  Print Report → Post for Staff
```

**3. Error Correction Flow:**
```
Manager Identifies Error → Open Scenario Sandbox
       ↓
  Load Last Distribution
       ↓
  Modify Data → See Corrected Result
       ↓
  Pay Difference Manually
       ↓
  Enter as Prepaid for Next Period
```

#### State Management

| Entity | States | Transitions |
|--------|--------|-------------|
| Pay Period | Draft → Active → Archived | Archive triggered by admin or day after payday (configurable) |
| Daily Entry | Empty → Partial → Complete | Complete = all servers entered |
| User Account | Demo → Trial → Active → Suspended → Terminated | Trial expires in 45 days |
| Calculation | Pending → Processing → Complete | Triggered manually |

#### Data Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Sales Amount | >= 0, numeric | "Sales amount must be a positive number" |
| Hours Worked | > 0 and <= 168, numeric | "Hours must be between 0 and 168" |
| Pay Rate | > 0 and < 200, numeric | "Hourly rate must be between $0.01 and $200" |
| Contribution Rate | 1-5 in 0.25 increments | Dropdown enforced |
| Weight | 1-5 in 0.25 increments | Dropdown enforced |
| Email | Valid email format | "Please enter a valid email address" |

#### Integration Points

| System | Purpose | Method |
|--------|---------|--------|
| Stripe | Subscription billing | API + Webhooks |
| SendGrid/Twilio | Email/SMS notifications | API |
| Browser PDF | Report generation | Client-side |
| Cloud Storage | Data persistence | Database |

---

### Non-Functional Requirements

#### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load Time | < 2 seconds | Time to interactive |
| Calculation Time | < 500ms for 100 employees | Server processing |
| API Response Time | < 200ms (95th percentile) | Backend latency |
| Database Query | < 100ms | Slow query log |

#### Scalability Needs

| Dimension | Target | Design Approach |
|-----------|--------|-----------------|
| Concurrent Users | 1000 | Stateless API, connection pooling |
| Customers | 500 restaurants | Tenant isolation, indexed queries |
| Locations per Customer | 20 | Efficient joins |
| Employees per Location | 100 | Pagination, lazy loading |
| Pay Periods (History) | 5 years | Data archiving, partitioning |

#### Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Authentication | Username/password + 2FA (email or SMS) |
| Authorization | Role-based access control (Admin, Manager, Designee) |
| Data Encryption | TLS 1.3 in transit, AES-256 at rest |
| Session Management | 30-minute timeout with countdown warning |
| Tenant Isolation | Database-level row filtering, never trust client |
| Audit Trail | Log all data modifications with user/timestamp |
| Device Authorization | Admin approves devices for sensitive operations |

#### Accessibility Standards

| Standard | Target | Implementation |
|----------|--------|----------------|
| WCAG | 2.1 AA | Semantic HTML, ARIA labels, keyboard navigation |
| Color Contrast | 4.5:1 minimum | Design system enforcement |
| Screen Readers | Full support | Alt text, form labels, focus management |

---

### User Experience Requirements

#### Information Architecture

```
Tip Share Pro
├── Dashboard
│   ├── Stats Cards (Pool, Sales, Participants, Days Entered)
│   ├── Top Contributors Table
│   └── Recent Activity Feed
├── Daily Entry
│   ├── Date Navigator
│   └── Server Entry Form
├── Daily Tip Grid
│   └── Calendar Grid View
├── Pay Period Summary
│   └── Server Contribution Totals
├── Pool Calculation
│   ├── Summary Cards (Pool, Participants, Hours)
│   └── Distribution Table
├── YTD Reports
│   └── Annual Summary Table
└── Settings
    ├── Organization Settings
    └── Locations
```

#### Progressive Disclosure Strategy

| Level | What's Shown | When Revealed |
|-------|--------------|---------------|
| Basic | Dashboard, Daily Entry, Results | Always visible |
| Intermediate | Daily Grid, Pay Period, YTD | When user clicks nav |
| Advanced | Settings, Weights, Scenario Sandbox | Admin/Manager only |
| Expert | Command Center | Platform owner only |

#### Error Prevention Mechanisms

| Risk | Prevention |
|------|------------|
| Duplicate entries | Check for existing entry before save |
| Wrong job category | Confirmation prompt for new employees |
| Premature archiving | Confirm dialog before archive |
| Accidental deletion | Soft delete with recovery period |
| Calculation on incomplete data | Warning if missing days |

#### Feedback Patterns

| Action | Feedback |
|--------|----------|
| Save successful | Toast: "Day saved successfully" (3 seconds) |
| Calculation complete | Toast + updated totals |
| Error occurred | Red inline error message |
| Loading | Spinner or skeleton state |
| Unsaved changes | Warning before navigation |

---

## Database Schema (Conceptual)

### Multi-Tenant Data Model

```
Organizations (Tenants)
├── id (UUID)
├── name
├── subscription_status
├── stripe_customer_id
└── settings (JSON: contribution_rate, pay_period_type, etc.)

Locations
├── id (UUID)
├── organization_id (FK)
├── name
├── number
└── status (active/inactive)

Users
├── id (UUID)
├── organization_id (FK)
├── email
├── role (admin/manager/designee)
├── location_id (FK, nullable for admins)
└── two_factor_enabled

Employees
├── id (UUID)
├── organization_id (FK)
├── location_id (FK)
├── name
├── hourly_rate
├── job_category_id (FK)
└── status (active/terminated)

Job_Categories
├── id (UUID)
├── organization_id (FK)
├── name
├── weight (1.0-5.0)
└── badge_color

Pay_Periods
├── id (UUID)
├── organization_id (FK)
├── location_id (FK)
├── start_date
├── end_date
├── status (draft/active/archived)
└── total_pool

Daily_Entries
├── id (UUID)
├── pay_period_id (FK)
├── employee_id (FK)
├── date
├── sales_amount
├── calculated_contribution
└── actual_contribution

Distributions
├── id (UUID)
├── pay_period_id (FK)
├── employee_id (FK)
├── hours_worked
├── rate_at_time
├── weight_at_time
├── basis (HIDDEN - never exposed to API)
├── percentage
├── share_amount
└── received_amount

Audit_Log
├── id (UUID)
├── organization_id (FK)
├── user_id (FK)
├── timestamp
├── action
├── entity_type
├── entity_id
├── before_values (JSON)
└── after_values (JSON)
```

---

## Development Phases

### Phase 1: Demo (Current Priority) - REVISED January 15, 2026

**NEW ARCHITECTURE:** Standalone application, NOT integrated with Full Version

| Feature | Specification |
|---------|---------------|
| **Hosting** | Standalone (could use Replit or similar lightweight hosting) |
| **Distribution** | Via email link from TipSharePro |
| **Authentication** | Simple login/password issued by TipSharePro |
| **Settings Page** | Full 5-step configuration (contribution method, %, job categories, weights) |
| **Employees** | 10 pre-set sample employees (wages/hours editable) |
| **Distribution Preview** | Inline, scrollable below Settings - updates in real-time |
| **Full Version Tease** | Faded-out controls visible to create desire |
| **Print** | Distribution Table ONLY |
| **SSB Upload** | ~~REMOVED~~ - Demo is 100% standalone |

**Why Standalone?**
- "Demo should be as uncomplicated as possible"
- "If they want more then sign up for the free trial. It's free."
- "We just want to wet their whistle"
- Programming can still be reused for production

**Tom's Strategic Reasoning (January 15, 2026):**
> "All of this makes it so the Admin is less invested in DEMO and is more likely to want the Free Trial where they can start in the SSB. If they have questions which they should, I will talk them into the free trial. No need for Demo upload to SSB. I see a quicker turnaround from inquiry to actually getting the Free Trial where they are going to get started with actual employees and become invested before Free Trial ends."

**Sales Funnel Logic:**
1. Demo = "Wet their whistle" → Minimal investment
2. Questions arise → Tom talks them into Free Trial
3. Free Trial → Start in SSB with REAL employees
4. Real employees = Investment → Conversion before trial ends
5. One week in Demo = "I'm going to wonder what they're waiting for"

**Timeline:** First deliverable - BUILD NOW

### Phase 2: Full Single-Location Version
- Real authentication (email/password + 2FA)
- Complete settings configuration
- Daily entry workflow
- Pay period calculations
- Distribution reports
- Cloud data storage
- Stripe subscription integration
- **Timeline:** Core product

### Phase 3: Multi-Location Support
- Location selector
- Admin view across locations
- Per-location pools
- Aggregated reporting
- **Timeline:** After Phase 2 validated

### Phase 4: Advanced Features
- Expert Command Center
- Scenario Sandbox
- YTD archiving
- W2 reporting export
- Advanced audit logging
- Email/SMS notifications
- **Timeline:** Growth phase

---

## Critical Questions Checklist

### Verified Items
- [x] Are there existing solutions we're improving upon?
  - Yes: Basic Excel tip pooling, enterprise payroll add-ons. We're targeting the mid-market with a specific Hours x Rate x Weight algorithm.

- [x] What's the minimum viable version?
  - Demo (Phase 1): Interactive preview with sample calculations, no login, PDF export

- [x] What are the potential risks or unintended consequences?
  - **Legal Risk:** Must ensure compliance with DOL/IRS regulations (client expertise mitigates)
  - **Privacy Risk:** Wage data is confidential (hide from prints, role-based access)
  - **Fairness Perception:** Employees may question "hidden" algorithm (transparency reports address)

- [x] Have we considered platform-specific requirements?
  - Web-first, responsive design, PDF generation in browser
  - Future: Mobile app for staff to view their share (not in scope currently)

### Gaps Requiring Clarification - UPDATED WITH TOM'S ANSWERS

#### Resolved Questions (January 9, 2026):

1. **Scenario Sand Box Purpose (Q1):**
   - **Answer:** See "Scenario Sand Box" PDF for detailed explanation
   - The Demo focus should be on the Distribution page next so Demo is ready
   - Don't get too far ahead - Tom will provide page-by-page specifications

2. **Multiple Job Categories / Same Employee Different Positions (Q2):**
   - **Answer:** YES, this happens (e.g., Juan Valdez working as both server and busser)
   - **Posted Distribution Report:** Keep earnings SEPARATED by position so employee can see what they earned in each role
   - **YTD/EOY Totals:** COMBINE into single employee line (one entry per employee)
   - Payroll departments handle duplicate names already; this follows same pattern

3. **Historical Rate Changes / Mid-Period Raises (Q3):**
   - **Answer:** Make another entry on the Distribution Table with new rate
   - **Policy:** Tell managers NOT to give raises mid pay period
   - Can verbally tell employee about raise, but effective date should be next pay period start
   - Mostly unnecessary for payroll department

4. **Cloud Storage Costs (Q4):**
   - **Answer:** Tom needs advice on this area
   - Initial plan: Pay per GB
   - Future goal: Flat fee per TB (more cost effective at scale)
   - Subscription fee should cover storage + legal fees + accounting fees + employees + advertising
   - Request: Suggest how to "start slow on storage and build"

#### Resolved Questions (January 15, 2026):

5. **Navigation Hub / Page 2 Purpose (Q5):**
   - **Answer:** Tom is open to suggestions
   - Tabs are available based on BOTH title AND permissions
   - Owner/Admin might give admin privileges to a bookkeeper
   - Tom's vision: "A place to see all destinations available whether or not it's in their repertoire"
   - **Implementation:** Show all navigation options, but gray out/disable those outside user's permissions

6. **!!Note Behavior Before Launch Date (Q6):**
   - **Answer:** Critical settings CAN be changed freely until Launch Date
   - Even after Launch Date, user gets "I Read and Agree" checkbox but CAN still change
   - No rules violated until change is actually in effect
   - Launch Date = when commitment starts for Contribution %
   - **Implementation:** !!Notes should be VISIBLE but non-blocking before Launch Date. After Launch Date, require acknowledgment checkbox before proceeding.

7. **Change Notification Trigger (Q7):**
   - **Pending clarification** - Original question about "Email to All Admin 2FA that changes have been scheduled" not directly answered
   - Tom was focused on bigger Demo simplification direction

#### Remaining Gaps:

8. **Prepaid Entry Handling:**
   - Exact workflow for adjustments via prepaid line needs detailed specification
   - Prepaid amounts must flow to YTD and EOY totals
   - Employees in prepaid section "reside outside the normal table"

9. **Trial Period Implementation:**
   - Free Trial IS the Full Version (no "Free Trial" label visible to customer)
   - Daily countdown display in last 10 days (or similar)
   - Last 5 days: Email and text alerts to Administrator
   - Functionality end date set by TipSharePro when sending trial

10. **Trial-to-Paid Data Migration:**
    - Does trial data persist when converting to paid? (Assumed YES)
    - Any cleanup or verification required?

11. **Demo Dialog Box Content:** ✅ RESOLVED
    - Full text: "You can set hours to zero on any employee you want to eliminate from the pool if it holds too many recipients."

---

## The Administrator Role (Critical Specification)

The Administrator has FULL responsibility for setting:
- Contribution Rate
- Job Roles
- Each Job Role's variable "weight" based on overall contribution to customer satisfaction

### Admin Responsibilities

**Legal Accountability:**
- Tip pools may be analyzed for reasonableness and fairness by state Labor Boards
- Admin may be required to justify reasoning and methods
- Must keep Contribution Rate, Job Roles, and Weights FAIR and REASONABLE
- Changes require proper notification to affected employees

### Change Notification Requirements

| Change Type | Who to Notify | Notice Period | Method |
|-------------|---------------|---------------|--------|
| **Contribution Rate Increase** | All Contributors (servers) | 30 days written | Signed acknowledgment form |
| **Contribution Rate Decrease** | All Distribution Beneficiaries (recipients) | 30 days written | Signed acknowledgment form |
| **Individual Job Category Change** (negatively affects 1 person) | That individual | 1 full pay period | Face-to-face, documented |
| **Individual Weight Change** (negatively affects 1 person) | That individual | 1 full pay period | Face-to-face, documented |
| **Multiple Weight Changes** (negatively affects multiple recipients) | All negatively affected | 1 full pay period written | Signed acknowledgment form |

**Critical Admin Warning (!!Note):**
> "Do not give Admin privileges to anyone you do not trust to keep you out of trouble from Labor Department scrutiny."

### Audit Trail Requirements

The system MUST log all Admin Settings changes:
- Date of change
- Location affected
- What critical area was changed
- Who made the change
- Before/after values
- UN-EDITABLE record (for legal protection)

Tom's note: "If someone goes in and changes a variable and thinks it wise to blame my program I can produce the entries through my portal."

---

## Job Categories & Weights (Detailed Specification) - REVISED January 11, 2026

### Color-Coded Category System (NEW)

**Tom's insight:** "The inclusion of colors is actually a great idea. It makes category identification easy to see on the posted transparency report and it simplifies choosing weights."

Each job category is assigned a **color** for easy visual identification on the Distribution Table. A **color key** appears at the bottom of the Distribution Table showing category titles.

### 5 Category Colors

| Color | Default Category | Example Job Titles |
|-------|------------------|-------------------|
| **Orange** | BOH (Kitchen) | Lead Cook, Line Cook, Pastry Chef, Pantry Chef |
| **Violet** | FOH (Non Tipped) | Host/Hostess, Busser, Cashier, Runner |
| **Cyan** | Bar | Bartender, Barista, or custom (e.g., FOH Clam Shuckers) |
| **Lime Green** | Support (FOH or BOH) | Dishwasher, Busser, Prep Cook, Bar Back |
| **Yellow** | Custom (Big Leagues) | Banquet Chef, Maitre D, Sommelier |

### Category Assignment Rules

- **5 write-in categories** available for custom titles
- Assign a Job Category title to a different Color if desired, or use suggested defaults
- If you don't have enough categories for all colors → don't use a color (save for future expansion)
- If you have more categories than colors → combine something (you get 5 colors max)
- **Color key** provided at bottom of Distribution Table with assigned titles

### Weight System (SIMPLIFIED)

**Base Category Weight:** Choose a **whole number 1-5** for each category based on impact on Customer Satisfaction.

| Weight | Meaning |
|--------|---------|
| 1 | Lowest category in the pool (generally earns lowest share) |
| 2-4 | Mid-range impact |
| 5 | Highest category in the pool (generally earns highest share) |

### Individual Weight Adjustment (NEW)

Within the **Distribution Table**, Admin or Manager (with permission) can fine-tune individual employee weights:

- When Admin highlights a name → category is displayed with weight shown
- **+** or **−** buttons appear next to the weight
- Click **+** to increase by 0.25 increment (up to +0.75 above base)
- Click **−** to decrease by 0.25 increment (down to base weight)
- Example: A category weight of 3 can be adjusted to 3.25, 3.50, or 3.75 for individual superstars

**Permission Note:** The +/− adjustment is only available to Admin or Manager by permission. Data Entry Users do NOT have this permission.

### Example Scenario (Clam Shuckers)

Your operation has front house Live Clam Shuckers who steal the show every night:

1. **All Clam Shuckers:** Give them a base weight of 3 (Cyan category)
2. **Super Star Shucker:** Could create separate "Lead Shucker" category OR use +/− to bump to 3.75
3. **Combined Effect:** Lead Shucker probably makes more per hour + higher weight = appropriately larger share

**Important:** Lead Shucker can have their own category as long as they aren't supervising (detailed rules exist for supervisors).

### Key Principles

1. **Hours × Rate × Weight** formula rewards:
   - Experience (reflected in hourly rate)
   - Hours worked
   - Job category impact on customer satisfaction

2. **TipSharePro differentiator:** Wages as a factor
   - "The single biggest determining factor of who is contributing most to the Chain of Service"

3. **Fairness over equality:**
   - "If the pool was done on a straight hours worked times a single job category weight, the Doctor and the Nurses would get the same rate per hour. That would be weird and frankly un-American."

4. **Color = Easy Identification:**
   - Posted transparency report shows colors for quick category recognition
   - Simplifies weight selection process

### Estimated Impact

- $100K monthly sales → ~$1,000 pool per pay period
- Annual: ~$26,000 in additional compensation for pool recipients
- Benefit: Reduced turnover = reward for management

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Contribution** | Amount a server puts into the tip pool (% of sales) |
| **Distribution** | Amount an employee receives from the tip pool |
| **Basis** | Hidden calculation: Hours x Rate x Weight (never shown) |
| **Variable Weight** | Management-assigned factor (1-5) for job category impact |
| **Pay Period Ending (PPE)** | The last day of a pay cycle |
| **Scenario Sandbox** | Test environment for what-if calculations |
| **Designee** | Data entry role with limited permissions |
| **Tenant** | A restaurant organization in the multi-tenant platform |

---

## Appendix B: Competitive Analysis Summary

| Competitor | Approach | Weakness vs. Tip Share Pro |
|------------|----------|---------------------------|
| Equal-split apps | Simple even distribution | No fairness weighting, no compliance |
| Excel spreadsheets | Manual calculations | Error-prone, formulas exposed, no multi-user |
| Payroll add-ons | Enterprise features | Expensive, complex, overkill for SMB |
| POS tip features | Transaction-based | Don't handle pool distribution logic |

---

## Appendix C: Client Requirements Source

All requirements derived from:
1. **Chat transcript:** December 9, 2025 - January 4, 2026 (tlachaussee to Tim Heineccius)
2. **Original Excel workbooks:** Step 1 - Server Daily Contribution, Step 2 - Pay Period Pool Totals
3. **Marketing documents:** "Why Tip Share Pro.docx", "History of Tip Pools.docx"
4. **HTML Mockup:** tip-share-pro-mockup.html (functional prototype)
5. **Contract:** General Contract for Services dated December 2025
6. **January 9, 2026 Documentation Package (data/20260109/):**
   - Rough Flow Chart.pdf - 9-page application flow
   - Demo - Settings Page.pdf - Demo settings specification
   - Full Version - Settings Page.pdf - Page 3 full specification
   - pdf How Demo,Sand Box,Free Trial work.pdf - Data flow rules
   - pdf Job Categories & Weights.pdf - Detailed weight system
   - pdf Why Sales as....pdf - Contribution factor rationale
   - Scenario Sand Box and....pdf - SSB functionality detail
   - The Admin Role.pdf - Admin responsibilities and compliance
   - Tim Notes Pg 3 Trial-Full Version.pdf - Critical notes for Page 3
   - Tim - Scattered General Notes.pdf - Implementation details
7. **Logo Assets (data/20260109/):**
   - fulllogo.png - Full logo with text
   - fulllogo_transparent.png - Transparent background version
   - icononly_transparent_nobuffer.png - Icon only
   - textonly.png - Text wordmark only
8. **Website Screenshots (data/20260109/Screenshots/):**
   - Current www.tipsharepro.com homepage design reference
9. **January 11, 2026 Data Package (data/20260111/):**
   - Edited Product Requirements Document.pdf - Tom's annotated PRD review
   - Sample Dist. w-Pre Paids.xlsx - Distribution page showing pre-paid handling
   - Server Tip Allocations 2025.xls - EOY allocations workbook from Tom's stores
10. **January 11, 2026 Revised Documents (data/20260111/Mail2/):**
    - **pdf Job Categories & WeightsV2 1-10-26.pdf** - Color-coded category system (Orange, Violet, Cyan, Lime Green, Yellow), simplified whole-number weights, +/- individual adjustment feature
    - **Demo - Settings PageV2 1-10-26.pdf** - Revised Demo settings with color-coded categories
    - **3 Page SettingsV2 1-10-26.pdf** - Full Version Page 3 with color-coded categories
    - **pdf How Sand Box,Free Trial work.pdf** - Updated SSB document (Demo removed, focuses on SSB → Free Trial/Full Version flow)
11. **January 14, 2026 Distribution Specifications (data/20260114/):**
    - **Demo - Distribution PageV2 1-12-26.pdf** - Complete Demo Distribution Table specification with stat cards, columns, and interaction patterns
    - **Demo - Settings PageV2 1-12-26.pdf** - Minor updates to Demo Settings
    - **Full Page 7 PP DistributionsV2 1-12-26.pdf** - Full Version Page 7 Distribution Table with employee entry workflow, PP selection, and print options
    - **Full - Page 3 SettingsV2 1-12-26.pdf** - Full Version Settings with % of Method for PP Tip Allocations
    - **Tip Pool Distribution Example.xls** - Upgraded Excel distribution table example showing columns: Name, Hours, *Wage, Weight, *Basis, Share %, Share $, *$/Hr

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-08 | PM | Initial comprehensive PRD |
| 2.0 | 2026-01-09 | PM | Added Tom's feedback: 9-page flow chart, Scenario Sand Box detailed specs, Admin Role specifications, Job Categories & Weights detail, ?Note/!!Note help system, resolved Q&A items, detailed contribution criteria explanation |
| 3.0 | 2026-01-09 | PM | Comprehensive update from Tom's documentation package: Demo Settings Page specs, Full Version Settings Page specs (Page 3), detailed Tim Notes, General Notes for implementation, Logo assets received, website screenshots analyzed, new design system direction |
| 4.0 | 2026-01-15 | PM | **MAJOR UPDATE:** (1) Demo simplified to standalone - NO SSB upload, (2) Design System v2: dark look + bold colors, NO pastels, (3) Resolved Q&A on Navigation Hub and !!Note behavior, (4) Tom's directive: "Stop talking about steps - take some steps" - less documentation, more building |
| 4.1 | 2026-01-15 | PM | Added Appendix J: EOY Data & Allocations - Distribution page with pre-paids reference, EOY auto-load columns specification, borrowed employees cross-location data matching, Tom's Excel files from data/20260111/ |
| 4.2 | 2026-01-15 | PM | **COLOR-CODED CATEGORIES:** Major revision to Job Categories & Weights - 5 colors (Orange=BOH, Violet=FOH, Cyan=Bar, Lime Green=Support, Yellow=Custom), simplified whole-number weights 1-5, individual +/- adjustment (0.25 increments) in Distribution Table, color key at table bottom. Updated V2 documents for Demo, Page 3 Settings, and SSB. Demo removed from SSB document. |
| 4.3 | 2026-01-15 | PM | **DISTRIBUTION TABLE SPECS:** Complete Demo Distribution Page specification (columns, stat cards, employee entry workflow, print options). Full Version Page 7 PP Distribution Table specification. Calculation formula: Hours × Wage × Weight = Basis → Basis ÷ Total Basis = Share %. Upgraded Excel distribution table example with hidden columns (*Wage, *Basis, *$/Hr). Tom's January 14 files (data/20260114/). |

---

## Appendix D: Why Use All Sales as Contribution Factor

### IRS Alignment

"All Sales" is adjusted for (by IRS standards):
- Sales tax
- Take-out orders
- Retail sales
- Non-tipped meals (employee meals)
- Owner meals (if tracking available)

### Why NOT Use CC Tips or All Tips

| Method | Problem |
|--------|---------|
| CC Sales | Cash tips not properly accounted |
| CC Tips | Understates actual tips received |
| All Tips | Directly tipped workers easily hide cash tips |
| Cash Apps | Customers using to bypass accounting |

### Benefits of Sales-Based Calculation

1. **8% IRS Rule:** Taxing authorities require 8% of sales reported for tip income (year-end allocations)
2. **TipSharePro aligns:** Uses same criteria as IRS
3. **Fair taxation:** Employees not overtaxed
4. **Employer protection:** Not overpaying matching payroll taxes

### Purpose of Chain of Service Pool

> "The whole reason for doing a Chain of Service pool is to put more income into the hands of BOH workers who management can't afford to get significant raises to because minimum wage eats up labor dollars first."

---

## Appendix E: Design Feedback from Tom

### Design System Evolution

#### January 9, 2026 - Initial Feedback:
| Element | Tom's Feedback |
|---------|----------------|
| Foundation colors | "Mostly cool" - approved |
| Text colors | "Like it" - approved |
| "Mahogany" color | Came through as dark olive - "I like the dark olive" |
| Pastel accents | "Don't get too enamored" - wants more bold color |
| Overall | "Throw in some color or I'll fade off to sleep" |
| Logo reference | "Take a look at my Logo. Not bashful." |

#### January 15, 2026 - DEFINITIVE DIRECTION:

**Tom's exact words:** "Overall, I liked the first rendition better. This one is too sanitary. Restaurant people like clean but sanitary is too institutional. I liked that dark look on the first rendition. Unusual and not boring. I just wanted the contrasting colors to be bold. **Pastels are gay.** You did that on the new one with the use of the logo colors and I think it will be great. **Let's combine those 2 elements.**"

### Final Design Direction (v2)

| Principle | Implementation |
|-----------|----------------|
| **Base Theme** | DARK look from first rendition |
| **Accent Colors** | BOLD logo colors (Orange, Lime Green, Navy, Cyan) |
| **NO Pastels** | Light variants on white are "too light" - avoid |
| **Badges** | Must have easily identifiable background colors |
| **Overall Vibe** | "Unusual and not boring" - NOT "sanitary" or "institutional" |

### Specific Feedback on Elements:

| Element | Feedback |
|---------|----------|
| Light variant backgrounds | "I don't care for the light variant backgrounds, especially on white. They are too light." |
| Badges | "I do like badges that have an easily identifiable background color" |
| Color palette | "Do we just get 4 colors? **I will set the badge colors.**" |

### Logo Colors to Reference
- **Orange** (#E85D04 approximate) - Bold, primary brand color
- **Lime Green** (#82B536 approximate) - Growth, success, transparency
- **Navy Blue** (#1A5276 approximate) - Trust, professionalism
- **Light Blue/Cyan** (#3498DB approximate) - Accessibility, friendliness

### ACTION: Combine Two Designs
1. **FROM Design 1:** Dark overall look, unusual, not boring
2. **FROM Design 2:** Bold TipSharePro logo colors as accents
3. **REMOVE:** All pastel/light variants
4. **ADD:** Tom will specify additional badge colors

### Design Direction Summary
- Match energy of the TipSharePro logo - "Not bashful"
- "Powerful * Fair * Transparent" tagline sets the tone
- Restaurant/kitchen imagery in hero sections
- Dark backgrounds with bold color pops
- NO white-on-light-gray combinations

---

---

## Appendix F: Implementation Notes from Tom (Tim - Scattered General Notes)

### Application Versioning

| Version | Description | Key Features |
|---------|-------------|--------------|
| **Demo** | Marketing/preview tool | No login required, limited features |
| **Free Trial** | Full Version with expiration | Same as Full Version, countdown timer, data preservation |
| **Full Version** | Paid subscription | All features unlocked, no end date |

**Important:** There should be NO label called "Free Trial" visible to customers. The Free Trial IS the Full Version but with Pop Up countdown reminders at end of Trial Period reminding them to subscribe or lose data.

### Trial Period Implementation

| Feature | Specification |
|---------|---------------|
| Duration | Covers 2 pay periods plus buffer |
| Countdown Display | Visible to all users |
| Alert Timing | Last 10 days: daily countdown; Last 5 days: email + text to Admin |
| End Date | Set by TipSharePro before sending trial |
| Data Persistence | All data preserved if converted to paid |

### Multi-Location Architecture

- Free Trial/Full Version with single Location is normal
- Multi-unit operators: One Free Trial/Full Version per location
- Admin Login/Password with 2FA required for each location's settings
- User Login/Password opens only assigned location

### Data Entry & Archiving Rules

| Rule | Implementation |
|------|----------------|
| Data Correction | Manager/User can only correct CURRENT data for mistakes |
| Auto Archive | ONE archive event: Day after Pay Day |
| YTD to EOY | Automatic archiving |
| Prepaid Entries | Must flow to YTD and EOY totals; reside "outside the normal table" |

### Scenario Sand Box Data Flow

- Day after first Pay Day (after Launch Date): Current settings + distribution table → Scenario Sand Box
- Repeats after every pay day
- Purpose: Most recent data available for fixing mistakes and experimenting

### Employee Data Management

| Scenario | Handling |
|----------|----------|
| New Employee Entry | Job category chosen, weight auto-filled |
| Distribution Notice | Job category NOT printed (weights never shown) |
| Employee Name Change | Program should ask: new, rehired, or name change |
| Terminated Employee | Archived YTD and EOY data preserved |
| Multiple Pay Periods | Changes in current period must update next period if already visible |

**Data Entry Restrictions:**
- Data entry role CANNOT change weights
- ?NOTE: "Be sure of the job category assigned when entering new employees or when a current employee is promoted, demoted or otherwise job reassigned"
- ?NOTE: "Mistakes most often repeated: forgetting to enter New Employee, Entering Job Category incorrectly, not being told about Job Category reassignment"

### Session & Security

| Feature | Specification |
|---------|---------------|
| Session Timeout | Automatic for inactive user with countdown reminder |
| 2FA Method | Email or SMS only (no authenticator app - Tom "hates authenticator") |
| Device Authorization | As specified in security requirements |

### Distribution Table Specifics

- Daily Entry: Pay period total at bottom follows to PP Contribution Sheet
- Grand Total pool amount auto-fills proper cell on PP Contribution sheet
- Individual wage criteria NOT included in posted version
- Job Roles included in Final Posted report
- Job Weights NOT included in Final Posted report
- Allow Printing from Scenario Sand Box for evidence documentation

### Change Tracking Requirements

Per Tom: "We need to Log Changes in Admin Settings by date, location, what critical area etc. to Database. Best there be a record of who changed what in an un-editable way."

Purpose: "If someone goes in and changes a variable and thinks it wise to blame my program I can produce the entries through my portal."

---

## Appendix G: Logo & Brand Assets

### Logo Files Received (January 9, 2026)

| File | Description | Use Case |
|------|-------------|----------|
| fulllogo.png | Full logo with "TipSharePro.com" text + tagline | Marketing materials, website header |
| fulllogo_transparent.png | Same as above, transparent background | Over images/colored backgrounds |
| icononly_transparent_nobuffer.png | Icon mark only (pages + arrow) | App icon, favicon, small displays |
| textonly.png | Text wordmark "TipSharePro.com" + tagline | Text-only contexts |

### Brand Colors (Extracted from Logo)

| Color | Hex (Approximate) | Usage |
|-------|-------------------|-------|
| **Burnt Orange** | #E85D04 | Primary CTA, "TipSharePro" text |
| **Lime Green** | #82B536 | Success indicators, "POWERFUL * FAIR * TRANSPARENT" tagline |
| **Navy Blue** | #1A4B7C | Trust elements, depth in pages icon |
| **Cyan/Light Blue** | #35A0D2 | Accessibility, friendliness, page highlights |

### Tagline
**"POWERFUL * FAIR * TRANSPARENT"**

---

## Appendix H: Current Website Design Reference

Based on screenshots of www.tipsharepro.com (January 9, 2026):

### Visual Style

| Element | Current Implementation |
|---------|----------------------|
| **Hero Section** | Dark background with kitchen imagery, bold white headlines |
| **Primary CTA** | Burnt orange buttons (#E85D04) |
| **Typography** | Bold sans-serif headlines, clean body text |
| **Cards** | White background with subtle shadows on light gray sections |
| **Icons** | Orange icon badges in feature sections |
| **Footer** | Dark charcoal with orange accent CTA |

### Content Sections

1. **Hero**: "Get Your BOH a Share They Deserve" with kitchen staff imagery
2. **How It Works**: 4-step process with numbered icons
3. **Why Restaurants Choose TipSharePro**: 6 benefit cards (2x3 grid)
4. **FAQ**: Accordion-style expandable questions
5. **Request a Demo**: Form with orange submit button
6. **Footer CTA**: "This Program Will Get $$ to Your Chain of Service"

### Design Direction from Tom

> "Don't get too enamored with the pastel accents... throw in some color or I'll fade off to sleep. Take a look at my Logo. Not bashful."

**Key Takeaway:** The application design should match the BOLD energy of the current website and logo - not pastel or muted.

---

## Appendix I: Tom's Process Directive (January 15, 2026)

### Build More, Document Less

**Tom's exact words:**
> "I was expecting to see an actual demo settings page mock up that you were working on, but this is still an overview of the whole program. Got me jazzed! Back to the boring nuts and bolts, I guess."
>
> "**I want to see some buttons!**"
>
> "I can see why this exercise helps but I feel like I need to stop talking about all the steps we're going to take and **take some steps.**"
>
> "After this if you feel the need for another PDR **just show me the changes. I don't need another 15 pages of reading material!**"

### Interpretation for Development

| Directive | Action |
|-----------|--------|
| "I want to see buttons" | Prioritize working UI over documentation |
| "Take some steps" | Start building the Demo Settings Page immediately |
| "Just show changes" | Future PRD updates as diffs only, not full rewrites |
| "No 15 pages of reading" | Keep documentation focused and actionable |

### Next Steps (Per Tom's Direction)

1. **IMMEDIATE:** Build Demo Settings Page mockup with real buttons
2. **SHOW:** Working inline Distribution Preview
3. **DELIVER:** Printable Demo Distribution Table
4. **FOCUS:** Dark design + bold logo colors
5. **STOP:** Extensive documentation until requested

### Demo Week Timeline Question

Tom's observation: "Now if they have it for a week, I'm going to wonder what they're waiting for?!"
- Implies Demo should have sense of urgency
- One week is expected decision timeline
- If prospect takes longer → they may not be serious

---

---

## Appendix J: EOY Data & Allocations (January 11, 2026)

### Reference Files

Tom provided working Excel files showing actual distribution and EOY allocation workflows:

| File | Purpose | Key Data |
|------|---------|----------|
| Sample Dist. w-Pre Paids.xlsx | Distribution page with pre-paid handling | Hours × Rate × Weight calculation in action |
| Server Tip Allocations 2025.xls | EOY tip allocations for IRS reporting | Auto-fill columns from pay period data |

### Distribution Table Structure (from Sample Dist.)

| Column | Source | Notes |
|--------|--------|-------|
| Name | Employee roster | |
| Hours | Pay period entries | Editable |
| Rate | Employee record | Hourly wage |
| Variance | Job category weights | Hidden from posted report |
| Basis | Calculated: Hours × Rate × Variance | **HIDDEN - never shown to users** |
| % | Share percentage | Basis / Total Basis |
| Share | Calculated share | Pool × % |
| Received | Rounded amount | Whole dollars |
| Actual Share | Final distributed amount | With adjustments |

### Pre-Paid Handling

The "Sample Dist. w-Pre Paids.xlsx" shows how pre-paid entries work:
- Pre-paid entries appear OUTSIDE the normal distribution table
- Used for corrections, advances, or makeup payments
- Must flow to YTD and EOY totals
- Separate from standard pool calculation

### EOY Auto-Load Columns (from Server Tip Allocations)

At End of Year, the following columns should **auto-populate** from existing data:

| Column | Auto-Fill Source | Notes |
|--------|------------------|-------|
| **Name** | Employee roster | From active employee list |
| **Report Sales** | PP Contribution Log totals | Sum of all pay period sales |
| **8%** | Calculated | Report Sales × 0.08 (IRS minimum) |
| **Reported Tips** | Payroll data | What employee reported as tips |
| **Contribution** | PP Contribution totals | Sum of all contributions to pool |
| **Allocation** | Calculated | 8% − Reported Tips (allocation amount) |

### Sales Data Discrepancy Note

**Tom's insight:** "Report sales is exactly what we will have on their PP contribution log. Those sales will always be off from what their POS system will generate (as mine did). Ever since Covid we have done more take-out, so it reduced sales a lot."

- Server sales in tip pool ≠ POS total sales
- Take-out orders reduce reported sales (non-tipped transactions)
- The 8% calculation still applies to adjusted sales

### Borrowed Employees (Multi-Location Issue)

**Challenge:** Employees who work at multiple locations (marked with * in Tom's spreadsheet) need EOY data matched across locations.

| Issue | Tom's Experience |
|-------|-----------------|
| Data matching | "Only an issue if their units are close together as mine were" |
| Example employees | *Cheyenne Brooks, *Laura Lagunas Hern, *Jessica Brewster (worked at multiple stores) |
| Resolution | Final "From All Stores" column combines allocations |

### Implementation Requirements

1. **Distribution Page:**
   - Reference "Sample Dist. w-Pre Paids.xlsx" for layout
   - Include Pre-Paid section below main table
   - Hide Variance (weight) and Basis columns in posted version

2. **EOY Page (Page 9 - All Allocations):**
   - Auto-populate from YTD data
   - Calculate 8% IRS allocation per employee
   - Flag borrowed employees working multiple locations
   - Provide "From All Stores" combined total column

3. **Borrowed Employee Matching:**
   - System should identify employees by unique ID across locations
   - Aggregate EOY data from all locations where employee worked
   - Display combined allocation in final column

---

*This document is ready for stakeholder review. Future updates will be focused on CHANGES ONLY per Tom's directive.*
