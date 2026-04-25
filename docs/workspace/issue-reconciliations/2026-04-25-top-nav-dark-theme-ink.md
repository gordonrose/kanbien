# 2026-04-25 Top-Nav Dark Theme Ink

## Symptom

During localhost review of `/design-system/canonical-renderings/top-nav/TRP-014B`,
some visible top-nav strings stayed in light-theme ink while the surrounding
top-nav surface rendered in the dark theme. The most visible case was the brand
label beside the mark.

## Root Cause

The generated canonical render route correctly scoped dark-theme tokens to the
local top-nav render surface, but `.top-nav` did not establish its own text
color from those tokens. Descendants such as the brand label relied on inherited
`color`, so they could retain the outer page's already-computed light-theme ink
instead of resolving `var(--ink)` inside the local dark scope.

A previous profile-only dark-theme override masked part of the same failure
mode with a descendant-specific `!important` rule instead of fixing the
component-root contract.

## Why The Existing Loop Missed It

The generated-route proof checked that dark theme stayed scoped to the local
canonical render layout, but it did not assert that visible text inside that
scope resolved to readable dark-theme ink. Screenshot coverage existed for the
theme state, but the executable non-screenshot guard only verified theme
plumbing, not user-visible readability.

## Reconciliation Changes

- Updated `.top-nav` to establish `color: var(--ink)` at the component root.
- Removed the top-nav profile-only dark-theme rescue override.
- Added a `TRP-014B` regression that checks visible brand, inactive nav,
  active nav, and profile text colors on the generated canonical render route.

## Coverage Lesson

Scoped theme tests must prove readable visible strings, not only the presence
and locality of `data-theme-scope`. Governed component roots should establish
their own tokenized ink so locally scoped themes cannot inherit stale page ink.

## Follow-Up Watch Items

- Audit other generated canonical families for component roots that rely on
  inherited page ink inside locally scoped themes.
- Consider a shared visual helper for “visible themed text resolves to local
  ink or approved state ink” once the same pattern appears in a second family.
- Keep the exact localhost symptom open until user review confirms the rendered
  top-nav now looks correct.
