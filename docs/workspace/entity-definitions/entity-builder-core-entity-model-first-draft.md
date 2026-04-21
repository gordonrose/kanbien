# Entity Builder Core Entity Model First Draft

## Status

- Draft status:
  first draft
- Intended future owning feature:
  `entityBuilder`
- Purpose:
  define the durable core model before capability-level planning and code
  implementation begin

## Goal

Create durable repo-facing entity truth that can later support:

- capability-matrix drafting
- governed form generation or form planning
- downstream feature planning and implementation loops
- upstream source truth for the repo data dictionary once the feature is
  implemented and synchronized

This model is intentionally not just schema storage.
It defines stable entity meaning, stable attribute meaning, explicit validation
rules, governed form compatibility, version semantics, and approved export
behavior.

## Consolidated Decisions

- `entityKey` is the stable external logical identity for an entity and remains
  stable across versions.
- `attributeKey` is the stable external logical identity for an attribute
  within an entity lineage and remains stable across versions.
- internal durable record identities use UUIDs; external stable identity uses
  `entityKey` and `attributeKey`.
- versioning uses replacement records, not key renaming.
- default exports return active definitions only; superseded and archived
  definitions remain explicitly exportable for historical reconstruction.
- consumers need both lookup modes:
  current by `entityKey`, and exact by version or durable id.
- one canonical derived export shape exists in v1.
- the export shape carries an explicit export-format version from day one.
- exports are generated on demand from authoritative persisted records rather
  than stored as separate durable snapshots in v1.
- defaults remain implicit in persisted truth; effective defaults are resolved
  by validation, export, and read models.
- type-catalog and pattern-catalog behavior must remain version-aware enough to
  preserve historical honesty.
- `entityBuilder` is root-only in v1.
- first-class audit entities are deferred, but important actions must remain
  audit-visible in capability contracts.
- entity relationships are deferred from v1 and should be revisited as a later
  expansion.

## Recommended Feature Boundary

The future `entityBuilder` feature should own:

- durable entity-definition records
- durable entity-definition version records
- durable attribute records within an entity version
- durable validation-rule records
- durable enum or options records for explicit bounded option sets
- durable reusable option-catalog references
- validation of approved attribute-type, rule, and form-pattern references
- export or projection seams derived from persisted entity truth

The future `entityBuilder` feature should not own in v1:

- design-system promotion work itself
- ad hoc form rendering controls outside approved patterns
- relationship modeling between entities
- dynamic external option providers
- downstream code generation internals
- feature-specific business implementation for consumers of an entity
- first-class audit entity families

## Truth-Layer Separation

### Persisted Entity Truth

Persisted truth should live in normalized feature-owned records:

1. `Entity Definition`
2. `Entity Definition Version`
3. `Entity Definition Attribute`
4. `Entity Definition Attribute Validation Rule`
5. `Entity Definition Attribute Option`
6. `Entity Definition Attribute Source Link` for computed dependencies when
   needed

These records are authoritative.

### Form-Facing Truth

Form-facing truth lives on `Entity Definition Attribute` as explicit structure,
not as an unbounded metadata blob.

Required or optional form-facing fields:

- `label`
  required
- `description`
  required
- `helpText`
  optional
- `placeholderText`
  optional and only meaningful when `formFacing = true`
- `formFacing`
  required, default `true`
- `defaultFormPatternKey`
  required only when `formFacing = true`

Compatibility of `defaultFormPatternKey` must be validated against:

- `attributeType`
- `valueCardinality`
- `attributeKind` when relevant

The key must reference
[approved-form-pattern-catalog.md](./approved-form-pattern-catalog.md).

### Derived Or Exported Truth

Derived truth is exported from persisted records but must not replace them as
the authority.

Examples:

- repo-facing normalized entity snapshots
- capability-matrix input exports
- downstream planning exports
- form-generation projections

## Core Catalogs

### Attribute Kind Catalog

Approved v1 values:

- `persisted`
- `computed`

`attributeKind` answers where the value comes from, not what kind of value it
is.

### Attribute Type Catalog

Approved v1 values:

- `string`
- `text`
- `boolean`
- `integer`
- `decimal`
- `uuid`
- `email`
- `url`
- `date`
- `datetime`
- `enum`
- `coordinates`

`attributeType` answers what kind of value the attribute holds.

### Value Cardinality Catalog

Approved v1 values:

- `single`
- `multiple`

`valueCardinality` is separate from `attributeType` so the model can express:

- persisted `email`, single
- persisted `enum`, multiple
- computed `date`, single
- computed `string`, multiple

