# Upload File Reference Pack

## Scope

`UploadFile` is reviewed as a child seam inside the signed-off `Form Template`
parent and as a reusable direct render surface for governed form adoption.

Current review surface:

- `/design-system/components/upload-file`
- `/design-system/canonical-renderings/upload-file`
- `/design-system/templates/form`

## Current Surface Truth

- the child seam owns the dropzone, native browse trigger, selected-file preview,
  local status line, progress affordance, and idle/uploading/complete/error
  visual states
- the parent host owns the `.form-field` tile shell, visible label, helper copy,
  validation copy, section placement, grid span, and page action zoning
- file bytes, upload transport, malware scanning, accepted file policy,
  persistence, delivery, retention, and durable asset semantics remain outside
  this design-system child seam

## Reference Set

| ID | Route | Circumstance | Purpose | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `UFR-HOST-001` | `/design-system/templates/form` | Parent-hosted upload field | Proves upload composes inside the same field tile as the rest of the form template. | covered-by-test | The tile shell is parent-owned; upload owns only the drop/browse/status surface. |
| `UFR-001` through `UFR-012` | `/design-system/canonical-renderings/upload-file/:ref` | Dedicated upload-file canonical matrix | Proves the reusable child surface across idle, selected, uploading, complete, error, direction, theme, and magnification review states. | covered-by-test | Canonicals are served from the generated child render route. |
| `FTR-020` | `/design-system/canonical-renderings/form-template/FTR-020` | Parent upload in-progress composition | Proves deterministic uploading status inside the parent template. | covered-by-test | Parent composition proof remains separate from the child canonical matrix. |
| `FTR-021` | `/design-system/canonical-renderings/form-template/FTR-021` | Parent upload error composition | Proves local upload error copy stays attributable inside the parent field tile. | covered-by-test | Parent error review remains governed by the form-template chain. |

## Ownership Boundary

- Parent form artifacts own the field tile host, surrounding labels, helper/error
  copy, section placement, and page-level review states.
- `UploadFile` owns local drop/browse/status interaction and selected-file
  preview affordances.
- Feature consumers own real upload policy and asset lifecycle decisions.

## Sign-Off

- Reference pack status:
  active and aligned with the current form field-tile host pass
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/upload-file-behavior-lock.md`
