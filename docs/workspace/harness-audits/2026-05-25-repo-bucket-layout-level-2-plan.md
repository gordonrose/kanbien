# Repo Bucket Layout Level 2 Plan

Date: 2026-05-25

## Objective

Create clearer visual ownership boundaries for planning, harness, governance,
and platform workspace artifacts before moving runtime code.

The immediate Level 2 goal is to make `docs/workspace` easier to scan for
scope control and drift detection. Runtime code, routes, migrations, authz
seeds, generated artifacts, and frontend harness work remain out of scope for
this plan until separately approved.

## Working Buckets

- `platform`: runtime SaaS product and backend/app capabilities such as auth,
  users, tenants, entities, APIs, persistence, migrations, permissions, jobs,
  assets, customer/business data, and app behavior that matters independently
  of the harness.
- `discovery-harness`: Product Discovery, product-builder flow, requests,
  steering, story/task breakdown, packet generation, and code-backed tools
  whose current purpose is turning ideas or interviews into planned work.
- `frontend-harness`: design-system and governed frontend lab work such as
  tokens, canonicals, behavior locks, visual verification, patterns, topology,
  and app adoption contracts.
- `shared-governance-kernel`: repo-wide rules and evidence that apply across
  workstreams, including the repo constitution, git workflow, decision
  evidence, artifact requirements, audits, agent instruction architecture,
  repo health, standards compliance, and cross-chat safety.
- `archive/history`: historical records, old runs, inactive preserved
  snapshots, completed task-run evidence, backups, and records kept for
  traceability but not active source-of-truth guidance. Active guardrail inputs,
  such as current preserved-worktree markers consumed by git tooling, may belong
  in `shared-governance-kernel` instead.
- `unsure / needs decision`: artifacts whose current purpose, authority, or
  owner cannot be classified confidently from inspected evidence.

## Classification Rule

Classify artifacts by current purpose and authority, not by filename, artifact
type, folder, or future aspiration.

An artifact type can appear in multiple buckets. For example, a Technical
Steering packet, PRD, capability matrix, runbook, QA evidence note, or
implementation blueprint should be bucketed by what it governs or enables.

The future harness-platform extraction lens is separate from these repo
buckets. Repo buckets classify ownership inside Kanbien; the extraction lens
classifies whether a rule is project-specific, reusable policy,
harness-core behavior, adapter-specific behavior, or reference-only evidence.

## Current Decisions

- `harnessChat` is classified as `discovery-harness` for the current MVP
  because its current purpose is Product Discovery interviews, story/packet
  generation, packet traceability, and root-admin harness chat workflows.
- `harnessChat` stays physically implemented in `src/features/harnessChat`.
  No physical move is approved by this plan.
- Future promotion of `harnessChat` toward `shared-governance-kernel` requires
  a separate compatibility plan for routes, migrations, authz seeds, generated
  docs, and any retained history.

## Capability Matrix Posture

Capability matrices are cross-bucket handoff artifacts.

Working lifecycle:

```text
Product Discovery -> Technical Steering / PRD -> Capability Matrix ->
Story Breakdown / Test Planning / Implementation Blueprint -> Delivery
```

Current posture:

- artifact type: cross-bucket handoff artifact
- bucket owner: determined by the subject and purpose of the specific matrix
- current physical home: `docs/workspace/capability-matrices/`
- move readiness: not ready for physical relocation

Phased approach:

1. Keep capability matrix files in `docs/workspace/capability-matrices/` for
   now.
2. Add a bucket map/index that classifies each matrix by owner bucket without
   moving it.
3. Update relevant skills and docs to support bucket-first lookup plus the
   legacy folder.
4. Move selected matrices only after references and lookup expectations are
   compatible.

## Product Discovery Packet Posture

Product Discovery packets are discovery-harness source artifacts.

Current posture:

- artifact type: discovery-harness source artifact
- bucket owner: `discovery-harness`
- current physical home: `docs/workspace/product-discovery/`
- move readiness: not ready for physical relocation while validation tooling
  and downstream templates expect the current folder

Producer:

- `product-discovery-maintainer`
- Product Discovery draft and validation tooling

Consumers:

- Technical Steering packet templates
- Product Request cover sheets
- Story Breakdown and Task Breakdown templates
- downstream PRD, capability-matrix, test-case, and implementation planning
  flows

Unlike capability matrices, Product Discovery packets have a strong natural
bucket by artifact type. If a future bucket-first layout is introduced, either
`docs/workspace/product-discovery/` should be treated as part of the
`discovery-harness` bucket or validation tooling must be updated before packet
instances move.

## Product Request Posture

Product Requests are cross-bucket tracking and index artifacts.

Current posture:

- artifact type: cross-bucket tracking/index artifact
- creator: `discovery-harness`, usually through `product-discovery-maintainer`
- current physical home: `docs/workspace/product-requests/`
- validation: `npm run product-request:validate -- --all`
- move readiness: not ready for physical relocation while validation tooling
  defaults to the current folder

Purpose:

- summarize the request for humans
- track current status and next step
- index related Product Discovery, Technical Steering, Story Breakdown, Task
  Breakdown, loop runs, PRs, and evidence

Product Requests must not replace the Product Discovery packet, Technical
Steering packet, PRD, API contract, schema, UI, automation, or implementation
truth. They may become the navigation spine for future bucket maps because
they can point across bucket-owned artifacts without owning those artifacts'
source truth.

## Technical Steering Packet Posture

Technical Steering packets are cross-bucket architecture and governance
handoff artifacts.

Current posture:

- artifact type: cross-bucket architecture/governance handoff artifact
- bucket owner: determined by the subject and purpose of the specific packet
- current physical home: `docs/workspace/technical-steering/`
- validation: `npm run technical-steering:validate -- <packet-path>`
- move readiness: not ready for physical relocation while validation tooling,
  skills, and downstream references expect the current folder

Authority:

- architecture posture
- risk flags
- blockers
- artifact obligations
- approved, deferred, or revisit decisions

Consumers:

- Story Breakdown
- Task Breakdown
- implementation blueprinting
- architecture and foundation tasks
- permission, data, backend, and platform-seam guardrails
- Product Request cover sheets

Technical Steering packets are closer to capability matrices than Product
Discovery packets for bucket-layout purposes: the artifact type is
cross-bucket, and each packet should be classified by what it steers.

## Story Breakdown Packet Posture

Story Breakdown packets are cross-bucket planning handoff artifacts.

Current posture:

- artifact type: cross-bucket planning handoff artifact
- bucket owner: determined by the subject and purpose of the specific packet
- producing machinery: `discovery-harness`, through
  `story-breakdown-maintainer`
- current physical home: `docs/workspace/story-breakdown/`
- validation: `npm run story-breakdown:validate -- <packet-path>`
- move readiness: not ready for physical relocation while validation tooling,
  skills, templates, and downstream references expect the current folder

Authority:

- smallest independently deliverable and verifiable stories
- stable story IDs
- acceptance criteria and acceptance-criterion IDs
- dependency and seam mapping
- story-level proof obligations
- artifact ledger and unblock questions before Task Breakdown

Inputs:

- Product Discovery packet
- Technical Steering packet
- relevant PRDs, capability matrices, architecture, ADRs, standards, and
  design-system or permission guidance named by steering

Consumers:

- Task Breakdown
- PRD-derived test-case planning and implementation
- implementation blueprinting
- Product Request cover sheets
- branch and commit governance
- downstream delivery planning

Story Breakdown must preserve Technical Steering classifications rather than
re-deciding architecture posture. For bucket-layout purposes, each packet
should be classified by what it breaks down, not by the artifact type alone.
Existing Story Breakdown packets should not be physically migrated just to
change format.

## Task Breakdown Packet Posture

Task Breakdown packets are cross-bucket delivery handoff artifacts.

Current posture:

- artifact type: cross-bucket delivery handoff artifact
- bucket owner: determined by the source story and subject being delivered
- producing machinery: `discovery-harness`, through `task-breakdown-maintainer`
- current physical homes:
  - `docs/workspace/task-breakdown/`
  - story-local task breakdowns under
    `docs/workspace/story-breakdown/<epic-slug>/stories/<story-slug>/`
- validation:
  `npm run task-breakdown:validate -- <packet-path> --story <story-packet-path>`
- move readiness: not ready for physical relocation while validation tooling,
  Layer 5 delivery scripts, skills, templates, and downstream references expect
  the current folders

Authority:

- stable task IDs
- isolated delivery task boundaries
- allowed write sets and forbidden work
- branch, worktree, and bootstrap strategy
- task-type guardrail checks
- required artifacts and proof commands
- Layer 5 delivery handoff status

Inputs:

- validated Story Breakdown packet
- selected story marked `ready-for-task-breakdown`
- story acceptance criteria, capability rows, proof obligations, dependencies,
  artifact ledger, and blockers from Story Breakdown
- git workflow guardrails

Consumers:

- Layer 5 delivery scripts and run records
- branch and commit governance
- implementation work
- proof and closeout commands
- Product Request cover sheets
- implementation blueprinting when a story has already been split into tasks

Task Breakdown must not redefine story scope, acceptance criteria, product
intent, or Technical Steering architecture. For bucket-layout purposes, each
packet should be classified by the story and subject it delivers, not by the
artifact type alone. Existing Task Breakdown packets should not be physically
migrated until Layer 5 tooling and legacy path compatibility are planned.

## Implementation Blueprint Posture

Implementation Blueprints are cross-bucket implementation-planning artifacts.

Current posture:

