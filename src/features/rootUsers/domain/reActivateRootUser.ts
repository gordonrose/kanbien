import {
  RootUserAlreadyAnonymizedError,
  RootUserEmailAlreadyExistsError,
  RootUserNotDeletedError,
  RootUserNotFoundError,
} from "../contract/errors";
import type { RootUsersRepository } from "../persistence/repository";
import type { ReActivateRootUserInput, RootUser } from "./types";

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

export const reActivateRootUser =
  (repository: RootUsersRepository) =>
  async (input: ReActivateRootUserInput): Promise<RootUser> => {
    const existing = await repository.findAnyById({ rootUserId: input.rootUserId });

    if (!existing) {
      throw new RootUserNotFoundError(
        "We could not find a deleted root user with that ID.",
        { field: "rootUserId" },
      );
    }

    if (existing.anonymized) {
      throw new RootUserAlreadyAnonymizedError();
    }

    if (!existing.deleted_at) {
      throw new RootUserNotDeletedError();
    }

    if (
      await repository.existsActiveByNormalizedEmail(
        existing.normalized_email,
        existing.root_user_id,
      )
    ) {
      throw new RootUserEmailAlreadyExistsError();
    }

    const reactivated = await repository.reactivate({ rootUserId: input.rootUserId });

    if (!reactivated) {
      throw new RootUserNotFoundError(
        "We could not find a deleted root user with that ID.",
        { field: "rootUserId" },
      );
    }

    return mapRecord(reactivated);
  };
