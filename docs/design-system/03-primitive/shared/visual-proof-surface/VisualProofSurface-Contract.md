# Visual Proof Surface Primitive

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `brochure` |
| Token dependency systems | `brochure` |
| UI family | `visual-proof-diagram` |
| Primitive name | `visual-proof-surface` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/visual-proof-diagram/VisualProofDiagram-Behaviour.md` |
| Shared primitive contract path | `docs/design-system/03-primitive/shared/visual-proof-surface/VisualProofSurface-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/brochure/visual-proof-surface/VisualProofSurface-Proof.md` |
| Files affected now | `docs/design-system/03-primitive/shared/visual-proof-surface/VisualProofSurface-Contract.md`; `docs/design-system/03-primitive/systems/brochure/visual-proof-surface/VisualProofSurface-Proof.md`; `src/frontend/designSystem/layers/03-primitive/visual-proof-surface/index.mjs`; `src/frontend/designSystem/systems/brochure/primitives/visual-proof-surface/`; `docs/design-system/03-primitive/primitive-readiness-index.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Visual proof diagrams need a reusable non-interactive surface so decorative proof material is governed before patterns compose semantic diagram content. |
| Primitive job | Render one decorative visual proof surface from signed tokens without carrying proof meaning by itself. |
| Expected consumers | `04-pattern-contract` diagram patterns before brochure page adoption. |
| Non-goals | Stage composition, semantic labels, workflow status, validation state, selected state, product data, app routing, animation, and app-local CSS. |

## Layer Boundary

This PrimitiveDefinitionArtifact may define primitive decisions only.

It must not define token values, pattern composition, component APIs, demo
routes, canonical files, app imports, app wrappers, product workflow, or
app-local CSS.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Primitive Action |
| --- | --- | --- | --- | --- |
| The proof surface must show decorative grid and overlay material without owning diagram item placement. | `03-primitive` consuming `02-token` | `src/frontend/designSystem/layers/02-token/visual-proof-ornament/systems/brochure.mjs#visualProofOrnamentTokenSpec` | none | Create runtime render helper that consumes the backdrop ornament token seam. |
| The surface frame must not hard-code brochure border, radius, background, or shadow. | `03-primitive` consuming `02-token` | `src/frontend/designSystem/layers/02-token/surface-frame/systems/brochure.mjs#surfaceFrameTokenSpec` | none | Resolve the showcase surface frame through the token seam. |
| Diagram labels, stages, and relationships must carry meaning. | `04-pattern-contract` | none | missing pattern contract | Block semantic composition until Layer 4. |

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Required tokens consumable by selected systems | `yes for brochure visual-proof-ornament and surface-frame` |
| Primitive inventory checked | `docs/design-system/03-primitive/primitive-readiness-index.md`; no existing primitive covered decorative visual proof surfaces |

## Token Dependencies

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Primitive Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `visual-proof-ornament` | `docs/design-system/02-token/shared/visual-proof-ornament/VisualProofOrnament-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/visual-proof-ornament/VisualProofOrnament-Implementation.md` | `src/frontend/designSystem/layers/02-token/visual-proof-ornament/systems/brochure.mjs#visualProofOrnamentTokenSpec` | Decorative grid and overlay material for the proof surface backdrop. | `consumable` |
| `surface-frame` | `docs/design-system/02-token/shared/surface-frame/SurfaceFrame-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/surface-frame/SurfaceFrame-Implementation.md` | `src/frontend/designSystem/layers/02-token/surface-frame/systems/brochure.mjs#surfaceFrameTokenSpec` | Surface background, foreground, border, border width, radius, and shadow. | `consumable` |

## Behavior Contract

`visual-proof-surface` renders decorative diagram material only.

It may show a governed surface frame, grid, and overlay backdrop. It must not
communicate proof outcome, selected state, validation state, loading state,
error state, or workflow progress.

The primitive does not own layout size. Its containing pattern owns placement
and block size, and this primitive fills the space it is given. Diagram chips,
connectors, markers, labels, and relationships belong to later pattern
contracts.