- artifact type: cross-bucket implementation-planning artifact
- bucket owner: determined by the feature slice, route family, capability
  group, or vertical slice being planned
- producing machinery: `discovery-harness`, through
  `implementation-blueprint-maintainer`
- current physical home: `docs/workspace/implementation-blueprints/`
- move readiness: not ready for physical relocation while skills, templates,
  standards, and downstream planning references expect the current folder

Authority:

- repo-shaped build plan for an approved slice
- expected owning feature, route family, UI surface, or capability group
- expected files, modules, migrations, manifests, docs, and tests
- required cross-feature seams and platform seams
- authz seed and default role-grant implications when protected behavior is in
  scope
- artifact completeness and verification expectations before code starts

Inputs:

- approved capability matrix rows
- PRD or PRD refinement
- Story Breakdown packet and approved story when the change has gone through
  Technical Steering
- Task Breakdown packet when the approved story has already been split into
  isolated delivery tasks
- exact ADR discovery results
- current architecture, feature conventions, API contracts, data dictionaries,
  permission mappings, and PRD-derived test cases when relevant

Consumers:

- implementation planning
- Task Breakdown and Layer 5 delivery preparation
- API contract maintenance
- data dictionary maintenance
- PRD-derived test planning
- rebuild readiness
- AI-assisted change review
- standards and artifact-completeness reviews

Implementation Blueprints must not invent story scope, delivery task
isolation, product intent, or architecture decisions. For bucket-layout
purposes, each blueprint should be classified by the slice it plans, not by the
artifact type alone. Existing blueprints should not be physically migrated
until lookup behavior for the current folder and future bucket homes is
planned.

## API Contract Posture

API contracts are cross-bucket backend/platform contract artifacts.

Current posture:

- artifact type: cross-bucket backend/platform contract artifact
- bucket owner: determined by the route family, feature, capability group, or
  public/backend seam being described
- producing machinery: `discovery-harness`, through `api-contract-maintainer`,
  when the work is artifact maintenance
- current physical home: `docs/api-contracts/`
- related maintained artifacts:
  - `docs/swagger/openapi.yaml`
  - `docs/postman/collections/*.postman_collection.json`
- move readiness: not ready for physical relocation while skills, standards,
  Layer 5 artifact obligations, OpenAPI/Postman references, tests, and rebuild
  docs expect the current folders

Authority:

- source-independent backend route contract truth
- route family and capability scope
- HTTP methods and paths
- request params, query, body, and validation rules
- success, status, and error response shapes
- authentication, authorization, root, tenant, public, and middleware boundary
  behavior
- persistence, audit, side-effect, compatibility, lifecycle, and traceability
  notes where contract-visible

Inputs:

- `AGENTS.md`
- architecture docs and ADRs
- change-artifact requirements
- current runtime source and executable tests
- PRDs and PRD-derived test cases
- OpenAPI, feature docs, existing API contract docs, implementation blueprints,
  and relevant middleware behavior

Consumers:

- backend implementation and compatibility planning
- frontend and browser-session consumers
- OpenAPI and Postman maintenance
- PRD-derived test planning and implementation
- issue reconciliation and mock-honesty checks
- data dictionary and permission mapping maintenance
- Layer 5 artifact-obligation checks
- rebuild-from-spec and compliance reviews

API contracts are not ordinary documentation. They record the backend behavior
that callers may rely on. OpenAPI and Postman artifacts may mirror or exercise
that truth, but they do not replace the human-readable contract when
middleware, browser sessions, auth failures, tenant/root/public boundaries, or
cross-feature seams materially affect behavior. For bucket-layout purposes,
each API contract should be classified by the route family or feature seam it
describes, not by the artifact type alone. Physical moves require compatibility
planning for old links, maintained machine-readable artifacts, and downstream
tool lookup. API contracts should eventually be discoverable through the
artifact-type index because their canonical home may become bucket-owned while
consumers still need to find all API contract artifacts by type.

## Data Dictionary Posture

Data dictionaries are cross-bucket durable-data contract artifacts.

Current posture:

- artifact type: cross-bucket durable-data contract artifact
- bucket owner: determined by the owning entity, domain, feature, durable
  record, or lifecycle being documented
- producing machinery: `discovery-harness`, through
  `data-dictionary-maintainer`, when the work is artifact maintenance
- current physical home: `docs/data-dictionary/`
- current type-local index: `docs/data-dictionary/index.md`
- validation and health: `npm run data:compliance-health`
- move readiness: not ready for physical relocation while skills, standards,
  Layer 5 artifact obligations, validators, compliance-health checks, and
  rebuild docs expect the current folder

Authority:

- source-independent durable entity and persistence contract truth
- owning feature and capabilities that rely on the entity
- storage model, tables, durable records, fields, indexes, and constraints
- normalization, uniqueness, searchable-storage, lifecycle, and mutation
  semantics
- migration compatibility and live-schema alignment notes
- cross-feature read seam model when applicable
- data classification, privacy, security, audit, retention, cleanup,
  export/delete, legal-hold, and operational-evidence posture
- compliance and enforcement trace

Inputs:

- `AGENTS.md`
- architecture docs and ADRs
- change-artifact requirements
- migrations, persistence types, repositories, domain services, transport
  routes, contract errors, feature seams, and executable tests
- existing data dictionary entries
- API contracts, PRDs, PRD-derived test cases, permission mappings,
  implementation blueprints, standards, privacy, operations, and
  platform-status docs when relevant

Consumers:

- backend persistence and migration planning
- API contract maintenance when data shape is API-visible
- permission mapping when data access or tenant boundaries are sensitive
- PRD-derived test planning and implementation
- issue reconciliation and mock-honesty checks
- Layer 5 artifact-obligation checks
- standards, compliance, production-readiness, and rebuild-from-spec reviews

Data dictionaries are not ordinary field lists. They record durable data truth
that future implementation, audits, compliance review, and rebuild-from-spec
work may rely on. For bucket-layout purposes, each data dictionary entry should
be classified by the entity, domain, feature, durable record, or lifecycle it
documents, not by the artifact type alone. Physical moves require
compatibility planning for old links, the current type-local index,
compliance-health lookup, validators, and downstream tool references. Data
dictionaries should eventually be discoverable through the artifact-type index
because their canonical home may become bucket-owned while consumers still need
to find all data dictionary artifacts by type.

## Permission Mapping Posture

Permission mappings are platform-owned source-independent authorization
contract artifacts.

Current posture:

- artifact type: platform-owned authorization contract artifact
- primary bucket: `platform`
- governance rules: `shared-governance-kernel`
- current canonical home: `docs/architecture/permission-mappings/`
- archived export snapshot home:
  `docs/workspace-buckets/archive-history/permission-mapping-exports/`
- producing machinery: `discovery-harness`, through `DOC:permission-mapping`
  task work and permission-mapping guardrails, when the work is artifact
  maintenance
- move readiness: canonical Markdown remains in place; stale CSV exports were
  archived after reference updates

Authority:

- source-independent authorization model truth
- backend capability to authz capability mapping
- role to authz capability mapping
- capability status such as `current`, `target`, `architecture-target`, or
  `blocked`
- authority world such as root, tenant, system, public, support, emergency, or
  shared-cross-tenant only with explicit approval
- grant source posture such as documentation-only, seed-backed,
  corrective-migration-backed, runtime-enforced, or blocked
- tenant context, object/lifecycle boundary, cross-tenant deny, safe denial,
  audit/proof, and UI eligibility expectations

Inputs:

- `AGENTS.md`
- authorization ADRs and architecture docs
- Technical Steering and approved authz model sources
- capability matrices, PRDs, API contracts, data dictionaries, implementation
  blueprints, feature manifests, migrations, runtime enforcement evidence, and
  executable allow/deny tests when relevant

Consumers:

- backend authorization and protected route planning
- grant seed and corrective migration planning
- API contract authn/authz wording
- data dictionary tenant/object-boundary alignment
- frontend/UI eligibility checks
- PRD-derived permission and security test planning
- Task Breakdown `DOC:permission-mapping` guardrails
- Layer 5 artifact-obligation checks
- standards, compliance, production-readiness, and rebuild-from-spec reviews

Permission mappings are not ordinary documentation and are not merely bucketed
by the feature that caused a row to exist. They define platform access-control
truth that runtime authorization, role grants, API contracts, data
dictionaries, UI eligibility, and tests must align with. A feature- or
harness-specific protected capability may create or update a permission row,
but the permission mapping artifact remains platform-owned security posture.
The rules for maintaining permission mappings belong to shared governance; the
mapping artifacts themselves belong to the platform bucket. Physical moves
require compatibility planning for old links, architecture references,
workspace exports, validation/tool lookup, and downstream security evidence.
Permission mappings should eventually be discoverable through the artifact-type
index because consumers need to find all authorization mapping artifacts by
type even if supporting evidence or future references become bucket-scoped.

## QA Evidence And Test-Run Summary Posture

QA evidence and test-run summaries are cross-bucket proof artifacts.

Current posture:

- artifact type: cross-bucket proof/evidence artifact
- bucket owner: determined by the slice, gate, defect, workflow, standard, or
  harness behavior being proven
- possible bucket classifications:
  - `platform` for backend, runtime, security, permission, persistence,
    migration, or tenant-boundary proof
  - `frontend-harness` for design-system, visual, browser, accessibility, or
    app-adoption proof
  - `discovery-harness` for planning-harness, interview, artifact-generation,
    or product-builder proof
  - `shared-governance-kernel` for repo-wide standards, release-gate, or
    compliance evidence
  - `archive/history` when retained only as historical proof and no longer
    used as active gate truth
