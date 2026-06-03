# Layer Work Preflight

Use this preflight before implementation for active governed frontend layers
`02-token`, `03-primitive`, and `04-pattern-contract`.

For route-derived, screenshot-derived, template-derived, canonical-derived,
or app-like source-material work, also use it before deciding which active
layer may proceed.

## Purpose

Prevent downstream layers from solving decisions that belong to earlier layers.

This preflight exists because written eval rules are not enough when an
assistant can produce plausible UI code before naming the decision it is
making.

## Required Decision Ledger

Before editing runtime code, proof routes, tests, or readiness indexes, create
a short ledger of the observed decisions that the work would affect.

The ledger may be prose or a table, but it must answer these fields for every
visible, behavioral, accessibility, interaction, responsive, overflow, scroll,
or state decision that appears in the source material or proposed change:

| Field | Required Answer |
| --- | --- |
| Observed decision | What the UI appears to need or currently does. |
| Owning layer | `01-behavior-rule`, `02-token`, `03-primitive`, `04-pattern-contract`, or later. |
| Existing governed seam | The behavior rule, token, primitive, pattern, or runtime seam that already owns it. |
| Missing seam | The earliest missing layer if no governed seam owns it. |
| Allowed action | Reuse existing seam, create/revise the owning lower layer, block, or mark proof-only. |

## Classification Rules

Behavior expectations, routing posture, scroll ownership, keyboard behavior,
and responsive mode meaning belong first in `01-behavior-rule`.

Visual values, sizing values, typography values, surface values, focus values,
icon sizes, marker shape, separator color, scrollbar skin, width/height limits,
and spacing values belong in `02-token` unless they are browser-native or
explicitly inherited from a containing governed seam.

Low-level reusable HTML semantics, ARIA behavior, keyboard/focus behavior,
event names, text truncation behavior, tooltip disclosure behavior, native
control posture, and stable primitive state meaning belong in `03-primitive`.

Composition of accepted primitives and child patterns, slot ownership,
multi-child layout, scroll-owner application across children, and alignment
across composed children belong in `04-pattern-contract`.

Route-local proof wrappers, constrained review slots, fixture counts, and
diagnostic controls may be proof-only only when the rendered proof says so and
browser evidence proves the control changes rendered evidence or preserves the
promised behavior.

## Failure Memory Checklist

Before allowing the proposed layer to proceed, answer these checks for the
source material or requested change. Any `yes` answer must be represented in
the decision ledger above.

| Check | Required Routing Pressure |
| --- | --- |
| Does the source include a button, trigger, handle, option, row action, close control, drag handle, resize affordance, or icon-only affordance? | Route to `03-primitive` unless a governed primitive seam already owns it. |
| Does the source include a layout map, ratio, minimum size, collapse order, overlay posture, or mobile mode? | Route behavior meaning to `01-behavior-rule` and visual/layout values to `02-token` before `04-pattern-contract`. |
| Does the source include typography, icon shape, chevron direction, surface, border, separator, marker, or spacing decisions? | Route to `02-token` unless those values are consumed through an existing governed primitive or child pattern. |
| Does an interaction move, reorder, resize, reveal, hide, dismiss, select, or change context? | Route keyboard, focus, and result-announcement requirements to `01-behavior-rule` and `03-primitive` before pattern composition. |
| Does the proposed proof need mobile, RTL, theme, zoom, constrained-width, overflow, or rerender evidence? | Record the proof as required evidence before readiness may be claimed. |
| Would the proposed work rely on copied route markup, screenshot anatomy, chat memory, shared CSS alone, or a legacy design-system route? | Block and identify the governed runtime seam that must exist first. |
| Could a proof route render without proving the actual signed decision? | Block until the proof renderer can show the governed behavior, dependency, and consumer boundary directly. |

## Stop Rules

Stop and route back to `01-behavior-rule` if the observed behavior does not
have a narrow behavior rule.

Stop and route back to `02-token` if a runtime visual, sizing, typography,
surface, marker, separator, scrollbar, width, height, scroll skin, or spacing
decision has no signed token and is not browser-native, inherited, or
proof-only.

Stop and route back to `03-primitive` if a pattern would render a low-level
interactive affordance, text-disclosure behavior, native-control behavior,
panel header, trigger, item control, or tooltip locally.

Stop and route back to `04-pattern-contract` if a later layer would compose
multiple primitives or child patterns locally.

Stop if a rendered proof control would be inert or if no browser evidence will
assert the behavior the control is supposed to exercise.

Stop if a tactile interaction lacks a recorded keyboard path, focus result, and
assistive-technology result feedback when the action changes order, position,
size, visibility, selection, or context.

## Examples

`header fixed height` belongs to `02-token` for the signed height values and
`03-primitive` for the header semantics and sticky behavior. A pattern must not
invent it locally.

`add icon button` belongs to `03-primitive`. A pattern may compose it, but must
not render its button markup locally.

`custom scrollbar styling` belongs to `02-token` and `03-primitive` before a
pattern may use it. If no scrollbar token exists, the only allowed posture is
browser-native scrollbars or blocked.

`secondary panel list starts under the header` belongs to `04-pattern-contract`
because it is alignment behavior across composed panels.

`tooltip appears only when text is truncated` belongs to `03-primitive`
because it is text-disclosure behavior tied to measured overflow.
