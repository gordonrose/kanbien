# PRD Test Cases: Organization Domain Foundation

## PRD Scope

- PRD:
  `docs/prd/2026-05-12-0025-organization-domain-foundation.md`
- Source authority:
  Product Discovery, Technical Steering, refreshed capability matrix, public
  logo decision, private export decision, and Story Breakdown.
- Capability matrix:
  `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv`
- Implementation blueprint:
  `docs/workspace/implementation-blueprints/2026-05-11-organization-domain-foundation-capability-blueprint.md`
- Story Breakdown:
  `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/epic.md`
- Journey inventory:
  needs-create before end-to-end implementation.
- Primary features involved:
  planned `organizationCore`, `organizationLegalDetails`,
  `organizationLocations`, `locationOpeningHours`, `businessUnits`,
  `businessUnitMemberships`, `organizationIntegrations`,
  `organizationReferenceCatalogues`, `organizationBrandingReferences`,
  `organizationSearch`, and `organizationExports`.
- Cross-feature seams:
  tenant context, root auth/session, tenant auth/session, platform
  authorization, `assets`, user public identity, role public identity, job
  processing, private file delivery/storage, feature manifests, generated
  dependency graph, and design-system-owned render/controller seams.
- QA coverage-matrix classification:
  privileged backend, tenant-boundary, persistence-backed, public-asset,
  private-export, background-job, audit/privacy, cleanup/resilience,
  compatibility/API-contract, performance/search, and governed frontend.
- Harness gates triggered:
  PRD-derived test cases, API contract, data dictionary, permission mapping,
  asset decision carry-forward, job/cleanup/runbook, feature manifests,
  generated dependency graph, design-system proof, and maintained-artifact
  sweep.
- Journey inventory required:
  yes.
- Journey inventory posture:
  needs-create.
- Required human QA artifacts:
  design-system browser canonical signoff before app UI, curated test-run
  summary after implementation slices, exploratory QA notes for admin journeys,
  and security/privacy review notes for public logos and private exports.
- Traceability posture:
  planned `TC-*` IDs must be carried into executable tests or later task
  breakdowns.
- Coverage-strength posture:
  downstream executable implementation should run `npm run
  test:coverage-strength` or a scoped equivalent when these cases are added.
- Evidence gate:
  PRD test cases are planning authority only; implementation remains blocked
  until API, data, permission, runbook, design-system, and task breakdown
  artifacts exist.
- Notes:
  This document does not approve exact route paths, table names, field names,
  permission keys, or UI controls.

## Existing Test Impact

- Existing executable tests likely affected:
  feature manifest/dependency graph tests, platform authorization tests, tenant
  auth current-context tests, root auth/session tests, assets tests, future job
  processing tests, data dictionary/contract checks, and frontend
  design-system visual suites.
- Nature of impact:
  additive for a new domain family. Existing assumptions should not be changed
  unless implementation later proves a direct conflict.
- Discussion needed before changing existing tests:
  yes, if any current test assumes root sessions can act as tenant sessions,
  asset ownership alone grants entity access, public raw bucket URLs are
  acceptable, tenant-admin routes can infer tenant scope from request bodies,
  or governed app screens can use app-local CSS.
- Impact classification:
  additive; expectation-changing only if those conflicting assumptions are
  found.
- Split recommendation:
  TEST:test-only for new executable cases; TEST:test-suite-alignment only if
  existing protected-route, asset, or design-system tests encode conflicting
  assumptions.

## Unit Tests For Individual Capabilities

- Capability:
  organization hierarchy rule validation
  Test Case ID: `TC-ORG-FOUNDATION-UNIT-001`
  Source Authority:
  PRD Organization Hierarchy Requirements; capability matrix S-004 rows.
  Related Story / AC:
  S-004 / AC-S004-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/organizationCore/`
  Requires Shared Test Helper: hierarchy fixtures.
  Requires Manifest Tracking: no.
  Cleanup Expectation: none.
  Mock / Runtime Honesty:
  fixtures must reflect future data dictionary shape once approved.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  hierarchy rule coverage.
  Coverage:
  allows valid root and child organizations; denies depth greater than 10,
  cycles, invalid parent lifecycle, and parent across customer/account.
  Notes:
  Exact field names remain data-dictionary-owned.

- Capability:
  organization parent archive choice validation
  Test Case ID: `TC-ORG-FOUNDATION-UNIT-002`
  Source Authority:
  PRD Organization Hierarchy Requirements; Product Discovery archive decision.
  Related Story / AC:
  S-004 / AC-S004-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/organizationCore/`
  Requires Shared Test Helper: branch fixtures.
  Requires Manifest Tracking: no.
  Cleanup Expectation: none.
  Mock / Runtime Honesty:
  branch fixtures must include active, archived, and cross-account child
  states.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  lifecycle branch coverage.
  Coverage:
  archive-whole-branch and move-children are distinct choices; missing choice,
  invalid replacement parent, depth overflow, and cycle-producing move deny.
  Notes:
  Exact request shape belongs to API contract.

- Capability:
  one active legal profile
  Test Case ID: `TC-ORG-FOUNDATION-UNIT-003`
  Source Authority:
  PRD Legal Profile; capability matrix S-005 rows.
  Related Story / AC:
  S-005 / AC-S005-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/organizationLegalDetails/`
  Requires Shared Test Helper: legal profile fixtures.
  Requires Manifest Tracking: no.
  Cleanup Expectation: none.
  Mock / Runtime Honesty:
  duplicate-active fixtures must later match unique-index posture.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  uniqueness and lifecycle coverage.
  Coverage:
  creates first active profile, archives/replaces prior active profile where
  approved, denies duplicate active profile, and preserves retained prior
  profile access posture.
  Notes:
  Exact retention fields belong to data dictionary.

- Capability:
  weekly opening-hours validation
  Test Case ID: `TC-ORG-FOUNDATION-UNIT-004`
  Source Authority:
  PRD Weekly Opening Hours.
  Related Story / AC:
  S-006 / AC-S006-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/locationOpeningHours/`
  Requires Shared Test Helper: weekly slot fixtures.
  Requires Manifest Tracking: no.
  Cleanup Expectation: none.
  Mock / Runtime Honesty:
  time values must match approved data dictionary types.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  validation coverage.
  Coverage:
  accepts optional absence and valid weekly slots; denies invalid weekday,
  invalid time range, malformed time, and special/holiday/seasonal exception
  values in v1.
  Notes:
  Overlap behavior must be settled by data dictionary/API contract before
  executable tests lock it.

