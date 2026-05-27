# 41 Front-End Harness Anti-Drift Remediation Plan

Created May 27, 2026.

## Original Goal

Update the `41-front-end` harness so the mistakes found during the Layer 2,
Layer 3, and Layer 4 index-navigation work become hard or impossible to repeat.

The harness must stop downstream layers from:

- skipping required lower-layer work
- inventing unsigned visual values
- treating rendered routes as governed source of truth
- building primitive behavior inside patterns
- hiding source values and formulas from rendered proof pages
- using inert proof controls
- letting global CSS inheritance masquerade as signed styling
- implementing scroll behavior without naming the scroll owner
- claiming readiness without browser evidence

## Plan

1. Add a durable plan note.

   This file records the remediation target before changing the harness.

2. Add shared preflight requirements.

   Create a shared layer-work preflight that every active Layer 2+ skill must
   run before implementation. The preflight must require a decision ledger:
   observed thing, owning layer, existing seam, missing seam, action.

3. Add shared rendered-proof requirements.

   Create a shared rendered-proof contract for Layers 2-4 so proof pages show
   what they prove, where values come from, which controls are proof-only, and
   which browser evidence verifies the controls.

4. Wire the preflight into the orchestrator.

   Update routing, gates, and evals so route-derived, screenshot-derived, or
   source-material-derived work cannot proceed from memory or intent.

5. Update Layer 1 behavior-rule harness.

   Require source decomposition when source material exists. The behavior rule
   must identify responsive behavior, scroll owners, interactive affordances,
   text overflow expectations, routing posture, and repeated structures before
   downstream layers work from it.

6. Update Layer 2 token harness.

   Require token work to name the downstream runtime property it unlocks and
   block later-layer CSS values that should have been signed tokens.

7. Update Layer 3 primitive harness.

   Require primitive inventory from source material and force every visible,
   textual, interactive, overflow, and state affordance to map to a signed
   token, browser-native behavior, inherited contract, or proof-only pressure.

8. Update Layer 4 pattern harness.

   Require a composition ledger. Every child rendered by a pattern must be a
   governed primitive, governed child pattern, browser-native wrapper, inherited
   later-layer contract, or proof-only wrapper. Scroll owner and alignment
   evidence must be explicit.

9. Add bad examples from the session.

   Add durable examples for skipped primitives, invented markers, tooltip
   overreach, local header markup, inherited scrollbar styling, inert controls,
   unclear mobile scroll proof, and floating list alignment.

10. Record generalized executable audit categories.

    Do not frame future executable audits only around specific mistakes already
    observed. Define category-level audits for CSS value provenance,
    interactive-affordance provenance, rendered-child classification,
    proof-control evidence, source-material decision ledgers, and layer seam
    import boundaries. Use the observed mistakes as seed fixtures, not as the
    full audit scope.

11. Audit the result.

    Re-read the modified harness and check it against the actual mistakes. The
    audit passes only if a future assistant following the harness would be
    forced to stop, route back, or document a blocker before repeating each
    failure.
