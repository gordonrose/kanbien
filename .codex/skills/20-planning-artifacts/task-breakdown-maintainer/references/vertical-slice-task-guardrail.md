# Vertical Slice Task Guardrail

Use for task type: `DEV:vertical-slice`

## Must Preserve

- approved DEV:backend and DEV:frontend guardrails for the same story
- API/data shape and browser workflow compatibility
- mock-honesty between fixtures and live API or persistence shape
- artifact ledger across contracts, permissions, DEV:frontend, tests, and docs

## Approval Evidence

- explicit signoff that this is an exception to the default split rule:
  backend and frontend should normally split unless one user-visible journey
  behavior has its main proof risk at the backend-to-frontend browser seam
- DEV:backend and DEV:frontend seams named
- journey proof target
- API/persistence/browser proof commands
- Browser Security Posture evidence copied from Layer 2/3 without invention
- permission-aware rendering proof for allowed, denied, expired, and
  tenant-scoped cross-tenant denial states when sensitive data is rendered
- runtime evidence plan when user-visible
- Frontend Performance Posture row for frontend-facing slices with allowed
  posture and posture-matched proof; `unknown-blocked` blocks queueing
- if the slice includes first-consumer DEV:frontend adoption of a signed-off
  GOV:design-system seam, carry the same adoption contract fields required for a
  DEV:frontend task or split adoption into a separate DEV:frontend task
- artifact obligations carried from the story

## Deep Delivery Standard

- default to separate `DEV:backend` and `DEV:frontend` tasks. Use
  `DEV:vertical-slice` only when the main risk is the cross-boundary journey
  proof itself, not because backend and frontend implementation are merely
  related or convenient to group.
- use a DEV:vertical-slice task only when DEV:backend and DEV:frontend proof are
  inseparable for one journey behavior
- queued vertical slices must fill the Vertical Slice Coupling row with one
  journey behavior, DEV:backend seam, DEV:frontend seam, API/data contract, browser
  proof, and explicit split rejection rationale that names the backend-to-frontend
  seam risk: payload/projection compatibility, persistence-to-render behavior,
  permission rendering, browser workflow state, or equivalent runtime coupling
- split DEV:backend persistence/API work from DEV:frontend render or interaction work
  when they can be proven independently
- name one journey proof story and the exact API/data/browser evidence needed
- when the slice is frontend-facing, name the primary DEV:frontend/design-system
  sub-standard and provide the matching proof: contract/fixture/live-payload,
  canonical screenshot/evidence artifact, exact interaction scenario,
  role/name/state/focus semantics, or evidence artifact names plus sweep scope
- classify Frontend Performance Posture for the frontend-facing journey and
  provide posture-matched proof without turning the vertical slice into a broad
  DEV:frontend sweep
- do not use DEV:vertical-slice as a shortcut for copying GOV:design-system markup,
  controller behavior, ARIA/state semantics, or CSS into app code
- do not use DEV:vertical-slice as a shortcut around separate GOV:design-system,
  permission, migration, or evidence tasks

## Split / Route Rules

- If backend behavior can be proven with API, domain, persistence, or contract
  tests before frontend consumption, split it to `DEV:backend`.
- If frontend rendering or interaction can consume an already-approved API or
  projection contract and be proven independently, split it to `DEV:frontend`.
- If the API/data shape is missing or changing as a source-independent contract,
  split that to `DOC:api-contract`.
- If schema/index/live-data transformation is independently meaningful, split
  that to `DEV:migration-persistence`.
- If a governed design-system seam is missing, split it to `GOV:design-system`
  before vertical or frontend app work.
- If the main missing work is executable proof, split it to `TEST:test-only`;
  if the main work is runtime evidence capture or evidence collation, split it
  to `EVIDENCE:qa-evidence`.

## Required Check IDs

- `vertical-inseparable-journey`
- `vertical-backend-seam`
- `vertical-frontend-seam`
- `vertical-api-data-shape`
- `vertical-browser-workflow`
- `vertical-security-evidence`
- `vertical-permission-rendering`
- `vertical-runtime-data-mock-honesty`
- `vertical-mock-honesty`
- `vertical-artifacts`
- `vertical-proof-commands`
