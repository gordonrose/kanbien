# Product Request Artifact Alignment Inventory

## Status

- Date: 2026-05-07
- Branch:
  `codex/layer3-unified-artifact-governance`
- Inventory status:
  first-pass alignment map
- Scope:
  Product Request, Product Discovery, Technical Steering, Story Breakdown,
  Task Breakdown, and linked downstream planning artifacts.
- Validation evidence:
  - `npm run product-request:validate -- --all` -> PASS
  - `npm run story-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery` -> PASS
  - `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-04-29-reporting-dashboard-template-story-breakdown` -> PASS
  - `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-04-29-tenant-aware-login-pattern-story-breakdown` -> PASS
  - `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-04-29-tenant-branding-configuration-story-breakdown` -> PASS
  - `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-03-loop-observability-kpi-foundation-story-breakdown` -> PASS
  - `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-05-platform-authorization-admin-owner-story-breakdown` -> PASS

## Target Hierarchy

Active Product Request chains should converge on this containment model when a
request is ready for governed downstream work:

```text
docs/workspace/product-requests/<request-slug>/
  request.md
  discovery.md
  steering.md
  epics/
    EPIC-001-<epic-slug>/
      epic.md
      stories/
        S-001-<story-slug>/
          story.md
          task-breakdown.md
          tasks/
            T-S001-01-<task-slug>.md
```

The template and validator work already supports the key lower-level shape:

- Product Request folder validation requires `request.md`, `epics/`, Epic
  Index rows that match `epics/EPIC-*` folders, and each epic folder to
  validate as a Story Breakdown.
- Story Breakdown folder validation supports `epic.md` plus either story files
  or story directories with `story.md`.
- Task Breakdown folder validation supports `task-breakdown.md` plus
  `tasks/T-*.md` files under a story folder and checks Task Queue/file parity.

The current validators do not yet require every Story Breakdown story to have a
nested Task Breakdown. That is correct for stories not yet ready for Layer 4,
but active delivery-ready stories should eventually materialize their Task
Breakdown under the parent story rather than as floating workspace packets.

## Inventory Summary

| Chain | Product Request Shape | Discovery | Steering | Story Breakdown | Task Breakdown | Downstream Artifacts | Alignment Classification | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chat interface for Layer One Product Discovery | folder request exists | linked external workspace packet | linked external workspace packet | nested under Product Request epic | S-001 through S-010 have nested `task-breakdown.md` and `tasks/T-*` | PRD, capability matrix, test cases, journey inventory, runtime contract, permission mapping, API contract, data dictionaries, implementation blueprint linked | aligned active Layer 4 chain | `proceed-to-layer-5`: all active chat-interface stories prove story-local Task Breakdown; start delivery from the pilot sequence while keeping top-level Product Request `Task Breakdown` pending for validator-compatible link semantics. |
| Data compliance debt policy and fail-on-debt gate | single-file Product Request | pending | pending if policy/architecture owner needed | pending | pending | command evidence and hardening source linked | intake-only chain | `link-only-now`: keep as Product Request intake until Product Discovery determines whether policy work needs steering. |
| QA coverage-strength debt policy and fail-on-debt gate | single-file Product Request | pending | pending if policy/architecture owner needed | pending | pending | command evidence and hardening source linked | intake-only chain | `link-only-now`: keep as Product Request intake until Product Discovery determines policy owner and blocking posture. |
| Reporting dashboard template | no Product Request found | workspace packet exists | workspace packet exists | standalone folder Story Breakdown exists | none found | no Product Request index found in this pass | orphaned downstream chain | `needs-decision`: either create a Product Request wrapper or label as historical/reference planning chain. |
| Tenant-aware login pattern | no Product Request found | workspace packet exists | workspace packet exists | standalone folder Story Breakdown exists | none found | no Product Request index found in this pass | orphaned downstream chain | `needs-decision`: likely create Product Request wrapper if still active; otherwise mark as historical/reference. |
| Tenant branding configuration | no Product Request found | workspace packet exists | workspace packet exists | standalone folder Story Breakdown exists | none found | capability matrix and asset decisions exist separately | orphaned downstream chain | `needs-decision`: likely active enough to deserve Product Request wrapper, but migration should check existing asset/design-system links first. |
| Loop observability KPI foundation | no Product Request found | workspace packet exists | workspace packet exists | standalone folder Story Breakdown exists | none found | likely PRD/capability/test/implementation artifacts exist separately; not fully reconciled in this pass | orphaned downstream chain | `needs-decision`: create wrapper if this is active platform work; otherwise label as historical/reference. |
| Platform authorization admin owner | no Product Request found | related Product Discovery exists under platform authorization model naming | workspace steering exists | standalone folder Story Breakdown exists | none found | capability matrix exists separately | orphaned downstream chain | `needs-decision`: create wrapper if this is active authorization roadmap work. |

