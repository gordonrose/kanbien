# Design System Task Guardrail

Use for task type: `GOV:design-system`

## Must Preserve

- governed family behavior lock and canonical/reference truth
- render structure, behavior, accessibility, and state semantics as owned seams
- visual verification before app adoption
- no app-local copy of governed markup or controller behavior

## Approval Evidence

- GOV:design-system family and canonical route
- behavior lock or signoff artifact
- screenshot/visual proof command
- Browser Security Posture evidence copied from Layer 2/3 without invention
- runtime data/mock-honesty evidence when the family renders API or projection
  data
- Frontend Performance Posture row with allowed posture and posture-matched
  proof; `unknown-blocked` blocks queueing
- adoption contract or blocker

## Deep Delivery Standard

- split by sub-standard: fixture-data-contract, visual-rendering,
  interaction-behavior, accessibility-semantics, and evidence-sweep
- queued GOV:design-system tasks must produce, refine, or prove a named consumable
  seam for DEV:frontend tasks, not only a local `/design-system` demonstration
- queued GOV:design-system tasks may own design-system family files, canonical
  routes, behavior locks, visual fixtures, and adoption contracts, but they must
  not own real app-page/module implementation; first app consumption belongs to
  a downstream `DEV:frontend` task
- do not queue a full component family, all states, interaction set,
  accessibility semantics, and evidence capture in one task
- visual rendering tasks name the canonical state and expected screenshot or
  browser evidence artifact
- interaction tasks name the state transition, pointer/keyboard behavior, and
  controller seam
- accessibility tasks name the role/name/state/focus semantics under proof
- evidence-sweep tasks should be separate from implementation tasks for complex
  families
- fixture/data tasks name contract, fixture, and live/runtime payload proof;
  evidence-sweep tasks name exact artifact names and sweep scope
- queued tasks classify Frontend Performance Posture as static-low-risk,
  interactive-low-risk, data-list-or-table, route-initialization,
  large-dom-or-canvas, asset-heavy, animation-or-transition-heavy, or
  not-applicable with concrete rationale; posture proof must match the named
  risk without broadening the family task

## Consumable Seam Contract

Design-system tasks are upstream of DEV:frontend implementation tasks. Before a
GOV:design-system task is queued, it must name the seam DEV:frontend tasks will consume:

- render structure seam, such as a shared renderer, component, template, or
  generated route output
- behavior seam, such as a controller, state machine, event contract, or
  documented no-behavior posture
- accessibility seam, including owned role, name, state, focus, and keyboard
  semantics or a documented no-new-semantics posture
- canonical route, behavior lock, screenshot, or evidence artifact proving the
  seam
- DEV:frontend consumption contract that says how app/frontend tasks must import,
  call, mount, or reference the seam
- adoption contract expectations for downstream DEV:frontend tasks, including the
  render, controller/behavior, accessibility, and style/CSS seams that must be
  consumed rather than locally reconstructed

If the GOV:design-system work does not create a consumable seam, mark the task
blocked or split out the missing seam work. Do not satisfy this guardrail with
CSS sharing alone, copied markup, copied controller logic, or an informal visual
match.

## Split / Route Rules

- If a governed app page must consume the seam, create a downstream
  `DEV:frontend` task with a Frontend Adoption Contract. Do not include app-page
  implementation paths in GOV:design-system.
- If the design-system family needs source data, fixture, or live payload
  decisions, split the fixture/data contract from visual, interaction, and
  accessibility work when those decisions are independently meaningful.
- If the family changes standards, architecture authority, or app adoption law,
  split that to `GOV:standards-update` or `GOV:architecture-update`.
- If the main work is screenshots, visual sweep collation, served asset checks,
  or runtime evidence after the seam exists, use `EVIDENCE:qa-evidence`.
- If the family cannot expose a render, behavior, accessibility, or style/CSS
  seam for downstream consumption, keep the task blocked rather than producing
  only a visually similar canonical.

## Required Check IDs

- `design-system-family`
- `design-system-behavior-lock`
- `design-system-consumable-seam`
- `design-system-render-behavior`
- `design-system-visual-proof`
- `design-system-security-evidence`
- `design-system-runtime-data-mock-honesty`
- `design-system-adoption-path`
