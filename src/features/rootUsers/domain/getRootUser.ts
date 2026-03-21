import { RootUserNotFoundError } from "../contract/errors";
import type { RootUsersRepository } from "../persistence/repository";
import type { GetRootUserInput, RootUser } from "./types";

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

export const getRootUser =
  (repository: RootUsersRepository) =>
  async (input: GetRootUserInput): Promise<RootUser> => {
    const record = await repository.findVisibleById({ rootUserId: input.rootUserId });

    if (!record) {
      throw new RootUserNotFoundError(
        "We could not find a root user with that ID.",
        { field: "rootUserId" },
      );
    }

    return mapRecord(record);
  };
