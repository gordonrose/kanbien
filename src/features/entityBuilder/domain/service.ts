import { createEntityDefinitionVersion } from "./createEntityDefinitionVersion";
import { exportEntityDefinitionSnapshot } from "./exportEntityDefinitionSnapshot";
import { getEntityDefinitionCurrent } from "./getEntityDefinitionCurrent";
import { getEntityDefinitionVersion } from "./getEntityDefinitionVersion";
import { listApprovedFormPatterns } from "./listApprovedFormPatterns";
import { listAttributeTypeCatalog } from "./listAttributeTypeCatalog";
import { listEntityDefinitions } from "./listEntityDefinitions";
import { toEntityDefinitionCurrent, toEntityDefinitionListResponse, toEntityDefinitionVersion, toValidationResponse } from "./presenters";
import { updateDraftEntityDefinitionVersion } from "./updateDraftEntityDefinitionVersion";
import { validateEntityDefinitionVersion } from "./validateEntityDefinitionVersion";
import type {
  CreateEntityDefinitionVersionInput,
  EntityDefinitionListInput,
  ExportEntityDefinitionsInput,
  GetEntityDefinitionCurrentInput,
  GetEntityDefinitionVersionInput,
  UpdateEntityDefinitionVersionInput,
} from "./types";
import type { EntityBuilderRepository } from "../persistence/repository";

export interface EntityBuilderService {
  createEntityDefinitionVersion(input: CreateEntityDefinitionVersionInput): Promise<ReturnType<typeof toEntityDefinitionVersion>>;
  updateDraftEntityDefinitionVersion(input: UpdateEntityDefinitionVersionInput): Promise<ReturnType<typeof toEntityDefinitionVersion>>;
  getEntityDefinitionCurrent(input: GetEntityDefinitionCurrentInput): Promise<ReturnType<typeof toEntityDefinitionCurrent>>;
  getEntityDefinitionVersion(input: GetEntityDefinitionVersionInput): Promise<ReturnType<typeof toEntityDefinitionVersion>>;
  listEntityDefinitions(input: EntityDefinitionListInput): Promise<ReturnType<typeof toEntityDefinitionListResponse>>;
  listAttributeTypeCatalog(): ReturnType<typeof listAttributeTypeCatalog>;
  listApprovedFormPatterns(): ReturnType<typeof listApprovedFormPatterns>;
  validateEntityDefinitionVersion(
    entityDefinitionVersionId: string,
  ): Promise<ReturnType<typeof toValidationResponse>>;
  exportEntityDefinitionSnapshot(
    input: ExportEntityDefinitionsInput,
  ): ReturnType<typeof exportEntityDefinitionSnapshot>;
}

export function createEntityBuilderService(
  repository: EntityBuilderRepository,
): EntityBuilderService {
  return {
    async createEntityDefinitionVersion(input) {
      return toEntityDefinitionVersion(await createEntityDefinitionVersion(repository, input));
    },
    async updateDraftEntityDefinitionVersion(input) {
      return toEntityDefinitionVersion(await updateDraftEntityDefinitionVersion(repository, input));
    },
    async getEntityDefinitionCurrent(input) {
      return toEntityDefinitionCurrent(await getEntityDefinitionCurrent(repository, input));
    },
    async getEntityDefinitionVersion(input) {
      return toEntityDefinitionVersion(await getEntityDefinitionVersion(repository, input));
    },
    async listEntityDefinitions(input) {
      const result = await listEntityDefinitions(repository, input);
      return toEntityDefinitionListResponse(result, input.page, input.pageSize);
    },
    listAttributeTypeCatalog,
    listApprovedFormPatterns,
    async validateEntityDefinitionVersion(entityDefinitionVersionId) {
      return toValidationResponse(
        await validateEntityDefinitionVersion(repository, entityDefinitionVersionId),
      );
    },
    exportEntityDefinitionSnapshot: (input) => exportEntityDefinitionSnapshot(repository, input),
  };
}
