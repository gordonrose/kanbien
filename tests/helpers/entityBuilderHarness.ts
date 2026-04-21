import type { Express } from "express";
import { createRequireRootSession } from "../../src/lib/auth/middleware";
import { createEntityBuilderService } from "../../src/features/entityBuilder/domain/service";
import type {
  EntityDefinitionAttributeInput,
  EntityDefinitionListInput,
  EntityDefinitionListResultData,
  EntityDefinitionVersionData,
  ExportEntityDefinitionsInput,
  UpdateEntityDefinitionVersionInput,
} from "../../src/features/entityBuilder/domain/types";
import type { EntityBuilderRepository } from "../../src/features/entityBuilder/persistence/repository";
import type { CreateEntityDefinitionVersionRecordInput } from "../../src/features/entityBuilder/persistence/types";
import { createEntityBuilderRouter } from "../../src/features/entityBuilder/transport/router";
import type { RootAuthIntegrationHarness } from "../harness/rootAuth/integrationHarness";
import { createEntityBuilderId } from "../../src/features/entityBuilder/domain/helpers";

interface InMemoryLineageRecord {
  entityDefinitionId: string;
  entityKey: string;
  entityName: string;
  description: string;
  currentVersionId: string | null;
  status: "draft" | "active" | "superseded" | "archived";
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}

function cloneVersion(version: EntityDefinitionVersionData): EntityDefinitionVersionData {
  return {
    ...version,
    createdAt: new Date(version.createdAt),
    updatedAt: new Date(version.updatedAt),
    activatedAt: version.activatedAt ? new Date(version.activatedAt) : null,
    supersededAt: version.supersededAt ? new Date(version.supersededAt) : null,
    archivedAt: version.archivedAt ? new Date(version.archivedAt) : null,
    attributes: version.attributes.map((attribute) => ({
      ...attribute,
      createdAt: new Date(attribute.createdAt),
      updatedAt: new Date(attribute.updatedAt),
      sourceAttributeKeys: [...attribute.sourceAttributeKeys],
      validationRules: attribute.validationRules.map((rule) => ({
        ...rule,
        createdAt: new Date(rule.createdAt),
        updatedAt: new Date(rule.updatedAt),
      })),
      options: attribute.options.map((option) => ({
        ...option,
        createdAt: new Date(option.createdAt),
        updatedAt: new Date(option.updatedAt),
      })),
    })),
  };
}

function cloneLineage(lineage: InMemoryLineageRecord): InMemoryLineageRecord {
  return {
    ...lineage,
    createdAt: new Date(lineage.createdAt),
    updatedAt: new Date(lineage.updatedAt),
    archivedAt: lineage.archivedAt ? new Date(lineage.archivedAt) : null,
  };
}

function buildVersionFromRecordInput(
  input: CreateEntityDefinitionVersionRecordInput,
  versionNumber: number,
): EntityDefinitionVersionData {
  const now = new Date("2026-04-19T12:00:00.000Z");

  return {
    entityDefinitionId: input.entityDefinitionId,
    entityKey: input.entityKey,
    entityName: input.entityName,
    description: input.description,
    currentVersionId: input.status === "active" ? input.entityDefinitionVersionId : null,
    lineageStatus: input.status,
    entityDefinitionVersionId: input.entityDefinitionVersionId,
    versionNumber,
    status: input.status,
    supersedesVersionId: input.supersedesVersionId,
    createdAt: now,
    updatedAt: now,
    activatedAt: input.status === "active" ? now : null,
    supersededAt: null,
    archivedAt: null,
    attributes: input.attributes.map((attribute) => ({
      entityDefinitionAttributeId: createEntityBuilderId(),
      attributeKey: attribute.attributeKey,
      attributeKind: attribute.attributeKind,
      attributeType: attribute.attributeType,
      valueCardinality: attribute.valueCardinality,
      label: attribute.label,
      description: attribute.description,
      helpText: attribute.helpText?.trim() ?? null,
      placeholderText: attribute.placeholderText?.trim() ?? null,
      formFacing: attribute.formFacing,
      defaultFormPatternKey: attribute.defaultFormPatternKey ?? null,
      optionsMode: attribute.optionsMode,
      optionsCatalogKey: attribute.optionsCatalogKey ?? null,
      derivationNote: attribute.derivationNote ?? null,
      sourceAttributeKeys: [...attribute.sourceAttributeKeys],
      displayOrder: attribute.displayOrder,
      createdAt: now,
      updatedAt: now,
      validationRules: attribute.validationRules.map((rule) => ({
        entityDefinitionAttributeValidationRuleId: createEntityBuilderId(),
        ruleKey: rule.ruleKey,
        ruleArgumentType: rule.ruleArgumentType,
        ruleArgumentString: rule.ruleArgumentString ?? null,
        ruleArgumentInteger: rule.ruleArgumentInteger ?? null,
        ruleArgumentDecimal: rule.ruleArgumentDecimal ?? null,
        ruleArgumentBoolean: rule.ruleArgumentBoolean ?? null,
        errorMessage: rule.errorMessage ?? null,
        displayOrder: rule.displayOrder,
        createdAt: now,
        updatedAt: now,
      })),
      options: attribute.options.map((option) => ({
        entityDefinitionAttributeOptionId: createEntityBuilderId(),
        optionKey: option.optionKey,
        label: option.label,
        description: option.description ?? null,
        displayOrder: option.displayOrder,
        createdAt: now,
        updatedAt: now,
      })),
    })),
  };
}

