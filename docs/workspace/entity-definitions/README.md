# Entity Definitions

## Purpose

This folder is the source-independent planning layer for durable entity truth
that does not yet belong in `docs/data-dictionary/` because the backing feature
and persistence do not exist in the repo yet.

Repo bucket classification: shared context under review. Future bucket split
work should prefer cloned or projected entity context so each bucket can stand
alone, but files must still be classified by current purpose before moving or
cloning them.

2026-05-27 cleanup decision: entity-definition context should follow the same
standalone-bucket principle as the architecture map. Do not clone yet; first
reconcile stale first drafts against current source and `docs/data-dictionary/`
so each bucket receives trustworthy context rather than copied drift.

Freshness warning: several files in this folder are first-draft planning inputs
for features that now have implemented source, migrations, feature manifests,
and data-dictionary pages. Do not treat a first-draft entity-definition file as
current authority without checking the owning feature and
`docs/data-dictionary/` first.

Use this folder when a feature loop needs to define:

- persisted entity truth that a future feature will own durably
- form-facing attribute truth that must remain stable across planning and form
  generation
- derived or exported truth that downstream loops may consume without becoming
  the authoritative source

## Why This Exists

`docs/data-dictionary/` is the repo's current-state dictionary for implemented
durable entities.

For `entityBuilder`, we need an upstream layer that can define the durable
entity model before the feature exists in code.
That lets capability matrices, PRDs, tests, and implementation blueprints
reference one stable source of truth instead of inventing entity details in
each downstream artifact.

## Truth Layers

### Persisted Entity Truth

This is the future feature-owned durable record set.
It is the authoritative source once the feature is implemented.

For the current loop, persisted truth is drafted in:

- [entity-builder-core-entity-model-first-draft.md](./entity-builder-core-entity-model-first-draft.md)

### Form-Facing Truth

Form-facing truth is a governed subset of persisted entity truth.
It belongs in the entity-definition layer because field descriptions,
placeholders, and approved default form patterns are part of what the entity
means in operator-facing planning and generation workflows.

Form-facing truth must:

- live in explicit attribute-level structure, not in one vague metadata blob
- reference an approved design-system seam or parent-owned pattern
- remain separate from transient UI-state or app-route decisions

The current approved reference catalog is:

- [approved-form-pattern-catalog.md](./approved-form-pattern-catalog.md)

### Derived Or Exported Truth

Derived or exported truth is not authoritative.
It exists so downstream loops can consume stable machine-readable or
human-readable projections without taking ownership away from the persisted
entity records.

Examples for the future `entityBuilder` feature:

- export snapshots for downstream feature planning
- repo-facing normalized read models
- form-planning exports
- generation-oriented projections

## Expected Artifact Sequence

1. source-independent entity-definition draft
2. capability matrix
3. PRD
4. PRD-derived test-case doc
5. implementation blueprint

## Current Drafts

- [entity-builder-core-entity-model-first-draft.md](./entity-builder-core-entity-model-first-draft.md)
- [approved-form-pattern-catalog.md](./approved-form-pattern-catalog.md)
- [web-app-surface-discovery-core-entity-model-first-draft.md](./web-app-surface-discovery-core-entity-model-first-draft.md)
- [web-app-surface-discovery-structure-aware-entity-model-first-draft.md](./web-app-surface-discovery-structure-aware-entity-model-first-draft.md)
- [web-app-hierarchy-structure-aware-reconcile-entity-model-first-draft.md](./web-app-hierarchy-structure-aware-reconcile-entity-model-first-draft.md)
- [web-app-page-settings-entity-model-first-draft.md](./web-app-page-settings-entity-model-first-draft.md)

## File Classification

This folder is no longer treated as one uniform bucket. Each file has to be
classified by current purpose before anything moves.

| File | Current classification | Authority posture | Next cleanup action |
| --- | --- | --- | --- |
| `approved-form-pattern-catalog.md` | shared context for governed entity/form planning | Still useful as a bridge between entity planning and signed-off design-system seams. Not archive-only. | Keep in place until the shared-context or clone-per-bucket model is designed. |
| `entity-builder-core-entity-model-first-draft.md` | reconcile candidate | Implemented `entityBuilder` source and data-dictionary pages now exist, so this first draft is not current authority by itself. | Reconcile against `src/features/entityBuilder/` and `docs/data-dictionary/entity-definition*.md`, then archive or replace references. |
| `web-app-surface-discovery-core-entity-model-first-draft.md` | reconcile candidate | Implemented `webAppSurfaceDiscovery` source and data-dictionary pages now exist, so this first draft is not current authority by itself. | Reconcile against current source/data dictionary, then archive or replace references. |
| `web-app-surface-discovery-structure-aware-entity-model-first-draft.md` | reconcile candidate | Structure-aware discovery planning is still referenced by matrices/blueprints, but current source and dictionary truth must be checked first. | Reconcile with current hierarchy/discovery implementation, then archive or replace references. |
| `web-app-hierarchy-structure-aware-reconcile-entity-model-first-draft.md` | reconcile candidate | Current hierarchy-related source and dictionary truth now exist, so this file should be treated as planning evidence until reconciled. | Reconcile with current hierarchy builder/source docs, then archive or replace references. |
| `web-app-page-settings-entity-model-first-draft.md` | reconcile candidate | Implemented `webAppPageSettings` source and data-dictionary pages now exist, so this first draft is not current authority by itself. | Reconcile against current source/data dictionary, then archive or replace references. |

No entity-definition files were moved during this pass because capability
matrices, implementation blueprints, and Product Discovery notes still point at
the current paths. Moving these safely requires a reference update or an
intentional shared-context model first.
