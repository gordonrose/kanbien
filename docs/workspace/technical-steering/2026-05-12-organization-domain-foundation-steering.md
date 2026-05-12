# Technical Steering Packet: Organization Domain Foundation

## Status

- Packet status: `ready-for-story-breakdown`
- Packet date: 2026-05-12
- Steering ID: `TS-2026-05-12-organization-domain-foundation`
- Source Product Discovery packet:
  `docs/workspace/product-discovery/2026-05-12-organization-domain-foundation.md`
- Related ADRs reviewed:
  - `docs/architecture/adr/0002-use-feature-bundle-architecture.md`
  - `docs/architecture/adr/0003-use-explicit-feature-registration-at-the-platform-router.md`
  - `docs/architecture/adr/0004-use-feature-scoped-sql-migrations-with-shared-runner.md`
  - `docs/architecture/adr/0006-standardize-feature-internal-module-conventions.md`
  - `docs/architecture/adr/0007-standardize-cross-feature-api-and-entity-behavior-defaults.md`
  - `docs/architecture/adr/0008-standardize-searchable-field-storage-and-query-rules.md`
  - `docs/architecture/adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md`
  - `docs/architecture/adr/0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md`
  - `docs/architecture/adr/0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md`
  - `docs/architecture/adr/0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md`
  - `docs/architecture/adr/0027-use-approved-design-system-shared-asset-entrypoints-for-governed-app-page-adoption.md`
  - `docs/architecture/adr/0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md`
  - `docs/architecture/adr/0029-adopt-design-system-owned-page-shells-for-governed-app-route-families.md`
  - `docs/architecture/adr/0030-enforce-feature-public-seams-with-a-generated-dependency-graph.md`
  - `docs/architecture/adr/0031-add-feature-manifests-for-declared-seams-and-dependencies.md`
  - `docs/architecture/adr/0032-promote-selected-root-admin-suites-from-hash-aliases-to-path-backed-canonical-routes.md`
  - `docs/architecture/adr/0035-adopt-object-storage-backed-asset-foundation.md`
  - `docs/architecture/adr/0036-adopt-layered-platform-authorization-evaluation.md`
  - `docs/architecture/adr/0037-separate-tenant-operational-lifecycle-from-deletion-posture.md`
  - `docs/architecture/adr/0041-adopt-context-account-architecture-for-discovery-intelligence.md`
- Validation status: `not-run`

## Product Handoff

- Product Discovery status: `ready-for-technical-steering`
- Product intent preserved: yes. The Organization domain foundation must let root admins and tenant admins manage the full tenant-scoped organization structure, including organizations, legal details, locations, weekly opening hours, business units, memberships, high-level integrations, public logos, system catalogues, separated-by-type search, and private background exports.
- Product questions resolved or carried as blockers:
  - root admins and tenant admins both manage organization-domain data from v1.
  - tenant admins manage all tenant-owned organization-domain records in their current customer/account space.
  - root admins share the general experience but see broader functionality/entities and own system catalogue management.
  - organizations are manually created by admins; no default organization is auto-created.
  - organizations and business units both support parent/child hierarchy with max depth 10 and cycle prevention.
  - parent archive requires either archive-whole-branch or move children elsewhere.
  - locations are many per organization; head-office flags are descriptive booleans, not uniqueness constraints.
  - opening hours are optional weekly slots only in v1.
  - memberships require real existing user/role records; placeholders are not allowed.
  - integrations are high-level official records only; secrets/configuration are future scope.
  - branding includes multiple public logo types with automatic public delivery after accepted upload.
  - logo replacement updates public usage everywhere after the replacement asset is accepted as safe/usable.
  - one active legal profile per organization in v1.
  - reference catalogues are system-owned; tenant admins can use values; root admins can create/edit/archive/deprecate/replace values.
  - broad search spans all pieces and returns results separated by type.
  - exports are section-selectable, background-job-backed, private, include all retained data and actual logo images, and expire after 24 hours or manual deletion.
  - audit/change history is behind the scenes for v1.
  - import/bulk upload, special opening-hour calendars, deep integration configuration, multiple active legal profiles, public non-logo organization pages, and admin-visible audit UI are out of v1.
- New family or template decision: `approved-new-family`