export function createEntityAttributeInput(
  overrides: Partial<EntityDefinitionAttributeInput> = {},
): EntityDefinitionAttributeInput {
  return {
    attributeKey: "support_email",
    attributeKind: "persisted",
    attributeType: "email",
    valueCardinality: "single",
    label: "Support Email",
    description: "Support email address.",
    helpText: "Used in governed forms.",
    placeholderText: "support@example.com",
    formFacing: true,
    defaultFormPatternKey: "form-template.text-input",
    optionsMode: "none",
    sourceAttributeKeys: [],
    displayOrder: 0,
    validationRules: [],
    options: [],
    ...overrides,
  };
}

export function createEntityDefinitionVersionRecord(
  overrides: Partial<EntityDefinitionVersionData> = {},
): EntityDefinitionVersionData {
  const now = new Date("2026-04-19T12:00:00.000Z");
  const attribute = createEntityAttributeInput();
  return {
    entityDefinitionId: "11111111-1111-4111-8111-111111111111",
    entityKey: "customer_profile",
    entityName: "Customer Profile",
    description: "Customer profile durable truth.",
    currentVersionId: "22222222-2222-4222-8222-222222222222",
    lineageStatus: "active",
    entityDefinitionVersionId: "22222222-2222-4222-8222-222222222222",
    versionNumber: 1,
    status: "active",
    supersedesVersionId: null,
    createdAt: now,
    updatedAt: now,
    activatedAt: now,
    supersededAt: null,
    archivedAt: null,
    attributes: [
      {
        entityDefinitionAttributeId: "33333333-3333-4333-8333-333333333333",
        attributeKey: attribute.attributeKey,
        attributeKind: attribute.attributeKind,
        attributeType: attribute.attributeType,
        valueCardinality: attribute.valueCardinality,
        label: attribute.label,
        description: attribute.description,
        helpText: attribute.helpText ?? null,
        placeholderText: attribute.placeholderText ?? null,
        formFacing: attribute.formFacing,
        defaultFormPatternKey: attribute.defaultFormPatternKey ?? null,
        optionsMode: attribute.optionsMode,
        optionsCatalogKey: attribute.optionsCatalogKey ?? null,
        derivationNote: attribute.derivationNote ?? null,
        sourceAttributeKeys: [...attribute.sourceAttributeKeys],
        displayOrder: attribute.displayOrder,
        createdAt: now,
        updatedAt: now,
        validationRules: [],
        options: [],
      },
    ],
    ...overrides,
  };
}

