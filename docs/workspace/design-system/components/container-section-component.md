# ContainerSection Component

## Scope

- Component name: `ContainerSection`
- Status: active
- Owner: design-system
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/container-section-behavior-lock.md`
- Consuming surfaces: grouped subsections inside containers

## Purpose

Provide the reusable interior section surface for exact structural fill inside
containers and page header.

## Public API

- Review route: `/design-system/tokens/container-section`
- Token surface: `data-token-layer-surface="container-section"`
- Required variables:
  - `--token-container-section-background`
  - `--token-container-section-border`
  - `--token-container-section-radius`
  - semantic success/warning/error section backgrounds

## Adoption

Consumers must keep square structural fill and four-sided border treatment
unless a component-specific section variant is separately signed off.
