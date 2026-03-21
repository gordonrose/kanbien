import { RootUserNotFoundError } from "../contract/errors";
import type { RootUsersRepository } from "../persistence/repository";
import type { RemoveRootUserInput, RootUser } from "./types";

const randomPart = (length: number): string =>
  Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((value) => "abcdefghijklmnopqrstuvwxyz0123456789"[value % 36])
    .join("");

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

export const removeRootUser =
  (repository: RootUsersRepository) =>
  async (input: RemoveRootUserInput): Promise<RootUser> => {
    const existing = await repository.findAnyById({ rootUserId: input.rootUserId });

    if (!existing) {
      throw new RootUserNotFoundError(
        "We could not find a root user with that ID.",
        { field: "rootUserId" },
      );
    }

    const anonymizedEmail = `${randomPart(10)}@${randomPart(5)}.com`;
    const anonymizedFirstName = randomPart(16);
    const anonymizedLastName = randomPart(16);

    const removed = await repository.remove({
      rootUserId: input.rootUserId,
      anonymizedEmail,
      normalizedAnonymizedEmail: anonymizedEmail.toLowerCase(),
      anonymizedFirstName,
      normalizedAnonymizedFirstName: anonymizedFirstName.toLowerCase(),
      anonymizedLastName,
      normalizedAnonymizedLastName: anonymizedLastName.toLowerCase(),
    });

    if (!removed) {
      throw new RootUserNotFoundError(
        "We could not find a root user with that ID.",
        { field: "rootUserId" },
      );
    }

    return mapRecord(removed);
  };
