# Layer 2 Technical Steering Packet: Reporting Dashboard Template

## Status

- Steering status: `ready-for-layer-3-after-design-system-governance`
- Packet date: 2026-04-29
- Source discovery packet:
  `docs/workspace/product-discovery/2026-04-29-reporting-dashboard-template.md`
- Layer boundary:
  This packet stops at Technical Steering. It does not create a PRD,
  capability matrix, implementation blueprint, API contract, migration plan,
  executable test plan, route, schema, or product code.
- Requested stop condition:
  Do not proceed to Layer 3.

## Steering Summary

Create a governed design-system reporting dashboard template before any real
application dashboard, API binding, analytics repository integration, or saved
dashboard persistence work.

The first slice should be a `/design-system` pattern/template with actual
browser-memory interactions for composing rows, columns, containers, and
approved reporting widgets. The implementation path must preserve the repo's
design-system signoff defaults: app pages may not copy the template's markup,
controller behavior, or CSS later; they must consume a signed-off
design-system-owned seam.

Steering recommendation:

- Proceed next to design-system governance artifacts for a reporting dashboard
  template pattern.
- Keep the first slice design-system-only and browser-memory-backed.
- Do not select a production charting library in this steering packet.
- Do not add app-page CSS, app UI, persistence, APIs, analytics integration, or
  permissions in the first slice.
- Require rendered visual comparison before chart rendering approach lock.

## Source Product Decisions

Locked by Product Discovery:

- first outcome is a design-system page template
- template includes actual in-browser memory-backed composition
- layout model has rows, columns, and containers
- containers support number tiles with subnumbers, pie charts, histograms, line
  charts, bar charts, and box plots
- dashboard-level controls belong in a context-nav drawer
- widgets expose hover/detail inspection with keyboard and touch equivalents
- click-to-filter applies only to category-based visualizations
- first filter model supports one active category filter at a time
- filter state is visible, replaceable, and removable
- future consumers include root/operator and tenant-facing dashboards
- real app dashboard pages, APIs, analytics integration, and saved dashboard
  definitions are downstream

## Architectural Classification

- Change family: governed frontend/design-system extension
- Primary route family: `/design-system`
- Future app surface posture: governed first-consumer adoption only after
  signoff
- Backend feature impact for first slice: none
- Persistence impact for first slice: none
- API contract impact for first slice: none
- Tenant boundary impact for first slice: no runtime tenant data; future
  consumers must classify root or tenant scope explicitly
- Reporting/read-model impact: future risk only; the analytics/OLAP
  architecture layer is currently missing
- Asset upload/read impact: none
- New enduring frontend pattern likely: yes
- ADR likely required: yes if the chart/render seam or dashboard template
  consumption model becomes a reusable frontend architecture rule

## Steering Decisions

| Decision | Steering position | Rationale |
| --- | --- | --- |
| First implementation home | `/design-system` only | The discovery request is explicitly for a reusable design-system template before real app use. |
| Runtime data source | local sample fixtures in browser memory | Keeps the first slice independent of persistence, permissions, APIs, and analytics architecture. |
| Layout state | browser-memory state only | Demonstrates the authoring interaction without introducing durable dashboard definitions prematurely. |
| Future saved layouts | defer | Saved user-configurable dashboards require entity ownership, lifecycle, permissions, audit, and cleanup planning. |
| Chart rendering approach | defer until rendered comparison | Labels, density, themes, interaction, accessibility, and responsive behavior need visual proof before library selection. |
| App adoption model | consume signed-off design-system render/controller/style seams | The repo prohibits governed app pages from reconstructing design-system UI locally. |
| Context controls | compose with the existing context-nav drawer family if sufficient | Product Discovery locked the drawer placement; Technical Steering should avoid inventing a parallel dashboard-control surface. |
| Filter model | one active category filter intent | Matches discovery and prevents accidental multi-filter or API-specific overbuild. |
| Future data contract | map API/read-model responses into a dashboard widget data seam | Keeps production data contracts out of the design-system template while preserving a future integration path. |

## Proposed Design-System Artifact Chain

Create these artifacts before Layer 3 implementation planning:

- `docs/workspace/design-system/behavior-locks/reporting-dashboard-template-behavior-lock.md`
- `docs/workspace/design-system/reference-packs/reporting-dashboard-template-reference-pack.md`
- `docs/workspace/design-system/verification/reporting-dashboard-template-verification-checklist.md`
- a design-system pattern artifact derived from
  `docs/templates/design-system-pattern-template.md`
