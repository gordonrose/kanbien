# Front-End Harness Orchestrator

## What It Is For

The orchestrator routes front-end harness work through the numbered layer chain.

It owns sequence, prerequisites, stop conditions, and handoff between layer skills.

It does not own the detailed rules for any layer.

It should stay strict, small, and boring.

## Input

The input is a user request for governed front-end design-system work, app adoption of a governed seam, or harness maintenance.

The orchestrator also needs the target UI family name, the requested scope, and any existing upstream artifacts for that family.

If the request starts in the middle of the chain, the orchestrator must identify which earlier gates already exist and which are missing.

## Output

The output is a selected next layer, a list of required upstream artifacts, and a clear stop-or-continue decision.

For material work, the orchestrator should produce a small status note naming the current layer, target family, upstream inputs, expected outputs, and required eval.

It should not produce the layer artifact itself unless the selected layer skill is also being used.

## Evaluation For 99% No-Rework Confidence

Check that the orchestrator did not skip a required upstream gate.

Check that it routed to exactly one next layer unless the user explicitly asked for a scaffold or audit.

Check that it did not embed layer-specific implementation rules that belong in a layer skill.

Check that it stopped when app work would require an unsigned design-system seam.

Check that it protected the rule that app surfaces consume the same seams as the design-system surface.

