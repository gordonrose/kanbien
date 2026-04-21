# Entity Builder Foundation Implementation Blueprint

## Summary

- Feature:
  `entityBuilder`
- Capability:
  root-managed durable entity-definition lineages and versions with explicit
  attribute truth, bounded catalogs, read-only validation, and on-demand
  derived export
- Scope:
  backend feature slice only
- Phase:
  pre-implementation blueprint

## Inputs

- Capability matrix reference:
  [2026-04-19-entity-builder-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-entity-builder-foundation-capability-matrix-first-draft.csv)
- Capability notes:
  [2026-04-19-entity-builder-foundation-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-entity-builder-foundation-capability-matrix-first-draft-notes.md)
- Source-independent entity-definition layer:
  [entity-builder-core-entity-model-first-draft.md](/home/gordon/kanbien/docs/workspace/entity-definitions/entity-builder-core-entity-model-first-draft.md)
- Approved form-pattern catalog:
  [approved-form-pattern-catalog.md](/home/gordon/kanbien/docs/workspace/entity-definitions/approved-form-pattern-catalog.md)
- PRD:
  [2026-04-19-0012-entity-builder-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-19-0012-entity-builder-foundation.md)
- PRD test-case doc:
  [2026-04-19-0012-entity-builder-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-19-0012-entity-builder-foundation-test-cases.md)

## QA Coverage Classification

- Coverage matrix guide:
  [qa-coverage-matrix-guide.md](/home/gordon/kanbien/docs/architecture/guides/qa-coverage-matrix-guide.md)
- QA release gate:
  [QA-RELEASE-GATE.md](/home/gordon/kanbien/docs/standards/QA-RELEASE-GATE.md)
- Change-class classification:
  - privileged root-operated backend feature
  - persistence schema and durable workflow change
  - compatibility-sensitive source-of-truth and export seam
  - catalog-driven validation and authorization-gated route family
- Required layers from the matrix:
  - unit
  - integration
  - security
  - audit
  - persistence-backed verification
- Additional required checks:
  - migration safety review
  - standards-oriented route and artifact honesty review
  - traceability-ready `TC-*` test naming once executable tests land
- Current non-functional posture for this slice:
  - performance:
    structure- and regression-oriented, not SLA-driven in this foundation
  - resilience/failure-injection:
    secondary in v1; revisit if catalog resolution depends on external shared
    seams
  - concurrency/idempotency:
    important for version creation, active-version uniqueness, and export
    determinism
  - compatibility/contract:
    high priority because this slice becomes upstream repo entity truth

## Scope Confirmation

This blueprint is for one coherent backend slice:

- add a new `entityBuilder` feature under `src/features/entityBuilder/`
- persist durable entity-definition lineages
- persist immutable entity-definition versions
- persist version-owned attributes
- persist version-owned validation rules
- persist inline bounded options
- persist computed-attribute source links
- provide protected root-only routes for:
  - create lineage or replacement version
  - update draft version
  - current read by `entityKey`
  - exact read by version id
  - paginated lineage list
  - approved attribute-type catalog read
  - approved form-pattern catalog read
  - exact validation by version id
  - canonical export
- keep active meaning automatically exportable once validation passes
- keep exports generated on demand rather than stored as durable snapshots
- establish public read and export seams for downstream planning and
  data-dictionary synchronization

This blueprint does **not** include:

- frontend entity-definition authoring UI
- reusable option-catalog management
- relationship modeling between entities
- cross-entity computed dependencies
- field grouping or section-layout modeling
- code generation
- dedicated feature-owned audit entities
- persisted export snapshots

## Frontend Plan

- Route / surface:
  no frontend implementation in this slice
- UI states to support later:
  - draft version create
  - draft version update
  - current read
  - exact historical read
  - validation issues review
  - export-ready state
- Permission visibility behavior:
  later root-admin UI may expose these routes only to actors granted the
  governing `entity-builder.*` capabilities
- Session / expiry behavior:
  all routes rely on the existing root authenticated session model from
  `rootAuth`
- Browser security considerations:
  API-only in this phase; no browser-shell work is required

## Backend Plan

- Protected route(s):
  - `POST /v1/entity-definitions`
  - `PATCH /v1/entity-definitions/:entityDefinitionVersionId`
  - `GET /v1/entity-definitions/by-key/:entityKey`
  - `GET /v1/entity-definitions/versions/:entityDefinitionVersionId`
  - `GET /v1/entity-definitions`
  - `GET /v1/entity-definitions/catalogs/attribute-types`
  - `GET /v1/entity-definitions/catalogs/form-patterns`
  - `POST /v1/entity-definitions/versions/:entityDefinitionVersionId/validate`
  - `POST /v1/entity-definitions/export`