## Drift Findings

### 1. Active Chain Is Valid But Not Fully Contained

`docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/request.md`
is the only folder-style Product Request found. It validates and points its
Story Breakdown link at the nested epic folder:

```text
docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery
```

The nested epic validates as a Story Breakdown and includes the downstream
links needed for PRD, capability matrix, PRD-derived test cases, API contract,
permission mapping, data dictionary, implementation blueprint, asset decision,
design-system governance, and QA evidence planning.

Remaining drift:

- `discovery.md` and `steering.md` do not live in the Product Request folder
  yet; they are linked from `docs/workspace/product-discovery/` and
  `docs/workspace/technical-steering/`.
- Product Request `Task Breakdown` remains `pending` for validator-compatible
  top-level link semantics; the human-facing status now notes that S-001
  through S-010 have story-local Task Breakdowns.
- S-001 has validated story-local Task Breakdown files:
  - `stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/task-breakdown.md`
  - `stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/tasks/T-S001-01-prd-scope-alignment.md`
  - `stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/tasks/T-S001-02-capability-matrix-traceability.md`
  - `stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/tasks/T-S001-03-prd-test-case-alignment.md`
- S-002 has validated story-local Task Breakdown files:
  - `stories/S-002-work-panel-and-chat-design-system-governance/task-breakdown.md`
  - `stories/S-002-work-panel-and-chat-design-system-governance/tasks/T-S002-01-work-panel-ds-seam.md`
- S-003 also has validated story-local Task Breakdown files:
  - `stories/S-003-generated-packet-pdf-delivery-decision/task-breakdown.md`
  - `stories/S-003-generated-packet-pdf-delivery-decision/tasks/T-S003-01-pdf-architecture-source.md`
- S-010 has validated story-local Task Breakdown files:
  - `stories/S-010-future-tenant-builder-rollout-deferral/task-breakdown.md`
  - `stories/S-010-future-tenant-builder-rollout-deferral/tasks/T-S010-01-tenant-builder-deferral.md`
- S-004 has validated story-local Task Breakdown files:
  - `stories/S-004-product-discovery-harness-adapter/task-breakdown.md`
  - `stories/S-004-product-discovery-harness-adapter/tasks/T-S004-01-product-discovery-adapter-seam.md`
  - `stories/S-004-product-discovery-harness-adapter/tasks/T-S004-02-adapter-failure-behavior.md`
- S-005 has validated story-local Task Breakdown files:
  - `stories/S-005-conversation-and-packet-history-foundation/task-breakdown.md`
  - `stories/S-005-conversation-and-packet-history-foundation/tasks/T-S005-01-conversation-message-persistence.md`
  - `stories/S-005-conversation-and-packet-history-foundation/tasks/T-S005-02-packet-revision-persistence.md`
- S-006 has validated story-local Task Breakdown files:
  - `stories/S-006-protected-chat-history-generation-and-download-apis/task-breakdown.md`
  - `stories/S-006-protected-chat-history-generation-and-download-apis/tasks/T-S006-01-api-contract.md`
  - `stories/S-006-protected-chat-history-generation-and-download-apis/tasks/T-S006-02-permission-mapping.md`
  - `stories/S-006-protected-chat-history-generation-and-download-apis/tasks/T-S006-03-protected-backend-apis.md`
- S-008 has validated story-local Task Breakdown files:
  - `stories/S-008-runtime-and-mock-honesty-evidence-plan/task-breakdown.md`
  - `stories/S-008-runtime-and-mock-honesty-evidence-plan/tasks/T-S008-01-test-suite-alignment.md`
  - `stories/S-008-runtime-and-mock-honesty-evidence-plan/tasks/T-S008-02-live-shape-mock-honesty-evidence.md`
  - `stories/S-008-runtime-and-mock-honesty-evidence-plan/tasks/T-S008-03-pdf-evidence.md`
  - `stories/S-008-runtime-and-mock-honesty-evidence-plan/tasks/T-S008-04-browser-ds-evidence.md`
