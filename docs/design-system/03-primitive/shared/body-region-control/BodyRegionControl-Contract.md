# Body Region Control Primitive

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| Token dependency systems | `default` |
| UI family | `body-region` |
| Primitive name | `body-region-control` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-panel/EntityBodyPanel-Behaviour.md` |
| Shared primitive contract path | `docs/design-system/03-primitive/shared/body-region-control/BodyRegionControl-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/body-region-control/BodyRegionControl-Proof.md` |
| Files affected now | `docs/design-system/03-primitive/shared/body-region-control/BodyRegionControl-Contract.md`; `docs/design-system/03-primitive/systems/default/body-region-control/BodyRegionControl-Proof.md`; `docs/design-system/03-primitive/primitive-readiness-index.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | The `entity-body-panel` behavior rule requires a governed body/content region that can preserve context, reach long content, and block ungoverned hosted controls. |
| Primitive job | Provide a labelled, token-backed body region host with state attributes and governed scroll composition. |
| Expected consumers | `04-pattern-contract` patterns such as `entity-body-panel`. |
| Non-goals | This primitive does not define fields, field rows, validation copy, accordions, cards, workflow builders, product data, pattern slots, component APIs, demo routes, app imports, or app-local CSS. |

## Layer Boundary

This PrimitiveDefinitionArtifact may define primitive decisions only.

It must not define token values, pattern composition, component APIs, demo
routes, canonical files, app imports, app wrappers, product workflow, or
app-local CSS.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Primitive Action |
| --- | --- | --- | --- | --- |
| The body area needs a token-backed inner frame. | `02-token` | `body-region-frame` | none | Consume the signed token seam. |
| Long body content must be reachable. | `03-primitive` through existing primitive composition | `scroll-region-control` | none | Compose the governed scroll primitive. |
| Body states must not be invented by route-local markup. | `03-primitive` | no previous body host primitive | none | Normalize allowed state attributes without rendering fake controls. |
| Hosted controls are still largely ungoverned. | later per control family | none for most hosted controls | missing lower-layer families | Keep hosted control rendering out of this primitive. |

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Required tokens consumable by selected systems | `yes for default body-region-frame and scrollbar-skin` |
| Primitive inventory checked | `docs/design-system/03-primitive/primitive-readiness-index.md`; no consumable body-region primitive existed before this artifact |

## Token Dependencies

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Primitive Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `body-region-frame` | `docs/design-system/02-token/shared/body-region-frame/BodyRegionFrame-Contract.md` | `default` | `docs/design-system/02-token/systems/default/body-region-frame/BodyRegionFrame-Implementation.md` | `src/frontend/designSystem/layers/02-token/body-region-frame/systems/default.mjs#bodyRegionFrameTokenSpec` | Supplies body-region surface, border, radius, padding, gap, state spacing, width rails, and height constraints. | `consumable` |
| `scrollbar-skin` | `docs/design-system/02-token/shared/scrollbar-skin/ScrollbarSkin-Contract.md` | `default` | `docs/design-system/02-token/systems/default/scrollbar-skin/ScrollbarSkin-Implementation.md` | consumed through `scroll-region-control` | Supplies governed scrollbar skin for long body content. | `consumable` |

## Behavior Contract

`body-region-control` renders a labelled content region whose visible frame is
resolved from signed body-region tokens.

It may expose state attributes for `default`, `empty`, `loading`, `read-only`,
`editable`, `error`, and `blocked-foundation`. These states are semantic hooks
for later patterns; the primitive does not invent validation copy, empty copy,
loading UI, field controls, or builder controls.

The primitive composes `scroll-region-control` for long content reachability.
The containing pattern chooses the mobile scroll posture and supplies any
relationship to panel navigation.

## Accessibility Contract

The primitive follows the shared WCAG 2.2 AA default in
`.codex/skills/41-front-end/accessibility/WCAG-2.2-AA-DEFAULT.md`.

The primitive renders a named `section` region. Consumers must provide an
accessible label. Loading state sets `aria-busy="true"`. Other state-specific
messages belong to consuming patterns or hosted controls until those families
are governed.

The primitive must not trap focus, reorder focus, or make its scroll skin the
only cue that more content exists.

## Allowed States

Only include states that change behavior, semantics, emitted events, or
consumer obligations.

