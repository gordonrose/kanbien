# <Entity Name>

Template status:

- Use this template for new or materially refreshed data dictionary entity
  pages under `docs/data-dictionary/`.
- This is a Markdown-first bridge toward future DB-backed entity management.
- Migration mapping is governed by
  `docs/standards/data-dictionary-registry-migration-map.md`.
- Keep stable keys, categories, statuses, relationships, and retention posture
  structured so they can later migrate into `entityBuilder` or an approved
  successor without reinterpreting prose.
- When implementation exists, source code and migrations remain the source of
  truth. When implementation is planned, cite the approved planning artifact
  that owns the decision.

## Entity Registry Header

| Field | Value |
| --- | --- |
| Entity key | `<stable-entity-key>` |
| Entity name | `<Entity Name>` |
| Dictionary file | `docs/data-dictionary/<entity-key>.md` |
| Owning feature | `<featureName or planned featureName>` |
| Ownership status | `implemented`, `planned`, `proposed`, `deprecated`, or `archived` |
| Current entity status | `draft`, `active`, `superseded`, `archived`, or `deleted` |
| Primary authority | `source-code`, `planning-artifact`, `architecture-decision`, `generated-from-entity-builder`, or `mixed-transitional` |
| Primary source table or record | `<tableName or durable record name>` |
| Entity definition lineage | `<entityBuilder entityKey or not-yet-registered>` |
| Latest source review date | `YYYY-MM-DD` |
| Related PRD / steering / ADR | `<path or not-applicable>` |

## Source Authority And Future Persistence

Use this section to make the transition from current repo docs/source truth to
future DB-backed entity-management truth explicit. It should answer what wins
today, what should win later, and where the future durable record is expected
to live.

| Concern | Current posture | Future posture | Source / target |
| --- | --- | --- | --- |
| Current source of truth | `<source-code, planning-artifact, architecture-decision, generated-from-entity-builder, or mixed-transitional>` | `<expected future authority>` | `<path, feature, table, or not-yet-decided>` |
| Source precedence | `<what wins today if docs, code, migrations, DB records, generated artifacts, or exports disagree>` | `<future precedence rule>` | `<path or owner>` |
| Runtime persistence owner | `<feature or not-yet-implemented>` | `<future owning feature>` | `<src/features/<featureName> or planned path>` |
| Runtime persistence record | `<table/record or not-yet-created>` | `<future table/record>` | `<migration path, table, record type, or not-yet-decided>` |
| Entity-registry persistence owner | `<entityBuilder, successor registry, or not-yet-registered>` | `<future metadata owner>` | `<feature/table/entityKey or not-yet-decided>` |
| Entity-registry persistence record | `<entityBuilder lineage/version/attribute records or not-yet-registered>` | `<future DB-backed registry rows>` | `<entityKey, version id, table, or not-yet-decided>` |
| Markdown posture | `<source, generated-output, mirrored-transitional, or source-independent-planning>` | `<expected future Markdown posture>` | `<dictionary path or generator owner>` |
| Migration trigger | `<what event moves this entity from current authority to DB-backed truth>` | `<future handoff condition>` | `<PRD, task, migration, ADR, or not-yet-decided>` |

## Summary

| Field | Value |
| --- | --- |
| Plain-language description | `<what this durable entity represents>` |
| Business purpose | `<why the record exists>` |
| Durable fact boundary | `<facts that must remain stable on this entity or child records>` |
| Primary users / actors | `<actors that operate, govern, inspect, automate, export, or depend on it>` |
| Rebuild-from-spec value | `<what a future maintainer can reconstruct from this page>` |

## Storage Model

| Field | Value |
| --- | --- |
| Primary table or durable record | `<table or record>` |
| Primary key | `<primary key field>` |
| Stable external key | `<public/stable key or not-applicable>` |
| Versioning model | `mutable-current-record`, `immutable-versioned-lineage`, `append-only-event`, `snapshot-plus-history`, or `none` |
| Current-version pointer | `<field or not-applicable>` |
| Tenant / account boundary field | `<field or not-applicable>` |
| Soft-delete field | `<field or not-applicable>` |
| Archive field | `<field or not-applicable>` |
| Generated artifact posture | `source`, `generated-output`, `mirrored-transitional`, or `not-applicable` |
| Migration posture | `implemented`, `planned`, `source-independent-planning`, or `not-applicable` |

## Capability Inventory

Use this for every meaningful operation that acts on or depends on the entity,
not only CRUD. Include read/discovery, authoring, lifecycle, relationship
control, governance, evidence, generation/sync, automation, import/export,
security, retention, cleanup, and support capabilities when they apply.

