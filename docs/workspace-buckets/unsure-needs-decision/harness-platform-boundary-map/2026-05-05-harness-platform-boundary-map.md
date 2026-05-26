# Harness Platform Boundary Map

## Status

- Status: `draft-boundary-map`
- Date: 2026-05-05
- Request:
  Explore how the current Codex-assisted Kanbien change harness can evolve
  into a reusable harness that can be integrated into a site, installed as an
  IDE add-on, installed as a console package, or called through an API.
- Guardrail posture:
  Created as a draft workspace planning artifact. Full repo guardrails,
  material artifact sweeps, and implementation-loop checks were intentionally
  skipped because this does not change runtime source, route contracts,
  migrations, feature manifests, or maintained generated artifacts.

## Product Direction

The harness should be treated as a platform product rather than as a loose
collection of repo scripts.

The long-term goal is a governed execution layer that can inspect a target
codebase, understand local rules, plan work, apply changes, run proof commands,
collect evidence, and prepare reviewable outputs while enforcing tenant-level
controls for architecture stack, workflow rules, permissions, rate limits, and
version selection.

The first architecture move should be an internal boundary map. Repository
splitting should wait until the reusable surface is stable enough to version,
pin, and support without creating avoidable drift between the harness and the
Kanbien reference codebase.

## Target Layer Model

| Layer | Responsibility | Should Be Tenant-Controlled? | Should Be Project-Controlled? |
| --- | --- | --- | --- |
| Harness core | Plan, execute, verify, collect evidence, and emit structured results | Yes, by version/channel and enabled execution modes | No, except through project profile inputs |
| Policy engine | Evaluate permissions, rates, budgets, required approvals, allowed tools, and evidence obligations | Yes | Partly, through stricter project policy overlays |
| Project profile loader | Load repo-specific architecture, standards, test commands, protected paths, and artifact rules | No | Yes |
| Adapters | Connect the core to local CLI, IDE, hosted API, GitHub, CI, filesystem, shell, model provider, and browser/runtime tools | Yes, by allowed adapter/tool grants | Partly, by repo-supported adapters |
| Execution sandbox | Checkout or mount code, run approved commands, isolate secrets, record process and artifact evidence | Yes | Partly, by project runtime needs |
| Evidence store | Persist logs, diffs, decisions, test results, screenshots, runtime observations, and review packets | Yes, retention and visibility | Partly, evidence types required by project |
| Review and approval layer | Pause work for human approval on breaking, risky, costly, or out-of-policy actions | Yes | Partly, for project-specific approval rules |
| Distribution surfaces | IDE add-on, CLI/package, site integration, API, and CI/GitHub workflows | Yes, by tenant entitlement | No, except compatibility constraints |

## Boundary Decisions

### Harness Core

The core should own behavior that is reusable across repositories:

- task intake and mode selection: plan, implement, review, verify, reconcile
- structured context assembly from tenant policy and project profiles
- change planning and safe execution orchestration
- approval gate detection
- evidence collection and result packaging
- state transitions for blocked, needs-approval, failed, partially verified,
  and completed work

The core should not hard-code Kanbien feature names, Kanbien docs paths,
Kanbien route families, or Kanbien-specific design-system signoff rules. Those
belong in project profiles or reusable policy packs.

### Tenant Control Plane

Tenant-level control should own account-wide policy and commercial limits:

- enabled harness versions and release channels
- allowed architecture stacks and policy packs
- actor roles and permission grants
- allowed execution modes
- allowed adapters and tools
- shell/network/filesystem permission posture
- repository connection grants
- rate limits, job concurrency, budget ceilings, and quota behavior
- approval requirements for risky operations
- audit retention, evidence visibility, and export posture

Tenant policy should be structured data, not prompt-only instruction text.
Human-readable instructions can explain policy, but executable gates should
read normalized policy records.

### Project Profile

A project profile should describe how one codebase works:

- architecture stack and repo layout
- durable architecture rules
- source-independent artifact rules
- test, lint, migration, and verification commands
- protected files, generated files, and ownership boundaries
- feature or module boundary conventions
- documentation sync obligations
- environment requirements
- runtime verification expectations
- known compatibility constraints

Kanbien should become the reference project profile, not the hidden default
inside the harness core.

### Policy Packs

Some rules will be reusable across tenants and projects but should remain
optional or versioned:

- Express/Postgres/TypeScript backend policy pack
- React/Vite frontend policy pack
- governed design-system policy pack
- product discovery and artifact-chain policy pack
- runtime bug-fix evidence policy pack
- GitHub PR/CI policy pack
- compliance evidence policy packs

Policy packs should be versioned independently from project profiles so a
tenant can pin the policy posture that their teams have approved.

### Adapters

Every integration surface should call the same core contract:

- local CLI/package
- IDE add-on
- hosted API
- site integration
- GitHub/CI worker
- server-side worker for long-running jobs

Adapters should translate environment-specific inputs into the core request
shape and translate core results back into the surface's UI or workflow. They
should not fork planning logic or policy decisions.

## Current Kanbien Source Classification