- Request/response/error contract:
  - create accepts:
    - lineage metadata for new lineages or stable `entityKey` reference for
      replacement version create
    - ordered attribute aggregate with:
      - `attributeKey`
      - `attributeKind`
      - `attributeType`
      - `valueCardinality`
      - `label`
      - `description`
      - optional `helpText`
      - optional `placeholderText`
      - `formFacing`
      - optional `defaultFormPatternKey`
      - ordered validation rules with typed arguments
      - optional inline options or options-catalog reference
      - computed metadata when relevant
  - update accepts:
    - exact version id plus draft-safe changes only
  - current read returns:
    - lineage plus current active version detail
  - exact read returns:
    - lineage plus requested version detail
  - list returns:
    - paginated lineage and current-version summary rows using repo pagination
      defaults
  - catalog reads return:
    - approved bounded values and compatibility metadata
  - validation returns:
    - `passFailState`
    - blocking issues
    - warnings
    - activation eligibility
    - export eligibility
  - export returns:
    - one canonical derived export shape with explicit export-format version
  - use repo-standard authz and validation error shape with stable
    feature-owned codes such as:
    - `ENTITY_DEFINITION_NOT_FOUND`
    - `ENTITY_DEFINITION_VERSION_NOT_FOUND`
    - `ENTITY_DEFINITION_DUPLICATE_KEY`
    - `ENTITY_DEFINITION_VERSION_CONFLICT`
    - `ENTITY_ATTRIBUTE_DUPLICATE_KEY`
    - `ENTITY_ATTRIBUTE_INVALID_KIND`
    - `ENTITY_ATTRIBUTE_INVALID_TYPE`
    - `ENTITY_ATTRIBUTE_INVALID_CARDINALITY`
    - `ENTITY_ATTRIBUTE_FORM_PATTERN_INCOMPATIBLE`
    - `ENTITY_ATTRIBUTE_COMPUTED_SOURCE_INVALID`
    - `ENTITY_ATTRIBUTE_OPTIONS_INVALID`
    - `ENTITY_DEFINITION_VERSION_NOT_DRAFT`
    - `ENTITY_DEFINITION_VALIDATION_FAILED`
- Feature-local files expected:
  - `src/features/entityBuilder/index.ts`
  - `src/features/entityBuilder/integration.ts`
  - `src/features/entityBuilder/README.md`
  - `src/features/entityBuilder/contract/errors.ts`
  - `src/features/entityBuilder/contract/schemas.ts`
  - `src/features/entityBuilder/contract/types.ts`
  - capability-focused domain files, likely:
    - `createEntityDefinitionVersion.ts`
    - `updateDraftEntityDefinitionVersion.ts`
    - `getEntityDefinitionCurrent.ts`
    - `getEntityDefinitionVersion.ts`
    - `listEntityDefinitions.ts`
    - `listAttributeTypeCatalog.ts`
    - `listApprovedFormPatterns.ts`
    - `validateEntityDefinitionVersion.ts`
    - `exportEntityDefinitionSnapshot.ts`
  - `src/features/entityBuilder/domain/catalogs.ts`
  - `src/features/entityBuilder/domain/defaultResolution.ts`
  - `src/features/entityBuilder/domain/presenters.ts`
  - `src/features/entityBuilder/domain/types.ts`
  - `src/features/entityBuilder/domain/service.ts`
  - `src/features/entityBuilder/persistence/types.ts`
  - `src/features/entityBuilder/persistence/repository.ts`
  - `src/features/entityBuilder/persistence/postgresRepository.ts`
  - `src/features/entityBuilder/persistence/migrations/0013_create_entity_builder_foundation.sql`
  - `src/features/entityBuilder/transport/router.ts`
- Cross-feature seams:
  - existing `requireRootSession` seam for protected routes
  - existing `createRequireRootCapability(...)` seam for route protection
  - existing root-auth request-context seam for actor attribution
  - root-role capability catalog and default grant seeding through the
    established `rootRoles` migration and catalog path
  - do not import private persistence from other features
- Authorization enforcement point:
  central route and service-boundary enforcement using shared root capability
  middleware plus feature-local lifecycle and catalog validation

## Repo File Layout Plan

- add a mounted feature under `src/features/entityBuilder/`
- follow the same feature shape used by `tenants`, `tenantAuth`, and
  `tenantConfiguration`
