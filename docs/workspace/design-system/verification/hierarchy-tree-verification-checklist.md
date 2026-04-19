# Design System Verification Checklist

## Scope

- Artifact name:
  `Hierarchy Tree`
- Surface:
  `/design-system/patterns/hierarchy-tree`
- Status under review:
  signed-off family reference baseline with first dedicated canonical launcher
  and pattern-owned render surface created
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/hierarchy-tree-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/hierarchy-tree-reference-pack.md`
- Related adoption contract:
  `docs/workspace/design-system/adoption/root-admin-web-app-hierarchy-tree-adoption-contract.md`
- Existing executable verification:
  `tests/visual/designSystem/hierarchyTree.spec.ts`
- Related canonical launcher:
  `/design-system/canonicals/hierarchy-tree`
- Related canonical render surface:
  `/design-system/patterns/hierarchy-tree/render`
- Related host families:
  `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`
  `docs/workspace/design-system/behavior-locks/context-nav-drawer-behavior-lock.md`
  `docs/workspace/design-system/behavior-locks/display-settings-behavior-lock.md`

## Visual Contract

- One-sentence rule:
  `Hierarchy Tree` must remain a calm shell-attached content-tree family that
  supports direct inline editing, explicit structural actions, current-versus-
  selected divergence, bounded desktop resize, mobile full-screen drawers, and
  mirrored RTL behavior without sacrificing readability or access to controls.
- Trigger for this review:
  continue the design-system loop after the live hierarchy-tree prototype was
  signed off as the upstream family reference route
- What changed since the last review:
  the family now has a dedicated behavior lock, a reference pack expanded to a
  realistic `HTR-*` state matrix, signed-off route framing as a reference page
  instead of a prototype page, explicit WCAG-shaped behavior rules, and
  explicit long-title overflow coverage for both resting rows and inline rename

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/patterns/hierarchy-tree/index.html`
  `src/frontend/designSystem/assets/hierarchyTree.css`
  `src/frontend/designSystem/assets/hierarchyTree.mjs`
  `src/frontend/designSystem/patterns/index.html`
  `tests/visual/designSystem/hierarchyTree.spec.ts`
- Implementation updated:
  yes
  this loop created the governed route framing, the signed-off behavior lock,
  the expanded reference pack, and the current hierarchy-tree runtime surface
  including desktop resize, mobile full-screen posture, RTL mirroring, and
  display-settings co-presence
- Known source-level risks:
  most deep interactive states still depend on the signed-off live route and
  manual review rather than direct executable proof
  semantic tree-state assertions and long-title overflow stress still need
  direct downstream verification rather than only source confidence

## Rendered Verification

- Required viewports checked:
  desktop route review and narrow mobile route review were exercised during the
  live design-system loop; only baseline executable proof exists today
- Required direction states checked:
  RTL route review completed during the live loop, including mirrored drawer
  docking and expander placement
- Required theme states checked:
  dark-theme route review completed during the live loop with hierarchy-
  specific contrast adjustments
- Required magnification states checked:
  magnification is present through the display-settings payload and was
  interactively reviewed during the live route loop, but still lacks direct
  dedicated executable proof
- Real interactive states checked:
  desktop drag-and-drop
  menu-only mobile structural actions
  inline rename on double click
  add child and add sibling
  explicit delete decision handling
  desktop drawer resizing
  display-settings drawer co-presence
- Overflow or clipping checks:
  route-level review now treats long-title overflow as a named family concern,
  but direct overflow-specific executable proof does not yet exist
- Layering or anchoring checks:
  route-level review covered shell-attached hierarchy drawer placement,
  display-settings side-by-side desktop posture, mobile full-screen drawers,
  and RTL adjacency corrections
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/hierarchyTree.spec.ts`
  `docs/workspace/design-system/reference-packs/hierarchy-tree-reference-pack.md`

## Accessibility Verification

- Keyboard entry and exit:
  partially verified
  the signed-off route exposes keyboard-reachable controls and inline edit
  entry, but direct tree-navigation and row-menu-flow proof still needs
  dedicated downstream verification
- Focus order and return focus:
  partially verified
  owned drawer and delete-dialog flows were reviewed in the live route, but
  return-focus behavior still needs direct executable assertions
- Semantic structure:
  source inspected
  the family now explicitly requires coherent tree semantics and programmatic
  expanded, selected, and current attribution, but direct semantic assertions
  are still pending
- Screen-reader naming and labeling:
  source inspected
  the route exposes labelled drawers, named row controls, and state markers,
  but deeper screen-reader verification is still pending
- Interaction target size:
  source inspected and route-reviewed
  mobile and magnified practicality are now explicit family rules, but still
  need direct downstream proof
- Focus visibility:
  route-reviewed
  dark theme, RTL, mobile, and inline-edit focus states were refined during
  the live loop, but no dedicated visual focus-state assertion exists yet
- Contrast or motion considerations:
  dark-theme route review completed; no family-owned motion contract currently
  exists beyond normal interaction transitions
- Localization or long-content considerations:
  partially verified
  RTL layout and long-title overflow are now named family states, but direct
  canonical or executable stress proof still needs to be added

## State Coverage

- Default:
  covered through executable baseline route proof
- Hover / pressed / focus:
  partially covered
  focus was route-reviewed but not yet directly asserted
- Selected / active:
  partially covered
  initial selected-row and current-page divergence are visible on the signed-
  off route, but deeper state transitions still need direct proof
- Disabled:
  not defined as a major family state today outside protected-root action
  restrictions
- Loading:
  not applicable
- Empty:
  not applicable
- Error:
  not a standard row state today outside destructive confirmation flows
- Denied / restricted:
  partially covered
  protected-root non-movable and non-deletable posture is part of the family
  contract but still needs direct executable review
- Destructive:
  route-reviewed
  delete decision and multiple delete outcomes are explicitly named in the
  reference pack but still need direct proof

## Quality Gate Outcome

- Implementation status:
  signed-off live family route exists and is governed by the new artifact chain
- Rendered status:
  partially verified
  the signed-off route has been interactively reviewed, but executable proof
  still covers only the baseline mount and initial row state
- Human sign-off status:
  the live route itself is signed off as the family reference baseline
- Promotion decision:
  keep the family at `signed-off reference baseline`, not yet full downstream
  proof-complete
- Open follow-ups:
  promote the first `HTR-*` canonical batch out of live-route memory and into
  durable reopenable states
  extend executable proof to cover keyboard navigation, delete outcomes, RTL,
  dark theme, mobile full-screen posture, resize behavior, and long-title
  overflow

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/hierarchy-tree-verification-checklist.md`
- Design-system route update required:
  yes
  the new launcher and render routes exist and now need their first direct
  review batch kept in sync with the pack
- Canonical render-ready / honest-width check required:
  pending
  required on the new pattern-owned canonical render route
- Frontend gate manifest update required:
  not yet
  wait until the first dedicated canonical batch and stronger executable proof
  exist
- Architecture-map update required:
  no
- Real-app adoption now allowed:
  candidate first-consumer adoption contract exists, but real-app adoption is
  not complete until the root-admin consumer proves parity against the signed-
  off family and keeps this checklist honest
