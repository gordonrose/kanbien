# Entity Builder Foundation Capability Matrix Notes

## Generated Artifact

- Matrix:
  [2026-04-19-entity-builder-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-entity-builder-foundation-capability-matrix-first-draft.csv)

## Upstream Truth For This Matrix

This matrix intentionally starts from the source-independent entity-definition
layer rather than from implementation guesses.

Source artifacts:

- [entity-builder-core-entity-model-first-draft.md](/home/gordon/kanbien/docs/workspace/entity-definitions/entity-builder-core-entity-model-first-draft.md)
- [approved-form-pattern-catalog.md](/home/gordon/kanbien/docs/workspace/entity-definitions/approved-form-pattern-catalog.md)

## Consolidated Model Assumptions

- `entityKey` and `attributeKey` are stable external identifiers.
- internal durable ids use UUIDs.
- entity versioning uses replacement records under a stable `entityKey`.
- current-state lookups and exact historical lookups both matter.
- derived exports are generated on demand and are not durable source records.
- one canonical export shape exists in v1 and includes an explicit
  export-format version.
- defaults stay implicit in persisted truth and are resolved through
  version-aware catalogs during validation, read, and export.
- form-pattern compatibility must validate against `attributeType`,
  `valueCardinality`, and `attributeKind` when relevant.

## Recommended Feature Boundary

The first `entityBuilder` feature loop should be a backend planning and export
foundation.

It should own:

- durable entity-definition lineages and versions
- durable attributes, validation rules, and explicit bounded options
- exact and list reads over stored truth
- catalog reads for approved types and approved form patterns
- read-only validation for activation and export readiness
- deterministic export of derived entity truth

It should not yet own:

- real app UI
- relationship modeling between entities
- design-system promotion work
- dynamic external option providers
- downstream code generation
- first-class audit entity families

## Truth Separation Expected By The Matrix

- Persisted truth:
  entity-definition lineages, versions, attributes, validation rules, option
  rows, and computed-source links stored durably
- Form-facing truth:
  label, description, help text, placeholder text, `formFacing`, and approved
  default form pattern reference stored with the attribute definition
- Derived or exported truth:
  deterministic snapshots produced on demand from persisted records for
  downstream planning and implementation loops

## ADR Recommendation

An ADR is likely warranted before implementation because this feature
introduces a new durable repo-facing planning seam, a new versioned catalog
resolution pattern, and a new rule for how persisted entity truth exports into
downstream loops.
