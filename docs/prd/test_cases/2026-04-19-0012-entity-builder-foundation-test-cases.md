# Entity Builder Foundation Test Cases

## PRD Scope

- PRD:
  [2026-04-19-0012-entity-builder-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-19-0012-entity-builder-foundation.md)
- Primary features involved:
  `entityBuilder`
- Cross-feature seams:
  - shared root-user authenticated session middleware protects all API routes
  - shared root authorization gates enforce entity-builder capabilities
  - downstream capability-matrix, PRD, blueprint, and future data-dictionary
    maintenance workflows are expected to consume exported or read-only
    `entityBuilder` seams rather than maintaining local entity catalogs
  - approved form-pattern truth comes from the governed design-system artifact
    chain rather than ad hoc control names
- QA coverage-matrix classification:
  privileged root-operated persistence-backed planning workflow with
  compatibility-sensitive durable truth and export seams
- Journey inventory required:
  no separate journey inventory required for this backend foundation slice
- Required human QA artifacts:
  standards-oriented review of privileged route behavior and artifact honesty
- Notes:
  - this file covers PRD-derived verification intent, not executable test
    implementation
  - executable tests now exist for the first implementation slice in:
    - `tests/unit/entityBuilder/service.test.ts`
    - `tests/integration/entityBuilder/flow.test.ts`
    - `tests/integration/entityBuilder/persistence.test.ts`
    - `tests/security/entityBuilder/security.test.ts`
    - `tests/audit/entityBuilder/audit.test.ts`
  - Traceability Enforcement: deferred
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Current Status

- Overall traceability status:
  - deferred at the full inventory level; a focused executable subset now
    exists, but the full planned `ENTITY-BUILDER` case inventory has not yet
    been completely implemented or lifecycle-reclassified
- Overall execution status:
  - runtime-tested for focused unit, integration, security, and audit layers
  - persistence-tested for the current Postgres repository case
- Implemented executable `TC-*` subset:
  - `TC-ENTITY-BUILDER-UNIT-001`
  - `TC-ENTITY-BUILDER-UNIT-002`
  - `TC-ENTITY-BUILDER-UNIT-003`
  - `TC-ENTITY-BUILDER-INT-001`
  - `TC-ENTITY-BUILDER-INT-002`
  - `TC-ENTITY-BUILDER-INT-003`
  - `TC-ENTITY-BUILDER-INT-004`
  - `TC-ENTITY-BUILDER-SEC-001`
  - `TC-ENTITY-BUILDER-SEC-002`
  - `TC-ENTITY-BUILDER-SEC-003`
  - `TC-ENTITY-BUILDER-AUD-001`
  - `TC-ENTITY-BUILDER-AUD-002`
  - `TC-ENTITY-BUILDER-EDGE-001`
- Remaining planned cases:
  - still planned and active in this document, but not yet fully realized in
    executable coverage

## Existing Test Impact

- Existing executable tests likely affected:
  `tests/unit/entityBuilder/service.test.ts`,
  `tests/integration/entityBuilder/flow.test.ts`,
  `tests/integration/entityBuilder/persistence.test.ts`,
  `tests/security/entityBuilder/security.test.ts`,
  `tests/audit/entityBuilder/audit.test.ts`
- Nature of impact:
  additive
- Discussion needed before changing existing tests:
  no; this feature is new and the current change is additive to the new
  entityBuilder test family

## Unit Tests For Individual Capabilities

- Capability:
  create entity-definition lineage or replacement version
  Test Case ID: `TC-ENTITY-BUILDER-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when persistence-backed test helpers create
  durable rows
  Cleanup Expectation: created lineages versions attributes rules options and
  source-link rows should be attributable to one test run when persisted
  Coverage:
  - creates a new lineage with stable `entityKey`
  - creates version `1` under a new lineage
  - creates a replacement version under an existing lineage
  - preserves stable `entityKey` and `attributeKey` semantics
  - rejects client-supplied system-managed fields
  - rejects duplicate `entityKey`
  - rejects duplicate `versionNumber` within a lineage
  - rejects duplicate `attributeKey` within one version

- Capability:
  draft-only update of entity-definition version
  Test Case ID: `TC-ENTITY-BUILDER-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when persistence-backed fixtures are created
  Cleanup Expectation: updated rows should remain cleanup-addressable
  Coverage:
  - updates draft version metadata and child rows successfully
  - refreshes `updatedAt` on success
  - rejects mutation of active version
  - rejects mutation of superseded or archived version
  - rejects `entityKey` mutation
  - rejects `attributeKey` mutation
  - preserves stable lineage identity while updating draft content

