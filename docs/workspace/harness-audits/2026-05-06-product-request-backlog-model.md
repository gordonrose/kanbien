# Product Request Backlog Model

## Status

- Status: `draft-design-note`
- Date: 2026-05-06
- Related notes:
  - `docs/workspace/harness-audits/2026-05-05-product-discovery-change-routing-extension.md`
  - `docs/workspace/harness-audits/2026-04-29-story-task-layer-design-lock.md`
- Request:
  Define a `Product Request` task type as the durable cover sheet, lifecycle
  tracker, and artifact index for a chat-requested body of work. Product
  Discovery, Technical Steering, stories, tasks, Loop Runs, evidence, and PRs
  should link from it, not be replaced by it.
- Guardrail posture:
  Created as a draft workspace planning note only. It does not create source
  code, database schema, migrations, API contracts, feature manifests,
  generated artifacts, or official backlog templates.

## Purpose

The future chat widget needs a durable work object. A Product Discovery packet
is an artifact that clarifies intent, but it should not be the top-level work
item. The system needs a parent object that gives humans a brief readable
summary, shows current status, and links to the right artifacts as work moves
through discovery, steering, stories, tasks, execution attempts, PRs, previews,
and releases.

That parent object should be called a `Product Request`.

## Product Request Definition

A Product Request is the durable source of truth for a requested body of work's
identity, status, routing posture, and artifact links.

It can be created from:

- in-app chat widget intake
- API intake
- support or operator intake
- internal planning entry
- future IDE or CLI adapter intake

It owns the lifecycle of the request from initial intake through discovery,
steering, stories, tasks, harness execution, review, release, closure, or
cancellation.

It does not replace Product Discovery, Technical Steering, Story Breakdown,
Task Breakdown, implementation blueprints, PRD test cases, Loop Runs, PRs,
or evidence artifacts. It links them together.

## Thin Cover-Sheet Principle

Product Request should stay thin.

It should contain:

- who the target users are
- what type of change is being requested
- which routing layer currently applies
- what the work is trying to accomplish
- current status and requester-facing status
- what is waiting next
- whether user action is needed
- links to the source-of-truth artifacts

It should not duplicate the full contents of Product Discovery, Technical
Steering, Story Breakdown, Task Breakdown, Loop Runs, PRs, or evidence
records.

## Work Hierarchy

```text
Product Request
  -> Chat conversations
  -> Product Discovery Packet(s)
  -> Technical Steering Packet(s)
  -> Story Breakdown
      -> Task Breakdown
          -> Work runs / Loop Runs
          -> Evidence
          -> Pull Requests / Config Changes / Extension PRs
```

The Product Request is the work container and table of contents. The downstream
artifacts are the evidence, decisions, plans, and executions that move it
forward.

## Relationship To Change Routing

Product Discovery fills the Change Routing section before handoff. The Product
Request stores the current routing posture as durable backlog state.

Routing fields on the Product Request should be a snapshot from Product
Discovery, not a replacement for Product Discovery. They should include:

- requested change type
- likely delivery path:
  `config-builder | tenant-extension-pr | core-platform-pr | needs-routing-decision`
- routing confidence
- routing rationale
- approval posture
- routing blockers

The Product Request may begin with an uncertain route. If the route is
`needs-routing-decision`, execution should not start until a human or
Technical Steering decision resolves the route.

## Product Request Fields

Minimum human-facing fields:

- product request ID
- title
- target users
- change type
- routing layer
- what we are trying to accomplish
- original requester
- owning tenant or root/platform context
- source channel: `chat | api | support | operator | ide | cli`
- current status
- requester-facing status
- what is waiting next
- user action needed
- priority
- created at, updated at, closed at

Minimum artifact links:

- chat conversation links
- Product Discovery packet links
- Technical Steering packet links
- Story Breakdown links
- Task Breakdown links
- Work run / Loop Run links
- PR, preview, config change, or extension change links

Future machine-facing fields:

- target repo or extension repo
- target branch or workspace
- tenant dev workspace
- release target
- rollback or reversal posture
- cost, rate, and budget counters
- policy version, harness version, and project profile version
- evidence retention posture

## Status Model

Draft status values:

| Status | Meaning |
| --- | --- |
| `intake` | Request exists but has not entered Product Discovery. |
| `discovery` | Product Discovery is active. |
| `blocked-product-intent` | Product Discovery found unresolved product questions. |
| `ready-for-steering` | Product intent is clear enough for Technical Steering. |
| `steering` | Technical Steering is active. |
| `blocked-steering` | Architecture, routing, compatibility, or policy decision is blocked. |
| `ready-for-story-breakdown` | Steering is complete enough to split stories. |
| `story-breakdown` | Story Breakdown is active. |
| `ready-for-task-breakdown` | At least one story is ready for task planning. |
| `task-breakdown` | Task Breakdown is active. |
| `ready-for-execution` | At least one task is ready for harness execution. |
| `executing` | Harness work is in progress. |
| `needs-approval` | Work is paused for human approval. |
| `in-review` | PR, config change, extension change, or evidence package is under review. |
| `ready-for-release` | Approved work is ready to release or apply. |
| `released` | Work has been released, merged, applied, or otherwise made available. |
| `closed` | Request is complete or intentionally closed without further work. |
| `cancelled` | Request was cancelled before completion. |

