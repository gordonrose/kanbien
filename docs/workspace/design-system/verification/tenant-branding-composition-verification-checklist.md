# Tenant Branding Composition Verification Checklist

## Status

- Status: draft
- Date: 2026-04-30
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/tenant-branding-composition-behavior-lock.md`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/tenant-branding-composition-reference-pack.md`

## Required Design-System Proof

- [ ] Canonical root-admin form state renders with display name, colour,
      upload, preview, and accessibility metadata controls.
- [ ] Empty display name and invalid colour states render without layout shift.
- [ ] Upload pending, ready, rejected, replacement, and consumer-not-ready
      states render.
- [ ] Alt-text and decorative-posture controls are keyboard reachable and
      screen-reader named.
- [ ] Tenant dashboard complete branding state renders after projection.
- [ ] Dashboard fallback states render for missing, partial, not-ready,
      metadata-incomplete, and denied logo states.
- [ ] Mobile, magnified, light, dark, and RTL states are included where the
      host shell supports them.
- [ ] SVG logo display is represented as an image resource, not inline DOM.
- [ ] Root-admin and dashboard surfaces consume shared design-system seams
      rather than app-local CSS or copied controller behavior.

## Required Future App Adoption Proof

- [ ] Root-admin branding page proves shared render/controller/style adoption.
- [ ] Tenant dashboard shell proves projection consumption and fallback
      rendering.
- [ ] Browser scenarios include denied, validation, and degraded asset states.
- [ ] Source review confirms no app-page CSS additions for governed layout.
- [ ] Source review confirms no copied governed markup or controller logic.

## Mock Honesty Notes

- Fixtures must match the API projection shape once API contracts exist.
- Fixture fallback behavior must not invent values that production does not
  provide.
- Logo read fixtures must require tenant branding authorization before asset
  content access.

