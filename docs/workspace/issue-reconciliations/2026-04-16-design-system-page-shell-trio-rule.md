# Design-System Page Shell Trio Rule

## Symptom

Recent `/design-system` pages were allowed to ship with inconsistent shell
framing:

- some launcher pages used the real shell trio
- some pages used only part of the shell
- some canonical and exploration pages rendered the family in isolation without
  page-level shell chrome
- one earlier correction removed a made-up `context-nav`, which fixed invented
  information architecture but also left the broader page-shell contract
  undocumented

## Root Cause

The loop had family-level behavior locks for `top-nav`, `sub-nav`, and
`context-nav`, but it did not yet have one explicit page-level rule saying that
every public `/design-system` page must render inside the same governed shell
trio.

That gap made it too easy to treat shell chrome as optional scaffolding on
catalog, exploration, and canonical routes.

## Why The Loop Missed It

- route checks primarily verified that the target family surface existed
- shell framing requirements were described as parity concerns, not as a
  universal page contract
- the repo did not yet distinguish between:
  - missing approved `context-nav` destinations
  - permission to omit `context-nav` entirely

## Rule Added

All public `/design-system` pages must include:

- `top-nav`
- `sub-nav`
- `context-nav`

This applies to overview, exploration, canonical launcher, and canonical
display pages.

If a page cannot yet include a truthful `context-nav`, the loop should pause
for human-approved destination content instead of inventing placeholder items.

## Artifact Updates

The rule was codified in:

- `docs/workspace/design-system/README.md`
- `docs/architecture/guides/design-system-loop-harness.md`
- `docs/workspace/design-system/canonical-and-parity-conventions.md`

## Remaining Follow-Up

Some `/design-system` pages still need compliance work after this rule change.
That implementation pass should:

- scope runtime selectors so page-level shell chrome and inner preview surfaces
  can coexist safely
- add approved `context-nav` destinations where they are still undecided
- extend executable route checks so the shell trio becomes part of page
  validity, not just documentation