- canonical/rendering entries for representative dashboard states
- an adoption contract only when the first real app consumer is approved

The behavior lock should own:

- row add/remove behavior
- column/container composition rules
- widget selection and replacement behavior
- empty, loading, no-data, incompatible-data, and error states
- chart detail behavior for pointer, keyboard, and touch
- one-active-filter selection, replacement, clear, and no-result states
- context-nav drawer control placement and state
- responsive stacking and overflow rules

## Conceptual Seam Shape

Layer 3 should decide exact names and file paths, but the durable shape should
separate these concerns:

- render seam:
  design-system-owned dashboard shell, rows, containers, widget frames, filter
  indicator, and drawer-control placement
- controller seam:
  browser-memory layout operations, widget selection, hover/focus detail state,
  and selected filter intent
- data seam:
  sample dashboard data shapes for each widget type, plus explicit incompatible
  and no-data examples
- event seam:
  one active `category-filter-intent` emitted by eligible category-based chart
  marks and ignored by unsupported widgets
- adoption seam:
  future app pages bind production data and authorization outside the template
  while consuming the signed-off render/controller/style source of truth

The first design-system implementation should not make the template depend on
future API shapes, mutable analytics records, tenant context, or durable saved
dashboard definitions.

## Widget And Interaction Boundaries

Required widget families:

- number tile with title, primary value, and subnumber/comparison value
- pie chart
- histogram
- line chart
- bar chart
- box plot

Required interaction boundaries:

- detail inspection must work without mouse-only hover
- category filtering applies to category-bearing marks only
- number tiles and unsupported chart marks must clearly communicate that they
  are not filter targets
- applying a new filter replaces the previous active filter
- clearing the filter restores the unfiltered sample state
- no-result state must be represented honestly in canonical examples

## Accessibility Steering

Layer 3 must not treat chart hover bubbles as the only data access path.

The design-system loop should require:

- keyboard focus targets for interactive marks where feasible
- touch-accessible detail behavior
- visible selected-filter state
- screen-reader names for chart regions, filter controls, and unsupported
  filter targets
- an accessible data summary or equivalent detail fallback for chart values
- focus return and dismissal behavior for context-nav drawer controls
- long-label, high-density, outlier, empty, and no-data examples
- light, dark, responsive, RTL where applicable, and magnification checks

## Future App And API Boundary

Future app dashboard work needs separate Layer 3 planning and likely a PRD,
capability matrix, API/read-model contract, permission model, and adoption
contract.

Future consumers must decide:

- whether the dashboard is root, tenant, or explicitly approved
  shared-cross-tenant
- current tenant context and cross-tenant deny rules for tenant dashboards
- which feature owns dashboard data authorization
- whether data comes from operational APIs, reporting projections, analytics
  storage, or a separate analytics repository
- data freshness and unavailable/stale-data behavior
- audit/privacy expectations for viewed or exported reporting data
- whether saved dashboard definitions introduce durable state and cleanup
  semantics

The first design-system template must not imply that clicking a chart category
is authority to access filtered data. Future production filtering must still be
validated by the consuming feature's server-side authn/authz and data contract.

## Risks And Open Questions

| Risk / question | Steering posture | Required before Layer 3? |
| --- | --- | --- |
| Existing design-system seams may not expose enough shared render/controller reuse for this template. | Design-system governance must inspect and decide whether to extend existing seams or create a new family. | yes |
| Context-nav drawer may not yet support the exact dashboard-control composition needed. | Reuse existing family where possible; record gaps before implementation. | yes |
| Chart library choice may bias markup, accessibility, bundle size, and interaction model. | Compare rendered variants before locking. | yes |
| Analytics/OLAP architecture is missing. | Keep out of first slice; future app data binding needs separate architecture planning. | no for design-system-only; yes before app/API work |
| Saved dashboard configuration could become durable domain data. | Defer; future persistence work needs ownership, lifecycle, cleanup, audit, and permission planning. | no for design-system-only; yes before saved layouts |
| Root and tenant dashboards have different security boundaries. | Future consumers must classify exact boundary and authz model. | no for design-system-only; yes before app work |

## Layer 3 Entry Criteria

Layer 3 may start only after this steering packet is accepted and the next work
is explicitly requested.

Before implementation planning or source edits, Layer 3 must perform a
source-of-truth review against the current repo, not only this steering packet.
At minimum, review the applicable current-state and governance docs in these
families:

