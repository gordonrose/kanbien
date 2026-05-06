# Build Work Panel Verification Checklist

## Scope

- Artifact name:
  `build-work-panel`
- Surface:
  signed-off `/design-system/patterns/build-work-panel-demo` pattern surface
  and `/design-system/canonical-renderings/build-work-panel/*` canonical states
- Status under review:
  canonical-created; browser verification partial
- Related principle artifact:
  `docs/workspace/design-system/behavior-locks/build-work-panel-behavior-lock.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/build-work-panel-pattern.md`
- Related component artifact:
  not created
- Related adoption note:
  `docs/workspace/design-system/adoption/root-admin-build-work-panel-adoption-contract.md`

## Visual Contract

- One-sentence rule:
  The Build work panel is a governed shell-attached work surface that stays
  reachable across pages, collapses to a mobile floating action, opens only the
  Build chat for MVP, and treats page/module/role context as helpful prompt
  text rather than authority.
- Trigger for this review:
  Chat interface for Layer 1 Product Discovery needs design-system signoff
  before root-admin app UI implementation.
- What changed since the last review:
  The review surface now exists, has user signoff for the MVP direction, and
  has rendered smoke evidence for dark theme, RTL controls, high
  magnification, the right-side icon toolbar, conversation history, composer
  menu, message actions, and packet download journey.

## Source Verification

- Source files inspected:
  Product Discovery, Technical Steering, Story Breakdown, generated PDF asset
  decision, drawer behavior lock, drawer pattern.
- Implementation updated:
  yes, inside `/design-system` review-only source.
- Known source-level risks:
  Shared render/controller seam, canonical launcher, and generated canonical
  render routes now exist. App adoption still needs first-consumer parity proof
  and a hardened app-consumable style-entrypoint decision.

## Rendered Verification

- Required viewports checked:
  desktop review surface, mobile collapsed/open behavior during iteration, and
  responsive CSS breakpoints; dedicated canonical viewport batch still pending.
- Required direction states checked:
  LTR and RTL through the review surface display settings drawer.
- Required theme states checked:
  normal and dark through rendered smoke checks; desert preview state exists.
- Required magnification states checked:
  baseline, 115%, and 135% through the review surface display settings drawer.
- Real interactive states checked:
  open panel, close panel, Build toggle collapse/open, right-side icon toolbar,
  conversation-history expand/collapse, conversation selection, typed message,
  expandable composer tools menu, copy/edit/reply message actions, packet
  available, packet preparing, completed packet history event, repeat-download
  action, and mobile floating action.
- Overflow or clipping checks:
  transcript scroll, long conversation titles, long page/module/role names,
  long packet title, composer reachability.
- Layering or anchoring checks:
  right-side desktop attachment, mobile floating launcher, mobile panel,
  top-nav/context-nav/bottom-nav overlap.
- Attachment / shell-framing checks:
  must prove shell-owned attachment rather than page-local panel placement.
- Alignment or shared-gutter checks:
  align to shell gutters and avoid content reflow.
- Screenshot or rendered evidence reference:
  rendered dark-theme smoke screenshot at
  `/tmp/build-work-panel-demo-dark-fixed.png`; executable rendered smoke script
  reported no light-surface regressions after the final dark-theme fix.
  Canonical route smoke verified `BWP-R-002` after seam creation.

## Accessibility Verification

- Keyboard entry and exit:
  partially verified through button semantics and focusable controls; full
  canonical keyboard walk pending.
- Focus order and return focus:
  not verified.
- Semantic structure:
  not verified.
- Screen-reader naming and labeling:
  not verified.
- Contrast or motion considerations:
  dark-theme surface regressions fixed and smoke-checked; formal contrast gate
  pending.
- Localization or long-content considerations:
  RTL and high-magnification review controls exist and were smoke-checked;
  full long-label canonical set pending.
- Browser-native affordance coexistence considerations:
  not verified.

## State Coverage

- Default:
  review surface verified.
- Hover / pressed / focus:
  planned; not verified.
- Selected / active:
  Build active verified in review surface.
- Disabled:
  Reporting and Support inactive icon toolbar actions verified in review
  surface.
- Loading:
  packet preparation journey verified; chat response loading state still
  pending.
- Empty:
  quiet harness opening message verified in review surface.
- Error:
  failed response and failed generation pending canonical state proof.
- Denied / restricted:
  pending canonical state proof.
- Destructive:
  not applicable for MVP.

## Quality Gate Outcome

- Implementation status:
  review surface and canonical render seam implemented
- Rendered status:
  smoke verified for current signed-off pattern surface and primary canonical
  route
- Human sign-off status:
  signed off for the current design-system pattern direction
- Promotion decision:
  promote to canonical-created design-system family; keep app adoption blocked
- Open follow-ups:
  Add the full Playwright canonical scenario batch, prove root-admin first
  consumer parity, decide the hardened app style-entrypoint name, and refresh
  this checklist before root-admin adoption.

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/build-work-panel-verification-checklist.md`
- Design-system route update required:
  yes
- Canonical render-ready / honest-width check required:
  yes
- Frontend gate manifest update required:
  yes, for the full visual canonical scenario batch.
- Architecture-map update required:
  yes, when the family is promoted beyond draft.
- Real-app adoption now allowed:
  no
