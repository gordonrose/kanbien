import { ORGANIZATION_SEARCH_RESULT_TYPES, toOrganizationSearchResult, toOrganizationSearchResultItem } from "./presenters";
import type { OrganizationSearchRepository } from "../persistence/types";
import type {
  OrganizationSearchGroup,
  OrganizationSearchInput,
  OrganizationSearchResult,
  OrganizationSearchResultType,
} from "./types";

export interface OrganizationSearchService {
  search(input: OrganizationSearchInput): Promise<OrganizationSearchResult>;
}

function emptyGroup(resultType: OrganizationSearchResultType, page: number, pageSize: number): OrganizationSearchGroup {
  return {
    resultType,
    items: [],
    page,
    pageSize,
    totalMatchingRecords: 0,
  };
}

export function createOrganizationSearchService(
  repository: OrganizationSearchRepository,
): OrganizationSearchService {
  return {
    async search(input) {
      const groups = await repository.search({
        ...input,
        q: input.q?.trim() || undefined,
      });
      const byType = new Map(groups.map((group) => [group.resultType, group]));
      const resultTypes = input.resultType ? [input.resultType] : ORGANIZATION_SEARCH_RESULT_TYPES;
      return toOrganizationSearchResult(
        input,
        resultTypes.map((resultType) => {
          const group = byType.get(resultType);
          if (!group) {
            return emptyGroup(resultType, input.page, input.pageSize);
          }
          return {
            resultType,
            items: group.items.map(toOrganizationSearchResultItem),
            page: input.page,
            pageSize: input.pageSize,
            totalMatchingRecords: group.totalMatchingRecords,
          };
        }),
      );
    },
  };
}