- Capability:
  current-state read by `entityKey`
  Test Case ID: `TC-ENTITY-BUILDER-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when persistence-backed fixtures are created
  Cleanup Expectation: read fixtures should be helper-created and
  cleanup-addressable
  Coverage:
  - returns the active version for one stable `entityKey`
  - returns ordered attributes, rules, options, and source links
  - excludes archived-only or inactive visibility paths from the normal
    current-read seam
  - rejects missing `entityKey`

- Capability:
  exact historical read by version id
  Test Case ID: `TC-ENTITY-BUILDER-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when persistence-backed fixtures are created
  Cleanup Expectation: historical fixtures should be helper-created and
  cleanup-addressable
  Coverage:
  - returns draft version by exact id
  - returns active version by exact id
  - returns superseded version by exact id
  - returns archived version by exact id
  - preserves historical child rows exactly as stored

- Capability:
  attribute-shape validation
  Test Case ID: `TC-ENTITY-BUILDER-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - enforces bounded `attributeKind` catalog
  - enforces bounded `attributeType` catalog
  - enforces bounded `valueCardinality` catalog
  - rejects empty string label or description
  - requires `label` and `description`
  - requires `defaultFormPatternKey` only when `formFacing = true`
  - allows optional `helpText`
  - allows optional `placeholderText` only when form-facing

- Capability:
  computed-attribute validation
  Test Case ID: `TC-ENTITY-BUILDER-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - requires `derivationNote` when `attributeKind = computed`
  - requires ordered `sourceAttributeKeys` when `attributeKind = computed`
  - allows `single` and `multiple` cardinality for computed attributes
  - rejects computed dependency on a missing source attribute
  - rejects cross-entity or cross-version source dependency in v1

- Capability:
  validation-rule argument typing
  Test Case ID: `TC-ENTITY-BUILDER-UNIT-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - accepts `required` with `ruleArgumentType = none`
  - accepts `min_length` and `max_length` with integer arguments
  - accepts `pattern` with string argument
  - accepts `enum_membership` with explicit bounded-option posture
  - accepts `type_format` where the rule is compatible with `attributeType`
  - rejects inconsistent typed argument columns
  - rejects unsupported validation-rule keys

- Capability:
  bounded option posture
  Test Case ID: `TC-ENTITY-BUILDER-UNIT-008`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when option fixtures are persisted
  Cleanup Expectation: inline-option and referenced-catalog fixtures should be
  cleanup-addressable
  Coverage:
  - accepts inline options for enum or select-like attributes
  - accepts catalog reference key posture for bounded options
  - rejects simultaneous incompatible option postures
  - rejects missing option truth for enum attributes that need bounded choices
  - preserves deterministic option ordering
  Notes:
  reusable option-catalog management itself is deferred, so v1 only validates
  reference posture and existence

- Capability:
  form-pattern compatibility validation
  Test Case ID: `TC-ENTITY-BUILDER-UNIT-009`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - accepts `simple-select.single` for single-value enum attributes
  - accepts `drawer-select.multi-select` for multi-value enum attributes
  - rejects incompatible pattern for `valueCardinality`
  - rejects incompatible pattern for `attributeType`
  - rejects incompatible pattern for `attributeKind` when relevant
  - rejects exploratory or unapproved pattern keys

- Capability:
  activation-readiness validation
  Test Case ID: `TC-ENTITY-BUILDER-UNIT-010`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when draft fixtures are persisted
  Cleanup Expectation: draft fixtures should be cleanup-addressable
  Coverage:
  - rejects activation when version has zero attributes
  - rejects activation when required attribute truth is missing
  - rejects activation when form-facing pattern is missing
  - rejects activation when computed dependency truth is missing
  - rejects activation when option posture is incomplete
  - returns active and therefore exportable when all requirements pass

- Capability:
  export-shape derivation
  Test Case ID: `TC-ENTITY-BUILDER-UNIT-011`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when persistence-backed fixtures are created
  Cleanup Expectation: export fixtures should be helper-created and
  cleanup-addressable
  Coverage:
  - produces one canonical export shape
  - includes explicit export-format version
  - includes `helpText` and `placeholderText` when present
  - includes resolved effective defaults without persisting them back
  - preserves stable entity and attribute keys
  - preserves deterministic ordering across attributes, rules, options, and
    source links

## Integration Tests For Features Working Together

- Flow:
  root-authenticated operator creates and reads entity-definition truth through
  protected routes
  Test Case ID: `TC-ENTITY-BUILDER-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: created lineages versions and child rows should be tied
  to one `testRunId`
  Features:
  root session auth + root authorization + `entityBuilder`
  Coverage:
  - authenticated root operator with capability can create lineage or version
  - authenticated root operator with capability can read current and exact
    version views
  - missing or insufficient capability is rejected consistently

