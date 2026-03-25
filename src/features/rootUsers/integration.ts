import type { Pool } from "pg";
import { createRootUsersRouter } from "./transport/router";

export function createRootUserFeature(dbPool: Pool) {
  return createRootUsersRouter(dbPool);
}
