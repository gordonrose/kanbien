# Design System Verification Checklist

## Scope

- Artifact name:
  Form Template
- Surface:
  `/design-system/templates/form`
- Status under review:
  signed-off parent baseline
- Related template artifact:
  `docs/workspace/design-system/templates/form-template.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- Related canonical launcher:
  `/design-system/canonical-renderings/form-template`
  legacy index card forwards from `/design-system/canonicals/form-template`
- Related adoption note:
  none yet
- Related fallback note:
  `docs/workspace/design-system/templates/form-template-fallback-note.md`

## Visual Contract

- One-sentence rule:
  The form template must remain a reusable multi-section editing canvas that
  keeps dense controls, inline guidance, and stable actions readable across
  desktop, mobile review, and overlay-heavy states.
- Trigger for this review:
  user sign-off on `/design-system/templates/form` and the start of the formal
  codification loop for this page-template family
- What changed since the last review:
  the route now has an explicit parent-template artifact chain, and the
  checked-in implementation has been reconciled to the approved no-sidebar
  parent shape; the `Simple Select` child seam has now been split into its own
  child artifact chain instead of remaining only implicit inside the parent,
  the `Date Picker` child seam now has its own lock, reference-pack,
  verification, dedicated canonical launcher, and route-level browser proof,
  the next `Time Picker` child
  seam now has its own lock, reference-pack, verification, and route-level
  browser proof, and `Choice Group` now has an approved exploratory child
  artifact chain with a dedicated child launcher/render surface while still
  remaining parent-owned for governed adoption; the parent template now also
  hosts an upload field with drop/click entry, deterministic uploading status,
  local upload-error treatment, and media-aware selected-file preview
  affordances; `UploadFile` now exposes a shared
  `formControls.mjs` render/controller seam and component catalog page for
  feature adoption, plus a standalone generated canonical family at
  `/design-system/canonical-renderings/upload-file`; the page header no longer
  carries low-value status/helper labels, section headings now keep number and
  name on one styled line, and the parent field tile host is the governed outer
  shell for every field-level child seam including toggles and grouped choices

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/templates/form/index.html`
  `src/frontend/designSystem/assets/app.mjs`
  `src/frontend/designSystem/assets/formControls.mjs`
  `src/frontend/designSystem/components/upload-file.html`
  `src/frontend/designSystem/assets/uploadFileCanonical.mjs`
  `src/features/designSystemCanonicals/persistence/migrations/0041_seed_upload_file_canonicals.sql`
  `src/features/designSystemCanonicals/persistence/migrations/0042_seed_upload_file_preview_canonicals.sql`
  `src/frontend/designSystem/assets/styles.css`
  `src/frontend/designSystem/assets/formTemplate.css`
  `src/frontend/designSystem/components/simple-select.html`
  `src/frontend/designSystem/components/date-picker.html`
  `src/frontend/designSystem/components/time-picker.html`
  `src/frontend/designSystem/components/drawer-select.html`
  `src/frontend/designSystem/components/choice-group.html`
  `src/frontend/designSystem/components/icon-grid.html`
  `src/frontend/designSystem/components/form-image-card.html`
  `src/frontend/designSystem/components/upload-file.html`
  `src/features/designSystemCanonicals/persistence/migrations/0039_seed_design_system_canonicals_form_settings.sql`
  `src/features/designSystemCanonicals/persistence/migrations/0040_seed_form_template_upload_canonicals.sql`
- Implementation updated:
  yes
  the stale supporting sidebar was removed so repo source now matches the
  approved parent surface more closely; the generated canonical launcher now
  sources `FTR-*` refs from persisted governance and generated render routes
  serve the approved form-template route with the same state semantics; the
  shared `.form-field`, `.form-choice-group`, and `.form-toggle-row` tile host
  styles now keep mixed field-level seams visually consistent
- Known source-level risks:
  the parent chain still needs a cleaner statement of which composition checks
  stay parent-owned now that open-state proof is split between parent and
  child surfaces
  the shared-statement variant remains tied to parent composition even though
  `Choice Group` now has an approved exploratory child surface

## Rendered Verification

- Required viewports checked:
  partially covered
  desktop combination states and the governed mobile combination states now
  have direct canonical URLs; parent-level drawer-select open states now also
  have route-level proof, while picker-open and grouped-choice detail are now
  primarily covered through their child surfaces; parent route proof now also
  covers long-copy mobile composition and footer-action readability under
  magnification
