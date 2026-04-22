# Capability Contract Catalog Foundation Specification

## Implementation Status

- Status:
  planned backend foundation slice as of 2026-04-22
- Implemented:
  - first-pass capability matrix for `capabilityContractCatalog`
  - record-shape draft for picker, exact-record, and registry-status views
- Not yet implemented:
  - `capabilityContractCatalog` backend feature
  - durable catalog persistence
  - normalization and materialization pipeline
  - drift-audit workflow
  - root-only catalog routes
  - hybrid generated artifact plus database materialization flow
  - frontend capability-picker or builder UI

## Purpose

Define the first backend foundation slice for the `capabilityContractCatalog`
feature.

This slice introduces a durable normalized registry of backend capability truth
so the platform can stop depending on ad hoc frontend assumptions, scattered
API docs, and manual backend knowledge when composing new vertical slices from
existing backend behavior.

It provides the backend capabilities required for:

- durable storage of normalized backend capability records
- root-only read access to capability-picker summaries
- root-only exact read access to field-level capability records
- deterministic derived export of the capability catalog for tooling
- governed materialization of persisted catalog records from approved source
  artifacts
- governed drift audit between persisted catalog truth and current source truth

It also establishes:

- the backend capability as the primary catalog unit
- stable feature-qualified logical ids for catalog records
- explicit separation between authoritative backend source truth, persisted
  catalog truth, and derived export truth
- canonical treatment of governing authz capability keys with derived role
  views for frontend permission mirroring
- export of field-level validation and capability-level constraint metadata for
  frontend validation mirroring
- short and full user-facing descriptions for frontend picker and inspector
  surfaces
- a hybrid posture where repo-visible generated artifacts and database-backed
  runtime reads reinforce each other

---

## Scope

This phase includes:

- a new `capabilityContractCatalog` feature under `src/features/`
- durable storage for:
  - normalized capability records
  - normalized request field records
  - normalized response field records
  - access metadata
  - source-reference and freshness metadata
- root-only backend routes under `/v1/capability-contract-catalog`
- paginated filtered capability-picker summaries
- exact read of one capability record
- deterministic derived export of catalog snapshots
- governed materialization of persisted catalog records
- governed drift-audit reads
- a normalization pipeline that reads approved source artifacts and produces:
  - persisted database truth
  - a reviewable generated artifact in repo
- v1 support for approved HTTP-backed public feature capabilities only

This phase does **not** include:

- frontend capability-picker UI
- frontend builder UI
- automatic generation of new frontend slices
- tenant-context or entity-relationship omission-rule evaluation
- cataloging non-HTTP cross-feature public seams
- arbitrary runtime scraping of feature internals
- silent best-effort catalog repair during normal reads
- durable history for every export, materialization run, or drift-audit run
  unless later work explicitly adds it

Those later concerns should build on this durable capability-catalog seam
rather than be collapsed into the first foundation slice.

---

## Core Concepts

### Backend capability

A backend capability is one discrete business action or read seam owned by a
feature and exposed through an approved HTTP-backed public route in v1.

Examples:

- `rootUsers.listRootUsers`
- `notificationDelivery.resendEmail`
- `tenants.createTenant`

The capability is the primary catalog unit.

Routes remain important transport metadata, but the route is not the catalog's
stable conceptual center.

### Capability picker summary

A capability-picker summary is the lightweight selection view used by later
frontend menus, drawers, trees, and search flows.

It answers:

- what the capability is called
- which feature owns it
- what broad route family or grouping it belongs to
- what kind of request or response support it has
- what authz posture applies
- whether the record is fresh enough to trust for selection

### Exact capability record

An exact capability record is the detailed normalized contract view used by
builder-style tooling after one capability has been selected.

It answers:

- what request params, query fields, and body fields exist
- what response fields exist
- what validation rules apply to each field
- what cross-field rules apply to the capability
- what permission keys and roles govern usage
- what runtime context will later matter for omission filters
- what user-facing descriptions should be shown in picker and inspector UI

### Registry status

A registry-status view is the governance layer over a persisted capability
record.

It answers:

