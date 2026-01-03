# Tip Share Pro - Web Application Build Plan

## Project Overview

**Client:** Tom (tlachaussee)
**Product:** Tip Share Pro - A commercial tip pooling/sharing system for restaurants
**Target Users:** Restaurant owners and managers
**Key Value Prop:** Fair, transparent, compliant tip distribution using the Hours x Rate x Variance formula

---

## Phase 1: Foundation & Architecture (Days 1-2)

### 1.1 Technology Stack Selection

**Frontend:**
- React 18+ with TypeScript for type safety
- Tailwind CSS for rapid, professional styling
- React Hook Form for form handling
- Recharts or Chart.js for data visualization
- React Router for navigation

**Backend:**
- Node.js with Express OR Next.js (API routes)
- PostgreSQL for relational data (employees, pay periods, locations)
- Prisma ORM for database management
- JWT authentication for user sessions

**Deployment:**
- Vercel or Railway for hosting
- Supabase or Neon for managed PostgreSQL
- Future: can integrate with Tom's WordPress site at app.domain.com

### 1.2 Database Schema Design

```
Tables:
├── organizations
│   ├── id, name, created_at
│   └── tip_contribution_rate (default 3.25%)
│
├── locations
│   ├── id, organization_id, name, location_number
│   └── active status
│
├── employees
│   ├── id, location_id, name
│   ├── job_category (server, busser, cook, etc.)
│   ├── hourly_rate
│   ├── variance_factor (management's assessment)
│   └── active status
│
├── pay_periods
│   ├── id, organization_id, start_date, end_date
│   └── status (open, closed, finalized)
│
├── daily_contributions
│   ├── id, pay_period_id, location_id, employee_id
│   ├── date, sales_amount
│   └── tip_contribution (calculated: sales × rate)
│
├── pool_shares
│   ├── id, pay_period_id, employee_id
│   ├── hours_worked, hourly_rate, variance
│   ├── basis (calculated: hours × rate × variance)
│   ├── percentage, share_amount
│   └── received_date
│
└── ytd_records
    ├── id, employee_id, year
    ├── total_contributions, total_shares
    └── w2_reported status
```

### 1.3 Project Structure

```
tip-share-pro/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── forms/
│   │   │   ├── DailyContributionForm.tsx
│   │   │   ├── EmployeeForm.tsx
│   │   │   └── PayPeriodForm.tsx
│   │   ├── tables/
│   │   │   ├── ContributionTable.tsx
│   │   │   ├── PoolSharesTable.tsx
│   │   │   └── YTDTable.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       └── Modal.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── DailyEntry.tsx
│   │   ├── PayPeriodSummary.tsx
│   │   ├── PoolCalculation.tsx
│   │   ├── YTDReports.tsx
│   │   ├── W2Export.tsx
│   │   └── Settings.tsx
│   ├── hooks/
│   ├── utils/
│   │   └── calculations.ts (THE HIDDEN SECRET SAUCE)
│   ├── api/
│   └── types/
├── prisma/
│   └── schema.prisma
└── public/
```

---

## Phase 2: Core UI Components (Days 3-5)

### 2.1 Navigation & Layout

**Sidebar Navigation:**
1. Dashboard (overview/home)
2. Daily Entry (Step 1 equivalent)
3. Pay Period Summary (Step 2 - contributions)
4. Pool Calculation (Step 2 - shares)
5. YTD Reports
6. W2 Export
7. Settings (employees, locations, rates)

**Header:**
- Current pay period selector
- Location selector (for multi-location)
- User menu / logout
- Notification area

### 2.2 Dashboard Page

Display at-a-glance metrics:
- Current pay period status
- Total pool amount
- Number of employees participating
- Quick entry button for today's contributions
- Recent activity feed
- Mini chart showing pool trends

### 2.3 Design System

