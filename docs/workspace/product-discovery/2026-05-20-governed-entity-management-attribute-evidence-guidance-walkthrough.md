# Governed Entity Management Attribute Evidence And LLM Guidance Walkthrough

Status:

- `walkthrough_draft_step_1`
- Date: 2026-05-20
- Scope: first-pass attribute evidence and LLM guidance review for the current
  entity-management/list-management design-system demo
- Implementation status: not started
- Runtime/code changes: none

## Purpose

Start the step-by-step walkthrough needed before the Record Page model can
become implementation baseline.

This artifact focuses on the current dummy Organization demo fixture used by
the design-system template. It separates:

- attributes with real Organization evidence
- attributes that are useful template-demo fields only
- LLM guidance that can be defaulted
- LLM guidance that needs human or technical review before lock-in
- capability details that are still placeholders

Source context:

- `docs/workspace/product-discovery/2026-05-20-governed-entity-management-three-level-reconciliation.md`
- `docs/workspace/product-discovery/2026-05-20-governed-entity-management-evidence-guidance-execution-plan.md`
- `docs/workspace/design-system/templates/record-management-list-centric-organization-demo-fixture.json`
- `docs/workspace/design-system/templates/record-management-list-centric-template.md`
- `docs/data-dictionary/organization.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-schema-formalization.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-attribute-reference.md`

This is not a real Organization migration and does not approve runtime routes,
persistence, permissions, generated pages, or app adoption.

## Executive Read

The current demo is valuable, but the attribute truth is mixed.

| Attribute | Current confidence | Executive read |
| --- | --- | --- |
| `organization_id` | high | Real Organization identity field; safe to use as system-managed evidence candidate. |
| `name` | high | Real Organization business field; safe to use as primary display/title candidate. |
| `owning_group` | low-medium | Useful demo filter/display field, but not currently a real Organization data-dictionary attribute. |
| `review_status` | low-medium | Useful demo operational status field, but it does not match the current real Organization lifecycle model. |
| `next_review_date` | low | Useful demo scheduling/review field; not currently evidenced as real Organization source truth. |
| `employee_count` | low | Useful demo numeric/range-filter stress field; not currently evidenced as real Organization source truth. |

Decision implication:

- Do not treat all six demo attributes as locked Organization attributes.
- Use `organization_id` and `name` as the first real evidence-backed walkthrough
  candidates.
- Keep `owning_group`, `review_status`, `next_review_date`, and
  `employee_count` as template-demo or possible future view-model attributes
  until evidence is supplied or the demo entity is reframed as fictional.

## Evidence Candidate Registry

These evidence keys are proposed for the walkthrough. They are not yet a formal
entity-definition `evidenceRegistry`.

| Evidence key | Source type | Location | Proof statement |
| --- | --- | --- | --- |
| `organization_data_dictionary` | `data_dictionary` | `docs/data-dictionary/organization.md` | Current Organization planning/data-dictionary source for durable attributes, capabilities, lifecycle, search, relationships, and UI posture. |
| `record_management_fixture` | `decision_log` | `docs/workspace/design-system/templates/record-management-list-centric-organization-demo-fixture.json` | Dummy design-system fixture proving list, filter, status, placement, and selected-record display behavior. |
| `record_management_template_contract` | `decision_log` | `docs/workspace/design-system/templates/record-management-list-centric-template.md` | Draft template contract for record list, drawer, status, filter, action, and placement behavior. |
| `entity_management_three_level_reconciliation` | `decision_log` | `docs/workspace/product-discovery/2026-05-20-governed-entity-management-three-level-reconciliation.md` | Clarifies Entity Page, Record List Page, and Record Page ownership boundaries. |
| `schema_formalization_guidance` | `prd` | `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-schema-formalization.md` | Defines required evidence, attribute, authoring-guidance, and review posture expected before schema lock. |

## Attribute Walkthrough

### `organization_id`

Current fixture role:

- system identity field
- appears as `surfaceModel.displayIdentity.recordIdentifierAttributeKey`
- not placed directly in the visible record list or drawer field form

Evidence posture:

- Evidence-backed by the Organization data dictionary as primary key and stable
  external key.
- Evidence-backed by the demo fixture as selected-record identifier candidate.

Proposed attribute lock:

