# Context-Nav Magnification Offset Drift

## Summary

`CDR-005 - Dark theme with magnification` exposed a magnification-specific
geometry bug in the shared `context-nav` canonical renderer:

- the rendered rail and context-nav drawer started too low under desktop
  magnification
- the rendered shell was effectively treating the sub-nav bottom as lower than
  it really was

That made the `CDR-005` canonical visually dishonest right where it was meant
to prove WCAG-sensitive magnification behavior.

## Root Cause

The canonical renderer already measured the correct rendered header bottom and
wrote it to `--context-nav-top`.

The problem was that `CDR-005` also applied magnification through
`zoom: var(--ui-scale)` on `#context-nav-preview-shell`.

Because the rail and drawer used that raw `--context-nav-top` directly for
their `top` positioning inside the zoomed shell, the offset itself was scaled
again.

In practice:

- raw measured header bottom: `208px`
- shell scale: `1.5`
- effective rendered rail/drawer top became about `312px` below the shell top
  instead of about `208px`

## Why The Loop Missed It

The existing `CDR-005` test checked the right family, but the wrong evidence:

- it verified dark-surface color
- it verified magnification state
- it verified close-button shape

It did **not** verify that the magnified rail and drawer still attached to the
same rendered sub-nav bottom as the non-magnified shell.

Classification:

- missing regression scenario for magnified geometry
- wrong-layer confidence from appearance-only checks
- shared-shell scaling blind spot in canonical attachment math

## Reconciliation Changes

- added a magnification-adjusted canonical offset variable:
  `--context-nav-top-adjusted`
- updated the canonical preview rail and drawer to use that adjusted offset
  instead of the raw measured header height when the shell is magnified
- refreshed magnification handling so canonical `context-nav` layout is
  recomputed immediately when magnification changes
- expanded `CDR-005` coverage so it now proves:
  - drawer top matches rail top
  - drawer/rail top matches the rendered sub-nav bottom under magnification

## Verification

- `npx playwright test tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts -g "CDR-005 dark theme with magnification" --workers=1`
- `npx playwright test tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts -g "CDR-004|CDR-005|CDR-006" --workers=1`

Live geometry after the fix:

- rendered sub-nav bottom: `834.97`
- rendered rail top: `836.47`
- rendered drawer top: `836.47`
- shell scale: `1.5`
- adjusted canonical top: `138.65625px`

## Resolution Status

- candidate fix awaiting user confirmation

## Residual Risk

- any future canonical family that uses zoom-based magnification and internal
  absolute attachment math can reintroduce this same class of bug unless the
  attachment offset is normalized for the local render scale
