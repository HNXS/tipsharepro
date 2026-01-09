# Tip Share Pro - Product Requirements Document

**Document Version:** 2.0
**Date:** January 9, 2026
**Author:** Product Management
**Client:** Tom LaChaussee (tlachaussee)
**Developer:** Tim Heineccius (Heineccius Consulting)
**Last Updated:** January 9, 2026 - Incorporated Tom's feedback and detailed specifications

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
DEMO (Phase 1)          FREE TRIAL (Phase 2)        FULL VERSION (Phase 3)
------------------      --------------------        ---------------------
Settings Preview        All Demo Features +         All Free Trial Features +
Data Entry Demo         Real Authentication         Payment Processing
Results Preview         2FA Security                Multi-Location Support
No Login Required       Cloud Storage               YTD Archiving
Limited Functionality   Full Calculations           W2 Reporting
Marketing Tool          45-Day Trial                Admin Command Center
                        Scenario Sand Box           Expert Portal
```

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

### Phase 1: Demo (Current Priority)
- Static/interactive demo for marketing
- No authentication
- Settings preview (some features blocked)
- Sample data entry
- Results/distribution display
- PDF print capability
- Lives on TipSharePro.com landing page
- **Timeline:** First deliverable

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

#### Remaining Gaps:

5. **Prepaid Entry Handling:**
   - Exact workflow for adjustments via prepaid line needs detailed specification
   - Prepaid amounts must flow to YTD and EOY totals
   - Employees in prepaid section "reside outside the normal table"

6. **Trial Period Implementation:**
   - Free Trial IS the Full Version (no "Free Trial" label visible to customer)
   - Daily countdown display in last 10 days (or similar)
   - Last 5 days: Email and text alerts to Administrator
   - Functionality end date set by TipSharePro when sending trial

7. **Trial-to-Paid Data Migration:**
   - Does trial data persist when converting to paid? (Assumed YES)
   - Any cleanup or verification required?

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

## Job Categories & Weights (Detailed Specification)

### Predefined Job Categories

| Kitchen (BOH) | Front of House | Bar |
|---------------|----------------|-----|
| Lead Cook | Maitre D | Barista |
| Line Cook | Host/Hostess | Bartender |
| Pastry Chef | Cashier | Sommelier |
| Prep Cook | Runner | Bar Back |
| Pantry Chef | Busser | Dishwasher |

**Plus 5 write-in positions** for custom roles not listed.

### Weight System

- Range: 1 – 5 in 0.25 increments (17 options)
- Weight 1: Lowest share component in pool
- Weight 5: Highest share component in pool
- Everyone in same Job Category gets same weight

**Example Scenario (Clam Shuckers):**
- Regular shuckers: Weight 3
- Lead Shucker (super star, non-supervisory): Weight 5, own category
- Combined with higher hourly wage = appropriately larger share

### Key Principles

1. **Hours x Rate x Weight** formula rewards:
   - Experience (reflected in hourly rate)
   - Hours worked
   - Job category impact on customer satisfaction

2. **TipSharePro differentiator:** Wages as a factor
   - "The single biggest determining factor of who is contributing most to the Chain of Service"

3. **Fairness over equality:**
   - "If the pool was done on a straight hours worked times a single job category weight, the Doctor and the Nurses would get the same rate per hour. That would be weird and frankly un-American."

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

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-08 | PM | Initial comprehensive PRD |
| 2.0 | 2026-01-09 | PM | Added Tom's feedback: 9-page flow chart, Scenario Sand Box detailed specs, Admin Role specifications, Job Categories & Weights detail, ?Note/!!Note help system, resolved Q&A items, detailed contribution criteria explanation |

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

## Appendix E: Design Feedback from Tom (January 9, 2026)

### Color Preferences

| Element | Tom's Feedback |
|---------|----------------|
| Foundation colors | "Mostly cool" - approved |
| Text colors | "Like it" - approved |
| "Mahogany" color | Came through as dark olive - "I like the dark olive" |
| Pastel accents | "Don't get too enamored" - wants more bold color |
| Overall | "Throw in some color or I'll fade off to sleep" |
| Logo reference | "Take a look at my Logo. Not bashful." |

### Logo Colors to Reference
- **Orange** (#E85D04 approximate) - Bold, primary brand color
- **Lime Green** (#82B536 approximate) - Growth, success, transparency
- **Navy Blue** (#1A5276 approximate) - Trust, professionalism
- **Light Blue/Cyan** (#3498DB approximate) - Accessibility, friendliness

### Design Direction
- Less pastel, more bold colors
- Match energy of the TipSharePro logo
- "Powerful * Fair * Transparent" tagline sets the tone
- Restaurant/kitchen imagery in hero sections

---

*This document is ready for stakeholder review. All specifications meet the standards of being unambiguous, testable, traceable, complete, and feasible.*
