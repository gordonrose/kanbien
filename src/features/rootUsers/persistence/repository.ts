import type {
  CreateRootUserRecordInput,
  RootUserRecord,
  RootUserRepositoryListInput,
  RootUserRepositoryListResult,
  UpdateRootUserRecordInput,
} from "./types";

export interface RootUsersRepository {
  create(input: CreateRootUserRecordInput): Promise<RootUserRecord>;
  findVisibleById(rootUserId: string): Promise<RootUserRecord | null>;
  findVisibleByEmail(email: string): Promise<RootUserRecord | null>;
  findAnyById(rootUserId: string): Promise<RootUserRecord | null>;
  findNonDeletedByEmail(email: string): Promise<RootUserRecord | null>;
  listAll(input: RootUserRepositoryListInput): Promise<RootUserRepositoryListResult>;
  listActive(input: RootUserRepositoryListInput): Promise<RootUserRepositoryListResult>;
  listDeleted(input: RootUserRepositoryListInput): Promise<RootUserRepositoryListResult>;
  update(input: UpdateRootUserRecordInput): Promise<RootUserRecord>;
  softDelete(rootUserId: string): Promise<RootUserRecord>;
  remove(rootUserId: string, anonymizedEmail: string, anonymizedFirstName: string, anonymizedLastName: string): Promise<RootUserRecord>;
  reactivate(rootUserId: string): Promise<RootUserRecord>;
}