- current known homes:
  - `docs/workspace/test-run-summaries/`
  - issue reconciliation and runtime evidence notes under `docs/workspace/`
  - task-packet evidence sections for `EVIDENCE:qa-evidence`
  - frontend/design-system verification artifacts when applicable
- validation and summaries:
  - `npm run qa:evidence-summary -- <task-packet-path>`
  - `npm run test:coverage-strength` when required by the scoped task
- move readiness: not ready for physical relocation while standards, runtime
  bug-fix gates, Task Breakdown, Layer 5 tooling, frontend verification, and
  issue-reconciliation workflows expect current evidence paths and formats

Authority:

- proof target and command plan
- deterministic test or proof command results
- runtime/live data/API/process/served-asset evidence when required
- mock-honesty or fixture-honesty evidence
- screenshot, browser, accessibility, or visual verification evidence when
  applicable
- evidence status, remaining gap, waiver, quarantine, or blocked posture
- curated source-controlled run summary when used as blocking-gate,
  standards-evidence, reusable QA example, audit trail, or release-gate proof

Inputs:

- Task Breakdown `EVIDENCE:qa-evidence` rows
- runtime bug-fix evidence requirements
- issue reconciliation notes
- PRD-derived test cases and executable test results
- QA coverage matrix, QA release gate, and standards requirements
- frontend/design-system verification artifacts when the proof is visual or
  browser-facing
- live runtime, API, persistence, process, served-asset, fixture, screenshot,
  or command outputs when required

Consumers:

- Task Breakdown and Layer 5 closeout
- issue reconciliation
- runtime bug-fix verification
- PRD-derived test lifecycle review
- frontend/design-system signoff and app-adoption parity review
- standards, compliance, production-readiness, and release-gate reviews
- future audits that need to know what was proven, when, and by which evidence

QA evidence is not one stable source-of-truth category. Active evidence proves
a current gate, defect fix, signoff, or standards claim. Historical evidence
records what was checked at a point in time. For bucket-layout purposes, each
evidence artifact should be classified by what it proves and whether it is
still active gate truth or only archive/history. Physical moves require
compatibility planning for task-packet references, test-run summary paths,
runtime evidence links, screenshots, standards evidence, and downstream audit
lookup. QA evidence and test-run summaries should eventually be discoverable
through the artifact-type index because review workflows often need to find
all proof records by type even when canonical evidence homes are bucket-owned.

## Decision Evidence Posture

Decision evidence is shared-governance-kernel accountability infrastructure.

Current posture:

- artifact type: repo-wide decision and evidence registry artifact
- primary bucket: `shared-governance-kernel`
- current physical home: `docs/workspace/decision-evidence/`
- current registry files:
  - `decision-registry.json`
  - `evidence-packet-registry.json`
- validation: `npm run decision-evidence -- validate`
- current storage posture: `repo_artifact_until_capabilities_exist`
- future migration target:
  - `decision_entity_capabilities`
  - `evidence_packet_entity_capabilities`
- move readiness: not ready for physical relocation while git closeout
  standards, validators, scripts, and planning artifacts expect the current
  registry root

Authority:

- material decision record
- status such as draft, needs review, reviewed, approved, superseded, or
  deferred
- source references and proof statements
- actor, review, and approval metadata
- evidence packet records
- links between evidence packets and source decisions
- decision relations such as supports, clarifies, narrows, expands,
  supersedes, conflicts with, or implements

Inputs:

- material Codex or human decisions
- approvals, deferrals, constraints, model-shape decisions, migration postures,
  design-system signoffs, provenance rules, and implementation constraints
- real source refs such as repo paths, commit SHAs, runtime observations,
  persistent chat/transcript identifiers, or manual notes
- evidence packets and artifacts that support or implement decisions

Consumers:

- git workflow closeout
- Technical Steering, Story Breakdown, and Task Breakdown decision/evidence
  fields
- audits that need to trace why a rule, posture, or artifact changed
- future platform/runtime decision and evidence capabilities
- cross-chat and cross-machine continuity

Decision evidence is not bucketed by the subject of each decision as a physical
storage rule today. Individual decisions may apply to `platform`,
`discovery-harness`, `frontend-harness`, `shared-governance-kernel`, or
`archive/history`, but the registry itself remains central shared governance
until the planned decision/evidence capabilities exist. Physical moves require
compatibility planning for the script default root, validation command,
registry links, and planning-artifact references. Decision evidence should
eventually be discoverable through the artifact-type index, but it should not
be split into bucket-local editable registries without a stronger platform
capability or compatibility plan.

## Future Physical Migration Principle

Do not use editable duplicate artifacts as the default migration strategy.

When physical artifact moves begin, prefer one canonical artifact plus a
compatibility bridge:

- move the editable source of truth to the approved canonical bucket path
- keep the old path working through a small moved-file stub or an alias
  registry
- update tools and skills to resolve old and new paths during transition
- validate that old and new access paths resolve to the same canonical truth
- remove legacy paths only after an explicit cutover decision

Editable twin copies are allowed only as a temporary exception when explicitly
approved. If used, one copy must be marked canonical, the other must be marked
as generated or mirrored, drift checks must prove equivalence, and the removal
condition must be recorded before the twin exists.

Do not build migration tooling or a dedicated migration skill until the target
bucket layout and repeated move pattern are clearer.

### Breadcrumb Lifecycle Rule

Breadcrumbs are temporary migration aids, not permanent architecture.

A breadcrumb may be left at a legacy path when an artifact is moved,
superseded, archived, or split and old references may still exist.

Every breadcrumb must state:

- new canonical home, or the homes used when the artifact split
- status: moved, superseded, archived, or split
- why the breadcrumb exists
- what compatibility it preserves
- what must be true before the breadcrumb can be deleted

Breadcrumbs must be removed during the final docs cleanup sweep once:

- maintained references have been updated
- scripts, skills, templates, and tests no longer depend on the legacy path
- old path compatibility is no longer intentionally supported

The goal is a clean, well-structured, well-boundaried `/docs` tree. Breadcrumbs
exist only to make the transition safe and traceable.

Useful-but-stale examples should use archive-then-breadcrumb by default. Keep
the original example visible under `docs/workspace-buckets/archive-history/`
while replacing the old active-looking path with a breadcrumb that points to
the archived original and the current maintained guidance.

Draft design notes whose reusable rules have already been promoted should use
the same archive-then-breadcrumb pattern. The original note remains available
as design history, while active guidance points to the promoted template,
README, skill, standard, or architecture document.

## Future Bucket Skeleton

The desired bucket-first documentation skeleton now exists under
`docs/workspace-buckets/`.

These folders are destination contracts, not evidence that legacy
`docs/workspace/` artifacts have moved:

- `docs/workspace-buckets/platform/`
- `docs/workspace-buckets/discovery-harness/`
- `docs/workspace-buckets/frontend-harness/`
- `docs/workspace-buckets/shared-governance-kernel/`
- `docs/workspace-buckets/archive-history/`
- `docs/workspace-buckets/unsure-needs-decision/`

Each bucket folder starts with a README that defines its intended ownership
boundary, non-goals, move prerequisites, and breadcrumb expectations. Existing
artifact paths remain authoritative until a future inspected migration moves or
promotes specific files.

## PRD Posture

PRDs are cross-bucket behavioral source-of-truth artifacts.

Current posture:

- artifact type: cross-bucket behavioral source-of-truth artifact
- bucket owner: determined by the subject and purpose of the specific PRD
- current physical home: `docs/prd/`
- related current homes: `docs/prd/test_cases/` and
  `docs/prd/journey_inventories/`
- move readiness: not ready for physical relocation while tooling, standards,
  and downstream references expect the current folders

Authority:

- intended behavior and scope
- actors and requirements
- acceptance criteria and product/system rules
- source truth for PRD-derived test cases
- behavioral input to implementation blueprints, story/task breakdown, data
  dictionaries, and compliance reviews

PRDs are outside the immediate `docs/workspace` Level 2A physical-layout scope,
but they must be included in the Level 2B repo-wide docs destination model.
New PRDs should continue using `docs/prd/` until that model is approved.

## PRD-Derived Test Case Posture

PRD-derived test cases are cross-bucket verification source-of-truth artifacts.

Current posture:

- artifact type: cross-bucket verification source-of-truth artifact
- bucket owner: determined by the source PRD and subject being tested
- current physical home: `docs/prd/test_cases/`
- move readiness: not ready for physical relocation while ADRs, scripts,
  skills, and validation expect the current folder

Authority:

- planned verification inventory
- stable `TC-*` IDs
- lifecycle and status of planned test cases
- traceability between PRD intent and executable proof

Producer:

- `prd-test-case-planner`

Consumers:

- `prd-test-case-implementer`
- test traceability and coverage scripts
- Task Breakdown validation
- issue reconciliation
- standards, repo-health, production-readiness, and AI-assistance reviews

PRD-derived test cases are not ordinary testing notes. They are reviewed
change-control artifacts. Any future move must be planned with the PRD
destination strategy in the Level 2B repo-wide docs destination model.

## Future Artifact-Type Index Target

When bucket-first canonical homes exist, add a top-level artifact-type index
to help humans and LLMs find artifacts by type when the owning bucket is not
yet known.

Example future home:

```text
docs/artifact-index/
```

The artifact-type index should complement bucket-first ownership rather than
replace it:

- bucket folders answer "who owns this?"
- artifact-type index pages answer "where are artifacts of this type?"
- legacy paths and compatibility bridges answer "how do old links keep
  resolving during migration?"