## Architecture Classification

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Rationale | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- | --- |
| TS-ORG-001 | Organization domain family | architecture-foundation-required | Organization domain family across multiple feature bundles | approved | This is a durable domain family, not one broad god-feature; feature split and ownership must be explicit before implementation. | DECISION:architecture-foundation |
| TS-ORG-002 | Organization core records | feature-local | `organizationCore` feature bundle | approved | Official organization identity, parent hierarchy, relationship type, catalogue references, lifecycle, and tenant ownership need a primary owning feature. | DEV:migration-persistence |
| TS-ORG-003 | Legal details | feature-local | `organizationLegalDetails` feature bundle | approved | One active legal profile per organization has distinct lifecycle, validation, and future extensibility from core organization identity. | DEV:migration-persistence |
| TS-ORG-004 | Locations and weekly opening hours | feature-local | `organizationLocations` and `locationOpeningHours` feature bundles | approved | Locations and repeatable weekly hour slots have separate record lifecycles and validation rules. | DEV:migration-persistence |
| TS-ORG-005 | Business-unit hierarchy and memberships | feature-local | `businessUnits` and `businessUnitMemberships` feature bundles | approved | Unit hierarchy, max depth, cycle prevention, and real user/role membership validation need feature-owned domain rules. | DEV:migration-persistence |
| TS-ORG-006 | High-level integration records | feature-local | `organizationIntegrations` feature bundle | approved | V1 records integration presence/purpose only; secrets/provider configuration are explicitly future scope. | DEV:migration-persistence |
| TS-ORG-007 | Branding/logo relationships | feature-public-seam | `organizationBrandingReferences` consuming assets feature | approved | Organization owns which logo type applies to which organization, while asset invariants/storage must remain in the assets feature. | DOC:asset-decision |
| TS-ORG-008 | System reference catalogues | feature-local | `organizationReferenceCatalogues` unless a broader platform catalogue feature is approved | deferred-with-owner | Domain/model/activity catalogue ownership is required; a broader platform catalogue may be better but is not approved yet. | DECISION:architecture-foundation |
| TS-ORG-009 | Public logo asset delivery | DEV:platform-seam | assets feature and public delivery policy | approved | Public delivery is explicitly part of v1 and must pass the asset upload/read decision gate before implementation. | DOC:asset-decision |
| TS-ORG-010 | Private export bundles | DEV:platform-seam | job processing, assets/file delivery, and export feature seam | approved | Exports are background jobs with private bundled files, actual images, 24-hour expiry, and cleanup/failure recording. | DECISION:job-cleanup |
| TS-ORG-011 | Root and tenant admin authorization | feature-public-seam | platform authorization plus root/tenant auth feature seams | approved | Root and tenant admins share general workflows but authority differs; tenant admins must be tenant-bound. | DOC:permission-mapping |
| TS-ORG-012 | Separated-by-type domain search | architecture-foundation-required | Organization domain read-model/search strategy | approved | Searching all pieces across many tables cannot be left to ad hoc browser filtering or unindexed text scans. | DECISION:architecture-foundation |
| TS-ORG-013 | Admin UI surfaces | design-system-seam | root-admin and future tenant-admin DS-owned management areas | approved | Separate management areas, search, branch archive/move, logo management, and export status are governed app UI. | GOV:design-system |
| TS-ORG-014 | Public read seams for Discovery/inspector | feature-public-seam | narrow exported Organization domain summaries | deferred-with-owner | Discovery/inspector need reduced summaries without private persistence imports, but exact consumers should be resolved after core records exist. | DOC:feature-manifest |
| TS-ORG-015 | Maintained artifact alignment | feature-local | planning and source-independent artifact sweep | approved | PRD, capability matrix, API contracts, data dictionaries, permissions, assets, jobs, tests, feature docs, manifests, and generated artifacts must stay aligned. | DOC:docs-artifact |

## Architecture Risk Flags

