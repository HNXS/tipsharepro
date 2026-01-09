# Tip Share Pro - System Architecture Document

**Document Version:** 1.0
**Date:** January 8, 2026
**Author:** System Architecture
**Status:** Ready for Review

---

## Executive Summary

### Project Overview

Tip Share Pro is a multi-tenant SaaS platform for restaurant tip pooling and distribution. The system calculates fair tip distributions using a proprietary **Hours × Rate × Weight** algorithm while providing compliance tracking, tax documentation, and transparent reporting for restaurant teams.

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Architecture Style** | Monolithic with modular boundaries | MVP speed; clear path to microservices if needed |
| **Frontend Framework** | React 18 + TypeScript | Component ecosystem, type safety, team familiarity |
| **Backend Framework** | Node.js + Express + TypeScript | Full-stack TypeScript, excellent async handling |
| **Database** | PostgreSQL 15 | ACID compliance, JSON support, multi-tenant row-level security |
| **ORM** | Prisma | Type-safe queries, excellent migrations, PostgreSQL RLS support |
| **Authentication** | Custom JWT + Refresh Tokens | Control over 2FA flow, role-based access |
| **Hosting** | Vercel (Frontend) + Railway (Backend + DB) | Rapid deployment, built-in SSL, scalable |
| **Payments** | Stripe | Industry standard, subscription management, webhooks |

### Technology Stack Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  React 18 │ TypeScript │ Zustand │ React Query │ React Router   │
│  CSS Modules │ Design Tokens │ Fraunces/JetBrains Mono Fonts   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  Express.js │ TypeScript │ JWT Auth │ Rate Limiting │ CORS      │
│  Zod Validation │ Error Handling Middleware │ Request Logging  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  TipCalculationService │ AuthService │ OrganizationService      │
│  EmployeeService │ PayPeriodService │ ReportService            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  Prisma ORM │ PostgreSQL 15 │ Row-Level Security │ Redis Cache  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│  Stripe (Payments) │ SendGrid (Email) │ Twilio (SMS 2FA)       │
└─────────────────────────────────────────────────────────────────┘
```

### Critical Technical Constraints

1. **Algorithm Security**: The "Basis" calculation (Hours × Rate × Weight) must NEVER be exposed to API responses or client
2. **Multi-Tenancy**: Absolute data isolation between organizations using PostgreSQL Row-Level Security
3. **Financial Precision**: All monetary calculations use integer cents (not floating point)
4. **2FA Requirement**: Email or SMS only (no authenticator apps per client requirement)
5. **Dark Theme Default**: "Amber Hour" palette with warm, accessible colors

---

## System Component Architecture

### Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              TIP SHARE PRO                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                         WEB APPLICATION                            │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │  │
│  │  │  Auth Module │ │  Dashboard   │ │  Daily Entry │ │  Reports   │ │  │
│  │  │              │ │              │ │              │ │            │ │  │
│  │  │ - Login      │ │ - Stats      │ │ - Date Nav   │ │ - PDF Gen  │ │  │
│  │  │ - 2FA        │ │ - Charts     │ │ - Grid Entry │ │ - YTD View │ │  │
│  │  │ - Register   │ │ - Activity   │ │ - Validation │ │ - Export   │ │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │  │
│  │                                                                     │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │  │
│  │  │   Settings   │ │ Pool Calc    │ │  Employees   │ │  Sandbox   │ │  │
│  │  │              │ │              │ │              │ │            │ │  │
│  │  │ - Org Config │ │ - Algorithm  │ │ - Roster     │ │ - What-If  │ │  │
│  │  │ - Locations  │ │ - Results    │ │ - Categories │ │ - Testing  │ │  │
│  │  │ - Job Cats   │ │ - Print      │ │ - Rates      │ │ - Preview  │ │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                    │                                      │
│                                    ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                           API SERVER                               │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐  │  │
│  │  │   Auth API  │ │   Core API  │ │  Reports API│ │  Admin API   │  │  │
│  │  │             │ │             │ │             │ │              │  │  │
│  │  │ POST /login │ │ /employees  │ │ /reports/*  │ │ /admin/*     │  │  │
│  │  │ POST /2fa   │ │ /entries    │ │ /export     │ │ /command     │  │  │
│  │  │ POST /token │ │ /periods    │ │ /pdf        │ │ /accounts    │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └──────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                    │                                      │
│                                    ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                         BUSINESS LOGIC                             │  │
│  │  ┌─────────────────────────────────────────────────────────────┐   │  │
│  │  │              TIP CALCULATION ENGINE (CORE)                  │   │  │
│  │  │                                                             │   │  │
│  │  │  calculatePoolDistribution(periodId):                       │   │  │
│  │  │    1. Fetch all employees with hours for period             │   │  │
│  │  │    2. For each employee:                                    │   │  │
│  │  │       basis = hours × rate × weight  ← NEVER EXPOSE         │   │  │
│  │  │    3. totalBasis = SUM(all basis values)                    │   │  │
│  │  │    4. For each employee:                                    │   │  │
│  │  │       percentage = basis / totalBasis                       │   │  │
│  │  │       share = totalPool × percentage                        │   │  │
│  │  │    5. Apply rounding reconciliation                         │   │  │
│  │  │    6. Return shares (WITHOUT basis column)                  │   │  │
│  │  └─────────────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                    │                                      │
│                                    ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                          DATA STORES                               │  │
│  │  ┌─────────────────────┐              ┌─────────────────────┐      │  │
│  │  │     PostgreSQL      │              │       Redis         │      │  │
│  │  │                     │              │                     │      │  │
│  │  │  - Organizations    │              │  - Session Store    │      │  │
│  │  │  - Users            │              │  - Rate Limiting    │      │  │
│  │  │  - Employees        │              │  - Calculation Cache│      │  │
│  │  │  - Daily Entries    │              │                     │      │  │
│  │  │  - Distributions    │              │                     │      │  │
│  │  │  - Audit Logs       │              │                     │      │  │
│  │  └─────────────────────┘              └─────────────────────┘      │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Module Responsibilities

| Module | Responsibility | Key Dependencies |
|--------|----------------|------------------|
| **Auth Module** | Login, 2FA, session management, password reset | JWT, bcrypt, Redis |
| **Dashboard** | Statistics, activity feed, quick actions | React Query, Charts |
| **Daily Entry** | Server sales/contribution input, date navigation | Form validation, autosave |
| **Pool Calculation** | Run algorithm, display results, print reports | Calculation engine |
| **Employees** | Roster management, job categories, rates | CRUD operations |
| **Settings** | Organization config, locations, weights | Admin-only access |
| **Reports** | YTD summaries, PDF generation, CSV export | PDF library, data aggregation |
| **Sandbox** | What-if scenarios, isolated calculations | Cloned data context |

---

## Database Architecture

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATABASE SCHEMA                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐
│   organizations     │         │       users         │
├─────────────────────┤         ├─────────────────────┤
│ id (PK, UUID)       │◄────────│ organization_id (FK)│
│ name                │         │ id (PK, UUID)       │
│ subscription_status │         │ email               │
│ stripe_customer_id  │         │ password_hash       │
│ trial_ends_at       │         │ role                │
│ settings (JSONB)    │         │ two_factor_enabled  │
│ created_at          │         │ two_factor_method   │
│ updated_at          │         │ location_id (FK)    │
└─────────────────────┘         │ created_at          │
         │                      └─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐         ┌─────────────────────┐
│     locations       │         │   job_categories    │
├─────────────────────┤         ├─────────────────────┤
│ id (PK, UUID)       │◄───┐    │ id (PK, UUID)       │
│ organization_id (FK)│    │    │ organization_id (FK)│
│ name                │    │    │ name                │
│ number              │    │    │ weight              │
│ status              │    │    │ badge_color         │
│ created_at          │    │    │ created_at          │
└─────────────────────┘    │    └─────────────────────┘
         │                 │              │
         │ 1:N             │              │ 1:N
         ▼                 │              ▼
┌─────────────────────┐    │    ┌─────────────────────┐
│     employees       │────┘    │                     │
├─────────────────────┤◄────────┤                     │
│ id (PK, UUID)       │         │                     │
│ organization_id (FK)│         │                     │
│ location_id (FK)    │         │                     │
│ job_category_id (FK)│─────────┘                     │
│ name                │                               │
│ hourly_rate_cents   │                               │
│ status              │                               │
│ hired_at            │                               │
│ terminated_at       │                               │
│ created_at          │                               │
└─────────────────────┘                               │
         │                                            │
         │ 1:N                                        │
         ▼                                            │
┌─────────────────────┐         ┌─────────────────────┐
│    pay_periods      │         │   daily_entries     │
├─────────────────────┤         ├─────────────────────┤
│ id (PK, UUID)       │◄────────│ pay_period_id (FK)  │
│ organization_id (FK)│         │ id (PK, UUID)       │
│ location_id (FK)    │         │ employee_id (FK)    │
│ start_date          │         │ date                │
│ end_date            │         │ sales_cents         │
│ status              │         │ calculated_contrib  │
│ total_pool_cents    │         │ actual_contrib_cents│
│ calculated_at       │         │ entered_by (FK)     │
│ created_at          │         │ created_at          │
└─────────────────────┘         └─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐         ┌─────────────────────┐
│   distributions     │         │     audit_logs      │
├─────────────────────┤         ├─────────────────────┤
│ id (PK, UUID)       │         │ id (PK, UUID)       │
│ pay_period_id (FK)  │         │ organization_id (FK)│
│ employee_id (FK)    │         │ user_id (FK)        │
│ hours_worked        │         │ action              │
│ rate_at_time_cents  │         │ entity_type         │
│ weight_at_time      │         │ entity_id           │
│ basis (HIDDEN)      │◄────────│ before_values(JSONB)│
│ percentage          │  NEVER  │ after_values (JSONB)│
│ share_cents         │  EXPOSE │ ip_address          │
│ received_cents      │         │ user_agent          │
│ created_at          │         │ created_at          │
└─────────────────────┘         └─────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐
│   refresh_tokens    │         │   two_factor_codes  │
├─────────────────────┤         ├─────────────────────┤
│ id (PK, UUID)       │         │ id (PK, UUID)       │
│ user_id (FK)        │         │ user_id (FK)        │
│ token_hash          │         │ code_hash           │
│ device_info         │         │ method              │
│ expires_at          │         │ expires_at          │
│ created_at          │         │ attempts            │
└─────────────────────┘         │ created_at          │
                                └─────────────────────┘
```

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema", "postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [uuid_ossp(map: "uuid-ossp")]
}

