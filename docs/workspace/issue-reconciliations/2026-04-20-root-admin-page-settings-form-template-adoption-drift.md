# Root Admin Page Settings Form-Template Adoption Drift

## Summary

The first `/root-admin#web-app-hierarchy` page-settings frontend pass reused the
signed-off icon-grid and drawer-select child controls, but it did not adopt the
signed-off `form-template` shell. The root-admin page wrapped the settings form
inside a custom admin card/grid layout with app-local CSS, so the rendered
surface drifted away from the governed template family.

## Root Cause

- The implementation prioritized functional route wiring and browser-green
  interactions over full template-shell adoption.
- The page-settings panel used custom root-admin classes such as:
  `web-app-hierarchy-workspace-card`, `web-app-hierarchy-field`, and
  `web-app-hierarchy-toggle` instead of the real `form-page-shell`,
  `form-page-card`, `form-page-section`, `form-page-grid`, `form-field`, and
  `form-toggle-row` structure.
- This violated the repo rule that first-consumer app UI must consume the
  signed-off design-system source rather than restyling around it locally.

Additional escaped root causes discovered afterward:

- The follow-up passes treated shared-asset consumption as sufficient proof of
  honest adoption, even when the visible browser result still diverged from the
  signed-off form-template host posture.
- The route was repeatedly composed from governed fragments without a literal
  comparison against the source pattern's host structure. That produced
  composition drift even after route-local CSS drift was removed.
- The implementation treated passing interaction tests as evidence of adoption
  honesty. In practice, the tests only proved feature wiring and selected
  geometry contracts, not host-parity fidelity.
- The design-system loop allowed a stale shared CSS seam to survive beside the
  canonical stylesheet. `rootAdminShell` imported
  `/design-system/assets/form-template-shared.css`, which in turn imported the
  older `/design-system/assets/formControls.css` entrypoint, while the signed-off
  drawer-select canonicals rendered through `/design-system/assets/styles.css`.
- Because the loop did not compare those two CSS entrypoints directly, the
  app could honestly consume a shared stylesheet and still miss the canonical
  selected-state treatment for `drawer-select`.
- The route mixed multiple governed families (`context-nav drawer`,
  `hierarchy-tree`, `form-template`, `icon-grid`, `drawer-select`) without a
  strict "what remains host-owned vs what belongs to the page body" checklist.
- I made unauthorized design judgments instead of stopping at the point where
  visual intent was ambiguous. The mistakes were not only code mistakes; they
  were judgment and escalation failures.

## Why The Loop Missed It

- The visual suite proved behavior, not adoption honesty.
- Existing root-admin hierarchy browser tests verified:
  - hierarchy loading
  - tree interactions
  - icon-grid and drawer-select behavior
  - page-settings and landing-page mutations
- They did not assert that the root-admin page-settings surface was actually
  built on the signed-off template shell classes.
- They also did not assert:
  - whether the form card used the full-width desktop host posture from the
    design-system page
  - whether the hierarchy drawer stayed attached in the signed-off
    context-nav-drawer posture instead of reading like a modal takeover
  - whether the primary action styling and page-shell action rail matched the
    canonical form-template route
  - whether the route body preserved the same section cadence and host
    hierarchy as the design-system form page
  - whether the dedicated hierarchy drawer launcher lived in the context-nav
    bottom stack like the source pattern rather than as an ad hoc page control
- They also did not assert that the app-consumed shared CSS entrypoint still
  matched the visual selected-state treatment of the signed-off drawer-select
  canonicals.

Gap classification:
- wrong-layer coverage
- missing regression scenario
- cross-seam adoption blind spot
- missing literal parity review against source host route
- escalation failure when visual intent was uncertain

## Reconciliation Changes Added

- Replaced the root-admin page-settings panel with the real governed
  form-template shell structure:
  - `component-catalog-section`
  - `form-page-shell`
  - `form-page-card`
  - `form-page-section`
  - `form-page-grid`
  - `form-field`
  - `form-toggle-row`
- Added shared `formTemplate.css` so the root-admin consumer can use the same
  form-template presentation seam instead of app-local approximations.
- Removed the custom root-admin field/toggle styling from the page-settings
  surface.
