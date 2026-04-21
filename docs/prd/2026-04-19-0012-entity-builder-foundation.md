# Entity Builder Foundation Specification

## Purpose

Define the first backend foundation slice for the `entityBuilder` feature.

This slice introduces a durable repo-facing entity-definition seam so the
system can stop depending on ad hoc entity meaning scattered across PRDs,
capability matrices, implementation notes, and the current data dictionary.

It provides the backend capabilities required for:

- create of durable entity-definition lineages and replacement versions
- draft-safe update of entity-definition versions
- exact current-state read by stable `entityKey`
- exact historical read by durable version id
- paginated list of entity-definition lineages
- bounded catalog reads for approved attribute kinds, types, cardinality, and
  form-pattern compatibility
- read-only validation for activation and export readiness
- deterministic derived export for downstream capability-matrix drafting and
  later planning loops

It also establishes:

- stable external identity through `entityKey` and `attributeKey`
- version-by-replacement rather than key renaming
- explicit separation between persisted truth, form-facing truth, and derived
  export truth
- explicit treatment of `attributeKind`, `attributeType`, and
  `valueCardinality` as different concerns
- explicit support for computed attributes without requiring a full expression
  engine
- explicit bounded option support for enum or select-like attributes
- an upstream path for future data-dictionary synchronization

---

## Scope

This phase includes:

- a new `entityBuilder` feature under `src/features/`
- durable storage for:
  - entity-definition lineages
  - entity-definition versions
  - entity attributes
  - attribute validation rules
  - inline attribute options
  - computed attribute source links
- root-only backend routes under `/v1/entity-definitions`
- create of a new entity-definition lineage
- create of a replacement entity-definition version under an existing lineage
- update of draft versions only
- current-state read by `entityKey`
- exact historical read by version id
- paginated lineage listing
- approved attribute-type catalog read
- approved form-pattern catalog read
- read-only version validation
- canonical derived export generated on demand

This phase does **not** include:

- frontend implementation for authoring entity definitions
- unguided form-planning UI
- relationship modeling between entities
- cross-entity computed dependencies
- reusable option-catalog management
- dynamic external option providers
- field grouping or section-layout modeling
- design-system promotion work
- automatic code generation
- first-class `entityBuilder` audit entities
- persisted export snapshots

Those later concerns should build on this durable entity-definition seam rather
than be collapsed into it.

---

## Core Concepts

### Entity-definition lineage

An `entityDefinition` lineage is the stable logical identity for one
repo-facing entity family.

Each lineage is expected to have at least:

- `entityDefinitionId`
- `entityKey`
- `entityName`
- `description`
- optional `currentVersionId`
- lineage lifecycle status
- standard lifecycle timestamps

`entityKey` is the stable external identity and must remain stable across
versions.

### Entity-definition version

An `entityDefinitionVersion` is one immutable version snapshot under a stable
`entityKey`.

Each version is expected to have at least:

- `entityDefinitionVersionId`
- `entityDefinitionId`
- `versionNumber`
- `status`
- optional `supersedesVersionId`
- standard lifecycle timestamps

Version changes happen through replacement rows, not by renaming `entityKey`.

### Stable attribute identity

Each attribute is expected to have a stable external `attributeKey` within the
entity lineage.

`attributeKey` remains stable across versions in the same lineage.
Attribute changes are represented by a new entity-definition version rather
than by key churn.

### Attribute kind versus attribute type

`attributeKind` answers where the value comes from.

Approved v1 kinds:

- `persisted`
- `computed`

`attributeType` answers what kind of value the attribute holds.

Approved v1 types:

- `string`
- `text`
- `boolean`
- `integer`
- `decimal`
- `uuid`
- `email`
- `url`
- `date`
- `datetime`
- `enum`
- `coordinates`

These dimensions must remain separate.
A computed attribute may still be a `date`, `uuid`, or `string`.

### Value cardinality

`valueCardinality` answers whether the attribute permits one or many values.

Approved v1 values:

- `single`
- `multiple`

`multiple` does not imply array-column storage in later implementations.
Downstream persistence should still follow repo storage rules and favor
normalized multi-value storage where searchable behavior matters.

### Form-facing truth

