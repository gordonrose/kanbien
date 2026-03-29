---
name: test-case-lifecycle-reviewer
description: Use when reviewing PRD-derived test cases for anti-drift lifecycle changes such as active, superseded, archived, and pending-review states. Best for prompts like "review test-case lifecycle drift", "propose superseded tests", "audit rootAuth/rootUsers test-case lifecycle", or "prepare lifecycle review candidates for approval."
---

# Test Case Lifecycle Reviewer

Use this skill when the user wants Codex to review PRD-derived test cases for
potential lifecycle changes without silently reclassifying them.

This skill supports the anti-drift pilot for backend `rootAuth` and backend
`rootUsers`.

## Purpose

Produce a structured lifecycle review that:

1. inventories current PRD test-case lifecycle state
2. identifies candidate superseded or archived cases heuristically
3. refines the candidate list explicitly before presenting it
4. presents reasons and replacement linkage clearly
5. waits for human approval before any lifecycle metadata is changed

## Source Of Truth

The source of truth is the PRD-derived test-case document under
`docs/prd/test_cases/`.

Executable tests provide proof for currently active behavior but are not the
primary lifecycle-history artifact.

## Review Workflow

### 1. Build the lifecycle inventory

Use the lifecycle report tooling first:

```bash
npm run test:lifecycle:report -- root-auth root-users
```

This gives the current explicit or defaulted lifecycle state.

### 2. Gather comparison context

Review only the context needed for the requested change:

- the relevant PRD test-case doc
- the feature PRD
- the relevant executable tests
- recent changed files if the user is asking after a body of work

### 3. Heuristically identify candidates

Look for things like:

- a documented capability or flow replaced by a newer workflow
- a route, capability, or seam removed from the current design
- a new executable test that clearly replaces an older expectation lineage
- duplicated test intent where only one expectation should remain active
- PRD changes that invalidate an older test expectation

### 4. Run an explicit refinement pass

Do not present the first raw candidate list immediately.

Refine it by asking:

- is this truly the same underlying intent, or just related?
- is this test obsolete, or merely unimplemented?
- is there a direct replacement link?
- is the confidence high enough to propose a lifecycle change?

This refinement step is required. It is also the place to improve the heuristic
guidance over time by noting patterns that produced false positives or stronger
classification signals.

### 5. Present a structured review

For each candidate, present:

- `Candidate`
- `Current Status`
- `Proposed Status`
- `Reason`
- `Replacement`
- `Confidence`
- `Required Human Decision`

Do not edit lifecycle metadata until the user approves or redirects.

## Default Judgments

- Prefer `superseded` only when a newer version replaces the same underlying
  requirement intent.
- Prefer `archived` when the expectation is no longer current and not directly
  replaced.
- Prefer leaving a case `active` when the evidence is ambiguous.
- Prefer `pending-review` only as a proposed state before approval, not as a
  hidden silent change.

## Pilot Scope

Default this skill to:

- backend `rootAuth`
- backend `rootUsers`

If the user wants broader rollout later, that should go through the normal
change-loop process.
