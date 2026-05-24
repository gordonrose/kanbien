# Canonical Scenarios Layer

## What It Is For

The canonical scenarios layer defines the stable review and regression cases for a governed UI family.

Canonicals should cover the states and dimensions that would create rework if missed.

They are evidence for the component seam, not a substitute for the contract.

## Input

The input is the demo page, component seam, and pattern contract.

The layer also needs the required viewport, theme, direction, density, data-volume, loading, empty, error, and interaction cases.

## Output

The output is a canonical scenario set with clear names, stable fixtures, and expected review dimensions.

Where executable visual scenarios exist, the output should link each scenario to its route, fixture, and assertion or screenshot purpose.

## Evaluation For 99% No-Rework Confidence

Check that every required contract state has a canonical or a justified exclusion.

Check that canonicals use representative data and do not encode impossible production fallbacks.

Check that responsive, RTL, dark mode, and magnification risks are covered when relevant.

Check that each canonical points at the governed seam rather than a copied render.

Check that scenario names are stable enough to survive future maintenance.