Form-facing truth is part of entity truth when the attribute may surface in a
governed form.

Required or optional form-facing fields:

- `label`
  required
- `description`
  required
- `helpText`
  optional
- `placeholderText`
  optional and meaningful only when `formFacing = true`
- `formFacing`
  required, default `true`
- `defaultFormPatternKey`
  required only when `formFacing = true`

Default form pattern compatibility must validate against:

- `attributeType`
- `valueCardinality`
- `attributeKind` when relevant

### Computed attribute

A computed attribute is an attribute whose value is derived rather than
persisted directly.

Computed attributes in v1 must carry:

- `attributeKind = computed`
- `attributeType`
- `valueCardinality`
- `label`
- `description`
- `derivationNote`
- ordered `sourceAttributeKeys`
- `validationRules`
- `formFacing`
- `defaultFormPatternKey` only when `formFacing = true`

This slice supports computed attributes without introducing a formula or
expression engine.

### Bounded option truth

Enum or select-like attributes may define bounded options in one of two ways:

- inline option rows on the attribute
- reference to a separately maintained options catalog by stable key

This phase supports both reference postures on the attribute contract, but it
does **not** include the feature loop for managing reusable option catalogs.

### Default resolution

Persisted truth stores:

- declared attribute shape
- declared form-facing truth
- explicit validation overrides

Persisted truth does **not** redundantly copy inherited defaults from the type
or pattern catalogs.

Validation, export, and read models resolve effective defaults on demand.
Catalog behavior must remain version-aware enough to keep historical versions
honest.

### Export truth versus persisted truth

Persisted truth is authoritative.

Exported truth is:

- derived
- generated on demand
- canonicalized into one v1 export shape
- versioned with an explicit export-format version

The export must not become a competing durable source of truth in this phase.

---

## Why This Slice Exists Before Later Planning And Data-Dictionary Sync

The repo already needs durable entity meaning for downstream planning, but that
meaning is currently at risk of drifting across:

- capability matrices
- PRDs
- test-case documents
- implementation blueprints
- the current data dictionary

Without this slice:

- later planning loops risk inventing local entity truth
- form-facing field meaning risks drifting from backend entity meaning
- computed and enum semantics remain under-specified
- data-dictionary updates remain downstream-only rather than sourced from one
  durable seam

This slice exists so later planning and documentation work can consume one
durable entity-definition seam instead of recreating entity truth artifact by
artifact.

---

## Feature Name

Recommended feature folder:

`src/features/entityBuilder/`

This feature is separate from:

- future option-catalog management
- future relationship modeling
- future frontend entity-authoring UI
- future code-generation workflows
- the current data-dictionary docs, which will later synchronize from this
  upstream seam rather than replace it

`entityBuilder` owns durable entity-definition truth and exported reads.

Downstream features and artifact-maintenance workflows should consume that
truth through narrow public seams rather than writing entity-definition rows
directly.

---

## Trust Boundary And Privileged Actor

### Trust boundary

This phase establishes a privileged root-operator administrative boundary
around entity-definition truth.

- unauthenticated callers may not access entity-definition routes
- authenticated root users may access these routes only when they hold the
  required entity-builder capability
- the initial granting role is `RootUserAdmin`

This feature does not yet introduce tenant-scoped entity-definition actors.

### Future compatibility direction

Even though the first slice is root-scoped, row semantics and exported seams
should remain compatible with later broader planning or documentation
consumers.

That means this phase should not:

- encode root-only assumptions into durable entity identity
- collapse historical and current lookup into one ambiguous seam
- make downstream artifact-generation loops depend on local root-only quirks

---

## Capability Matrix

Primary matrix:

- [2026-04-19-entity-builder-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-entity-builder-foundation-capability-matrix-first-draft.csv)

This PRD follows that matrix as the capability boundary source for the first
backend slice.

---

## API Endpoints

Protected backend routes:

- `POST /v1/entity-definitions`
- `PATCH /v1/entity-definitions/:entityDefinitionVersionId`
- `GET /v1/entity-definitions/by-key/:entityKey`
- `GET /v1/entity-definitions/versions/:entityDefinitionVersionId`
- `GET /v1/entity-definitions`
- `GET /v1/entity-definitions/catalogs/attribute-types`
- `GET /v1/entity-definitions/catalogs/form-patterns`
- `POST /v1/entity-definitions/versions/:entityDefinitionVersionId/validate`
- `POST /v1/entity-definitions/export`

