import type {
  OrganizationSearchGroup,
  OrganizationSearchInput,
  OrganizationSearchRecord,
  OrganizationSearchResult,
  OrganizationSearchResultItem,
  OrganizationSearchResultType,
} from "./types";

export const ORGANIZATION_SEARCH_RESULT_TYPES: OrganizationSearchResultType[] = [
  "organizations",
  "legalProfiles",
  "locations",
  "weeklyOpeningHours",
  "openingHourExceptions",
  "businessUnits",
  "memberships",
  "referenceValues",
  "brandingLogoReferences",
];

export function toOrganizationSearchResultItem(
  record: OrganizationSearchRecord,
): OrganizationSearchResultItem {
  return {
    resultType: record.resultType,
    id: record.id,
    tenantId: record.tenantId,
    organizationId: record.organizationId,
    parentId: record.parentId,
    title: record.title,
    subtitle: record.subtitle,
    lifecycleStatus: record.lifecycleStatus,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    matchedFields: record.matchedFields,
  };
}

export function toOrganizationSearchResult(
  input: OrganizationSearchInput,
  groups: OrganizationSearchGroup[],
): OrganizationSearchResult {
  return {
    tenantId: input.tenantId,
    query: {
      q: input.q?.trim() || null,
      resultType: input.resultType ?? null,
      organizationId: input.organizationId ?? null,
      lifecycleStatus: input.lifecycleStatus,
      orderBy: input.orderBy,
      orderDirection: input.orderDirection,
    },
    groups,
  };
}

