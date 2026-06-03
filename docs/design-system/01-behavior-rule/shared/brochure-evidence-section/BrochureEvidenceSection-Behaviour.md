# Brochure Evidence Section Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared with brochure proof first` |
| UI family | `brochure-evidence-section` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `none` |
| Proposed design-system URL | `/design-system/brochure/patterns/brochure-evidence-section` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/brochure-evidence-section/BrochureEvidenceSection-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/brochure-evidence-section/BrochureEvidenceSection-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | `Public reader evaluating the brochure claim` |
| Normal job | `Understand what repo evidence supports a public-facing product or capability claim.` |
| Success outcome | `The reader can scan a short labelled section, read the evidence summary, and understand each evidence item without relying on visual styling alone.` |
| Non-goals | `Navigation, downloads, proof-state validation, canonical rendering, app adoption, or component API decisions.` |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| A labelled evidence panel contains an eyebrow, heading, explanatory copy, and evidence items. | `04-pattern-contract` | none | missing evidence-section pattern | Record behavior here; defer composition to Layer 4. |
| The evidence items appear as a scannable list. | `04-pattern-contract` consuming `02-token` | `list-marker-style`, `supporting-text-style`, `spacing-scale` brochure token seams | missing evidence-section pattern | List meaning must come from text and list semantics, not marker color. |
| A link may appear near the evidence section. | `03-primitive` then later pattern/component | `brochure-text-link-action` primitive | none | Later layers may compose the primitive without recreating anchor behavior. |
| The section surface uses brochure panel styling. | `04-pattern-contract` consuming `02-token` | `surface-frame` brochure token seam | missing evidence-section pattern | Defer visual composition to Layer 4. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| default | The section presents one evidence claim summary and at least one evidence item as readable text. |
| no-link | The section remains complete without a link because the evidence text carries the meaning. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| reading and scanning | The section is meaningful in source order: label, heading, summary, then evidence list. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Button CTA behavior | Buttons use a separate primitive and event model. |
| App-page adoption | Later layer; this rule does not approve public-site implementation changes. |
| Canonical rendering | Later layer after a governed component or canonical scenario exists. |
| Proof status, validation, selected state, or workflow state | The evidence section describes evidence; it does not compute or expose state. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Evidence-section composition and runtime seam | `04-pattern-contract` | Needs a reusable section pattern that consumes signed brochure tokens. |
| Evidence-section action slot composition | `04-pattern-contract` | Optional supporting links must compose the governed primitive. |
| Public brochure page adoption | `08-first-app-adoption` | App pages must consume governed seams later rather than copying proof markup. |

## Mandatory Review Dimensions

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Reading order and list semantics must remain coherent. |
| zoomed in 150% | Text must wrap without clipping or overlap. |
| zoomed out 75% | Section remains scannable without relying on tiny decorative markers. |
| dark theme | No theme-specific behavior is approved yet; later proof must not rely on color alone. |
| desert theme | No theme-specific behavior is approved yet; later proof must not rely on color alone. |
| dark theme with error | Not applicable; this family has no error state. |
| desert theme with error | Not applicable; this family has no error state. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | The non-interactive section must not introduce tab stops. Links or buttons require a later governed primitive. |
| Focus | The section itself does not receive focus. Later interactive children must use governed focus behavior. |
| Names and semantics | The section must have a programmatic heading relationship and list semantics for evidence items. |
| Error and status communication | Not applicable; this family does not expose status or errors. |
| Color-independent meaning | Evidence meaning must be carried by text and list semantics, not marker color, surface treatment, or accent color alone. |
| Later proof owners | Layer 4 must prove heading/list semantics, responsive wrapping, and token consumption. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| none | none | `no` | No ungoverned dependency remains for optional standalone text links. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/brochure-evidence-section/BrochureEvidenceSection-Behaviour.md` |
| Stable lookup key | `shared/brochure-evidence-section/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review this rule as the narrow behavior lock for brochure evidence sections. | none |
| 2 | `04-pattern-contract` | Compose the evidence-section pattern and optional supporting action using signed brochure tokens and primitive seams. | none |
| 3 | `08-first-app-adoption` | Adopt the pattern into a public page only after later-layer approval. | App adoption remains outside this behavior rule. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next layer status | `allowed` |
| Reason | `The required visual and text values already exist as review-ready brochure tokens, and no new primitive is required for a non-interactive evidence section.` |