| Capability key | Capability family | Operation | Actor / authority world | Surface | Lifecycle or relationship impact | Evidence / audit expectation | Source artifact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `<capability.key>` | one of the approved capability families below | `<list/search/get/create-draft/validate/activate/supersede/archive/restore/delete/purge/move/link/approve/export/propose/apply/etc>` | `<root/tenant/system/script/public/support>` | `<UI/API/job/script/export/import>` | `<status, version, child, parent, sibling, replacement, or cleanup impact>` | `<audit event, evidence row, runbook, test, or not-applicable>` | `<path>` | `<notes>` |

## Capability Family Rules

| Capability family | Meaning | Prefer over another family when |
| --- | --- | --- |
| `read-discovery` | The operation finds, filters, compares, reads, or renders entity truth without changing it. | The user outcome is inspection, search, history, comparison, or lookup. |
| `authoring` | The operation creates or changes draft/current descriptive entity facts. | The operation edits business or schema truth but is not primarily a lifecycle transition. |
| `lifecycle` | The operation changes currentness, visibility, supersession, archive, restore, delete, or purge posture. | The main effect is status, retained/current visibility, or lifecycle transition. |
| `relationship-control` | The operation creates, moves, reorders, replaces, detaches, or validates links between entities. | The main effect is parent, child, sibling, dependency, replacement, ownership, or evidence linkage. |
| `governance-approval` | The operation approves, rejects, locks, unlocks, reviews, or requests changes. | Human or policy approval is the main business event. |
| `evidence-audit` | The operation records, reads, reconciles, or attaches proof. | The value is traceability rather than changing primary business facts. |
| `generation-sync` | The operation generates, previews, publishes, refreshes, reconciles, or marks artifacts stale. | The entity drives Markdown, exports, projections, caches, or other derived outputs. |
| `automation` | The operation is proposed or executed by a script, job, LLM workflow, or controlled machine actor. | Machine execution authority, idempotency, retry, or proposal/apply posture is central. |
| `import-export` | The operation imports, dry-runs, validates, exports, packages, or downloads entity data. | The boundary is data movement in or out of the feature. |
| `security-access` | The operation grants, revokes, restricts, reveals, masks, or evaluates sensitive access. | The operation changes or depends on security/privacy authority. |
| `retention-cleanup` | The operation holds, releases, expires, cleans, anonymizes, purges, or records cleanup failure. | The main concern is retention, legal hold, cleanup, orphan handling, or deletion finality. |
| `support-operations` | The operation supports diagnosis, recovery, reconciliation, or operator-only correction. | The capability exists mainly for support or operational recovery rather than normal product use. |

## Attribute Inventory

Use one row per durable attribute. If the entity has child records for fields,
options, validation rules, source links, relationships, or retention rules,
list the child record in `Relationship inventory` as well.

| Attribute key | Stored field / source field | Category | Type / shape | Cardinality | Required? | System-managed? | Mutable? | Search/filter role | Design-system treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `<attribute_key>` | `<column_or_property>` | one of the approved attribute categories below | `<type>` | `single` or `multiple` | `yes`, `no`, or `conditional` | `yes` or `no` | `create-only`, `draft-only`, `updateable`, `lifecycle-only`, `immutable`, or `system-only` | `none`, `exact`, `prefix`, `full-text`, `range`, `sort`, or `facet` | `<preset slot or not-yet-defined>` | `<path or decision>` |

## Attribute Category Rules

| Category | Meaning | Default UI treatment | Default API / schema treatment | Prefer over another category when |
| --- | --- | --- | --- | --- |
| `identity` | Stable fields used to identify the record or lineage. | Prominent in header, read-only after creation unless explicitly mutable. | Usually unique, indexed, and compatibility-sensitive. | The value names or locates the record for humans, APIs, or generated artifacts. |
| `core` | Business facts needed to understand or operate the entity. | Primary detail section and first-class create/edit fields. | Validated strongly and included in standard read models. | The field is part of the entity's ordinary business meaning. |
| `secondary` | Useful business context that is not required to identify or operate the entity. | Secondary/detail section, lower visual weight. | Included in reads but may have lighter search/index posture. | The field helps users but is not essential for normal operation. |
| `metadata` | Descriptive or provenance information about the record. | Metadata panel or history/provenance area. | Often system or reviewer maintained. | The field explains source, confidence, notes, or ownership rather than business state. |
| `lifecycle` | Fields that control visibility, transition, archive, delete, restore, or supersession. | Status badge, lifecycle controls, confirmation flows. | Protected from normal update bodies and governed by lifecycle actions. | The field changes what actions are allowed or whether the record is current. |
| `relationship` | Links to parents, children, siblings, replacements, source records, or dependent records. | Relationship panel/tree/list with navigation and scoped actions. | Usually foreign-key, reference, or graph-edge backed. | The field connects this entity to another durable entity. |
| `evidence` | Fields that prove source, review, audit, or operational outcome. | Evidence/history area with source links and timestamps. | Append-only or tightly controlled where possible. | The field is used to prove why a state or fact exists. |
| `security` | Fields that affect authentication, authorization, secrecy, or abuse controls. | Hidden, masked, or restricted unless explicitly approved. | Never casually exposed; requires permission and audit review. | The value can grant access, reveal sensitive internals, or change risk posture. |
| `privacy` | Fields containing or deriving personal, customer, or confidential data. | Minimized, access-controlled, and labeled for export/delete review. | Classified, retention-aware, and privacy-reviewed. | The field could identify a person/customer or affect privacy obligations. |
| `system` | Internal fields generated or maintained by the platform. | Usually read-only metadata or hidden in normal forms. | Clients must not supply or override. | The platform, not the user, owns the value. |