Do not create the artifact-type index until enough artifact postures have been
analyzed to define useful pages without guesswork.

## Artifact Types Analyzed In This Pass

This pass recorded postures for the planned Level 2 artifact types above.
Those artifact-type postures came first and did not, by themselves, classify
every `docs/workspace/` folder.

The follow-up folder inventory below then classified the current top-level
`docs/workspace/` folders by inspected purpose, producer or consumer evidence,
authority, likely bucket fit, known gaps or inconsistencies, move risk, and
whether each folder is active source truth or archive/history.

### Workspace Folder Inventory Scope

The folder inventory started from the current top-level `docs/workspace/`
folder list, not from artifact-type assumptions. It compared folders against
folder READMEs, representative files, script references, standards references,
and active-vs-historical usage before assigning a bucket.

Do not classify a folder by name alone.

### Folder Inventory Entry Standard

Folder inventory entries should stay small, but each entry should make the
same decision points visible:

- bucket classification
- inspected evidence
- authority and currentness posture
- cleanup, split, or rule pressure
- move posture

This is not a required table. A short prose entry is enough when those points
are evaluable by a future maintainer.

Progress so far: 35 of the 35 current top-level `docs/workspace/` folders have
been inspected or cross-referenced in this inventory pass. This completes the
folder inventory pass, but it does not make every folder move-ready.

Root-level loose-file cleanup: the four dated traceability and semantic-test
audit files that previously lived directly under `docs/workspace/` were
classified as `archive/history` and moved to
`docs/workspace-buckets/archive-history/traceability-audits/` during the
2026-05-27 cleanup sweep. They had no live references outside themselves.

### Workspace Folder Inventory Decisions

`docs/workspace/architecture-map/` is currently classified as
`shared-governance-kernel`.

Reason: the folder is a repo-wide platform maturity map. Its README describes a
working checklist for enterprise SaaS platform layers, and representative layer
files cover backend platform, frontend design-system, security, data,
operations, and governance status. Current skill and planning references use it
as maintained architecture status truth rather than as a single feature,
frontend, or discovery artifact.

Move posture: do not physically move it yet. Implementation blueprint guidance,
task-breakdown guardrails, frontend architecture guidance, and existing
workspace artifacts still reference the current path, so a future move would
need compatibility updates before relocation.

Follow-up decision on 2026-05-27: do not simply split or archive the
architecture map. The likely target is a shared-context model where each bucket
can carry or clone the architecture-map view it needs for its own workstream
context. That requires updating the relevant skills and upstream/downstream
docs so bucket-specific architecture-map contributions do not fork silently.
Leave the current `docs/workspace/architecture-map/` in place until that
contribution and synchronization contract is designed.

`docs/workspace/harness-audits/` started as `unsure / needs decision`; after
the cleanup sweep it is now an active audit workspace containing only the
folder README and this Level 2 plan.

Reason: the folder is a mixed collection rather than one artifact class. The
inspected files include active governance evidence, draft harness-product
architecture, Product Discovery and Product Request model notes, Product
Request templates/examples, and historical story/task transition records. Some
files are source-truth candidates, some are examples, and some are likely
archive/history, so the folder should not be forced into one confident bucket.

Cleanup pressure: the breadcrumb/link sweep for inspected moved artifacts was
completed on 2026-05-27. Future audit folders should not become the default
home for active contracts, templates, examples, draft product models, and
historical evidence without an explicit promotion or archive path.

Move posture: keep the active Level 2 plan and the folder README here. Moved
historical audit evidence, reusable templates/examples, and promoted discovery
contracts now live in their owning locations.

`docs/workspace/chat-bootstraps/` is currently classified as
`shared-governance-kernel`.

Reason: chat bootstraps are branch/worktree isolation and material-work
start-gate evidence. Existing git workflow guardrails, AGENTS instructions,
task-breakdown examples, and Codex task/split/preflight scripts reference this
folder as the place where a material chat records base commit, branch,
worktree, planned write set, shared seams, and non-goals before edits proceed.

Cleanup pressure: low after the 2026-05-26 README. The folder contract is now
explained where future maintainers will see it before adding or moving
bootstrap records.

Move posture: do not physically move it yet. Script, standards, task-breakdown,
and AGENTS references would need compatibility updates before relocation.

`docs/workspace/chat-records/` is currently classified as
`shared-governance-kernel`.

Reason: chat records are durable cross-chat decision and reconciliation
summaries. The folder README explicitly says they are not replacements for chat
bootstraps; they record conversation facts that may matter later, such as
decisions, concerns, deferred work, rejected interpretations, compliance
questions, and handoff notes.

Cleanup pressure: low. The folder already has a README and a clear boundary.
Keep the caveat that workspace chat records are supplemental summaries, not the
primary transcript truth when a stable transcript source exists.

Move posture: do not physically move it yet. Decision-evidence and
product-discovery evidence records currently reference these paths.

`docs/workspace/archive/` is currently classified as `archive/history`.

Reason: the inspected contents are archived planning artifacts, including an
older tenant-admin capability matrix draft and notes. The notes still contain
useful domain context, but current capability-matrix posture keeps active
matrices under `docs/workspace/capability-matrices/`.

Cleanup pressure: reduced after the 2026-05-26 archive move. The old workspace
archive contents now live under
`docs/workspace-buckets/archive-history/workspace-archive/`. The temporary
breadcrumb was removed during the 2026-05-27 breadcrumb compatibility sweep
after references were checked.

Move posture: completed as an archive/history move. Do not add new active
workspace artifacts under `docs/workspace/archive/`.

`docs/workspace/harness-archives/` is currently classified as
`archive/history`.

Reason: the inspected archive README marks the pre-story/task split harness
snapshot as `historical-snapshot`, explains that it preserves prior harness
authorities, templates, and skills, and explicitly says not to treat archived
files as current harness guidance.

Cleanup pressure: reduced after the 2026-05-26 archive move. The historical
snapshot now lives under
`docs/workspace-buckets/archive-history/harness-archives/`. The temporary
breadcrumb was removed during the 2026-05-27 breadcrumb compatibility sweep
after references were checked.

Move posture: completed as an archive/history move. Keep it available for
reconciliation and rollback analysis through the archive-history path while
live harness truth remains in the current repo paths.

`docs/workspace/preserved-worktrees/` is currently classified as
`shared-governance-kernel`.

Reason: preserved-worktree records are active git/worktree coordination inputs,
not passive archive records. Git workflow standards, tests, and
`src/scripts/gitWorktreeAudit.ts` use this folder to distinguish intentionally
parked stale WIP from unsafe dirty stale-base worktrees.

Cleanup pressure: low after the 2026-05-26 README. The key rule is now explicit:
a marker keeps parked WIP visible while allowing unrelated clean work to
proceed; it does not make that parked work promotable.

Move posture: do not physically move it yet. Script defaults, tests, and
standards references would need compatibility updates first.

`docs/workspace/qa/` is currently classified as `shared-governance-kernel`,
with freshness and enforcement uncertain.

Reason: the folder README defines durable QA operating artifacts such as
feature-loop and release QA checklists, exploratory QA notes, escaped-defect
feedback reviews, waiver/quarantine records, templates, and examples. These
artifacts are cross-cutting quality controls rather than feature-owned runtime
truth.

Cleanup pressure: run a freshness audit before treating every completed record
as current QA truth. The folder is useful, but it may still mix examples and
older completed records whose current enforcement status is unclear.

Cleanup update: on 2026-05-26, the four reusable QA templates were promoted to
`docs/templates/` and temporarily replaced with breadcrumbs at their old
`docs/workspace/qa/` paths. Those breadcrumbs were removed during the
2026-05-27 breadcrumb compatibility sweep after reference checks found no
remaining old-path consumers:

- `qa-checklist-template.md`
- `exploratory-qa-note-template.md`
- `defect-feedback-review-template.md`
- `qa-waiver-or-quarantine-template.md`

Move posture: do not physically move the remaining folder yet. First verify
which completed QA artifacts are still required by the active harness, which
are historical examples, and which need promotion into standards, skills,
validators, or task guardrails.

Current cleanup result: the folder README now records the
`shared-governance-kernel` bucket classification and clarifies that completed
QA records are point-in-time operating evidence unless a current standard,
skill, release gate, or task guardrail still cites them as active behavior.

`docs/workspace/qa-evidence/` is currently classified as
`shared-governance-kernel`, with freshness and enforcement uncertain.

Reason: the inspected evidence records capture concrete runtime, live-data,
browser, and mock-honesty proof for specific task or journey evidence. The
Task Breakdown harness has an `EVIDENCE:qa-evidence` lane, so this folder is
part of shared proof collection rather than ordinary feature docs.

Cleanup pressure: moderate after the 2026-05-26 README. Future work should
still audit whether the active harness consistently writes or requires these
evidence records. Do not assume existing evidence packages still prove current
repo behavior without rerunning or reconciling the relevant commands, live
data, and served assets.

Move posture: do not physically move it yet. Evidence-task guardrails and
downstream story/task artifacts should be reviewed before relocation.

`docs/workspace/test-run-summaries/` is currently classified as
`shared-governance-kernel`, with freshness and enforcement uncertain.

Reason: the folder README defines curated source-controlled summaries of
important test runs that complement raw CI artifacts and remain useful after CI
retention windows expire.

Cleanup pressure: low for folder purpose, but currentness must be checked.
Older summaries should be treated as historical evidence unless they are tied
to an active release gate, current feature loop, or maintained status artifact.

