# Brochure Text Link Action Primitive

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `brochure` |
| Token dependency systems | `brochure` |
| UI family | `brochure-text-link-action` |
| Primitive name | `brochure-text-link-action` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/brochure-text-link-action/BrochureTextLinkAction-Behaviour.md` |
| Shared primitive contract path | `docs/design-system/03-primitive/shared/brochure-text-link-action/BrochureTextLinkAction-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/brochure/brochure-text-link-action/BrochureTextLinkAction-Proof.md` |
| Files affected now | `docs/design-system/03-primitive/shared/brochure-text-link-action/BrochureTextLinkAction-Contract.md`; `docs/design-system/03-primitive/systems/brochure/brochure-text-link-action/BrochureTextLinkAction-Proof.md`; `src/frontend/designSystem/layers/03-primitive/brochure-text-link-action/index.mjs`; `src/frontend/designSystem/systems/brochure/primitives/brochure-text-link-action/`; `docs/design-system/03-primitive/primitive-readiness-index.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | `Allow brochure evidence and related-content sections to navigate with a governed text link.` |
| Primitive job | `Render one native standalone anchor link with visible label, required href, signed focus behavior, and signed link affordance styling.` |
| Expected consumers | `Later brochure evidence-section pattern revision, component seams, canonical scenarios, and first app adoption.` |
| Non-goals | `Button actions, product mutations, route authorization, analytics, downloads, app wrappers, inline prose links, or page placement.` |

## Layer Boundary

This PrimitiveDefinitionArtifact may define primitive decisions only.

It must not define token values, pattern composition, component APIs, demo
routes, canonical files, app imports, app wrappers, product workflow, or
app-local CSS.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Primitive Action |
| --- | --- | --- | --- | --- |
| Native anchor semantics and keyboard activation. | `03-primitive` | browser-native anchor behavior | none | Render `<a href>`. |
| Visible text role for a link. | `02-token` | `link-text-style` brochure token | none | Consume signed token. |
| Underline/decoration and hover affordance. | `02-token` | `link-decoration` brochure token | none | Consume signed token. |
| Keyboard focus outline. | `03-primitive` consuming `02-token` | `focus-ring` brochure token | none | Consume signed token. |
| Standalone interactive target sizing. | `03-primitive` consuming `02-token` | `minimum-target-size` brochure token | none | Consume signed target floor for standalone links. |
| Long label truncation and full-text disclosure. | `03-primitive` consuming `02-token` | `tooltip-surface` and `tooltip-text-style` brochure tokens | none | Keep label one line with ellipsis; disclose full text from the anchor itself when overflow is real. |

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Required tokens consumable by selected systems | `yes for brochure link-text-style, link-decoration, focus-ring, minimum-target-size, tooltip-surface, and tooltip-text-style` |
| Primitive inventory checked | `docs/design-system/03-primitive/primitive-readiness-index.md`; no governed brochure text-link primitive existed before this artifact |

## Token Dependencies

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Primitive Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `link-text-style` | `docs/design-system/02-token/shared/link-text-style/LinkTextStyle-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/link-text-style/LinkTextStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/link-text-style/systems/brochure.mjs#linkTextStyleTokenSpec` | Link-specific text style and foreground values. | `consumable` |
| `link-decoration` | `docs/design-system/02-token/shared/link-decoration/LinkDecoration-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/link-decoration/LinkDecoration-Implementation.md` | `src/frontend/designSystem/layers/02-token/link-decoration/systems/brochure.mjs#linkDecorationTokenSpec` | Underline and non-color link affordance. | `consumable` |
| `focus-ring` | `docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/focus-ring/FocusRing-Implementation.md` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/brochure.mjs#focusRingTokenSpec` | Keyboard-visible focus outline. | `consumable` |
| `minimum-target-size` | `docs/design-system/02-token/shared/minimum-target-size/MinimumTargetSize-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/minimum-target-size/MinimumTargetSize-Implementation.md` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/brochure.mjs#minimumTargetSizeTokenSpec` | Standalone link hit-area review. | `consumable` |
| `tooltip-surface` | `docs/design-system/02-token/shared/tooltip-surface/TooltipSurface-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/tooltip-surface/TooltipSurface-Implementation.md` | `src/frontend/designSystem/layers/02-token/tooltip-surface/systems/brochure.mjs#tooltipSurfaceTokenSpec` | Full-text disclosure surface for truncated standalone link labels. | `consumable` |
| `tooltip-text-style` | `docs/design-system/02-token/shared/tooltip-text-style/TooltipTextStyle-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/tooltip-text-style/TooltipTextStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/brochure.mjs#tooltipTextStyleTokenSpec` | Full-text disclosure typography for truncated standalone link labels. | `consumable` |

