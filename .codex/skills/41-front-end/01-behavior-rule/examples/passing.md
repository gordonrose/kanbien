# Passing Example: Filter Panel Behavior Rule

## Purpose

The filter panel lets a user narrow a list without leaving the current list page.

The user must be able to understand which filters are available, which filters are active, and how to clear or apply them.

## Scope

This rule applies to the filter panel family.

This rule does not apply to individual filter field primitives or list-result rendering.

## Required States

- `closed`: the panel is not visible, and the trigger still communicates whether filters are active.
- `open`: available filters, active filters, and actions are visible.
- `empty-options`: a filter with no available choices explains that no choices are available.
- `loading`: filter options are being retrieved and the user is not shown stale choices as current choices.
- `error`: filter options failed to load and the user can understand the failure.

## Layer Classification Notes

- Behavior-rule decisions: the panel must preserve active filters, communicate loading and error states, and make active filters understandable.
- Later-layer dependencies: primitive trigger behavior, token colors, pattern structure, component seam API, demo route, and canonical scenarios.
- Ungoverned dependencies: none.

## Interaction Rules

- Opening the panel must not discard active filters.
- Clearing filters must make the cleared state visible before the user leaves the panel.
- Applying filters must leave the user with a visible indication that the list is filtered.

## Accessibility Responsibility

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

- Keyboard: the trigger, fields, clear action, apply action, and close action must be keyboard reachable.
- Focus: opening and closing behavior must define where focus moves and where focus returns.
- Names and semantics: the trigger must have an accessible name that communicates the panel purpose.
- Error and status communication: loading and error states must be communicated in text and programmatically in later layers.
- Visual accessibility: color must not be the only indication that a filter is active.

## Responsive Responsibility

- The panel must remain usable when horizontal space is constrained.
- The active-filter indication must remain understandable under zoom or magnification.

## Consumer Must Not

- Consumers must not recreate this family with app-local markup.
- Consumers must not recreate this family with app-local controller behavior.
- Consumers must not add app-local CSS to approximate this family.
- Consumers must not bypass later governed seams once those seams exist.

## Open Decisions

- None.

## Temporary Overrides

- None.

## Implementation Plan Recommendation

- Build or confirm required primitives before pattern work starts.
- Build or confirm token decisions before visual styling is treated as governed.

## Next Layer

The next expected layer is `02-primitive`.
