import type { RootUsersRepository } from "../persistence/repository";
import type {
  ListDeletedRootUsersInput,
  PaginatedRootUsersResult,
  RootUser,
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

export const listDeletedRootUsers =
  (repository: RootUsersRepository) =>
  async (input: ListDeletedRootUsersInput): Promise<PaginatedRootUsersResult> => {
    const result = await repository.list(
      {
        emailPrefix: input.filters.emailPrefix?.toLowerCase(),
        firstNamePrefix: input.filters.firstNamePrefix?.toLowerCase(),
        lastNamePrefix: input.filters.lastNamePrefix?.toLowerCase(),
        createdAtFrom: input.filters.createdAt?.from,
        createdAtTo: input.filters.createdAt?.to,
        updatedAtFrom: input.filters.updatedAt?.from,
        updatedAtTo: input.filters.updatedAt?.to,
        deletedAtFrom: input.filters.deletedAt?.from,
        deletedAtTo: input.filters.deletedAt?.to,
        includeDeleted: true,
        deletedOnly: true,
        excludeAnonymized: input.filters.excludeAnonymized,
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
