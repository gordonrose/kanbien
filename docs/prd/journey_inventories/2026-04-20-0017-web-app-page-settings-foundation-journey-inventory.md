# Web App Page Settings Foundation Journey Inventory

## Scope

- Primary PRD:
  [2026-04-20-0017-web-app-page-settings-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-20-0017-web-app-page-settings-foundation.md)
- Primary PRD test cases:
  [2026-04-20-0017-web-app-page-settings-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-20-0017-web-app-page-settings-foundation-test-cases.md)
- Primary capability matrix:
  [2026-04-20-web-app-page-settings-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-20-web-app-page-settings-foundation-capability-matrix-first-draft.csv)
- Related blueprint:
  [2026-04-20-web-app-page-settings-foundation.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-04-20-web-app-page-settings-foundation.md)

## Intent

Define the first reviewed end-to-end journey inventory for the selected-page
settings workflow inside `/root-admin/web-app-hierarchy`.

This inventory exists because the slice is not only a backend foundation.
It is a meaningful privileged operator workflow spanning:

- page selection in the hierarchy workspace
- settings/options load
- form edits
- durable save
- selected-module landing-page updates
- permission-aware denied and validation paths

## QA Coverage Matrix Application

- Change-class classification for this slice:
  - privileged configuration workflow
  - governed real-app operator workflow
  - topology-adjacent durable state change
- Required layers from the matrix:
  - unit
  - integration
  - security
  - audit
  - frontend
  - end-to-end journey
- Release-gate expectation for implemented slice:
  - full `Tier 0` journey pass before production by default
  - truthful denied and validation paths
  - no shell drift from the governed hierarchy workspace posture

## Journey Scope Summary

This inventory covers multi-step workflows for:

- loading and saving selected-page settings
- preserving the self-only context-nav fallback
- setting or clearing a module landing page
- denied and invalid configuration paths in the same workspace

This inventory does not yet claim to cover:

- later label-override workflows
- tenant-facing page-settings editing
- discovery reconciliation UI changes
- materialization-preview/apply changes beyond preserving the workspace labels
- an icon-grid selector flow if that pattern is not yet signed off

## Known-Pitfall Research Summary

Focused pitfalls reviewed for this slice:

- settings edits accidentally mutate topology-owned fields
- empty explicit context-nav selection produces a broken empty nav instead of
  the approved self-only fallback
- module landing page is treated like a settings-owned field and escapes direct
  child validation
- frontend hides controls but direct requests remain insufficiently protected
- the selected-page panel forks the governed hierarchy workspace posture into a
  custom admin page
- catalog choices drift between frontend hardcoded values and backend-approved
  values

## State-Dimension Review Table

| Dimension | Classification | Equivalence Classes | Affects Steps | Required Coverage Level | Reason |
| --- | --- | --- | --- | --- | --- |
| Actor permission posture | behavior-changing | fully authorized; missing settings read; missing settings update; missing module-landing update | load; save; module landing update | pairwise | Changes whether the workflow may progress or must deny. |
| Selected node kind | behavior-changing | page; module | workspace load; save | pairwise | Determines whether `Page Settings` or module landing-page controls are relevant. |
| Existing settings posture | behavior-changing | explicit settings exist; no explicit settings row | load; save | pairwise | Changes whether fallback projection or stored truth is shown. |
| Context-nav posture | behavior-changing | explicit curated targets; no explicit targets | load; save | pairwise | Changes whether explicit membership or self-only fallback is effective. |
| Icon/template selection validity | behavior-changing | approved catalog value; invalid value | save | pairwise | Changes whether save succeeds or returns validation error. |
| Module landing target validity | behavior-changing | direct child; descendant; cross-module; clear/null | module landing update | pairwise | Governs whether topology update is legal. |
| Session validity | behavior-changing | valid; expired or invalid | load; save | pairwise | Governs access to all protected routes in the workflow. |
| Browser layout or panel-open state | non-behavior-changing | panel already open; panel switched into view | load; save | excluded | UI posture matters visually but does not change business outcome. |

## Journey Scenarios

### `JY-WEB-PAGE-SET-001`

- Journey Name:
  authorized operator selects a page, loads current settings, edits them, and
  saves successfully
- Tier:
  `Tier 0`
- Primary Actor:
  `RootUserAdmin`
