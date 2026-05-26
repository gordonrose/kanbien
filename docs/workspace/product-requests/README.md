# Product Requests

This directory holds workspace Product Requests.

A Product Request is a thin parent summary for a requested body of work. It
links Product Discovery, Technical Steering, Story Breakdown, Task Breakdown,
Loop Runs, evidence, and PRs without replacing those artifacts.

The Product Request owns the request identity, current lifecycle status,
routing posture, requester-facing summary, priority, approval posture, and
links to downstream artifacts. It does not own the detailed product intent,
architecture decisions, story definitions, task write sets, implementation
proof, or PR review content.

Use `docs/templates/product-request-template.md` when creating a new Product
Request. New requests should use the folder shape by default.

Requests use folders when the work needs a clear end-to-end hierarchy:

```text
docs/workspace/product-requests/<request-slug>/
  request.md
  discovery.md
  steering.md
  epics/
    EPIC-001-<epic-slug>/
      epic.md
      stories/
        S-001-<story-slug>/
          story.md
          task-breakdown.md
          tasks/
            T-S001-01-<task-slug>.md
```

Keep each layer honest: the folder shows containment, but each artifact still
owns its normal decisions and validation gates.

## Ownership Boundary

Product Requests are cover sheets and artifact indexes.

They may summarize:

- target users
- requested change type
- routing layer
- current status
- requester-facing status
- what is waiting next
- whether user action is needed
- links to source-of-truth artifacts

They must not duplicate or replace:

- Product Discovery packet content
- Technical Steering decisions
- Story Breakdown acceptance criteria
- Task Breakdown write sets or proof obligations
- Loop Run internals, scorecards, or event logs
- QA evidence, runtime evidence, PR review, or release evidence

## Lifecycle And Routing

Product Request status should make the current work posture visible without
turning the request into the owner of every downstream artifact.

Useful status language includes:

- intake
- discovery
- blocked on product intent
- ready for steering
- steering
- blocked on steering
- ready for story breakdown
- story breakdown
- ready for task breakdown
- task breakdown
- ready for execution
- executing
- needs approval
- in review
- ready for release
- released
- closed
- cancelled

Routing posture should be a snapshot from Product Discovery or Technical
Steering, not a replacement for either artifact. Use:

- `config-builder`
- `tenant-extension-pr`
- `core-platform-pr`
- `needs-routing-decision`

If routing is `needs-routing-decision`, execution should not start until a
human or Technical Steering decision resolves the route.

## Evidence And Approval

Approvals may attach to the Product Request and may also attach to specific
stories, tasks, Loop Runs, PRs, config changes, or releases.

Evidence should roll up to the Product Request through links and short status
summaries. The Product Request should help a human find the proof, not become
the proof source of truth.

Common evidence links include:

- discovery evidence
- steering decisions
- story acceptance criteria
- task proof obligations
- test evidence
- runtime or browser evidence when user-visible behavior changed
- API, migration, persistence, permission, or security evidence when relevant
- PR review, approval, merge, config apply, or release evidence

## First-Version Boundaries

Product Requests can remain workspace artifacts before any database, API, UI,
or automation exists.

Do not create schema, API, UI, automation, or execution behavior only because a
Product Request exists. Those changes need their own governed Product
Discovery, Technical Steering, Story Breakdown, Task Breakdown, and delivery
handoff.

Do not collapse stories and tasks into the Product Request. Preserve the
Story Breakdown and Task Breakdown split.

Folder requests must include an `## Epic Index` in `request.md`. The index is
the human summary of the request's epics, and the validator checks that every
listed epic exists and every `epics/EPIC-*` folder is listed.

Validate the whole workspace with:

```sh
npm run product-request:validate -- --all
```
