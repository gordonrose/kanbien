# Governed Entity Definition Attribute Reference

Planning status:

- `draft_v1_canonical_model_ready_for_schema_formalization`
- Companion to
  `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-model.md`
- Formal schema planning companion:
  `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-schema-formalization.md`
- This is an explanatory reference for the draft v1 canonical model, not the
  final implementation contract.
- No implementation, migration, route, generated artifact, asset behavior, or
  UI work is approved by this note.

## Purpose

This note explains the draft v1 canonical model for attributes inside a
governed entity definition.

The goal is to make attributes predictable enough that future scripts, generated
pages, API-aware capability mapping, forms, drawers, search, filters, status
tabs, and validation can consume the same definition without inventing
one-off behavior.

## Source Authority Context

Most entities are currently defined across repo artifacts such as source code,
migrations, API contracts, data dictionary pages, feature docs, PRDs, and
planning notes.

The target end state is persistent DB-backed entity definitions as the primary
source of truth. Repo docs should eventually become generated outputs or
explicit transitional mirrors.

Every entity definition should include a required `sourceAuthority` section,
even when the entity has not yet migrated.

Example:

```json
{
  "sourceAuthority": {
    "currentAuthority": "repoArtifacts",
    "targetAuthority": "persistentEntityDefinition",
    "transitionPosture": "notYetMigrated",
    "sourcePrecedence": [
      "runtimeSource",
      "migration",
      "apiContract",
      "dataDictionaryMarkdown",
      "featureDocs",
      "planningArtifacts"
    ],
    "markdownPosture": "sourceIndependentPlanning"
  }
}
```

Transition posture values:

| Value | Meaning |
| --- | --- |
| `notYetMigrated` | Repo artifacts still own truth; no persistent entity definition owns this entity yet. |
| `partiallyMigrated` | Some structured/persistent entity-definition records exist, but repo artifacts still participate in source truth. |
| `mirroredTransitional` | Persistent records and repo artifacts coexist intentionally during migration. |
| `persistentPrimary` | Persistent DB-backed entity definition is primary truth; repo docs are generated outputs or explicit mirrors. |

`sourceAuthority` says what wins when artifacts disagree. Evidence links, when
added, should say where the decision was checked or proven.

Source authority field catalogs:

| Field | Values | Meaning |
| --- | --- | --- |
| `currentAuthority` | `repoArtifacts`, `runtimeSource`, `planningArtifact`, `persistentEntityDefinition`, `mixedTransitional` | Where truth lives right now. |
| `targetAuthority` | `persistentEntityDefinition`, `externalSystemOfRecord` | Where truth should live eventually. External system of record requires explicit approval. |
| `sourcePrecedence` | ordered list using `runtimeSource`, `migration`, `apiContract`, `entityDefinition`, `dataDictionaryMarkdown`, `featureDocs`, `planningArtifacts` | Conflict-resolution order when sources disagree. |
| `markdownPosture` | `source`, `sourceIndependentPlanning`, `mirroredTransitional`, `generatedOutput`, `notApplicable` | Role Markdown plays for this entity. |

Plain-language meaning for the example above:

> Right now, this entity's truth is in repo artifacts. Eventually, persistent
> entity definitions should own it. Until migration is done, if artifacts
> disagree, runtime source and migrations beat docs, and Markdown remains a
> planning/maintained artifact rather than final generated output.

## Top-Level Entity Definition Skeleton

Working v1 top-level shape:

```json
{
  "entityIdentity": {},
  "sourceAuthority": {},
  "evidenceRegistry": [],
  "attributes": [],
  "presentationGroups": [],
  "operationalStatusSet": {},
  "relationships": [],
  "searchModel": {},
  "surfaceModel": {},
  "actionModel": {},
  "complianceModel": {},
  "generationModel": {},
  "migrationModel": {}
}
```

Section meanings:

| Section | Purpose |
| --- | --- |
| `entityIdentity` | Stable key, localized name/description, owning feature/domain, and basic identity metadata. |
| `sourceAuthority` | Current truth, target truth, transition posture, source precedence, and Markdown posture. |
| `evidenceRegistry` | Stable evidence keys pointing to repo artifacts today and persistent evidence/source records later. |
| `attributes` | Complete attribute definitions. |
| `presentationGroups` | Reusable presentation-only groups used by placements. |
| `operationalStatusSet` | Entity-specific business/workflow statuses and nested statuses. |
| `relationships` | Entity-level relationship summary/index for relationship attributes and navigable relationships. |
| `searchModel` | Entity-wide search/filter/sort defaults and posture. |
| `surfaceModel` | Approved surfaces, variants, regions, and entity-level presentation posture. |
| `actionModel` | Entity action mapping to capabilities, route contracts, surfaces, lifecycle/status effects, and verification. |
| `complianceModel` | Entity-level privacy, security, audit, retention, cleanup, export, and legal-hold posture. |
| `generationModel` | Generated docs/pages/API/default behavior posture. |
| `migrationModel` | Migration/adoption posture from repo artifacts, source code, and current implementation toward persistent entity-definition truth. |

## Action Model

`actionModel` is the attachment point for mapping entity actions to the
capabilities, route contracts, generated surfaces, lifecycle/status effects,
and tests that prove them.

Store actions as one flat array with `actionFamily` on each entry. Scripts can
consume one uniform shape, while generated docs or UI can group by family for
readability.

Each action should also declare ownership:

- `owningLayer`: whether the action belongs to a feature, platform layer,
  system layer, or shared layer
- `ownerKey`: the stable feature/platform owner key

Managed-record actions are usually owned by the entity's feature. For example,
`createOrganization` is owned by `organizationCore`.

Entity-definition maintenance actions are usually owned by the platform
entity-definition layer. For example, `addAttribute` is owned by
`entityDefinition`.

Example:

```json
{
  "actionModel": {
    "actions": [
      {
        "actionKey": "addAttribute",
        "actionFamily": "definitionStructure",
        "owningLayer": "platform",
        "ownerKey": "entityDefinition",
        "labelKey": "entityDefinition.action.addAttribute.label",
        "labelFallback": "Add attribute",
        "executionMode": "sync",
        "compatibilityRisk": "medium",
        "auditRequired": true,
        "actionErrorModel": {
          "defaultErrorKey": "entityDefinition.action.addAttribute.failed",
          "defaultErrorFallback": "The attribute could not be added.",
          "errors": [
            {
              "errorKey": "conflict",
              "messageKey": "entityDefinition.action.addAttribute.conflict",
              "messageFallback": "The definition changed before this attribute could be added.",
              "retryable": true,
              "auditRequired": true
            }
          ]
        }
      }
    ]
  }
}
```

Each action should declare an `executionMode`.

V1 execution mode values:

| Value | Meaning | Example |
| --- | --- | --- |
| `sync` | Completes during the request/action. | update display name, read record, add draft attribute |
| `async` | Runs as background work. | export bundle generation, large import, bulk validation |
| `syncStartsAsync` | Synchronous request accepts work and starts async processing. | delete request starts pending-deletion timer or cleanup workflow |
| `scheduled` | Runs on a schedule. | cleanup expired pending-deletion records |
| `manualOperational` | Performed through support/runbook/manual operations. | legal hold override, emergency correction |

Async-like modes later require status tracking, retry posture, idempotency,
timeout/failure behavior, audit, and progress evidence.

Each action should include an action-level error model separate from attribute
validation.

Common action error values:

- `notAuthorized`
- `notFound`
- `conflict`
- `wrongLifecycleState`
- `relationshipBoundaryViolation`
- `dependencyExists`
- `validationFailed`
- `rateLimited`
- `asyncAcceptedButFailed`
- `cleanupFailed`
- `externalDependencyFailed`
- `unsupportedAction`

Action errors should have localization keys and fallback messages. They may
also declare whether the error is retryable and whether audit is required.

`compatibilityRisk` values:

| Value | Meaning |
| --- | --- |
| `none` | No compatibility impact expected, such as read/list behavior. |
| `low` | Additive or presentation-only change. |
| `medium` | May affect generated UI, API defaults, or default behavior but should remain compatible. |
| `high` | Likely affects existing data, validations, workflows, or integrations. |
| `breaking` | Removes, renames, or changes contract, persistence, route, permission, identity, boundary, or required behavior. |

`reviewRequirement` values:

| Value | Meaning |
| --- | --- |
| `none` | No special review. |
| `recommended` | Review is useful but not mandatory. |
| `required` | Must be reviewed before activation or apply. |
| `approvalGated` | Explicit approval is required before proceeding. |

It should cover managed-record actions, such as:

- list
- read
- create
- update
- archive
- restore
- delete
- export
- relationship actions
- operational status transitions

It should also cover entity-structure maintenance actions, such as:

- definition lifecycle actions:
  - propose entity-definition change
  - validate entity definition
  - version entity definition
  - activate entity definition
  - supersede entity definition
  - archive entity definition
  - export entity definition
- concrete definition-structure edit actions:
  - add, edit, remove, or reorder attributes
  - add, edit, remove, or reorder presentation groups
  - add, edit, remove, or reorder placements
  - add, edit, or remove validation rules
  - add, edit, or remove relationships
  - add, edit, remove, or reorder operational statuses
  - edit search config
  - edit compliance classification
  - edit source authority
  - edit evidence registry
  - edit action model
  - edit generation model
  - edit migration model
  - add or remove global search attributes
  - set default sort
  - add or remove pinned filters
  - add or remove facets
  - change surface variant

The detailed capability/action logic is a later workstream, but the canonical
entity definition should reserve this section so downstream features can depend
on a predictable attachment point.

This split matters because compatibility checks vary by action. Adding an
optional secondary attribute may be low risk, while removing an identity
attribute, changing a relationship boundary, or loosening a privacy/security
classification may require explicit review and migration planning.

Every editable top-level section should have at least one corresponding
definition-structure action. LLM-driven builder customization should flow
through governed actions rather than direct freeform edits.

Search and surface customization should support both broad section-edit actions
and granular high-value actions. Examples include:

- `editSearchModel`
- `addGlobalSearchAttribute`
- `removeGlobalSearchAttribute`
- `setDefaultSort`
- `addPinnedFilter`
- `removePinnedFilter`
- `addFacet`
- `removeFacet`
- `editSurfaceModel`
- `changeSurfaceVariant`
- `addPlacement`
- `editPlacement`
- `removePlacement`

## Compliance Model