| Risk Area | Present | Evidence | Required Layer 3 Signal | Required Layer 4 Task Type |
| --- | --- | --- | --- | --- |
| API route or contract change | yes | Root and tenant admin CRUD/search/export/logo/catalogue behavior needs route contracts. | API contract story required before route implementation. | `DOC:api-contract` |
| persistence or migration change | yes | Many durable entities, hierarchy, lifecycle, search/indexes, exports, and asset relationships are required. | Persistence/data story required. | `DEV:migration-persistence` |
| authz or permission change | yes | Tenant admins manage all tenant-owned organization data; root manages broader and catalogues. | Permission mapping and object-rule story required. | `DOC:permission-mapping` |
| DEV:frontend rendered surface | yes | Separate root/tenant admin areas, logo management, search, archive/move, and export status are rendered surfaces. | Frontend story required after design-system prerequisites. | `DEV:frontend` |
| governed GOV:design-system seam | yes | Shared list/detail/forms, branch archive/move flow, logo upload, search result groups, and export job status require governed UI. | Design-system behavior lock and adoption stories required before app UI. | `GOV:design-system` |
| shared platform/runtime seam | yes | Public asset delivery, private export bundles, background jobs, cleanup, and central authorization are shared platform concerns. | Platform seam stories required. | `DEV:platform-seam` |
| reusable logic or extraction pressure | yes | Organization is a domain family and future extractable service candidate. | Decide feature-manifest domain metadata and extraction-readiness posture before implementation. | `DECISION:refactor-first` |
| data dictionary impact | yes | New durable domain facts, lifecycle, retention, search, assets, exports, and PII-adjacent memberships need source-independent docs. | Data dictionary story required. | `DOC:data-dictionary` |
| QA/runtime evidence need | yes | Runtime, persistence, authz, asset, job, search, export, and browser behavior all require evidence. | PRD-derived test cases and QA evidence plan required. | `EVIDENCE:qa-evidence` |
| source-independent docs impact | yes | New domain family changes architecture, feature docs, API/data/permission artifacts, manifests, and generated graph. | Artifact sweep story required. | `DOC:docs-artifact` |

## Architecture Decision Analysis

