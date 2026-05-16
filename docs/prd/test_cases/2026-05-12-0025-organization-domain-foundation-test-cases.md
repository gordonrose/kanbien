# PRD Test Cases: Organization Domain Foundation

## PRD Scope

- PRD:
  `docs/prd/2026-05-12-0025-organization-domain-foundation.md`
- Story Breakdown:
  `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/epic.md`
- Capability matrix:
  `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv`
- Implementation blueprint:
  `docs/workspace/implementation-blueprints/2026-05-15-organization-domain-foundation-planning-blueprint.md`
- API contracts:
  `docs/api-contracts/organization-root-admin.md`;
  `docs/api-contracts/organization-tenant-admin.md`
- Data dictionary:
  `docs/data-dictionary/index.md`
- Public logo signoff:
  `docs/workspace/asset-consumer-decisions/2026-05-15-organization-public-logo-technical-signoff.md`
- Reusable export behavior:
  `docs/workspace/product-discovery/2026-05-15-reusable-email-export-behavior.md`

This document is planning authority for later executable tests. It does not
approve source implementation, route paths, table names, permission keys, or UI
controls.

## Coverage Posture

| Area | Posture | Required before source completion |
| --- | --- | --- |
| Core backend records | planned | Unit, integration, security, audit, persistence, and compatibility tests. |
| Public logos | ready for S-012 task breakdown | Carry completed technical signoff and runbook obligations into source tests before runtime acceptance evidence. |
| Private exports | blocked before implementation | Complete secure generated export technical steering before source tests are made executable. |
| App UI | blocked | Complete shared screen behavior references before browser journey tests become executable. |
| Integration records | deferred | Contract/docs checks must prove they are not active v1 implementation scope. |
| Journey inventory | required later | Create before E2E implementation tasks. |
| Coverage-strength evidence | required later | Run `npm run test:coverage-strength` or scoped equivalent after executable tests land. |

## Existing Test Impact

| Impact area | Expected impact | Discussion needed before changing existing tests |
| --- | --- | --- |
| Authorization and tenant context | Additive Organization root/tenant cases. | yes, if existing tests assume tenant context can come from request bodies or root sessions can act as tenant sessions. |
| Assets | Additive logo relationship and public delivery cases after signoff. | yes, if existing tests allow raw bucket URLs or asset ownership as entity authority. |
| Job processing | Additive export job/cancel/retry/cleanup cases after steering. | yes, if existing job tests assume queue payloads carry mutable authority. |
| Design system | Additive shared screen references before app pages. | yes, if app page tests rely on local page CSS or copied component behavior. |
| Deferred integrations | Docs/contract alignment only. | yes, if any existing test or fixture treats Organization integrations as active v1. |

## Unit Test Cases

