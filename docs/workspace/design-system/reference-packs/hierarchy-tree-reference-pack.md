# Hierarchy Tree Reference Pack

## Purpose

Freeze the current `hierarchy-tree` family baseline so later canonicals,
verification work, and downstream adoption can compare against named reference
states instead of memory of the signed-off live route.

This pack is more concrete than the behavior lock and narrower than a general
pattern note. It records the exact hierarchy-tree states that now need direct
review and later proof.

## Scope

- Family:
  `hierarchy-tree`
- Status:
  signed-off reference baseline with generated canonical-rendering launcher
  and render routes populated
- Current source surface:
  `/design-system/patterns/hierarchy-tree`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/hierarchy-tree-behavior-lock.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/hierarchy-tree-verification-checklist.md`
- Related canonical launcher:
  `/design-system/canonicals/hierarchy-tree`
- Related canonical render surface:
  `/design-system/patterns/hierarchy-tree/render`
- Related generated launcher:
  `/design-system/canonical-renderings/hierarchy-tree`
- Related generated render surface:
  `/design-system/canonical-renderings/hierarchy-tree/:ref`
- Existing executable verification:
  `tests/visual/designSystem/canonicals/data-display/hierarchyTree.spec.ts`
- Related host families:
  `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`
  `docs/workspace/design-system/behavior-locks/context-nav-drawer-behavior-lock.md`
  `docs/workspace/design-system/behavior-locks/display-settings-behavior-lock.md`

## Signed-Off Rule Source

This pack inherits the approved family rules from:

- `HT-001` through `HT-029` in
  `docs/workspace/design-system/behavior-locks/hierarchy-tree-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into named reference targets.

## What This Pack Inherits

This family pack inherits, but does not redefine:

- `context-nav` launcher placement and shell relationship
- `context-nav drawer` attachment, overlay layering, and close grammar
- `display settings` payload grouping and control ownership
- broader shell header, breadcrumb, and page-search framing

Those remain governed upstream by the existing shell and drawer families.

## Current Surface Truth

- the current signed-off family proof lives at
  `/design-system/patterns/hierarchy-tree`
- the current reference posture is a shell-attached hierarchy drawer layered
  over a background page rather than a split-page management layout
- the family currently includes:
  - protected root nodes
  - unlimited depth and child count in the pattern contract
  - separate `current` and `selected` states
  - inline rename on double click
  - inline add-child and add-sibling creation
  - desktop drag-and-drop plus non-drag movement fallbacks
  - explicit delete decision handling for nodes with children
  - desktop drawer resizing with bounded min and max width
  - mobile full-screen drawer posture
  - RTL drawer docking and mirrored expander placement
  - dark-theme-specific contrast tuning
- the current route also proves real host interplay with:
  - context-nav launchers
  - the display-settings drawer
  - theme, magnification, accent, and direction controls
- the current executable proof is still narrow:
  - the existing Playwright test confirms CSP-safe mounting and baseline row
    rendering
  - the generated launcher chain and one generated route surface are now
    covered by focused Playwright proof
  - deeper interaction states still rely on the signed-off live route and user
    review rather than exhaustive canonical or interaction tests

## Reference Contract

- The family must remain calm, drawer-hosted, and shell-attached rather than
  turning into a noisy dashboard specimen
- Tree rows must preserve the signed-off one-line row reading model with title,
  expander, compact state markers, row menu, and desktop-only subtle
  open-navigation icons when valid locators exist
- The family must preserve separate `current` and `selected` states
- Structural editing must preserve the approved hybrid model:
  inline for light edits, menu-backed for risky or structural actions
- Desktop hover and focus-within may reveal icon-only `Open` and `Open in new
  tab` actions for rows with valid locators; mobile keeps those navigation
  actions inside the row menu
- Desktop must preserve both drag-and-drop and an equivalent non-drag move path
- The hierarchy drawer must remain resizable on desktop and full-screen on
  mobile
- RTL, dark theme, focus visibility, semantic state, and touch reachability are
  part of the family contract rather than implementation extras

## Required Reference States

These are the concrete family states that later canonical and verification work
must preserve. For a family this interaction-dense, the state set needs to
cover structure, editing, movement, destructive choices, responsive posture,
localization, and accessibility pressure rather than only a small resting set.