- S-007 has validated story-local Task Breakdown files:
  - `stories/S-007-root-admin-build-panel-adoption/task-breakdown.md`
  - `stories/S-007-root-admin-build-panel-adoption/tasks/T-S007-01-root-admin-ds-adoption.md`
  - `stories/S-007-root-admin-build-panel-adoption/tasks/T-S007-02-context-not-authority.md`
- S-009 has validated story-local Task Breakdown files:
  - `stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/task-breakdown.md`
  - `stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/tasks/T-S009-01-data-dictionary-closure.md`
  - `stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/tasks/T-S009-02-api-contract-closure.md`
  - `stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/tasks/T-S009-03-permission-mapping-closure.md`
  - `stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/tasks/T-S009-04-feature-manifest-architecture-closure.md`
  - `stories/S-009-data-permissions-api-and-feature-manifest-artifact-sweep/tasks/T-S009-05-product-request-docs-closure.md`
- A Layer 5 delivery pilot now defines the full task queue, dependency status,
  KPI contract, and execution order:
  `docs/workspace/layer5-pilots/2026-05-07-chat-interface-delivery-pilot.md`

This is a good first migration candidate because it already uses the Product
Request folder and nested epic shape.

### 2. Task-Under-Story Support Exists And Four Stories Are Materialized

Template, skill, validator, and unit-test support now agree that Task Breakdown
can live under the parent story:

```text
stories/S-001-<story-slug>/
  story.md
  task-breakdown.md
  tasks/
    T-S001-01-<task-slug>.md
```

Current workspace inspection found that the chat-interface S-001 through S-010
stories use this shape and pass:

```sh
npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-001-mvp-prd-capability-matrix-and-test-case-planning/story.md

npm run task-breakdown:validate -- docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-003-generated-packet-pdf-delivery-decision --story docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-003-generated-packet-pdf-delivery-decision/story.md
```

This means the deepest shape is proven for docs, design-system, decision,
implementation, API, permission, data dictionary, evidence, and architecture
closure story types in the active chat-interface chain.

### 3. Several Valid Story Breakdowns Are Orphaned From Product Requests

The following Story Breakdown folders validate, but they currently live under
`docs/workspace/story-breakdown/` without a parent Product Request wrapper:

- `2026-04-29-reporting-dashboard-template-story-breakdown`
- `2026-04-29-tenant-aware-login-pattern-story-breakdown`
- `2026-04-29-tenant-branding-configuration-story-breakdown`
- `2026-05-03-loop-observability-kpi-foundation-story-breakdown`
- `2026-05-05-platform-authorization-admin-owner-story-breakdown`

These should not be moved blindly. Each needs classification as active,
historical/reference, superseded, or parked.

### 4. Intake Product Requests Are Intentionally Shallow

The data compliance debt policy and QA coverage-strength debt policy requests
are valid single-file Product Requests at `intake` status. They should not be
forced into the full folder hierarchy until Product Discovery confirms the
normal workflow, ownership, policy decisions, and whether Technical Steering is
needed.

## Proposed Classification Rules

Use these rules before moving artifacts:

- `migrate-now`: active chain, Product Request owner known, downstream work is
  intended to continue, and links can be preserved or redirected safely.
- `link-only`: artifact remains in its current workspace location but is
  indexed by a Product Request because moving it would create churn or broken
  history.
- `supersede`: artifact remains for history and points to the replacement
  chain.
- `park`: artifact is preserved as WIP/debt with owner, status, and follow-up.
- `historical-reference`: artifact remains valid as an example/reference, but
  is not treated as the active source of truth for current delivery.
- `do-not-migrate-yet`: status is intake, discovery-only, blocked, or missing a
  human decision needed before hierarchy changes.

## Recommended First Migration Slice

Start with the chat interface chain because it is already closest to the target
model:

1. Keep the existing folder Product Request as the parent.
2. Decide whether to copy, move, or link-only the Product Discovery and
   Technical Steering packets into:
   - `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/discovery.md`
   - `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/steering.md`
3. Treat S-001 through S-010 as validated pilots for story-local Task
   Breakdown.
