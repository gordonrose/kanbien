import type { Pool } from "pg";
import { createRootUsersAuthStateReader } from "../rootUsers";
import { createRootRolesService } from "./domain/service";
import { createPostgresRootRolesRepository } from "./persistence/postgresRepository";
import {
  createRootRolesRouter,
  createRootUserRoleAssignmentsRouter,
} from "./transport/router";
import type { PlatformSecurityRepository } from "../../lib/security/repository";

export function createRootAuthorizationChecker(dbPool: Pool) {
  const repository = createPostgresRootRolesRepository(dbPool);
  return {
    hasCapability(input: { rootUserId: string; capabilityKey: string }) {
      return repository.hasCapability(input.rootUserId, input.capabilityKey);
    },
  };
}

export function createRootRolesFeature(
  dbPool: Pool,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const repository = createPostgresRootRolesRepository(dbPool);
  const rootUsersAuthStateReader = createRootUsersAuthStateReader(dbPool);
  const service = createRootRolesService(repository, rootUsersAuthStateReader);
  const capabilityChecker = {
    hasCapability(input: { rootUserId: string; capabilityKey: string }) {
      return repository.hasCapability(input.rootUserId, input.capabilityKey);
    },
  };

  return {
    rootRolesRouter: createRootRolesRouter(
      service,
      capabilityChecker,
      platformSecurityRepository,
    ),
    rootUserRoleAssignmentsRouter: createRootUserRoleAssignmentsRouter(
      service,
      capabilityChecker,
      platformSecurityRepository,
    ),
    capabilityChecker,
  };
}