- whether the record is fresh, stale, drifted, or blocked
- when it was last materialized
- when it was last audited
- which source artifacts are currently present
- whether rematerialization is required before trusted export or use

### Authoritative backend source truth

Authoritative backend source truth for this feature means the approved artifact
set the normalization pipeline is allowed to consume.

Expected v1 sources:

- feature contract schemas and types
- maintained API contract docs
- maintained backend-to-authz capability mappings
- maintained role-to-authz capability mappings
- feature manifests

The PRD and ADR flow must settle the exact authority order used when those
sources disagree.

### Persisted catalog truth

Persisted catalog truth is the durable normalized registry materialized from
approved source artifacts.

Normal browse, exact-read, and export flows should consume persisted catalog
records rather than reconstructing them from scattered source files at request
time.

### Derived export truth

Derived export truth is a deterministic snapshot generated from persisted
catalog records for downstream tooling.

Exported truth is:

- derived
- versioned explicitly
- not the authoritative storage layer in v1

### Hybrid persistence posture

The first slice uses a hybrid posture.

That means:

- a generated in-repo artifact remains reviewable maintained truth for change
  visibility and code review
- database materialization provides the runtime query seam used by catalog APIs
  and later frontend tooling

The normalization flow must support both outputs without allowing them to drift
silently.

### Governing authz capability keys

Governing authz capability keys are canonical access truth.

Examples:

- `root-user.read.visible`
- `notification.email.resend`

Resolved allowed roles are derived persisted views built from the maintained
role-mapping artifacts.

This preserves a stable permission identity even if role composition changes
later.

### Validation mirroring

The catalog must export validation truth suitable for frontend validation
mirroring.

That includes:

- field-level validation where derivable honestly
- capability-level constraints for cross-field rules

Frontend validation may mirror these rules for UX, but backend validation
remains authoritative.

### Capability descriptions

Each capability record should carry user-facing descriptive text.

Expected v1 description layers:

- short picker-friendly description
- fuller inspector-friendly description
- optional user-facing outcome summary

This keeps frontend tooling from inventing local explanatory copy that drifts
from backend intent.

### Drift posture

Drift exists when persisted catalog truth no longer matches current approved
source truth.

The platform must not hide that posture.

In v1:

- browse and exact-read surfaces may expose explicit stale or drift posture
- trusted export and materialization flows should block when source truth is
  contradictory beyond the allowed tolerance

---

## Recommended Feature Boundary

Add a new feature:

`src/features/capabilityContractCatalog/`

This feature should own:

- durable normalized capability records
- durable normalized field records
- durable access and freshness metadata
- normalization and materialization orchestration
- root-only protected catalog routes
- drift-audit reads
- export generation from persisted truth
- generated reviewable catalog artifact output

This feature should not own:

- real app UI
- frontend builder implementation
- backend source artifacts owned by other features
- silent mutation of other features' manifests or contracts
- cross-feature public seam cataloging in v1
- tenant or entity relationship evaluation logic

Related boundary notes:

- existing features remain owners of their own contract and permission truth
- `capabilityContractCatalog` owns the normalized persisted registry derived
  from that truth
- later frontend tooling should consume the catalog rather than scraping source
  artifacts directly

---

## Proposed Durable Entities

### Capability Catalog Record

Expected minimum fields:

- `capabilityCatalogRecordId`
- `capabilityId`
- `featureName`
- `displayLabel`
- `shortDescription`
- optional `fullDescription`
- optional `userFacingOutcome`
- `routeFamily`
- `seamType`
- `capabilityBoundary`
- optional route metadata:
  - `httpMethod`
  - `routePath`
- `selectionGroup`
- `supportsRequestBody`
- `supportsResponseFields`
- `supportsFilters`
- `governingAuthzCapabilities`
- resolved `allowedRoles`
- `freshnessStatus`
- `lifecycleStatus`
- `lastMaterializedAt`
- optional `lastAuditedAt`
- standard lifecycle timestamps

`capabilityId` should be a stable feature-qualified logical id.

### Capability Contract Field

Expected minimum fields:

- `capabilityCatalogFieldId`
- `capabilityId`
- `contractSide`
  - `request-param`
  - `request-query`
  - `request-body`
  - `response-body`
