---
name: frontend-topology-governor
description: Use when the user wants to define, govern, or audit durable frontend topology for app route families, especially page-versus-journey-state classification, deterministic preview/apply materialization rules, compatibility handling for route moves, and repo-structure ownership boundaries.
---

# Frontend Topology Governor

Use this skill when the task is about durable frontend topology as a governed
product and repo concern rather than only current frontend runtime shape or
page-level UI behavior.

This skill exists to keep durable app topology, compatibility rules, and repo
materialization boundaries coherent over time.

## Purpose

Maintain frontend-topology clarity by:

- distinguishing durable topology from journey-local and UI-local state
- defining which app places belong in the curated topology model
- shaping deterministic preview/apply rules for repo materialization
- checking compatibility consequences of route moves, promotions, and locator
  changes
- keeping repo structure and routing ownership boundaries explicit
- updating architecture docs and ADRs when enduring topology rules change

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/adr/0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md`
3. `docs/architecture/frontend-overview.md`
4. `docs/architecture/system-overview.md`
5. `docs/architecture/priniciples.md`
6. `docs/architecture/change-control.md`
7. relevant ADRs under `docs/architecture/adr/`
8. `docs/standards/change-artifact-requirements.md`
9. current source in `src/frontend/`, `src/app.ts`, `src/routes/`, and
   topology-owning features such as `webAppSurfaceDiscovery` and
   `webAppHierarchyBuilder`
10. feature docs, blueprints, and test artifacts for the scoped topology area

## Use This Skill When

Use this skill for prompts like:

- "define the topology model for app routing"
- "decide whether this should be a page or journey state"
- "govern route generation or materialization"
- "work out compatibility rules for moving pages"
- "design the preview/apply harness for frontend topology"
- "audit route topology drift"
- "set ownership boundaries for generated routing and imports"

Also use this skill when a change affects any of these:

- durable page versus journey-state classification
- path-backed versus hash-backed locator posture
- promotion of a nested state into a durable route contract
- governed repo structure for frontend routing or imports
- preview/apply topology materialization
- compatibility handling for route renames, moves, removals, or locator-model
  changes

Do not use this skill for:

- purely visual design-system iteration
- page-local styling fixes
- current-state frontend runtime mapping with no topology-governance impact
- backend-only work with no app-topology consequence

For current frontend architecture mapping and ADR maintenance tied to browser
runtime shape, use `frontend-architecture-maintainer`.

## Core Questions

When governing frontend topology, answer these questions from source and
approved decisions:

1. Is this a durable product place or only nested journey/local UI state?
2. Which topology class applies:
   - `durable-page`
   - `durable-subroute`
   - `journey-state`
   - `ui-state`
   - `support-only`
3. Does this surface need deep-linking, bookmarking, support entry, analytics,
   permission distinction, or compatibility protection?
4. Is the locator model path-backed, hash-backed, or another explicit approved
   type?
5. Should the change materialize into repo routing or import structure?
6. Does the proposed change remain additive, or is it compatibility-sensitive,
   blocked, or invalid?
7. Which parts of the resulting implementation are governed/generated versus
   hand-authored?

## Default Rules

- Only `durable-page`, `durable-subroute`, and `support-only` belong in the
  curated global topology model by default.
- `journey-state` and `ui-state` remain feature-local by default.
- Do not model every wizard step, branch, tab, panel, or transient posture as
  a page.
- Public and design-system surfaces should remain path-backed by default unless
  an approved exception exists.
- App journeys should prefer path-backed durable entry points, while hash-backed
  addressing remains allowed for intentionally shell-local surfaces.
- Moving from hash-backed to path-backed addressing is a routing-model
  migration, not a normal rename.
- Materialization safety must be implementable as deterministic code rather
  than relying on LLM judgment.

## Promotion Rule

Promote a `journey-state` into a `durable-subroute` only when most of these
are true:

- users benefit from deep-linking or bookmarking it
- support or QA need stable direct entry
- analytics or permissions treat it as a distinct destination
- product language treats it as a named place, not just a step
- the address is likely to survive redesign of the parent journey
- changing it would reasonably require compatibility protection

## Workflow

1. Inspect the current topology shape from source.
   Start with:
   - `src/frontend/`
   - `src/app.ts`
   - `src/routes/`
   - topology-owning discovery/hierarchy features

2. Classify the surfaces.
   Identify durable pages, durable subroutes, journey-state, UI-state, and
   support-only surfaces explicitly.

3. Check locator posture.
   Determine which surfaces are path-backed, hash-backed, or otherwise
   explicitly addressed.

4. Evaluate compatibility risk.
   Classify the proposed change as:
   - additive
   - compatibility-sensitive
   - blocked
   - invalid

5. Define materialization boundaries.
   State clearly:
   - what the curated topology owns
   - what the repo materializer owns
   - what remains hand-authored
   - what drift is allowed versus blocked

6. Update docs and decisions when needed.
   Refresh ADRs, architecture docs, or planning artifacts when the enduring
   topology rules changed.

7. Call out follow-up work.
   Mention when the repo still needs:
   - preview/apply harness work
   - compatibility migrations
   - ownership-boundary enforcement
   - deterministic drift checks

## ADR Decision Rule

Create or update an ADR when the change introduces or changes an enduring
frontend-topology rule, such as:

- a new durable topology category
- a new routing-model rule for app surfaces
- a new preview/apply materialization pattern
- a new compatibility posture for route moves or locator-model changes
- a new ownership rule for generated routing, imports, or repo structure

Do not force a new ADR for local page-state tweaks that stay inside already
approved topology rules.

## Guardrails

- Do not flatten path-backed and hash-backed surfaces into a fake common model
  if they have different compatibility or materialization implications.
- Do not let generated repo structure become silently hand-maintained truth.
- Do not promote nested workflow detail into global topology without a durable
  product reason.
- Do not rely on LLM judgment for safety-critical classification that should be
  deterministic.
- Do not define topology solely from docs; confirm it from code and current
  feature seams.

## Expected Outputs

When this skill is used well, the repo should end up with:

- a clear topology classification for the scoped surfaces
- an explicit compatibility posture for proposed route changes
- a clear statement of generated versus hand-authored ownership boundaries
- updated ADR and architecture docs when enduring rules changed
- a concrete preview/apply or follow-up plan when materialization work is in
  scope
