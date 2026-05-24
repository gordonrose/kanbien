# Front-End Harness Accessibility

This folder defines the shared accessibility posture for the `41-front-end` harness.

The baseline is WCAG 2.2 Level AA.

The source baseline is the W3C "How to Meet WCAG (Quick Reference)" for WCAG 2.2:

- https://www.w3.org/WAI/WCAG22/quickref/

## How This Folder Is Used

`WCAG-2.2-AA-DEFAULT.md` defines the non-negotiable default accessibility policy.

`EVAL.md` defines the shared hostile evaluation posture for accessibility work.

Each layer in the `41-front-end` harness should add its own accessibility responsibility and layer-specific accessibility eval.

The shared policy applies to every governed front-end harness output unless an explicit, scoped, approved exception exists.

## Chain Of Custody

Accessibility is evaluated at the layer where the decision is introduced.

Later layers must preserve earlier accessibility decisions.

Later layers must not defer repair for a violation introduced earlier.

Passing automated accessibility checks is useful evidence, but it is not complete proof of WCAG 2.2 AA compliance.

## Exception Rule

An accessibility exception must be explicit.

An accessibility exception must be scoped to a specific criterion, layer, UI family, and reason.

An accessibility exception must name the mitigation, owner, and follow-up gate.

An accessibility exception must not be implied by urgency, visual preference, implementation difficulty, or incomplete tooling.

