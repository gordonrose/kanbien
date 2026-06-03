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

## Bad Example: Pattern-Local Header Select

This fails because the pattern reconstructs a select primitive inside a header
region.

> Render the primary and secondary filter selects directly in the entity page
> header pattern because the markup is short and the source route already shows
> the desired menu.

Why it fails:

- Trigger semantics, open/closed state, option behavior, icon-only variants,
  keyboard handling, focus behavior, and mobile fullscreen behavior belong to
  the primitive.
- The pattern would copy source markup instead of consuming a governed runtime
  seam.
- The correct boundary is a menu simple select primitive with text and
  icon-only variants, then a header pattern that composes those primitives.

## Bad Example: Drawer Stacks Under List On Mobile

This fails because the pattern chooses a mobile layout without honoring the
behavior contract.

> On narrow viewports, put the detail drawer below the list so both pieces
> remain in normal document flow.

Why it fails:

- Mobile drawer behavior is a composition and focus contract, not a default CSS
  stacking choice.
- If the signed behavior says the drawer takes over the viewport, stacking
  under the list hides the active context and makes close behavior ambiguous.
- The proof must show the full overlay and the close action returning users to
  the list.

## Bad Example: Resize Bounds Fight Signed Ratios

This fails because manual resize behavior invents min/max values unrelated to
the pattern ratios.

> Let the list/detail splitter drag freely down to a narrow minimum while also
> offering 1:5 and 1:4 presets.

Why it fails:

- The manual minimum competes with the signed ratio presets.
- The list can collapse into unreadable stacked text even though the pattern
  claims a usable 1:5 minimum.
- The correct boundary is to derive manual resize limits from the same signed
  ratio or explicit pattern contract.

## Bad Example: Context Text Escapes Header Region

This fails because status text is treated as separate from the context-title
region during collapse.

> Let `Status: Ready` remain visible while the rest of the context title
> truncates, even if it overlaps trailing actions.

Why it fails:

- The status text is part of the composed context region once the pattern
  owns that region.
- Text must share the region's truncation, hiding, and collapse behavior.
- The proof must show that context text never sits behind actions and hides
  completely when the signed collapse rule requires it.
