# Front-End Harness Orchestrator Eval

Assume routing has failed until each applicable check passes.

## Required Checks

Pass only if the target UI family is identified or the request is explicitly
for harness maintenance.

Pass only if the selected next layer is named.

Pass only if upstream gates are checked before later-layer work is allowed.

Pass only if an active selected layer is handed off to its own `SKILL.md`
before layer-specific advice, artifacts, edits, or implementation planning.

Pass only if route-derived, screenshot-derived, template-derived,
canonical-derived, source-material-derived, or visible-defect work completes
`../layer-work-preflight.md` before implementation planning.

Pass only if frontend-visible proof work is checked against
`../rendered-proof-requirements.md`.

Pass only if scaffold-only layers stop before real governed work.

Pass only if the response distinguishes routing advice from layer-specific
work.

## Fail Conditions

Fail if the assistant identifies Layer 1, Layer 2, Layer 3, or a future active
layer but continues from memory instead of using that layer's skill.

Fail if the assistant gives token, primitive, pattern, component, demo,
canonical, app-adoption, or parity-test process advice without activating the
owning layer skill when that layer is active.

Fail if the assistant treats a scaffold-only layer as implementation-ready.

Fail if routing names a next layer but does not produce a stop-or-handoff
decision.

Fail if visible source material is used as implementation input without a
decision ledger that names owning layers, existing seams, missing seams, and
allowed actions.

Fail if a rendered proof is treated as evidence while its controls, source
values, dependency chain, scroll owner, proof-only values, or browser evidence
remain unclear.

## Pass Result

Use `orchestrator-pass` only when routing selects the right layer and hands off
to the selected active layer skill or stops for a scaffold-only layer.