## Status And Lifecycle Model

Use repo-wide status terms where possible. Add entity-specific business states
only when the generic status is not expressive enough.

| Status | Meaning for this entity | Normal visibility | Allowed next actions | Source |
| --- | --- | --- | --- | --- |
| `draft` | Record exists but is not current/default truth yet. | explicit draft reads only | update, validate, activate, abandon/delete according to policy | `<path>` |
| `active` | Record is current/default truth for normal reads. | normal reads | update, supersede, archive, delete according to policy | `<path>` |
| `superseded` | Record was replaced by a newer current record or version. | historical reads | read, export historical, restore only if approved | `<path>` |
| `archived` | Record is retained but removed from ordinary current work. | explicit retained-record reads | restore, delete/purge according to policy | `<path>` |
| `deleted` | Record is soft-deleted or marked unavailable under explicit delete policy. | explicit deleted-record reads only | restore or purge only if approved | `<path>` |

## Relationship Inventory

| Relationship key | Relationship type | Source entity | Target entity | Cardinality | Ownership / authority rule | Lifecycle impact | UX treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `<relationship_key>` | `parent`, `child`, `sibling`, `replacement`, `supersession`, `dependency`, `ownership`, `reference`, or `evidence-link` | `<entity>` | `<entity>` | `one-to-one`, `one-to-many`, `many-to-one`, or `many-to-many` | `<who controls the link>` | `<archive/delete/move/read impact>` | `<tree/list/link/diff/evidence>` | `<path>` |

## Indexes And Constraints

| Name | Type | Field(s) | Definition / rule | Why it matters | Source |
| --- | --- | --- | --- | --- | --- |
| `<index_or_constraint_name>` | `primary key`, `foreign key`, `unique`, `partial unique`, `check`, `exclusion`, `index`, or `code-enforced validation` | `<fields>` | `<rule>` | `<business/security/performance reason>` | `<path>` |

## Normalization And Validation Rules

| Rule key | Field(s) | Rule | Failure behavior / error | Source |
| --- | --- | --- | --- | --- |
| `<rule_key>` | `<fields>` | `<normalization or validation rule>` | `<error code/message or planned behavior>` | `<path>` |

## Search, Filter, And Sort Model

| Field | Operator(s) | Storage model | Index posture | Default sort / visibility impact | Source |
| --- | --- | --- | --- | --- | --- |
| `<field>` | `exact`, `prefix`, `range`, `full-text`, `facet`, or `sort` | `scalar`, `junction-table`, `jsonb-approved`, `generated-column`, or `not-searchable` | `<index or planned index>` | `<behavior>` | `<path>` |

## Mutation Semantics

| Mutation | Actor / capability | Fields changed | System-managed effects | Compatibility notes | Source |
| --- | --- | --- | --- | --- | --- |
| `create` | `<actor/capability>` | `<fields>` | `<ids/timestamps/status/defaults>` | `<compatibility rule>` | `<path>` |
| `update` | `<actor/capability>` | `<fields>` | `<updatedAt/version/history>` | `<compatibility rule>` | `<path>` |
| `supersede` | `<actor/capability>` | `<fields/relationships>` | `<status/current pointer/history>` | `<compatibility rule>` | `<path>` |
| `archive` | `<actor/capability>` | `<fields>` | `<archivedAt/status/visibility>` | `<compatibility rule>` | `<path>` |
| `delete` | `<actor/capability>` | `<fields>` | `<deletedAt/status/visibility/cleanup>` | `<compatibility rule>` | `<path>` |
| `restore` | `<actor/capability>` | `<fields>` | `<status/updatedAt/visibility>` | `<compatibility rule>` | `<path>` |

## Retention, Cleanup, Export, And Legal Hold