`complianceModel` records entity-level compliance posture. Attribute-level
privacy/security remains the detailed source, but the entity-level model gives
auditors, generators, reports, and reviewers a clear summary and default
posture.

Working shape:

```json
{
  "complianceModel": {
    "privacyImpact": "containsSensitivePII",
    "sensitivePrivacyCategoriesPresent": ["governmentIdentifiers"],
    "securityImpact": "restricted",
    "auditRequired": true,
    "retentionPolicyKey": "standardTenantRecordRetention",
    "deletePosture": "softDeleteWithPendingDeletion",
    "legalHoldSupported": true,
    "exportPosture": "privacyReviewedExport",
    "cleanupPosture": "featureOwnedCleanup",
    "encryptionPosture": {
      "atRest": "required",
      "inTransit": "required",
      "fieldLevel": "notRequired",
      "keyManagementPolicyKey": "platformStandardKms",
      "attributeOverrides": []
    },
    "evidenceKeys": []
  }
}
```

Suggested `privacyImpact` values:

- `none`
- `containsPII`
- `containsSensitivePII`
- `mixed`

Sensitive PII category assignment belongs on attributes. The entity-level
`sensitivePrivacyCategoriesPresent` list summarizes which sensitive categories
exist anywhere on the entity for reporting and audit.

Suggested `deletePosture` values:

- `notDeletable`
- `softDelete`
- `softDeleteWithPendingDeletion`
- `hardDeleteEligible`
- `purgeOnlyWithApproval`

Suggested `exportPosture` values:

- `notExportable`
- `includedInStandardExport`
- `restrictedExport`
- `privacyReviewedExport`

Suggested `cleanupPosture` values:

- `notApplicable`
- `featureOwnedCleanup`
- `platformSchedulerCleanup`
- `manualOperationalCleanup`
- `externalResourceCleanup`

Encryption posture should be recorded for auditability even when it follows
platform defaults. Entity-level encryption gives the default; attribute
overrides can be declared for especially sensitive fields when needed.

## Generation Model

`generationModel` declares what the entity definition is allowed to generate or
drive.

Working shape:

```json
{
  "generationModel": {
    "generationMode": "previewThenApply",
    "allowedOutputCategories": [
      "docs",
      "uiDefaults",
      "designSystemPreview",
      "validationConfig",
      "searchConfig",
      "capabilityMappingDraft",
      "apiContractDraft",
      "testDraft"
    ],
    "blockedOutputCategories": [
      "runtimeSource",
      "databaseMigration",
      "authorizationLogic",
      "permissionGrant"
    ],
    "driftDetectionRequired": true,
    "evidenceKeys": []
  }
}
```

Suggested `generationMode` values:

- `none`
- `previewOnly`
- `previewThenApply`
- `automatic`
- `manualOperational`

V1 should be cautious:

- docs, UI defaults, design-system previews, validation/search config,
  capability mapping drafts, API contract drafts, and test drafts may be
  allowed or planned
- runtime source, database migrations, authorization logic, and permission
  grants are blocked by default
- blocked categories can be revisited later only with explicit approval and
  heavier compatibility checks

This model may mature as entity definitions are used in practice.

## Migration Model

`migrationModel` tracks adoption from current repo/source artifacts into
persistent entity-definition primary truth.

It should not become the general future-change mechanism. Once an entity is
migrated, future definition changes should be handled through source authority,
action model, definition versioning/lifecycle, and evidence.

Working shape:

```json
{
  "migrationModel": {
    "migrationStatus": "notStarted",
    "currentSourcePosture": "repoArtifactsPrimary",
    "targetSourcePosture": "persistentEntityDefinitionPrimary",
    "currentArtifactKeys": [],
    "targetPersistentRecordKey": "organization",
    "compatibilityChecksRequired": [
      "apiContractParity",
      "persistenceSchemaParity",
      "dataDictionaryParity",
      "permissionMappingParity"
    ],
    "blockingIssues": [],
    "migrationEvidenceKeys": []
  }
}
```

Suggested `migrationStatus` values:

- `notStarted`
- `inventoryInProgress`
- `mappedToDefinition`
- `persistentRecordCreated`
- `mirroredTransitional`
- `persistentPrimary`
- `blocked`

Suggested compatibility checks:

- `apiContractParity`
- `persistenceSchemaParity`
- `dataDictionaryParity`
- `permissionMappingParity`
- `featureManifestParity`
- `generatedDocParity`
- `runtimeBehaviorParity`

## Entity Identity

`entityIdentity` stores stable top-level identity for the entity.

Working v1 shape:

```json
{
  "entityIdentity": {
    "entityKey": "organization",
    "singularLabelKey": "entity.organization.label.singular",
    "singularLabelFallback": "Organization",
    "pluralLabelKey": "entity.organization.label.plural",
    "pluralLabelFallback": "Organizations",
    "descriptionKey": "entity.organization.description",
    "descriptionFallback": "An organization represents a company, department, partner, or other business structure that the platform manages, displays, and connects to related records.",
    "purposeKey": "entity.organization.purpose",
    "purposeFallback": "Organizations give the platform a stable business structure for ownership, reporting, relationships, permissions, and operational workflows.",
    "owningFeatureKey": "organizationCore",
    "owningFeaturePosture": "implemented",
    "owningLayer": "feature",
    "entityFamilyKey": "organization",
    "managementScope": "tenant",
    "definitionVersion": 1
  }
}
```

Field notes:

| Field | Meaning |
| --- | --- |
| `entityKey` | Stable canonical machine key for the entity. |
| `singularLabelKey` / `singularLabelFallback` | Localized singular display name for generated UI/docs. |
| `pluralLabelKey` / `pluralLabelFallback` | Localized plural display name for generated lists, tabs, and docs. |
| `descriptionKey` / `descriptionFallback` | Human-facing explanation of what the entity represents in product or business context. |
| `purposeKey` / `purposeFallback` | Human-facing explanation of why the entity exists and what stable product/platform job it performs. |
| `owningFeatureKey` | Stable feature key that owns the entity, using a planned key when implementation does not exist yet. |
| `owningFeaturePosture` | Whether the owning feature is implemented, planned, or not yet assigned. |
| `owningLayer` | Whether the entity is owned by a feature, platform layer, system layer, shared layer, or another approved owner layer. |
| `entityFamilyKey` | Grouping key for related entities in the same business/platform family. |
| `managementScope` | High-level management boundary for the entity. |
| `definitionVersion` | Version of this entity definition. |

`descriptionFallback` should not be generic wording like "a managed record."
It should explain context in plain language.

`purposeFallback` should not restate the description. It should explain why
the entity exists.

Suggested `owningFeaturePosture` values:

- `implemented`
- `planned`
- `notYetAssigned`

Suggested `owningLayer` values:

- `feature`
- `platform`
- `system`
- `shared`

Suggested `managementScope` values:

- `root`
- `tenant`
- `sharedCrossTenant`
- `system`
- `public`

## LLM Authoring Guidance

Entity definitions will likely be created by humans through an LLM-assisted
interface. Most humans will not have the patience or technical context to fill
every field manually.

Use a two-layer model:

1. `EntityDefinitionSchema` stores the canonical entity truth.
2. `EntityDefinitionAuthoringGuidanceCatalog` tells LLMs how to create or
   maintain those values.

The entity definition stores the answer. The guidance catalog teaches the LLM
how to get a good answer.

Guidance should be reusable across entity definitions unless a specific
override is approved.

Each section and field should eventually carry authoring guidance that tells
the LLM:

- what a good value looks like
- whether to ask the human directly
- whether to infer from the conversation or product context
- whether to use a platform default
- whether to derive from repo/source truth
- whether to leave an explicit placeholder for later technical review
- whether never to ask because the system owns the value

This authoring guidance is separate from validation. Validation says whether a
value is allowed. Authoring guidance says how the value should be obtained.

Possible authoring modes:

| Mode | Meaning |
| --- | --- |
| `askHuman` | The value is business-facing and should be explicitly obtained from the requester. |
| `recommendAndConfirm` | The LLM should propose a likely value and ask the requester to confirm or correct it. |
| `inferFromContext` | The LLM may infer the value from the conversation or surrounding product context, then record confidence. |
| `usePlatformDefault` | The value should default from platform rules unless a later governed override is approved. |
| `deriveFromSourceTruth` | The value should be derived from repo artifacts, persistent records, source code, contracts, or migrations. |
| `technicalReviewRequired` | The value should be left as an explicit review item for a technical stakeholder. |
| `systemGenerated` | The system creates or maintains this value; the human should not be asked. |

Authoring guidance should be context-specific. Expected contexts:

| Context | Meaning |
| --- | --- |
| `newEntity` | A human and LLM are defining a new entity. |
| `entityUpdate` | A human and LLM are changing an existing entity definition. |
| `repoMigration` | The entity definition is being created from existing repo artifacts. |
| `persistentRevision` | The entity definition already exists as persistent truth and is being revised or maintained. |

For human-facing contexts such as `newEntity` and `entityUpdate`, guidance
should support a primary mode and fallback modes. The LLM should use the
lowest-friction path first, then ask the human when confidence is low, the
field is foundational, or a business decision is genuinely required.

Example:

```json
{
  "fieldKey": "entityPurpose",
  "authoringGuidance": {
    "newEntity": {
      "primaryMode": "askHuman",
      "fallbackModes": [],
      "reason": "The purpose is foundational business intent and should not be invented."
    },
    "entityUpdate": {
      "primaryMode": "inferFromContext",
      "fallbackModes": ["recommendAndConfirm", "askHuman"]
    },
    "repoMigration": {
      "primaryMode": "deriveFromSourceTruth",
      "fallbackModes": ["technicalReviewRequired"]
    },
    "persistentRevision": {
      "primaryMode": "deriveFromSourceTruth",
      "fallbackModes": ["technicalReviewRequired"]
    }
  }
}
```

The exact field-level guidance is not locked yet.

### Field-Level Writing Guidance

Some values need field-specific writing instructions. For example,
`descriptionFallback` should be plain-language, context-rich, and human-facing,
while an evidence `proofStatement` should be concise and evidence-focused.

This guidance should live in reusable entity-definition schema or field
catalogs, not be repeated inside every entity definition instance.

Example catalog entry:

