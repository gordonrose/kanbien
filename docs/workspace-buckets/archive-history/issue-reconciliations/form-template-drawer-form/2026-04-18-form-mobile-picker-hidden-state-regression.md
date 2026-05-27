# 2026-04-18 Form Mobile Picker Hidden-State Regression

Archive note, 2026-05-27:

This promoted lesson was moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/form-template-drawer-form/`
after the mobile hidden-state lesson was found in active form-template
behavior-lock and overlay containment test authority.

## Symptom

On the form template, the time picker panel could appear immediately on small
screens without the user opening it.

That made the mobile form effectively unusable because a hidden picker surface
was rendering as an always-open overlay/popover.

## Root Cause

The small-screen picker drawer styling used:

- `.form-date-menu`
- `.form-time-menu`

with `display: grid !important`.

Those selectors did not exclude the `.hidden` state, so the responsive drawer
override overpowered the base hidden contract and forced closed panels to
render.

The same mistake also existed in the explicit `data-form-mobile-view="true"`
overlay treatment, where the open-surface styling was keyed to the picker
class rather than to the picker being both present and not hidden.

## Why The Loop Missed It

The recent work focused on geometry and posture:

- make the mobile picker feel drawer-like
- make the panel cover the viewport
- strengthen the overlay framing

But it did not re-check the simpler state invariant:

- closed picker panels must remain hidden after responsive overrides apply

So the responsive CSS was visually stronger, but it silently broke the closed
state because no prevention layer was guarding that hidden/display contract.

## What Changed

- mobile picker overlay rules now target:
  - `.form-date-menu:not(.hidden)`
  - `.form-time-menu:not(.hidden)`
- the related pseudo-element backdrop rules also only apply when the panel is
  actually open

## Added Prevention

- this note documents the escaped rule clash so future mobile overlay work
  treats hidden-state preservation as a first-class contract, not as an
  incidental implementation detail

## Verification

- source-level inspection of the responsive picker selectors
- `node --check src/frontend/designSystem/assets/app.mjs`

## Residual Risk

Any future responsive or modal override that adds `display`, `position`, or
overlay forcing with `!important` can reintroduce this same class of issue if
it does not explicitly preserve `.hidden` state in the final selector.
