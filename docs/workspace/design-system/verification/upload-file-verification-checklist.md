# Upload File Verification Checklist

## Scope

- Artifact name:
  `UploadFile`
- Generated canonical launcher:
  `/design-system/canonical-renderings/upload-file`
- Generated canonical render surface:
  `/design-system/canonical-renderings/upload-file/:ref`
- Source component surface:
  `/design-system/components/upload-file`
- First host surface:
  `/design-system/templates/form`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/upload-file-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/upload-file-reference-pack.md`

## Visual Contract

- One-sentence rule:
  `UploadFile` must provide a reusable drop/browse/status child surface while
  inheriting the parent `.form-field` tile shell for label, helper, error, and
  grid placement.
- Trigger for this review:
  Align the upload child seam with the form-template field-tile host contract
  now that all form elements are being normalized into tiles.

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/components/upload-file.html`
  `src/frontend/designSystem/assets/uploadFileCanonical.mjs`
  `src/frontend/designSystem/assets/formControls.mjs`
  `src/frontend/designSystem/assets/styles.css`
  `src/frontend/designSystem/templates/form/index.html`
  `tests/visual/designSystem/canonicals/forms/uploadFileCanonical.spec.ts`
  `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`
- Implementation updated:
  no new upload behavior in this pass; the artifact chain now explicitly records
  the parent-owned field-tile host and child-owned upload surface boundary
- Known source-level risks:
  upload transport, accepted file policy, malware scanning, persistence,
  delivery, and asset lifecycle remain feature-owned and require the normal
  asset-consumer decision gate before production adoption.

## Rendered Verification

- Required viewports checked:
  dedicated upload canonical states and parent form-template host states are
  covered by existing Playwright specs
- Required direction states checked:
  covered through the upload canonical matrix
- Required theme states checked:
  covered through the upload canonical matrix
- Required magnification states checked:
  covered through the upload canonical matrix
- State coverage:
  idle, selected, uploading, complete, error, and parent-hosted upload error
  composition
- Tile-host coverage:
  parent-hosted upload remains inside `.form-field.form-field-span-2`; the child
  upload surface does not own the outer field tile

## Quality Gate Outcome

- Implementation status:
  existing child seam retained
- Rendered status:
  existing focused visual specs remain the executable proof
- Promotion decision:
  aligned with the form-template field-tile host contract; real app adoption
  still requires the asset decision gate for any production upload behavior
