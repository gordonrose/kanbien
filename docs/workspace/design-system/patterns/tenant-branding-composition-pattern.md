# Tenant Branding Composition Pattern

## Scope

- Pattern name:
  Tenant branding composition
- Status:
  draft
- Owner:
  design-system governance and tenant branding feature planning
- Related routes or consuming surfaces:
  root-admin tenant branding configuration and tenant dashboard shell branding

## Intent

This pattern defines how existing governed design-system primitives compose for
tenant branding without creating a broad theming framework.

It should be reusable because tenant branding crosses two governed surfaces:

- root-admin configuration
- tenant dashboard presentation

## Anatomy

- Required parts:
  display-name field, primary-colour control, logo upload/status, logo preview,
  alt-text or decorative-posture control, save/cancel action area, dashboard
  shell branding display, fallback indicators.
- Optional parts:
  read-only preview, cleanup/status message, denied-state explanation.
- Content expectations:
  short operational labels; no marketing copy; validation messages tied to
  fields.
- Layout structure:
  existing form-template and upload/image-card composition within governed
  root-admin page shell; dashboard branding attached to shell-level identity
  area.

## States

- Default:
  loaded active branding record or approved absence state.
- Focus:
  native form and upload controls preserve visible focus.
- Disabled:
  denied, missing selected tenant, saving, or unavailable dependency states.
- Loading:
  initial read and upload progress.
- Empty:
  no branding record and no current logo.
- Success:
  saved branding and ready logo relationship.
- Warning:
  missing accessibility metadata or not-ready logo.
- Error:
  validation, upload failure, rejected asset, authz deny, projection failure.
- Real interactive states:
  filled input, invalid colour, selected decorative posture, pending upload,
  ready preview, rejected logo, dashboard fallback rendering.

## Variants

- Approved variants:
  root-admin configuration and tenant dashboard consumption.
- Variant purpose:
  configuration versus read-only consumption.
- Variant limits:
  dashboard shell only for v1.
- Forbidden variants:
  app-page CSS theming system, public logo page, generic asset library,
  tenant-admin self-service.

## Accessibility

- Semantic structure:
  form controls with labels; upload status messages; image alt/decorative
  posture preserved.
- Keyboard behavior:
  all controls keyboard reachable; upload state does not trap focus.
- Focus treatment:
  focus return after save, cancel, drawer close, and upload state transition.
- Screen-reader expectations:
  current logo state, validation, and fallback states are announced or exposed
  through named regions.
- Localization / long-content concerns:
  display name and alt text must wrap or truncate according to existing form
  rules without layout breakage.

## Responsive Behavior

- Mobile behavior:
  form stacks; upload and preview remain visible without horizontal overflow.
- Desktop behavior:
  form and preview may sit in governed form layout.
- Overflow / wrapping expectations:
  long tenant names and filenames cannot overlap adjacent controls.
- Shell attachment:
  dashboard branding belongs to the shell identity area, not a floating card.

## Composition Rules

- Common parent contexts:
  root-admin page shell, drawer form, tenant dashboard shell.
- Compatible neighboring patterns:
  form-template, upload-file, form-image-card, choice-group, simple-select,
  list-page, page-shell, context-nav.
- Misuse cases to avoid:
  direct SVG DOM injection, raw bucket URLs, app-local CSS, copied controller
  behavior, broad theming settings.

## Component Readiness

- Should this become a reusable component now?
  No. First compose existing primitives and create a component only if the
  implementation proves repeated structure that cannot be expressed through
  current seams.
- If no, what must stabilize first?
  API projection shape, upload relationship state model, dashboard shell
  placement, and first-consumer browser proof.

## Verification

- Required screenshots or visual checks:
  root-admin form states and tenant dashboard fallback states.
- Accessibility verification:
  keyboard, screen-reader names, validation association, and image alt posture.
- Responsive verification:
  mobile, desktop, magnified, and RTL where shell supports it.
- Frontend quality-gate impact:
  first app adoption requires browser proof and source review.