4. Start Layer 5 delivery from the first queued task in the pilot sequence.
5. Validate the request, the Story Breakdown, and each Task Breakdown packet
   during delivery as source truth changes.
6. Only after that proof, repeat the containment pattern for another active
   chain.

## Human Decisions Needed

| Decision ID | Question | Recommended Default | Why It Matters |
| --- | --- | --- | --- |
| DEC-001 | Should active Product Discovery and Technical Steering packets be moved into Product Request folders or only linked? | Link first, move only for the selected active chain. | Moving creates path churn and backlink risk; linking preserves current truth while the hierarchy is proven. |
| DEC-002 | Which orphaned Story Breakdown chains are active enough to need Product Request wrappers? | Start with chat interface only; classify tenant branding and platform authorization next. | Prevents treating historical examples as current work. |
| DEC-003 | Should story-local Task Breakdown become mandatory for all new ready stories? | Yes for new active Product Request work; no retroactive requirement for historical packets. S-001 already proves the shape. | Preserves the target shape without invalidating older examples. |
| DEC-004 | Should existing standalone `docs/workspace/task-breakdown/` stay valid? | Yes as legacy/small-packet support, but prefer story-local task files for active Product Request chains. | Avoids a breaking documentation migration while setting a better default. |
| DEC-005 | Are structurally backfilled proof matrices authoritative examples or only anti-blank migrated examples? | Treat as structurally valid but mark human calibration as optional follow-up. | Prevents overclaiming quality of generated proof rows. |

## Next Checks

- Decide whether the chat interface Product Request should use `link-only` or
  local `discovery.md` / `steering.md` copies.
- Start Layer 5 delivery from the first queued chat-interface task while
  preserving the story-local packet shape.

## Parked Stash Classification

Source inspected:

- `stash@{1}`
- Subject: `On codex/root-admin-conversation-panel-adoption: park unrelated story-breakdown split work`
- Stash commit: `de728aa15d07d2ffc617e9e21273849f09b68fdc`

This stash was inspected without applying it to the worktree.

| File / Area | Stash Intent | Current Repo State | Classification | Action |
| --- | --- | --- | --- | --- |
| `.codex/skills/20-planning-artifacts/story-breakdown-maintainer/SKILL.md` | Add folder Story Breakdown inputs and output paths. | Current skill already includes epic/story templates, story-directory support, task files under parent stories, narrative guidance, and proof-obligation requirements. | superseded-by-current | Do not apply. |
| `docs/templates/README.md` | Document legacy single-file and folder Story Breakdown packet shapes. | Current README already documents single-file, folder, story-directory, `task-breakdown.md`, and `tasks/T-*` shapes. | superseded-by-current | Do not apply. |
| `docs/templates/story-breakdown-packet-template.md` | Clarify that the single-file packet remains valid and larger epics should use split templates. | Current templates now go further: story template owns standalone narratives and AC-to-test obligation matrix; epic template includes task-under-story layout. | superseded-by-current | Do not apply. |
| `src/scripts/storyBreakdownValidate.ts` | Add folder-packet validation for `epic.md` plus `stories/S-*.md`. | Current validator supports folder packets with story files and story directories containing `story.md`, plus narrative and proof-obligation enforcement. | superseded-by-current | Do not apply. |
| `tests/unit/storyBreakdown/storyBreakdownValidate.test.ts` | Add tests for single-file and folder Story Breakdown validation. | Current tests include folder story files, folder story directories, missing `story.md`, standalone story narratives, and AC-to-test obligation coverage. | superseded-by-current | Do not apply. |
| `docs/workspace/story-breakdown/*-story-breakdown.md` single-file packets | Delete or edit older single-file Story Breakdown packets during early folder migration. | Those single-file packet paths no longer exist; current validated artifacts are folder packets under matching directories. | obsolete-paths | Do not apply. |
| `docs/workspace/exports/capability-contract-catalog-v1.generated.json` | Regenerate export timestamps only. | Diff only changes `generatedAt` / `lastMaterializedAt` timestamp fields for existing items. | unrelated-generated-churn | Do not apply. Regenerate only through the owning catalog command if needed. |

Stash decision:

- Keep the stash parked for now as historical evidence until this branch is
  committed or the user explicitly approves cleanup.
- Do not apply or pop it into `codex/layer3-unified-artifact-governance`.
- No hunks need manual porting before the chat-interface Product Request pilot;
  the current branch already contains the stronger successor model.
