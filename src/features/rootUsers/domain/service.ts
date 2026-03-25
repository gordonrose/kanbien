import { randomUUID } from "node:crypto";
import {
  RootUserAlreadyAnonymizedError,
  RootUserAlreadyDeletedError,
  RootUserEmailAlreadyExistsError,
  RootUserNotDeletedError,
  RootUserNotFoundError,
} from "../contract/errors";
import type {
  CountValue,
  CreateRootUserInput,
  DeleteRootUserInput,
  GetRootUserByEmailInput,
  GetRootUserInput,
  ReActivateRootUserInput,
  RemoveRootUserInput,
  RootUser,
  RootUserListInput,
  RootUserListResult,
  UpdateRootUserInput,
} from "./types";
import type { RootUsersRepository } from "../persistence/repository";
import type { RootUserRecord } from "../persistence/types";

function toCountValue(value: number): CountValue {
  return value > 10000 ? "10000+" : value;
}

function toDomain(record: RootUserRecord): RootUser {
  return {
    rootUserId: record.root_user_id,
    email: record.email,
    firstName: record.first_name ?? undefined,
    lastName: record.last_name ?? undefined,
    anonymized: record.anonymized,
    status: record.status,
    createdAt: record.created_at.toISOString(),
    updatedAt: record.updated_at.toISOString(),
    deletedAt: record.deleted_at ? record.deleted_at.toISOString() : null,
  };
}

function toListResult(records: RootUserRecord[], page: number, pageSize: number, totalSearchableRecords: number, totalMatchingRecords: number): RootUserListResult {
  return {
    items: records.map(toDomain),
    page,
    pageSize,
    totalPages: Math.ceil(Math.min(totalMatchingRecords, 10000) / pageSize),
    totalSearchableRecords: toCountValue(totalSearchableRecords),
    totalMatchingRecords: toCountValue(totalMatchingRecords),
  };
}

export interface RootUsersService {
  createRootUser(input: CreateRootUserInput): Promise<RootUser>;
  getRootUser(input: GetRootUserInput): Promise<RootUser>;
  getRootUserByEmail(input: GetRootUserByEmailInput): Promise<RootUser>;
  listRootUsers(input: RootUserListInput): Promise<RootUserListResult>;
  listActiveRootUsers(input: RootUserListInput): Promise<RootUserListResult>;
  updateRootUser(input: UpdateRootUserInput): Promise<RootUser>;
  deleteRootUser(input: DeleteRootUserInput): Promise<RootUser>;
  removeRootUser(input: RemoveRootUserInput): Promise<RootUser>;
  listDeletedRootUsers(input: RootUserListInput): Promise<RootUserListResult>;
  reActivateRootUser(input: ReActivateRootUserInput): Promise<RootUser>;
}

export function createRootUsersService(repository: RootUsersRepository): RootUsersService {
  return {
    async createRootUser(input) {
      const existing = await repository.findNonDeletedByEmail(input.email);
      if (existing) throw new RootUserEmailAlreadyExistsError();
      return toDomain(await repository.create({ rootUserId: randomUUID(), ...input }));
    },
    async getRootUser(input) {
      const record = await repository.findVisibleById(input.rootUserId);
      if (!record) throw new RootUserNotFoundError();
      return toDomain(record);
    },
    async getRootUserByEmail(input) {
      const record = await repository.findVisibleByEmail(input.email);
      if (!record) throw new RootUserNotFoundError("We could not find a root user with that email address.", { field: "email" });
      return toDomain(record);
    },
    async listRootUsers(input) {
      const result = await repository.listAll(input);
      return toListResult(result.items, input.page, input.pageSize, result.totalSearchableRecords, result.totalMatchingRecords);
    },
    async listActiveRootUsers(input) {
      const result = await repository.listActive(input);
      return toListResult(result.items, input.page, input.pageSize, result.totalSearchableRecords, result.totalMatchingRecords);
    },
    async updateRootUser(input) {
      const current = await repository.findVisibleById(input.rootUserId);
      if (!current) throw new RootUserNotFoundError("We could not find an active root user with that ID.", { field: "rootUserId" });
      if (input.email && input.email !== current.email) {
        const collision = await repository.findNonDeletedByEmail(input.email);
        if (collision && collision.root_user_id !== input.rootUserId) throw new RootUserEmailAlreadyExistsError();
      }
      return toDomain(await repository.update(input));
    },
    async deleteRootUser(input) {
      const current = await repository.findAnyById(input.rootUserId);
      if (!current) throw new RootUserNotFoundError("We could not find an active root user with that ID.", { field: "rootUserId" });
      if (current.anonymized) throw new RootUserAlreadyAnonymizedError("That root user has already been anonymized and cannot be deleted again.");
      if (current.deleted_at) throw new RootUserAlreadyDeletedError();
      return toDomain(await repository.softDelete(input.rootUserId));
    },
    async removeRootUser(input) {
      const current = await repository.findAnyById(input.rootUserId);
      if (!current) throw new RootUserNotFoundError();
      const anonymizedEmail = `${randomUUID().replace(/-/g, "").slice(0, 10)}@${randomUUID().replace(/-/g, "").slice(0, 5)}.com`.toLowerCase();
      const anonymizedFirstName = randomUUID().replace(/-/g, "").slice(0, 16);
      const anonymizedLastName = randomUUID().replace(/-/g, "").slice(0, 16);
      return toDomain(await repository.remove(input.rootUserId, anonymizedEmail, anonymizedFirstName, anonymizedLastName));
    },
    async listDeletedRootUsers(input) {
      const result = await repository.listDeleted(input);
      return toListResult(result.items, input.page, input.pageSize, result.totalSearchableRecords, result.totalMatchingRecords);
    },
    async reActivateRootUser(input) {
      const current = await repository.findAnyById(input.rootUserId);
      if (!current) throw new RootUserNotFoundError("We could not find a deleted root user with that ID.", { field: "rootUserId" });
      if (!current.deleted_at) throw new RootUserNotDeletedError();
      if (current.anonymized) throw new RootUserAlreadyAnonymizedError("That root user has been anonymized and cannot be reactivated.");
      const collision = await repository.findNonDeletedByEmail(current.email);
      if (collision && collision.root_user_id !== input.rootUserId) throw new RootUserEmailAlreadyExistsError();
      return toDomain(await repository.reactivate(input.rootUserId));
    },
  };
}