- `path`
- optional `displayLabel`
- optional `description`
- `fieldType`
- `required`
- optional `nullable`
- optional `repeated`
- optional `format`
- optional serialized enum values
- optional `systemManaged`
- optional normalization posture
- optional binding hints
- optional serialized validation metadata
- stable ordering metadata

### Capability Constraint

Expected minimum fields:

- `capabilityCatalogConstraintId`
- `capabilityId`
- `constraintKind`
- affected field paths
- message
- stable ordering metadata

Examples:

- at least one of a set of fields
- mutually exclusive fields
- conditional requirement
- comparison rule

### Capability Source Reference

Expected minimum fields:

- `capabilityCatalogSourceReferenceId`
- `capabilityId`
- `sourceType`
  - `feature-contract`
  - `api-contract-doc`
  - `permission-mapping`
  - `feature-manifest`
- `sourcePath`
- optional source-version or coverage metadata

### Registry Status View

Status may be modeled as either fields on the record or a separate supporting
table, but the logical view should expose:

- `freshnessStatus`
  - `fresh`
  - `stale`
  - `drifted`
  - `blocked`
- `lastMaterializedAt`
- optional `lastAuditedAt`
- drift reasons
- source coverage flags
- `rematerializationRequired`

---

## Required Capabilities

### List Capability Contract Catalog Entries

Provide paginated filtered picker-style reads over persisted capability
records.

Expected route:

- `GET /v1/capability-contract-catalog/capabilities`

This capability should support:

- feature-based browsing
- route-family browsing
- seam-type grouping
- authz-capability filtering
- allowed-role filtering
- capability-boundary filtering
- deterministic picker-style search selectors
- freshness and drift filtering

This capability should return picker-friendly summary records usable by later
menus, drawers, and tree-style selection UI.

### Get Exact Capability Contract Catalog Entry

Provide one exact read over a persisted capability record with normalized
contract field detail.

Expected route:

- `GET /v1/capability-contract-catalog/capabilities/{capabilityId}`

This capability should return:

- request params
- request query fields
- request body fields
- response body fields
- field-level validation metadata
- capability-level constraints
- access metadata
- user-facing descriptions
- freshness and source-reference posture

### Export Capability Contract Catalog Snapshot

Provide deterministic derived export from persisted catalog truth.

Expected route:

- `POST /v1/capability-contract-catalog/export`

This capability should:

- support explicit export scope
- support explicit export format version
- include freshness and drift posture
- block when contradictory source truth exceeds the allowed tolerance

### Materialize Capability Contract Catalog

Provide the governed write path that seeds or refreshes persisted catalog
records from approved source artifacts.

Expected route or support seam:

- `POST /v1/capability-contract-catalog/materialize`
  or an explicitly support-only internal seam if the repo decides the trigger
  should not be exposed as a normal root-admin API route in v1

This capability should:

- use the approved normalization pipeline
- refuse to persist ambiguous or contradictory truth
- support initial seeding and later refresh through the same rules
- update both database-backed catalog storage and the reviewable generated
  artifact

### Audit Capability Contract Catalog Drift

Provide explicit drift inspection between persisted catalog truth and current
approved source truth.

Expected route or support seam:

- `GET /v1/capability-contract-catalog/drift`
  or an explicitly support-only internal seam if the repo decides the audit
  trigger should remain internal in v1

This capability should:

- classify records as fresh, stale, drifted, blocked, or missing
- explain drift reasons
- surface source coverage posture
- not mutate persisted rows as a side effect of reading drift posture

---

## Record Views

### Picker Summary View

The picker summary view should be optimized for selection UX.

Expected fields:

- `capabilityId`
- `displayLabel`
- `shortDescription`
- `featureName`
- `routeFamily`
- `seamType`
- `capabilityBoundary`
- `selectionGroup`
- optional route metadata
- governing authz capability keys
- allowed roles
- request/response/filter support flags
- freshness status
- lifecycle status

### Exact Capability View

The exact capability view should be optimized for builder inspection.

Expected fields:

- picker-summary fields where useful
- fuller descriptive text
- access block
- request partitions
- response fields
- field-level validation metadata
- capability-level constraint metadata
- runtime-context requirements
- source references
- freshness metadata

