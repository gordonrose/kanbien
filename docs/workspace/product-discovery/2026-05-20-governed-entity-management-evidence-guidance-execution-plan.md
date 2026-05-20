# Governed Entity Management Evidence And Guidance Execution Plan

Status:

- `execution_plan_draft`
- Date: 2026-05-20
- Scope: progress tracker and automation rules for attribute evidence, LLM
  guidance, display posture, and capability-baseline preparation
- Implementation status: not started
- Runtime/code changes: none

## Purpose

Provide a trackable plan for moving from the current entity-management design
prototype into implementation-ready planning material without stopping for a
human decision on every field.

This plan follows:

- `docs/workspace/product-discovery/2026-05-20-governed-entity-management-three-level-reconciliation.md`
- `docs/workspace/product-discovery/2026-05-20-governed-entity-management-attribute-evidence-guidance-walkthrough.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-schema-formalization.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-attribute-reference.md`
- `docs/data-dictionary/organization.md`
- `docs/workspace/design-system/templates/record-management-list-centric-template.md`

It is not a runtime contract, API contract, schema lock, generated page approval,
or app implementation plan.

## Executive Goal

Move quickly by applying governed defaults wherever the repository already gives
clear direction, and reserve human review for decisions that change business
meaning, compatibility, security, permissions, lifecycle, or design-system
contracts.

In practice:

- Codex should auto-complete low-risk evidence and guidance rows when source
  truth is clear.
- Codex should mark uncertain items as `needs_review` instead of blocking the
  whole pass.
- Human review should focus on policy and meaning, not mechanical field
  completion.

## Progress Tracker

| Phase | Status | Output |
| --- | --- | --- |
| 1. Three-level model reconciliation | complete | Entity Page, Record List Page, and Record Page relationship recorded. |
| 2. Demo attribute truth classification | complete-first-pass | Current six demo attributes classified by source confidence. |
| 3. Automation rules and review gates | complete | This plan. |
| 4. Evidence registry draft | complete-first-pass | Transitional JSON registry created from the current `entity_management_page` rendered DOM control inventory. |
| 5. Attribute-by-attribute lock pass | pending | Field rows with evidence, LLM guidance, display, search, and capability posture. |
| 6. Capability baseline draft | pending | First real action/capability definitions for read, list, display identity, evidence read, LLM guidance read, and scoped update. |
| 7. Demo fixture authority cleanup | pending | Decision whether demo remains Organization-with-demo-fields or becomes fictional. |
| 8. Design-system template architecture audit | pending | Reuse/seam audit before app adoption. |
| 9. Older discovery doc pointer sweep | pending | Light references from older docs to the three-level model and execution plan. |

## Automation Posture

Codex may auto-complete an item when all of these are true:

- the value is directly supported by source artifacts already in the repo
- the value follows a repo default from `AGENTS.md` or existing schema
  formalization guidance
- the value does not introduce a new runtime route, migration, permission grant,
  public API behavior, asset behavior, or app-page CSS
- the value is additive planning detail, not implementation approval
- uncertainty can be recorded as `needs_review` without blocking adjacent rows

Codex must pause or mark `needs_human_decision` when the item:

- changes business meaning
- changes who can see, edit, approve, export, delete, or promote something
- changes lifecycle/status semantics
- changes compatibility for existing routes, persistence, generated docs, or
  UI behavior
- introduces a new asset kind or user-managed asset behavior
- relies on source evidence that conflicts across artifacts
- requires design-system signoff not yet completed
- would turn a demo placeholder into runtime authority

## Default Completion Rules

### Evidence

| Situation | Default action |
| --- | --- |
| Attribute exists in data dictionary and fixture | Mark as `evidence_backed`; cite both. |
| Attribute exists in data dictionary only | Mark as `source_backed_not_in_demo`; cite data dictionary. |
| Attribute exists in fixture only | Mark as `demo_only`; do not treat as Organization authority. |
| Attribute exists in source/API/migration but not data dictionary | Mark as `source_backed_dictionary_gap`; cite source and flag docs follow-up. |
| Sources conflict | Mark `needs_review` with conflict summary. |
| No source evidence | Mark `no_evidence`; keep out of implementation baseline. |

Evidence accountability convention for this planning stream:

| Actor key | Use when |
| --- | --- |
| `gordon.rose` | Gordon explicitly signs off, chooses a product rule, approves a promotion, or asks for a specific interpretation to be treated as human-approved. |
| `codex_5_5` | Codex drafts, infers, classifies, proposes defaults, records source-backed findings, or marks an item as `needs_review`. |

Default rule:

- Do not treat Codex-authored evidence as human approval.
- Store a stable actor key for accountability, not just display copy.
- Use `createdByActorKey`, `reviewedByActorKey`, and `approvedByActorKey`
  when the evidence row needs to distinguish draft, review, and approval.
