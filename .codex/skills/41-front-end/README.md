# Front-End Harness Skills

This folder is the planned home for the smaller front-end harness skills.

The harness is organized as a gated chain:

1. Behavior rule
2. Token
3. Primitive
4. Pattern plus contract
5. Component seam
6. Demo page
7. Canonical scenarios
8. First app adoption
9. Adoption/parity test
10. Artifact/index update

Each layer folder has a `README.md` that defines:

- what the layer is for
- what input the layer requires
- what output the layer should produce
- how the output should be evaluated for a high chance of no rework

Active layer `SKILL.md`, template, and eval files should stay small and layer-local.

The intended operating model is:

- `00-orchestrator` routes and gates the work.
- Each numbered layer builds one deterministic output.
- Each layer's eval assumes the output is wrong until proven otherwise.
- The app may consume only the same governed seams that the design-system surface consumes.
- A later layer must not smuggle decisions back into an earlier layer.

## Classify By Decision

Do not classify a request by the UI noun alone.

The same noun can appear in multiple layers. For example, `button` can mean:

| Layer | Decision Being Made |
| --- | --- |
| Token | Button height, padding, radius, text color, or focus-ring values. |
| Primitive | The low-level button affordance: activation, disabled behavior, accessible name, and focus behavior. |
| Pattern | A button group or action area that composes buttons with priority, spacing, overflow, and placement rules. |
| Component seam | The exported `Button` or `ButtonGroup` interface that demos and apps consume. |
| Demo page | The rendered review surface that proves a component seam through honest fixtures, interactions, accessibility, and responsive evidence. |

Use this routing rule:

| Layer | Owns | Routing Question |
| --- | --- | --- |
| Token | Reusable values | What reusable visual, sizing, motion, layout, or state value is needed? |
| Primitive | One low-level affordance | What single UI building block behavior must be consistent? |
| Pattern plus contract | Reusable composition | How do multiple primitives, tokens, data, states, or slots work together for a reusable UI situation? |
| Component seam | Consumption boundary | What do demos and apps import, call, or consume so they do not copy the pattern locally? |

Example: `Menu Trigger` is a primitive. `icon-size`, `target-size`, and
`focus-ring` are tokens it consumes. `Action Menu` is a pattern that composes
the trigger with menu surface and item behavior. `RowActionMenu` is a component
seam if it is the exported interface apps consume.

Layer ask guidance for layers `07` through `10` still lives in
`01-behavior-rule/SKILL.md` until those layers become active. Layers
`02-token`, `03-primitive`, `04-pattern-contract`, `05-component-seam`, and
`06-demo-page` have their own active skills and evals.
