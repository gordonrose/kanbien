# Text Overflow Disclosure Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `text-overflow-disclosure` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/tokens/tooltip`; `/design-system/tokens/page-header`; `/design-system/tokens/filter-panel-structure` |
| Proposed design-system URL | `none yet` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A user reading text inside a constrained UI element, and a maintainer building text-based primitives, patterns, or components. |
| Normal job | The user can understand visible text without layout breaking, and can access the full text when the visible text is truncated. |
| Success outcome | Text that does not fit truncates predictably, preserves surrounding layout, and exposes its full value through a governed disclosure behavior. |
| Non-goals | This rule does not define typography values, tooltip visuals, tooltip anatomy, CSS selectors, component APIs, demo routes, canonical files, app wrappers, or app adoption behavior. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Behavior States

Include only states that apply to this UI family.

Each row must describe observable behavior.

| State | Observable Behavior |
| --- | --- |
| fits available space | The text remains fully visible and no overflow disclosure is required. |
| truncated | The text is visually shortened without changing the underlying full text value. |
| full text requested | The user can access the full text through a governed disclosure behavior. |
| non-truncatable text | If truncation would remove required meaning that cannot be safely disclosed, the consuming layer must choose a layout or content strategy that preserves the full meaning instead of forcing truncation. |
| missing disclosure foundation | If required tooltip, disclosure, typography, or overflow token seams are missing, later layers must treat the surface as blocked rather than approximating the behavior locally. |

## Required Interactions

List only interactions that create behavior decisions for this family.

| Interaction | Observable Behavior |
| --- | --- |
| read visible text | The visible text must remain readable and must not overlap adjacent content or resize its fixed-format parent incoherently. |
| encounter truncated text | Truncation must signal that text is incomplete without relying on color alone. |
| request full text with pointer | Pointer users can reveal the full text when the consuming primitive or pattern supports pointer interaction. |
| request full text with keyboard | Keyboard users can reveal or reach the full text when the truncated text is inside or associated with a focusable element. |
| request full text on touch | Touch users must have a reachable way to access full text when the text is important for the task. |
| leave disclosure | The user can dismiss or move away from the full-text disclosure without losing orientation or trapping focus. |
| copy or inspect text | Later layers must decide whether the full text can be selected, copied, or only read; this behavior rule does not assume one answer for every surface. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Typography family, font size, font weight, line height, and letter spacing | These are Layer 2 token decisions. |
| Tooltip surface color, border, shadow, spacing, z-index, and motion | These are Layer 2 token decisions before tooltip primitives or patterns can consume them. |
| Tooltip trigger markup, ARIA details, keyboard handling, and dismissal controller behavior | These belong to `03-primitive` or a later pattern after required tokens exist. |
| Component-specific widths, line counts, slots, and responsive anatomy | These belong to the consuming primitive, pattern, or component seam. |
| Native `title` as the whole solution | Native `title` alone is not approved as governed disclosure because it is not consistently keyboard, touch, or assistive-technology reliable. |
| App-local truncation CSS or copied tooltip markup | Governed consumers must use later shared seams rather than local approximations. |

## Deferred Decisions

