# Visual Proof Diagram Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `brochure` |
| UI family | `visual-proof-diagram` |
| Pattern name | `visual-proof-diagram` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/visual-proof-diagram/VisualProofDiagram-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/visual-proof-diagram/VisualProofDiagram-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/brochure/visual-proof-diagram/VisualProofDiagram-Proof.md` |
| Files affected now | `docs/design-system/04-pattern-contract/shared/visual-proof-diagram/VisualProofDiagram-Contract.md`; `docs/design-system/04-pattern-contract/systems/brochure/visual-proof-diagram/VisualProofDiagram-Proof.md`; `src/frontend/designSystem/layers/04-pattern-contract/visual-proof-diagram/index.mjs`; `src/frontend/designSystem/systems/brochure/patterns/visual-proof-diagram/`; `docs/design-system/04-pattern-contract/pattern-readiness-index.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Visual proof diagrams need reusable composition that keeps semantic proof meaning in text while decorative material supports scanning. |
| Pattern job | Compose one decorative proof surface with ordered text-bearing proof stages and connector ornamentation. |
| Expected consumers | Later component seams, use-case pages, canonicals, and brochure page adoption. |
| Non-goals | Component props, app data loading, workflow execution, canonical fixtures, app imports, validation state, and app-local CSS. |

## Layer Boundary

This PatternContractArtifact may define pattern composition only.

It must not define token values, primitive behavior, component APIs, demo
fixtures, canonical scenarios, app imports, app wrappers, product workflow, or
app-local CSS.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Pattern Action |
| --- | --- | --- | --- | --- |
| Decorative proof backdrop must be reused instead of recreated. | `03-primitive` | `src/frontend/designSystem/layers/03-primitive/visual-proof-surface/index.mjs#visualProofSurfacePrimitive` | none | Compose the primitive as the pattern backdrop. |
| Stage chips, connector lines, markers, accent bar, spacing, and text styles need governed values. | `04-pattern-contract` consuming `02-token` | `visual-proof-ornament`, `spacing-scale`, `label-text-style`, and `supporting-text-style` brochure seams | none | Consume direct signed tokens for pattern-owned composition. |
| Meaning must be carried by stage text, not ornament alone. | `04-pattern-contract` | `docs/design-system/01-behavior-rule/shared/visual-proof-diagram/VisualProofDiagram-Behaviour.md` | none | Render ordered text-bearing stages. |

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Primitive readiness source checked | `docs/design-system/03-primitive/primitive-readiness-index.md` |
| Required primitives consumable by selected systems | `yes for brochure visual-proof-surface` |
| Required direct tokens consumable by selected systems | `yes for brochure label-text-style, spacing-scale, supporting-text-style, and visual-proof-ornament` |
| Pattern inventory checked | `docs/design-system/04-pattern-contract/pattern-readiness-index.md`; no governed visual proof diagram pattern existed before this artifact |

## Primitive Dependencies

| Primitive | Shared Contract | System | System Proof | Runtime Seam | Pattern Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `visual-proof-surface` | `docs/design-system/03-primitive/shared/visual-proof-surface/VisualProofSurface-Contract.md` | `brochure` | `docs/design-system/03-primitive/systems/brochure/visual-proof-surface/VisualProofSurface-Proof.md` | `src/frontend/designSystem/layers/03-primitive/visual-proof-surface/index.mjs#visualProofSurfacePrimitive` | Decorative proof backdrop. | `consumable` |

## Direct Token Dependencies

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Pattern Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `visual-proof-ornament` | `docs/design-system/02-token/shared/visual-proof-ornament/VisualProofOrnament-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/visual-proof-ornament/VisualProofOrnament-Implementation.md` | `src/frontend/designSystem/layers/02-token/visual-proof-ornament/systems/brochure.mjs#visualProofOrnamentTokenSpec` | Stage chips, connector line, accent bar, and marker visuals. | `consumable` |
| `spacing-scale` | `docs/design-system/02-token/shared/spacing-scale/SpacingScale-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/spacing-scale/SpacingScale-Implementation.md` | `src/frontend/designSystem/layers/02-token/spacing-scale/systems/brochure.mjs#spacingScaleTokenSpec` | Pattern padding and gaps. | `consumable` |
| `label-text-style` | `docs/design-system/02-token/shared/label-text-style/LabelTextStyle-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/label-text-style/LabelTextStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/brochure.mjs#labelTextStyleTokenSpec` | Stage eyebrow and title text. | `consumable` |
| `supporting-text-style` | `docs/design-system/02-token/shared/supporting-text-style/SupportingTextStyle-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/supporting-text-style/SupportingTextStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/supporting-text-style/systems/brochure.mjs#supportingTextStyleTokenSpec` | Stage body text. | `consumable` |

## Composition Contract

`visual-proof-diagram` renders one labelled region containing a decorative
`visual-proof-surface` backdrop and an ordered list of text-bearing stages.

Each stage must include an eyebrow, title, and body. The ordered list carries
the diagram meaning. Connectors, accent bars, chips, and markers are decorative
support only.

The pattern owns stage repetition, connector placement between adjacent stages,
and composition spacing. It does not own product workflow state or app data
loading.

## Composition Ledger

