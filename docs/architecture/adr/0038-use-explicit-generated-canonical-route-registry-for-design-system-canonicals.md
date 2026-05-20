# ADR 0038: Use Explicit Generated Canonical Route Registry For Design-System Canonicals

- Status: Accepted
- Date: 2026-05-07
- Deciders: Kanbien engineering
- Supersedes: N/A
- Superseded by: N/A

## Context

The design system now has governed component and pattern families that need
stable canonical rendering URLs in addition to their interactive review routes.

The `kanban-column` family is the current example:

- the interactive review surface lives at `/design-system/patterns/kanban-column`
- canonical launcher and detail surfaces live under
  `/design-system/canonical-renderings/kanban-column`
- the rendered canonical route resolves through
  `src/frontend/designSystem/router.ts`
- canonical records are also seeded through the `designSystemCanonicals`
  feature migrations

This creates a route shape that is more deliberate than plain file discovery.
The route must stay explicit enough to audit, while still letting canonical
families use shared render/controller seams and generated canonical metadata.

ADR 0023 already requires frontend architecture-sensitive router changes to
update the frontend overview and ADR trail. This decision records the enduring
design-system route posture behind those generated canonical entries.

## Decision

Use an explicit generated canonical route registry for design-system canonical
families that need stable launcher/detail URLs.

The registry may also hold review-candidate child families when a larger
governed template is being split into separately inspectable canonical
matrices. In that posture, each child family still needs its own launcher and
render route, but the route may share a render page with sibling child
families when that page imports the same parent render/controller seam instead
of copying the parent anatomy.

For each governed canonical family added to that registry:

- the registry entry must name the HTML source path that renders the canonical
  surface
- the registry entry must include a surface signature used to verify that the
  route resolved to the expected family
- the design-system artifact set must state whether the family is review-only,
  signed-off for design-system use, or approved for real-app adoption
- real-app adoption remains blocked unless a first-consumer adoption contract
  and product integration plan explicitly approve it
- review-candidate child families must keep launcher links pointed at their
  dedicated child render route, not at the parent template exploration route

The registry is a frontend architecture-sensitive seam. Adding, removing, or
renaming entries requires:

- `docs/architecture/frontend-overview.md` current-state sync
- an ADR update when the change introduces or changes an enduring route or
  governance pattern
- governed design-system verification evidence for the family being routed

## Consequences

### Positive

- canonical design-system routes stay explicit and auditable
- generated canonical route behavior has a durable architecture trail
- future component families can follow the Kanban-column pattern without
  inventing a new routing model each time
- real-app adoption remains clearly separated from design-system sign-off

### Negative

- adding a canonical family has architecture-documentation overhead even when
  the implementation is mostly design-system-local
- the registry must be kept in sync with canonical artifacts and verification
  evidence

### Neutral / Follow-up

- keep the registry narrow; ordinary file-routed design-system pages should
  remain file-routed
- if canonical routing becomes broad enough to need materialization tooling,
  create a separate steering decision before replacing the explicit registry
