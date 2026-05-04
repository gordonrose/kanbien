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
- `DEV:platform-seam`
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
- DEV:frontend rendered surface
- governed GOV:design-system seam
- shared platform/runtime seam
- reusable logic or extraction pressure
- data dictionary impact
- QA/runtime evidence need
- source-independent docs impact

## Architecture Decision Analysis

Layer 2 owns architecture decision quality. For every material architecture
classification that approves, blocks, or routes architecture-sensitive work,
record the option, trade-off, risk, cost, and signoff analysis here. Use
`not-applicable: <reason>` only when a field truly does not apply.

Allowed analysis statuses:

- `approved`
- `incomplete`
- `blocked`
- `not-required-with-rationale`

| Decision ID | Concern Area | Architecture Question | Analysis Status | Options Considered | Industry / Best-Practice Baseline | Local Repo Constraints | Trade-Offs | Risk Review | Cost / Delivery Impact | Security / Privacy / Compliance Impact | Operability Impact | Migration / Compatibility Impact | Testability / Evidence Impact | Reversibility | Recommended Option | Rejected Alternatives | Decision Owner / Signoff | Durable Authority Target |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Frontend Architecture Classification

For frontend-affecting work, Layer 2 owns DEV:frontend placement, route,
topology, authority, state, shell, GOV:design-system prerequisite, and
materialization decisions. Layer 3 must preserve these decisions. Layer 4 must
package and enforce them without inventing DEV:frontend architecture.

Use `not-applicable` fields with a concrete reason only when the packet has no
DEV:frontend impact. Frontend-affecting packets with missing rows are blocked.

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Allowed route families:

- `design-system`
- `root-admin`
- `login`
- `new-family`
- `not-applicable`

Allowed runtime shapes:

- `file-routed-reference`
- `app-shell`
- `support-route`
- `generated-route`
- `static-asset`
- `browser-workflow`
- `not-applicable`

Allowed surface classes:

- `page`
- `journey`
- `canonical`
- `pattern`
- `template`
- `support`
- `app-adoption`
- `generated-materialization`
- `not-applicable`

Allowed topology classes:

- `durable-page`
- `durable-subroute`
- `journey-state`
- `ui-state`
- `support-only`
- `not-topology`

Allowed locator types:

- `path`
- `hash-state`
- `none`
- `migration`

Allowed topology authorities:

- `curated-webAppHierarchyBuilder`
- `discovered-webAppSurfaceDiscovery`
- `design-system-file-route`
- `manual-shell-registry`
- `generated-materializer`
- `support-only`
- `not-applicable`

Allowed authority transition postures:

- `not-applicable`
- `target-authority-current`
- `transitional-accepted`
- `transition-required`
- `blocked-until-transition`

Allowed state owners:

- `curated-topology`
- `page-settings`
- `feature-local-state-machine`
- `ui-local`
- `server-backed-snapshot`
- `never-serialize`
- `not-applicable`

Allowed shell governance postures:

- `DS-owned-shell-required`
- `local-legacy-shell`
- `exception-approved`
- `not-applicable`

Allowed GOV:design-system prerequisites:

- `signed-off-seam-exists`
- `DS-task-required`
- `approved-exception`
- `not-governed`

Allowed materialization models:

- `preview-apply-required`
- `manual-file-route`
- `shell-registry-update`
- `support-route-only`
- `none`

Allowed source placement values:

- `shell-bootstrap`
- `shell-route-registry`
- `module-journey-files`
- `design-system-family-files`
- `support-route-files`
- `generated-output`
- `not-applicable`

Source placement rule:

- app shell entry files such as `rootAdminShell/assets/app.mjs` own bootstrap,
  session, route resolution, shell registry, and shell composition only
- page, module, and journey behavior must live in module/journey files rather
  than accumulating in the root shell entry file
- governed GOV:design-system behavior must come from design-system-owned family
  files and shared app-consumption seams

Allowed route visibility values:

- `primary-nav`
- `context-nav`
- `deep-link-only`
- `support-only`
- `hidden/internal`
- `not-applicable`

Allowed actor scopes:

- `root-operator`
- `tenant-actor`
- `public-pre-auth`
- `support/operator`
- `not-applicable`

Allowed implementation readiness values:

- `ready`
- `blocked-on-architecture`
- `blocked-on-design-system`
- `blocked-on-security`
- `blocked-on-artifacts`
- `blocked-on-topology-transition`
- `not-applicable`

## Browser Security Posture

For frontend-affecting work, this section is a gate. Layer 2 must classify
browser security implications before Layer 3 or Layer 4 can proceed.

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie |  |  |  |  |
| csp-assets |  |  |  |  |
| privileged-helper |  |  |  |  |
| csrf-mutation |  |  |  |  |
| url-replay-state |  |  |  |  |
| sensitive-rendering |  |  |  |  |
| asset-delivery |  |  |  |  |

Use `yes`, `no`, or `blocked` for `Present`. Use `yes` or `no` for
`Stop If Missing`. A `blocked` security posture blocks handoff.

## Artifact Obligations

For frontend-affecting work, this section is a handoff-blocking artifact bill.
Layer 4 must assign required artifacts to tasks, prove they are current, defer
them with an approved owner and non-blocking rationale, or block Delivery
handoff.

| Artifact | Required Action | Owner Layer | Blocks Handoff | Notes |
| --- | --- | --- | --- | --- |

Allowed required actions:

- `create`
- `update`
- `prove-current`
- `defer-approved`
- `not-applicable`

Use `yes` or `no` for `Blocks Handoff`.

## Deterministic Signal Checks

These checks make architecture classification less dependent on prose. Mark
each trigger `yes`, `no`, or `blocked`. A `yes` or `blocked` trigger must map
to the required classification and downstream task type, or explain the
approved exception.

| Trigger ID | Trigger Question | Trigger Status | Evidence | Required Classification | Required Layer 4 Task Type | Exception / Decision |
| --- | --- | --- | --- | --- | --- | --- |
| TSIG-PLATFORM-SEAM | Does the change touch shared router, middleware, session/auth platform, job/scheduler, scripts, harness, generated-artifact tooling, or other shared runtime machinery? |  |  | platform-seam | DEV:platform-seam |  |
| TSIG-API-CONTRACT | Does the change add or alter route contract, request/response shape, status codes, validation, pagination, sorting, or API auth behavior? |  |  | feature-local | DOC:api-contract |  |
| TSIG-PERSISTENCE | Does the change alter schema, indexes, query semantics, normalization, uniqueness, lifecycle fields, soft delete, migrations, or persistence harness behavior? |  |  | feature-local | DEV:migration-persistence |  |
| TSIG-PERMISSION | Does the change add or alter authz capability keys, grants, deny rules, tenant context, object-level permissions, or protected route access? |  |  | feature-local | DOC:permission-mapping |  |
| TSIG-GOVERNED-FRONTEND | Does the change add or alter governed app UI, shell chrome, navigation, drawers, dialogs, reusable controls, page chrome, app-page CSS, or design-system-owned behavior? |  |  | design-system-seam | GOV:design-system |  |
| TSIG-FRONTEND-SURFACE | Does the change add or alter a rendered DEV:frontend surface, browser workflow, DEV:frontend route, or served asset behavior? |  |  | feature-local | DEV:frontend |  |
| TSIG-SHARED-CODE | Does the change reuse, move, extract, or generalize logic across features or into `src/lib`? |  |  | shared-lib-candidate | DECISION:refactor-first |  |
| TSIG-DATA-DICTIONARY | Does the change alter durable entity facts, fields, lifecycle, retention, searchable storage, indexes, or source-independent persistence truth? |  |  | feature-local | DOC:data-dictionary |  |
| TSIG-QA-RUNTIME | Does the change require runtime/browser/live-data/mock-honesty evidence or change QA release-gate posture? |  |  | feature-local | EVIDENCE:qa-evidence |  |
| TSIG-DOCS-ARTIFACT | Does the change alter source-independent docs, maintained artifacts, standards snapshots, reconstruction docs, bootstrap docs, or template/skill contracts? |  |  | feature-local | DOC:docs-artifact |  |

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
