# ADR-0021: Add A Versioned Entity-Definition Foundation With Derived Export Seams

- Status: Accepted
- Date: 2026-04-19
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The repo increasingly needs one durable source of truth for entity meaning that
later planning and implementation loops can consume.

Today that truth is at risk of drifting across:

- capability matrices
- PRDs
- test-case documents
- implementation blueprints
- the current Markdown data dictionary

At the same time, the platform has a few specific needs that simple schema
storage does not cover cleanly:

- stable repo-facing entity identity
- stable repo-facing attribute identity
- explicit field meaning and validation rules
- governed form-facing truth for attributes that may appear in forms
- support for computed attributes
- support for bounded option sets
- a clean path for downstream export into planning and documentation workflows
- historical reconstruction without key churn

If the platform treats entity definitions as one loose metadata blob, or lets
every downstream artifact keep its own local truth, the result will be hidden
drift and hard-to-audit planning state.

The architecture therefore needs a durable entity-definition foundation that is
small enough to ship as a backend-first feature, but structured well enough
that later option-catalog, relationship, form-planning, and data-dictionary
work can build on it without redesigning the core identity model.

## Decision

Add a new feature:

`src/features/entityBuilder/`

The feature owns durable repo-facing entity-definition truth.

Current rules:

- entity definitions are modeled as stable lineages plus immutable versions
- `entityKey` is the stable external identity for an entity lineage and remains
  stable across versions
- `attributeKey` is the stable external identity for an attribute within an
  entity lineage and remains stable across versions
- internal durable record identity uses UUIDs; external stable identity uses
  `entityKey` and `attributeKey`
- version changes happen through replacement rows, not key renaming
- the foundation persists:
  - entity-definition lineages
  - entity-definition versions
  - version-owned attributes
  - version-owned validation rules
  - inline bounded options
  - computed source links
- attribute modeling must keep these dimensions separate:
  - `attributeKind`
  - `attributeType`
  - `valueCardinality`
- approved v1 `attributeKind` values are:
  - `persisted`
  - `computed`
- approved v1 `attributeType` values are:
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
- approved v1 `valueCardinality` values are:
  - `single`
  - `multiple`
- form-facing truth is part of durable attribute truth when an attribute may
  surface in a governed form
- v1 form-facing truth includes:
  - required `label`
  - required `description`
  - optional `helpText`
  - optional `placeholderText`
  - required `formFacing`
  - required `defaultFormPatternKey` only when `formFacing = true`
- default form-pattern compatibility must validate against:
  - `attributeType`
  - `valueCardinality`
  - `attributeKind` when relevant
- computed attributes are first-class and must carry:
  - `derivationNote`
  - ordered `sourceAttributeKeys`
- computed attributes in v1 may depend only on attributes in the same entity
  version
- bounded option truth may be represented by:
  - inline option rows on the attribute
  - reference to a separately maintained options catalog by stable key
- reusable option-catalog management is intentionally deferred from the first
  slice
- defaults remain implicit in persisted truth rather than being copied
  redundantly onto every stored attribute row
- validation, read, and export models resolve effective defaults through
  version-aware catalogs
- derived export is a separate seam from persisted truth
- export is:
  - canonicalized into one v1 shape
  - explicitly versioned with an export-format version
  - generated on demand
  - not stored as a competing durable truth record in v1
- current-state lookup by `entityKey` and exact historical lookup by version id
  are both required
- default export scope returns active versions only
- superseded or archived versions remain explicitly exportable for historical
  reconstruction
- the feature is root-only in v1
- first-class `entityBuilder` audit entities are intentionally deferred, but
  create, update, validate, and export actions must remain audit-visible
  through existing platform mechanisms
- entity relationships, cross-entity computed dependencies, field grouping, and
  richer form-layout truth are intentionally deferred
- the long-term direction is for implemented `entityBuilder` truth to become
  upstream for data-dictionary synchronization rather than leaving the Markdown
  data dictionary as the long-term primary source of entity truth

## Consequences

### Positive

- the platform gets one durable repo-facing entity-definition seam instead of
  many local planning copies
- stable keys and immutable version rows allow current-state lookup and honest
  historical reconstruction at the same time
- form-facing attribute truth becomes durable and governed instead of
  downstream-only UI metadata
- computed attributes and bounded option semantics are explicit from the first
  slice
- downstream planning, export, and documentation loops can consume one explicit
  source of truth
- the data-dictionary can later converge on this feature as upstream truth

### Negative

- the first slice introduces more durable-model plumbing than a simple schema
  registry or metadata blob
- catalog-driven default resolution and historical honesty require deliberate
  version-aware behavior
- the architecture must carry a split between stored truth and derived export
  truth rather than one simplified read model
- later reusable option-catalog and relationship work is deferred, which means
  some natural extensions are intentionally incomplete in the first slice

### Neutral / Follow-up

- later work should define:
  - reusable option-catalog management
  - relationship modeling between entities
  - cross-entity computed dependencies
  - richer field grouping and section-layout modeling
  - frontend entity-definition authoring surfaces
  - dedicated audit entities if the shared platform posture becomes
    insufficient
  - final data-dictionary synchronization behavior once the feature is
    implemented
- if a shared platform seam already exists or later emerges for version-aware
  default resolution, the feature may consume it behind feature-owned domain
  helpers rather than duplicating catalog-resolution logic in multiple places
- if later work concludes that export snapshots must become durable frozen
  artifacts, that should be an additive evolution rather than a replacement for
  the current persisted-truth model
