# Design System Verification Checklist

## Scope

- Artifact name:
  Search shell
- Surface:
  `/design-system`
- Status under review:
  system-ready
- Related principle artifact:
  None yet
- Related pattern artifact:
  `docs/workspace/design-system/patterns/search-shell-pattern.md`
- Related component artifact:
  None yet
- Related adoption note:
  `docs/workspace/design-system/adoption/shared-header-search-shell-adoption-contract.md`

## Visual Contract

- One-sentence rule:
  The search shell must remain a centered, bounded, secondary-chrome search
  affordance even while the surrounding row compresses.
- Trigger for this review:
  define search-shell as its own family without letting it silently inherit
  unstable row behavior
- What changed since the last review:
  search-shell now has an explicit family pattern and verification surface
  instead of being implied only by the shared `/design-system` page

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/index.html`
  `src/frontend/designSystem/assets/styles.css`
- Implementation updated:
  no
- Known source-level risks:
  shared-row captures now exist for several family states, but dedicated
  search-shell evidence is still incomplete

## Rendered Verification

- Required viewports checked:
  captured through desktop, compressed, mobile, RTL, and magnified states
- Required direction states checked:
  partially captured for LTR and RTL
- Required theme states checked:
  still required
- Required magnification states checked:
  still required when row compression changes under zoom
- Overflow or clipping checks:
  must verify the input stays bounded and centered under row pressure
- Layering or anchoring checks:
  not a primary family concern, but the shell must remain compatible with row
  layering
- Screenshot or rendered evidence reference:
  `docs/workspace/design-system/reference-packs/search-shell-reference-pack.md`
  overlapping shared-row evidence at
  `tests/visual/__snapshots__/designSystem/canonicals/navigation/subNav.spec.ts/`

## Accessibility Verification

- Keyboard entry and exit:
  source input reachable; rendered focus pass still required
- Focus order and return focus:
  stable focus entry still needs rendered review in the composed row
- Semantic structure:
  search `form` and `input type="search"` present in source
- Screen-reader naming and labeling:
  future consumer review needed if placeholder-only naming is insufficient
- Contrast or motion considerations:
  focus and placeholder styling still need rendered review across themes
- Localization or long-content considerations:
  placeholder and future labels must not force row instability; representative
  long Latin, RTL, CJK, and symbol-heavy placeholder coverage is required

## State Coverage

- Default:
  source inspected
- Hover / pressed / focus:
  focus state present in source, rendered evidence pending
- Selected / active:
  not applicable
- Disabled:
  not yet defined
- Loading:
  not yet defined
- Empty:
  source empty input state present
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
  canonicals reviewed and Playwright-locked for the full search-shell set
- Human sign-off status:
  current canonical review accepted
- Promotion decision:
  promote to `system-ready`
- Open follow-ups:
  land the first shared-header consumer and verify app-vs-reference behavior

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/search-shell-verification-checklist.md`
- Design-system route update required:
  yes
- Frontend gate manifest update required:
  yes, `tests/visual/designSystem/canonicals/manifests/subNav.first-batch.manifest.json` and
  `tests/visual/designSystem/canonicals/manifests/subNav.canonical.manifest.json` now govern the
  overlapping shared-row evidence
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  yes
