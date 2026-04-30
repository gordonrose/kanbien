# Story Breakdown: Reporting Dashboard Template

## Status

- Packet status:
  `blocked`
- Packet date:
  2026-04-29
- Epic ID:
  `EPIC-REPORTING-DASHBOARD-TEMPLATE`
- Epic title:
  Reporting dashboard template
- Source Product Discovery packet:
  `docs/workspace/product-discovery/2026-04-29-reporting-dashboard-template.md`
- Source Technical Steering packet:
  `docs/workspace/technical-steering/2026-04-29-reporting-dashboard-template-steering.md`
- Related PRD:
  not created in this layer
- Related capability matrix:
  not created in this layer
- Related design-system, asset, ADR, or architecture artifacts:
  `docs/architecture/guides/story-breakdown-test-design-guide.md`; design-system
  behavior lock, reference pack, verification checklist, and canonical entries
  named by Technical Steering
- Validation command:
  `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-04-29-reporting-dashboard-template-story-breakdown.md`
- Validation status:
  `pass`

## Handoff Validation

- Product Discovery status:
  `ready-for-technical-steering`
- Technical Steering status:
  `ready-for-layer-3-after-design-system-governance`
- Steering non-goals preserved:
  no app dashboard page, no analytics API binding, no saved dashboard
  persistence, no production charting-library lock, no permissions, no tenant
  data access, no PRD, no capability matrix, no source code, no Task Breakdown
  in this packet
- Steering stop conditions resolved or carried as blockers:
  requester asked for the remaining Layer 3 pass; design-system behavior locks,
  chart-rendering comparison, capability matrix coverage, future app/API
  planning, and adoption contracts remain downstream blockers
- Architecture invention check:
  `consumes-steering-only`
- Governed frontend seam posture:
  `missing-seam`
- Asset/security/tenant/authz/persistence/migration/compliance risks:
  first slice has no runtime tenant data, assets, API, persistence, or
  permission impact; future app consumers must classify root or tenant
  boundary, data authorization, privacy, reporting freshness, export posture,
  and saved-layout lifecycle before app/API work
- Missing source-of-truth artifacts:
  design-system behavior lock, reference pack, verification checklist,
  canonical/rendering entries, pattern artifact, capability matrix, PRD if
  future production dashboard scope enters, API/read-model contracts for app
  consumers, adoption contract for first app consumer

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| C-001 | Reporting dashboard template family | design-system-seam | `/design-system` reporting dashboard template | approved | Design-system task for behavior lock, reference pack, verification checklist, pattern artifact, and canonical state inventory |
| C-002 | Browser-memory dashboard render and controller seam | design-system-seam | Design-system-owned render/controller/style source of truth | approved | Frontend task only after design-system governance records row, column, container, widget, detail, and filter behavior |
| C-003 | Chart rendering approach | architecture-foundation-required | Design-system governance and chart comparison evidence | deferred-with-owner | Architecture-foundation or design-system task for rendered comparison before widget delivery |
| C-004 | Context-nav dashboard controls | design-system-seam | Existing context-nav drawer family or approved extension | deferred-with-owner | Design-system task to confirm reuse or record the missing drawer seam |
| C-005 | Future app dashboard adoption | feature-public-seam | Future signed-off design-system adoption seam | deferred-with-owner | Standards-compliance task blocks app reconstruction until adoption contract and app boundary planning exist |
| C-006 | Future dashboard API, analytics, saved layout, and permission scope | architecture-foundation-required | Future app/API planning owner | deferred-with-owner | No Layer 4 implementation task in this packet; future scope requires separate planning |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-000 | Capability matrix normalization | blocked | No approved reporting dashboard template capability matrix exists and ART-001 blocks Task Breakdown. | docs-artifact |
| S-001 | Design-system artifact chain | blocked | Behavior lock, reference pack, verification checklist, pattern artifact, canonical inventory, and chart comparison posture are missing. | design-system |
| S-001 | Chart comparison decision | blocked | Technical Steering defers chart rendering approach until rendered variants are compared. | architecture-foundation |
| S-002 | Browser-memory layout composition | blocked | Layout delivery depends on capability rows and the design-system artifact chain. | frontend |
| S-003 | Supported reporting widgets | blocked | Widget delivery depends on capability rows, governed fixture contract, and chart rendering comparison. | frontend |
| S-004 | Accessible detail inspection | blocked | Detail behavior depends on widget seam, accessibility behavior lock, and canonical scenarios. | frontend |
| S-005 | Category filter intent | blocked | Filter behavior depends on widget and detail behavior decisions plus governed canonical states. | frontend |
| S-006 | Context-nav dashboard controls | blocked | Context-nav drawer composition support is not yet confirmed. | design-system |
| S-007 | Future app adoption guardrail | blocked | Future app dashboard adoption requires signed-off seams and first-consumer boundary planning. | standards-compliance |