- Capability:
  business-unit hierarchy rule validation
  Test Case ID: `TC-ORG-FOUNDATION-UNIT-005`
  Source Authority:
  PRD Business Unit Hierarchy Requirements.
  Related Story / AC:
  S-007 / AC-S007-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/businessUnits/`
  Requires Shared Test Helper: business-unit tree fixtures.
  Requires Manifest Tracking: no.
  Cleanup Expectation: none.
  Mock / Runtime Honesty:
  fixtures must include owning organization and customer/account.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  hierarchy rule coverage.
  Coverage:
  allows valid business-unit parentage; denies depth greater than 10, cycles,
  parent across organization/customer/account, and invalid lifecycle parent.
  Notes:
  Mirrors organization hierarchy but scoped to owning organization.

- Capability:
  membership real-record validation
  Test Case ID: `TC-ORG-FOUNDATION-UNIT-006`
  Source Authority:
  PRD Business Unit Membership.
  Related Story / AC:
  S-007 / AC-S007-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/businessUnitMemberships/`
  Requires Shared Test Helper: user and role identity fakes.
  Requires Manifest Tracking: no.
  Cleanup Expectation: none.
  Mock / Runtime Honesty:
  fake identity seams must behave like the future public user/role seams, not
  private persistence shortcuts.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  cross-feature seam validation coverage.
  Coverage:
  allows membership to real user or role; denies missing, placeholder,
  archived/invalid, and cross-account user or role references.
  Notes:
  Exact user/role provider seam must be approved before implementation.

- Capability:
  high-level integration record validation
  Test Case ID: `TC-ORG-FOUNDATION-UNIT-007`
  Source Authority:
  PRD Integration Record.
  Related Story / AC:
  S-008 / AC-S008-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/organizationIntegrations/`
  Requires Shared Test Helper: integration record fixtures.
  Requires Manifest Tracking: no.
  Cleanup Expectation: none.
  Mock / Runtime Honesty:
  rejected sensitive fields must match the future request schema.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  sensitive input rejection coverage.
  Coverage:
  accepts approved high-level integration facts; rejects credentials,
  endpoints, webhook secrets, payload examples, and provider configuration.
  Notes:
  Prevents accidental secret storage in v1.

- Capability:
  reference value lifecycle
  Test Case ID: `TC-ORG-FOUNDATION-UNIT-008`
  Source Authority:
  PRD Reference Values.
  Related Story / AC:
  S-009 / AC-S009-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/organizationReferenceCatalogues/`
  Requires Shared Test Helper: in-use value fixtures.
  Requires Manifest Tracking: no.
  Cleanup Expectation: none.
  Mock / Runtime Honesty:
  in-use checks must later match persistence truth, not fixture-only flags.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  lifecycle and compatibility coverage.
  Coverage:
  root can create/rename/archive/deprecate/replace values; in-use value delete
  is denied; label changes apply by reference; replacement updates references
  only when explicit.
  Notes:
  Tenant mutation denial is covered in security tests.

- Capability:
  logo relationship readiness
  Test Case ID: `TC-ORG-FOUNDATION-UNIT-009`
  Source Authority:
  PRD Public Logo Requirements; public logo decision.
  Related Story / AC:
  S-010 / AC-S010-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/organizationBrandingReferences/`
  Requires Shared Test Helper: asset readiness fixtures.
  Requires Manifest Tracking: no.
  Cleanup Expectation: none.
  Mock / Runtime Honesty:
  readiness fixture must match assets feature readiness states.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  asset relationship rule coverage.
  Coverage:
  current logo relationship becomes public only when asset is accepted,
  organization scope matches, logo type is approved, and lifecycle allows use.
  Notes:
  Asset storage internals remain owned by `assets`.

- Capability:
  default and custom logo alt text
  Test Case ID: `TC-ORG-FOUNDATION-UNIT-010`
  Source Authority:
  PRD Public Logo Requirements; public logo decision.
  Related Story / AC:
  S-010 / AC-S010-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/organizationBrandingReferences/`
  Requires Shared Test Helper: organization rename fixtures.
  Requires Manifest Tracking: no.
  Cleanup Expectation: none.
  Mock / Runtime Honesty:
  fixtures must distinguish generated default alt text from custom alt text.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  accessibility metadata coverage.
  Coverage:
  default alt text is `<organizationName> logo`; default updates when the
  organization name changes; custom alt text is preserved.
  Notes:
  Exact rename event propagation belongs to implementation blueprint.

## Integration Tests For Features Working Together

- Flow:
  root-admin manages organization records
  Test Case ID: `TC-ORG-FOUNDATION-INT-001`
  Source Authority:
  PRD Authorization Requirements and Organization Hierarchy Requirements.
  Related Story / AC:
  S-004 / AC-S004-01
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/organizationCore/`
  Requires Shared Test Helper:
  authenticated root admin, target customer/account fixture, authorization
  grant fixture.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset database records created for organizations and hierarchy.
  Mock / Runtime Honesty:
  must use actual router/service/persistence shape after API/data artifacts
  exist.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  root route integration coverage.
  Features:
  organizationCore, root auth/session, platform authz, tenant context, audit.
  Coverage:
  root can create/read/update/archive/restore authorized organization records;
  root target customer/account is explicit; request body cannot grant tenant
  authority.
  Notes:
  Exact routes remain API-contract-owned.

- Flow:
  tenant-admin manages organization records in current customer/account
  Test Case ID: `TC-ORG-FOUNDATION-INT-002`
  Source Authority:
  PRD Authorization Requirements.
  Related Story / AC:
  S-004 / AC-S004-01
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/organizationCore/`
  Requires Shared Test Helper:
  tenant admin session with current customer/account.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset database records created for tenant-scoped Organization data.
  Mock / Runtime Honesty:
  current customer/account must come from session context, not body fixtures.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  tenant route integration coverage.
  Features:
  organizationCore, tenant auth/session, platform authz, tenant context, audit.
  Coverage:
  tenant admin can manage records in current customer/account and is denied for
  any other customer/account.
  Notes:
  Tests must prove cross-account denial, not just successful access.

