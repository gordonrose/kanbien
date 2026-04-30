# Tenant Branding Composition Adoption Contract

## Scope

- Component or pattern family:
  tenant branding composition
- Status:
  draft
- First consumer surface:
  root-admin tenant branding configuration and tenant dashboard shell branding
- Route or shell owner:
  root-admin shell and future tenant dashboard shell
- Source pattern artifact:
  `docs/workspace/design-system/behavior-locks/tenant-branding-composition-behavior-lock.md`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/tenant-branding-composition-reference-pack.md`
- Source verification checklist:
  `docs/workspace/design-system/verification/tenant-branding-composition-verification-checklist.md`

## Purpose

- What business or workflow need is this adoption serving?
  Root admins configure tenant branding and tenant users see approved branding
  in the dashboard shell after login or reload.
- Why is this the right first consumer?
  Tenant branding is the first known surface combining root-managed branding
  values, managed logo upload, tenant dashboard consumption, and contextual
  logo accessibility metadata.
- Why is adoption happening now instead of remaining design-system-only?
  App implementation is blocked until the composition rules and reusable seams
  are recorded.

## Capability And Workflow Mapping

- Capability source:
  `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`
- Primary actor:
  root admin and tenant user
- Permission or capability rules:
  root-admin manage/read and tenant-dashboard read capabilities, plus required
  asset capabilities, must be enforced by backend routes.
- Route ownership:
  root-admin and tenant dashboard routes to be finalized in API contracts.
- Workflow states in scope:
  configure display name, primary colour, logo upload/replacement,
  accessibility metadata, dashboard projection, fallback states.
- Workflow states explicitly deferred:
  tenant-admin self-service, logo clear, live updates, public delivery, broad
  tenant portal theming.

## Governed Adoption Preflight

- Exact signed-off source route or render surface:
  pending design-system canonical route creation.
- Exact reference pack or canonical source:
  `docs/workspace/design-system/reference-packs/tenant-branding-composition-reference-pack.md`
- Shared CSS seam:
  existing governed form, upload, image-card, list/page, and shell CSS seams.
- Shared render seam:
  must be design-system owned before app adoption.
- Shared controller seam:
  must be design-system owned before app adoption.
- Family-owned visible regions:
  form layout, upload status, image preview, validation, fallback and branding
  display states.
- Host-owned visible regions:
  route-specific copy, selected tenant context, backend data binding, and
  dashboard shell placement.
- Approved intentional deviations before implementation:
  none.
- Shared-entrypoint parity expectation:
  intentionally narrower than a broad theming family.
- Stop condition if a required seam is missing:
  pause app implementation and extend the design-system composition rather than
  copying markup, controller behavior, or CSS into the app page.

## Parity Rules

- Must match reference pack:
  structure, states, accessibility semantics, validation posture, and fallback
  behavior.
- May differ intentionally:
  route labels and tenant-specific data values.
- Must not drift:
  app-page CSS, copied governed markup, duplicated upload/image controller
  behavior, or direct SVG DOM injection.
- Required parity evidence:
  design-system canonicals plus first-consumer browser proof.

## Verification

- Required rendered checks:
  root-admin form states and tenant dashboard fallback states.
- Required executable tests:
  governed browser scenarios after implementation.
- Required manual sign-off steps:
  design-system review before app adoption.
- Required consumer-level route proof:
  root-admin branding route and tenant dashboard shell route after source
  implementation.

## Promotion Decision

- Adoption result:
  candidate
- Follow-up work required before wider reuse:
  API contracts, data dictionary, permission mapping, implementation
  blueprint, PRD-derived tests, and design-system canonicals.
- Follow-up work required before extraction into a shared primitive:
  evidence that tenant branding composition recurs beyond this feature.

