# Governed Page-Shell Enforcement Blueprint

## Summary

- Feature:
  governed frontend shell enforcement for real app route families
- Scope:
  convert shell governance from prose into repo-enforced architecture and
  harness checks
- Primary target:
  `rootAdminShell` authenticated surfaces
- Explicit exception:
  login may remain an allowed exception surface
- Phase:
  pre-implementation blueprint from settled architecture decisions; this
  blueprint defines the repo and harness rollout before code migration starts

## Inputs

- ADR(s):
  - [0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md](/home/gordon/kanbien/docs/architecture/adr/0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md)
  - [0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md](/home/gordon/kanbien/docs/architecture/adr/0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md)
  - [0029-adopt-design-system-owned-page-shells-for-governed-app-route-families.md](/home/gordon/kanbien/docs/architecture/adr/0029-adopt-design-system-owned-page-shells-for-governed-app-route-families.md)
- Governing source route:
  [src/frontend/designSystem/templates/page-shell/index.html](/home/gordon/kanbien/src/frontend/designSystem/templates/page-shell/index.html)
- Current real consumer:
  [src/frontend/rootAdminShell/index.html](/home/gordon/kanbien/src/frontend/rootAdminShell/index.html)
- Current local shell stylesheet:
  [src/frontend/rootAdminShell/assets/styles.css](/home/gordon/kanbien/src/frontend/rootAdminShell/assets/styles.css)
- Related standards gate:
  [change-artifact-requirements.md](/home/gordon/kanbien/docs/standards/change-artifact-requirements.md)

## Problem Statement

The current repo rules correctly forbid page-local governed-family drift, but
they still leave the main failure mode alive:

- the real app shell is locally authored
- the signed-off page shell exists only on `/design-system`
- page-level adoption then happens inside a fake shell host
- child-family parity can therefore still miss even when the child seam itself
  is shared honestly

The repo needs to move the enforcement boundary upward:

- from page-family-only governed adoption
- to shell-first governed adoption

## Scope Confirmation

This blueprint covers:

- shell-level repo contracts
- shell-level source-first enforcement
- static gate checks
- consumer-level Playwright shell parity
- honest current-state classification until migration lands

This blueprint does **not** include:

- implementing the full shell render migration in the same pass
- changing login posture
- solving every page-family migration before shell enforcement exists
- introducing a new frontend framework

## Target Architecture

### Governed Unit

For non-exception app surfaces, the governed unit is:

- the page shell itself
- plus route content rendered inside approved shell slots

### Signed-Off Source Of Truth

The current root-admin governed shell target is:

- `/design-system/templates/page-shell`

### Allowed App Ownership After Migration

- route registry
- route data wiring
- backend/API calls
- permission-aware visibility
- page-body content passed into shell slots
- login exception surface

### Forbidden App Ownership After Migration

- shell HTML
- shell CSS
- shell interaction logic
- shell accessibility and state semantics

## Source-First Enforcement Model

The repo should not depend primarily on a rich hand-maintained shell manifest.
That would create another drift surface.

The primary enforcement model should instead be:

1. the app must consume a design-system-owned shell render seam
2. the static gate must inspect live source directly
3. Playwright must compare the real app shell to the signed-off shell truth

If a machine-readable status artifact is still helpful during migration, keep
it minimal and status-only rather than using it as the main policy source of
truth.

## Static Gate Plan

Create a script such as:

- `src/scripts/checkGovernedFrontendShells.ts`

Wire it into the frontend gate and make it fail on these conditions.

### Blocking Conditions

1. The app shell still links or imports local shell CSS after the shell is
   declared fully governed.
2. The app shell still renders local shell markup regions after the shell is
   declared fully governed.
3. The app shell does not import or mount the required design-system shell
   render/controller seam.
4. Required shell parity specs or shell evidence are missing.
5. Docs or adoption notes describe the shell as governed adoption complete
   while static source audit or runtime parity still show local shell
   ownership.

### Early Transitional Rule

Before the real shell migration lands, the gate should allow the current
legacy or partial posture, but only if:

- docs and adoption artifacts use that same honest status
- no new local shell ownership is added beyond the currently acknowledged
  baseline

That prevents the repo from silently regressing while the migration is still
in progress.

