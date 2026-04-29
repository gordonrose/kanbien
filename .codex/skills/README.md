# Repo-Local Skill Organization

Repo-local Codex skills are grouped by their primary job in the repo change
loop. Skill names in each `SKILL.md` remain stable; the folder categories are
for maintainability and discovery, not prompt trigger names.

Codex skill discovery is recursive under `.codex/skills/` for the CLI version
used when this organization was introduced, so each skill may live one level
below a category folder.

## Categories

- `00-orchestration/`: thin routers that coordinate specialist skills.
- `10-repo-governance/`: git hygiene, compliance, repo health, AI-review, and
  agentic-infrastructure governance.
- `20-planning-artifacts/`: durable planning and source-independent artifact
  maintainers.
- `30-testing-and-reconciliation/`: PRD test cases, issue reconciliation, and
  test lifecycle review.
- `40-frontend/`: frontend architecture, topology, design-system, visual
  verification, implementation review, and icon governance.
- `50-docs-and-communication/`: docs alignment and external-facing narrative
  support.

## Current Map

- `00-orchestration/change-loop-orchestrator`
- `10-repo-governance/agentic-infrastructure-refactor-auditor`
- `10-repo-governance/ai-change-reviewer`
- `10-repo-governance/branch-and-commit-governor`
- `10-repo-governance/express-upgrade-maintainer`
- `10-repo-governance/production-readiness-roadmap-auditor`
- `10-repo-governance/repo-health-auditor`
- `10-repo-governance/repo-standards-compliance-auditor`
- `20-planning-artifacts/api-contract-maintainer`
- `20-planning-artifacts/data-dictionary-maintainer`
- `20-planning-artifacts/implementation-blueprint-maintainer`
- `20-planning-artifacts/rebuild-readiness-maintainer`
- `20-planning-artifacts/story-breakdown-maintainer`
- `20-planning-artifacts/task-breakdown-maintainer`
- `30-testing-and-reconciliation/issue-reconciliation-maintainer`
- `30-testing-and-reconciliation/prd-test-case-implementer`
- `30-testing-and-reconciliation/prd-test-case-planner`
- `30-testing-and-reconciliation/test-case-lifecycle-reviewer`
- `40-frontend/design-system-icon-maintainer`
- `40-frontend/frontend-architecture-maintainer`
- `40-frontend/frontend-design-system-loop-maintainer`
- `40-frontend/frontend-implementation-auditor`
- `40-frontend/frontend-test-case-maintainer`
- `40-frontend/frontend-topology-governor`
- `50-docs-and-communication/blog-accountability-partner`
- `50-docs-and-communication/docs-alignment-auditor`
