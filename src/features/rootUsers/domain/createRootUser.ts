import { RootUserEmailAlreadyExistsError } from "../contract/errors";
import type { RootUsersRepository } from "../persistence/repository";
import type { CreateRootUserInput, RootUser } from "./types";

const normalizeName = (value?: string | null): string | null =>
  value == null ? null : value.trim().toLowerCase();

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

export const createRootUser =
  (repository: RootUsersRepository) =>
  async (input: CreateRootUserInput): Promise<RootUser> => {
    const normalizedEmail = input.email.trim().toLowerCase();

    if (await repository.existsActiveByNormalizedEmail(normalizedEmail)) {
      throw new RootUserEmailAlreadyExistsError();
    }

    const created = await repository.create({
      rootUserId: crypto.randomUUID(),
      email: normalizedEmail,
      normalizedEmail,
      firstName: input.firstName ?? null,
      normalizedFirstName: normalizeName(input.firstName),
      lastName: input.lastName ?? null,
      normalizedLastName: normalizeName(input.lastName),
      status: input.status,
    });

    return mapRecord(created);
  };
