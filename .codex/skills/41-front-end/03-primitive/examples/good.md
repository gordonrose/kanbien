# Good PrimitiveDefinitionArtifact Example

This example is intentionally small. It shows a non-interactive primitive that
can consume the only currently consumable Layer 2 token seam.

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| Token dependency systems | `default` |
| UI family | `background-color` |
| Primitive name | `surface-foundation` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/colours/Colours-Behaviour.md` |
| Shared primitive contract path | `docs/design-system/03-primitive/shared/surface-foundation/SurfaceFoundation-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/surface-foundation/SurfaceFoundation-Proof.md` |
| Files affected now | `docs/design-system/03-primitive/shared/surface-foundation/SurfaceFoundation-Contract.md`; `docs/design-system/03-primitive/systems/default/surface-foundation/SurfaceFoundation-Proof.md` |

## Why This Passes

This primitive is smaller than a pattern, consumes a signed token seam, keeps
the shared contract separate from the `default` proof, has no interactive
behavior to fake, names the planned public boundary, and blocks consumers from
copying route-local markup or hard-coded colors.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `none` |
| Rendered view status | `not-created-for-docs-only` |
| If unavailable | This example records the primitive contract and system proof only; no rendered primitive route exists yet. |

## Runtime Primitive Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `planned` |
| Allowed seam shape | `data/spec helper first; render helper only if later layers need owned HTML semantics` |
| Planned module | `src/frontend/designSystem/layers/03-primitive/surface-foundation/index.mjs` |
| Planned export | `surfaceFoundationPrimitive` |
| Seam must own | Token-backed surface role resolution and the non-interactive semantic boundary. |
| Seam must not own | route-local demo markup, app wrappers, page layout, product workflow, unsigned visual values, card behavior, panel behavior, spacing, border, or elevation |
| First implementation posture | A small spec helper that maps an allowed surface role to a signed `background-color` token seam without producing app-specific markup. |

## Good Example: Menu Simple Select Variants

This passes because the primitive owns both text and icon-only trigger variants
instead of forcing a header pattern to rebuild one locally.

| Field | Value |
| --- | --- |
| Text trigger | Uses signed frame, label typography, value typography, and chevron token seams. |
| Icon-only trigger | Uses the same trigger behavior with a semantic icon name, accessible name, signed target size, and no visible text. |
| Mobile behavior | Opening the primitive in mobile mode creates a fullscreen option surface with a named close control and focus restoration. |
| Controller model | Delegated listeners are guarded so proof rerenders do not attach duplicate handlers. |
| Consumer boundary | Patterns may choose which variant to render, but may not recreate trigger markup, option behavior, ARIA, focus, or controller logic. |

## Good Example: Keyboard Reorder Primitive

This passes because the primitive treats reordering as tactile behavior rather
than a visual row shuffle.

| Field | Value |
| --- | --- |
| Keyboard command | `Alt+ArrowUp` and `Alt+ArrowDown`, with the shortcut rationale recorded in the behavior contract. |
| Focus result | Focus remains on the moved item after each successful move. |
| Announced result | A polite live region announces the moved item, new position, total count, and before/after neighbor context when available. |
| Pointer parity | Drag/drop emits the same normalized reorder event and result announcement. |
| Consumer boundary | Later patterns receive normalized move events and must not rebuild keyboard handling locally. |