**Color Palette:**
- Primary: Deep blue (#1e3a5f) - professional, trustworthy
- Accent: Green (#22c55e) - money/success connotation
- Background: Light gray (#f8fafc)
- Cards: White with subtle shadow
- Text: Dark gray (#1f2937)

**Typography:**
- Headings: Inter or Poppins (modern, clean)
- Body: System fonts for readability
- Numbers/Money: Tabular figures for alignment

**Visual Style:**
- Clean, minimal interface
- Card-based layout
- Generous whitespace
- Clear data hierarchy
- Print-optimized views

---

## Phase 3: Step 1 - Daily Contribution Entry (Days 6-8)

### 3.1 Daily Entry Interface

**Screen: Daily Tip Contributions**

Layout:
```
┌─────────────────────────────────────────────────────────┐
│  Pay Period: Dec 14-27, 2024    Location: #28          │
├─────────────────────────────────────────────────────────┤
│  ◄ Dec 15   │   December 16, 2024   │   Dec 17 ►       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Server Name          Sales      Tip Contribution       │
│  ─────────────────────────────────────────────────      │
│  Sarah Johnson       $1,245.00        $40.46            │
│  Mike Chen           $1,089.50        $35.41            │
│  Lisa Park             $967.25        $31.44            │
│  [+ Add Server Entry]                                   │
│                                                         │
│  ─────────────────────────────────────────────────      │
│  Daily Total         $3,301.75       $107.31            │
│                                                         │
│           [Save Day]    [Save & Next Day]               │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Features

- Date navigation (previous/next day)
- Auto-calculate tip contribution (Sales × 3.25%)
- Add/remove server entries
- Running daily total
- Visual indicator for days with/without entries
- Copy previous day's servers (quick entry)
- Validation: prevent negative numbers, require all fields

### 3.3 API Endpoints

```
GET    /api/contributions/:payPeriodId/:date
POST   /api/contributions
PUT    /api/contributions/:id
DELETE /api/contributions/:id
GET    /api/contributions/:payPeriodId/summary
```

---

## Phase 4: Step 2A - Pay Period Contribution Summary (Days 9-10)

### 4.1 Server PP Contribution View

**Screen: Pay Period Contribution Summary**

```
┌─────────────────────────────────────────────────────────┐
│  Pay Period Ending: December 27, 2024                  │
│  Location: #28 - Downtown                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Server         Total Sales    Rate    Contribution    │
│  ──────────────────────────────────────────────────    │
│  Sarah Johnson   $12,450.00   3.25%      $404.63       │
│  Mike Chen       $10,895.00   3.25%      $354.09       │
│  Lisa Park        $9,672.50   3.25%      $314.36       │
│  Tom Wilson       $8,234.00   3.25%      $267.61       │
│  ──────────────────────────────────────────────────    │
│  TOTALS          $41,251.50             $1,340.69      │
│                                                         │
│           [View Daily Breakdown]  [Export PDF]         │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Features

- Aggregates all daily entries for the pay period
- Shows per-server totals
- Drill-down to daily breakdown per server
- Export to PDF for records
- Filter by location (multi-location support)

---

## Phase 5: Step 2B - Pool Calculation Engine (Days 11-14)

### 5.1 The Core Algorithm (Server-Side, Hidden)

This is the "secret sauce" that stays protected:

```typescript
// utils/calculations.ts - SERVER SIDE ONLY

interface Employee {
  id: string;
  name: string;
  hoursWorked: number;
  hourlyRate: number;
  varianceFactor: number; // Management's assessment (0.5 - 2.0 typically)
}

interface PoolShare {
  employeeId: string;
  name: string;
  hours: number;
  rate: number;
  variance: number;
  basis: number;      // hours × rate × variance
  percentage: number; // basis / totalBasis
  share: number;      // totalPool × percentage
}

function calculatePoolShares(
  employees: Employee[],
  totalPool: number
): PoolShare[] {
  // Calculate basis for each employee
  const withBasis = employees.map(emp => ({
    ...emp,
    basis: emp.hoursWorked * emp.hourlyRate * emp.varianceFactor
  }));

  // Calculate total basis
  const totalBasis = withBasis.reduce((sum, emp) => sum + emp.basis, 0);

  // Calculate percentage and share for each
  return withBasis.map(emp => ({
    employeeId: emp.id,
    name: emp.name,
    hours: emp.hoursWorked,
    rate: emp.hourlyRate,
    variance: emp.varianceFactor,
    basis: emp.basis,
    percentage: totalBasis > 0 ? emp.basis / totalBasis : 0,
    share: totalBasis > 0 ? totalPool * (emp.basis / totalBasis) : 0
  }));
}
```

### 5.2 Pool Share Distribution View

**Screen: Tip Pool Share Calculation**

```
┌──────────────────────────────────────────────────────────────────────┐
│  Pay Period Ending: December 27, 2024                               │
│  Total Pool: $1,340.69                                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Employee       Hours   Rate    Var   Basis     %      Share        │
│  ────────────────────────────────────────────────────────────────   │
│  Sarah (Server)  72    $18.00  1.2   $1,555   23.4%   $313.72       │
│  Mike (Server)   68    $17.50  1.1   $1,309   19.7%   $264.12       │
│  Lisa (Server)   64    $16.00  1.0   $1,024   15.4%   $206.47       │
│  Juan (Cook)     80    $22.00  0.8   $1,408   21.2%   $284.22       │
│  Amy (Busser)    60    $15.00  0.9   $810     12.2%   $163.56       │
│  Dan (Host)      45    $14.00  0.7   $441      6.6%    $88.53       │
│  ────────────────────────────────────────────────────────────────   │
│  TOTALS         389                  $6,647   100%   $1,340.69      │
│                                                                      │
│        [Adjust Variance]   [Finalize Period]   [Print Report]       │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.3 Key Features

- **Variance Factor Editor:** Management can adjust each employee's variance
- **Real-time Recalculation:** As variance changes, shares update instantly
- **What-if Scenarios:** Test different configurations before finalizing
- **Audit Trail:** Log all changes for compliance
- **Finalize & Lock:** Once approved, period cannot be modified

### 5.4 Important UX Decisions

1. **Show Basis Column?**
   - Client mentioned hiding this - make it optional/collapsible
   - "Simple View" vs "Detailed View" toggle

2. **Variance Explanation:**
   - Tooltip explaining what variance means
   - Suggested ranges per job category
   - Historical comparison

---

## Phase 6: YTD Reports & W2 Export (Days 15-17)

### 6.1 YTD Summary View

**Screen: Year-to-Date Summary**

```
┌─────────────────────────────────────────────────────────────────┐
│  Year: 2024                                                    │
│  Location: All Locations                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Employee       Periods  Total Hours  Contributed   Received   │
│  ──────────────────────────────────────────────────────────    │
│  Sarah Johnson    26        1,872      $4,892.50   $6,234.18   │
│  Mike Chen        26        1,768      $4,234.00   $5,892.34   │
│  Lisa Park        24        1,536      $3,892.00   $4,567.23   │
│  Juan Martinez    26        2,080         $0.00   $7,234.56   │
│  ...                                                           │
│                                                                 │
│           [Filter by Location]  [Export to CSV]  [W2 Report]   │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 W2 Export Feature

**Screen: W2 Data Export**

- Select tax year
- Generate IRS-compliant tip income report
- Format options: CSV, PDF, or direct payroll service format
- Shows: Employee, SSN (masked), Total Tips Received, Tips Contributed
- Compliance notes and documentation

---

## Phase 7: Settings & Configuration (Days 18-19)

### 7.1 Settings Pages

**Organization Settings:**
- Company name, contact info
- Default tip contribution rate (3.25%)
- Pay period configuration (weekly, bi-weekly)

**Location Management:**
- Add/edit/deactivate locations
- Location-specific settings

**Employee Management:**
- Add/edit employees
- Assign job categories
- Set hourly rates
- Set variance factors
- Assign to locations
- View individual history

**Job Categories:**
- Define categories (Server, Busser, Cook, Host, etc.)
- Suggested variance ranges per category
- Default rates

### 7.2 User Access Control (Future)

- Admin (full access)
- Manager (location-specific)
- View-only (reports only)

---

## Phase 8: Polish & Professional Feel (Days 20-22)

### 8.1 Print Layouts

Create print-optimized CSS for:
- Daily contribution sheets
- Pay period summaries
- Pool share distribution reports
- YTD summaries
- W2 export documents

**Print Features:**
- Clean headers with company branding
- Proper page breaks
- Totals on each page
- Date/time stamps
- Page numbers

### 8.2 Data Visualization

Add charts to dashboard:
- Pool amount trend (line chart)
- Distribution by job category (pie/donut)
- Individual earnings over time
- Location comparison (bar chart)

### 8.3 Responsive Design

- Desktop-first design (primary use case)
- Tablet-friendly for on-floor use
- Mobile view for quick lookups

### 8.4 Loading States & Feedback

- Skeleton loaders for data
- Success/error toast notifications
- Confirmation modals for destructive actions
- Autosave indicators

---

## Phase 9: Security & Compliance (Days 23-24)

### 9.1 Data Protection

- All calculations server-side (IP protection)
- HTTPS only
- Encrypted database connections
- Input sanitization
- SQL injection prevention (Prisma handles this)

### 9.2 Authentication

- Secure login with email/password
- Password requirements
- Session management
- Optional 2FA (future)

### 9.3 Audit Trail

- Log all data changes
- Track who made changes
- Timestamp everything
- Report generation history

### 9.4 Compliance Features

- DLSE (California Department of Labor Standards Enforcement) reporting
- IRS tip income documentation
- Data retention policies
- Export all data (GDPR-style)

---

## Phase 10: Testing & Launch (Day 25)

### 10.1 Testing Checklist

- [ ] All calculations match Excel results exactly
- [ ] Multi-location scenarios work correctly
- [ ] Edge cases: zero hours, zero pool, single employee
- [ ] Print layouts render correctly
- [ ] Mobile responsiveness
- [ ] Form validation
- [ ] Error handling

### 10.2 Demo Data

Create realistic demo data:
- 3 locations
- 15-20 employees across locations
- 2-3 completed pay periods
- YTD data for demonstration

### 10.3 Handoff

- Deploy to staging URL for Tom's review
- Walkthrough video/documentation
- Gather feedback
- Iterate as needed

---

## Future Enhancements (Post-MVP)

### Subscription Features
- Free trial (1 location, 5 employees)
- Basic tier ($29/mo - 1 location, 20 employees)
- Pro tier ($79/mo - 5 locations, unlimited employees)
- Enterprise (custom pricing)

### Advanced Features
- Payroll service integrations (ADP, Gusto, etc.)
- Mobile app for servers to view their shares
- Tip declaration tracking
- Schedule integration
- POS system integration (Square, Toast, etc.)

### Analytics
- Benchmark comparisons
- Trend analysis
- Forecasting
- Labor cost optimization

---

## Development Timeline Summary

| Phase | Description | Days | Cumulative |
|-------|-------------|------|------------|
| 1 | Foundation & Architecture | 2 | 2 |
| 2 | Core UI Components | 3 | 5 |
| 3 | Daily Entry (Step 1) | 3 | 8 |
| 4 | PP Contribution Summary | 2 | 10 |
| 5 | Pool Calculation Engine | 4 | 14 |
| 6 | YTD & W2 Reports | 3 | 17 |
| 7 | Settings & Config | 2 | 19 |
| 8 | Polish & Professional Feel | 3 | 22 |
| 9 | Security & Compliance | 2 | 24 |
| 10 | Testing & Launch | 1 | 25 |

**Total: ~25 working days / ~18-25 billable hours**

---

## Mockup Deliverable (For Free Proof of Concept)

For the initial free mockup to show Tom, create:

1. **Figma/Design Mockup** OR **Functional Prototype** showing:
   - Dashboard with sample data
   - Daily entry screen flow
   - Pool calculation screen with live calculation
   - One print-ready report

2. **Key Demo Points:**
   - Show how easy data entry is vs Excel
   - Demonstrate the "hidden" calculation (user sees result, not formula)
   - Show professional print output
   - Highlight multi-location capability
   - Demonstrate the "digital brochure" feel

3. **Talking Points:**
   - IP protection (calculations on server)
   - No Excel license needed for customers
   - Works on any device
   - Updates pushed instantly to all users
   - Professional, sellable product feel

---

## Files Reference

Based on Tom's Excel sheets:

**Step 1 - Server Daily Contribution:**
- 3 sheets for 3 locations (#28, #17, #12)
- 14-day pay periods
- Columns: Date, Server Names, Grand Total
- Simple SUM formulas

**Step 2 - Pay Period Pool Totals:**
- Server PP Contribution sheet
- Tip Pool Shares sheet (the core calculation)
- Key formula: Hours × Rate × Variance = Basis

**Additional sheets needed:**
- YTD tracking (aggregate by employee, by year)
- W2 reporting (payroll service format)

---

*Plan created: December 12, 2024*
*For: Tom (tlachaussee) - Tip Share Pro Web Application*
