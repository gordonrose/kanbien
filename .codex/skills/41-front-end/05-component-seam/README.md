# Component Seam Layer

## What It Is For

The component seam layer turns a governed pattern into something both the design-system surface and the app can consume.

The seam may be a component, render function, controller, adapter, CSS module export, or another named public interface.

This is the primary anti-drift layer.

## Input

The input is an accepted pattern contract and the target consumer context.

The layer also needs existing export conventions, app import boundaries, and any controller or data-adapter requirements.

## Output

The output is a named consumable seam with a stable public import path and documented responsibilities.

The design-system demo and first app adoption should be able to consume the same seam.

The output should include any fixture or adapter shape needed to keep demos honest.

## Evaluation For 99% No-Rework Confidence

Check that the seam is the only approved way for consumers to use the pattern.

Check that the seam does not depend on a demo route or app-local page implementation.

Check that the seam exposes behavior and structure without requiring consumers to copy markup or controller logic.

Check that the seam preserves the pattern contract's accessibility and state requirements.

Check that imports are narrow and do not create casual cross-feature coupling.

