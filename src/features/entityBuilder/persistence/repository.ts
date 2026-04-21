import type {
  CreateEntityDefinitionVersionInput,
  EntityDefinitionListInput,
  EntityDefinitionListResultData,
  EntityDefinitionVersionData,
  ExportEntityDefinitionsInput,
  UpdateEntityDefinitionVersionInput,
} from "../domain/types";
import type { EntityDefinitionLineageRecord } from "./types";

export interface EntityBuilderRepository {
  findLineageByEntityKey(entityKey: string): Promise<EntityDefinitionLineageRecord | null>;
  findCurrentVersionByEntityKey(entityKey: string): Promise<EntityDefinitionVersionData | null>;
  findVersionById(entityDefinitionVersionId: string): Promise<EntityDefinitionVersionData | null>;
  listLineages(input: EntityDefinitionListInput): Promise<EntityDefinitionListResultData>;
  createLineageWithVersion(input: import("./types").CreateEntityDefinitionVersionRecordInput): Promise<EntityDefinitionVersionData>;
  createVersionForExistingLineage(
    input: import("./types").CreateEntityDefinitionVersionRecordInput,
  ): Promise<EntityDefinitionVersionData>;
  updateDraftVersion(input: UpdateEntityDefinitionVersionInput): Promise<EntityDefinitionVersionData>;
  replaceVersionStatusAndCurrent(
    entityDefinitionVersionId: string,
    status: "draft" | "active",
  ): Promise<EntityDefinitionVersionData>;
  findExportVersions(input: ExportEntityDefinitionsInput): Promise<EntityDefinitionVersionData[]>;
}