- Flow:
  legal profiles attach only to owning organization
  Test Case ID: `TC-ORG-FOUNDATION-INT-003`
  Source Authority:
  PRD Legal Profile and Authorization Requirements.
  Related Story / AC:
  S-005 / AC-S005-01
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/organizationLegalDetails/`
  Requires Shared Test Helper:
  organization fixture and legal profile persistence fixture.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset organization and legal profile records.
  Mock / Runtime Honesty:
  must verify real owning organization, not only supplied organization id.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  owner relationship integration coverage.
  Features:
  organizationLegalDetails, organizationCore, platform authz.
  Coverage:
  legal profile can attach to same-account organization; cross-account
  organization attach denies; duplicate-active behavior persists correctly.
  Notes:
  Data dictionary must define retained profile read posture.

- Flow:
  locations and weekly hours attach to owning organization and location
  Test Case ID: `TC-ORG-FOUNDATION-INT-004`
  Source Authority:
  PRD Location and Weekly Opening Hours.
  Related Story / AC:
  S-006 / AC-S006-01
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/organizationLocations/`
  Requires Shared Test Helper:
  organization, location, and weekly slot fixtures.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset location and opening-hour records.
  Mock / Runtime Honesty:
  location ownership must be checked through actual persistence/API contract
  shape.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  owned child-record coverage.
  Features:
  organizationLocations, locationOpeningHours, organizationCore.
  Coverage:
  many locations per organization, multiple descriptive head-office flags,
  optional weekly hours, valid slot persistence, invalid slot denial, and
  cross-account denial.
  Notes:
  No special calendar behavior should appear in fixtures.

- Flow:
  business-unit memberships validate real user and role seams
  Test Case ID: `TC-ORG-FOUNDATION-INT-005`
  Source Authority:
  PRD Business Unit Membership.
  Related Story / AC:
  S-007 / AC-S007-01
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/businessUnitMemberships/`
  Requires Shared Test Helper:
  business unit, user identity, role identity, tenant context fixtures.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset units, memberships, and user/role fixture records.
  Mock / Runtime Honesty:
  use approved public user/role seams; do not mock private persistence access.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  cross-feature identity coverage.
  Features:
  businessUnits, businessUnitMemberships, user identity, role identity,
  platform authz.
  Coverage:
  valid real user/role memberships, missing user/role denial, placeholder
  denial, cross-account denial, and archived unit/user/role denial where
  approved.
  Notes:
  Exact user/role features may need task splitting.

- Flow:
  organization reference values are root-managed and tenant-usable
  Test Case ID: `TC-ORG-FOUNDATION-INT-006`
  Source Authority:
  PRD Reference Values.
  Related Story / AC:
  S-009 / AC-S009-01
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/organizationReferenceCatalogues/`
  Requires Shared Test Helper:
  root admin, tenant admin, reference value, and in-use record fixtures.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset reference values and records using them.
  Mock / Runtime Honesty:
  label changes must be read by reference from persisted value state.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  root/tenant catalogue coverage.
  Features:
  organizationReferenceCatalogues, organizationCore, platform authz.
  Coverage:
  root mutation allowed; tenant mutation denied; tenant use allowed; label
  update visible everywhere; in-use value archive/deprecate/replace behavior.
  Notes:
  If broader platform catalogue owner is approved later, this case needs
  source alignment.

- Flow:
  public logo upload, processing, and relationship readiness
  Test Case ID: `TC-ORG-FOUNDATION-INT-007`
  Source Authority:
  PRD Public Logo Requirements; public logo decision.
  Related Story / AC:
  S-010 / AC-S010-01
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/organizationBrandingReferences/`
  Requires Shared Test Helper:
  asset storage fixture, asset processor fixture, Organization fixture.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset database and local object-storage fixtures.
  Mock / Runtime Honesty:
  uploaded object metadata and readiness must come from asset foundation
  behavior, not convenience flags.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  public asset integration coverage.
  Features:
  organizationBrandingReferences, assets, platform authz, tenant context.
  Coverage:
  allowed raster uploads, rejected SVG, 5 MB limit, actor-bound upload intent,
  malware/metadata processing, accepted readiness, and rejected readiness.
  Notes:
  Real malware scanner may be adapter-faked but must preserve state semantics.

- Flow:
  public logo delivery and replacement
  Test Case ID: `TC-ORG-FOUNDATION-INT-008`
  Source Authority:
  PRD Public Logo Requirements; public logo decision.
  Related Story / AC:
  S-010 / AC-S010-01
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/organizationBrandingReferences/`
  Requires Shared Test Helper:
  accepted old/new logo assets, public URL delivery fixture.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset database and storage fixtures; cleanup replaced bytes if test creates
  them.
  Mock / Runtime Honesty:
  public read must use app-controlled URL behavior, not raw bucket path.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  replacement and public delivery coverage.
  Features:
  organizationBrandingReferences, assets, public delivery/cache seam.
  Coverage:
  current accepted logo is public; pending replacement does not displace old
  logo; accepted replacement updates public delivery; raw bucket URL is never
  exposed; purge failure records retry.
  Notes:
  Cache/CDN implementation may use a local fake but must record purge result.

- Flow:
  private export request, build, download, and cleanup
  Test Case ID: `TC-ORG-FOUNDATION-INT-009`
  Source Authority:
  PRD Private Export Requirements; private export decision.
  Related Story / AC:
  S-012 / AC-S012-01
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/organizationExports/`
  Requires Shared Test Helper:
  organization domain fixture set, accepted logo assets, export worker fixture,
  private storage fixture.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset durable export metadata and generated private files.
  Mock / Runtime Honesty:
  generated ZIP must be inspected, not mocked as a string status.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  export workflow integration coverage.
  Features:
  organizationExports, Organization domain features, assets, job processing,
  private file delivery.
  Coverage:
  selected sections, CSV and JSON files, manifest, all retained selected data,
  actual uploaded logo files, no placeholder image files, private download,
  expiry/delete, and cleanup retry recording.
  Notes:
  This likely needs persistence-backed proof.

- Flow:
  separated-by-type search across Organization records
  Test Case ID: `TC-ORG-FOUNDATION-INT-010`
  Source Authority:
  PRD Search Requirements.
  Related Story / AC:
  S-011 / AC-S011-01
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/organizationSearch/`
  Requires Shared Test Helper:
  multi-record Organization fixture set.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset search fixture records.
  Mock / Runtime Honesty:
  test must use persisted records or approved search projection, not
  browser-only fixture filtering.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  search integration coverage.
  Features:
  organizationSearch and Organization record features.
  Coverage:
  broad text search, exact filters, grouped result types, paging, sorting,
  unsupported filter denial, and permission-filtered results.
  Notes:
  Performance case covers larger result sets.