| Concern | Proposed value |
| --- | --- |
| Category | `identity` |
| Attribute type | `uuid` |
| Cardinality | `single` |
| Required | yes |
| System-managed | yes |
| Mutability | `immutable` |
| Search posture | exact lookup only |
| Normal Record Page display | support/debug identifier only, not primary human label |

LLM guidance:

| Context | Guidance |
| --- | --- |
| New entity | Use platform default for system identifier; do not ask the human. |
| Entity update | System-owned; do not ask the human. |
| Repo migration | Derive from source truth and migration/API evidence. |
| Persistent revision | System-owned; technical review required only if identity model changes. |

Open items:

- Decide whether support-facing record identifiers should be visible by default
  on the Record Page header or only in support/root view.
- Define the read capability that may reveal this identifier in each actor
  context.

### `name`

Current fixture role:

- primary list title
- selected-record header title
- editable field in the Record Page `identity` group
- page-shell search target
- default sort field

Evidence posture:

- Evidence-backed by the Organization data dictionary as a durable core field.
- Evidence-backed by API/data-dictionary rules requiring trim, lowercase
  normalized uniqueness, and update behavior.
- Evidence-backed by the demo fixture as the primary display identity field.

Proposed attribute lock:

| Concern | Proposed value |
| --- | --- |
| Category | `core` or `identity` display field; likely `core` with display-identity role |
| Attribute type | `string` |
| Cardinality | `single` |
| Required | yes |
| System-managed | no |
| Mutability | `updateable` |
| Search posture | text/prefix/sort through normalized storage evidence |
| Normal Record Page display | primary title and editable identity/details field |

LLM guidance:

| Context | Guidance |
| --- | --- |
| New entity | Ask or recommend-and-confirm which human-facing name field should identify the record. |
| Entity update | Recommend-and-confirm before changing primary display identity. |
| Repo migration | Derive from data dictionary, API contracts, and UI/source evidence. |
| Persistent revision | Require compatibility review before changing title/display role. |

Open items:

- Decide whether the canonical category should be `core` with display identity
  metadata, or `identity` because it names the record.
- Define the update capability and error model for required name validation,
  duplicate normalized names, and trimming behavior.

### `owning_group`

Current fixture role:

- list subtitle/secondary badge
- collection-select filter
- editable field in the Record Page `ownership` group
- record subtitle in `surfaceModel.displayIdentity`

Evidence posture:

- Evidence-backed only by the design-system demo fixture.
- Not currently found as a real Organization data-dictionary attribute.

Proposed walkthrough posture:

| Concern | Proposed value |
| --- | --- |
| Status | demo/view-model candidate, not real Organization lock |
| Category | likely `relationship` or `core`, depending on future meaning |
| Attribute type | `limited_enum` in demo; may become relationship/reference in real implementation |
| Mutability | unresolved |
| Search posture | demo facet/filter only |
| Normal Record Page display | useful ownership group example, not yet source-backed |

LLM guidance:

| Context | Guidance |
| --- | --- |
| New entity | Ask who or what owns the record only when ownership is a real business concept. |
| Entity update | Recommend-and-confirm if adding ownership display to an existing view. |
| Repo migration | Do not invent; derive only from source truth or mark as missing evidence. |
| Persistent revision | Review required because ownership can imply permissions or boundary behavior. |

Open items:

- Decide whether this should remain a fictional demo field.
- If real, decide whether it is a simple enum, role/group relationship, team
  reference, tenant/org boundary value, or view-only derived label.
- Define capability and authorization impact before using it for real access or
  ownership decisions.

### `review_status`

Current fixture role:

- operational status field
- status-tab source
- list status badge
- read-only Record Page field in the `review` group

Evidence posture:

- Evidence-backed only by the design-system demo fixture.
- Current real Organization data dictionary uses lifecycle statuses such as
  active, archived, and deleted, not this review-status set.

Proposed walkthrough posture:

| Concern | Proposed value |
| --- | --- |
| Status | demo operational-status candidate |
| Category | `operational_lifecycle` if made real |
| Attribute type | `operational_status` |
| Mutability | `lifecycle_managed` |
| Search posture | status-bar route, not filter-bar card |
| Normal Record Page display | status badge plus transition actions when authorized |

LLM guidance:

| Context | Guidance |
| --- | --- |
| New entity | Ask about the normal workflow/statuses only after record purpose and users are clear. |
| Entity update | Recommend-and-confirm changes because status changes affect views and compatibility. |
| Repo migration | Derive from existing lifecycle/workflow evidence; do not invent review statuses. |
| Persistent revision | Review required because statuses drive list visibility, counts, actions, and compatibility. |

