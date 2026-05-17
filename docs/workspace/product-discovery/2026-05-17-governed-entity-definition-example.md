# Governed Entity Definition Example

Planning status:

- `illustrative-example-for-draft-v1-canonical-model`
- Companion to
  `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-model.md`
  and
  `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-attribute-reference.md`
- Schema formalization companion:
  `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-schema-formalization.md`
- This is not a real Organization migration.
- This example is intentionally incomplete as implementation authority and must
  not be used as source truth for routes, persistence, permissions, generated
  UI, docs, or tests.

## Purpose

This example shows how the draft v1 canonical governed entity definition shape
might look when filled in with explicit sections, defaults, and a small set of
representative attributes.

The example uses `organization` because it is easy to reason about, but the
values below are illustrative only.

## Example Definition

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
    "owningFeaturePosture": "planned",
    "owningLayer": "feature",
    "entityFamilyKey": "organization",
    "managementScope": "tenant",
    "definitionVersion": 1
  },
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
  },
  "evidenceRegistry": [
    {
      "evidenceKey": "organization-data-dictionary",
      "sourceType": "dataDictionary",
      "sourceLocationType": "repoArtifact",
      "repoPath": "docs/data-dictionary/organization.md",
      "targetPersistentRecord": {
        "entityKey": "dataDictionaryEntity",
        "recordKey": "organization"
      },
      "transitionPosture": "repoPrimaryPersistentPlanned",
      "proofStatement": "Illustrative link to the current Organization data dictionary planning artifact."
    }
  ],
  "attributes": [
    {
      "attributeKey": "organizationId",
      "labelKey": "entity.organization.attribute.organizationId.label",
      "labelFallback": "Organization ID",
      "descriptionKey": "entity.organization.attribute.organizationId.description",
      "descriptionFallback": "Stable system identifier for the organization.",
      "category": "identity",
      "attributeType": "uuid",
      "valueCardinality": "single",
      "itemLimits": {
        "minItems": "notApplicable",
        "maxItems": "notApplicable"
      },
      "required": true,
      "systemManaged": true,
      "mutability": "immutable",
      "privacyClassification": "none",
      "sensitivePrivacyCategory": "none",
      "securityClassification": "internal",
      "securityClassificationLevel": "none",
      "validationRules": [
        {
          "ruleKey": "uuidFormat",
          "argumentType": "none",
          "argumentValue": null,
          "messageKey": "validation.uuidFormat",
          "messageFallback": "Enter a valid identifier."
        }
      ],
      "optionsMode": "none",
      "options": [],
      "relationship": {
        "relationshipKey": "none"
      },
      "search": {
        "searchable": true,
        "operators": ["exact"],
        "storageModel": "scalar",
        "indexPosture": "required"
      },
      "placements": [],
      "evidenceKeys": ["organization-data-dictionary"]
    },
    {
      "attributeKey": "name",
      "labelKey": "entity.organization.attribute.name.label",
      "labelFallback": "Name",
      "descriptionKey": "entity.organization.attribute.name.description",
      "descriptionFallback": "Human-facing name used to identify the organization in lists, forms, drawers, reports, and related records.",
      "category": "identity",
      "attributeType": "string",
      "valueCardinality": "single",
      "itemLimits": {
        "minItems": "notApplicable",
        "maxItems": "notApplicable"
      },
      "required": true,
      "systemManaged": false,
      "mutability": "updateable",
      "privacyClassification": "none",
      "sensitivePrivacyCategory": "none",
      "securityClassification": "internal",
      "securityClassificationLevel": "none",
      "validationRules": [
        {
          "ruleKey": "trim",
          "argumentType": "none",
          "argumentValue": null,
          "messageKey": "validation.trim",
          "messageFallback": "Remove extra spaces at the beginning or end."
        },
        {
          "ruleKey": "maxLength",
          "argumentType": "integer",
          "argumentValue": 160,
          "messageKey": "validation.maxLength",
          "messageFallback": "Must be 160 characters or fewer."
        }
      ],
      "optionsMode": "none",
      "options": [],
      "relationship": {
        "relationshipKey": "none"
      },
      "search": {
        "searchable": true,
        "operators": ["exact", "prefix", "sort"],
        "storageModel": "normalizedScalar",
        "indexPosture": "required"
      },
      "placements": [
        {
          "surfaceKey": "listRow",
          "surfaceVariantKey": "recordManagementListCentric",
          "regionKey": "primaryText",
          "groupKey": "none",
          "displayOrder": 10,
          "elementKey": "readonlyText",
          "interactionMode": "readOnly",
          "visibilityMode": "defaultVisible"
        },
        {
          "surfaceKey": "listDrawer",
          "surfaceVariantKey": "recordManagementListCentric",
          "regionKey": "drawerSection",
          "groupKey": "identity",
          "displayOrder": 10,
          "elementKey": "readonlyText",
          "interactionMode": "readOnly",
          "visibilityMode": "defaultVisible"
        },
        {
          "surfaceKey": "createForm",
          "surfaceVariantKey": "recordManagementListCentric",
          "regionKey": "formSection",
          "groupKey": "identity",
          "displayOrder": 10,
          "elementKey": "textInput",
          "interactionMode": "editable",
          "visibilityMode": "defaultVisible"
        }
      ],
      "evidenceKeys": ["organization-data-dictionary"]
    },
    {
      "attributeKey": "organizationType",
      "labelKey": "entity.organization.attribute.organizationType.label",
      "labelFallback": "Organization type",
      "descriptionKey": "entity.organization.attribute.organizationType.description",
      "descriptionFallback": "Business classification used to group and filter organizations.",
      "category": "core",
      "attributeType": "limitedEnum",
      "valueCardinality": "single",
      "itemLimits": {
        "minItems": "notApplicable",
        "maxItems": "notApplicable"
      },
      "required": true,
      "systemManaged": false,
      "mutability": "updateable",
      "privacyClassification": "none",
      "sensitivePrivacyCategory": "none",
      "securityClassification": "internal",
      "securityClassificationLevel": "none",
      "validationRules": [
        {
          "ruleKey": "allowedOptions",
          "argumentType": "none",
          "argumentValue": null,
          "messageKey": "validation.allowedOptions",
          "messageFallback": "Choose one of the allowed options."
        }
      ],
      "optionsMode": "inline",
      "options": [
        {
          "optionKey": "customer",
          "labelKey": "entity.organization.type.customer.label",
          "labelFallback": "Customer",
          "descriptionKey": "entity.organization.type.customer.description",
          "descriptionFallback": "An organization that buys or uses the product.",
          "displayOrder": 10
        },
        {
          "optionKey": "partner",
          "labelKey": "entity.organization.type.partner.label",
          "labelFallback": "Partner",
          "descriptionKey": "entity.organization.type.partner.description",
          "descriptionFallback": "An organization that works with the business but is not the primary customer.",
          "displayOrder": 20
        }
      ],
      "relationship": {
        "relationshipKey": "none"
      },
      "search": {
        "searchable": true,
        "operators": ["exact", "facet"],
        "storageModel": "scalar",
        "indexPosture": "required"
      },
      "placements": [
        {
          "surfaceKey": "listRow",
          "surfaceVariantKey": "recordManagementListCentric",
          "regionKey": "badgeSlot",
          "groupKey": "none",
          "displayOrder": 20,
          "elementKey": "statusBadge",
          "interactionMode": "readOnly",
          "visibilityMode": "defaultVisible"
        },
        {
          "surfaceKey": "createForm",
          "surfaceVariantKey": "recordManagementListCentric",
          "regionKey": "formSection",
          "groupKey": "identity",
          "displayOrder": 20,
          "elementKey": "simpleSelect",
          "interactionMode": "editable",
          "visibilityMode": "defaultVisible"
        }
      ],
      "evidenceKeys": ["organization-data-dictionary"]
    },
    {
      "attributeKey": "systemLifecycleStatus",
      "labelKey": "entity.organization.attribute.systemLifecycleStatus.label",
      "labelFallback": "System status",
      "descriptionKey": "entity.organization.attribute.systemLifecycleStatus.description",
      "descriptionFallback": "Platform lifecycle state controlling visibility, retention, deletion, cleanup, and historical access.",
      "category": "systemLifecycle",
      "attributeType": "limitedEnum",
      "valueCardinality": "single",
      "itemLimits": {
        "minItems": "notApplicable",
        "maxItems": "notApplicable"
      },
      "required": true,
      "systemManaged": true,
      "mutability": "lifecycleManaged",
      "privacyClassification": "none",
      "sensitivePrivacyCategory": "none",
      "securityClassification": "internal",
      "securityClassificationLevel": "none",
      "validationRules": [
        {
          "ruleKey": "allowedOptions",
          "argumentType": "none",
          "argumentValue": null,
          "messageKey": "validation.allowedOptions",
          "messageFallback": "Choose one of the allowed options."
        }
      ],
      "optionsMode": "catalogReference",
      "optionsCatalogKey": "systemLifecycleStatus",
      "options": [],
      "relationship": {
        "relationshipKey": "none"
      },
      "search": {
        "searchable": true,
        "operators": ["exact", "facet"],
        "storageModel": "scalar",
        "indexPosture": "required"
      },
      "placements": [
        {
          "surfaceKey": "listRow",
          "surfaceVariantKey": "recordManagementListCentric",
          "regionKey": "statusBadge",
          "groupKey": "none",
          "displayOrder": 30,
          "elementKey": "statusBadge",
          "interactionMode": "readOnly",
          "visibilityMode": "defaultVisible"
        }
      ],
      "evidenceKeys": ["organization-data-dictionary"]
    },
    {
      "attributeKey": "businessUnits",
      "labelKey": "entity.organization.attribute.businessUnits.label",
      "labelFallback": "Business units",
      "descriptionKey": "entity.organization.attribute.businessUnits.description",
      "descriptionFallback": "Business units that belong to this organization.",
      "category": "childRelation",
      "attributeType": "relationshipReference",
      "valueCardinality": "multiple",
      "itemLimits": {
        "minItems": "none",
        "maxItems": "none"
      },
      "required": false,
      "systemManaged": true,
      "mutability": "relationshipManaged",
      "privacyClassification": "none",
      "sensitivePrivacyCategory": "none",
      "securityClassification": "internal",
      "securityClassificationLevel": "none",
      "validationRules": [
        {
          "ruleKey": "relationshipBoundary",
          "argumentType": "none",
          "argumentValue": null,
          "messageKey": "validation.relationshipBoundary",
          "messageFallback": "Choose a related record within the allowed boundary."
        }
      ],
      "optionsMode": "relationshipSource",
      "relationshipOptionSource": {
        "targetEntityKey": "businessUnit",
        "relationshipRole": "businessUnits",
        "scope": "sameOrganization",
        "excludeSelf": false,
        "excludeDescendants": false,
        "valueAttributeKey": "businessUnitId",
        "labelAttributeKey": "name",
        "descriptionAttributeKey": "description",
        "subtitleAttributeKey": "none",
        "badgeAttributeKey": "systemLifecycleStatus"
      },
      "options": [],
      "relationship": {
        "relationshipKey": "businessUnits"
      },
      "search": {
        "searchable": false,
        "operators": [],
        "storageModel": "notSearchable",
        "indexPosture": "notApplicable"
      },
      "placements": [
        {
          "surfaceKey": "listDrawer",
          "surfaceVariantKey": "recordManagementListCentric",
          "regionKey": "relationshipPanel",
          "groupKey": "relationships",
          "displayOrder": 10,
          "elementKey": "relationshipList",
          "interactionMode": "readOnly",
          "visibilityMode": "defaultVisible"
        }
      ],
      "evidenceKeys": ["organization-data-dictionary"]
    }
  ],
  "presentationGroups": [
    {
      "groupKey": "identity",
      "labelKey": "entity.organization.group.identity.label",
      "labelFallback": "Identity",
      "descriptionKey": "entity.organization.group.identity.description",
      "descriptionFallback": "Fields that identify and classify the organization.",
      "displayOrder": 10
    },
    {
      "groupKey": "relationships",
      "labelKey": "entity.organization.group.relationships.label",
      "labelFallback": "Relationships",
      "descriptionKey": "entity.organization.group.relationships.description",
      "descriptionFallback": "Related records connected to this organization.",
      "displayOrder": 20
    }
  ],
  "operationalStatusSet": {
    "statusAttributeKey": "none",
    "statuses": []
  },
  "relationships": [
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
      "evidenceKeys": ["organization-data-dictionary"]
    }
  ],
  "searchModel": {
    "globalSearchEnabled": true,
    "globalSearchAttributeKeys": ["name"],
    "sortableAttributeKeys": ["name"],
    "defaultSort": {
      "attributeKey": "name",
      "direction": "asc"
    },
    "pinnedFilterAttributeKeys": ["organizationType", "systemLifecycleStatus"],
    "facetAttributeKeys": ["organizationType", "systemLifecycleStatus"],
    "searchStoragePosture": "database",
    "indexEvidenceKeys": []
  },
  "surfaceModel": {
    "managementPattern": "recordManagementListCentric",
    "enabledSurfaces": [
      {
        "surfaceKey": "listPage",
        "surfaceVariantKey": "recordManagementListCentric",
        "designSystemContractKey": "pendingDesignSystemSignoff",
        "enabled": true
      },
      {
        "surfaceKey": "listRow",
        "surfaceVariantKey": "recordManagementListCentric",
        "designSystemContractKey": "pendingDesignSystemSignoff",
        "enabled": true
      },
      {
        "surfaceKey": "listDrawer",
        "surfaceVariantKey": "recordManagementListCentric",
        "designSystemContractKey": "pendingDesignSystemSignoff",
        "enabled": true
      },
      {
        "surfaceKey": "createForm",
        "surfaceVariantKey": "recordManagementListCentric",
        "designSystemContractKey": "pendingDesignSystemSignoff",
        "enabled": true
      }
    ],
    "defaultSurfaceKey": "listPage",
    "overlayEligible": false,
    "designSystemContractKeys": ["pendingDesignSystemSignoff"],
    "surfaceEvidenceKeys": []
  },
  "actionModel": {
    "actions": [
      {
        "actionKey": "listRecord",
        "actionFamily": "managedRecord",
        "owningLayer": "feature",
        "ownerKey": "organizationCore",
        "labelKey": "entity.organization.action.listRecord.label",
        "labelFallback": "List organizations",
        "descriptionKey": "entity.organization.action.listRecord.description",
        "descriptionFallback": "Lists organizations available to the current actor and management scope.",
        "capabilityKey": "notYetMapped",
        "routeContractKey": "notYetMapped",
        "surfaceKeys": ["listPage"],
        "systemLifecycleTransition": "none",
        "operationalStatusTransition": "none",
        "compatibilityRisk": "none",
        "reviewRequirement": "none",
        "executionMode": "sync",
        "auditRequired": false,
        "evidenceRequired": false,
        "actionErrorModel": {
          "defaultErrorKey": "entity.organization.action.listRecord.failed",
          "defaultErrorFallback": "Organizations could not be listed.",
          "errors": [
            {
              "errorKey": "notAuthorized",
              "messageKey": "entity.organization.action.listRecord.notAuthorized",
              "messageFallback": "You are not allowed to view organizations.",
              "retryable": false,
              "auditRequired": true
            }
          ]
        }
      },
      {
        "actionKey": "addAttribute",
        "actionFamily": "definitionStructure",
        "owningLayer": "platform",
        "ownerKey": "entityDefinition",
        "labelKey": "entityDefinition.action.addAttribute.label",
        "labelFallback": "Add attribute",
        "descriptionKey": "entityDefinition.action.addAttribute.description",
        "descriptionFallback": "Adds a new attribute to a draft entity definition.",
        "capabilityKey": "notYetMapped",
        "routeContractKey": "notYetMapped",
        "surfaceKeys": ["entityDefinitionEditor"],
        "systemLifecycleTransition": "none",
        "operationalStatusTransition": "none",
        "compatibilityRisk": "medium",
        "reviewRequirement": "required",
        "executionMode": "sync",
        "auditRequired": true,
        "evidenceRequired": true,
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
  },
  "complianceModel": {
    "privacyImpact": "none",
    "sensitivePrivacyCategoriesPresent": [],
    "securityImpact": "internal",
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
  },
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
  },
  "migrationModel": {
    "migrationStatus": "notStarted",
    "currentSourcePosture": "repoArtifactsPrimary",
    "targetSourcePosture": "persistentEntityDefinitionPrimary",
    "currentArtifactKeys": ["organization-data-dictionary"],
    "targetPersistentRecordKey": "organization",
    "compatibilityChecksRequired": [
      "apiContractParity",
      "persistenceSchemaParity",
      "dataDictionaryParity",
      "permissionMappingParity",
      "featureManifestParity",
      "generatedDocParity",
      "runtimeBehaviorParity"
    ],
    "blockingIssues": [
      "illustrative-example-not-validated"
    ],
    "migrationEvidenceKeys": ["organization-data-dictionary"]
  }
}
```

## Gaps This Example Exposes

- The design-system contract keys are placeholders until entity management
  templates are built and signed off.
- `systemLifecycleStatus` uses a catalog reference that must be defined in the
  eventual option/status catalog.
- The example now uses `itemLimits`, but the final schema should still confirm
  whether string values such as `none` and `notApplicable` are the preferred
  way to express absent item limits.
- The example uses lowerCamel catalog values, while the implemented
  `entityBuilder` foundation uses snake_case persisted values for several
  catalogs. The final schema needs an explicit casing/compatibility rule.
- The example uses placement-scoped order, while the implemented builder
  currently stores one global attribute `displayOrder`. Migration should map
  existing global order into default placements.
- The example represents the richer target model. It is not compatible with
  current `entityBuilder` export format v1 without a planned v2/export
  successor.