| Test Case ID | Story / AC | Capability | Recommended layer | Suggested test folder | Coverage |
| --- | --- | --- | --- | --- | --- |
| `TC-ORG-FOUNDATION-UNIT-001` | S-004 / AC-S004-01 | Organization hierarchy validation | service-unit | `tests/unit/organizationCore/` | Allows valid root/child records; denies depth over 10, cycles, stale parent, invalid lifecycle parent, and cross-tenant parent. |
| `TC-ORG-FOUNDATION-UNIT-002` | S-004 / AC-S004-01 | Organization name uniqueness | service-unit | `tests/unit/organizationCore/` | Enforces normalized active organization-name uniqueness within one tenant while allowing the same normalized name in different tenants. |
| `TC-ORG-FOUNDATION-UNIT-003` | S-004 / AC-S004-01 | Organization branch archive/move choice | service-unit | `tests/unit/organizationCore/` | Requires archive-whole-branch or move-children choice; denies invalid replacement parent, depth overflow, cycle-producing move, and cross-tenant move. |
| `TC-ORG-FOUNDATION-UNIT-004` | S-005 / AC-S005-01 | Legal profile one-active rule | service-unit | `tests/unit/organizationLegalDetails/` | Creates first active profile; denies duplicate active profile; supports optional tax/VAT number and optional registered address; preserves retained profile posture. |
| `TC-ORG-FOUNDATION-UNIT-005` | S-006 / AC-S006-01 | Location validation | service-unit | `tests/unit/organizationLocations/` | Allows many locations and multiple descriptive head-office flags; validates optional latitude/longitude ranges; denies cross-tenant organization attachment. |
| `TC-ORG-FOUNDATION-UNIT-006` | S-007 / AC-S007-01 | Weekly slot validation | service-unit | `tests/unit/locationOpeningHours/` | Accepts ordered same-day weekday slots; denies invalid weekday, malformed local time, close-before-open, overlapping active slots, and overnight v1 slots. |
| `TC-ORG-FOUNDATION-UNIT-007` | S-007 / AC-S007-01 | Opening-hour exception precedence | service-unit | `tests/unit/locationOpeningHours/` | Proves closed day beats all rules, replacement day schedule beats normal slots, closed time slot suppresses normal openings, and special opening applies only when not overridden. |
| `TC-ORG-FOUNDATION-UNIT-008` | S-008 / AC-S008-01 | Business-unit hierarchy validation | service-unit | `tests/unit/businessUnits/` | Allows valid unit parentage; denies depth over 10, cycles, stale parent, invalid lifecycle parent, and cross-tenant or cross-organization parent. |
| `TC-ORG-FOUNDATION-UNIT-009` | S-008 / AC-S008-01 | Business-unit child projection | service-unit | `tests/unit/businessUnits/` | Derives child unit IDs from parent links and does not persist contradictory child lists as authority. |
| `TC-ORG-FOUNDATION-UNIT-010` | S-009 / AC-S009-01 | Membership target validation | service-unit | `tests/unit/businessUnitMemberships/` | Accepts real individual-user targets and real business-unit targets; denies placeholders, missing targets, cross-tenant targets, and unsupported target types. |
| `TC-ORG-FOUNDATION-UNIT-011` | S-009 / AC-S009-01 | Membership participation labels | service-unit | `tests/unit/businessUnitMemberships/` | Allows owner, manager, member, and viewer; denies other labels; proves labels are not platform authorization grants. |
| `TC-ORG-FOUNDATION-UNIT-012` | S-010 / AC-S010-01 | Reference value lifecycle | service-unit | `tests/unit/organizationReferenceCatalogues/` | Allows root-managed create/update/archive/deprecate/replace; denies silent delete of used values; preserves replacement meaning. |
| `TC-ORG-FOUNDATION-UNIT-013` | S-012 / AC-S012-01 | Logo relationship readiness | service-unit | `tests/unit/organizationBrandingReferences/` | After signoff, proves accepted assets can become current logos only when organization, tenant, logo type, and lifecycle rules match. |
| `TC-ORG-FOUNDATION-UNIT-014` | S-013 / AC-S013-01 | Search request validation | service-unit | `tests/unit/organizationSearch/` | Validates broad text search, exact filters, pagination, sorting, unsupported filter denial, and page-size limits. |
| `TC-ORG-FOUNDATION-UNIT-015` | S-015 / AC-S015-01 | Export request validation | service-unit | `tests/unit/organizationExports/` | After export steering, validates selected sections, current-only/include-retained choice, file inclusion options, requester binding, and invalid state denial. |

## Integration Test Cases

