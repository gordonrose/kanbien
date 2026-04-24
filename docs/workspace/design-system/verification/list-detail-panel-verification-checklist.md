# Design System Verification Checklist

## Scope

- Artifact name:
  `ListDetailPanel`
- Surface:
  `/design-system/canonical-renderings/list-detail-panel`
  `/design-system/canonical-renderings/list-detail-panel/:ref`
  `/design-system/components/list-detail-panel`
- Status under review:
  signed-off
- Related pattern artifact:
  `docs/workspace/design-system/patterns/list-detail-panel-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/list-detail-panel-component.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/list-detail-panel-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/list-detail-panel-reference-pack.md`
- Related parent behavior lock:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Related parent reference pack:
  `docs/workspace/design-system/reference-packs/list-page-reference-pack.md`

## Visual Contract

- One-sentence rule:
  A `ListDetailPanel` must preserve clear header, body, and footer reading
  zones while keeping local error and footer-boundary states inside the open
  detail surface.
- Trigger for this review:
  Start the second child extraction from the governed `List Page` parent
  pattern after `ListRecordCard` sign-off.
- What changed since the last review:
  The detail surface now has a generated persistence-backed canonical launcher
  and dedicated render surface so baseline, boundary, long-content, and error
  states can be reviewed directly outside the full parent page. The
  long-content compaction logic was
  also stabilized after `LDP-005` exposed scroll flicker caused by the header
  state machine oscillating during body scroll. The child behavior lock and
  child reference pack have now both been signed off, leaving the canonical
  review as the remaining human gate.

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/components/list-detail-panel.html`
  `src/frontend/designSystem/canonicals/list-detail-panel/index.html`
  `src/frontend/designSystem/assets/listDetailPanelCanonical.mjs`
  `src/features/designSystemCanonicals/persistence/migrations/0038_seed_design_system_canonicals_list_page_children.sql`
  `tests/visual/designSystem/canonicals/data-display/listDetailPanel.spec.ts`
- Implementation updated:
  yes
  the generated render surface now publishes ready only after tooltip recovery,
  focus-entry, and header-compaction sync have completed
- Known source-level risks:
  parent-owned mobile dialog semantics and shell stacking intentionally remain
  outside this child seam

## Rendered Verification

- Required viewports checked:
  desktop full-width, desktop half-page, and mobile narrow through the
  dedicated canonical route
- Required direction states checked:
  RTL half-page canonical added
- Required theme states checked:
  normal, dark, and desert baseline canonicals added
- Required magnification states checked:
  magnified half-page canonical added
- Real interactive states checked:
  baseline populated panel, missing-secondary-fields panel, local error panel,
  terminal footer state, focus-entry state
- Overflow or clipping checks:
  metadata truncation and wrapped title/body reviewed in the long-content
  canonical; header compaction under long-content pressure now remains stable
  while scrolling; representative panels now have direct render-frame
  containment proof
- Layering or anchoring checks:
  parent-owned and already covered through the `list-page` route
- Attachment / shell-framing checks:
  parent-owned and intentionally excluded from this child seam
- Alignment or shared-gutter checks:
  source-inspected only
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/data-display/listDetailPanel.spec.ts`
  `docs/workspace/issue-reconciliations/2026-04-17-list-detail-panel-half-page-scroll-flicker.md`

## Accessibility Verification

- Keyboard entry and exit:
  source-inspected through real button semantics with a dedicated focus-entry
  canonical for child review
- Focus order and return focus:
  source-inspected only; parent still owns full open/close focus choreography
- Semantic structure:
  labelled detail region with explicit close-control naming present
- Screen-reader naming and labeling:
  title labels the region; action and footer controls keep explicit labels
- Contrast or motion considerations:
  theme-variant rendered proof exists; no dedicated motion behavior applies
- Localization or long-content considerations:
  half-page, RTL, and magnified long-content review now exists
- Browser-native affordance coexistence considerations:
  current child seam keeps native button behavior

## State Coverage

- Default:
  covered through dedicated canonical
- Hover / pressed / focus:
  focus-entry canonical plus source-inspected button states
- Selected / active:
  not applicable for the open detail surface itself
- Disabled:
  covered through terminal next-button state
- Loading:
  not applicable yet
- Empty:
  not applicable for a single detail surface
- Error:
  covered through dedicated local-error canonical
- Denied / restricted:
  not applicable yet
- Destructive:
  not applicable

## Quality Gate Outcome

- Implementation status:
  changed
- Rendered status:
  verified for the signed-off canonical set
- Human sign-off status:
  approved
- Promotion decision:
  promote to signed-off
- Open follow-ups:
  keep the scroll-stability regression in place as the prevention layer for
  long-content review
  prove a second governed consumer before promotion to `system-ready`

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/list-detail-panel-verification-checklist.md`
- Design-system route update required:
  yes:
  `/design-system/canonical-renderings/list-detail-panel`
  `/design-system/canonical-renderings/list-detail-panel/:ref`
  `/design-system/components/list-detail-panel`
- Canonical render-ready / honest-width check required:
  completed for the signed-off canonical set; readiness now waits for settled
  browser geometry and header-compaction sync before assertions run
- Frontend gate manifest update required:
  not yet
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  no