Current boundary rules:

- all routes require a valid root-user authenticated session
- all routes are restricted to `RootUserAdmin` in the first slice through
  explicit entity-builder capability gates
- all routes should use shared authenticated route protections unless a later
  explicit decision changes that

---

## Authorization Mapping Rules

The governing root authz capabilities for this slice are expected to include:

- `entity-builder.create`
- `entity-builder.update`
- `entity-builder.read`
- `entity-builder.catalog.read`
- `entity-builder.validate`
- `entity-builder.export`

Current root boundary expectations:

- `RootUserAdmin` is the initial granting role for all entity-builder
  capabilities
- current-state read and exact historical read remain separate, not bundled
  into one ambiguous route
- catalog reads remain explicit rather than being hidden inside create or
  validation side effects

This PRD should remain consistent with:

- [backend-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md)
- [role-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/role-to-authz-capability-mapping.md)

---

## Data Rules

- `entityKey` and `attributeKey` must be stable machine identifiers
- `entityKey` and `attributeKey` are immutable after create
- `entityKey` must remain stable across versions
- `attributeKey` must remain stable across versions within one lineage
- empty strings must be rejected, not silently converted to null
- client input must not set system-managed fields, including:
  - internal UUIDs
  - `createdAt`
  - `updatedAt`
  - `activatedAt`
  - `supersededAt`
  - `archivedAt`
  - internal audit metadata
- requests that supply unexpected or system-managed fields should be rejected
  explicitly with the repo-standard invalid-request error contract
- activation requires at least one attribute in the version
- activation requires every attribute to satisfy its required truth fields
- active automatically means exportable in this phase
- computed attributes may depend only on attributes in the same entity version
  in v1
- current-state reads and exact historical reads must remain separate
- historical exact reads and explicit historical export must remain available
  for superseded or archived versions
- `helpText` and `placeholderText` belong in the canonical export shape when
  present
- representative invalid-request, not-found, authz, compatibility, and catalog
  mismatch errors must return stable `code`, `message`, and relevant `details`

---

## Activation And Export Rules

- a version may activate only if it passes validation
- activation requires:
  - at least one attribute
  - complete required attribute truth
  - valid bounded catalog usage
  - valid computed dependencies
  - valid option posture
  - compatible form-pattern selection
- in this phase, `active` automatically means exportable
- default export scope returns active versions only
- explicit historical export may target superseded or archived versions by
  exact version selection

---

## Persistence Expectations

This slice should introduce durable storage for at least:

- entity-definition lineages
- entity-definition versions
- entity attributes
- attribute validation rules
- inline attribute options
- computed source links

The storage model must preserve:

- stable lineage identity
- stable version identity
- stable attribute identity within a lineage
- immutable version semantics
- explicit distinction between kind, type, and cardinality
- explicit form-facing truth
- explicit computed dependencies
- explicit bounded option truth
- room for later support of:
  - relationship modeling
  - reusable option-catalog management
  - richer form-layout modeling
  - broader downstream documentation and generation consumers

Recommended persistence behavior in this phase:

- unique index on `entityKey`
- unique version numbering per lineage
- one active version per lineage
- unique attribute keys per version
- deterministic display ordering for attributes, rules, options, and source
  links
- indexes supporting current-state read, exact historical read, list, and
  export selection

---

## Catalog Expectations

This slice requires explicit catalog truth for:

- approved `attributeKind`
- approved `attributeType`
- approved `valueCardinality`
- approved validation-rule keys
- approved form-pattern keys
- compatibility metadata between form patterns and attribute shape

Default pattern expectations locked for this phase:

- single-value enum defaults to `simple-select.single`
- multi-value enum defaults to `drawer-select.multi-select`

Coordinates expectations locked for this phase:

- `coordinates` represents one logical coordinate pair
- the exact wire or storage shape can be refined in implementation, but the PRD
  treats it as one logical value rather than two unrelated decimals

---

## Security And Audit Expectations

This slice manages privileged platform planning truth.