## Epic Summary

- Epic job to be done:
  Design-system maintainers need a governed reporting dashboard template that
  proves browser-memory row, column, container, widget, detail, and category
  filter behavior before real app dashboards consume it.
- Epic outcome:
  Dashboard builders can later consume a signed-off render/controller/style
  seam instead of reconstructing reporting dashboard layout and chart
  interactions in app pages.
- Epic actors:
  design-system maintainer, dashboard template author, future app builder,
  future dashboard viewer, frontend governance reviewer
- Epic non-goals:
  production analytics integration, saved dashboard definitions, real app
  dashboards, export behavior, app-page CSS, tenant authorization, broad
  reporting architecture, provider-backed chart data
- Epic dependency summary:
  The first slice depends on design-system route and canonical infrastructure,
  context-nav drawer behavior, browser-memory fixtures, chart rendering
  comparison, and governed adoption rules.
- Epic-level proof target:
  `human-visible-parity`

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | needs-capability-matrix | harness-value | docs-artifact | Capability matrix normalization | As the delivery harness, I need reporting dashboard template stories translated into capability rows so design-system delivery starts from explicit obligations. | harness | Capability rows cover every story acceptance criterion or record non-capability rationale. | Blocks all delivery stories |
| S-001 | needs-prd-refinement | system-value | architecture-foundation | Design-system scope and artifact chain lock | As frontend governance, I need the template family, behavior lock, reference pack, verification checklist, canonical state set, and chart comparison posture locked. | design-system governance | The first slice can proceed as design-system-only without app, API, or persistence scope drift. | Blocks S-002 through S-006 |
| S-002 | needs-capability-matrix | user-value | frontend | Browser-memory layout composition | As a dashboard template author, I need to add rows, add columns, and form containers in browser memory. | design-system maintainer | The template demonstrates governed row, column, container, empty, and responsive composition behavior. | Depends on S-000 and S-001 |
| S-003 | needs-capability-matrix | user-value | frontend | Supported reporting widgets | As a dashboard template author, I need to populate containers with number tiles, pie charts, histograms, line charts, bar charts, and box plots using approved sample data. | design-system maintainer | Each required widget has signed-off visual, empty, no-data, incompatible-data, and dense-data states. | Depends on S-000 and S-001 |
| S-004 | needs-capability-matrix | user-value | frontend | Detail inspection and accessible data access | As a dashboard viewer, I need pointer, keyboard, touch, and assistive paths to inspect widget values. | dashboard viewer | Hover detail is not the only path to chart values, and detail behavior is signed off across input modes. | Depends on S-002 and S-003 |
| S-005 | needs-capability-matrix | user-value | frontend | One active category filter intent | As a dashboard viewer, I need eligible category marks to emit one visible filter intent that can be replaced or cleared. | dashboard viewer | Category filter behavior is local, explicit, removable, and honest for unsupported widgets and no-result states. | Depends on S-003 and S-004 |
| S-006 | needs-capability-matrix | system-value | frontend | Context-nav dashboard controls | As a design-system maintainer, I need dashboard-level controls to live in the governed context-nav drawer if that family supports the composition. | design-system governance | Dashboard controls reuse context-nav behavior or record a blocker for a governed extension. | Depends on S-001 |
| S-007 | needs-capability-matrix | harness-value | standards-compliance | Future app adoption guardrail | As repo governance, I need future app dashboard consumers to be blocked from local markup, controller, or CSS reconstruction. | repo governance | Adoption work starts only after a signed-off design-system seam and explicit app/data boundary planning. | Depends on S-001 through S-006 |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | S-000 | The capability matrix names the template scope, composition behavior, required widgets, detail behavior, filter intent, context controls, canonical states, and adoption guardrail rows. | contract-level | capability-matrix coverage; traceability review | capability matrix |
| AC-S000-02 | S-000 | Every acceptance criterion in this packet maps to an approved capability row or records why the criterion is governance-only. | contract-level | traceability review | capability matrix |
| AC-S001-01 | S-001 | Design-system governance creates or refreshes the reporting dashboard template behavior lock, reference pack, verification checklist, pattern artifact, and canonical state inventory before source delivery planning. | source-level | design-system artifact review; standards review | design-system artifacts |
| AC-S001-02 | S-001 | The artifact chain records that the first slice is browser-memory design-system work and does not include app routes, production APIs, analytics repositories, saved layouts, or permissions. | contract-level | scope-boundary review; artifact review | behavior lock; capability matrix |
| AC-S001-03 | S-001 | Chart rendering approach remains unlocked until rendered variants are compared for labels, density, theme, accessibility, responsive behavior, and interaction affordances. | human-visible-parity | visual comparison; accessibility review | verification checklist; reference pack |
| AC-S002-01 | S-002 | The template supports adding and removing rows, adding columns within rows, and showing empty row, empty column, and empty container states without durable persistence. | rendered-browser | browser interaction; responsive states | behavior lock; canonical scenarios |
| AC-S002-02 | S-002 | Responsive behavior defines how columns stack, compress, or overflow across mobile, magnified, and dense states without app-page CSS. | rendered-browser | visual regression; responsive geometry | reference pack; verification checklist |
| AC-S003-01 | S-003 | Number tile, pie chart, histogram, line chart, bar chart, and box plot widgets each render from local sample fixtures with approved title, value, label, and unit semantics. | rendered-browser | widget visual matrix; fixture contract | pattern artifact; canonical scenarios |
| AC-S003-02 | S-003 | Widget examples include empty, loading, no-data, incompatible-data, too-many-category, long-label, null-value, negative-value, and outlier states. | human-visible-parity | state matrix; accessibility review | reference pack; verification checklist |
| AC-S004-01 | S-004 | Detail inspection works through pointer, keyboard, and touch-equivalent interaction, with screen-reader names or data-summary access for chart values. | rendered-browser | accessibility; keyboard; touch | behavior lock; verification checklist |
| AC-S004-02 | S-004 | Detail dismissal, focus return, and chart-region naming are recorded so detail panels do not become mouse-only hover bubbles. | rendered-browser | focus management; screen-reader review | behavior lock; canonical scenarios |
| AC-S005-01 | S-005 | Category-bearing chart marks can set exactly one active filter intent, applying a new filter replaces the previous one, and clearing restores the unfiltered sample state. | rendered-browser | browser interaction; state transition | behavior lock; canonical scenarios |
| AC-S005-02 | S-005 | Number tiles and unsupported chart marks communicate that they are not filter targets, and no-result filtered states are represented honestly. | human-visible-parity | unsupported-state review; no-result review | reference pack; verification checklist |
| AC-S006-01 | S-006 | Dashboard-level controls are composed through the existing context-nav drawer family or a recorded design-system blocker names the missing drawer seam. | source-level | design-system seam review; source inspection | behavior lock; context-nav alignment note |
| AC-S006-02 | S-006 | Drawer control states include open, close, invalid selection, unavailable control, focus return, and responsive behavior within the dashboard template. | rendered-browser | browser interaction; accessibility | canonical scenarios; verification checklist |
| AC-S007-01 | S-007 | Future app dashboard adoption requires a signed-off render/controller/style seam and an adoption contract before any real app consumer reconstructs dashboard UI. | source-level | governed adoption review; standards review | adoption contract when first app consumer exists |
| AC-S007-02 | S-007 | Future production dashboard work is marked as separate planning for API/read-model contracts, root or tenant boundary, authorization, privacy, reporting freshness, and saved-layout lifecycle. | contract-level | architecture review; artifact ledger review | PRD or steering packet for future app scope |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-000 | AC-S000-01 | Reporting dashboard template capability matrix control rows | planning | create-or-refresh-required | Default control story because no approved matrix exists. |
| S-000 | AC-S000-02 | Reporting dashboard template traceability rows | planning | create-or-refresh-required | Must cover AC-to-row mapping. |
| S-001 | AC-S001-01 | reporting-dashboard.design-system.artifact-chain | design-system governance | create-or-refresh-required | Names required source-independent artifacts. |
| S-001 | AC-S001-02 | reporting-dashboard.design-system.scope-boundary | design-system governance | create-or-refresh-required | Prevents app/API/persistence drift in first slice. |
| S-001 | AC-S001-03 | reporting-dashboard.chart-rendering.review | design-system governance | create-or-refresh-required | Rendering approach remains evidence-driven. |
| S-002 | AC-S002-01 | reporting-dashboard.layout.compose | design-system template | create-or-refresh-required | Browser-memory layout behavior. |
| S-002 | AC-S002-02 | reporting-dashboard.layout.responsive | design-system template | create-or-refresh-required | Covers mobile, magnified, dense states. |
| S-003 | AC-S003-01 | reporting-dashboard.widget.render | design-system template | create-or-refresh-required | Covers required widget set. |
| S-003 | AC-S003-02 | reporting-dashboard.widget.state-matrix | design-system template | create-or-refresh-required | Covers fixture and degraded states. |
| S-004 | AC-S004-01 | reporting-dashboard.widget.detail.accessible | design-system template | create-or-refresh-required | Pointer, keyboard, touch, assistive access. |
| S-004 | AC-S004-02 | reporting-dashboard.widget.detail.focus | design-system template | create-or-refresh-required | Dismissal and focus semantics. |
| S-005 | AC-S005-01 | reporting-dashboard.filter.intent | design-system template | create-or-refresh-required | One active category filter. |
| S-005 | AC-S005-02 | reporting-dashboard.filter.unsupported-state | design-system template | create-or-refresh-required | Unsupported and no-result states. |
| S-006 | AC-S006-01 | reporting-dashboard.controls.context-nav | design-system seam | create-or-refresh-required | Context-nav reuse or blocker. |
| S-006 | AC-S006-02 | reporting-dashboard.controls.drawer-states | design-system seam | create-or-refresh-required | Drawer states and focus. |
| S-007 | AC-S007-01 | reporting-dashboard.app-adoption.guardrail | governed frontend adoption | create-or-refresh-required | First app consumer gate. |
| S-007 | AC-S007-02 | reporting-dashboard.future-production-boundary | future app planning | create-or-refresh-required | Separate root or tenant app planning. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 | S-001 / AC-S001-01 | design-system behavior-lock and reference-pack workflow | design-system-seam | existing | Artifact names behavior, references, verification, and canonical states. | Standards review confirms required design-system artifacts exist. |
| D-002 | S-001 / AC-S001-03 | chart rendering comparison harness | design-system-seam | new | Verification checklist records rendered variants and selection posture. | Browser visual scenarios compare labels, density, theme, and interaction. |
| D-003 | S-002 / AC-S002-01 | dashboard layout render/controller seam | design-system-seam | new | Behavior lock defines row, column, and container operations. | Browser interaction proves memory-backed layout transitions. |
| D-004 | S-002 / AC-S002-02 | responsive canonical infrastructure | design-system-seam | existing | Reference pack names mobile, magnified, dense, and overflow states. | Visual geometry scenarios prove stacking and overflow rules. |
| D-005 | S-003 / AC-S003-01 | dashboard widget sample-data seam | design-system-seam | new | Pattern artifact defines local fixture shape per widget type. | Browser scenarios render each required widget from fixtures. |
| D-006 | S-004 / AC-S004-01 | accessible chart detail seam | design-system-seam | new | Behavior lock defines pointer, keyboard, touch, and data-summary access. | Accessibility scenarios prove non-hover data access. |
| D-007 | S-005 / AC-S005-01 | category filter intent seam | design-system-seam | new | Event contract names local filter payload and unsupported targets. | Browser scenarios prove replace, clear, and no-result transitions. |
| D-008 | S-006 / AC-S006-01 | context-nav drawer family | design-system-seam | existing or changed | Alignment note confirms reuse or records missing composition support. | Drawer interaction scenarios prove focus and responsive behavior. |
| D-009 | S-007 / AC-S007-01 | governed app adoption contract | feature-public-seam | future | First app consumer contract names consumed render/controller/style seam. | Adoption review blocks local reconstruction in future app page. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| Reporting dashboard template render seam | design-system route; future app dashboards | Rows, columns, containers, widgets, filter indicator, and drawer placement render from governed source | App-page CSS or copied app markup | Design-system canonicals and future adoption browser proof |
| Reporting dashboard template controller seam | design-system route; future app dashboards | Browser-memory operations for layout, widget selection, detail, and filter intent | Durable saved dashboard definitions in first slice | Browser interaction scenarios |
| Reporting widget fixture seam | design-system route | Local sample data covers required widget and degraded states | Production analytics API shapes | Fixture contract and visual state matrix |
| Category filter intent seam | future app dashboards | One explicit category-filter intent can be bound by a future app data layer | Client-side filter acting as authority for server data access | Browser state proof now; server authz proof in future app scope |
| Future dashboard adoption seam | first app consumer | App pages consume signed-off render/controller/style behavior | Reconstructed governed UI in app page | Adoption contract and app browser proof |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | harness reviewer | repo artifact author | matrix absent; packet drafted | ACs unmapped; capability rows missing | stable story and AC IDs | draft queue to matrix-covered queue | missing matrix row; stale traceability | traceability; standards compliance |
| S-001 | design-system maintainer; frontend architect | design-system governance approval | steering accepted; design artifacts absent | template family undecided; chart approach undecided | artifact names; scope boundary | steering to design-system artifact chain | stale design-system seam; chart comparison missing | human-visible parity; accessibility |
| S-002 | dashboard template author | internal design-system author | empty dashboard; row editing | empty row; empty column; populated container | row count; column count; container identity | add row; remove row; add column; remove column | layout overflow; invalid operation | responsive behavior; visual stability |
| S-003 | dashboard template author | internal design-system author | widget picker active | number, pie, histogram, line, bar, box plot; empty; incompatible | titles; values; labels; units; nulls; outliers | empty container to populated widget | fixture mismatch; widget render failure | accessibility; dense data; theme support |
| S-004 | dashboard viewer | not-applicable: design-system sample | pointer user; keyboard user; touch user; screen-reader path | chart mark; data summary; detail panel | value label; series name; category name | focus mark; open detail; dismiss detail | focus lost; hover-only detail | accessibility; input parity |
| S-005 | dashboard viewer | not-applicable: design-system sample | no filter; active filter; unsupported target | category mark; number tile; no-result dashboard | category key; filter label; clear action | set filter; replace filter; clear filter | unsupported mark clicked; no-result state | predictable state; compatibility |
| S-006 | design-system maintainer | design-system governance approval | drawer closed; drawer open; mobile state | available control; invalid control; unavailable control | selected option; invalid value | open drawer; change control; close drawer | focus trap regression; missing drawer support | accessibility; responsive behavior |
| S-007 | repo governance reviewer; future app owner | adoption approval | design-system-only now; future app pending | signed-off seam; missing adoption contract | seam names; app boundary classification | design-system signoff to first app adoption | local reconstruction drift | standards compliance; maintainability |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | harness reviewer; matrix absent | reporting dashboard control rows | contract-level | TC obligation: matrix coverage review | no |
| AC-S000-02 | harness reviewer; unmapped ACs | reporting dashboard traceability rows | contract-level | TC obligation: AC-to-row review | no |
| AC-S001-01 | design-system governance; artifacts absent | artifact-chain row | source-level | TC obligation: artifact existence and status review | no |
| AC-S001-02 | design-system governance; scope boundary | scope-boundary row | contract-level | TC obligation: non-goal preservation review | no |
| AC-S001-03 | visual reviewer; chart variants | chart-rendering review row | human-visible-parity | TC obligation: rendered chart comparison scenarios | yes |
| AC-S002-01 | dashboard author; layout states | layout compose row | rendered-browser | TC obligation: row and column interaction scenarios | yes |
| AC-S002-02 | dashboard author; responsive states | layout responsive row | rendered-browser | TC obligation: mobile and magnified geometry scenarios | yes |
| AC-S003-01 | dashboard author; required widgets | widget render row | rendered-browser | TC obligation: required widget visual matrix | yes |
| AC-S003-02 | dashboard author; degraded data states | widget state matrix row | human-visible-parity | TC obligation: empty, incompatible, dense, outlier scenarios | yes |
| AC-S004-01 | dashboard viewer; pointer, keyboard, touch, assistive paths | accessible detail row | rendered-browser | TC obligation: non-hover data access scenarios | yes |
| AC-S004-02 | dashboard viewer; focus and dismissal | detail focus row | rendered-browser | TC obligation: focus return and dismissal scenarios | yes |
| AC-S005-01 | dashboard viewer; filter state transitions | filter intent row | rendered-browser | TC obligation: set, replace, clear, no-result scenarios | yes |
| AC-S005-02 | dashboard viewer; unsupported targets | unsupported filter state row | human-visible-parity | TC obligation: unsupported target messaging review | yes |
| AC-S006-01 | design-system maintainer; context-nav seam | context-nav controls row | source-level | TC obligation: drawer seam alignment review | yes |
| AC-S006-02 | design-system maintainer; drawer states | drawer states row | rendered-browser | TC obligation: drawer behavior and focus scenarios | yes |
| AC-S007-01 | future app owner; adoption gate | adoption guardrail row | source-level | TC obligation: governed adoption source review | no |
| AC-S007-02 | future app owner; app/API planning | future production boundary row | contract-level | TC obligation: future app boundary planning review | no |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| B-001 | S-002 through S-007 | capability-matrix | No approved reporting dashboard template capability matrix exists. | Capability matrix covering every AC row or explicit non-capability rationale. | Task Breakdown waits until matrix coverage exists. |
| B-002 | S-002 through S-006 | design-system-foundation | Reporting dashboard behavior lock, reference pack, verification checklist, pattern artifact, and canonical inventory do not yet exist. | Design-system artifact chain created and reviewed. | Frontend delivery waits until governed seam scope is recorded. |
| B-003 | S-003 through S-005 | architecture-foundation | Chart rendering approach remains intentionally deferred until rendered comparison. | Visual comparison note and selected rendering posture. | Widget and interaction delivery waits until comparison is complete or bounded. |
| B-004 | S-006 | design-system-foundation | Context-nav drawer may not support dashboard control composition. | Reuse confirmation or context-nav extension blocker. | Drawer-control delivery waits until the seam is known. |
| B-005 | S-007 | standards-compliance | Future app adoption requires separate boundary planning. | Adoption contract and future app/API planning artifacts when first consumer is approved. | Real app dashboard work waits for consumer-specific planning. |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| Q-001 | B-002 | Should reporting dashboard be modeled as a new design-system template family or an extension of an existing page-template family? | yes | requester approved architectural recommendation: create a new `reporting-dashboard-template` family because the dashboard canvas, rows, columns, containers, widgets, filter state, and settings/filter list are broader than a list-page variant |
| Q-002 | B-003 | Which chart rendering approach should proceed after rendered comparison across labels, density, themes, responsive states, and accessibility paths? | yes | requester approved architectural recommendation: use governed in-house SVG/HTML sample charts for the first design-system slice and defer production chart-library selection |
| Q-003 | B-004 | Does the existing context-nav drawer expose enough render and controller seam support for dashboard-level controls? | yes | requester clarified dashboard settings/filter UX: use a list/detail settings pattern where all possible settings or filters are listed and selecting one opens filter-value controls; dashboard-level controls may use existing list/detail and drawer seams before creating any context-nav extension |
| Q-004 | B-005 | Which future consumer will be the first governed app adoption target, and is that consumer root, tenant, or separately approved shared-cross-tenant? | no | future app owner |

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U-001 | S-001 through S-006 | Q-001; ART-002; ART-003; ART-004; ART-005 | design-system-governance | not-applicable: reporting-dashboard-template family decision is recorded | not-applicable: first slice is a new governed dashboard template family | Create behavior lock, reference pack, verification checklist, pattern artifact, and canonical states for the `reporting-dashboard-template` family. | yes | ready-to-create-artifact |
| U-002 | S-003 through S-005 | Q-002; ART-006 | design-system-governance | not-applicable: first-slice chart rendering posture is recorded | not-applicable: use in-house SVG/HTML sample charts and defer production chart library selection | Record chart-rendering comparison posture in the design-system artifacts and model chart types as child widget variants under the parent dashboard family. | yes | ready-to-create-artifact |
| U-003 | S-006 | Q-003 | design-system-governance | not-applicable: settings/filter UX recommendation is recorded | not-applicable: use list/detail settings pattern and existing drawer/list seams before creating a context-nav extension | Model dashboard settings and filters as a selectable list with detail controls for filter values; record any context-nav drawer gap only if existing seams cannot compose the controls. | yes | ready-to-create-artifact |
| U-004 | S-000 | ART-001 | capability-matrix-required | not-applicable: capability matrix can be derived from the recorded design-system decisions | not-applicable: no product choice required once design-system decisions are recorded | Create reporting dashboard template capability matrix rows for parent family obligations and child widget variant obligations. | yes | ready-to-create-artifact |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-001 | S-000 | capability matrix | create reporting dashboard template capability matrix | capability-matrix workflow | yes |
| ART-002 | S-001 | design-system behavior lock | create reporting dashboard template behavior lock | frontend-design-system-loop-maintainer | yes |
| ART-003 | S-001 | design-system reference pack | create reporting dashboard template reference pack | frontend-design-system-loop-maintainer | yes |
| ART-004 | S-001 | verification checklist | create reporting dashboard template verification checklist | frontend-test-case-maintainer | yes |
| ART-005 | S-001 | design-system pattern artifact | create reporting dashboard pattern artifact | frontend-design-system-loop-maintainer | yes |
| ART-006 | S-003 | visual comparison note | record chart rendering comparison outcome | frontend-design-system-loop-maintainer | yes |
| ART-007 | S-007 | adoption contract | create only when first app consumer is approved | frontend-design-system-loop-maintainer | no |
| ART-008 | S-007 | future app planning | create separate PRD, capability matrix, API/data/authz artifacts for app dashboard scope | product and architecture workflows | no |