| Decision ID | Concern Area | Architecture Question | Analysis Status | Options Considered | Industry / Best-Practice Baseline | Local Repo Constraints | Trade-Offs | Risk Review | Cost / Delivery Impact | Security / Privacy / Compliance Impact | Operability Impact | Migration / Compatibility Impact | Testability / Evidence Impact | Reversibility | Recommended Option | Rejected Alternatives | Decision Owner / Signoff | Durable Authority Target |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ADA-ORG-001 | Domain ownership | Should Organization be one broad feature or a domain family of feature bundles? | approved | One broad `organization` feature; domain family of feature bundles; flat unrelated features. | Large business domains should keep cohesive ownership while avoiding god-services and hidden cross-feature coupling. | Repo uses feature bundles, explicit manifests, public seams, and generated dependency graph checks. | Domain family adds planning overhead but keeps boundaries clear and extractable later. | One broad feature would accumulate unrelated records and cross-cutting concerns; unrelated features would lose shared domain coherence. | Higher upfront artifact work; safer staged delivery. | Clear ownership improves tenant boundary and object-rule enforcement. | Separate features make support/debugging easier. | Additive new domain; future extraction remains possible. | Feature-local and integration tests can target each bundle. | Feature names can change before implementation; after migrations/routes they become compatibility-sensitive. | Use a domain family with multiple feature bundles and a shared Organization domain steering record. | Reject god-feature and ad hoc unrelated feature set. | Technical Steering owner. | PRD, capability matrix, implementation blueprint, feature manifests. |
| ADA-ORG-002 | Feature naming and manifest metadata | Should implementation adopt domain metadata in feature manifests now? | approved | Keep schema v1 manifests with docs-only domain grouping; adopt schema v2 domain/runtime metadata; defer all metadata. | Domain families benefit from explicit metadata when tooling and dependency graph can read it. | Existing manifest schema and generated graph may not yet support domain/runtime-boundary metadata. | Metadata improves governance and reduces future refactor cost, but requires tooling/schema updates before Organization implementation can rely on it. | Adding unsupported manifest fields silently would break generated artifacts or create drift. | Requires a separate repo-governance/tooling unblock before Organization implementation. | No direct data risk, but graph drift can hide coupling. | Better dependency graph, domain visibility, and future extraction readiness. | Manifest schema change is repo-wide compatibility-sensitive. | Requires generated graph tests, manifest validation tests, and docs. | Reversible before broad adoption; harder once many features rely on it. | Start domain/runtime manifest metadata early through an explicit repo-governance/tooling story before Organization implementation; do not add unsupported fields ad hoc. | Docs-only v1 rejected because requester prefers early domain work to reduce later refactor cost; silent unsupported fields rejected. | Requester/product owner plus architecture/repo governance owner. | ADR or repo-governance story for manifest schema/tooling update. |
| ADA-ORG-003 | Root/tenant route family | Should v1 expose root and tenant admin APIs immediately? | approved | Root-only routes first; tenant-only routes first; both root and tenant admin route families from v1. | Product intent says both actor groups manage records from v1, with different authority. | Repo requires root and tenant capabilities remain distinct and tenant requests use exactly one current tenant context. | Both route families increase API/permission work but avoid rework from root-only assumptions. | Root-only first would conflict with tenant-admin v1 product scope; shared unscoped routes would weaken security. | More route/API/permission artifacts in v1. | Stronger tenant isolation and clearer object rules. | Support can reason about root versus tenant denials. | Additive new routes; compatibility plan required for future route changes. | Tests must cover root allow, tenant allow, tenant cross-deny, root catalogue-only behavior. | Route paths become compatibility-sensitive after adoption. | Implement distinct root and tenant admin route families with shared domain services where safe. | Reject shared authority-less routes and root-only implementation. | Backend/API/security owner. | API contracts, permission mapping, PRD. |
| ADA-ORG-004 | Public organization logos | How should public logo upload and delivery be governed? | approved | Private-only logos; public automatic logos; public logos with separate publish step. | Public user-managed assets need narrow scope, verification, replacement, cleanup, and delivery rules. | Repo asset gate denies public delivery by default unless explicitly approved and documented. | Automatic public delivery matches product intent but raises safety and CDN/cache concerns. | Unsafe uploads, stale replacement, or raw bucket URLs would create security and reputational risk. | Requires asset decision, API contract, tests, and likely processing pipeline work before logo implementation. | Must verify file type, checksum/bytes, scanning/sanitization posture, public URL policy, alt/decorative metadata, and tenant/object authority. | Needs replacement and cleanup retry/failure handling. | Additive if scoped to Organization logo assets only. | Asset tests must prove upload intent binding, verification, replacement, public read, and denial. | Public posture is hard to unwind after URLs are distributed. | Approve narrow automatic public delivery for organization logo assets only, after accepted safe upload, with old logo retained until replacement is usable. | Reject generic asset library/public hosting; reject tenant-admin catalogue asset authority. | Asset/security/privacy owner; product decision confirmed by requester. | Asset consumer decision record. |
| ADA-ORG-005 | Private export bundles | How should Organization exports be generated and delivered? | approved | Synchronous direct download; background private bundle; public link; export metadata only. | Large, sensitive, multi-entity exports should be asynchronous, private, audited, expire, and clean up reliably. | Repo lifecycle/cleanup defaults require ownership, retry/failure recording, quota/cost posture, and runbook notes. | Background jobs add infrastructure work but provide predictable status and cleanup. | Public links or synchronous large exports risk leakage, timeouts, and poor recovery. | Requires job/cleanup decision, export records, storage, tests, and runbook. | Exports include retained data and actual logo images, so tenant-boundary and sensitive-field rules are critical. | Job retries, failure states, expiry, deletion, and cleanup failures must be observable. | Additive new export routes/jobs; future import remains separate. | Tests must cover selected sections, all retained data, private download, expiry/delete, cleanup failure, tenant deny. | Expiry/retention can be revised later with migration/compatibility plan. | Use background private export bundles, selectable sections, all retained data, actual images, 24-hour expiry or admin deletion. | Reject public export links and synchronous-only exports. | Job/assets/security owner; product decision confirmed by requester. | Job/cleanup decision, asset/file delivery decision, API contract, PRD. |
| ADA-ORG-006 | Search/read model | How should broad separated-by-type search be approached? | approved | Per-table indexed search only; unified search endpoint returning grouped result types; materialized search projection. | Broad domain search should avoid browser-only filtering, arbitrary advanced query languages, and unbounded text scans; indexes/read models should match supported operators. | Repo searchable storage rules require storage model, supported operators, and index strategy before searchable fields are introduced. | Broad text search plus explicit exact filters gives useful v1 coverage without making every field an advanced searchable operator. | Overpromising all-field arbitrary search can create performance, correctness, and permission-filtering issues. | PRD/API/data dictionary must name supported fields/operators and indexes before implementation. | Search can expose sensitive records if permission filters are not applied before results. | Query behavior and pagination need support diagnostics. | Additive; future materialized projection or richer operators can be introduced behind a versioned contract. | Requires performance/index proof and permission-filter tests. | Search implementation can evolve behind a stable grouped response contract if versioned carefully. | Support broad text search within each selected/result section plus explicit exact filters for important fields; return separated-by-type results. | Reject browser-only search, arbitrary advanced query language, and vague "all fields are filterable" promises for v1. | Persistence/API owner; requester approved recommendation. | PRD, API contract, data dictionary, performance tests. |
| ADA-ORG-007 | Reference catalogue ownership | Should Organization own catalogues or should a platform catalogue feature be created first? | incomplete | Organization-owned reference catalogues; broader platform reference-catalogue feature; static code enums. | Shared system catalogues should have clear governance, compatibility, lifecycle, and use-site semantics. | Capability matrix currently names `organizationReferenceCatalogues`; broader platform catalogue feature is not approved. | Organization-owned catalogues are faster; platform catalogues may prevent future duplication. | Static enums or ad hoc text would create migration and compatibility problems. | May require a foundation story before organization implementation if broader catalogue ownership is chosen. | Root-only mutation and tenant read/use must be enforced. | Catalogue replacement/deprecation needs operational clarity. | Used values cannot disappear; replacement/archival must preserve understandability. | Tests must cover label update, deprecation, replacement, tenant deny. | Can migrate to platform catalogue later with compatibility plan, but early route/data contracts should avoid leaking implementation details. | Use Organization-owned catalogues for v1 unless Technical Steering explicitly spins out a platform catalogue foundation first. | Reject static free-text/enums for durable catalogue references. | Architecture/API owner. | PRD, data dictionary, permission mapping, API contract. |
| ADA-ORG-008 | Frontend governance | Can app UI start directly after backend planning? | approved | Direct app UI; DS-governed components first; explicit one-off exception. | Shared admin management areas, upload controls, export status, grouped search, and branch archive flows should come from governed UI seams. | Repo requires design-system signoff before governed app UI and prohibits app-page CSS for governed pages. | DS-first adds time but prevents drift and local CSS/controller duplication. | Direct UI would violate current repo defaults and make later tenant/root parity harder. | Requires DS behavior locks/reference/verification/adoption before app implementation. | DS governance helps accessibility, keyboard, mobile, and sensitive/denied states. | Browser evidence is reproducible through canonicals. | Additive; app adoption can be staged per management area. | Visual/browser tests needed before app adoption. | DS seams can evolve under adoption contracts. | Block app UI until DS-owned seams exist for list/detail/forms, grouped search, archive/move, upload, and export status. | Reject app-local UI/CSS unless explicit exception is approved. | Frontend/design-system owner. | Design-system artifacts and app adoption contracts. |

