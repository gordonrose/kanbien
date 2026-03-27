---
name: repo-standards-compliance-auditor
description: Use when the user wants a whole-repo compliance audit against the repository's standards gates and architecture rules, especially across docs/, src/, tests/, package.json, and vitest.config.ts. Best for prompts like "check repo compliance", "audit the whole repo against standards", "run the standards gates", or "tell me how compliant we are and what fixes are needed."
---

# Repo Standards Compliance Auditor

Use this skill when the user wants a repo-wide compliance review against the
project's standards gates, architecture rules, and executable implementation.

The goal is to answer:

- how compliant the repo currently is with each applicable standard
- where evidence exists
- where gaps, contradictions, or weak evidence remain
- what fixes should be made before future iteration or release

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/`
3. `docs/standards/`
4. current source in `src/`
5. executable tests in `tests/`
6. `package.json`
7. `vitest.config.ts`
8. PRDs, PRD test-case docs, feature docs, README files, Postman, OpenAPI

If implementation and docs disagree, use architecture and standards as the
tie-breaker first.

## Required Standards Sources

Always read:

- `docs/standards/README.md`
- `docs/standards/NIST-SSDF-GATE.md`
- `docs/standards/OWASP-ASVS-GATE.md`
- `docs/standards/NIST-CSF-2.0-GATE.md`
- `docs/standards/ISO-27001-27002-GATE.md`
- `docs/standards/GDPR-DATA-TRANSFER-GATE.md`
- `docs/standards/EU-AI-ACT-GATE.md`

Also read:

- `AGENTS.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/priniciples.md`
- `docs/architecture/change-control.md`
- relevant ADRs in `docs/architecture/adr/`

Load only the feature, frontend, test, or doc files needed to support the
current findings.

## Required Repo Surfaces

For a whole-repo audit, inspect these surfaces explicitly:

- `docs/`
- `src/`
- `tests/`
- `package.json`
- `vitest.config.ts`

If the user narrows scope, still inspect any shared seams those files depend
on.

## What This Audit Looks For

Audit both design intent and implementation evidence.

Focus on:

- security and session model compliance
- secure development and test discipline
- ownership, rollback, and operational clarity
- logging, auditability, and evidence trails
- privacy/data-transfer implications
- AI feature implications, if any
- contradictions between standards, architecture, docs, tests, and code
- gaps where standards require evidence but the repo does not provide it

Do not claim compliance just because no obvious violation was found. Distinguish
between:

- explicit evidence of compliance
- partial evidence
- no evidence found

## Applicability Rule

Not every gate applies equally to every repo state.

For each gate, classify it as:

- `Applicable`
- `Partially Applicable`
- `Not Applicable`

Never silently skip a gate. If a gate is `Not Applicable`, explain why.

Typical examples:

- `EU-AI-ACT-GATE.md` may be `Not Applicable` if the repo has no AI features
  or integrations
- `GDPR-DATA-TRANSFER-GATE.md` may be `Partially Applicable` if personal data
  exists but no cross-border transfer or vendor movement is implemented yet

## Rating Model

For each mandatory checklist item you inspect, rate it as exactly one of:

- `Pass`
- `Partial`
- `Fail`
- `Not Assessed`
- `Not Applicable`

Use `Not Assessed` when the repo may be compliant but the evidence is missing or
insufficient.

Then produce a gate-level compliance judgment:

- `High`
  - no `Fail` items and only small, well-understood `Partial` or
    `Not Assessed` gaps
- `Moderate`
  - no critical `Fail` items, but multiple `Partial` or `Not Assessed` items
    reduce confidence
- `Low`
  - one or more significant `Fail` items, or broad evidence gaps in mandatory
    areas
- `Not Applicable`

Do not invent numeric percentages unless the user explicitly asks for scoring.
Prefer evidence-backed judgments over false precision.

## Workflow

1. Identify audit scope.
If the user says "entire repo", audit the whole repo with emphasis on shared
platform seams, authentication, persistence, tests, docs, and release/runtime
signals.

2. Build the standards picture.
Read the standards gate docs and extract the mandatory pass criteria and fail
conditions that apply to the repo.

3. Build the architecture picture.
Read `AGENTS.md`, architecture docs, and relevant ADRs so compliance judgments
respect this repo's intended design.

4. Build the implementation picture.
Inspect:
- shared seams in `src/lib/`
- platform wiring in `src/app.ts`, `src/server.ts`, `src/routes/v1/index.ts`
- relevant feature files under `src/features/*`
- browser/frontend code under `src/frontend/` when present
- helper/runtime scripts when present
- executable tests under `tests/`
- `package.json`
- `vitest.config.ts`
- PRDs, test-case docs, and feature docs when they provide evidence or reveal
  missing evidence

5. Map evidence against each applicable gate.
For every gate:
- identify the relevant checklist sections
- cite file-backed evidence
- mark each examined criterion as `Pass`, `Partial`, `Fail`, `Not Assessed`, or
  `Not Applicable`

6. Separate hard violations from missing evidence.
Call out whether the problem is:
- direct non-compliance
- partial compliance
- evidence gap
- conscious phase-one debt

7. Recommend fixes.
For every `Fail`, `Partial`, or important `Not Assessed` item:
- say what fix is needed
- say whether the fix is code, tests, docs, deployment/process, or architecture
- say whether it should block further work or can wait

8. Pause before editing.
Do not patch code or docs unless the user asks for fixes after reviewing the
audit.

## Review Heuristics

Prioritize findings that threaten:

- secure authentication and session handling
- server-side enforcement and deny-by-default behavior
- rollback, revocation, disablement, and ownership clarity
- auditability, safe logging, and incident investigation
- privacy/data handling correctness
- release trust and deployment integrity
- test-backed verification of failure and abuse cases
- standards evidence that would matter in a real audit or compliance review

Lower priority:

- aspirational control frameworks with no current repo surface
- stylistic differences that do not affect evidence or control outcomes
- speculative process improvements that do not close a real gate gap

## Reporting Format

Report findings first, not implementation suggestions.

Use this structure:

1. `Gate Summary`
2. `Critical Gaps`
3. `Per-Gate Findings`
4. `Cross-Repo Themes`
5. `Still Aligned`

### Gate Summary

For each gate, include:

- gate name
- applicability
- compliance judgment: `High`, `Moderate`, `Low`, or `Not Applicable`
- short reason

### Critical Gaps

List only the items that should block release, security-sensitive rollout, or
continued scaling unless resolved.

### Per-Gate Findings

For each applicable gate:

- name the checklist section
- include file references
- state the rating
- explain the evidence
- explain the gap
- recommend the fix

### Cross-Repo Themes

Use this section for repeated patterns, for example:

- good code but weak evidence trail
- strong auth controls but weak deployment hardening
- good tests for happy path but weak abuse-case coverage

### Still Aligned

Call out where the repo is clearly on solid ground.

## Guardrails

- Do not claim "passed" without evidence.
- Do not treat missing evidence as full compliance.
- Do not ignore executable tests when they are the strongest proof available.
- Do not recommend breaking compatibility without calling it out explicitly.
- Do not turn standards language into generic advice; tie findings to files.
- Keep architecture-backed phase-one trade-offs distinct from accidental drift.

## Trigger Phrases

Trigger this skill for prompts like:

- "check the entire repo against standards"
- "run the standards gates"
- "audit repo compliance"
- "how compliant are we with the checklists"
- "check docs/src/tests/package.json/vitest.config.ts against standards"
- "tell me what fixes are needed for compliance"
- "run a whole-repo compliance audit"