## End-To-End Journey Tests

- Flow:
  admin creates structure, brands it, searches it, and exports it
  Test Case ID: `TC-ORG-FOUNDATION-E2E-001`
  Source Authority:
  PRD Scope and Admin Screen Requirements.
  Related Story / AC:
  S-004 through S-013 / multiple ACs.
  Related Journey ID:
  `JY-ORG-FOUNDATION-001`
  Journey Inventory:
  needs-journey-inventory
  Journey Tier:
  Tier 1
  E2E Execution Gate:
  broader validation after backend, asset, export, and design-system app
  adoption exist.
  Planned Executable Path:
  `tests/e2e/organizationDomain/organization-admin-foundation.spec.ts`
  Required Permutations:
  root admin and tenant admin; active records and archived records; logo
  uploaded and placeholder; export ready and expired.
  Known-Pitfall Coverage:
  avoid browser-only search assertions; verify real persisted/exported data.
  Recommended Test Layer: `end-to-end-journey`
  Suggested Test Folder: `tests/e2e/organizationDomain/`
  Requires Shared Test Helper:
  seeded customer/account, admin actors, logo fixture, export worker fixture.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset persistence and generated file storage.
  Mock / Runtime Honesty:
  browser must consume live API/projection/export payloads.
  Traceability / Execution Posture:
  deferred until implementation and journey inventory exist.
  Coverage Strength Signal:
  multi-step journey coverage.
  Coverage:
  create organization, add location/unit/membership, upload or remove logo,
  search grouped results, request export, download export, and inspect export
  contents.
  Notes:
  This is not a first backend-slice gate.

## End-To-End Journey Inventory Requirements

- Journey inventory path:
  `docs/prd/journey_inventories/2026-05-12-0025-organization-domain-foundation-journey-inventory.md`
- Inventory action:
  create
- Related `JY-*` IDs:
  `JY-ORG-FOUNDATION-001`; `JY-ORG-FOUNDATION-002`;
  `JY-ORG-FOUNDATION-003`
- Tiering:
  Tier 0 for critical auth/export/logo safety journeys; Tier 1 for full admin
  management journey; Tier 2 for extended record combinations.
- Behavior-changing dimensions:
  actor type, customer/account scope, lifecycle state, hierarchy depth, logo
  state, export state, search result type, and design-system state.
- Equivalence classes:
  root allowed, tenant allowed, tenant cross-account denied, unauthenticated,
  active record, archived record, pending logo, accepted logo, removed logo,
  ready export, expired export.
- Required coverage level:
  pairwise for full browser journey after app UI exists; single-class backend
  journeys acceptable for first backend slices.
- Omitted permutation rationale:
  import, special hours, deep integrations, multiple legal profiles, public
  non-logo pages, and visible audit UI are out of v1.
- Known-pitfall research summary:
  search must use live persisted/projection results; export must inspect real
  generated ZIP contents; public logo tests must not trust raw bucket URLs.
- Planned executable `tests/e2e/` paths:
  `tests/e2e/organizationDomain/`
- Execution gates:
  vertical-slice for backend-only smoke journeys; broader validation for full
  browser journey; production gate after public logo/export surfaces exist.
- Curated run summary expectation:
  required after first browser-backed Organization journey exists.

| Journey ID | Journey Name | Tier | Related TC IDs | Planned Executable Path | Required Permutations | Execution Gate | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JY-ORG-FOUNDATION-001 | Full admin Organization management journey | Tier 1 | TC-ORG-FOUNDATION-E2E-001 | tests/e2e/organizationDomain/organization-admin-foundation.spec.ts | root/tenant, active/archived, logo/placeholder, ready/expired export | broader validation | Requires app UI and export worker. |
| JY-ORG-FOUNDATION-002 | Public logo safety journey | Tier 0 | TC-ORG-FOUNDATION-INT-007; TC-ORG-FOUNDATION-INT-008; TC-ORG-FOUNDATION-SEC-004 | tests/e2e/organizationDomain/public-logo-safety.spec.ts | pending/accepted/rejected/replaced/removed | production gate | May begin as integration proof before UI. |
| JY-ORG-FOUNDATION-003 | Private export lifecycle journey | Tier 0 | TC-ORG-FOUNDATION-INT-009; TC-ORG-FOUNDATION-SEC-005; TC-ORG-FOUNDATION-AUD-003 | tests/e2e/organizationDomain/private-export-lifecycle.spec.ts | queued/running/ready/failed/expired/deleted | production gate | Must inspect real ZIP contents. |

## NFR Security Tests

- Scenario:
  root and tenant authority separation
  Test Case ID: `TC-ORG-FOUNDATION-SEC-001`
  Source Authority:
  PRD Authorization Requirements.
  Related Story / AC:
  S-004 through S-012
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/organizationDomain/`
  Requires Shared Test Helper:
  root admin, tenant admin, missing-grant actor, expired session actor.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset security fixtures.
  Permission / State Matrix:
  - Allowed state: root admin with Organization capability; tenant admin in
    current customer/account.
  - Denied / forbidden state: actor missing capability.
  - Unauthenticated / expired state: unauthenticated or expired session.
  - Cross-tenant denial state: tenant admin requests another customer/account.
  - Object / entity denial state: object belongs to different customer/account.
  - Expected public denial or safe fallback: safe forbidden/not-found posture
    per future API contract.
  Mock / Runtime Honesty:
  tenant context must come from real session fixture.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  authz gate coverage.
  Coverage:
  proves authority worlds do not collapse and request body cannot grant tenant
  scope.
  Notes:
  Exact status codes are API-contract-owned.

- Scenario:
  tenant-admin system catalogue mutation denial
  Test Case ID: `TC-ORG-FOUNDATION-SEC-002`
  Source Authority:
  PRD Reference Values.
  Related Story / AC:
  S-009 / AC-S009-01
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/organizationReferenceCatalogues/`
  Requires Shared Test Helper:
  root and tenant actors plus catalogue fixture.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset catalogue rows.
  Permission / State Matrix:
  - Allowed state: root admin mutates catalogue.
  - Denied / forbidden state: tenant admin attempts create/edit/archive/delete.
  - Unauthenticated / expired state: denied.
  - Cross-tenant denial state: not applicable for system-owned catalogue
    mutation, but tenant use remains scoped.
  - Object / entity denial state: in-use delete denied.
  - Expected public denial or safe fallback: safe forbidden/conflict per API
    contract.
  Mock / Runtime Honesty:
  tests must prove tenant use remains allowed while mutation denies.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  catalogue authority coverage.
  Coverage:
  root-only mutation, tenant use, and used-value protection.
  Notes:
  Broader catalogue ownership change would require alignment.

