# Capability Contract Catalog Foundation Implementation Blueprint

## Summary

- Feature:
  `capabilityContractCatalog`
- Capability:
  durable normalized registry of approved HTTP-backed backend capabilities with
  picker summaries, exact field-level contract reads, deterministic export,
  governed materialization, and governed drift audit
- Scope:
  backend feature slice only
- Phase:
  pre-implementation blueprint

## Inputs

- Capability matrix reference:
  [2026-04-22-capability-contract-catalog-v1-capability-matrix-first-draft.csv](/home/gordon/kanbien-capability-contract-catalog-v1/docs/workspace/capability-matrices/2026-04-22-capability-contract-catalog-v1-capability-matrix-first-draft.csv)
- Capability notes:
  [2026-04-22-capability-contract-catalog-v1-capability-matrix-first-draft-notes.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/workspace/capability-matrices/2026-04-22-capability-contract-catalog-v1-capability-matrix-first-draft-notes.md)
- Record-shape note:
  [2026-04-22-capability-contract-catalog-v1-record-shapes-first-draft.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/workspace/capability-matrices/2026-04-22-capability-contract-catalog-v1-record-shapes-first-draft.md)
- PRD:
  [2026-04-22-0020-capability-contract-catalog-foundation.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/prd/2026-04-22-0020-capability-contract-catalog-foundation.md)
- PRD test-case doc:
  [2026-04-22-0020-capability-contract-catalog-foundation-test-cases.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/prd/test_cases/2026-04-22-0020-capability-contract-catalog-foundation-test-cases.md)

## QA Coverage Classification

- Coverage matrix guide:
  [qa-coverage-matrix-guide.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/architecture/guides/qa-coverage-matrix-guide.md)
- QA release gate:
  [QA-RELEASE-GATE.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/standards/QA-RELEASE-GATE.md)
- Change-class classification:
  - privileged root-operated backend feature
  - persistence schema and durable workflow change
  - compatibility-sensitive source-of-truth and export seam
  - normalization, validation, and drift-governance seam
- Required layers from the matrix:
  - unit
  - integration
  - security
  - audit
  - persistence-backed verification
  - compatibility/contract
- Additional required checks:
  - migration safety review
  - source-truth authority-order review
  - freshness and drift honesty review
  - traceability-ready `TC-*` naming once executable tests land
- Current non-functional posture for this slice:
  - performance:
    structure- and regression-oriented, not SLA-driven in this foundation
  - resilience/failure-injection:
    secondary in v1; revisit if normalization or artifact generation depends on
    external shared tooling beyond repo-owned sources
  - concurrency/idempotency:
    important for repeated materialization over unchanged source truth
  - compatibility/contract:
    high priority because this slice becomes upstream composition truth for
    later frontend tooling

## Scope Confirmation

This blueprint is for one coherent backend slice:

- add a new `capabilityContractCatalog` feature under
  `src/features/capabilityContractCatalog/`
- persist normalized capability records
- persist normalized request and response field records
- persist access metadata, source references, and freshness posture
- provide protected root-only routes for:
  - paginated capability-picker summaries
  - exact read of one capability record
  - deterministic catalog export
  - governed materialization
  - governed drift-audit reads
- implement a normalization pipeline that consumes approved source artifacts
- emit a reviewable generated artifact in repo
- keep runtime browse, exact-read, and export flows backed by persisted
  database truth

This blueprint does **not** include:

- frontend capability-picker UI
- frontend builder UI
- automatic generation of new frontend slices
- evaluation of tenant or entity-relationship omission rules
- cataloging non-HTTP cross-feature public seams
- durable history for all materialization or audit runs
- silent runtime source scraping as the normal read path

## Frontend Plan

- Route / surface:
  no frontend implementation in this slice
- UI states to support later:
  - capability browsing
  - capability filtering and selection
  - capability detail inspection
  - freshness or drift warning posture
  - export readiness
- Permission visibility behavior:
  later root-admin or internal builder UI should expose these routes only to
  actors granted the governing `capability-contract-catalog.*` capabilities
- Session / expiry behavior:
  all routes rely on the existing root authenticated session model from
  `rootAuth`
- Browser security considerations:
  API-only in this phase; no browser-shell work is required

