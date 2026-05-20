# Entity Management Page WCAG 2.2 AA Checklist

## Purpose

Define the accessibility and resilience checks required before the
`entity_management_page` template can become an active app-consumable
design-system seam.

This checklist focuses on WCAG 2.2 AA and the user-requested pressure states:
long labels, lots of list items, zoom/magnification, mobile page scrolling, and
the agreed page behaviors.

## Scope

- Family:
  `entity-management-page`
- Status:
  review-candidate checklist
- Related reference pack:
  `docs/workspace/design-system/reference-packs/entity-management-page-reference-pack.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/entity-management-page-verification-checklist.md`

## WCAG 2.2 AA Baseline

| WCAG criterion | Requirement for this page | Status |
| --- | --- | --- |
| `1.1.1 Non-text Content` | Icons for edit, evidence, AI, copy, delete, move, add, and bottom-nav actions must have text alternatives through accessible names or hidden decorative posture. | needs evidence |
| `1.3.1 Info and Relationships` | Region tabs, tabpanels, grouped fields, field labels, drawer-selects, details/summary sections, and evidence/AI drawers must expose relationships programmatically. | needs evidence |
| `1.3.2 Meaningful Sequence` | Keyboard and screen-reader order must follow task order: shell, page header, region selector, nested list, detail panel, evidence/AI overlay when present, bottom nav. | needs evidence |
| `1.3.4 Orientation` | Page must work in portrait and landscape mobile without requiring one orientation. | needs evidence |
| `1.4.1 Use of Color` | Evidence, AI, destructive, selected, hidden, disabled, and readonly states must not depend on color alone. | needs evidence |
| `1.4.3 Contrast Minimum` | Text and meaningful labels must meet AA contrast in normal, dark, and alternate themes. | needs evidence |
| `1.4.4 Resize Text` | Text can scale to 200% without loss of content or function. | needs evidence |
| `1.4.10 Reflow` | At 320 CSS px equivalent width and 400% zoom where applicable, content must reflow without two-dimensional page scrolling, except for the approved horizontal nested-card carousel. | needs evidence |
| `1.4.11 Non-text Contrast` | Focus rings, control boundaries, selected states, evidence/AI outlines, destructive icons, and form field borders must meet non-text contrast requirements. | needs evidence |
| `1.4.12 Text Spacing` | Applying WCAG text-spacing overrides must not clip labels, overlap cards, hide controls, or break page-level scroll. | needs evidence |
| `1.4.13 Content on Hover or Focus` | Tooltips, menus, selector lists, drawer-select panels, and any hover/focus content must be dismissible, hoverable where relevant, and persistent long enough to use. | needs evidence |
| `2.1.1 Keyboard` | All interactive behavior must work without pointer input, including region selection, nested selection, resizer, add/copy/delete, workflow builder, drawer-selects, evidence/AI, and bottom nav. | needs evidence |
| `2.1.2 No Keyboard Trap` | Focus must not become trapped inside region selector, drawer-select, evidence/AI overlay, details sections, or bottom navigation without an exit. | needs evidence |
| `2.4.3 Focus Order` | Focus order must remain logical across lazy-rendered regions and dynamically added items. | needs evidence |
| `2.4.4 Link Purpose` | Any link-like navigation or bottom-nav action must have purpose clear from name/context. | needs evidence |
| `2.4.6 Headings and Labels` | Section headings and field labels must describe purpose, including generated model panels and repeated item panels. | needs evidence |
| `2.4.7 Focus Visible` | Every keyboard-focusable control must show a visible focus indicator in all themes. | needs evidence |
| `2.4.11 Focus Not Obscured (Minimum)` | Focus must not be fully obscured by fixed/sticky shell chrome, bottom nav, overlays, or scroll containers. | needs evidence |
| `2.5.1 Pointer Gestures` | Carousel and resizer behavior must not require complex gestures without an alternative. | needs evidence |
| `2.5.2 Pointer Cancellation` | Pointer actions for add/copy/delete/move/resizer must avoid accidental activation patterns where applicable. | needs evidence |
| `2.5.3 Label in Name` | Visible labels for controls must be included in accessible names where labels are visible. | needs evidence |
| `2.5.7 Dragging Movements` | The nested resizer must have a keyboard alternative; any future drag-only ordering must expose non-drag controls. | partially covered by source, needs rendered keyboard evidence |
| `2.5.8 Target Size (Minimum)` | Buttons, icon controls, carousel cards, picker triggers, and bottom-nav items must meet target-size expectations or spacing exceptions. | needs evidence |
| `3.2.1 On Focus` | Focusing fields, cards, menus, or evidence/AI affordances must not unexpectedly switch region, submit, delete, or open a drawer. | needs evidence |
| `3.2.2 On Input` | Editing text or selecting options must not cause unexpected context changes except documented live card/derived-field updates. | needs evidence |
| `3.2.6 Consistent Help` | Help/error/evidence affordances should appear consistently for repeated generated fields. | needs evidence |
| `3.3.1 Error Identification` | Validation and generated form errors must be identifiable in text, not only color. | needs future error-state evidence |
| `3.3.2 Labels or Instructions` | Generated fields, drawer-selects, toggles, and action model sections must include usable labels/instructions. | needs evidence |
| `3.3.7 Redundant Entry` | Repeated generated data should not force avoidable re-entry when duplicate/copy behaviors are intended to help. | needs app-data review |
| `4.1.2 Name, Role, Value` | Custom controls must expose name, role, value, expanded/selected/pressed/hidden state as appropriate. | needs evidence |
| `4.1.3 Status Messages` | Dynamic changes such as add/delete, validation changes, and lazy materialization should announce status where necessary. | needs evidence |

