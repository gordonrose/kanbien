# ADR 0027: Use Approved Design-System Shared Asset Entrypoints For Governed App-Page Adoption

- Status: Superseded by ADR 0028
- Date: 2026-04-20
- Deciders: Kanbien engineering
- Supersedes: N/A
- Superseded by: ADR 0028

## Context

The repo already has one real proof that a governed app page can consume
design-system presentation without carrying page-local CSS: the root-admin
`Users` route imports the shared list-page stylesheet from:

- `/design-system/assets/list-page-shared.css`

and then composes approved list-page markup in the app page.

That proof matters because the repo now needs the same kind of governed app
adoption for more complex routes such as:

- `/root-admin#web-app-hierarchy`

This route is expected to compose more than one signed-off family:

- `hierarchy-tree`
- `form-template`
- child seams such as `icon-grid` and `drawer-select`

Without an explicit app-consumption contract, future work can drift into one of
two bad patterns:

- app-local CSS added during page builds
- ad hoc page markup that references design-system classes without a governed
  shared asset seam behind them

The repo already forbids adding app-page CSS during governed page builds. The
missing architectural rule is how approved design-system CSS should reach real
app pages in the first place.

This is a shared frontend seam decision, not just a page-local implementation
detail.

## Decision

Adopt this governed app-page consumption model for design-system styling and
runtime assets.

### Approved Consumption Rule

Real app pages may consume design-system presentation only through approved
shared asset entrypoints published from `/design-system/assets`.

Those entrypoints are the only approved CSS contract for governed app-page
adoption.

App pages must not:

- add page-local CSS to recreate a design-system family
- copy CSS rules from a design-system route into an app route
- depend on incidental class names from a design-system page without a governed
  shared asset entrypoint behind them

### Shared Asset Entrypoint Rule

Each governed design-system family that is intended for real-app adoption
should expose an explicit shared asset entrypoint with a stable purpose-driven
name, such as:

- `/design-system/assets/list-page-shared.css`
- `/design-system/assets/hierarchy-tree-shared.css`
- `/design-system/assets/form-template-shared.css`

Related runtime helpers may also be published as governed shared entrypoints
when the family needs JavaScript behavior in real consumers.

The family-specific signoff chain remains upstream in `/design-system`; the
shared asset entrypoint is the approved delivery seam for app adoption.

### App-Page Composition Rule

A governed app page may compose multiple signed-off families, but only when:

- each family has an approved upstream signoff chain
- each family needed by the page has an approved shared asset entrypoint or
  equivalent governed app-consumption seam
- the page uses approved family markup and runtime hooks rather than app-local
  styling

For `/root-admin#web-app-hierarchy`, this means:

- the hierarchy drawer must use the signed-off `hierarchy-tree` pattern in its
  context-nav-drawer posture
- the editable settings surface must use the signed-off `form-template`
  pattern and its approved child seams
- the route is not ready for honest governed adoption until the necessary
  family entrypoints exist

### Current Proof Versus Required Follow-Up

Current proof that the model works:

- `rootAdminShell` `Users` route consuming
  `/design-system/assets/list-page-shared.css`
- design-system-published shared entrypoints now also exist for:
  - `/design-system/assets/hierarchy-tree-shared.css`
  - `/design-system/assets/form-template-shared.css`

Required follow-up before honest governed adoption of
`/root-admin#web-app-hierarchy`:

- decide whether `form-template` child seams stay bundled under the parent
  shared entrypoint or expose separate governed shared assets

### Human Decision Rule For Missing Seams

If an app page needs a governed family that does not yet have an approved
shared asset entrypoint:

- stop the app implementation
- raise the blocker for human intervention
- do not add app-page CSS
- do not unilaterally move the work into a design-system loop

Human review must decide whether to:

- add the missing shared asset seam through the design-system process
- defer the app adoption
- approve an explicit exception

## Consequences

### Positive

- governed app pages gain one explicit and reusable CSS-consumption contract
- the repo gets a clear extension of the already-proven `root users` adoption
  model
- future app routes can adopt signed-off design-system families without
  page-local CSS drift
- multi-family compositions such as `hierarchy-tree` plus `form-template` can
  be evaluated honestly at the seam level instead of being improvised in page
  code

### Negative

- design-system adoption now requires deliberate entrypoint publishing work
  rather than assuming every signed-off route is automatically app-consumable
- some families may need extra upstream packaging or refactoring before they
  can be adopted into real app routes
- app work may pause more often while waiting for a human decision on missing
  shared seams

### Neutral / Follow-up

- update frontend architecture docs so the current-state map distinguishes
  proven shared app-consumption seams from planned ones
- keep adoption contracts explicit for first consumers such as `root users`
  and future `web-app-hierarchy`
- treat shared asset entrypoint naming as family-owned documentation that
  should remain stable once real app consumers depend on it
