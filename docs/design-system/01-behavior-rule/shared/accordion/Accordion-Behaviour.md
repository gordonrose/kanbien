# Accordion Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `accordion` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/templates/entity_management_page` |
| Proposed design-system URL | not assigned at Layer 1 |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/accordion/Accordion-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/accordion/Accordion-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A user reviewing or editing grouped form or builder content. |
| Normal job | Expand a named section to reach its content and collapse it when the section is no longer needed. |
| Success outcome | The user can tell which sections are open, move through section headers predictably, and reach nested controls without losing keyboard or assistive-technology context. |
| Non-goals | This rule does not govern field rows, text inputs, textarea growth, radio groups, card-list selects, toggles, dropdowns, drawer selects, workflow-builder behavior, persistence, validation, token values, primitive markup, pattern structure, demo routes, canonical files, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitive markup, token values, icon glyphs, frame geometry,
spacing, animation timings, pattern slots, component APIs, demo routes,
canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Entity form material references accordions for multi-section form content. | `01-behavior-rule`, `03-primitive`, `04-pattern-contract` | none for accordion | Accordion behavior, primitive, and pattern are missing. | Disclosure behavior is recorded here; primitive and pattern work deferred. |
| Sections need a visible title that opens and closes content. | `01-behavior-rule`, `03-primitive` | `truncating-label` exists for long text disclosure, but no accordion header primitive exists. | Accordion header semantics are missing. | The expand/collapse behavior is recorded; exact rendering is deferred. |
| Section content may contain governed form controls. | `01-behavior-rule`, `04-pattern-contract` | Existing field primitives and field patterns can be hosted later. | Nested-control composition is not yet governed. | The rule requires nested controls to keep their own semantics. |
| A page may contain multiple accordion sections. | `01-behavior-rule`, `04-pattern-contract` | none for accordion groups | Multi-section policy is missing. | Single-open group behavior is recorded here; group layout is deferred. |
| Visual affordances such as chevrons, borders, spacing, and motion may be expected. | `02-token`, `03-primitive` | partial token seams exist for text, focus, surface, and target size only. | Accordion-specific frame, indicator, and motion decisions are missing. | Deferred to Layer 2 and Layer 3. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| collapsed | The section header is visible and the associated content region is not visible or reachable through normal navigation. |
| expanded | The section header is visible and the associated content region is visible and reachable after the header. |
| disabled | The section cannot be expanded or collapsed and must communicate that it is unavailable. |
| read-only content | The section may expand and collapse, but any hosted read-only controls preserve their own read-only behavior. |
| error contains content | The section may communicate that nested content contains an error, but the nested field or control owns the actual error text and invalid semantics. |
| truncated text | Any truncated section title or summary text must expose the full text through governed text-overflow disclosure. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| click or tap enabled header | Toggles that section between collapsed and expanded. |
| Enter on focused enabled header | Toggles that section. |
| Space on focused enabled header | Toggles that section. |
| Tab through accordion | Focus reaches headers and any visible nested controls in document order without trapping the user. |
| Collapse section with focused descendant | Focus must move to the collapsed section header or another predictable governed target. |
| Open another section in a grouped accordion | The newly opened section becomes expanded and any other expanded section in the same governed group collapses. |
| Nested controls | Hosted controls keep their own labels, focus behavior, validation semantics, text disclosure, and events. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Header height, padding, border, radius, gap, chevron size, surfaces, focus ring, target size, and motion | These are Layer 2 token decisions. |
| Exact HTML strategy such as native `details` or button plus region | This belongs to Layer 3 primitive work. |
| Group layout, section ordering, content slots, and multi-section composition | These belong to Layer 4 pattern work. |
| Field validation, product save behavior, generated form schemas, or backend values | Accordion only governs disclosure behavior. |
| Workflow-builder steps or drag/reorder behavior | Workflow builder needs its own behavior rule. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Accordion frame, header spacing, divider, indicator, and motion values | `02-token` | Visual, sizing, and motion values must be signed before primitive rendering. |
| Header semantics and content-region relationship | `03-primitive` | The primitive owns accessible expand/collapse semantics and keyboard behavior. |
| Event contract for section toggles | `03-primitive` | The primitive owns the stable consumer boundary. |
| Multi-section accordion group structure | `04-pattern-contract` | The pattern composes accepted section primitives and owns single-open coordination without recreating section header behavior. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Header label, indicator placement, expanded region order, and keyboard behavior must remain understandable. |
| zoomed in 150% | Header text, indicator, focus ring, and nested controls must not overlap or clip without disclosure. |
| zoomed out 75% | Open and closed states must remain visually and semantically distinguishable. |
| dark theme | Later rendered proof must show headers, indicators, focus, borders, and content surfaces remain readable. |
| desert theme | Later rendered proof must show headers, indicators, focus, borders, and content surfaces remain readable. |
| dark theme with error | Later rendered proof must show nested error presence without relying on color alone. |
| desert theme with error | Later rendered proof must show nested error presence without relying on color alone. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Enabled accordion headers must be reachable and toggleable by keyboard without trapping focus. |
| Focus | Focus must be visible on the active header and must remain predictable when content collapses. |
| Names and semantics | Each header must expose an accessible name and a programmatic expanded/collapsed relationship to its content. |
| Error and status communication | Error presence may be summarized at the section level, but nested controls own actual invalid semantics and error text. |
| Color-independent meaning | Expanded, collapsed, disabled, and error-containing states must not rely on color alone. |
| Later proof owners | Contrast, target size, indicator geometry, motion, text disclosure, nested-focus behavior, and rendered browser evidence belong to later layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy template-route, screenshot, canonical, or app markup as
governed accordion adoption.

Consumers must not weaken nested control accessibility with accordion wrapper
markup.

Consumers must not silently truncate accordion title, summary, status, or error
text without governed full-text disclosure.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Accordion frame, indicator, spacing, focus, target-size, and motion tokens | `02-token` | no | No primitive or pattern can claim governed visual readiness until signed tokens exist. |
| Accordion section primitive render seam | `03-primitive` | no | No pattern, template, or app surface can consume accordion behavior as governed UI until the primitive exists. |
| Accordion group pattern | `04-pattern-contract` | no | Entity body forms cannot consume accordion groups as governed structures until the pattern composes accepted section primitives. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/accordion/Accordion-Behaviour.md` |
| Stable lookup key | `shared/accordion/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, template routes, canonical routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review and accept this behavior rule. | No known behavior-rule blocker remains. |
| 2 | `02-token` | Define the smallest accordion token set for header/content frame, indicator, focus, target size, and optional motion. | Primitive rendering is blocked without signed visual and interaction-state values. |
| 3 | `03-primitive` | Build the accordion-section primitive with stable semantics, keyboard/focus behavior, expanded/collapsed state, disabled posture, and rendered proof controls. | Requires signed Layer 2 token seams. |
| 4 | `04-pattern-contract` | Compose accordion sections into an accordion group pattern. | Patterns must not render local accordion header behavior. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule defines the stable disclosure and accessibility contract, while visual, sizing, focus, indicator, and motion decisions remain deferred to signed tokens. |
