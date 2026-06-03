# Brochure Evidence Section Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `brochure` |
| UI family | `brochure-evidence-section` |
| Pattern name | `brochure-evidence-section` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/brochure-evidence-section/BrochureEvidenceSection-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/brochure-evidence-section/BrochureEvidenceSection-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/brochure/brochure-evidence-section/BrochureEvidenceSection-Proof.md` |
| Files affected now | `docs/design-system/04-pattern-contract/shared/brochure-evidence-section/BrochureEvidenceSection-Contract.md`; `docs/design-system/04-pattern-contract/systems/brochure/brochure-evidence-section/BrochureEvidenceSection-Proof.md`; `src/frontend/designSystem/layers/04-pattern-contract/brochure-evidence-section/index.mjs`; `src/frontend/designSystem/systems/brochure/patterns/brochure-evidence-section/`; `docs/design-system/04-pattern-contract/pattern-readiness-index.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | `Explain what repo evidence supports a brochure claim in a scannable section.` |
| Pattern job | `Render one labelled, non-interactive evidence section with intro copy and text evidence items.` |
| Expected consumers | `Later component seams, canonical scenarios, and first app adoption for brochure evidence content.` |
| Non-goals | `Button CTAs, downloads, app page adoption, canonical scenarios, workflow state, validation state, or product data loading.` |

## Layer Boundary

This PatternContractArtifact may define pattern composition only.

It must not define token values, primitive behavior, component APIs, demo
fixtures, canonical scenarios, app imports, app wrappers, product workflow, or
app-local CSS.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Pattern Action |
| --- | --- | --- | --- | --- |
| Evidence content has eyebrow, heading, intro, and list items. | `04-pattern-contract` | none | none | Create pattern composition and runtime seam. |
| Evidence section uses brochure panel styling. | `04-pattern-contract` consuming `02-token` | `surface-frame` brochure token | none | Consume `surface-frame-panel`. |
| Evidence text uses brochure editorial typography. | `04-pattern-contract` consuming `02-token` | `typography-scale`, `label-text-style`, `supporting-text-style` brochure tokens | none | Consume signed text tokens. |
| Evidence bullets use small teal markers. | `04-pattern-contract` consuming `02-token` | `list-marker-style` brochure token | none | Consume `list-marker-bullet`. |
| Evidence section may include a supporting link. | `04-pattern-contract` consuming `03-primitive` | `brochure-text-link-action` primitive | none | Compose the primitive through an optional action slot. |

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Primitive readiness source checked | `docs/design-system/03-primitive/primitive-readiness-index.md` |
| Required primitives consumable by selected systems | `yes for brochure-text-link-action when optional action slot is used` |
| Required direct tokens consumable by selected systems | `yes for brochure label-text-style, list-marker-style, spacing-scale, supporting-text-style, surface-frame, and typography-scale` |
| Pattern inventory checked | `docs/design-system/04-pattern-contract/pattern-readiness-index.md`; no governed brochure evidence section pattern existed before this artifact |

## Primitive Dependencies

| Primitive | Shared Contract | System | System Proof | Runtime Seam | Pattern Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `brochure-text-link-action` | `docs/design-system/03-primitive/shared/brochure-text-link-action/BrochureTextLinkAction-Contract.md` | `brochure` | `docs/design-system/03-primitive/systems/brochure/brochure-text-link-action/BrochureTextLinkAction-Proof.md` | `src/frontend/designSystem/layers/03-primitive/brochure-text-link-action/index.mjs#brochureTextLinkActionPrimitive` | Optional supporting action link. | `consumable` |

## Direct Token Dependencies