- architecture docs:
  `docs/architecture/system-overview.md`,
  `docs/architecture/frontend-overview.md`,
  `docs/architecture/priniciples.md`,
  `docs/architecture/change-control.md`,
  and the exact ADR discovery results described below
- ADR discovery:
  Layer 3 must search `docs/architecture/adr/` and list the exact ADR files
  reviewed for design-system governance, governed app adoption, frontend
  topology, shared render/controller seams, browser route families, reporting
  data boundaries, tenant isolation, authorization, and verification evidence.
  The initial ADR candidate set for this steering packet is:
  `0002-use-feature-bundle-architecture.md`,
  `0006-standardize-feature-internal-module-conventions.md`,
  `0007-standardize-cross-feature-api-and-entity-behavior-defaults.md`,
  `0008-standardize-searchable-field-storage-and-query-rules.md`,
  `0011-adopt-prd-driven-traceable-test-coverage.md`,
  `0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md`,
  `0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md`,
  `0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md`,
  `0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md`,
  `0025-adopt-a-security-first-page-state-replay-model.md`,
  `0027-use-approved-design-system-shared-asset-entrypoints-for-governed-app-page-adoption.md`,
  `0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md`,
  `0029-adopt-design-system-owned-page-shells-for-governed-app-route-families.md`,
  `0030-enforce-feature-public-seams-with-a-generated-dependency-graph.md`,
  and `0031-add-feature-manifests-for-declared-seams-and-dependencies.md`.
  If no matching ADR exists for an enduring decision area, record
  `no existing ADR found` and either propose a new ADR or explain why this
  slice does not require one. Conflicting or stale ADR guidance is a
  stop-and-escalate gap.
- architecture-map layers:
  frontend design system, frontend implementation, accessibility, browser
  shell, analytics/OLAP, reporting/export, tenant isolation, authorization,
  privacy, and compliance/evidence posture
- feature manifests:
  any touched or depended-on `src/features/*/feature.manifest.json` files,
  plus generated dependency graph artifacts if public seams or dependencies
  change
- API and data docs:
  maintained API contracts, OpenAPI/Postman artifacts, data dictionaries, and
  reporting/read-model docs if future app/API binding enters scope
- permission docs:
  capability matrices and `docs/architecture/permission-mappings/` if any
  authz capability, grant, root/tenant boundary, or tenant-context rule enters
  scope
- design-system docs:
  existing behavior locks, reference packs, verification checklists, adoption
  contracts, component inventory, canonical/parity conventions, and relevant
  `/design-system` route/source artifacts
- test harness docs:
  frontend visual gate docs, canonical rendering harness docs, Playwright or
  visual-regression helpers, and shared test harness files that would own
  dashboard template coverage

If Layer 3 uncovers a missing source-of-truth doc, stale artifact,
contradictory instruction, missing shared render/controller seam, undocumented
permission boundary, or test-harness gap, it must warn explicitly before
implementation proceeds. If the gap affects the selected architecture, the
design-system adoption model, app-page CSS prohibition, authz/tenant boundary,
API/data contract, or verification evidence, Layer 3 must stop and ask for a
governance decision instead of filling the gap silently.

Minimum entry criteria for design-system Layer 3:

- behavior-lock scope approved
- reference/canonical state inventory approved
- chart visual comparison plan approved
- context-nav drawer dependency checked
- planned write set limited to design-system artifacts and implementation
- explicit non-goal recorded for app UI, APIs, persistence, analytics
  integration, and saved dashboard definitions

Minimum entry criteria for future app dashboard Layer 3:

- signed-off design-system template and consumable adoption seam exist
- governed app adoption contract is drafted
- consuming feature and route boundary are known
- root/tenant permission model is classified
- API/read-model contract and data freshness posture are planned
- persistence/lifecycle decisions exist if saved layouts are included

## Explicit Non-Goals For This Packet

- no PRD
- no capability matrix
- no implementation blueprint
- no route or source-code change
- no chart library selection
- no app dashboard page
- no app-page CSS
- no API contract
- no analytics repository integration
- no persistence or migration
- no saved dashboard entity model
- no permission-mapping update
- no generated design-system artifact

## Recommended Next Step

When the requester approves moving beyond Layer 2, start a design-system
governance loop for the reporting dashboard template. The first downstream
artifact should be the behavior lock and canonical/reference state inventory,
not a real app page.