- Scenario:
  integration secret rejection
  Test Case ID: `TC-ORG-FOUNDATION-SEC-003`
  Source Authority:
  PRD Integration Record.
  Related Story / AC:
  S-008 / AC-S008-01
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/organizationIntegrations/`
  Requires Shared Test Helper:
  integration request fixtures with secret-like fields.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  ensure rejected requests do not persist sensitive values.
  Permission / State Matrix:
  - Allowed state: high-level integration facts.
  - Denied / forbidden state: credentials, endpoints, webhook secrets, payload
    examples, provider configuration.
  - Unauthenticated / expired state: denied.
  - Cross-tenant denial state: tenant admin outside scope denied.
  - Object / entity denial state: missing/foreign organization denied.
  - Expected public denial or safe fallback: invalid request or forbidden per
    API contract.
  Mock / Runtime Honesty:
  persistence checks must prove secret-like values were not stored.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  sensitive input rejection coverage.
  Coverage:
  rejected sensitive fields and durable absence.
  Notes:
  Protects out-of-scope deep integration setup.

- Scenario:
  public logo upload safety and public-read boundary
  Test Case ID: `TC-ORG-FOUNDATION-SEC-004`
  Source Authority:
  PRD Public Logo Requirements; public logo decision.
  Related Story / AC:
  S-010 / AC-S010-01
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/organizationBrandingReferences/`
  Requires Shared Test Helper:
  upload intent, object storage, scanner fake, public read fixture.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  cleanup created storage objects and records.
  Permission / State Matrix:
  - Allowed state: authorized admin uploads approved raster file.
  - Denied / forbidden state: disallowed MIME, SVG, oversize, missing grant.
  - Unauthenticated / expired state: upload denied.
  - Cross-tenant denial state: tenant admin uploads for another
    customer/account denied.
  - Object / entity denial state: asset linked to wrong organization denied.
  - Expected public denial or safe fallback: pending/rejected asset not public;
    placeholder on removed logo.
  Mock / Runtime Honesty:
  client MIME must not be treated as proof of safety.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  public asset security coverage.
  Coverage:
  actor-bound upload intent, storage-key binding, scanning before readiness,
  raw URL denial, and public accepted-only read.
  Notes:
  Direct SVG support remains out of scope.

- Scenario:
  private export access control
  Test Case ID: `TC-ORG-FOUNDATION-SEC-005`
  Source Authority:
  PRD Private Export Requirements; private export decision.
  Related Story / AC:
  S-012 / AC-S012-01
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/organizationExports/`
  Requires Shared Test Helper:
  export request and download fixtures.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  delete generated private export files.
  Permission / State Matrix:
  - Allowed state: requester downloads own ready export before expiry.
  - Denied / forbidden state: non-owner, missing grant, deleted export.
  - Unauthenticated / expired state: denied.
  - Cross-tenant denial state: tenant admin downloads another
    customer/account export denied.
  - Object / entity denial state: expired or deleted export denied.
  - Expected public denial or safe fallback: no public link, no raw bucket URL.
  Mock / Runtime Honesty:
  test must inspect actual download route/response, not only metadata.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  private export security coverage.
  Coverage:
  private download, no public links, no raw storage URLs, expiry, deletion, and
  wrong actor denial.
  Notes:
  Export zip is not password protected in v1.

## NFR Logging Or Audit Tests

- Scenario:
  Organization record mutation audit
  Test Case ID: `TC-ORG-FOUNDATION-AUD-001`
  Source Authority:
  PRD Audit, Privacy, And Compliance Requirements.
  Related Story / AC:
  S-004 through S-009
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/organizationDomain/`
  Requires Shared Test Helper:
  audit sink fixture and organization domain fixtures.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset audit and domain records.
  Mock / Runtime Honesty:
  audit assertions must use durable audit/event shape once approved.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  mutation audit coverage.
  Coverage:
  create, update, archive, restore, move, catalogue mutation, replacement, and
  denied access produce required actor, customer/account, entity, operation,
  outcome, reason, and timestamp evidence.
  Notes:
  Exact audit payload belongs to data dictionary/API contract.

- Scenario:
  public logo audit and cleanup failure evidence
  Test Case ID: `TC-ORG-FOUNDATION-AUD-002`
  Source Authority:
  PRD Public Logo Requirements; public logo decision.
  Related Story / AC:
  S-010 / AC-S010-01
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/organizationBrandingReferences/`
  Requires Shared Test Helper:
  asset processor, cache invalidation fake, audit sink.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset audit records and generated storage fixtures.
  Mock / Runtime Honesty:
  purge failure fake must record retry state like production contract.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  asset audit coverage.
  Coverage:
  upload intent, scan accept/reject, replacement, removal, purge failure,
  cleanup failure, and quota denial create safe audit evidence without raw
  bytes or storage credentials.
  Notes:
  Public read audit may be sampled or policy-specific later.

- Scenario:
  private export audit and lifecycle evidence
  Test Case ID: `TC-ORG-FOUNDATION-AUD-003`
  Source Authority:
  PRD Private Export Requirements; private export decision.
  Related Story / AC:
  S-012 / AC-S012-01
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/organizationExports/`
  Requires Shared Test Helper:
  export worker, cleanup worker, audit sink, private storage fixture.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset export metadata, generated files, and audit records.
  Mock / Runtime Honesty:
  job and cleanup failures must be represented as durable state.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  export audit coverage.
  Coverage:
  request, queued, running, ready, failed, download, delete, expiry, cleanup
  success, cleanup failure, and retry state are auditable.
  Notes:
  Legal/incident hold non-impact on generated copy retention should be
  visible in audit or lifecycle evidence.

