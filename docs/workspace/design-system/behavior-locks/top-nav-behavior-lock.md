# Top Nav Behavior Lock

## Purpose

Lock the behavioral rules for the `top-nav` family before creating a signed-off
 reference pack or promoting the pattern toward application adoption.

This artifact is intentionally narrower than a pattern note. It exists so the
user can approve, reject, or defer individual behaviors based on the current
`/design-system` implementation.

## Review Status Legend

- `approved`:
  behavior should be preserved in the signed-off reference pack
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior needs more iteration or clarification before being locked

## Scope

- Family:
  `top-nav`
- Current source surface:
  `/design-system`
- Related pattern:
  `docs/workspace/design-system/patterns/navigation-shell-pattern.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/top-nav-verification-checklist.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `TN-000` | The brand mark must keep its visual proportions under layout pressure, while the adjacent brand name may disappear first if space becomes tight. | Preserves brand recognition and prevents the shell from distorting the identity anchor. | Current shell keeps a fixed-size brand mark and separate adjacent copy; responsive hiding priority for the brand name is not yet explicitly governed. | `approved` | Brand proportions must be preserved; the name beside the mark can disappear first when space gets tight. |
| `TN-001` | As horizontal space shrinks, the shell should move primary destinations into an overflow menu before switching to the fully mobile navigation mode. | Preserves orientation without early collapse or overlapping layout. | Implemented through measured-fit and overlap checks in `src/frontend/designSystem/assets/app.mjs`. | `approved` | Locked as part of the signed-off responsive shell behavior. |
| `TN-002` | The shell should keep the desktop primary-navigation pattern while at least two primary destinations and the `More` button can remain visible, but should switch to the fully mobile navigation mode once the next step would leave only one primary destination plus `More`. | Preserves enough inline orientation to feel like a real desktop header while avoiding the cramped one-item-plus-`More` state. | Current overflow logic hides items progressively until one item remains; future implementation should switch to mobile one step earlier to match the locked rule. | `approved` | Keep desktop behavior with 2 visible destinations plus `More`; once it would become 1 visible destination plus `More`, switch to mobile. |
| `TN-003` | The current route should remain visibly identifiable when its destination moves into the overflow menu. | Prevents loss of orientation in reduced-width states. | Overflow rendering preserves `aria-current=\"page\"` for the moved current item. | `approved` | Locked as part of preserving orientation across responsive states. |
| `TN-004` | Primary destinations should never wrap onto a second line; the shell should prefer overflow or mobile collapse instead. | Avoids ambiguous hierarchy and broken header geometry. | Current logic relies on fit and overlap checks rather than allowing wrapping. | `approved` | Locked: overflow or mobile collapse is preferred over wrapping. |
| `TN-005` | Desktop utility actions should remain right-aligned and should not overlap the primary navigation. | Maintains stable header geometry and keeps account actions predictable. | Current logic explicitly checks utility overlap before deciding overflow or collapse. | `approved` | Locked as part of the three-region shell contract. |
| `TN-006` | Opening the desktop profile trigger should reveal a lightweight anchored menu rather than a fuller in-shell panel pattern; deeper preferences may open separate pages from links inside that menu. | Keeps account actions low-friction in the shell while allowing richer preference flows to live on dedicated pages later. | Current desktop profile affordance opens an anchored menu under the trigger; future deeper settings should launch from menu items rather than expanding the shell surface itself. | `approved` | Locked: keep a lightweight anchored menu on desktop; menu links can lead to separate pages later if needed. |
| `TN-007` | In narrow layouts, utility and profile actions should move into the mobile navigation surface rather than staying in a separate visible desktop utility region. | Prevents crowded mobile chrome and keeps actions discoverable in one place. | Current narrow layout hides `.nav-utilities` and exposes the mobile profile group inside the mobile menu. | `approved` | Locked as part of the mobile shell pattern. |
| `TN-008` | Opening transient top-nav surfaces should always close when the user clicks outside them. | Keeps lightweight shell surfaces feeling temporary and prevents stacked open states. | Current document click handler closes profile, overflow, and mobile surfaces when the click is outside. | `approved` | Always desirable for this shell family. |
| `TN-009` | Pressing `Escape` should close any open top-nav transient surface and return focus to the triggering control. | Preserves keyboard usability and predictable focus recovery. | Current keydown handler closes open surfaces and returns focus to the related trigger. | `approved` | Locked as part of the transient-shell accessibility contract. |
| `TN-010` | In RTL, the shell should mirror and present destinations in a way that feels native for RTL languages such as Arabic, rather than merely preserving the LTR visual sequence. | Ensures RTL support feels like real localization instead of a mechanically mirrored LTR shell. | Current CSS mirrors anchoring and layout in `html[dir=\"rtl\"]` rules; destination presentation should continue evolving toward native-feeling RTL behavior. | `approved` | RTL should feel native for RTL languages like Arabic. |
| `TN-011` | Under magnification or zoom, the shell should prefer earlier overflow or mobile collapse over overlap, clipping, or illegible crowding. | Supports accessibility and reduces geometry regressions under scaled UI. | Current fit and overlap checks run after magnification changes, but rendered behavior still needs confirmation. | `approved` | Locked: magnification should force graceful fallback rather than crowding. |
| `TN-012` | The mobile navigation trigger should be the single clear entry point for narrow-width navigation. | Reduces ambiguity about where primary destinations live on small screens. | Current mobile mode exposes one burger-style trigger and hides desktop primary navigation. | `approved` | Locked as the narrow-width navigation entry point. |
| `TN-013` | Long words or labels in the brand name, primary destinations, profile trigger, and profile-menu items must not break shell geometry; the shell should prefer truncation with ellipses, yielding secondary text, overflow, or mobile fallback over overlap or distortion, and truncated labels should expose the full value via tooltip. | Prevents localization and real-content labels from breaking the signed-off shell layout while still preserving access to the full label text. | Current implementation protects some geometry through fit logic and fixed-size controls, but explicit long-label behavior is not yet fully governed across every top-nav text surface. | `approved` | Use ellipses for overlong labels and show the full word or label in a tooltip. |
| `TN-014` | The global design-system shell must not switch to hamburger and bottom context-nav at tablet widths; the CSS mobile shell breakpoint is the narrow viewport breakpoint at `44rem`. | Prevents the shell from feeling mobile too early and keeps tablet-width review surfaces in the desktop side-rail/header model. | Current implementation uses the global shell media query at `max-width: 44rem`; preview-only forced-mobile classes may still render narrow canonical states. | `approved` | Mobile viewport was triggering too early; keep tablet widths on desktop shell chrome. |
| `TN-015` | The top-nav family must remain visually correct and readable across the approved theme set, with theme changes affecting surfaces, contrast, and emphasis states without changing the locked shell behaviors. | Prevents theme switching from creating a separate, inconsistent shell behavior model. | Current implementation supports `normal`, `dark`, and `desert` themes through CSS variables and data-theme rules. | `approved` | Themes must be part of the locked top-nav behavior. |
| `TN-016` | The top-nav family must inherit the current primary colour selection consistently so active, hover, focus, selected, and accent-derived shell states stay in sync with the shared accent system. | Ensures the shell participates in the broader design-system accent model instead of becoming visually disconnected from the chosen primary colour. | Current implementation derives several shell states from `--accent`, `--accent-soft`, and `--accent-text`, but this inheritance is not yet explicitly locked as a rule. | `approved` | Primary-colour inheritance must be locked for the top-nav family. |

## Open Questions To Resolve Through Feedback

## Exit Criteria For This Step

This behavior lock step is complete when each listed behavior is marked:

- `approved`
- `rejected`
- or `undecided` with an explicit follow-up action

Do not create the signed-off reference pack for the `top-nav` family until the
critical behaviors are at least mostly `approved`.