## Frontend Architecture Classification

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Root-admin organization management areas | root-admin | organization domain | organization management | primary-nav | root-operator | browser-workflow | app-adoption | durable-page | path | future `/root-admin/organizations` family | none | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | preview-apply-required | module-journey-files | blocked-on-design-system | Browser proof after DS signoff and route adoption. |
| Tenant-admin organization management areas | new-family | organization domain | tenant organization management | primary-nav | tenant-actor | browser-workflow | app-adoption | durable-page | path | future tenant-admin organization family | none | not-applicable | generated-materializer | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | preview-apply-required | module-journey-files | blocked-on-architecture | Tenant-admin shell/topology path needs steering before app UI. |
| Grouped organization-domain search | root-admin | organization domain | search and browse | context-nav | root-operator | browser-workflow | journey | ui-state | none | organization-domain grouped search state | not applicable | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | blocked-on-design-system | Search results separated by type; no browser-only filtering. |
| Logo management | root-admin | organization domain | branding/logo management | context-nav | root-operator | browser-workflow | journey | ui-state | none | organization logo management state | not applicable | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | blocked-on-security | Public asset decision required before UI implementation. |
| Export request/status/download | root-admin | organization domain | organization export | context-nav | root-operator | browser-workflow | journey | ui-state | none | organization export workflow state | not applicable | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | server-backed-snapshot | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | blocked-on-security | Private job-backed export; no authority in URL state. |

## Browser Security Posture

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | yes | Root and tenant admin browser calls require authenticated sessions. | API/security tests for unauthenticated, unauthorized, cross-tenant, and wrong-authority denials. | yes |
| csp-assets | yes | Logo management and public delivery must not inject unsafe user SVG/content into app DOM. | CSP-compatible asset handling and uploaded SVG sanitizer decision before readiness. | yes |
| privileged-helper | yes | Export jobs and cleanup jobs act under server authority and must revalidate tenant/root scope. | Job authority tests and audit proof. | yes |
| csrf-mutation | yes | Create/update/archive/move/upload/export/delete operations are protected browser-triggered mutations. | Route contracts must use existing CSRF/session protections. | yes |
| url-replay-state | yes | Search/filter state may be URL-friendly only for low-risk values; authority and selected tenant must remain server-side. | URL-state review and tests for no tenant/permission authority in URLs. | yes |
| sensitive-rendering | yes | Admin UI may render legal details, memberships, integrations, retained historical data, and export status. | Sensitive-field visibility and permission-filter tests. | yes |
| asset-delivery | yes | Public logos and private export bundles are asset/file delivery surfaces. | Asset decision and export delivery decision required before implementation. | yes |

