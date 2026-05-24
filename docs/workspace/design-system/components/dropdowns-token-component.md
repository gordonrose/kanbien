# DropdownsToken Component

## Scope

- Component name: `DropdownsToken`
- Status: active
- Owner: design-system
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/dropdowns-token-behavior-lock.md`
- Consuming surfaces: simple single-select dropdowns

## Purpose

Provide the primitive dropdown token page for compact single-select controls
that should stay smaller than drawer-select.

## Public API

- Review route: `/design-system/tokens/dropdowns`
- Compatibility routes:
  - `/design-system/tokens/simple-dropdown`
  - `/design-system/tokens/simple-select`
  - `/design-system/token/dropdowns`
  - `/design-system/token/simple-dropdown`
- Token surface: `data-token-layer-surface="dropdowns"`
- Structural marker: `data-token-simple-dropdown`
- Open-state marker: `data-token-simple-dropdown-open`
- RTL-state marker: `data-token-simple-dropdown-rtl`

## Behavior

The page consumes the existing `data-form-select` simple-select runtime from
`src/frontend/designSystem/assets/app.mjs`. The trigger owns both the small
uppercase label and selected value. The page proves trigger/listbox geometry,
selection reflection, hidden value sync, disabled state, theme scopes, RTL, and
long-value containment.

## Adoption

First consumers must use the shared simple-select behavior rather than copying
token-route markup into app pages.