## Backend Plan

- Protected route(s):
  - `GET /v1/capability-contract-catalog/capabilities`
  - `GET /v1/capability-contract-catalog/capabilities/:capabilityId`
  - `POST /v1/capability-contract-catalog/export`
  - `POST /v1/capability-contract-catalog/materialize`
    or an explicit support-only internal seam if final repo direction keeps
    manual materialization off the normal route family
  - `GET /v1/capability-contract-catalog/drift`
    or an explicit support-only internal seam if final repo direction keeps
    drift audit off the normal route family
- Request/response/error contract:
  - list accepts explicit filters for:
    - `featureName`
    - `routeFamily`
    - `seamType`
    - `capabilityBoundary`
    - `governingAuthzCapability`
    - `allowedRole`
    - `catalogStatus`
    - `driftStatus`
    - picker suitability flags such as:
      - `supportsRequestBody`
      - `supportsResponseFields`
      - `supportsFilters`
    - deterministic selector fields such as:
      - `capabilityId`
      - `displayLabel`
      - `featureNamePrefix`
    - repo pagination defaults
  - list returns picker summary records containing:
    - `capabilityId`
    - `displayLabel`
    - `shortDescription`
    - `featureName`
    - `routeFamily`
    - `seamType`
    - `capabilityBoundary`
    - `selectionGroup`
    - route metadata when present
    - governing authz capability keys
    - allowed roles
    - request/response/filter support flags
    - freshness status
    - lifecycle status
  - exact read returns:
    - summary fields where useful
    - `fullDescription`
    - optional `userFacingOutcome`
    - access block
    - request fields partitioned into params, query, and body
    - response fields
    - field-level validation metadata
    - capability-level constraints
    - source references
    - freshness metadata
  - export accepts:
    - explicit scope
    - export format version
    - optional stale-tolerance flag if the final contract supports that posture
  - export returns:
    - deterministic ordered snapshot from persisted records
    - explicit format version
    - freshness or drift posture
  - materialization accepts:
    - explicit scope
    - refresh mode
    - optional overwrite posture only where approved
  - materialization returns:
    - counts of inserted and updated records
    - generated-artifact status
    - resulting freshness posture
    - validation or drift blockers
  - drift read returns:
    - per-capability status
    - source coverage
    - drift reasons
    - rematerialization-required posture
  - use repo-standard authz and validation error shape with stable
    feature-owned codes such as:
    - `CAPABILITY_CATALOG_NOT_FOUND`
    - `CAPABILITY_CATALOG_INVALID_FILTER`
    - `CAPABILITY_CATALOG_EXPORT_BLOCKED`
    - `CAPABILITY_CATALOG_MATERIALIZATION_BLOCKED`
    - `CAPABILITY_CATALOG_SOURCE_TRUTH_CONFLICT`
    - `CAPABILITY_CATALOG_SOURCE_UNSUPPORTED`
    - `CAPABILITY_CATALOG_DRIFT_BLOCKED`
- Feature-local files expected:
  - `src/features/capabilityContractCatalog/index.ts`
  - `src/features/capabilityContractCatalog/integration.ts`
  - `src/features/capabilityContractCatalog/README.md`
  - `src/features/capabilityContractCatalog/contract/errors.ts`
  - `src/features/capabilityContractCatalog/contract/schemas.ts`
  - `src/features/capabilityContractCatalog/contract/types.ts`
  - capability-focused domain files, likely:
    - `listCapabilityCatalogEntries.ts`
    - `getCapabilityCatalogEntry.ts`
    - `exportCapabilityCatalogSnapshot.ts`
    - `materializeCapabilityCatalog.ts`
    - `auditCapabilityCatalogDrift.ts`
  - normalization and source-resolution helpers, likely:
    - `domain/sourceAuthority.ts`
    - `domain/normalizeCapabilityRecord.ts`
    - `domain/extractFieldMetadata.ts`
    - `domain/extractValidationMetadata.ts`
    - `domain/resolveDescriptions.ts`
    - `domain/presenters.ts`
    - `domain/types.ts`
    - `domain/service.ts`
  - generated-artifact support files, likely under:
    - `src/features/capabilityContractCatalog/generation/`
  - `src/features/capabilityContractCatalog/persistence/types.ts`
  - `src/features/capabilityContractCatalog/persistence/repository.ts`
  - `src/features/capabilityContractCatalog/persistence/postgresRepository.ts`
  - `src/features/capabilityContractCatalog/persistence/migrations/0035_create_capability_contract_catalog.sql`
    or the next available sortable migration id at implementation time
  - `src/features/capabilityContractCatalog/transport/router.ts`
