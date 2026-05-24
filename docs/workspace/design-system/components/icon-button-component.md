# IconButton Component

## Scope

- Component name: `IconButton`
- Status: active
- Owner: design-system
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/icon-button-behavior-lock.md`
- Consuming surfaces: shared icon-only controls

## Purpose

Provide the reusable icon-only button frame, size clamp, state treatment, and
tooltip relationship.

## Public API

- Review route: `/design-system/tokens/icon-button`
- Token surface: `data-token-layer-surface="icon-button"`
- Key classes:
  - `token-icon-button-control`
  - `token-icon-button-host-cell`
  - `token-icon-button-size-min`
  - `token-icon-button-size-base`
  - `token-icon-button-size-max`

## Accessibility

Icon-only buttons require accessible names. Tooltip text may mirror but not
replace the accessible name.

## Adoption

Consumers must prove target size, focus visibility, accessible names, and
tooltip parity in their real surface.
