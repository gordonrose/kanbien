import type { Pool } from "pg";
import { createPostgresRootUsersRepository } from "./persistence/postgresRepository";

export interface RootUserBrowserSummary {
  rootUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface RootUsersBrowserSummaryReader {
  findBrowserSummaryById(rootUserId: string): Promise<RootUserBrowserSummary | null>;
}

export function createRootUsersBrowserSummaryReader(dbPool: Pool): RootUsersBrowserSummaryReader {
  const repository = createPostgresRootUsersRepository(dbPool);

  return {
    async findBrowserSummaryById(rootUserId) {
      const rootUser = await repository.findVisibleById(rootUserId);

      if (!rootUser) {
        return null;
      }

      return {
        rootUserId: rootUser.rootUserId,
        email: rootUser.email,
        ...(rootUser.firstName ? { firstName: rootUser.firstName } : {}),
        ...(rootUser.lastName ? { lastName: rootUser.lastName } : {}),
      };
    },
  };
}
