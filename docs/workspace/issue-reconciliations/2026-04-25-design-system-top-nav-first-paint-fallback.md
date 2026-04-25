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

## Follow-Up Candidate Fix - 2026-04-25

The first tactical repair normalized copied static labels and protected preview
controllers from mutating the host shell, but the shell still had an
architectural two-phase top-nav path:

- copied static HTML painted first
- `app.mjs` normalized that copied markup after module load
- `refreshGovernedPrimaryNav()` fetched the applied tree and then one page
  settings response per top-level page before replacing the host nav

That still allowed a visible static-menu-to-governed-menu swap when the
persisted top-nav projection included pages beyond the fallback trio.

Reconciliation changes added in this follow-up:

- added a single public design-system top-nav projection at
  `/v1/web-app-page-settings/public/design-system/top-nav`
- changed the design-system frontend to hydrate from that projection instead of
  issuing an applied-tree request plus per-page settings waterfall
- added a repository batch read for page settings so the server projection can
  avoid per-page persistence reads
- normalized served design-system HTML through the design-system router before
  response send, which prevents stale copied top-nav labels from becoming the
  browser's first paint
- added service-level coverage for the public design-system top-nav projection

Residual risk:

- the route-level HTML normalization is still a compatibility bridge around
  duplicated static shell markup; the longer-term architectural endpoint should
  be a shared design-system shell renderer that owns the header markup directly
  instead of correcting copied pages at serve time
- user-visible resolution still needs browser confirmation on the affected
  design-system page because the original report was visual and timing-sensitive