| Test Case ID | Story / AC | Capability | Recommended layer | Suggested test folder | Coverage |
| --- | --- | --- | --- | --- | --- |
| `TC-ORG-FOUNDATION-INT-001` | S-004 / AC-S004-01 | Root-admin organization management | feature-integration | `tests/integration/organizationCore/` | Root admin can manage records for an explicit target tenant; request bodies cannot grant tenant authority; wrong target tenant denies. |
| `TC-ORG-FOUNDATION-INT-002` | S-004 / AC-S004-01 | Tenant-admin organization management | feature-integration | `tests/integration/organizationCore/` | Tenant admin can manage records only in exactly one current tenant context; cross-tenant access denies. |
| `TC-ORG-FOUNDATION-INT-003` | S-005 / AC-S005-01 | Legal profile persistence and ownership | feature-integration | `tests/integration/organizationLegalDetails/` | Enforces one-active profile in live persistence and denies attachment to foreign organizations. |
| `TC-ORG-FOUNDATION-INT-004` | S-006 / AC-S006-01 | Location persistence and ownership | feature-integration | `tests/integration/organizationLocations/` | Persists locations, coordinates, descriptive flags, lifecycle state, and same-tenant ownership. |
| `TC-ORG-FOUNDATION-INT-005` | S-007 / AC-S007-01 | Opening hours and exceptions | feature-integration | `tests/integration/locationOpeningHours/` | Persists slots and exceptions; proves non-overlap and exception precedence against live records. |
| `TC-ORG-FOUNDATION-INT-006` | S-008 / AC-S008-01 | Business-unit hierarchy persistence | feature-integration | `tests/integration/businessUnits/` | Persists unit tree, depth, parent moves, branch archive, child reassignment, and same-tenant denial. |
| `TC-ORG-FOUNDATION-INT-007` | S-009 / AC-S009-01 | Membership public seam validation | feature-integration | `tests/integration/businessUnitMemberships/` | Validates real individual-user and business-unit targets through approved seams rather than private persistence imports. |
| `TC-ORG-FOUNDATION-INT-008` | S-010 / AC-S010-01 | Reference value root/tenant behavior | feature-integration | `tests/integration/organizationReferenceCatalogues/` | Root mutation allowed; tenant use allowed; tenant mutation denied; used value archive/deprecate/replace works. |
| `TC-ORG-FOUNDATION-INT-009` | S-012 / AC-S012-01 | Logo relationship and assets | feature-integration | `tests/integration/organizationBrandingReferences/` | After signoff, proves upload intent binding, accepted-safe asset readiness, replacement safety, removal placeholder, and raw URL denial. |
| `TC-ORG-FOUNDATION-INT-010` | S-013 / AC-S013-01 | Grouped Organization search | feature-integration | `tests/integration/organizationSearch/` | Returns grouped permission-filtered results for active v1 entity types; excludes integration records; rejects unsupported filters. |
| `TC-ORG-FOUNDATION-INT-011` | S-015 / AC-S015-01 | Private export lifecycle | feature-integration | `tests/integration/organizationExports/` | After steering, requests export, runs worker, produces JSON plus selected actual files, supports PIN/password ZIP, download, cancel, retry, expiry, delete, and cleanup failure recording. |
| `TC-ORG-FOUNDATION-INT-012` | S-017 / AC-S017-01 | Deferred integration exclusion | contract-integration | `tests/integration/organizationDomain/` | Proves no active v1 routes, search result groups, export sections, or persistence tasks expose Organization integration records. |

## Security Test Cases

