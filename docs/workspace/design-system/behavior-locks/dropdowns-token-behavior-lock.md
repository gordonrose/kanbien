# Dropdowns Token Behavior Lock

## Scope

`DropdownsToken` governs the primitive simple-dropdown token route at
`/design-system/tokens/dropdowns`.

It reuses the existing `Simple Select` anchored-listbox runtime and does not
replace the broader child-seam canonicals under
`/design-system/canonical-renderings/simple-select`.

## Behavior Contract

- `DDT-001`: The canonical token route is `/design-system/tokens/dropdowns`.
- `DDT-002`: Compatibility aliases may route `simple-dropdown` and
  `simple-select` token paths to the same token page.
- `DDT-003`: The dropdown remains a lightweight single-select trigger plus an
  anchored listbox. It must not become a drawer, sheet, modal, or searchable
  picker.
- `DDT-004`: The trigger owns both the small uppercase field label and the
  selected value. The label must sit inside the button instead of as an
  external field label above it.
- `DDT-005`: Opening the trigger truthfully updates `aria-expanded` and reveals
  a listbox directly beneath the trigger.
- `DDT-006`: Selecting an option updates the hidden value, trigger value,
  selected option state, and closes the listbox.
- `DDT-007`: The token route must prove normal, dark, desert, open, disabled,
  long-label, RTL, and narrow/mobile states.
- `DDT-008`: Long selected values must not make the dropdown root overflow its
  card or viewport.

## Adoption Rule

Consumers must reuse the shared simple-select runtime and prove parity against
this token route or the generated `simple-select` canonical set. App-local
dropdown behavior is drift unless an explicit exception is approved.
