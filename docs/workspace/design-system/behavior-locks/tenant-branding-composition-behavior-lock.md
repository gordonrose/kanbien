# Tenant Branding Composition Behavior Lock

## Status

- Status: draft
- Date: 2026-04-30
- Source PRD:
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`
- Source Story Breakdown:
  `docs/workspace/story-breakdown/2026-04-29-tenant-branding-configuration-story-breakdown.md`
- Source asset decision:
  `docs/workspace/asset-consumer-decisions/2026-04-25-tenant-branding-logo.md`

## Scope

This behavior lock covers the governed composition for:

- root-admin tenant branding configuration
- tenant dashboard shell branding consumption

It does not create a new primitive family by default. The v1 posture is to
compose existing governed primitives:

- `form-template`
- `upload-file`
- `form-image-card`
- `choice-group` or `simple-select`
- `drawer-form`
- `list-page`
- `page-shell`
- `context-nav`

## Root-Admin Form Behavior

- Display name is an editable text field.
- Empty display name is invalid.
- Primary colour is an approved hex value.
- Invalid colour shows validation feedback and cannot be saved.
- Logo upload shows pending, ready, rejected, replacement, and
  consumer-not-ready states.
- Logo accessibility metadata requires either explicit alt text or explicit
  decorative posture.
- Replacement is supported in v1.
- Clear/remove logo is not supported in v1.
- Partial edits preserve untouched values.
- Save success updates the form from the saved backend response.
- Denied or missing selected tenant state is explicit and does not leave stale
  editable controls enabled.

## Tenant Dashboard Branding Behavior

- Dashboard shell uses the tenant branding projection after login or reload.
- Missing display name falls back to canonical tenant name.
- Missing or invalid primary colour falls back to the platform default.
- Missing, not-ready, metadata-incomplete, rejected, deleted, cleanup-pending,
  or cross-tenant-denied logo states render no logo.
- Logo rendering uses the approved same-origin image resource.
- Uploaded SVG is never injected into app DOM.
- V1 does not promise live updates to already-open dashboards.

## Accessibility

- Logo has contextual alt text or decorative empty alt according to the stored
  tenant branding relationship.
- Validation errors are associated with the relevant controls.
- Upload status and rejected/not-ready states are available without relying
  only on colour.
- Keyboard users can reach every editable control and upload action.
- Focus returns predictably after drawer close, save, cancel, or upload state
  transition.

## Forbidden Behavior

- Do not add app-page CSS for governed tenant branding layout.
- Do not copy governed form/upload/page-shell markup into the app page.
- Do not duplicate governed controller behavior in the app page.
- Do not infer logo read authority from asset ownership alone.
- Do not expose permanent raw bucket URLs.
- Do not render user-uploaded SVG inline.

