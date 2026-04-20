# List Detail Split Layout Pattern

## Scope

- Pattern name:
  List detail split layout
- Status:
  signed-off
- Owner:
  Codex with user sign-off
- Related routes or consuming surfaces:
  `/design-system/templates/list-page`
  `/design-system/canonicals/list-detail-split-layout`
  `/design-system/components/list-detail-split-layout`

## Intent

- What user or operator need does this pattern serve?
  Let people browse a list and read the currently selected record in a linked
  neighboring lane without leaving the same page context.
- Why should this be reusable rather than page-local?
  The lane relationship, open/closed rhythm, mobile overlay posture, and RTL
  mirroring should stay consistent across list-style page families even when
  inner card and detail content vary.

## Anatomy

- Required parts:
  list lane, detail lane, closed single-lane state, open split state
- Optional parts:
  shell-chrome offset context, lane-specific status line, mobile overlay
  layering cues
- Content expectations:
  inner list items and inner detail content may vary, but the lane structure
  must keep both sides legible
- Layout structure:
  one-lane closed state, two-lane desktop open state, mobile full-sheet detail
  overlay beneath shell chrome

## States

- Closed:
  list-only lane with no reserved detail column
- Desktop open:
  pushed two-lane master-detail reading relationship
- Scroll-lane pressure:
  list and detail keep independent scrolling under longer content
- Mobile open:
  detail becomes an overlay over the list region inside the seam
- Mobile layering:
  overlay remains beneath shell overlays
- RTL:
  split relationship mirrors so detail shifts to the opposite side
- Magnified:
  split remains readable under half-page and zoom pressure

## Variants

- Approved variants:
  desktop closed, desktop open, independent-scroll pressure, mobile overlay,
  mobile shell-layering, RTL open split
- Variant purpose:
  preserve the parent template's current lane relationship without freezing
  search, empty-state, or selection-invalidating parent state into the child
  API
- Forbidden variants:
  bundling search/no-results/empty-state logic into the layout child, or
  treating inner card and panel anatomy as part of this pattern's API

## Token Contract

- Color tokens:
  `--surface-1`, `--surface-2`, `--line`, `--line-strong`, `--ink`,
  `--ink-soft`, `--shadow-soft`
- Typography tokens:
  current lane scaffolding typography remains local pending a second governed
  consumer
- Spacing tokens:
  lane gap, shell padding, and preview chrome spacing remain local pending
  reuse
- Radius / border tokens:
  `--radius`, `--line`
- Shadow / elevation tokens:
  `--shadow-soft`
- Other dependencies:
  parent-owned state machine plus the signed-off `ListRecordCard` and
  `ListDetailPanel` seams

## Accessibility

- Semantic structure:
  the layout seam should preserve a clear list region plus labelled detail
  region when open
- Keyboard behavior:
  the seam must not block keyboard access to either lane
- Focus treatment:
  lane relationship must not hide or clip focus-visible controls under open,
  mirrored, or overlay states
- Screen-reader expectations:
  the seam should not interfere with the signed-off card/button semantics or
  the labelled detail region supplied by the inner seams
- Localization / long-content concerns:
  lane placement, lane sizing, and readable width must remain coherent in RTL
  and under magnified pressure

## Responsive Behavior

- Mobile behavior:
  detail overlays the list region beneath shell chrome
- Tablet behavior:
  the seam may remain split but must preserve both lanes as readable regions
- Desktop behavior:
  layout expands into a pushed two-lane relationship only when detail is open
- Overflow / wrapping expectations:
  the list lane and detail lane keep independent scrolling where needed
- Shell attachment or floating expectations:
  shell chrome remains parent-owned, but the layout must respect its reserved
  top region in mobile overlay mode

## Composition Rules

- Common parent contexts:
  list-style templates with one-record-at-a-time detail reveal
- Compatible neighboring patterns:
  list record cards, list detail panel, search shell, shared page chrome
- Nesting guidance:
  use one active split layout per record context
- Browser-native affordance coexistence rules:
  keep native scroll behavior in each lane instead of inventing custom scroll
  metaphors
- Misuse cases to avoid:
  turning the split child into a full page-template replacement or burying
  parent state logic inside the layout seam

## Component Readiness

- Should this become a reusable component now?
  yes, as the third documented child seam of the `List Page` parent template
- If yes, proposed public API:
  open-state boolean, list-lane content slot, detail-lane content slot,
  responsive overlay mode, direction, optional shell-offset context

## Adoption Plan

- First governed surface to adopt:
  `/design-system/templates/list-page`
- Existing pages that should migrate later:
  future list-style families that keep the same linked browse-and-read model
- Partial-adoption note:
  parent template still owns selection, search, loading, and announcement
  choreography

## Verification

- Required screenshots or visual checks:
  desktop closed baseline, desktop open split, independent-scroll pressure,
  mobile overlay, mobile layering, RTL split, magnified split, dark theme,
  desert theme
- Accessibility verification:
  no hidden or clipped focus paths across lane states
- Responsive verification:
  open/closed lane shifts and mobile overlay behavior must stay honest
- Frontend quality-gate impact:
  existing `list-page` Playwright coverage remains upstream proof; child
  canonicals must add isolated lane-relationship verification

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/patterns/list-detail-split-layout-pattern.md`
- Design-system route update required:
  yes:
  `/design-system/canonicals/list-detail-split-layout`
  `/design-system/components/list-detail-split-layout`
- Architecture-map or guide updates required:
  not yet
- Follow-up component artifact:
  `docs/workspace/design-system/components/list-detail-split-layout-component.md`
