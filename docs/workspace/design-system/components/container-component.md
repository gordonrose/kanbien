# Container Component

## Scope

- Component name: `Container`
- Status: active
- Owner: design-system
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/container-behavior-lock.md`
- Consuming surfaces: shared app surface containers

## Purpose

Provide the reusable outer grouped surface token: opaque background, approved
border treatment, square corners, and semantic state fills.

## Public API

- Review route: `/design-system/tokens/container`
- Token surface: `data-token-layer-surface="container"`
- Required variables:
  - `--token-container-background`
  - `--token-container-border-right`
  - `--token-container-border-bottom`
  - semantic success/warning/error container backgrounds

## Adoption

Consumers must use semantic container variables rather than app-page raw colour
and border literals.