// ============================================================================
// ORGANIZATION & MULTI-TENANCY
// ============================================================================

model Organization {
  id                 String             @id @default(uuid()) @db.Uuid
  name               String
  subscriptionStatus SubscriptionStatus @default(DEMO) @map("subscription_status")
  stripeCustomerId   String?            @unique @map("stripe_customer_id")
  trialEndsAt        DateTime?          @map("trial_ends_at")
  settings           Json               @default("{}")
  createdAt          DateTime           @default(now()) @map("created_at")
  updatedAt          DateTime           @updatedAt @map("updated_at")

  // Relations
  locations     Location[]
  users         User[]
  employees     Employee[]
  jobCategories JobCategory[]
  payPeriods    PayPeriod[]
  auditLogs     AuditLog[]

  @@map("organizations")
}

enum SubscriptionStatus {
  DEMO
  TRIAL
  ACTIVE
  SUSPENDED
  CANCELLED
}

model Location {
  id             String           @id @default(uuid()) @db.Uuid
  organizationId String           @map("organization_id") @db.Uuid
  name           String
  number         String?
  status         LocationStatus   @default(ACTIVE)
  createdAt      DateTime         @default(now()) @map("created_at")
  updatedAt      DateTime         @updatedAt @map("updated_at")

  // Relations
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  users        User[]
  employees    Employee[]
  payPeriods   PayPeriod[]

  @@unique([organizationId, number])
  @@map("locations")
}

enum LocationStatus {
  ACTIVE
  INACTIVE
}

// ============================================================================
// USERS & AUTHENTICATION
// ============================================================================

model User {
  id               String          @id @default(uuid()) @db.Uuid
  organizationId   String          @map("organization_id") @db.Uuid
  locationId       String?         @map("location_id") @db.Uuid
  email            String
  passwordHash     String          @map("password_hash")
  role             UserRole        @default(DESIGNEE)
  twoFactorEnabled Boolean         @default(false) @map("two_factor_enabled")
  twoFactorMethod  TwoFactorMethod? @map("two_factor_method")
  phone            String?
  lastLoginAt      DateTime?       @map("last_login_at")
  createdAt        DateTime        @default(now()) @map("created_at")
  updatedAt        DateTime        @updatedAt @map("updated_at")

  // Relations
  organization   Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  location       Location?        @relation(fields: [locationId], references: [id])
  refreshTokens  RefreshToken[]
  twoFactorCodes TwoFactorCode[]
  auditLogs      AuditLog[]
  dailyEntries   DailyEntry[]     @relation("EnteredBy")

  @@unique([organizationId, email])
  @@index([email])
  @@map("users")
}

enum UserRole {
  ADMIN
  MANAGER
  DESIGNEE
}

enum TwoFactorMethod {
  EMAIL
  SMS
}

model RefreshToken {
  id         String   @id @default(uuid()) @db.Uuid
  userId     String   @map("user_id") @db.Uuid
  tokenHash  String   @map("token_hash")
  deviceInfo String?  @map("device_info")
  expiresAt  DateTime @map("expires_at")
  createdAt  DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([tokenHash])
  @@map("refresh_tokens")
}

