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
