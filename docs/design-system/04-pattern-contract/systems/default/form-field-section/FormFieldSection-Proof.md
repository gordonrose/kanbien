# Default Form Field Section Pattern Proof

## Status

`review-ready`

## Proof Surface

| Field | Value |
| --- | --- |
| Pattern | `form-field-section` |
| Shared contract | `docs/design-system/04-pattern-contract/shared/form-field-section/FormFieldSection-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/form-field-section/index.mjs#formFieldSectionPattern` |
| Rendered proof | `/design-system/default/patterns/form-field-section` |

## Default Proof

The default proof composes `field-container-control` with governed child
fields. Entity-flavoured copy is proof fixture content only; the pattern is
generic.

The proof includes text field, textarea, radio simple select field, simple
dropdown field, toggle field, drawer-select field, and priority card-list
select field examples.

## Review Controls

- width posture: desktop or narrow
- viewport posture: desktop or mobile
- theme: original, dark, or desert
- direction: LTR or RTL
- text pressure: normal or long
- drawer open state

## Evidence Expectations

- desktop renders a two-column grid
- `span-1` fields occupy one column
- `span-2` fields span both columns
- narrow/mobile stacks all fields into one column
- every field is wrapped by `field-container-control`
- hosted fields preserve their own behavior
- drawer-select mobile overlay covers the viewport
- keyboard focus remains with child controls after selection
- truncated child text exposes tooltip or disclosure behavior
- no horizontal overflow appears in desktop, narrow, RTL, or mobile proof
