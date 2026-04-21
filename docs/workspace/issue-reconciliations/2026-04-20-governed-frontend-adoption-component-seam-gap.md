# Governed Frontend Adoption Component Seam Gap

## Summary

The repo hardened governed frontend adoption around shared CSS entrypoints, but
it did not make shared render and controller seams equally mandatory.

That left a recurring drift path where app routes could import design-system
CSS, reuse some behavior helpers, and still locally duplicate governed markup
and interaction semantics.

## Root Cause

- ADR 0027 and the related adoption notes correctly blocked app-page CSS drift,
  but they defined only the styling prerequisite.
- The repo did not yet define governed adoption as a full source-of-truth
  contract over styling, markup, behavior, and accessibility semantics.
- As a result, app work repeatedly stopped at "shared CSS plus some shared JS"
  instead of requiring design-system-owned render seams.

Concrete examples in current source:

- `rootAdminShell` `Users` imports `list-page-shared.css`, but still owns local
  list-page markup and route-local controller behavior.
- `rootAdminShell` `web-app-hierarchy` imports shared form and hierarchy
  behavior helpers, but still duplicates `icon-grid`, `drawer-select`, and
  hierarchy-drawer markup inside app HTML.

## Why The Loop Missed It

- The repo had an explicit rule against app-page CSS, but not an equally
  explicit rule against copied governed markup or controller logic.
- Adoption reviews focused on visible parity and shared asset imports more than
  on whether the real app was consuming a design-system-owned render seam.
- Existing harness language left enough ambiguity that CSS sharing could be
  mistaken for honest governed adoption.

Gap classification:

- shared-seam blind spot
- incomplete adoption contract
- architecture and harness wording gap
- repeated drift opportunity

## Reconciliation Changes Added

- added ADR 0028 to require design-system-owned styling, render, and
  controller seams for governed app adoption
- updated `AGENTS.md` to make copied governed markup and copied governed
  interaction logic explicit drift
- refreshed frontend architecture and frontend implementation guidance so
  agents are told that shared CSS alone is insufficient
- added a durable governed app component-adoption contract with the current
  seam audit and recommended migration order

## Follow-Up Gap Still Open

- the repo now has the rule, and `icon-grid` is the first migrated family
  under the stronger seam contract
- next recommended targets are `drawer-select`, then the `hierarchy-tree`
  drawer host, followed by `form-template` hosted sections

## Additional Reconciliation Note

The first `icon-grid` migration still left one misleading gap: the app mounted
the DS-owned render helper, but it passed local consumer-specific internal copy
and dialog wording. That preserved shared structure ownership while still
letting the real app diverge from the visible design-system payload.

The follow-up fix tightened the seam further so the root-admin consumer now
uses the design-system-owned internal `icon-grid` payload instead of a local
reinterpretation of the picker body.

The next follow-up migrated `drawer-select` the same way:

- the root-admin consumer now mounts the DS-owned `drawer-select` host shell
  through `renderFormDrawerSelect(...)`
- page-specific option records still come from the root-admin controller as
  allowed consumer inputs
- the app no longer owns the trigger and drawer-shell markup for that family
- the app also no longer authors `drawer-select` option-row markup directly;
  it now feeds page records into the DS-owned
  `renderFormDrawerSelectOptions(...)` seam