- keep `integration.ts` responsible for composing:
  - Postgres repository
  - catalog/default-resolution dependencies
  - domain service
  - transport router
- export a narrow public seam from `src/features/entityBuilder/index.ts` for:
  - current read by `entityKey`
  - exact read by version id
  - canonical export
- keep catalog resolution explicit:
  - if implementation uses a shared platform seam for version-aware default
    resolution, isolate it behind feature-local domain helpers
  - do not smear catalog logic into route handlers

## Integration Wiring Plan

- extend
  [index.ts](/home/gordon/kanbien/src/routes/v1/index.ts)
  to mount `createEntityBuilderFeature(...)` under `/v1/entity-definitions`
- extend the root capability catalog in
  [capabilityCatalog.ts](/home/gordon/kanbien/src/features/rootRoles/domain/capabilityCatalog.ts)
  with at least:
  - `entity-builder.create`
  - `entity-builder.update`
  - `entity-builder.read`
  - `entity-builder.catalog.read`
  - `entity-builder.validate`
  - `entity-builder.export`
- treat `RootUserAdmin` as the initial granting role
- add migration-backed default role grants for those capabilities so live
  environments stay aligned with the route contract
- update permission-mapping artifacts in:
  - [backend-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md)
  - [role-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/role-to-authz-capability-mapping.md)
- route classification recommendation:
  - all routes should remain protected behind existing authenticated root-route
    posture
  - create, update, validate, and export should use the shared
    `authenticated-sensitive` protected-route posture

## Persistence Plan

- Entities / rows affected:
  - new durable `entity_definition` lineage table
  - new durable `entity_definition_version` table
  - new durable `entity_definition_attribute` table
  - new durable `entity_definition_attribute_validation_rule` table
  - new durable `entity_definition_attribute_option` table
  - new durable `entity_definition_attribute_source_link` table
- Durable lineage fields expected:
  - `entity_definition_id` UUID primary key
  - `entity_key`
  - `entity_name`
  - `description`
  - `current_version_id` nullable
  - `status`
  - `created_at`
  - `updated_at`
  - `archived_at` nullable
- Durable version fields expected:
  - `entity_definition_version_id` UUID primary key
  - `entity_definition_id` foreign key
  - `version_number`
  - `status`
  - `supersedes_version_id` nullable
  - `created_at`
  - `updated_at`
  - `activated_at` nullable
  - `superseded_at` nullable
  - `archived_at` nullable
- Durable attribute fields expected:
  - `entity_definition_attribute_id` UUID primary key
  - `entity_definition_version_id` foreign key
  - `attribute_key`
  - `attribute_kind`
  - `attribute_type`
  - `value_cardinality`
  - `label`
  - `description`
  - `help_text` nullable
  - `placeholder_text` nullable
  - `form_facing`
  - `default_form_pattern_key` nullable
  - `options_mode`
  - `options_catalog_key` nullable
  - `derivation_note` nullable
  - `display_order`
  - `created_at`
  - `updated_at`
- Durable validation-rule fields expected:
  - `entity_definition_attribute_validation_rule_id` UUID primary key
  - `entity_definition_attribute_id` foreign key
  - `rule_key`
  - `rule_argument_type`
  - typed argument columns
  - `error_message` nullable
  - `display_order`
  - `created_at`
  - `updated_at`
- Durable inline-option fields expected:
  - `entity_definition_attribute_option_id` UUID primary key
  - `entity_definition_attribute_id` foreign key
  - `option_key`
  - `label`
  - `description` nullable
  - `display_order`
  - `created_at`
  - `updated_at`
- Durable source-link fields expected:
  - `entity_definition_attribute_source_link_id` UUID primary key
  - `entity_definition_attribute_id` foreign key
  - `source_attribute_key`
  - `display_order`
- Migration changes:
  - create the six durable tables above
  - enforce stable uniqueness on `entity_key`
  - enforce unique version numbering per lineage
  - enforce one active version per lineage
  - enforce unique attribute keys and display order within a version
  - enforce unique rule, option, and source-link ordering per attribute
  - add check constraints for:
    - `attribute_kind`
    - `attribute_type`
    - `value_cardinality`
    - `options_mode`
    - form-facing / default-pattern consistency
    - computed / derivation-note consistency
    - typed-rule-argument consistency
  - add indexes supporting:
    - current read
    - exact read
    - list
    - validation
    - export selection

## Domain Plan

- Domain types should model three distinct layers:
  - stored truth
  - effective/resolved truth for validation and export
  - export truth
- `domain/catalogs.ts` should own the bounded v1 catalogs for:
  - `attributeKind`
  - `attributeType`
  - `valueCardinality`
  - validation-rule keys