## Artifact Obligations

| Artifact | Required Action | Owner Layer | Blocks Handoff | Notes |
| --- | --- | --- | --- | --- |
| Product Discovery packet | prove-current | Layer 1 | yes | `docs/workspace/product-discovery/2026-05-12-organization-domain-foundation.md` is the source. |
| Technical Steering packet | create | Layer 2 | yes | This packet records architecture classifications and unblock stories. |
| Capability matrix | update | Layer 3 | yes | Existing first draft must be reconciled to Product Discovery and this packet, especially public logos, exports, and tenant-admin scope. |
| PRD | create | Layer 3 | yes | Required before implementation. |
| PRD-derived test cases | create | Layer 3 | yes | Required before implementation tasks. |
| Asset consumer decision record for public organization logos | create | Layer 3 | yes | Required before logo upload/read/public delivery work. |
| Asset/file delivery decision for private export bundles | create | Layer 3 | yes | May be separate or combined with export job decision, but must cover actual image files in private bundles. |
| Job/cleanup decision for exports | create | Layer 3 | yes | Must define job owner, retry, failure, cleanup, expiry, deletion, quota/cost, audit, and runbook posture. |
| API contract docs | create | Layer 4 | yes | Required for root/tenant routes, catalogues, logo, search, export, and denial contracts. |
| Data dictionary pages and index | create | Layer 4 | yes | Required for every durable entity and export/asset relationship. |
| Permission mapping | create | Layer 4 | yes | Required for root/tenant capabilities, catalogue ownership, export/download, and object rules. |
| Feature docs | create | Layer 4 | yes | Required for each implemented feature family member. |
| Feature manifests | create | Layer 4 | yes | Required for new feature bundles and public seams. Domain metadata requires separate tooling decision if adopted. |
| Feature dependency graph | update | Layer 4 | yes | Required after manifests/public seams change. |
| Design-system behavior locks/reference/verification/adoption | create | Layer 3/4 | yes | Required before app UI implementation. |
| Runtime/browser QA evidence | create | Layer 4 | yes | Required for runtime, persistence, security, audit, asset, job, export, and UI slices. |
| Runbook | create | Layer 4 | yes | Required for export jobs, cleanup failures, asset processing/public delivery, and support operations. |

## Deterministic Signal Checks

| Trigger ID | Trigger Question | Trigger Status | Evidence | Required Classification | Required Layer 4 Task Type | Exception / Decision |
| --- | --- | --- | --- | --- | --- | --- |
| TSIG-PLATFORM-SEAM | Does the change touch shared router, middleware, session/auth platform, job/scheduler, scripts, harness, generated-artifact tooling, or other shared runtime machinery? | yes | Authorization, public assets, private export jobs, cleanup, and generated graph/artifact updates. | DEV:platform-seam | DEV:platform-seam | Shared platform seams must be narrow and capability-specific. |
| TSIG-API-CONTRACT | Does the change add or alter route contract, request/response shape, status codes, validation, pagination, sorting, or API auth behavior? | yes | New root/tenant management, search, logo, export, catalogue routes. | feature-local | DOC:api-contract | API contracts required before route implementation. |
| TSIG-PERSISTENCE | Does the change alter schema, indexes, query semantics, normalization, uniqueness, lifecycle fields, soft delete, migrations, or persistence harness behavior? | yes | New durable entities and search/export/storage behavior. | feature-local | DEV:migration-persistence | Migration and persistence tasks required. |
| TSIG-PERMISSION | Does the change add or alter authz capability keys, grants, deny rules, tenant context, object-level permissions, or protected route access? | yes | Root and tenant admin access, catalogues, assets, exports, object rules. | feature-local | DOC:permission-mapping | Permission mapping required before routes. |
| TSIG-GOVERNED-FRONTEND | Does the change add or alter governed app UI, shell chrome, navigation, drawers, dialogs, reusable controls, page chrome, app-page CSS, or design-system-owned behavior? | yes | Separate admin areas, grouped search, branch archive/move, logo upload, export status. | design-system-seam | GOV:design-system | DS artifacts required before app UI. |
| TSIG-FRONTEND-SURFACE | Does the change add or alter a rendered DEV:frontend surface, browser workflow, DEV:frontend route, or served asset behavior? | yes | Root and tenant admin organization management surfaces. | feature-local | DEV:frontend | Frontend blocked until DS/security artifacts are ready. |
| TSIG-SHARED-CODE | Does the change reuse, move, extract, or generalize logic across features or into `src/lib`? | yes | Domain family and cross-feature public read seams create extraction pressure. | shared-lib-candidate | DECISION:refactor-first | Keep logic feature-owned until real shared consumer demands extraction. |
| TSIG-DATA-DICTIONARY | Does the change alter durable entity facts, fields, lifecycle, retention, searchable storage, indexes, or source-independent persistence truth? | yes | New domain facts, assets, export bundles, lifecycle, retention. | feature-local | DOC:data-dictionary | Data dictionary required. |
| TSIG-QA-RUNTIME | Does the change require runtime/browser/live-data/mock-honesty evidence or change QA release-gate posture? | yes | User-visible runtime, permissions, persistence, public/private file delivery. | feature-local | EVIDENCE:qa-evidence | PRD test cases and runtime evidence required. |
| TSIG-DOCS-ARTIFACT | Does the change alter source-independent docs, maintained artifacts, standards snapshots, reconstruction docs, bootstrap docs, or template/skill contracts? | yes | PRD, API, data, permissions, feature docs, manifests, generated graph, runbooks. | feature-local | DOC:docs-artifact | Artifact sweep required before completion. |

