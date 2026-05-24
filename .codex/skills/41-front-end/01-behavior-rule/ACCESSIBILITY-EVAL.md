# Behavior Rule Accessibility Eval

This eval extends:

- `../accessibility/WCAG-2.2-AA-DEFAULT.md`
- `../accessibility/EVAL.md`

Assume the behavior rule has not met WCAG 2.2 AA by default until the checks below pass.

## Layer Accessibility Ownership

The behavior rule owns the plain-language accessibility promise.

It does not need to prove rendered contrast, DOM semantics, or keyboard implementation yet.

It must define the observable accessibility responsibilities that later layers must preserve.

## Required Evidence

Pass only if the rule references the shared WCAG 2.2 AA default or states why no accessibility-impacting behavior exists.

Pass only if keyboard expectations are stated or explicitly marked not applicable with a reason.

Pass only if focus expectations are stated or explicitly marked not applicable with a reason.

Pass only if accessible names, visible labels, semantics, or status communication responsibilities are stated when relevant.

Pass only if error or validation behavior is stated when the family can show errors.

Pass only if visual accessibility risks are assigned to the correct later layer when they cannot be proven here.

Pass only if the rule says consumers must not weaken the accessible behavior through app-local recreation.

## Fail Conditions

Fail if the rule only says "accessible", "WCAG compliant", or "screen-reader friendly."

Fail if keyboard operation is relevant but absent.

Fail if focus behavior is relevant but absent.

Fail if the family includes icon-only, visual-only, status, error, or loading behavior without naming how meaning will be communicated.

Fail if color, position, shape, or motion can be the only carrier of meaning.

Fail if target size, zoom, or constrained-space behavior is relevant but not assigned.

Fail if an accessibility concern is deferred without naming the later layer that owns it.

Fail if an exception is implied instead of explicit.

## Pass Result

Use `accessibility-pass` only when the behavior rule states the applicable WCAG 2.2 AA responsibilities in observable language.

## Exception Result

Use `accessibility-exception-approved` only when the exception names the criterion or risk, scope, reason, mitigation, owner, and follow-up gate.

