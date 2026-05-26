# Story/Task Split Reconciliation Audit

## Status

- Status: `layer-4-2-implementation-updated`
- Date opened: 2026-04-29
- Related design lock:
  `docs/workspace/harness-audits/2026-04-29-story-task-layer-design-lock.md`
- Archive reference:
  `docs/workspace-buckets/archive-history/harness-archives/2026-04-29-pre-story-task-split/`

## Purpose

Track whether the Story Breakdown and Task Breakdown harness changes preserve
the useful parts of the existing harness while reducing vague implementation
work, wrong-layer proof, artifact drift, and expedient shortcutting.

This audit should be completed after the first implementation pass updates the
architecture, standards, templates, skills, and validators.

## Intended Change

Introduce Story Breakdown as the layer that converts approved Technical
Steering into the smallest deliverable and verifiable stories, and Task
Breakdown as the layer that converts approved stories into isolated execution
tasks.

The first implementation pass added Layer 3 Story Breakdown artifacts and
deterministic validation without rewriting the entire harness. The Layer 4
pass adds Task Breakdown as the isolated delivery-task queue between validated
stories and Delivery.

The Layer 4.1 pass adds task-type guardrail routing, `platform-seam` task
support, and code-placement / extraction review so task packets can decide
whether work belongs in a feature, platform seam, `src/lib`, or should stay
behind an owning feature public seam.

The Layer 4.2 pass adds structured guardrail evidence, allowed write-set
classification, and forbidden-work rows so granular implementation drift is
less dependent on prose approval.

The Layer 2 hardening pass adds a Technical Steering packet template and
validator with deterministic signal checks so shared-versus-feature-specific,
platform-seam, API, persistence, permission, governed-frontend, shared-code,
data-dictionary, QA/evidence, and docs-artifact classification happens before
Story Breakdown.

## Reconciliation Checklist

- Existing guidance retained:
  Story Breakdown remains the value-slice layer. Branch/worktree guidance
  remains in git guardrails and branch governance. Implementation blueprints
  remain repo-shaped build plans.
- Existing guidance superseded:
  Older combined "breakdown then build" wording is now superseded where it
  implied Delivery can start directly from Story Breakdown for governed work.
- Existing guidance moved:
  Task-level branch, write-set, proof-command, artifact-obligation, and
  delivery-handoff fields now live in the Task Breakdown template.
- Duplicated stop conditions found:
  No new duplicated long stop-condition lists were added; the Task Breakdown
  template and validator are the canonical Layer 4 field contract.
- Conflicts introduced between live skills/templates/docs:
  No intentional conflicts. The orchestrator, branch governor, blueprint skill,
  template index, standards gate, and harness guide now point to Layer 4.
- Validator coverage for vague stories:
  Story-level vague wording remains covered by `story-breakdown:validate`.
- Validator coverage for vague tasks:
  `task-breakdown:validate` blocks vague delivery wording such as "implement
  feature", "wire up", "clean up", "handle errors", "add tests", "update
  docs", "as needed", and "etc.".
- Validator coverage for task-type guardrails:
  `task-breakdown:validate` requires every task to route to the matching
  task-type reference before Delivery handoff. Task-type guardrail approval is
  now strict: every task has a type, so `not-applicable` is not accepted for
  this router.
- Validator coverage for structured guardrail evidence:
  `task-breakdown:validate` requires every queued task to include the exact
  required check IDs for its task type and blocks unknown, missing, or blocked
  checks.
- Validator coverage for Layer 2 classification:
  `technical-steering:validate` requires deterministic signal checks and blocks
  `yes` triggers that lack a matching architecture classification or approved
  exception.
- Validator coverage for code placement:
  `task-breakdown:validate` requires queued tasks to record approved placement,
  blocks shared-lib extraction without compatibility proof, requires the
  shared-code placement guardrail for shared-lib, stay-put, or extraction
  work, normalizes extraction to `yes | no`, and requires extraction-dependent
  implementation tasks to block queueing on a separate refactor-first or
  platform-seam task.
- Validator coverage for granular implementation envelope:
  `task-breakdown:validate` requires allowed write-set classification and
  forbidden-work rows before tasks can queue.
- Validator coverage for missing proof layers:
  Layer 3 covers story acceptance criteria. Layer 4 covers task-level proof and
  command rows.
- Validator coverage for missing dependency or seam mapping:
  Layer 3 covers story dependencies. Layer 4 covers task dependencies and
  shared seam declarations.
- Validator coverage for architecture invention:
  Layer 3 blocks architecture invention in story handoff. Layer 4 blocks
  proposed architecture invention before Delivery handoff.
- Validator coverage for missing capability-matrix posture:
  Layer 3 covers acceptance-criterion posture. Layer 4 blocks implementation
  tasks with `blocked-missing-row` capability coverage.
- Evidence that Story Breakdown reduces vague delivery work:
  Story Breakdown now feeds Task Breakdown rather than Delivery directly, so
  Delivery receives queued tasks with explicit write sets, proof commands,
  artifacts, branch/bootstrap strategy, and blocker posture.

## Open Risks

- Some older harness prose may still mention implementation blueprinting before
  Task Breakdown for non-steered work. Governed steered work now has explicit
  Layer 3 then Layer 4 routing.
- Story Breakdown could become too large if detailed PRD test-case authoring or
  implementation blueprinting is copied into the template.
- Layer 5 Delivery is intentionally not implemented in this pass.

## Completion Notes

Layer 4 Task Breakdown artifacts added:

- `docs/templates/task-breakdown-packet-template.md`
- `docs/workspace/task-breakdown/README.md`
- `.codex/skills/20-planning-artifacts/task-breakdown-maintainer/SKILL.md`
- `src/scripts/taskBreakdownValidate.ts`
- `tests/unit/taskBreakdown/taskBreakdownValidate.test.ts`
- `npm run task-breakdown:validate`

Layer 4.1 added task-type guardrail references under
`.codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/`.

Layer 4 / 4.1 is discoverable from the harness guide, standards gate, template
index, skill index, orchestrator, branch governor, and implementation blueprint
skill.
