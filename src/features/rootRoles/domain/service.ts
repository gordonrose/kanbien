import { randomUUID } from "node:crypto";
import {
  InvalidRequestError,
  RootRoleAlreadyDeactivatedError,
  RootRoleAssignmentAlreadyExistsError,
  RootRoleAssignmentNotFoundError,
  RootRoleCapabilityUnknownError,
  RootRoleInactiveError,
  RootRoleKeyAlreadyExistsError,
  RootRoleNotDeactivatedError,
  RootRoleNotFoundError,
  RootRoleProtectedError,
  RootUserAdminRoleRequiredError,
  RootUserNotFoundError,
  RootUserRoleRequiredError,
} from "../contract/errors";
import type {
  EffectiveRootUserPermissionsResult,
  RootAuthzCapabilityListResult,
  RootRoleCapabilityAssignmentResult,
  RootRoleListResult,
  RootRoleSummary,
  RootUserRoleAssignmentListResult,
} from "../contract/types";
import { getRootAuthzCapabilityEntry, ROOT_USER_ADMIN_ROLE_KEY } from "./capabilityCatalog";
import type {
  CreateRootRoleInput,
  RootCapabilityCatalogListInput,
  RootRoleAssignmentListInput,
  RootRoleListInput,
  RootUserEligibilityState,
  UpdateRootRoleInput,
} from "./types";
import type { RootRolesRepository } from "../persistence/repository";

function toCountValue(value: number): number {
  return value > 10000 ? 10000 : value;
}

function toRoleSummary(record: import("./types").RootRoleData): RootRoleSummary {
  return {
    rootRoleId: record.rootRoleId,
    roleKey: record.roleKey,
    displayName: record.displayName,
    description: record.description,
    protected: record.protected,
    assignable: record.deactivatedAt === null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    deactivatedAt: record.deactivatedAt ? record.deactivatedAt.toISOString() : null,
    activeGrantCount: record.activeGrantCount,
  };
}

function toRoleListResult(
  result: import("./types").RootRoleListResultData,
  page: number,
  pageSize: number,
): RootRoleListResult {
  return {
    items: result.items.map(toRoleSummary),
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(toCountValue(result.totalMatchingRecords) / pageSize)),
    totalSearchableRecords: toCountValue(result.totalSearchableRecords),
    totalMatchingRecords: toCountValue(result.totalMatchingRecords),
  };
}

function toCapabilityListResult(
  result: import("./types").RootCapabilityCatalogListResult,
  page: number,
  pageSize: number,
): RootAuthzCapabilityListResult {
  return {
    items: result.items.map((item) => ({
      capabilityKey: item.capabilityKey,
      description: item.description,
      mandatory: item.mandatory,
      protected: item.protected,
    })),
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(toCountValue(result.totalMatchingRecords) / pageSize)),
    totalSearchableRecords: toCountValue(result.totalSearchableRecords),
    totalMatchingRecords: toCountValue(result.totalMatchingRecords),
  };
}

function toAssignmentSummary(
  record: import("./types").RootRoleAssignmentData,
): import("../contract/types").RootUserRoleAssignmentSummary {
  return {
    rootRoleAssignmentId: record.rootRoleAssignmentId,
    rootUserId: record.rootUserId,
    rootRoleId: record.rootRoleId,
    roleKey: record.roleKey,
    displayName: record.displayName,
    protected: record.protected,
    assignedAt: record.assignedAt.toISOString(),
    unassignedAt: record.unassignedAt ? record.unassignedAt.toISOString() : null,
  };
}

function toAssignmentListResult(
  result: import("./types").RootRoleAssignmentListResultData,
  page: number,
  pageSize: number,
): RootUserRoleAssignmentListResult {
  return {
    items: result.items.map(toAssignmentSummary),
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(toCountValue(result.totalMatchingRecords) / pageSize)),
    totalSearchableRecords: toCountValue(result.totalSearchableRecords),
    totalMatchingRecords: toCountValue(result.totalMatchingRecords),
  };
}

