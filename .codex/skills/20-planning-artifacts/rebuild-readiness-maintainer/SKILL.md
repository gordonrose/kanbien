---
name: rebuild-readiness-maintainer
description: Use when the user wants Codex to improve or maintain the repo's rebuild-from-docs readiness, especially by updating the build-from-spec reconstruction questionnaire, platform bootstrap guide, local helper inventory, or related recoverability docs when runtime assumptions, helper scripts, or interchangeable tools change.
---

# Rebuild Readiness Maintainer

Use this skill when a change affects how the repo can be reconstructed or run
from docs without relying on hidden local knowledge.

This includes:

- new interchangeable tools or providers
- new local helper scripts
- new bootstrap order assumptions
- new env or secret-channel requirements
- new runtime dependencies needed to make the app runnable

## Purpose

Keep the rebuild-from-docs layer current by maintaining:

- `docs/architecture/build-from-spec-reconstruction-questionnaire.md`
- `docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md`
- `docs/architecture/guides/test-harness-and-fixture-internals-guide.md`
- `docs/architecture/guides/script-and-helper-behavior-guide.md`
- related recoverability and build-from-spec architecture docs when needed

The goal is to preserve source-independent reconstruction guidance without
storing secrets or overfitting the docs to one local machine.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. `docs/standards/change-artifact-requirements.md`
4. current runtime source in `src/`
5. current helper and harness source in `src/scripts/`, `docs/postman/`, and
   `tests/harness/`
6. relevant PRDs, ADRs, feature docs, and implementation blueprints
7. current env placeholder files such as `.env.example`

## Required Inputs

Read as needed:

- `docs/architecture/system-overview.md`
- `docs/architecture/recoverability-and-build-from-spec.md`
- `docs/architecture/build-from-spec-change-harness.md`
- `docs/architecture/guides/platform-seams-and-bootstrapping.md`
- `docs/architecture/guides/testing-and-verification-guide.md`
- `docs/standards/change-artifact-requirements.md`
- `src/config/env.ts`
- `src/scripts/*`
- `docs/postman/*`
- `tests/harness/*`

## What This Skill Maintains

1. Reconstruction questionnaire

Keep the questionnaire current for:

- interchangeable infrastructure choices
- vendor or provider choices
- env or secret-channel requirements
- repo-fixed versus deployer-local assumptions

Never put live secrets into the questionnaire.

2. Bootstrap and helper guidance

Keep the bootstrap guide current for:

- startup order
- required local dependencies
- migration/bootstrap scripts
- helper daemons or signing helpers
- optional versus required developer tooling

3. Recoverability linkage

When needed, refresh:

- `docs/architecture/README.md`
- `docs/architecture/guides/README.md`
- `docs/architecture/recoverability-and-build-from-spec.md`
- `docs/architecture/build-from-spec-change-harness.md`

so the new rebuild-readiness docs are discoverable and reflected in the
coverage map.

## Workflow

1. Identify the runtime, helper, or interchangeable-tool change.
2. Inspect the current source and docs for bootstrap and reconstruction impact.
3. Update the questionnaire with:
   - tool class
   - selected option
   - env var names or secret-channel expectations
   - no live secret values
4. Update the bootstrap guide with:
   - required startup order
   - helper scripts
   - required versus optional local tooling
5. Update the harness and script guides when:
   - reusable test-harness seams changed
   - script inputs or side effects changed
   - local helper behavior became more important to reconstruction
6. Refresh recoverability or architecture index docs when discoverability has
   changed.
7. Call out any runtime assumptions that are still implicit in source rather
   than documented.

## Guardrails

- Do not store live secrets, API keys, passwords, or private keys in docs.
- Do not mistake one developer's local setup for a permanent repo-wide truth
  without saying so.
- Do not silently omit required helper tooling just because it is local-only.
- Do not treat rebuild-readiness docs as a substitute for ADRs when an
  enduring architecture choice changed.
- Do not ignore test harness bootstrap when the repo's normal verification
  depends on it.
- Do not stop at listing script filenames; document inputs, side effects, and
  whether the helper is required or optional.

## Trigger Phrases

This skill should trigger for prompts like:

- "improve rebuild from docs"
- "document bootstrap"
- "what helpers are required to run this repo"
- "add a reconstruction questionnaire"
- "update the repo's build-from-spec readiness"
- "keep the local helper docs current"
