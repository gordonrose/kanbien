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
- task size guardrail and split rationale
- decision escalation / stop conditions
- exact starting context
- frontend/design-system sub-standard when relevant
- tight allowed write envelope
- task-specific proof plan
- forbidden assumptions
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

## Harness Refinement Routing

When a real delivery result shows that Task Breakdown missed a risk, classify
the refinement before changing the harness:

- which layer should have caught it
- which file or surface should have caught it
- what the canonical source should be
- which supporting files should reference that source without duplicating it
- which test or fixture proves the refinement

Use the compiler contract registry for allowed values and check IDs, the packet
template for field shape, the validator for enforcement, this workspace README
for packet-location guidance, the maintainer skill for operator workflow, and
task-type references for task-specific interpretation.