| Concern | Policy | Owner | Trigger | Failure / retry posture | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Retention | `<how long records are retained>` | `<feature/platform/manual>` | `<time/event/manual>` | `<failure handling>` | `<audit/runbook/test>` | `<path>` |
| Cleanup | `<expired/abandoned/orphan cleanup behavior>` | `<feature/platform/manual>` | `<job/manual/process>` | `<retry and recording>` | `<audit/runbook/test>` | `<path>` |
| Export | `<export inclusion/exclusion behavior>` | `<feature/platform/manual>` | `<request/job/manual>` | `<failure handling>` | `<audit/runbook/test>` | `<path>` |
| Delete / purge | `<soft/hard/delete posture>` | `<feature/platform/manual>` | `<action/job/legal process>` | `<retry and recording>` | `<audit/runbook/test>` | `<path>` |
| Legal hold | `<hold behavior or not-explicitly-defined>` | `<feature/platform/manual>` | `<hold placement/removal>` | `<blocked cleanup behavior>` | `<audit/runbook/test>` | `<path>` |

## Authorization And Tenant Boundary

| Concern | Rule | Source |
| --- | --- | --- |
| Authority world | `root`, `tenant`, `shared-cross-tenant`, `system`, or `public` | `<path>` |
| Tenant context required | `yes`, `no`, or `not-applicable` | `<path>` |
| Tenant context source | `<route/session/selected account/system job/not-applicable>` | `<path>` |
| Governing capability | `<capability key or planned>` | `<path>` |
| Cross-tenant posture | `deny-by-default`, `approved-root-cross-tenant`, or `not-applicable` | `<path>` |
| Object-level rule | `<entity-specific authorization rule>` | `<path>` |

## API, UI, And Design-System Posture

| Concern | Posture | Source |
| --- | --- | --- |
| API required | `yes`, `no`, `planned`, or `existing` | `<path>` |
| UI required | `yes`, `no`, `planned`, or `existing` | `<path>` |
| Default entity-management preset | `<design-system preset key or not-yet-defined>` | `<path>` |
| List view treatment | `<columns/search/actions/status/relationship summary>` | `<path>` |
| Detail view treatment | `<sections/attribute groups/relationship panels/history>` | `<path>` |
| Create/edit treatment | `<form pattern/validation/confirmation>` | `<path>` |
| Lifecycle action treatment | `<confirmations/diff/history/undo posture>` | `<path>` |
| Relationship navigation treatment | `<tree/list/backlinks/dependency graph>` | `<path>` |

## Compliance Classification And Governance

| Concern | Classification / rule | Source |
| --- | --- | --- |
| Data classification | `<public/internal/confidential/restricted/etc>` | `<path>` |
| Privacy / PII relevance | `<yes/no plus explanation>` | `<path>` |
| Security relevance | `<none/low/moderate/high plus explanation>` | `<path>` |
| Audit relevance | `<none/limited/yes plus explanation>` | `<path>` |
| Retention / cleanup posture | `<summary>` | `<path>` |
| Export / deletion posture | `<summary>` | `<path>` |
| Legal hold posture | `<summary>` | `<path>` |
| Operational evidence requirements | `<commands/tests/runbooks/review>` | `<path>` |

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | `yes`, `no`, or `not-applicable` | `enforced-by-schema`, `enforced-by-code`, `enforced-by-test`, `enforced-by-maintained-artifact`, `manual-review-required`, or `not-applicable` | `<evidence>` | `<notes>` |
| System-managed identifiers, timestamps, lifecycle, and audit fields | `yes`, `no`, or `not-applicable` | `<posture>` | `<evidence>` | `<notes>` |
| Normalization, uniqueness, and searchable-storage rules | `yes`, `no`, or `not-applicable` | `<posture>` | `<evidence>` | `<notes>` |
| Soft-delete and normal-read visibility | `yes`, `no`, or `not-applicable` | `<posture>` | `<evidence>` | `<notes>` |
| Tenant boundary / object-level authorization | `yes`, `no`, or `not-applicable` | `<posture>` | `<evidence>` | `<notes>` |
| Retention, cleanup, export/delete, and legal-hold posture | `yes`, `no`, or `not-applicable` | `<posture>` | `<evidence>` | `<notes>` |
| Auditability and operational evidence | `yes`, `no`, or `not-applicable` | `<posture>` | `<evidence>` | `<notes>` |

## Related Errors

| Error code | Message | Field / object | Reason | Source |
| --- | --- | --- | --- | --- |
| `<ERROR_CODE>` | `<message>` | `<field or object>` | `<reason>` | `<path>` |

## Source And Evidence Links

| Source type | Path / reference | What it proves |
| --- | --- | --- |
| `<migration/source/PRD/API contract/permission mapping/test/runbook/ADR/discovery/steering>` | `<path>` | `<proof>` |
