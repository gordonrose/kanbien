# Context-Nav Pattern

## Scope

- Family:
  `context-nav`
- Current promotion state:
  signed-off on `/design-system`
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/context-nav-reference-pack.md`

## Purpose

The `context-nav` family provides shell-attached section navigation that stays
compact on desktop as a vertical rail and converts into a bottom navigation bar
on mobile without losing current-location visibility or access to governed
utility actions.

## Signed-Off Structure

- Desktop rail:
  narrow icon-first vertical rail attached to the true bottom edge of the
  combined top-nav and sub-nav header stack
- Top region:
  primary destinations that build downward from the top edge of the rail
- Bottom region:
  persistent utility actions that remain pinned to the bottom edge of the rail
- Mobile conversion:
  bottom navigation bar with visible labels and a governed `More` sheet for
  overflowed utility actions

## Signed-Off Responsive Rules

- Desktop stays icon-first and keeps labels visually hidden
- Tall desktop stacks stay in the scroll model under height pressure rather
  than switching to a separate collapse-menu mode
- Only the top region may scroll; the bottom region remains visible
- Mobile uses a deliberate bottom-bar conversion rather than a squeezed rail
- Mobile `More` opens as a wide sheet tied to the bottom bar
- Mobile drawers fill the lane down to the top edge of the bottom bar

## Signed-Off Interaction Rules

- Active state remains visible in both rail and bottom-bar modes
- Tooltip reveal for hidden or truncated labels is hover-based and uses the
  governed overlay layer
- Menus and drawers close on outside click and `Escape`, returning focus to
  the trigger
- Drawer close controls use the same square button grammar as the family and a
  centered diagonal close glyph

## Signed-Off Alternate-Mode Rules

- RTL keeps the desktop shell in desktop mode when width fits and mirrors the
  rail to the full right edge
- Tooltip, menu, and drawer anchoring follow the mirrored right-edge
  presentation in RTL
- Long labels and magnification prefer truncation, tooltip reveal, and the
  signed-off responsive fallbacks over overlap or distortion

## Required Canonical Set

The signed-off baseline is defined by:

- `CNR-001` desktop rail baseline
- `CNR-002` tall top-stack scroll
- `CNR-003` desktop tooltip hover target
- `CNR-004` short-height desktop scroll pressure
- `CNR-005` mobile bottom-nav baseline
- `CNR-006` mobile `More` open
- `CNR-007` context-nav drawer launch
- `CNR-008` RTL right-edge rail
- `CNR-009` magnified long-label desktop
- `CNR-010` theme and accent readability

## Not In Scope For This Pattern

- route-specific business destinations beyond approved current-page or
  family-level destinations
- tenant-facing navigation structures
- arbitrary desktop collapse-menu variants for top-stack pressure

## Next Promotion Step

This family is ready for `system-ready` verification, token candidacy review,
and first-consumer adoption planning against the root admin shell.
