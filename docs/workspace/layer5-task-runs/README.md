# Layer 5 Task Runs

This directory stores script-created Layer 5 task run records.

Layer 5 begins from one validated Layer 4 task packet and one selected task ID.
It must not treat a whole story as the delivery unit, and it must not implement
feature work when the task handoff is blocked, draft, superseded, or missing
required blocker/proof context.

## Runner

Use:

```sh
npm run layer5:task -- --task-breakdown <story-folder-or-task-breakdown.md> --task <Task ID>
```

Useful flags:

- `--write-record` writes the run record under this directory.
- `--run-proofs` executes allowlisted focused proof commands from the task
  packet. Without this flag, proof commands are recorded but skipped.
- `--story <story.md>` appends story context to a packet validation command
  only when the packet command does not already include `--story`.
- `--record-root <path>` writes records somewhere other than this directory.

The first generic runner is intentionally conservative. It executes packet
validation commands when they are allowlisted, refuses blocked delivery tasks,
and runs proof commands only when both conditions are true:

- the selected task is `queued-for-delivery` with no remaining blockers
- `--run-proofs` is explicitly provided

## Run Record Contract

Each run record captures:

- selected task ID, parent story, task type, and delivery status
- execution scope, allowed write set, non-goals, shared seams, and handoff notes
- dependencies and blocker rows for the selected task
- proof/command plan and mock-honesty or runtime evidence notes
- task guardrail evidence
- route-away, stop-condition, and forbidden-work notes
- validation/proof command results or the reason a command was skipped or
  blocked

Run records are evidence of delivery readiness and command execution posture.
They are not themselves proof that product-feature implementation is complete.
Task-type-specific Layer 5 plugins may add deeper behavior later, but they
should preserve this generic record shape.

## Script Hardening Rule

Every new Layer 5 script module or task-type plugin must include focused unit
coverage before it is treated as durable harness infrastructure.

Minimum coverage expectations:

- parser changes prove selected-task extraction and blocked/ready
  classification with a small packet fixture
- command-runner changes prove allowlisted, blocked, skipped, and unsafe
  command behavior without relying only on full harness runs
- plugin changes prove pass and blocked outcomes for the task type they own
- run-record changes prove new fields appear in the generated markdown record
- at least one real task packet still passes through `npm run layer5:task`
  after the change

End-to-end Layer 5 task runs are required evidence, but they do not replace
module-level tests for future script behavior.