| Ref ID | Current route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `HTR-001` | `/design-system/canonical-renderings/hierarchy-tree/HTR-001` | Desktop baseline with hierarchy drawer open and tree rows rendered | Preserves the signed-off resting family chassis and proves the route mounts under repo constraints | covered-by-test | Current Playwright proof checks mount, generated launcher chain, current-page summary, and baseline rows |
| `HTR-002` | `/design-system/canonical-renderings/hierarchy-tree/HTR-002` | Protected-root scaffold with collapsed non-root branches | Preserves the initial scaffold rule when no wider open state is active | signed-off-route | Roots remain visible and protected while lower branches stay calm |
| `HTR-003` | `/design-system/canonical-renderings/hierarchy-tree/HTR-003` | Expanded branch baseline with parent and child rows visible | Preserves normal browsing and scan behavior once a branch is open | signed-off-route | Use as the standard open-tree reading reference |
| `HTR-004` | `/design-system/canonical-renderings/hierarchy-tree/HTR-004` | Deep nesting with compressed indentation | Preserves survivable reading at deeper levels without runaway horizontal offsets | signed-off-route | Needed because depth is unlimited in the pattern contract |
| `HTR-005` | `/design-system/canonical-renderings/hierarchy-tree/HTR-005` | Diverged `current` and `selected` state | Preserves the core structural-editing model where the background page and action target do not have to be the same row | signed-off-route | Current page stays on `Overview` while another row is selected |
| `HTR-006` | `/design-system/canonical-renderings/hierarchy-tree/HTR-006` | Current and selected aligned on the same row | Preserves the calmer single-target reading state and avoids making divergence look mandatory | signed-off-route | Important complement to `HTR-005` |
| `HTR-007` | `/design-system/canonical-renderings/hierarchy-tree/HTR-007` | Inline rename active on a selected row | Preserves the double-click rename posture and inline edit field ownership | signed-off-route | Later proof should capture keyboard entry and exit as well |
| `HTR-008` | `/design-system/canonical-renderings/hierarchy-tree/HTR-008` | New child creation inline under an existing parent | Preserves the approved add-child flow and new-parent expansion behavior | signed-off-route | New node should be selected and open immediately |
| `HTR-009` | `/design-system/canonical-renderings/hierarchy-tree/HTR-009` | New sibling creation inline beside an existing row | Preserves the approved add-sibling flow as distinct from add-child | signed-off-route | New sibling should inherit stable post-action orientation |
| `HTR-010` | `/design-system/canonical-renderings/hierarchy-tree/HTR-010` | Row menu open with structural actions visible | Preserves the menu-backed action grammar for move fallbacks and destructive choices | signed-off-route | This is the non-drag structural path that must remain available |
| `HTR-011` | `/design-system/canonical-renderings/hierarchy-tree/HTR-011` | Desktop drag state with visible drop target affordance | Preserves the primary desktop move path and honest drop feedback | signed-off-route | Should include before, after, or inside targeting treatment |
| `HTR-012` | `/design-system/canonical-renderings/hierarchy-tree/HTR-012` | Menu-driven move actions without drag | Preserves equivalent non-drag movement for keyboard and non-pointer workflows | signed-off-route | Critical accessibility and fallback state |
| `HTR-013` | `/design-system/canonical-renderings/hierarchy-tree/HTR-013` | Post-move result with destination parent expanded | Preserves the stable post-action rule after a successful move | signed-off-route | Moved node should remain selected |
| `HTR-014` | `/design-system/canonical-renderings/hierarchy-tree/HTR-014` | Delete-decision dialog for a node with children | Preserves the explicit `delete`, `move`, or `orphan` decision contract | signed-off-route | Later proof should capture focus handling and fallback selection too |
| `HTR-015` | `/design-system/canonical-renderings/hierarchy-tree/HTR-015` | Delete subtree outcome | Preserves the destructive branch-removal result and predictable selection fallback | signed-off-route | Outcome should not leave the tree disoriented |
| `HTR-016` | `/design-system/canonical-renderings/hierarchy-tree/HTR-016` | Delete with `move children` outcome | Preserves the reparenting contract when children are promoted upward | signed-off-route | Important because it changes structure without full deletion |
| `HTR-017` | `/design-system/canonical-renderings/hierarchy-tree/HTR-017` | Delete with `orphan children` outcome | Preserves the root-orphaning contract as a third explicit destructive option | signed-off-route | Needed so the delete model is fully represented |
| `HTR-018` | `/design-system/canonical-renderings/hierarchy-tree/HTR-018` | Desktop hierarchy drawer at minimum practical width | Preserves readable narrow management posture and row survival under width pressure | signed-off-route | First resize boundary review |
| `HTR-019` | `/design-system/canonical-renderings/hierarchy-tree/HTR-019` | Desktop hierarchy drawer at wider management width | Preserves the adjustable-width contract and clean background-page reflow | signed-off-route | This is the wider resize reference until a dedicated canonical exists |
| `HTR-020` | `/design-system/canonical-renderings/hierarchy-tree/HTR-020` | Desktop hierarchy plus display-settings side-by-side | Preserves the approved side-by-side desktop posture and real runtime settings interplay | signed-off-route | Important because this family inherits, but coexists with, the display-settings payload |
| `HTR-021` | `/design-system/canonical-renderings/hierarchy-tree/HTR-021` | Mobile full-screen hierarchy drawer | Preserves the approved small-screen takeover posture instead of a partial-width panel | signed-off-route | Structural edits remain menu-only on mobile |
| `HTR-022` | `/design-system/canonical-renderings/hierarchy-tree/HTR-022` | Mobile row menu structural-edit state | Preserves the menu-only mobile action model once the drawer fills the screen | signed-off-route | Distinct from desktop drag and desktop row-menu review |
| `HTR-023` | `/design-system/canonical-renderings/hierarchy-tree/HTR-023` | Mobile delete-decision overlay on top of the full-screen drawer | Preserves destructive-flow layering and focus behavior on small screens | signed-off-route | Important mobile-specific overlay proof |
| `HTR-024` | `/design-system/canonical-renderings/hierarchy-tree/HTR-024` | RTL mirrored drawer docking and mirrored expander placement | Preserves native-feeling directionality at both shell and row levels | signed-off-route | Includes correct display-drawer adjacency beside the hierarchy drawer |
| `HTR-025` | `/design-system/canonical-renderings/hierarchy-tree/HTR-025` | RTL deep nesting with mirrored scan order | Preserves deep-tree readability in mirrored direction instead of only shallow RTL proof | signed-off-route | Complements `HTR-024` with real hierarchy pressure |
| `HTR-026` | `/design-system/canonical-renderings/hierarchy-tree/HTR-026` | Dark-theme readability and row/control contrast review | Preserves legibility of text, boundaries, states, and controls under non-default theme pressure | signed-off-route | Later proof should include focus visibility and non-text contrast directly |
| `HTR-027` | `/design-system/canonical-renderings/hierarchy-tree/HTR-027` | Magnified hierarchy review with row wrapping pressure | Preserves readability, hit-area practicality, and non-overlap behavior under zoom stress | signed-off-route | Important WCAG-sensitive stress state |
| `HTR-028` | `/design-system/canonical-renderings/hierarchy-tree/HTR-028` | Keyboard focus-visible review across row label, expander, menu trigger, and inline field | Preserves explicit focus attribution across the main interactive elements | signed-off-route | Dedicated accessibility review state |
| `HTR-029` | `/design-system/canonical-renderings/hierarchy-tree/HTR-029` | Assistive-technology semantics review state | Preserves truthful tree structure and programmatic state for expanded, selected, and current attribution | signed-off-route | May later require dedicated semantic assertions rather than only screenshots |
| `HTR-030` | `/design-system/canonical-renderings/hierarchy-tree/HTR-030` | Desktop long-title overflow review | Preserves clean truncation and control access when page titles exceed the resting row width | signed-off-route | Should prove menu access and marker stability with long titles |
| `HTR-031` | `/design-system/canonical-renderings/hierarchy-tree/HTR-031` | Deep-nesting plus long-title overflow review | Preserves calm truncation and non-overlap behavior under the combined pressure of depth and long names | signed-off-route | High-risk because indentation reduces the usable title lane |
| `HTR-032` | `/design-system/canonical-renderings/hierarchy-tree/HTR-032` | RTL long-title overflow review | Preserves mirrored scan order and safe truncation in a localized or mirrored reading context | signed-off-route | Needed because overflow often breaks differently in RTL |
| `HTR-033` | `/design-system/canonical-renderings/hierarchy-tree/HTR-033` | Inline rename with long-title editing review | Preserves editable long-title behavior without clipping controls or losing the active edit target | signed-off-route | Complements resting-state overflow proof with edit-mode proof |
| `HTR-034` | `/design-system/canonical-renderings/hierarchy-tree/HTR-034` | Changed-state density review across multiple rows | Preserves the quiet changed-marker grammar when many edited rows appear together | signed-off-route | Guards against drift back toward loud pill-heavy rows |

