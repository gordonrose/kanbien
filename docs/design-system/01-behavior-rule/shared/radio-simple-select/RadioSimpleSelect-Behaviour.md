# Radio Simple Select Behavior

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `radio-simple-select` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/canonicals/choice-group`; `/design-system/templates/form`; `/design-system/default/patterns/entity-panel` |
| Proposed design-system URL | `/design-system/default/primitives/radio-simple-select` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/radio-simple-select/RadioSimpleSelect-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/radio-simple-select/RadioSimpleSelect-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A user completing a form section that asks them to choose one answer from a small set of options. |
| Normal job | Choose one option from a named radio group, with optional supporting text on the group or options. |
| Success outcome | The chosen option is clearly selected, all other options in the group are unselected, and the group remains keyboard and assistive-technology usable. |
| Non-goals | This rule does not govern multi-select choices, priority card selection, view/hide card selection, drawer select, dropdown, toggle, accordion, workflow builder, form persistence, validation copy, token values, primitive markup, pattern structure, demo routes, canonical files, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs, demo routes, canonical files, app imports, or app wrappers.

This rule exists because entity body panels need a reusable way to ask one named question and let the user choose one answer from a small option set. The behavior must stay stable even when the selected design system changes the visual skin.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| A group label names the question, such as `Feature status`. | `01-behavior-rule` | `form-field` governs label association generally. | Radio-specific group naming rule was missing. | Recorded here. |
| The group label may include supporting text. | `01-behavior-rule` and `03-primitive` | `text-overflow-disclosure` governs truncated text disclosure. | Radio primitive must wire group description IDs later. | Recorded as behavior; primitive wiring deferred. |
| Exactly one option may be selected from the group at a time. | `01-behavior-rule` | none | Radio-specific behavior rule was missing. | Recorded here. |
| Options may have label-only or label-plus-supporting-text variants. | `01-behavior-rule` and `03-primitive` | `text-overflow-disclosure` governs truncated text disclosure. | Radio option primitive must wire optional description text later. | Recorded as behavior; primitive anatomy deferred. |
| Options can be arranged in 1, 2, 3, or 4 columns. | `02-token` and `03-primitive` | none | Signed layout token and primitive rendering are missing. | Deferred; not defined here. |
| Selected, default, disabled, required, and error states need visible and semantic differences. | `01-behavior-rule`, `02-token`, and `03-primitive` | `form-field` governs shared field state posture. | Radio-specific state tokens and primitive wiring are missing. | Behavior recorded; visuals and attributes deferred. |
| Long group or option text must truncate safely and disclose full text. | `01-behavior-rule` and `03-primitive` | `text-overflow-disclosure` | Radio primitive must consume governed disclosure rather than local tooltip behavior. | Recorded as mandatory behavior. |

## Behavior Contract

A radio simple select lets the user choose one value from a named group of mutually exclusive options.

The group must have one programmatic name. Optional group supporting text may describe the choice, but it must not replace the group name.

Each option must have one programmatic label. Optional option supporting text may describe the option, but it must not replace the option label.

Selecting an enabled option makes it the selected value and clears the previously selected option in the same group.

The group may start with no selected option unless a later form contract requires a default value. Required state means the form cannot be completed without a selection; it does not force a primitive to invent a default selection.

The primitive must preserve native radio input behavior unless a later approved exception explicitly replaces it.

## Behavior States

| State | Observable Behavior |
| --- | --- |
| default | The group is available, enabled options can be selected, and one or zero options may currently be selected depending on supplied value. |
| selected option | The selected option is the group's current value and all other options in the same group are unselected. |
| required group | The group communicates that a selection is required without inventing product validation copy. |
| disabled group | No option in the group can be changed or reached as an enabled control. |
| disabled option | The disabled option cannot be selected, while other enabled options in the group remain usable. |
| error group | The group communicates invalid state and references error text when supplied; color alone must not carry the error meaning. |
| label-only option | The option exposes a label and no option description. |
| label-with-supporting-text option | The option exposes a label plus associated supporting text. |
| truncated text | Any truncated group label, group supporting text, option label, or option supporting text must expose the full text through governed text-overflow disclosure. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| click or tap enabled option | Selects that option and clears the previous selection in the same group. |
| click or tap option label area | Activates the associated radio option; the label area must not become a separate competing control. |
| tab into group | Focus enters the native radio group according to browser radio behavior. |
| arrow through enabled radios | Native same-name radio keyboard behavior is preserved; arrow navigation must not be replaced by local listbox or card logic. |
| space on focused radio | Selects the focused enabled radio according to native behavior. |
| leave group | Focus can move past the group without trapping the user. |
| request full truncated text | Full text is available only when text is actually truncated and must not be implemented with native `title` alone. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Radio indicator shape, option card border, selected background, spacing, radius, typography, and grid gaps | These are Layer 2 token decisions. |
| Exact 1, 2, 3, or 4 column CSS implementation | This belongs to Layer 2 layout tokens and the Layer 3 primitive render seam. |
| Product validation, saving, persistence, form submission, or backend values | This family only governs the input behavior. |
| Multi-select choices | Checkbox or card-list selection families must govern those behaviors separately. |
| Priority ordering, view/hide selection, drawer select, dropdown, toggle, accordion, or workflow builder behavior | These are separate downstream form families. |
| Read-only radio behavior | Native radio inputs do not support `readonly`; a later form or pattern contract must explicitly define non-editable display behavior before use. |

## Deferred Decisions

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Group and option typography values | `02-token` | Text styling must be signed before primitive rendering. |
| Option frame, selected/default/disabled/error visual states, indicator treatment, and focus ring usage | `02-token` | Visual and state values must come from signed tokens. |
| Column layout values for 1, 2, 3, and 4 column variants | `02-token` | Layout values must be reusable and reviewable before primitive work. |
| Native radio markup, IDs, `name`, `checked`, `required`, `disabled`, `aria-invalid`, `aria-describedby`, and change event contract | `03-primitive` | The primitive owns semantic rendering and the consumer boundary. |
| Rendered proof route with controls for option subtext, group subtext, columns, RTL, width pressure, disabled option, required, error, and long text disclosure | `03-primitive` | Rendered evidence belongs with the primitive proof once tokens exist. |

## Mandatory Review Dimensions

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Group, option text, radio indicator placement, and column order must remain understandable and keyboard behavior must remain native. |
| zoomed in 150% | Text must not overlap its container; truncated text must expose full text when truncation occurs. |
| zoomed out 75% | Option hit areas and selected state must remain visually distinct and stable. |
| dark theme | Later rendered proof must show the group, options, focus, selected state, disabled state, and supporting text remain readable. |
| desert theme | Later rendered proof must show the group, options, focus, selected state, disabled state, and supporting text remain readable. |
| dark theme with error | Later rendered proof must show error meaning, error text, focus, and selected state remain distinguishable without relying on color alone. |
| desert theme with error | Later rendered proof must show error meaning, error text, focus, and selected state remain distinguishable without relying on color alone. |
| narrow width | One-column rendering must remain usable and disclose truncated text. |
| 1, 2, 3, and 4 columns | Later rendered proof must show each approved column count. |
| disabled option | Disabled option behavior must be semantic, not color-only. |
| error group | Error meaning must be text-backed and programmatically associated with the group. |

## Accessibility Contract

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Native radio keyboard behavior must be preserved for same-name options. |
| Focus | Focus must be visible and must stay on the native radio option or its approved primitive wrapper without trapping the user. |
| Names and semantics | The group must expose a programmatic group name, and each option must expose a programmatic option label. |
| Description wiring | Optional group and option supporting text must be programmatically associated when it provides task-relevant meaning. |
| Error and status communication | Error state must expose invalid semantics and associated error text when supplied; product validation copy is not invented here. |
| Color-independent meaning | Selected, disabled, required, and error states must not rely on color alone. |
| Text disclosure | Truncated group or option text must preserve accessible meaning and expose full text through governed disclosure. |
| Later proof owners | Contrast, target size, state colors, column geometry, text disclosure, and rendered browser evidence belong to Layer 2 and Layer 3. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy older choice-group, form-template, demo-route, or screenshot markup as governed adoption.

Consumers must not replace native radio behavior with div, button, listbox, or card selection behavior unless a later approved exception explicitly changes the primitive contract.

Consumers must not silently truncate group or option text without governed full-text disclosure.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Radio simple select visual and layout tokens | `02-token` | no | No primitive or pattern can claim governed visual readiness until signed tokens exist. |
| Radio simple select primitive render seam | `03-primitive` | no | No pattern, template, or app surface can consume radio simple select as governed UI until the primitive exists. |
| Text-overflow disclosure primitive behavior for truncated radio text | `03-primitive` | no | Radio proofs cannot claim full truncation readiness unless disclosure appears only when truncation is real. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/radio-simple-select/RadioSimpleSelect-Behaviour.md` |
| Stable lookup key | `shared/radio-simple-select/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making token, primitive, pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve group naming, single-selection behavior, native radio semantics, option and group supporting-text behavior, mandatory review dimensions, accessibility contract, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, older choice-group routes, form template markup, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review and accept this behavior rule. | No known behavior-rule blocker remains. |
| 2 | `02-token` | Define the smallest radio simple select token set for text, frame, state, indicator, focus, and column layout. | Primitive rendering is blocked without signed visual and layout tokens. |
| 3 | `03-primitive` | Build the radio simple select primitive with native radio semantics and rendered proof controls. | Requires signed Layer 2 token seams. |
| 4 | `04-pattern-contract` | Compose radio simple select into form/body patterns only after primitive readiness. | Patterns must not render local radio markup. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behavior rule defines the stable interaction and accessibility contract, while all visual, sizing, and layout decisions remain deferred to signed tokens. |