## Behavior Contract

The primitive renders a native `<a>` with a non-empty `href` and visible text
label. It preserves native navigation and does not dispatch custom product
events.

The primitive is for standalone text action links. Inline prose links remain a
separate decision because target sizing and line-flow behavior are different.

When the rendered label exceeds the available inline size, the primitive clips
the visible label to one line with ellipsis, sets `aria-describedby` on the
anchor, and discloses the full label through a token-governed tooltip surface
on focus or pointer hover. The primitive must not nest the focusable
`truncating-label` primitive inside the anchor.

## Accessibility Contract

The primitive preserves native anchor semantics, keyboard focus, Enter
activation, visible focus, and a text accessible name. Link affordance does not
rely on color alone because signed underline decoration is always present.

## Allowed States

Only include states that change behavior, semantics, emitted events, or
consumer obligations.

| State | Required Behavior |
| --- | --- |
| default | Native link with visible text and `href`. |
| hover | Text foreground may change through signed link text token; underline remains present. |
| focus-visible | Consumes signed focus-ring token without layout shift. |
| overflow | Label remains one line with ellipsis and full text is available through the anchor-owned tooltip disclosure. |

## Data Or Event Contract

The primitive accepts display-only link data: `label`, `href`, and optional
`id`. It emits no custom events and owns no navigation routing beyond native
anchor behavior.

## Visual-Skin Boundary

Design-system implementations may vary link text, decoration, focus, and target
values only through signed token seams. No implementation may hard-code color,
weight, underline, offset, hover treatment, or focus styling in primitive CSS.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned primitive module | `src/frontend/designSystem/layers/03-primitive/brochure-text-link-action/index.mjs` |
| Planned primitive export | `brochureTextLinkActionPrimitive` |
| Allowed consumers | `Later patterns, component seams, canonical scenarios, and first app adoption after review.` |
| Consumers must use | `src/frontend/designSystem/layers/03-primitive/brochure-text-link-action/index.mjs#renderBrochureTextLinkActionPrimitive` when runtime rendering is needed. |
| Consumers must not use | `copied app markup, route-local design-system markup, screenshots, local CSS values, or duplicated controller behavior` |

## Runtime Primitive Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `implemented` |
| Allowed seam shape | `render helper` |
| Planned module | `src/frontend/designSystem/layers/03-primitive/brochure-text-link-action/index.mjs` |
| Planned export | `brochureTextLinkActionPrimitive` |
| Seam must own | `Native anchor semantics, required label/href validation, token resolution, truncation/disclosure behavior, and class/data contract.` |
| Seam must not own | `Route-local demo markup, app wrappers, page layout, product workflow, or unsigned visual values.` |
| First implementation posture | `Smallest standalone native anchor render helper and controller that satisfies native navigation plus long-label disclosure.` |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit tests prove label/href validation and native anchor rendering. |
| accessibility | Proof route and tests show native link semantics, visible text, no fake button role, and overflow disclosure hooks. |
| token consumption | Unit tests prove link text/decor/focus/target/tooltip decisions come from signed tokens. |
| rendered verification | `/design-system/brochure/primitives/brochure-text-link-action` must serve a proof route. |
| consumer boundary | Evidence-section pattern must consume this primitive in a later pattern revision rather than recreating links. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/brochure/primitives/brochure-text-link-action` |
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
| Store shared primitive contract at | `docs/design-system/03-primitive/shared/brochure-text-link-action/BrochureTextLinkAction-Contract.md` |
| Store system proof at | `docs/design-system/03-primitive/systems/brochure/brochure-text-link-action/BrochureTextLinkAction-Proof.md` |
| Stable lookup key | `shared/brochure-text-link-action/brochure-text-link-action/03-primitive` |
| How later layers consume it | Later layers read the shared primitive contract and selected system proof by path or stable lookup key before making pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve behavior, accessibility, token dependencies, allowed states, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a primitive revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `03-primitive/EVAL.md` |
| Required accessibility eval | `03-primitive/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `03-primitive` | Review this PrimitiveDefinitionArtifact and proof route. | none |
| 2 | `04-pattern-contract` | Revise brochure evidence section pattern to consume this primitive for optional supporting links. | Must remain separate from app adoption. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next layer status | `allowed` |
| Reason | `The primitive is ready for later pattern composition; app adoption remains out of scope.` |
