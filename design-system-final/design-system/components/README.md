# Component Library

Pre-built UI components following the TipSharePro design system.

---

## Available Components

| Component | Description | Priority |
|-----------|-------------|----------|
| [buttons.md](./buttons.md) | Primary, secondary, ghost, danger variants | High |
| [forms.md](./forms.md) | Inputs, dropdowns, checkboxes, validation | High |
| [tables.md](./tables.md) | Distribution tables, data grids | High |
| [cards.md](./cards.md) | Content containers, stat cards | Medium |
| [badges.md](./badges.md) | Job role badges, status indicators | Medium |
| [navigation.md](./navigation.md) | Headers, tabs, nav cards | Medium |
| [modals.md](./modals.md) | Dialogs, confirmations, !!Note warnings | Medium |
| [help-system.md](./help-system.md) | ?Note tooltips, !!Note modals | Medium |

---

## Component Anatomy

Each component file includes:

1. **Visual Specification** — ASCII diagram of the component
2. **Specifications Table** — Detailed measurements and values
3. **CSS Implementation** — Production-ready styles
4. **States** — Default, hover, active, focus, disabled
5. **Variants** — Size and type variations
6. **Accessibility** — ARIA patterns and keyboard support
7. **Related Files** — Links to tokens and dependencies

---

## Usage Guidelines

### Do:
- Use components as documented
- Follow state patterns consistently
- Maintain accessibility requirements
- Reference design tokens (not hard-coded values)

### Don't:
- Create new component variants without documentation
- Skip disabled or error states
- Ignore keyboard navigation
- Use colors outside the token system
