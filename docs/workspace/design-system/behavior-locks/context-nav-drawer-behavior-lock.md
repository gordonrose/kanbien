# Context-Nav Drawer Behavior Lock

## Purpose

Lock the behavioral rules for the `context-nav drawer` family before
creating a signed-off reference pack or promoting the pattern toward
application adoption.

This artifact is intentionally narrower than a pattern note. It exists so the
user can approve, reject, or defer individual context-nav-drawer behaviors
based on the current `/design-system` implementation.

Launcher-level shell rules stay governed by:

- `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`

Do not duplicate broader `context-nav` rail rules here unless the drawer needs
to reference them directly.

## Review Status Legend

- `approved`:
  behavior should be preserved in the signed-off reference pack
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior needs more iteration or clarification before being locked

## Scope

- Family:
  `context-nav drawer`
- Current source surface:
  `/design-system`
- Parent launcher contract:
  `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`
- Related downstream artifacts:
  to be created or refreshed in this loop

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `CD-000` | The context-nav drawer must remain a shell-attached surface launched from governed `context-nav`, not a floating content card or page-local panel. | Preserves the family’s ownership as part of shell chrome rather than letting settings UI drift into one-off local layout. | Current `/design-system` implementation launches the drawer from the bottom utility zone of `context-nav` and keeps the panel attached to the shell seam. | `approved` | The drawer belongs to the governed shell, not to local page UI. |
| `CD-000A` | The context-nav drawer should act as the reference template for the broader `context-nav` drawer family, including future governed siblings such as filter drawers, unless a later review explicitly approves a divergent drawer subtype. | Lets the first signed-off drawer establish the durable attachment, layering, close, and accessibility grammar for later `context-nav` drawers instead of letting each sibling invent its own model. | The current context-nav drawer already exercises the core shell-attached drawer behaviors that future `context-nav` drawers are expected to share. | `approved` | Use this drawer as the family template for future `context-nav` drawers. |
| `CD-001` | On desktop and wider tablet widths, the context-nav drawer should open as a side panel attached immediately beside the launching rail instead of detaching or centering like a modal. | Protects the side-panel identity of the family and keeps launcher-to-panel relationship obvious. | Current desktop implementation positions the drawer adjacent to the rail and below the measured combined header bottom. | `approved` | Desktop should read as an attached side panel. |
| `CD-001A` | When open, the context-nav drawer must overlay the page content area rather than reflowing the page, shrinking the main content width, or otherwise competing for permanent layout real estate. | Preserves the drawer as a transient shell surface and avoids turning a governed overlay into a layout negotiation that destabilizes the page beneath it. | Current `/design-system` drawer is layered over the preview content area rather than causing the page content to remeasure around it. | `approved` | The drawer should overlay page content, not compete with it for space. |
| `CD-002` | On mobile and narrow-width layouts, the context-nav drawer should open as a bottom-attached sheet that fills the lane down to the top edge of the bottom bar rather than floating with spare space beneath it. | Preserves the mobile-sheet mental model and prevents a desktop panel treatment from leaking into the bottom-nav state. | Current mobile implementation uses the bottom-bar offset so the drawer lands directly on the top edge of the bottom bar. | `approved` | Mobile drawer should stick directly to the bottom bar. |
| `CD-003` | The context-nav drawer must remain layered above the rail or bottom bar and above adjacent shell chrome while it is open. | Prevents clipping and keeps transient shell surfaces visibly governed during runtime states. | Current implementation layers the drawer above the launching chrome and is covered by browser geometry checks through the `context-nav` runtime tests. | `approved` | The drawer needs to sit above the shell chrome it comes from. |
| `CD-004` | Pressing `Escape` or clicking outside the context-nav drawer should close it and return focus to the control that launched it. | Preserves transient-surface accessibility and keeps keyboard recovery predictable. | Current `/design-system` runtime closes the drawer from shared transient-surface handlers and restores focus to the trigger. | `approved` | Close on outside click and `Escape`, then give focus back. |
| `CD-004A` | All interactive controls inside the context-nav drawer must be fully operable by keyboard alone, with a logical tab sequence from launcher to close control to drawer content and back to the launcher on close. | Turns WCAG 2.2 AA expectations into a concrete contract for keyboard reachability and recovery instead of leaving the drawer dependent on pointer-only interaction. | Current `/design-system` drawer already exposes button-based controls and a named close action; dedicated drawer-family verification still needs to prove the full keyboard path directly. | `approved` | The drawer must work fully from the keyboard. |
| `CD-005` | The context-nav drawer close control should use the same square action-button grammar and centered diagonal cross glyph as the governed shell family, not a browser-default typographic `X`. | Keeps the close affordance visually inside the same family language as the launcher and other transient shell surfaces. | Current drawer close button uses the shared square treatment with a stroked diagonal cross icon. | `approved` | Use the governed square close button, not a default `X`. |
| `CD-005A` | The context-nav drawer launcher, close control, and in-drawer option controls must keep visible focus indicators with sufficient contrast against every approved theme so keyboard users can always locate the active control. | Makes WCAG 2.2 AA focus visibility and non-text contrast part of the family contract rather than an assumed implementation detail. | Current `/design-system` shell controls inherit governed focus styling, but drawer-family proof still needs to confirm those indicators remain visible across themes and viewing conditions. | `approved` | Focus states need to stay clearly visible across the drawer family. |
| `CD-006` | In RTL, the context-nav drawer should mirror to the right-edge shell presentation so its anchoring feels native rather than like an LTR panel with late cosmetic flips. | Makes RTL a first-class family contract and keeps the drawer aligned with the mirrored `context-nav`. | Current `/design-system` CSS mirrors desktop drawer anchoring under `html[dir="rtl"]` and keeps the drawer attached to the right-edge rail. | `approved` | RTL drawer anchoring should feel native. |
| `CD-007` | The design-system context-nav drawer may include preview-only controls needed for governed review, but a real app consumer must expose only the subset explicitly approved for that app surface. | Prevents preview tooling from becoming shipped product IA and records the app-vs-preview boundary as part of the drawer family itself. | Current `/design-system` implementation includes theme, magnification, accent, and direction controls; the intended first real app subset is narrower and must be separately approved before implementation. | `approved` | Keep preview tooling in `/design-system`; app surfaces need explicit subset approval. |
| `CD-008` | Theme, magnification, and other display-control states inside the context-nav drawer must change real runtime behavior rather than acting as decorative or fake settings controls. | Keeps the family honest as a functional controls surface instead of a static mockup. | Current `/design-system` controls actively update theme, magnification, accent, and direction in the preview environment. | `approved` | The controls need to do real work, not just look plausible. |
| `CD-009` | The context-nav drawer must remain readable and structurally stable under the approved theme set, magnification changes, and longer control labels. | Protects the family against exactly the accessibility and localization pressures it is meant to help users manage. | Current `/design-system` implementation supports multiple themes, magnification levels, and grouped controls; dedicated drawer-family proof is still needed rather than relying only on broader `context-nav` coverage. | `approved` | The drawer has to stay robust under theme, zoom, and longer labels. |
| `CD-009A` | Drawer text, icons, control states, and boundaries must preserve WCAG 2.2 AA-compliant contrast and discernibility across the approved theme set, including non-text contrast for interactive controls. | Converts the WCAG 2.2 AA requirement into a specific drawer-family readability contract that can be verified under theme and runtime-state review. | Current `/design-system` themes already restyle the drawer surface and controls, but dedicated drawer-family review still needs to confirm contrast-sensitive states directly. | `approved` | The drawer family must stay WCAG 2.2 AA-compliant across approved themes. |
| `CD-010` | The context-nav drawer family must be treated as incomplete until its runtime states are proven directly, including launcher path, open state, close behavior, focus return, mobile bottom attachment, and RTL anchoring where relevant. | Prevents the family from being considered signed off from resting-state screenshots or indirect launcher-family proof alone. | Current runtime proof mostly exists through `context-nav` coverage, but this dedicated drawer family still needs its own artifact chain and named state set. | `approved` | Runtime drawer behavior needs direct proof, not just indirect family references. |
| `CD-011` | No real-app implementation of the context-nav drawer should be treated as allowed until the drawer family itself has a signed-off design-system chain, unless the user explicitly approves an exception for that app surface. | Prevents application implementation from racing ahead of the drawer’s own governance and codifies the ordering rule for this family specifically. | The initial root-admin pass attempted to implement the app drawer before the drawer family had its own behavior lock, so the app slice was rolled back and the loop returned here first. | `approved` | The app drawer waits for drawer-family signoff unless there is an explicit exception. |

## Open Questions To Resolve Through Feedback

- Future drawer siblings still need their own downstream artifacts, but the
  approved family direction is that the context-nav drawer provides the
  reference template for the broader `context-nav` drawer family unless a
  later review explicitly approves a divergent subtype.

## Exit Criteria For This Step

This behavior lock step is complete when each listed behavior is marked:

- `approved`
- `rejected`
- or `undecided` with an explicit follow-up action

Do not treat any drawer-specific reference pack, canonical set, verification
artifact, or real-app adoption as signed off until the critical behaviors are
at least mostly `approved`.
