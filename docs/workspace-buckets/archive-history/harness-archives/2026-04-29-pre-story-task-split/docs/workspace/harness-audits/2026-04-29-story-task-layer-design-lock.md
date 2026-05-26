# Story And Task Layer Design Lock

## Status

- Status: `design-lock-not-implemented`
- Date: 2026-04-29
- Related audit:
  `docs/workspace/harness-audits/2026-04-29-lessons-led-agentic-harness-audit.md`
- Purpose:
  Lock the current design direction for splitting story-level planning from
  task-level delivery isolation before changing the repo harness.
- Current-harness posture:
  This artifact is workspace design evidence. It is not current durable harness
  law until promoted through architecture, standards, templates, and skills.

## Design Decision

The next harness revision should not treat Layer 3 as only low-level task
breakdown.

The harness should introduce two separate control points:

1. Story Breakdown
2. Task Breakdown

Stories are the smallest independently deliverable and verifiable slices of
value.

Tasks are isolated execution units that deliver part of one approved story.

This split responds to prior harness failures where vague implementation units,
wrong-layer proof, artifact drift, and broad opportunistic cleanup were allowed
to enter delivery before value, proof, dependencies, and branch isolation were
clear.

## Proposed Layer Model

The harness should evolve from the current combined breakdown idea into a
seven-layer model:

1. Product Discovery
2. Technical Steering
3. Story Breakdown
4. Task Breakdown
5. Delivery
6. Confirmation
7. Deployment

Story Breakdown and Task Breakdown are separate because they answer different
questions:

- Story Breakdown asks:
  What is the smallest deliverable and verifiable slice of value?
- Task Breakdown asks:
  What isolated implementation, test, artifact, refactor, or standards work is
  needed to deliver one approved story safely?

## Story Breakdown Ownership

Story Breakdown converts approved Technical Steering into a story queue.

It owns:

- epic or steering scope reference
- story queue
- story value classification
- story delivery-shape classification
- job-to-be-done per story
- actor and outcome per story
- acceptance criteria
- dependency and feature-seam mapping
- actor, permission, state, object, value, validation, error, and NFR test
  design inputs
- proof-layer obligations
- capability-matrix mapping posture
- artifact obligations at story level
- refactor-first and architecture-foundation blockers
- story readiness for Task Breakdown

It does not own:

- detailed PRD-derived `TC-*` test-case authoring
- repo-shaped implementation blueprinting
- file-level implementation tasks
- branch, worktree, and bootstrap mechanics beyond identifying story
  isolation needs
- source edits or delivery

## Task Breakdown Ownership

Task Breakdown converts one approved story into isolated delivery tasks.

It owns:

- task queue per story
- task type and scope
- task dependencies
- expected write set
- branch, worktree, and bootstrap strategy
- task-level artifact touch list
- task-level proof obligations inherited from the story
- task handoff into Delivery

It does not own:

- redefining story scope
- changing acceptance criteria
- inventing architecture outside Technical Steering
- creating broad cleanup work unless the cleanup is an approved story or
  refactor-first task
- treating missing capability, PRD, test-case, design-system, or asset
  decisions as implementation details

## Story Value Types

Every story should classify why it exists.

Allowed value types:

- `user-value`
  A slice that changes an end-user, admin, operator, support, or customer
  visible outcome.
- `system-value`
  An enabling platform slice required for safe product delivery, such as a
  durable seam, service boundary, persistence foundation, authz seed, or
  refactor-first foundation.
- `harness-value`
  A planning, verification, artifact, or process-control slice that improves
  delivery safety and traceability.

Acceptance criteria differ by value type:

- `user-value` stories must trace to a user, admin, operator, or system actor
  outcome and require workflow or externally visible proof when applicable.
- `system-value` stories must name the downstream story, feature seam, or
  first consumer they enable and must prove the enabling contract without broad
  unused foundation work.
- `harness-value` stories must produce a named artifact, gate, validation, or
  evidence output and name the downstream stories or tasks they unblock.

## Story Delivery Shapes

Every story should classify what kind of delivery and proof it requires.

Allowed delivery shapes:

- `backend`
- `frontend`
- `vertical-slice`
- `docs-artifact`
- `test-only`
- `refactor-first`
- `architecture-foundation`
- `standards-compliance`

The delivery shape determines default proof families.

- `backend` stories usually require unit, integration, persistence-backed,
  security/authz, audit, contract/API, and migration proof when relevant.
