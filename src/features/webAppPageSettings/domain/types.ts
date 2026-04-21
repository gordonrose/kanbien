import type {
  WebAppPageContextNavProjectionResponse,
  WebAppPageSettingsOptionsResponse,
  WebAppPageSettingsResponse,
} from "../contract/types";

export interface WebAppPageSettingsData {
  webAppPageSettingsId: string;
  webAppPageId: string;
  parentPageId: string | null;
  iconKey: string | null;
  showInTopNav: boolean;
  topNavOrder: number | null;
  pageTemplateKey: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebAppPageContextNavItemData {
  webAppPageContextNavItemId: string;
  ownerWebAppPageId: string;
  targetWebAppPageId: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetWebAppPageSettingsInput {
  webAppPageId: string;
}

export interface UpdateWebAppPageSettingsInput {
  webAppPageId: string;
  iconKey?: string | null;
  showInTopNav?: boolean;
  topNavOrder?: number | null;
  pageTemplateKey?: string | null;
  contextNavTargetPageIds?: string[];
}

export interface GetWebAppPageSettingsOptionsInput {
  webAppPageId: string;
}

export interface GetWebAppPageContextNavProjectionInput {
  rootFamilyId: "root-admin" | "login" | "design-system";
  pageKey: string;
}

export type {
  WebAppPageContextNavProjectionResponse,
  WebAppPageSettingsOptionsResponse,
  WebAppPageSettingsResponse,
};
