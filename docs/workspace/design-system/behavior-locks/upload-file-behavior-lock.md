# UploadFile Behavior Lock

## Scope

`UploadFile` is the reusable child control extracted from `Form Template` for
feature forms that need a local file-attachment affordance.

Source surfaces:

- `/design-system/templates/form`
- `/design-system/components/upload-file`
- `/design-system/canonical-renderings/upload-file`
- `/design-system/canonical-renderings/upload-file/UFR-001` through `UFR-012`
- `/design-system/canonical-renderings/form-template/FTR-020`
- `/design-system/canonical-renderings/form-template/FTR-021`
- `/design-system/assets/formControls.mjs`

## Locked Behavior

| ID | Rule | Rationale | Status |
| --- | --- | --- | --- |
| `UF-BL-001` | The control must support both native local picker activation and drag/drop entry through the same visible dropzone. | Feature forms need one governed attachment affordance regardless of whether users click or drag. | approved |
| `UF-BL-002` | The design-system seam owns local visual states: idle, uploading, complete, and error. | Features can bind real transport status without rebuilding state markup or copy placement. | approved |
| `UF-BL-003` | Upload transport, storage, accepted file policy, malware scanning, and durable asset semantics remain feature-owned. | The UI seam must not silently become a backend asset-policy decision. | approved |
| `UF-BL-004` | Parent forms own the field label, helper copy, validation copy, and page/section framing. | Keeps `UploadFile` consistent with other form child controls and prevents page-layout drift. | approved |
| `UF-BL-005` | The control must expose an importable render/controller seam from `/design-system/assets/formControls.mjs`. | Feature adoption must consume design-system-owned markup and behavior instead of copying template HTML. | approved |
| `UF-BL-006` | The control must maintain a standalone generated canonical family under `/design-system/canonical-renderings/upload-file`. | Upload-file review must not depend on the broader `Form Template` route once it is approved as a reusable feature-facing component. | approved |
| `UF-BL-007` | Once a local file is selected, the dropzone must replace the generic upload glyph with a preview affordance: raster images show an image thumbnail, documents show a document-type thumbnail, videos use the media thumbnail slot, and audio uses an audio icon. | Keeps the selected-file state visually specific without moving upload transport, scanning, persistence, or playback policy into the design-system seam. | approved |

## Feature Adoption

Features should render the child control with `renderFormUploadField()`, then
bind it with `initializeFormUploadFields()`. Real upload code should listen for
`form-upload:file-selected`, perform feature-owned transport, and call
`setFormUploadState()` as backend status changes.

The preview slot is local UI feedback only. Feature consumers still own accepted
file policy, upload intent behavior, checksum or byte verification, malware
scanning, storage, lifecycle, and read/delivery decisions.
