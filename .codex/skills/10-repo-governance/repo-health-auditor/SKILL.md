---
name: repo-health-auditor
description: Use when the user wants a whole-repo health audit after a body of work, especially to find drift, contamination, inconsistency, contradictory decisions, fragile seams, scalability/security/performance/compliance risks, or anything that could make the next iteration unsafe or expensive. Best for prompts like "check the repo for drift", "audit repo health", "look for contradictions", "sanity-check the architecture after this work", or "make sure we're still on solid ground for further iterations."
---

# Repo Health Auditor

Use this skill when the user wants a repo-wide review pass rather than a single
feature change.

The goal is to surface architectural drift, contamination between layers,
contradictory decisions, scalability/security/performance/compliance risks, and
other implementation choices that could make future iteration harder or less
safe.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. current source in `src/`
4. executable tests in `tests/`
5. PRDs, test-case docs, feature docs, OpenAPI, Postman, and README files
6. source-independent docs such as `docs/data-dictionary/`,
   `docs/api-contracts/`, `docs/standards/platform-status/`, and
   build-from-spec guidance when relevant

If implementation and docs disagree, use architecture as the tie-breaker first.

## What This Audit Looks For

Focus on issues that materially affect easy, modular iteration or operational
safety.

Typical categories:

- drift from architecture or ADRs
- platform/feature contamination
- cross-feature coupling through private seams
- contradictions between docs, code, tests, and PRD status artifacts
- missing, stale, or inconsistent build-from-spec artifacts that raise future
  recovery or compliance risk
- fragile or confusing deployment/runtime assumptions
- public API or persistence compatibility risks
- security regressions or convenience-over-security trade-offs that were not
  documented clearly
- performance or scalability risks that are likely to matter soon
- compliance/auditability blind spots when behavior is security-sensitive or
  operationally important

Do not nitpick style unless it creates real architectural or operational risk.

## Where To Look

Start with the files most likely to reveal integration drift:

- `AGENTS.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/priniciples.md`
- `docs/architecture/change-control.md`
- `docs/architecture/recoverability-and-build-from-spec.md`
- relevant ADRs in `docs/architecture/adr/`
- `src/app.ts`
- `src/server.ts`
- `src/routes/v1/index.ts`
- shared seams in `src/lib/`
- relevant feature files in `src/features/*`
- browser/frontend code under `src/frontend/` when present
- helper/runtime scripts under `src/scripts/` or similar
- executable tests in `tests/`
- PRD and PRD test-case docs under `docs/prd/` and `docs/prd/test_cases/`
- feature docs and OpenAPI when public behavior is involved
- `docs/data-dictionary/` and `docs/api-contracts/` when route or persistence
  contract durability is relevant
- `docs/standards/platform-status/` when recent work changed the platform's
  security, privacy, operational, or compliance posture

Load only what is needed for the current audit.

## Workflow

1. Identify the scope.
If the user says "whole repo", begin with platform seams, recent architectural
areas, shared middleware, feature integration boundaries, frontend/runtime
edges, and any recently changed features. If the user names a specific work
area, focus there first and expand outward only as needed.

2. Build the intended architecture picture.
Read the governing architecture docs and ADRs for the affected area.

3. Build the current implementation picture.
Inspect source and relevant executable tests to see what the repo actually
does now.

4. Compare intended architecture to current implementation.
Look for:
- hidden coupling
- layering violations
- compatibility hazards
- confusing or contradictory operator paths
- runtime dependencies that are not fail-fast or not documented
- "phase-one debt" that is still acceptable versus accidental drift that should
  be corrected now
- places where the repo's new documentation standards and artifact model have
  moved forward but the maintenance instructions or produced artifacts have not
- places where `docs/standards/platform-status/` now misstates the actual repo
  baseline after recent architectural work

5. Classify findings by urgency.
Use exactly these buckets:
- `Must Fix Soon`
- `Should Fix Soon`
- `Watchlist / Conscious Debt`

6. For each finding, attach an architecture judgment.
Say one of:
- architecture explicitly supports the implementation
- architecture explicitly supports the finding as drift
- architecture gives direction but does not fully resolve it
- not explicitly addressed in architecture

7. Distinguish real risk from acceptable phase-one debt.
Do not present every compromise as a failure. Call out when something is a
reasonable temporary trade-off, but say what would need to happen before it
becomes a blocker.

8. Pause before editing.
Do not patch code or docs unless the user asks for fixes after reviewing the
findings.

## Review Heuristics

Prioritize findings that threaten:

- modular iteration speed
- architectural replaceability
- stable feature seams
- backwards compatibility
- durable data correctness
- secure operator workflows
- fail-fast startup and deployment clarity
- test/PRD/doc traceability
- rebuild-from-spec readiness
- compliance-oriented artifact credibility
- credibility of the repo's maintained standards-baseline snapshots

Lower priority:

- cosmetic naming differences
- local implementation style choices that do not escape the module boundary
- speculative optimizations without a near-term scaling implication

## Reporting Format

Report findings first, ordered by severity.

Use this structure:

1. `Must Fix Soon`
2. `Should Fix Soon`
3. `Watchlist / Conscious Debt`
4. `Still Aligned`

For each finding:

- include file references
- say what the risk is
- say why it matters for future iteration or safety
- say whether architecture supports the concern

If there are no findings, say that explicitly and mention any residual blind
spots.

## Guardrails

- Do not silently "resolve" architecture contradictions by assuming the code is
  right.
- Do not recommend breaking compatibility without calling it out plainly.
- Do not ignore executable tests when they are the clearest evidence of live
  behavior.
- Do not ignore the repo's newer source-independent artifact layers when they
  are part of the current health picture for a feature or seam.
- Do not ignore stale standards-baseline snapshots when they create false
  confidence about the platform's current posture.
- Prefer concrete findings tied to files over generic advice.
- Keep the review grounded in this repo's current stage; distinguish immediate
  blockers from later productization work.

## Trigger Phrases

Trigger this skill for prompts like:

- "check the repo for drift"
- "audit repo health"
- "look for contamination or inconsistency"
- "sanity-check the architecture after this work"
- "make sure we're still on solid ground for iteration"
- "review for contradictions and risks"
- "scan the repo for architectural debt"
- "highlight areas of drift, contamination, or inconsistency"
