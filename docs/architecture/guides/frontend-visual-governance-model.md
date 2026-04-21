# Frontend Visual Governance Model

## Purpose

Name the distinct responsibilities that shape governed frontend visual work so
`/design-system`, `tests/visual/`, app adoption, and signoff artifacts do not
quietly absorb each other's jobs.

This guide is a boundary map.
It does not replace:

- `AGENTS.md`
- `design-system-loop-harness.md`
- `testing-and-verification-guide.md`
- ADR 0027 app-adoption rules

Use it when deciding who owns a frontend visual decision, test, artifact, or
review step.

## Role Model

### 1. Design Systems Engineer

Owns upstream governed visual truth.

Primary responsibilities:

- behavior locks
- reference packs
- canonical families
- signed-off `/design-system` render surfaces
- shared asset entrypoint prerequisites for governed app adoption

This role decides what the governed family is supposed to be.

Codex seam:

- `frontend-design-system-loop-maintainer`

### 2. Frontend Verification Engineer

Owns frontend verification architecture and regression protection.

Primary responsibilities:

- `tests/visual/` structure
- visual regression scenario maintenance
- screenshot and geometry assertion strategy
- shared frontend visual helpers
- frontend gate coverage and hygiene
- keeping durable suites separate from debug or scratch investigation artifacts

This role decides how the governed truth is protected.

Codex seam:

- `frontend-test-case-maintainer`

### 3. Product Frontend Engineer

Owns real-app implementation and adoption of approved families.

Primary responsibilities:

- consuming signed-off design-system seams in real app routes
- consuming design-system-owned styling, render, and interaction seams rather
  than reconstructing governed families locally
- composing app behavior around approved family inputs and callbacks
- preserving governed app framing instead of recreating it locally
- adding app-level regression checks when adoption creates app-specific risk
- recording the governed-adoption preflight and literal parity target before
  first-consumer implementation starts

This role decides how approved truth is used in the product.

Codex seams:

- normal implementation work
- `frontend-implementation-auditor` for implementation review

### 4. Product Designer Or Signoff Steward

Owns review and approval posture for intentional visual truth.

Primary responsibilities:

- deciding whether behavior-lock wording is accurate
- approving reference truth and canonical review sets
- judging whether a visible change is intentional, incomplete, or drift
- deciding whether an app adoption still matches approved family posture

This role decides whether the visible result is acceptable.

Codex seam:

- encoded through signoff artifacts and loop stages rather than a separate
  specialist skill

## Handoff Model

Default order:

1. design-system truth is defined and signed off upstream
2. verification protection is added or refreshed for that truth
3. real-app adoption consumes the approved shared seam
4. signoff confirms the visible result is still honest at both the upstream and
   app-adoption layers

Do not reverse this order casually.

Especially avoid these failure modes:

- app adoption inventing upstream design truth
- tests becoming the only place where visual rules are documented
- debug artifacts remaining in durable verification folders
- app-local implementation quietly redefining a signed-off family

## Ownership Rules

### Design-System Truth Versus Verification Truth

- design-system artifacts define what the family should be
- verification artifacts define how regressions are caught
- verification files must not become the only design spec
- design-system files must not pretend to be sufficient executable proof

### Upstream Canonicals Versus App Adoption

- canonicals prove the governed family in isolation
- app adoption proves the family is consumed honestly in a real route
- app adoption may add app-specific checks
- app adoption must not silently fork the upstream family
- app adoption must not rely on shared CSS alone while duplicating family
  markup or controller behavior locally
- app adoption should declare the family-owned versus host-owned boundary so
  parity disputes do not get resolved through local guesswork

### Durable Suites Versus Debug Artifacts

- durable suites protect expected long-lived truths
- debug artifacts help investigate active uncertainty
- debug artifacts should be removed, relocated, or clearly quarantined once the
  durable regression has been established

## Loop Mapping

Use these defaults:

- new family, child seam, or visual-contract refinement:
  `frontend-design-system-loop-maintainer`
- test-suite structure, screenshot baselines, geometry helpers, frontend gate
  work, or `tests/visual/` cleanup:
  `frontend-test-case-maintainer`
- app adoption review, design-system drift in app code, or implementation-risk
  audit:
  `frontend-implementation-auditor`
- escaped visual defect or "why did this get missed?":
  `issue-reconciliation-maintainer`
  Pair with `frontend-test-case-maintainer` or
  `frontend-design-system-loop-maintainer` when the prevention work is
  frontend-specific.

## Anti-Contamination Rules

- Do not treat `tests/visual/` as the source of product truth.
- Do not treat `/design-system` signoff as a substitute for executable
  regression coverage.
- Do not let app-level exceptions silently rewrite upstream family rules.
- Do not let shared CSS imports masquerade as honest governed adoption when the
  app still owns the family markup or interaction logic.
- Do not treat reused classes, child controls, or passing happy-path tests as
  sufficient first-consumer parity evidence.
- Do not keep scratch capture, debug screenshots, and durable baselines mixed
  together without naming that as contamination.
- Do not let one skill absorb all four roles just because the work is visually
  adjacent.

## Related Sources

- [Design System Loop Harness](./design-system-loop-harness.md)
- [Testing And Verification Guide](./testing-and-verification-guide.md)
- [ADR 0027](../adr/0027-use-approved-design-system-shared-asset-entrypoints-for-governed-app-page-adoption.md)
