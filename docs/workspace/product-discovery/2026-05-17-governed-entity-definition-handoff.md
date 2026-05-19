# Governed Entity Definition Handoff

Status:

- `handoff_ready`
- Date: 2026-05-17
- Scope: entity-definition structure workstream
- Implementation status: not started
- Runtime/code changes: none

## What We Completed

The entity-definition structure workstream has reached a draft v1 canonical
model ready for schema formalization and future governed planning.

Primary artifacts:

- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-model.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-attribute-reference.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-example.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-schema-formalization.md`
- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-creation-and-maintenance.md`
- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-starter-default-catalog.md`
- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-page-materialization.md`
- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-access-and-promotion.md`
- `docs/workspace/capability-matrices/2026-05-18-governed-entity-creation-capability-matrix-first-draft.csv`
- `docs/workspace/capability-matrices/2026-05-18-governed-entity-creation-capability-matrix-first-draft-notes.md`

## Locked Direction

The governed entity-definition model decided in this discovery stream
supersedes the narrower current `entityBuilder` shape as the intended target
model.

Current `entityBuilder` remains important as:

- compatibility source
- migration evidence
- current route/persistence/export behavior
- implementation planning input

It should not constrain the canonical target where the new model is more
complete.

## Required Top-Level Sections

Every canonical entity definition should include:

- `entityIdentity`
- `sourceAuthority`
- `evidenceRegistry`
- `attributes`
- `presentationGroups`
- `operationalStatusSet`
- `relationships`
- `searchModel`
- `surfaceModel`
- `actionModel`
- `complianceModel`
- `generationModel`
- `migrationModel`

Sections should be explicit even when populated with `none`,
`not_applicable`, defaults, or empty arrays.

## Key Decisions

| Area | Decision |
| --- | --- |
| Casing | JSON property names use lowerCamel; stable keys and catalog values use snake_case. |
| Current `attributeKind` | Not canonical. Existing `persisted`/`computed` values map into richer fields. |
| Attribute model | Use semantic category, attribute type, cardinality, system-managed posture, mutability, validation, options, search, placements, privacy/security, source metadata, and evidence. |
| Enum migration | Existing `enum` maps to `limited_enum` by default; use `expanded_enum` when evidence supports larger/searchable choices. |
| Options mode migration | Existing `none`, `inline`, and `catalog_reference` map directly; `relationship_source` is additive. |
| Display order migration | Existing global attribute order maps into default placement order. Future order lives on placements. |
| Validation messages | Existing literal messages become fallback copy; canonical validation uses message keys plus fallback messages. |
| Export/read shape | Full canonical model needs a new explicit export/read shape, likely export v2. Do not silently change export v1. |
| Status separation | Definition-version status is separate from managed-record system lifecycle. |
| Surface placement keys | `surfaceKey`, `surfaceVariantKey`, `regionKey`, and `elementKey` are template-scoped governed enum values. |
| Capability model | Actions map to concrete capability definitions, not just capability families. |
| Implementation seam | Every concrete capability mapping must declare whether it is a feature, platform, shared, definition-registry, design-system, generation, job scheduler, external integration, or manual operational seam. |
| LLM guidance | LLM authoring guidance is a first-class catalog dependency for creating and maintaining definitions. |

## Current Schema Formalization Contents

The schema formalization draft now includes:

- formal top-level shape
- dependency catalogs
- LLM authoring guidance catalog
- collection-view creation and maintenance planning
- capability family catalog
- capability definition catalog
- implementation seam catalog
- definition status catalog
- identity/source/evidence/attribute schemas
- privacy/security catalogs
- options schema
- validation rule catalog
- placement and template contract rules
- presentation group schema
- operational status schema
- relationship catalogs and boundary rules
- search model and search operator catalog
- surface/routing/template contract schema
- action model, action families, operation keys, route/job/script mapping, and action errors
- compliance, generation, and migration schemas
- current `entityBuilder` compatibility map
- validation themes
- test and artifact expectations
- human-review exceptions

## Known Repo Alignment Requirement

The implementation seam values are planning terms, not already-implemented repo
architecture.

Before implementation, the repo needs an architecture alignment pass for:

- `definition_registry_seam`
- `generation_seam`
- `design_system_seam`
- `job_scheduler_seam`
- `shared_feature_seam`
- `external_integration_seam`
- `manual_operational_seam`

That pass should decide what is already represented, what needs new naming,
what needs an ADR/standards update, and what should remain implementation
detail.

## Not Yet Done

No implementation has started.

Not yet done:

- formal runtime schema/types
- persistence migration
- route/API changes
- generated UI
- generated docs
- permission/capability runtime changes
- data migration from current `entityBuilder`
- pilot entity migration
- design-system entity-management templates
- creation and maintenance implementation
- consumption/migration workflow

## Next Workstream

Next recommended workstream completed as a planning draft:

`definition_creation_and_maintenance_logic`

Questions to answer:

- What rudimentary source inputs feed an entity definition?
- How do forms, LLM-assisted workflows, and repo-artifact migration create the same deterministic output?
- How does the LLM authoring guidance catalog get used?
- What validation happens before draft save, before review, before activation, and before export?
- How do definition versions get proposed, updated, reviewed, activated, superseded, archived, and exported?
- What evidence is captured during creation and maintenance?
- What is human-confirmed, inferred, defaulted, system-generated, or technical-review-gated?
- How do we prevent freeform one-off edits from bypassing governed structure?

Recommended starting point:

Start with the creation sources and lifecycle:

1. new entity from human + LLM
2. entity update from human + LLM
3. repo artifact migration
4. persistent revision of an existing definition

Then define the deterministic pipeline from source input to validated canonical
entity definition.

Planning draft:

- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-creation-and-maintenance.md`

Recommended next planning step:

- convert the creation and maintenance draft into an implementation-facing PRD
  or capability matrix for entity-definition creation
