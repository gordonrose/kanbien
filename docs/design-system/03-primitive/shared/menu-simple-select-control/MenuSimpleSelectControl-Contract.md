# Menu Simple Select Control Primitive Contract

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| Token dependency systems | `default` |
| UI family | `menu-simple-select` |
| Primitive name | `menu-simple-select-control` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/menu-simple-select/MenuSimpleSelect-Behaviour.md` |
| Shared primitive contract path | `docs/design-system/03-primitive/shared/menu-simple-select-control/MenuSimpleSelectControl-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/menu-simple-select-control/MenuSimpleSelectControl-Proof.md` |
| Files affected now | shared primitive contract, default proof, runtime seam, proof route, focused tests, readiness index |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Compact trigger opens an anchored single-select menu, updates the selected value, and supports keyboard traversal and dismissal. |
| Primitive job | Own text-trigger and icon-trigger variants, listbox, option semantics, selected-value updates, disabled behavior, keyboard handling, and token consumption for one compact select. |
| Expected consumers | Later `04-pattern-contract` work for rich option rows and entity page header composition. |
| Non-goals | Token values, product routing, persistence, async loading, search, virtualized lists, header slot placement, component seam, demo route, canonical scenario, app adoption. |

## Layer Boundary

This PrimitiveDefinitionArtifact may define primitive decisions only.

It must not define token values, pattern composition, component APIs, demo
routes, canonical files, app imports, app wrappers, product workflow, or
app-local CSS.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Primitive Action |
| --- | --- | --- | --- | --- |
| Trigger opens a compact anchored menu. | `03-primitive` | none in active chain | primitive missing | Create primitive render/controller seam. |
| Trigger can be text-backed or square icon-only. | `03-primitive` with `02-token` frame and glyph-registry support | no primitive variant yet | icon trigger variant missing | Primitive owns trigger variant and semantic trigger-icon selection, preserving accessible label/current value when visible text is omitted. |
| Listbox exposes mutually exclusive options and exactly one current option. | `03-primitive` | none in active chain | primitive missing | Primitive owns selected semantics and hidden value reflection. |
| Escape/outside click dismisses without changing value. | `03-primitive` | none in active chain | controller missing | Primitive owns dismissal behavior. |
| Arrow keys traverse enabled options. | `03-primitive` | none in active chain | controller missing | Primitive owns keyboard traversal. |
| Option row may display eyebrow and trailing label. | `03-primitive` for semantics, later `04-pattern-contract` for rich data composition | none | pattern missing | Primitive allows optional text fields; pattern owns data mapping and header placement. |
| Token values for trigger, chevron affordance, panel, option, current, disabled, focus, and text are required. | `02-token` | `menu-simple-select-frame`, `label-text-style`, `supporting-text-style`, `focus-ring`, `minimum-target-size` | none | Consume signed token seams. |

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Required tokens consumable by selected systems | `yes` |
| Primitive inventory checked | `docs/design-system/03-primitive/primitive-readiness-index.md`; no active `menu-simple-select-control` existed. |

## Token Dependencies

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Primitive Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `menu-simple-select-frame` | `docs/design-system/02-token/shared/menu-simple-select-frame/MenuSimpleSelectFrame-Contract.md` | `default` | `docs/design-system/02-token/systems/default/menu-simple-select-frame/MenuSimpleSelectFrame-Implementation.md` | `src/frontend/designSystem/layers/02-token/menu-simple-select-frame/systems/default.mjs#menuSimpleSelectFrameTokenSpec` | Text trigger, chevron foreground, icon trigger, panel, option, current, disabled frames and scroll limits. | `consumable` |
| `label-text-style` | `docs/design-system/02-token/shared/label-text-style/LabelTextStyle-Contract.md` | `default` | `docs/design-system/02-token/systems/default/label-text-style/LabelTextStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec` | Trigger value and option main label text. | `consumable` |
| `supporting-text-style` | `docs/design-system/02-token/shared/supporting-text-style/SupportingTextStyle-Contract.md` | `default` | `docs/design-system/02-token/systems/default/supporting-text-style/SupportingTextStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/supporting-text-style/systems/default.mjs#supportingTextStyleTokenSpec` | Uppercase trigger label, option eyebrow, and trailing label text. | `consumable` |
| `focus-ring` | `docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md` | `default` | `docs/design-system/02-token/systems/default/focus-ring/FocusRing-Implementation.md` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` | Visible keyboard focus. | `consumable` |
| `minimum-target-size` | `docs/design-system/02-token/shared/minimum-target-size/MinimumTargetSize-Contract.md` | `default` | `docs/design-system/02-token/systems/default/minimum-target-size/MinimumTargetSize-Implementation.md` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` | Trigger and option minimum interactive target. | `consumable` |

## Behavior Contract

The primitive renders one trigger and one anchored listbox of options. The
trigger may be text-backed or square icon-only. It opens from the trigger,
closes on dismissal, updates the current value when an enabled option is
selected, and reflects that value in a hidden input for containing forms or
controllers.

At mobile constrained widths, the opened menu may become a full-viewport sheet
with an explicit close button. The sheet header must sit outside the actual
`role="listbox"` element so options remain the only listbox children.

