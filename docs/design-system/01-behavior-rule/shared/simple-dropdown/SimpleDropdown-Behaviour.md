# Simple Dropdown Behavior Rule

| Field | Value |
| --- | --- |
| Layer | `01-behavior-rule` |
| UI family | `simple-dropdown` |
| Status | `review-ready` |
| Downstream route to inspect | `/design-system/default/primitives/simple-dropdown-control`; `/design-system/default/patterns/simple-dropdown-field` |

## Purpose

A simple dropdown lets a user choose exactly one value from a short governed list when radio buttons would take too much space.

It is not a search combobox, multi-select, drawer select, autocomplete, menu button, command palette, or product workflow.

## Behavior Contract

- The trigger opens and closes one owned listbox.
- Only one option may be selected.
- Selecting an enabled option updates the current value, closes the listbox, restores focus to the trigger, and emits one value-change event.
- Opening the dropdown must not preselect a different value.
- Disabled dropdowns cannot open or emit changes.
- Disabled options remain visible when supplied but cannot be selected.
- Escape closes the listbox without changing the selected value.
- Outside pointer interaction closes the listbox without changing the selected value.

## Keyboard Contract

- Trigger `Enter`, `Space`, `ArrowDown`, and `ArrowUp` open the listbox.
- Once open, `ArrowDown` and `ArrowUp` move the active option.
- `Home` and `End` move to the first and last enabled option.
- `Enter` and `Space` select the active enabled option.
- `Escape` closes without selection and returns focus to the trigger.

## Accessibility Contract

- The trigger must expose an accessible name and current expanded state.
- The popup must expose listbox semantics and each option must expose option semantics.
- The selected option must expose selected state without relying on color alone.
- Error state must expose `aria-invalid` and wire error copy through `aria-describedby`.
- Long visible trigger or option text must use the governed truncated-text disclosure behavior, and disclosure must appear only when text actually overflows.
- Focus visibility must remain clear on the trigger and active option.

## Layer Classification

- Layer 2 must own trigger frame values before a primitive can render the trigger.
- Layer 3 owns trigger/listbox semantics, keyboard behavior, state, event emission, and text disclosure.
- Layer 4 may compose the dropdown primitive with a governed field row.
- Later component or app layers must not recreate dropdown markup, keyboard behavior, ARIA semantics, or CSS locally.

## Non-Goals

- This rule does not approve search, filtering, async loading, multi-select, drawer selection, option grouping, virtualized option lists, product validation, persistence, or app adoption.
