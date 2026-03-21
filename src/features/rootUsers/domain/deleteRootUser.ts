import {
  RootUserAlreadyAnonymizedError,
  RootUserAlreadyDeletedError,
  RootUserNotFoundError,
} from "../contract/errors";
import type { RootUsersRepository } from "../persistence/repository";
import type { DeleteRootUserInput, RootUser } from "./types";

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

export const deleteRootUser =
  (repository: RootUsersRepository) =>
  async (input: DeleteRootUserInput): Promise<RootUser> => {
    const existing = await repository.findAnyById({ rootUserId: input.rootUserId });

    if (!existing) {
      throw new RootUserNotFoundError(
        "We could not find an active root user with that ID.",
        { field: "rootUserId" },
      );
    }

    if (existing.anonymized) {
      throw new RootUserAlreadyAnonymizedError(
        "That root user has already been anonymized and cannot be deleted again.",
      );
    }

    if (existing.deleted_at) {
      throw new RootUserAlreadyDeletedError();
    }

    const deleted = await repository.softDelete({ rootUserId: input.rootUserId });

    if (!deleted) {
      throw new RootUserNotFoundError(
        "We could not find an active root user with that ID.",
        { field: "rootUserId" },
      );
    }

    return mapRecord(deleted);
  };