```json
{
  "fieldKey": "entityIdentity.descriptionFallback",
  "valueType": "text",
  "authoringGuidance": {
    "newEntity": {
      "primaryMode": "recommendAndConfirm",
      "fallbackModes": ["askHuman"]
    },
    "repoMigration": {
      "primaryMode": "deriveFromSourceTruth",
      "fallbackModes": ["technicalReviewRequired"]
    }
  },
  "writingGuidance": {
    "audience": "platform maintainer and product stakeholder",
    "tone": "plain-language, context-rich, human-facing",
    "requiredContent": [
      "what the entity represents",
      "where it fits in the business or product context"
    ],
    "avoid": [
      "generic record wording",
      "implementation jargon",
      "empty phrases like 'managed record'"
    ],
    "goodExample": "An organization represents a company, department, partner, or other business structure that the platform manages, displays, and connects to related records.",
    "badExample": "A managed organization record."
  },
  "questionGuidance": {
    "questionStyle": "one plain-language question at a time",
    "avoid": [
      "platform jargon",
      "asking for technical mechanism choices when business intent is enough"
    ],
    "recommendationPosture": "offer a recommended value when the LLM has enough context",
    "exampleQuestion": "What kind of real-world thing should this entity represent for the people using the platform?"
  },
  "validationGuidance": {
    "required": true,
    "defaultValue": "none"
  }
}
```

Field-specific writing guidance lets `descriptionFallback`, `entityPurpose`,
`proofStatement`, labels, validation messages, and similar text fields each
use the right tone and level of detail.

Reusable authoring guidance entries should include:

- `fieldKey`
- `sectionKey`
- `valueType`
- context-specific `authoringGuidance`
- `writingGuidance`
- `questionGuidance`
- `validationGuidance`

`questionGuidance` is the place to mature LLM interview behavior over time. It
should describe how to ask when asking is required, such as asking one
plain-language question, avoiding platform jargon, and offering a recommendation
when useful.

### Evidence Link Migration Bridge

Evidence links mostly point to repo artifacts today. Over time, they should be
able to point to persistent records such as decision records, API contract
records, capability records, validation proof records, generated artifact
records, test evidence records, or other DB-backed sources.

Some current artifact types may become unnecessary once persistent
entity-definition records own the truth. The evidence model should therefore be
treated as an evolving bridge, not a permanent assumption that all current docs
will always exist.

Recommended pattern:

- maintain an entity-level evidence registry
- give every evidence entry a stable `evidenceKey`
- let attributes, relationships, statuses, search config, and other sections
  reference evidence keys
- support repo artifact references now and persistent record references later

Example:

```json
{
  "evidenceLinks": [
    {
      "evidenceKey": "root-users-api-contract",
      "sourceType": "apiContract",
      "sourceLocationType": "repoArtifact",
      "repoPath": "docs/api-contracts/root-users.md",
      "targetPersistentRecord": {
        "entityKey": "apiContract",
        "recordKey": "root-users"
      },
      "transitionPosture": "repoOnly",
      "proofStatement": "Defines root user list/read/create/update behavior."
    }
  ]
}
```

Possible source location types:

- `repoArtifact`
- `persistentRecord`
- `externalReference`
- `generatedArtifact`

Possible evidence transition postures:

- `repoOnly`
- `repoPrimaryPersistentPlanned`
- `mirroredTransitional`
- `persistentPrimary`

Evidence `sourceType` values:

- `sourceCode`
- `migration`
- `apiContract`
- `dataDictionary`
- `featureDoc`
- `prd`
- `technicalSteering`
- `adr`
- `capabilityMatrix`
- `permissionMapping`
- `testEvidence`
- `runtimeEvidence`
- `decisionLog`
- `generatedArtifact`
- `externalStandard`
- `persistentRecord`

Required evidence entry shape:

```json
{
  "evidenceKey": "organization-data-dictionary",
  "sourceType": "dataDictionary",
  "sourceLocationType": "repoArtifact",
  "repoPath": "docs/data-dictionary/organization.md",
  "persistentRecordRef": "none",
  "externalRef": "none",
  "transitionPosture": "repoPrimaryPersistentPlanned",
  "proofStatement": "Defines current Organization data dictionary posture.",
  "reviewedAt": "none"
}
```

Evidence rules:

- every evidence entry has a stable `evidenceKey`
- `repoArtifact` requires `repoPath`
- `persistentRecord` requires `persistentRecordRef`
- `externalReference` requires `externalRef`
- unused location fields use `none`
- `proofStatement` should be human-readable and specific
- `reviewedAt` may be `none` until reviewed

Example attribute reference:

```json
{
  "attributeKey": "email",
  "evidenceKeys": ["root-users-api-contract", "root-users-data-dictionary"]
}
```

## Attribute Core

Every attribute should describe the durable fact or relationship it represents.
Not every attribute needs to appear in UI.

Canonical entity definitions should be section-complete. Downstream features
will depend on predictable structure, so required sections should be present
for every entity even when they contain explicit defaults, empty arrays,
`none`, `notApplicable`, or other governed default values.

Attribute records should also be field-complete as part of creation or
migration. Context-specific fields should use explicit defaults rather than
disappearing from the structure.

A typical attribute will eventually need fields like:

```json
{
  "attributeKey": "email",
  "labelKey": "entity.rootUser.attribute.email.label",
  "labelFallback": "Email",
  "descriptionKey": "entity.rootUser.attribute.email.description",
  "descriptionFallback": "Primary email address used to identify and contact the user.",
  "category": "identity",
  "attributeType": "email",
  "valueCardinality": "single",
  "required": true,
  "systemManaged": false,
  "mutability": "updateable",
  "privacyClassification": "notSensitive",
  "securityClassification": "internal"
}
```

## Text And Internationalization

User-visible text should be internationalization-ready from v1.

Use stable localization keys plus fallback copy for:

- entity names and descriptions
- presentation group labels and help text
- attribute labels, descriptions, help text, and placeholders
- option labels and descriptions
- status labels
- validation messages
- surface-specific copy where applicable

Translations themselves should live outside the entity definition. The entity
definition should carry stable keys and fallback text so generated docs,
authoring tools, validation, and incomplete translation states remain usable.

## Primary Attribute Categories

The primary category answers: "What kind of fact is this attribute?"

It should not answer where the field appears in the UI, who can see it, or
whether it contains private data. Those are separate concerns.

| Category | Meaning | Examples |
| --- | --- | --- |
| `identity` | Identifies, names, locates, or stably references the record for humans, APIs, scripts, or support. | `id`, `entityKey`, `email`, `slug`, `organizationName`, `externalReference` |
| `core` | Primary business facts needed to understand or operate the entity. | `displayName`, `description`, `organizationType`, `billingAccountName` |
| `secondary` | Useful supporting context that is not essential to identity or ordinary operation. | optional notes, secondary phone, display subtitle, extra descriptive details |
| `metadata` | Source, freshness, trust, provenance, review, or maintenance posture for the record. | `createdAt`, `updatedAt`, `sourceSystem`, `lastReviewedAt`, `importBatchId`, `confidenceScore` |
| `systemLifecycle` | Platform availability, retention, currentness, archive, delete, restore, or supersession state. | `archivedAt`, `deletedAt`, `supersededAt`, `currentVersionId`, `isCurrent` |
| `operationalLifecycle` | Business or workflow state for the thing being managed. | `reviewStatus`, `publicationStatus`, `onboardingStatus`, `caseStatus`, `jobStatus` |
| `parentRelation` | A relationship pointing to this record's business parent. | `parentOrganizationId`, `moduleId` for a page, `organizationId` for a business unit |
| `childRelation` | A declared child collection or child relationship owned by or navigable from this entity. | organization business units, organization locations, role permissions |
| `domainRelation` | A meaningful link to another durable record that is not parent or child structure. | `replacementRecordId`, `duplicateCandidateId`, `primaryLogoAssetId`, `approvedByUserId`, `pairedConfigurationId` |
| `evidence` | Proof or trace references that justify a fact, state, review, or outcome. | `decisionLogEntryId`, `auditEventId`, `approvalEvidenceId`, `verificationProofId`, `sourceArtifactPath`, `migrationProofRunId` |

### Category Rules

- An attribute has one primary semantic category.
- `security`, `privacy`, and `system` are not primary categories.
- Security and privacy are separate classification fields.
- Platform ownership is modeled through `systemManaged` and `mutability`.
- Groups are presentation-only and do not change the attribute category.

## Metadata Vs Evidence

Keep these separate.

`metadata` describes the record's source, freshness, trust, or maintenance
posture.

Examples:

- `lastReviewedAt`
- `sourceSystem`
- `confidenceScore`
- `importBatchId`

`evidence` points to proof or trace records that justify something.

Examples:

- a decision log entry proving why a rule exists
- an audit event showing who approved a change
- a verification run proving a migration or import
- a source artifact path showing where the value came from

In short:

- metadata describes context
- evidence proves or justifies a fact, decision, or state

## Lifecycle Categories

Lifecycle is split into two categories.

`systemLifecycle` is the platform record state. It affects visibility,
retention, restore, purge, historical reads, cleanup, and generated default
behavior.

Examples:

- active
- archived
- pending deletion
- deleted
- restored
- superseded
- pending cleanup
- cleanup failed

`operationalLifecycle` is the business state. It describes where the entity is
in a workflow or business process.

Examples:

- draft
- in review
- in progress
- live
- paused
- rejected
- completed

An entity can be system-active while operationally draft or in review. The two
states should not be collapsed.

Initial platform-wide `systemLifecycle` catalog:

| Status | Meaning |
| --- | --- |
| `draft` | Record exists but is not current/default truth yet. |
| `active` | Record is visible in normal reads and current/default use. |
| `archived` | Record is retained but removed from ordinary current work. |
| `pendingDeletion` | Delete action has been accepted and a deletion timer, undo window, retention check, legal-hold check, or final purge process is pending. |
| `deleted` | Deletion has completed to the system's deleted state and is exposed only through explicit deleted-record reads. |
| `superseded` | Record was replaced by newer current truth and retained for history. |
| `pendingCleanup` | Related cleanup work remains outstanding after or during a lifecycle action. |
| `cleanupFailed` | Cleanup was attempted and failed, requiring retry, support, or operational handling. |

`pendingDeletion` and `pendingCleanup` are intentionally different:

- `pendingDeletion` is about the entity's deletion lifecycle window.
- `pendingCleanup` is about cleanup of related resources or external effects.

### Operational Lifecycle Status Sets

