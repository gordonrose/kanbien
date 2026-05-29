# Entity Body Panel Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `entity-body-panel` |
| Pattern name | `entity-body-panel` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-panel/EntityBodyPanel-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/entity-body-panel/EntityBodyPanel-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/entity-body-panel/EntityBodyPanel-Proof.md` |

## Purpose

`entity-body-panel` governs the inner body/content region of an entity panel.
It composes the accepted `body-region-control` primitive and preserves body
state, scroll posture, width rails, and hosted-control blockers.

It does not define text fields, text areas, radio groups, card selects,
toggles, dropdowns, drawer selects, accordions, workflow builders, validation
messages, product data, save behavior, component seams, templates, canonicals,
or app adoption.

## Preflight Decision Ledger

| Observed decision | Owning layer | Existing governed seam | Missing seam | Allowed action |
| --- | --- | --- | --- | --- |
| Body frame, spacing, width rails, height rails | `02-token` | `body-region-frame` | none | Consume through `body-region-control`. |
| Labelled body region, allowed state attributes, `aria-busy`, mobile scroll posture | `03-primitive` | `body-region-control` | none | Compose the primitive. |
| Long body content needs a hosted scroll owner | `03-primitive` | `scroll-region-control` through `body-region-control` | none | Consume through primitive composition. |
| Empty, loading, and blocked body states must not fake form UI | `04-pattern-contract` | this pattern | none | Render no body children for those states and expose evidence outside the body region. |
| Real form and builder controls | earlier layers per family | none for most requested controls | missing behavior, tokens, primitives, and patterns | Block real rendering. |

## Composition Contract

The pattern renders one `body-region-control` primitive.

For `default`, `read-only`, `editable`, and `error`, the pattern may pass
already-governed child content into the body region.

For `empty`, `loading`, and `blocked-foundation`, the pattern renders no child
content. Empty-state presentation, loading previews, and blocked-foundation UI
need their own lower-layer foundations before this pattern may display them as
real UI.

## Accessibility Contract

The composed body region keeps the accessible label supplied to
`body-region-control`. Loading state relies on the primitive's `aria-busy`
contract. The pattern must not hide missing hosted-control foundations behind
visual placeholders that look like real controls.

## Allowed States

| State | Pattern behavior |
| --- | --- |
| `default` | Hosts supplied governed child content. |
| `empty` | Hosts no child content; empty-state UI remains blocked. |
| `loading` | Hosts no child content; loading UI remains blocked while `aria-busy` is supplied by the primitive. |
| `read-only` | Hosts supplied governed child content; child families own read-only semantics. |
| `editable` | Hosts supplied governed child content only after child families are governed. |
| `error` | Hosts supplied governed child content; validation UI remains blocked. |
| `blocked-foundation` | Hosts no child content because a needed child family is missing. |

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/entity-body-panel/index.mjs#entityBodyPanelPattern` |
| Render helper | `src/frontend/designSystem/layers/04-pattern-contract/entity-body-panel/index.mjs#renderEntityBodyPanelPattern` |
| Allowed consumers | Later Layer 4 patterns such as `entity-panel`, then later component seams after their harness is active. |
| Consumers must not use | route-local proof markup, copied body wrappers, app-local CSS, or ungoverned hosted controls |

## Required Evidence

| Evidence area | Requirement |
| --- | --- |
| runtime | Unit proof must show accepted primitive composition and empty/loading/blocked child suppression. |
| rendered proof | Browser proof must show state controls, width pressure, direction, no horizontal overflow, and no fake children for empty/loading/blocked states. |
| downstream boundary | Proof must show hosted controls are blocked until their own lower-layer foundations exist. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/entity-body-panel` |
| Rendered view status | `available` |