Status values should support partial progress. A Product Request can have one
story released while another remains blocked, but the parent request should
show a clear aggregate status and a current active blocker.

## Artifact Ownership

### Product Request Owns

- request identity
- intake source and requester
- current lifecycle status
- routing posture
- priority and approval posture
- current links to downstream artifacts
- aggregate visibility in the chat widget and backlog engine
- decision and approval links

### Product Discovery Packet Owns

- clarified product intent
- conversation summary
- universal coverage and overlays
- change routing rationale
- open product questions
- handoff confidence

### Technical Steering Packet Owns

- architecture classification
- core/platform/extension/config feasibility
- compatibility strategy
- shared seam and policy decisions
- downstream planning obligations

### Stories Own

- smallest independently deliverable and verifiable value slices
- acceptance criteria
- proof obligations
- story-level artifact ledger
- readiness for task breakdown

### Tasks Own

- isolated implementation, test, artifact, refactor, or standards work
- allowed write set
- branch/worktree/bootstrap strategy
- task-level proof obligations
- delivery handoff

### Work Runs / Loop Runs Own

- bounded delivery, planning, audit, verification, or maintenance loop
- loop status and lifecycle
- loop tasks
- events, metrics, scorecards, and improvement actions
- change sets and changed artifacts
- defects, regressions, and rework traceability

Loop Observability is the durable source of truth for Loop Run internals.
Product Request should only link to the relevant Loop Run records and show a
brief human-facing status.

## Chat Widget Visibility

The chat widget should show the Product Request, not only an isolated chat
transcript.

Minimum visible states:

- request title and summary
- current status
- what is waiting next
- requester-visible blockers
- latest Product Discovery packet link or export
- approval request when action is needed
- PR, preview, or release link when available

Human-facing UI should prefer `Work runs`. `Loop Run` is the durable platform
term from the Loop Observability and KPI workstream.

The chat widget should not expose internal-only technical details by default.
Technical artifacts should remain accessible to authorized users through the
backlog/detail view.

## Approval Model

Approvals should attach to the Product Request and may also attach to specific
stories, tasks, Loop Runs, PRs, config changes, or releases.

Default approval posture:

- `config-builder`:
  requester or tenant admin approval when low risk; stronger approval for
  access, billing, public visibility, sensitive data, or compliance impact.
- `tenant-extension-pr`:
  tenant approval plus technical review for extension compatibility, tests, and
  release.
- `core-platform-pr`:
  platform review plus normal repo guardrails, artifact chain, and stronger
  approval for migrations, auth, billing, tenant boundaries, security, or
  breaking-change risk.
- `needs-routing-decision`:
  no execution until the route is resolved.

## Evidence Model

Evidence should roll up from downstream work to the Product Request through
links and short status summaries.

Evidence families:

- discovery evidence
- steering decisions
- story acceptance criteria
- task proof obligations
- Loop Run scorecards, events, metrics, and results
- test evidence
- runtime evidence when user-visible
- browser screenshots or visual evidence when frontend-visible
- API, migration, or persistence evidence when relevant
- PR review, approval, and merge evidence
- config apply or release evidence

The Product Request should show a concise evidence summary while preserving
links to detailed artifacts. It should not become the evidence source of truth.

## First-Version Boundaries

For the first implementation model, keep these boundaries:

- Product Request is a planning/backlog concept, not a replacement for the
  existing artifact chain.
- Product Request is a brief human-readable cover sheet, not a condensed
  Product Discovery packet or Technical Steering packet.
- Product Request may link to files before it becomes a database entity.
- Product Request can start as a workspace artifact before schema/API work.
- Do not build status automation until statuses are validated against real
  Product Discovery and Story/Task Breakdown examples.
- Do not collapse stories and tasks into the Product Request; preserve the
  Layer 3 and Layer 4 split.

## Open Questions

- Should Product Request be modeled as a task type, an entity type, or both?
- Should a Product Request always have exactly one current Product Discovery
  packet, or can multiple competing discovery packets exist before one is
  selected?
- How should a Product Request split when one chat request produces multiple
  independent product requests?
- How should tenant-specific extension PRs and core platform PRs be shown
  together under one request?
- Which statuses are requester-facing versus internal-only?
- Which approvals belong at parent-request level versus story/task/Loop Run
  level?
- What is the first durable storage model: docs-only, database-backed, or both?

## Current References

- Template:
  `docs/templates/product-request-template.md`
- Workspace template seed:
  `docs/workspace/harness-audits/product-request-template.md`
- Current Product Request:
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/request.md`
- First example:
  `docs/workspace/harness-audits/2026-05-06-product-request-example-chat-interface.md`

## Immediate Next Step

Use the current chat-interface Product Request through Story Breakdown and Task
Breakdown before creating schema, API, UI, or automation.

Do not create schema, API, UI, or automation until the cover-sheet shape has
been checked against real Story Breakdown and Task Breakdown links.
