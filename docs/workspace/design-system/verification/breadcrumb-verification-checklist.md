# Design System Verification Checklist

## Scope

- Artifact name:
  Breadcrumb
- Surface:
  `/design-system`
- Status under review:
  system-ready
- Related principle artifact:
  None yet
- Related pattern artifact:
  `docs/workspace/design-system/patterns/breadcrumb-pattern.md`
- Related component artifact:
  None yet
- Related adoption note:
  `docs/workspace/design-system/adoption/root-admin-shell-sub-nav-adoption-contract.md`

## Visual Contract

- One-sentence rule:
  The breadcrumb must preserve orientation and current-page clarity by reducing
  progressively within its own region before it destabilizes the shared row.
- Trigger for this review:
  define breadcrumb as its own family while keeping the shared row contract
  intact
- What changed since the last review:
  breadcrumb now has dedicated canonical review states, explicit RTL transition
  coverage, and explicit truncation inspection states for tooltip and ellipsis
  behavior

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/index.html`
  `src/frontend/designSystem/assets/styles.css`
  `src/frontend/designSystem/assets/app.mjs`
  `tests/audit/designSystem/breadcrumbOverflow.test.ts`
- Implementation updated:
  no
- Known source-level risks:
  focused source audit exists; remaining risk is uncaptured breadcrumb states,
  not missing canonical structure

## Rendered Verification

- Required viewports checked:
  reviewed through the current canonical set
- Required direction states checked:
  reviewed, including full, reduced, compact, and truncation RTL states
- Required theme states checked:
  still required for captured evidence
- Required magnification states checked:
  still required for captured evidence when breadcrumb compaction pressure changes
- Overflow or clipping checks:
  reviewed for full, reduced, compact, RTL, and truncation states
- Layering or anchoring checks:
  reviewed for menus, tooltip overlay, and RTL anchoring; durable evidence
  capture still pending
- Screenshot or rendered evidence reference:
  `docs/workspace/design-system/reference-packs/breadcrumb-reference-pack.md`
  shared and direct evidence at
  `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/`

## Accessibility Verification

- Keyboard entry and exit:
  collapse and compact triggers reviewed in canonicals; durable evidence still pending
- Focus order and return focus:
  source behavior exists and current canonical interaction review is complete; durable evidence still pending
- Semantic structure:
  breadcrumb `nav`, ordered list, and current item semantics present in source
- Screen-reader naming and labeling:
  collapse triggers are labeled in source; menu review still required
- Contrast or motion considerations:
  theme-aware source styling exists; theme evidence capture still required
- Localization or long-content considerations:
  reviewed with explicit LTR and RTL truncation canonicals plus RTL transition states

## State Coverage

- Default:
  source inspected
- Hover / pressed / focus:
  current canonical review completed; durable evidence capture pending
- Selected / active:
  current item present in source
- Disabled:
  not applicable
- Loading:
  not applicable
- Empty:
  not applicable
- Error:
  not yet defined
- Denied / restricted:
  not applicable
- Destructive:
  not applicable

## Quality Gate Outcome

- Implementation status:
  unchanged
- Rendered status:
  canonicals reviewed and Playwright-locked for the full breadcrumb set
- Human sign-off status:
  current canonical review accepted
- Promotion decision:
  promote to `system-ready`
- Open follow-ups:
  implement root-admin consumer parity, then verify app-vs-reference behavior

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/breadcrumb-verification-checklist.md`
- Design-system route update required:
  yes
- Frontend gate manifest update required:
  yes, `tests/visual/designSystem/canonicals/manifests/subNav.first-batch.manifest.json` and
  `tests/visual/designSystem/canonicals/manifests/subNav.canonical.manifest.json` now track the
  governed breadcrumb overlap states
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  yes
