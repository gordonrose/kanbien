# Root Admin Web App Hierarchy Form Parity Checklist

## Purpose

This checklist is the literal parity gate for `/root-admin#web-app-hierarchy`
as a governed app composition of:

- `hierarchy-tree` as the shell-attached drawer host
- `form-template` as the page-body editing surface
- `icon-grid` and `drawer-select` as DS-owned child-control seams

This checklist replaces the earlier mismatch-only posture with an honest
current-state review after the route was materially corrected.

Source references:

- route-level preflight:
  `docs/workspace/design-system/adoption/root-admin-web-app-hierarchy-governed-adoption-preflight.md`
- hierarchy host source:
  `src/frontend/designSystem/patterns/hierarchy-tree/index.html`
- form host source:
  use the signed-off canonical chain when the older live template route is not
  the reliable truth:
  `src/frontend/designSystem/canonicals/form-template/index.html`
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- current consumer:
  `src/frontend/rootAdminShell/index.html`
- related reconciliation note:
  `docs/workspace/issue-reconciliations/2026-04-20-root-admin-page-settings-form-template-adoption-drift.md`

## Authority

If this checklist conflicts with implementation convenience, this checklist
wins until a human explicitly changes the adoption contract or preflight.

## Current Honest Status

- The route no longer uses the earlier app-local workspace card shell.
- The page body now uses one visible `form-page-shell` and one visible
  `form-page-card`.
- The page settings child controls now mount through DS-owned `icon-grid` and
  `drawer-select` seams.
- The hierarchy launcher now lives in the `context-nav-bottom-group`.
- The hierarchy drawer remains the shell-attached hierarchy host.

Remaining honesty constraint:

- this route is still only a partial governed adoption at the host level
  because the hierarchy drawer host markup and the form-template hosted section
  composition are still authored in `rootAdminShell/index.html`

## Required Host Truth

### Hierarchy Host

- The hierarchy drawer launcher must live in the `context-nav-bottom-group`
  using the same `hierarchy-tree-nav-button` seam as the source pattern.
- The hierarchy drawer must read as an attached shell drawer, not as a
  floating page modal or ad hoc overlay.
- The page body must not introduce a second competing workspace shell that
  visually fights with the hierarchy drawer host.

### Form Host

- The page body must read as one governed editing surface, not as a stack of
  unrelated cards.
- The primary editing surface must use one visible `form-page-card`.
- The route must not mount nested visible `form-page-shell` hosts for the same
  page body.
- The primary action must remain inside the governed form footer/action rail,
  not as a route-local floating button.
- The visible route should preserve desktop form posture on desktop instead of
  forcing a mobile-only card treatment.

## Current Parity Findings

### Passing Parity Conditions

- One visible `form-page-shell` exists for the route body.
- One visible `form-page-card` exists for the route body.
- The hierarchy launcher lives in the `context-nav-bottom-group`.
- The hierarchy drawer remains attached and resizable in the governed shell.
- The page settings save action lives in the governed footer for the primary
  form.
- The child controls for icon and context-nav selection mount through
  DS-owned seams instead of route-local reconstruction.

### Remaining Structural Gap

- The route still composes the hosted hierarchy drawer shell and the
  form-template hosted sections locally in `rootAdminShell/index.html`.

Why this still matters:

- the visible parity is much better than the earlier broken state, but the
  route has not yet reached the stronger endpoint where those host seams are
  also DS-owned render seams

Required honesty:

- do not describe this route as fully governed adoption of those host seams
- do describe it as active partial adoption with parity guards in place

## Required Verification Guards

- Assert the hierarchy launcher remains inside `.context-nav-bottom-group`.
- Assert the route contains exactly one visible `form-page-shell`.
- Assert the route contains exactly one visible `form-page-card`.
- Assert no nested visible `form-page-shell` appears inside the page form.
- Assert the hierarchy drawer remains attached while the page settings form is
  visible.
- Keep a direct child-control mount assertion for `icon-grid` and
  `drawer-select`.
- Keep at least one human-visible guard against a page-body card stack or
  shell duplication reappearing.

## Browser-Suite Mapping

These checks belong in:

- `tests/visual/app/rootAdminShell/rootAdminWebAppHierarchy.spec.ts`

Minimum route-level parity proof should cover:

- hierarchy launcher placement
- attached drawer posture
- single-shell and single-card form host posture
- DS-owned child-control mounts
- save footer presence
- mobile drawer posture
- desktop resize behavior
- RTL mirroring

## Status

- Current state:
  parity materially improved and guarded, but still only partial governed host
  adoption because the route owns some host markup locally
- Allowed next step:
  maintain the current parity guards and only claim fuller governed adoption if
  the remaining host seams are extracted into DS-owned render seams
- Not allowed:
  reintroducing extra host shells, extra primary cards, ad hoc page controls,
  or copied child-control markup while presenting the route as governed