`multiple` does not imply array-column storage in downstream implementations.
Actual persistence strategy should still follow repo storage rules and favor
normalized or junction-table shapes where searchable multi-value behavior is
needed.

### Validation Rule Catalog

Approved v1 values:

- `required`
- `min_length`
- `max_length`
- `pattern`
- `enum_membership`
- `type_format`

Rule defaults may be derived automatically from `attributeType`, then refined
or overridden explicitly at the attribute-definition level.

### Default Resolution Rule

Persisted records store:

- declared attribute shape
- declared form-facing truth
- explicit validation overrides

Persisted records do not redundantly copy inherited defaults from the type or
pattern catalogs.

Validation, export, and read models resolve effective defaults on demand.

## Proposed Durable Entities

### 1. Entity Definition

- Description:
  stable logical identity for one repo-facing entity family
- Why it exists:
  preserves long-lived entity identity across replacement versions

Proposed durable fields:

- `entityDefinitionId`
  Type / Shape: `UUID`
  Description: internal durable identity for the entity lineage
- `entityKey`
  Type / Shape: `TEXT`
  Description: stable normalized machine-facing external identity such as
  `customer_profile`
  Constraints / Notes: required, trimmed, snake_case, immutable after create,
  globally unique
- `entityName`
  Type / Shape: `TEXT`
  Description: human-readable entity family name such as `Customer Profile`
- `description`
  Type / Shape: `TEXT`
  Description: durable meaning of the entity family
- `currentVersionId`
  Type / Shape: `UUID | NULL`
  Description: current active version if one exists
- `status`
  Type / Shape:
  `'draft' | 'active' | 'superseded' | 'archived'`
  Description: lifecycle state of the logical entity family
- `createdAt`
  Type / Shape: `TIMESTAMPTZ`
- `updatedAt`
  Type / Shape: `TIMESTAMPTZ`
- `archivedAt`
  Type / Shape: `TIMESTAMPTZ | NULL`

Recommended constraints:

- primary key on `entityDefinitionId`
- unique index on `entityKey`
- index on `status`
- index on `currentVersionId`
- index on `updatedAt`

### 2. Entity Definition Version

- Description:
  one immutable version snapshot under a stable `entityKey`
- Why it exists:
  supports version-by-replacement without renaming the logical entity

Proposed durable fields:

- `entityDefinitionVersionId`
  Type / Shape: `UUID`
  Description: internal durable identity for one entity version
- `entityDefinitionId`
  Type / Shape: `UUID`
  Description: owning entity lineage
- `versionNumber`
  Type / Shape: `INTEGER`
  Description: monotonic version number within one entity lineage
- `status`
  Type / Shape:
  `'draft' | 'active' | 'superseded' | 'archived'`
  Description: lifecycle state for this exact version
- `supersedesVersionId`
  Type / Shape: `UUID | NULL`
  Description: prior version replaced by this version when applicable
- `createdAt`
  Type / Shape: `TIMESTAMPTZ`
- `updatedAt`
  Type / Shape: `TIMESTAMPTZ`
- `activatedAt`
  Type / Shape: `TIMESTAMPTZ | NULL`
- `supersededAt`
  Type / Shape: `TIMESTAMPTZ | NULL`
- `archivedAt`
  Type / Shape: `TIMESTAMPTZ | NULL`

Recommended constraints:

- primary key on `entityDefinitionVersionId`
- foreign key to `Entity Definition`
- unique index on `(entityDefinitionId, versionNumber)`
- partial unique index ensuring at most one active version per entity lineage
- index on `status`
- index on `supersedesVersionId`

### 3. Entity Definition Attribute

- Description:
  one durable attribute record owned by one entity version
- Why it exists:
  keeps attribute truth normalized, versioned, and explicit

Proposed durable fields:

- `entityDefinitionAttributeId`
  Type / Shape: `UUID`
  Description: internal durable identity for one attribute row
- `entityDefinitionVersionId`
  Type / Shape: `UUID`
  Description: owning entity version identifier
- `attributeKey`
  Type / Shape: `TEXT`
  Description: stable normalized external identity such as `display_name`
  Constraints / Notes: required, trimmed, snake_case, immutable within the
  entity lineage
- `attributeKind`
  Type / Shape: `'persisted' | 'computed'`
  Description: whether the value is directly persisted or derived
- `attributeType`
  Type / Shape: approved v1 type key
  Description: value-shape catalog key
- `valueCardinality`
  Type / Shape: `'single' | 'multiple'`
  Description: whether the attribute permits one or many values
- `label`
  Type / Shape: `TEXT`
  Description: required field display label
- `description`
  Type / Shape: `TEXT`
  Description: required durable explanation of the attribute
