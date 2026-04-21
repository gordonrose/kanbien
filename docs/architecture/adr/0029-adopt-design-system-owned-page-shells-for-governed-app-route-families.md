# ADR 0029: Adopt Design-System-Owned Page Shells For Governed App Route Families

- Status: Accepted
- Date: 2026-04-20
- Deciders: Kanbien engineering
- Supersedes: N/A
- Superseded by: N/A

## Context

ADR 0028 strengthened governed frontend adoption from "shared CSS" to
"design-system-owned styling, render structure, and controller seams."

That rule is still not strong enough to prevent the main failure mode now
visible in the repo.

Current source audit shows that the deeper drift is no longer only inside
individual page families:

- `rootAdminShell` still owns the real authenticated shell HTML and shell CSS
- the live shell posture therefore does not literally match the signed-off
  `/design-system/templates/page-shell` source
- page-level adoption work then happens inside a fake host, so even correct
  child-family reuse can still render differently from the signed-off shell
- repeated parity misses around context-nav, drawers, breadcrumb/search row,
  shell gutters, and page framing are symptoms of local shell ownership, not
  only page-local family drift

This means the repo has been trying to solve a shell-governance problem with
page-level adoption rules.

That posture is too weak.

For governed app route families, the shell itself is a governed artifact.
If the app still owns the shell render structure, shell interaction grammar,
or shell styling locally, then downstream page parity remains structurally
fragile no matter how many child families are shared correctly.

The existing exception posture for login remains useful and intentional:

- login may stay an explicitly approved one-off or pre-signoff exception

But the normal authenticated app shell should no longer be treated as a
consumer-owned host that merely imports governed families.

This is a shared frontend/platform seam decision and therefore needs an ADR.

## Decision

Adopt shell-level governance for governed app route families.

For any governed app route family, the real app shell must consume a
design-system-owned page-shell source of truth rather than locally reauthoring
the shell.

The signed-off source of truth for the current root-admin governed shell is:

- `/design-system/templates/page-shell`

### Governed Shell Rule

For non-exception governed app surfaces, the app must not own locally:

- shell HTML structure
- shell CSS
- shell interaction grammar
- shell accessibility/state semantics

The governed shell includes, at minimum:

- top nav
- mobile nav
- profile/menu shell controls
- sub-nav row with breadcrumb and search shell
- context-nav rail or bottom-nav posture
- shell-attached drawers and related launcher/close grammar
- page-main framing, shell gutters, and shell-attached content posture

### Required Design-System Seams

For a governed shell to be honestly app-consumable, the design system must
publish:

- a shell-owned style seam
- a shell-owned render seam
- a shell-owned controller seam
- an explicit shell slot/input contract for route content and approved shell
  data inputs

### Allowed App Ownership

The real app may still own:

- route registry and route data wiring
- backend/API integration
- permission-aware visibility and action enablement
- page-body content passed through approved shell slots
- explicitly approved exception surfaces such as login

The real app must not own:

- copied page-shell markup from the signed-off route
- copied shell ARIA/state semantics
- copied shell drawer/menu behavior
- app-local shell CSS presented as governed adoption

### Explicit Exception Rule

The current allowed exception posture remains:

- login may remain an explicitly approved exception surface

Any additional exception must be named explicitly.
Urgency, convenience, or partial design-system progress do not create an
implicit exception.

### Enforcement Rule

The repo should prefer live source and runtime enforcement over rich
hand-maintained metadata.

For shell-level governance, the strongest controls are:

- a design-system-owned shell render seam that the real app must mount
- static source audits that inspect app HTML, CSS, and shell JS directly
- consumer-level shell parity checks against the signed-off source route

The frontend gate must eventually fail when a governed shell surface:

- links or imports non-approved app-local shell styles
- renders local shell markup instead of mounting the approved shell render seam
- recreates shell interaction behavior locally
- fails consumer-level shell parity proof against the signed-off source

If the repo needs a machine-readable status artifact during migration, keep it
minimal and status-only. Do not recreate the whole shell contract in a
separate hand-maintained manifest when the same truth can be derived from
source and executable checks.

Until a shell has migrated, it must be described honestly as:

- legacy shell host
- partial governed adoption
- or blocked shell adoption

It must not be presented as completed governed shell adoption.

## Consequences

### Positive

- the repo now governs the actual place where drift is being reintroduced
- page-level governed adoption work can inherit a truthful host instead of a
  local approximation
- frontend gates can fail on shell ownership directly rather than inferring
  drift only from screenshots
- `/design-system` and real app surfaces now have a much clearer source-of-
  truth relationship

### Negative

- current `rootAdminShell` posture now classifies as partial/legacy rather than
  as a fully governed shell
- a real migration is required to move shell structure, styling, and behavior
  behind design-system-owned seams
- harness work must now operate at shell level, not only at page-family level

### Neutral / Follow-up

- create a repo-specific implementation blueprint for shell seam extraction,
  static-gate, and Playwright parity work
- refresh frontend architecture docs so they describe the current root-admin
  shell as locally owned current-state with an accepted migration target
- add live shell-gate rules before declaring shell adoption complete