model TwoFactorCode {
  id        String          @id @default(uuid()) @db.Uuid
  userId    String          @map("user_id") @db.Uuid
  codeHash  String          @map("code_hash")
  method    TwoFactorMethod
  expiresAt DateTime        @map("expires_at")
  attempts  Int             @default(0)
  createdAt DateTime        @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("two_factor_codes")
}

// ============================================================================
// EMPLOYEES & JOB CATEGORIES
// ============================================================================

model JobCategory {
  id             String   @id @default(uuid()) @db.Uuid
  organizationId String   @map("organization_id") @db.Uuid
  name           String
  weight         Decimal  @db.Decimal(3, 2) // 1.00 to 5.00
  badgeColor     String   @map("badge_color") // hex color
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  // Relations
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  employees    Employee[]

  @@unique([organizationId, name])
  @@map("job_categories")
}

model Employee {
  id             String         @id @default(uuid()) @db.Uuid
  organizationId String         @map("organization_id") @db.Uuid
  locationId     String         @map("location_id") @db.Uuid
  jobCategoryId  String         @map("job_category_id") @db.Uuid
  name           String
  hourlyRateCents Int           @map("hourly_rate_cents") // Store as cents
  status         EmployeeStatus @default(ACTIVE)
  hiredAt        DateTime       @map("hired_at")
  terminatedAt   DateTime?      @map("terminated_at")
  createdAt      DateTime       @default(now()) @map("created_at")
  updatedAt      DateTime       @updatedAt @map("updated_at")

  // Relations
  organization  Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  location      Location       @relation(fields: [locationId], references: [id])
  jobCategory   JobCategory    @relation(fields: [jobCategoryId], references: [id])
  dailyEntries  DailyEntry[]
  distributions Distribution[]

  @@index([organizationId, locationId])
  @@index([organizationId, status])
  @@map("employees")
}

enum EmployeeStatus {
  ACTIVE
  TERMINATED
}

// ============================================================================
// PAY PERIODS & ENTRIES
// ============================================================================

model PayPeriod {
  id             String          @id @default(uuid()) @db.Uuid
  organizationId String          @map("organization_id") @db.Uuid
  locationId     String          @map("location_id") @db.Uuid
  startDate      DateTime        @map("start_date") @db.Date
  endDate        DateTime        @map("end_date") @db.Date
  status         PayPeriodStatus @default(DRAFT)
  totalPoolCents Int?            @map("total_pool_cents")
  calculatedAt   DateTime?       @map("calculated_at")
  createdAt      DateTime        @default(now()) @map("created_at")
  updatedAt      DateTime        @updatedAt @map("updated_at")

  // Relations
  organization  Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  location      Location       @relation(fields: [locationId], references: [id])
  dailyEntries  DailyEntry[]
  distributions Distribution[]

  @@unique([organizationId, locationId, startDate, endDate])
  @@index([organizationId, status])
  @@map("pay_periods")
}

enum PayPeriodStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}

model DailyEntry {
  id                   String   @id @default(uuid()) @db.Uuid
  payPeriodId          String   @map("pay_period_id") @db.Uuid
  employeeId           String   @map("employee_id") @db.Uuid
  date                 DateTime @db.Date
  salesCents           Int?     @map("sales_cents")
  calculatedContribCents Int?   @map("calculated_contrib_cents")
  actualContribCents   Int?     @map("actual_contrib_cents")
  enteredById          String?  @map("entered_by_id") @db.Uuid
  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")

  // Relations
  payPeriod PayPeriod @relation(fields: [payPeriodId], references: [id], onDelete: Cascade)
  employee  Employee  @relation(fields: [employeeId], references: [id])
  enteredBy User?     @relation("EnteredBy", fields: [enteredById], references: [id])

  @@unique([payPeriodId, employeeId, date])
  @@index([payPeriodId, date])
  @@map("daily_entries")
}

// ============================================================================
// DISTRIBUTIONS (CALCULATION RESULTS)
// ============================================================================

