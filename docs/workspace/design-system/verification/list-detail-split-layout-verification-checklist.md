# Design System Verification Checklist

## Scope

- Artifact name:
  `ListDetailSplitLayout`
- Surface:
  `/design-system/canonical-renderings/list-detail-split-layout`
  `/design-system/canonical-renderings/list-detail-split-layout/:ref`
  `/design-system/components/list-detail-split-layout`
- Status under review:
  signed-off
- Related pattern artifact:
  `docs/workspace/design-system/patterns/list-detail-split-layout-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/list-detail-split-layout-component.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/list-detail-split-layout-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/list-detail-split-layout-reference-pack.md`
- Related parent behavior lock:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Related parent reference pack:
  `docs/workspace/design-system/reference-packs/list-page-reference-pack.md`

## Visual Contract

- One-sentence rule:
  A `ListDetailSplitLayout` must preserve the honest lane relationship between
  a list region and a connected detail region across closed, open, mirrored,
  and mobile-overlay states.
- Trigger for this review:
  Start the third child extraction from the governed `List Page` parent
  pattern after `ListRecordCard` and `ListDetailPanel` sign-off.
- What changed since the last review:
  The split relationship now has a generated persistence-backed canonical
  launcher and dedicated render surface so the open/closed shell states,
  mobile overlay behavior, and RTL mirroring can be reviewed directly outside
  the full parent page. The behavior lock now also explicitly requires the
  split to fall back to an overlay or single-lane posture if both lanes become
  too squashed under stronger width or magnification pressure, and the
  canonical set now includes a dedicated non-mobile fallback proof for that
  rule. The generated route chain has also been hardened so launcher cards open
  dedicated render pages, render-page chrome points back to
  `/design-system/canonical-renderings/list-detail-split-layout`, and ready
  state is published only after the fit-frame geometry pass has settled.

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/components/list-detail-split-layout.html`
  `src/frontend/designSystem/canonicals/list-detail-split-layout/index.html`
  `src/frontend/designSystem/assets/listDetailSplitLayoutCanonical.mjs`
  `src/features/designSystemCanonicals/persistence/migrations/0038_seed_design_system_canonicals_list_page_children.sql`
  `tests/visual/designSystem/canonicals/data-display/listDetailSplitLayout.spec.ts`
- Implementation updated:
  yes
- Known source-level risks:
  parent-owned search, load-state, and focus choreography intentionally remain
  outside this child seam

## Rendered Verification

- Required viewports checked:
  desktop full-width, desktop half-page, and mobile narrow through the
  dedicated canonical route
- Required direction states checked:
  RTL desktop split canonical added
- Required theme states checked:
  normal, dark, and desert open-split canonicals added
- Required magnification states checked:
  magnified half-page split canonical added, plus a dedicated squashed-split
  fallback canonical under stronger zoom pressure
- Real interactive states checked:
  closed desktop state, open desktop split, mobile overlay state
- Overflow or clipping checks:
  independent list-lane and detail-lane scroll review added in the dedicated
  scroll-pressure canonical; dedicated squashed-split fallback proof now added;
  mobile and squashed fallback overlays now use the shared canonical overlay
  containment helper against the render frame and host surface
- Layering or anchoring checks:
  mobile overlay layering beneath shell chrome reviewed in a dedicated child
  canonical
- Attachment / shell-framing checks:
  child seam inherits shell offset context but does not own full shell logic;
  generated render routes now use the shared route-surface truth helper to
  guard against overview fallback and stale route chrome
- Alignment or shared-gutter checks:
  desktop and RTL lane placement reviewed directly
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/data-display/listDetailSplitLayout.spec.ts`

## Accessibility Verification

- Keyboard entry and exit:
  source-inspected only; parent still owns full open/close focus choreography
- Focus order and return focus:
  parent-owned and intentionally excluded from this child seam
- Semantic structure:
  list lane plus labelled detail region present in open states
- Screen-reader naming and labeling:
  inherited from the signed-off inner seams
- Contrast or motion considerations:
  theme-variant rendered proof exists; no dedicated motion behavior applies
- Localization or long-content considerations:
  RTL and magnified split review now exists
- Browser-native affordance coexistence considerations:
  current child seam keeps native scrolling and button behavior in the inner
  seams

## State Coverage

- Default:
  covered through dedicated closed canonical
- Hover / pressed / focus:
  source-inspected only
- Selected / active:
  represented indirectly through the open split state
- Disabled:
  not applicable for the layout shell itself
- Loading:
  parent-owned
- Empty:
  parent-owned
- Error:
  parent-owned
- Denied / restricted:
  not applicable yet
- Destructive:
  not applicable

## Quality Gate Outcome

- Implementation status:
  candidate fix awaiting visual approval
- Rendered status:
  focused visual rerun passed for the hardened generated render surface
- Human sign-off status:
  pending visual approval for this hardening pass
- Promotion decision:
  promote to signed-off
- Open follow-ups:
  prove a second governed consumer before promotion to `system-ready`

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/list-detail-split-layout-verification-checklist.md`
- Design-system route update required:
  yes:
  `/design-system/canonical-renderings/list-detail-split-layout`
  `/design-system/canonical-renderings/list-detail-split-layout/:ref`
  `/design-system/components/list-detail-split-layout`
- Canonical render-ready / honest-width check required:
  completed for this hardening pass with ready-after-settle and frame-padding
  containment coverage
- Frontend gate manifest update required:
  not yet
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  no
