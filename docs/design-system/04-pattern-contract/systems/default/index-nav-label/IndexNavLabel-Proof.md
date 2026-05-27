# Default Index Nav Label Pattern Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Proof scope | `default design-system proof` |
| Pattern name | `index-nav-label` |
| Harness layer | `04-pattern-contract` |
| Proof status | `review-ready` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/index-nav-label/IndexNavLabel-Contract.md` |
| Reference primitive | `truncating-label` |
| Primitive proof path | `docs/design-system/03-primitive/systems/default/truncating-label/TruncatingLabel-Proof.md` |
| Runtime proof route | `/design-system/default/patterns/index-nav-label` |

## Proof Claim

The `default` design system can satisfy the `index-nav-label` pattern by
composing the accepted `truncating-label` primitive for one constrained
navigation label.

This proof does not approve a full navigation item, selected state, item count,
route behavior, nested index navigation, or entity-page adoption.

## Dependency Check

| Dependency | Default Status | Evidence |
| --- | --- | --- |
| `truncating-label` primitive | `accepted` | `docs/design-system/03-primitive/primitive-readiness-index.md`; `docs/design-system/03-primitive/systems/default/truncating-label/TruncatingLabel-Proof.md` |
| Direct token dependencies | `not-applicable` | Tokens are consumed through the primitive runtime seam. |
| Legacy inventory | `checked` | Existing `filter-panel-structure` and `entity_management_page` routes are pre-governed inventory and are not treated as this proof's source of truth. |

## System-Specific Boundary

The `default` visual skin may change how the accepted primitive appears
through signed token dependencies. It must not change the shared pattern
contract, primitive behavior, accessibility semantics, focus model, or consumer
restrictions.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/index-nav-label` |
| Rendered view status | `available` |
| If unavailable | Do not claim rendered evidence for this pattern until this route is available and verified. |

## Rendered Proof Controls

| Control | Source Of Truth | Why It Matters | Status |
| --- | --- | --- | --- |
| `theme` | `default` truncating-label primitive proof themes | Checks original, dark, and desert primitive token resolution. | `available` |
| `background token` | `default` background-color token variants | Checks the pattern against signed page and surface background contexts. | `available` |
| `slot width` | Pattern proof responsive constraint | Checks wide, base, and tight constrained label slots. | `available` |

## Required Next Evidence

Before this proof can become `accepted`, keep rendered verification for the
runtime pattern proof showing:

- the pattern uses the Layer 3 `truncating-label` runtime seam
- long labels truncate without overlapping the slot
- review controls can change theme, signed background token context, and slot width
- keyboard focus reaches the label when it is non-interactive
- pointer hover and touch/click toggle expose the full text
- Escape dismisses visible disclosure
- RTL and zoom retain readable order and contained geometry
- the proof does not copy legacy route-local pattern markup
