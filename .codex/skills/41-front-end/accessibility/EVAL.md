# Shared Accessibility Eval

Use this eval posture for every `41-front-end` layer.

Assume accessibility was missed until the layer proves otherwise.

Assume a passing automated scan is incomplete until manual and contract-level risks are addressed.

## Required Eval Questions

Which accessibility-relevant decision did this layer introduce?

Which WCAG 2.2 A or AA coverage areas apply to that decision?

Where is the accessibility requirement written down?

Where is the evidence that the requirement is satisfied?

Which later layer must preserve this decision?

What would fail if a later app implementation copied, wrapped, restyled, or partially reimplemented the governed seam?

## General Failure Conditions

Fail if the artifact says "accessible" without naming observable requirements.

Fail if keyboard behavior is required but unspecified.

Fail if focus order, focus visibility, or focus restoration is relevant but unspecified.

Fail if accessible name, role, value, or state ownership is unclear.

Fail if visible labels and accessible names can diverge without a stated reason.

Fail if color, position, shape, icon-only presentation, or motion is the only way meaning is communicated.

Fail if contrast evidence is absent for a visual token or rendered surface that introduces foreground/background decisions.

Fail if target-size risk is introduced without a size rule or valid exception.

Fail if error states lack text identification or recovery guidance.

Fail if status, loading, success, or failure messages are visually present but not programmatically determinable when required.

Fail if a tactile interaction changes item order, item position, panel size,
visibility, selection, or context without programmatic result feedback when a
screen-reader user would not otherwise know what changed.

Fail if a reorder, move, resize, drag/drop, dismiss, expand, collapse, menu,
popover, drawer, or overlay interaction loses focus, moves focus to an
unexplained target, or omits the required focus retention or restoration rule.

Fail if a keyboard shortcut is required but the artifact does not name the
shortcut, the browser or assistive-technology conflict risk, and the rationale
or reference pattern used to choose it.

Fail if an icon-only control has no accessible name, or if a collapsed/mobile
menu replaces an icon-only control without exposing the control's human-readable
name in the menu item.

Fail if a tactile interaction communicates the result only through position,
color, shape, motion, or visual layout when nearby textual context is available
and relevant.

Fail if a component seam requires normal consumers to manually wire critical ARIA for standard use.

Fail if a demo or app adoption passes only because of fixture behavior that production does not have.

Fail if app adoption adds local CSS, wrapper markup, or controller logic that weakens the governed accessible seam.

Fail if an accessibility issue is deferred without an explicit approved exception.

## Evidence Expectations

Static evidence should show that the contract names the relevant accessibility requirements.

Automated evidence should run against the rendered surface when a rendered surface exists.

Keyboard evidence should cover tab order, activation, escape or dismissal behavior, and trap prevention where relevant.

Focus evidence should cover visible focus, focus movement, focus restoration, and focus not being obscured where relevant.

Screen reader evidence should be approximated with semantic DOM assertions when live assistive technology review is not available.

Contrast evidence should cover approved themes and states.

Manual evidence should describe the human-reviewed risks that automation cannot prove.

## Eval Result Language

Use `accessibility-pass` only when applicable WCAG 2.2 A and AA responsibilities for the layer have evidence.

Use `accessibility-blocked` when required evidence cannot be gathered.

Use `accessibility-fail` when the layer violates or omits an applicable requirement.

Use `accessibility-exception-approved` only when an explicit exception exists with scope, reason, mitigation, owner, and follow-up gate.
