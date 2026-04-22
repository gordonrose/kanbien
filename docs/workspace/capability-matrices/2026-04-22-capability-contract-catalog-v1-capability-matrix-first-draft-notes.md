# Capability Contract Catalog V1 Capability Matrix Notes

## Generated Artifact

- Matrix:
  [2026-04-22-capability-contract-catalog-v1-capability-matrix-first-draft.csv](/home/gordon/kanbien-capability-contract-catalog-v1/docs/workspace/capability-matrices/2026-04-22-capability-contract-catalog-v1-capability-matrix-first-draft.csv)

## Current Posture

This is an early planning artifact, not an implementation-ready blueprint.

At the time of writing:

- no approved PRD exists yet for this feature
- no ADR exists yet for the enduring catalog-generation model
- the matrix is being used to turn the feature idea into a repo-shaped first
  specification before implementation planning begins

That means the matrix should be treated as:

- a draft source for later PRD work
- a draft source for later authz and role-mapping updates
- a draft source for a later implementation blueprint

It should not yet be treated as approval to implement the feature.

## Current Direction Decisions

The following planning decisions are now the working direction for v1 unless a
later PRD or ADR intentionally changes them:

- persistence posture:
  hybrid
- hybrid meaning:
  a generated in-repo artifact remains reviewable maintained truth for change
  visibility, while database materialization provides the runtime query seam
  used by catalog APIs and later frontend tooling
- catalog scope for v1:
  approved HTTP-backed public feature capabilities only
- drift posture:
  browse and exact-read surfaces may expose explicit stale or drift posture,
  while trusted export and materialization flows should block when source truth
  is contradictory
- capability identifier posture:
  feature-qualified logical ids
- field metadata posture:
  include richer metadata when derivable honestly, including enum values,
  format, nullable, repeated, system-managed, and binding hints
- validation posture:
  export field-level validation metadata and capability-level cross-field
  constraints so frontend tooling can mirror backend validation honestly while
  backend enforcement remains authoritative
- capability description posture:
  persist both short picker-friendly descriptions and fuller user-facing
  descriptions so frontend tooling can explain what a capability does without
  inventing copy locally
- access modeling posture:
  persist governing authz capability keys, resolved allowed roles, boundary
  classification, and future runtime-context requirements
- picker grouping posture:
  start with feature and route-family grouping
- runtime history posture:
  current freshness and drift posture only in v1 unless later work approves
  durable run history

## Upstream Truth For This Matrix

This matrix intentionally starts from existing maintained source artifacts
rather than from route-handler scraping or implementation guesses.

Primary current sources:

- [docs/api-contracts/README.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/api-contracts/README.md)
- [backend-to-authz-capability-mapping.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md)
- [role-to-authz-capability-mapping.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/architecture/permission-mappings/role-to-authz-capability-mapping.md)
- [system-overview.md](/home/gordon/kanbien-capability-contract-catalog-v1/docs/architecture/system-overview.md)
- feature manifests under
  [src/features](/home/gordon/kanbien-capability-contract-catalog-v1/src/features)

## Consolidated Model Assumptions

- the primary catalog unit is the backend capability, not the route and not
  the entity
- routes remain important transport metadata, but they are not the catalog's
  stable conceptual center
- request and response contracts should be normalized into field paths such as
  `params.id`, `query.page`, `body.email`, and `response.items[].status`
- normalized records should include validation metadata for each field where it
  can be derived honestly, such as format enum requiredness min or max bounds,
  normalization posture, and similar input rules
- normalized records should also include capability-level constraints for rules
  that do not belong to one field alone, such as at-least-one,
  mutually-exclusive, conditional requirement, or comparison rules
- governing authz capability keys are the canonical access truth
- allowed roles are derived views resolved from maintained role-mapping
  artifacts rather than a replacement source of truth
- the catalog mirrors backend authorization truth for frontend composition and
  omission behavior, but must never replace backend enforcement
- each capability record should carry human-friendly descriptions suitable for
  picker UI and deeper inspector UI, not just internal ids and route metadata
- v1 should focus on approved HTTP-backed public feature capabilities first
- normalized capability records should be persisted durably and read from that
  durable registry rather than reconstructed from scattered source files at
  request time
- the initial registry population can be seeded by the same normalization
  pipeline that later refreshes feature changes
