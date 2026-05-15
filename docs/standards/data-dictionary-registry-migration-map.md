# Data Dictionary Registry Migration Map

This standard defines how Markdown data dictionary pages should map to a
future DB-backed entity registry.

It exists so current Markdown pages can be structured once, then migrated into
`entityBuilder` or an approved successor registry without reinterpreting prose.

## Current Posture

- Markdown data dictionary pages remain source-independent maintained artifacts.
- When implementation exists, source code, migrations, and runtime contracts
  remain the source of truth over stale prose.
- When implementation is planned, approved PRD, Technical Steering, API
  contract, asset decision, and data dictionary artifacts own the planned
  record truth until implementation supersedes them.
- Once DB-backed registry truth exists, Markdown should become generated output
  or an explicitly marked mirrored transitional artifact.

## Migration Mapping

| Markdown section | Future registry target | Migration rule |
| --- | --- | --- |
| `Entity Registry Header` | Entity lineage / registry root row | Map stable `Entity key`, name, owning feature, status, source table/record, and related artifacts into entity-level metadata. |
| `Source Authority And Future Persistence` | Source-authority and materialization metadata | Preserve current authority, future authority, precedence, runtime persistence owner, registry owner, Markdown posture, and migration trigger as explicit registry metadata. |
| `Summary` | Entity description and durable fact boundary fields | Map short description, business purpose, durable fact boundary, actors, and rebuild value to entity-level descriptive metadata. |
| `Storage Model` | Runtime persistence metadata | Map table/record, primary key, external key, versioning, tenant boundary, soft-delete/archive fields, generated artifact posture, and migration posture to structured persistence metadata. |
| `Capability Inventory` | Capability-operation rows | Map each row to one operation record keyed by capability key, family, operation, actor world, surface, lifecycle/relationship impact, evidence posture, and source artifact. |
| `Capability Family Rules` | Capability taxonomy reference data | Treat as controlled vocabulary unless an approved registry capability-family catalog supersedes it. |
| `Attribute Inventory` | Attribute rows | Map one row per durable attribute, preserving key, source field, category, type, cardinality, required/system-managed/mutable flags, search role, UI treatment, and source. |
| `Attribute Category Rules` | Attribute taxonomy reference data | Treat as controlled vocabulary unless an approved registry attribute-category catalog supersedes it. |
| `Status And Lifecycle Model` | Entity status and lifecycle transition rows | Map each status to meaning, visibility, allowed next actions, and source evidence. |
| `Relationship Inventory` | Entity relationship rows | Map each relationship key to source entity, target entity, relationship type, cardinality, authority rule, lifecycle impact, UX treatment, and source. |
| `Indexes And Constraints` | Persistence constraint rows | Map one row per primary key, foreign key, unique, partial unique, check, index, or code-enforced validation rule. |
| `Normalization And Validation Rules` | Validation rule rows | Map one row per field or cross-field validation/normalization rule, including failure behavior and source. |
| `Search, Filter, And Sort Model` | Search/index capability rows | Map supported operators, storage model, index posture, visibility impact, and source per searchable field. |
| `Mutation Semantics` | Mutation behavior rows | Map each mutation to actor/capability, changed fields, system effects, compatibility notes, and source. |
| `Retention, Cleanup, Export, And Legal Hold` | Retention and lifecycle-policy rows | Map retention, cleanup, export, delete/purge, and legal-hold concerns to policy, owner, trigger, failure/retry posture, evidence, and source. |
| `Authorization And Tenant Boundary` | Authorization boundary metadata | Map authority world, tenant context, governing capability, cross-tenant posture, and object-level rule. |
| `API, UI, And Design-System Posture` | Surface and design-system metadata | Map API/UI requirement, entity-management preset, list/detail/form/lifecycle/relationship UI treatment, and source. |
| `Compliance Classification And Governance` | Compliance classification rows | Map data classification, privacy, security, audit, retention, export/delete, legal-hold, and operational evidence posture. |
| `Compliance And Enforcement Trace` | Standards enforcement rows | Map standard/rule, applicability, enforcement posture, evidence, and notes. |
| `Related Errors` | Error contract rows | Map each error code to message, field/object, reason, and source. |
| `Source And Evidence Links` | Provenance rows | Map each cited artifact to source type, path/reference, and proof statement. |

## Precedence Rule

During the transition to DB-backed registry truth:

1. Applied migrations and runtime source win for implemented behavior.
2. API contracts, permission mappings, and feature manifests must be reconciled
   with implemented behavior before a slice is treated as complete.
3. Approved planning artifacts own planned behavior before implementation.
4. Data dictionary pages expose the entity contract and migration mapping, but
   must not silently override implemented source.
5. Generated Markdown must not become a second source of truth once registry
   records own the entity.

## Migration Readiness Check

Before migrating a Markdown entity page into DB-backed registry records, confirm
that:

- every table row has a stable key or can derive one deterministically
- every field/category/status/relationship value uses approved vocabulary or
  names a needed taxonomy change
- source authority and future persistence owner are explicit
- runtime persistence and registry persistence are not conflated
- generated Markdown posture is explicit
- retention, cleanup, export, delete, and legal-hold policy rows are structured
- authorization and tenant-boundary rows identify the current authority context
- source and evidence links are sufficient to resolve conflicts