| Test Case ID | Story / AC | Capability | Recommended layer | Suggested test folder | Coverage |
| --- | --- | --- | --- | --- | --- |
| `TC-ORG-FOUNDATION-SEC-001` | S-002 / AC-S002-01 | Authority matrix coverage | security-integration | `tests/security/organizationDomain/` | Covers root allow, tenant allow, missing grant, unauthenticated, expired session, cross-tenant, wrong object, public reader, and system-worker authority. |
| `TC-ORG-FOUNDATION-SEC-002` | S-004 through S-010 | Tenant/object boundary | security-integration | `tests/security/organizationDomain/` | Proves child records cannot attach to foreign organizations and tenant actors cannot read or mutate another tenant's records. |
| `TC-ORG-FOUNDATION-SEC-003` | S-010 / AC-S010-01 | Catalogue mutation boundary | security-integration | `tests/security/organizationReferenceCatalogues/` | Tenant admins can read/use approved values but cannot create, edit, archive, deprecate, or replace system-owned values. |
| `TC-ORG-FOUNDATION-SEC-004` | S-012 / AC-S012-01 | Public logo security | security-integration | `tests/security/organizationBrandingReferences/` | After signoff, rejects disallowed MIME or unsafe bytes, denies cross-tenant logo relationship changes, denies raw storage URL access, and allows only accepted public image delivery. |
| `TC-ORG-FOUNDATION-SEC-005` | S-015 / AC-S015-01 | Private export access control | security-integration | `tests/security/organizationExports/` | After steering, requester downloads only own ready export; non-owner, missing grant, deleted, expired, wrong tenant, and public-link access deny. |
| `TC-ORG-FOUNDATION-SEC-006` | S-017 / AC-S017-01 | Integration no-secret deferral | security-contract | `tests/security/organizationDomain/` | Proves deferred integration work cannot accept credentials, endpoints, webhook secrets, payload examples, or provider configuration in v1 because no active contract exists. |

## Audit And Logging Test Cases

| Test Case ID | Story / AC | Capability | Recommended layer | Suggested test folder | Coverage |
| --- | --- | --- | --- | --- | --- |
| `TC-ORG-FOUNDATION-AUD-001` | S-004 through S-010 | Entity mutation audit | audit-integration | `tests/integration/organizationDomain/audit/` | Create, update, archive, restore, move, deprecate, replace, and denied mutations produce safe audit evidence. |
| `TC-ORG-FOUNDATION-AUD-002` | S-012 / AC-S012-01 | Logo audit and cleanup evidence | audit-integration | `tests/integration/organizationBrandingReferences/` | After signoff, upload intent, accepted asset, rejected asset, replacement, removal, cache update failure, and cleanup failure are auditable without unsafe payloads. |
| `TC-ORG-FOUNDATION-AUD-003` | S-015 / AC-S015-01 | Export audit and lifecycle evidence | audit-integration | `tests/integration/organizationExports/` | After steering, request, cancel, retry, ready, download, failed, expired, deleted, notification failure, and cleanup retry are auditable with safe summaries. |

## Edge, Contract, And Compatibility Test Cases

| Test Case ID | Story / AC | Capability | Recommended layer | Suggested test folder | Coverage |
| --- | --- | --- | --- | --- | --- |
| `TC-ORG-FOUNDATION-EDGE-001` | S-004 through S-015 | System-managed field rejection | contract-integration | `tests/integration/organizationDomain/` | Rejects client-supplied ids, tenant ids where server-owned, created/updated/deleted timestamps, lifecycle fields, audit fields, and version fields. |
| `TC-ORG-FOUNDATION-EDGE-002` | S-004 through S-015 | Normalization and empty string behavior | contract-integration | `tests/integration/organizationDomain/` | Trims/normalizes where approved, rejects empty strings instead of silently converting to null, and uses UTC storage with ISO API timestamps. |
| `TC-ORG-FOUNDATION-EDGE-003` | S-017 / AC-S017-01 | Deferred behavior remains unavailable | contract-integration | `tests/integration/organizationDomain/` | Import/bulk upload, integration records, integration export, CSV export, request-time snapshots, generated placeholder export files, public non-logo pages, recurring holiday calendars, seasonal/external opening-hour feeds, and visible audit UI remain unavailable. |
| `TC-ORG-FOUNDATION-EDGE-004` | S-003 / AC-S003-01 | Feature family metadata compatibility | generated-artifact | `tests/unit/featureManifests/` | Proves Organization family metadata uses approved manifest/tooling support and does not add unsupported fields. |
| `TC-ORG-FOUNDATION-EDGE-005` | S-018 / AC-S018-01 | Artifact alignment sweep | docs-alignment | `tests/audit/organizationDomain/` | Proves feature docs, manifests, generated graph, runbooks, API docs, data dictionary, and planning records are refreshed when source slices land. |