- Flow:
  draft update preserves lineage identity and exact historical separation
  Test Case ID: `TC-ENTITY-BUILDER-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: draft and active fixtures should be tied to one
  `testRunId`
  Features:
  `entityBuilder` persistence + service + transport
  Coverage:
  - draft update succeeds and refreshes timestamps
  - active version update is rejected
  - current read still resolves the original active version after a rejected
    in-place mutation attempt
  - exact historical read remains truthful after replacement-version create

- Flow:
  validation, activation, and export remain aligned
  Test Case ID: `TC-ENTITY-BUILDER-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: validation and export fixtures should be tied to one
  `testRunId`
  Features:
  `entityBuilder` validation + export seams
  Coverage:
  - draft version validates with blocking issues when incomplete
  - complete version validates cleanly
  - activated version becomes exportable automatically
  - export returns derived truth that matches the validated stored version

- Flow:
  form-pattern and catalog reads stay aligned with create and validate behavior
  Test Case ID: `TC-ENTITY-BUILDER-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when persisted fixtures are created
  Cleanup Expectation: entity fixtures should be tied to one `testRunId`
  Features:
  `entityBuilder` + approved attribute-type catalog + approved form-pattern
  catalog
  Coverage:
  - returned catalogs reflect the bounded type and pattern choices accepted by
    create and validate
  - rejected pattern or type choices align with catalog truth
  - resolved defaults used in export align with catalog truth

- Flow:
  historical export remains available after supersession or archival
  Test Case ID: `TC-ENTITY-BUILDER-INT-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: version-history fixtures should be tied to one
  `testRunId`
  Features:
  `entityBuilder` current read + exact read + export seams
  Coverage:
  - default export scope returns active version only
  - explicit historical export returns a selected superseded or archived
    version
  - current read resolves the active version while exact read still returns the
    historical version accurately

## NFR Security Tests

- Scenario:
  unauthorized or under-authorized actors are denied entity-definition access
  Test Case ID: `TC-ENTITY-BUILDER-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: ordinary test cleanup
  Coverage:
  - unauthenticated access denied for all routes
  - authenticated root user without required capability denied
  - tenant actor access denied
  - denied current-read, exact-read, validate, and export behavior is
    consistent

- Scenario:
  system-managed and unexpected fields are rejected explicitly
  Test Case ID: `TC-ENTITY-BUILDER-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/entityBuilder/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - client-supplied UUIDs rejected
  - client-supplied lifecycle timestamps rejected
  - client-supplied derived export fields rejected
  - unexpected fields rejected under the stable invalid-request contract

## NFR Logging Or Audit Tests