export function createInMemoryEntityBuilderRepository(
  seed: EntityDefinitionVersionData[] = [],
): EntityBuilderRepository & {
  lineages: Map<string, InMemoryLineageRecord>;
  versions: Map<string, EntityDefinitionVersionData>;
} {
  const lineages = new Map<string, InMemoryLineageRecord>();
  const versions = new Map<string, EntityDefinitionVersionData>();

  for (const version of seed) {
    versions.set(version.entityDefinitionVersionId, cloneVersion(version));
    lineages.set(
      version.entityKey,
      {
        entityDefinitionId: version.entityDefinitionId,
        entityKey: version.entityKey,
        entityName: version.entityName,
        description: version.description,
        currentVersionId: version.currentVersionId,
        status: version.lineageStatus,
        createdAt: version.createdAt,
        updatedAt: version.updatedAt,
        archivedAt: version.archivedAt,
      },
    );
  }

  function syncLineageFromVersion(version: EntityDefinitionVersionData): void {
    const current = lineages.get(version.entityKey);
    const baseCreatedAt = current?.createdAt ?? version.createdAt;
    lineages.set(version.entityKey, {
      entityDefinitionId: version.entityDefinitionId,
      entityKey: version.entityKey,
      entityName: version.entityName,
      description: version.description,
      currentVersionId: version.currentVersionId,
      status: version.lineageStatus,
      createdAt: baseCreatedAt,
      updatedAt: version.updatedAt,
      archivedAt: version.archivedAt,
    });
  }

  return {
    lineages,
    versions,
    async findLineageByEntityKey(entityKey) {
      const found = lineages.get(entityKey.trim().toLowerCase()) ?? null;
      return found
        ? {
            entity_definition_id: found.entityDefinitionId,
            entity_key: found.entityKey,
            entity_name: found.entityName,
            description: found.description,
            current_version_id: found.currentVersionId,
            status: found.status,
            created_at: new Date(found.createdAt),
            updated_at: new Date(found.updatedAt),
            archived_at: found.archivedAt ? new Date(found.archivedAt) : null,
          }
        : null;
    },
    async findCurrentVersionByEntityKey(entityKey) {
      const lineage = lineages.get(entityKey.trim().toLowerCase());
      if (!lineage?.currentVersionId) {
        return null;
      }
      const version = versions.get(lineage.currentVersionId);
      return version ? cloneVersion(version) : null;
    },
    async findVersionById(entityDefinitionVersionId) {
      const version = versions.get(entityDefinitionVersionId) ?? null;
      return version ? cloneVersion(version) : null;
    },
    async listLineages(input: EntityDefinitionListInput): Promise<EntityDefinitionListResultData> {
      const filtered = [...lineages.values()].filter((lineage) => {
        if (
          input.filters.entityKeyPrefix &&
          !lineage.entityKey.startsWith(input.filters.entityKeyPrefix.toLowerCase())
        ) {
          return false;
        }
        if (
          input.filters.entityNamePrefix &&
          !lineage.entityName.toLowerCase().startsWith(input.filters.entityNamePrefix.toLowerCase())
        ) {
          return false;
        }
        if (input.filters.status && lineage.status !== input.filters.status) {
          return false;
        }
        return true;
      });

      const sorted = [...filtered].sort((left, right) => {
        const factor = input.orderDirection === "asc" ? 1 : -1;
        const leftValue =
          input.orderBy === "entityKey"
            ? left.entityKey
            : input.orderBy === "entityName"
              ? left.entityName
              : left.updatedAt.getTime();
        const rightValue =
          input.orderBy === "entityKey"
            ? right.entityKey
            : input.orderBy === "entityName"
              ? right.entityName
              : right.updatedAt.getTime();

        if (leftValue < rightValue) {
          return -1 * factor;
        }
        if (leftValue > rightValue) {
          return 1 * factor;
        }
        return left.entityKey.localeCompare(right.entityKey) * factor;
      });

      const offset = (input.page - 1) * input.pageSize;
      return {
        items: sorted.slice(offset, offset + input.pageSize).map((lineage) => {
          const currentVersion = lineage.currentVersionId
            ? versions.get(lineage.currentVersionId) ?? null
            : null;
          return {
            entityDefinitionId: lineage.entityDefinitionId,
            entityKey: lineage.entityKey,
            entityName: lineage.entityName,
            status: lineage.status,
            currentVersionId: lineage.currentVersionId,
            currentVersionNumber: currentVersion?.versionNumber ?? null,
            updatedAt: new Date(lineage.updatedAt),
            exportable: lineage.status === "active" && lineage.currentVersionId !== null,
          };
        }),
        totalMatchingRecords: filtered.length,
      };
    },
    async createLineageWithVersion(input: CreateEntityDefinitionVersionRecordInput) {
      const version = buildVersionFromRecordInput(input, 1);
      versions.set(version.entityDefinitionVersionId, cloneVersion(version));
      syncLineageFromVersion(version);
      return cloneVersion(version);
    },
    async createVersionForExistingLineage(input: CreateEntityDefinitionVersionRecordInput) {
      const existingVersions = [...versions.values()].filter(
        (item) => item.entityDefinitionId === input.entityDefinitionId,
      );
      const currentLineage = lineages.get(input.entityKey);
      const nextVersionNumber =
        Math.max(0, ...existingVersions.map((item) => item.versionNumber)) + 1;
      const version = buildVersionFromRecordInput(input, nextVersionNumber);
      version.currentVersionId = currentLineage?.currentVersionId ?? null;
      version.lineageStatus = currentLineage?.status ?? version.lineageStatus;
      versions.set(version.entityDefinitionVersionId, cloneVersion(version));
      if (currentLineage) {
        lineages.set(input.entityKey, {
          ...currentLineage,
          entityName: input.entityName,
          description: input.description,
          updatedAt: version.updatedAt,
        });
      } else {
        syncLineageFromVersion(version);
      }
      return cloneVersion(version);
    },
    async updateDraftVersion(input: UpdateEntityDefinitionVersionInput) {
      const current = versions.get(input.entityDefinitionVersionId);
      if (!current) {
        throw new Error("version_not_found");
      }
      const next = cloneVersion({
        ...current,
        entityName: input.entityName ?? current.entityName,
        description: input.description ?? current.description,
        updatedAt: new Date("2026-04-19T12:15:00.000Z"),
        attributes: input.attributes
          ? buildVersionFromRecordInput(
              {
                entityDefinitionId: current.entityDefinitionId,
                entityDefinitionVersionId: current.entityDefinitionVersionId,
                entityKey: current.entityKey,
                entityName: input.entityName ?? current.entityName,
                description: input.description ?? current.description,
                status: "draft",
                supersedesVersionId: current.supersedesVersionId,
                attributes: input.attributes,
              },
              current.versionNumber,
            ).attributes
          : current.attributes,
      });
      versions.set(next.entityDefinitionVersionId, cloneVersion(next));
      const lineage = lineages.get(next.entityKey);
      if (lineage) {
        lineages.set(next.entityKey, {
          ...lineage,
          entityName: next.entityName,
          description: next.description,
          updatedAt: next.updatedAt,
        });
      } else {
        syncLineageFromVersion(next);
      }
      return cloneVersion(next);
    },
    async replaceVersionStatusAndCurrent(entityDefinitionVersionId, status) {
      const target = versions.get(entityDefinitionVersionId);
      if (!target) {
        throw new Error("version_not_found");
      }
      const now = new Date("2026-04-19T12:30:00.000Z");

      if (status === "active") {
        for (const existing of versions.values()) {
          if (
            existing.entityDefinitionId === target.entityDefinitionId &&
            existing.entityDefinitionVersionId !== target.entityDefinitionVersionId &&
            existing.status === "active"
          ) {
            const superseded = cloneVersion({
              ...existing,
              status: "superseded",
              updatedAt: now,
              supersededAt: now,
              currentVersionId: target.entityDefinitionVersionId,
            });
            versions.set(superseded.entityDefinitionVersionId, superseded);
          }
        }
      }

      const next = cloneVersion({
        ...target,
        status,
        lineageStatus: status === "active" ? "active" : target.currentVersionId ? target.lineageStatus : "draft",
        currentVersionId: status === "active" ? target.entityDefinitionVersionId : target.currentVersionId,
        updatedAt: now,
        activatedAt: status === "active" ? target.activatedAt ?? now : null,
      });
      versions.set(next.entityDefinitionVersionId, cloneVersion(next));

      const lineage = lineages.get(next.entityKey);
      if (lineage) {
        lineages.set(next.entityKey, {
          ...lineage,
          entityName: next.entityName,
          description: next.description,
          currentVersionId: status === "active" ? next.entityDefinitionVersionId : lineage.currentVersionId,
          status:
            status === "active"
              ? "active"
              : lineage.currentVersionId === null
                ? "draft"
                : lineage.status,
          updatedAt: now,
        });
      }

      return cloneVersion(next);
    },
    async findExportVersions(input: ExportEntityDefinitionsInput) {
      if (input.entityDefinitionVersionIds?.length) {
        return input.entityDefinitionVersionIds
          .map((id) => versions.get(id) ?? null)
          .filter((item): item is EntityDefinitionVersionData => Boolean(item))
          .map(cloneVersion);
      }

      if (input.entityKeys?.length) {
        return input.entityKeys
          .map((key) => {
            const lineage = lineages.get(key);
            return lineage?.currentVersionId ? versions.get(lineage.currentVersionId) ?? null : null;
          })
          .filter((item): item is EntityDefinitionVersionData => Boolean(item))
          .map(cloneVersion);
      }

      return [...lineages.values()]
        .filter((lineage) => lineage.status === "active" && lineage.currentVersionId !== null)
        .map((lineage) => versions.get(lineage.currentVersionId!) ?? null)
        .filter((item): item is EntityDefinitionVersionData => Boolean(item))
        .map(cloneVersion);
    },
  };
}

export function mountEntityBuilderFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  repository: EntityBuilderRepository,
): void {
  const requireRootSession = createRequireRootSession(harness.authRepository, {
    allowBrowserCookie: true,
  });
  const service = createEntityBuilderService(repository);

  app.use(
    "/v1/entity-definitions",
    requireRootSession,
    createEntityBuilderRouter(
      service,
      {
        hasCapability: async ({ rootUserId, capabilityKey }) =>
          harness.getRootUserCapabilities(rootUserId).includes(capabilityKey),
      },
      harness.platformSecurityRepository,
    ),
  );
}