## Concurrency And Idempotency Test Cases

| Test Case ID | Story / AC | Capability | Recommended layer | Suggested test folder | Coverage |
| --- | --- | --- | --- | --- | --- |
| `TC-ORG-FOUNDATION-CONC-001` | S-004 / AC-S004-01 | Concurrent organization create/move | concurrency-integration | `tests/integration/organizationCore/` | Concurrent creates cannot violate tenant-level name uniqueness; concurrent moves cannot create cycles or depth overflow. |
| `TC-ORG-FOUNDATION-CONC-002` | S-005 / AC-S005-01 | Concurrent legal profile activation | concurrency-integration | `tests/integration/organizationLegalDetails/` | Concurrent profile creates or replacements cannot leave two active legal profiles. |
| `TC-ORG-FOUNDATION-CONC-003` | S-012 / AC-S012-01 | Concurrent logo replacement | concurrency-integration | `tests/integration/organizationBrandingReferences/` | After signoff, duplicate replacement completion cannot lose the old logo before new readiness or create multiple current logos for one logo type. |
| `TC-ORG-FOUNDATION-CONC-004` | S-015 / AC-S015-01 | Export enqueue and worker retry idempotency | concurrency-integration | `tests/integration/organizationExports/` | After steering, repeated request/worker attempts do not create duplicate downloadable files or duplicate side effects. |

## Performance And Resilience Test Cases

| Test Case ID | Story / AC | Capability | Recommended layer | Suggested test folder | Coverage |
| --- | --- | --- | --- | --- | --- |
| `TC-ORG-FOUNDATION-PERF-001` | S-013 / AC-S013-01 | Search index and paging performance | performance-integration | `tests/performance/organizationSearch/` | Proves grouped search uses approved indexes and stable pagination rather than browser-only filtering or unbounded scans. |
| `TC-ORG-FOUNDATION-PERF-002` | S-015 / AC-S015-01 | Export safety limits | performance-integration | `tests/performance/organizationExports/` | After steering, proves export size, duration, queue, and retry safety limits behave according to the technical decision. |
| `TC-ORG-FOUNDATION-RES-001` | S-012 / AC-S012-01 | Logo cache or delivery update failure | resilience-integration | `tests/integration/organizationBrandingReferences/` | After signoff, stale cache/update failure is recorded and recoverable without exposing raw storage or losing the previous accepted logo. |
| `TC-ORG-FOUNDATION-RES-002` | S-015 / AC-S015-01 | Export storage and cleanup failure | resilience-integration | `tests/integration/organizationExports/` | After steering, worker/storage/cleanup failures leave safe durable state, retry evidence, and no public exposure. |
| `TC-ORG-FOUNDATION-RES-003` | S-018 / AC-S018-01 | Generated artifact drift | docs-alignment | `tests/audit/organizationDomain/` | Feature manifest or public seam changes require generated graph refresh and stale-doc detection. |

## Browser And Journey Test Cases

| Test Case ID | Story / AC | Capability | Recommended layer | Suggested test folder | Coverage |
| --- | --- | --- | --- | --- | --- |
| `TC-ORG-FOUNDATION-UI-001` | S-016 / AC-S016-01 | Shared admin screen references | rendered-browser | `tests/visual/organizationDomain/` | After design-system governance, proves list, detail, relationship, grouped search, branch archive/move, logo, export status, async attention badge, keyboard, mobile, and accessibility behavior. |
| `TC-ORG-FOUNDATION-E2E-001` | S-004 through S-016 | Full admin Organization journey | e2e-browser | `tests/e2e/organizationDomain/organization-admin-foundation.spec.ts` | Deferred until journey inventory, backend implementation, export implementation, logo implementation, shared screen references, and app adoption exist. Must consume live API and export payloads. |
| `TC-ORG-FOUNDATION-E2E-002` | S-012 / AC-S012-01 | Public logo safety journey | e2e-or-integration | `tests/e2e/organizationDomain/public-logo-safety.spec.ts` | May begin as integration proof after signoff; browser proof requires app/public delivery surface. Covers pending, accepted, rejected, replaced, and removed logos. |
| `TC-ORG-FOUNDATION-E2E-003` | S-015 / AC-S015-01 | Private export lifecycle journey | e2e-or-integration | `tests/e2e/organizationDomain/private-export-lifecycle.spec.ts` | Deferred until export implementation. Must inspect real generated ZIP contents, PIN unlock behavior, expiry, deletion, cancellation, retry, and cleanup evidence. |

