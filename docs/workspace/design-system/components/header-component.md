# Header Component

## Scope

- Component name: `Header`
- Status: active
- Owner: design-system
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/header-behavior-lock.md`
- Consuming surfaces: shared app heading hierarchy

## Purpose

Provide the reusable heading scale and theme-aware heading ink treatment.

## Public API

- Review route: `/design-system/tokens/header`
- Source model: `src/frontend/designSystem/assets/tokenHeaderModel.mjs`
- Hydrator: `hydrateHeaderTokenPage`
- Token classes:
  - `token-header-one`
  - `token-header-two`
  - `token-header-three`
  - `token-header-four`
  - `token-header-five`
  - `token-header-six`

## Adoption

Consumers must map semantic heading levels to the approved visual scale and
verify long heading behavior in their actual layout.
