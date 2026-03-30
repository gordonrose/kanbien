---
name: api-contract-maintainer
description: Use when the user wants Codex to create or refresh human-readable API contract documents under docs/api-contracts, especially by reconciling OpenAPI, PRDs, ADRs, feature docs, middleware behavior, and transport code for route families such as rootAuth and rootUsers.
---

# API Contract Maintainer

Use this skill when the user wants durable API contract artifacts created or
updated under `docs/api-contracts/`.

This skill is for artifact maintenance, not drift classification. If the user
primarily wants to compare docs and implementation before editing, use
`docs-alignment-auditor` first.

## Goal

Produce source-independent API contract documents that can support:

- rebuild-from-spec work
- compliance-oriented review
- route-family and capability understanding without reading code first

These docs should capture details that are often split across OpenAPI, PRDs,
middleware, feature docs, and transport code.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. `docs/standards/change-artifact-requirements.md`
4. current runtime source in `src/`
5. executable tests in `tests/` when they clarify real behavior
6. `docs/prd/`
7. `docs/swagger/openapi.yaml`
8. feature docs and feature `README.md` files
9. existing `docs/api-contracts/` artifacts

If sources disagree, do not silently blend them together. Prefer the higher
authority source and call out any meaningful drift in the contract doc notes or
in your response.

## Where To Write

- Primary output folder: `docs/api-contracts/`
- Prefer one document per major route family or tightly related capability
  group.

Typical examples:

- `docs/api-contracts/root-users.md`
- `docs/api-contracts/root-auth-public-login.md`
- `docs/api-contracts/root-auth-protected-session.md`
- `docs/api-contracts/root-auth-browser-session.md`

## What To Inspect

Load only the files needed for the current contract scope. Common inputs:

- `AGENTS.md`
- relevant architecture docs and ADRs
- `docs/standards/change-artifact-requirements.md`
- `docs/swagger/openapi.yaml`
- relevant PRDs under `docs/prd/`
- relevant feature docs under `docs/featureDocs/`
- relevant feature `README.md`
- `docs/standards/platform-status/` when the contract work changes the
  platform's security, privacy, or operational posture summary
- `docs/workspace/implementation-blueprints/` when a maintained blueprint
  exists for the same slice
- `src/routes/v1/index.ts`
- relevant `src/features/<featureName>/transport/router.ts`
- relevant `src/features/<featureName>/contract/*`
- relevant `src/features/<featureName>/domain/service.ts`
- relevant shared middleware under `src/lib/`
- existing executable tests under `tests/` when they clarify status codes,
  edge cases, or integration behavior

Use the template at `docs/templates/api-contract-template.md`.

## Required Contract Coverage

Each maintained contract doc should clearly cover:

- feature and route-family scope
- exact routes in scope
- authentication state and session transport
- authorization boundary and enforcement point
- request params, query, body, and validation rules
- success response shape and status codes
- error payload shape and important error codes
- persistence side effects
- audit side effects
- cross-feature reads and approved seams
- middleware effects such as rate limiting, bearer auth, cookie auth, CSP, or
  public-auth abuse controls
- compatibility or lifecycle notes where behavior is subtle
- traceability to tests or PRD-derived test cases when available

OpenAPI alone is not sufficient when middleware, browser session transport,
generic auth failures, or cross-feature seams materially affect the contract.

## Workflow

1. Identify the contract scope.
Decide whether the artifact should be route-family based or capability-group
based. Prefer the smallest grouping that keeps one coherent auth and middleware
story.

2. Build the implementation picture.
Confirm routes, request validation, auth boundary, middleware, response shape,
side effects, and any cross-feature reads.

3. Reconcile with docs.
Compare the implementation picture to PRDs, architecture docs, OpenAPI, and
existing contract docs. When there is drift, ground the maintained artifact in
the highest-authority current behavior.

4. Write or update the contract doc.
Use concise prose plus structured sections from the template. Make the document
stand on its own.

5. Preserve source independence.
Source references can appear in notes or in your response, but the contract doc
should still be understandable if feature code later disappears.

6. Surface important drift.
If you discover a meaningful mismatch between PRD/OpenAPI/docs and current
behavior, mention it in your response and, when helpful, add a short note in
the contract artifact.

7. Surface wider artifact impact.
If the contract update materially changes the understood platform posture or
implementation plan, call out whether these should also be reviewed:

- `docs/standards/platform-status/*.md`
- `docs/workspace/implementation-blueprints/`
- other build-from-spec artifacts required by
  `docs/standards/change-artifact-requirements.md`

## Writing Guidance

- Prefer exact route paths and method names.
- Spell out whether auth is bearer token, secure cookie, or
  public/unauthenticated.
- Be explicit about whether errors are feature-local errors or shared middleware
  errors.
- Include browser-session details when same-origin shell behavior differs from
  raw API bearer usage.
- Call out cross-feature reads explicitly rather than implying them.
- Do not restate every internal implementation detail if it does not affect the
  contract.
- Keep docs concise, but not so sparse that rebuild/compliance readers must go
  back to code.

## Guardrails

- Do not silently change public behavior to match stale docs.
- Do not treat OpenAPI as the sole source of truth when middleware or browser
  flows add real behavior.
- Do not update an API contract in isolation when the change clearly shifts the
  repo's maintained standards baseline or build plan; surface that impact.
- Do not collapse public login routes and protected session-management routes
  into one doc if they have materially different auth and middleware behavior.
- If a route family includes browser-cookie behavior, document the cookie and
  browser bootstrap/logout semantics explicitly.
- Respect backwards compatibility by default unless the prompt includes an
  approved compatibility plan.

## Trigger Phrases

This skill should trigger for prompts like:

- "create the API contract docs"
- "refresh docs/api-contracts"
- "build source-independent API contracts"
- "document the route contract for rootAuth"
- "turn the OpenAPI and PRD into durable contract docs"
- "create contract docs for the browser session routes"
