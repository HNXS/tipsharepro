# Print Overhaul Design

## Problem

The client is printing the distribution table on real paper and hitting multiple UX issues:
- No way to choose portrait/landscape without digging into browser "More Settings"
- Browser's default header/footer prints unwanted URLs and garbage text
- Logo and stat cards are too small on paper
- Table doesn't fill the page (too much whitespace)
- Settings page has no print button at all
- Only one print button exists (on Distribution Table)

## Design

### 1. Pre-Print Modal Dialog

A `PrintDialog` component that appears when the user clicks any Print button.

**Props:**
- `target`: `"distribution"` | `"settings"` — determines what prints and default orientation
- `onClose`: callback to dismiss

**Modal contents:**
- **Orientation toggle**: Portrait (default for distribution) / Landscape (default for settings)
- **$/Hr checkbox**: only shown when `target === "distribution"`
- **Tip text**: "Uncheck 'Headers and footers' in your browser's print dialog for best results"
- **Cancel / Print buttons**

**Behavior:**
- On Print click: sets a CSS class on `<body>` for orientation (`print-portrait` or `print-landscape`) and a class for which section to print (`print-target-distribution` or `print-target-settings`), then calls `window.print()`, then cleans up classes.
- The `@page` rule uses the body class to set `size: portrait` or `size: landscape`.
- Non-target sections get `display: none !important` in print.

### 2. Two Print Buttons

**Distribution Table** — keeps its existing Print button in the action bar. The $/Hr checkbox moves into the modal.

**Settings Page** — gets a new "Print Settings" button in the settings header area (next to existing buttons). Clicking opens the same `PrintDialog` with `target="settings"`.

### 3. Print Layout: Distribution Table

**Logo**: 100px height (up from 60px). Centered or left-aligned at top.

**Stat cards**: Increase sizes:
- Labels: 0.6rem (up from 0.45rem)
- Values: 0.85rem (up from 0.65rem)
- More padding: 0.25rem 0.5rem

**Table**: Fill the page.
- Portrait: font 0.7rem (up from 0.6rem), reduce page margins to 0.3in
- Landscape: font 0.75rem, full width, wider columns
- `width: 100%` with `table-layout: fixed` (already in place)

**Footer**: Our own printed footer at bottom:
- Left: "TipSharePro" small text
- Right: date/time (already in header — move to footer or keep in both)

### 4. Print Layout: Settings Page

**Content**: All 8 steps printed as they appear, but with interactive elements replaced by plain text values.

**Layout**:
- 2 pages max
- Landscape default (wider layout fits better)
- Same logo header + date/time
- Hide: buttons, tooltips, range sliders (show value only), lock icons
- Show: step numbers, titles, current values, job assignments, category names, weights

**Compact formatting**:
- Reduce card padding and gaps
- Stat card grids go inline
- Job assignment grid compacts to 2-3 columns

### 5. Browser Header/Footer Suppression

Use `@page { margin: 0 }` to eliminate browser chrome, then use a CSS padding on the print container to create our own margins. This removes the browser's URL/page-number header/footer in Chrome, Edge, and Firefox.

Our own footer (date/time, page number via CSS counters) replaces what the browser would have printed.

## Components Affected

- `DistributionTable.tsx` — print button opens modal, remove inline $/Hr checkbox
- `SettingsPage.tsx` — add print button
- `page.tsx` — add body class management for print target
- `globals.css` — rewrite @media print blocks for both sections
- New: `PrintDialog.tsx` — the pre-print modal component

## Out of Scope

- Email functionality (locked feature)
- PDF export
- Custom page size selection
