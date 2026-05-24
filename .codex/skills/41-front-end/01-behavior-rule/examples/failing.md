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

## Why This Fails

The purpose uses vague visual praise instead of observable behavior.

The state list is incomplete and does not mention active, empty, loading, or error behavior.

The accessibility section does not name keyboard, focus, labels, status, error, color, motion, zoom, or target-size responsibilities.

The layer classification mixes token, pattern, and component-seam decisions into the behavior rule.

The blue trigger is an invented token decision.

The 320px drawer is an invented pattern or layout decision.

The `onApplyFilters` prop is an invented component-seam decision.

The consumer restriction is optional language and does not prevent app-local recreation.

The rule gives the next layer too little information to build without guessing.
