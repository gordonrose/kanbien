---
name: data-dictionary-maintainer
description: Use when the user wants Codex to inspect the repository and create or maintain entity data dictionary documents under docs/data-dictionary. Best for prompts like "build the data dictionary", "update the data dictionary", "check what changed in entities", or "compare the data dictionary to current code before updating."
---

# Data Dictionary Maintainer

Use this skill when the user wants a repository-backed data dictionary generated
or refreshed from the current codebase.

The output lives under `docs/data-dictionary/`.

## Purpose

This skill maintains one data dictionary document per entity and an index that
summarizes the current entity set.

For each entity, document:

- entity name
- short description
- owning feature
- capabilities that rely on the entity
- fields
- field descriptions
- field-level and related error messages

On repeated runs, compare the existing dictionary with the current source and
report what changed before editing files.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. current source in `src/`
4. existing files in `docs/data-dictionary/`
5. other docs

Do not treat an old data dictionary entry as the source of truth over the code.

## Where To Look

Start small and expand only when needed.

Primary sources:

- `src/features/*/persistence/migrations/*.sql`
- `src/features/*/persistence/types.ts`
- `src/features/*/persistence/repository.ts`
- `src/features/*/domain/types.ts`
- `src/features/*/domain/service.ts`
- `src/features/*/transport/router.ts`
- `src/features/*/contract/errors.ts`
- `src/routes/v1/index.ts`
- `docs/architecture/system-overview.md`
- relevant ADRs

Helpful secondary sources:

- feature `README.md`
- `docs/featureDocs/*`
- `docs/swagger/openapi.yaml`

## Entity Identification Rules

Identify entities from durable domain ownership, not just from any TypeScript
interface.

Prefer entities that are clearly backed by one of:

- a feature-owned table in migrations
- a durable persistence record in `persistence/types.ts`
- an architecture-owned durable concept described in `system-overview.md`

For the current repo, likely entities include durable records such as root
users, auth principals, SSH public keys, login challenges, sessions, and auth
audit events.

Do not create standalone entity pages for:

- request DTOs
- response DTOs
- pure filter objects
- middleware-local shapes
- helper-only values unless the user explicitly asks for them

If an item is ambiguous, say so and explain why it was included or excluded.

## Ownership Rules

- The owning feature is the feature that owns the durable record or lifecycle.
- Cross-feature consumers should be listed under capabilities that rely on the
  entity, not as owners.
- When architecture docs explicitly assign ownership, follow that assignment.

## Capability Extraction Rules

List capabilities by reading:

- `domain/service.ts`
- capability files under `domain/`
- `transport/router.ts`
- public routes in OpenAPI when helpful

Use capability-oriented language such as:

- create root user
- list deleted root users
- password-stage login
- complete SSH challenge
- revoke session

## Field Documentation Rules

For each field:

- use the durable or persistence name as the canonical field when the entity is
  persistence-backed
- mention API-facing aliases only when useful
- describe purpose, notable constraints, normalization, lifecycle behavior, and
  whether it links to another entity

Pull field meaning from:

- migration SQL
- persistence record types
- repository queries
- domain logic
- validation schemas

Do not invent constraints that are not supported by source.

Prefer bullet lists over Markdown tables for fields and related errors. The
generated dictionary should be easy to scan in plain Markdown editors.

## Error Documentation Rules

Document errors from `contract/errors.ts` that are:

- explicitly tied to a field through `details.field`
- clearly about the entity even if not field-specific

For each relevant error include:

- error code
- message
- field when available
- reason when available
- brief note on when it occurs

If an error concerns a capability using the entity rather than a single field,
include it in the entity page under a related errors section.

## Output Structure

Maintain:

- `docs/data-dictionary/index.md`
- one file per entity under `docs/data-dictionary/`

Suggested filenames:

- `docs/data-dictionary/root-user.md`
- `docs/data-dictionary/auth-principal.md`
- `docs/data-dictionary/auth-ssh-public-key.md`
- `docs/data-dictionary/auth-login-challenge.md`
- `docs/data-dictionary/auth-session.md`
- `docs/data-dictionary/auth-audit-event.md`

Use the template in `references/entity-template.md`.

## Change Detection Workflow

On every run:

1. Identify the current entity set from source.
2. Read the existing corresponding files in `docs/data-dictionary/` if they
   exist.
3. Compare source to the existing dictionary and summarize:
   - new entities
   - removed entities
   - changed ownership
   - changed capabilities
   - added, removed, or changed fields
   - added, removed, or changed errors
4. Report the changes first.
5. Ask whether to update the existing dictionary based on those changes.
6. Only patch files after approval.

If there is no existing dictionary yet, say that clearly and propose the
initial set of entity pages before creating them.

## Reporting Format

When reviewing before edits, use:

1. `Entities Found`
2. `Detected Changes`
3. `Recommended Updates`

When updating files, keep the final explanation short and mention:

- which entity pages were added or updated
- any ambiguity that still needs human judgment

## Guardrails

- Do not treat mutable related records as replacements for durable facts.
- Respect the project's backwards-compatibility and durable-data rules in
  `AGENTS.md`.
- Do not silently infer feature ownership when architecture explicitly assigns
  it elsewhere.
- If the source is ambiguous, mark the inference explicitly.
- Do not overwrite the existing data dictionary without first summarizing the
  detected changes.

## Trigger Phrases

Trigger this skill for prompts like:

- "build the data dictionary"
- "update the data dictionary"
- "check the data dictionary against code"
- "what changed in our entities?"
- "create docs/data-dictionary from the repo"
- "refresh entity docs from source"
