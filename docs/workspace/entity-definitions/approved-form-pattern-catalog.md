# Approved Form Pattern Catalog

## Purpose

Define the currently approved design-system references that
`entityBuilder` may store as `default form pattern` truth for an attribute.

This catalog exists so entity definitions can point to governed form seams or
parent-owned approved patterns instead of inventing ad hoc controls.

## Usage Rule

- `defaultFormPatternKey` must point to one row in this catalog
- the catalog row must reference an approved or signed-off design-system seam
  or parent-owned pattern
- exploratory-only seams should not be stored as the default pattern for a
  durable entity definition

## Current Approved Keys

| Pattern key | Design-system source | Status | Typical use | Notes |
| --- | --- | --- | --- | --- |
| `form-template.text-input` | `Form Template` signed-off parent baseline | parent-owned approved pattern | short free-text fields such as names and keys | Uses the signed-off parent form-field posture from [form-template.md](/home/gordon/kanbien/docs/workspace/design-system/templates/form-template.md) and [form-template-reference-pack.md](/home/gordon/kanbien/docs/workspace/design-system/reference-packs/form-template-reference-pack.md). No separate child seam exists yet for plain text input. |
| `form-template.textarea` | `Form Template` signed-off parent baseline | parent-owned approved pattern | longer descriptions or helper copy | Same parent-owned rule as `form-template.text-input`; this is an approved parent pattern, not a child component family. |
| `simple-select.single` | `Simple Select` child seam | signed-off child seam | one-of selection from a bounded option list | Source of truth: [simple-select-behavior-lock.md](/home/gordon/kanbien/docs/workspace/design-system/behavior-locks/simple-select-behavior-lock.md). |
| `date-picker.single-date` | `Date Picker` child seam | signed-off child seam | single date value | Source family is the signed-off child chain referenced from [form-template.md](/home/gordon/kanbien/docs/workspace/design-system/templates/form-template.md). |
| `date-picker.date-range` | `Date Picker` child seam | signed-off child seam | bounded start and end date values | Use only when the entity attribute truly represents a range rather than a scalar date. |
| `time-picker.single-time` | `Time Picker` child seam | signed-off child seam | single time value | Source of truth: [time-picker-behavior-lock.md](/home/gordon/kanbien/docs/workspace/design-system/behavior-locks/time-picker-behavior-lock.md). |
| `drawer-select.multi-select` | `Drawer Select` child seam | signed-off child seam | larger multi-select sets that need search plus selected and available stacks | Source of truth: [drawer-select-behavior-lock.md](/home/gordon/kanbien/docs/workspace/design-system/behavior-locks/drawer-select-behavior-lock.md). |
| `upload-file.local-asset` | `UploadFile` child seam | signed-off child seam with feature-owned transport | a file attachment field that needs drag/drop, native browse, upload status, progress, local preview, and local error display | Source of truth: [upload-file-behavior-lock.md](/home/gordon/kanbien/docs/workspace/design-system/behavior-locks/upload-file-behavior-lock.md). This key approves the field UI seam only; accepted file policy, upload endpoint, malware scanning, storage, and durable asset semantics remain feature-owned. |

## Excluded For Now

- `choice-group.*`
  Not approved for durable default-pattern storage yet because the current
  child chain remains explicitly exploratory in the component inventory even
  though the boundary is documented.

## Boundary Notes

- This catalog does not define route-level page framing or shell posture.
- This catalog stores only the approved attribute-level control or parent-owned
  field pattern reference.
- If the design-system promotion status changes later, the feature should add
  an explicit compatibility rule rather than silently rewriting stored keys.