Move posture: do not physically move it yet. First confirm which summaries are
active gate evidence versus retained historical proof.

Current cleanup result: the folder README now records the
`shared-governance-kernel` bucket classification and clarifies that test
summaries are point-in-time evidence unless a current feature loop, release
gate, standard, or review artifact names them as current.

`docs/workspace/issue-reconciliations/` is currently classified as
`shared-governance-kernel`, with freshness and follow-through uncertain.

Reason: the folder README defines a running log of escaped bugs or runtime
defects, why the feature loop missed them, and what changed to prevent repeats.
The folder is tied to the `issue-reconciliation-maintainer` skill and
cross-cutting feature-loop improvement.

Cleanup pressure: audit whether lessons from older reconciliation notes were
actually promoted into tests, standards, skills, templates, or runtime
guardrails. The folder purpose is coherent, but many records are old enough
that unresolved follow-up risks may have gone stale or been superseded.

Move posture: do not physically move it yet. A 2026-05-26 cleanup inspection
found active hardcoded references from AGENTS, the
`issue-reconciliation-maintainer` skill, the frontend design-system loop skill,
`src/scripts/summarizeTestCoverageStrength.ts`, and
`tests/integration/frontend/designSystemArchitecturalFirstHarnessAudit.test.ts`.
This makes the folder an active `shared-governance-kernel` evidence surface,
not just archive/history. A future relocation should first update the skill,
script, test, and standards references or introduce a compatibility adapter.

Current cleanup result: the folder README now records the
`shared-governance-kernel` bucket classification and clarifies that
issue-reconciliation notes become durable operating truth only when their
lessons are promoted into maintained source, tests, standards, skills,
templates, or guardrails.

The following planning and handoff folders were already classified by artifact
type earlier in this plan, and the folder inventory did not change that
posture:

- `docs/workspace/product-discovery/`
- `docs/workspace/product-requests/`
- `docs/workspace/technical-steering/`
- `docs/workspace/story-breakdown/`
- `docs/workspace/task-breakdown/`
- `docs/workspace/capability-matrices/`

Folder-level finding: these folders remain useful current physical homes, but
older packet instances should not be treated as current source truth without a
freshness and enforcement check against the active templates, validators,
skills, standards, and source implementation. Change-local workspace artifacts
are not reusable harness law unless explicitly promoted to durable architecture,
standards, templates, or skills.

Cleanup pressure: reduced after the 2026-05-26 README. The folder now states
that matrices are cross-bucket handoff artifacts and must be classified by
subject before use or relocation.

`docs/workspace/design-system/` is currently classified as `frontend-harness`,
with freshness and migration pressure.

Inspected evidence: the folder README defines this as the working artifact home
for the design-system loop, including behavior locks, principles, patterns,
templates, token reviews, components, adoption notes, verification checklists,
reference packs, component inventory, and promotion framework. Tests, frontend
skills, design-system adoption guards, and planning artifacts reference many of
these paths directly.

Authority/currentness posture: this folder is active governed frontend-harness
truth, not passive documentation. However, currentness must be checked per
family because newer `41-front-end` skill guidance says some legacy
`behavior-locks` are scheduled to migrate to newer standards.

Cleanup pressure: high. The folder is a large governed lab with many artifact
families, so it likely needs indexing and freshness review before any split.
Do not treat all old behavior locks, reference packs, or adoption contracts as
equally current without checking their verification and migration posture.

Move posture: do not physically move it yet. Design-system skills, tests,
adoption guards, visual artifacts, and frontend planning references depend on
the current path.

`docs/workspace/frontend/` is currently classified as a retired split folder
after the 2026-05-26 cleanup.

Initial inspected evidence: before cleanup, the folder had no README and
contained a page-shell planning feature spec, a visual-suite rebucketing plan,
and an entity-management page seam recovery plan. These files had different
purposes and lifecycles: future frontend/platform planning, likely historical
visual-test layout migration, and active frontend-harness recovery/governance.

Authority/currentness posture: mixed and unclear. The folder should not be
treated as a stable frontend source-of-truth home until each file is classified
as active frontend-harness guidance, platform planning, or archive/history.

Cleanup pressure: resolved for this retired folder. The split decisions below
removed the old active-looking workspace folder from the tracked repo.

Move posture: completed as a file-level split. Do not recreate
`docs/workspace/frontend/` unless a future frontend workspace inbox is
explicitly approved.

Follow-up inspection on 2026-05-26 classified and moved the three current files:

- `2026-04-20-visual-suite-second-wave-rebucketing-plan.md` is
  `archive/history`: the plan states the second-wave visual rebucketing is
  complete, and the current `tests/visual/` tree plus `package.json` scripts
  match the target structure. It now lives under
  `docs/workspace-buckets/archive-history/frontend/`.
- `2026-05-21-entity-management-page-seam-recovery-plan.md` remains
  `frontend-harness`: newer design-system guides, standards, skills, and
  Entity Management artifacts carry much of its guidance, but the recovery
  plan should stay as a freshness-review note in
  `docs/workspace-buckets/frontend-harness/entity-management/` until the Entity
  Management artifact chain is audited.
- `page-shell-planning-feature-spec.md` is planned `platform` work with a
  `frontend-harness` dependency: `pageShellPlanning` is referenced by PRD,
  capability-matrix, data-dictionary, and implementation-blueprint artifacts,
  but no `src/features/pageShellPlanning/` implementation exists yet. It now
  lives under `docs/workspace-buckets/platform/page-shell-planning/`.

Move posture: completed as a split. Do not add new mixed frontend records under
the retired mixed frontend workspace path.

`docs/workspace/implementation-blueprints/` was already classified by artifact
type earlier in this plan, and the folder inventory did not change that
posture.

Folder-level finding: the folder remains a useful current physical home for
repo-shaped build plans derived from approved capability matrices, PRDs, and
related artifacts. Its README names the `implementation-blueprint-maintainer`
skill as the intended maintenance path.

Cleanup pressure: check freshness per file. Older blueprints may be historical
after implementation lands, while some draft capability blueprints are
explicitly not implementation-ready.

Move posture: do not physically move it yet. Skills, PRDs, test cases, QA
artifacts, and downstream planning references depend on the current path.

`docs/workspace/decision-evidence/` was already classified by artifact type
earlier in this plan as `shared-governance-kernel`, and the folder inventory did
not change that posture.

Folder-level finding: the folder is active transitional repo-artifact storage
for decision and evidence packet records until persistent runtime capabilities
exist. It has a README, npm command support, and validation expectations.

Cleanup pressure: moderate. The folder is active only if material chats record
decisions and run `npm run decision-evidence -- validate`; otherwise the
registry can lag behind the real decision trail.

Move posture: do not physically move it yet. Script defaults, closeout
standards, registry links, and planning-artifact references depend on the
current path.

`docs/workspace/reviews/` is currently classified as
`shared-governance-kernel`, with freshness and review-scope pressure.

Inspected evidence: the folder contains AI-and-standards review notes,
standards audits, and alignment reviews. The `ai-change-reviewer` skill writes
AI-assisted review notes here, and task/story artifacts reference review files
as closeout or alignment evidence.

Authority/currentness posture: reviews are durable governance evidence, but
they are usually scoped to a point-in-time change or audit. They should not be
treated as current implementation truth without checking the reviewed source
and any follow-up findings.

Cleanup pressure: low after the 2026-05-26 README. The folder now states that
reviews are point-in-time governance evidence and must be reconciled with
current source before being treated as implementation truth.

Move posture: do not physically move it yet. Skills, standards, and downstream
story/task artifacts reference the current path.

`docs/workspace/artifact-alignment/` is currently classified as
`archive/history`.

Initial inspected evidence: the folder contained a Product Request artifact
alignment inventory that recorded validator evidence, target hierarchy,
alignment classifications, recommendations, and drift findings for planning
artifact chains.

Authority/currentness posture: useful governance evidence, but the folder does
not yet prove a stable artifact family. The inspected file looks like a
specific reconciliation inventory rather than an established current source of
truth.

Cleanup pressure: resolved for the inspected file. The dated Product Request
artifact alignment inventory was treated as a one-off historical
reconciliation note, not a recurring active artifact family.

Move posture: completed as an archive/history move during the 2026-05-27
cleanup sweep. The retained files now live under
`docs/workspace-buckets/archive-history/artifact-alignment/`.

Follow-up cleanup on 2026-05-26 added
`docs/workspace/artifact-alignment/README.md`, but the 2026-05-27 cleanup
retired that active folder after deciding the inspected inventory was
historical evidence. Future artifact alignment notes should live with the
owning Product Request, review, or audit unless artifact alignment is
deliberately promoted back into an active recurring artifact family.

`docs/workspace/asset-consumer-decisions/` is currently classified as
`shared-governance-kernel`, with subject-specific asset/security ownership.

Inspected evidence: AGENTS requires an asset consumer decision record before
upload, read, link, display, download, replace, delete, publish, or delivery
changes for user-managed assets. Inspected records define owning entity
relationship, asset kind, visibility, actor permissions, delivery posture,
authz, scanning, checksum/byte verification, accessibility metadata, cleanup,
privacy, audit, and operational requirements.

Authority/currentness posture: these records are asset/security decision gates,
not implementation code. They are active only when reconciled with the current
PRD, API contract, data dictionary, permission mapping, runbook, security tests,
and technical signoff for the consuming feature.