## NFR Concurrency And Idempotency Tests

- Scenario:
  concurrent hierarchy moves
  Test Case ID: `TC-ORG-FOUNDATION-CONC-001`
  Source Authority:
  PRD Organization Hierarchy Requirements.
  Related Story / AC:
  S-004 / AC-S004-01
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/organizationCore/`
  Requires Shared Test Helper:
  persistence-backed hierarchy fixtures.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset hierarchy records.
  Mock / Runtime Honesty:
  must use real persistence transaction behavior.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  race-condition proof.
  Coverage:
  two concurrent parent moves cannot create cycles, exceed depth, or leave
  children with inconsistent parents.
  Notes:
  Requires storage/index strategy before executable implementation.

- Scenario:
  duplicate logo replacement completion
  Test Case ID: `TC-ORG-FOUNDATION-CONC-002`
  Source Authority:
  PRD Public Logo Requirements.
  Related Story / AC:
  S-010 / AC-S010-01
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/organizationBrandingReferences/`
  Requires Shared Test Helper:
  upload intent and asset readiness fixtures.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  cleanup storage objects and logo relationships.
  Mock / Runtime Honesty:
  upload intent single-use behavior must be real or contract-faithful.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  duplicate-submission proof.
  Coverage:
  duplicate upload completion/replacement attempts do not publish unsafe bytes,
  create multiple current logos, or lose the old logo before replacement is
  ready.
  Notes:
  Single-use upload intent semantics come from asset foundation.

