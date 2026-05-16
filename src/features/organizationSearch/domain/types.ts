export type OrganizationSearchActorType = "root-user" | "tenant-admin";

export type OrganizationSearchResultType =
  | "organizations"
  | "legalProfiles"
  | "locations"
  | "weeklyOpeningHours"
  | "openingHourExceptions"
  | "businessUnits"
  | "memberships"
  | "referenceValues"
  | "brandingLogoReferences";

export interface OrganizationSearchInput {
  tenantId: string;
  actorType: OrganizationSearchActorType;
  actorId: string;
  q?: string;
  resultType?: OrganizationSearchResultType;
  organizationId?: string;
  lifecycleStatus: "active" | "archived";
  page: number;
  pageSize: number;
  orderBy: "name" | "updatedAt" | "createdAt" | "resultType";
  orderDirection: "asc" | "desc";
}

export interface OrganizationSearchRecord {
  resultType: OrganizationSearchResultType;
  id: string;
  tenantId: string;
  organizationId: string | null;
  parentId: string | null;
  title: string;
  subtitle: string | null;
  lifecycleStatus: string;
  createdAt: Date;
  updatedAt: Date;
  matchedFields: string[];
}

export interface OrganizationSearchResultItem {
  resultType: OrganizationSearchResultType;
  id: string;
  tenantId: string;
  organizationId: string | null;
  parentId: string | null;
  title: string;
  subtitle: string | null;
  lifecycleStatus: string;
  createdAt: string;
  updatedAt: string;
  matchedFields: string[];
}

export interface OrganizationSearchGroup {
  resultType: OrganizationSearchResultType;
  items: OrganizationSearchResultItem[];
  page: number;
  pageSize: number;
  totalMatchingRecords: number;
}

export interface OrganizationSearchResult {
  tenantId: string;
  query: {
    q: string | null;
    resultType: OrganizationSearchResultType | null;
    organizationId: string | null;
    lifecycleStatus: "active" | "archived";
    orderBy: OrganizationSearchInput["orderBy"];
    orderDirection: OrganizationSearchInput["orderDirection"];
  };
  groups: OrganizationSearchGroup[];
}