## Steering Decisions

| Decision ID | Decision | Rationale | Compatibility / Migration Strategy | Downstream Owner |
| --- | --- | --- | --- | --- |
| DEC-ORG-001 | Treat Organization as a new domain family, not one broad feature. | Keeps ownership clear and avoids a god-feature. | Additive new domain; feature names become stable after implementation. | PRD / Story Breakdown |
| DEC-ORG-002 | Implement distinct root and tenant admin route families. | Root and tenant share product experience but not authority. | Additive routes; future route moves require compatibility plan. | API contract / permission mapping |
| DEC-ORG-003 | Keep tenant lifecycle owned by tenants; Organization inherits baseline deny/support behavior. | Prevents Organization from mutating tenant lifecycle. | Existing tenant lifecycle remains source of truth. | PRD / API contract |
| DEC-ORG-004 | Use branch archive or move-children behavior for organization and business-unit parents. | Product answer confirmed recovery path. | Existing records preserved; migration not applicable until schema exists. | PRD / domain tests |
| DEC-ORG-005 | Allow public organization logos only through a narrow approved asset decision. | Public asset delivery is in scope but must not become generic hosting. | Asset decision must define MIME, scanning, delivery, replacement, cleanup, and retention. | Asset decision record |
| DEC-ORG-006 | Use private background export bundles for exports. | Export includes all retained data and actual images; synchronous/public delivery is unsafe. | Export records/jobs are additive; retention can change later with compatibility plan. | Job/cleanup decision |
| DEC-ORG-007 | Require explicit search operators/index strategy before promising all-piece search. | Broad search must be scalable and permission-filtered. | API can version supported filters/operators. | PRD / API / data dictionary |
| DEC-ORG-008 | Block app UI until design-system seams exist. | Governed admin UI cannot be built with page-local CSS or copied DS behavior. | App adoption follows DS artifacts. | Design-system owner |
| DEC-ORG-009 | Defer import/bulk upload, special opening-hour calendars, deep integrations, multiple legal profiles, and visible audit UI. | Product Discovery explicitly scoped these later. | Future changes must re-enter discovery/steering. | Future Product Discovery |

## Blockers

| Blocker ID | Blocks | Blocker Type | Required Output | Owner |
| --- | --- | --- | --- | --- |
| BLK-ORG-001 | Source implementation | planning artifact | PRD, reconciled capability matrix, and PRD-derived test cases | Planning owner |
| BLK-ORG-002 | Public logo implementation | asset/security decision | Asset consumer decision record for organization logos | Asset/security owner |
| BLK-ORG-003 | Export implementation | job/file decision | Job/cleanup and private file delivery decision for export bundles | Job/assets/security owner |
| BLK-ORG-004 | Route implementation | contract/security artifact | API contracts and permission mapping | Backend/security owner |
| BLK-ORG-005 | Persistence implementation | data artifact | Data dictionary pages, migration plan, index/search model | Backend/data owner |
| BLK-ORG-006 | App UI implementation | design-system artifact | Signed-off DS seams and adoption contracts | Frontend/design-system owner |
| BLK-ORG-007 | Domain manifest metadata | architecture/tooling decision | Decide whether to update manifest schema/generated graph tooling or keep domain metadata in docs for v1 | Architecture/repo governance owner |

