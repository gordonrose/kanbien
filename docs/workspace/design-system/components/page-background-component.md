# PageBackground Component

## Purpose

`PageBackground` is the shared design-system background foundation. It promotes
the reviewed Background token out of its token editor page so new foundation
structures inherit the same environmental layer automatically.

## Source Of Truth

- Controller seam: `src/frontend/designSystem/assets/pageBackground.mjs`
- Editor/review route: `/design-system/tokens/background`
- Behavior lock:
  `docs/workspace/design-system/behavior-locks/page-background-behavior-lock.md`

## Public Controller

`createPageBackgroundController(root, options)` applies the background token
variables and listens for theme, accent, colour-baseline, and background-slider
changes.

The Background token page uses the controller with source-output callbacks.
Regular design-system pages use the same controller through `app.mjs` with the
default background settings.

## Relationship To ListPageStructure

`PageBackground` is the environmental layer. `ListPageStructure` is the
structural layer. `ListPageStructure` consumes `--token-background-*` variables
for its shell and foundation surfaces but does not calculate or mutate those
variables.
