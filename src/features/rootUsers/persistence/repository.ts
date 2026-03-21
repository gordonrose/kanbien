import type {
  CreateRootUserRecordInput,
  GetRootUserByEmailInput,
  GetRootUserByIdInput,
  PaginatedRootUserRecords,
  RemoveRootUserRecordInput,
  ReActivateRootUserRecordInput,
  RootUserListOrder,
  RootUserListWhere,
  RootUserRecord,
  SoftDeleteRootUserRecordInput,
  UpdateRootUserRecordInput,
  ListPagination,
} from "./types";

export interface RootUsersRepository {
  create(input: CreateRootUserRecordInput): Promise<RootUserRecord>;
  findVisibleById(input: GetRootUserByIdInput): Promise<RootUserRecord | null>;
  findVisibleByEmail(input: GetRootUserByEmailInput): Promise<RootUserRecord | null>;
  findAnyById(input: GetRootUserByIdInput): Promise<RootUserRecord | null>;
  list(
    where: RootUserListWhere,
    order: RootUserListOrder,
    pagination: ListPagination,
  ): Promise<PaginatedRootUserRecords>;
  updateVisible(input: UpdateRootUserRecordInput): Promise<RootUserRecord | null>;
  softDelete(input: SoftDeleteRootUserRecordInput): Promise<RootUserRecord | null>;
  remove(input: RemoveRootUserRecordInput): Promise<RootUserRecord | null>;
  reactivate(input: ReActivateRootUserRecordInput): Promise<RootUserRecord | null>;
  existsActiveByNormalizedEmail(
    normalizedEmail: string,
    excludeRootUserId?: string,
  ): Promise<boolean>;
}