## CSS Enforcement Plan

The shell gate should treat these as shell-owned surfaces, not page-local
styling:

- `.top-nav*`
- `.mobile-nav*`
- `.sub-nav*`
- `.breadcrumb*`
- `.search-shell*`
- `.context-nav*`
- `.side-panel*`
- `.accessibility-drawer*`
- shell-level spacing, gutters, background, and frame selectors

### Rule

If a stylesheet owned by `rootAdminShell` touches those shell selectors for a
non-exception governed route, the shell gate should fail once the shell is
declared fully governed.

### Transitional Audit

Before full migration, the static gate should record the current local shell
selector inventory so future changes can be detected as:

- unchanged acknowledged debt
- reduced debt
- or new shell ownership drift

### Direct Source Inputs

The static gate should inspect source directly, starting with:

- `src/frontend/rootAdminShell/index.html`
- `src/frontend/rootAdminShell/assets/styles.css`
- the root-admin shell JS entrypoint(s)
- the design-system page-shell source route

This keeps enforcement live and derived from the implementation rather than
from duplicated declarations.

## Render-Seam Plan

The design system should eventually publish a shell-owned seam that exports:

- render structure for the page shell
- shell controller behavior
- a route-content slot contract
- narrow allowed inputs such as:
  - brand label
  - route nav items
  - current route metadata
  - utility visibility flags
  - page-body slot/render callback

The real app should then compose:

- root-admin data and routing
- root-auth bootstrap state
- page-body content

without reauthoring the shell DOM itself.

This render seam is the strongest enforcement lever. Once the real app shell
must be mounted through the design-system seam, drift becomes structurally
harder instead of only procedurally forbidden.

## Playwright Plan

Add shell-level consumer checks in the app visual suite.

### Required Assertions

1. The real root-admin shell matches the signed-off page-shell source in named
   parity regions.
2. Forbidden local shell wrappers are absent once the shell is fully governed.
3. Shell-attached drawers are attached and layered like the signed-off shell,
   not as page-local panels.
4. Breadcrumb/search row parity and context-nav parity are proved inside the
   real root-admin shell, not only on `/design-system`.

### Required Parity Regions

- top nav
- sub-nav row
- context-nav rail or bottom-nav state
- drawer attachment zone
- shell page-main framing

### Required Test Shape

- capture signed-off source region from `/design-system/templates/page-shell`
- capture matching app region from `/root-admin`
- compare cropped shell regions with an honest tolerance
- also assert one direct geometry fact per region where appropriate

The shell harness should prove runtime truth, not declared truth.

## Repo Documentation Plan

Update these docs during implementation:

- `docs/architecture/frontend-overview.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/guides/frontend-implementation-guide.md`
- `docs/standards/change-artifact-requirements.md`

The docs should distinguish clearly between:

- current locally owned shell posture
- accepted governed shell target
- partial migration status
- fully governed shell status

## Suggested Delivery Order

1. Add ADR 0029.
2. Define the design-system-owned page-shell seam.
3. Add the static shell gate that inspects live source directly.
4. Add shell-level Playwright parity scaffolding.
5. Migrate `rootAdminShell` off local shell markup and CSS.
6. Tighten the gate so local shell ownership becomes a hard failure.

## First Concrete Repo Tasks

### Task 1. Static audit script

- inspect `rootAdminShell/index.html`
- inspect `rootAdminShell/assets/styles.css`
- report current shell ownership inventory
- fail on newly introduced local shell ownership once the baseline is captured

### Task 2. Frontend gate wiring

- add `check:governed-shells` to `package.json`
- include it in the frontend gate path

### Task 3. Shell parity harness

- create a reusable Playwright helper for shell-region screenshot parity
- use it first for the root-admin shell versus the page-shell template

### Task 4. Shell seam extraction plan

- define the DS-owned page-shell render/controller exports
- define the approved slot/input contract
- stage the migration of `rootAdminShell`

## Honest Current Classification

As of this blueprint, the current root-admin shell should be described as:

- locally owned current shell
- not yet a governed page-shell consumer
- page-level governed adoption remains partial because the host shell itself is
  still local

That classification should remain in place until the shell gate, shell parity
checks, and shell render migration all agree.