## Journey Inventory Requirements

| Journey ID | Related TC IDs | Proposed inventory path | Posture | Notes |
| --- | --- | --- | --- | --- |
| `JY-ORG-FOUNDATION-001` | `TC-ORG-FOUNDATION-E2E-001` | `docs/prd/journey_inventories/2026-05-12-0025-organization-domain-foundation-journey-inventory.md` | needs-create | Full admin journey across root/tenant authority, records, search, logo, export, and UI states. |
| `JY-ORG-FOUNDATION-002` | `TC-ORG-FOUNDATION-E2E-002`; `TC-ORG-FOUNDATION-SEC-004`; `TC-ORG-FOUNDATION-AUD-002` | same inventory | needs-create | Public logo safety and replacement journey. |
| `JY-ORG-FOUNDATION-003` | `TC-ORG-FOUNDATION-E2E-003`; `TC-ORG-FOUNDATION-SEC-005`; `TC-ORG-FOUNDATION-AUD-003` | same inventory | needs-create | Private export lifecycle journey. |

## Permission And State Matrix

| Surface | Allowed actor/state | Missing grant | Authentication failure | Cross-tenant failure | Object/state failure | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Core organizations | root admin with target tenant; tenant admin in current tenant | forbidden | unauthorized or invalid session | tenant actor targets another tenant | foreign parent, cycle, depth overflow, archived/deleted conflict | S-004 |
| Legal/location/hours/units/memberships | authorized admin under owning organization | forbidden | unauthorized or invalid session | child attaches to foreign tenant or organization | invalid lifecycle, invalid target, invalid slot, invalid exception | S-005 through S-009 |
| Reference values | root admin mutates; tenant admin reads/uses | forbidden | unauthorized or invalid session | not applicable for root-owned mutation | used value silent delete denied | S-010 |
| Public logos | admin manages relationship; public reader reads accepted current logo | forbidden for admin mutation | unauthenticated admin upload denied | tenant actor manages another tenant logo | pending/rejected/removed asset uses safe denial or initials fallback | S-012 |
| Search | authorized root or tenant admin receives scoped grouped results | forbidden | unauthorized or invalid session | tenant actor sees no other-tenant results | hidden/foreign/deleted records excluded or denied | S-013 |
| Private exports | requester downloads own ready export | forbidden for non-owner or missing grant | unauthorized or invalid session | tenant actor accesses another tenant export | canceled, expired, deleted, failed, or not-ready export denied | S-015 |

## Mock Honesty Requirements

| Test family | Fixture source | Must not fake |
| --- | --- | --- |
| Unit domain tests | data dictionary and API contracts after task breakdown | unsupported fields, fake integration scope, placeholder memberships, or child lists as authority |
| Integration tests | real persistence rows and feature seams | tenant context from request bodies, raw bucket URLs, browser-only search, or export copies without durable request state |
| Logo tests | assets feature contract and public logo signoff | MIME proof from client string alone, unsafe SVG injection, or asset ownership as Organization authority |
| Export tests | secure generated export steering and job contracts | queue payload authority, public links, fake ZIP contents, generated placeholder images, or legal hold extending export copies |
| Browser tests | served app, live API, and generated files | mocked fallback behavior not present in production |

## Traceability And Execution Plan

