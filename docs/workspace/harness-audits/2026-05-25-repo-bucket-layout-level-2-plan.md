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

## Next Artifact Types To Analyze

- Product Discovery packets
- Product Requests
- Technical Steering packets
- PRDs
- PRD-derived test cases
- Story Breakdown packets
- Task Breakdown packets
- Implementation Blueprints
- API contracts
- Data dictionaries
- Permission mappings
- QA evidence and test-run summaries
- Decision evidence

For each artifact type, identify producer, consumer, authority, likely bucket
fit, cross-bucket handoff points, validation, known gaps or inconsistencies,
and move risk.

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