| State | Required Behavior |
| --- | --- |
| `default` | Presents governed body content with no special state. |
| `empty` | Allows a later pattern to provide empty-state content without changing the primitive frame. |
| `loading` | Sets `aria-busy="true"` and allows a later pattern to provide governed loading content. |
| `read-only` | Exposes the state for later patterns without disabling descendants locally. |
| `editable` | Exposes the state for later patterns without creating hosted controls locally. |
| `error` | Exposes the state for later patterns or hosted controls to communicate errors with governed text and semantics. |
| `blocked-foundation` | Exposes the state used when a needed hosted control family is not governed yet. |

## Data Or Event Contract

Not applicable. The primitive does not accept, normalize, emit, or display
externally meaningful product data.

## Visual-Skin Boundary

Design-system implementations may vary concrete frame and width-rail values
only through the signed `body-region-frame` token seam and scrollbar values
through the composed `scroll-region-control` primitive.

The primitive must not embed system-specific asset data, form-control styling,
validation styling, or product-specific layout.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned primitive module | `src/frontend/designSystem/layers/03-primitive/body-region-control/index.mjs` |
| Planned primitive export | `bodyRegionControlPrimitive` |
| Allowed consumers | `04-pattern-contract` after the selected system proof is ready |
| Consumers must use | `src/frontend/designSystem/layers/03-primitive/body-region-control/index.mjs#bodyRegionControlPrimitive` when runtime consumption is needed. |
| Consumers must not use | copied app markup, route-local design-system markup, screenshots, local CSS values, or duplicated controller behavior |

## Runtime Primitive Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `implemented` |
| Allowed seam shape | `render helper plus data/spec helper` |
| Planned module | `src/frontend/designSystem/layers/03-primitive/body-region-control/index.mjs` |
| Planned export | `bodyRegionControlPrimitive` |
| Seam must own | Labelled section semantics, allowed state normalization, body-region token resolution, scroll primitive composition, and CSS/data-attribute contract. |
| Seam must not own | route-local demo markup, app wrappers, page layout, product workflow, hosted form controls, validation copy, or unsigned visual values |
| First implementation posture | Small render helper that wraps supplied content in a token-backed section and delegates scrolling to `scroll-region-control`. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit proof must show state normalization, token dependency resolution, and scroll primitive composition. |
| accessibility | Browser proof must show a named region and `aria-busy` in loading state. |
| token consumption | Unit proof must show only signed `body-region-frame` and composed `scroll-region-control` token seams are used. |
| rendered verification | Proof route must expose state, mobile scroll mode, and long-content pressure controls. |
| consumer boundary | Later patterns must consume the runtime seam instead of copied body wrapper markup or local CSS. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/primitives/body-region-control` |
| Rendered view status | `available` |
| If unavailable | `not applicable` |

## Consumer Restrictions

Consumers must not hard-code values governed by Layer 2 tokens.

Consumers must not recreate primitive markup, controller behavior, ARIA rules,
or state handling locally.

Consumers must not use route-local `/design-system` markup as the primitive
source of truth.

Consumers must not weaken the accessibility requirements recorded here.

Consumers must not treat supplied proof content as governed field, builder, or
validation behavior.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared primitive contract at | `docs/design-system/03-primitive/shared/body-region-control/BodyRegionControl-Contract.md` |
| Store system proof at | `docs/design-system/03-primitive/systems/default/body-region-control/BodyRegionControl-Proof.md` |
| Stable lookup key | `shared/body-region/body-region-control/03-primitive` |
| How later layers consume it | Later layers read the shared primitive contract and selected system proof by path or stable lookup key before making pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve behavior, accessibility, token dependencies, allowed states, runtime seam policy, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a primitive revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `03-primitive/EVAL.md` |
| Required accessibility eval | `03-primitive/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `03-primitive` | Accept this primitive for default proof review. | No known primitive blocker remains. |
| 2 | `04-pattern-contract` | Define `entity-body-panel` by composing this body region with governed hosted families or blocked-state evidence. | Hosted controls still need their own lower-layer passes before real rendering. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next layer status | `allowed with blockers` |
| Reason | The body host primitive can be consumed by a pattern, but real hosted controls remain blocked until each family is governed. |