Use this section when a real decision exists but belongs to a later layer.

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Which typography values text-based primitives use | `02-token` | Text style needs signed reusable values before primitive work. |
| Which overflow, tooltip, surface, border, z-index, spacing, and motion values full-text disclosure uses | `02-token` | Disclosure visuals and layering must be signed before implementation. |
| Whether the first disclosure behavior is a tooltip primitive, popover primitive, inline expansion pattern, or another controlled disclosure | `03-primitive` or `04-pattern-contract` | The behavior rule requires access to full text but does not choose markup or controller anatomy. |
| Which text elements support single-line versus multi-line truncation | `03-primitive` or consuming pattern | The consuming primitive or pattern owns available space and line-count constraints. |
| Whether full text is copyable/selectable | `03-primitive` or consuming pattern | Copy behavior may vary by use case and should be explicitly governed where it matters. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Truncation direction, disclosure placement, and full-text reading order must remain understandable in RTL. |
| zoomed in 150% | Text must not overlap or break fixed-format parents; disclosure must remain reachable. |
| zoomed out 75% | Truncation affordance and full-text access must remain recognizable. |
| dark theme | Truncated text and disclosure access must not depend on original-theme-only visual distinctions. |
| desert theme | Truncated text and disclosure access must not depend on original or dark theme visual distinctions. |
| dark theme with error | Error or validation text that truncates must preserve full meaning and not rely on color alone. |
| desert theme with error | Error or validation text that truncates must preserve full meaning and not rely on color alone. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Keyboard users must be able to access full text when the truncated text is part of a focusable control, navigation item, field label, or task-critical surface. |
| Focus | Full-text disclosure must not trap focus unless a later governed overlay pattern explicitly owns that behavior. |
| Names and semantics | Truncation must not remove the accessible name or programmatic meaning of the text-bearing element. |
| Error and status communication | Error, validation, required, blocked, loading, and status text must preserve full meaning through visible or programmatic disclosure when truncated. |
| Color-independent meaning | Truncation, incomplete text, and disclosure availability must not rely on color alone. |
| Later proof owners | Contrast, text sizing, focus rendering, tooltip behavior, target size, layering, zoom, and rendered disclosure evidence belong to Layer 2 and later rendered-proof layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not rely on native `title` alone as the governed disclosure
solution unless a scoped temporary exception is explicitly approved.

Consumers must not silently truncate task-critical text without a governed way
to access the full text.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Typography tokens for text-based primitives | `02-token` | no | Text-based primitives cannot be called complete until required typography tokens exist. |
| Tooltip or full-text disclosure visual tokens | `02-token` | no | Tooltip/disclosure primitives or patterns cannot be called complete until visual, layering, and motion token seams exist or an explicit exception is approved. |
| Tooltip or disclosure primitive semantics and controller behavior | `03-primitive` or `04-pattern-contract` | no | Components and app surfaces cannot claim governed truncation-with-disclosure by copying route-local behavior. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md` |
| Stable lookup key | `shared/text-overflow-disclosure/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, copied fragments, or native `title` alone. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Layer 2 Token Ask

| Field | Value |
| --- | --- |
| Later layer | `02-token` |
| Ask summary | Define or confirm typography, overflow, tooltip/disclosure surface, border, z-index, spacing, focus, and motion token seams needed for text overflow disclosure. |
| Recognition result | The ask is reusable visual, sizing, and layering foundation work; local truncation CSS or tooltip styles would create drift across themes, zoom, RTL, and downstream consumers. |

| Needed Information | Status |
| --- | --- |
| Source behavior or downstream need | Known: all text-based elements must preserve layout and provide access to full text when truncated. |
| Existing token inventory check | Partial: current token readiness exists, but typography and disclosure tokens are not yet consumable. |
| Exact visual decision needed | Partially known: font size, weight, line height, tooltip/disclosure surface, border, z-index, spacing, focus, and motion decisions are needed; names and values are undecided. |
| Expected consumers | Known: future text, label, field, navigation, tooltip, select-card, and index-navigation primitives or patterns. |
| Supported themes | Known: original, dark, and desert themes must be reviewed. |
| Direction and magnification expectations | Known: RTL, 150% zoom, and 75% zoom must preserve visible text and disclosure access. |
| Review evidence needed | Missing: Layer 2 must define rendered evidence required before primitives or patterns claim readiness. |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review this behavior rule against `EVAL.md` and `ACCESSIBILITY-EVAL.md`. | No known behavior-rule blocker remains. |
| 2 | `02-token` | Define the smallest typography token seam needed by text-based primitives. | Text primitives are blocked without signed typography. |
| 3 | `02-token` | Define tooltip/disclosure visual, layering, spacing, focus, and motion tokens before tooltip disclosure is implemented. | Full disclosure behavior cannot be called governed until these foundations exist. |
| 4 | `03-primitive` | Define text or label primitives only after typography tokens exist, and define tooltip/disclosure primitives only after their required tokens exist. | Primitive work is blocked until the needed Layer 2 seams exist. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule defines the truncation and disclosure contract and identifies typography tokens as the next foundation before text-based primitive work. |
