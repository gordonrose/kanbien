# List Record Card Behavior Lock

## Purpose

Lock the behavioral rules for the `ListRecordCard` child seam before treating
its canonical set as the next review gate.

This artifact governs the extracted summary-card seam itself.
Parent-template rules such as selection choreography, detail-panel placement,
mobile overlay semantics, and shell stacking stay governed by:

- `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`

Do not duplicate those parent behaviors here unless the child seam needs to
reference them explicitly.

## Review Status Legend

- `approved`:
  behavior should be preserved in the child reference pack and later consumers
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior still needs iteration before being locked

## Scope

- Family:
  `list-record-card`
- Current source surface:
  `/design-system/templates/list-page`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/list-record-card-reference-pack.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/list-record-card-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/list-record-card-component.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `LRC-BL-001` | The `ListRecordCard` must be governed as a child seam of `List Page` rather than as a replacement for the whole parent template. | Keeps the extraction boundary honest and avoids freezing parent layout or drawer behavior into the card seam. | The current repeated card anatomy is stable while parent split-layout and drawer rules remain template-owned. | `approved` | This seam should cover the record card itself, not the whole page. |
| `LRC-BL-002` | The card must remain a real full-width `button` rather than a generic clickable container. | Preserves semantics, keyboard activation, and a stable interaction target. | The current implementation already uses button-based cards throughout the parent list. | `approved` | Keep native button behavior. |
| `LRC-BL-003` | The card must preserve a stacked summary anatomy with title, subtitle, description, and wrapping tag row when those fields are present. | Protects scanability and keeps the repeated summary rhythm consistent across list contexts. | The current repeated card markup already uses this stacked structure. | `approved` | Keep the current summary-card anatomy. |
| `LRC-BL-004` | The selected state must increase emphasis without changing card geometry or introducing inline detail expansion. | Prevents active-state drift from breaking list rhythm or smuggling detail behavior into the child seam. | The current selected treatment uses border and surface emphasis while keeping the same card dimensions. | `approved` | Selected should feel clear but geometry-safe. |
| `LRC-BL-005` | The card must remain a whole-card selection affordance and should not introduce competing local action clusters. | Keeps list scanning and selection simple and prevents toolbar-like drift inside each record row. | The current cards expose one whole-card interaction surface with no nested actions. | `approved` | No competing per-card action toolbar. |
| `LRC-BL-006` | Missing primary identity should use the neutral fallback `Untitled record`, while missing secondary fields such as subtitle or tags should be omitted cleanly. | Preserves resilience without inventing noisy placeholders for absent optional data. | The current parent missing-attributes state already exercises this fallback and omission behavior. | `approved` | Keep the same fallback/omission posture. |
| `LRC-BL-007` | Compact title, subtitle, and tag content may truncate with tooltip recovery in constrained-width states, while summary body copy may grow vertically instead of clipping. | Preserves scanability while keeping meaningful values recoverable under width pressure. | The current canonicals already prove truncation and tooltip recovery on compact fields, while body copy remains readable. | `approved` | Compact fields can truncate, but summary copy should stay readable. |
| `LRC-BL-008` | The card must remain full width within the parent list lane on desktop and mobile rather than becoming a floating tile or multi-column card. | Preserves the parent list rhythm and avoids introducing a different catalog grammar by accident. | The current card stays full width in desktop, half-page, and mobile review states. | `approved` | Keep the full-width list-lane posture. |
| `LRC-BL-009` | In RTL, text alignment, truncation posture, and tag-row flow should mirror coherently while preserving the same one-click selection contract. | Ensures the card feels native in RTL rather than only cosmetically flipped by the parent shell. | The current RTL child canonical already proves logical-start alignment and mirrored lane direction. | `approved` | The card itself should mirror cleanly in RTL. |
| `LRC-BL-010` | Focus-visible state must remain clear without shifting layout and should share the same geometry-safe emphasis posture as hover. | Protects keyboard usability and WCAG-relevant visibility in the child seam. | Current styling keeps hover and focus emphasis on border/surface rather than layout shift. | `approved` | Focus should be obvious and stable. |
| `LRC-BL-011` | Parent-owned behaviors such as opening the detail panel, focus transfer into the panel, and mobile overlay stacking must remain outside this child seam unless a later review explicitly promotes them. | Keeps the seam boundary honest and avoids accidental API creep from parent interactions into the card artifact. | The current child canonicals intentionally stop at the card surface and leave parent choreography upstream. | `approved` | Keep parent open/close choreography outside this seam. |

## Exit Criteria For This Step

This behavior lock step is complete when the child-seam rules above are stable
enough to guide:

- the child reference pack
- the child canonical set
- the child verification checklist

Do not treat the `ListRecordCard` canonicals as the next sign-off gate until
these child behaviors are explicitly reviewed first.
