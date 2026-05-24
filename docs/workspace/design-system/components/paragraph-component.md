# Paragraph Component

## Scope

- Component name: `Paragraph`
- Status: active
- Owner: design-system
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/paragraph-behavior-lock.md`
- Consuming surfaces: shared app typography

## Purpose

Provide paragraph, supporting paragraph, label, and status text token classes.

## Public API

- Review route: `/design-system/tokens/paragraph`
- Source model: `src/frontend/designSystem/assets/tokenParagraphModel.mjs`
- Hydrator: `hydrateParagraphTokenPage`
- Token classes:
  - `token-paragraph-main`
  - `token-paragraph-main-large`
  - `token-paragraph-main-extra-large`
  - `token-paragraph-main-minor`
  - `token-paragraph-label`

## Adoption

Consumers must preserve semantic text role and verify long text in the real app
wrapper before adoption is treated as complete.