- `frontend` stories usually require rendered browser, accessibility, visual
  state, permission-aware rendering, governed adoption, and served-asset proof
  when relevant.
- `vertical-slice` stories require both backend and frontend proof plus
  journey, API/data shape, browser workflow, mock-honesty, and artifact-sync
  proof.
- `docs-artifact` stories require source-of-truth alignment and template or
  standards completeness proof.
- `test-only` stories require traceability to story acceptance criteria or
  `TC-*` IDs and a wrong-layer-proof check.
- `refactor-first` stories require behavior-preserving regression proof and
  must name the downstream stories they unblock.
- `architecture-foundation` stories require ADR or architecture-doc decisions
  before implementation tasks proceed.
- `standards-compliance` stories require named standard or gate evidence and a
  pass, partial, fail, not-assessed, or not-applicable posture where relevant.

## Capability Matrix Mapping

Capability matrix work should normally occur after stories are understood and
before implementation tasks are finalized.

Default sequence:

1. Technical Steering
2. Story Breakdown
3. Capability Matrix and PRD refinement
4. Task Breakdown
5. Implementation Blueprint and Delivery

For material steered work, Story Breakdown should create a default
`harness-value` control story unless an approved capability matrix already
covers every story acceptance criterion.

Default control story:

- Story ID: `S-000`
- Value type: `harness-value`
- Delivery shape: `docs-artifact`
- Purpose:
  Create or refresh capability matrix rows from the approved stories and their
  acceptance criteria.

Acceptance criteria for the default capability-matrix story:

- every implementation story maps to one or more capability rows
- every story acceptance criterion maps to at least one capability row or an
  explicit non-capability rationale
- each capability row classifies `root`, `tenant`, or explicitly approved
  `shared-cross-tenant` boundary
- permission-sensitive rows name authentication and authorization expectations
- persistence, API, frontend, asset, async, reporting, audit, and compliance
  implications are marked where relevant
- missing architecture-foundation or refactor-first blockers are surfaced
- delivery stories blocked by missing capability rows are not marked
  task-breakdown-ready

Task Breakdown should not mark implementation tasks `queued-for-delivery` when
the relevant capability rows are missing, unless the task is itself a planning
or capability-matrix task.

## Dependency And Feature-Seam Coverage

Story Breakdown must record both dependency directions:

1. dependencies the epic or story needs from existing capabilities or feature
   seams
2. new or changed capabilities and seams that future stories or features may
   depend on

Dependency types should include:

- `pre-existing-capability`
- `new-capability`
- `feature-public-seam`
- `cross-feature-read`
- `authz-capability`
- `persistence-table-or-index`
- `job-queue-or-worker`
- `design-system-seam`
- `frontend-topology-route`
- `asset-consumer-seam`
- `external-provider`

Epic-level test obligations should cover cross-story and cross-feature
composition, including:

- seam contract tests
- integration tests between owning and consuming features
- authz boundary tests
- migration and schema compatibility checks
- feature manifest and generated dependency graph checks when public seams or
  dependencies change
- generated artifact checks when maintained artifacts move

## Epic And Story Test Design

Epic-level tests prove composition:

- stories work together
- required feature seams hold
- provider and consumer contracts remain compatible
- cross-feature and tenant/authz boundaries are preserved

Story-level tests prove the slice:

- a specific actor
- in a specific actor or permission state
- acting on a specific object
- in a specific object state
- with specific value types and validation rules
- receives the expected behavior, evidence, and error handling

Story Breakdown should require a test-input matrix that considers:

- actors
- actor permissions
- actor states
- object states
- value types
- validation rules
- lifecycle transitions
- system errors
- non-functional requirements

NFR coverage should include security, privacy, audit, performance,
accessibility, resilience, compatibility, and operational evidence when
relevant.

Acceptance criteria should map to:

- capability matrix rows
- actor and object states
- proof layers
- required detailed `TC-*` test-case obligations
- integration-test obligations

Detailed `TC-*` test cases remain owned by the existing PRD-derived test-case
planning workflow. Story Breakdown records obligations; it does not replace
the test-case planner.

## Test Design Reference

Create a compact reference guide rather than embedding long testing doctrine in
the Story Breakdown template.

Recommended path:

- `docs/architecture/guides/story-breakdown-test-design-guide.md`

The guide should explain how to define epic and story test obligations,
including dependency maps, actor and object state matrices, value and
validation coverage, NFR coverage, wrong-layer-proof checks, and
acceptance-criteria-to-test-obligation mapping.