- Scenario:
  duplicate export request and worker retry
  Test Case ID: `TC-ORG-FOUNDATION-CONC-003`
  Source Authority:
  PRD Private Export Requirements.
  Related Story / AC:
  S-012 / AC-S012-01
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/organizationExports/`
  Requires Shared Test Helper:
  export request and worker fixtures.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset generated files and export metadata.
  Mock / Runtime Honesty:
  worker retry and active-job limits must be stateful.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  idempotency and retry proof.
  Coverage:
  duplicate request respects active job limit; worker retry does not create
  duplicate ready bundles; transient retry count is enforced.
  Notes:
  Job platform contract must be available first.

## NFR Performance, Stress, And Soak Tests

- Scenario:
  grouped search scales with approved indexes
  Test Case ID: `TC-ORG-FOUNDATION-PERF-001`
  Source Authority:
  PRD Search Requirements.
  Related Story / AC:
  S-011 / AC-S011-01
  Recommended Test Layer: `performance`
  Suggested Test Folder: `tests/performance/organizationSearch/`
  Requires Shared Test Helper:
  generated multi-type Organization dataset.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  clean generated performance dataset.
  Mock / Runtime Honesty:
  must use persistence/index strategy from data dictionary; no in-memory
  browser filtering.
  Traceability / Execution Posture:
  deferred until data dictionary and search implementation exist.
  Coverage Strength Signal:
  search performance proof.
  Coverage:
  broad text search, exact filters, grouped results, paging, and sorting over
  representative multi-type data stay within approved latency/scan limits.
  Notes:
  Exact thresholds should be set in task breakdown or NFR artifact.

- Scenario:
  export size and worker duration limits
  Test Case ID: `TC-ORG-FOUNDATION-PERF-002`
  Source Authority:
  PRD Private Export Requirements.
  Related Story / AC:
  S-012 / AC-S012-01
  Recommended Test Layer: `performance`
  Suggested Test Folder: `tests/performance/organizationExports/`
  Requires Shared Test Helper:
  large retained-data export fixture with logo files.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  delete generated ZIP and fixture records.
  Mock / Runtime Honesty:
  must build a real ZIP or contract-faithful local equivalent.
  Traceability / Execution Posture:
  deferred until export implementation exists.
  Coverage Strength Signal:
  export performance proof.
  Coverage:
  100 MB warning metric, 250 MB max ZIP, 10-minute soft timeout, and
  30-minute hard timeout posture.
  Notes:
  Avoid running heavy case in default unit suite.

## NFR Resilience And Compatibility Tests

- Scenario:
  logo cache purge or invalidation failure
  Test Case ID: `TC-ORG-FOUNDATION-RES-001`
  Source Authority:
  PRD Public Logo Requirements; public logo decision.
  Related Story / AC:
  S-010 / AC-S010-01
  Recommended Test Layer: `resilience-integration`
  Suggested Test Folder: `tests/integration/organizationBrandingReferences/`
  Requires Shared Test Helper:
  cache invalidation fake and accepted logo assets.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset logo relationship and purge failure records.
  Mock / Runtime Honesty:
  fake must expose failure and retry state, not silently succeed.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  degraded dependency proof.
  Coverage:
  replacement succeeds only according to approved policy; purge failure is
  recorded and retried; short revalidation fallback remains in effect.
  Notes:
  Exact CDN/cache provider is not approved yet.

- Scenario:
  export storage failure and cleanup retry
  Test Case ID: `TC-ORG-FOUNDATION-RES-002`
  Source Authority:
  PRD Private Export Requirements.
  Related Story / AC:
  S-012 / AC-S012-01
  Recommended Test Layer: `resilience-integration`
  Suggested Test Folder: `tests/integration/organizationExports/`
  Requires Shared Test Helper:
  private storage fake with write/delete failure modes.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  cleanup generated files after failure simulation.
  Mock / Runtime Honesty:
  failure fixture must preserve durable job and cleanup state.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  export resilience proof.
  Coverage:
  storage write failure, checksum failure, worker timeout, cleanup failure,
  retry count, and 7-day cleanup retry window recording.
  Notes:
  Requires job/cleanup runbook artifact.

- Scenario:
  feature manifest and generated graph alignment
  Test Case ID: `TC-ORG-FOUNDATION-RES-003`
  Source Authority:
  PRD Downstream Artifact Requirements; Story S-003 and S-015.
  Related Story / AC:
  S-003 / AC-S003-01; S-015 / AC-S015-01
  Recommended Test Layer: `compatibility-generated-artifact`
  Suggested Test Folder: `tests/unit/featureManifests/`
  Requires Shared Test Helper:
  generated graph test fixtures.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  none beyond generated artifact restoration in test sandbox.
  Mock / Runtime Honesty:
  use actual manifest validation and graph generation code.
  Traceability / Execution Posture:
  TEST:test-only or TEST:test-suite-alignment depending on existing manifest
  tooling changes.
  Coverage Strength Signal:
  generated artifact compatibility proof.
  Coverage:
  Organization family metadata is supported before manifests rely on it, and
  generated dependency graph reflects public seams and cross-feature
  dependencies.
  Notes:
  This should land before Organization feature implementation relies on domain
  metadata.

## Edge Cases And Negative Tests

- Scenario:
  deferred behavior remains unavailable in v1
  Test Case ID: `TC-ORG-FOUNDATION-EDGE-001`
  Source Authority:
  PRD Non-Goals.
  Related Story / AC:
  S-001 and deferred capability rows.
  Recommended Test Layer: `contract-level`
  Suggested Test Folder:
  `tests/contract/organizationDomain/` or docs validation equivalent.
  Requires Shared Test Helper: no.
  Requires Manifest Tracking: no.
  Cleanup Expectation: none.
  Mock / Runtime Honesty:
  contract tests must not include endpoints or fields for deferred behavior.
  Traceability / Execution Posture:
  TEST:test-only candidate after API contracts exist.
  Coverage Strength Signal:
  scope-control proof.
  Coverage:
  import/bulk upload, special hours, deep integration setup, multiple active
  legal profiles, public non-logo pages, and admin-visible change history are
  absent or explicitly rejected.
  Notes:
  Prevents accidental scope creep.

- Scenario:
  client-supplied system-managed fields are rejected
  Test Case ID: `TC-ORG-FOUNDATION-EDGE-002`
  Source Authority:
  PRD Data And Lifecycle Requirements.
  Related Story / AC:
  S-004 through S-012.
  Recommended Test Layer: `contract-integration`
  Suggested Test Folder: `tests/integration/organizationDomain/`
  Requires Shared Test Helper:
  request fixtures for each implemented route family.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  reset created records.
  Mock / Runtime Honesty:
  must test actual request validation after API schemas exist.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  API validation coverage.
  Coverage:
  rejects client-supplied ids, tenant ids, created/updated/deleted timestamps,
  lifecycle fields, and internal audit metadata.
  Notes:
  Applies across all mutable Organization capabilities.

- Scenario:
  empty strings are rejected
  Test Case ID: `TC-ORG-FOUNDATION-EDGE-003`
  Source Authority:
  PRD Data And Lifecycle Requirements.
  Related Story / AC:
  S-004 through S-012.
  Recommended Test Layer: `contract-integration`
  Suggested Test Folder: `tests/integration/organizationDomain/`
  Requires Shared Test Helper:
  request validation fixtures.
  Requires Manifest Tracking: yes.
  Cleanup Expectation:
  no durable record should be created on rejection.
  Mock / Runtime Honesty:
  validation must reflect real API schemas.
  Traceability / Execution Posture:
  TEST:test-only candidate.
  Coverage Strength Signal:
  validation edge coverage.
  Coverage:
  empty strings are rejected rather than converted to null for required and
  explicitly non-empty mutable fields.
  Notes:
  Exact fields depend on API/data artifacts.

## Permission / State Coverage Matrix

| Scope | Allowed State | Denied / Forbidden State | Unauthenticated / Expired State | Cross-Tenant Denial State | Object / Entity Denial State | Public Denial / Safe Fallback | Source Authority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Organization records | root admin with target customer/account; tenant admin in current customer/account | missing capability | unauthenticated or expired session denied | tenant admin targets other customer/account denied | foreign or invalid organization denied | safe denial per API contract | PRD Authorization Requirements |
| Legal/location/unit/integration child records | authorized admin acting on same owning organization | missing capability | unauthenticated or expired session denied | tenant admin targets other customer/account denied | child attaches to foreign organization denied | safe denial per API contract | PRD Core Concepts |
| Memberships | authorized admin links real user/role in scope | placeholder or missing user/role denied | unauthenticated or expired session denied | cross-account user/role denied | archived/invalid target denied where approved | safe denial per API contract | PRD Business Unit Membership |
| Reference values | root admin mutates; tenant admin uses | tenant mutation denied | unauthenticated or expired session denied | not applicable for system mutation | in-use silent delete denied | safe forbidden/conflict | PRD Reference Values |
| Public logos | authorized admin manages; public reader reads accepted current logo | disallowed MIME, unsafe upload, missing grant denied | unauthenticated admin upload denied | tenant admin manages another account denied | wrong organization/asset relationship denied | pending/rejected removed logo uses safe denial or placeholder | PRD Public Logo Requirements |
| Private exports | requester downloads own ready export | non-owner/missing grant/deleted export denied | unauthenticated or expired session denied | tenant admin downloads another account export denied | expired/deleted export denied | no public link or raw storage URL | PRD Private Export Requirements |
| Search | authorized admin receives grouped in-scope results | unsupported filter or missing grant denied | unauthenticated or expired session denied | tenant admin sees no other-account results | hidden/foreign records excluded or denied | not applicable | PRD Search Requirements |

## Mock / Runtime Honesty Plan

| Test Case ID | Fixture Source | Contract / Runtime Source | Mock-Honesty Expectation | Runtime Evidence Needed Later |
| --- | --- | --- | --- | --- |
| TC-ORG-FOUNDATION-UNIT-001 through TC-ORG-FOUNDATION-UNIT-008 | domain fixtures | PRD plus future data dictionary | fixture shapes must be updated after data dictionary; no invented fields should become contract truth | persistence-backed integration after migrations |
| TC-ORG-FOUNDATION-UNIT-009 through TC-ORG-FOUNDATION-UNIT-010 | asset readiness and organization fixtures | public logo decision plus assets contract | readiness, scan, MIME, and URL behavior must match assets feature semantics | runtime public logo route/content proof |
| TC-ORG-FOUNDATION-INT-001 through TC-ORG-FOUNDATION-INT-010 | API/persistence fixtures | future API contracts and data dictionary | integration fixtures must use actual route/service/persistence shape | runtime API and persistence proof |
| TC-ORG-FOUNDATION-E2E-001 | browser/live app data | future app UI and API projections | browser must consume real served assets and API/export payloads | browser screenshot, live API/export inspection |
| TC-ORG-FOUNDATION-SEC-* | actor/session/security fixtures | future permission mapping and API contracts | tenant context must come from session; request body scope spoofing must not work | security test run and denial evidence |
| TC-ORG-FOUNDATION-AUD-* | audit sink fixtures | future audit/data dictionary | audit fakes must preserve durable event semantics and safe payload rules | audit integration proof |
| TC-ORG-FOUNDATION-CONC-* | persistence and job fixtures | future storage/job contracts | concurrency tests must use real transaction/job state where possible | contention/retry proof |
| TC-ORG-FOUNDATION-PERF-* | generated datasets | data dictionary/index/export contracts | no browser-only filtering; export must create real ZIP or equivalent local package | performance run summary |
| TC-ORG-FOUNDATION-RES-* | degraded dependency fakes | asset/job/storage/runbook contracts | fakes must record failure and retry state, not silently succeed | resilience run summary |

## Traceability And Coverage Strength

| Test Case ID | Traceability / Execution Posture | Expected Downstream Task Type | Coverage Strength Signal | Alignment Needed Before Proof |
| --- | --- | --- | --- | --- |
| TC-ORG-FOUNDATION-UNIT-001 through TC-ORG-FOUNDATION-UNIT-010 | planned; carry ID into executable unit tests | TEST:test-only | unit capability coverage | data dictionary/API schema alignment where relevant |
| TC-ORG-FOUNDATION-INT-001 through TC-ORG-FOUNDATION-INT-010 | planned; carry ID into executable integration tests | TEST:test-only | integration and persistence coverage | API contracts, data dictionary, permission mapping |
| TC-ORG-FOUNDATION-E2E-001 | deferred until app UI and journey inventory exist | EVIDENCE:qa-evidence plus TEST:test-only | browser journey coverage | design-system approval and app adoption |
| TC-ORG-FOUNDATION-SEC-001 through TC-ORG-FOUNDATION-SEC-005 | planned; carry ID into security tests | TEST:test-only | security deny/allow coverage | permission mapping and API denial contract |
| TC-ORG-FOUNDATION-AUD-001 through TC-ORG-FOUNDATION-AUD-003 | planned; carry ID into audit tests | TEST:test-only | audit evidence coverage | audit data contract/runbook |
| TC-ORG-FOUNDATION-CONC-001 through TC-ORG-FOUNDATION-CONC-003 | planned; may be later slice-specific | TEST:test-only | race/idempotency proof | persistence/job implementation details |
| TC-ORG-FOUNDATION-PERF-001 through TC-ORG-FOUNDATION-PERF-002 | deferred until implementation and thresholds exist | EVIDENCE:qa-evidence | performance/NFR proof | data/index/export NFR thresholds |
| TC-ORG-FOUNDATION-RES-001 through TC-ORG-FOUNDATION-RES-003 | planned; carry ID into resilience or generated-artifact tests | TEST:test-only or TEST:test-suite-alignment | degraded dependency and compatibility proof | runbook, feature manifest, generated graph support |
| TC-ORG-FOUNDATION-EDGE-001 through TC-ORG-FOUNDATION-EDGE-003 | planned; carry ID into contract/integration tests | TEST:test-only | scope and validation proof | API contract and PRD scope alignment |

## E2E Traceability Plan

| Journey ID | Related TC IDs | Journey Inventory Path | Executable Test Path | Traceability Posture | Deferred / Missing Work |
| --- | --- | --- | --- | --- | --- |
| JY-ORG-FOUNDATION-001 | TC-ORG-FOUNDATION-E2E-001 | docs/prd/journey_inventories/2026-05-12-0025-organization-domain-foundation-journey-inventory.md | tests/e2e/organizationDomain/organization-admin-foundation.spec.ts | deferred | needs journey inventory, design-system approval, app UI, backend implementation |
| JY-ORG-FOUNDATION-002 | TC-ORG-FOUNDATION-INT-007; TC-ORG-FOUNDATION-INT-008; TC-ORG-FOUNDATION-SEC-004 | same inventory | tests/e2e/organizationDomain/public-logo-safety.spec.ts | deferred | can start as integration proof before browser UI |
| JY-ORG-FOUNDATION-003 | TC-ORG-FOUNDATION-INT-009; TC-ORG-FOUNDATION-SEC-005; TC-ORG-FOUNDATION-AUD-003 | same inventory | tests/e2e/organizationDomain/private-export-lifecycle.spec.ts | deferred | needs job/export/private delivery implementation |

## Coverage Gaps Or Open Questions

- Item:
  Exact route paths, request schemas, response schemas, status codes, and
  denial bodies are not approved yet. API contract work must settle them
  before executable route tests lock expectations.
- Item:
  Exact data fields, indexes, uniqueness constraints, lifecycle states, and
  retention policies are not approved yet. Data dictionary work must settle
  them before persistence-backed tests lock expectations.
- Item:
  Exact permission keys and grant seeds are not approved yet. Permission
  mapping must settle them before security tests lock capability names.
- Item:
  Exact frontend routes, controls, and layouts are not approved yet.
  Design-system work and app adoption tasks must settle them before browser
  tests lock screenshots or interactions.
- Item:
  Domain-family metadata support is required before Organization feature
  manifests rely on new domain metadata.

## Required QA Evidence

- QA checklist required:
  yes, after the first implementation slice and after each public logo/export
  slice.
- Exploratory QA note required:
  yes, for admin management screens once app UI exists.
- Curated test-run summary required:
  yes, for backend runtime slices, public logo delivery, private exports, and
  browser/admin journeys.
- Waiver or quarantine record expected:
  only if public logo, private export, tenant-boundary, or browser proof cannot
  run in the target environment.

## Split Boundary Notes

- TEST:test-only candidates:
  all unit, integration, security, audit, concurrency, edge, and most
  resilience cases once implementation source authority exists.
- TEST:test-suite-alignment candidates:
  feature manifest/generated graph support if existing graph tests need schema
  updates; existing assets/authz tests only if they encode conflicting
  assumptions.
- Journey inventory candidates:
  create
  `docs/prd/journey_inventories/2026-05-12-0025-organization-domain-foundation-journey-inventory.md`
  before browser E2E implementation.
- EVIDENCE:qa-evidence candidates:
  E2E browser journey, performance/export size checks, public logo delivery,
  private export zip inspection, and curated runtime summaries.
- Owning implementation / artifact task candidates:
  API contract, data dictionary, permission mapping, runbook, design-system
  governance, feature manifest/domain metadata, and generated dependency graph
  tasks must precede or accompany executable tests.
