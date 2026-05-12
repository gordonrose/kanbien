# List Detail Section Index Verification Checklist

## Scope

- Artifact name:
  `ListDetailSectionIndex`
- Surface:
  `/design-system/templates/list-page?drawerVariant=indexed`
  `/root-admin/users`
- Status under review:
  signed-off for first-consumer adoption
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/list-detail-section-index-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/list-detail-section-index-reference-pack.md`

## Visual Contract

- One-sentence rule:
  A list detail drawer may expose multiple record sections through compact
  label-only selectable rows, with exactly one section panel visible at a time.
- Trigger for this review:
  Root-users needs profile and session-information sections inside the selected
  root-user drawer.

## Source Verification

- Source files inspected or updated:
  `src/frontend/designSystem/assets/listDrawerShell.mjs`
  `src/frontend/designSystem/assets/list-page-shared.css`
  `src/frontend/designSystem/assets/rootAdminDirectoryWorkspace.mjs`
  `src/frontend/rootAdminShell/routes/users/page.mjs`
  `src/frontend/rootAdminShell/assets/app.mjs`
- Implementation updated:
  yes
- Known source-level risks:
  selected-user session records are not loaded by the current root-users list
  API; the session section must state that honestly rather than inventing
  unavailable data.

## Rendered Verification

- Required viewports checked:
  desktop list-page design-system variant and desktop root-users first
  consumer
- Required direction states checked:
  RTL design-system indexed variant
- Required theme states checked:
  dark design-system indexed variant
- Required magnification states checked:
  `zoom=100` design-system indexed variant
- Real interactive states checked:
  section switching for design-system Details/Picture/Description and
  root-users Profile/Session information
- Overflow or clipping checks:
  section index containment inside the drawer panel
- Attachment / shell-framing checks:
  root-users continues to use the shared root-admin directory workspace seam
  and shared list-page stylesheet

## Accessibility Verification

- Keyboard and semantics:
  section rows use tab semantics with `aria-selected`; arrow-key switching is
  supported by the design-system and root-users controllers
- Focus considerations:
  active row can receive focus without changing selected record
- Screen-reader naming:
  section index has a contextual `aria-label`

## Executable Evidence

- `tests/visual/designSystem/canonicals/data-display/listPage.spec.ts`
- `tests/visual/app/rootAdminShell/rootAdminRootUsersList.spec.ts`

## Outcome

- Implementation status:
  changed
- Rendered status:
  verified by focused and suite-level Playwright coverage
- Human sign-off status:
  pending final visual review
- Promotion decision:
  reusable seam approved for root-users first-consumer adoption
