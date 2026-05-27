# Breadcrumb RTL Menu Anchoring Drift

## Supersession Note

Archived on 2026-05-27 after the RTL menu-anchoring lesson was promoted into
the active breadcrumb behavior lock, reference pack, verification artifacts,
and `tests/audit/designSystem/breadcrumbOverflow.test.ts`.

Use the active breadcrumb design-system artifacts and audit test as current
authority. Keep this record as provenance for the escaped drift.

## Symptom

In RTL sub-nav canonicals, the breadcrumb expandable menu opened with LTR
anchoring and left-aligned content instead of mirroring to the RTL side of the
trigger.

## Root Cause

The shared breadcrumb menu styling only defined the base LTR anchor rule:

- `left: 0` on `.breadcrumb-collapse-menu`

There was no corresponding RTL override for the breadcrumb menu itself, even
though the surrounding breadcrumb list and row already mirrored correctly.

## Why The Loop Missed It

- Existing audits checked that breadcrumb menus and RTL row styles existed, but
  they did not verify RTL-specific anchoring for the breadcrumb popover.
- Manual review focused first on row fit and reduction behavior, which delayed
  noticing that the menu itself was still using LTR positioning semantics.

## Prevention Added

- Added explicit RTL anchoring for `.breadcrumb-collapse-menu` so it uses
  `right: 0` instead of `left: 0`.
- Added explicit RTL text alignment for breadcrumb menu items.
- Extended the breadcrumb audit so the RTL anchoring rule is now governed.
