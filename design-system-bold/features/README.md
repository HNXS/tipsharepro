# TipSharePro Feature Documentation

**Version:** 1.0
**Date:** January 10, 2026
**Status:** Active

---

## Overview

This section provides comprehensive documentation for each major feature of TipSharePro. Each feature is documented from multiple perspectives: user journey, screen states, interactions, accessibility, and implementation.

---

## Application Flow

TipSharePro is a 9-page web application:

| Page | Name | Purpose | Access |
|------|------|---------|--------|
| 1 | Login | Authentication | Public |
| 2 | Navigation Hub | Feature selection | All authenticated |
| 3 | Settings | System configuration | Admin/Manager |
| 4 | Scenario Sandbox | What-if testing | Admin only |
| 5 | Daily Contributions | Daily data entry | Designee+ |
| 6 | PPE Contributions | Period summary | Designee+ |
| 7 | PPE Distribution | Distribution view | All authenticated |
| 8 | YTD Data | Year-to-date reports | All authenticated |
| 9 | PP Allocations | Multi-location view | Multi-location only |

---

## Feature Documentation Structure

Each feature folder contains:

| File | Purpose |
|------|---------|
| `README.md` | Feature overview, scope, and requirements |
| `user-journey.md` | User flow and task analysis |
| `screen-states.md` | All possible screen states and variations |
| `interactions.md` | Detailed interaction specifications |
| `accessibility.md` | Feature-specific accessibility requirements |
| `implementation.md` | Technical implementation notes |

---

## Documented Features

### Core Features

| Feature | Folder | Status |
|---------|--------|--------|
| Settings | `settings/` | ✅ Documented |
| Daily Contributions | `daily-contributions/` | ✅ Documented |
| PPE Distribution | `distribution/` | ✅ Documented |

### Future Documentation

| Feature | Folder | Status |
|---------|--------|--------|
| Login & Auth | `login/` | Planned |
| Navigation Hub | `navigation/` | Planned |
| PPE Contributions | `ppe-contributions/` | Planned |
| YTD Reports | `ytd/` | Planned |
| Scenario Sandbox | `sandbox/` | Planned |
| PP Allocations | `allocations/` | Planned |

---

## User Roles

### Role Hierarchy

| Role | Level | Capabilities |
|------|-------|--------------|
| **Admin** | Highest | Full access, user management, all settings |
| **Manager** | High | Settings access, distribution view, reporting |
| **Designee** | Medium | Data entry, contribution management |
| **Viewer** | Low | Read-only distribution access |

### Permission Matrix

| Feature | Admin | Manager | Designee | Viewer |
|---------|-------|---------|----------|--------|
| Login | ✅ | ✅ | ✅ | ✅ |
| Navigation Hub | ✅ | ✅ | ✅ | ✅ |
| Settings - All tabs | ✅ | ✅ | ❌ | ❌ |
| Settings - Users tab | ✅ | ❌ | ❌ | ❌ |
| Scenario Sandbox | ✅ | ❌ | ❌ | ❌ |
| Daily Contributions | ✅ | ✅ | ✅ | ❌ |
| PPE Contributions | ✅ | ✅ | ✅ | ❌ |
| PPE Distribution | ✅ | ✅ | ✅ | ✅ |
| YTD Data | ✅ | ✅ | ✅ | ✅ |
| PP Allocations | ✅* | ✅* | ❌ | ❌ |

*Multi-location accounts only

---

## Cross-Feature Patterns

### Data Entry Flow

1. **Navigate** to entry page via hub
2. **Select** date/period (if applicable)
3. **Enter** data in grid/form
4. **Validate** entries (real-time)
5. **Save** with confirmation
6. **Review** summary

### Calculation Flow

1. **Collect** all contribution data
2. **Apply** weights from settings
3. **Calculate** basis (Hours × Rate × Weight)
4. **Distribute** pool based on basis share
5. **Round** to whole dollars (proprietary)
6. **Display** results with privacy controls

### Report Flow

1. **Select** period/range
2. **Generate** report
3. **View** on screen
4. **Export** (PDF/Print)

---

## Design System Integration

All features use components from the design system:

- **Forms:** `/design-system/components/forms.md`
- **Tables:** `/design-system/components/tables.md`
- **Navigation:** `/design-system/components/navigation.md`
- **Help System:** `/design-system/components/help-system.md`
- **Modals:** `/design-system/components/modals.md`

---

## Help System Integration

### ?Note (Hover Tooltips)

Every feature includes contextual ?Notes for:
- Field explanations
- Calculation clarifications
- Best practice recommendations

### !!Note (Critical Modals)

Critical features require acknowledgment:
- Wage confidentiality (Distribution)
- Data export warnings
- Irreversible actions

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial feature documentation structure |