## Long Labels And Localization

Verify all of these in desktop, mobile, and RTL:

- region labels with long words and long translated phrases
- nested card labels with long names and descriptions
- add-card labels with long object names
- field labels and helper text with long localized copy
- workflow status names with long values
- permission role names with long values
- action model route/method text with long paths
- evidence/AI element names and values with long strings
- unbroken tokens such as long keys, ids, URLs, and permission names

Pass condition:

- no text overlaps other controls
- no text escapes its card/panel/field in a way that causes horizontal page
  overflow
- truncation has a recovery mechanism where the full value matters
- line wrapping does not collapse target size or hide adjacent actions

## Lots Of List Items

Verify high-count states beyond the current demo:

- more than 13 top-level regions if the future entity model allows them
- at least 20 nested items in a region
- at least 20 workflow statuses
- at least 20 catalog options
- at least 20 permission roles
- at least 20 action model capabilities

Pass condition:

- desktop region index remains navigable
- desktop nested list remains usable with internal scroll where approved
- mobile nested cards remain horizontally scrollable without vertical trapping
- add cards remain reachable
- selected state remains clear
- lazy rendering does not eagerly materialize every hidden item detail
- keyboard operation remains practical

## Zoom, Reflow, And Text Spacing

Verify:

- 200% browser zoom at desktop width
- 200% browser zoom at mobile width or equivalent device emulation
- narrow width around 320 CSS px where practical
- text spacing override:
  - line-height at least 1.5
  - paragraph spacing at least 2 times font size
  - letter spacing at least 0.12 times font size
  - word spacing at least 0.16 times font size

Pass condition:

- the page can be read and operated without horizontal page scrolling, except
  for the approved nested-card carousel
- mobile scroll remains page-level
- bottom nav remains reachable
- focus is not obscured by fixed or sticky chrome
- field labels, helper text, buttons, and cards do not overlap
- evidence/AI overlays remain dismissible and readable

## Keyboard Checklist

Verify keyboard-only operation for:

- top shell navigation into the page
- region selector on desktop
- mobile region picker
- nested card activation
- nested resizer using arrow keys, Home, and End
- add workflow/catalog/permission
- copy/delete workflow/catalog/permission
- collapsible sections
- details/summary rows
- drawer-select open/search/select/close
- workflow status add/move/remove
- catalog option add/move/remove
- permission family enable/select all/deselect all
- evidence mode toggle
- evidence target open/close
- AI mode toggle
- AI target open/close
- edit mode toggle
- bottom nav

Pass condition:

- visible focus is present for every step
- focus order is logical
- no keyboard trap exists
- close/dismiss paths return focus predictably
- destructive actions are reachable but not accidentally triggered by focus

## Agreed Behavior Checklist

These are explicit behavior decisions from the recent design loop:

- lazy rendering is a hard rule for patterns and page templates
- initial render creates only the active region and active nested panel
- mobile vertical scroll belongs to the whole page
- mobile nested cards keep the approved carousel
- carousel behavior applies across sections, not only Identity
- desktop evidence/AI split must not squash the details panel
- shared nested-list behavior should be reused rather than custom per-section
  markup
- add-card sections must follow the same nested-list behavior as non-add-card
  sections

Pass condition:

- each agreed behavior has browser evidence and executable regression coverage
  before sign-off.

## Open WCAG Evidence Gaps

- screen-reader pass with lazy-rendered panels
- keyboard pass for dynamically added items
- focus return for evidence and AI close paths
- RTL mobile carousel behavior
- high-count list fixtures
- long-label and unbroken-token fixtures
- formal contrast measurements in all supported themes
- text-spacing override screenshot/geometry proof

