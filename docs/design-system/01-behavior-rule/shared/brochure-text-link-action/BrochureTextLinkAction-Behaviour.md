# Brochure Text Link Action Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared with brochure proof first` |
| UI family | `brochure-text-link-action` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `none` |
| Proposed design-system URL | `/design-system/brochure/primitives/brochure-text-link-action` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/brochure-text-link-action/BrochureTextLinkAction-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/brochure-text-link-action/BrochureTextLinkAction-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | `Public reader navigating from brochure evidence or related content to a supporting page.` |
| Normal job | `Activate a standalone text link that clearly behaves as navigation without being mistaken for body copy or a button.` |
| Success outcome | `The reader can identify the link, tab to it, see visible focus, disclose full text when the label is truncated, and activate native navigation.` |
| Non-goals | `Button actions, product mutations, route authorization, app-page placement, analytics, downloads, or component APIs.` |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Public brochure pages use standalone text links for related navigation. | `03-primitive` | none | missing primitive | Record native link behavior here; defer implementation. |
| The text link uses emphasis color, underline treatment, and focus outline. | `02-token` then `03-primitive` | `focus-ring` exists; no signed link text/underline token | missing token seams | Defer visual values to Layer 2 before primitive implementation. |
| Links may appear near evidence sections. | `04-pattern-contract` or later | `brochure-evidence-section` excludes links today | missing primitive | Later patterns may consume this primitive after it is unblocked. |
| Standalone link labels may be longer than the available inline space. | `03-primitive` consuming `02-token` | default-only `truncating-label` is not valid inside an anchor | missing brochure tooltip tokens | The anchor primitive must own truncation and full-text disclosure without nesting another focusable primitive. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| default | Renders one native navigation link with visible text and an `href`. |
| visited | Browser may expose native visited behavior only if a later token decision approves it. |
| hover | Pointer hover may strengthen link affordance only through signed token values. |
| focus-visible | Keyboard focus must be visibly indicated without layout shift. |
| overflow | A long standalone label must remain one visible line with ellipsis and expose the full text through a governed disclosure surface. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| keyboard focus | Tab moves focus to the native link in document order. |
| overflow disclosure | Focus or pointer hover reveals the full label when the rendered label is truncated; Escape dismisses the disclosure without activating navigation. |
| activation | Enter or pointer activation follows native anchor navigation. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Button behavior | Buttons use a different primitive and event model. |
| Disabled links | A navigation link without an `href` is not approved by this rule. |
| App adoption | Later layer after primitive and pattern contracts are ready. |
| Route or permission decisions | Navigation destination ownership belongs to later product surfaces. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Evidence-section pattern link slot | `04-pattern-contract` | Can consume the primitive after primitive proof is review-ready. |
| Inline prose links | future behavior rule and primitive | Inline prose links have different line-flow and target-sizing behavior from standalone action links. |

## Mandatory Review Dimensions

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Link text and focus outline must remain coherent in inline direction. |
| zoomed in 150% | Standalone link text must stay one line with ellipsis when constrained, and full text must remain available through disclosure. |
| zoomed out 75% | Link remains visibly distinguishable from surrounding text. |
| dark theme | Link and focus visibility must be proven separately. |
| desert theme | Link and focus visibility must be proven separately. |
| dark theme with error | Not applicable; link has no error state. |
| desert theme with error | Not applicable; link has no error state. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Native anchor keyboard behavior must remain intact. |
| Focus | Focus-visible state must be obvious and must not rely on color alone. |
| Names and semantics | The visible label is the accessible name unless a later component adds approved context. |
| Overflow disclosure | Truncated visible text must not be the only carrier of meaning; the native anchor owns `aria-describedby` when full-text disclosure is required. |
| Error and status communication | Not applicable; this family has no error/status state. |
| Color-independent meaning | Underline or another signed non-color affordance must distinguish link behavior. |
| Later proof owners | Layer 2 must define link text/decor tokens; Layer 3 must prove focus and activation semantics. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

## Ungoverned Dependencies

No ungoverned dependencies remain for the standalone brochure text-link action
primitive. Link text, decoration, focus, target size, tooltip surface, and
tooltip text decisions now have consumable brochure token seams.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/brochure-text-link-action/BrochureTextLinkAction-Behaviour.md` |
| Stable lookup key | `shared/brochure-text-link-action/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review this rule as the narrow behavior lock for brochure text links. | none |
| 2 | `02-token` | Define link text, link decoration, tooltip surface, and tooltip text token seams for brochure. | Existing tokens do not own link visual treatment and full-text disclosure styling. |
| 3 | `03-primitive` | Implement native anchor primitive after tokens exist. | Blocked on Layer 2 until those tokens exist. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed after required tokens are consumable` |
| Reason | `The primitive needs signed link text/decor and disclosure tokens before it can render without hard-coded visual decisions.` |
