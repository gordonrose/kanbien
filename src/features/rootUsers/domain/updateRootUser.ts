import {
  RootUserEmailAlreadyExistsError,
  RootUserNotFoundError,
} from "../contract/errors";
import type { RootUsersRepository } from "../persistence/repository";
import type { RootUser, UpdateRootUserInput } from "./types";

const normalizeName = (value?: string | null): string | null | undefined =>
  value === undefined ? undefined : value === null ? null : value.trim().toLowerCase();

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

export const updateRootUser =
  (repository: RootUsersRepository) =>
  async (input: UpdateRootUserInput): Promise<RootUser> => {
    const normalizedEmail = input.email?.trim().toLowerCase();

    if (
      normalizedEmail &&
      (await repository.existsActiveByNormalizedEmail(
        normalizedEmail,
        input.rootUserId,
      ))
    ) {
      throw new RootUserEmailAlreadyExistsError();
    }

    const updated = await repository.updateVisible({
      rootUserId: input.rootUserId,
      email: normalizedEmail,
      normalizedEmail,
      firstName: input.firstName,
      normalizedFirstName: normalizeName(input.firstName),
      lastName: input.lastName,
      normalizedLastName: normalizeName(input.lastName),
      status: input.status,
    });

    if (!updated) {
      throw new RootUserNotFoundError(
        "We could not find an active root user with that ID.",
        { field: "rootUserId" },
      );
    }

    return mapRecord(updated);
  };
