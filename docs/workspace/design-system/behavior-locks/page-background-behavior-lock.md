# PageBackground Behavior Lock

## Scope

`PageBackground` is the design-system environmental layer. It owns the page
background variables used by design-system shells and structural primitives.

## Contract

- `PBG-001`: The background token is applied globally through the shared controller seam,
  not only on `/design-system/tokens/background`.
- `PBG-002`: The Background token route remains the editor and review surface for tuning
  glow, corner, wash, theme strength, and source output.
- `PBG-003`: Normal theme uses the active primary colour as the background target.
- `PBG-004`: Dark theme uses the selected dark baseline as the background target.
- `PBG-005`: Desert theme uses the selected desert baseline as the background target.
- `PBG-006`: Structural components consume the resulting variables and do not recompute
  them locally.
- `PBG-007`: Glow, corner, and wash extent controls must update rendered output
  and source output together.
- `PBG-008`: Magnification and responsive shell changes must not detach the
  background layer from the page foundation.

## Public Variables

- `--token-background-start`
- `--token-background-end`
- `--token-background-foundation`
- `--token-background-soft`
- `--token-background-mid`
- `--token-background-wash`
- `--token-background-glow`
- `--token-background-glow-extent`
- `--token-background-corner-extent`
- `--token-background-wash-extent`
- `--token-background-glow-strength`
- `--token-background-corner-strength`

## Non-Goals

- `PageBackground` does not define page structure, headers, content regions, or
  component layout.
- `PageBackground` does not own record, entity, filter, or workflow semantics.
