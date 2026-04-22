# Capability Contract Catalog Foundation Test Cases

## PRD Scope

- PRD:
  [2026-04-22-0020-capability-contract-catalog-foundation.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/prd/2026-04-22-0020-capability-contract-catalog-foundation.md)
- Primary features involved:
  - `capabilityContractCatalog`
- Cross-feature seams:
  - shared root-user authenticated session middleware protects all protected
    API routes in this slice
  - shared root authorization gates enforce catalog read, export,
    materialization, and drift-audit capabilities
  - approved source truth is read from feature contract artifacts, maintained
    permission mappings, maintained API contract docs, and feature manifests
  - downstream frontend tooling is expected to consume catalog APIs or exports
    rather than scraping feature source artifacts directly
- QA coverage-matrix classification:
  privileged root-operated persistence-backed planning workflow with
  compatibility-sensitive contract export, normalization, and drift-governance
  seams
- Journey inventory required:
  no separate journey inventory required for this backend foundation slice
- Required human QA artifacts:
  standards-oriented review of privileged route behavior, source-truth
  authority posture, and artifact honesty for freshness and drift states
- Notes:
  - this file now reflects implemented and traceable backend-foundation coverage
    for the current bounded `capabilityContractCatalog` source registry
  - executable coverage exists at unit, integration, security, audit, and edge
    layers for the current foundation slice
  - Traceability Enforcement:
    `CAP-CATALOG: 24/24 traceable`
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Current Status

- Overall traceability status:
  - complete for the scoped slice; `CAP-CATALOG: 24/24 traceable`
- Overall execution status:
  - focused backend foundation implemented and verified
- Layer summary:
  - `UNIT`: implemented
  - `INT`: implemented
  - `SEC`: implemented
  - `AUD`: implemented
  - `EDGE`: implemented
  - `COMPAT`: not required in the current bounded foundation slice
  - `CONCURRENCY/IDEMPOTENCY`: not a separate blocking layer in the current bounded foundation slice
- Existing executable test impact:
  - current executable coverage is additive and feature-local
  - no existing unrelated feature suites were materially reshaped to realize this first slice

## QA Coverage Classification

- Change class:
  - privileged backend capability
  - persistence schema and durable workflow change
  - compatibility-sensitive consumer contract for future frontend-composition
    tooling
  - source-truth normalization and drift-governance seam
- Required layers from the matrix:
  - unit
  - integration
  - security
  - audit
  - persistence-backed verification
  - compatibility/contract
  - edge
- Additional required checks:
  - migration safety review
  - source-truth authority-order review
  - freshness and drift honesty review
  - export-format compatibility review
- Not required in this slice:
  - frontend
  - accessibility
  - end-to-end journey
  - performance as a blocking dedicated suite
  - resilience/failure-injection as a blocking dedicated suite
  - structured exploratory QA by default, though a short focused QA note is
    still recommended because stale or drifted catalog truth could mislead
    later frontend tooling

## Unit Tests For Individual Capabilities

- Capability: `normalizeCapabilityRecord`
  Test Case ID: `TC-CAP-CATALOG-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/capabilityContractCatalog/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none when normalization is tested without persistence
  Coverage:
  - derives a stable feature-qualified `capabilityId`
  - normalizes route metadata into consistent method and path fields
  - resolves governing authz capability keys from maintained mappings
  - resolves allowed roles as a derived persisted view
  - rejects unsupported source truth that cannot produce an honest capability
    record

- Capability: `normalizeCapabilityFieldMetadata`
  Test Case ID: `TC-CAP-CATALOG-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/capabilityContractCatalog/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - emits stable request field paths for params, query, and body partitions
  - emits stable response field paths
  - preserves field ordering deterministically
  - captures type, requiredness, nullable posture, repeated posture, format,
    enum values, system-managed posture, and binding hints when derivable
  - rejects ambiguous field metadata rather than inventing missing values

- Capability: `extractValidationMetadata`
  Test Case ID: `TC-CAP-CATALOG-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/capabilityContractCatalog/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - exports field-level validation such as requiredness, format, enum values,
    min or max bounds, and normalization posture when derivable honestly
  - exports capability-level constraints such as at-least-one or
    mutually-exclusive rules when present
  - refuses to create a parallel validation model for unsupported source
    constructs

- Capability: `resolveCapabilityDescriptions`
  Test Case ID: `TC-CAP-CATALOG-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/capabilityContractCatalog/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - resolves a picker-friendly short description
  - resolves a fuller inspector-friendly description when source truth exists
  - marks missing or overly technical description posture explicitly when a
    human-friendly description cannot be produced honestly