Operational lifecycle statuses are entity-specific but must be declared in a
governed status set.

Example:

```json
{
  "operationalStatusSet": {
    "statusAttributeKey": "publicationStatus",
    "statuses": [
      {
        "statusKey": "draft",
        "labelKey": "entity.article.status.draft.label",
        "labelFallback": "Draft",
        "descriptionKey": "entity.article.status.draft.description",
        "descriptionFallback": "Work has started but is not ready for review.",
        "displayOrder": 10,
        "tabEligible": true,
        "badgeTone": "neutral",
        "defaultForCreate": true,
        "allowedTransitions": ["inReview"],
        "childStatuses": [
          {
            "statusKey": "draft.needsContent",
            "labelKey": "entity.article.status.draft.needsContent.label",
            "labelFallback": "Needs content",
            "displayOrder": 10,
            "allowedTransitions": ["draft.readyForReview"]
          },
          {
            "statusKey": "draft.readyForReview",
            "labelKey": "entity.article.status.draft.readyForReview.label",
            "labelFallback": "Ready for review",
            "displayOrder": 20,
            "allowedTransitions": ["inReview"]
          }
        ]
      }
    ]
  }
}
```

Expected status metadata:

- `statusAttributeKey`
- stable `statusKey`
- localization key and fallback label
- optional localization key and fallback description
- `displayOrder`
- `tabEligible`
- `badgeTone`
- `defaultForCreate`
- optional parent status or nested `childStatuses`
- optional `allowedTransitions`

Allowed transitions are structural lifecycle metadata in v1. Later
capability/action logic can populate, enforce, or attach authority to them.

Operational status sets may be hierarchical. A parent status can group
child/sub-statuses for drill-down workflows, reporting, tabs, or progress
modeling.

Nested status rules:

- every status and child status needs a stable key
- nested status trees must not contain cycles
- display order is relative to siblings at the same level
- transition metadata must define whether transitions apply at parent level,
  child level, or both
- parent statuses may be useful for high-level tabs while child statuses may
  drive detailed workflow, progress, or queue behavior

## Relationship Categories

Relationship categories identify the broad business shape of the relationship.
Precise meaning belongs in relationship metadata.

| Category | Use When | Notes |
| --- | --- | --- |
| `parentRelation` | The attribute points up to the record's business parent. | Often stored as a foreign key/reference on the child. |
| `childRelation` | The attribute declares children or a child collection of this entity. | May be query-backed through an inverse lookup rather than stored as an array. |
| `domainRelation` | The attribute links to another durable record for entity-specific business reasons. | Covers replacement records, duplicate candidates, related organizations, primary assets, approval actors, paired configuration, and similar links. |

`siblingRelation` is not a v1 attribute category. Sibling relationships are
usually derived from shared parent structure and may become a relationship
navigation type later if a concrete need appears.

## Requiredness

`required` is a boolean in v1.

```json
{
  "required": true
}
```

Conditional or create-only requiredness is deferred until there is a concrete
need. Other fields such as mutability, system management, validation rules, and
placements can still express most expected v1 behavior.

## System Management And Mutability

`systemManaged` and `mutability` are separate.

`systemManaged` answers: "May clients or humans supply this value directly?"

`mutability` answers: "When may the owning authority change this value?"

Examples:

```json
{
  "attributeKey": "createdAt",
  "systemManaged": true,
  "mutability": "immutable"
}
```

```json
{
  "attributeKey": "updatedAt",
  "systemManaged": true,
  "mutability": "systemUpdateable"
}
```

```json
{
  "attributeKey": "email",
  "systemManaged": false,
  "mutability": "updateable"
}
```

## Mutability Catalog

| Value | Meaning | Common Examples |
| --- | --- | --- |
| `immutable` | Set once and then not changed through normal system behavior. | stable IDs, creation timestamps, version numbers, original source references |
| `createOnly` | May be supplied during create but not changed through normal update. | initial slug, entity type, initial owner choice |
| `updateable` | May be changed through ordinary create/update behavior, subject to later capability rules. | display name, description, phone number, notes |
| `systemUpdateable` | Only the platform changes it, and it may change repeatedly. | `updatedAt`, `lastLoginAt`, `failedLoginCount`, `lastSyncedAt` |
| `lifecycleManaged` | Changed only through lifecycle actions rather than normal edit forms. | status, archived timestamp, deleted timestamp, activated timestamp |
| `relationshipManaged` | Changed only through relationship operations rather than direct field edits. | parent move, primary asset link, membership links |
| `derived` | Transparent deterministic projection from existing fields or relationships. | normalized name, full name, descendant count |
| `calculated` | Produced by explicit business rules, scoring, aggregation, or transformation. | risk score, account health score, eligibility status, SLA breach indicator |

### Derived Vs Calculated

Use `derived` when the value is a transparent deterministic transformation.

Use `calculated` when a named business rule, calculation, scoring model,
aggregation, version, trigger, stale behavior, failure behavior, or evidence
may be needed.

## Privacy Classification

Privacy classification is separate from primary category.

```json
{
  "privacyClassification": "none"
}
```

V1 values:

| Value | Meaning |
| --- | --- |
| `none` | The attribute is not PII. |
| `notSensitive` | The attribute is PII but not sensitive PII. |
| `sensitive` | The attribute is sensitive PII and requires a governed sensitive category. |

If `privacyClassification` is `sensitive`, `sensitivePrivacyCategory` is
required.

If `privacyClassification` is `none` or `notSensitive`,
`sensitivePrivacyCategory` must be absent.

## Sensitive PII Categories

Working v1 catalog:

| Value | Meaning / Examples |
| --- | --- |
| `racialOrEthnicOrigin` | racial or ethnic origin |
| `politicalOpinions` | political opinions |
| `religiousOrPhilosophicalBeliefs` | religious or philosophical beliefs |
| `tradeUnionMembership` | trade union membership |
| `healthData` | health data, health insurance information, patient IDs |
| `sexLifeOrSexualOrientation` | sex life or sexual orientation |
| `criminalConvictions` | criminal convictions |
| `governmentIdentifiers` | Social Security numbers, passport numbers, driver's license numbers |
| `financialData` | credit card numbers, bank routing numbers, tax records |
| `medicalOrBiometricData` | fingerprints, genetic data, medical or biometric identifiers |

Exact wording should be reconciled with the adopted privacy/compliance standard
before final lock-in.

## Security Classification

Security classification is separate from primary category and separate from
privacy classification.

V1 values:

| Value | Meaning |
| --- | --- |
| `none` | No special security visibility restriction beyond normal entity access. |
| `internal` | Visible only to internal users. |
| `restricted` | Visible only to internal users with explicit authorization. |
| `classified` | Visible only to internal users with explicit authorization and required clearance. |

If `securityClassification` is `classified`, a neutral
`securityClassificationLevel` is required.

If `securityClassification` is not `classified`,
`securityClassificationLevel` must be absent.

Working v1 classification levels:

- `classificationLevel1`
- `classificationLevel2`
- `classificationLevel3`

Neutral levels allow tenant or product-specific names to be mapped later
without changing the canonical entity definition.

## Attribute Types

The canonical v1 type catalog should expand beyond the current backend
foundation. The exact storage, validation, indexing, operator, and component
compatibility rules still need to be verified before implementation.

Current expected types include:

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
- `dateRange`
- `dateTimeRange`
- `limitedEnum`
- `expandedEnum`
- `coordinates`
- `json`
- `money`
- `phoneNumber`
- `countryCode`
- `timezone`
- `relationshipReference`
- `imageReference`
- `videoReference`
- `audioReference`
- `documentReference`
- `spreadsheetReference`

### Enum Split

Use `limitedEnum` for small bounded choice lists.

Expected default displays may include:

- simple select
- segmented control
- radio group
- checkbox group
- toggle-style display

Use `expandedEnum` for larger or growing choice lists.

Expected default displays may include:

- drawer select
- governed picker
- searchable selector

## Options Sources

Option-like attributes should declare where choices come from.

V1 source modes:

| Value | Meaning | Common Use |
| --- | --- | --- |
| `none` | The attribute has no options. | free text, dates, numbers, booleans without option labels |
| `inline` | Options are declared directly on the attribute. | small fixed status or type lists |
| `catalogReference` | Options come from an approved reusable catalog. | countries, time zones, reusable taxonomies |
| `relationshipSource` | Options are derived from governed related records. | child records, sibling records, candidate parents, available assets |

Inline option example:

```json
{
  "attributeType": "limitedEnum",
  "optionsMode": "inline",
  "options": [
    {
      "optionKey": "active",
      "labelKey": "entity.status.active.label",
      "labelFallback": "Active",
      "descriptionKey": "entity.status.active.description",
      "descriptionFallback": "Visible in normal management views.",
      "displayOrder": 10
    }
  ]
}
```

Catalog reference example:

```json
{
  "attributeType": "expandedEnum",
  "optionsMode": "catalogReference",
  "optionsCatalogKey": "countries"
}
```

Catalog entries should provide the same static option text shape:

```json
{
  "optionKey": "ireland",
  "labelKey": "catalog.country.ireland.label",
  "labelFallback": "Ireland",
  "descriptionKey": "catalog.country.ireland.description",
  "descriptionFallback": "Ireland.",
  "displayOrder": 372
}
```

Relationship source example:

```json
{
  "attributeKey": "parentBusinessUnitId",
  "attributeType": "relationshipReference",
  "category": "parentRelation",
  "optionsMode": "relationshipSource",
  "relationshipOptionSource": {
    "targetEntityKey": "businessUnit",
    "relationshipRole": "candidateParentBusinessUnits",
    "scope": "sameOrganization",
    "excludeSelf": true,
    "excludeDescendants": true,
    "labelAttributeKey": "name",
    "descriptionAttributeKey": "description",
    "subtitleAttributeKey": "parentName",
    "badgeAttributeKey": "status",
    "valueAttributeKey": "businessUnitId"
  }
}
```

Relationship-sourced options are not freeform queries. They must be governed by:

- target entity
- relationship boundary metadata
- allowed target statuses
- value and label attribute mappings
- optional description, subtitle, and badge attribute mappings
- search/filter support where the list can grow
- exclusion rules such as self, descendants, archived records, or deleted records
- authz/capability rules later

Static inline and catalog-backed options must provide explicit label
localization keys and fallback labels. Description localization keys and
fallback descriptions are optional but supported.