### Registry Status View

The registry-status view should be optimized for governance and trust.

Expected fields:

- `capabilityId`
- freshness status
- last materialized and audited timestamps
- drift reasons
- source coverage flags
- rematerialization-required flag

---

## Source Truth And Authority Direction

The exact authority order must be settled before implementation, but the
working source set is:

1. feature contract schemas and types
2. maintained permission mappings
3. maintained API contract docs
4. feature manifests

The PRD and ADR flow should decide:

- how to resolve contradictions
- which source wins when one is more precise but another is more human-readable
- which missing source postures are acceptable for v1 materialization

The runtime feature must not invent hidden fallback truth when sources are
contradictory.

---

## Validation Direction

V1 should export validation metadata wherever that truth can be derived
honestly from approved backend sources.

Expected field-level validation types include:

- requiredness
- format
- enum values
- min or max bounds where applicable
- normalization posture

Expected capability-level constraint types include:

- at least one field required from a set
- mutually exclusive fields
- conditional requirements
- comparison rules

The feature must not create a parallel validation language that drifts from the
backend's real validation model.

---

## Description Direction

V1 should export user-facing capability descriptions suitable for frontend
consumption.

Expected description layers:

- short picker-friendly description
- full inspector-friendly description
- optional user-facing outcome summary

The implementation plan must decide where those descriptions come from when the
current source artifacts are too technical or too route-oriented.

---

## Security And Authorization

V1 is root-only.

Defaults:

- authenticated root session required for normal catalog reads
- governing catalog permissions enforced through root capability checks
- governing capability keys remain canonical access truth within the catalog
- resolved roles remain derived views
- denied access should remain audit visible through existing platform posture

Catalog truth must mirror backend authz, not replace it.

---

## Persistence Direction

V1 should use the approved hybrid posture.

Expected behavior:

- normalization produces a reviewable generated artifact in repo
- the same materialization flow persists database-backed catalog truth
- runtime browse, exact-read, and export capabilities read from persisted
  database-backed truth
- drift audit compares persisted truth to current approved source truth

The generated artifact and database-backed truth must not be allowed to drift
silently.

---

## Compatibility And Lifecycle Notes

- capability ids should remain stable across normal feature evolution
- role composition may change, but governing authz capability keys should
  remain the stable permission identity where possible
- field paths should remain stable enough for frontend binding to depend on
  them, with compatibility planning required before casual churn
- cross-feature public seam cataloging is intentionally deferred from v1
- tenant-context and entity-relationship omission filters are deferred from
  v1 execution, though runtime-context requirements may be declared

---

## Verification Expectations

The first slice should expect:

- unit coverage for normalization, validation extraction, and description
  resolution helpers
- integration coverage for list, exact-read, export, materialization, and
  drift-audit flows
- security coverage for root-only enforcement and denied access
- audit-visible behavior where the current platform posture requires it
- edge coverage for contradictory source artifacts, missing docs, unsupported
  validation shapes, and partial source coverage
- persistence-backed tests for stable ids, field rows, and freshness posture
- compatibility coverage for field-path stability and export-format versioning

No frontend capability-picker or builder UI is required in this first slice.

---

## Maintained Artifact Expectations

Before this slice is considered complete, the expected change loop likely
includes:

- feature-local docs
- API contract docs for the new route family
- permission-mapping updates for the new catalog capabilities
- feature manifest creation and maintenance
- dependency-graph artifact refresh if cross-feature dependencies are added
- PRD-derived test-case doc
- implementation blueprint
- later ADR if the enduring normalization and hybrid persistence model is
  approved

---

## Open Questions

- what exact authority order should govern contradictions between schemas,
  permission mappings, API contract docs, and manifests
- whether materialization and drift audit should be exposed as normal root-only
  routes or support-only internal seams in v1
- where user-facing descriptions should be sourced from when current source
  artifacts lack sufficiently human-friendly wording
- how much validation detail can be normalized safely without creating drift
- whether v1 should persist only current status or also durable history for
  materialization and audit runs
- when non-HTTP cross-feature public seams should join the catalog as a later
  seam family
