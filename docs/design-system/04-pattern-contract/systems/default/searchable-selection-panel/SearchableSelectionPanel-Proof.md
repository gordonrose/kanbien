# Searchable Selection Panel Default Proof

Layer: `04-pattern-contract`

Status: `review-ready`

Rendered view: `/design-system/default/patterns/searchable-selection-panel`

Runtime seam:
`src/frontend/designSystem/layers/04-pattern-contract/searchable-selection-panel/index.mjs#searchableSelectionPanelPattern`

## Proof Scope

The default proof renders the shared searchable-selection-panel contract using
the default design-system primitives plus signed `body-region-frame` and
`background-color` tokens. Short loading, empty, no-match, and error messages
consume the signed `feedback-text-style` token.

It proves:

- single and multi modes through `card-list-select`
- single-mode replacement inside the selected/available grouping model
- search preserving selected options
- no-match and empty states
- governed scroll region behavior
- long-text disclosure through child primitives
- theme, direction, constrained-width, and mobile scroll review controls

It does not prove drawer trigger, apply/cancel, persistence, backend search, or
app adoption.
