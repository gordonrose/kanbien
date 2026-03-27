---
name: change-loop-orchestrator
description: Use when a user has reached a clear direction and scope for a new feature or architectural change and wants Codex to drive the repo's full delivery loop consistently: PRD, ADR decision check, PRD test cases, implementation, PRD/test-case status updates, docs updates, standards compliance review, and repo health sanity check. Best for prompts like "let's implement this properly", "run the full loop", "take this through the repo process", or "formalize this change before we build it."
---

# Change Loop Orchestrator

Use this skill when the user has already discussed a change enough to settle
direction and scope, and now wants the repo's full implementation loop run in a
consistent, low-drift way.

This skill is the orchestration layer. It does not replace the narrower repo
skills; it decides when to use them and in what order.

## Purpose

Drive a change through the repo's preferred loop:

1. confirm scope and change class
2. write or update the PRD
3. decide whether an ADR is required
4. derive PRD test cases
5. implement the change
6. update PRD/test-case implementation status
7. update docs affected by the change
8. run standards-compliance review where appropriate
9. run repo-health review where appropriate

The goal is to prevent drift, missing artifacts, and partially implemented
design decisions from accumulating over time.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. existing ADRs
4. relevant PRDs and PRD test-case docs
5. current source in `src/`
6. executable tests in `tests/`
7. feature docs, OpenAPI, Postman, README files

## When To Use This Skill

Use this skill when the user says or clearly implies things like:

- "let's implement this properly"
- "take this through the full loop"
- "do the PRD / ADR / test cases / implementation flow"
- "formalize this before building it"
- "now that we agree on direction, implement it consistently"

Do not use this skill for:

- tiny docs-only wording changes
- simple bug fixes fully contained inside one file with no lasting design
  impact
- casual brainstorming where the user is not ready to commit to scope

## Default Loop

### 1. Classify the change

Determine whether the change is:

- feature-local and additive
- a shared seam change
- a new enduring platform rule
- a test/process/tooling change
- a docs-only clarification

This classification determines whether the loop needs:

- PRD only
- PRD + ADR
- PRD + test cases only
- implementation only
- or a reduced loop

### 2. Confirm whether a PRD is needed

Default to a PRD when the change:

- introduces a new feature
- changes user-visible or operator-visible behavior
- changes testing/process conventions in an enduring way
- adds or changes a browser/admin workflow
- affects security, persistence, cleanup, auditability, or compliance posture

If a PRD already exists, update it rather than creating a duplicate.

### 3. Decide whether an ADR is needed

Use `docs/architecture/change-control.md`.

Default to requiring an ADR when the change:

- changes a shared platform seam
- introduces a new lasting pattern
- changes security posture or operational expectations materially
- changes feature integration rules
- changes migration behavior or execution assumptions
- changes testing architecture in an enduring repo-wide way

If no ADR is needed, say why.

### 4. Plan PRD-derived test cases

If the change is governed by a PRD and affects executable behavior, use the
repo-local `prd-test-case-planner` skill.

Expected result:

- a file under `docs/prd/test_cases/`
- stable `TC-*` IDs
- layer recommendations
- security/audit/edge coverage

### 5. Implement

When the user wants the code/docs change carried through, use the
repo-local `prd-test-case-implementer` skill when a PRD test-case file exists.

If no PRD test-case file exists but the change is still implementation-ready,
implement directly while preserving traceability and docs updates.

### 6. Update status artifacts

After implementation, update:

- PRD implementation status if the PRD is used as a living artifact
- PRD test-case status if the repo uses it as a living artifact

Do not leave planned-vs-implemented drift behind.

### 7. Update supporting docs

Check whether the change also requires updates to:

- `docs/featureDocs/`
- `docs/swagger/openapi.yaml`
- `docs/postman/`
- `docs/testing/`
- `docs/operations/`
- `docs/privacy/`
- `docs/data-dictionary/`

If the change affects docs truthfulness, run the repo-local
`docs-alignment-auditor` skill before or after editing as appropriate.

### 8. Run standards review

If the change is material, security-relevant, privacy-relevant, operationally
significant, or otherwise subject to the repo's standards gates, use the
repo-local `repo-standards-compliance-auditor` skill.

This is especially appropriate for:

- authentication/session changes
- browser/admin surface changes
- persistence or audit changes
- testing/cleanup model changes
- external integrations

### 9. Run repo-health review

If the change materially affects shared seams, introduces new docs/process
artifacts, or could create drift, finish with the repo-local
`repo-health-auditor` skill.

This is the final "did we leave the repo in a healthy state?" pass.

## Loop Variants

### Small feature or workflow change

Typical order:

1. PRD
2. ADR check
3. PRD test cases
4. implementation
5. docs updates
6. standards review
7. repo health review

### Small repo-process or testing-architecture change

Typical order:

1. PRD
2. ADR check
3. PRD test cases if executable behavior is involved
4. implementation
5. testing/docs/runbook updates
6. standards review if the change affects safety, auditability, or operations
7. repo health review

### Docs or evidence backfill after implementation

Typical order:

1. inspect drift
2. update PRD / ADR / docs / runbooks
3. standards review if evidence posture changed materially
4. repo health review if the backfill affects architectural clarity

## Decision Rules

### Default to small PRDs

Prefer narrow PRDs with one clear change focus.

Do not bundle unrelated work just because it is nearby.

### Do not silently skip artifacts

If the loop should include a PRD, ADR, test-case doc, runbook, privacy note, or
feature-doc update, call that out explicitly.

### Do not force every step when not needed

This skill formalizes the loop, but it should still stay proportionate.

For each step, say one of:

- required
- recommended
- not needed

### Prefer existing skills for specialist passes

When the narrower repo-local skills fit, use them instead of restating their
logic from scratch:

- `prd-test-case-planner`
- `prd-test-case-implementer`
- `docs-alignment-auditor`
- `repo-standards-compliance-auditor`
- `repo-health-auditor`
- `data-dictionary-maintainer`

## Reporting Format

When first applying this skill, use:

1. `Change Classification`
2. `Required Loop Steps`
3. `Recommended Sequence`
4. `Assumptions`

After work is done, summarize:

1. `Loop Completed`
2. `Artifacts Updated`
3. `Verification`
4. `Residual Debt`

## Guardrails

- Do not treat architecture-affecting changes as implementation-only work.
- Do not jump straight to code when the repo loop clearly needs design and test
  artifacts first.
- Do not create ADRs for tiny local changes that do not alter enduring rules.
- Do not leave PRDs, test-case docs, and implementation status out of sync.
- Do not skip standards or repo-health review when the change materially affects
  security, privacy, testing architecture, or shared seams.

## Trigger Phrases

Trigger this skill for prompts like:

- "run the full loop"
- "take this through the proper repo process"
- "formalize this change before implementing it"
- "do the PRD/ADR/test case/implementation flow"
- "now that we agree on scope, implement it consistently"
- "use the full change loop"