- Capability: `materializeCapabilityRecords`
  Test Case ID: `TC-CAP-CATALOG-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/capabilityContractCatalog/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes when durable rows are created
  Cleanup Expectation: created records should be attributable to one test run
  Coverage:
  - inserts new capability records from normalized source truth
  - updates existing records on refresh
  - preserves stable capability identity across refreshes
  - updates freshness timestamps on successful materialization
  - refuses to persist contradictory source truth

- Capability: `computeRegistryDriftStatus`
  Test Case ID: `TC-CAP-CATALOG-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/capabilityContractCatalog/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - classifies records as `fresh`, `stale`, `drifted`, or `blocked`
  - emits human-readable drift reasons
  - marks rematerialization required when persisted truth no longer matches
    approved source truth
  - distinguishes source absence from contradictory source truth

- Capability: `buildPickerSummary`
  Test Case ID: `TC-CAP-CATALOG-UNIT-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/capabilityContractCatalog/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - emits selection-friendly summary rows with feature, route-family, and seam
    grouping metadata
  - preserves deterministic ordering
  - supports request-body, response-field, and filter support flags
  - surfaces freshness and lifecycle posture honestly

## Integration Tests For Features Working Together

- Flow: authenticated root operator browses catalog summaries from persisted
  records
  Test Case ID: `TC-CAP-CATALOG-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/capabilityContractCatalog/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: persisted catalog rows and supporting fixtures should be
  tied to one `testRunId`
  Features:
  - `rootAuth`
  - root authorization
  - `capabilityContractCatalog`
  Coverage:
  - authenticated root operator with the governing capability can read picker
    summaries
  - feature, route-family, boundary, and role filters work as documented
  - freshness and drift posture are visible in the list output

- Flow: authenticated root operator reads one exact capability record with
  normalized contract detail
  Test Case ID: `TC-CAP-CATALOG-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/capabilityContractCatalog/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: persisted catalog rows and source fixtures should remain
  cleanup-addressable
  Features:
  - `capabilityContractCatalog`
  - source-truth normalization
  Coverage:
  - exact read returns normalized request and response fields
  - field-level validation and capability-level constraints are present when
    derivable
  - access metadata includes governing authz capability keys and allowed roles
  - user-facing descriptions are included when available

- Flow: materialization refreshes persisted records from approved source truth
  Test Case ID: `TC-CAP-CATALOG-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/capabilityContractCatalog/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: created catalog rows and generated artifacts should be
  tied to one test run when practical
  Features:
  - `capabilityContractCatalog`
  - source-truth inputs
  Coverage:
  - initial materialization seeds durable records
  - later materialization refreshes those records without changing stable
    capability ids
  - the same run also produces the expected generated artifact or equivalent
    reviewable output

- Flow: drift audit detects divergence between persisted and current source
  truth
  Test Case ID: `TC-CAP-CATALOG-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/capabilityContractCatalog/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: drift fixtures should remain attributable to one test
    run
  Features:
  - `capabilityContractCatalog`
  - approved source artifacts
  Coverage:
  - audit classifies stale or drifted records correctly
  - audit explains which source artifacts disagree
  - audit does not mutate persisted records as a side effect

- Flow: export produces deterministic derived snapshots from persisted truth
  Test Case ID: `TC-CAP-CATALOG-INT-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/capabilityContractCatalog/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: export fixtures should be cleanup-addressable if any
    persisted artifacts are created
  Features:
  - `capabilityContractCatalog`
  Coverage:
  - export returns deterministic ordering
  - export includes format-version markers and freshness posture
  - export blocks when drift exceeds the caller's allowed tolerance

## Security Tests

- Capability boundary: root-only catalog reads and mutations
  Test Case ID: `TC-CAP-CATALOG-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/capabilityContractCatalog/`
  Coverage:
  - unauthenticated callers are denied
  - authenticated callers without catalog permissions are denied
  - authenticated callers with read permission but without materialization or
    export permission are denied from those stronger operations