function assertRootUserIsEligible(rootUser: RootUserEligibilityState | null): asserts rootUser is RootUserEligibilityState {
  if (!rootUser || rootUser.anonymized || rootUser.deletedAt) {
    throw new RootUserNotFoundError();
  }
}

function assertKnownCapabilityKeys(capabilityKeys: string[]): void {
  for (const capabilityKey of capabilityKeys) {
    if (!getRootAuthzCapabilityEntry(capabilityKey)) {
      throw new RootRoleCapabilityUnknownError(capabilityKey);
    }
  }
}

export interface RootRolesService {
  createSystemRootRole(
    input: CreateRootRoleInput & { actorRootUserId: string },
  ): Promise<RootRoleSummary>;
  getSystemRootRole(input: { rootRoleId: string }): Promise<RootRoleSummary>;
  listSystemRootRoles(input: RootRoleListInput): Promise<RootRoleListResult>;
  updateSystemRootRole(
    input: UpdateRootRoleInput & { actorRootUserId: string },
  ): Promise<RootRoleSummary>;
  deleteSystemRootRole(
    input: { rootRoleId: string; actorRootUserId: string },
  ): Promise<RootRoleSummary>;
  reactivateSystemRootRole(
    input: { rootRoleId: string; actorRootUserId: string },
  ): Promise<RootRoleSummary>;
  listSystemRootRoleEligibleAuthzCapabilities(
    input: RootCapabilityCatalogListInput,
  ): Promise<RootAuthzCapabilityListResult>;
  listSystemRootRoleCapabilityAssignments(
    input: RootCapabilityCatalogListInput,
  ): Promise<RootRoleCapabilityAssignmentResult>;
  updateSystemRootRoleCapabilityGrants(input: {
    rootRoleId: string;
    capabilityKeys: string[];
    actorRootUserId: string;
    reason?: string;
  }): Promise<RootRoleCapabilityAssignmentResult>;
  assignSystemRootRoleToRootUser(input: {
    rootUserId: string;
    rootRoleId: string;
    actorRootUserId: string;
    reason?: string;
  }): Promise<import("../contract/types").RootUserRoleAssignmentSummary>;
  unassignSystemRootRoleFromRootUser(input: {
    rootUserId: string;
    rootRoleAssignmentId: string;
    actorRootUserId: string;
    reason?: string;
  }): Promise<import("../contract/types").RootUserRoleAssignmentSummary>;
  listRootUserAssignedSystemRootRoles(
    input: RootRoleAssignmentListInput,
  ): Promise<RootUserRoleAssignmentListResult>;
  replaceRootUserSystemRootRole(input: {
    rootUserId: string;
    sourceRootRoleAssignmentId?: string;
    sourceRootRoleId?: string;
    targetRootRoleId: string;
    actorRootUserId: string;
    reason?: string;
  }): Promise<EffectiveRootUserPermissionsResult>;
  getEffectiveRootUserPermissions(input: {
    rootUserId: string;
  }): Promise<EffectiveRootUserPermissionsResult>;
}

