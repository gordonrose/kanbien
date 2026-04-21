import { describe, expect, it } from "vitest";
import { createEntityBuilderService } from "../../../src/features/entityBuilder/domain/service";
import { EntityDefinitionValidationFailedError } from "../../../src/features/entityBuilder/contract/errors";
import type { EntityBuilderRepository } from "../../../src/features/entityBuilder/persistence/repository";
import type {
  CreateEntityDefinitionVersionInput,
  EntityDefinitionListInput,
  EntityDefinitionListResultData,
  EntityDefinitionVersionData,
  ExportEntityDefinitionsInput,
  UpdateEntityDefinitionVersionInput,
} from "../../../src/features/entityBuilder/domain/types";

function createVersion(overrides: Partial<EntityDefinitionVersionData> = {}): EntityDefinitionVersionData {
  const now = new Date("2026-04-19T12:00:00.000Z");

  return {
    entityDefinitionId: "11111111-1111-4111-8111-111111111111",
    entityKey: "customer_profile",
    entityName: "Customer Profile",
    description: "Customer profile durable truth.",
    currentVersionId: null,
    lineageStatus: "draft",
    entityDefinitionVersionId: "22222222-2222-4222-8222-222222222222",
    versionNumber: 1,
    status: "draft",
    supersedesVersionId: null,
    createdAt: now,
    updatedAt: now,
    activatedAt: null,
    supersededAt: null,
    archivedAt: null,
    attributes: [],
    ...overrides,
  };
}

function createRepository(overrides: Partial<EntityBuilderRepository> = {}): EntityBuilderRepository {
  return {
    async findLineageByEntityKey() {
      return null;
    },
    async findCurrentVersionByEntityKey() {
      return null;
    },
    async findVersionById() {
      return null;
    },
    async listLineages(_input: EntityDefinitionListInput): Promise<EntityDefinitionListResultData> {
      return {
        items: [],
        totalMatchingRecords: 0,
      };
    },
    async createLineageWithVersion(_input: CreateEntityDefinitionVersionInput & { entityDefinitionId: string; entityDefinitionVersionId: string }) {
      return createVersion();
    },
    async createVersionForExistingLineage(
      _input: CreateEntityDefinitionVersionInput & {
        entityDefinitionId: string;
        entityDefinitionVersionId: string;
        supersedesVersionId: string | null;
      },
    ) {
      return createVersion();
    },
    async updateDraftVersion(_input: UpdateEntityDefinitionVersionInput) {
      return createVersion();
    },
    async replaceVersionStatusAndCurrent(entityDefinitionVersionId, status) {
      return createVersion({
        entityDefinitionVersionId,
        status,
        lineageStatus: status,
        currentVersionId: status === "active" ? entityDefinitionVersionId : null,
        activatedAt: status === "active" ? new Date("2026-04-19T12:05:00.000Z") : null,
      });
    },
    async findExportVersions(_input: ExportEntityDefinitionsInput) {
      return [];
    },
    ...overrides,
  };
}

describe("entity builder service", () => {
  it("TC-ENTITY-BUILDER-UNIT-001 rejects activation when the created version is not activation-ready", async () => {
    let replaceCalls = 0;
    const repository = createRepository({
      async createLineageWithVersion() {
        return createVersion({
          attributes: [],
        });
      },
      async replaceVersionStatusAndCurrent(entityDefinitionVersionId, status) {
        replaceCalls += 1;
        return createVersion({
          entityDefinitionVersionId,
          status,
        });
      },
    });
    const service = createEntityBuilderService(repository);

    await expect(
      service.createEntityDefinitionVersion({
        entityKey: "customer_profile",
        entityName: "Customer Profile",
        description: "Customer profile durable truth.",
        status: "active",
        attributes: [],
      }),
    ).rejects.toBeInstanceOf(EntityDefinitionValidationFailedError);

    expect(replaceCalls).toBe(0);
  });

  it("TC-ENTITY-BUILDER-UNIT-002 validates enum attributes against options posture and pattern compatibility", async () => {
    const repository = createRepository({
      async findVersionById() {
        return createVersion({
          attributes: [
            {
              entityDefinitionAttributeId: "33333333-3333-4333-8333-333333333333",
              attributeKey: "status",
              attributeKind: "persisted",
              attributeType: "enum",
              valueCardinality: "single",
              label: "Status",
              description: "Current lifecycle status.",
              helpText: null,
              placeholderText: null,
              formFacing: true,
              defaultFormPatternKey: "drawer-select.multi-select",
              optionsMode: "none",
              optionsCatalogKey: null,
              derivationNote: null,
              sourceAttributeKeys: [],
              displayOrder: 0,
              createdAt: new Date("2026-04-19T12:00:00.000Z"),
              updatedAt: new Date("2026-04-19T12:00:00.000Z"),
              validationRules: [],
              options: [],
            },
          ],
        });
      },
    });
    const service = createEntityBuilderService(repository);

    const result = await service.validateEntityDefinitionVersion(
      "22222222-2222-4222-8222-222222222222",
    );

    expect(result.passFailState).toBe("fail");
    expect(result.blockingIssues.map((issue) => issue.reason)).toEqual(
      expect.arrayContaining(["missing_enum_options", "incompatible_form_pattern"]),
    );
  });

  it("TC-ENTITY-BUILDER-UNIT-003 exports effective type defaults without materializing them on the stored attribute", async () => {
    const repository = createRepository({
      async findExportVersions() {
        return [
          createVersion({
            status: "active",
            lineageStatus: "active",
            currentVersionId: "22222222-2222-4222-8222-222222222222",
            activatedAt: new Date("2026-04-19T12:10:00.000Z"),
            attributes: [
              {
                entityDefinitionAttributeId: "44444444-4444-4444-8444-444444444444",
                attributeKey: "support_email",
                attributeKind: "persisted",
                attributeType: "email",
                valueCardinality: "single",
                label: "Support Email",
                description: "Support email address.",
                helpText: "Used in governed support forms.",
                placeholderText: "support@example.com",
                formFacing: true,
                defaultFormPatternKey: "form-template.text-input",
                optionsMode: "none",
                optionsCatalogKey: null,
                derivationNote: null,
                sourceAttributeKeys: [],
                displayOrder: 0,
                createdAt: new Date("2026-04-19T12:00:00.000Z"),
                updatedAt: new Date("2026-04-19T12:00:00.000Z"),
                validationRules: [],
                options: [],
              },
            ],
          }),
        ];
      },
    });
    const service = createEntityBuilderService(repository);

    const exported = await service.exportEntityDefinitionSnapshot({
      entityKeys: ["customer_profile"],
    });

    expect(exported.exportFormatVersion).toBe(1);
    expect(exported.items).toHaveLength(1);
    expect(exported.items[0]?.attributes[0]).toMatchObject({
      attributeKey: "support_email",
      helpText: "Used in governed support forms.",
      placeholderText: "support@example.com",
    });
    expect(exported.items[0]?.attributes[0]?.effectiveValidationRules).toEqual([
      {
        ruleKey: "type_format",
        argumentType: "string",
        stringValue: "email",
        integerValue: null,
        decimalValue: null,
        booleanValue: null,
        errorMessage: null,
      },
    ]);
  });
});
