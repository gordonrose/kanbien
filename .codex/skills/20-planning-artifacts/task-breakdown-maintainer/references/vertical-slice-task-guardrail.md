# Vertical Slice Task Guardrail

Use for task type: `vertical-slice`

## Must Preserve

- approved backend and frontend guardrails for the same story
- API/data shape and browser workflow compatibility
- mock-honesty between fixtures and live API or persistence shape
- artifact ledger across contracts, permissions, frontend, tests, and docs

## Approval Evidence

- backend and frontend seams named
- journey proof target
- API/persistence/browser proof commands
- Browser Security Posture evidence copied from Layer 2/3 without invention
- permission-aware rendering proof for allowed, denied, expired, and
  tenant-scoped cross-tenant denial states when sensitive data is rendered
- runtime evidence plan when user-visible
- Frontend Performance Posture row for frontend-facing slices with allowed
  posture and posture-matched proof; `unknown-blocked` blocks queueing
- if the slice includes first-consumer frontend adoption of a signed-off
  design-system seam, carry the same adoption contract fields required for a
  frontend task or split adoption into a separate frontend task
- artifact obligations carried from the story

## Deep Delivery Standard

- use a vertical-slice task only when backend and frontend proof are
  inseparable for one journey behavior
- queued vertical slices must fill the Vertical Slice Coupling row with one
  journey behavior, backend seam, frontend seam, API/data contract, browser
  proof, and explicit split rejection rationale
- split backend persistence/API work from frontend render or interaction work
  when they can be proven independently
- name one journey proof story and the exact API/data/browser evidence needed
- when the slice is frontend-facing, name the primary frontend/design-system
  sub-standard and provide the matching proof: contract/fixture/live-payload,
  canonical screenshot/evidence artifact, exact interaction scenario,
  role/name/state/focus semantics, or evidence artifact names plus sweep scope
- classify Frontend Performance Posture for the frontend-facing journey and
  provide posture-matched proof without turning the vertical slice into a broad
  frontend sweep
- do not use vertical-slice as a shortcut for copying design-system markup,
  controller behavior, ARIA/state semantics, or CSS into app code
- do not use vertical-slice as a shortcut around separate design-system,
  permission, migration, or evidence tasks

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
