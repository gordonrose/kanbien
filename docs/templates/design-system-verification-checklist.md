# Design System Verification Checklist

Use this when a `/design-system` pattern or component is moving from
exploration toward governed adoption.

The goal is to keep implementation, rendered verification, sign-off, and
production-readiness as separate checkpoints.

## Scope

- Artifact name:
- Surface:
- Status under review:
  exploratory, signed-off, system-ready, adopted, needs-review, superseded, or archived
- Related principle artifact:
- Related pattern artifact:
- Related component artifact:
- Related adoption note:

## Visual Contract

- One-sentence rule:
- Trigger for this review:
- What changed since the last review:

## Source Verification

- Source files inspected:
- Implementation updated:
  yes or no
- Known source-level risks:

## Rendered Verification

- Required viewports checked:
- Required direction states checked:
- Required theme states checked:
- Required magnification states checked:
- Real interactive states checked:
  filled inputs, native browser affordances, open menus, compact modes, or
  other non-empty runtime states
- Overflow or clipping checks:
- Layering or anchoring checks:
- Attachment / shell-framing checks:
- Alignment or shared-gutter checks:
- Screenshot or rendered evidence reference:

## Accessibility Verification

- Keyboard entry and exit:
- Focus order and return focus:
- Semantic structure:
- Screen-reader naming and labeling:
- Contrast or motion considerations:
- Localization or long-content considerations:
- Browser-native affordance coexistence considerations:

## State Coverage

- Default:
- Hover / pressed / focus:
- Selected / active:
- Disabled:
- Loading:
- Empty:
- Error:
- Denied / restricted:
- Destructive:

Record `not applicable` explicitly rather than leaving state handling implicit.

## Quality Gate Outcome

- Implementation status:
  changed, unchanged, or blocked
- Rendered status:
  verified, partially verified, or not verified
- Human sign-off status:
  pending, approved, or rejected
- Promotion decision:
  remain exploratory, promote to signed-off, promote to system-ready, promote to adopted, or return to needs-review
- Open follow-ups:

## Traceability And Sync

- Workspace artifact location:
- Design-system route update required:
- Canonical render-ready / honest-width check required:
- Frontend gate manifest update required:
- Architecture-map update required:
- Real-app adoption now allowed:
  yes or no