- drift should be audited by comparing current approved source artifacts
  against persisted normalized records using the same normalization rules
- v1 may declare future runtime-context requirements, such as current tenant
  or entity relationship inputs, but it should not pretend to evaluate those
  omission filters yet
- derived export snapshots must be clearly marked as derived, versioned
  outputs rather than durable authoritative records

## Recommended Feature Boundary

The first `capabilityContractCatalog` feature loop should be a backend planning
and export foundation.

It should own:

- normalized persisted capability-catalog records
- governed materialization of those records from approved source artifacts
- normalized read access to capability-summary records
- normalized exact reads of one capability contract record
- deterministic derived export of the capability catalog for future builder
  tooling
- exported field-level validation and capability-level constraint metadata
- short and full capability descriptions for frontend display surfaces
- honest freshness and drift posture when persisted records no longer match
  approved source truth
- role and authz metadata needed for frontend permission mirroring
- declaration hooks for later contextual omission filters

It should not yet own:

- a real app page-builder UI
- design-system adoption work
- dynamic evaluation of tenant or entity-relationship omission rules
- durable history for every exported snapshot unless a later slice approves it
- automatic mutation of other features' manifests or contracts
- speculative support for private internal seams that do not yet have approved
  exported source truth

## Truth Separation Expected By The Matrix

- authoritative backend truth:
  feature contracts, maintained API contracts, permission mappings, feature
  manifests, and approved exported feature seams
- persisted catalog truth:
  normalized durable capability records materialized from those sources
- derived export truth:
  deterministic versioned snapshots produced from persisted catalog records for
  downstream tooling
- frontend-builder truth:
  later UI composition and omission behavior that consumes the catalog without
  replacing backend authorization or validation

## Proposed Lifecycle Model

The feature is now modeled as a governed persisted registry rather than as a
runtime smart scraper.

Expected loop:

1. a feature seam or permission mapping changes
2. the normalization pipeline reads approved source artifacts
3. the materialization flow inserts or updates persisted catalog records
4. drift audit compares persisted records to current source truth
5. runtime list, exact-read, and export capabilities read from the persisted
   registry

This gives the frontend a stable seam while keeping the source artifacts and
the persisted registry auditable against one another.

Under the current hybrid decision, the same normalization flow should also
produce a reviewable generated artifact in-repo so catalog changes remain
inspectable during feature work and code review.

## Open Design Questions To Resolve In PRD / ADR Work

- whether the feature should assemble records on demand at runtime, from a
  hybrid generation pipeline with both repo and database materialization
- what exact source set is approved as canonical when API contracts,
  OpenAPI, schemas, and feature manifests disagree
- whether capability identifiers should be route-shaped, feature-qualified
  logical ids, or a generated stable catalog id
- how far field-level metadata should go in v1 for enums, formats,
  system-managed markers, and binding hints
- which validation rules can be normalized safely from current schema sources
  without inventing a parallel validation language that drifts from backend
  truth
- where short and full capability descriptions should be sourced from when
  current artifacts do not yet carry sufficiently user-facing wording
- whether materialization runs and drift findings need durable history in v1
- whether export snapshots need durable history in a later slice
- when tenant-scoped and entity-relationship omission rules become explicit
  catalog inputs rather than deferred placeholders

## Future Work Note

Cross-feature public seam cataloging is intentionally deferred from v1.

Examples include:

- reader seams exported for another feature's auth or browser bootstrap flows
- feature seam factories used for internal feature-to-feature integration
- approved non-HTTP exported public seams consumed by another backend feature

The current recommendation is:

- v1 catalogs approved HTTP-backed public feature capabilities only
- a later slice may extend the catalog model to include approved cross-feature
  public seams when there is a concrete backend-to-backend composition or
  planning use case

That later slice should decide explicitly:

- whether non-HTTP seams need a separate capability type
- how their contract shapes differ from HTTP request and response partitions
- whether they should share the same picker and export surfaces or be modeled
  as a parallel seam family

## ADR Recommendation

An ADR is likely warranted before implementation because this feature
introduces:

- a new persisted machine-consumable planning seam
- a new normalization and materialization pipeline
- a new drift-audit workflow tied to feature-loop governance
- a new cross-artifact truth-resolution rule
- a new contract between backend source truth and future frontend builder
  tooling
- a new rule for mirroring authorization and omission posture without making
  the frontend authoritative