model Distribution {
  id              String    @id @default(uuid()) @db.Uuid
  payPeriodId     String    @map("pay_period_id") @db.Uuid
  employeeId      String    @map("employee_id") @db.Uuid
  hoursWorked     Decimal   @map("hours_worked") @db.Decimal(5, 2)
  rateAtTimeCents Int       @map("rate_at_time_cents")
  weightAtTime    Decimal   @map("weight_at_time") @db.Decimal(3, 2)
  basis           Int       // CRITICAL: Never expose in API responses
  percentage      Decimal   @db.Decimal(7, 4) // e.g., 0.1234 = 12.34%
  shareCents      Int       @map("share_cents")
  receivedCents   Int       @map("received_cents") // After rounding
  varianceCents   Int       @default(0) @map("variance_cents") // Manual adjustments
  createdAt       DateTime  @default(now()) @map("created_at")

  // Relations
  payPeriod PayPeriod @relation(fields: [payPeriodId], references: [id], onDelete: Cascade)
  employee  Employee  @relation(fields: [employeeId], references: [id])

  @@unique([payPeriodId, employeeId])
  @@map("distributions")
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

model AuditLog {
  id             String   @id @default(uuid()) @db.Uuid
  organizationId String   @map("organization_id") @db.Uuid
  userId         String?  @map("user_id") @db.Uuid
  action         String
  entityType     String   @map("entity_type")
  entityId       String   @map("entity_id") @db.Uuid
  beforeValues   Json?    @map("before_values")
  afterValues    Json?    @map("after_values")
  ipAddress      String?  @map("ip_address")
  userAgent      String?  @map("user_agent")
  createdAt      DateTime @default(now()) @map("created_at")

  // Relations
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user         User?        @relation(fields: [userId], references: [id])

  @@index([organizationId, createdAt])
  @@index([entityType, entityId])
  @@map("audit_logs")
}
```

### Row-Level Security (RLS) for Multi-Tenancy

```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pay_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own organization's data
CREATE POLICY tenant_isolation_policy ON employees
  FOR ALL
  USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Repeat for all tables...

-- Function to set tenant context (called from API middleware)
CREATE OR REPLACE FUNCTION set_tenant_context(org_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_organization_id', org_id::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Database Indexes

```sql
-- Performance-critical indexes
CREATE INDEX idx_employees_org_location ON employees(organization_id, location_id);
CREATE INDEX idx_employees_org_status ON employees(organization_id, status);
CREATE INDEX idx_daily_entries_period_date ON daily_entries(pay_period_id, date);
CREATE INDEX idx_pay_periods_org_status ON pay_periods(organization_id, status);
CREATE INDEX idx_distributions_period ON distributions(pay_period_id);
CREATE INDEX idx_audit_logs_org_created ON audit_logs(organization_id, created_at DESC);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
```

---

## API Architecture

### API Design Principles

1. **RESTful conventions** with consistent resource naming
2. **JSON:API-inspired** response format
3. **Versioned API** (`/api/v1/`) for backwards compatibility
4. **Tenant-scoped** - Organization ID derived from JWT, never passed in URL
5. **Never expose `basis`** in distribution responses

### Base URL Structure

```
Production: https://api.tipsharepro.com/v1
Staging:    https://api-staging.tipsharepro.com/v1
Local:      http://localhost:3001/api/v1
```

### Authentication Endpoints

#### POST /auth/login
Initiate login flow.

**Request:**
```json
{
  "email": "manager@restaurant.com",
  "password": "securePassword123"
}
```

**Response (2FA required):**
```json
{
  "status": "2fa_required",
  "method": "email",
  "tempToken": "temp_xxx...",
  "expiresIn": 300
}
```

**Response (No 2FA):**
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "ref_xxx...",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "manager@restaurant.com",
      "role": "MANAGER",
      "organizationId": "uuid",
      "locationId": "uuid"
    }
  }
}
```

#### POST /auth/2fa/verify
Complete 2FA verification.

**Request:**
```json
{
  "tempToken": "temp_xxx...",
  "code": "123456"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "ref_xxx...",
    "expiresIn": 900,
    "user": { ... }
  }
}
```

#### POST /auth/token/refresh
Refresh access token.

**Request:**
```json
{
  "refreshToken": "ref_xxx..."
}
```

#### POST /auth/logout
Invalidate refresh token.

---

### Core API Endpoints

#### Employees

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /employees | List employees (paginated) | All |
| GET | /employees/:id | Get single employee | All |
| POST | /employees | Create employee | Admin |
| PATCH | /employees/:id | Update employee | Admin |
| DELETE | /employees/:id | Soft delete (terminate) | Admin |

**GET /employees**

Query Parameters:
- `locationId` (optional): Filter by location
- `status` (optional): `ACTIVE` | `TERMINATED`
- `page` (default: 1)
- `limit` (default: 50, max: 100)

**Response:**
```json
{
  "status": "success",
  "data": {
    "employees": [
      {
        "id": "uuid",
        "name": "Maria Santos",
        "locationId": "uuid",
        "locationName": "Downtown",
        "jobCategory": {
          "id": "uuid",
          "name": "Server",
          "badgeColor": "#4A90D9"
        },
        "hourlyRate": 18.50,
        "status": "ACTIVE",
        "hiredAt": "2024-03-15"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 23,
      "totalPages": 1
    }
  }
}
```

**POST /employees**

**Request:**
```json
{
  "name": "John Smith",
  "locationId": "uuid",
  "jobCategoryId": "uuid",
  "hourlyRate": 16.00,
  "hiredAt": "2026-01-08"
}
```

---

#### Daily Entries

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /pay-periods/:periodId/entries | Get all entries for period | All |
| GET | /pay-periods/:periodId/entries/:date | Get entries for specific date | All |
| PUT | /pay-periods/:periodId/entries | Bulk upsert entries | Designee+ |
| DELETE | /pay-periods/:periodId/entries/:id | Delete entry | Manager+ |

**GET /pay-periods/:periodId/entries**

Query Parameters:
- `date` (optional): Filter by date (YYYY-MM-DD)
- `employeeId` (optional): Filter by employee

**Response:**
```json
{
  "status": "success",
  "data": {
    "payPeriod": {
      "id": "uuid",
      "startDate": "2026-01-01",
      "endDate": "2026-01-15",
      "status": "ACTIVE"
    },
    "entries": [
      {
        "id": "uuid",
        "employeeId": "uuid",
        "employeeName": "Maria Santos",
        "date": "2026-01-08",
        "sales": 1250.00,
        "calculatedContribution": 40.63,
        "actualContribution": 40.00,
        "enteredBy": "manager@restaurant.com",
        "updatedAt": "2026-01-08T23:15:00Z"
      }
    ],
    "summary": {
      "totalSales": 15420.50,
      "totalCalculatedContributions": 501.17,
      "totalActualContributions": 498.00,
      "daysEntered": 8,
      "daysTotal": 15
    }
  }
}
```

**PUT /pay-periods/:periodId/entries**

Bulk upsert for efficient data entry.

**Request:**
```json
{
  "date": "2026-01-08",
  "entries": [
    {
      "employeeId": "uuid",
      "sales": 1250.00,
      "actualContribution": 40.00
    },
    {
      "employeeId": "uuid",
      "sales": 980.50,
      "actualContribution": 31.87
    }
  ]
}
```

---

#### Pay Periods

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /pay-periods | List pay periods | All |
| GET | /pay-periods/:id | Get pay period details | All |
| POST | /pay-periods | Create pay period | Admin |
| PATCH | /pay-periods/:id | Update pay period | Admin |
| POST | /pay-periods/:id/archive | Archive pay period | Admin |

---

#### Pool Calculation

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /pay-periods/:id/calculate | Run calculation | Manager+ |
| GET | /pay-periods/:id/distribution | Get distribution results | All |
| PATCH | /pay-periods/:id/distribution/:employeeId | Adjust variance | Admin |

**POST /pay-periods/:periodId/calculate**

**Request:**
```json
{
  "employeeHours": [
    {
      "employeeId": "uuid",
      "hours": 32.5
    },
    {
      "employeeId": "uuid",
      "hours": 40.0
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "payPeriod": {
      "id": "uuid",
      "startDate": "2026-01-01",
      "endDate": "2026-01-15",
      "totalPool": 2450.00
    },
    "distribution": [
      {
        "employeeId": "uuid",
        "employeeName": "Maria Santos",
        "location": "Downtown",
        "jobCategory": {
          "name": "Server",
          "badgeColor": "#4A90D9"
        },
        "hours": 32.5,
        "rate": 18.50,
        "percentage": 15.23,
        "share": 373.14,
        "received": 373.00
      }
    ],
    "summary": {
      "totalParticipants": 12,
      "totalHours": 425.5,
      "totalPool": 2450.00,
      "distributed": 2450.00,
      "variance": 0.00
    },
    "calculatedAt": "2026-01-16T14:30:00Z"
  }
}
```

**CRITICAL**: Note that `basis` is NOT included in the response. The `rate` shown is for informational purposes only and can be hidden in UI if needed.

---

#### Reports

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /reports/ytd | Year-to-date summary | Manager+ |
| GET | /reports/contribution-summary | Contribution summary | Manager+ |
| GET | /reports/distribution-pdf/:periodId | Generate PDF | All |
| GET | /reports/ytd-csv | Export YTD as CSV | Admin |

**GET /reports/ytd**

Query Parameters:
- `year` (default: current year)
- `locationId` (optional)

**Response:**
```json
{
  "status": "success",
  "data": {
    "year": 2026,
    "employees": [
      {
        "employeeId": "uuid",
        "name": "Maria Santos",
        "jobCategory": "Server",
        "totalHours": 845.5,
        "totalContributed": 1250.00,
        "totalReceived": 8420.50,
        "netPosition": 7170.50
      }
    ],
    "summary": {
      "totalContributed": 45000.00,
      "totalDistributed": 45000.00,
      "periodsCompleted": 12
    }
  }
}
```

---

#### Settings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /settings | Get organization settings | Admin |
| PATCH | /settings | Update settings | Admin |
| GET | /job-categories | List job categories | All |
| POST | /job-categories | Create job category | Admin |
| PATCH | /job-categories/:id | Update (including weight) | Admin |
| DELETE | /job-categories/:id | Delete (if no employees) | Admin |
| GET | /locations | List locations | All |
| POST | /locations | Create location | Admin |
| PATCH | /locations/:id | Update location | Admin |

**GET /settings**

**Response:**
```json
{
  "status": "success",
  "data": {
    "organization": {
      "id": "uuid",
      "name": "Best Restaurant Group",
      "subscriptionStatus": "ACTIVE",
      "trialEndsAt": null
    },
    "tipPoolSettings": {
      "contributionRate": 3.25,
      "payPeriodType": "BIWEEKLY",
      "autoArchiveDays": 3
    },
    "locations": [
      {
        "id": "uuid",
        "name": "Downtown",
        "number": "001",
        "status": "ACTIVE"
      }
    ],
    "jobCategories": [
      {
        "id": "uuid",
        "name": "Server",
        "weight": 1.00,
        "badgeColor": "#4A90D9",
        "employeeCount": 8
      },
      {
        "id": "uuid",
        "name": "Cook",
        "weight": 2.50,
        "badgeColor": "#E8C150",
        "employeeCount": 4
      }
    ]
  }
}
```

---

### Error Response Format

All errors follow a consistent format:

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "hourlyRate",
        "message": "Hourly rate must be between $0.01 and $200"
      }
    ]
  }
}
```

**Error Codes:**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Duplicate or conflicting data |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

### Rate Limiting

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| Authentication | 5 attempts | 15 minutes |
| API (authenticated) | 100 requests | 1 minute |
| Report generation | 10 requests | 1 minute |
| Bulk operations | 20 requests | 1 minute |

---

## Frontend Architecture

### Project Structure

```
src/
├── app/                          # Next.js App Router (or routes/)
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard home
│   │   ├── daily-entry/
│   │   ├── pay-periods/
│   │   ├── employees/
│   │   ├── reports/
│   │   └── settings/
│   └── (demo)/
│       └── page.tsx              # Public demo mode
│
├── components/
│   ├── ui/                       # Design system primitives
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Table/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── Toast/
│   ├── forms/                    # Form components
│   │   ├── DailyEntryForm/
│   │   ├── EmployeeForm/
│   │   └── SettingsForm/
│   ├── tables/                   # Data tables
│   │   ├── DistributionTable/
│   │   ├── EmployeeTable/
│   │   └── EntryGrid/
│   ├── charts/                   # Visualization
│   │   └── PoolChart/
│   └── layout/                   # Layout components
│       ├── Sidebar/
│       ├── Header/
│       └── PageContainer/
│
├── features/                     # Feature modules
│   ├── auth/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── store/
│   ├── daily-entry/
│   ├── pool-calculation/
│   ├── employees/
│   └── reports/
│
├── hooks/                        # Shared hooks
│   ├── useAuth.ts
│   ├── useOrganization.ts
│   └── useToast.ts
│
├── lib/                          # Utilities
│   ├── api-client.ts
│   ├── formatters.ts
│   ├── validators.ts
│   └── pdf-generator.ts
│
├── stores/                       # Global state
│   ├── auth-store.ts
│   ├── ui-store.ts
│   └── demo-store.ts
│
├── styles/
│   ├── tokens.css                # Design tokens
│   ├── globals.css               # Global styles
│   └── components/               # Component styles
│
└── types/                        # TypeScript types
    ├── api.ts
    ├── entities.ts
    └── forms.ts
```

### State Management Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                      STATE ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐                   │
│  │   SERVER STATE  │     │   CLIENT STATE  │                   │
│  │  (React Query)  │     │    (Zustand)    │                   │
│  ├─────────────────┤     ├─────────────────┤                   │
│  │ • Employees     │     │ • UI State      │                   │
│  │ • Pay Periods   │     │   - Sidebar     │                   │
│  │ • Daily Entries │     │   - Modals      │                   │
│  │ • Distributions │     │   - Toasts      │                   │
│  │ • Settings      │     │ • Auth State    │                   │
│  │                 │     │   - User        │                   │
│  │ Cache Strategy: │     │   - Tokens      │                   │
│  │ • staleTime: 30s│     │ • Demo State    │                   │
│  │ • Auto refetch  │     │   - Sample data │                   │
│  └─────────────────┘     └─────────────────┘                   │
│           │                       │                             │
│           ▼                       ▼                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    COMPONENT LAYER                          ││
│  │                                                             ││
│  │  useQuery('employees') → EmployeeTable                      ││
│  │  useMutation('createEntry') → DailyEntryForm                ││
│  │  useAuthStore() → ProtectedRoute                            ││
│  │  useUIStore() → Sidebar, Modal                              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Design Token Integration

```css
/* styles/tokens.css - Generated from design-tokens.json */

:root {
  /* ===== COLORS - Amber Hour Palette ===== */
  /* Backgrounds */
  --color-midnight: #0C0A07;
  --color-espresso: #1A1510;
  --color-mahogany: #2A2318;
  --color-walnut: #3D3225;

  /* Text */
  --color-cream: #F7F3EA;
  --color-linen: #C4B9A4;
  --color-stone: #8B7B65;
  --color-ash: #5C5145;

  /* Accents */
  --color-brass: #D4A420;
  --color-brass-light: #E8C150;
  --color-brass-glow: rgba(212, 164, 32, 0.15);
  --color-ember: #E85D35;
  --color-ember-dark: #C44A28;
  --color-sage: #2D9B6E;
  --color-sage-dark: #248558;
  --color-sienna: #C74B4B;
  --color-sienna-dark: #A33B3B;
  --color-info: #6B8CAE;

  /* Semantic */
  --color-success: var(--color-sage);
  --color-warning: var(--color-brass);
  --color-error: var(--color-sienna);

  /* ===== TYPOGRAPHY ===== */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Newsreader', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-display: 3rem;
  --text-h1: 2.25rem;
  --text-h2: 1.75rem;
  --text-h3: 1.375rem;
  --text-h4: 1.125rem;
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-caption: 0.75rem;
  --text-label: 0.6875rem;
  --text-mono-lg: 1.5rem;
  --text-mono: 1rem;
  --text-mono-sm: 0.8125rem;

  /* ===== SPACING (6px base) ===== */
  --space-1: 6px;
  --space-2: 12px;
  --space-3: 18px;
  --space-4: 24px;
  --space-5: 30px;
  --space-6: 36px;
  --space-8: 48px;
  --space-10: 60px;
  --space-12: 72px;

  /* ===== BORDERS & RADIUS ===== */
  --border-subtle: 1px solid var(--color-walnut);
  --border-medium: 1px solid var(--color-stone);
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-full: 9999px;

  /* ===== SHADOWS ===== */
  --shadow-sm: 0 1px 2px rgba(12, 10, 7, 0.4);
  --shadow-md: 0 4px 8px rgba(12, 10, 7, 0.5), 0 1px 2px rgba(12, 10, 7, 0.3);
  --shadow-lg: 0 12px 24px rgba(12, 10, 7, 0.6), 0 4px 8px rgba(12, 10, 7, 0.4);
  --shadow-glow: 0 0 20px rgba(212, 164, 32, 0.25);

  /* ===== MOTION ===== */
  --ease-out: cubic-bezier(0.0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-snap: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-settle: cubic-bezier(0.22, 1, 0.36, 1);

  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-reveal: 700ms;

  /* ===== Z-INDEX SCALE ===== */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-toast: 400;
  --z-max: 9999;
}
```

### Component Examples

#### Button Component (TypeScript + CSS Modules)

```typescript
// components/ui/Button/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          styles.button,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        <span className={loading ? styles.hiddenText : undefined}>
          {children}
        </span>
        {loading && <span className="sr-only">Loading, please wait</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

```css
/* components/ui/Button/Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-weight: 500;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    transform var(--duration-instant) var(--ease-out);
}

.button:focus-visible {
  outline: none;
  box-shadow: var(--shadow-glow);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.primary {
  background-color: var(--color-brass);
  color: var(--color-midnight);
  border: none;
}

.primary:hover:not(:disabled) {
  background-color: var(--color-brass-light);
}

.primary:active:not(:disabled) {
  transform: translateY(1px);
}

.secondary {
  background-color: var(--color-mahogany);
  color: var(--color-cream);
  border: 1px solid var(--color-walnut);
}

.secondary:hover:not(:disabled) {
  background-color: var(--color-walnut);
}

.ghost {
  background-color: transparent;
  color: var(--color-cream);
  border: 1px solid transparent;
}

.ghost:hover:not(:disabled) {
  background-color: var(--color-mahogany);
}

.danger {
  background-color: var(--color-sienna);
  color: var(--color-cream);
  border: none;
}

.danger:hover:not(:disabled) {
  background-color: var(--color-sienna-dark);
}

/* Sizes */
.sm {
  height: 32px;
  padding: 0 var(--space-3);
  font-size: var(--text-body-sm);
}

.md {
  height: 44px;
  padding: 0 var(--space-4);
  font-size: var(--text-body);
}

.lg {
  height: 52px;
  padding: 0 var(--space-5);
  font-size: var(--text-body-lg);
}

.fullWidth {
  width: 100%;
}

/* Loading state */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.hiddenText {
  visibility: hidden;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Currency Input Component

```typescript
// components/ui/CurrencyInput/CurrencyInput.tsx
import { forwardRef, useState, useCallback } from 'react';
import styles from './CurrencyInput.module.css';

interface CurrencyInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  label: string;
  id: string;
  error?: string;
  disabled?: boolean;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, label, id, error, disabled }, ref) => {
    const [displayValue, setDisplayValue] = useState(
      value !== null ? formatCurrency(value) : ''
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9.]/g, '');
        setDisplayValue(raw);

        const parsed = parseFloat(raw);
        onChange(isNaN(parsed) ? null : Math.round(parsed * 100));
      },
      [onChange]
    );

    const handleBlur = useCallback(() => {
      if (value !== null) {
        setDisplayValue(formatCurrency(value));
      }
    }, [value]);

    return (
      <div className={styles.wrapper}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <div className={styles.inputWrapper}>
          <span className={styles.prefix} aria-hidden="true">$</span>
          <input
            ref={ref}
            id={id}
            type="text"
            inputMode="decimal"
            className={styles.input}
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        </div>
        {error && (
          <span id={`${id}-error`} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

function formatCurrency(cents: number): string {
  return (cents / 100).toFixed(2);
}
```

### API Client

```typescript
// lib/api-client.ts
import { useAuthStore } from '@/stores/auth-store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const { accessToken, refreshAccessToken, logout } = useAuthStore.getState();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle token refresh
    if (response.status === 401 && accessToken) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${useAuthStore.getState().accessToken}`;
        response = await fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers,
        });
      } else {
        logout();
        throw new ApiError('Session expired', 'UNAUTHORIZED', 401);
      }
    }

    const json: ApiResponse<T> = await response.json();

    if (json.status === 'error') {
      throw new ApiError(
        json.error?.message || 'Unknown error',
        json.error?.code || 'UNKNOWN',
        response.status,
        json.error?.details
      );
    }

    return json.data as T;
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = new ApiClient();
```

### React Query Hooks

```typescript
// features/employees/api/useEmployees.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Employee, CreateEmployeeDTO, UpdateEmployeeDTO } from '@/types/entities';

