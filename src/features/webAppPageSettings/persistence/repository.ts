import type {
  WebAppPageContextNavItemData,
  WebAppPageSettingsData,
} from "../domain/types";

export interface WebAppPageSettingsRepository {
  findSettingsByPageId(webAppPageId: string): Promise<WebAppPageSettingsData | null>;
  listSettingsByPageIds(webAppPageIds: string[]): Promise<WebAppPageSettingsData[]>;
  upsertSettings(input: {
    webAppPageSettingsId: string;
    webAppPageId: string;
    parentPageId: string | null;
    iconKey: string | null;
    showInTopNav: boolean;
    topNavOrder: number | null;
    pageTemplateKey: string | null;
  }): Promise<WebAppPageSettingsData>;
  listContextNavItemsByOwnerPageId(ownerWebAppPageId: string): Promise<WebAppPageContextNavItemData[]>;
  replaceContextNavItems(
    ownerWebAppPageId: string,
    items: Array<{
      webAppPageContextNavItemId: string;
      ownerWebAppPageId: string;
      targetWebAppPageId: string;
      sortOrder: number;
    }>,
  ): Promise<void>;
}