| TC range | Execution posture | Task type | Required before executable implementation |
| --- | --- | --- | --- |
| `TC-ORG-FOUNDATION-UNIT-*` | planned | TEST:test-only | API contract and data dictionary task source for fields/errors. |
| `TC-ORG-FOUNDATION-INT-*` | planned | TEST:test-only | Persistence migrations, route contracts, permission mapping, and public seams. |
| `TC-ORG-FOUNDATION-SEC-*` | planned | TEST:test-only | Permission mapping and denial contracts. |
| `TC-ORG-FOUNDATION-AUD-*` | planned | TEST:test-only | Audit event contract and safe payload rules. |
| `TC-ORG-FOUNDATION-CONC-*` | planned per slice | TEST:test-only | Persistence or job implementation details. |
| `TC-ORG-FOUNDATION-PERF-*` | deferred until implementation thresholds exist | EVIDENCE:qa-evidence | Search index strategy and export safety limits. |
| `TC-ORG-FOUNDATION-RES-*` | planned per slice | TEST:test-only or TEST:test-suite-alignment | Runbooks and failure-state contracts. |
| `TC-ORG-FOUNDATION-UI-*` | blocked until design-system governance | TEST:test-only plus EVIDENCE:qa-evidence | Shared screen references and browser canonicals. |
| `TC-ORG-FOUNDATION-E2E-*` | deferred until journey inventory and implementation exist | TEST:test-only plus EVIDENCE:qa-evidence | Journey inventory, runtime implementation, and live-data proof. |

## Reviewed Executable Source-Slice IDs

These IDs are already present in executable tests for source slices that landed
before this document was converted into parser-readable lifecycle blocks. They
remain active because they are backed by current source tests.

- `TC-ORG-FOUNDATION-UNIT-012`
  Version: v1
  Lifecycle Status: active
  Reason: existing executable reference-value lifecycle proof remains current.

- `TC-ORG-FOUNDATION-INT-008`
  Version: v1
  Lifecycle Status: active
  Reason: existing executable reference-value persistence proof remains current.

- `TC-ORG-FOUNDATION-SEC-003`
  Version: v1
  Lifecycle Status: active
  Reason: existing executable reference-value authorization proof remains current.

- `TC-ORG-S004-UNIT-001`
  Version: v1
  Lifecycle Status: active
  Reason: organization core unit proof for tenant-level active-name uniqueness.

- `TC-ORG-S004-UNIT-002`
  Version: v1
  Lifecycle Status: active
  Reason: organization core unit proof for cycle and depth validation.

- `TC-ORG-S004-UNIT-003`
  Version: v1
  Lifecycle Status: active
  Reason: organization core unit proof for branch archive and audit evidence.

- `TC-ORG-S004-UNIT-004`
  Version: v1
  Lifecycle Status: active
  Reason: organization core unit proof for child movement during archive.

- `TC-ORG-S004-INT-001`
  Version: v1
  Lifecycle Status: active
  Reason: organization core persistence proof for hierarchy, lifecycle, and audit state.

- `TC-ORG-S004-SEC-001`
  Version: v1
  Lifecycle Status: active
  Reason: organization core route/authentication proof remains current.

- `TC-ORG-S004-SEC-002`
  Version: v1
  Lifecycle Status: active
  Reason: organization core system-managed field and malformed input proof remains current.

- `TC-ORG-S005-INT-001`
  Version: v1
  Lifecycle Status: active
  Reason: legal profile persistence proof remains current.

- `TC-ORG-S005-SEC-001`
  Version: v1
  Lifecycle Status: active
  Reason: legal/location root authentication and capability proof remains current.

- `TC-ORG-S005-SEC-002`
  Version: v1
  Lifecycle Status: active
  Reason: legal/location system-managed field and malformed input proof remains current.

- `TC-ORG-S006-INT-001`
  Version: v1
  Lifecycle Status: active
  Reason: location persistence proof with coordinates and lifecycle state remains current.