interface EmployeesResponse {
  employees: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useEmployees(params?: {
  locationId?: string;
  status?: 'ACTIVE' | 'TERMINATED';
  page?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.locationId) searchParams.set('locationId', params.locationId);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.page) searchParams.set('page', params.page.toString());

  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => api.get<EmployeesResponse>(`/employees?${searchParams}`),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => api.get<Employee>(`/employees/${id}`),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeDTO) =>
      api.post<Employee>('/employees', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeDTO }) =>
      api.patch<Employee>(`/employees/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees', id] });
    },
  });
}
```

---

## Security Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Client  │      │  API     │      │  Redis   │      │ Database │
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                 │                 │
     │ POST /auth/login                  │                 │
     │ {email, password}                 │                 │
     │────────────────►│                 │                 │
     │                 │                 │     Find user   │
     │                 │─────────────────┼────────────────►│
     │                 │                 │                 │
     │                 │◄────────────────┼─────────────────│
     │                 │                 │                 │
     │                 │ Verify password │                 │
     │                 │ (bcrypt)        │                 │
     │                 │                 │                 │
     │                 │ Generate 2FA code                 │
     │                 │ Store in Redis  │                 │
     │                 │────────────────►│                 │
     │                 │                 │                 │
     │                 │ Send via Email/SMS               │
     │                 │                 │                 │
     │ {tempToken, method: "email"}     │                 │
     │◄────────────────│                 │                 │
     │                 │                 │                 │
     │ POST /auth/2fa/verify            │                 │
     │ {tempToken, code}                │                 │
     │────────────────►│                 │                 │
     │                 │                 │                 │
     │                 │ Verify code     │                 │
     │                 │────────────────►│                 │
     │                 │◄────────────────│                 │
     │                 │                 │                 │
     │                 │ Generate tokens │                 │
     │                 │ - Access (15min)│                 │
     │                 │ - Refresh (7d)  │                 │
     │                 │                 │                 │
     │                 │ Store refresh   │                 │
     │                 │ token hash      │                 │
     │                 │─────────────────┼────────────────►│
     │                 │                 │                 │
     │ {accessToken, refreshToken}      │                 │
     │◄────────────────│                 │                 │
     │                 │                 │                 │
```

### JWT Token Structure

```typescript
// Access Token Payload (15 minute expiry)
interface AccessTokenPayload {
  sub: string;           // User ID
  org: string;           // Organization ID
  loc: string | null;    // Location ID (null for admins)
  role: 'ADMIN' | 'MANAGER' | 'DESIGNEE';
  iat: number;
  exp: number;
}

// Refresh Token is opaque, stored as hash in database
```

### Authorization Middleware

```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    organizationId: string;
    locationId: string | null;
    role: 'ADMIN' | 'MANAGER' | 'DESIGNEE';
  };
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      error: { code: 'UNAUTHORIZED', message: 'Missing authentication token' }
    });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AccessTokenPayload;

    (req as AuthenticatedRequest).user = {
      id: payload.sub,
      organizationId: payload.org,
      locationId: payload.loc,
      role: payload.role,
    };

    // Set tenant context for RLS
    prisma.$executeRaw`SELECT set_tenant_context(${payload.org}::uuid)`;

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' }
    });
  }
}

