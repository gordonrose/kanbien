---
name: frontend-architecture-maintainer
description: Use when the user wants to define, refresh, or govern the repo's current frontend architecture, especially by mapping `src/frontend` runtime shape, same-origin browser seams, route families, frontend discovery topology, and the ADR trail for enduring frontend decisions.
---

# Frontend Architecture Maintainer

Use this skill when the task is about the repo's frontend architecture as a
system rather than only a single component or page behavior.

This skill keeps the frontend architecture view current and makes sure enduring
frontend decisions are captured in ADRs instead of remaining implicit in code.

## Purpose

Maintain frontend architecture clarity by:

- defining the current frontend runtime shape from the repo
- refreshing `docs/architecture/frontend-overview.md`
- checking whether `docs/architecture/system-overview.md` should also change
- deciding whether a frontend change requires a new ADR or an ADR refresh
- keeping frontend architecture docs aligned with the actual implementation
- keeping affected feature manifests and generated dependency artifacts aligned
  when frontend-owning features change public seams or cross-feature
  dependencies

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/system-overview.md`
3. `docs/architecture/frontend-overview.md`
4. `docs/architecture/priniciples.md`
5. `docs/architecture/change-control.md`
6. relevant ADRs under `docs/architecture/adr/`
7. `docs/architecture/guides/frontend-implementation-guide.md`
8. `docs/standards/change-artifact-requirements.md`
9. current source in `src/app.ts`, `src/frontend/`, `src/routes/`, and relevant
   scripts
10. feature docs for frontend-topology features such as
    `webAppSurfaceDiscovery` and `webAppHierarchyBuilder`

## Use This Skill When

Use this skill for prompts like:

- "define our frontend architecture"
- "refresh the frontend architecture docs"
- "what is our current browser/runtime shape"
- "make sure frontend architecture decisions are in ADRs"
- "audit frontend architecture drift"
- "we changed the frontend shell/runtime; update the architecture docs"

Also use this skill when a change affects any of these:

- frontend route families
- same-origin browser composition
- browser auth/session posture
- frontend build, copy, or serving posture
- shell-state versus file-route behavior
- frontend discovery or curated frontend-topology seams
- repo rules about frontend ownership boundaries

Current repo posture to preserve unless the task changes it explicitly:

- `rootAdminShell` now uses path-backed canonical suite routes for selected
  durable root-admin destinations
- legacy `#` root-admin URLs remain compatibility aliases during migration and
  should not be described as canonical current-state route truth

Do not use this skill for:

- page-level visual polish with no architectural impact
- purely local CSS/layout fixes
- backend-only feature work with no frontend seam impact

For design-system visual iteration, use
`frontend-design-system-loop-maintainer`.

## Core Questions

When maintaining frontend architecture, answer these questions from source:

1. What frontend route families exist today?
2. How are they mounted into the runtime?
3. How are they built, copied, and served?
4. What routing models do they use?
5. What backend seams do they consume?
6. What browser auth/session model do they depend on?
7. What frontend discovery or topology-management seams exist?
8. Which facts are current-state description versus enduring decision?

## ADR Decision Rule

Create or update an ADR when the frontend change introduces or changes an
enduring pattern, such as:

- a new frontend route family class
- a new browser delivery or deployment posture
- a routing-model change
- a browser auth/session transport change
- a new shared frontend/platform seam
- a new durable frontend discovery, topology, or governance mechanism
- a changed rule about frontend ownership boundaries

Do not force a new ADR for every page-local or styling change.
Use `docs/architecture/change-control.md` as the tie-breaker.

## Workflow

1. Inspect the current frontend runtime from source.
   Start with:
   - `src/app.ts`
   - `src/frontend/`
   - `src/routes/v1/index.ts`
   - `package.json`
   - `src/scripts/copyFrontendAssets.ts`

2. Inspect frontend-topology docs and ADRs.
   Usually:
   - `docs/architecture/frontend-overview.md`
   - `docs/architecture/system-overview.md`
   - `docs/architecture/guides/frontend-implementation-guide.md`
   - ADRs `0013`, `0014`, `0022`, and later frontend ADRs when relevant

3. Classify the change or audit result.
   Use:
   - current-state refresh only
   - enduring frontend decision clarification
   - new frontend architecture decision
   - drift between code and architecture docs

4. Update the current-state docs.
   Refresh `docs/architecture/frontend-overview.md` first.
   Update `system-overview.md` too when platform-shape wording changed.

5. Update ADRs when needed.
   Prefer a new ADR over silently stretching old ADRs beyond their actual
   decision boundary.

6. Update feature manifests and dependency artifacts when needed.
   If frontend-owning features such as `webAppSurfaceDiscovery`,
   `webAppHierarchyBuilder`, or `webAppPageSettings` gained, lost, or changed
   public seams or cross-feature dependencies:
   - update the relevant `feature.manifest.json`
   - regenerate `docs/architecture/generated/feature-dependency-graph.*`

7. Call out follow-up drift.
   Mention if feature docs, helper docs, or script docs also need refresh.

## Guardrails

- Do not define frontend architecture from docs alone; confirm it from source.
- Do not confuse current-state description with enduring design decisions.
- Do not leave a lasting frontend runtime or routing change documented only in
  implementation files.
- Do not treat same-origin composition as permission to mix frontend code into
  backend feature internals.
- Do not skip `frontend-overview.md` when the current frontend shape changed.
- Do not skip ADR review when the frontend seam or browser model changed.
- Do not leave feature manifests or generated dependency artifacts stale when a
  frontend-owning feature changed its declared seams or dependencies.

## Expected Outputs

When this skill is used well, the repo should end up with:

- an up-to-date `docs/architecture/frontend-overview.md`
- any needed `system-overview.md` refresh
- a clear ADR trail for enduring frontend decisions
- a short explanation of what changed in the frontend architecture and why
