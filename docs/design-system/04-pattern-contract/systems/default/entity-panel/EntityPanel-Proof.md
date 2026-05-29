# Default Entity Panel Pattern Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `entity-panel` |
| Pattern name | `entity-panel` |
| Harness layer | `04-pattern-contract` |
| Proof status | `review-ready` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/entity-panel/EntityPanel-Contract.md` |
| Rendered proof | `/design-system/default/patterns/entity-panel` |

## Proof Scope

This proof shows a governed panel shell with generic header, optional embedded
secondary index, and governed body scroll region.

It intentionally does not render real form or builder controls because those
families remain ungoverned.

The proof route includes controls for desktop/mobile posture, page-level
primary-index presence, secondary-index presence, secondary header visibility
with governed add action, secondary resize visibility, secondary fixture
length, mobile active region, body content pressure, and LTR/RTL direction so
reviewers can inspect the claimed pattern states in the browser.

The proof also allows page-level primary coordination and secondary index item
activation. The page-level primary index is rendered by the proof wrapper with
the governed, resizable `index-nav-panel` pattern, not inside the
entity-panel pattern. Mobile secondary states render above the body rather
than replacing the body. Primary-to-secondary transitions clear secondary
selection; secondary item activation sets the secondary current tab.
Context bar and display-settings drawer composition remain blocked until
governed pattern seams exist for those families.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/entity-panel` |
| Rendered view status | `available` |
