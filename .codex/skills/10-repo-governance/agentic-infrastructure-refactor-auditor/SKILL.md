---
name: agentic-infrastructure-refactor-auditor
description: Use when the user wants Codex to inspect the repo's agentic infrastructure and identify opportunities to refactor instruction architecture, skill boundaries, routing/orchestration logic, and supporting artifact layouts for lower drift, lower token cost, stronger trigger accuracy, and easier long-term maintenance.
---

# Agentic Infrastructure Refactor Auditor

Use this skill when the user wants a focused review of the repo's agentic
infrastructure rather than product behavior.

This includes things like:

- `AGENTS.md`
- repo-local skills under `.codex/skills/`
- instruction-bearing templates and references
- architecture and standards docs that act as process-law sources
- overlap between constitution, orchestration, specialist workflows, and
  evidence or template support

The goal is to improve maintainability and clarity without weakening the repo's
safety posture.

## Purpose

This skill inspects the instruction system as a designed architecture and looks
for opportunities to:

- reduce duplicated instruction law
- sharpen file and skill ownership boundaries
- improve trigger accuracy
- reduce accidental mini-constitutions inside specialist skills
- keep orchestration thin and specialist skills sharp
- reduce prompt and token overhead where duplication is the cause
- preserve compatibility, durable-data, migration-safety, docs-sync, and
  verification guardrails

This is an analysis and design skill first.
Do not edit instruction files unless the user asks for the refactor after the
review.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. `docs/standards/change-artifact-requirements.md`
4. repo-local skills under `.codex/skills/`
5. repo-local templates and references under `.codex/skills/**/references/` and
   `docs/templates/`
6. maintained source-independent docs that act as process or architecture
   sources of truth

If two instruction surfaces disagree, prefer the higher-authority source and
call out the disagreement explicitly.

## What To Inspect

Load only the files needed for the current audit. Common targets:

- `AGENTS.md`
- `.codex/skills/**/SKILL.md`
- `.codex/skills/**/references/*`
- `.codex/skills/README.md`
- `docs/standards/change-artifact-requirements.md`
- `docs/architecture/change-control.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/priniciples.md`
- relevant ADRs under `docs/architecture/adr/`
- `docs/templates/*`
- maintained docs that function as process or evidence authorities

## Classification Model

Classify each major instruction surface primarily as one of:

- `constitution`
- `routing/orchestration`
- `specialist workflow`
- `evidence/template support`

If a file appears to do more than one job, say which role is primary and which
roles are bleeding into it.

## Review Questions

For each important instruction surface, check:

1. Is this file holding durable policy, or merely repeating procedural law from
   elsewhere?
2. Is this file making orchestration decisions, or should it defer to a
   thinner router plus a canonical process document?
3. Is this file genuinely specialist, or is it absorbing neighboring concerns?
4. Would splitting this file improve clarity, or only create more trigger
   ambiguity?
5. Would collapsing repeated sections into a canonical source reduce drift
   without weakening outcomes?
6. Does this surface meaningfully affect prompt and token overhead through
   duplication?
7. If content were removed, where should its authority live instead?

## Workflow

1. Inventory the instruction-bearing surfaces.
Identify the repo constitution, orchestrators, specialist skills, and
supporting references or templates.

2. Classify the surfaces.
Assign each major file a primary role from the classification model.

3. Look for overlap and drift risk.
Pay special attention to:
- constitution mixed with routing
- orchestrators restating process law
- specialist skills restating repo-wide artifact requirements
- references or templates that should own durable detail instead of instruction
  files

4. Evaluate token and maintainability impact.
Do not optimize for shortness alone.
Look specifically for duplicated law that raises prompt cost and drift risk.

5. Recommend a target architecture.
Prefer fewer, sharper instruction surfaces over many tiny fragments.

6. Produce a migration plan.
Recommend safe, iterative steps rather than a big-bang rewrite unless the user
explicitly asks for one.

7. Pause before editing.
Do not refactor the instruction files during the audit unless the user asks for
the implementation pass after reviewing the recommendations.

## Output Format

When reporting results, use:

1. `Diagnosis`
2. `Classification Table`
3. `Boundary Problems`
4. `Target Architecture`
5. `Recommended File Actions`
6. `Migration Plan`

For recommended file actions, use clear labels such as:

- `stay as-is`
- `shrink`
- `split`
- `merge`
- `move to referenced doc/template`

When suggesting removals, always indicate whether the content should be:

- `moved to`
- `collapsed into`
- `dropped as duplicate`

## Guardrails

- Do not recommend "split everything" as a default.
- Do not reduce safety by deleting durable repo policy.
- Do not weaken the repo's standards around compatibility, durable data,
  migration safety, docs sync, or verification.
- Do not confuse a large specialist skill with a bad one if the task itself is
  legitimately heavy.
- Do not propose a thinner orchestrator unless the canonical process source is
  clear and maintained.
- Do not recommend deleting repeated content without naming where the authority
  should live instead.
- Do not patch instruction files during the audit unless the user asks for the
  refactor pass.

## Trigger Phrases

Trigger this skill for prompts like:

- "audit my agentic infrastructure"
- "review my Codex instruction architecture"
- "look for opportunities to refactor the skills and AGENTS"
- "check whether my agentic setup has too much overlap"
- "find ways to reduce token cost in my instruction system"
- "classify my instruction files and recommend a better architecture"
