# Frontend Task Guardrail

Use for task type: `DEV:frontend`

## Must Preserve

- governed app UI consumes signed-off DEV:design-system render and behavior seams
- no app-page CSS for governed pages
- no copied DEV:design-system markup, ARIA, state behavior, or controller logic
- accessibility, permission-aware rendering, and browser-visible proof
- served asset/runtime evidence when the task changes visible runtime behavior

## Approval Evidence

- signed-off DEV:design-system seam or explicit approved exception
- Frontend Adoption Contract when consuming an existing DEV:design-system seam,
  naming consumed render, controller/behavior, accessibility, and style/CSS
  seams plus app-local composition and adoption proof
- affected route/surface and allowed write set
- accessibility and state proof
- visual/rendered proof command
- Browser Security Posture evidence copied from Layer 2/3 without invention
- permission-aware rendering proof when privileged, tenant, user, role, asset,
  lifecycle, or sensitive data is rendered
- API/projection contract, runtime payload evidence, and mock-honesty statement
  when rendered proof uses fixtures or mocks
- Frontend Performance Posture row with allowed posture and posture-matched
  proof; `unknown-blocked` blocks queueing
- artifact obligations for topology, adoption, or DEV:frontend docs

## Deep Delivery Standard

- queued DEV:frontend tasks must consume a Layer 2/3 DEV:frontend architecture
  classification row by source scope element; Layer 4 must not invent route
  family, product module, journey group, topology, locator, authority, state,
  shell, DEV:design-system prerequisite, materialization, or source placement
- split fixture/data contracts, visual rendering, interaction behavior,
  non-trivial accessibility semantics, and evidence sweep when independently
  meaningful
- queued tasks name one primary sub-standard and the task-specific proof for
  that standard: contract/fixture/live-payload for fixture-data-contract,
  canonical screenshot or evidence artifact for visual-rendering, exact
  state-transition or interaction scenario for interaction-behavior,
  role/name/state/focus proof for accessibility-semantics, and exact artifact
  names plus sweep scope for evidence-sweep
- queued tasks classify Frontend Performance Posture as static-low-risk,
  interactive-low-risk, data-list-or-table, route-initialization,
  large-dom-or-canvas, asset-heavy, animation-or-transition-heavy, or
  not-applicable with concrete rationale; posture proof must match the named
  risk and must not broaden the DEV:frontend task scope
- governed DEV:frontend tasks must name the signed-off DEV:design-system seam they
  consume, including render, behavior, accessibility, canonical, and evidence
  posture; missing seams block DEV:frontend delivery unless an explicit exception is
  approved
- DEV:frontend adoption tasks must keep app-local work to composition and data
  binding; they must explicitly prohibit copied markup, controller behavior,
  ARIA/state semantics, and CSS, and must name the proof route or scenario
- page, module, and journey behavior must use module/journey files rather than
  growing shell entry files such as `rootAdminShell/assets/app.mjs`; shell entry
  files may own bootstrap, session coordination, route resolution, registry, and
  shell composition only
- state ownership must match Layer 2: UI-local and journey-local behavior stays
  local, server-backed snapshots must not become URL authority, and
  `never-serialize` state must not be placed into URLs or replay payloads
- route/topology work must follow the approved locator, compatibility locator,
  topology authority, authority transition posture, and materialization model;
  generated or topology-managed output must use the approved preview/apply or
  materialization seam rather than hand-editing generated truth
- generated-output source placement requires `preview-apply-required`, a named
  preview/apply or materialization seam, and no hand edits unless the task is an
  explicitly approved generated/canonical sweep
- shell-route-registry placement may own only registry or route mounting; page
  or journey behavior belongs in the approved module/journey files
- module-journey-files placement must name the approved product module/journey
  write path, or carry concrete path-unknown rationale when Layer 2 has not
  named the exact path yet
- broad DEV:frontend write envelopes are blocked unless this is an approved audit,
  migration, generated/canonical sweep, or evidence sweep task
- do not combine app adoption, component rendering, interaction behavior, and
  visual proof into one implementation task

## Required Check IDs

- `frontend-architecture-classification`
- `frontend-source-placement`
- `frontend-state-owner`
- `frontend-route-topology`
- `frontend-design-system-seam`
- `frontend-adoption-contract`
- `frontend-no-app-css`
- `frontend-no-copied-behavior`
- `frontend-accessibility-state`
- `frontend-rendered-proof`
- `frontend-security-evidence`
- `frontend-permission-rendering`
- `frontend-runtime-data-mock-honesty`
- `frontend-runtime-evidence`
- `frontend-artifacts`