- `TC-ORG-S007-INT-001`
  Version: v1
  Lifecycle Status: active
  Reason: opening-hours slot, exception, effective-hours, and audit persistence proof remains current.

- `TC-ORG-S007-SEC-001`
  Version: v1
  Lifecycle Status: active
  Reason: opening-hours authentication and capability proof remains current.

- `TC-ORG-S007-SEC-002`
  Version: v1
  Lifecycle Status: active
  Reason: opening-hours system-managed field proof remains current.

- `TC-ORG-S008-S009-INT-001`
  Version: v1
  Lifecycle Status: active
  Reason: business-unit hierarchy and membership persistence proof remains current.

- `TC-ORG-S012-SEC-001`
  Version: v1
  Lifecycle Status: active
  Reason: public logo delivery proof remains current.

- `TC-ORG-S012-SEC-002`
  Version: v1
  Lifecycle Status: active
  Reason: unsupported public logo type denial proof remains current.

- `TC-ORG-S013-INT-001`
  Version: v1
  Lifecycle Status: active
  Reason: grouped organization search persistence proof remains current.

- `TC-ORG-S013-INT-002`
  Version: v1
  Lifecycle Status: active
  Reason: exact result-type, organization filter, and paging proof remains current.

- `TC-ORG-S013-SEC-001`
  Version: v1
  Lifecycle Status: active
  Reason: organization search authentication and capability proof remains current.

- `TC-ORG-S013-SEC-002`
  Version: v1
  Lifecycle Status: active
  Reason: unsupported organization search filter denial proof remains current.

- `TC-ORG-S015-UNIT-001`
  Version: v1
  Lifecycle Status: active
  Reason: export expiry-at-PIN-view proof remains current.

- `TC-ORG-S015-UNIT-002`
  Version: v1
  Lifecycle Status: active
  Reason: export cleanup failure recording proof remains current.

- `TC-ORG-S015-UNIT-003`
  Version: v1
  Lifecycle Status: active
  Reason: notification failure without invalidating ready export proof remains current.

- `TC-ORG-S015-UNIT-004`
  Version: v1
  Lifecycle Status: active
  Reason: expired export byte cleanup and PIN scrubbing proof remains current.

- `TC-ORG-S015-UNIT-005`
  Version: v1
  Lifecycle Status: active
  Reason: cleanup retry cap and operator-review proof remains current.

- `TC-ORG-S015-UNIT-006`
  Version: v1
  Lifecycle Status: active
  Reason: export cleanup job registration proof remains current.

- `TC-ORG-S015-UNIT-007`
  Version: v1
  Lifecycle Status: active
  Reason: stale running export timeout classification proof remains current.

- `TC-ORG-S015-UNIT-008`
  Version: v1
  Lifecycle Status: active
  Reason: export timeout sweep job registration proof remains current.

- `TC-ORG-S015-UNIT-009`
  Version: v1
  Lifecycle Status: active
  Reason: implemented Organization sections in generated export bundle proof remains current.

- `TC-ORG-S015-INT-001`
  Version: v1
  Lifecycle Status: active
  Reason: requester-bound export lifecycle persistence proof remains current.

- `TC-ORG-S015-INT-002`
  Version: v1
  Lifecycle Status: active
  Reason: private password-protected ZIP generation and download evidence proof remains current.

- `TC-ORG-S015-SEC-001`
  Version: v1
  Lifecycle Status: active
  Reason: private export authentication and capability proof remains current.

## Open Verification Blockers

- Organization permission mapping is still required before security test cases
  can become executable.
- Public logo implementation tests can now be task-planned for v1 primary logo
  scope, but they must carry the completed public-logo signoff and runbook
  proof obligations before becoming executable runtime acceptance evidence.
- Secure generated export technical steering is still required before export
  implementation tests can become executable.
- Shared admin screen behavior references are still required before app UI tests
  can become executable.
- Journey inventory is still required before E2E implementation tasks.
- The first source slice must carry a maintained-artifact sweep and later
  coverage-strength evidence.