Relationship-sourced option labels and descriptions come from target record
attributes. If those target attributes are themselves localized, the consuming
picker can display localized values through the target entity contract.

`limitedEnum` may use `inline` or `catalogReference`; `relationshipSource` is
allowed only when the resulting list is bounded enough for the chosen
design-system element.

`expandedEnum` should usually use `catalogReference` or `relationshipSource`.

### Date And Time Ranges

Use `dateRange` and `dateTimeRange` when the value is a duration or window.
Do not represent those as loosely paired start/end fields by default unless the
entity has a reason to expose separate attributes.

### File References

File references should be split by asset kind, including:

- `imageReference`
- `videoReference`
- `audioReference`
- `documentReference`
- `spreadsheetReference`

These are planning-level types only until the consuming feature has an
approved asset consumer decision record covering authorization, scanning,
quota, lifecycle, retention, delivery, accessibility, and operational posture.

Generic file references are denied by default unless explicitly approved
through asset governance.

## Value Cardinality

Type describes the value shape. Cardinality describes one versus many.

V1 values:

- `single`
- `multiple`

Do not create separate array type names such as `stringArray`.

Example:

```json
{
  "attributeKey": "tags",
  "attributeType": "limitedEnum",
  "valueCardinality": "multiple"
}
```

## Multiple-Value Limits

When `valueCardinality` is `multiple`, attributes may declare optional limits.

```json
{
  "valueCardinality": "multiple",
  "itemLimits": {
    "minItems": 1,
    "maxItems": 5
  }
}
```

Rules:

- use an explicit `itemLimits` object rather than loose `minItems` and
  `maxItems` fields
- for `single`, use `notApplicable` values:
  `{ "minItems": "notApplicable", "maxItems": "notApplicable" }`
- for `multiple`, `minItems` and `maxItems` may be numbers or `none`
- `none` means no explicit entity-definition limit beyond requiredness,
  storage, component, or performance constraints
- `maxItems` must be greater than or equal to `minItems` when both are numeric
- If a multiple-value field is searchable or filterable, storage strategy still
  needs to be approved. Comma-separated strings are not acceptable for reliable
  filtering at scale.

## Validation Rules

Validation should be catalog-driven and type-compatible.

Each attribute type should be able to suggest common validation rules, default
error-message localization keys, and fallback messages. Entity definitions may
still declare governed explicit overrides when a specific entity needs stricter
or different behavior.

A validation rule should eventually look something like:

```json
{
  "ruleKey": "maxLength",
  "argumentType": "integer",
  "argumentValue": 120,
  "messageKey": "validation.maxLength",
  "messageFallback": "Must be 120 characters or fewer."
}
```

Expected default suggestions by type:

| Attribute Type | Common Suggested Rules |
| --- | --- |
| `string` | `trim`, `minLength`, `maxLength`, optional `pattern` |
| `text` | `trim`, `minLength`, `maxLength` |
| `email` | `trim`, `lowercase`, `emailFormat`, `maxLength` |
| `url` | `trim`, `urlFormat`, `maxLength` |
| `uuid` | `uuidFormat` |
| `phoneNumber` | `trim`, `phoneNumberFormat` |
| `countryCode` | `countryCodeFormat`, `allowedCountryCode` |
| `timezone` | `timezoneFormat`, `allowedTimezone` |
| `integer` | `minValue`, `maxValue`, `integerFormat` |
| `decimal` | `minValue`, `maxValue`, `decimalPlaces`, `decimalFormat` |
| `money` | `minValue`, `maxValue`, `decimalPlaces`, `currencyRequired`, `moneyFormat` |
| `boolean` | `booleanFormat` unless only type compatibility is needed |
| `date` | `dateFormat`, optional `minDate`, `maxDate`, `notInPast`, `notInFuture` |
| `datetime` | `dateTimeFormat`, optional `minDateTime`, `maxDateTime`, `notInPast`, `notInFuture` |
| `dateRange` | `dateRangeFormat`, `startBeforeEnd`, optional `maxDuration` |
| `dateTimeRange` | `dateTimeRangeFormat`, `startBeforeEnd`, optional `maxDuration` |
| `limitedEnum` | `allowedOptions` |
| `expandedEnum` | `allowedOptions`, optional `optionCatalogRequired` |
| relationship reference types | `targetExists`, `relationshipBoundary`, optional `allowedTargetStatus` |
| file reference types | `allowedMimeTypes`, `maxFileSize`, optional `maxFileCount` |
| `json` | `jsonShape`, optional governed schema reference |

Default validation messages should be rule-specific, not only
attribute-type-specific.

| Rule Key | Default Message Key | Default Message Fallback |
| --- | --- | --- |
| `trim` | `validation.trim` | "Remove extra spaces at the beginning or end." |
| `lowercase` | `validation.lowercase` | "Use lowercase text." |
| `uppercase` | `validation.uppercase` | "Use uppercase text." |
| `minLength` | `validation.minLength` | "Must be at least {minLength} characters." |
| `maxLength` | `validation.maxLength` | "Must be {maxLength} characters or fewer." |
| `pattern` | `validation.pattern` | "Enter text in the required format." |
| `allowedCharacters` | `validation.allowedCharacters` | "Use only the allowed characters." |
| `uuidFormat` | `validation.uuidFormat` | "Enter a valid identifier." |
| `emailFormat` | `validation.emailFormat` | "Enter a valid email address." |
| `urlFormat` | `validation.urlFormat` | "Enter a valid URL." |
| `phoneNumberFormat` | `validation.phoneNumberFormat` | "Enter a valid phone number." |
| `countryCodeFormat` | `validation.countryCodeFormat` | "Enter a valid country code." |
| `allowedCountryCode` | `validation.allowedCountryCode` | "Choose an allowed country." |
| `timezoneFormat` | `validation.timezoneFormat` | "Enter a valid time zone." |
| `allowedTimezone` | `validation.allowedTimezone` | "Choose an allowed time zone." |
| `integerFormat` | `validation.integerFormat` | "Enter a whole number." |
| `decimalFormat` | `validation.decimalFormat` | "Enter a valid number." |
| `moneyFormat` | `validation.moneyFormat` | "Enter a valid monetary amount." |
| `minValue` | `validation.minValue` | "Must be greater than or equal to {minValue}." |
| `maxValue` | `validation.maxValue` | "Must be less than or equal to {maxValue}." |
| `decimalPlaces` | `validation.decimalPlaces` | "Use no more than {decimalPlaces} decimal places." |
| `positiveOnly` | `validation.positiveOnly` | "Must be greater than zero." |
| `nonNegative` | `validation.nonNegative` | "Must be zero or greater." |
| `currencyRequired` | `validation.currencyRequired` | "Choose a currency." |
| `booleanFormat` | `validation.booleanFormat` | "Choose yes or no." |
| `dateFormat` | `validation.dateFormat` | "Enter a valid date." |
| `dateTimeFormat` | `validation.dateTimeFormat` | "Enter a valid date and time." |
| `dateRangeFormat` | `validation.dateRangeFormat` | "Enter a valid date range." |
| `dateTimeRangeFormat` | `validation.dateTimeRangeFormat` | "Enter a valid date and time range." |
| `minDate` | `validation.minDate` | "Date must be on or after {minDate}." |
| `maxDate` | `validation.maxDate` | "Date must be on or before {maxDate}." |
| `minDateTime` | `validation.minDateTime` | "Date and time must be on or after {minDateTime}." |
| `maxDateTime` | `validation.maxDateTime` | "Date and time must be on or before {maxDateTime}." |
| `notInPast` | `validation.notInPast` | "Must not be in the past." |
| `notInFuture` | `validation.notInFuture` | "Must not be in the future." |
| `startBeforeEnd` | `validation.startBeforeEnd` | "Start must be before end." |
| `maxDuration` | `validation.maxDuration` | "Duration must be {maxDuration} or shorter." |
| `allowedOptions` | `validation.allowedOptions` | "Choose one of the allowed options." |
| `optionCatalogRequired` | `validation.optionCatalogRequired` | "Choose an option from the approved catalog." |
| `minItems` | `validation.minItems` | "Choose at least {minItems} item(s)." |
| `maxItems` | `validation.maxItems` | "Choose no more than {maxItems} item(s)." |
| `uniqueItems` | `validation.uniqueItems` | "Each selected item must be unique." |
| `targetExists` | `validation.targetExists` | "Choose a valid related record." |
| `relationshipBoundary` | `validation.relationshipBoundary` | "Choose a related record within the allowed boundary." |
| `allowedTargetStatus` | `validation.allowedTargetStatus` | "Choose a related record with an allowed status." |
| `allowedMimeTypes` | `validation.allowedMimeTypes` | "Choose an allowed file type." |
| `maxFileSize` | `validation.maxFileSize` | "File must be {maxFileSize} or smaller." |
| `maxFileCount` | `validation.maxFileCount` | "Choose no more than {maxFileCount} file(s)." |
| `jsonShape` | `validation.jsonShape` | "Enter structured data in the required shape." |

Rules such as file MIME type, maximum file size, and file count remain
planning-level until the relevant asset consumer decision record and asset
governance are approved.

## Search, Filter, And Sort

Attributes are not searchable by default.

If an attribute needs to support keyword search, filtering, faceting, range
queries, sorting, or default ordering, it should declare an explicit search
block. Search posture can be created or changed later through governed
entity-definition maintenance.

Example shape:

```json
{
  "search": {
    "searchable": true,
    "operators": ["exact", "prefix", "sort"],
    "storageModel": "normalizedScalar",
    "indexPosture": "required"
  }
}
```

Top-level `searchModel` working shape:

```json
{
  "searchModel": {
    "globalSearchEnabled": false,
    "globalSearchAttributeKeys": [],
    "sortableAttributeKeys": [],
    "defaultSort": "none",
    "pinnedFilterAttributeKeys": [],
    "facetAttributeKeys": [],
    "searchStoragePosture": "notSearchable",
    "indexEvidenceKeys": []
  }
}
```

Example with sorting enabled:

```json
{
  "searchModel": {
    "globalSearchEnabled": true,
    "globalSearchAttributeKeys": ["name", "description"],
    "sortableAttributeKeys": ["name", "updatedAt"],
    "defaultSort": {
      "attributeKey": "updatedAt",
      "direction": "desc"
    },
    "pinnedFilterAttributeKeys": ["organizationType", "systemLifecycleStatus"],
    "facetAttributeKeys": ["organizationType"],
    "searchStoragePosture": "database",
    "indexEvidenceKeys": []
  }
}
```

