import { EntityDefinitionValidationFailedError } from "../contract/errors";
import type { EntityBuilderRepository } from "../persistence/repository";
import { toEntityDefinitionExport } from "./presenters";
import type { ExportEntityDefinitionsInput } from "./types";
import { validateEntityDefinitionVersion } from "./helpers";

export async function exportEntityDefinitionSnapshot(
  repository: EntityBuilderRepository,
  input: ExportEntityDefinitionsInput,
) {
  const versions = await repository.findExportVersions(input);
  for (const version of versions) {
    const validation = validateEntityDefinitionVersion(version);
    if (!validation.exportEligibility) {
      throw new EntityDefinitionValidationFailedError();
    }
  }
  return toEntityDefinitionExport(versions);
}