export function authorize(...roles: Array<'ADMIN' | 'MANAGER' | 'DESIGNEE'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        status: 'error',
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      });
    }

    next();
  };
}

// Usage in routes
router.get('/employees', authenticate, getEmployees);
router.post('/employees', authenticate, authorize('ADMIN'), createEmployee);
router.patch('/settings', authenticate, authorize('ADMIN'), updateSettings);
```

### Security Headers

```typescript
// middleware/security.ts
import helmet from 'helmet';
import cors from 'cors';

export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", process.env.API_URL],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),

  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
];
```

### Input Validation

```typescript
// lib/validators.ts
import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(1).max(100),
  locationId: z.string().uuid(),
  jobCategoryId: z.string().uuid(),
  hourlyRate: z.number().min(0.01).max(200),
  hiredAt: z.string().datetime(),
});

export const dailyEntrySchema = z.object({
  employeeId: z.string().uuid(),
  sales: z.number().min(0).max(999999.99).nullable(),
  actualContribution: z.number().min(0).max(99999.99).nullable(),
});

export const bulkEntriesSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  entries: z.array(dailyEntrySchema).min(1).max(100),
});

// Middleware
export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: result.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
      });
    }

    req.body = result.data;
    next();
  };
}
```

---

## Performance Architecture

### Caching Strategy

```typescript
// lib/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