The guide should not compete with `.codex/skills/30-testing-and-reconciliation`.

Boundary:

- guide:
  how to reason about epic/story test obligations
- Story Breakdown packet:
  obligation ledger for this epic and its stories
- `prd-test-case-planner`:
  detailed `TC-*` test case authoring
- `prd-test-case-implementer`:
  executable test implementation while preserving traceability

## Stop Conditions

Story Breakdown must stop when:

- a story is too vague to define a job-to-be-done
- acceptance criteria are missing or not verifiable
- story value type or delivery shape is unset
- dependency seams are unnamed
- actor, permission, state, object, value, validation, error, or NFR coverage
  is missing for a story where those dimensions materially affect behavior
- a permission-sensitive story lacks allow and deny coverage obligations
- a lifecycle story lacks object-state and transition coverage obligations
- a new or changed feature seam lacks integration-test obligations
- a story needs capability rows and no approved matrix or matrix-control story
  exists
- a governed frontend story lacks seam readiness classification
- a story would invent architecture outside Technical Steering

Task Breakdown must stop when:

- a task is not mapped to an approved story
- a task changes the story's acceptance criteria
- a task invents architecture outside Technical Steering
- a task performs broad cleanup not represented by a story
- required capability rows are missing for implementation work
- required PRD, design-system, asset, permission, API, data, or test-case
  artifacts are missing and not represented by blocked/control tasks
- expected write set, branch, worktree, or bootstrap strategy is unsafe or
  absent
- proof obligations are indirect, missing, or at the wrong layer for the story

## Required New Artifacts

Recommended additions for implementation:

- `docs/templates/story-breakdown-packet-template.md`
- `docs/templates/task-breakdown-packet-template.md`
- `docs/workspace/story-breakdown/README.md`
- `docs/workspace/task-breakdown/README.md`
- `.codex/skills/20-planning-artifacts/story-breakdown-maintainer/SKILL.md`
- `.codex/skills/20-planning-artifacts/task-breakdown-maintainer/SKILL.md`
- `docs/architecture/guides/story-breakdown-test-design-guide.md`

Recommended later executable checks:

- `npm run story-breakdown:validate`
- `npm run task-breakdown:validate`

## Existing Artifact Relationship

This design should insert new control layers without replacing the existing
artifact chain.

Keep:

- Product Discovery packets
- Technical Steering packets
- PRDs
- capability matrices
- PRD-derived test cases
- implementation blueprints
- API contracts
- data dictionaries
- permission mappings
- design-system governance artifacts
- chat bootstraps
- git workflow guardrails

Change sequencing and routing:

- Story Breakdown happens after Technical Steering.
- Capability matrix and PRD refinement happen after stories are understood and
  before implementation tasks are delivery-ready.
- Task Breakdown happens after story acceptance criteria and capability
  mapping are clear.
- Delivery consumes one queued task at a time.
- Confirmation challenges evidence and completion language.
- Deployment owns release, rollback, monitoring, migration sequencing, and
  promotion readiness.

## Safe Migration Requirements

Before implementing the new layer split, create a safe archive of the current
harness state.

Recommended archive path:

- `docs/workspace/harness-archives/2026-04-29-pre-story-task-split/`

The archive should include copies or snapshots of current harness authorities
and instruction surfaces, including:

- `AGENTS.md`
- `docs/architecture/build-from-spec-change-harness.md`
- `docs/standards/change-artifact-requirements.md`
- `docs/standards/git-workflow-guardrails.md`
- `docs/templates/README.md`
- relevant current templates
- `.codex/skills/README.md`
- important orchestration and planning skills
- this design lock
- the lessons-led harness audit

After implementation, create or complete a reconciliation audit that records:

- which old guidance was retained
- which old guidance was superseded
- which guidance moved
- whether any stop condition was duplicated
- whether existing skills/templates now conflict
- whether the new story/task split reduces vague work and wrong-layer proof

Recommended audit path:

- `docs/workspace/harness-audits/2026-04-29-story-task-split-reconciliation-audit.md`

## Open Decisions

- Whether to call the full model a seven-layer harness or treat Deployment as
  post-confirmation release governance outside the core build loop.
- Whether Technical Steering should receive a formal template before or during
  the Story/Task Breakdown implementation.
- Whether Story Breakdown and Task Breakdown validators should be implemented
  in the first pass or immediately after the templates and skills land.
- Whether the existing `change-loop-orchestrator` should be replaced by a
  seven-layer router or minimally patched to route through Story and Task
  Breakdown first.
