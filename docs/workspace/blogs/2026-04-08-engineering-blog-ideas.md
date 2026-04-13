# Engineering Blog Ideas

## Current Ideas

### 1. We Stopped Treating Docs As Afterthoughts

- angle:
  how the repo moved from implementation-first to a build-from-spec discipline
- audience:
  engineering leads, staff engineers, platform teams
- core story:
  ADRs, PRDs, test-case docs, blueprints, standards reviews, and maintained
  artifact sweeps became part of delivery rather than cleanup
- supporting repo areas:
  `docs/architecture/*`, `docs/prd/*`, `docs/workspace/implementation-blueprints/*`,
  `docs/standards/change-artifact-requirements.md`

### 2. Building One-Time Tokens Without Smuggling Workflow Into A Shared Library

- angle:
  why the token library was kept intentionally small and side-effect free
- audience:
  backend engineers, security-minded product teams
- core story:
  shared seam owns token mechanics, consuming feature owns persistence and
  business meaning
- supporting repo areas:
  `docs/architecture/adr/0017-*`, `docs/prd/2026-04-08-0007-*`,
  `src/lib/tokens/*`

### 3. What A Good First Email Platform Slice Looks Like

- angle:
  how to build transactional email without overbuilding a fake enterprise
  platform on day one
- audience:
  SaaS founders, product engineers, backend teams
- core story:
  provider-agnostic seam, durable metadata, resend truthfulness, root-admin
  retrieval, and explicit deferred hardening work
- supporting repo areas:
  `docs/architecture/adr/0018-*`, `docs/prd/2026-04-08-0008-*`,
  `src/features/notificationDelivery/*`

### 4. Why “Works In Production” Starts With Supportability

- angle:
  the value of durable attempt history, metadata-first storage, and operator
  APIs even for a first delivery slice
- audience:
  engineering managers, staff engineers, DevOps-minded backend teams
- core story:
  being able to list, filter, inspect, and resend outbound email is part of
  operational readiness, not just convenience
- supporting repo areas:
  `docs/api-contracts/notification-delivery.md`,
  `docs/data-dictionary/outbound-email*.md`,
  `docs/featureDocs/notificationDelivery-feature.md`

### 5. Rebuild-From-Docs As A Practical Engineering Standard

- angle:
  why “rebuild the functionality, NFRs, and compliance posture” is a better
  target than byte-for-byte source reproduction
- audience:
  platform teams, regulated engineering orgs, technical founders
- core story:
  reconstruction questionnaire, bootstrap guide, test-harness docs, and
  script/helper docs make recoverability concrete
- supporting repo areas:
  `docs/architecture/recoverability-and-build-from-spec.md`,
  `docs/architecture/build-from-spec-reconstruction-questionnaire.md`,
  `docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md`,
  `docs/architecture/guides/test-harness-and-fixture-internals-guide.md`,
  `docs/architecture/guides/script-and-helper-behavior-guide.md`

### 6. AI-Assisted Development Needs Durable Review Artifacts

- angle:
  what changed once AI-assisted work was treated as something that needed
  provenance and standards notes, not just chat history
- audience:
  engineering leaders, security teams, compliance-minded builders
- core story:
  durable review notes, repo skills, and maintained-artifact sweeps reduce the
  risk of “AI changed it but nobody can prove how”
- supporting repo areas:
  `docs/standards/AI-ASSISTED-DEVELOPMENT-GATE.md`,
  `docs/workspace/reviews/*`,
  `.codex/skills/ai-change-reviewer/*`

### 7. How To Start A SaaS Platform Without Building The Whole Company On Day One

- angle:
  a practical sequencing guide drawn from the repo’s actual evolution from
  skeleton to guarded platform
- audience:
  SaaS founders, early platform engineers, technical leads
- core story:
  start with explicit architecture and platform seams, then add auth,
  operator workflows, capability-based authz, tenants, shared primitives, and
  delivery infrastructure in a deliberate order
- repo-history thread:
  `Project Skeleton` -> `Initialize platform skeleton baseline` ->
  `Add rootUsers feature and tooling` -> `feat: add platform security hardening
  and tighten feature seams` -> `Add root roles and capability-based authz` ->
  `Add tenant backend foundation` -> `Add shared one-time token library` ->
  `Add notification delivery foundation and rebuild guardrails`
- supporting repo areas:
  `docs/architecture/system-overview.md`,
  `docs/architecture/adr/*`,
  `docs/workspace/architecture-map/*`