## Proposed First Canonical Review Batch

The first dedicated hierarchy-tree canonical batch should cover at least:

- `HTR-001` desktop baseline
- `HTR-004` deep nesting with compressed indentation
- `HTR-005` diverged `current` and `selected`
- `HTR-007` inline rename active
- `HTR-010` row menu open
- `HTR-011` desktop drag target feedback
- `HTR-014` delete-decision dialog
- `HTR-016` delete with `move children`
- `HTR-019` desktop wider resized drawer
- `HTR-021` mobile full-screen drawer
- `HTR-022` mobile row-menu structural-edit state
- `HTR-024` RTL mirrored drawer docking
- `HTR-026` dark-theme readability review
- `HTR-030` desktop long-title overflow review
- `HTR-033` inline rename with long-title editing review
- `HTR-028` keyboard focus-visible review

Those states express the family’s most distinctive interaction and stress
boundaries and are now available as persistence-backed generated render routes
for direct review.

## High-Risk Review Batch

The highest-risk review states are:

- `HTR-004` deep nesting with compressed indentation
- `HTR-005` diverged `current` and `selected`
- `HTR-007` inline rename active
- `HTR-011` desktop drag target feedback
- `HTR-012` menu-driven move actions without drag
- `HTR-014` delete-decision dialog
- `HTR-016` delete with `move children`
- `HTR-017` delete with `orphan children`
- `HTR-019` desktop wider resized drawer
- `HTR-021` mobile full-screen drawer
- `HTR-023` mobile delete-decision overlay
- `HTR-024` RTL mirrored drawer docking
- `HTR-025` RTL deep nesting
- `HTR-026` dark-theme readability review
- `HTR-027` magnified hierarchy review
- `HTR-028` keyboard focus-visible review
- `HTR-029` assistive-technology semantics review
- `HTR-030` desktop long-title overflow review
- `HTR-031` deep-nesting plus long-title overflow review
- `HTR-032` RTL long-title overflow review
- `HTR-033` inline rename with long-title editing review
- `HTR-034` changed-state density review