- Scenario:
  privileged mutation and export actions are audit-visible
  Test Case ID: `TC-ENTITY-BUILDER-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when persistent fixtures are created
  Cleanup Expectation: created rows and audit-visible evidence should remain
  attributable to one `testRunId`
  Coverage:
  - successful create is audit-visible
  - successful draft update is audit-visible
  - successful export is audit-visible
  - denied privileged create or export is audit-visible where the platform
    treats it as security-relevant
  Notes:
  feature-owned audit entities are deferred, so the test should align with the
  shared platform audit posture rather than invent a new audit store

## NFR Concurrency And Idempotency Tests

- Scenario:
  concurrent replacement-version creation does not create duplicate active
  version truth
  Test Case ID: `TC-ENTITY-BUILDER-EDGE-001`
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: concurrency fixtures should be tied to one `testRunId`
  Coverage:
  - concurrent version-create attempts preserve unique version numbering
  - no two active versions exist for one lineage
  - rejected conflicting create leaves stored truth consistent

- Scenario:
  repeated export or validate requests remain side-effect free and deterministic
  Test Case ID: `TC-ENTITY-BUILDER-EDGE-002`
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when persisted fixtures are created
  Cleanup Expectation: export fixtures should be cleanup-addressable
  Coverage:
  - repeated validate returns stable blocking or pass results
  - repeated export returns deterministic ordering and content for unchanged
    versions
  Notes:
  export is generated on demand, so side-effect-free behavior is part of the
  claim

## NFR Performance, Stress, And Soak Tests

- Scenario:
  list and exact-read paths remain performant with realistic attribute-rich
  versions
  Test Case ID: `TC-ENTITY-BUILDER-EDGE-003`
  Recommended Test Layer: `performance-integration`
  Suggested Test Folder: `tests/integration/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: large fixture sets should be attributable to one
  `testRunId`
  Coverage:
  - paginated list remains stable with many lineages
  - exact current-read remains stable with one version containing many
    attributes, rules, options, and source links
  - export remains deterministic without pathological ordering regressions
  Notes:
  no hard latency budget is declared in the PRD yet, so this is structure- and
  regression-oriented rather than SLA-oriented

## NFR Compatibility And Historical-Honesty Tests

- Scenario:
  stable keys and version-by-replacement remain compatible over time
  Test Case ID: `TC-ENTITY-BUILDER-EDGE-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: version-history fixtures should be tied to one
  `testRunId`
  Coverage:
  - replacement creates a new version under the same `entityKey`
  - attribute keys remain stable across versions
  - current-read resolves the new active version
  - exact historical read and historical export still return the old version
  - no consumer-facing naming churn is introduced

- Scenario:
  version-aware default resolution preserves historical honesty
  Test Case ID: `TC-ENTITY-BUILDER-EDGE-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/entityBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: historical fixtures should be tied to one `testRunId`
  Coverage:
  - export and validation resolve effective defaults through the applicable
    catalog version
  - later catalog evolution does not silently reinterpret an older exact
    historical version
  Notes:
  if implementation uses a shared platform seam for version-aware catalog
  resolution, this test should anchor that seam explicitly

## Edge Cases And Negative Tests

- Scenario:
  coordinates attribute remains one logical pair
  Test Case ID: `TC-ENTITY-BUILDER-EDGE-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - accepts `coordinates` as one logical attribute type
  - rejects modeling it as two ad hoc decimal fields when the declared type is
    `coordinates`
  Notes:
  exact wire or storage shape may be refined later, but the logical pair
  contract should stay explicit

- Scenario:
  enum default-pattern mapping stays truthful
  Test Case ID: `TC-ENTITY-BUILDER-EDGE-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - single-value enum resolves to `simple-select.single` by default
  - multi-value enum resolves to `drawer-select.multi-select` by default
  - incompatible manual override is rejected during validation

- Scenario:
  multiple cardinality does not silently widen into vague blob truth
  Test Case ID: `TC-ENTITY-BUILDER-EDGE-008`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/entityBuilder/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - `valueCardinality = multiple` is preserved as entity truth
  - create and export do not imply a storage implementation that contradicts
    repo searchable-storage rules
  Notes:
  this guards against drift between planner truth and later persistence design

## Coverage Notes

- Existing executable tests likely to be added first:
  - `tests/unit/entityBuilder/*`
  - `tests/integration/entityBuilder/*`
  - `tests/security/entityBuilder/*`
  - `tests/audit/entityBuilder/*`
- Persistence-backed implementation will likely need:
  - shared factories for lineage, version, attribute, rule, option, and
    computed-source fixtures
  - run-scoped manifest tracking when durable data is created in shared
    databases
  - cleanup conventions aligned with the repo's persistence-test harness
- Expected verification commands once implemented:
  - `npm run test:traceability`
  - `npm test`
  - `npm run test:persistence`