| Rendered Child | Allowed Category | Governed Seam Or Reason | Consumer Boundary |
| --- | --- | --- | --- |
| decorative surface | governed primitive | `visual-proof-surface` runtime seam | Consumers must not recreate the primitive backdrop. |
| ordered stage list | browser-native wrapper | Ordered text sequence is the pattern semantic structure. | Consumers may provide stage text through later seams but must preserve list semantics. |
| stage chip | pattern composition using signed tokens | Direct `visual-proof-ornament`, `spacing-scale`, and text-style token seams | Consumers must not copy chip CSS or token values. |
| connector and accent | pattern composition using signed tokens | Direct `visual-proof-ornament` token seam | Consumers must not treat ornament as semantic status. |

## Accessibility Contract

The pattern follows the shared WCAG 2.2 AA default in
`.codex/skills/41-front-end/accessibility/WCAG-2.2-AA-DEFAULT.md`.

The pattern renders a named section and an ordered list. The decorative surface,
connectors, accent, and markers must be hidden from assistive technology.

The pattern is non-interactive. Keyboard and focus behavior are not applicable
until a later component or app layer introduces controls.

Semantic proof meaning must remain in visible stage text and list order. Color,
shape, position, and connector lines must never be the only carriers of proof
state or outcome.

## Allowed States

Only include states that change behavior, semantics, emitted events, or
consumer obligations.

| State | Required Behavior |
| --- | --- |
| `informational` | Render ordered stage text and decorative ornament without exposing status, selection, loading, or validation state. |

## Data Or Event Contract

The runtime seam accepts an array of stages. Each stage requires:

- `eyebrow`
- `title`
- `body`

The pattern emits no events and performs no data loading or normalization
beyond rejecting missing stage text.

## Visual-Skin Boundary

Design-system implementations may vary visual treatment only through the
selected primitive and signed token seams.

They must not change list semantics, stage text requirements, decorative
ornament posture, or the rule that text carries meaning.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned pattern module | `src/frontend/designSystem/layers/04-pattern-contract/visual-proof-diagram/index.mjs` |
| Planned pattern export | `visualProofDiagramPattern` |
| Allowed consumers | `05-component-seam`, `06-use-case-page`, `07-canonical-scenarios`, and `08-first-app-adoption` after their gates pass |
| Consumers must use | `src/frontend/designSystem/layers/04-pattern-contract/visual-proof-diagram/index.mjs#renderVisualProofDiagramPattern` when runtime rendering is needed. |
| Consumers must not use | `copied app markup, legacy route markup, screenshots, local CSS values, duplicated primitive behavior, or route-local proof markup` |

## Runtime Pattern Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `implemented` |
| Allowed seam shape | `render helper plus token-backed data/spec helper` |
| Planned module | `src/frontend/designSystem/layers/04-pattern-contract/visual-proof-diagram/index.mjs` |
| Planned export | `visualProofDiagramPattern` |
| Seam must own | Stage validation, list composition, primitive orchestration, and token-backed pattern CSS variables. |
| Seam must not own | component props, app wrappers, product workflow, backend calls, unsigned visual values, or primitive reimplementation |
| First implementation posture | Implemented as a non-interactive proof-flow render helper. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit tests must show the pattern requires stage text and remains non-interactive. |
| accessibility | Tests and route proof must show ordered list semantics and decorative elements hidden from assistive technology. |
| primitive consumption | Tests must show the visual-proof-surface primitive is composed. |
| token consumption | Tests must show direct token dependencies resolve from signed brochure seams. |
| rendered verification | `/design-system/brochure/patterns/visual-proof-diagram` must serve a proof route. |
| consumer boundary | Tests must show unsupported systems are rejected and proof-route markup is not the construction API. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/brochure/patterns/visual-proof-diagram` |
| Rendered view status | `available` |
| If unavailable | `not applicable` |

## Rendered Proof Controls

| Control | Source Of Truth | Downstream Consumable? | Browser Evidence | Why It Matters | Status |
| --- | --- | --- | --- | --- | --- |
| stage count | proof-only diagnostic fixture | no proof-only | Unit and route checks verify rendered stage count changes while pattern semantics remain an ordered list. | Prevents hard-coded three-stage diagrams. | `available` |

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
| Store shared pattern contract at | `docs/design-system/04-pattern-contract/shared/visual-proof-diagram/VisualProofDiagram-Contract.md` |
| Store system proof at | `docs/design-system/04-pattern-contract/systems/brochure/visual-proof-diagram/VisualProofDiagram-Proof.md` |
| Stable lookup key | `shared/visual-proof-diagram/visual-proof-diagram/04-pattern-contract` |
| How later layers consume it | Later layers read the shared pattern contract and selected system proof by path or stable lookup key before making component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve composition, primitive dependencies, accessibility, allowed states, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a pattern revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `04-pattern-contract/EVAL.md` |
| Required accessibility eval | `04-pattern-contract/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `04-pattern-contract` | Review this pattern contract and brochure proof route. | No known pattern blocker remains. |
| 2 | `05-component-seam` | Decide whether the brochure page needs a reusable component seam before app adoption. | App adoption must not copy route-local markup. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `05-component-seam` |
| Next layer status | `allowed` |
| Reason | The governed pattern now exposes a runtime seam that later layers can consume. |
