# T-S009-05: Refresh S-009 feature docs and story evidence after implementation lands.

## Task Handoff

| Field | Value |
| --- | --- |
| Task ID | T-S009-05 |
| Parent Story ID | S-009 |
| Task Type | DOC:docs-artifact |
| Delivery Handoff Status | queued-for-delivery |
| Execution Scope | Refresh S-009 feature docs and story evidence after implementation lands. |
| Allowed Write Set | `docs/features/organization-business-unit-memberships.md`; S-009 story folder; generated dependency graph artifacts when manifest changes require regeneration. |
| Non-Goals | No production source changes, no new product decisions, no unrelated entity docs, no API contract rewrite, no permission mapping rewrite. |
| Dependencies | T-S009-01 through T-S009-04 complete. |
| Shared Seams | feature manifest and generated dependency graph artifact chain. |

## Delivery Context

This task file is the standalone delivery handoff for the task. The packet-level `task-breakdown.md` remains the canonical source for full-story reconciliation, while this file repeats the task-specific rows needed for direct navigation and Layer 5 delivery.

### Packet Status

| Field | Value |
| --- | --- |
| Packet status | ready-for-delivery-handoff |
| Task Breakdown ID | TB-ORG-S009 |
| Validation status | pass |

### Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S009-01 | S-009 | Membership records accept only real business-unit targets for the current slice, fixed participation labels of owner, manager, member, and viewer, same-tenant ownership, self-link denial, and explicit individual/person target deferral. | persistence-level | unit, integration, security, audit, privacy | PRD, API contract, data dictionary, permission mapping |

### Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-009 | AC-S009-01 | CAP-ORG-MEMBER-001 | tenant/root | create-or-refresh-required | Memberships. |

### Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-05 | single-proof-target | 1 | Artifact-only task closes S-009 documentation and generated evidence. | Maintained artifact closeout. | docs and generated dependency graph artifacts | Review shows docs and generated records no longer describe pre-S009 state. | none | Source or test changes route back to owning tasks. |

### Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S009-05 | none-known | No new decision expected; docs closeout may proceed when source diff and test evidence are available. | Manual review if artifacts reveal stale upstream source. | yes | Artifact task is allowed to report drift but not invent behavior. |

### Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S009-05 | implementation diff, feature manifest, generated graph artifacts, docs/features inventory, story evidence. | feature manifest and dependency graph generator. | change-artifact requirements, story packet, implementation evidence. |

### Docs Artifact Contract

| Task ID | Artifact Family | Docs Artifact Class | Scriptable Source Inventory | Source Truth Reviewed | Docs Target | Status Posture | Stale Artifact Sweep | Specialized Routing / Split Decisions | Diff / Check Command | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S009-05 | feature-doc | feature-doc-refresh | Inspect implementation diff, S-009 story folder, `src/features/organizationBusinessUnitMemberships/feature.manifest.json`, generated graph artifacts, tests, and validation command output. | S-009 story, PRD, implementation evidence, feature manifest, generated graph. | `docs/features/organization-business-unit-memberships.md`; S-009 story evidence links; S-009 review note. | current-state-after-implementation | Sweep docs/features, S-009 story evidence, feature manifest references, generated graph, test:evidence, and source-independent docs touched by membership source. | DOC:api-contract for route contract changes; DOC:permission-mapping for authz truth changes; DOC:data-dictionary for data shape changes; TEST:test-only for new proof; DEV:backend for source behavior. | `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown`; `npm run task-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-009-business-unit-memberships --story docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown` | Reviewer judges artifact truth against implementation evidence, not new behavior. | Validation output plus manual review note. |

### Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S009-05 | narrow-pattern | `docs/features/organization-business-unit-memberships.md`; S-009 story folder; S-009 review artifact; generated dependency graph artifacts when required by manifest diff. | not-applicable |

### Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S009-05 | task-specific | S-009 maintained artifact closeout review. | Story and task validators supplement manual artifact review. |

## Proof And Evidence

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S009-05 | task-specific | S-009 maintained artifact closeout review. | Story and task validators supplement manual artifact review. |

## Source References

- Parent task breakdown: `../task-breakdown.md`
- Parent story: `../story.md`