- Cross-feature seams:
  - existing `requireRootSession` seam for protected routes
  - existing `createRequireRootCapability(...)` seam for route protection
  - existing root-auth request-context seam for actor attribution
  - maintained API-contract docs, permission-mapping docs, and feature
    manifests are read as approved source truth
  - do not import another feature's private persistence or transport internals
  - v1 should consume HTTP-backed feature truth and maintained source
    artifacts, not non-HTTP cross-feature public seams
- Authorization enforcement point:
  central route and service-boundary enforcement using shared root capability
  middleware plus feature-local source-truth validation and freshness guards

## Repo File Layout Plan

- add a mounted feature under `src/features/capabilityContractCatalog/`
- follow the same feature shape used by `entityBuilder`,
  `webAppSurfaceDiscovery`, and `notificationDelivery`
- keep `integration.ts` responsible for composing:
  - Postgres repository
  - normalization and source-resolution helpers
  - generated-artifact writer or orchestrator
  - domain service
  - transport router
- keep source-authority resolution feature-owned rather than moving it to
  `src/lib/*` because the normalization rules are specific to this catalog
  feature's truth model
- export a narrow public seam from
  `src/features/capabilityContractCatalog/index.ts` for:
  - list summaries
  - exact reads
  - export
  - internal materialization or drift orchestration if other repo tooling later
    consumes it

## Integration Wiring Plan

- extend
  [index.ts](/home/gordon/kanbien-capability-contract-catalog-v1/src/routes/v1/index.ts)
  to mount `createCapabilityContractCatalogFeature(...)` under
  `/v1/capability-contract-catalog`
- extend the root capability catalog in
  [capabilityCatalog.ts](/home/gordon/kanbien-capability-contract-catalog-v1/src/features/rootRoles/domain/capabilityCatalog.ts)
  with at least:
  - `capability-contract-catalog.read`
  - `capability-contract-catalog.export`
  - `capability-contract-catalog.materialize`
  - `capability-contract-catalog.audit-drift`
- treat `RootUserAdmin` as the initial granting role
- add migration-backed default role grants for those capabilities so live
  environments stay aligned with the route contract
- update permission-mapping artifacts in:
  - [backend-to-authz-capability-mapping.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md)
  - [role-to-authz-capability-mapping.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/architecture/permission-mappings/role-to-authz-capability-mapping.md)
- decide during implementation whether materialization and drift audit remain
  normal root-only routes or move behind a support-only execution seam; keep
  that decision explicit in the same change

## Persistence Plan

- Entities / rows affected:
  - new durable `capability_catalog_records` table
  - new durable `capability_catalog_fields` table
  - new durable `capability_catalog_constraints` table
  - new durable `capability_catalog_source_references` table
  - optional generated-artifact metadata table only if the implementation needs
    to track repo-output posture explicitly in the database
- Durable capability-record fields expected:
  - `capability_catalog_record_id` UUID primary key
  - stable `capability_id`
  - `feature_name`
  - `display_label`
  - `short_description`
  - `full_description` nullable
  - `user_facing_outcome` nullable
  - `route_family`
  - `seam_type`
  - `capability_boundary`
  - `selection_group`
  - `http_method` nullable
  - `route_path` nullable
  - serialized governing authz capability keys
  - serialized allowed roles
  - support flags for request body, response fields, and filters
  - `freshness_status`
  - `lifecycle_status`
  - `last_materialized_at`
  - `last_audited_at` nullable
  - standard lifecycle timestamps
- Durable field-record fields expected:
  - `capability_catalog_field_id` UUID primary key
  - `capability_id` foreign key
  - `contract_side`
  - stable `path`
  - optional `display_label`
  - optional `description`
  - `field_type`
  - `required`
  - `nullable`
  - `repeated`
  - optional `format`
  - optional serialized enum values
  - optional `system_managed`
  - optional serialized normalization posture
  - optional serialized binding hints
  - optional serialized validation metadata
  - deterministic ordering metadata