- `domain/defaultResolution.ts` should resolve effective defaults without
  mutating stored rows
- create and update domain capabilities should:
  - normalize `entityKey` and `attributeKey`
  - reject system-managed fields
  - enforce stable key immutability
  - validate computed-source-link rules
  - validate option posture rules
  - validate form-pattern compatibility
- validation capability should:
  - remain read-only
  - report blocking issues and warnings
  - determine activation and export eligibility
- export capability should:
  - remain on-demand
  - produce one canonical export shape
  - include export-format version
  - include `helpText` and `placeholderText` when present
  - resolve effective defaults through the applicable catalog posture

## Contract Plan

- `contract/schemas.ts` should define exact request schemas for:
  - create lineage or replacement version
  - draft update
  - list query params
  - exact params by `entityKey`
  - exact params by version id
  - validation route params
  - export selection request
- `contract/types.ts` should keep stored and export response shapes separate
- `contract/errors.ts` should define stable feature-owned errors for:
  - duplicate keys
  - non-draft update attempts
  - invalid kind, type, cardinality, or rule key
  - incompatible form pattern
  - invalid computed source link
  - invalid options posture
  - validation failure or export ineligibility

## Test Plan

- Unit tests:
  - `tests/unit/entityBuilder/`
  - cover the `TC-ENTITY-BUILDER-UNIT-*` cases from the test-case doc
- Integration tests:
  - `tests/integration/entityBuilder/`
  - cover route protection, create/update/read flows, validation/export
    alignment, catalog alignment, historical export, and concurrency-sensitive
    version behavior
- Security tests:
  - `tests/security/entityBuilder/`
  - cover deny paths, system-managed field rejection, and unauthorized access
- Audit tests:
  - `tests/audit/entityBuilder/`
  - cover audit-visible create, update, validate/export-related actions under
    the platform’s existing audit posture
- Persistence-backed posture:
  - implementation should review shared Postgres harness files and align test
    helpers with manifest tracking where durable data is created
- Traceability:
  - executable tests should include the planned `TC-ENTITY-BUILDER-*` ids once
    implementation begins

## Standards And Artifact Plan

- Source-independent artifacts already created and must stay aligned:
  - [entity-builder-core-entity-model-first-draft.md](/home/gordon/kanbien/docs/workspace/entity-definitions/entity-builder-core-entity-model-first-draft.md)
  - [approved-form-pattern-catalog.md](/home/gordon/kanbien/docs/workspace/entity-definitions/approved-form-pattern-catalog.md)
  - [2026-04-19-entity-builder-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-entity-builder-foundation-capability-matrix-first-draft.csv)
  - [2026-04-19-0012-entity-builder-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-19-0012-entity-builder-foundation.md)
  - [2026-04-19-0012-entity-builder-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-19-0012-entity-builder-foundation-test-cases.md)
- Additional docs expected once implementation lands:
  - `docs/data-dictionary/` entries for implemented durable entities
  - `docs/data-dictionary/index.md`
  - `docs/featureDocs/` entry for `entityBuilder`
  - `docs/swagger/openapi.yaml`
  - `docs/postman/` if a maintained collection exists for these routes
  - permission-mapping docs
  - standards status snapshots if this slice materially changes platform-truth
    or standards posture
- ADR expectation:
  - add or update an ADR for the enduring versioned entity-truth and export
    seam before or alongside implementation
- Maintained-artifacts sweep expectation:
  - once implementation exists, earlier planning artifacts and the current
    data-dictionary posture should be reviewed for stale “downstream-only”
    wording

## Sequencing Plan

1. Add capability catalog keys and default role-grant migration planning.
2. Implement persistence types, repository seam, and migration.
3. Implement domain catalogs and default-resolution helpers.
4. Implement create/update/read/list capabilities.
5. Implement validation capability.
6. Implement export capability.
7. Wire transport router and mount the feature in `/v1`.
8. Add unit, integration, security, audit, and persistence-backed tests.
9. Refresh source-independent docs and downstream documentation artifacts.

## Gaps Or Blockers To Keep Explicit

- if version-aware default resolution depends on an existing shared platform
  seam, implementation should verify that seam before finalizing the feature
  contract
- reusable option-catalog management is out of scope here, so implementation
  should validate reference posture without inventing full catalog CRUD
- relationship modeling is out of scope here, so the migration and domain model
  should leave room for later extension without pretending to solve it now
- no frontend surface exists yet, so any app UI assumptions should be kept out
  of the backend implementation
