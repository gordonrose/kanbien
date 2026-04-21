---
name: frontend-implementation-auditor
description: Use when the user wants a senior frontend architect and engineer review of implemented frontend code, especially to inspect architecture, design-system adoption, route-family boundaries, state topology, UX resilience, accessibility, performance, test coverage, and drift risks across `src/frontend/`, related backend seams, and frontend verification artifacts.
---

# Frontend Implementation Auditor

Use this skill when the user wants an expert review of the frontend
implementation that already exists in the repo.

This skill is for inspecting whether the frontend is architecturally sound,
aligned with repo governance, resilient in the browser, and safe to keep
building on.

## Purpose

Review the implemented frontend like a senior frontend architect and engineer
would:

- inspect the live frontend shape, not only local code style
- look for drift between governed design-system truth and app adoption
- evaluate route-family and ownership boundaries
- assess state-model choices, navigation posture, and topology hygiene
- inspect UX resilience across loading, empty, error, responsive, and edge
  states
- evaluate accessibility, performance, and maintainability risk
- inspect whether verification coverage would catch likely regressions

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/system-overview.md`
3. `docs/architecture/frontend-overview.md`
4. `docs/architecture/priniciples.md`
5. `docs/architecture/change-control.md`
6. relevant ADRs under `docs/architecture/adr/`
7. `docs/standards/change-artifact-requirements.md`
8. current source in `src/frontend/`, `src/app.ts`, and relevant backend seams
9. executable frontend verification in `tests/`
10. source-independent frontend docs and workspace artifacts when relevant

If implementation and docs disagree, use architecture as the tie-breaker first,
then call out the drift explicitly.

## Use This Skill When

Use this skill for prompts like:

- "inspect my frontend implementation"
- "review the frontend like a senior frontend architect"
- "audit the frontend for drift and risks"
- "sanity-check our frontend architecture and implementation"
- "what is weak in this frontend implementation"
- "review our design-system adoption in the app"
- "check whether this frontend will scale cleanly"

Also use this skill when the user wants review of any of these:

- browser route-family boundaries
- same-origin shell composition
- governed design-system adoption in real app surfaces
- frontend state and navigation posture
- component composition and ownership boundaries
- accessibility and responsive resilience
- frontend test honesty and regression coverage

Do not use this skill as the only skill for:

- screenshot-driven design iteration that still needs browser-loop refinement
- frontend architecture doc maintenance as the primary task
- implementation of PRD-derived tests as the main task

For those, pair or switch to:

- `frontend-design-system-loop-maintainer`
- `frontend-architecture-maintainer`
- `prd-test-case-implementer`

## Core Questions

During the review, answer these questions from source:

1. Does the implemented frontend follow the repo's intended route-family and
   ownership boundaries?
2. Is the real app consuming governed design-system assets honestly, or has it
   drifted into app-local reimplementation?
3. Is durable topology being kept separate from journey-local and UI-local
   state?
4. Do components have clear responsibilities and understandable composition
   seams?
5. Are loading, empty, error, denied, and degraded states designed
   deliberately?
6. Will the current implementation remain accessible, responsive, and stable as
   the feature grows?
7. Are the frontend-to-backend contracts being used safely and honestly?
8. Would the existing tests catch the kinds of regressions a human would care
   about?

## What To Inspect

Focus on implementation quality that affects future iteration speed, user
experience, or governance credibility.

### 1. Architecture And Boundaries

Inspect:

- route-family boundaries under `src/frontend/`
- app shell versus page/controller ownership
- frontend versus backend seam discipline
- shared primitive versus app-local implementation drift
- topology or discovery seams when the surface affects governed navigation

Look for:

- copied design-system behavior in app code
- browser code reaching into backend internals
- unclear ownership between shell, page, and helper modules
- route/state patterns that conflict with the repo's current frontend model

### 2. Design-System Adoption

Inspect:

- whether governed app UI consumes signed-off design-system entrypoints
- whether outer page framing matches the governed source of truth
- whether app-local CSS quietly overrides governed posture
- whether adoption artifacts and verification still describe reality

Look for:

- incidental class reuse instead of approved shared entrypoints
- spacing, framing, interaction, or layout drift
- app-local exceptions that were never approved explicitly

### 3. State And Topology Hygiene

Inspect:

- hash, path, or local state ownership
- durable place versus transient journey-state separation
- replay, filter, and search state handling
- permission-aware rendering and denied-state posture

Look for:

- workflow steps promoted into durable topology without approval
- sensitive or unstable state leaking into URLs
- mutable request-body context standing in for durable route or session context

### 4. Component And Module Composition

Inspect:

- responsibility split between rendering, orchestration, and data fetching
- prop and event contracts
- module naming and cohesion
- reuse boundaries for controllers, templates, and shared helpers

Look for:

- large multipurpose modules with mixed concerns
- duplicated behavior across pages
- brittle abstractions that hide important behavior

### 5. Browser UX Resilience

Inspect:

- loading, empty, error, and retry behavior
- focus handling and keyboard flows
- mobile and constrained-width behavior
- overflow, clipping, layering, and scroll posture
- copy clarity where it affects task success

Look for:

- success-state-only design
- controls that disappear, overlap, or become unusable at realistic sizes
- dialogs, drawers, and menus with weak focus or escape behavior

### 6. Accessibility

Inspect:

- landmarks, headings, labels, names, and semantics
- button versus link correctness
- keyboard reachability and visible focus
- dialog/menu semantics
- error messaging and assistive-technology clarity

Look for:

- interaction patterns that only work with a pointer
- missing accessible names
- visually fine but semantically broken structures

### 7. Performance And Rendering Posture

Inspect:

- render/update frequency
- expensive DOM or state work on hot paths
- repeated fetch or bootstrap work
- layout thrash risks from repeated measurement
- bundle or asset-loading posture when relevant

Look for:

- state placed too high in the tree
- unnecessary recomputation or rerender chains
- responsive logic driven by brittle thresholds instead of truthful signals

### 8. Verification Quality

Inspect:

- visual and interaction coverage in `tests/`
- responsive, RTL, and accessibility assertions when relevant
- whether tests express user-visible risk rather than only DOM existence
- whether governed surfaces have the expected frontend quality evidence

Look for:

- tests that prove implementation details but not user-visible correctness
- missing coverage for loading, error, denied, or degraded states
- missing regression coverage where the surface is geometry-sensitive

## Workflow

1. Identify the audit scope.
   If the user names a route family, page, or component, start there. If the
   user says "frontend implementation" broadly, start with:
   - `src/frontend/`
   - `src/app.ts`
   - frontend-related tests under `tests/`
   - relevant frontend docs and ADRs

2. Build the intended picture.
   Read the governing architecture and frontend docs for the affected surface.

3. Build the implemented picture.
   Inspect the current frontend code, shared assets, backend seams, and tests.

4. Compare intent to implementation.
   Focus on:
   - architectural drift
   - design-system drift
   - state/topology mistakes
   - UX/accessibility gaps
   - performance hazards
   - weak regression coverage

5. Classify findings by urgency.
   Use exactly these buckets:
   - `Must Fix Soon`
   - `Should Fix Soon`
   - `Watchlist / Conscious Debt`
   - `Still Aligned`

6. Attach a concrete judgment to each finding.
   For each one, say:
   - where it appears
   - what the actual risk is
   - why it matters for future iteration or user safety
   - whether repo architecture explicitly supports the concern

7. Pause before editing.
   Do not patch implementation by default unless the user asked for fixes as
   part of the same request.

## Reporting Format

Report findings first, ordered by severity.

Use this structure:

1. `Must Fix Soon`
2. `Should Fix Soon`
3. `Watchlist / Conscious Debt`
4. `Still Aligned`

For each finding:

- include file references
- describe the user-facing or architectural risk
- tie the concern back to repo frontend rules when possible
- prefer concrete evidence over generic frontend advice

If there are no findings, say that explicitly and mention residual blind spots
such as missing browser verification or unreviewed route families.

## Guardrails

- Do not reduce the review to code style or taste-level preferences.
- Do not treat design-system parity as "close enough" when the rendered result
  is meaningfully different.
- Do not ignore responsive, focus, overflow, and degraded-state behavior just
  because the default desktop path looks fine.
- Do not assume tests are sufficient without checking what they really assert.
- Do not recommend breaking route, topology, or shared-governance seams without
  calling out the compatibility implications plainly.
- Prefer the smallest number of high-signal findings over a long list of minor
  nits.

## Repo-Specific Lenses

Bias this audit toward the repo's current frontend reality:

- same-origin Express-served frontend families
- governed `/design-system` signoff before real-app adoption
- `rootAdminShell` as the active real app surface
- shared asset entrypoint discipline for governed adoption
- hash-based shell state in the current root-admin implementation
- frontend discovery and curated topology seams where relevant

## Trigger Phrases

Trigger this skill for prompts like:

- "inspect my frontend implementation"
- "act like a senior frontend architect"
- "review the frontend for risks"
- "audit this browser implementation"
- "check design-system drift in the app"
- "find weak spots in our frontend implementation"