Top-level search rules:

- `globalSearchAttributeKeys` powers the main search box
- `sortableAttributeKeys` lists all attributes users/generated UI may sort by
- `defaultSort` may be `none`
- if `defaultSort` is not `none`, it must reference a sortable attribute
- sort direction must be `asc` or `desc`
- pinned filters are shown by default
- facets support count/filter behavior
- every referenced attribute must have compatible attribute-level search config

Expected operator values include:

- `exact`
- `prefix`
- `contains`
- `fullText`
- `range`
- `facet`
- `sort`

Search storage model catalog:

| Value | Meaning | Common Use |
| --- | --- | --- |
| `scalar` | A single ordinary stored value is searched directly. | exact filters, range filters, sort on fields like status or created date |
| `normalizedScalar` | A normalized stored value supports search/filtering. | lowercase/trimmed email, normalized name, normalized slug |
| `junctionTable` | Multi-value values are stored in a separate relation/table. | tags, categories, allowed countries, many selected options |
| `generatedColumn` | A database or persistence-generated value supports search. | full-text vector from name and description; generated normalized key |
| `jsonApproved` | Searchable values live in JSON/JSONB with explicit approval for operators and scale. | governed flexible metadata keys |
| `externalIndex` | Search is handled outside the main database. | OpenSearch, Elasticsearch, Meilisearch, vector index, analytics search |
| `notSearchable` | The attribute is not searchable, filterable, facetable, or sortable. | default when no search block exists |

Search rules:

- no search block means `notSearchable`
- searchable storage model, supported operators, and index posture must be
  explicit
- multi-value searchable fields must not use comma-separated strings
- multi-value filtering should use `junctionTable` or another approved
  storage/index strategy
- `jsonApproved` needs explicit approval for query pattern and scale
- `externalIndex` needs sync, freshness, failure, privacy, and authorization
  posture

## Presentation Groups

Groups are separate presentation metadata. They are not attributes, and they
do not carry semantic meaning.

Likely section name:

- `presentationGroups`

Group metadata may include:

- `groupKey`
- localization key and fallback label
- optional localization key and fallback description/help text
- `displayOrder`

Group rules:

- groups are declared once at the entity level
- placements may reference groups
- groups are presentation-only
- semantic category remains on the attribute
- group order is separate from attribute placement order

## Placements

Not every attribute needs a placement.

Unplaced attributes are still part of the canonical entity definition. They are
not rendered by default.

Placed attributes should eventually reference:

- approved surface
- optional approved surface variant
- approved region/component contract for that surface
- optional approved sub-region inside that region
- optional presentation group
- order within the surface/region/sub-region/group
- approved design-system element
- interaction mode or visibility intent

Example:

```json
{
  "surfaceKey": "listDrawer",
  "regionKey": "drawerSection",
  "subRegionKey": "drawerAttributeFieldForm",
  "groupKey": "accountDetails",
  "displayOrder": 20,
  "elementKey": "readonlyText",
  "interactionMode": "readOnly",
  "visibilityMode": "defaultVisible"
}
```

Validation should reject incompatible surface, region, sub-region, and element
combinations. For example, a floating tab header row should not be valid inside
a list drawer.

`surfaceKey`, `surfaceVariantKey`, `regionKey`, `subRegionKey`, and
`elementKey` are stable keys chosen from approved design-system contracts.
Entity definitions must not invent entity-local slot, region, sub-region,
variant, or element names.

Region and sub-region are page-template layout concepts. `groupKey` is entity
presentation metadata. For example, the record-management drawer may have a
`drawer_attribute_field_form` sub-region, while the active entity group inside
that sub-region may be `branding`, `legal_details`, or `members`.

If a new layout is needed, the design-system contract should be extended or
versioned first. Then entity definitions can opt into the approved key or
variant.

Placement-specific label/help overrides are deferred until a concrete use case
appears. For now, placements should use the canonical attribute text by
default, while design-system contracts decide whether a region displays labels.

### Future Presentation Overlays

Tenant or organization presentation customization should be modeled later as an
overlay on top of the canonical entity definition, not as edits to the
canonical definition itself.

Example future overlay:

```json
{
  "entityKey": "organization",
  "scope": {
    "tenantId": "tenant_123",
    "organizationId": "org_456"
  },
  "placementOverrides": [
    {
      "attributeKey": "customerTier",
      "surfaceKey": "listRow",
      "regionKey": "badgeSlot",
      "subRegionKey": "none",
      "displayOrder": 10,
      "visibilityMode": "defaultVisible"
    }
  ]
}
```

Overlay guardrails:

- overlays cannot invent new attributes
- overlays cannot invent arbitrary surface, region, sub-region, variant, or
  element keys
- overlays cannot weaken security, privacy, or system-managed rules
- overlays cannot expose hidden, restricted, or classified fields without
  authz and clearance support
- overlays cannot change relationship boundaries
- overlays cannot change persistence or API semantics
- overlays may adjust approved presentation choices such as order, visibility,
  region, group placement, or element only where explicitly allowed

### Design-System Template Follow-Up

The entity definition should keep `surfaceModel` as an attachment point until
the entity-management design-system templates are built and signed off.

Planned template families:

- `recordManagementListCentric`: for CRUD/list/detail management, search,
  filters, drawers, and forms
- `operationalManagementStatusCentric`: for workflow/status-driven entities,
  likely kanban, status tabs, queues, and operational movement

When those templates are created and locked, update the entity definition model
to reference their approved:

- design-system contract keys
- surface variant keys
- allowed regions
- allowed elements
- placement validation rules
- overlay-eligible fields and guardrails

## Surface Model

`surfaceModel` records which approved management pattern and design-system
surfaces the entity is expected to use.

Working placeholder shape:

```json
{
  "surfaceModel": {
    "managementPattern": "notYetAssigned",
    "routingTopology": {
      "appKey": "rootAdmin",
      "moduleKey": "organizations",
      "primaryPageKey": "organizations",
      "canonicalRoute": "/root-admin/organizations",
      "parentPageKeys": [],
      "supportOnly": false
    },
    "collectionViews": [],
    "enabledSurfaces": [],
    "defaultSurfaceKey": "none",
    "overlayEligible": false,
    "designSystemContractKeys": [],
    "surfaceEvidenceKeys": []
  }
}
```

Planned `managementPattern` values:

- `notYetAssigned`
- `recordManagementListCentric`
- `operationalManagementStatusCentric`
- `customApproved`

`recordManagementListCentric` and `operationalManagementStatusCentric` are
included now as planned values so entity shaping can continue. Their exact
design-system contract keys, surface variants, regions, elements, and
validation rules remain pending until the templates are built and signed off.

### Routing Topology

`surfaceModel.routingTopology` declares where the entity is surfaced in the app
navigation model.

It should answer:

- which app or shell area owns the entity surface
- which module/top-nav grouping contains it
- which primary page or context-nav destination represents it
- which canonical route should be used
- which parent pages exist, if any
- whether the route is support-only rather than normal user-facing topology

Working fields:

| Field | Meaning |
| --- | --- |
| `appKey` | App or shell area, such as root admin, tenant admin, support, backend/ops, or another approved app. |
| `moduleKey` | Module or top-nav grouping where the entity should appear. |
| `primaryPageKey` | Primary page/context-nav destination for the entity. |
| `canonicalRoute` | Canonical route for the entity management surface. |
| `parentPageKeys` | Parent pages or containing pages when this entity is nested under another durable page. |
| `supportOnly` | Whether this surface is support/ops-only rather than normal user-facing topology. |

Routing values must align with approved frontend topology. Entity definitions
must not introduce new durable destinations through ad hoc page code.

### Collection Views

`surfaceModel.collectionViews` defines approved ways to see an entity
collection.

A collection view is not just a visual tab. It records the business and
governance rule for a view: who it is meant for, which operational statuses and
sub-statuses belong to it, whether it is the default for any role/context, and
which approved template regions may render it.

Working collection view shape:

```json
{
  "viewKey": "active_management",
  "labelKey": "entity.organization.view.activeManagement.label",
  "labelFallback": "Active management",
  "descriptionKey": "entity.organization.view.activeManagement.description",
  "descriptionFallback": "Shows organizations that are actively managed.",
  "roleEligibility": ["root_admin"],
  "includedStatusKeys": ["active"],
  "includedSubStatusKeys": [],
  "statusDisplayPosture": "show_status_bar",
  "defaultForRoles": ["root_admin"],
  "templateRegionEligibility": ["view_selector", "status_bar"],
  "displayOrder": 10,
  "evidenceKeys": []
}
```

Collection view rules:

- view keys are stable snake_case keys
- status keys must come from `operationalStatusSet`
- sub-status keys must come from nested operational statuses
- role eligibility describes intended/eligible view access, but it does not
  replace runtime authorization
- views may overlap only when the overlap is explicit and reviewable
- if the selected template exposes a `view_selector`, it should use
  `collectionViews` rather than inventing page-local tabs
- if a view narrows statuses or sub-statuses, the generated status-bar behavior
  should be derived from the active view

## Placement Interaction And Visibility

Placement interaction and visibility are separate.

`interactionMode` describes what can happen at the placement, not full
authorization policy.

Current expected values include:

- `readOnly`
- `editable`
- `actionOnly`

`visibilityMode` describes whether the placement appears by default.

Current expected values include:

- `defaultVisible`
- `hiddenByDefault`
- `conditional`

`hiddenByDefault` means the attribute has a reserved place in the surface but is
not visible unless a later approved authz/capability rule reveals it.

`conditional` means the placement appears only when an approved condition is
met, such as a status, mode, or related state. The condition shape is not locked
yet.

Whether a surface/region/sub-region/element supports a mode such as
`hiddenByDefault` should be validated through the design-system component
contract, not hard-coded in entity-specific UI logic.

## Relationship Metadata

Attributes with category `parentRelation`, `childRelation`, or
`domainRelation` should declare relationship metadata.

Simple rule:

- attributes describe fields
- top-level relationships describe how this entity connects to other entities
  and what the app can do with that connection

Example:

- Business Unit has an attribute called `organizationId`.
- Organization may still declare a relationship called `businessUnits`.
- The Organization does not need to store a list of business unit IDs.
- The relationship can say: find business units where
  `businessUnit.organizationId` points to this organization.

