# Blog Post Outline

## Working Title

- Making Feature Dependencies First-Class In A Growing AI-Assisted Codebase

## Core Thesis

- As a repo grows from a handful of features into a real catalog, "clean
  architecture" is not enough unless dependencies are explicit,
  machine-checkable, and part of the delivery harness.
- The real win is not just helping humans avoid breaking changes, but helping
  LLM-driven iteration stay safe under parallel work.

## Why This Started Mattering

- The codebase is moving from isolated features toward a network of features
  that depend on each other.
- Multiple chats were effectively acting like multiple engineers in one repo.
- Existing architectural guidance said cross-feature reads should go through
  public seams, but there was no durable, automated system enforcing or
  documenting that consistently.
- The key question became:
  - how do we make breaking-change blast radius legible to both humans and
    LLMs?

## The Problem I Wanted To Solve

- Humans need to know what they might break before they redesign a seam.
- LLMs need a compact source of truth instead of inferring dependency intent
  from scattered imports.
- Parallel work makes implicit coupling much more expensive.
- Architecture rules that live only in prose are easy to forget during active
  implementation.

## The Design Decision

- Treat each feature's `index.ts` as its public cross-feature seam.
- Add a required `feature.manifest.json` per feature.
- Generate a dependency graph from actual imports.
- Validate manifests against the real import graph.
- Make the result part of the repo harness, not just documentation.

## What Got Built

- A checker script that:
  - scans `src/features`
  - identifies cross-feature imports
  - blocks private reach-through
  - validates declared dependencies
  - generates machine-readable and human-readable dependency artifacts
- Per-feature manifests that declare:
  - public seams
  - downstream dependencies
  - breaking-change risk notes
- Generated artifacts under `docs/architecture/generated/`
- ADRs documenting:
  - import-level seam enforcement
  - feature manifests as declared dependency metadata

## The Bigger Realization

- This was not only a code change.
- It needed to become part of:
  - repo policy
  - change-artifact requirements
  - release-gate expectations
  - implementation templates
  - Codex skills
- Otherwise it would remain "a nice checker we added once" instead of a living
  repo habit.

## Multi-Chat / Multi-Engineer Insight

- The repo already had branch-per-task rules, but they needed a concurrency
  layer.
- Multiple chats should be treated like multiple engineers:
  - one scoped branch per chat
  - explicit shared-seam ownership
  - visible blast radius
- The dependency graph/manifests turned out to be useful not just for
  architecture purity, but for collaboration hygiene.

## Interesting Friction Along The Way

- Some private cross-feature reach-through existed in the codebase and had to
  be replaced with proper public seams.
- The checker initially misclassified directory imports until import resolution
  was tightened.
- Generated artifacts needed deterministic output to avoid false failures.
- The work only felt complete once the policy, skills, templates, and gate
  docs all reflected the change.

## Why This Matters For AI-Assisted Development

- LLMs are good at local code changes but can create drift when enduring
  architecture rules are implicit.
- A small manifest plus generated graph gives the model a much better substrate
  for safe iteration.
- The more autonomous the implementation loop becomes, the more important it is
  to make dependency intent explicit.

## Practical Lessons

- Start with import-level enforcement before designing an overly rich metadata
  model.
- Use manifests to capture intent, not everything.
- Make generated architecture artifacts deterministic.
- If you want a new architecture rule to stick, propagate it into:
  - repo policy
  - operational gates
  - planning templates
  - agent skills

## Possible Closing Angle

- This was a small but meaningful step toward making the repo easier to scale
  with both humans and AI.
- The real pattern is broader:
  - if a rule matters, it cannot live in one place
  - it has to exist in code, docs, review flow, and tooling at the same time

## Optional Ending Sections

- "What I'd Do Next"
  - feature scaffolding that creates manifests by default
  - richer seam stability semantics over time
  - PR summaries that automatically show dependency blast radius
- "What Surprised Me"
  - the hardest part was not the script, but making the rule genuinely
    operational