## Story Readiness Summary

- Ready stories:
  none
- Blocked stories:
  S-000 through S-007 remain blocked on capability matrix and design-system
  artifact chain decisions.
- Stories needing capability matrix:
  S-000 through S-007
- Stories needing PRD refinement:
  none for the design-system-only reporting dashboard template; future app/API
  dashboard consumers need separate planning before app, analytics, saved
  layout, permission, or tenant-scoped work.
- Stories needing Technical Steering revisit:
  none if the first slice remains design-system-only and browser-memory-backed.
- Stories needing Product Discovery revisit:
  none.
- Broad cleanup or shortcut risk:
  `listed-below`
- Architecture invention risk:
  `none`

Shortcut risks:

- Selecting a production charting library without rendered comparison evidence.
- Treating the design-system template as a production analytics dashboard.
- Letting future app pages reconstruct dashboard markup, controller behavior,
  or app-page CSS instead of consuming signed-off seams.
- Treating chart category filtering as authority to access production data.
- Beginning Task Breakdown before capability rows and design-system artifacts
  exist.

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-000 | blocked | Capability matrix does not yet exist. |
| S-001 | blocked | Design-system artifact chain and chart comparison posture are not yet created. |
| S-002 | blocked | Layout composition delivery waits on S-000 and S-001. |
| S-003 | blocked | Widget delivery waits on capability rows, design-system artifacts, and chart comparison. |
| S-004 | blocked | Detail inspection delivery waits on widget seam and accessibility behavior lock. |
| S-005 | blocked | Filter intent delivery waits on widget and detail behavior decisions. |
| S-006 | blocked | Context-nav dashboard controls wait on context-nav seam review. |
| S-007 | blocked | Future app adoption waits on signed-off seam and first-consumer planning. |
