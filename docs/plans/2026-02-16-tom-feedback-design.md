# Tom's Feb 16 Feedback — Design

## 1. PDF Library Overhaul

- Delete `why-tip-share-pro.pdf` and `the-admin-role.pdf`
- Replace 3 PDFs with new versions from `data/20260216/`
- Add new `what-to-expect-full-version.pdf`
- HELP_PDFS array: 4 entries (sales-factor, category-weights, pre-paid, full-version)
- Tooltip links: remove deleted PDF refs, fix Step 6 link, append "(PDF)" to all link labels

## 2. Welcome Popup Rewrite

Replace DEMO_WELCOME_TEXT and Quick Tips with Tom's new copy. No PDF link in popup.

## 3. Tooltip Text Rewrites

- Projected Pool: short 1-paragraph version
- Gross Pool (stat card): short version referencing "settings"
- Job Categories (#4): "Enter your own Categories or use the ones provided."

## 4. Step 6 Rename

"Job Category Weights" -> "Category Weights"

## 5. Remove Placeholder Employees

Remove "Your Name 1-5" (IDs 11-15) from DEFAULT_EMPLOYEES.

## 6. Name Wrapping

Allow distribution table names to wrap instead of truncating. Handles "Katherine Lagunas-Hernandez" length names.

## 7. Weight Adjuster Hover UX

Compact mode shows number only at rest, reveals +/- buttons on hover.

## 8. Distribution Print Logo

Big centered logo matching Settings page print layout.
