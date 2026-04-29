# Technical Steering Packet Template

Use this after Product Discovery is ready for Technical Steering and before
Story Breakdown, capability finalization, implementation blueprinting, Task
Breakdown, or Delivery.

Technical Steering decides architectural posture. It does not replace Product
Discovery, Story Breakdown, PRDs, capability matrices, implementation
blueprints, or Delivery.

## Status

- Packet status:
  `draft | blocked | ready-for-story-breakdown | superseded`
- Packet date:
- Steering ID:
- Source Product Discovery packet:
- Related ADRs reviewed:
- Validation status:
  `not-run | pass | blocked | not-applicable`

## Product Handoff

- Product Discovery status:
- Product intent preserved:
- Product questions resolved or carried as blockers:
- New family or template decision:
  `not-applicable | approved-existing-family | approved-new-family | blocked`

## Architecture Classification

Layer 2 owns the first authoritative decision about whether work is
feature-local, shared, platform-level, design-system-owned, or blocked on an
architecture decision.

Allowed classifications:

- `feature-local`
- `feature-public-seam`
- `platform-seam`
- `shared-lib-candidate`
- `design-system-seam`
- `architecture-foundation-required`
- `blocked`

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Rationale | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- | --- |

Allowed decision statuses:

- `approved`
- `blocked`
- `deferred-with-owner`

## Architecture Risk Flags

| Risk Area | Present | Evidence | Required Layer 3 Signal | Required Layer 4 Task Type |
| --- | --- | --- | --- | --- |

Use `yes`, `no`, or `blocked` for `Present`.

Recommended risk areas:

- API route or contract change
- persistence or migration change
- authz or permission change
- frontend rendered surface
- governed design-system seam
- shared platform/runtime seam
- reusable logic or extraction pressure
- data dictionary impact
- QA/runtime evidence need
- source-independent docs impact

## Deterministic Signal Checks

These checks make architecture classification less dependent on prose. Mark
each trigger `yes`, `no`, or `blocked`. A `yes` or `blocked` trigger must map
to the required classification and downstream task type, or explain the
approved exception.

| Trigger ID | Trigger Question | Trigger Status | Evidence | Required Classification | Required Layer 4 Task Type | Exception / Decision |
| --- | --- | --- | --- | --- | --- | --- |
| TSIG-PLATFORM-SEAM | Does the change touch shared router, middleware, session/auth platform, job/scheduler, scripts, harness, generated-artifact tooling, or other shared runtime machinery? |  |  | platform-seam | platform-seam |  |
| TSIG-API-CONTRACT | Does the change add or alter route contract, request/response shape, status codes, validation, pagination, sorting, or API auth behavior? |  |  | feature-local | API-contract |  |
| TSIG-PERSISTENCE | Does the change alter schema, indexes, query semantics, normalization, uniqueness, lifecycle fields, soft delete, migrations, or persistence harness behavior? |  |  | feature-local | migration/persistence |  |
| TSIG-PERMISSION | Does the change add or alter authz capability keys, grants, deny rules, tenant context, object-level permissions, or protected route access? |  |  | feature-local | permission-mapping |  |
| TSIG-GOVERNED-FRONTEND | Does the change add or alter governed app UI, shell chrome, navigation, drawers, dialogs, reusable controls, page chrome, app-page CSS, or design-system-owned behavior? |  |  | design-system-seam | design-system |  |
| TSIG-FRONTEND-SURFACE | Does the change add or alter a rendered frontend surface, browser workflow, frontend route, or served asset behavior? |  |  | feature-local | frontend |  |
| TSIG-SHARED-CODE | Does the change reuse, move, extract, or generalize logic across features or into `src/lib`? |  |  | shared-lib-candidate | refactor-first |  |
| TSIG-DATA-DICTIONARY | Does the change alter durable entity facts, fields, lifecycle, retention, searchable storage, indexes, or source-independent persistence truth? |  |  | feature-local | data-dictionary |  |
| TSIG-QA-RUNTIME | Does the change require runtime/browser/live-data/mock-honesty evidence or change QA release-gate posture? |  |  | feature-local | QA/evidence |  |
| TSIG-DOCS-ARTIFACT | Does the change alter source-independent docs, maintained artifacts, standards snapshots, reconstruction docs, bootstrap docs, or template/skill contracts? |  |  | feature-local | docs-artifact |  |

## Steering Decisions

| Decision ID | Decision | Rationale | Compatibility / Migration Strategy | Downstream Owner |
| --- | --- | --- | --- | --- |

## Blockers

| Blocker ID | Blocks | Blocker Type | Required Output | Owner |
| --- | --- | --- | --- | --- |

## Layer 3 Handoff

| Story Scope Element | Handoff Status | Required Classification IDs | Notes |
| --- | --- | --- | --- |

Allowed handoff statuses:

- `ready-for-story-breakdown`
- `blocked`
- `superseded`
