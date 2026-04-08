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

Implementation is not considered complete by this skill until the required
maintained artifact set for the change class has been reviewed and either:

- updated in the same loop, or
- explicitly called out as intentionally unchanged with a concrete reason

This includes not only feature-local docs, but also maintained status,
registry, and prior-planning surfaces whose truth changed because the slice
now exists or materially changed platform posture.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. existing ADRs
4. relevant PRDs and PRD test-case docs
5. current source in `src/`
6. executable tests in `tests/`
7. feature docs, OpenAPI, Postman, README files
8. source-independent build-from-spec artifacts such as `docs/api-contracts/`,
   `docs/data-dictionary/`, capability matrices, and other template-backed
   change artifacts when present

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

Also check `docs/standards/change-artifact-requirements.md` so the loop uses
the repo's current required artifact set for the change class rather than an
older thinner documentation model.

If the change is materially assisted by generative AI, also treat
`docs/standards/AI-ASSISTED-DEVELOPMENT-GATE.md` as an applicable gate even
when the shipped feature has no AI capability.

Also treat `docs/standards/platform-status/` as a maintained standards-baseline
surface. If the change materially improves, weakens, or clarifies the current
platform posture against a gate, the relevant status file should be reviewed
and updated in the same loop.

If the change affects runtime bootstrap, helper tooling, env assumptions, or
interchangeable infrastructure choices, also treat the repo's rebuild-readiness
docs as maintained source-independent surfaces.

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

When the change adds or tightens authz gates on already-protected features,
the test-case plan should also identify affected pre-existing suites that need
review and likely updates, especially:

- `tests/integration/<feature>/`
- `tests/security/<feature>/`
- `tests/audit/<feature>/`

### 5. Implement

When the user wants the code/docs change carried through, use the
repo-local `prd-test-case-implementer` skill when a PRD test-case file exists.

If no PRD test-case file exists but the change is still implementation-ready,
implement directly while preserving traceability and docs updates.

If the change adds or tightens role/capability gates, do not stop at adding
new tests for the new feature alone. Also review and update affected existing
protected-feature integration, security, and audit suites so the repo proves
the new allow/deny boundary instead of only older session-presence behavior.

### 6. Update status artifacts

After implementation, update:

- PRD implementation status if the PRD is used as a living artifact
- PRD test-case status if the repo uses it as a living artifact

Do not leave planned-vs-implemented drift behind.

### 7. Update supporting docs

Check whether the change also requires updates to:

- `docs/featureDocs/`
- `docs/swagger/openapi.yaml`
- `docs/api-contracts/`
- `docs/postman/`
- `docs/testing/`
- `docs/operations/`
- `docs/privacy/`
- `docs/data-dictionary/`
- `docs/standards/platform-status/`
- `docs/workspace/architecture-map/`
- `docs/architecture/build-from-spec-reconstruction-questionnaire.md`
- `docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md`
- capability matrix rows and other build-from-spec artifacts required by
  `docs/standards/change-artifact-requirements.md`
- older PRD, PRD test-case, or blueprint artifacts whose wording became stale
  because the slice moved from planned to implemented
- README, index, or registry surfaces that inventory current docs, entities,
  capabilities, or platform layers

Do not treat these as optional post-implementation cleanup. For route-bearing
or persistence-bearing backend slices, the default expectation is that
implementation should finish with:

- code
- executable tests
- source-independent contract docs
- `docs/swagger/openapi.yaml`
- `docs/postman/` collection updates when collections exist
- affected `docs/featureDocs/`
- affected `docs/data-dictionary/`
- relevant `docs/standards/platform-status/` review
- relevant `docs/workspace/architecture-map/` review when the slice materially
  changes platform-layer status or ordering assumptions

Before considering the loop complete, explicitly sanity-check which of those
surfaces changed and which did not.

Treat this as a required maintained-artifacts sweep, not optional cleanup.
The sweep should explicitly ask:

- did this slice make any older planning artifact say something false, such as
  "does not exist yet" or "not implemented yet"?
- did this slice introduce a new vendor, service, processor, or external
  dependency that changes the truth of a maintained standards snapshot?
- did this slice introduce a new review workflow, provenance artifact, or
  durable control pattern that changes the truth of a maintained process or
  standards snapshot?
- did this slice change any registry or index surface that inventories current
  docs, features, entities, or platform layers?

When the change materially alters protected-route access rules, treat affected
existing test suites as supporting docs/evidence that must stay aligned, not as
optional cleanup for later.

If the change introduces or changes backend routes in a meaningful way, prefer
the repo-local `api-contract-maintainer` skill for the source-independent
contract artifact under `docs/api-contracts/`.

If the change affects docs truthfulness, run the repo-local
`docs-alignment-auditor` skill before or after editing as appropriate.

If the change affects rebuild-from-docs readiness, runtime bootstrap order,
local helper tooling, or interchangeable provider/tool choices, prefer the
repo-local `rebuild-readiness-maintainer` skill for those docs.

When the change affects security posture, privacy posture, operational
readiness, release/recovery posture, or other standards-gated behavior, review
the corresponding file under `docs/standards/platform-status/` and update it if
the repo baseline has changed.

If the implementation changed the truth of a maintained status snapshot but the
headline status level did not change, still refresh the wording when needed so
the snapshot does not lag the repo's actual current state.

When the change is materially AI-assisted, also check whether the supporting
artifacts need:

- an AI-assistance/provenance note
- prompt/data-handling note when relevant
- model/tool/version traceability for high-risk changes
- expert-review note for AI-assisted security or compliance controls

Prefer the repo-local `ai-change-reviewer` skill for creating or refreshing
that durable review note under `docs/workspace/reviews/`.

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
- materially AI-assisted changes with security, persistence, migration, or
  compliance significance

When standards review reveals that the repo's baseline posture has moved,
capture that in the relevant `docs/standards/platform-status/*.md` file instead
of leaving the standards snapshot stale.

When the change is materially AI-assisted, do not treat standards review alone
as sufficient close-out evidence. Also run the repo-local `ai-change-reviewer`
skill so the required provenance and high-risk review note exists in the repo.

### 9. Run repo-health review

If the change materially affects shared seams, introduces new docs/process
artifacts, or could create drift, finish with the repo-local
`repo-health-auditor` skill.

This is the final "did we leave the repo in a healthy state?" pass.

## Completion Check

Before declaring success on a material backend slice, explicitly confirm:

- implementation and tests landed
- OpenAPI and Postman are aligned when routes changed
- feature docs and data dictionary are aligned when feature or persistence
  behavior changed
- standards baseline snapshots were reviewed when security/audit/compliance
  posture changed
- any intentionally deferred artifact updates are named explicitly rather than
  silently omitted

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

Also call out other required build-from-spec artifacts when applicable, such
as:

- API contract docs
- data dictionary updates
- capability matrix rows
- implementation blueprints
- permission mapping artifacts for privileged or authorization-sensitive work
- standards baseline snapshot updates under `docs/standards/platform-status/`
  when the platform posture has materially changed

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

- Do not run the loop using an older thinner artifact set when
  `docs/standards/change-artifact-requirements.md` or newer repo docs require
  additional build-from-spec evidence.
- Do not leave route changes documented only in OpenAPI when a human-readable
  API contract artifact is now part of the intended repo evidence model.
- Do not treat capability matrix rows, implementation blueprints, or permission
  mapping artifacts as optional when the current change class makes them
  required by repo standards.

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