Cleanup pressure: moderate after the 2026-05-26 README. Future file-level
cleanup should still make each decision record's status clear: draft, approved
for planning, approved for task breakdown, technically signed off, superseded,
or historical.

Move posture: do not physically move it yet. Asset decision templates,
standards, task planning, and downstream feature artifacts reference the
current folder.

`docs/workspace/permission-mappings/` is classified as retired.

Inspected evidence: the folder contained spreadsheet-friendly CSV exports of
source-of-truth permission mapping documents under
`docs/architecture/permission-mappings/`.

Authority/currentness posture: these CSV files are not the canonical permission
mapping authority. The README says they cover the live implemented mapping
boundary and have not yet expanded to the newer source-posture schema, so they
must be treated as stale review exports until regenerated or replaced.

Cleanup pressure: resolved for the stale CSV exports. The 2026-05-27 follow-up
inspection found rows that are `current` in the architecture Markdown but still
`target` in the CSV exports, plus newer feature-specific permission mapping
documents that are not represented in the CSV pair.

Move posture: completed as an archive/history move after Gordon chose to
archive the stale CSV exports. Future spreadsheet exports need a controlled
regeneration/export command with a documented freshness check before becoming
active review material again.

Current cleanup result: after the archive move, the empty
`docs/workspace/permission-mappings/` directory was removed from the local
workspace. The tracked CSV exports now live only under archive/history.

`docs/workspace/entity-definitions/` is currently classified as `platform`
planning truth, with cross-bucket handoff behavior.

Inspected evidence: the README defines this as source-independent planning for
durable entity truth that does not yet belong in `docs/data-dictionary/`
because the backing feature and persistence do not exist. It feeds capability
matrices, PRDs, tests, implementation blueprints, and generation/export loops.

Authority/currentness posture: active only while the entity remains pre-code or
not yet represented by the current data dictionary and runtime implementation.
Once implemented, durable entity truth should move to or be reconciled with
`docs/data-dictionary/` and feature-owned source.

Cleanup pressure: high. Draft entity definitions need superseded/retained
status when the implementation or data dictionary becomes authoritative.
The 2026-05-27 follow-up inspection found current data-dictionary pages and
implemented feature source for several families represented by first-draft
entity-definition files. The folder README now warns that first drafts are not
current authority without checking owning feature source and data dictionary
truth.

Move posture: do not physically move it yet. Gordon's 2026-05-27 follow-up
decision: these may need a shared-context or clone-per-bucket model rather than
a simple split, because entity definitions provide context needed by multiple
buckets for different purposes. Still classify each first-draft file as active
upstream planning input, archive/history, or reconcile-into-current-data-
dictionary/feature docs before designing that shared-context model.

Current cleanup result: file-level classification was recorded in
`docs/workspace/entity-definitions/README.md`. The approved form-pattern catalog
is retained as shared context for governed entity/form planning. The first-draft
entity model files are classified as reconcile candidates because implemented
feature source and data-dictionary pages now exist for their owning families.
No files were moved because capability matrices, implementation blueprints, and
Product Discovery notes still reference the current paths.

`docs/workspace/runbooks/` is currently classified as
`shared-governance-kernel`, with platform/operations subject ownership.

Inspected evidence: runbooks define operating rules, incident checks, required
actions, and evidence to record for platform workflows such as public logo
delivery, export bundles, job processing, cleanup, and privacy.

Authority/currentness posture: runbooks are operational guidance, but each file
must be checked against current implementation, scheduler/job posture, ADRs,
and support commands before being treated as live operating truth.

Cleanup pressure: moderate after the 2026-05-26 README. Future file-level
cleanup should still distinguish live runbooks from story-specific planning or
historical operations notes.

Move posture: do not physically move it yet. First classify runbooks by owning
feature/platform subject and live-vs-historical status.

`docs/workspace/imports/` is currently classified as
`shared-governance-kernel` active import inbox, while completed imported
provenance files belong in `archive/history`.

Initial inspected evidence: the folder contained imported Excel workbooks plus
a README. The workbooks were cited by
`docs/workspace/capability-matrices/2026-03-30-root-users-capability-matrix-from-rootuser-v2.3-notes.md`
as the source inputs for a legacy Root Users capability-matrix conversion.

Authority/currentness posture: preserved provenance, not current source truth.
The converted notes explicitly say the generated matrix is a first-pass legacy
conversion and must be reconciled against current PRDs, feature docs, and repo
defaults before being treated as current authority.

Cleanup pressure: reduced after the 2026-05-26 import cleanup. Keep the active
`docs/workspace/imports/` folder as an inbox for current imported source files,
but do not leave completed legacy provenance files there. As of the
2026-05-27 cleanup sweep, the folder contains only `.gitkeep` and `README.md`.

Move posture: the legacy Root Users workbook inputs were moved to
`docs/workspace-buckets/archive-history/imports/root-users-legacy-capability-matrix/`,
and the converted capability-matrix notes were updated to point at the archive
paths. Future imported files should stay in `docs/workspace/imports/` only
while they are active inputs.

`docs/workspace/exports/` is currently classified as
`shared-governance-kernel`.

Inspected evidence: the folder contains a generated capability contract catalog
JSON export plus a 2026-05-26 README. The export is written by the
`capabilityContractCatalog` feature through
`src/features/capabilityContractCatalog/generation/artifact.ts`, with the
default path set to
`docs/workspace/exports/capability-contract-catalog-v1.generated.json` and a
test/controlled override available through `CAPABILITY_CATALOG_ARTIFACT_PATH`.

Authority/currentness posture: generated governance snapshot, not hand-edited
source truth. The owning source is the capability contract catalog
materialization/export flow and its bounded source registry. Treat the JSON as
reviewable generated evidence whose freshness must be checked against the
catalog materialization and drift-audit posture.

Cleanup pressure: moderate after the 2026-05-26 README. Keep the folder while
the generator default path, API contract, feature docs, tests, and operator
workflow still point here.

Move posture: do not physically move it yet. A future bucket move requires a
handoff that updates the generator default path, API/feature documentation, and
any tests or operator workflow relying on the current path.
Gordon's 2026-05-27 cleanup decision: leave `docs/workspace/exports/` in place
for now. Future movement should be handled as a dedicated compatibility task
that updates the generator/API/docs/test/operator references together.

`docs/workspace/branch-stack-reconciliations/` is currently classified as
`shared-governance-kernel`, with closure and freshness pressure.

Inspected evidence: branch-stack reconciliation records document git hygiene,
branch-stack audit findings, preserved refs, stash inventory, cleanup ledgers,
and promotion/replay safety decisions. `src/scripts/gitBranchStackAudit.ts`
uses this folder as its default reconciliation directory, `package.json`
exposes it through `git:branch-stack-audit`, and unit tests reference records
under this path.

Authority/currentness posture: active when tied to a current branch-stack,
worktree, or promotion cleanup decision. The folder contains two artifact
types: machine-readable reconciliation records and human cleanup ledgers.
Machine-readable records must include exact `Branch`, `Head Commit`,
`Disposition`, and `Accounted By` Markdown fields; the script currently
recognizes only `superseded-by-current` and `intentionally-parked`
dispositions. Human ledgers may remain useful evidence, but they do not satisfy
branch-stack accounting unless they include the parser-visible fields.

Cleanup pressure: moderate after the 2026-05-26 README. Future cleanup should
retire or archive closed ledgers only after the associated refs, stashes, or
promotion risks are no longer active.

Move posture: do not physically move it yet. Script defaults, tests, and git
workflow standards reference the current path.

`docs/workspace/blogs/` is currently classified as `archive/history`.

Inspected evidence: the original folder README said it stored draft blog ideas,
outline-first drafts, talking points, audience notes, and repeatable prompts
for turning repo progress into posts. The `blog-accountability-partner` skill
referenced these files as communication source material.

Authority/currentness posture: useful learning and communication memory, but
not platform, discovery, frontend, or governance source truth.

Cleanup pressure: reduced after the 2026-05-26 archive move. Existing blog
drafts now live under `docs/workspace-buckets/archive-history/blogs/`, and the
dormant blog skill now points to the archive-history location for any
explicitly requested future use. The temporary breadcrumb was removed during
the 2026-05-27 breadcrumb compatibility sweep after references were checked.

Move posture: completed as an archive/history move. Do not recreate active
blog workspace content unless a renewed publishing workflow is approved.

`docs/workspace/layer5-pilots/` is currently classified as
`archive/history`.

Inspected evidence: the original folder contained one Layer 5 delivery pilot
for the chat interface root-admin MVP. It defined delivery-task sequencing,
pilot rules, KPI interpretation, route-away boundaries, and task closure
posture before the formal scripted Layer 5 runner existed.

Authority/currentness posture: historical pilot evidence. The active Layer 5
source of truth now lives in `src/scripts/layer5/`,
`docs/workspace/layer5-task-runs/README.md`, task-breakdown validation, and
task-type contract artifacts. The pilot's durable ideas have either graduated
into those active surfaces or remain feature-specific historical sequencing
for the chat-interface delivery flow.

Cleanup pressure: reduced after the 2026-05-26 archive move. The pilot file now
lives under `docs/workspace-buckets/archive-history/layer5-pilots/`. The
temporary breadcrumb was removed during the 2026-05-27 breadcrumb
compatibility sweep after Layer 5 run-record references were updated.

Move posture: completed as an archive/history move. Do not add new active
Layer 5 rules under a pilot folder; promote enduring rules
into the active Layer 5 harness instead.

`docs/workspace/layer5-task-runs/` is currently classified as
`shared-governance-kernel`.

