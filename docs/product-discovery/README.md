# Product Discovery

This directory holds durable reusable Layer 1 Product Discovery guidance.

Product Discovery turns raw user requests and post-iteration feedback into a
source-independent packet before Technical Steering, PRD, capability matrix, or
implementation planning begins.

## Contents

- `taxonomy.md`
  Reusable classification language for product discovery. Taxonomy values flag
  questions, likely downstream gates, and reuse paths; they do not decide
  implementation architecture.
- `templates/`
  Reusable product discovery presets. The generic template is the fallback when
  no more specific product template exists.

Product Discovery packet instances and feedback notes live under:

- `docs/workspace/product-discovery/`

## Workspace-To-Durable Promotion

Workspace artifacts are draft, exploratory, or change-local by default.

When a workspace artifact is signed off as reusable guidance, a canonical
source, a feature-family template, a taxonomy, a checklist, or an enduring
process rule, promote it to a durable location before treating it as reusable.

Promotion must record:

- source workspace artifact
- destination durable artifact
- what was promoted
- whether the workspace artifact remains as historical evidence, is archived,
  or is superseded
- links between source and destination
- affected template, README, or index updates
- whether standards, skills, or architecture docs now reference the durable
  artifact

## Draft Fast Path

When a user explicitly asks for a draft Product Discovery packet, draft
discovery packet, discovery pack, or product discovery packet, the assistant
may use the fast path.

Fast path target: 30 seconds or less.

Fast path command:

```sh
npm run product-discovery:draft -- --slug <slug> --title "<title>"
```

The command deterministically reads
`docs/templates/product-discovery-packet-template.md`, creates a packet under
`docs/workspace/product-discovery/`, and prints the created file path.

Draft fast path intentionally skips:

- `npm run git:preflight`
- branch, bootstrap, worktree, and promotion checks
- maintained-artifact sweeps
- broad architecture-doc inspection
- broad repo searches

Draft fast path output must be described as:

> Created as a draft discovery artifact; full repo guardrails and artifact
> sweeps were intentionally skipped.

Do not describe a fast-path draft as validated, governed, complete,
implementation-ready, artifact-complete, or promotion-ready.

Keep validation separate:

```sh
npm run product-discovery:validate -- <packet-path>
```

## Governed Discovery

Use the governed path when a user asks for validated, governed, complete,
implementation-ready, artifact-complete, promotion-ready, or similar Product
Discovery output.

Governed mode uses the normal repo start gates and artifact requirements.

## Standard Lifecycle

1. Start from the user request, feedback note, or prior product artifact.
2. Classify the request with the taxonomy.
3. Use a product template when one fits, otherwise use the generic template.
4. Produce or update a Product Discovery packet using
   `docs/templates/product-discovery-packet-template.md`.
5. Stop if the packet status is not `ready-for-technical-steering`.
6. Hand the packet to Technical Steering when product intent is ready.

## Boundaries

Product Discovery feeds PRDs, capability matrices, Technical Steering, and
implementation blueprints. It does not replace them.

Feedback must not jump directly from user signal to implementation scope. When
feedback changes product intent, update the discovery packet or add a feedback
note first, then revisit Technical Steering and downstream artifacts as needed.
