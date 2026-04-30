# PRD Test Cases: Tenant Branding Configuration

## PRD Scope

- PRD:
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`
- Primary features involved:
  planned `tenantBranding`, existing `assets`, `tenants`, `tenantAuth`,
  root-admin shell, governed design-system seams, authz/capability mapping,
  audit evidence, and feature manifest governance.
- Cross-feature seams:
  `assets` upload/read/link/content seams, `tenants` selected tenant and
  canonical name fallback, tenant auth current tenant context, root authz
  capability evaluation, and design-system-owned render/controller/style seams.
- QA coverage-matrix classification:
  privileged backend, tenant-boundary, asset-sensitive, persistence-backed,
  governed frontend, audit/privacy, cleanup/resilience, compatibility/API
  contract, and accessibility-sensitive.
- Journey inventory required:
  no separate journey inventory before Task Breakdown; Story Breakdown stories
  S-003 through S-008 define the journeys.
- Required human QA artifacts:
  design-system browser canonical signoff, app adoption proof, exploratory QA
  note, curated test-run summary, and standards/AI-assisted review before
  delivery closes.
- Notes:
  V1 is replacement-only for logos, same-origin authenticated delivery only,
  dashboard shell only, and next-login/reload apply timing only.

## Existing Test Impact

- Existing executable tests likely affected:
  route registration, authz/capability seed coverage, assets integration,
  tenant-auth current-context tests, feature dependency graph tests, frontend
  visual/canonical suites, OpenAPI/Postman parity checks, and test traceability
  gates.
- Nature of impact:
  additive for a new feature and route family. Existing asset tests should not
  be weakened; tenant branding should consume public asset seams.
- Discussion needed before changing existing tests:
  expectation-changing edits are needed only if current tests assume asset
  ownership alone grants content access, root sessions imply tenant sessions,
  or governed app pages may use app-local CSS. Those assumptions would conflict
  with this PRD.

## Unit Tests For Individual Capabilities

- Capability:
  root branding save validation
  Test Case ID: `TC-TENANT-BRANDING-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantBranding/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  rejects client-supplied system-managed fields, empty display name, invalid
  primary colour, missing selected tenant, and body tenant spoofing.
  Notes:
  maps AC-S003-02.

- Capability:
  root branding save persistence result
  Test Case ID: `TC-TENANT-BRANDING-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantBranding/`
  Requires Shared Test Helper: repository fake
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  create/update returns durable branding facts, refreshes `updatedAt`, and
  never mutates canonical tenant name.
  Notes:
  maps AC-S003-03.

- Capability:
  dashboard projection fallback matrix
  Test Case ID: `TC-TENANT-BRANDING-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantBranding/`
  Requires Shared Test Helper: projection fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  canonical tenant name fallback, platform colour fallback, null logo fallback,
  fallback indicators, and next-login/reload apply metadata.
  Notes:
  maps AC-S001-02, AC-S005-02.

- Capability:
  logo relationship consumer readiness
  Test Case ID: `TC-TENANT-BRANDING-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantBranding/`
  Requires Shared Test Helper: asset readiness fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  ready asset, tenant match, lifecycle allowed, and alt text or decorative
  posture are all required before consumer-ready state.
  Notes:
  maps AC-S004-02.

- Capability:
  replacement-only logo lifecycle
  Test Case ID: `TC-TENANT-BRANDING-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantBranding/`
  Requires Shared Test Helper: relationship fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  clear/remove request is rejected; replacement creates a new current
  relationship and dereferences prior relationship without overwriting prior
  asset bytes.
  Notes:
  maps AC-S001-03, AC-S004-04.

- Capability:
  audit-safe event payloads
  Test Case ID: `TC-TENANT-BRANDING-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantBranding/`
  Requires Shared Test Helper: audit event fake
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  audit payloads include actor, tenant, operation, outcome, safe reason, and
  timestamps while excluding raw bytes, raw SVG, storage credentials, upload
  targets, tokens, and session ids.
  Notes:
  maps AC-S006-02.

## Integration Tests For Features Working Together

- Flow:
  root read and save tenant branding through v1 router
  Test Case ID: `TC-TENANT-BRANDING-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantBranding/`
  Requires Shared Test Helper: authenticated root user, tenant fixture,
  permission fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database and created branding rows
  Features:
  tenantBranding, tenants, root auth/session, authz, v1 router
  Coverage:
  exact selected-tenant read/save, absence state, persisted values, soft-delete
  exclusion, unauthorized deny, and validation errors.
  Notes:
  maps S-003.