- If an item is source-backed but not explicitly human-approved, default
  `createdByActorKey: codex_5_5` and leave `approvedByActorKey:
  not_approved`.

Transitional storage decision:

| Layer | Current posture |
| --- | --- |
| Planning source | Store evidence in structured repo documents for now. |
| Design-system preview | Mirror document-backed evidence in the template preview for review. |
| Future runtime source | Migrate the evidence shape into persistent entity-builder evidence capabilities when that feature is built. |

Default phrase:

> Evidence is document-backed during planning, design-system-mirrored for
> review, and intended to become persistent entity-builder truth later.

Initial storage recommendation:

- Use a structured artifact rather than prose-only Markdown.
- Keep the first registry near this planning stream unless a stronger governed
  home is chosen:
  `docs/workspace/product-discovery/2026-05-20-governed-entity-management-organization-demo-evidence-registry.json`
- Treat the file as a seed/migration artifact for future evidence capabilities,
  not as runtime authority.
- Include enough fields to map cleanly to future capabilities such as
  `evidence.create`, `evidence.read`, `evidence.review`,
  `evidence.approve`, `evidence.mark_stale`, `evidence.supersede`,
  `evidence.link_to_attribute`, `evidence.link_to_capability`, and
  `evidence.reconcile_source`.

Minimum evidence row shape for the transitional registry:

```json
{
  "evidenceKey": "organization_name_data_dictionary",
  "entityKey": "organization",
  "appliesTo": [
    "attributes.name"
  ],
  "sourceType": "data_dictionary",
  "sourceLocationType": "repo_path",
  "repoPath": "docs/data-dictionary/organization.md",
  "proofStatement": "The Organization data dictionary defines name as a required human-facing business field.",
  "confidence": "high",
  "reviewStatus": "source_backed",
  "createdByActorKey": "codex_5_5",
  "reviewedByActorKey": "codex_5_5",
  "approvedByActorKey": "not_approved",
  "reviewedAt": "2026-05-20"
}
```

### Attribute Category

Codex may infer category with these defaults:

| Evidence | Default category |
| --- | --- |
| Stable identifier or primary key | `identity` |
| Human-facing business name or descriptive fact | `core` |
| System-maintained normalized value, timestamp, or audit field | `metadata` or platform-owned system category per schema direction |
| Record availability or retention state | `system_lifecycle` |
| Business/workflow state | `operational_lifecycle` |
| Parent or owning record reference | `parent_relation` |
| Child collection or inverse relation | `child_relation` |
| Other durable reference | `domain_relation` |
| Proof/source pointer | `evidence` |

If a field both names the record and is editable business data, default to
`core` plus display-identity metadata unless the schema later approves
`identity` for mutable display names.

### System-Managed And Mutability

| Evidence | Default posture |
| --- | --- |
| ID, tenant/account boundary, created/updated/deleted timestamps, normalized/generated value | `systemManaged: true`; human should not supply value directly. |
| Primary key | `mutability: immutable`. |
| Created timestamp | `mutability: immutable` or `system_updateable` only during create. |
| Updated timestamp | `mutability: system_updateable`. |
| Soft-delete/archive/lifecycle fields | `mutability: lifecycle_managed`. |
| Parent/child relationship reference changed through relationship action | `mutability: relationship_managed`. |
| Normal editable business fact | `mutability: updateable`. |
| Transparent projection | `mutability: derived`. |
| Business-rule result or score | `mutability: calculated`. |

### LLM Guidance

| Field type | Default LLM guidance |
| --- | --- |
| System-managed identifiers and timestamps | `use_platform_default`; never ask the human. |
| Foundational entity purpose or meaning | `ask_human` or `recommend_and_confirm`. |
| Human-facing labels/descriptions | `recommend_and_confirm` for new entities; `derive_from_source_truth` for repo migrations. |
| Attribute type, storage, source, validation, search, mutability | `derive_from_source_truth`; technical review when evidence conflicts. |
| Privacy/security/compliance posture | conservative inference plus `technical_review_required` when sensitive. |
| Display placement in signed-off template region | `use_platform_default` when template default exists; otherwise `technical_review_required`. |
| Action/capability mappings | `derive_from_source_truth`; review required for authz-sensitive or breaking changes. |
| Demo-only fields | do not ask human for real-world meaning unless deciding to promote the field out of demo status. |

### Display And Record Page Placement

| Situation | Default action |
| --- | --- |
| Primary human-facing name exists | Use as Record Page title and Record List card title. |
| Stable system ID exists | Use as support/debug identifier, not primary title. |
| One eligible display group has fields | Render that group; omit empty groups. |
| Field has no approved placement | Keep canonical attribute but omit from generated Record Page. |
| Field is sensitive/restricted | Default hidden until read/reveal capability is explicit. |
| Element/region combination is not in template contract | Mark `needs_design_system_contract`. |

