# 2026-04-22 Dark Theme Heading Token Audit Gap

## Symptom

Dark-theme canonical render surfaces still showed some header text in the wrong
color, including specimen-local titles such as the date-picker host-field
heading.

## Root Cause

Several shared heading classes relied on inherited `color` instead of pinning
their foreground to theme-owned tokens. When a canonical render used a local
dark theme scope, the scoped CSS variables changed, but inherited heading color
from the surrounding page did not automatically recompute to the local dark
foreground.

## Why The Loop Missed It

The existing checks focused on route truth, launcher truth, and a few
family-specific dark-theme assertions. They did not maintain a shared audit for
theme-sensitive typography tokens used across multiple canonical families.

## Prevention Added

- The shared form-page heading tokens now explicitly use `color: var(--ink)`.
- Added `tests/integration/frontend/designSystemTypographyThemeAudit.test.ts`
  to pin shared heading and eyebrow/copy tokens to theme-owned foreground
  variables.

## Follow-Up Rule

When a design-system surface is expected to work inside a local theme scope,
shared typography tokens must declare explicit foreground colors through theme
variables rather than relying on inherited page color.
