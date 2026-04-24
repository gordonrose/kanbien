# Design System Verification Checklist

## Scope

- Artifact name:
  `ListRecordCard`
- Surface:
  `/design-system/canonical-renderings/list-record-card`
  `/design-system/canonical-renderings/list-record-card/:ref`
  `/design-system/components/list-record-card`
- Status under review:
  signed-off
- Related pattern artifact:
  `docs/workspace/design-system/patterns/list-record-card-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/list-record-card-component.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/list-record-card-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/list-record-card-reference-pack.md`
- Related parent behavior lock:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Related parent reference pack:
  `docs/workspace/design-system/reference-packs/list-page-reference-pack.md`

## Visual Contract

- One-sentence rule:
  A `ListRecordCard` must stay a full-width selectable summary card whose
  selection state can drive the parent detail surface without changing the
  card’s basic anatomy across desktop and mobile list contexts.
- Trigger for this review:
  Start the governed child extraction from the new `List Page` parent pattern.
- What changed since the last review:
  The child seam now has a generated persistence-backed canonical launcher and
  dedicated render surface so
  full-width, half-page, and mobile card states can be reviewed directly
  instead of only through the parent page template.

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/components/list-record-card.html`
  `src/frontend/designSystem/canonicals/list-record-card/index.html`
  `src/frontend/designSystem/assets/listRecordCardCanonical.mjs`
  `src/features/designSystemCanonicals/persistence/migrations/0038_seed_design_system_canonicals_list_page_children.sql`
  `tests/visual/designSystem/canonicals/data-display/listRecordCard.spec.ts`
- Implementation updated:
  yes
- Known source-level risks:
  the child canonicals now prove width/direction/magnification/theme locally,
  but a focus-visible-specific canonical still remains a follow-up before
  promotion to `system-ready`

## Rendered Verification

- Required viewports checked:
  desktop full-width, desktop half-page, and mobile through the dedicated
  canonical route
- Required direction states checked:
  rtl half-page canonical added
- Required theme states checked:
  normal, dark, and desert baseline canonicals added
- Required magnification states checked:
  magnified half-page canonical added
- Real interactive states checked:
  default card, selected card, missing-attribute fallback, long-content
  half-page state, and mobile-width state
- Overflow or clipping checks:
  tag wrapping remains source-inspected; rendered child-specific overflow proof
  still needed
- Layering or anchoring checks:
  protected indirectly through the parent mobile overlay test
- Attachment / shell-framing checks:
  parent-owned and already covered through the list-page route
- Alignment or shared-gutter checks:
  source-inspected only
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/data-display/listRecordCard.spec.ts`

## Accessibility Verification

- Keyboard entry and exit:
  source-inspected through real button semantics; dedicated focus-visible
  canonical still remains a follow-up before promotion to `system-ready`
- Focus order and return focus:
  source-inspected only
- Semantic structure:
  button-based card structure present
- Screen-reader naming and labeling:
  source-inspected only
- Contrast or motion considerations:
  theme-variant rendered proof now exists; focus-visible contrast still needs a
  dedicated child state before app adoption
- Localization or long-content considerations:
  half-page and mobile long-content rendered review now exists; theme now has
  baseline canonical proof while broader localization still remains open
- Browser-native affordance coexistence considerations:
  current child seam keeps native button behavior

## State Coverage

- Default:
  covered through dedicated canonical
- Hover / pressed / focus:
  source-inspected only
- Selected / active:
  covered through dedicated canonical
- Disabled:
  not applicable yet
- Loading:
  not applicable yet
- Empty:
  not applicable for a single card
- Error:
  not applicable yet
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
  add a focus-visible canonical before promoting to `system-ready` or allowing
  real-app adoption
  keep future sign-off ordering explicit as child behavior lock, then child
  reference pack, then child canonicals

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/list-record-card-verification-checklist.md`
- Design-system route update required:
  yes:
  `/design-system/canonical-renderings/list-record-card`
  `/design-system/canonical-renderings/list-record-card/:ref`
  `/design-system/components/list-record-card`
- Canonical render-ready / honest-width check required:
  completed for the signed-off canonical set
- Frontend gate manifest update required:
  not yet
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  no
