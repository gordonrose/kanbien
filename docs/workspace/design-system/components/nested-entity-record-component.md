# NestedEntityRecord Component

## Scope

- Component name: `NestedEntityRecord`
- Status: active
- Owner: design-system
- Source pattern artifact:
  `docs/workspace/design-system/patterns/token-foundation-seams-pattern.md`
- Consuming surfaces: future nested entity record workflows

## Purpose

Provide a bounded nested frame around the shared entity record body seam.

## Public API

- Review route: `/design-system/tokens/nested-entity-record`
- Renderer: `renderNestedEntityRecordStructure`
- Source file: `src/frontend/designSystem/assets/entityRecordStructure.mjs`
- Structural selectors:
  - `data-nested-entity-record-frame-shell`
  - `data-nested-entity-record-frame`
  - `data-nested-entity-record-resize-handle`
  - `data-nested-entity-record-bottom-resize-handle`

## Behavior

The nested frame consumes the shared entity record body and exposes bounded
width/height resize affordances for review.

## Adoption

First consumers must preserve the shared entity body composition and bounded
frame unless a later design-system loop approves a variant.