Only include direct token dependencies that the pattern consumes itself. Do not
repeat tokens that are consumed only through a primitive.

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Pattern Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `surface-frame` | `docs/design-system/02-token/shared/surface-frame/SurfaceFrame-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/surface-frame/SurfaceFrame-Implementation.md` | `src/frontend/designSystem/layers/02-token/surface-frame/systems/brochure.mjs#surfaceFrameTokenSpec` | Panel background, border, radius, foreground, and shadow. | `consumable` |
| `spacing-scale` | `docs/design-system/02-token/shared/spacing-scale/SpacingScale-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/spacing-scale/SpacingScale-Implementation.md` | `src/frontend/designSystem/layers/02-token/spacing-scale/systems/brochure.mjs#spacingScaleTokenSpec` | Section padding and content gaps. | `consumable` |
| `typography-scale` | `docs/design-system/02-token/shared/typography-scale/TypographyScale-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/typography-scale/TypographyScale-Implementation.md` | `src/frontend/designSystem/layers/02-token/typography-scale/systems/brochure.mjs#typographyScaleTokenSpec` | Eyebrow and section heading typography. | `consumable` |
| `supporting-text-style` | `docs/design-system/02-token/shared/supporting-text-style/SupportingTextStyle-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/supporting-text-style/SupportingTextStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/supporting-text-style/systems/brochure.mjs#supportingTextStyleTokenSpec` | Intro and item body typography. | `consumable` |
| `label-text-style` | `docs/design-system/02-token/shared/label-text-style/LabelTextStyle-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/label-text-style/LabelTextStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/brochure.mjs#labelTextStyleTokenSpec` | Evidence item label typography. | `consumable` |
| `list-marker-style` | `docs/design-system/02-token/shared/list-marker-style/ListMarkerStyle-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/list-marker-style/ListMarkerStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/list-marker-style/systems/brochure.mjs#listMarkerStyleTokenSpec` | Non-semantic bullet marker treatment. | `consumable` |

## Composition Contract

`brochure-evidence-section` renders one labelled `section` with a heading,
intro paragraph, and unordered evidence list. Each item may have a short label
and body text. The label/body text is the only evidence meaning; marker color,
surface treatment, and typography are supporting presentation.

The pattern may render one optional supporting action link by composing the
`brochure-text-link-action` primitive. It does not render buttons, downloads,
or route-specific product actions.

## Composition Ledger

Every rendered child must be classified before implementation.

| Rendered Child | Allowed Category | Governed Seam Or Reason | Consumer Boundary |
| --- | --- | --- | --- |
| Section wrapper | `browser-native wrapper` | Native `section` with heading relationship. | Consumers must not copy route proof markup; use runtime seam. |
| Eyebrow, heading, intro | `pattern composition using signed tokens` | Direct `typography-scale`, `supporting-text-style`, and `spacing-scale` token seams. | Consumers may provide text only. |
| Evidence list | `browser-native wrapper` | Native unordered list preserves list semantics. | Consumers may provide item labels and body text only. |
| Marker span | `pattern composition using signed tokens` | Direct `list-marker-style` token seam; `aria-hidden`. | Consumers must not treat marker as status or selection. |
| Item label/body text | `pattern composition using signed tokens` | Direct `label-text-style` and `supporting-text-style` token seams. | Consumers must not replace typography with local CSS. |
| Supporting action link | `governed primitive` | `brochure-text-link-action` primitive. | Consumers may supply label and href only; they must not recreate anchor styling or focus behavior. |

## Accessibility Contract

The pattern must expose a labelled section through `aria-labelledby` and a real
heading. Evidence items must be a real unordered list. Decorative markers must
be hidden from assistive technology. When an action is supplied, it must be the
governed native text-link primitive. Meaning must remain available through text
when styles are disabled or colors are changed.

## Allowed States

Only include states that change behavior, semantics, emitted events, or
consumer obligations.

| State | Required Behavior |
| --- | --- |
| default | Renders heading, intro, and one or more evidence items. |
| labelled-item | When an item has a label, render it as text before the body, not as an icon or marker-only distinction. |
| action | When a supporting action is supplied, render it through `brochure-text-link-action` after the evidence list. |

## Data Or Event Contract

The pattern accepts display-only text data: `eyebrow`, `heading`, `intro`,
`items`, and optional `action`. It normalizes empty values by rejecting them. It
emits no events.

## Visual-Skin Boundary

