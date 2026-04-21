import { getWebAppPageContextNavProjection } from "./getWebAppPageContextNavProjection";
import { getWebAppPageSettings } from "./getWebAppPageSettings";
import { getWebAppPageSettingsOptions } from "./getWebAppPageSettingsOptions";
import { updateWebAppPageSettings } from "./updateWebAppPageSettings";
import type {
  GetWebAppPageContextNavProjectionInput,
  GetWebAppPageSettingsInput,
  GetWebAppPageSettingsOptionsInput,
  UpdateWebAppPageSettingsInput,
  WebAppPageContextNavProjectionResponse,
  WebAppPageSettingsOptionsResponse,
  WebAppPageSettingsResponse,
} from "./types";
import type { WebAppPageSettingsRepository } from "../persistence/repository";
import type { WebAppHierarchyIntegrationSeam } from "../../webAppHierarchyBuilder";

export interface WebAppPageSettingsService {
  getWebAppPageContextNavProjection(
    input: GetWebAppPageContextNavProjectionInput,
  ): Promise<WebAppPageContextNavProjectionResponse>;
  getWebAppPageSettings(input: GetWebAppPageSettingsInput): Promise<WebAppPageSettingsResponse>;
  updateWebAppPageSettings(
    input: UpdateWebAppPageSettingsInput,
  ): Promise<WebAppPageSettingsResponse>;
  getWebAppPageSettingsOptions(
    input: GetWebAppPageSettingsOptionsInput,
  ): Promise<WebAppPageSettingsOptionsResponse>;
}

export function createWebAppPageSettingsService(
  repository: WebAppPageSettingsRepository,
  hierarchySeam: WebAppHierarchyIntegrationSeam,
): WebAppPageSettingsService {
  return {
    getWebAppPageContextNavProjection: (input) =>
      getWebAppPageContextNavProjection(repository, hierarchySeam, input),
    getWebAppPageSettings: (input) => getWebAppPageSettings(repository, hierarchySeam, input),
    updateWebAppPageSettings: (input) =>
      updateWebAppPageSettings(repository, hierarchySeam, input),
    getWebAppPageSettingsOptions: (input) =>
      getWebAppPageSettingsOptions(repository, hierarchySeam, input),
  };
}
