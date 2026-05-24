# Demo Page Layer

## What It Is For

The demo page layer creates a governed review surface for the component seam.

The demo page proves the seam visually and interactively.

The demo page is not the source of truth and must not be copied into app pages.

## Input

The input is a component seam and the scenarios required by the pattern contract.

The layer also needs representative fixtures, viewport requirements, theme requirements, direction requirements, and magnification requirements.

## Output

The output is a design-system demo route or equivalent review surface that consumes the same seam intended for app adoption.

It should expose the relevant states without adding route-local behavior that is absent from the seam.

It should make visual review easy without turning into a broad exploratory playground.

## Evaluation For 99% No-Rework Confidence

Check that the demo imports the component seam rather than rebuilding the pattern.

Check that all required states from the contract are visible or reachable.

Check that theme, direction, responsive, and magnification expectations are rendered honestly.

Check that demo-only controls do not become hidden product behavior.

Check that no app adoption decision depends on copying demo route markup or CSS.