System implementations may vary signed token values for surface, spacing,
typography, and markers. They must not remove heading/list semantics, add
interactive controls, make markers semantic, or introduce pattern-local CSS
values for decisions already owned by tokens.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned pattern module | `src/frontend/designSystem/layers/04-pattern-contract/brochure-evidence-section/index.mjs` |
| Planned pattern export | `brochureEvidenceSectionPattern` |
| Allowed consumers | `Later component seams, canonical scenarios, and first app adoption after review.` |
| Consumers must use | `src/frontend/designSystem/layers/04-pattern-contract/brochure-evidence-section/index.mjs#renderBrochureEvidenceSectionPattern` when runtime rendering is needed. |
| Consumers must not use | `copied app markup, legacy route markup, screenshots, local CSS values, duplicated primitive behavior, or route-local proof markup` |

## Runtime Pattern Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `implemented` |
| Allowed seam shape | `render helper` |
| Planned module | `src/frontend/designSystem/layers/04-pattern-contract/brochure-evidence-section/index.mjs` |
| Planned export | `brochureEvidenceSectionPattern` |
| Seam must own | `Section/list composition, text validation, optional primitive composition, token consumption, and decorative marker wiring.` |
| Seam must not own | `Component props, app wrappers, product workflow, backend calls, unsigned visual values, primitive reimplementation, or button CTA behavior.` |
| First implementation posture | `Smallest non-interactive runtime render helper that satisfies the evidence-section behavior rule.` |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit tests must prove the pattern rejects empty heading/intro/items and renders text evidence in source order. |
| accessibility | Unit or browser proof must show `section`/heading/list semantics and no interactive controls. |
| primitive consumption | Unit tests must prove optional action links compose `brochure-text-link-action`. |
| token consumption | Unit tests must prove signed brochure token seams are recorded as dependencies and rendered as CSS variables. |
| rendered verification | `/design-system/brochure/patterns/brochure-evidence-section` must serve a proof route with default and narrow-slot pressure examples. |
| consumer boundary | Tests must prove the pattern does not render anchors or buttons until a governed link/action primitive exists. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/brochure/patterns/brochure-evidence-section` |
| Rendered view status | `available` |
| If unavailable | `not applicable` |

## Rendered Proof Controls

Only include controls that vary signed upstream dependencies, responsive
constraints, accessibility-sensitive states, or consumer-boundary risks.
Each control must have browser evidence that it changes rendered evidence or
preserves the stated behavior under pressure. Mark diagnostic controls as
proof-only when later layers must not consume the value.

| Control | Source Of Truth | Downstream Consumable? | Browser Evidence | Why It Matters | Status |
| --- | --- | --- | --- | --- | --- |
| narrow slot | `proof-only diagnostic` | `no proof-only` | rendered route includes constrained proof slot; visual/browser spec to follow when promotion begins | Proves wrapping without creating a layout token. | `available` |

## Consumer Restrictions

Consumers must not recreate primitive behavior, markup, ARIA, state handling,
or token values locally.

Consumers must not use legacy top-level `/design-system/patterns` route markup
as the pattern source of truth.

Consumers must not weaken the accessibility requirements recorded here.

Consumers must not treat the pattern as a component seam or app adoption seam.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared pattern contract at | `docs/design-system/04-pattern-contract/shared/brochure-evidence-section/BrochureEvidenceSection-Contract.md` |
| Store system proof at | `docs/design-system/04-pattern-contract/systems/brochure/brochure-evidence-section/BrochureEvidenceSection-Proof.md` |
| Stable lookup key | `shared/brochure-evidence-section/brochure-evidence-section/04-pattern-contract` |
| How later layers consume it | Later layers read the shared pattern contract and selected system proof by path or stable lookup key before making component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve composition, primitive dependencies, accessibility, allowed states, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a pattern revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `04-pattern-contract/EVAL.md` |
| Required accessibility eval | `04-pattern-contract/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `04-pattern-contract` | Review this PatternContractArtifact and rendered proof route. | none |
| 2 | `08-first-app-adoption` | Adopt this pattern into a public page only after later-layer approval. | App adoption remains out of scope for this slice. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `08-first-app-adoption` |
| Next layer status | `allowed` |
| Reason | `Layer 1-4 foundations are ready for a later approved public-page adoption stream.` |