The primitive owns keyboard open, traversal, selection, and Escape dismissal.
It does not own product state, route navigation, data fetching, or header
placement.

## Accessibility Contract

The trigger must expose an accessible name that includes the control label and
current value. The menu must expose listbox semantics, and each option must
expose selected and disabled state. Keyboard operation must work without a
pointer. Focus must return predictably after selection or dismissal.

The icon-only trigger must keep the same accessible name and current-value
announcement as the text trigger even when no visible trigger text is rendered.

This primitive follows the shared WCAG 2.2 AA default.

## Allowed States

| State | Required Behavior |
| --- | --- |
| `closed` | Trigger shows current value and menu is hidden. |
| `open` | Menu is visible, anchored to trigger, and option focus can move by keyboard. |
| `disabled` | Trigger cannot open and value cannot change. |
| `empty` | Trigger communicates no options and does not offer fake choices. |

## Trigger Variants

| Variant | Required Behavior |
| --- | --- |
| `text` | Trigger shows the uppercase control label, current value, and green chevron affordance using governed token values. |
| `icon` | Trigger renders as a square icon-only target with a governed semantic glyph such as filter or sort while preserving the full accessible trigger name and current-value announcement. |

## Data Or Event Contract

The primitive accepts a non-empty label, a name, an optional current value, and
an array of options with `value`, `label`, optional `eyebrow`, optional
`trailingLabel`, and optional `disabled`. Option values and labels must be
non-empty strings. On selection, the primitive updates its hidden input and
current label.

## Text Overflow Disclosure

| Field | Value |
| --- | --- |
| Can visible text be constrained? | `yes` |
| Text-disclosure primitive dependency | `not yet consumed; later pattern must use truncating-label if rich option text can truncate` |
| Full-text disclosure behavior | Primitive proof keeps short source text; long-text disclosure is blocked until a truncating-label composition revision. |
| Fitting-text evidence | Focused unit proof only. |
| Truncated-text evidence | `blocked` |
| Forbidden fallback | `raw ellipsis, clipping, title-only disclosure, route-local tooltip logic, or copied controller behavior` |

## Visual-Skin Boundary

The default proof consumes signed token seams for all surfaces, borders,
radius, spacing, sizing, focus, and text styles. Design-system
implementations may vary those values only through the token seams. They must
not change listbox semantics, keyboard behavior, disabled behavior, or selected
state exposure.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned primitive module | `src/frontend/designSystem/layers/03-primitive/menu-simple-select-control/index.mjs` |
| Planned primitive export | `menuSimpleSelectControlPrimitive` |
| Allowed consumers | Later pattern-contract layers after this primitive passes. |
| Consumers must use | `src/frontend/designSystem/layers/03-primitive/menu-simple-select-control/index.mjs` |
| Consumers must not use | copied app markup, route-local design-system markup, screenshots, local CSS values, or duplicated controller behavior |

## Runtime Primitive Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `implemented` |
| Allowed seam shape | render helper plus attach controller |
| Planned module | `src/frontend/designSystem/layers/03-primitive/menu-simple-select-control/index.mjs` |
| Planned export | `menuSimpleSelectControlPrimitive` |
| Seam must own | State normalization, token resolution, trigger/listbox/option markup, keyboard behavior, selection updates, disabled behavior. |
| Seam must not own | route-local demo markup, app wrappers, page layout, product workflow, unsigned visual values, or header placement |
| First implementation posture | Smallest anchored select with optional option eyebrow/trailing text and no product data loading. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit test covers render markers, selected value, disabled and empty states, and controller source behavior. |
| accessibility | Unit test covers trigger/listbox/option attributes and selected/disabled semantics. |
| token consumption | Unit test covers required token dependencies. |
| rendered verification | Proof route exposes text trigger, icon trigger, theme, RTL, and constrained mobile review controls; Playwright browser execution depends on local Chromium dependencies. |
| text-disclosure audit | `npm run check:design-system-text-disclosure` must pass or report blocked text-disclosure work. |
| consumer boundary | Contract and readiness index forbid local recreation. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/primitives/menu-simple-select-control` |
| Rendered view status | `available` |
| If unavailable | not-applicable |

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
| Store shared primitive contract at | `docs/design-system/03-primitive/shared/menu-simple-select-control/MenuSimpleSelectControl-Contract.md` |
| Store system proof at | `docs/design-system/03-primitive/systems/default/menu-simple-select-control/MenuSimpleSelectControl-Proof.md` |
| Stable lookup key | `shared/menu-simple-select/menu-simple-select-control/03-primitive` |
| How later layers consume it | Later layers read the shared primitive contract and selected system proof by path or stable lookup key before making pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve behavior, accessibility, token dependencies, allowed states, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a primitive revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `03-primitive/EVAL.md` |
| Required accessibility eval | `03-primitive/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `03-primitive` | Treat this primitive as review-ready if focused tests pass. | none |
| 2 | `04-pattern-contract` | Compose the rich header menu select pattern using this primitive. | Requires primitive gate pass. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next layer status | `allowed` |
| Reason | The low-level select behavior and token consumption are now governed. |