- Removed the leftover hierarchy preview-stage chrome that was still wrapping
  the real surface in extra summary cards, explanatory copy, and a two-column
  workspace grid.
- Flattened `/root-admin#web-app-hierarchy` into a single-column operator page
  so the selected-node block, topology block, and page-settings form read as
  one direct workflow instead of a local demo shell.
- Forced the governed page-settings consumer into the signed-off one-column
  form posture with `data-form-mobile-view="true"` so the real app no longer
  invents desktop columns the user did not ask for.
- Strengthened the visual regression test so it checks for
  `#web-app-page-settings-shell.form-page-shell` and
  `#web-app-page-settings-form.form-page-card`, while also asserting that the
  old `.hierarchy-tree-preview-shell` wrapper is absent.
- Refreshed `/design-system/assets/formControls.css` so the shared
  app-consumption seam matches the signed-off `drawer-select` canonical
  selected-state treatment from `/design-system/assets/styles.css`.
- Added a root-admin browser guard that verifies selected chips in the
  context-nav drawer no longer render as plain white cards when the governed
  drawer-select seam is active.

## Coverage Lesson

For governed frontend adoption, “uses the signed-off child controls” is not
enough. The tests also need to verify that the real consumer preserves the
signed-off shell or template framing, not just the inner control behavior.

More specifically:

- DOM-level assertions about class names and isolated states are not enough for
  first-consumer governed adoption.
- A browser-green run is insufficient if the evaluator never compares the real
  route to the source pattern page side by side.
- Interaction tests must be complemented by parity checks for:
  - host width and containment
  - primary-action styling contract
  - drawer attachment and perceived modality
  - bottom-stack launcher placement
  - section rhythm and visible intro/action framing
  - shared-entrypoint CSS parity when app consumers import a narrower
    design-system stylesheet than the canonical `/design-system` route uses

## Process Audit

The failure pattern was not random. The same reasoning defect repeated:

1. I reduced a visual-adoption task into a structural-token task.
   If the route used approved classes, imports, or child controls, I treated
   that as evidence that adoption was "basically right."

2. I overtrusted local reasoning over literal comparison.
   I kept inferring what a sane composition "should" be instead of matching the
   source route exactly where the design-system page was already the truth.

3. I optimized for passing the current test harness.
   Once the tests passed, I unconsciously treated that as partial validation of
   design intent even though the tests were not designed to validate that.

4. I kept narrowing the bug instead of re-evaluating the whole host posture.
   Each time you pointed out a visible mismatch, I patched the most obvious
   nearby cause, but I did not step back early enough to ask whether the whole
   route composition was still wrong.

5. I escalated too late.
   I should have surfaced "I cannot confidently map this route to the source
   pattern without visual direction" much earlier, instead of continuing to
   guess.

## Guardrails Needed

- For first-consumer governed app-page adoption, do a literal source-route
  comparison before implementation and before declaring parity.
- When the source pattern is a full route, compare:
  - host actions
  - drawer trigger placement
  - visible section hierarchy
  - full-width vs contained posture
  - primary-action presentation
  - modal vs attached-drawer perception
- Do not let browser-green interaction suites substitute for adoption review.
- If the visible route still differs in obvious posture from the source
  pattern, stop and raise the mismatch instead of "trying one more pass."

## Follow-Up Watch Items

- The live `/design-system/templates/form` route is currently not trustworthy as
  a rendered parity source, so the recovery pass for
  `/root-admin#web-app-hierarchy` is now grounded in the signed-off canonical
  launcher, behavior lock, reference pack, and template note instead of the
  broken live route alone.
- Audit whether `formTemplate.css` should become the single shared template
  source for both `/design-system` and app consumers, rather than remaining a
  root-admin-only import extracted from the design-system source.
- Audit whether `formControls.css` should remain a separately maintained shared
  subset at all, or whether the design-system loop should materialize it from
  the same source block used by `/design-system/assets/styles.css` so the two
  entrypoints cannot drift silently.
- Add a broader governed-adoption check for future root-admin template
  consumers so custom local wrapper CSS is caught earlier.
- `AGENTS.md` now contains an explicit ironclad rule that governed app-page CSS
  must not be added during page builds and that agents must raise the blocker
  for human intervention instead of unilaterally moving the work into a
  design-system loop.
