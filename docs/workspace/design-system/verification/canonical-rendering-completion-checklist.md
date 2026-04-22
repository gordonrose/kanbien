# Canonical Rendering Completion Checklist

Use this checklist before calling any new generated canonical-rendering family
or reference batch complete.

This artifact exists because route-level success is not enough. A rendering is
only complete when the specimen is isolated, browser-verifiable, and proven not
to fall back to overview content or leak stress state into surrounding chrome.

## Hard Gate

Do not use "done", "complete", or equivalent language for a canonical-rendering
slice unless all of the following are true:

- the user can verify the changed surface in the workspace they are actually
  inspecting
- browser proof has run against the same origin the user is using when that
  origin is available
- the route loads the intended specimen surface, not only the intended URL
- local-vs-global stress-state scope is explicitly tested
- overlay geometry is tested when the family contains drawers, menus, dialogs,
  mobile pickers, or any other escaping surface

## Environment Match

Before verification, record:

- worktree path
- branch
- commit
- server command
- origin and port

Required rule:

- do not treat preview-only proof as equivalent to user-visible proof unless
  the user is explicitly looking at that same preview origin

Preferred verification seam:

- use `PLAYWRIGHT_BASE_URL` when the live origin under review is not the
  default preview server

## Route Truth And Surface Truth

Every dedicated canonical-rendering route must prove both:

- route truth
- surface truth

Route truth means:

- the URL resolves to the expected family and reference path

Surface truth means:

- a positive specimen marker is present
- a known fallback marker is absent
- a specimen-specific surface locator is visible

Current shared helper:

- `tests/visual/designSystem/support/helpers/routeSurfaceTruth.ts`

Minimum checks per ref:

- expected route path
- expected body attribute or equivalent positive surface marker
- expected specimen locator visible
- known fallback heading absent

## Launcher Truth

For every new family:

- the canonical-renderings index must link to the family launcher
- the family launcher must link to dedicated render routes
- at least one launcher-card click-through path must be browser-verified

Launcher truth is not satisfied by static `href` checks alone.

At minimum, verify:

1. canonical index to family launcher
2. family launcher to dedicated render route
3. dedicated render route loads the expected ref state

Current shell-level guard:

- `tests/visual/designSystem/canonicals/shell/generatedCanonicalRenderingsIndex.spec.ts`

Required future-family rule:

- when a new generated family is added, extend the generated-index shell spec in
  the same change so the top-level launcher seam proves that family from the
  visible workspace

## Scope Classification

For each reference family, explicitly classify whether these are:

- page-level shell state
- surface-local specimen state

Required classification list:

- direction
- theme
- magnification
- mobile overlay posture
- scroll locking
- z-layering

If the intended scope is local to the specimen, tests must assert that
surrounding shell chrome remains unchanged.

Examples of shell-non-regression checks:

- `document.documentElement` does not receive specimen-only `dir`
- `document.documentElement` does not receive specimen-only `--ui-scale`
- surrounding page chrome keeps normal font size and geometry
- page-level theme does not change when the local render surface is under theme
  stress

## Overlay Containment

If a family contains any overlay-like surface, do not stop at state assertions.

Overlay-like surfaces include:

- drawers
- menus
- dialogs
- dropdown panels
- mobile pickers
- full-screen review overlays

Required proof:

- the visible overlay stays contained within the intended review frame when the
  canonical renderer is supposed to preserve surrounding framing

Preferred shared helper:

- `expectContainedWithin(...)` from
  `tests/visual/designSystem/support/helpers/humanReviewGuards.ts`

Do not accept checks like only:

- `position: fixed`
- `top: 0`
- `aria-expanded="true"`

Those can accidentally bless an escaped overlay.

## Browser-Visible Failure Modes

For every family batch, ask these questions explicitly:

- is the route body actually the specimen surface, not the overview shell?
- does the launcher open the specimen users are supposed to review?
- does the specimen stay inside its review frame?
- do theme, RTL, and magnification stay scoped where intended?
- does any overlay escape into surrounding page chrome?
- does the page shell remain normal when the specimen is supposed to be local?

If the answer is uncertain, the batch is not complete.

## Minimum Family Signoff Set

Before treating a new canonical-rendering family as shippable, confirm:

- persistence-backed family record exists
- persistence-backed reference records exist
- router resolves family launcher path
- router resolves dedicated reference path
- launcher page hydrates from persisted family/reference truth
- dedicated render surface hydrates from persisted reference truth
- one launcher click-through path is browser-proven
- one direct render-route path is browser-proven
- one fallback-absence assertion is present
- one scope-classification assertion is present
- one overlay-containment assertion is present when relevant

## Escaped-Issue Sweep

Before signing off a new batch, compare it against recent escaped issue classes.

Current recurring classes:

- visible-workspace verification gap
- same-origin verification gap
- canonical route resolving to fallback overview content
- mobile overlay escaping the review frame
- specimen scope leaking RTL, theme, or magnification to the whole page

If a new family can plausibly fail in one of those ways, add an executable
check for it before calling the batch complete.

## Reporting Standard

When closing out a canonical-rendering slice, report:

- exact workspace and branch verified
- exact origin verified
- launcher path verified
- render path verified
- specimen marker used
- fallback marker checked
- any intentionally page-level stress state
- any intentionally local-only stress state

If verification happened only in an alternate preview environment, report the
result as:

- candidate fix in alternate environment

not as complete or fully done.