- Trigger:
  actor selects a page in `/root-admin/web-app-hierarchy` and opens
  `Page Settings`
- Expected Outcome:
  settings/options load truthfully, edits save successfully, reread reflects
  the durable saved values, and topology-owned fields remain unchanged
- Related Test Cases:
  `TC-WEB-PAGE-SET-UNIT-001`,
  `TC-WEB-PAGE-SET-UNIT-002`,
  `TC-WEB-PAGE-SET-UNIT-004`,
  `TC-WEB-PAGE-SET-INT-001`,
  `TC-WEB-PAGE-SET-INT-002`,
  `TC-WEB-PAGE-SET-INT-006`
- Suggested Test Path:
  `tests/e2e/rootAdmin/webAppHierarchy/page-settings-save.test.ts`
- Notes:
  this is the core happy path for the new slice

### `JY-WEB-PAGE-SET-002`

- Journey Name:
  selected page with no explicit rows still presents truthful fallback settings
- Tier:
  `Tier 0`
- Primary Actor:
  `RootUserAdmin`
- Trigger:
  actor selects a page that has no settings row and no explicit context-nav
  target rows
- Expected Outcome:
  the UI shows default icon fallback and effective self-only context-nav rather
  than a broken empty state
- Related Test Cases:
  `TC-WEB-PAGE-SET-UNIT-001`,
  `TC-WEB-PAGE-SET-EDGE-001`,
  `TC-WEB-PAGE-SET-INT-001`
- Suggested Test Path:
  `tests/e2e/rootAdmin/webAppHierarchy/page-settings-fallbacks.test.ts`
- Notes:
  this journey protects the approved fallback semantics

### `JY-WEB-PAGE-SET-003`

- Journey Name:
  authorized operator selects a module and sets a direct child landing page
- Tier:
  `Tier 0`
- Primary Actor:
  `RootUserAdmin`
- Trigger:
  actor selects a module and uses the `Hierarchy` section landing-page control
- Expected Outcome:
  a direct child page may be selected or cleared; invalid targets are not
  accepted
- Related Test Cases:
  `TC-WEB-PAGE-SET-UNIT-006`,
  `TC-WEB-PAGE-SET-INT-004`,
  `TC-WEB-PAGE-SET-INT-007`
- Suggested Test Path:
  `tests/e2e/rootAdmin/webAppHierarchy/module-landing-page.test.ts`
- Notes:
  this is the explicit topology-owned exception inside the same workspace

### `JY-WEB-PAGE-SET-004`

- Journey Name:
  operator without the required capabilities sees truthful denied behavior
- Tier:
  `Tier 1`
- Primary Actor:
  authenticated root user without one or more governing capabilities
- Trigger:
  actor reaches the workspace and attempts direct settings or landing-page
  requests
- Expected Outcome:
  unavailable controls are hidden or disabled in the UI where appropriate, but
  direct requests are still denied by backend enforcement and remain audit
  visible
- Related Test Cases:
  `TC-WEB-PAGE-SET-SEC-001`,
  `TC-WEB-PAGE-SET-SEC-002`,
  `TC-WEB-PAGE-SET-AUD-001`,
  `TC-WEB-PAGE-SET-AUD-002`
- Suggested Test Path:
  `tests/e2e/rootAdmin/webAppHierarchy/page-settings-denied.test.ts`
- Notes:
  this journey protects the privileged boundary for the slice

### `JY-WEB-PAGE-SET-005`

- Journey Name:
  invalid catalog or target selection fails without corrupting durable state
- Tier:
  `Tier 1`
- Primary Actor:
  `RootUserAdmin`
- Trigger:
  actor submits an invalid icon key, invalid template key, duplicate context-nav
  target, or invalid module landing-page target
- Expected Outcome:
  validation fails honestly, prior durable state remains unchanged, and the
  workspace stays oriented on the same selected node
- Related Test Cases:
  `TC-WEB-PAGE-SET-UNIT-003`,
  `TC-WEB-PAGE-SET-UNIT-004`,
  `TC-WEB-PAGE-SET-EDGE-002`,
  `TC-WEB-PAGE-SET-INT-006`,
  `TC-WEB-PAGE-SET-INT-007`
- Suggested Test Path:
  `tests/e2e/rootAdmin/webAppHierarchy/page-settings-validation.test.ts`
- Notes:
  this journey protects configuration integrity and operator orientation
