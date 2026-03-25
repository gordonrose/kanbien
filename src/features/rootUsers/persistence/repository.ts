import type {
  RootUserRepositoryListInput,
  RootUserRepositoryListResult,
  UpdateRootUserRecordInput,
} from "./types";
import type { RootUserAuthState, RootUserData } from "../domain/types";
import type { CreateRootUserRecordInput } from "./types";

export interface RootUsersRepository {
  create(input: CreateRootUserRecordInput): Promise<RootUserData>;
  findAuthStateById(rootUserId: string): Promise<RootUserAuthState | null>;
  findVisibleById(rootUserId: string): Promise<RootUserData | null>;
  findVisibleByEmail(email: string): Promise<RootUserData | null>;
  findAnyById(rootUserId: string): Promise<RootUserData | null>;
  findNonDeletedByEmail(email: string): Promise<RootUserData | null>;
  listAll(input: RootUserRepositoryListInput): Promise<RootUserRepositoryListResult>;
  listActive(input: RootUserRepositoryListInput): Promise<RootUserRepositoryListResult>;
  listDeleted(input: RootUserRepositoryListInput): Promise<RootUserRepositoryListResult>;
  update(input: UpdateRootUserRecordInput): Promise<RootUserData>;
  softDelete(rootUserId: string): Promise<RootUserData>;
  remove(rootUserId: string, anonymizedEmail: string, anonymizedFirstName: string, anonymizedLastName: string): Promise<RootUserData>;
  reactivate(rootUserId: string): Promise<RootUserData>;
}