| Current Source | Classification | Future Placement |
| --- | --- | --- |
| `AGENTS.md` | Kanbien project constitution plus some reusable posture | Split into project profile plus reusable policy-pack candidates |
| `docs/architecture/build-from-spec-change-harness.md` | Reusable harness architecture with Kanbien-specific artifact references | Promote reusable parts into harness architecture; keep repo-specific artifact paths in project profile |
| `docs/standards/change-artifact-requirements.md` | Mostly project policy, with reusable artifact-chain ideas | Project profile plus artifact-chain policy pack |
| `docs/standards/git-workflow-guardrails.md` | Reusable workflow posture with local repo assumptions | Git workflow policy pack plus project overrides |
| `.codex/skills/` | Mixed reusable workflows and Kanbien-specific procedures | Split into reusable skills/policy packs and Kanbien project skills |
| `docs/templates/` | Mixed reusable artifact templates and project-specific templates | Versioned template packs with project overrides |
| `docs/workspace/harness-audits/` | Harness design evidence and lessons | Reference design history for extraction |
| `tests/harness/` | Project test infrastructure with reusable patterns | Keep project-specific until at least two consuming projects prove reuse |
| Package scripts in `package.json` | Project-local command surface | Project profile command registry; reusable commands move to harness CLI |
| GitHub and CI workflows | Adapter-specific execution and evidence posture | GitHub adapter plus project policy |

## Core Contract Sketch

The first reusable contract should be small enough to support all surfaces.

```ts
type HarnessMode =
  | "plan"
  | "implement"
  | "review"
  | "verify"
  | "reconcile";

type HarnessRequest = {
  tenantId: string;
  projectId: string;
  actorId: string;
  mode: HarnessMode;
  task: string;
  repo: {
    provider: "local" | "github" | "git";
    ref: string;
    branch?: string;
    workingDirectory?: string;
  };
  requestedPermissions: string[];
  policyVersion?: string;
  projectProfileVersion?: string;
};

type HarnessResult = {
  status:
    | "completed"
    | "partially_verified"
    | "needs_approval"
    | "blocked"
    | "failed";
  summary: string;
  changedFiles: string[];
  evidence: EvidenceItem[];
  policyDecisions: PolicyDecision[];
  approvalRequests: ApprovalRequest[];
  nextActions: string[];
};
```

This contract should be treated as a design sketch only. The next planning
step should validate whether job lifecycle, streaming updates, user
interruptions, workspace snapshots, and approval flows need first-class shapes
before implementation.

## Tenant Policy Model Sketch

```json
{
  "tenantId": "example-tenant",
  "allowedStacks": ["node-express-postgres", "react-vite"],
  "workflowRules": {
    "requiresArtifactSweep": true,
    "requiresRuntimeEvidenceForBugFixes": true,
    "requiresApprovalForBreakingChanges": true
  },
  "permissions": {
    "canEditSource": true,
    "canRunTests": true,
    "canRunMigrations": false,
    "canPushBranches": true,
    "canOpenPullRequests": true,
    "canDeploy": false
  },
  "limits": {
    "maxConcurrentJobs": 2,
    "maxDailyRuns": 100,
    "maxToolRuntimeSeconds": 900,
    "maxChangedFilesWithoutApproval": 25
  },
  "version": {
    "harnessChannel": "stable",
    "pinnedVersion": "0.1.x",
    "policyPackVersions": {
      "artifact-chain": "0.1.x",
      "runtime-evidence": "0.1.x"
    }
  }
}
```

## Extraction Path

1. Create a Kanbien project profile draft.
   Classify repo constitution, architecture docs, standards gates, commands,
   protected paths, generated artifacts, and verification expectations.
2. Create a reusable policy-pack inventory.
   Identify which current instructions are generally useful outside Kanbien
   and which are only Kanbien-specific.
3. Define the core request/result contract.
   Keep it adapter-neutral and include job status, approvals, evidence, diffs,
   and policy decisions.
4. Build a local harness facade inside this repo.
   Use it as a compatibility layer over current scripts and skills before
   moving anything out.
5. Add a hosted-worker design.
   Define job lifecycle, workspace isolation, secrets handling, repo sync,
   evidence storage, rate limits, and approval callbacks.
6. Extract only after a stable internal facade exists.
   The first extraction target should be a package or workspace module, not a
   fully separate repository.
7. Split repos only when the package boundary is versionable.
   The split should include pinned versions, migration notes, backward
   compatibility rules, and server sync instructions.

## Repository Split Recommendation

Do not split the harness into a separate repository yet.

First, create an internal package boundary and prove:

- Kanbien can call the harness through a stable facade.
- At least one non-Kanbien sample project can consume the same facade.
- Tenant policy can be evaluated from structured data.
- Project-specific rules are loaded through a project profile rather than
  hard-coded in core logic.
- Local CLI and hosted-worker flows can both use the same core contract.
- Version pinning and downgrade/upgrade behavior are documented.

After those are true, a separate repository becomes useful rather than
premature.

## Open Product Decisions

- Who is the first paying or serious user: only this project, another internal
  project, or external tenant teams?
- Should the first distributable surface be local CLI/package, IDE add-on, or
  hosted API?
- Should tenant admins be able to edit workflow policy themselves, or should
  policy changes require platform/operator approval?
- What level of codebase access is acceptable for the hosted API version:
  GitHub app installation, uploaded archive, self-hosted runner, or local-only
  execution?
- What evidence must be visible to tenant admins versus only platform
  operators?
- Which operations should remain impossible without explicit human approval,
  even for highly trusted tenants?

## Technical Steering Questions

- Should tenant policy and project profiles be stored in Kanbien as first-class
  domain records, external config files, or both?
- What is the minimum sandbox and secrets model for hosted execution?
- How should long-running jobs stream progress, handle user interruption, and
  resume after worker failure?
- Which policy checks must be executable gates before the model sees task
  context?
- Which evidence items should be immutable records?
- How should harness versions, policy-pack versions, and project-profile
  versions be pinned together?

## Immediate Next Step

Create a Kanbien project profile draft that classifies the current repo rules
into:

- `project-specific`
- `reusable-policy-pack-candidate`
- `harness-core-candidate`
- `adapter-specific`
- `reference-only`

That profile should be the first practical artifact before any code extraction,
package creation, or repository split.
