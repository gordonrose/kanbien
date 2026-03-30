---
name: docs-alignment-auditor
description: Use when the user wants Codex to compare docs with the repository source of truth, especially under docs/, src/, tests/, routes, and architecture files, and classify drift before editing. Best for prompts like "compare docs to src", "audit docs alignment", "check whether docs match code", or "use architecture as the tie-breaker."
---

# Docs Alignment Auditor

Use this skill when the user wants a repository documentation audit rather than a runtime feature change.

The goal is to compare the current implementation, integration wiring, and executable test-backed behavior against the documentation, then explain drift clearly before making edits.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. current runtime source in `src/`
4. executable test-backed behavior in `tests/`
5. feature docs, README files, OpenAPI, and Postman docs
6. source-independent docs such as `docs/api-contracts/` and
   `docs/data-dictionary/` when they are relevant to the scoped behavior
7. `docs/standards/platform-status/` when the scoped docs touch standards,
   compliance, privacy, security posture, or repo-wide control claims

If code and docs disagree, do not assume code is wrong. First check whether the architecture docs explicitly support one side.

## What To Inspect

Load only the files needed for the current task. Common targets:

- `AGENTS.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/priniciples.md`
- `docs/architecture/change-control.md`
- relevant ADRs in `docs/architecture/adr/`
- `src/routes/v1/index.ts`
- relevant feature files under `src/features/<featureName>/`
- shared seams in `src/lib/` when middleware or platform behavior is involved
- executable tests under `tests/` when they clarify implemented behavior,
  expected edge cases, persistence-backed guarantees, or test-backed workflow
  conventions
- docs under `docs/featureDocs/`
- docs under `docs/api-contracts/` when route or middleware behavior is in
  scope
- docs under `docs/data-dictionary/` when persistence, lifecycle, or
  cross-feature seam behavior is in scope
- docs under `docs/standards/platform-status/` when the task touches standards
  posture, compliance claims, or current-state control summaries
- `docs/swagger/openapi.yaml`
- `docs/postman/`
- feature `README.md` files under `src/features/`

## Workflow

1. Identify the scope.
If the user names a feature, focus on that feature plus any shared seams it uses. If the user asks broadly for `/docs` versus `/src`, start with routing, integration, middleware, feature entry points, and any executable tests that define or constrain expected behavior.

2. Build the implementation picture from source and tests.
Confirm:
- mounted routes
- middleware and rate-limit behavior
- public versus protected endpoints
- feature entry points
- cross-feature seams
- response shapes and notable status codes
- executable test-backed expectations when tests are the clearest repository
  evidence for behavior, edge cases, persistence guarantees, or reporting
  conventions

3. Compare that implementation picture to the docs.
Check:
- feature docs in `docs/featureDocs/`
- source-independent API contract docs in `docs/api-contracts/` when routes,
  auth, middleware, browser session, or response shape are in scope
- source-independent persistence/entity docs in `docs/data-dictionary/` when
  persistence, lifecycle, or cross-feature seams are in scope
- feature `README.md` files
- OpenAPI paths and documented responses
- Postman descriptions, paths, and variables
- PRD-derived test-case docs when the repository now uses them as maintained
  planning or status artifacts
- standards baseline snapshots when the documentation claim includes current
  platform posture rather than only route or entity behavior

4. Classify each mismatch.
Use exactly these buckets:
- `Docs Must Change`
- `Docs Likely Should Change`
- `Needs Product/Behavior Decision`

5. Attach architecture guidance to each finding.
For every mismatch, say one of:
- architecture explicitly supports the code
- architecture explicitly supports the test-backed implementation behavior
- architecture explicitly supports the docs
- architecture gives direction but does not resolve the exact wording/behavior
- not explicitly addressed in architecture

6. Pause before editing.
Do not patch files until the user approves the direction.

## Reporting Format

When reporting findings:

- lead with findings, not summary
- include file references for both the documented claim and the source behavior
- include executable test references too when tests are part of the evidence
- say whether `/docs/architecture` dictates the outcome
- say when the newer build-from-spec artifact docs are the stale surface rather
  than the feature docs or OpenAPI surface
- say when the stale surface is a standards-baseline snapshot under
  `docs/standards/platform-status/`
- say whether the likely fix is docs, code, or a decision

Use short sections in this order:

1. `Docs Must Change`
2. `Docs Likely Should Change`
3. `Needs Product/Behavior Decision`

If no drift is found, say that explicitly and mention any residual blind spots.

## Guardrails

- Do not silently resolve a code-vs-doc disagreement by editing both sides.
- Do not recommend changing code away from architecture-backed behavior just to satisfy stale docs.
- Do not ignore executable tests when they are the strongest evidence of the
  intended or already-verified repository behavior.
- Do not ignore newer source-independent docs such as `docs/api-contracts/` or
  `docs/data-dictionary/` when they are now part of the repo's intended
  documentation stack for the scoped behavior.
- Do not ignore `docs/standards/platform-status/` when the repo now maintains
  current-state standards posture as part of the documentation layer.
- Respect the project default that backwards compatibility is required unless an approved compatibility plan exists.
- If a mismatch touches public API, persistence, migrations, routing conventions, or shared platform behavior, call that out explicitly.
- Prefer source-backed statements over memory. Quote behavior from actual files, not assumptions.

## Trigger Phrases

This skill should trigger for prompts like:

- "compare docs to src"
- "audit docs alignment"
- "make sure docs and code match"
- "make sure docs, code, and tests match"
- "use architecture as the source of truth"
- "check whether `/docs` is aligned with `/src`"
- "check whether `/docs` is aligned with `/src` and `/tests`"
- "before changing anything, tell me the drift"
