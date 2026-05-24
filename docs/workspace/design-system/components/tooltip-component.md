# Tooltip Component

## Scope

- Component name: `Tooltip`
- Status: active
- Owner: design-system
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/tooltip-behavior-lock.md`
- Consuming surfaces: shared controls and truncated labels

## Purpose

Provide the reusable lightweight explanatory overlay seam.

## Public API

- Review route: `/design-system/tokens/tooltip`
- Trigger marker: `data-tooltip`
- Shared floating surface: `#shared-floating-tooltip`
- Required typography dependency: `paragraph.mainMinor`

## Behavior

Tooltips are explanatory overlays. They do not replace visible labels,
accessible names, validation errors, or confirmation flows.

## Adoption

Consumers must use the shared tooltip layer and prove containment in the real
shell or component context.
