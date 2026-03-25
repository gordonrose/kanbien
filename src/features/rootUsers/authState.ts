import type { Pool } from "pg";
import { createPostgresRootUsersRepository } from "./persistence/postgresRepository";
import type { RootUserAuthState } from "./domain/types";

export interface RootUsersAuthStateReader {
  findAuthStateById(rootUserId: string): Promise<RootUserAuthState | null>;
}

export function createRootUsersAuthStateReader(dbPool: Pool): RootUsersAuthStateReader {
  const repository = createPostgresRootUsersRepository(dbPool);

  return {
    findAuthStateById(rootUserId: string) {
      return repository.findAuthStateById(rootUserId);
    },
  };
}