- `helpText`
  Type / Shape: `TEXT | NULL`
  Description: optional supplementary guidance
- `placeholderText`
  Type / Shape: `TEXT | NULL`
  Description: optional placeholder text when `formFacing = true`
- `formFacing`
  Type / Shape: `BOOLEAN`
  Description: whether the attribute is intended to surface in governed forms
  Constraints / Notes: required, defaults to `true`
- `defaultFormPatternKey`
  Type / Shape: `TEXT | NULL`
  Description: approved default form seam or parent-owned pattern
  Constraints / Notes: required when `formFacing = true`; null when not
  form-facing
- `optionsMode`
  Type / Shape: `'none' | 'inline' | 'catalog_reference'`
  Description: how bounded options are sourced for enum or select-like
  attributes
- `optionsCatalogKey`
  Type / Shape: `TEXT | NULL`
  Description: stable external key to a separately maintained options catalog
  when `optionsMode = catalog_reference`
- `derivationNote`
  Type / Shape: `TEXT | NULL`
  Description: required human-readable derivation summary when
  `attributeKind = computed`
- `displayOrder`
  Type / Shape: `INTEGER`
  Description: stable default attribute order for planners and exports
- `createdAt`
  Type / Shape: `TIMESTAMPTZ`
- `updatedAt`
  Type / Shape: `TIMESTAMPTZ`

Recommended constraints:

- primary key on `entityDefinitionAttributeId`
- foreign key from `entityDefinitionVersionId` to `Entity Definition Version`
- unique index on `(entityDefinitionVersionId, attributeKey)`
- unique index on `(entityDefinitionVersionId, displayOrder)`
- index on `(entityDefinitionVersionId, attributeType)`
- index on `(entityDefinitionVersionId, attributeKind)`
- index on `(entityDefinitionVersionId, valueCardinality)`
- check rule enforcing `defaultFormPatternKey IS NOT NULL` when
  `formFacing = true`
- check rule enforcing `derivationNote IS NOT NULL` when
  `attributeKind = computed`

### 4. Entity Definition Attribute Validation Rule

- Description:
  normalized durable validation rule owned by one attribute
- Why it exists:
  keeps validation explicit and queryable without collapsing multiple rules into
  one opaque metadata blob

Proposed durable fields:

- `entityDefinitionAttributeValidationRuleId`
  Type / Shape: `UUID`
- `entityDefinitionAttributeId`
  Type / Shape: `UUID`
- `ruleKey`
  Type / Shape: approved v1 validation-rule key
- `ruleArgumentType`
  Type / Shape:
  `'none' | 'string' | 'integer' | 'decimal' | 'boolean'`
- `ruleArgumentString`
  Type / Shape: `TEXT | NULL`
- `ruleArgumentInteger`
  Type / Shape: `INTEGER | NULL`
- `ruleArgumentDecimal`
  Type / Shape: `NUMERIC | NULL`
- `ruleArgumentBoolean`
  Type / Shape: `BOOLEAN | NULL`
- `errorMessage`
  Type / Shape: `TEXT | NULL`
- `displayOrder`
  Type / Shape: `INTEGER`
- `createdAt`
  Type / Shape: `TIMESTAMPTZ`
- `updatedAt`
  Type / Shape: `TIMESTAMPTZ`

Recommended constraints:

- primary key on `entityDefinitionAttributeValidationRuleId`
- foreign key from `entityDefinitionAttributeId` to
  `Entity Definition Attribute`
- unique index on `(entityDefinitionAttributeId, ruleKey, displayOrder)`
- check rule ensuring typed-argument consistency with `ruleArgumentType`

### 5. Entity Definition Attribute Option

- Description:
  inline durable option row for enum or bounded-choice attributes
- Why it exists:
  makes explicit bounded options first-class and ordered without relying on one
  loose string list

Proposed durable fields:

- `entityDefinitionAttributeOptionId`
  Type / Shape: `UUID`
- `entityDefinitionAttributeId`
  Type / Shape: `UUID`
- `optionKey`
  Type / Shape: `TEXT`
  Description: stable normalized external option identity
- `label`
  Type / Shape: `TEXT`
- `description`
  Type / Shape: `TEXT | NULL`
- `displayOrder`
  Type / Shape: `INTEGER`
- `createdAt`
  Type / Shape: `TIMESTAMPTZ`
- `updatedAt`
  Type / Shape: `TIMESTAMPTZ`

Recommended constraints:

- primary key on `entityDefinitionAttributeOptionId`
- foreign key from `entityDefinitionAttributeId` to
  `Entity Definition Attribute`
