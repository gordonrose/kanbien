# Component Seam Layer

## What It Is For

The component seam layer turns a governed pattern into something both the design-system surface and the app can consume.

The seam may be a component, render function, controller, adapter, CSS module export, or another named public interface.

This is the primary anti-drift layer.

It owns the public receptor contract: the allowed places where feature-owned
data, state, content, actions, and accessibility copy may enter governed UI.

Feature implementation maps backend/API/domain behavior into those receptors
through a feature-owned adapter or view model.

## Input

The input is an accepted pattern contract and the target consumer context.

The layer also needs existing export conventions, app import boundaries,
controller requirements, and any feature projection or data-adapter
requirements.

## Output

The output is a named consumable seam with a stable public import path and documented responsibilities.

The design-system demo and first app adoption should be able to consume the same seam.

The output should include any fixture or adapter shape needed to keep demos honest.

When a feature slice is in scope, the output should require a receptor mapping
using `docs/templates/component-receptor-mapping-template.md`.

## Evaluation For 99% No-Rework Confidence

Check that the seam is the only approved way for consumers to use the pattern.

Check that the seam does not depend on a demo route or app-local page implementation.

Check that the seam exposes behavior and structure without requiring consumers to copy markup or controller logic.

Check that the seam preserves the pattern contract's accessibility and state requirements.

Check that imports are narrow and do not create casual cross-feature coupling.

Check that unsupported affordances are explicit instead of implied by missing
handlers.

Check that backend/API fields needed by receptors are supplied by the route
contract or derived in a feature-owned adapter.