interface CacheOptions {
  ttl?: number; // seconds
  tags?: string[];
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const { ttl = 300 } = options; // Default 5 minutes
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  },

  async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },

  // Organization-scoped cache key
  orgKey(orgId: string, resource: string, ...parts: string[]): string {
    return `org:${orgId}:${resource}:${parts.join(':')}`;
  },
};

// Usage in services
async function getEmployees(orgId: string, locationId?: string) {
  const cacheKey = cache.orgKey(orgId, 'employees', locationId || 'all');

  const cached = await cache.get<Employee[]>(cacheKey);
  if (cached) return cached;

  const employees = await prisma.employee.findMany({
    where: {
      organizationId: orgId,
      ...(locationId && { locationId }),
    },
  });

  await cache.set(cacheKey, employees, { ttl: 60 });
  return employees;
}
```

### Database Query Optimization

```typescript
// services/distribution.service.ts

// Optimized query for distribution calculation
async function getEmployeesForDistribution(payPeriodId: string) {
  return prisma.$queryRaw<DistributionEmployee[]>`
    SELECT
      e.id,
      e.name,
      e.hourly_rate_cents,
      jc.weight,
      jc.name as job_category_name,
      jc.badge_color,
      l.name as location_name,
      COALESCE(SUM(de.actual_contrib_cents), 0) as total_contribution
    FROM employees e
    JOIN job_categories jc ON e.job_category_id = jc.id
    JOIN locations l ON e.location_id = l.id
    LEFT JOIN daily_entries de ON de.employee_id = e.id
      AND de.pay_period_id = ${payPeriodId}
    WHERE e.status = 'ACTIVE'
    GROUP BY e.id, e.name, e.hourly_rate_cents, jc.weight, jc.name, jc.badge_color, l.name
  `;
}
```

### Performance Targets

| Metric | Target | Implementation |
|--------|--------|----------------|
| **Time to First Byte (TTFB)** | < 200ms | Edge caching, DB connection pooling |
| **First Contentful Paint** | < 1.5s | Code splitting, font preloading |
| **Time to Interactive** | < 3s | Lazy loading, skeleton states |
| **API Response (p95)** | < 200ms | Query optimization, Redis caching |
| **Calculation Time** | < 500ms/100 employees | Optimized SQL, batch processing |
| **Lighthouse Score** | > 90 | Performance budgets, image optimization |

---

## Infrastructure Architecture

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │  CloudFlare │
                              │     CDN     │
                              └──────┬──────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
           ┌───────────────┐                ┌───────────────┐
           │    Vercel     │                │   Railway     │
           │  (Frontend)   │                │  (Backend)    │
           ├───────────────┤                ├───────────────┤
           │ • React App   │                │ • Express API │
           │ • SSG/ISR     │◄──── API ─────►│ • Background  │
           │ • Edge Funcs  │     Calls      │   Jobs        │
           └───────────────┘                └───────┬───────┘
                                                    │
                    ┌───────────────────────────────┼───────────────────────────┐
                    │                               │                           │
                    ▼                               ▼                           ▼
           ┌───────────────┐                ┌───────────────┐           ┌───────────────┐
           │   Railway     │                │   Railway     │           │    Upstash    │
           │  PostgreSQL   │                │    Redis      │           │  (Redis Edge) │
           ├───────────────┤                ├───────────────┤           ├───────────────┤
           │ • Primary DB  │                │ • Sessions    │           │ • Rate Limit  │
           │ • Auto backup │                │ • Cache       │           │ • Global Edge │
           │ • Read replica│                │ • Job Queue   │           └───────────────┘
           └───────────────┘                └───────────────┘

                    ┌───────────────────────────────────────────────────────────┐
                    │                    EXTERNAL SERVICES                       │
                    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
                    │  │   Stripe    │  │  SendGrid   │  │   Twilio    │        │
                    │  │  Payments   │  │   Email     │  │    SMS      │        │
                    │  └─────────────┘  └─────────────┘  └─────────────┘        │
                    └───────────────────────────────────────────────────────────┘
```

### Environment Configuration

