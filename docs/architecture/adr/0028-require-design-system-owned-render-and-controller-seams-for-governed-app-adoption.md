# ADR 0028: Require Design-System-Owned Render And Controller Seams For Governed App Adoption

- Status: Accepted
- Date: 2026-04-20
- Deciders: Kanbien engineering
- Supersedes: ADR 0027
- Superseded by: N/A

## Context

ADR 0027 established an important prerequisite: governed app routes must import
approved design-system CSS through explicit shared asset entrypoints instead of
adding app-page CSS or depending on incidental classes.

That rule is necessary, but it is not sufficient.

Current source audit shows a repeatable failure mode:

- `rootAdminShell` `Users` imports
  `/design-system/assets/list-page-shared.css`, but still owns local list-page
  markup and route-local controller behavior
- `rootAdminShell` `web-app-hierarchy` imports shared design-system behavior
  from `/design-system/assets/hierarchyTree.mjs` and
  `/design-system/assets/formControls.mjs`, but still duplicates the hosted
  `icon-grid`, `drawer-select`, and hierarchy-drawer markup locally
- because the real app still owns structure and behavior in those areas,
  design-system changes do not flow through reliably even when shared CSS is
  imported

This drift keeps recurring because the repo has treated governed adoption as a
styling problem first and a source-of-truth problem second.

For governed frontend families, that posture is too weak. The design system is
supposed to own look, feel, structure, behavior, and accessibility semantics,
not just stylesheets.

## Decision

Adopt a stronger governed app-consumption contract.

For governed frontend families, shared CSS imports alone do not count as
design-system adoption.

Governed app adoption must consume the design-system-owned source of truth for:

- visual styling
- render structure and markup
- interaction behavior
- accessibility and state semantics

### Required App-Consumption Seams

When a governed family is intended for real-app adoption, the design system
should publish all of these:

- a shared CSS seam
- a shared render or markup seam
- a shared interaction or controller seam
- an explicit allowed-consumer-input contract

The allowed consumer inputs should stay narrow and family-owned, such as:

- labels or copy explicitly approved for that consumer
- value inputs or option records
- route data or tree data
- capability-driven visibility flags
- approved callbacks for business actions

### App Consumer Rule

Real app consumers may own:

- backend and route data wiring
- permission checks and capability-driven visibility
- composition of multiple already-approved governed families
- business copy outside the governed family boundary

Real app consumers must not own:

- copied governed family markup
- copied ARIA or state semantics
- page-local controller logic that recreates governed interactions
- page-local layout or behavior forks presented as adoption

Duplicating governed component markup in an app page is drift unless an
explicit exception is approved.

Duplicating governed interaction logic in an app page is drift unless an
explicit exception is approved.

### Missing Seam Rule

If a governed family does not yet expose a consumable shared render or
behavior seam:

- stop the app implementation
- raise the gap for human decision
- do not satisfy adoption by copying HTML structure, ARIA or state behavior, or
  page-local controller logic into the app
- do not treat shared CSS alone as sufficient governed adoption

Human review must decide whether to:

- add the missing seam through the design-system loop
- defer the app migration
- approve an explicit exception

## Consequences

### Positive

- governed app adoption now has one honest definition of reuse instead of a
  CSS-only approximation
- design-system fixes and upgrades can flow into real consumers through shared
  render and controller seams, not just through style imports
- repo rules become strong enough to block repeated markup and behavior drift

### Negative

- some current consumers now classify as partial or transitional adoption
  rather than fully governed adoption
- additional extraction work is required before some families are honestly
  app-consumable
- app work may pause more often while waiting for design-system-owned render or
  behavior seams

### Follow-up

- refresh frontend architecture docs so current-state audit distinguishes CSS,
  render, and controller seams
- refresh frontend implementation and design-system harness guidance so agents
  are told that CSS-only sharing is insufficient
- record the first migration order for current candidate families rather than
  silently rewriting multiple app routes at once
