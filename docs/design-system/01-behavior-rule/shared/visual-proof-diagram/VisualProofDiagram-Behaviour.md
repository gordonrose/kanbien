# Visual Proof Diagram Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared` |
| UI family | `visual-proof-diagram` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/brochure/tokens/visual-proof-ornament` |
| Proposed design-system URL | `/design-system/brochure/primitives/visual-proof-surface` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/visual-proof-diagram/VisualProofDiagram-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/visual-proof-diagram/VisualProofDiagram-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | People reviewing visual evidence, abstract workflow proof, or design-system diagram material. |
| Normal job | Understand that a visual proof area is supporting evidence, not the source of semantic status by itself. |
| Success outcome | The diagram can make relationships easier to scan while text or later governed state semantics still carry proof meaning. |
| Non-goals | Product workflow, data loading, app navigation, validation state, selected state, animation, and complete diagram composition. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Decorative grid, chips, connector lines, accent bars, overlays, and markers support abstract proof visuals. | `02-token` | `docs/design-system/02-token/shared/visual-proof-ornament/VisualProofOrnament-Contract.md` | none | Deferred to token layer; this rule only says ornaments cannot carry meaning alone. |
| A reusable visual proof surface is needed before patterns compose evidence stages. | `03-primitive` | none | missing primitive contract and proof | Later Layer 3 work must provide a non-interactive primitive before patterns consume the surface. |
| Multi-step pipeline, evidence stage, and artifact relationship diagrams need composed content. | `04-pattern-contract` | none | missing pattern contract | Deferred; pattern layer owns composition, slots, ordering, and diagram relationships. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| default | The visual proof area is decorative support for nearby evidence content. It must not expose proof outcome, validation, selection, or workflow status by visual ornament alone. |
| unavailable | If semantic text or later governed state semantics are absent, the diagram must not be presented as proof of an outcome. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| view | Users can visually scan the proof area, but no interaction is required to understand the underlying evidence. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Product data or workflow state | Belongs to later app, component, or pattern contracts. |
| Click, hover, selection, drag, or expansion behavior | No interaction is required for this family at the behavior-rule layer. |
| Exact ornament values or diagram layout | Belongs to token, primitive, and pattern layers. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Decorative visual proof surface primitive | `03-primitive` | The primitive must consume signed ornament and surface tokens without adding semantic meaning. |
| Evidence stage or pipeline diagram composition | `04-pattern-contract` | Composition, repeated stages, labels, and relationship rules are larger than one primitive. |
| Real brochure page adoption | `08-first-app-adoption` | The app page must consume governed seams rather than copy route-local markup or CSS. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Later proofs must show the surface does not imply left-to-right meaning unless a pattern explicitly owns ordering. |
| zoomed in 150% | Later proofs must show semantic text remains readable and ornaments do not obscure it. |
| zoomed out 75% | Later proofs must show the surface still reads as supporting visual material, not as hidden state. |
| dark theme | Later proofs must show contrast remains governed by tokens rather than local overrides. |
| desert theme | Later proofs must show contrast remains governed by tokens rather than local overrides. |
| dark theme with error | If an error state is introduced later, text or governed state semantics must carry the error meaning independently of ornament color. |
| desert theme with error | If an error state is introduced later, text or governed state semantics must carry the error meaning independently of ornament color. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in
`../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | No keyboard operation is required for decorative proof surfaces. Later interactive diagram controls must define their own keyboard behavior. |
| Focus | Decorative proof surfaces must not become focus targets. Later interactive controls must provide visible focus through governed tokens. |
| Names and semantics | Decorative ornaments must be hidden from assistive technology unless a later pattern gives the diagram semantic text. |
| Error and status communication | Error, status, selected, and validation meaning must be communicated by text or later governed state semantics, never ornament alone. |
| Color-independent meaning | Color, position, shape, and line treatment may support scanning but must not be the only carrier of meaning. |
| Later proof owners | Token and primitive proofs own contrast and decorative rendering; pattern proofs own semantic text, reading order, zoom, and responsive composition. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| none | none | no | none |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/visual-proof-diagram/VisualProofDiagram-Behaviour.md` |
| Stable lookup key | `shared/visual-proof-diagram/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review this rule as the narrow behavior lock for visual proof diagrams. | No known behavior blocker remains. |
| 2 | `03-primitive` | Create the smallest non-interactive decorative proof surface primitive using signed brochure tokens. | Requires this behavior rule and the existing visual-proof-ornament token seam. |
| 3 | `04-pattern-contract` | Compose evidence stages or pipeline diagrams after the primitive exists. | Pattern composition must not be hidden inside Layer 3. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed` |
| Reason | Required brochure token seams are review-ready, and this rule now defines the behavior boundary the primitive must preserve. |