- Required direction states checked:
  partial only
  `RTL` and `RTL + mobile` are now governed states; child surfaces cover much
  of the seam-specific proof, and drawer-select open posture now has direct
  parent route proof under `RTL + magnification`; the parent still needs
  broader composition review under those stresses
- Required theme states checked:
  partial only
  `error + light`, `error + dark`, `disabled + light`, and `disabled + dark`
  are now governed states; seam-specific dark-theme proof exists for extracted
  children, but the parent still needs broader composition review
- Required magnification states checked:
  partially covered
  the governed `RTL + magnification` route now exists, but broader parent
  composition proof under magnification now includes drawer-select overlay
  geometry plus desktop and mobile parent-composition checks; the resulting
  parent page rhythm has now been visually signed off
- Overflow or clipping checks:
  materially improved
  long helper copy, footer controls, and mixed child-seam composition now have
  direct parent route checks under mobile and magnified review
- Layering or anchoring checks:
  display-settings drawer handoff is covered; date-picker nested overlap and
  mobile overlay posture now have route-level or child-surface proof, and
  drawer-select layering now has route-level parent proof under
  `RTL + magnification` stress
- Screenshot or rendered evidence reference:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
  `/design-system/canonical-renderings/form-template`
  `tests/visual/designSystem/canonicals/shell/generatedCanonicalRenderingsIndex.spec.ts`
  current runtime proof includes route-level Playwright verification for the
  governed combination canonicals

## Accessibility Verification

- Keyboard entry and exit:
  partially covered
  the route-level regression proves click-based focus handoff from the
  display-settings drawer back into the form field, drawer-select now has
  route-level proof for trapped keyboard focus until exit, and date-picker now
  has route-level proof for owned close paths
- Focus order and return focus:
  partially covered
  display-settings, drawer-select, and date-picker recovery paths have
  targeted proof, but broader parent page-composition review still needs to be
  exercised under those interaction states
- Semantic structure:
  source inspected
  the page exposes labelled sections, a labelled form region, dialog-style
  drawer-select panels, native control semantics, and fieldset/legend grouping
  for radio, checkbox, and shared-statement choice variants
- Screen-reader naming and labeling:
  source inspected
  form fields rely on visible labels and nearby helper text; open-state dialog
  and picker naming still need broader rendered review
- Contrast or motion considerations:
  still required across theme review states; magnified parent composition now
  has direct route-level proof
- Localization or long-content considerations:
  still required
  the family now has seam-specific child proof in several extracted areas, but
  still needs broader parent composition captures before promotion

## State Coverage

- Default:
  source inspected
- Hover / pressed / focus:
  partially covered
- Selected / active:
  route-verified for drawer-select summaries, open drawer anatomy, and
  grouped-choice distinctions;
  live route proof now confirms separate radio, standard checkbox, and shared-
  statement grouped-choice variants
- Disabled:
  canonical-created and route-verified for normal, dark, and mobile
  combinations
- Loading:
  route-verified for the upload field through the deterministic
  `uploading` state and `FTR-020`
- Empty:
  not yet defined for this family
- Error:
  canonical-created and route-verified for normal, dark, and mobile
  combinations; parent route proof now also confirms inline group-error
  visibility for radio, checkbox, shared-statement grouped choices, and the
  upload error state through `FTR-021`
- Denied / restricted:
  not applicable
- Destructive:
  not applicable

## Quality Gate Outcome

- Implementation status:
  unchanged
- Rendered status:
  executable parent proof is broad and the final parent composition review is
  signed off
- Human sign-off status:
  current template accepted by user as the signed-off parent baseline and
  rollback target
- Promotion decision:
  keep as `signed-off` parent baseline and explicit rollback target;
  `Choice Group` remains an approved exploratory child baseline rather than a
  promoted family
- Open follow-ups:
  keep parent proof focused on page-level and broader overlay states while the
  extracted child chains handle their narrower seams
  `Choice Group` now has a dedicated exploratory child proof surface at
  `/design-system/canonicals/choice-group` and
  `/design-system/components/choice-group`; use the parent route only for the
  remaining parent-owned grouped-choice states

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/form-template-verification-checklist.md`
- Design-system route update required:
  no
- Frontend gate manifest update required:
  not yet
  the governed combination matrix now has canonicals; add a dedicated manifest
  once screenshot capture for the open-state set is introduced
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  no
  this family is signed off at the parent level, but a first-consumer adoption
  artifact is still required before governed app adoption should begin