Inspected evidence: the folder README defines script-created Layer 5 task run
records, the `npm run layer5:task` and `npm run layer5:closeout` contracts,
run-record fields, closeout result codes, write-set enforcement, task-type
plugin ownership, and script-hardening expectations. Source scripts and tests
reference this folder directly.

Authority/currentness posture: active delivery-harness evidence. Individual
run records prove delivery readiness and command execution posture for a
particular task run; they do not by themselves prove a product feature is
complete forever.

Cleanup pressure: moderate. The README is strong, but older run records should
be read as point-in-time evidence unless connected to current closure status.

Move posture: do not physically move it yet. Layer 5 script defaults, tests,
and artifact-obligation logic depend on the current path.

`docs/workspace/retrospectives/` is currently classified as
`archive/history`, with shared-governance learning value.

Inspected evidence: retrospective files record lessons from delivered feature
or frontend adoption loops, including artifact drift, test traceability gaps,
permission-mapping misses, and design-system adoption risks. Harness audits
reference them as learning inputs. A 2026-05-26 README now states their
archive/history posture and promotion boundary.

Authority/currentness posture: durable lesson memory, not current executable
harness truth. A retrospective lesson becomes active governance only when
promoted into standards, skills, validators, tests, templates, or architecture
guidance.

Cleanup pressure: reduced after the 2026-05-26 archive move. Existing
retrospectives now live under
`docs/workspace-buckets/archive-history/retrospectives/`. The temporary
breadcrumb was removed during the 2026-05-27 breadcrumb compatibility sweep
after references were updated.

Move posture: completed as an archive/history move. Future work can still
audit whether specific lessons have been promoted into active guardrails, but
new active governance should be recorded in standards, skills, validators,
tests, templates, or architecture guidance instead of this folder.

`docs/workspace/task-registry/` is currently classified as
`shared-governance-kernel`.

Inspected evidence: the folder README defines the machine-readable anchor for
the repo's Codex task lifecycle workflow, including generated task inventory,
task start recommendations, retirement, tangent split, task-aware promotion,
and review/push helpers. `src/scripts/lib/codexTaskRegistry.ts` defines the
generated JSON path under this folder.

Authority/currentness posture: active git/task lifecycle machinery. The
generated JSON is current only to the last registry generation run, so it
should be refreshed before being used for high-confidence task decisions.

Cleanup pressure: low after the 2026-05-26 README update. The generated
artifact now has an explicit freshness warning for audit, promotion, and
retirement decisions.

Move posture: do not physically move it yet. Task lifecycle scripts and
standards references depend on the current path.

## Plan Review Findings

The inventory is now complete enough to support a human-paced execution pass,
and the cleanup posture is now more decisive than the initial audit posture.

Archive historical records decisively. Keep folders in `docs/workspace/` only
when they are active working areas, current handoff surfaces, or still
referenced by executable tooling. If a folder is retained only because
scripts/tests reference its path, mark it as an active relocation candidate
with the required handoff. Physical relocation still requires a compatibility
pass for script defaults, standards references, skills, tests, generated
artifacts, and existing document links.

Earlier folder entries sometimes use "Reason" where later entries use the more
explicit "Inspected evidence" and "Authority/currentness posture" labels. This
is acceptable for this audit note; future cleanup can normalize wording only
where it improves maintainability. Do not turn the whole inventory into a large
table unless the table changes allowed behavior or prevents a real drift mode.

The highest-risk cleanup candidates are:

1. `docs/workspace/exports/`

Reason: this folder requires a generator/API/operator handoff before the
current path can be retired.

`docs/workspace/imports/` was removed from this remaining-risk list during the
2026-05-27 cleanup sweep because it now contains only `.gitkeep` and a README;
the completed legacy provenance files already live under `archive/history`.

`docs/workspace/harness-audits/` was removed from this remaining-risk list
during the 2026-05-27 cleanup sweep because the folder now contains only its
README and this active Level 2 plan.

### First Cleanup Inspection: `docs/workspace/harness-audits/`

The first cleanup inspection found 12 markdown files and no folder README.
That inspection showed the folder mixed at least five artifact kinds:

- active audit plan:
  `2026-05-25-repo-bucket-layout-level-2-plan.md`
- historical audit and reconciliation evidence:
  `2026-04-29-lessons-led-agentic-harness-audit.md`,
  `2026-04-29-story-task-split-reconciliation-audit.md`, and
  `2026-05-05-harness-compliance-reconciliation.md`
- old or possibly still-influential harness design locks:
  `2026-04-29-story-task-layer-design-lock.md`
- active or semi-active Product Request model/template material:
  `2026-05-06-product-request-backlog-model.md` and
  `product-request-template.md`
- Product Request examples:
  `2026-05-06-product-request-example-chat-interface.md` and
  `2026-05-06-product-request-example-loop-observability-kpi.md`
- ambiguous harness-product direction records:
  `2026-05-05-harness-platform-boundary-map.md`,
  `2026-05-05-product-discovery-change-routing-extension.md`, and
  `2026-05-06-layer-one-runtime-contract.md`

Cleanup decision: add a narrow README first. The README should not classify
or move every existing file. Its first job is to stop future drift by saying
that this folder is for audit and reconciliation notes, while active templates,
examples, reusable harness rules, and architecture decisions should be
promoted to their owning standards, skills, templates, architecture docs, or
artifact folders.

Follow-up decision: do not archive
`2026-05-05-harness-platform-boundary-map.md` as ordinary history. Its subject
is future harness-product architecture. It touches both `discovery-harness`
and `shared-governance-kernel`, so leaving it in active `harness-audits/`
would keep the mixed-bag problem alive, but assigning it directly to one
confident owner would create fake certainty.

Cleanup update: it was first moved to `unsure / needs decision` with a
breadcrumb, then classified by Gordon on 2026-05-26 as `discovery-harness`
future product/workstream material. Its current bucket path is
`docs/workspace-buckets/discovery-harness/harness-platform-boundary-map/`.

Follow-up decision: archive and breadcrumb
`2026-04-29-story-task-layer-design-lock.md`. Inspection on 2026-05-26 found
that its useful behavioral rules have already been promoted into the active
Story Breakdown and Task Breakdown skills, the change-artifact standard, the
Story Breakdown test design guide, and related templates. Keep the original as
`archive/history` design evidence, but do not leave it in `harness-audits/` as
if it is current harness law.

Follow-up decision: split and promote
`2026-05-06-layer-one-runtime-contract.md`. It was a mixed
`discovery-harness` artifact: behavioral runtime rules plus
request/response/state contract reference. Behavioral rules such as "LLM is a
proposer only", validation before persistence, client context not being
authority, safe fallback behavior, and failure handling should be promoted into
Product Discovery skill or future Layer One runtime skill instructions before
the file moves. The remaining request/response/state contract should later
move to a durable Product Discovery or discovery-harness docs home, with
downstream API, data dictionary, Product Request, and PRD references updated at
the same time.

Closeout update: this split has started. Behavioral runtime rules were promoted
to the Product Discovery maintainer skill, the durable contract was promoted to
`docs/product-discovery/layer-one-runtime-contract.md`, and the old
workspace harness-audits path was replaced with a breadcrumb.

Follow-up cleanup update: the old Layer One runtime breadcrumb was removed
during the 2026-05-27 breadcrumb compatibility sweep after maintained
references were updated.

Follow-up cleanup update: on 2026-05-26, the dated historical harness audit
and reconciliation notes were archived to
`docs/workspace-buckets/archive-history/harness-audits/`. The temporary
breadcrumbs left at the old paths were removed during the 2026-05-27
breadcrumb compatibility sweep:

- `2026-04-29-lessons-led-agentic-harness-audit.md`
- `2026-04-29-story-task-split-reconciliation-audit.md`
- `2026-05-05-harness-compliance-reconciliation.md`

The compliance reconciliation note had status `needs-reconciliation`, but its
named active `codex/*` branches were no longer present locally during cleanup,
so it was archived as historical compliance evidence rather than retained as a
current blocker.

Follow-up decision resolved: on 2026-05-26, Gordon chose option B for
`2026-05-05-harness-platform-boundary-map.md`. It is classified as
`discovery-harness` future product/workstream material and moved to
`docs/workspace-buckets/discovery-harness/harness-platform-boundary-map/`.
The temporary breadcrumb at the old `harness-audits/` path was removed during
the 2026-05-27 breadcrumb compatibility sweep. Treat it as a future Product
Discovery or Technical Steering candidate for a portable repo-mapping harness,
not as current Kanbien repo law.

Cleanup pause point: after this cleanup pass, `docs/workspace/harness-audits/`
is intentionally left with its README and this active plan only.

## Morning Review Queue

Recorded during the 2026-05-27 overnight continuation.

No unresolved overnight review decision remains for the folders covered in this
pass. Permission mapping CSV exports were archived, entity definitions were
classified file-by-file, and workspace exports were left in place pending a
future compatibility task.

Additional safe cleanup completed while Gordon was away: every first-level
`docs/workspace/*/README.md` now has an explicit repo bucket classification
sentence. The top-level workspace README now states that those classifications
are cleanup aids, not permission to move folders without reference, generator,
skill, script, test, and downstream-artifact checks.

## Breakfast Review Queue

Recorded during the 2026-05-27 safe continuation while Gordon was away.

1. Architecture-map shared-context model:
   resolved. Gordon prefers cloned or projected architecture-map views so each
   bucket can stand alone. This still needs skill and upstream/downstream doc
   updates before any physical split, so bucket-local maps do not fork silently.
