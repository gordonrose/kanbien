# Form Template Context-Nav Shell Scope

## Summary

The `/design-system/templates/form` route showed the context-nav rail detached
from the header attachment model. In browser review, the rail started from the
fallback `8rem` top value and visually behaved like a full-height page object
instead of inheriting the measured shell offset.

## Root Cause

The form-template header markup closed the `primary-nav-overflow-menu` before
its menu items and then closed the surrounding structure with a `</div>` where
the `primary-nav` needed `</nav>`. Browser parsing closed
`.design-system-shell` immediately after the top nav, leaving `.sub-nav`,
`.context-nav`, the drawer, and main content as direct `body` children.

`updateContextNavOffset()` wrote `--context-nav-top` to
`.design-system-shell`, but `.context-nav` was outside that scope and therefore
fell back to the CSS default `8rem`.

## Why The Loop Missed It

Existing context-nav coverage protected the dedicated context-nav canonical
surfaces and one launcher lane-reservation case. Existing form-template tests
covered form controls, drawers, mobile pressure, RTL, and overflow, but did not
assert that the host route preserved the shell DOM boundary or that the
context-nav remained attached after page scroll.

Classification: shared-shell seam blind spot plus missing host-route scroll
regression scenario.

## Reconciliation Changes

- Repaired the form-template top-nav markup so the overflow menu contains its
  menu items and `primary-nav` closes correctly.
- Added a form-template visual regression test that verifies:
  - `.context-nav` remains inside `.design-system-shell`
  - the rail top initially matches the measured top/sub-nav bottom
  - after scrolling, the rail clamps to the viewport top instead of using the
    stale fallback offset
  - the rail height remains viewport-attached rather than content-attached

## Coverage Lesson

For governed shell chrome embedded in host templates, component-family
canonicals are not enough. Each host route that carries shell chrome needs at
least one DOM-boundary plus scroll-geometry assertion so malformed markup or
scope drift cannot bypass the shared implementation contract.

## Follow-Up Watch Items

- Consider adding a reusable helper for host routes that use `.context-nav`:
  assert shell containment, measured top attachment, and scroll clamp behavior.
- Consider linting or parser validation for static design-system HTML pages so
  invalid top-nav structure fails before visual review.
