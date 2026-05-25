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
- `archive/history`: historical records, old runs, preserved worktrees,
  completed task-run evidence, backups, and records kept for traceability but
  not active source-of-truth guidance.
- `unsure / needs decision`: artifacts whose current purpose, authority, or
  owner cannot be classified confidently from inspected evidence.

## Classification Rule

Classify artifacts by current purpose and authority, not by filename, artifact
type, folder, or future aspiration.

An artifact type can appear in multiple buckets. For example, a Technical
Steering packet, PRD, capability matrix, runbook, QA evidence note, or
implementation blueprint should be bucketed by what it governs or enables.

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
- current secondary/export/transitional home: `docs/workspace/permission-mappings/`
- producing machinery: `discovery-harness`, through `DOC:permission-mapping`
  task work and permission-mapping guardrails, when the work is artifact
  maintenance
- move readiness: not ready for physical relocation while architecture docs,
  skills, standards, Layer 5 artifact obligations, validators, API/data/test
  guardrails, and CSV export references expect the current folders

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
It does not classify every `docs/workspace/` folder.

The next pass should inventory remaining workspace folders by current purpose,
producer, consumer, authority, likely bucket fit, cross-bucket handoff points,
validation, known gaps or inconsistencies, move risk, and whether each folder
is active source truth or archive/history.

### Remaining Workspace Folder Inventory Scope

The next pass should start from the current top-level `docs/workspace/` folder
list, not from artifact-type assumptions. It should compare each folder against
folder READMEs, representative files, script references, standards references,
and active-vs-historical usage before assigning a bucket.

Do not classify a folder by name alone.

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