### 8. Start With Root Operators Before Tenant Users

- angle:
  why the repo established a root-admin platform before building tenant-facing
  identity and membership flows
- audience:
  SaaS architects, backend engineers, founders designing admin models
- core story:
  root-auth, root-users, root-roles, and capability-based admin controls gave
  the platform a safe operator surface before introducing tenant-scoped actors
- repo-history thread:
  `checkpoint: pre root auth phase 1` ->
  `feat: checkpoint root auth and platform hardening docs` ->
  `feat: add platform security hardening and tighten feature seams` ->
  `Add root roles and capability-based authz`
- supporting repo areas:
  `docs/featureDocs/rootAuth-feature.md`,
  `docs/featureDocs/rootUsers-feature.md`,
  `docs/featureDocs/rootRoles-feature.md`,
  `docs/architecture/guides/auth-and-authorization-guide.md`

### 9. Build Tenancy As A Boundary Before You Build Tenant Features

- angle:
  why “tenants” should usually land as a platform boundary slice before the
  first tenant-owned business entity
- audience:
  product engineers, SaaS teams moving from single-tenant to multi-tenant
- core story:
  tenant creation, tenant-scoped authorization guidance, and central policy
  evaluation can move standards posture before tenant-user workflows fully
  exist
- repo-history thread:
  `Add tenant backend foundation` followed by the token and notification
  delivery foundation work that prepares for tenant-admin auth later
- supporting repo areas:
  `docs/prd/2026-04-07-0005-tenants-backend.md`,
  `docs/architecture/adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md`,
  `docs/featureDocs/tenants-feature.md`

### 10. The First Shared Platform Libraries Should Be Tiny

- angle:
  what this repo learned by adding tokens first and resisting the urge to
  collapse workflow, persistence, and transport into one “utility”
- audience:
  backend engineers, staff engineers, platform-minded teams
- core story:
  the best first shared libraries are narrow seams with clear ownership
  boundaries, not mini-frameworks
- repo-history thread:
  `Add shared one-time token library` followed by `Add notification delivery
  foundation and rebuild guardrails`
- supporting repo areas:
  `docs/architecture/adr/0017-*`,
  `docs/architecture/adr/0018-*`,
  `src/lib/tokens/*`,
  `src/features/notificationDelivery/*`

### 11. Don’t Wait Until “Enterprise Scale” To Add Compliance And Recovery Guardrails

- angle:
  why standards gates, AI-review artifacts, rebuild-from-docs, and maintained
  artifact sweeps matter even in the early platform stage
- audience:
  technical founders, regulated SaaS teams, engineering leaders
- core story:
  the repo layered in standards and recoverability guardrails while features
  were still being built, which prevented later retrofitting pain
- repo-history thread:
  `Add build-from-spec documentation harness` ->
  `Add AI-assisted development standards gate` ->
  `Add notification delivery foundation and rebuild guardrails`
- supporting repo areas:
  `docs/standards/*`,
  `docs/architecture/recoverability-and-build-from-spec.md`,
  `docs/workspace/reviews/*`,
  `.codex/skills/*`

### 12. We Stopped Treating QA Coverage As A Test Suite

- angle:
  how the repo turned QA from "write some tests before merge" into a
  deterministic system of coverage planning, journey modeling, executable
  proof, and durable QA operating artifacts
- audience:
  engineering leaders, platform teams, technical founders, senior backend
  engineers
- core story:
  capability matrices, blueprints, PRD test cases, journey inventories,
  coverage-matrix rules, release-gate summaries, exploratory notes, and
  concrete proof classes like race-condition, conflicting-write, stress, soak,
  and performance verification now form one delivery system
- supporting repo areas:
  `docs/standards/QA-RELEASE-GATE.md`,
  `docs/architecture/guides/qa-coverage-matrix-guide.md`,
  `docs/architecture/guides/end-to-end-journey-testing-guide.md`,
  `docs/architecture/guides/end-to-end-journey-operations-guide.md`,
  `docs/architecture/guides/qa-operating-cadence-guide.md`,
  `docs/workspace/qa/*`,
  `docs/workspace/test-run-summaries/*`,
  `.codex/skills/change-loop-orchestrator/SKILL.md`,
  `.codex/skills/prd-test-case-planner/SKILL.md`,
  `.codex/skills/prd-test-case-implementer/SKILL.md`
