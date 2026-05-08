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
- `--enforce-write-set` turns the write-set report into a blocking gate. The
  normal task runner records the report without failing so pre-edit evidence can
  still be captured in a dirty worktree.

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
- task-type plugin field-level notes
- write-set report, including allowed entries, changed files, forbidden files,
  and ambiguous broad entries
- route-away, stop-condition, and forbidden-work notes
- validation/proof command results or the reason a command was skipped or
  blocked

Run records are evidence of delivery readiness and command execution posture.
They are not themselves proof that product-feature implementation is complete.
Task-type-specific Layer 5 plugins add deeper deterministic field checks while
preserving this generic record shape.

## Closeout Gate

Use:

```sh
npm run layer5:closeout -- --task-breakdown <story-folder-or-task-breakdown.md> --task <Task ID> --pre-edit-record <run-record.md> --run-proofs
```

Closeout is stricter than the pre-edit runner. It requires a pre-edit run
record, reruns task validation, reruns task-type plugin checks, reruns focused
proof commands when requested, and enforces the selected task's allowed write
set against tracked, staged, and untracked files.

Closeout also emits a deterministic result code so the stopping reason can be
handled by automation instead of reconstructed from the log. Current result
codes are:

- `pass`
- `blocked-pre-edit-record`
- `blocked-task-status`
- `blocked-plugin`
- `blocked-write-set`
- `blocked-artifact-obligation`
- `blocked-validation`
- `blocked-proof`

For deterministic harness proof in a dirty worktree, use the explicit fixture
changed-file list:

```sh
npm run layer5:closeout -- --task-breakdown docs/workspace/layer5-task-runs/fixtures/closeout-pass-task-breakdown.md --task T-L5FIX-01 --pre-edit-record docs/workspace/layer5-task-runs/fixtures/closeout-pass-pre-edit-record.md --changed-files-fixture docs/workspace/layer5-task-runs/fixtures/closeout-pass-changed-files.txt --run-proofs
```

`--changed-files-fixture` is for harness proof only. Normal closeout runs omit
that flag and enforce against the real git worktree.

Current scripted ownership:

- `DEV:platform-seam` parses the Platform Seam Contract and Platform Seam Class
  Contract rows, then blocks missing owner/source/proof/compatibility/routing
  fields.
- every `layer4TaskTypes` task type has a registered Layer 5 plugin module
  that parses its owning contract section and fails closed when that contract
  row is missing.
- every task-type plugin has a task-specific semantic red-flag check for at
  least one unsafe or ambiguous contract posture, such as missing API method
  paths, missing permission allow/deny expectations, missing runtime evidence,
  or governance targets outside their owning artifact family.
- write-set enforcement supports exact files and narrow path patterns first.
  Ambiguous broad envelopes fail closed until a broad-rationale parser exists.
- artifact-obligation detection maps selected changed-file families to required
  maintained artifacts or explicit route-away task types. The first covered
  families are feature manifests, API/transport contracts, persistence or
  migrations, frontend/browser evidence, and Layer 5 harness edits. Feature
  manifest changes require both generated dependency graph files plus
  feature-dependency generator/check command evidence. API/route changes are
  split into API contract, OpenAPI, Postman, and permission-mapping
  obligations. Persistence and frontend/browser obligations require
  recognizable proof-command or evidence-shape signals, so a changed artifact
  file alone is not treated as sufficient evidence.

Still human or LLM-owned:

- judging whether the named Product Discovery or architecture authority is
  semantically sufficient
- approving non-trivial compatibility plans or broad write-set rationales
- deciding whether route-away follow-up is the right task split when the script
  can only prove that routing was named

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