These states carry the biggest drift risk because they prove the family’s
editing posture, destructive-flow honesty, width adaptation, responsive drawer
rules, mirrored directionality, and accessibility-sensitive readability.

## Evidence Status

- the signed-off family route now exists at
  `/design-system/patterns/hierarchy-tree`
- the behavior lock now names the family contract directly
- current executable proof exists in
  `tests/visual/designSystem/canonicals/data-display/hierarchyTree.spec.ts`
- current executable proof is still limited to:
  - CSP-safe route mount
  - baseline row rendering
  - initial current-page summary
  - initial selected-row presence
- the dedicated canonical launcher now exists at
  `/design-system/canonicals/hierarchy-tree`
- the dedicated pattern-owned render surface now exists at
  `/design-system/patterns/hierarchy-tree/render`
- the generated canonical launcher now exists at
  `/design-system/canonical-renderings/hierarchy-tree`
- the generated render routes now exist at
  `/design-system/canonical-renderings/hierarchy-tree/:ref`
- focused executable proof now includes the generated index-to-family-to-render
  launcher chain and direct generated `HTR-022` route surface truth
- most interactive and stress states above are currently preserved by the live
  signed-off route and user review rather than by dedicated executable proof

## Readiness Gate

This family becomes ready for direct canonical review when:

- the generated `HTR-*` routes are reviewed as the first canonical review batch
- the verification checklist remains written directly against those states
- the pattern-owned render route and generated canonical routes are kept in
  sync with the family contract without moving drawer-shell ownership into the
  tree

## Parity Rule

A future extracted hierarchy-tree implementation or real consumer matches this
pack only when:

- it preserves the locked `HT-*` family behaviors
- it preserves the required `HTR-*` states or approved equivalents
- any host-specific difference from the signed-off reference route is recorded
  explicitly before parity is claimed

## Exit Condition

This reference pack is operational now as the baseline for downstream
canonical and verification work, but it is not complete proof by itself.

Do not treat the hierarchy-tree family as fully downstream-ready until:

- the first `HTR-*` review batch is actually reviewed on the dedicated
  generated canonical surfaces
- the hierarchy-tree verification checklist continues to point directly at
  those states
- the interaction and accessibility-sensitive states move beyond live-route
  memory into durable named proof
