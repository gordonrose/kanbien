# Bad PatternContractArtifact Example

This fails because it treats a legacy route as a governed pattern source:

> Use the markup from `src/frontend/designSystem/patterns/context-nav/index.html`
> and copy the same classes into the app.

Why it fails:

- Legacy top-level `patterns/` routes are pre-governed inventory unless
  explicitly promoted.
- Copying route markup is not a runtime seam.
- The artifact does not name accepted primitive dependencies.
- The artifact skips accessibility and state ownership.
- The artifact smuggles app adoption into Layer 4.

## Bad Example: Local Header Composition

This fails because the pattern owns a primitive that does not exist yet:

> Render the panel header directly in the index-nav-panel pattern and put the
> add button inside it.

Why it fails:

- The panel header has primitive behavior and must be governed before the
  pattern composes it.
- The add button is an interactive affordance and must be consumed from a
  governed primitive.
- Header height, sticky posture, title truncation, and separator styling must
  come through lower-layer seams.
- The pattern must stop and route back to Layer 2/3.

## Bad Example: Unclear Mobile Scroll Proof

This fails because the proof control does not make the reviewed behavior
observable:

> Add a `mobile behavior` select with `page-scroll` and `internal-scroll`
> options, but do not show which element owns scroll or assert the difference
> in browser tests.

Why it fails:

- Responsive scroll behavior must name the scroll owner for each reviewed mode.
- A rendered proof control must visibly change evidence or prove preserved
  behavior.
- Mobile page-scroll, internal panel scroll, and proof-container scroll are
  different contracts.
- The proof must include browser assertions for overflow, max-height, and the
  stated scroll owner.

## Bad Example: Floating Secondary List

This fails because unequal composed panels can drift while the proof still
looks superficially rendered:

> Let the primary and secondary index panels stretch to the same height without
> proving that each panel's list starts directly under its header.

Why it fails:

- Repeated composed children with unequal content need alignment evidence.
- The pattern owns composition alignment across panels.
- A shorter secondary list must not float down because grid rows distribute
  available height.
- The proof needs a browser assertion for start alignment or stable spacing
  between each header and first list item.

## Bad Example: Inherited Scrollbar Skin

This fails because inherited global CSS supplies an unsigned pattern value:

> The design-system page shell already styles scrollbars, so the index-nav
> panel scroll area can inherit that styling.

Why it fails:

- Custom scrollbar skin is a lower-layer visual decision.
- Global CSS inheritance can bypass the pattern's dependency ledger.
- The pattern must classify scrollbar appearance as signed, browser-native,
  inherited from a governed seam, or blocked.
