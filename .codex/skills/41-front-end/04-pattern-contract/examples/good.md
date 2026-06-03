# Good PatternContractArtifact Example

This example is intentionally small. It shows a pattern that composes one
accepted primitive without pretending to be a component seam.

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `text-overflow-disclosure` |
| Pattern name | `index-nav-label` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/index-nav-label/IndexNavLabel-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/index-nav-label/IndexNavLabel-Proof.md` |

## Why This Passes

The pattern composes the accepted `truncating-label` primitive for one
navigation-label role. It does not redefine tooltip behavior, ARIA, focus,
keyboard behavior, or token values. It names later component work as a
downstream dependency instead of defining props or app imports.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `none` |
| Rendered view status | `not-created-for-docs-only` |
| If unavailable | This example records the contract shape only; no pattern proof route exists. |

## Good Example: List With Detail Overlay

This passes because the pattern composes list, resize, and detail-slot
primitives while naming responsive behavior explicitly.

| Field | Value |
| --- | --- |
| Desktop structure | List and detail slot render side by side using signed ratio variants such as `1:5`, `1:4`, and `1:2`. |
| Manual resize | Resize limits are derived from the signed minimum ratio, so dragging cannot collapse the list below the `1:5` usable width. |
| Mobile structure | Opening a row displays the detail slot as a fullscreen overlay over the list. |
| Close behavior | The close control restores users to the list context. |
| Primitive consumption | Row reorder, drag/drop affordance, resize handle, detail close control, and text disclosure are consumed from governed primitives. |

## Good Example: Header Pattern Consumes Select Primitives

This passes because the pattern owns only composition and collapse order.

| Field | Value |
| --- | --- |
| Filter regions | Compact icon-only select primitives render filter and sort actions. |
| Select regions | Text trigger select primitives render primary and secondary selectors using signed typography and chevron tokens. |
| Context region | Context title and status share one truncation and collapse contract. |
| Narrow behavior | Context text hides before it can overlap action buttons. |
| Mobile behavior | Header tooling collapses into a menu surface that lists each action by accessible name; select rows open fullscreen option overlays. |
| Consumer boundary | The pattern may place primitives into signed regions, but must not recreate trigger, option, icon, or focus behavior. |