- Capability boundary: source-truth integrity
  Test Case ID: `TC-CAP-CATALOG-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/capabilityContractCatalog/`
  Coverage:
  - normal catalog reads do not accept client-supplied system-managed fields
  - materialization refuses caller attempts to overwrite protected catalog
    identity or freshness fields directly
  - export does not leak secrets raw tokens or proof material from source
    truth

- Capability boundary: deferred omission-context posture
  Test Case ID: `TC-CAP-CATALOG-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/capabilityContractCatalog/`
  Coverage:
  - runtime context requirements may be declared in the catalog
  - v1 does not pretend those declarations authorize tenant or
    entity-relationship access by themselves
  - catalog consumers must still rely on backend enforcement for real access

## Audit Tests

- Capability: denied access remains audit visible
  Test Case ID: `TC-CAP-CATALOG-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/capabilityContractCatalog/`
  Coverage:
  - denied list, exact-read, export, materialization, and drift-audit requests
    remain visible through the current platform audit posture

- Capability: privileged maintenance actions remain audit visible
  Test Case ID: `TC-CAP-CATALOG-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/capabilityContractCatalog/`
  Coverage:
  - successful materialization is audit visible
  - drift-audit reads are audit visible if current platform policy treats
    privileged planning reads as operationally significant
  - successful export is audit visible if current platform policy treats
    machine-readable catalog export as a privileged operation

## Edge And Negative Tests

- Edge: contradictory source truth blocks honest normalization
  Test Case ID: `TC-CAP-CATALOG-EDGE-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/capabilityContractCatalog/`
  Coverage:
  - contradictory schema and API-contract truth blocks materialization
  - contradictory permission mappings block materialization
  - drift audit marks the record `blocked` instead of fabricating a best guess

- Edge: partial source coverage remains explicit
  Test Case ID: `TC-CAP-CATALOG-EDGE-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/capabilityContractCatalog/`
  Coverage:
  - missing human-friendly description remains explicit rather than silently
    copied from a technical id
  - missing API contract or feature-manifest coverage is surfaced honestly
  - list and exact-read flows preserve source-coverage posture

- Edge: unsupported validation shapes do not become fake frontend rules
  Test Case ID: `TC-CAP-CATALOG-EDGE-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/capabilityContractCatalog/`
  Coverage:
  - unsupported schema constructs are marked as not-normalized rather than
    converted into misleading validation metadata
  - capability-level constraint extraction fails honestly when source truth
    cannot support a stable rule

- Edge: picker selectors remain deterministic
  Test Case ID: `TC-CAP-CATALOG-EDGE-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/capabilityContractCatalog/`
  Coverage:
  - deterministic picker search selectors behave consistently
  - grouping and ordering remain stable across repeated reads
  - route-family and selection-group metadata do not drift from persisted truth

## Compatibility And Contract Tests

- Contract: stable capability ids and field paths
  Test Case ID: `TC-CAP-CATALOG-EDGE-005`
  Recommended Test Layer: `compatibility-integration`
  Suggested Test Folder: `tests/integration/capabilityContractCatalog/`
  Coverage:
  - stable capability ids survive normal refreshes
  - stable field paths survive non-breaking source refreshes
  - breaking contract churn is surfaced as compatibility-sensitive rather than
    silently rewritten

- Contract: export-format versioning
  Test Case ID: `TC-CAP-CATALOG-EDGE-006`
  Recommended Test Layer: `compatibility-integration`
  Suggested Test Folder: `tests/integration/capabilityContractCatalog/`
  Coverage:
  - export format carries an explicit version marker
  - export changes that break prior consumers require explicit format-version
    evolution

## Concurrency / Idempotency Tests

- Capability: repeated materialization over unchanged source truth
  Test Case ID: `TC-CAP-CATALOG-EDGE-007`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/capabilityContractCatalog/`
  Coverage:
  - repeated materialization over unchanged source truth behaves idempotently
  - duplicate catalog rows are not created
  - freshness posture remains honest after repeated runs

## Acceptance Notes

- The slice is acceptable when:
  - persisted capability records can be materialized from approved source truth
  - picker summaries and exact reads are trustworthy enough for later frontend
    tooling to consume
  - validation and description metadata are exported honestly rather than
    speculatively
  - drift is surfaced explicitly before downstream consumers treat stale
    records as canonical
- The first implementation slice should treat any unresolved contradiction in
  source-truth authority order as a blocker rather than silently choosing a
  hidden winner.
