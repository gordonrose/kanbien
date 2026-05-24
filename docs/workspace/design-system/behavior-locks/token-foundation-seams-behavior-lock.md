# Token Foundation Seams Behavior Lock

## Scope

This lock covers the token-route seams signed off for reusable design-system
consumption from `/design-system/tokens`:

- `filter-panel-structure`
- `entity-page-structure`
- `nested-entity-record`
- `background`
- `container`
- `container-section`
- `colours`
- `paragraph`
- `header`
- `icon-button`
- `tooltip`

These seams define reusable foundation tokens, structural primitives, and
source-of-truth review surfaces. They do not define domain content, app-local
copy, route-specific data, or feature-specific workflows.

## Shared Token Route Contract

- `TFS-001`: Every promoted token route renders inside the shared design-system
  shell.
- `TFS-002`: Every route exposes a deterministic review URL under
  `/design-system/tokens/<family>`.
- `TFS-003`: Every route must keep token review content separate from real app
  domain content.
- `TFS-004`: Source drawers may expose CSS and usage notes, but source-drawer
  text is not a substitute for the reusable seam contract.
- `TFS-005`: Display settings may demonstrate approved variants only;
  unsupported variants must not appear as selectable options.
- `TFS-006`: Shared CSS classes and custom properties may be consumed by app
  surfaces only through an approved adoption contract.

## Foundation Visual Tokens

- `TFS-007`: `background` owns the environmental page wash, glow, corner, and foundation
  surface behavior for design-system shells and structural primitives.
- `TFS-008`: `colours` owns semantic color review across normal, dark, desert, success,
  warning, and error treatment where those states are present.
- `TFS-009`: `paragraph` owns reusable paragraph scale, line height, weight, case, and
  semantic ink variants.
- `TFS-010`: `header` owns reusable heading scale, line height, weight, case, and
  theme-aware ink.
- `TFS-011`: Foundation token routes must show token names, rendered previews, and the
  semantic value or CSS variable being approved.

## Container Tokens

- `TFS-012`: `container` owns the default outer container surface, border, background, and
  state-color treatment.
- `TFS-013`: `container-section` owns the interior section surface for repeated or grouped
  regions inside a container.
- Container seams remain visual structure only. They must not imply card
  content, record layout, drawer behavior, or app-specific section purpose.

## Control Tokens

- `TFS-014`: `icon-button` owns the icon-only button frame, minimum and maximum sizing,
  hover/focus treatment, accessible-name requirement, and tooltip relationship.
- `TFS-015`: `tooltip` owns the shared floating tooltip surface, typography dependency,
  arrow, max size, z-index layer, and placement behavior.
- Icon buttons must have accessible names. Tooltip text may mirror that label
  but must not replace it.
- Tooltip anchors must use the shared tooltip token layer instead of
  one-off title attributes or app-local tooltip styling.

## Structure Tokens

- `TFS-016`: `entity-page-structure` follows its dedicated behavior lock at
  `docs/workspace/design-system/behavior-locks/entity-page-structure-behavior-lock.md`.
- `TFS-017`: `nested-entity-record` consumes the entity record body seam inside a bounded
  nested frame with horizontal and vertical resize handles.
- `TFS-018`: `filter-panel-structure` owns the overlay filter panel foundation:
  fixed overlay width while the page behind it resizes, full-width mobile
  behavior, sticky title section, and a scroll-only card stack.
- `TFS-019`: Filter panel title structure is split `3:1`; the left title zone owns the
  main title area and the right zone owns auxiliary controls.
- `TFS-020`: Filter panel card structures stack from top to bottom with fixed section
  height; they do not stretch to fill remaining panel height.
- `TFS-021`: Filter panel display settings may show no card structure, five card
  structures, or twenty card structures to prove scroll behavior.
- `TFS-022`: The filter panel title section must remain pinned while the card stack
  scrolls.

## Responsive, Theme, Direction, And Magnification

- Desktop token routes must preserve the approved shell framing and review
  surfaces without app content overlap.
- Mobile token routes may simplify review layout, but the approved token or
  structure must remain visible and inspectable.
- RTL support is required for shell and structural directionality. Token values
  that are direction-neutral may record direction as no visual difference.
- Theme support is required where the family exposes normal, dark, or desert
  states.
- Magnification must not cause token names, preview labels, controls, or
  structural regions to overlap incoherently.

## Accessibility

- Interactive seams must expose reachable controls, clear pressed state, and
  visible focus treatment.
- Structural preview regions must use labels that identify review regions
  without implying production content semantics.
- Icon-only controls require accessible names.
- Tooltip previews must be keyboard reachable when the represented trigger is
  focusable.

## Non-Goals

- These seams do not approve real app pages by themselves.
- These seams do not approve app-local copies of token route HTML, CSS, or
  controller logic.
- These seams do not approve generated canonical render pages; the current
  signed-off review surfaces remain the token routes listed in scope.
