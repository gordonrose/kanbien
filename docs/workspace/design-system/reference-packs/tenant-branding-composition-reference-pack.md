# Tenant Branding Composition Reference Pack

## Status

- Status: draft
- Date: 2026-04-30
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/tenant-branding-composition-behavior-lock.md`

## Reference Families

Tenant branding should compose these existing signed-off or governed families:

- Form layout:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Upload:
  `docs/workspace/design-system/behavior-locks/upload-file-behavior-lock.md`
- Image preview/status:
  `docs/workspace/design-system/behavior-locks/form-image-card-behavior-lock.md`
- Choice/select controls:
  `docs/workspace/design-system/behavior-locks/choice-group-behavior-lock.md`
  and `docs/workspace/design-system/behavior-locks/simple-select-behavior-lock.md`
- Drawer form:
  `docs/workspace/design-system/behavior-locks/drawer-form-behavior-lock.md`
- List/page framing:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
  and `docs/workspace/design-system/behavior-locks/page-shell-banner-behavior-lock.md`
- Shell navigation:
  `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`

## Required Canonical States

Root-admin branding configuration:

- no branding record
- complete branding record
- display-name validation error
- invalid primary colour
- logo pending upload
- logo ready
- logo rejected
- logo replacement
- logo consumer-not-ready because accessibility metadata is missing
- unauthorized or missing selected tenant

Tenant dashboard branding consumption:

- complete branding
- missing branding
- partial display name only
- partial colour only
- missing logo
- not-ready logo
- metadata-incomplete logo
- cross-tenant-denied logo
- mobile and magnified dashboard shell
- light and dark themes
- RTL where shell supports it

## Composition Notes

- The tenant branding form should look like a governed settings form, not a
  marketing/editorial page.
- Preview is allowed when it is a direct preview of saved or staged branding
  values and does not become a separate theming system.
- Tenant dashboard branding is shell-level presentation, not full portal
  theming.
- Any gap in existing primitives should be recorded before adding new
  design-system source.

