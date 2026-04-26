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
  RootUserData,
  UpdateRootUserInput,
} from "./types";
import type { AssetsService } from "../../assets";
import type { RootUsersRepository } from "../persistence/repository";

function assetContentUrl(assetId: string | null): string | null {
  return assetId ? `/v1/assets/${assetId}/content` : null;
}

function toCountValue(value: number): CountValue {
  return value > 10000 ? "10000+" : value;
}

function toDomain(record: RootUserData): RootUser {
  return {
    rootUserId: record.rootUserId,
    email: record.email,
    firstName: record.firstName,
    lastName: record.lastName,
    profilePictureAssetId: record.profilePictureAssetId,
    profilePictureUrl: assetContentUrl(record.profilePictureAssetId),
    profilePictureAltText: record.profilePictureAltText,
    profilePictureDecorative: record.profilePictureDecorative,
    anonymized: record.anonymized,
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    deletedAt: record.deletedAt ? record.deletedAt.toISOString() : null,
  };
}

function toListResult(records: RootUserData[], page: number, pageSize: number, totalSearchableRecords: number, totalMatchingRecords: number): RootUserListResult {
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

async function validateProfilePicture(input: {
  assetsService?: AssetsService;
  assetId: string | null | undefined;
  altText: string | null | undefined;
  decorative: boolean | undefined;
  requestedByActorId: string | undefined;
}) {
  if (!input.assetId) {
    return;
  }
  if (!input.assetsService || !input.requestedByActorId) {
    throw new Error("Assets service and requesting actor are required for root-user profile pictures.");
  }
  await input.assetsService.validateAssetForSubject({
    actor: {
      actorType: "root",
      actorId: input.requestedByActorId,
    },
    assetId: input.assetId,
    scope: {
      scopeType: "root",
    },
    acceptedKinds: ["image"],
    requiredVisibility: "private",
    contextualAccessibility: {
      altText: input.altText,
      decorative: input.decorative,
    },
  });
}

export function createRootUsersService(
  repository: RootUsersRepository,
  assetsService?: AssetsService,
): RootUsersService {
  return {
    async createRootUser(input) {
      const existing = await repository.findNonDeletedByEmail(input.email);
      if (existing) throw new RootUserEmailAlreadyExistsError();
      await validateProfilePicture({
        assetsService,
        assetId: input.profilePictureAssetId,
        altText: input.profilePictureAltText,
        decorative: input.profilePictureDecorative,
        requestedByActorId: input.requestedByActorId,
      });
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
        if (collision && collision.rootUserId !== input.rootUserId) throw new RootUserEmailAlreadyExistsError();
      }
      const nextProfilePictureAssetId =
        input.profilePictureAssetId !== undefined
          ? input.profilePictureAssetId
          : current.profilePictureAssetId;
      const nextProfilePictureAltText =
        nextProfilePictureAssetId === null
          ? null
          : input.profilePictureAltText !== undefined
            ? input.profilePictureAltText
            : current.profilePictureAltText;
      const nextProfilePictureDecorative =
        nextProfilePictureAssetId === null
          ? false
          : input.profilePictureDecorative !== undefined
            ? input.profilePictureDecorative
            : current.profilePictureDecorative;
      await validateProfilePicture({
        assetsService,
        assetId: nextProfilePictureAssetId,
        altText: nextProfilePictureAltText,
        decorative: nextProfilePictureDecorative,
        requestedByActorId: input.requestedByActorId,
      });
      return toDomain(await repository.update({
        ...input,
        ...(nextProfilePictureAssetId === null
          ? {
              profilePictureAltText: null,
              profilePictureDecorative: false,
            }
          : {}),
      }));
    },
    async deleteRootUser(input) {
      const current = await repository.findAnyById(input.rootUserId);
      if (!current) throw new RootUserNotFoundError("We could not find an active root user with that ID.", { field: "rootUserId" });
      if (current.anonymized) throw new RootUserAlreadyAnonymizedError("That root user has already been anonymized and cannot be deleted again.");
      if (current.deletedAt) throw new RootUserAlreadyDeletedError();
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
      if (!current.deletedAt) throw new RootUserNotDeletedError();
      if (current.anonymized) throw new RootUserAlreadyAnonymizedError("That root user has been anonymized and cannot be reactivated.");
      const collision = await repository.findNonDeletedByEmail(current.email);
      if (collision && collision.rootUserId !== input.rootUserId) throw new RootUserEmailAlreadyExistsError();
      return toDomain(await repository.reactivate(input.rootUserId));
    },
  };
}
