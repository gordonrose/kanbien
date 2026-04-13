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

Drive a change through the repo's preferred loop by:

1. classifying the change
2. deciding which loop steps are required, recommended, or not needed
3. routing specialist work to the right repo-local skills
4. checking that the loop closed without leaving artifact or verification drift

The goal is to keep the delivery loop consistent without restating every
specialist workflow in this file.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. `docs/architecture/change-control.md`
4. `docs/standards/change-artifact-requirements.md`
5. relevant ADRs, PRDs, and PRD test-case docs
6. current source in `src/`
7. executable tests in `tests/`
8. maintained docs and source-independent artifacts for the scoped area

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

Use this classification together with
`docs/architecture/change-control.md` and
`docs/standards/change-artifact-requirements.md` to decide which loop steps are
required.

### 2. Decide the loop steps

For each step, explicitly mark one of:

- required
- recommended
- not needed

Typical steps:

- PRD creation or refresh
- ADR decision check
- PRD-derived test-case planning
- implementation
- executable verification
- maintained-artifact and docs updates
- standards review
- repo-health review

### 3. Route specialist work

Prefer narrower repo-local skills when they fit the task:

- PRD-derived test cases: `prd-test-case-planner`
- PRD-derived test implementation: `prd-test-case-implementer`
- API contract docs: `api-contract-maintainer`
- docs drift classification: `docs-alignment-auditor`
- standards review: `repo-standards-compliance-auditor`
- repo-health review: `repo-health-auditor`
- data dictionary maintenance: `data-dictionary-maintainer`
- rebuild-readiness docs: `rebuild-readiness-maintainer`
- materially AI-assisted review notes: `ai-change-reviewer`
- implementation blueprint maintenance: `implementation-blueprint-maintainer`

When a narrower skill applies, use it instead of restating its logic here.

### 4. Keep the loop proportional

Do not force the heaviest version of the loop for every change.

Also do not silently skip steps that are required by the current repo process
docs for the change class.

If a step is omitted, say why it was `not needed`.

## Completion Check

Before declaring success, explicitly confirm:

- the required loop steps were completed
- required verification ran or any deferral was stated explicitly
- required maintained artifacts were updated or intentionally left unchanged
  with a concrete reason
- the result is consistent with
  `docs/standards/change-artifact-requirements.md`

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

## Suggested Sequence

Typical order:

1. classify the change
2. decide required, recommended, and not-needed loop steps
3. run PRD and ADR work if required
4. run planning skills if required
5. implement
6. refresh maintained artifacts and source-independent docs as required
7. run standards and repo-health review when the change class requires them

## Decision Rules

### Default to small PRDs

Prefer narrow PRDs with one clear change focus.

Do not bundle unrelated work just because it is nearby.

### Do not silently skip artifacts

If the loop should include a PRD, ADR, test-case doc, runbook, privacy note,
or source-independent doc update, call that out explicitly.

Use `docs/standards/change-artifact-requirements.md` as the canonical artifact
matrix instead of restating it here.

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
- `api-contract-maintainer`
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
- Do not silently skip maintained artifacts required by
  `docs/standards/change-artifact-requirements.md`.
- Do not leave PRDs, test-case docs, and implementation status out of sync.
- Do not skip standards or repo-health review when the change materially affects
  security, privacy, testing architecture, or shared seams.
- Do not replace specialist skills with hand-waved orchestration prose.

## Trigger Phrases

Trigger this skill for prompts like:

- "run the full loop"
- "take this through the proper repo process"
- "formalize this change before implementing it"
- "do the PRD/ADR/test case/implementation flow"
- "now that we agree on scope, implement it consistently"
- "use the full change loop"