- Flow:
  logo upload intent through tenant branding to assets
  Test Case ID: `TC-TENANT-BRANDING-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantBranding/`
  Requires Shared Test Helper: asset storage fixture and authenticated root
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database and local storage directory
  Features:
  tenantBranding, assets, tenants, authz
  Coverage:
  allowed MIME/size, generated storage key, actor binding, tenant scope,
  expiry, quota denial, and no permanent bucket authority.
  Notes:
  maps AC-S004-01.

- Flow:
  logo replacement validates asset readiness and relationship metadata
  Test Case ID: `TC-TENANT-BRANDING-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantBranding/`
  Requires Shared Test Helper: ready/pending/rejected asset fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database and storage fixtures
  Features:
  tenantBranding, assets, tenants, audit
  Coverage:
  ready matching asset can become current; pending, rejected, deleted,
  tenant-mismatched, sanitizer-blocked, or metadata-incomplete asset cannot.
  Notes:
  maps AC-S004-02, AC-S004-04.

- Flow:
  tenant dashboard branding projection
  Test Case ID: `TC-TENANT-BRANDING-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantBranding/`
  Requires Shared Test Helper: tenant session/current-tenant fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database
  Features:
  tenantBranding, tenantAuth, tenants, assets
  Coverage:
  exactly one current tenant is required; projection returns configured and
  fallback states; wrong tenant context denies.
  Notes:
  maps S-005.

- Flow:
  same-origin logo content route
  Test Case ID: `TC-TENANT-BRANDING-INT-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantBranding/`
  Requires Shared Test Helper: ready logo asset fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database and storage fixtures
  Features:
  tenantBranding, assets, tenantAuth, root auth/session
  Coverage:
  root selected-tenant preview and tenant current-tenant content reads stream
  ready logo bytes with `nosniff`, private cache posture, no raw bucket URL,
  and no public access.
  Notes:
  maps AC-S004-03, AC-S008-03.

## End-To-End Journey Tests

- Flow:
  root admin configures branding and tenant user sees it after reload
  Test Case ID: `TC-TENANT-BRANDING-E2E-001`
  Related Journey ID:
  S-003; S-004; S-005; S-007; S-008
  Recommended Test Layer: `end-to-end-journey`
  Suggested Test Folder: `tests/e2e/tenantBranding/`
  Requires Shared Test Helper: browser auth fixtures, tenant session fixture,
  storage fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database and storage fixtures
  Coverage:
  root-admin save, logo replacement, dashboard reload consumption, fallback
  indicators absent for configured state, and no live-update promise for an
  already-open dashboard.
  Notes:
  requires design-system signoff before app UI implementation.

## NFR Security Tests

- Scenario:
  root and tenant authz allow/deny matrix
  Test Case ID: `TC-TENANT-BRANDING-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenantBranding/`
  Requires Shared Test Helper: root role/capability and tenant session fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database
  Coverage:
  unauthenticated caller, root without capability, tenant actor on root route,
  root session on tenant route, missing current tenant, wrong current tenant,
  and valid actors.
  Notes:
  maps AC-S006-01.

- Scenario:
  asset authority cannot replace tenant branding authorization
  Test Case ID: `TC-TENANT-BRANDING-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenantBranding/`
  Requires Shared Test Helper: cross-tenant asset fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database and storage fixtures
  Coverage:
  possessing or guessing an asset id never grants logo link or content read
  unless tenant branding relationship authorization passes first.
  Notes:
  maps AC-S004-03, AC-S008-03.

- Scenario:
  public and raw storage delivery denial
  Test Case ID: `TC-TENANT-BRANDING-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenantBranding/`
  Requires Shared Test Helper: ready logo fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database and storage fixtures
  Coverage:
  projection and content routes never return raw bucket URL, public CDN URL,
  permanent signed URL, storage key authority, or SVG markup for DOM injection.
  Notes:
  maps AC-S004-03.

## NFR Logging Or Audit Tests

- Scenario:
  privileged branding and logo events are audit visible
  Test Case ID: `TC-TENANT-BRANDING-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/tenantBranding/`
  Requires Shared Test Helper: audit repository fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database
  Coverage:
  branding create/update, read deny, upload intent creation, mismatch, link,
  replacement, quota denial, cleanup failure, and cross-tenant denial create
  audit-safe evidence.
  Notes:
  maps AC-S006-02.