Open items:

- Decide whether this review status is a generic demo workflow or a real
  Organization review workflow.
- Define allowed transitions and status-transition capability before
  implementation baseline.
- Keep system lifecycle separate from operational review status.

### `next_review_date`

Current fixture role:

- date-range filter source
- editable Record Page field in the `review` group

Evidence posture:

- Evidence-backed only by the design-system demo fixture.
- Not currently found as a real Organization data-dictionary attribute.

Proposed walkthrough posture:

| Concern | Proposed value |
| --- | --- |
| Status | demo scheduling/review candidate |
| Category | likely `metadata` or `core`, depending on real business meaning |
| Attribute type | `date` |
| Mutability | unresolved; demo says `updateable` |
| Search posture | date range only if index/storage evidence exists |
| Normal Record Page display | review group field when workflow requires it |

LLM guidance:

| Context | Guidance |
| --- | --- |
| New entity | Recommend only when the record has a real review/renewal workflow. |
| Entity update | Ask/recommend-and-confirm if adding review timing to a view. |
| Repo migration | Derive only from source truth; otherwise mark as no evidence. |
| Persistent revision | Review required if it drives reminders, SLA, cleanup, or compliance behavior. |

Open items:

- Decide whether this field is just visual proof for the date filter.
- If real, define whether it drives reminders, review workflow, status changes,
  or reporting.
- Define audit and update capability if changing the date has operational
  consequence.

### `employee_count`

Current fixture role:

- numeric drawer field
- blocked value-range filter example

Evidence posture:

- Evidence-backed only by the design-system demo fixture.
- Not currently found as a real Organization data-dictionary attribute.

Proposed walkthrough posture:

| Concern | Proposed value |
| --- | --- |
| Status | demo numeric/range-filter stress candidate |
| Category | likely `core` or `secondary` if made real |
| Attribute type | `integer` |
| Mutability | unresolved; demo says `updateable` |
| Search posture | sort may be possible; value-range filter remains blocked until range UX signoff |
| Normal Record Page display | secondary/detail field only if real Organization meaning is approved |

LLM guidance:

| Context | Guidance |
| --- | --- |
| New entity | Ask only if the organization record truly needs headcount as a maintained fact. |
| Entity update | Recommend-and-confirm because numeric facts may affect reporting or segmentation. |
| Repo migration | Derive only from source truth; otherwise mark as missing evidence. |
| Persistent revision | Review required if used for reporting, billing, segmentation, or compliance. |

Open items:

- Decide whether this should remain purely a range-filter demo field.
- If real, define source of truth, update cadence, historical correctness needs,
  and reporting implications.
- Keep value-range filtering blocked until the range filter experience is signed
  off.

## Capability Baseline Needed Next

The attribute walkthrough shows that the next capability work should not start
with every placeholder action at once.

Recommended first capability baseline:

| Capability candidate | Why first |
| --- | --- |
| `organization.read` or generic record read | Required before Record Page can display any selected-record field. |
| `organization.list` or generic record list | Required before Record List Page can supply selected records. |
| `organization.update_name` or scoped update action | Smallest useful mutation for the first evidence-backed editable field. |
| `record_page.display_identity.read` | Needed to decide how title, subtitle, and identifier are exposed. |
| `record_page.attribute_evidence.read` | Needed before evidence UI can be real rather than decorative. |
| `record_page.llm_guidance.read` | Needed before LLM guidance UI can be real rather than decorative. |

## Immediate Decisions For Human Review

1. Should the current demo remain named Organization even though four of six
   attributes are demo-only, or should the demo entity become fictional to avoid
   false Organization authority?
2. For the first real walkthrough, should we lock only `organization_id` and
   `name`, then add more real Organization attributes from the data dictionary?
3. Should `name` be categorized as `core` with display identity metadata, or as
   `identity` because it names the record?
4. Should Record Page identifier display be visible to all approved readers,
   root/support only, or hidden unless explicitly revealed?

## Recommended Next Step

Continue with a focused lock pass for `organization_id` and `name` only:

- confirm evidence keys
- define LLM guidance entries
- define display identity behavior
- define read/update capability requirements
- define validation and action errors
- mark remaining demo-only fields as non-authoritative until evidence exists
