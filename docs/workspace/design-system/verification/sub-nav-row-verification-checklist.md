# Design System Verification Checklist

## Scope

- Artifact name:
  Sub-nav row
- Surface:
  `/design-system`
- Status under review:
  system-ready
- Related principle artifact:
  None yet
- Related pattern artifact:
  `docs/workspace/design-system/patterns/sub-nav-row-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/sub-nav-row-component.md`
- Related adoption note:
  `docs/workspace/design-system/adoption/root-admin-shell-sub-nav-adoption-contract.md`

## Visual Contract

- One-sentence rule:
  The shared breadcrumb/search row must preserve wayfinding and centered search
  without overlap, clipping, or silent width stealing as the row compresses.
- Trigger for this review:
  Split `breadcrumb` and `search-shell` into separate families without losing
  the responsive contract of the row they currently share.
- What changed since the last review:
  the row is now documented as its own composition pattern instead of being
  implied only by the `/design-system` page implementation, and the shared
  canonical hardening pass now keeps canonical layout width, theme,
  magnification, and direction scoped to the rendered surface instead of the
  host page

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/index.html`
  `src/frontend/designSystem/assets/styles.css`
  `src/frontend/designSystem/assets/app.mjs`
- Implementation updated:
  no
- Known source-level risks:
  dedicated canonical route and reference pack now exist; remaining risk is
  uncaptured row states rather than missing structure

## Rendered Verification

- Required viewports checked:
  captured through `SNR-001` to `SNR-008`
- Required direction states checked:
  captured for LTR and RTL
- Required theme states checked:
  still required
- Required magnification states checked:
  still required when row pressure changes under zoom
- Overflow or clipping checks:
  must verify breadcrumb yielding and centered search preservation
- Layering or anchoring checks:
  must verify breadcrumb menus sit correctly inside the row while top-nav
  surfaces remain above it
- Canonical host/surface isolation checks:
  must verify canonical row state stays owned by the rendered shell rather
  than inheriting width, theme, direction, or magnification from host chrome
- Screenshot or rendered evidence reference:
  `docs/workspace/design-system/reference-packs/sub-nav-row-reference-pack.md`
  full row evidence at
  `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/`
  and the cross-family isolation posture is tracked in
  `docs/workspace/design-system/verification/canonical-host-surface-isolation-audit.md`

## Accessibility Verification

- Keyboard entry and exit:
  source behavior partially inspected through breadcrumb menu handling; row pass
  still required
- Focus order and return focus:
  child-family source behavior exists; rendered order still required
- Semantic structure:
  breadcrumb `nav` and search landmark present in source
- Screen-reader naming and labeling:
  source labels present at child-family level; row-level review still required
- Contrast or motion considerations:
  theme-aware source styling exists; rendered review still required
- Localization or long-content considerations:
  must verify long breadcrumb labels and longer search placeholder text under
  row pressure

## State Coverage

- Default:
  source inspected
- Hover / pressed / focus:
  partially represented by child-family controls; rendered evidence pending
- Selected / active:
  breadcrumb current-page state present in source
- Disabled:
  not applicable
- Loading:
  not applicable
- Empty:
  search empty input state present in source
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
  verified and Playwright-locked for the full row set
- Human sign-off status:
  current canonical review accepted
- Promotion decision:
  promote to `system-ready`
- Open follow-ups:
  implement root-admin consumer parity and verify app-vs-reference behavior

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/sub-nav-row-verification-checklist.md`
- Design-system route update required:
  yes
- Frontend gate manifest update required:
  yes, `tests/visual/designSystem/canonicals/manifests/subNav.first-batch.manifest.json` and
  `tests/visual/designSystem/canonicals/manifests/subNav.canonical.manifest.json` now exist
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  yes