- unique index on `(entityDefinitionAttributeId, optionKey)`
- unique index on `(entityDefinitionAttributeId, displayOrder)`

### 6. Entity Definition Attribute Source Link

- Description:
  ordered dependency link from a computed attribute to one or more source
  attribute keys
- Why it exists:
  keeps computed dependencies explicit without requiring a full expression
  engine

Proposed durable fields:

- `entityDefinitionAttributeSourceLinkId`
  Type / Shape: `UUID`
- `entityDefinitionAttributeId`
  Type / Shape: `UUID`
  Description: computed attribute row
- `sourceAttributeKey`
  Type / Shape: `TEXT`
  Description: referenced source attribute key within the same entity version
- `displayOrder`
  Type / Shape: `INTEGER`

Recommended constraints:

- primary key on `entityDefinitionAttributeSourceLinkId`
- foreign key from `entityDefinitionAttributeId` to
  `Entity Definition Attribute`
- unique index on `(entityDefinitionAttributeId, sourceAttributeKey)`
- unique index on `(entityDefinitionAttributeId, displayOrder)`

## Activation Readiness Rules

An entity version should not become `active` unless every attribute in that
version satisfies the declared completeness rules.

### Persisted Attribute Activation Readiness

Every persisted attribute must have:

- `attributeKind`
- `attributeType`
- `valueCardinality`
- `label`
- `description`
- `validationRules`
- `formFacing`
- `defaultFormPatternKey` when `formFacing = true`

### Computed Attribute Activation Readiness

Every computed attribute must have:

- `attributeKind`
- `attributeType`
- `valueCardinality`
- `label`
- `description`
- `derivationNote`
- `sourceAttributeKeys`
- `validationRules`
- `formFacing`
- `defaultFormPatternKey` when `formFacing = true`

### Entity Version Activation Readiness

An entity version should not activate unless:

- it contains at least one attribute
- every attribute is activation-ready
- every form-facing attribute has a compatible approved form pattern
- every enum or select-like attribute has valid inline options or a valid
  options-catalog reference
- computed dependencies resolve to valid source attribute keys in the same
  version

## First Drafted Entity Definition

This first concrete entity definition models the feature's own core entity
family rather than a downstream business entity.

### Entity Family: `entity_definition`

- Stable external identity:
  `entityKey = entity_definition`
- Human name:
  `Entity Definition`
- Description:
  durable repo-facing definition of one entity family and its governed
  attributes

### First Version Example

- version number:
  `1`
- status:
  `draft`

Drafted attributes:

| Attribute key | Kind | Type | Cardinality | Label | Description | Help text | Form-facing | Default form pattern |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `entityKey` | `persisted` | `string` | `single` | `Entity Key` | Stable repo-facing machine key for the entity family. | Use snake_case and treat this as immutable once created. | `true` | `form-template.text-input` |
| `entityName` | `persisted` | `string` | `single` | `Entity Name` | Human-readable entity family name shown in planning and exports. | Keep this readable for operators and downstream artifacts. | `true` | `form-template.text-input` |
| `description` | `persisted` | `text` | `single` | `Description` | Durable summary of what this entity family represents. | This becomes source-independent meaning, not throwaway planner copy. | `true` | `form-template.textarea` |
| `status` | `persisted` | `enum` | `single` | `Status` | Lifecycle state of this entity family or version. | Valid values are governed by the lifecycle contract. | `true` | `simple-select.single` |

## Form-Configuration Rule

Attribute-level form configuration should live on
`Entity Definition Attribute`, not on derived exports and not in one
unguarded metadata blob.

Recommended attribute-level form fields:

- `label`
- `description`
- `helpText`
- `placeholderText`
- `formFacing`
- `defaultFormPatternKey`

Why this shape:

- `label` is field identity
- `description` is durable meaning
- `helpText` is optional guided usage
- `placeholderText` is optional UI hint, not the source of truth
- `defaultFormPatternKey` captures governed default intent without forcing the
  feature to own rendered UI
- downstream exports can project richer planning views without becoming the
  source of truth

## Open Deferred Expansion Notes

- entity relationships are intentionally deferred from v1
- richer section or field-group modeling is intentionally deferred from v1 and
  may become its own durable entity family later
- pattern-specific form configuration beyond `defaultFormPatternKey` is
  intentionally deferred
- dynamic external option providers are intentionally deferred
- first-class audit entity families are intentionally deferred

## Recommended Next Artifacts

1. refresh the capability matrix for `entityBuilder`
2. draft the PRD for the backend planning and export foundation
3. draft the PRD-derived test-case doc
4. draft the implementation blueprint once the PRD is approved