```typescript
// config/environment.ts

const environments = {
  development: {
    api: 'http://localhost:3001/api/v1',
    database: process.env.DATABASE_URL,
    redis: 'redis://localhost:6379',
  },
  staging: {
    api: 'https://api-staging.tipsharepro.com/v1',
    database: process.env.DATABASE_URL,
    redis: process.env.REDIS_URL,
  },
  production: {
    api: 'https://api.tipsharepro.com/v1',
    database: process.env.DATABASE_URL,
    redis: process.env.REDIS_URL,
  },
};

export const config = environments[process.env.NODE_ENV || 'development'];
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Staging
        run: |
          # Deploy frontend to Vercel preview
          # Deploy backend to Railway staging

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        run: |
          # Deploy frontend to Vercel production
          # Deploy backend to Railway production
          # Run database migrations
```

---

## Testing Strategy

### Testing Pyramid

```
                    ┌─────────┐
                   ╱   E2E    ╲
                  ╱  (Cypress) ╲
                 ╱  ~10 tests   ╲
                ├───────────────┤
               ╱  Integration    ╲
              ╱   (Jest + DB)     ╲
             ╱    ~50 tests        ╲
            ├───────────────────────┤
           ╱       Unit Tests        ╲
          ╱   (Jest + Testing Lib)    ╲
         ╱       ~200 tests            ╲
        └───────────────────────────────┘
```

### Critical Test Cases

| Category | Test | Priority |
|----------|------|----------|
| **Calculation Engine** | Correct distribution with various weights | P0 |
| **Calculation Engine** | Rounding reconciliation (total matches pool) | P0 |
| **Calculation Engine** | Edge: Single employee gets 100% | P0 |
| **Calculation Engine** | Edge: 0 hours = $0 share | P0 |
| **Auth** | Login with valid credentials | P0 |
| **Auth** | 2FA code verification | P0 |
| **Auth** | Role-based access enforcement | P0 |
| **Data Entry** | Save daily entries | P0 |
| **Data Entry** | Bulk upsert entries | P1 |
| **API Security** | Tenant isolation | P0 |
| **API Security** | Basis never exposed | P0 |

### Example Unit Test

```typescript
// services/__tests__/calculation.service.test.ts
import { calculateDistribution } from '../calculation.service';

describe('TipCalculationEngine', () => {
  describe('calculateDistribution', () => {
    it('distributes pool correctly based on hours × rate × weight', () => {
      const employees = [
        { id: '1', hours: 40, rateCents: 1500, weight: 1.0 }, // Server
        { id: '2', hours: 40, rateCents: 2000, weight: 2.5 }, // Cook
      ];
      const totalPoolCents = 100000; // $1000

      const result = calculateDistribution(employees, totalPoolCents);

      // Basis: 40*1500*1.0 = 60000, 40*2000*2.5 = 200000
      // Total basis: 260000
      // Percentages: 23.08%, 76.92%
      expect(result).toEqual([
        expect.objectContaining({
          id: '1',
          percentage: expect.closeTo(0.2308, 2),
          shareCents: expect.any(Number),
        }),
        expect.objectContaining({
          id: '2',
          percentage: expect.closeTo(0.7692, 2),
          shareCents: expect.any(Number),
        }),
      ]);

      // Total distributed must equal pool
      const totalDistributed = result.reduce((sum, r) => sum + r.receivedCents, 0);
      expect(totalDistributed).toBe(totalPoolCents);
    });

    it('gives 100% to single employee', () => {
      const employees = [{ id: '1', hours: 20, rateCents: 1500, weight: 1.0 }];
      const totalPoolCents = 50000;

      const result = calculateDistribution(employees, totalPoolCents);

      expect(result[0].percentage).toBe(1);
      expect(result[0].receivedCents).toBe(50000);
    });

    it('gives $0 to employee with 0 hours', () => {
      const employees = [
        { id: '1', hours: 0, rateCents: 1500, weight: 1.0 },
        { id: '2', hours: 40, rateCents: 1500, weight: 1.0 },
      ];
      const totalPoolCents = 50000;

      const result = calculateDistribution(employees, totalPoolCents);

      expect(result.find(r => r.id === '1')?.receivedCents).toBe(0);
      expect(result.find(r => r.id === '2')?.receivedCents).toBe(50000);
    });

    it('NEVER exposes basis value in result', () => {
      const employees = [{ id: '1', hours: 40, rateCents: 1500, weight: 1.0 }];
      const result = calculateDistribution(employees, 10000);

      expect(result[0]).not.toHaveProperty('basis');
      expect(JSON.stringify(result)).not.toContain('basis');
    });
  });
});
```

---

## Monitoring & Observability

### Logging Strategy

```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  redact: {
    paths: ['req.headers.authorization', 'password', 'token'],
    remove: true,
  },
});

// Request logging middleware
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: Date.now() - start,
      organizationId: (req as AuthenticatedRequest).user?.organizationId,
      userId: (req as AuthenticatedRequest).user?.id,
    });
  });

  next();
}
```

### Key Metrics to Monitor

| Category | Metric | Alert Threshold |
|----------|--------|-----------------|
| **Availability** | Uptime | < 99.9% |
| **Latency** | API p95 response time | > 500ms |
| **Errors** | Error rate | > 1% |
| **Business** | Calculations per hour | Anomaly detection |
| **Business** | Trial conversions | < 10% weekly |
| **Security** | Failed login attempts | > 10 per minute per IP |
| **Resources** | Database connections | > 80% pool |
| **Resources** | Redis memory | > 80% |

---

## Appendix: Technical Decisions Rationale

### Why PostgreSQL over MongoDB?

1. **Relational data model** - Organizations, locations, employees have clear relationships
2. **ACID compliance** - Financial calculations require transactional integrity
3. **Row-Level Security** - Built-in multi-tenant isolation at database level
4. **JSON support** - Settings and audit logs can use JSONB when needed
5. **Mature ecosystem** - Well-understood, excellent tooling

### Why Express over NestJS?

1. **Simplicity** - Smaller codebase, faster to iterate
2. **Team familiarity** - Lower learning curve
3. **Flexibility** - No framework opinions to fight
4. **Performance** - Minimal overhead
5. **Migration path** - Easy to extract services later if needed

### Why Zustand over Redux?

1. **Bundle size** - ~1KB vs ~10KB
2. **Boilerplate** - Minimal setup, no actions/reducers ceremony
3. **TypeScript** - First-class support without extra packages
4. **Simplicity** - Direct state updates, no middleware complexity
5. **Sufficient** - App state needs are modest

### Why Server-Side PDF Generation?

1. **Consistency** - Identical output across browsers
2. **Security** - Sensitive data doesn't touch client
3. **Performance** - Client devices vary; server is consistent
4. **Printability** - Better control over page breaks and formatting

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-08 | System Architecture | Initial architecture document |

---

*This document provides the technical blueprint for Tip Share Pro. All specifications are implementation-ready and should be used as the source of truth for engineering teams.*