- Scenario:
  forbidden fields are absent from audit and operational summaries
  Test Case ID: `TC-TENANT-BRANDING-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/tenantBranding/`
  Requires Shared Test Helper: audit capture fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database
  Coverage:
  raw bytes, raw SVG markup, storage credentials, upload targets, bearer
  tokens, session ids, SSH proof material, and unchecked filenames are not
  logged.
  Notes:
  maps AC-S006-02.

## NFR Concurrency And Idempotency Tests

- Scenario:
  concurrent branding saves preserve durable last-write truth
  Test Case ID: `TC-TENANT-BRANDING-CONC-001`
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/tenantBranding/`
  Requires Shared Test Helper: concurrent request fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database
  Coverage:
  one active branding row per tenant remains true and `updatedAt` reflects the
  persisted result.
  Notes:
  maps AC-S003-03.

- Scenario:
  concurrent logo replacements keep one current relationship
  Test Case ID: `TC-TENANT-BRANDING-CONC-002`
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/tenantBranding/`
  Requires Shared Test Helper: two ready logo asset fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database and storage fixtures
  Coverage:
  partial unique/current-state enforcement prevents multiple current logos for
  one tenant branding record.
  Notes:
  maps AC-S004-04.

## NFR Performance, Stress, And Soak Tests

- Scenario:
  dashboard projection exact lookup remains bounded
  Test Case ID: `TC-TENANT-BRANDING-PERF-001`
  Recommended Test Layer: `performance`
  Suggested Test Folder: `tests/performance/tenantBranding/`
  Requires Shared Test Helper: seeded tenant branding records
  Requires Manifest Tracking: no unless persisted fixtures are retained
  Cleanup Expectation: reset database
  Coverage:
  projection uses indexed exact tenant lookup and does not scan unrelated
  tenants for normal dashboard load.
  Notes:
  maps AC-S005-02.

## NFR Resilience And Compatibility Tests

- Scenario:
  dependency failure produces truthful unavailable state
  Test Case ID: `TC-TENANT-BRANDING-RES-001`
  Recommended Test Layer: `resilience`
  Suggested Test Folder: `tests/integration/tenantBranding/`
  Requires Shared Test Helper: repository and storage failure fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database and storage fixtures
  Coverage:
  asset provider missing object, cleanup failure, audit writer failure, and
  projection dependency failure return typed errors or safe fallbacks without
  leaking storage details.
  Notes:
  maps AC-S006-03.

- Scenario:
  contract artifacts remain compatible with implemented routes
  Test Case ID: `TC-TENANT-BRANDING-RES-002`
  Recommended Test Layer: `compatibility-contract`
  Suggested Test Folder: `tests/compatibility/tenantBranding/`
  Requires Shared Test Helper: OpenAPI/Postman parity harness when available
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  API contract, OpenAPI, Postman, and route implementation agree on method,
  path, auth, request, response, and error shapes.
  Notes:
  maps AC-S009-01.

## Edge Cases And Negative Tests

- Scenario:
  lifecycle and fallback edge matrix
  Test Case ID: `TC-TENANT-BRANDING-EDGE-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantBranding/`
  Requires Shared Test Helper: lifecycle fixture matrix
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset database and storage fixtures
  Coverage:
  no branding row, soft-deleted branding, deleted tenant, not-ready logo,
  metadata-incomplete logo, rejected asset, sanitizer-blocked SVG, deleted
  asset, missing object, cleanup-pending asset, and cross-tenant-denied logo.
  Notes:
  maps S-003 through S-006.

- Scenario:
  governed frontend state matrix
  Test Case ID: `TC-TENANT-BRANDING-EDGE-002`
  Recommended Test Layer: `rendered-browser`
  Suggested Test Folder: `tests/visual/tenantBranding/`
  Requires Shared Test Helper: design-system canonical and app adoption
  fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: generated screenshots managed by visual harness
  Coverage:
  root-admin and dashboard surfaces across mobile, desktop, magnified, RTL,
  light, dark, validation, fallback, not-ready, rejected, and denied states.
  Notes:
  maps S-007 and S-008.

## Coverage Gaps Or Open Questions

- OpenAPI and Postman route artifacts still need to be added when route
  implementation begins.
- Exact audit storage surface is not selected in this planning pass; tests
  should bind to the implementation-approved audit writer.
- Exact frontend route/topology placement must be materialized through the
  governed topology workflow before app tests lock locators.
- Design-system browser canonicals and signoff are required before app UI
  implementation is treated as ready.

## Required QA Evidence

- QA checklist required:
  yes
- Exploratory QA note required:
  yes
- Curated test-run summary required:
  yes
- Waiver or quarantine record expected:
  no; any skipped asset, SVG, audit, or browser-signoff proof must be explicit.
