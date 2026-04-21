# Governed App-Page Shared Asset Consumption Contract

## Scope

- Artifact:
  shared app-page design-system asset consumption seam
- Status:
  architectural contract
- Current proof surface:
  `rootAdminShell` `Users` route
- Immediate target surface:
  `rootAdminShell` `web-app-hierarchy` route
- Governing ADR:
  `docs/architecture/adr/0027-use-approved-design-system-shared-asset-entrypoints-for-governed-app-page-adoption.md`
- Broader adoption contract:
  `docs/workspace/design-system/adoption/governed-app-component-adoption-contract.md`

## Purpose

Define the CSS layer of governed app adoption without adding app-page CSS or
depending on accidental route-local design-system files.

This contract remains necessary, but ADR 0028 now makes it only one part of
the full adoption model. Shared CSS does not by itself count as honest
governed adoption.

## Approved Consumption Rule

Governed app pages may consume design-system styling only through approved
shared asset entrypoints published from `/design-system/assets`.

Approved examples:

- `/design-system/assets/list-page-shared.css`
- `/design-system/assets/hierarchy-tree-shared.css`
- `/design-system/assets/form-template-shared.css`

App pages must not:

- add page-local CSS to restyle a governed family
- copy CSS rules out of a design-system route into app code
- rely on design-system family classes in app markup unless an approved shared
  asset entrypoint exists for that family

App pages also must not treat the presence of a shared CSS seam as permission
to duplicate governed markup or interaction logic locally.

## Current Proof

The current proved consumer is:

- `rootAdminShell` `Users`

That route:

- imports `/design-system/assets/list-page-shared.css`
- uses approved list-page markup in the app route
- wires route-specific behavior in JS
- does not require route-specific CSS to recreate the list-page family

This is the baseline CSS prerequisite for future governed app-page adoption,
not the full adoption contract.

## Required Contract For `web-app-hierarchy`

`/root-admin#web-app-hierarchy` should adopt the same seam model, but it needs
multiple approved families:

- `hierarchy-tree`
- `form-template`
- parent-approved child seams such as `icon-grid` and `drawer-select`

The route should therefore become a governed composition of:

- `hierarchy-tree` as the context-nav drawer pattern
- `form-template` as the editable page-settings surface

Honest adoption requires approved shared entrypoints for those families before
the app page can claim governed parity.

## Family Mapping

### Already Proven

- `list-page`
  - shared asset seam exists:
    `/design-system/assets/list-page-shared.css`
  - real app consumer exists:
    `rootAdminShell` `Users`

### Needed Next

- `hierarchy-tree`
  - approved app-consumption seam:
    `/design-system/assets/hierarchy-tree-shared.css`
  - intended consumer:
    `rootAdminShell` `web-app-hierarchy`
  - required host posture:
    context-nav drawer pattern, as already signed off upstream

- `form-template`
  - approved app-consumption seam:
    `/design-system/assets/form-template-shared.css`
  - intended consumer:
    `rootAdminShell` `web-app-hierarchy`
  - required host posture:
    parent page pattern hosting approved field seams without app-page CSS

## Consumer Responsibilities

When a real app page consumes a governed family through a shared asset
entrypoint, the app page may own:

- data wiring
- route-specific copy
- route-specific API calls
- permission-aware visibility or action enablement
- composition of multiple already-approved families

The app page must not own:

- family layout CSS
- wrapper posture that changes the family rhythm
- copied family selectors or tokens
- ad hoc re-implementation of signed-off interaction grammar
- copied family markup or copied ARIA or state semantics presented as governed
  adoption

## Missing Seam Rule

If a required family does not yet expose an approved shared asset entrypoint:

- stop the app page work
- raise the blocker for human intervention
- do not add app-page CSS
- do not unilaterally move the work into a design-system loop

If the family has shared CSS but still lacks a shared render or behavior seam,
follow the broader component-adoption contract and stop rather than copying the
family locally.

## Verification Expectations

For any first consumer using this contract:

- verify the page imports only approved shared asset entrypoints
- verify no app-page CSS was added for that governed family
- verify the rendered app page preserves the signed-off family posture
- add browser coverage that checks for absence of local wrapper or demo-shell
  drift, not only presence of child controls
