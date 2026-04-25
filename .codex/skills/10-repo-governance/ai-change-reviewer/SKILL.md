---
name: ai-change-reviewer
description: Use when a change was materially assisted by generative AI and the repo needs a durable AI-assistance and standards review note. Best for prompts like "create the AI review note", "scan this change for AI-assisted compliance requirements", "record provenance for this slice", or "make sure this AI-assisted auth/security change has the required review artifacts."
---

# AI Change Reviewer

Use this skill when the repo needs a durable review artifact for a materially
AI-assisted change, especially when the change is high-risk and touches auth,
crypto, secrets, permissions, migrations, compliance logic, or shared platform
seams.

This skill scans the repo-local artifacts for the scoped change, checks them
against the repo's AI-assisted-development and shared-seam requirements, and
produces a review note under `docs/workspace/reviews/`.

## Purpose

Create a durable review note that covers the repo's current requirements for:

- AI assistance disclosure
- human accountability
- source-of-truth verification
- deterministic verification evidence
- prompt/data-handling note
- dependency/snippet provenance note
- high-risk model/tool/version traceability
- expert-review note for AI-assisted security or compliance changes
- concise standards-gate summary for the scoped change

This skill exists so those requirements are not left in chat history only.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. `docs/standards/AI-ASSISTED-DEVELOPMENT-GATE.md`
4. `docs/standards/change-artifact-requirements.md`
5. relevant PRD, ADR, capability matrix, PRD test-case doc, and implementation
   blueprint
6. current implementation in `src/`
7. executable tests in `tests/`
8. `docs/standards/platform-status/AI-ASSISTED-DEVELOPMENT-STATUS.md`
9. any existing review notes under `docs/workspace/reviews/`

## Required Inputs

Read:

- `docs/standards/AI-ASSISTED-DEVELOPMENT-GATE.md`
- `docs/standards/change-artifact-requirements.md`
- the scoped PRD and ADR if present
- the scoped PRD test-case doc if present
- the implementation blueprint if present
- the changed code and tests

Also read the review-note template at:

- `references/ai-review-template.md`

## What This Skill Must Check

For the scoped change, determine and record:

1. whether the change was materially AI-assisted
2. who the human owner is
3. which repo artifacts were used as source of truth
4. whether prompt/data handling stayed within repo rules
5. which deterministic verification commands were run and what passed
6. whether generated snippets, dependencies, or copied patterns need provenance
   comments
7. whether the change is high-risk under the repo rule:
   auth, crypto, secrets, security controls, compliance logic, migrations, or
   incident/monitoring logic
8. for high-risk changes, what model/tool/version evidence is available and
   what residual limitation remains if exact version metadata is unavailable
9. whether an expert-review note is required
10. whether a concise standards-gate summary should be included in the note

## Output

Create or update a review note under:

- `docs/workspace/reviews/YYYY-MM-DD-<slice>-ai-and-standards-review.md`

Use the template from `references/ai-review-template.md`.

Keep the note concise and factual. Prefer repo evidence over narrative.

## Workflow

1. Identify the scoped change.
2. Read the required standards and change artifacts.
3. Inspect the implementation and executable verification evidence.
4. Decide whether the change is high-risk.
5. Draft the review note with:
   - scope
   - human owner
   - AI assistance disclosure
   - model/tool/version note
   - prompt/data-handling note
   - source-of-truth note
   - verification note
   - dependency/snippet provenance note
   - expert-review note
   - standards-gate summary
   - known limits/follow-up
6. If required evidence is missing, say so plainly in the note rather than
   inventing it.
7. If the scoped change materially shifts the maintained AI-assisted status
   snapshot, call that out for follow-up rather than silently editing the
   status file unless the user requested that update too.

## Guardrails

- Do not treat chat history alone as sufficient provenance evidence.
- Do not invent exact model/version details that the current environment does
  not expose.
- Do not mark a high-risk AI-assisted change as fully conformant if the note
  itself shows missing required evidence.
- Do not bury unresolved evidence gaps; name them explicitly in the note.
- Do not replace the normal standards-compliance or repo-health audits; this
  skill complements them.