### Search And Filter

| Situation | Default action |
| --- | --- |
| Search/index evidence exists | Mark supported operator from source evidence. |
| No search/index evidence | Default to not searchable. |
| Status/workflow filtering | Route through status bar, not generic filter bar. |
| Text search | Route through page-shell search. |
| Small bounded enum | Collection/select filter may be proposed when source-backed. |
| Value range | Keep blocked until range filter UX is signed off. |

### Capability Baseline

Codex may draft capability baselines when they remain planning-only and include
review posture.

Required fields for each draft capability:

- stable action key
- owner layer and owner key
- action family
- actor/authority world
- input posture
- output posture
- route/API posture, if any
- authorization posture
- lifecycle/status effect
- validation and action errors
- audit and evidence requirements
- compatibility risk
- review requirement
- test expectations

Codex must not mark a capability as implementation-approved until API,
permission, persistence, and test artifacts have been through their governed
planning path.

## Initial Attribute Work Queue

### Real Evidence-Backed First Pass

| Attribute | Status | Next action |
| --- | --- | --- |
| `organization_id` | ready_for_lock_pass | Draft full evidence, LLM guidance, display, read capability, and reveal posture. |
| `name` | ready_for_lock_pass | Draft full evidence, LLM guidance, display identity, update capability, validation, and error posture. |

### Demo-Only Or Needs Evidence

| Attribute | Status | Next action |
| --- | --- | --- |
| `owning_group` | demo_only_needs_decision | Keep as demo field unless evidence or fictional entity decision is supplied. |
| `review_status` | demo_only_needs_decision | Keep as demo operational status unless real Organization review workflow is approved. |
| `next_review_date` | demo_only_needs_decision | Keep as demo date-filter field unless review workflow evidence is supplied. |
| `employee_count` | demo_only_needs_decision | Keep as demo range-filter stress field unless real Organization source and reporting meaning are approved. |

## First Capability Work Queue

| Capability | Status | Scope |
| --- | --- | --- |
| `organization.read` / generic record read | pending | Read selected record fields for Record Page. |
| `organization.list` / generic record list | pending | List visible records for Record List Page. |
| `record_page.display_identity.read` | pending | Resolve title, subtitle, and identifier visibility. |
| `record_page.attribute_evidence.read` | pending | Read evidence entries for visible attributes. |
| `record_page.llm_guidance.read` | pending | Read guidance entries for visible attributes. |
| `organization.update_name` or scoped update action | pending | Update first real editable field with validation and audit. |

## Human Decision Gates

Human review should be batched around these gates rather than requested for
every attribute row.

| Gate | Question | Blocks |
| --- | --- | --- |
| Demo authority gate | Should the current demo remain Organization with demo-only fields, or become fictional? | Whether demo-only fields can stay in Organization-labeled fixture. |
| Display identity gate | Should mutable display names be categorized as `core` plus display identity, or as `identity`? | Schema/category lock for `name`-like fields. |
| Identifier visibility gate | Should system identifiers show to all approved readers, only support/root, or only reveal on demand? | Record Page header and read capability posture. |
| Review workflow gate | Does Organization need a real review workflow? | Promotion of `review_status` and `next_review_date` from demo to real field. |
| Ownership field gate | Does Organization need `owning_group` as a real fact? | Promotion of `owning_group`; permission/boundary implications. |
| Range filter gate | Is range filtering part of the signed-off template scope? | Promotion of numeric range filters such as `employee_count`. |

## Operating Rhythm

Default pass structure:

1. Codex drafts or updates a focused planning artifact for the next batch.
2. Codex auto-fills evidence/guidance rows using the rules above.
3. Codex marks uncertain fields as `needs_review` instead of stopping.
4. Codex summarizes only the batched human decision gates.
5. Human answers the smallest meaningful gate.
6. Codex updates the tracker and continues to the next batch.

## Next Planned Batch

Batch 1: lock candidates for `organization_id` and `name`.

Deliverables:

- evidence rows for both attributes
- LLM guidance rows for both attributes
- display identity posture
- read/reveal/update capability baseline drafts
- validation and action error list for `name`
- unresolved decision summary limited to the relevant gates

Expected default decisions unless contradicted:

- `organization_id` is `identity`, system-managed, immutable, exact lookup,
  and support/debug display only.
- `name` is `core` with display-identity role, required, updateable,
  searchable/sortable from normalized source evidence, and primary title in
  Record List Page and Record Page.
- Demo-only fields remain non-authoritative until explicitly promoted.