## Layer 2 To Layer 3 Blocker-Resolution Loop

| Item ID | Source Row / Artifact | Classification | Requester-Facing Question Or Action | Owner / Layer | Resolution Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| U-ORG-001 | BLK-ORG-001 | required-planning-artifact | Create PRD, reconcile capability matrix, and derive test cases before source implementation. | Layer 3 | queued-as-layer-3-unblock-story | No requester question remains. |
| U-ORG-002 | BLK-ORG-002 | architecture-security-design-decision | Prepare and review a narrow public-logo asset decision: organization logo assets only, automatic public delivery after accepted upload, stable app-controlled public URLs, no raw bucket URLs, no generic hosting. | Layer 3 / asset owner | answered | Asset decision approved for planning at `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md`; implementation remains blocked until downstream PRD/API/data/permission/runbook/security/QA artifacts carry it. |
| U-ORG-003 | BLK-ORG-003 | architecture-security-design-decision | Prepare and review private export bundle decision: background job, selected sections, all retained data, actual images, ZIP package, 24-hour expiry or delete. | Layer 3 / job owner | answered | Export decision approved for planning at `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md`; implementation remains blocked until downstream PRD/API/data/permission/job/runbook/security/QA artifacts carry it. |
| U-ORG-004 | ADA-ORG-002 | architecture-security-design-decision | Create a repo-governance/tooling unblock story for domain/runtime manifest metadata before Organization implementation; do not add unsupported fields ad hoc. | Layer 3 / repo governance | answered | Requester prefers early domain metadata to reduce future refactor cost. Implementation must update manifest schema/tooling/generated graph/tests first. |
| U-ORG-005 | ADA-ORG-006 | architecture-security-design-decision | Define supported v1 broad text search fields, explicit exact filters, pagination, sorting, and index/read-model strategy before route contracts lock. | Layer 3 / data/API owner | answered | Search posture approved: broad text search per section plus exact filters; no arbitrary advanced query language in v1. PRD/API/data dictionary still must name concrete fields/operators. |
| U-ORG-006 | ADA-ORG-008 | architecture-security-design-decision | Create a later design-system governance plan/story for separate admin areas, grouped search, branch archive/move, logo upload, and export job status before any app UI work. | Layer 3 / design-system | deferred-with-owner | Requester approved handling this in a later plan. App UI remains blocked until that design-system plan/story is completed and signed off. |
| U-ORG-007 | Future import and deeper integration behavior | future-scope-deferral | Keep import, provider secrets/configuration, and special hours out of v1 PRD except as explicit future notes. | Layer 3 | answered | Confirmed by requester. |

## Layer 3 Handoff

| Story Scope Element | Handoff Status | Required Classification IDs | Notes |
| --- | --- | --- | --- |
| Product and requirements lock | ready-for-story-breakdown | TS-ORG-001; TS-ORG-015 | Create PRD and reconcile capability matrix. |
| Organization core backend foundation | ready-for-story-breakdown | TS-ORG-002; TS-ORG-011 | May be planned after PRD/data/API/permission artifacts. |
| Legal/location/unit/membership/integration backend slices | ready-for-story-breakdown | TS-ORG-003; TS-ORG-004; TS-ORG-005; TS-ORG-006 | Split into thin persistence/API slices. |
| Reference catalogue governance | ready-for-story-breakdown | TS-ORG-008 | Include root-only mutation and tenant read/use rules. |
| Public logo assets | ready-for-story-breakdown | TS-ORG-007; TS-ORG-009 | Story must create asset decision before implementation tasks. |
| Private export jobs | ready-for-story-breakdown | TS-ORG-010 | Story must create job/cleanup and private file delivery decision before implementation tasks. |
| Search/read model | ready-for-story-breakdown | TS-ORG-012 | Story must lock supported fields/operators/indexes. |
| Admin UI/design-system | ready-for-story-breakdown | TS-ORG-013 | Story starts with DS governance, not app UI. |
| Public read seams for Discovery/inspector | ready-for-story-breakdown | TS-ORG-014 | Defer exact consumer API until core summaries exist. |
