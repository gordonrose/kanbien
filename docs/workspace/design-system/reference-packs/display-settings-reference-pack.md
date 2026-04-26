# Display Settings Reference Pack

## Purpose

Freeze the current `display settings` payload target so the payload can be
reviewed as a real governed family on top of the signed-off `context-nav
drawer` chassis rather than as placeholder copy inside the drawer.

This pack is intentionally narrower than a pattern note and more concrete than
the behavior lock. It records the exact payload states that now need direct
review.

## Scope

- Family:
  `display settings`
- Status:
  signed-off payload reference baseline; shell behavior is already signed off
  upstream through `context-nav drawer`
- Current source surface:
  `/design-system`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/display-settings-behavior-lock.md`
- Related pattern note:
  `docs/workspace/design-system/patterns/display-settings-pattern.md`
- Related canonical launcher:
  `/design-system/canonical-renderings/display-settings`
  legacy index card forwards from `/design-system/canonicals/display-settings`
- Host shell reference pack:
  `docs/workspace/design-system/reference-packs/context-nav-drawer-reference-pack.md`

## What This Pack Is For

Use this pack to answer:

- what concrete `display settings` payload states now require review
- what the payload canonicals must prove separately from the drawer shell
- what future app adoption must preserve before it can claim parity

## Signed-Off Rule Source

This pack inherits the approved payload rules from:

- `AS-000` through `AS-010` in
  `docs/workspace/design-system/behavior-locks/display-settings-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into concrete review targets.

## Current Surface Truth

- `/design-system` now exposes the real grouped payload inside the signed-off
  `context-nav drawer` surface
- the payload currently contains:
  - theme
  - magnification
  - primary colour
  - direction
- every current control changes real runtime behavior in the design-system
  surface
- the first real app subset is still narrower:
  - theme
  - magnification
- `accent` and `direction` remain design-system-only controls until a later
  loop explicitly promotes them
- RTL payload review is now required to include mirrored layout and Arabic copy
  rather than only a mirrored shell

## Reference Contract

- The payload must live inside the signed-off `context-nav drawer` chassis
  without redefining shell attachment, close rules, or mobile sheet behavior
- The payload must expose grouped controls with clear active state and
  programmatic selected state
- The payload must keep every displayed control real and runtime-affecting
- The payload must remain readable and structurally stable across approved
  theme and magnification states
- The payload must mirror in RTL and feel native to an Arabic reader
- The design-system payload may stay broader than the first app subset, but
  the app subset must remain explicitly governed
- The current `/design-system` payload density is the approved starting
  reference rather than something to silently trim after sign-off

## Required Reference States

Each state below should be reviewed directly from the dedicated canonical
launcher and then used to drive later verification work.

| Ref ID | Canonical route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `DSR-001` | `/design-system/canonical-renderings/display-settings/DSR-001` | Desktop grouped payload baseline | Confirms the real grouped payload now exists inside the governed drawer instead of placeholder copy | canonical-created, Playwright-locked | First payload review anchor |
| `DSR-002` | `/design-system/canonical-renderings/display-settings/DSR-002` | Dark theme and enlarged payload | Confirms grouped readability and structural stability under the highest-risk theme and magnification pressure | canonical-created, Playwright-locked | Primary WCAG-sensitive payload state |
| `DSR-003` | `/design-system/canonical-renderings/display-settings/DSR-003` | RTL mirrored payload | Confirms the payload body mirrors and the content copy feels native rather than remaining English-only inside an RTL shell | canonical-created, Playwright-locked | Arabic-reader review state |
| `DSR-004` | `/design-system/canonical-renderings/display-settings/DSR-004` | Mobile bottom-sheet payload | Confirms the full grouped payload remains usable inside the mobile drawer sheet without clipping or collapsed sections | canonical-created, Playwright-locked | Honest narrow-width runtime state |
| `DSR-005` | `/design-system/canonical-renderings/display-settings/DSR-005` | Reduced magnification and accent sweep | Confirms the low-end magnification control is real, reload-safe, and visually stable alongside a non-default accent choice | canonical-created, Playwright-locked | Guards the full range of current controls |

## High-Risk Review Batch

The highest-risk review states are:

- `DSR-001` desktop grouped payload baseline
- `DSR-002` dark theme and enlarged payload
- `DSR-003` RTL mirrored payload
- `DSR-004` mobile bottom-sheet payload

These states carry the biggest risk for payload drift because they prove the
grouped IA, real control behavior, RTL-localized body, and readability under
non-default viewing pressure.

## Evidence Status

- the dedicated canonical launcher now exists at
  `/design-system/canonicals/display-settings`
- the `DSR-*` state set is now named and directly reopenable
- shell behavior remains governed upstream by the signed-off `context-nav
  drawer` chain
- payload-specific browser verification now points directly at the `DSR-*`
  set rather than treating `CDR-*` shell states as sufficient
- executable generated-route proof now verifies launcher links, render-surface
  ownership, drawer containment, grouped controls, RTL copy, mobile
  bottom-sheet posture, theme and magnification states, and selected-state
  persistence for every `DSR-*` reference
- direct browser proof now covers:
  - `DSR-001`
  - `DSR-002`
  - `DSR-003`
  - `DSR-004`
  - `DSR-005`

## App-Subset Boundary

The first real app consumer still differs intentionally from the design-system
payload review set.

- Allowed first app subset:
  - theme
  - magnification
- Design-system-only controls for now:
  - accent
  - direction

Do not treat the broader design-system payload as automatic app sign-off.

## Parity Rule

A future extracted settings primitive or real-app consumer matches this pack
only when:

- it satisfies the locked `AS-*` behaviors
- it preserves the required `DSR-*` states or approved equivalents
- any app-versus-preview difference is already recorded in the downstream
  adoption artifact before parity is claimed
- any difference is explicitly recorded as either:
  - approved change
  - temporary known gap
  - regression

## Exit Condition

This reference pack becomes operational when:

- the `DSR-*` states are reviewed directly from the dedicated canonical
  launcher
- the verification checklist is refreshed to point at this direct payload set
- any later app adoption artifact is written from this payload pack rather
  than assuming sign-off from the shell family alone
