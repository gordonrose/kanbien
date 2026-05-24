# Front-End Harness Skills

This folder is the planned home for the smaller front-end harness skills.

The harness is organized as a gated chain:

1. Behavior rule
2. Primitive
3. Token
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

Future `SKILL.md`, template, and executable eval files should stay small and layer-local.

The intended operating model is:

- `00-orchestrator` routes and gates the work.
- Each numbered layer builds one deterministic output.
- Each layer's eval assumes the output is wrong until proven otherwise.
- The app may consume only the same governed seams that the design-system surface consumes.
- A later layer must not smuggle decisions back into an earlier layer.

