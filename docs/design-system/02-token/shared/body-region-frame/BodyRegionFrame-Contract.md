# Body Region Frame Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `body-region` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-panel/EntityBodyPanel-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/body-region-frame/BodyRegionFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/body-region-frame/BodyRegionFrame-Implementation.md` |

## Purpose

This token governs the reusable frame values for inner body/content regions
before primitives or patterns host real fields, builders, cards, accordions, or
blocked states.

It exists so body-region primitives and later patterns do not invent local
surface, border, radius, padding, gap, scroll sizing, or state spacing values.

It does not define hosted field controls, form validation semantics,
accordion behavior, workflow-builder behavior, product data, save behavior,
pattern slot composition, component seams, or app adoption.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required role | `body region frame` |
| `shared contract` | Body region frame must include | background, foreground, border, radius, padding, gap, section gap, min inline size, max inline size, min block size, desktop max block size, mobile block-size behavior, and state spacing |
| `shared contract` | Width rails | Body regions must define min and max inline size so adjacent navigation or panel regions cannot squash the body below its governed review width or stretch it beyond the available composition width |
| `shared contract` | Radius source | Body region radius must derive from a signed panel or panel-corner radius seam |
| `shared contract` | State posture | Empty, loading, read-only, error, and blocked states may use this frame token for spacing and surface, but semantic state meaning belongs to later primitives or patterns |

## Consumer Restrictions

Consumers must not hard-code body-region padding, gaps, min width, max width,
min height, max height, surface, border, radius, or state spacing in primitives,
patterns, components, templates, or app pages.

Consumers must not use this token as approval to render ungoverned fields,
builders, selectors, accordions, validation markup, or workflow controls.

Consumers must not treat proof-only diagnostic controls as signed token values.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/body-region-frame` |
| Rendered view status | `available` |