This lets generated drawers, relationship panels, permission checks, delete
rules, and search understand the connection without guessing.

Likely relationship fields include:

- `relationshipKey`
- localization keys and fallback label/description
- `targetEntityKey`
- `relationshipRole`
- `inverseRelationshipRole`
- `cardinality`
- `relationshipBoundary`
- `resolution`
- `sourceAttributeKey`
- `inverseAttributeKey`
- `joinEntityKey`
- `navigationPosture`
- `ownershipPosture`
- lifecycle impact, still under discussion

Every relationship entry should be field-complete. Use explicit defaults such
as `none`, `notApplicable`, and empty arrays where needed.

Complete example:

```json
{
  "relationshipKey": "businessUnits",
  "labelKey": "entity.organization.relationship.businessUnits.label",
  "labelFallback": "Business units",
  "descriptionKey": "entity.organization.relationship.businessUnits.description",
  "descriptionFallback": "Business units that belong to this organization.",
  "relationshipCategory": "childRelation",
  "targetEntityKey": "businessUnit",
  "relationshipRole": "businessUnits",
  "inverseRelationshipRole": "organization",
  "cardinality": "oneToMany",
  "resolution": "inverseLookup",
  "sourceAttributeKey": "none",
  "inverseAttributeKey": "organizationId",
  "joinEntityKey": "none",
  "ownershipPosture": "owns",
  "navigationPosture": "navigable",
  "relationshipBoundary": {
    "tenantBoundary": "sameTenant",
    "organizationBoundary": "sameOrganization",
    "businessUnitBoundary": "notApplicable"
  },
  "relationshipLifecycleImpact": {
    "onArchive": "cascadeArchive",
    "onDelete": "restrict",
    "onRestore": "none",
    "onSupersede": "preserveHistorical"
  },
  "evidenceKeys": []
}
```

### Relationship Lookup Recipe

Each relationship should describe where the stored field or lookup path lives.

```json
{
  "resolution": "inverseLookup",
  "sourceAttributeKey": "none",
  "inverseAttributeKey": "organizationId",
  "joinEntityKey": "none"
}
```

Rules:

- `storedReference` requires `sourceAttributeKey`
- `inverseLookup` requires `inverseAttributeKey`
- `joinEntity` requires `joinEntityKey`
- `computed` requires calculation metadata
- `externalLookup` requires external source metadata
- unused lookup fields use explicit `none`

Examples:

- Business Unit belongs to Organization: Business Unit stores
  `organizationId`; Organization finds business units by inverse lookup.
- User has Profile Image: User stores `profileImageAssetId` directly.
- User belongs to Groups: a membership/join entity stores the relationship.

### Relationship Navigation Posture

`navigationPosture` describes whether and how a relationship can be exposed for
navigation. Exact placement/display remains owned by surface and placement
contracts.

Working values:

| Value | Meaning | Example |
| --- | --- | --- |
| `notNavigable` | Relationship exists for validation or internal logic but is not exposed in UI navigation. | internal password credential relationship |
| `displayOnly` | Relationship can be shown as a value or summary but is not a full navigation path. | profile image asset displayed on a profile |
| `navigable` | Users can navigate to related records through approved surfaces. | organization business units relationship panel |
| `governanceOnly` | Relationship is exposed only in governance/admin/evidence surfaces. | decision log evidence links |
| `supportOnly` | Relationship is exposed only in support or operations surfaces. | support-only recovery or diagnostic links |

## Relationship Boundaries

Relationship attributes must declare structural boundary constraints to prevent
accidental cross-boundary data leakage.

Boundary dimensions currently expected:

- tenant boundary
- organization boundary
- business-unit boundary

These constraints define which relationships are structurally valid. Actor
permission to create, read, update, or reveal the relationship remains owned by
authz/capability logic.

Boundary values describe the relationship shape before permissions are checked.

Expected values include:

| Value Shape | Meaning | Example |
| --- | --- | --- |
| `notApplicable` | This relationship does not live in that boundary world. | root-user profile image when root users are platform-level; global country-code reference data |
| `sameTenant`, `sameOrganization`, `sameBusinessUnit` | Target must be in the exact same boundary. | organization location belongs to the same organization; a team setting references a member in the same business unit |
| `sameOrganizationTree`, `sameBusinessUnitTree` | Target may be elsewhere in the same hierarchy/tree. | moving or linking records within the same business-unit tree |
| `crossTenantDenied`, `crossOrganizationDenied`, `crossBusinessUnitDenied` | Crossing that boundary is explicitly forbidden as a model invariant. | tenant invoice must not reference another tenant's customer |
| `crossTenantAllowedWithApproval`, `crossOrganizationAllowedWithApproval`, `crossBusinessUnitAllowedWithApproval` | Crossing is structurally possible only under approved policy/root/admin authority. | root operator links possible duplicate organizations across tenants for fraud or merge review |
| `crossTenantAllowed`, `crossOrganizationAllowed`, `crossBusinessUnitAllowed` | Crossing is normal approved product behavior, still subject to authz. | approved shared marketplace/template relationship across tenants |

`sameX` usually implies cross-boundary denial. The explicit `crossXDenied`
values are useful when the hard-deny posture itself should be visible to
validators, reviewers, and future generated behavior.

## Relationship Resolution

Relationship resolution describes how the relationship is resolved.

| Value | Meaning | Common Use |
| --- | --- | --- |
| `storedReference` | This record directly stores the target reference. | profile image asset ID, parent ID, primary related record |
| `inverseLookup` | Target records point back to this record and are found by indexed lookup. | organization has many business units via `businessUnit.organizationId` |
| `joinEntity` | A separate linking entity owns the relationship. | user-group membership, many-to-many role links, membership with role/effective dates |
| `computed` | Deterministic platform logic resolves the relationship. | eligible reviewers, calculated dependent records |
| `externalLookup` | An external system or source resolves the relationship. | CRM contacts, billing invoices, external customer records |

Additional rules:

- `inverseLookup` requires indexed lookup/index proof.
- `computed` requires calculation metadata, freshness, and failure/staleness
  posture.
- `externalLookup` requires source, sync/cache, failure, latency, privacy, and
  authority posture.

## Relationship Ownership

Ownership posture describes how strongly this entity owns or depends on the
related record.

Working v1 catalog:

| Value | Meaning | Example |
| --- | --- | --- |
| `owns` | This entity owns the related record's lifecycle. | organization owns locations |
| `references` | This entity points to an independently owned record. | organization references primary logo asset |
| `sharedReference` | Multiple entities intentionally reference the same target. | entities reference the same country code or taxonomy value |
| `dependent` | This entity cannot exist or remain valid without the target, but does not own it. | business unit depends on parent organization |

Ownership posture should inform lifecycle behavior and give authz/capability
checks a structural guardrail against unauthorized access, editing, or deletion
of records owned by another entity or boundary.

## Relationship Lifecycle Impact

Relationship lifecycle impact answers what happens to related records or links
when the source entity changes system lifecycle state.

This should be mapped per system lifecycle transition, not stored as one
generic relationship value.

V1 transition keys:

- `onArchive`
- `onDelete`
- `onRestore`
- `onSupersede`

Candidate impact values:

- `none`
- `restrict`
- `cascadeArchive`
- `cascadeDelete`
- `detach`
- `reassignRequired`
- `preserveHistorical`
- `cleanupRequired`

Example:

```json
{
  "relationshipLifecycleImpact": {
    "onArchive": "cascadeArchive",
    "onDelete": "restrict",
    "onRestore": "none",
    "onSupersede": "preserveHistorical"
  }
}
```

This avoids pretending archive, delete, restore, and supersede all behave the
same way for a relationship.

## Boundary With Authorization

The entity definition should not become a second authorization system.

It can declare:

- semantic category
- privacy classification
- security classification
- system-managed posture
- mutability
- relationship boundaries
- hidden-by-default placement intent

Authz/capability contracts later decide:

- who may see a field
- who may reveal a hidden-by-default placement
- who may edit a field
- who may create, update, delete, restore, or move related records
- what clearance or permission qualifies an internal actor

The entity definition supplies governed structure; authorization supplies actor
decision logic.

## Repo Reconciliation Notes

The current repo already has an implemented `entityBuilder` foundation and a
richer Markdown data-dictionary bridge. The governed entity definition decided
in this discovery stream supersedes the current narrower `entityBuilder` shape
as the target model.

Existing `entityBuilder` remains important because it contains current routes,
persistence, exports, permission mappings, tests, and migration evidence. It
should not, however, limit the canonical definition where this discovery model
is more complete.

Current `entityBuilder` foundation:

- stable entity lineages using `entityKey`
- immutable entity definition versions
- stable version-owned `attributeKey` values
- attribute kind, type, and cardinality catalogs
- form-facing labels, descriptions, help text, placeholders, and default form
  pattern keys
- inline options and catalog-reference posture
- computed attribute source links
- validation rules and effective default validation at export time
- root-only create, update, read, catalog read, validate, and export
- export format v1

Current data-dictionary bridge:

- entity registry header
- source authority and future persistence
- capability inventory
- attribute inventory
- status/lifecycle model
- relationship inventory
- indexes and constraints
- normalization and validation rules
- search/filter/sort model
- mutation semantics
- retention, cleanup, export, and legal hold
- authorization and tenant boundary
- API, UI, and design-system posture
- compliance classification and governance
- source/evidence mapping

The emerging canonical definition should treat the implemented builder as
current compatibility/source material, and the Markdown bridge as the richer
shape that needs to become structured.

## Key And Catalog Casing

Stable entity-definition values should use the existing `entityBuilder`
snake_case posture.

Use snake_case for values that become durable, referenced, or cataloged truth:

- `entityKey`
- `attributeKey`
- `relationshipKey`
- `groupKey`
- `statusKey`
- `optionKey`
- validation rule keys
- catalog values
- persistent registry identifiers

Use lowerCamel for JSON object property names:

- `entityIdentity`
- `sourceAuthority`
- `valueCardinality`
- `defaultSort`
- `sourceAttributeKey`
- `relationshipLifecycleImpact`

Plainly: object fields describe the schema shape; stable values identify
things inside the platform. The stable values should preserve compatibility
with existing `entityBuilder` runtime and persistence.

Open reconciliation rules before lock-in:

