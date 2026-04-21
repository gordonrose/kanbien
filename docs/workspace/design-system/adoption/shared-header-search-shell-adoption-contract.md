# Shared Header Search-Shell Adoption Contract

## Scope

- Component or pattern family:
  `search-shell`
- Status:
  draft
- First consumer surface:
  shared application header search
- Route or shell owner:
  future authenticated application shell
- Source pattern artifact:
  `docs/workspace/design-system/patterns/search-shell-pattern.md`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/search-shell-reference-pack.md`
- Source verification checklist:
  `docs/workspace/design-system/verification/search-shell-verification-checklist.md`

## Purpose

- What business or workflow need does this adoption serve?
  Standardize a centered, bounded, secondary-chrome search affordance so app
  shells stop inventing local search field geometry and placeholder behavior.
- Why is this the right first consumer?
  The search shell is most reusable when it becomes a shared shell affordance
  rather than staying tied only to the design-system preview or a single page.
- Why is adoption happening now instead of remaining design-system-only?
  The family now has explicit canonicals for empty, active, reduced, mobile,
  RTL, magnified, and localized states, so the next honest step is a governed
  shell consumer.

## Capability And Workflow Mapping

- Capability source:
  future authenticated application-shell search workflow
- Primary actor:
  authenticated application user or operator, depending on the eventual shell
- Permission or capability rules:
  adoption must not silently widen search scope; consumer search capability and
  result visibility remain owned by the eventual shell
- Route ownership:
  future authenticated application shell
- Workflow states in scope:
  empty search, active search, bounded search under row pressure, mobile
  fallback, RTL, and localized placeholder stress
- Workflow states explicitly deferred:
  result rendering, query persistence, advanced filters, and backend search API
  semantics

## Pattern Mapping

- Signed-off pattern being adopted:
  bounded secondary-chrome `search-shell`
- Required behavior-lock IDs:
  `SS-000` through `SS-010`
  plus any row-level `SN-*` behavior if the shell is adopted beside breadcrumb
- Required canonical reference states:
  `SSR-001`, `SSR-002`, `SSR-003`, `SSR-004`, `SSR-005`, `SSR-006`,
  `SSR-007`, `SSR-008`, `SSR-009`, `SSR-010`, `SSR-011`, `SSR-012`
- Which parts of the pattern are mandatory for parity?
  centered bounded desktop presentation, visible focus treatment, active Enter
  hint behavior, narrow-width suffix yield, mobile full-width fallback, and
  RTL/localized placeholder safety
- Which parts are intentionally deferred in this first consumer?
  data-backed search result behavior, advanced search affordances, and any
  consumer-specific filter chips or prefix icons

## Consumer Contract

- Primary destinations:
  shared shell-level search destinations are still to be defined by the
  eventual app shell
- Utility actions:
  none; the shell is a search affordance, not a utility menu
- Profile or preference actions:
  out of scope
- Loading / empty / denied states:
  empty input state is in scope; loading, denied, or disabled behavior needs
  explicit consumer sign-off before shipping
- Error or degraded states:
  a future consumer may define non-destructive degraded behavior, but must not
  break bounded geometry or focus visibility
- Localization / long-label expectations:
  adoption must preserve the representative long Latin, RTL, CJK, and
  symbol-heavy placeholder behavior from the signed-off canonicals

## Parity Rules

- Must match reference pack:
  bounded shell geometry, focus treatment, Enter-hint rules, mobile fallback,
  and localization-safe placeholder behavior
- May differ intentionally:
  final placeholder copy and search scope naming may be consumer-specific
- Must not drift:
  no full-row takeover in desktop/tablet states, no early family-local
  stacking, and no custom suffix behavior that competes with content before it
  yields
- Required parity evidence:
  canonical parity review against `SSR-*` states plus consumer-shell visual
  evidence when the first real header search lands

## Adoption Boundary

- What existing local UI is being replaced?
  future page-local or shell-local search field inventions in the first shared
  authenticated application shell
- What backend seams or APIs must remain untouched?
  no backend search API is implied or changed by this adoption contract alone
- What page-local behavior is allowed for the POC?
  placeholder search wiring or no-op execution while the real search feature is
  still being built, as long as bounded geometry and interaction parity remain
  intact
- What is explicitly out of scope?
  query-result rendering, search analytics, filter chips, and data-backed
  search scope expansion

## Verification

- Required rendered checks:
  parity against the full `SSR-*` canonical set, including active, mobile,
  RTL, magnified, and localized states
- Required executable tests:
  existing `subNav.spec.ts` search-shell coverage remains green; add consumer
  visual parity checks when the first shared header implementation lands
- Required manual sign-off steps:
  review placeholder readability, focus visibility, Enter-hint behavior, and
  narrow-width suffix yield on the real consumer shell
- Known blockers or environment constraints:
  the first real shared application-header consumer has not been implemented
  yet

## Promotion Decision

- Adoption result:
  candidate
- Follow-up work required before wider reuse:
  land the first shared-header search consumer and capture app-vs-reference
  parity evidence
- Follow-up work required before extraction into a shared primitive:
  prove at least one real shared shell consumer and clarify which execution
  semantics belong to the primitive versus the consuming shell