## Accessibility Contract

The primitive follows the shared WCAG 2.2 AA default in
`.codex/skills/41-front-end/accessibility/WCAG-2.2-AA-DEFAULT.md`.

The primitive is non-interactive and decorative. It must render with
`aria-hidden="true"` and must not add an implicit landmark, named region,
button, link, or focus target.

Keyboard operation, focus behavior, accessible names, and semantic reading
order are not applicable until a later pattern adds semantic diagram content.

Proof meaning, status, error, and validation communication must be carried by
text or later governed state semantics outside this primitive.

## Allowed States

Only include states that change behavior, semantics, emitted events, or
consumer obligations.

| State | Required Behavior |
| --- | --- |
| `decorative` | Render token-backed visual material only and remain hidden from assistive technology. |

## Data Or Event Contract

Not applicable. The primitive does not accept, normalize, emit, or display
externally meaningful data.

## Visual-Skin Boundary

Design-system implementations may vary the surface frame and decorative
ornament values only through signed token seams.

They must not change behavior, accessibility semantics, state meaning, emitted
events, or consumer obligations by design system.

The primitive may expose CSS variables resolved from signed tokens, but it must
not expose local visual values as consumer choices.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned primitive module | `src/frontend/designSystem/layers/03-primitive/visual-proof-surface/index.mjs` |
| Planned primitive export | `visualProofSurfacePrimitive` |
| Allowed consumers | `04-pattern-contract` |
| Consumers must use | `src/frontend/designSystem/layers/03-primitive/visual-proof-surface/index.mjs#renderVisualProofSurfacePrimitive` when runtime rendering is needed. |
| Consumers must not use | `copied app markup, route-local design-system markup, screenshots, local CSS values, or duplicated controller behavior` |

## Runtime Primitive Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `implemented` |
| Allowed seam shape | `render helper plus token-backed data/spec helper` |
| Planned module | `src/frontend/designSystem/layers/03-primitive/visual-proof-surface/index.mjs` |
| Planned export | `visualProofSurfacePrimitive` |
| Seam must own | Decorative HTML structure, `aria-hidden` semantics, token resolution, and the primitive class/data contract. |
| Seam must not own | route-local demo markup, app wrappers, page layout, product workflow, semantic labels, stage composition, or unsigned visual values |
| First implementation posture | Implemented as a non-interactive render helper that fills a containing proof or pattern area. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit tests must show the primitive only exposes decorative behavior. |
| accessibility | Unit tests and route inspection must show `aria-hidden="true"` and no focusable role. |
| token consumption | Tests must show surface and ornament values resolve from signed brochure token seams. |
| rendered verification | `/design-system/brochure/primitives/visual-proof-surface` must serve a proof route using the runtime seam. |
| consumer boundary | Tests must show unsupported systems are rejected and consumers receive the runtime seam rather than route-local markup. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/brochure/primitives/visual-proof-surface` |
| Rendered view status | `available` |
| If unavailable | `not applicable` |

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
| Store shared primitive contract at | `docs/design-system/03-primitive/shared/visual-proof-surface/VisualProofSurface-Contract.md` |
| Store system proof at | `docs/design-system/03-primitive/systems/brochure/visual-proof-surface/VisualProofSurface-Proof.md` |
| Stable lookup key | `shared/visual-proof-diagram/visual-proof-surface/03-primitive` |
| How later layers consume it | Later layers read the shared primitive contract and selected system proof by path or stable lookup key before making pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve behavior, accessibility, token dependencies, allowed states, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a primitive revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `03-primitive/EVAL.md` |
| Required accessibility eval | `03-primitive/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `03-primitive` | Review this primitive contract and brochure proof route. | No known primitive blocker remains. |
| 2 | `04-pattern-contract` | Compose a visual proof diagram pattern using this primitive. | Pattern composition, labels, and relationships belong to Layer 4. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next layer status | `allowed` |
| Reason | The primitive can now supply a token-backed decorative proof surface for later diagram patterns. |