| Topic | Current repo posture | Target question |
| --- | --- | --- |
| Canonical target authority | Current `entityBuilder` is narrower than this discovery model. | Decision locked: this discovery model supersedes the current builder shape as the target. Existing builder fields are compatibility/migration inputs. |
| Key casing | Entity/attribute keys and many catalog values are snake_case in `entityBuilder`; JSON object property names in planning are lowerCamel. | Decision locked: durable keys/catalog values use snake_case; JSON object property names use lowerCamel. |
| Attribute source | Current `attributeKind` is `persisted` or `computed`. | Decision locked: do not keep `attributeKind` as canonical. Replace it with the richer attribute fields defined in this model and map old values during migration. |
| Enum type | Current builder has one `enum` type. | Decision locked: existing `enum` migrates to `limited_enum` by default; use `expanded_enum` only when evidence shows large/growing/searchable/grouped/descriptive picker needs. |
| Options mode | Current builder uses `none`, `inline`, and `catalog_reference`. | Decision locked: map existing values directly. Use `relationship_source` only for new/richer definitions or clear relationship-backed option evidence. |
| Attribute order | Current builder stores one global `displayOrder`. | Decision locked: migrate global `displayOrder` into default surface placement order; new ordering lives on placements scoped by surface, region, sub-region, and group. |
| Validation messages | Current rules store an optional literal `errorMessage`. | Decision locked: migrate literal messages into fallback copy; canonical messages use localization keys plus fallback messages. |
| Export format | Current export is `exportFormatVersion = 1`. | Decision locked: the full canonical model should use a new explicit export/read shape, expected as export format v2 or equivalent. Do not silently change v1. |
| Status catalog | Current definition versions use `draft`, `active`, `superseded`, and `archived`. | Decision locked: definition-version status is separate from managed-record system lifecycle. |
| Relationship model | ADR-0021 explicitly deferred relationship modeling. | Which relationship records should extend `entityBuilder`, and which belong to consuming features? |
| Form/surface model | Current builder stores form-facing default pattern only. | How do approved form patterns evolve into full surface/region/sub-region/element placement contracts? |

## Replacing Current `attributeKind`

The existing `entityBuilder` foundation uses `attributeKind` with values such
as `persisted` and `computed`.

That field is too broad for the canonical model. It mixes together ideas that
the governed definition now describes separately:

- semantic category, such as `identity`, `core`, `metadata`, or
  `operationalLifecycle`
- attribute type, such as `string`, `uuid`, `limitedEnum`, or `money`
- value cardinality, such as `single` or `multiple`
- system-managed posture
- mutability, such as `immutable`, `createOnly`, `systemUpdateable`,
  `derived`, or `calculated`
- derivation/calculation/source evidence

Canonical entity definitions should therefore not preserve `attributeKind` as
the main field.

Migration rule:

| Existing `attributeKind` | Canonical interpretation |
| --- | --- |
| `persisted` | A normal stored attribute. The migration must populate semantic category, type, cardinality, system-managed posture, mutability, validation, search, and presentation fields explicitly. |
| `computed` | A generated attribute. The migration must decide whether the value is a transparent `derived` value or a business-rule `calculated` value, then populate source attributes, calculation metadata, stale/failure posture, and evidence where applicable. |

If migration evidence cannot tell whether an existing computed value is
`derived` or `calculated`, the definition should be flagged for human review
rather than guessed silently.

## Existing Enum Migration

The current `entityBuilder` foundation has one `enum` type.

The canonical model splits that into:

- `limited_enum`
- `expanded_enum`

Migration rule:

| Existing shape | Canonical target |
| --- | --- |
| `enum` with a small bounded inline option set | `limited_enum` |
| `enum` with a compact stable catalog | `limited_enum` |
| `enum` with a large or growing catalog | `expanded_enum` |
| `enum` where choices need search, grouping, descriptions, badges, or richer preview | `expanded_enum` |
| unclear enum evidence | `limited_enum` by default, with review only when UX/search evidence suggests the set may be too large |

This keeps small choices simple while still allowing searchable drawer or
picker patterns when the option set behaves more like a managed catalog.

## Existing Options Mode Migration

Options mode means where selectable choices come from.

Migration rule:

| Existing options mode | Canonical target | Meaning |
| --- | --- | --- |
| `none` | `none` | The attribute does not use selectable options. |
| `inline` | `inline` | The choices are stored directly on the attribute definition. |
| `catalog_reference` | `catalog_reference` | The attribute points to an approved reusable option catalog. |

`relationship_source` is a new canonical mode. It should be used when choices
come from governed related entity records, such as candidate parent
organizations, child business units, or related records inside an approved
boundary.

During migration, do not rewrite existing `catalog_reference` values into
`relationship_source` unless the evidence clearly says the choices are related
entity records rather than a reusable options catalog.

## Existing Display Order Migration

The current `entityBuilder` foundation stores one global `displayOrder` per
attribute.

The canonical model moves ordering to placements because an attribute can appear
in different surfaces with different order:

- list row
- read drawer
- create form
- edit form
- status tab
- relationship panel

Migration rule:

| Existing value | Canonical target |
| --- | --- |
| attribute `displayOrder` | default placement `displayOrder` for the default/generated surface |

After migration, the attribute itself should not own one universal visual
order. Each placement should declare its own order within its approved surface,
region, and optional group.

## Existing Validation Message Migration

The current `entityBuilder` foundation can store a literal validation
`errorMessage`.

The canonical model should use localization-aware validation messages:

- `messageKey`
- `messageFallback`

Migration rule:

| Existing value | Canonical target |
| --- | --- |
| literal `errorMessage` | `messageFallback` |
| no literal `errorMessage` | default rule `messageFallback` from the validation catalog |
| validation rule identity | stable rule `messageKey` derived from the validation catalog or explicit override |

This keeps existing messages readable while making future definitions
translation-ready and deterministic.

## Canonical Export / Read Shape

The current `entityBuilder` export format is versioned as:

- `exportFormatVersion = 1`

That shape is narrower than the governed entity definition model.

Decision:

- do not silently change export format v1
- keep v1 compatibility-safe for existing consumers
- introduce a new explicit full-definition export/read shape, expected as
  `exportFormatVersion = 2` or an equivalent versioned canonical read model

The richer shape should include the full canonical sections:

- `entityIdentity`
- `sourceAuthority`
- `evidenceRegistry`
- `attributes`
- `presentationGroups`
- `operationalStatusSet`
- `relationships`
- `searchModel`
- `surfaceModel`
- `actionModel`
- `complianceModel`
- `generationModel`
- `migrationModel`

This keeps existing automation honest while giving the governed model room to
be complete.

## Definition Status Vs Managed Record Lifecycle

Definition-version status describes the lifecycle of the entity definition
itself.

Examples:

- a definition draft
- the active definition version
- a superseded definition version
- an archived definition version

Managed-record system lifecycle describes the records created from that
definition.

Examples:

- an active organization record
- an archived organization record
- a pending deletion organization record
- a deleted organization record
- a cleanup-failed organization record

These are separate catalogs because they govern different things.

| Catalog | Describes | Example values |
| --- | --- | --- |
| Definition-version status | The definition artifact/version. | `draft`, `active`, `superseded`, `archived` |
| Managed-record system lifecycle | A real managed entity record. | `active`, `archived`, `pending_deletion`, `deleted`, `pending_cleanup`, `cleanup_failed` |

The same word, such as `active` or `archived`, can appear in both catalogs, but
it must be clear whether it refers to the definition version or a managed
record.

## Candidate Schema In Plain English

The governed entity definition is made of required sections. Every entity
should have every section, even when the section says `none`, `not_applicable`,
or uses an empty array.

This shape is now ready to be used as the basis for formal schema/catalog/
validation planning. It does not need another full human line-by-line discovery
review before that next step.

Top-level shape:

| Section | Plain meaning |
| --- | --- |
| `entityIdentity` | What this entity is, what it is called, why it exists, and which feature/layer owns it. |
| `sourceAuthority` | What source wins today, what should win later, and how repo artifacts move to persistent truth. |
| `evidenceRegistry` | The list of proof/source records that other sections can reference. |
| `attributes` | The governed attributes/fields that describe records of this entity. |
| `presentationGroups` | Reusable display groups for placed attributes. |
| `operationalStatusSet` | Business/workflow statuses for records of this entity. |
| `relationships` | Meaningful links to other entities, including parent, child, and domain relationships. |
| `searchModel` | Entity-wide search, filter, sort, facet, and index posture. |
| `surfaceModel` | Where the entity appears in the app and which design-system surfaces it can use. |
| `actionModel` | The actions that can happen to records or to the definition itself. |
| `complianceModel` | Privacy, security, audit, retention, delete, export, cleanup, legal-hold, and encryption posture. |
| `generationModel` | What this definition is allowed to generate or drive. |
| `migrationModel` | How existing repo/source artifacts migrate into persistent entity-definition truth. |

The core attribute shape:

| Attribute concern | Plain meaning |
| --- | --- |
| key and labels | Stable key plus translatable user-facing text. |
| category | What kind of fact this is: identity, core, metadata, lifecycle, relationship, evidence, and so on. |
| type and cardinality | What value it holds, and whether it is single or multiple. |
| requiredness | Whether the value is required. |
| system-managed posture | Whether humans/clients can supply the value directly. |
| mutability | Who or what can change it, and when. |
| privacy/security | Whether the value is PII, sensitive, internal, restricted, or classified. |
| validation | Which rules apply, with message keys and fallback copy. |
| options | Where selectable choices come from. |
| search | Whether and how the attribute participates in search/filter/sort. |
| placements | Where the attribute appears in approved UI surfaces. |
| source/evidence | What proves or explains where the value comes from. |

The important modeling rule:

Attributes describe facts. Placements describe where those facts appear.
Relationships describe entity-to-entity connections. Actions describe what can
happen. Authorization later decides who is allowed to do or see those things.

Placement keys are governed by the selected page/template contract. They should
not be treated as arbitrary strings:

| Placement field | Source of allowed values |
| --- | --- |
| `surfaceKey` | selected design-system/page-template contract |
| `surfaceVariantKey` | variants allowed for the selected surface |
| `regionKey` | regions allowed for the selected surface/variant |
| `subRegionKey` | sub-regions allowed for the selected surface/variant/region, or `none` |
| `elementKey` | elements allowed for the selected surface/variant/region/sub-region and compatible with the attribute |

This means each page template owns its own enum-like contract for placement
values and allowed combinations.
