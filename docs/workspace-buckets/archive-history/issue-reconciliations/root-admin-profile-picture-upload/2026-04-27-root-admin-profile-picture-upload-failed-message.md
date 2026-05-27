# Root Admin Profile Picture Upload Failed Message

## Supersession Note

Archived on 2026-05-27 after the QA and issue-reconciliation freshness pass.
The degraded-state upload lessons are now represented by the profile-picture
asset consumer decision record, root-admin visual/app regression tests, and
the root-admin profile-picture upload test summary. This archive move is not a
blanket asset/security signoff; future changes to profile-picture uploads must
still follow the asset decision gate and runtime evidence rules.

## Summary

The user selected a JPEG profile picture in the root-admin root-user drawer
and the UI showed a generic "The selected file could not be uploaded" banner
with the upload control in an error state.

## User-Visible Symptom

- The selected file appeared in the upload control.
- The control changed to "Upload failed."
- The shell banner did not explain whether the file was too large, unsupported,
  or blocked by a backend route problem.
- After a successful upload, the selected image preview could render as a
  broken image.
- If alt-text validation had already fired, marking the image decorative did
  not clear the browser-native validation state, and Chrome showed a native
  validation bubble that is not part of the design system.

## Root Cause

The upload workflow had two weak failure paths:

- browser-side validation checked MIME type but not the approved 5 MB raster
  size before attempting the server workflow
- non-JSON failures from the raw byte-upload request, especially a stale or
  missing `/v1/assets/:assetId/upload-bytes` route, collapsed into a generic
  upload failure
- the completed preview reused the shared upload control's object URL path,
  but the app's image CSP allows `self` and `data:` images, not `blob:` object
  URLs
- the alt/decorative rule used `setCustomValidity()` and `reportValidity()`,
  causing browser-native validation UI and stale custom validity state outside
  the governed design-system surface

That stale-route case can happen during local development because frontend
assets are read from disk on request, while the Express route table is loaded
when the dev server starts. A running server from before the backend route was
added can therefore show the new upload UI while still returning `404` for the
new upload endpoint.

## Why The Existing Loop Missed It

The first browser test covered the successful mocked upload path only. The
asset integration test covered a direct same-origin byte upload seam, but it
did not cover the root-admin browser's degraded states:

- oversized file selected in the drawer
- non-JSON upload-route failure from a stale backend server
- completed profile-picture preview under the app's current CSP
- decorative save after a previous alt-text validation miss

This was a missing regression-scenario gap at the governed app UI layer.

## Classification

- missing degraded-state frontend coverage
- missing client-side validation for an approved asset limit
- local-development stale-server blind spot

## Reconciliation Changes

- Added browser-side 5 MB validation before creating the upload intent.
- Changed non-JSON `404` upload-byte failures to explain that the backend
  upload route is unavailable and the app server should be restarted.
- Switched the completed profile-picture preview to a `data:` URL so it renders
  under the existing app image CSP without widening the shared security policy.
- Removed the profile-picture alt-text `setCustomValidity()`/`reportValidity()`
  path so the browser no longer renders a native validation bubble for this
  governed drawer rule.
- Preserved successful upload behavior and asset linking.
- Added a visual/app regression for stale backend upload routes.
- Added a visual/app regression for oversized profile pictures that proves no
  upload intent is created.
- Added a visual/app regression for completed preview rendering and a
  decorative profile-picture save after a prior alt-text validation miss.

## Coverage Lesson

For browser-mediated asset upload work, the app UI needs degraded-state guards
for the raw-byte step and governed validation guards for non-native form rules,
not only a happy-path upload/link test.

## Verification

- `DOTENV_CONFIG_PATH=/home/gordon/kanbien/.env npx playwright test tests/visual/app/rootAdminShell/rootAdminRootUsersList.spec.ts --config=playwright.config.ts`

## Resolution Status

- candidate fix awaiting user confirmation

## Follow-Up Watch Items

- If the user still sees the stale-route message, restart the local dev server
  from the task branch so the Express route table includes
  `/v1/assets/:assetId/upload-bytes`.
- If the user needs larger profile pictures accepted rather than rejected,
  update the asset consumer decision record and asset limit deliberately rather
  than silently widening the shared asset foundation.