export function createRootRolesService(
  repository: RootRolesRepository,
  rootUsersAuthStateReader: {
    findAuthStateById(rootUserId: string): Promise<RootUserEligibilityState | null>;
  },
): RootRolesService {
  return {
    async createSystemRootRole(input) {
      const existing = await repository.findRoleByKey(input.roleKey);
      if (existing && !existing.deactivatedAt) {
        throw new RootRoleKeyAlreadyExistsError();
      }
      return toRoleSummary(
        await repository.createRole({
          rootRoleId: randomUUID(),
          roleKey: input.roleKey,
          displayName: input.displayName,
          description: input.description,
          isProtected: false,
          actorRootUserId: input.actorRootUserId,
        }),
      );
    },
    async getSystemRootRole(input) {
      const role = await repository.findRoleById(input.rootRoleId);
      if (!role) {
        throw new RootRoleNotFoundError();
      }
      return toRoleSummary(role);
    },
    async listSystemRootRoles(input) {
      return toRoleListResult(await repository.listRoles(input), input.page, input.pageSize);
    },
    async updateSystemRootRole(input) {
      const current = await repository.findRoleById(input.rootRoleId);
      if (!current) {
        throw new RootRoleNotFoundError();
      }
      return toRoleSummary(
        (await repository.updateRole(input)) ?? current,
      );
    },
    async deleteSystemRootRole(input) {
      const current = await repository.findRoleById(input.rootRoleId);
      if (!current) {
        throw new RootRoleNotFoundError();
      }
      if (current.deactivatedAt) {
        throw new RootRoleAlreadyDeactivatedError();
      }
      if (current.protected) {
        throw new RootRoleProtectedError();
      }
      return toRoleSummary(
        (await repository.deactivateRole(input.rootRoleId, input.actorRootUserId)) ?? current,
      );
    },
    async reactivateSystemRootRole(input) {
      const current = await repository.findRoleById(input.rootRoleId);
      if (!current) {
        throw new RootRoleNotFoundError();
      }
      if (!current.deactivatedAt) {
        throw new RootRoleNotDeactivatedError();
      }
      const activeCollision = await repository.findRoleByKey(current.roleKey);
      if (activeCollision && activeCollision.rootRoleId !== current.rootRoleId && !activeCollision.deactivatedAt) {
        throw new RootRoleKeyAlreadyExistsError();
      }
      return toRoleSummary(
        (await repository.reactivateRole(input.rootRoleId, input.actorRootUserId)) ?? current,
      );
    },
    async listSystemRootRoleEligibleAuthzCapabilities(input) {
      const role = await repository.findRoleById(input.rootRoleId);
      if (!role) {
        throw new RootRoleNotFoundError();
      }
      return toCapabilityListResult(
        await repository.listEligibleCapabilities(input),
        input.page,
        input.pageSize,
      );
    },
    async listSystemRootRoleCapabilityAssignments(input) {
      const role = await repository.findRoleById(input.rootRoleId);
      if (!role) {
        throw new RootRoleNotFoundError();
      }
      return toCapabilityListResult(
        await repository.listRoleCapabilityAssignments(input),
        input.page,
        input.pageSize,
      );
    },
    async updateSystemRootRoleCapabilityGrants(input) {
      const role = await repository.findRoleById(input.rootRoleId);
      if (!role) {
        throw new RootRoleNotFoundError();
      }
      assertKnownCapabilityKeys(input.capabilityKeys);
      if (role.protected) {
        const mandatoryProtectedKeys = (
          await repository.listEligibleCapabilities({
            rootRoleId: input.rootRoleId,
            page: 1,
            pageSize: 1000,
          })
        ).items
          .filter((item) => item.mandatory && item.protected)
          .map((item) => item.capabilityKey);
        const missingProtectedKey = mandatoryProtectedKeys.find(
          (capabilityKey) => !input.capabilityKeys.includes(capabilityKey),
        );
        if (missingProtectedKey) {
          throw new RootRoleProtectedError(
            "Protected mandatory grants cannot be removed from that root role.",
            { field: missingProtectedKey, reason: "protected_mandatory_grant" },
          );
        }
      }
      return toCapabilityListResult(
        await repository.replaceRoleCapabilityGrants(input),
        1,
        Math.max(1, input.capabilityKeys.length || 1),
      );
    },
    async assignSystemRootRoleToRootUser(input) {
      const rootUser = await rootUsersAuthStateReader.findAuthStateById(input.rootUserId);
      assertRootUserIsEligible(rootUser);
      const role = await repository.findRoleById(input.rootRoleId);
      if (!role) {
        throw new RootRoleNotFoundError();
      }
      if (role.deactivatedAt) {
        throw new RootRoleInactiveError();
      }
      const duplicate = await repository.findActiveAssignmentByRole(input.rootUserId, input.rootRoleId);
      if (duplicate) {
        throw new RootRoleAssignmentAlreadyExistsError();
      }
      return toAssignmentSummary(
        await repository.createRoleAssignment({
          assignmentId: randomUUID(),
          rootUserId: input.rootUserId,
          rootRoleId: input.rootRoleId,
          actorRootUserId: input.actorRootUserId,
          reason: input.reason,
        }),
      );
    },
    async unassignSystemRootRoleFromRootUser(input) {
      const rootUser = await rootUsersAuthStateReader.findAuthStateById(input.rootUserId);
      assertRootUserIsEligible(rootUser);
      const assignment = await repository.findActiveAssignmentById(
        input.rootUserId,
        input.rootRoleAssignmentId,
      );
      if (!assignment) {
        throw new RootRoleAssignmentNotFoundError();
      }
      if ((await repository.countActiveAssignmentsForRootUser(input.rootUserId)) <= 1) {
        throw new RootUserRoleRequiredError();
      }
      if (
        assignment.roleKey === ROOT_USER_ADMIN_ROLE_KEY &&
        (await repository.countActiveAssignmentsForRoleKey(ROOT_USER_ADMIN_ROLE_KEY)) <= 1
      ) {
        throw new RootUserAdminRoleRequiredError();
      }
      return toAssignmentSummary(
        (await repository.unassignRoleAssignment(input)) ?? assignment,
      );
    },
    async listRootUserAssignedSystemRootRoles(input) {
      const rootUser = await rootUsersAuthStateReader.findAuthStateById(input.rootUserId);
      assertRootUserIsEligible(rootUser);
      return toAssignmentListResult(
        await repository.listRootUserAssignments(input),
        input.page,
        input.pageSize,
      );
    },
    async replaceRootUserSystemRootRole(input) {
      const rootUser = await rootUsersAuthStateReader.findAuthStateById(input.rootUserId);
      assertRootUserIsEligible(rootUser);
      const targetRole = await repository.findRoleById(input.targetRootRoleId);
      if (!targetRole) {
        throw new RootRoleNotFoundError();
      }
      if (targetRole.deactivatedAt) {
        throw new RootRoleInactiveError();
      }
      let sourceAssignment: import("./types").RootRoleAssignmentData | null = null;
      if (input.sourceRootRoleId && !input.sourceRootRoleAssignmentId) {
        sourceAssignment = await repository.findActiveAssignmentByRole(
          input.rootUserId,
          input.sourceRootRoleId,
        );
      }
      if (input.sourceRootRoleAssignmentId) {
        sourceAssignment = await repository.findActiveAssignmentById(
          input.rootUserId,
          input.sourceRootRoleAssignmentId,
        );
      }
      if (!sourceAssignment) {
        throw new RootRoleAssignmentNotFoundError();
      }
      const existingTarget = await repository.findActiveAssignmentByRole(
        input.rootUserId,
        input.targetRootRoleId,
      );
      if (
        existingTarget &&
        existingTarget.rootRoleAssignmentId !== sourceAssignment.rootRoleAssignmentId
      ) {
        throw new RootRoleAssignmentAlreadyExistsError();
      }
      if (
        sourceAssignment.roleKey === ROOT_USER_ADMIN_ROLE_KEY &&
        targetRole.roleKey !== ROOT_USER_ADMIN_ROLE_KEY &&
        (await repository.countActiveAssignmentsForRoleKey(ROOT_USER_ADMIN_ROLE_KEY)) <= 1
      ) {
        throw new RootUserAdminRoleRequiredError();
      }
      const effective = await repository.replaceRoleAssignment(input);
      return {
        rootUserId: effective.rootUserId,
        roles: effective.roles.map(toAssignmentSummary),
        permissions: effective.permissions,
      };
    },
    async getEffectiveRootUserPermissions(input) {
      const rootUser = await rootUsersAuthStateReader.findAuthStateById(input.rootUserId);
      assertRootUserIsEligible(rootUser);
      const effective = await repository.getEffectivePermissions(input.rootUserId);
      return {
        rootUserId: effective.rootUserId,
        roles: effective.roles.map(toAssignmentSummary),
        permissions: effective.permissions,
      };
    },
  };
}