2. Entity-definition shared-context model:
   resolved directionally. Entity-definition context should follow the same
   standalone-bucket principle as the architecture map, but stale first drafts
   must be reconciled before cloning so buckets receive trustworthy context.
3. QA and issue-reconciliation freshness:
   approved. The safe next audit is to sample older QA records and
   issue-reconciliation notes to see which lessons were promoted into tests,
   standards, skills, templates, or runtime guardrails.
4. Active harness folders:
   updated. `deployment-harness` moved to
   `docs/workspace-buckets/deployment-harness/` on 2026-05-27 as its own
   compatibility task with an old-path breadcrumb. Leave `design-system` in
   place while active work is ongoing unless a separate compatibility task
   approves that move.

## QA And Issue-Reconciliation Sample

Recorded during the 2026-05-27 safe continuation.

Inventory size:

- `docs/workspace/qa/`: 17 non-README files.
- `docs/workspace/issue-reconciliations/`: 146 non-README files.

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-18-frontend-human-review-guard-hook-gap.md`
  shows a strong promotion pattern: the lesson was carried into a shared
  Playwright helper, design-system visual tests, the frontend design-system
  loop skill, and the issue-reconciliation skill. However, the record still
  says `candidate fix awaiting user confirmation`, so status freshness should
  be checked before treating it as closed.
- `docs/workspace/qa/2026-04-25-asset-foundation-v1-qa-waiver-or-quarantine.md`
  shows an unresolved production-readiness caveat: provider contract tests and
  Postgres-backed persistence proof were required before production provider
  rollout or customer-facing asset upload UI. This should remain visible until
  an assets/provider readiness pass proves or supersedes it.
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-primary-nav-overflow-menu-drift.md`
  names a direct test hardening response and follow-up watch items, which makes
  it useful learning evidence but still worth checking against current
  design-system navigation tests before closure.
- `docs/workspace/issue-reconciliations/2026-05-23-count-card-route-alias-fallback.md`
  is a newer runtime-process freshness example: it distinguishes source/test
  changes from the live user-facing process, so it should remain available as a
  runtime verification guardrail input.

Finding: do not archive or bulk-move QA and issue-reconciliation folders yet.
They contain a mixture of promoted lessons, unresolved caveats, and historical
evidence. The next safe cleanup is to add or generate a lightweight freshness
index that marks sampled records as `promoted`, `unresolved`, `historical`, or
`needs-recheck` without changing the underlying records.

Current cleanup result: added
`docs/workspace/qa/2026-05-27-qa-and-issue-reconciliation-freshness-index.md`
and linked it from both QA and issue-reconciliation READMEs. The index uses the
existing issue-reconciliation closure posture where possible and keeps the
sampled records in place.

Follow-up expansion: the index now records group-level inventory counts, the
largest issue-reconciliation filename families, the count of records still
using `candidate fix awaiting user confirmation`, and additional samples across
root-admin runtime/adoption, generated canonical routing, tenant-auth audit
persistence, and root-admin security matrix evidence.

Follow-up cleanup on 2026-05-27: the 15-record candidate-confirmation queue was
worked by family: shell/canonical host, context navigation, form child
canonicals, human-review guard practice, root-admin profile-picture upload
degraded states, and time-picker scope/overlay follow-ups. Each source record
received a supersession note, the full records were moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/`, and
breadcrumbs were left at the old `docs/workspace/issue-reconciliations/` paths.
This was a targeted archive of promoted/superseded candidate notes, not a
bulk-archive decision for the whole issue-reconciliation folder.

Second follow-up cleanup on 2026-05-27: the April 16 breadcrumb/sub-nav
canonical drift family was rechecked against current breadcrumb/sub-nav
behavior locks, reference packs, verification artifacts, audit tests, visual
canonical tests, and frontend design-system loop guidance. The records were
classified as promoted lessons, moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/breadcrumb-sub-nav-canonicals/`,
and replaced at their old paths with breadcrumbs. Current breadcrumb/sub-nav
authority should stay in the design-system artifact chain rather than these
historical incident records.

Third follow-up cleanup on 2026-05-27: the April 15 breadcrumb compact-cascade
record was added to the breadcrumb/sub-nav archive after confirming the mixed
compact/full breadcrumb state is now covered by active breadcrumb/sub-nav
artifacts. The adjacent April 15 top-nav and primary-nav records were left in
place and marked `needs-recheck` in the freshness index because current
top-nav artifacts still carry adoption parity and shared-seam extraction
obligations.

Fourth follow-up cleanup on 2026-05-27: the April 15 top-nav and primary-nav
records were rechecked against the current top-nav verification checklist,
`TRP-*` canonical visual suite, source audits, root-admin shell parity evidence,
and component inventory. The escaped-defect lessons were classified as promoted
and moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/top-nav-shell/`
with breadcrumbs at the old paths. The active adoption/parity and shared-seam
extraction caveats remain current in the top-nav design-system artifact chain,
not in the archived issue notes.

Fifth follow-up cleanup on 2026-05-27: the context-nav design-system and
root-admin adoption issue family was rechecked against the current
context-nav behavior lock, pattern artifact, reference pack, verification
checklist, root-admin adoption contract, visual tests, and audit tests. Promoted
records were moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/context-navigation/`
with breadcrumbs at the old paths. The active `2026-04-28-root-admin-context-nav-icons-links.md`
record stayed in `docs/workspace/issue-reconciliations/` because it still names
user confirmation against the original live browser/data state.

Sixth follow-up cleanup on 2026-05-27: clearly illustrative QA examples and the
point-in-time context-nav parent-owner QA checklist were moved to
`docs/workspace-buckets/archive-history/qa/` with breadcrumbs at the old paths.
Unresolved waivers, security matrices, active test backlogs, and the current
freshness index remain active in `docs/workspace/qa/`.

Seventh follow-up cleanup on 2026-05-27: generated canonical routing/index
records whose lessons are now promoted into router behavior, generated
canonical launcher/index contracts, design-system loop guidance, integration
tests, and visual route-chain proof were moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/generated-canonical-routing/`
with breadcrumbs at the old paths. Related canonical-rendering records that
still name open localhost, user-confirmation, theme-scope, or visible-worktree
caveats stayed active for later review.

Eighth follow-up cleanup on 2026-05-27: completed tenant-auth QA exploratory
notes and checklists were moved to
`docs/workspace-buckets/archive-history/qa/tenant-auth/` with breadcrumbs at
the old paths. Current tenant-auth authority remains in ADRs/guides, PRDs,
test-case and journey artifacts, implementation blueprints, test summaries,
source, and executable tests. Unresolved waivers and active QA operating
records remain in `docs/workspace/qa/`.

Ninth follow-up cleanup on 2026-05-27: completed tenant-admin onboarding restart
and capability-contract catalog QA checklists were moved to
`docs/workspace-buckets/archive-history/qa/` with breadcrumbs at the old paths.
The job-processing foundation QA checklist stayed active because it still
records partial release-gate status and missing Redis/Postgres evidence.

Tenth follow-up recheck on 2026-05-27: asset foundation QA records stayed
active in `docs/workspace/qa/`. The exploratory note, QA checklist, and
waiver/quarantine record still name unresolved provider-contract,
Postgres-backed persistence, SVG/security-review, tenant-route, and first
consumer-readiness caveats. Do not archive these as stale history until an
assets/provider readiness pass proves or supersedes those gates.

Eleventh follow-up cleanup on 2026-05-27: the tenant-auth bootstrap audit FK
mismatch issue note was moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/tenant-auth-audit/`
with a breadcrumb at the old path. The lesson is promoted into the tenant-auth
service audit seam, Postgres-backed tenant-auth persistence regression,
tenant-auth audit visibility tests, and the auth-audit-event data dictionary.

## Non-Goals

- Do not move runtime code.
- Do not move `harnessChat`.
- Do not move frontend harness artifacts while frontend work is active in
  another chat.
- Do not bulk-move workspace artifacts.
- Do not rename applied migrations.
- Do not change routes, authz capability keys, generated dependency graphs, or
  maintained source-independent artifacts without a separate compatibility
  plan.

## Open Questions

- Should `docs/workspace` become bucket-first, or should bucket-first maps
  coexist with artifact-type folders during a longer transition?
- Which artifact types require skill/tool lookup updates before any move?
- Which existing documents are active source of truth versus archive/history?
- What minimal bucket index prevents drift without adding fake determinism?

## Deferred Decisions From 2026-05-27 Cleanup Run

- `docs/workspace/issue-reconciliations/2026-04-28-root-admin-context-nav-icons-links.md`
  stayed active. Decision needed: either confirm the original browser/data
  surface is no longer an open concern, or keep it as the current active
  context-nav live-state caveat.
- QA completed feature checklists remain mixed. Decision needed: choose whether
  completed non-waiver QA checklists should move to archive/history by feature
  family after each related test summary and standards hook is confirmed.
- Architecture-map cloned bucket context remains directionally approved but
  not implemented. Decision needed: define the synchronization and contribution
  contract before cloning map slices into platform, discovery-harness,
  frontend-harness, and shared-governance-kernel buckets.
- Entity-definition cloned bucket context remains directionally approved but
  not implemented. Decision needed: reconcile stale first drafts against
  current source and `docs/data-dictionary/` before cloning them into buckets.
- `docs/workspace/exports/capability-contract-catalog-v1.generated.json`
  stayed in place. Decision needed only if we want a dedicated compatibility
  task to move the generator default path into capability-matrix or bucket-owned
  generated-artifact storage.
