# Display Settings Behavior Lock

## Purpose

Lock the proposed behavior rules for the `display settings` payload
family before creating canonicals, a payload-specific reference pack, or any
real-app implementation.

This artifact is intentionally narrower than a pattern note. It exists so the
payload can be reviewed as a separate governed family that lives inside the
signed-off `context-nav drawer` chassis without redefining drawer-shell
behavior that is already approved upstream.

Drawer-shell rules stay governed by:

- `docs/workspace/design-system/behavior-locks/context-nav-drawer-behavior-lock.md`

Do not duplicate shell-attachment, overlay, close, mobile-sheet, or drawer
focus-return rules here unless the payload itself needs to reference them.

## Review Status Legend

- `approved`:
  behavior should be preserved in the later payload reference pack
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior needs explicit review before it can be locked

## Scope

- Family:
  `display settings`
- Current source surface:
  `/design-system` `Display Settings` payload inside the signed-off
  `context-nav drawer`
- Host shell family:
  `docs/workspace/design-system/behavior-locks/context-nav-drawer-behavior-lock.md`
- Related downstream artifacts:
  to be created or refreshed in this loop

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `AS-000` | The `display settings` payload must be governed separately from the `context-nav drawer` shell, with shell behavior inherited from the signed-off drawer family rather than redefined locally. | Keeps the repo honest about what has already been signed off: the drawer chassis is approved, but the settings content model still needs its own review. | The current `/design-system` payload lives inside the signed-off drawer chassis, but the settings IA has not yet been separately locked. | `approved` | Display settings should follow as the next loop, not stay mixed into drawer-shell signoff. |
| `AS-001` | The payload should be organized into clearly labelled setting groups rather than presented as one undifferentiated list of controls. | Preserves comprehension and makes future app subsets easier to govern without reworking the whole drawer body. | The current `/design-system` payload already uses grouped sections for theme, magnification, accent, and direction. | `approved` | The current `/design-system` payload grouping is the starting reference. |
| `AS-002` | Every control shown inside the payload must change real runtime behavior rather than acting as decorative or placeholder settings. | Prevents the payload review loop from signing off fake preferences UI. | The current `/design-system` controls actively change theme, magnification, accent, and direction in the preview environment. | `approved` | Only real visual display controls for now. |
| `AS-003` | The design-system review payload may expose a broader settings set than the first real app consumer, but the app subset must be explicitly governed rather than assumed from the preview. | Keeps preview expressiveness from silently becoming shipped IA and supports a narrower first-consumer subset. | The current `/design-system` payload includes theme, magnification, accent, and direction; the provisional root-admin note narrows the app subset. | `approved` | The app subset must be an explicit decision, not an inference. |
| `AS-004` | The first app consumer should expose only `theme` and `magnification` unless a later payload review explicitly approves more settings. | Creates a concrete starting boundary for first adoption and avoids shipping preview-only controls by drift. | The provisional root-admin display-settings note already treats theme and magnification as the intended first app subset. | `approved` | Yes: first app subset is `theme` and `magnification` only. |
| `AS-005` | `accent` and `direction` should remain design-system review controls until a later loop explicitly approves them for a real consumer. | Keeps the first app payload focused and avoids widening preferences scope without deliberate approval. | `/design-system` still uses accent and direction as preview tooling, and the provisional app note keeps them out of the first app subset. | `approved` | Keep accent and direction in `/design-system` for now. |
| `AS-006` | The payload must expose a clear selected state and programmatic state for each control group so the currently active option is obvious visually and semantically. | Prevents settings UI from feeling ambiguous and keeps keyboard/screen-reader state legible. | The current chip controls use active styling and `aria-pressed` to show the selected option in each group. | `approved` | The active state must stay obvious and semantic. |
| `AS-006A` | In RTL, the display-settings payload content should mirror its internal reading and control alignment so the settings body feels native rather than like LTR content inside a mirrored drawer shell. | Prevents the payload body from lagging behind the signed-off drawer-shell RTL behavior and keeps content review honest for localized consumers. | The signed-off `context-nav drawer` chassis already mirrors in RTL, but the payload itself has not yet been separately locked for mirrored section copy and control alignment. | `approved` | It should feel native to an Arabic reader. |
| `AS-006B` | The current chip-row control grammar may be used for the first payload canonicals, but it remains provisional and may be changed later if a later setting type needs a more suitable control pattern. | Lets the loop keep moving without accidentally treating today’s control style as a permanent solution for every future display setting. | The current `/design-system` payload uses chip-row buttons successfully for the existing option sets, but no decision has been made yet that all future display settings must use chips. | `approved` | Safe to settle the control grammar later as needed. |
| `AS-007` | The payload must remain readable and structurally stable under the approved theme set, magnification changes, longer setting labels, and the current `/design-system` payload density. | The settings family is meant to help people manage exactly these viewing pressures, so it cannot collapse under them. | The current `/design-system` payload already defines the starting density with grouped visual controls inside `Display Settings`, and payload-specific canonicals still need to prove that this density holds up. | `approved` | Use the current `/design-system` payload density as the starting reference. |
| `AS-008` | Keyboard users must be able to move through every setting control in a logical order, with each control group remaining operable without pointer input. | Turns display-settings review into actual keyboard review rather than only visual grouping review. | The current payload uses button-like chip controls, and payload-specific keyboard-flow proof will still need to be added in the verification step. | `approved` | Keyboard flow is good. |
| `AS-009` | The payload should be designed with durable saved preferences expected later, but it must not imply that persistence already exists until persistence behavior, ownership, and recovery rules are explicitly approved. | Preserves the likely long-term product direction without letting preview/runtime-only behavior masquerade as a finished saved-preferences system. | Current `/design-system` behavior is still preview/runtime-only, while the future expectation is durable saved preferences after a later persistence loop. | `approved` | Expect durable saved preferences later. |
| `AS-010` | The display-settings payload must not be treated as ready for app implementation until it has its own honest design-system chain beyond the signed-off drawer chassis. | Prevents the repo from repeating the earlier mistake of letting a downstream consumer race ahead of its upstream payload governance. | The shell family is now signed off, but the payload still lacks its own reference pack, canonicals, and verification chain. | `approved` | The settings loop should happen after the drawer-shell loop, not be inferred from it. |

## Locked Starting Payload

The current `/design-system` grouped payload and density are the approved
starting reference for the first display-settings canonicals:

- theme
- magnification
- accent
- direction

If a later loop wants to narrow, rename, or re-grammatize those groups, that
should be treated as a new payload review rather than assumed drift cleanup.

## Exit Criteria For This Step

This behavior-lock step is complete when each listed behavior is marked:

- `approved`
- `rejected`
- or `undecided` with an explicit follow-up action

Do not treat any display-settings canonicals, payload reference pack,
verification checklist, or real-app adoption as signed off until the critical
payload behaviors are at least mostly `approved`.
