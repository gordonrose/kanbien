# Entity Builder Feature Reference

## Purpose

The `entityBuilder` feature owns durable repo-facing entity-definition truth.

Today it ships the backend foundation for:

- root-managed create of entity-definition lineages and replacement versions
- draft-only update of entity-definition versions
- current read by stable `entityKey`
- exact historical read by version id
- bounded catalog reads for approved attribute types and form patterns
- read-only validation for activation and export readiness
- canonical on-demand export for downstream planning artifacts and future
  data-dictionary synchronization

This feature does not yet ship frontend authoring UI, relationship modeling,
reusable option-catalog management, field grouping, or code generation.

## Where It Lives

- `src/features/entityBuilder/contract`
- `src/features/entityBuilder/domain`
- `src/features/entityBuilder/persistence`
- `src/features/entityBuilder/transport`
- `src/features/entityBuilder/integration.ts`
- `src/features/entityBuilder/index.ts`

## Platform Integration

Feature export:

- `createEntityBuilderFeature`

Current mount point:

- `src/routes/v1/index.ts`
- base route: `/v1/entity-definitions`

Protected routes are mounted behind:

- shared root-session authentication
- shared root capability enforcement
- shared platform-security audit visibility for denied capability checks

## Runtime Contracts

### Feature factory

The feature entry point expects:

- raw `pg` `Pool`
- a `RootCapabilityChecker`
- shared platform-security repository for denial audit visibility

`integration.ts` owns repository and service wiring.
`transport/router.ts` owns request parsing and authz composition.
The domain service owns lifecycle rules, catalog-driven validation, and export
composition.

### Cross-feature seams

`entityBuilder` currently depends only on shared platform seams:

- shared root-session authentication
- shared root capability middleware
- shared platform-security audit repository

It does not import persistence from other features directly.

Downstream consumers are expected to read through exported `entityBuilder`
seams rather than maintaining parallel entity-truth stores.

## Relationship To Root Roles

`entityBuilder` does not own authorization policy.
It depends on these capability keys in the root capability catalog:

- `entity-builder.create`
- `entity-builder.update`
- `entity-builder.read`
- `entity-builder.catalog.read`
- `entity-builder.validate`
- `entity-builder.export`

## API Surface

Base path:

- `/v1/entity-definitions`

Routes:

- `POST /v1/entity-definitions`
- `PATCH /v1/entity-definitions/:entityDefinitionVersionId`
- `GET /v1/entity-definitions/by-key/:entityKey`
- `GET /v1/entity-definitions/versions/:entityDefinitionVersionId`
- `GET /v1/entity-definitions`
- `GET /v1/entity-definitions/catalogs/attribute-types`
- `GET /v1/entity-definitions/catalogs/form-patterns`
- `POST /v1/entity-definitions/versions/:entityDefinitionVersionId/validate`
- `POST /v1/entity-definitions/export`

## Request Semantics

### Create

`POST /v1/entity-definitions`

Rules:

- accepts stable lineage identity through `entityKey`
- creates a new lineage when the key is new
- creates a replacement version when the key already exists
- clients may not supply system-managed ids or timestamps
- requested `active` versions are validated before promotion
- active means exportable when validation passes

### Draft update

`PATCH /v1/entity-definitions/:entityDefinitionVersionId`

Rules:

- only draft versions may be updated
- exact version id is required
- stable keys remain durable identity rather than updateable content
- updating a draft version does not mutate an already active historical version

### Read and export

Rules:

- current read resolves by stable `entityKey`
- exact historical read resolves by durable version id
- list follows repo pagination defaults
- export is generated on demand rather than persisted as a competing truth

## Persistence Model

The feature owns these durable tables:

- `entity_definition`
- `entity_definition_version`
- `entity_definition_attribute`
- `entity_definition_attribute_validation_rule`
- `entity_definition_attribute_option`
- `entity_definition_attribute_source_link`

The foundation keeps:

- stable lineage identity through `entityKey`
- stable attribute identity through `attributeKey`
- immutable version snapshots
- explicit separation of `attributeKind`, `attributeType`, and
  `valueCardinality`
- form-facing truth on the attribute itself

## Validation And Lifecycle Rules

- every activation-ready version must contain at least one attribute
- every attribute must declare:
  - `label`
  - `description`
  - `attributeKind`
  - `attributeType`
  - `valueCardinality`
  - explicit validation rules
- `defaultFormPatternKey` is required only when `formFacing = true`
- computed attributes require:
  - `derivationNote`
  - ordered `sourceAttributeKeys`
- form-pattern compatibility validates against:
  - attribute kind
  - attribute type
  - value cardinality
- enum attributes require either inline options or a catalog reference posture

## Export Semantics

- export shape is canonical and includes `exportFormatVersion = 1`
- `helpText` and `placeholderText` are preserved in export
- effective defaults are derived at export time rather than persisted back onto
  the stored attribute rows
- default export scope returns active versions
- explicit historical export can return superseded or archived versions by
  exact version selection

## Verification Status

Current executable evidence for this feature includes:

- unit service coverage:
  `tests/unit/entityBuilder/service.test.ts`
- protected route integration coverage:
  `tests/integration/entityBuilder/flow.test.ts`
- root-only security coverage:
  `tests/security/entityBuilder/security.test.ts`
- audit visibility coverage:
  `tests/audit/entityBuilder/audit.test.ts`
- Postgres-backed repository coverage:
  `tests/integration/entityBuilder/persistence.test.ts`

## Notes

- This feature is intended to become an upstream source for the repo data
  dictionary rather than another downstream consumer forever.
- Reusable option-catalog management, relationship modeling, and cross-entity
  computed dependencies remain future loops.
