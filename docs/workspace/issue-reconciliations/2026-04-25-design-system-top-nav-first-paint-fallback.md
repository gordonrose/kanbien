# 2026-04-25 Design-System Top Nav First-Paint Fallback

## Symptom

Across `/design-system` pages, the top nav could briefly show stale primary
labels such as `Foundations`, `Components`, or `Patterns` before settling into
the governed design-system navigation.

The visible flash made the shell look as if an old static fallback or default
configuration was being replaced after page load.

## Root Cause

There were two overlapping fallback gaps:

- Some static design-system HTML pages still carried copied outer shell nav
  labels from the older design-system information architecture.
- The top-nav preview fixture initializer ran on every design-system page. On
  ordinary shell pages without an actual `#top-nav-preview-frame`, its preview
  element references fell back to the host shell and rewrote the real header
  with fixture labels before the governed page-tree settings refresh could run.

## Why The Existing Loop Missed It

The previous checks focused on final hydrated shell state and selected
generated canonical render pages. They did not block `/v1` settings calls to
assert the synchronous first-paint fallback, and they did not audit every
design-system HTML page's outer static top-nav contract.

The top-nav fixture logic was also covered as a component preview behavior, not
as a possible host-shell mutation path on non-preview pages.

## Reconciliation Changes

- Normalized the outer static top-nav fallback across design-system HTML pages
  to the governed labels:
  - `Overview`
  - `Canonical Renderings`
  - `Canonicals`
- Kept inner preview/specimen top-nav fixtures untouched where they are the
  reviewed component content rather than the host shell.
- Guarded `applyTopNavPreviewFixture` so it only mutates pages with an actual
  top-nav preview frame.
- Added a static source audit for design-system first-paint shell labels.
- Added a browser regression that forces `/v1/**` to return `503` and proves
  `/design-system` still renders the governed top-nav labels before persisted
  page-tree settings are available.

## Coverage Lesson

Design-system shell parity needs a first-paint contract in addition to hydrated
state checks. Preview controllers must not fall back to host-shell elements
unless the fallback is intentional and covered as a host-shell behavior.
