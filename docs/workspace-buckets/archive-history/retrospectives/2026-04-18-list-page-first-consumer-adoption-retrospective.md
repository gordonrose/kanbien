# List Page First-Consumer Adoption Retrospective

## Scope

- Surface:
  `rootAdminShell` `Users` route
- Retrospective date:
  `2026-04-18`
- Covers:
  the delivery and parity lessons from the first real-app adoption of the
  signed-off `List Page` design-system baseline

## Summary

Most of the friction in this adoption was not caused by the `List Page`
component family itself.

The problems came from consumer framing drift:

- the app initially approximated the canonical instead of consuming it
- shell geometry and page-lane framing were treated as separate from the
  design-system contract
- app-local copy and layout decisions were allowed to survive inside a
  supposed canonical adoption
- source-level confidence was repeatedly weaker than rendered screenshot truth

## Issues And Gaps Encountered

### 1. Shared child seams were adopted, but shared source was not

The first pass used the signed-off list-page structure and child seams, but the
app still carried a private copy of the list-page CSS.

Lesson:

- a governed app adoption is not canonical if the app can drift independently
  from the signed-off stylesheet source

### 2. "Full canvas" was misread as edge-to-edge

The route was converted away from the old shell card wrapper, but then a
route-specific full-width mode removed the outer gutter that the canonical page
still keeps.

Lesson:

- full-canvas ownership does not mean abandoning canonical page-shell inset,
  max width, or gutter alignment

### 3. Shell framing mattered as much as component styling

Even after shared list-page styles were introduced, the route still looked
wrong because the shell content lane did not match the canonical page wrapper.

Lesson:

- first-consumer parity must check outer page geometry, not only internal card
  and drawer styling

### 4. App-local header content weakened canonical posture

The route initially added explanatory copy, a count block, and search guidance
that were not part of the signed-off canonical.

Lesson:

- if an adoption is meant to prove canonical parity, app-local helper content
  should be treated as drift unless it has an explicit approved exception

### 5. Screenshot truth outranked source reasoning

Several rounds of source-level explanation turned out to be incomplete because
the browser screenshots were showing real parity failures the code review had
not fully accounted for.

Lesson:

- when a user says a design-system adoption does not look canonical, treat the
  screenshots as the contract truth and reconcile the code to them

### 6. "Uses the design system" was too weak a completion bar

The app technically reused design-system work, but the result was still
visibly non-canonical.

Lesson:

- "uses the design system" is not enough
- the real bar is:
  shared source, shared geometry, shared framing, and no silent local
  exceptions

## Resulting Repo Improvements

This adoption work led to these concrete process improvements:

- the app now consumes a shared `List Page` stylesheet source instead of a
  root-admin-only CSS fork
- the root-admin `Users` route now uses a canonical page-shell geometry mode
  rather than a generic content-lane approximation
- repo instruction surfaces now explicitly call out shell-parity and
  shared-source requirements for first-consumer adoptions

## Follow-Forward Reminders

- for governed app adoptions, verify both:
  the isolated canonical surface and the first real consumer surface
- do not accept "component-correct" as parity if shell gutters, max width,
  wrapper posture, or adjacent chrome alignment are wrong
- do not duplicate signed-off design-system CSS into app-local stylesheets
  unless a human-approved exception is documented
- treat app-local explanatory copy, counters, helper text, and spacing changes
  as drift by default when the stated goal is first-consumer canonical parity
- when a user repeats that a frontend adoption still does not match the
  canonical, stop explaining and reconcile the rendered geometry directly
