# Task Breakdown Workspace

This workspace holds Task Breakdown packet instances.

Task Breakdown is Layer 4 of the change harness. It consumes validated Story
Breakdown packets and turns one approved story, or a small explicitly related
story set, into isolated delivery tasks.

Workspace packets are change-local by default. Do not treat them as reusable
harness law unless promoted to architecture, standards, templates, or skills.

## Expected Inputs

- validated Story Breakdown packet
- one story marked `ready-for-task-breakdown`
- approved capability matrix rows or explicit non-capability rationale
- story-level proof obligations, artifact ledger, dependencies, and blockers

## Expected Outputs

- stable task queue
- parent story and acceptance-criterion coverage
- capability-row coverage
- allowed write set and non-goals per task
- dependencies and shared seams per task
- task-type guardrail approval
- structured guardrail evidence by required check ID
- code placement and extraction review
- allowed write-set classification
- forbidden work
- required artifact obligations and proof commands
- deterministic branch, worktree, and bootstrap strategy
- delivery handoff status for Layer 5

## Validation

Use:

```sh
npm run task-breakdown:validate -- <packet-path> --story <story-packet-path>
```

Do not hand tasks to Delivery while validation is blocked unless the requester
explicitly accepts the named blocker.
