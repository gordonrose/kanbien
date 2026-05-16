import type {
  OrganizationSearchInput,
  OrganizationSearchRecord,
  OrganizationSearchResultType,
} from "../domain/types";

export interface OrganizationSearchRepositoryGroup {
  resultType: OrganizationSearchResultType;
  items: OrganizationSearchRecord[];
  totalMatchingRecords: number;
}

export interface OrganizationSearchRepository {
  search(input: OrganizationSearchInput): Promise<OrganizationSearchRepositoryGroup[]>;
}

