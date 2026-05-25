# Failing Example: Filter Panel Behavior Rule

## Purpose

The filter panel should be clean, modern, and easy to use.

## Required States

- `open`: the panel opens.

## Layer Classification Notes

- The panel should use a pill-shaped blue trigger, a 320px drawer, and an `onApplyFilters` prop.

## Accessibility Responsibility

The panel should be accessible and screen-reader friendly.

## Consumer Must Not

- Consumers should try to follow the design system.

## Next Layer

The next expected layer is `02-token`.

## Why This Fails

This example fails the current `01-behavior-rule` eval.

The artifact does not use the fixed lean template sections.

The artifact is missing `Rule Metadata`, including design system, UI family, harness layer, rule status, relevant URLs, behavior artifact path, and files affected now.

The purpose uses vague visual praise instead of observable behavior.

The purpose does not name the primary user, normal job, success outcome, or non-goals.

The state list is incomplete and does not mention active, empty, loading, or error behavior.

The state list does not explain what the user can observe in enough detail for later layers to preserve the behavior.

The layer classification mixes token, pattern, and component-seam decisions into the behavior rule.

The blue trigger is an invented token decision.

The 320px drawer is an invented pattern or layout decision.

The `onApplyFilters` prop is an invented component-seam decision.

The artifact is missing `Explicitly Out Of Scope`, so later-layer details are not cleanly excluded.

The artifact is missing `Deferred Decisions`, so later-layer ownership is not explicit.

The artifact is missing `Mandatory Review Dimensions`, including right-to-left, zoomed in 150%, zoomed out 75%, dark theme, desert theme, dark theme with error, and desert theme with error.

The accessibility section does not name keyboard, focus, accessible names, status communication, error communication, color-independent meaning, or later proof owners.

The consumer restriction is optional language and does not prevent app-local recreation.

The artifact is missing `Ungoverned Dependencies`, so it does not state whether lower-layer dependencies are approved, temporary, or blocking.

The artifact is missing `Storage And Consumption Plan`, so later layers do not have a stable lookup path and runtime code is not explicitly prevented from importing the governance artifact.

The `Next Layer` section does not state whether the next layer is `allowed`, `blocked`, or `scaffold-only`.

The rule gives the next layer too little information to build without guessing.
