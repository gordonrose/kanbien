# Default Entity Body Panel Pattern Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Pattern name | `entity-body-panel` |
| System | `default` |
| Proof status | `review-ready` |
| Shared contract | `docs/design-system/04-pattern-contract/shared/entity-body-panel/EntityBodyPanel-Contract.md` |
| Rendered proof | `/design-system/default/patterns/entity-body-panel` |

## Default Implementation

The default proof renders `entity-body-panel` by composing
`body-region-control`. It exposes review controls for state, hosted content,
content pressure, mobile scroll posture, width pressure, and direction.

The governed-form proof variant hosts only already-promoted child seams:
`text-field-control`, `textarea-control`, `radio-simple-select-field`,
`simple-dropdown-field`, `toggle-field`, `card-list-select-field`, and
`accordion-group`. Each complete field is wrapped by `field-container-control`
so the outer field box is governed separately from the hosted control behavior.
Paired fields collapse to one column when the rendered body-panel proof host
has narrow available inline space.

Empty, loading, and blocked-foundation states intentionally render no body
children. The proof reports state evidence outside the body region so it does
not masquerade as hosted form UI.

Drawer select and workflow builder remain blocked and are named as missing
foundations rather than represented by placeholder controls.

## Evidence

| Evidence | Status |
| --- | --- |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/entity-body-panel/index.mjs#entityBodyPanelPattern` |
| Rendered route | `/design-system/default/patterns/entity-body-panel` |
| Unit test | `tests/unit/designSystem/entityBodyPanelPattern.test.ts` |
| Browser proof | `tests/visual/designSystem/patterns/entityBodyPanelPatternRoute.spec.ts` |
| Governed child seams | `field-container-control`; `text-field-control`; `textarea-control`; `radio-simple-select-field`; `simple-dropdown-field`; `toggle-field`; `card-list-select-field`; `accordion-group` |
