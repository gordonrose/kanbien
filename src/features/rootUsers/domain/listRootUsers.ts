import type { RootUsersRepository } from "../persistence/repository";
import type {
  ListRootUsersInput,
  PaginatedRootUsersResult,
  RootUser,
  RootUserListFilters,
} from "./types";

const mapRecord = (record: any): RootUser => ({
  rootUserId: record.root_user_id,
  email: record.email,
  firstName: record.first_name,
  lastName: record.last_name,
  anonymized: record.anonymized,
  status: record.status,
  createdAt: record.created_at.toISOString(),
  updatedAt: record.updated_at.toISOString(),
  deletedAt: record.deleted_at ? record.deleted_at.toISOString() : null,
});

const mapFilters = (filters: RootUserListFilters) => ({
  emailPrefix: filters.emailPrefix?.toLowerCase(),
  firstNamePrefix: filters.firstNamePrefix?.toLowerCase(),
  lastNamePrefix: filters.lastNamePrefix?.toLowerCase(),
  createdAtFrom: filters.createdAt?.from,
  createdAtTo: filters.createdAt?.to,
  updatedAtFrom: filters.updatedAt?.from,
  updatedAtTo: filters.updatedAt?.to,
  deletedAtFrom: filters.deletedAt?.from,
  deletedAtTo: filters.deletedAt?.to,
  status: filters.status,
});

export const listRootUsers =
  (repository: RootUsersRepository) =>
  async (input: ListRootUsersInput): Promise<PaginatedRootUsersResult> => {
    const result = await repository.list(
      {
        ...mapFilters(input.filters),
        includeDeleted: true,
        deletedOnly: false,
        excludeAnonymized: true,
        activeOnly: false,
      },
      {
        orderBy: input.orderBy,
        orderDirection: input.orderDirection,
      },
      {
        limit: input.pageSize,
        offset: (input.page - 1) * input.pageSize,
      },
    );

    return {
      items: result.items.map(mapRecord),
      page: input.page,
      pageSize: input.pageSize,
      totalItems: result.totalItems,
      totalPages: Math.ceil(result.totalItems / input.pageSize),
    };
  };
