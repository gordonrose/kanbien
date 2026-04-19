# Root Admin Web App Hierarchy Tree Adoption Contract

## Scope

- Component or pattern family:
  `hierarchy-tree`
- Status:
  candidate first-consumer adoption contract
- First consumer surface:
  `root-admin` web app hierarchy administration page
- Route or shell owner:
  `/root-admin`
- Source pattern artifact:
  `/design-system/patterns/hierarchy-tree`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/hierarchy-tree-reference-pack.md`
- Source verification checklist:
  `docs/workspace/design-system/verification/hierarchy-tree-verification-checklist.md`
- Related host families:
  `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`
  `docs/workspace/design-system/behavior-locks/context-nav-drawer-behavior-lock.md`
  `docs/workspace/design-system/behavior-locks/display-settings-behavior-lock.md`
- Related backend feature:
  `docs/featureDocs/web-app-hierarchy-builder-feature.md`

## Purpose

- What business or workflow need does this adoption serve?
  Provide a governed root-admin surface for reading and administering durable
  curated web app hierarchy truth through the existing `webAppHierarchyBuilder`
  backend instead of introducing a page-local tree invention.
- Why is this the right first consumer?
  The hierarchy-builder workflow is the most direct real consumer of the
  signed-off `hierarchy-tree` family: it needs protected roots, deep nesting,
  inline rename, drag or menu move, explicit orphaning posture, long-title
  handling, RTL, mobile full-screen drawer behavior, and desktop resize.
- Why is adoption happening now instead of remaining design-system-only?
  The upstream family now has a signed-off reference route, behavior lock,
  reference pack, verification checklist, canonical launcher, and pattern-owned
  canonical render surface. The next honest step is a first-consumer adoption
  contract rather than app-local reinterpretation.

## Capability And Workflow Mapping

- Capability source:
  `webAppHierarchyBuilder` foundation and later root-admin page workflow
- Primary actor:
  authenticated root operator with web-app hierarchy permissions
- Permission or capability rules:
  preserve the existing authenticated root-session seam and root capability
  checks. This adoption must not invent broader access or bypass
  capability-specific enforcement already owned by `webAppHierarchyBuilder`.
- Route ownership:
  new or updated `root-admin` hierarchy administration route under the existing
  protected root-admin shell
- Workflow states in scope:
  - `GET /v1/web-app-hierarchy/tree` drives the primary rendered tree
  - module and page rename/edit flows
  - page add-child and add-sibling creation flows
  - page move via drag on desktop and menu fallback everywhere
  - explicit orphan review access as a separate operator surface
  - explicit top-level admin actions such as bootstrap and sync discovery
  - current-versus-selected tree behavior while a detail panel or page content
    remains visible beside the tree
- Workflow states explicitly deferred:
  - tenant-facing hierarchy editing
  - app-local reinvention of the tree host posture
  - discovery-reconcile UI beyond approved backend seams
  - redirect or alias management for compatibility-blocked live route changes
  - bulk remediation UX not already supported by backend seams

## Pattern Mapping

- Signed-off pattern being adopted:
  `hierarchy-tree` family as captured by `HTR-001` through `HTR-034`
- Required behavior-lock IDs:
  `HT-001` through `HT-031`
- Required canonical reference states:
  `HTR-001`, `HTR-004`, `HTR-005`, `HTR-007`, `HTR-010`, `HTR-014`,
  `HTR-019`, `HTR-021`, `HTR-024`, `HTR-026`, `HTR-030`, `HTR-033`
- Which parts of the pattern are mandatory for parity?
  - drawer-hosted hierarchy posture
  - one-line row anatomy
  - protected root behavior
  - separate `current` and `selected`
  - double-click inline rename
  - desktop drag-and-drop plus menu fallback move
  - explicit delete or orphan decision handling where supported by backend
  - desktop resize
  - mobile full-screen drawer posture
  - RTL, magnification, tooltip, overflow, and dark-theme parity
- Which parts are intentionally deferred in this first consumer?
  - review-only design-system fixture copy
  - preview-only display-setting payload breadth that does not belong in the
    root-admin page
  - future advanced reconcile and bridge-record visualization beyond the
    approved builder seams

## Consumer Contract

- Primary destinations:
  rooted hierarchy administration for `root-admin`, `login`, and
  `design-system` root families through `GetTree`
- Utility actions:
  page-level admin actions such as `Refresh`, `Sync discovery`, `Bootstrap`,
  and `View orphans` may exist around the adopted tree, but they must not alter
  the signed-off row grammar
- Profile or preference actions:
  remain owned by the adopted root-admin shell and display-settings families,
  not by `hierarchy-tree`
- Loading / empty / denied states:
  - loading may skeleton or placeholder the drawer contents, but must preserve
    the approved drawer-hosted tree posture
  - empty hierarchy may show an empty-state message plus approved page-level
    actions such as bootstrap
  - denied states must remain truthful to root capability checks and must not
    fake edit affordances when the actor lacks permission
- Error or degraded states:
  fetch, move, update, bootstrap, and sync failures may surface page-level or
  row-level error messaging, but they must not collapse the tree into a
  different family or silently discard current and selected context
- Localization / long-label expectations:
  adoption must preserve signed-off RTL parity, truncation, tooltip reveal,
  long-title overflow behavior, and magnification resilience

## Consumer Framing

- Is this shell chrome or page content?
  page content inside the governed root-admin shell, using the shell-attached
  drawer posture already signed off upstream
- Attached to adjacent chrome or intentionally floating?
  attached to governed shell chrome rather than floating as a page-local
  invention
- Full-width or intentionally contained?
  the surrounding page may use real-app layout width, but the hierarchy surface
  must preserve the signed-off drawer model rather than becoming a custom split
  pane or bespoke card wall
- Shared gutter / alignment expectations:
  keep alignment honest with the root-admin shell and any adjacent detail
  content, but do not rewrite the hierarchy-tree drawer shell to satisfy
  page-local composition shortcuts
- Elements that must align across rows:
  expander lane, title lane, compact markers, and row-menu lane
- Browser-native controls or affordances that must coexist with custom UI:
  tooltip reveal, focus rings, drag affordance, dialogs, and drawer controls
  must continue to behave according to the signed-off pattern family

## Parity Rules

- Must match reference pack:
  the root-admin consumer must preserve the signed-off hierarchy-tree posture,
  row anatomy, protected-root treatment, current-versus-selected grammar,
  resize bounds, mobile full-screen posture, RTL parity, long-title handling,
  and menu-based structural actions
- May differ intentionally:
  - business copy
  - backend data bindings
  - selected-node detail content
  - permission-based hiding or disabling of actions
  - page-level admin actions around the tree
- Must not drift:
  - no root-admin-specific tree family
  - no copied or forked hierarchy-tree CSS or interaction logic
  - no alternate rename interaction
  - no page-local row anatomy that adds extra stacked metadata or breaks the
    one-line row reading model
  - no replacement of drawer-hosted posture with a custom split layout without
    explicit design-system approval
  - no local reinterpretation of current-versus-selected behavior
- Required parity evidence:
  browser-reviewed comparison against the signed-off `HTR-*` states plus
  executable parity coverage on the real root-admin consumer
- Required real interactive parity states:
  rename, move, current-versus-selected divergence, long-title tooltip reveal,
  desktop resize, mobile full-screen drawer, RTL mirrored layout, and top-level
  collapse or expand behavior
- Required consumer-level shell-parity evidence:
  prove that the adopted tree still anchors correctly inside the governed
  root-admin shell with context-nav, drawer attachment, breadcrumb behavior,
  and display-settings co-presence unaffected

## Adoption Boundary

- What existing local UI is being replaced?
  any future temptation to build a custom root-admin hierarchy browser or tree
  editor outside the signed-off design-system family
- What backend seams or APIs must remain untouched?
  `webAppHierarchyBuilder` route contracts, root capability rules, root session
  behavior, hierarchy durability semantics, orphan separation, bootstrap
  honesty, and discovery-sync boundaries
- What page-local behavior is allowed for the POC?
  - business copy and labels
  - API request and response wiring
  - detail-panel composition for the currently selected module or page
  - page-level action availability driven by permissions or backend support
  - explicit orphan-review access as a separate operator surface
- What is explicitly out of scope?
  - inventing a new tree pattern or family in app code
  - flattening orphaned pages back into the active tree by default
  - putting lifecycle status back into the primary row surface
  - changing the signed-off drawer, row, or selection grammar just because the
    real consumer has different business semantics

## Verification

- Required rendered checks:
  compare the adopted root-admin page against the signed-off hierarchy-tree
  canonicals for desktop, mobile, RTL, dark theme, magnification, long-title
  overflow, rename, move fallback, and top-level collapse behavior
- Required executable tests:
  root-admin consumer visual and interactive coverage should prove:
  - `GetTree` rendering into protected roots, modules, and pages
  - current and selected divergence
  - rename flow
  - drag or menu move where backend support is present
  - long-title tooltip parity
  - mobile full-screen drawer
  - RTL parity
  - permission-aware action visibility
- Required manual sign-off steps:
  review the real root-admin consumer beside the signed-off design-system
  family and confirm no app-local drift in posture, row grammar, or responsive
  behavior before treating adoption as complete
- Known blockers or environment constraints:
  this contract does not by itself guarantee all backend mutation workflows are
  UI-ready; action exposure must remain honest to the currently implemented
  `webAppHierarchyBuilder` seams

## Canonical And Consumer Truth

- Canonical states this consumer depends on:
  `HTR-001`, `HTR-004`, `HTR-005`, `HTR-007`, `HTR-010`, `HTR-019`,
  `HTR-021`, `HTR-024`, `HTR-026`, `HTR-030`, `HTR-033`
- Consumer-specific states not fully proven by canonicals alone:
  - mapping of `GetTree` root families, modules, and pages into the adopted
    row grammar
  - permission-aware action visibility for root-admin actors
  - separate orphan-review entry point
  - page-level admin actions such as bootstrap and sync discovery
- Render-ready or parity constraints for screenshots:
  use realistic `webAppHierarchyBuilder` labels and hierarchy depth, but keep
  the signed-off hierarchy-tree geometry and row treatment unchanged

## Promotion Decision

- Adoption result:
  candidate
- Follow-up work required before adoption starts:
  agree the first root-admin hierarchy page will consume the signed-off
  `hierarchy-tree` source directly rather than building a local variant
- Follow-up work required before wider reuse:
  complete first-consumer parity proof in the real root-admin page and keep the
  contract in sync with any approved backend or shell-boundary changes
- Follow-up work required before extraction into a shared primitive:
  prove at least one additional real consumer before attempting any further
  extraction beyond the already signed-off family source
