# Toggle Control Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `toggle-control` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/templates/form` |
| Proposed design-system URL | not assigned at Layer 1 |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/toggle-control/ToggleControl-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/toggle-control/ToggleControl-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A user editing a form setting that can be either on or off. |
| Normal job | Change one named boolean setting without leaving the current form context. |
| Success outcome | The setting clearly communicates its current on/off value, and the user can change it with pointer, touch, keyboard, or assistive technology. |
| Non-goals | This rule does not govern checkbox lists, radio groups, card-list selections, dropdowns, drawer selects, accordions, workflow builders, persistence, validation copy, token values, primitive markup, pattern structure, demo routes, canonical files, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs, demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Form templates show a binary setting styled like a high-visibility toggle. | `01-behavior-rule`, `02-token`, `03-primitive` | `form-field` governs field-row label/helper/error posture only. | `toggle-control` behavior rule, tokens, and primitive are missing. | Binary setting behavior recorded here; visuals and primitive rendering deferred. |
| The source markup uses a checkbox input with a visual track. | `03-primitive` | none for toggles | Native-control strategy is not yet governed for this family. | Deferred; the primitive must choose and prove the semantic strategy. |
| Toggle copy includes label, helper text, and error text. | `01-behavior-rule`, `03-primitive`, `04-pattern-contract` | `form-field`; `field-row-control` | Toggle-field composition is not yet governed. | Label/helper/error ownership recorded; field composition deferred to pattern work. |
| The setting can be checked or unchecked. | `01-behavior-rule` | none for toggles | Toggle behavior rule was missing. | Recorded here. |
| Disabled, required, read-only, and error postures may be needed inside forms. | `01-behavior-rule`, `03-primitive` | `form-field` owns shared field states. | Toggle-specific native state behavior is missing. | Recorded as behavior; primitive semantics deferred. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| off | The setting is currently false or not enabled. |
| on | The setting is currently true or enabled. |
| default | The control is available and can be changed between on and off. |
| required | The containing form communicates that this setting must satisfy a form requirement; the toggle must not invent product validation copy. |
| read-only | The current value is presented but cannot be changed; the value must remain perceivable and not look like an enabled editable control. |
| disabled | The control cannot be changed or reached as an enabled control. |
| error | The control communicates invalid state and references error text when supplied; color alone must not carry error meaning. |
| truncated text | Any truncated label, helper, error, or state text must expose the full text through governed text-overflow disclosure. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| click or tap enabled toggle | Changes the value between on and off. |
| click or tap associated label area | Activates the same toggle control; the label area must not become a second competing control. |
| tab to enabled toggle | Focus reaches the toggle in the normal form order. |
| space on focused enabled toggle | Changes the value between on and off according to native checkbox/switch behavior. |
| enter on focused enabled toggle | Later primitive work must either preserve native browser behavior or explicitly document and prove the approved behavior. |
| leave toggle | Focus can move past the toggle without trapping the user. |
| request full truncated text | Full text is available only when text is actually truncated and must not be implemented with native `title` alone. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Track shape, thumb shape, on/off colors, borders, spacing, typography, iconography, focus ring, target size, and motion | These are Layer 2 token decisions. |
| Exact native input or ARIA strategy | This belongs to Layer 3 primitive work after token gates pass. |
| Field-row composition with label, helper, and error copy | This belongs to the later `toggle-field` pattern after the primitive exists. |
| Product validation, saving, persistence, form submission, or backend values | This family only governs boolean input behavior. |
| Checkbox lists or multi-select cards | Governed separately by card-list or checkbox families. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Toggle frame, track, thumb, state, target-size, focus, and motion values | `02-token` | Visual, sizing, and motion values must be signed before primitive rendering. |
| Native checkbox versus ARIA switch strategy | `03-primitive` | The primitive owns semantic rendering, keyboard behavior, and emitted value shape. |
| Event contract for value changes | `03-primitive` | The primitive owns the stable consumer boundary. |
| Field composition with field-row label/helper/error IDs | `04-pattern-contract` | The pattern composes accepted primitives without recreating toggle markup. |
| Rendered proof route controls for state, disabled, read-only, error, RTL, theme, long text, and width pressure | `03-primitive` and `04-pattern-contract` | Rendered evidence belongs with the primitive and field pattern once tokens exist. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Label order, control placement, state reading order, and keyboard behavior must remain understandable. |
| zoomed in 150% | Text must not overlap its container; target size and focus visibility must remain usable. |
| zoomed out 75% | The on/off state and hit target must remain stable and distinguishable. |
| dark theme | Later rendered proof must show label, control, focus, on/off, disabled, and helper text remain readable. |
| desert theme | Later rendered proof must show label, control, focus, on/off, disabled, and helper text remain readable. |
| dark theme with error | Later rendered proof must show error meaning, focus, and on/off state remain distinguishable without relying on color alone. |
| desert theme with error | Later rendered proof must show error meaning, focus, and on/off state remain distinguishable without relying on color alone. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Enabled toggles must be reachable and changeable by keyboard without trapping focus. |
| Focus | Focus must be visible on the active toggle control. |
| Names and semantics | The toggle must expose one programmatic name and one boolean state. |
| Error and status communication | Error state must expose invalid semantics and associated error text when supplied; on/off meaning must be programmatically available. |
| Color-independent meaning | On, off, disabled, read-only, required, and error states must not rely on color alone. |
| Later proof owners | Contrast, target size, focus geometry, state visuals, motion, text disclosure, and rendered browser evidence belong to Layer 2 and Layer 3. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy form-template, demo-route, screenshot, or app markup as governed adoption.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

Consumers must not silently truncate toggle label, helper, error, or state text without governed full-text disclosure.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Toggle visual, sizing, focus, and motion tokens | `02-token` | no | No primitive or pattern can claim governed visual readiness until signed tokens exist. |
| Toggle-control primitive render seam | `03-primitive` | no | No pattern, template, or app surface can consume toggle behavior as governed UI until the primitive exists. |
| Toggle-field pattern | `04-pattern-contract` | no | Form surfaces cannot consume a governed labelled toggle field until the pattern composes field-row and toggle primitives. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/toggle-control/ToggleControl-Behaviour.md` |
| Stable lookup key | `shared/toggle-control/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, template routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review and accept this behavior rule. | No known behavior-rule blocker remains. |
| 2 | `02-token` | Define the smallest toggle token set for frame, track/thumb state, focus, target size, and optional motion. | Primitive rendering is blocked without signed visual and interaction-state values. |
| 3 | `03-primitive` | Build the toggle-control primitive with stable semantics, keyboard/focus behavior, on/off state, disabled/read-only/error posture, and rendered proof controls. | Requires signed Layer 2 token seams. |
| 4 | `04-pattern-contract` | Compose toggle-control into `toggle-field` with `field-row-control`. | Patterns must not render local toggle markup. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule defines the stable interaction and accessibility contract, while visual, sizing, focus, and motion decisions remain deferred to signed tokens. |
