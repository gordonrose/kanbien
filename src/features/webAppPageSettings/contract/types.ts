export interface WebAppPageSettingsContextNavItemResponse {
  targetWebAppPageId: string;
  displayLabel: string;
  resolvedFullRoutePath: string | null;
  sortOrder: number;
  source: "explicit" | "fallback-self";
}

export interface WebAppPageSettingsResponse {
  webAppPageId: string;
  parentPageId: string | null;
  rootFamilyId: "root-admin" | "login" | "design-system";
  displayLabel: string;
  hasStoredSettings: boolean;
  iconKey: string | null;
  effectiveIconKey: string;
  showInTopNav: boolean;
  topNavOrder: number | null;
  pageTemplateKey: string | null;
  effectivePageTemplateKey: string | null;
  contextNavItems: WebAppPageSettingsContextNavItemResponse[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApprovedIconCatalogEntryResponse {
  iconKey: string;
  label: string;
  status: "approved";
}

export interface ApprovedPageTemplateCatalogEntryResponse {
  pageTemplateKey: string;
  label: string;
  status: "approved";
}

export interface SelectablePageOptionResponse {
  webAppPageId: string;
  parentPageId: string | null;
  displayLabel: string;
  resolvedFullRoutePath: string | null;
  pageKey: string;
}

export interface WebAppPageSettingsOptionsResponse {
  webAppPageId: string;
  parentPageId: string | null;
  defaultIconKey: string;
  currentTopologyTemplateKey: string | null;
  icons: ApprovedIconCatalogEntryResponse[];
  pageTemplates: ApprovedPageTemplateCatalogEntryResponse[];
  eligibleContextNavTargets: SelectablePageOptionResponse[];
}

export interface WebAppPageContextNavProjectionItemResponse {
  webAppPageId: string;
  shellPageKey: string;
  displayLabel: string;
  resolvedFullRoutePath: string | null;
  iconKey: string | null;
  effectiveIconKey: string;
  sortOrder: number;
}

export interface WebAppPageContextNavProjectionResponse {
  rootFamilyId: "root-admin" | "login" | "design-system";
  shellPageKey: string;
  items: WebAppPageContextNavProjectionItemResponse[];
}
