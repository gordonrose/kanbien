# Colours Component

## Scope

- Component name: `Colours`
- Status: active
- Owner: design-system
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/colours-behavior-lock.md`
- Consuming surfaces: all tokenized UI families

## Purpose

Provide the semantic colour source for app and design-system surfaces.

## Public API

- Review route: `/design-system/tokens/colours`
- Source model: `src/frontend/designSystem/assets/tokenColourModel.mjs`
- Renderer: `src/frontend/designSystem/assets/tokenColours.mjs`

## Adoption

Consumers must prefer semantic colour variables over raw literals and must not
invent new state colours in app-page CSS.
