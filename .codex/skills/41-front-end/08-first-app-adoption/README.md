# First App Adoption Layer

## What It Is For

The first app adoption layer applies a governed component seam to one real app surface.

Its purpose is to prove that the seam is consumable without app-local recreation.

It should not invent new design-system behavior.

## Input

The input is a signed component seam, canonical scenario set, and target app surface.

The layer also needs the app's real data shape, route context, authorization or visibility constraints when relevant, and existing app import boundaries.

## Output

The output is one app surface consuming the governed seam through its public boundary.

The app may provide data, copy, and allowed configuration.

The app must not duplicate governed markup, controller behavior, or page-local CSS for the adopted family.

## Evaluation For 99% No-Rework Confidence

Check that the app imports the governed seam from the approved public path.

Check that the app does not copy design-system demo markup or controller logic.

Check that app-local CSS was not added or changed for governed layout or presentation.

Check that the production data shape matches or is honestly adapted to the seam's contract.

Check that missing seam capability causes a stop decision rather than a local workaround.