- Durable constraint fields expected:
  - `capability_catalog_constraint_id` UUID primary key
  - `capability_id` foreign key
  - `constraint_kind`
  - serialized affected field paths
  - human-readable message
  - deterministic ordering metadata
- Durable source-reference fields expected:
  - `capability_catalog_source_reference_id` UUID primary key
  - `capability_id` foreign key
  - `source_type`
  - `source_path`
  - optional coverage metadata
- Migration changes:
  - add feature-scoped SQL migration under
    `src/features/capabilityContractCatalog/persistence/migrations/`
  - seed new root capability catalog rows and default grants for
    `RootUserAdmin`
  - decide whether initial catalog rows are seeded in the same migration from a
    generated seed artifact or through a first-run materialization command
  - update Postgres test harness registration for the new feature group
- Index or uniqueness changes:
  - unique index on `capability_id`
  - unique index on `(capability_id, contract_side, path)`
  - index on `(feature_name, capability_id)`
  - index on governing authz capability selectors if those are normalized into
    join rows or queryable JSONB with explicit strategy
  - index on `freshness_status`
  - index on `route_family`
  - index on `selection_group`
  - foreign keys from field, constraint, and source-reference rows into the
    parent record
- Search/filter implications:
  - list reads should use explicit scalar fields or approved queryable
    structured columns
  - avoid vague blob search in v1
  - if queryable arrays or JSONB are used for authz capabilities, roles, or
    binding hints, document the index strategy explicitly
- Compatibility notes:
  - preserve stable `capability_id` and stable field paths across non-breaking
    refreshes
  - treat route-path churn or field-path churn as compatibility-sensitive
  - do not silently rewrite persisted truth when authority conflicts cannot be
    resolved honestly

## Source-Truth And Generation Plan

- Approved v1 source set:
  - feature contract schemas and types
  - maintained permission mappings
  - maintained API contract docs
  - feature manifests
- Working authority direction:
  - feature contract schemas and types should lead for request/response shape
  - permission mappings should lead for authz keys and resolved role posture
  - API contract docs should provide human-readable contract context,
    descriptions, and route-family framing
  - feature manifests should provide ownership and public-seam context
- Implementation requirement:
  the exact authority order must be encoded explicitly in feature-local
  normalization logic rather than spread implicitly across helper files
- Generated artifact direction:
  - produce a deterministic reviewable artifact in repo
  - keep the artifact generated from the same normalization logic used for
    database materialization
  - fail honestly when one output cannot be updated consistently with the other

## Validation And Description Plan

- Validation:
  - extract field-level validation only where current source truth can support
    it honestly
  - extract capability-level constraints for cross-field rules such as
    at-least-one or mutually-exclusive
  - reject or mark unsupported source constructs explicitly rather than
    fabricating a parallel validation language
- Descriptions:
  - persist short picker-friendly descriptions
  - persist fuller inspector-friendly descriptions where source wording is
    sufficient
  - if current source artifacts are too technical, introduce one explicit
    normalization-owned description source rather than inventing frontend-local
    copy later

## Verification Plan

- Journey tier / workflow scope:
  no end-to-end journey tier is required in this backend-only foundation slice
- Unit:
  - capability id normalization
  - field-path normalization
  - validation extraction
  - description resolution
  - drift-status classification
- Integration:
  - list summaries
  - exact reads
  - deterministic export
  - materialization refresh
  - drift audit
- Security:
  - root-only enforcement
  - deny unauthenticated callers
  - deny callers lacking the governing catalog capability
  - deny direct mutation of protected identity or freshness fields
- Audit:
  - denied access visibility
  - successful materialization visibility
  - successful export visibility if policy requires it
- Edge:
  - contradictory source truth
  - missing source coverage
  - unsupported validation constructs
  - deterministic picker selectors
- Frontend:
  - none in this slice
- Persistence-backed:
  - stable ids
  - stable field rows
  - refresh without duplicate rows
  - freshness posture after refresh
- End-to-end:
  - none in this slice
