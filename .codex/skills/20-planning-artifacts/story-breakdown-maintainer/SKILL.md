---
name: story-breakdown-maintainer
description: Use when approved Product Discovery and Technical Steering need to be converted into smallest deliverable and verifiable stories before Task Breakdown or Delivery begins.
---

# Story Breakdown Maintainer

Use this skill to create or update Layer 3 Story Breakdown packets.

Story Breakdown converts approved Technical Steering into the smallest
independently deliverable and verifiable stories. It does not replace
capability matrices, PRDs, PRD-derived test cases, implementation blueprints,
Task Breakdown, or Delivery.

## Inputs

- Product Discovery packet
- Technical Steering packet
- `docs/templates/story-breakdown-packet-template.md`
- `docs/architecture/guides/story-breakdown-test-design-guide.md`
- relevant architecture, ADR, design-system, asset, permission, tenant,
  persistence, standards, and testing guidance named by Technical Steering

## Workflow

1. Validate handoff.
   Confirm the Product Discovery and Technical Steering packets are accepted
   for Story Breakdown. Stop if steering says not to proceed, if architecture
   foundations are missing, or if source-of-truth conflicts would change the
   steering decision.

2. Identify the epic scope.
   Use the steering packet as the epic boundary. Do not broaden scope to
   nearby cleanup or future product ideas.

3. Split into stories.
   Create the smallest independently deliverable and verifiable stories.
   Assign each story:
   - stable story ID
   - value type: `user-value`, `system-value`, or `harness-value`
   - delivery shape
   - job to be done
   - actor or system perspective
   - outcome
   - non-goals

4. Add default control stories.
   For material steered work, include a `harness-value` capability-matrix
   control story unless an approved capability matrix already maps every story
   acceptance criterion.

5. Define acceptance criteria.
   Give every story concrete, verifiable acceptance criteria with stable IDs.
   Do not use vague phrasing such as "implement feature", "wire up", "handle
   errors", "add tests", "update docs", "as needed", or "etc.".

6. Map dependencies and seams.
   Record pre-existing capabilities, new capabilities, feature public seams,
   cross-feature reads, authz capabilities, persistence tables or indexes, job
   queues or workers, design-system seams, frontend routes, asset-consumer
   seams, and external providers.

6A. Preserve steering classifications.
   Copy Layer 2 architecture classification rows into the Steering
   Architecture Classification Snapshot and convert steering risk flags into
   Task-Type Signal Matrix rows. Do not re-decide shared versus feature-local
   posture in Story Breakdown.

7. Record test obligations.
   Use `docs/architecture/guides/story-breakdown-test-design-guide.md` to
   decide actor, permission, state, object, value, validation, lifecycle,
   system-error, and NFR obligations.
   Record obligations for later `TC-*` authoring. Do not write detailed
   PRD-derived test cases in this packet.

8. Build the artifact ledger.
   Name required PRD, capability matrix, API, data, permission, design-system,
   asset, standards, test-case, and other artifact work. Mark whether each
   artifact blocks Task Breakdown.

9. Ask and record follow-up decision questions.
   When blockers or newly discovered granular decisions affect story scope,
   acceptance criteria, feature seams, permissions, lifecycle behavior,
   fallback behavior, proof layers, or Layer 3 completion, add explicit
   questions in the packet. Required questions must be answered before the
   packet can be marked `ready-for-task-breakdown`; otherwise keep the packet
   draft or blocked and record the owner/resolution state.

10. Set story readiness.
   A story can be `ready-for-task-breakdown` only when it has concrete
   acceptance criteria, dependency mapping, capability-matrix posture, proof
   obligations, and no unresolved architecture invention.

11. Validate.
    Run or request:
    `npm run story-breakdown:validate -- <packet-path>`.
    If validation blocks, report the blockers and do not call the packet ready.

## Guardrails

- Do not invent architecture outside Technical Steering.
- Do not create implementation tasks; Task Breakdown owns task isolation.
- Do not replace PRD-derived test-case planning with story-level obligations.
- Do not let broad cleanup enter the story queue unless it is an approved
  `refactor-first` or `architecture-foundation` story.
- Do not mark delivery stories ready when capability rows are missing, unless a
  control story is queued to create or refresh them.
- Do not treat missing design-system render/controller seams as a frontend
  implementation detail.

## Output

Write packets under:

- `docs/workspace/story-breakdown/`

Use:

- `docs/templates/story-breakdown-packet-template.md`