Minimum expectations:

- shared root authentication must run before entity-builder routes
- shared root authorization must enforce explicit entity-builder capabilities
- create, update, validate, and export operations should be audit-visible
  through the platform’s existing audit-capable mechanisms
- denied attempts against privileged routes should be audit-visible where the
  platform treats them as security-relevant
- this phase does not require a dedicated feature-owned audit entity family

---

## Performance Expectations

This phase should include basic performance-safe structure rather than waiting
for later optimization.

Minimum expectations:

- deterministic ordering for attributes, rules, options, and computed-source
  links
- indexed current-state and exact historical reads
- indexed lifecycle and updated-time filters for list and export selection
- deterministic export generation for one or more selected versions
- validation that resolves effective defaults without requiring table scans

This phase does **not** need to include:

- persisted export snapshots
- materialized read models
- advanced denormalized planner projections

Those later optimizations can be layered in if real usage shows the need.

---

## Cross-Feature Rules

`entityBuilder` may depend on shared root auth and root authorization only
through approved platform seams.

Downstream planning, PRD, blueprint, and data-dictionary maintenance workflows
should consume entity truth only through exported `entityBuilder` reads or
derived export seams rather than maintaining separate local entity catalogs.

No downstream feature should mutate entity-definition rows except through
explicit `entityBuilder` capabilities.

Future data-dictionary maintenance should converge on this feature as upstream
truth rather than leaving the Markdown dictionary as the long-term source of
truth.

---

## Compatibility And Migration Direction

This slice must stay compatible with:

- the repo default of backwards compatibility
- the source-independent entity-definition artifacts under
  `docs/workspace/entity-definitions/`
- later capability-matrix drafting and PRD refinement loops
- later implementation-blueprint and test-case generation loops
- future data-dictionary synchronization from upstream entity truth

This slice must **not**:

- encode versioning into `entityKey` or `attributeKey`
- silently mutate active versions in place
- collapse computed attributes into the same contract as persisted attributes
  without explicit kind metadata
- treat `multiple` cardinality as permission for vague blob storage
- allow ad hoc form-pattern names outside the approved catalog
- allow exploratory design-system seams to become durable defaults silently

---

## Acceptance Criteria

This phase is complete when all of the following are true:

1. the backend supports the documented protected
   `/v1/entity-definitions` routes
2. entity-definition truth is stored as durable lineages plus immutable version
   rows
3. stable `entityKey` and `attributeKey` identity is preserved across versions
4. `attributeKind`, `attributeType`, and `valueCardinality` are modeled as
   separate dimensions
5. form-facing truth includes required `label` and `description`, optional
   `helpText`, optional `placeholderText`, explicit `formFacing`, and
   `defaultFormPatternKey` only when form-facing
6. computed attributes support `derivationNote` plus ordered
   `sourceAttributeKeys`
7. activation requires at least one attribute and complete required attribute
   truth
8. active versions are automatically exportable
9. the feature supports both current-state lookup by `entityKey` and exact
   historical lookup by version id
10. exports are generated on demand and clearly separated from persisted truth
11. the canonical export shape includes an explicit export-format version
12. `helpText` and `placeholderText` are included in the canonical export shape
    when present
13. single-value enum defaults align with `simple-select.single`
14. multi-value enum defaults align with `drawer-select.multi-select`
15. shared root-session auth and capability gates protect the feature routes

---

## Risks And Open Questions

- whether catalog versioning should be persisted as feature-owned records or
  resolved through another shared platform seam in implementation
- how soon reusable option-catalog management needs its own feature loop after
  v1 adoption begins
- whether some computed-attribute validation rules should remain mandatory when
  the value is never form-facing
- whether `coordinates` should eventually gain a richer governed form pattern
  once a design-system seam exists

---

## Deferred Follow-On Work

This PRD intentionally defers:

- relationship modeling between entities
- cross-entity computed dependencies
- reusable option-catalog management
- dynamic external option providers
- field grouping and section-layout modeling
- frontend entity-definition authoring UI
- automatic code generation
- dedicated feature-owned audit entities
- persisted export snapshots

These should be future feature loops built on top of this durable
entity-definition foundation rather than reasons to overbuild the first slice.
