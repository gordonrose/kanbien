# Surface Foundation Contract

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
| Files affected now | `docs/design-system/03-primitive/shared/surface-foundation/SurfaceFoundation-Contract.md`; `docs/design-system/03-primitive/systems/default/surface-foundation/SurfaceFoundation-Proof.md`; `docs/design-system/03-primitive/primitive-readiness-index.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | The colours behavior rule requires governed reusable colour decisions and prevents local hard-coded colour literals. |
| Primitive job | Provide the lowest-level structural surface foundation that can consume signed background-color tokens without adding layout, status, or interaction meaning. |
| Expected consumers | `04-pattern-contract` and `05-component-seam` after those layers are active and the selected system proof is ready. |
| Non-goals | This primitive does not define cards, panels, page sections, elevation, borders, spacing, responsive layout, component props, demo routes, app imports, or app-local CSS. |

## Layer Boundary

This PrimitiveDefinitionArtifact defines primitive decisions only.

It does not define token values, pattern composition, component APIs, demo
routes, canonical files, app imports, app wrappers, product workflow, or
app-local CSS.

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Required tokens consumable by selected systems | `yes for default background-color` |
| Primitive inventory checked | `docs/design-system/03-primitive/primitive-readiness-index.md`; no consumable primitive existed before this artifact |

## Token Dependencies

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Primitive Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `background-color` | `docs/design-system/02-token/shared/background-color/BackgroundColor-Contract.md` | `default` | `docs/design-system/02-token/systems/default/background-color/BackgroundColor-Implementation.md` | `src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs#backgroundColorTokenSpec` | Selects page, surface, or subtle background roles without local color literals. | `consumable` |

## Behavior Contract

`surface-foundation` represents a neutral structural background surface.

It may communicate only surface role: page foundation, surface foundation, or
subtle foundation, as supplied by signed background-color tokens.

It must not communicate selected, disabled, loading, warning, error, success,
modal, navigation, card, panel, or product workflow meaning.

## Accessibility Contract

The primitive follows the shared WCAG 2.2 AA default in
`.codex/skills/41-front-end/accessibility/WCAG-2.2-AA-DEFAULT.md`.

The primitive is structural and non-interactive. It must not add an implicit
landmark, region, group, button, link, or focusable element by itself.

Accessible names, landmarks, keyboard behavior, and focus behavior belong to
the consuming pattern or component when that later layer introduces semantic or
interactive meaning.

Text contrast remains governed by the signed token pairings recorded in Layer
2. This primitive must not invent foreground values.

## Allowed States

Only include states that change behavior, semantics, emitted events, or
consumer obligations.

| State | Required Behavior |
| --- | --- |
| `neutral` | Provides structural surface foundation only; does not expose status, selection, disabled, loading, or error meaning. |

## Data Or Event Contract

Not applicable. The primitive does not accept, normalize, emit, or display
externally meaningful data.

## Visual-Skin Boundary

Design-system implementations may vary the concrete background values by
system, but only through signed background-color token seams.

Design-system implementations must not change the primitive into a card, panel,
layout container, interactive control, status surface, or product-specific
wrapper.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned primitive module | `src/frontend/designSystem/layers/03-primitive/surface-foundation/index.mjs` |
| Planned primitive export | `surfaceFoundationPrimitive` |
| Allowed consumers | `04-pattern-contract`, `05-component-seam` once those layers are active |
| Consumers must use | `src/frontend/designSystem/layers/03-primitive/surface-foundation/index.mjs#surfaceFoundationPrimitive` when runtime consumption is needed. |
| Consumers must not use | copied app markup, route-local design-system markup, screenshots, local CSS values, or duplicated controller behavior |

## Runtime Primitive Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `implemented` |
| Allowed seam shape | `data/spec helper first; render helper only if later layers need owned HTML semantics` |
| Planned module | `src/frontend/designSystem/layers/03-primitive/surface-foundation/index.mjs` |
| Planned export | `surfaceFoundationPrimitive` |
| Seam must own | Token-backed surface role resolution and the non-interactive semantic boundary. |
| Seam must not own | route-local demo markup, app wrappers, page layout, product workflow, unsigned visual values, card behavior, panel behavior, spacing, border, or elevation |
| First implementation posture | Implemented as a small spec helper that maps an allowed surface role to the selected design system's signed `background-color` token seam without producing app-specific markup. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Contract inspection must show the primitive has only neutral structural surface behavior. |
| accessibility | Contract inspection must show no interactive role, focus behavior, accessible-name requirement, or landmark is introduced by the primitive itself. |
| token consumption | Proof must show only the signed `background-color` token seam is required. |
| rendered verification | Required before a render helper or proof route is promoted; not required for this data/spec helper because it produces no HTML. |
| consumer boundary | Later layers must consume the shared contract, selected system proof, or runtime primitive seam instead of copied markup or local CSS. |

## Consumer Restrictions

Consumers must not hard-code values governed by Layer 2 tokens.

Consumers must not recreate primitive markup, controller behavior, ARIA rules,
or state handling locally.

Consumers must not use route-local `/design-system` markup as the primitive
source of truth.

Consumers must not weaken the accessibility requirements recorded here.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared primitive contract at | `docs/design-system/03-primitive/shared/surface-foundation/SurfaceFoundation-Contract.md` |
| Store system proof at | `docs/design-system/03-primitive/systems/default/surface-foundation/SurfaceFoundation-Proof.md` |
| Stable lookup key | `shared/background-color/surface-foundation/03-primitive` |
| How later layers consume it | Later layers read the shared primitive contract and selected system proof by path or stable lookup key before making pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve behavior, accessibility, token dependencies, allowed states, runtime seam policy, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a primitive revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `03-primitive/EVAL.md` |
| Required accessibility eval | `03-primitive/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `03-primitive` | Accept the shared `surface-foundation` primitive contract for `default` proof review. | No known contract blocker remains. |
| 2 | `04-pattern-contract` | Wait until Layer 4 is active before composing this primitive into panels, cards, page sections, or layout structures. | Layer 4 remains scaffold-only. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next layer status | `scaffold-only` |
| Reason | The primitive contract exists, but composition into reusable patterns must wait until Layer 4 is activated. |
