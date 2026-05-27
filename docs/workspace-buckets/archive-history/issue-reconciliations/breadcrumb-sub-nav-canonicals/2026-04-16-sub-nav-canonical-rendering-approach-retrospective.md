# Sub-Nav Canonical Rendering Approach Retrospective

## Supersession Note

Archived on 2026-05-27 as historical retrospective evidence after the
sub-nav canonical rendering lessons were promoted into the active sub-nav and
breadcrumb behavior locks, reference packs, verification artifacts,
`tests/audit/designSystem/subNavCanonicalCoverage.test.ts`, and browser-backed
visual canonical coverage.

Use the active design-system artifacts and tests as current authority. This
retrospective remains useful for provenance and for understanding why
deterministic first-open canonical rendering matters.

## Summary

The sub-nav canonical preview route was intended to provide deterministic,
deep-linkable review states for breadcrumb, search-shell, and shared-row
behavior. In practice, the route accumulated interaction-driven rendering logic
that made several canonical URLs unreliable on first open.

The biggest mistake was treating a stateful exploratory preview and a canonical
evidence surface as the same runtime product. That coupling let hidden timing,
layout, and state-transition assumptions leak into the supposedly deterministic
states.

## What The Rendering Was Trying To Achieve

The current sub-nav rendering route tries to do three jobs at once:

1. act as an exploratory playground with interactive controls
2. act as a canonical state renderer driven by URL params
3. act as the future source for Playwright evidence capture

Each canonical link is supposed to declare enough baseline conditions to render
one approved design-system state:

- width
- row state
- search active/inactive state
- theme
- direction
- magnification
- locale fixture
- accent

The intended contract is: opening the URL should render that state correctly on
the first settled frame without user interaction.

## Baseline Conditions Required For A Canonical To Be Honest

For any canonical state to be reliable on first open, all of these must already
be true before evidence is captured:

- the preview frame width has settled to the URL-driven width
- theme, direction, accent, and magnification have already been applied
- row layout has already switched to the correct structural layout for that
  state
- breadcrumb content has already been populated from the chosen locale fixture
- responsive reduction logic runs only after the real container geometry is
  measurable
- hidden or alternate structures, such as compact breadcrumb mode, do not
  leave stale row classes behind from a previous state
- the route exposes a clear “render complete” seam for automation

If any of those conditions are still in-flight, the canonical is not yet
deterministic, even if it becomes correct after a second interaction.

## Root Cause

The preview architecture currently derives too much final layout from runtime
mutation after initial paint:

- URL state is read first
- multiple visual systems are applied in sequence
- layout-sensitive logic then runs against geometry that may not yet be final
- some state transitions reuse exploratory preview classes rather than
  state-specific canonical structure

That made the canonical route sensitive to ordering rather than only to state.

## Why The Loop Missed It

The current executable checks are mostly structure-presence checks. They verify
that:

- the preview page exists
- the launcher links exist
- the relevant functions exist
- some known state hooks are wired

But they do not yet prove the real truth we needed:

- first-open rendering matches the approved canonical state
- no post-open interaction is required to reach the correct geometry
- the rendered state is stable enough for screenshot capture

Manual review also missed this initially because interacting with the controls
often repaired the state, which made the surface appear healthier than its
first-open behavior really was.

## Failure Pattern Classification

This issue escaped because of a combination of:

- wrong-layer coverage
  the existing audit checked source structure instead of rendered canonical
  truth
- unrealistic harness assumptions
  we treated a URL-driven interactive preview as though it were already a
  stable evidence renderer
- missing regression scenarios
  first-open canonical rendering was not separately governed from post-control
  interaction rendering
- cross-seam blind spot
  row layout, breadcrumb reduction, width application, and preview controls
  were allowed to influence one another inside the same boot path

## Types Of Mistakes Made

The concrete mistakes fall into a few buckets:

### 1. Ordering mistakes

- running responsive breadcrumb logic before width/layout had settled
- applying canonical state before all dependent global display conditions were
  in place

### 2. Structural-state mistakes

- reduced states were still using layout intended for the full exploratory row
- compact or reduced breadcrumb representations did not always reserve their
  own lane at first render

### 3. Canonical-definition mistakes

- some links asked for logically conflicting conditions, such as a “full” row
  at a width that no longer honestly fit the full breadcrumb trail

### 4. Evidence-surface mistakes

- the canonical route had no explicit ready marker for future Playwright
  capture
- the current audit suite did not distinguish “page exists” from “canonical is
  trustworthy”

## Reassessed Approach

The safer approach is to separate exploratory preview behavior from canonical
rendering behavior much more strictly.

### Recommended model

Use one shared visual component tree, but two different orchestration modes:

1. exploratory mode
   keeps the full control panel and interaction-heavy state syncing
2. canonical mode
   accepts a declared state, applies it in a fixed order, waits for layout to
   settle, then marks itself ready

### Canonical-mode rendering sequence

For canonical links, the route should:

1. parse and normalize the URL state
2. apply theme, direction, accent, and magnification
3. apply frame width
4. populate content fixture
5. apply structural row mode for the declared state
6. run responsive breadcrumb logic only when the target state requires it and
   only after layout is stable
7. emit a deterministic “render ready” attribute for automation

That sequence should be owned by one orchestrator rather than spread across
multiple event-style mutations.

### Safer canonical contracts

Each canonical link should map to one of two categories:

- explicit structural state
  for example `mobile`, `compact`, `reduced-page-minus-one`
- measured full state
  where “full” is only allowed at widths already proven to fit the approved
  trail

Avoid mixed semantics where a canonical both declares a state and relies on
runtime pressure to decide what it really is.

### Better automation seam

Before using these routes for Playwright evidence, add a small render-ready
contract such as:

- `data-render-status="settling|ready"`
- `data-canonical-state="SNR-001"` or equivalent
- one rendered assertion per priority state in a browser-backed suite

That way Playwright waits for actual readiness rather than assuming DOM load
means visual truth.

## Prevention Direction

The next strengthening step should not be more source-string audits alone.
Instead, add a browser-backed canonical smoke suite that checks at least:

- full breadcrumb canonical shows the expected breadcrumb segments on first load
- reduced-page-minus-one canonical preserves a visible protected breadcrumb
  lane on first load
- mobile canonical hides breadcrumb and expands search on first load
- active-search canonical shows the Enter hint only in the approved state

## Residual Risk

The current sub-nav route is better than it was after the recent fixes, but it
is still a shared preview/canonical surface. Until canonical mode has an
explicit ready contract and at least a few browser-backed first-open assertions,
there is still risk that later preview evolution reintroduces timing drift.