- Concurrency / idempotency:
  - repeated materialization over unchanged source truth behaves idempotently
  - duplicate rows are not created
- Performance:
  - no dedicated blocking performance suite in v1
  - review indexes and deterministic ordering as the current minimum
- Resilience / failure-injection:
  - not a blocking dedicated suite in v1
  - contradictory or partial source truth is covered through integration and
    edge tests
- Compatibility / contract:
  - stable capability ids and stable field paths
  - explicit export-format versioning
  - breaking path churn treated as compatibility-sensitive
- Accessibility:
  - none in this backend-only slice
- Structured exploratory QA:
  - optional short focused note around stale or drift posture honesty
- QA checklist:
  - standards-oriented privileged-route and artifact-honesty review
- Curated test-run summary:
  - useful once executable suites land because this slice becomes a reusable
    standards example for later builder-facing platform work
- Waiver / quarantine expectation:
  - none expected in v1; unresolved authority-order contradictions should block
    implementation rather than be waived quietly

## Documentation Plan

- PRD updates:
  [2026-04-22-0020-capability-contract-catalog-foundation.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/prd/2026-04-22-0020-capability-contract-catalog-foundation.md)
  should stay aligned if source-authority or route-exposure decisions change
- PRD test-case updates:
  [2026-04-22-0020-capability-contract-catalog-foundation-test-cases.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/prd/test_cases/2026-04-22-0020-capability-contract-catalog-foundation-test-cases.md)
  should refresh if capability names, route posture, or verification scope
  changes materially
- Feature docs:
  add `src/features/capabilityContractCatalog/README.md`
  and review whether a source-independent feature doc is needed under
  `docs/featureDocs/`
- API contract docs:
  add a source-independent contract doc for the
  `capability-contract-catalog` route family under `docs/api-contracts/`
- OpenAPI:
  review `docs/swagger/openapi.yaml` for the new route family
- Postman:
  review maintained Postman artifacts if this repo keeps current collections
  for root-operated backend route families
- Data dictionary:
  review whether new durable catalog tables need entries under
  `docs/data-dictionary/`
- Feature manifests:
  add and maintain
  `src/features/capabilityContractCatalog/feature.manifest.json`
- Dependency graph artifacts:
  refresh
  `docs/architecture/generated/feature-dependency-graph.json`
  and
  `docs/architecture/generated/feature-dependency-graph.md`
  once the feature manifest and dependencies exist
- Architecture map:
  review whether
  `docs/workspace/architecture-map/`
  should reflect the new normalization and catalog-governance seam
- Standards platform-status snapshots:
  review files under
  `docs/standards/platform-status/`
  whose wording or evidence story changes because the platform now has a
  persisted capability-catalog seam for frontend-composition planning
- Reconstruction questionnaire:
  review whether build-from-spec reconstruction docs should mention the new
  generated-artifact plus materialization loop
- Bootstrap and helper docs:
  update helper docs if implementation adds a required generation or
  materialization command
- Maintained-artifacts sweep:
  review earlier planning docs, capability-matrix indexes, and registry docs
  whose wording becomes stale because this feature now exists as a planned or
  implemented platform seam
- Runbook:
  consider a short operator runbook if manual materialization or drift audit
  remains a supported operational action in v1
- Privacy note:
  not expected to be primary in this slice, but review if description or
  validation exports risk surfacing sensitive internal field names or secrets
- Standards review:
  required because this is a privileged route family plus an enduring platform
  seam
- Repo health review:
  recommended once implementation lands because this feature becomes an
  upstream composition dependency for later frontend work

## Completion Guardrails

- Blocking QA outcomes:
  - unresolved source-authority contradictions
  - non-deterministic capability ids or field paths
  - drift posture that can be hidden from consumers
  - inability to keep generated artifacts and persisted truth aligned
- Explicitly deferred verification layers and rationale:
  - frontend, accessibility, and end-to-end are deferred because this slice is
    backend-only
  - dedicated performance and resilience suites are deferred because v1 is
    structure- and correctness-focused rather than throughput-driven
- Expected release-gate residual risk statement:
  - the main residual risk is authority-order drift across source artifacts;
    implementation should prefer explicit blocking and surfaced stale posture
    over convenience fallback behavior
