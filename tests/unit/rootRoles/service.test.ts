import { describe, expect, it } from "vitest";
import { createRootRolesService } from "../../../src/features/rootRoles/domain/service";
import {
  ROOT_AUTHZ_CAPABILITY_CATALOG,
  ROOT_USER_ADMIN_ROLE_KEY,
} from "../../../src/features/rootRoles/domain/capabilityCatalog";
import type {
  EffectiveRootUserPermissionsData,
  RootCapabilityCatalogItem,
  RootRoleAssignmentData,
  RootRoleData,
  RootUserEligibilityState,
} from "../../../src/features/rootRoles/domain/types";
import type { RootRolesRepository } from "../../../src/features/rootRoles/persistence/repository";

function createRole(overrides: Partial<RootRoleData> = {}): RootRoleData {
  const now = new Date("2026-03-30T00:00:00.000Z");
  return {
    rootRoleId: "00000000-0000-0000-0000-000000000001",
    roleKey: ROOT_USER_ADMIN_ROLE_KEY,
    displayName: "Root User Admin",
    description: "Protected bootstrap root operator role.",
    protected: true,
    createdAt: now,
    updatedAt: now,
    deactivatedAt: null,
    activeGrantCount: ROOT_AUTHZ_CAPABILITY_CATALOG.filter(
      (entry) => entry.mandatoryForRootUserAdmin || entry.protectedForRootUserAdmin,
    ).length,
    ...overrides,
  };
}

function createAssignment(overrides: Partial<RootRoleAssignmentData> = {}): RootRoleAssignmentData {
  const now = new Date("2026-03-30T00:00:00.000Z");
  return {
    rootRoleAssignmentId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    rootUserId: "11111111-1111-1111-1111-111111111111",
    rootRoleId: "00000000-0000-0000-0000-000000000001",
    roleKey: ROOT_USER_ADMIN_ROLE_KEY,
    displayName: "Root User Admin",
    protected: true,
    assignedAt: now,
    unassignedAt: null,
    ...overrides,
  };
}

function createRootUserState(overrides: Partial<RootUserEligibilityState> = {}): RootUserEligibilityState {
  return {
    rootUserId: "11111111-1111-1111-1111-111111111111",
    status: "active",
    anonymized: false,
    deletedAt: null,
    ...overrides,
  };
}

function createRootRolesHarness() {
  const roles = new Map<string, RootRoleData>();
  const assignments = new Map<string, RootRoleAssignmentData>();
  const roleGrants = new Map<string, RootCapabilityCatalogItem[]>();
  const rootUsers = new Map<string, RootUserEligibilityState>();

  const rootUserAdminRole = createRole();
  const rootUserAdminGrants = ROOT_AUTHZ_CAPABILITY_CATALOG.map((entry) => ({
    capabilityKey: entry.capabilityKey,
    description: entry.description,
    mandatory: entry.mandatoryForRootUserAdmin,
    protected: entry.protectedForRootUserAdmin,
  }));

  roles.set(rootUserAdminRole.rootRoleId, rootUserAdminRole);
  roleGrants.set(rootUserAdminRole.rootRoleId, rootUserAdminGrants);
  rootUsers.set("11111111-1111-1111-1111-111111111111", createRootUserState());
  assignments.set(
    "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    createAssignment(),
  );

  const repository: RootRolesRepository = {
    async hasCapability(rootUserId, capabilityKey) {
      return this.getEffectivePermissions(rootUserId).then((result) =>
        result.permissions.some((permission) => permission.capabilityKey === capabilityKey),
      );
    },
    async createRole(input) {
      const role = createRole({
        rootRoleId: input.rootRoleId,
        roleKey: input.roleKey.trim(),
        displayName: input.displayName.trim(),
        description: input.description.trim(),
        protected: input.isProtected,
        activeGrantCount: 0,
      });
      roles.set(role.rootRoleId, role);
      roleGrants.set(role.rootRoleId, []);
      return role;
    },
    async findRoleById(rootRoleId) {
      return roles.get(rootRoleId) ?? null;
    },
    async findRoleByKey(roleKey) {
      return (
        [...roles.values()].find(
          (role) =>
            role.roleKey.trim().toLowerCase() === roleKey.trim().toLowerCase() &&
            role.deactivatedAt === null,
        ) ?? null
      );
    },
    async listRoles(input) {
      const items = [...roles.values()].filter((role) => input.includeInactive || role.deactivatedAt === null);
      return {
        items,
        totalSearchableRecords: items.length,
        totalMatchingRecords: items.length,
      };
    },
    async updateRole(input) {
      const current = roles.get(input.rootRoleId);
      if (!current) {
        return null;
      }
      const next: RootRoleData = {
        ...current,
        displayName: input.displayName ?? current.displayName,
        description: input.description ?? current.description,
        updatedAt: new Date("2026-03-30T01:00:00.000Z"),
      };
      roles.set(next.rootRoleId, next);
      return next;
    },
    async deactivateRole(rootRoleId, _actorRootUserId) {
      const current = roles.get(rootRoleId);
      if (!current) {
        return null;
      }
      const next = { ...current, deactivatedAt: new Date("2026-03-30T02:00:00.000Z") };
      roles.set(rootRoleId, next);
      return next;
    },
    async reactivateRole(rootRoleId, _actorRootUserId) {
      const current = roles.get(rootRoleId);
      if (!current) {
        return null;
      }
      const next = {
        ...current,
        deactivatedAt: null,
        updatedAt: new Date("2026-03-30T03:00:00.000Z"),
      };
      roles.set(rootRoleId, next);
      return next;
    },
    async listEligibleCapabilities(input) {
      void input.rootRoleId;
      const items = ROOT_AUTHZ_CAPABILITY_CATALOG.map((entry) => ({
        capabilityKey: entry.capabilityKey,
        description: entry.description,
        mandatory: entry.mandatoryForRootUserAdmin,
        protected: entry.protectedForRootUserAdmin,
      }));
      return {
        items: items.slice((input.page - 1) * input.pageSize, input.page * input.pageSize),
        totalSearchableRecords: items.length,
        totalMatchingRecords: items.length,
      };
    },
    async listRoleCapabilityAssignments(input) {
      const items = roleGrants.get(input.rootRoleId) ?? [];
      return {
        items: items.slice((input.page - 1) * input.pageSize, input.page * input.pageSize),
        totalSearchableRecords: items.length,
        totalMatchingRecords: items.length,
      };
    },
    async replaceRoleCapabilityGrants(input) {
      const role = roles.get(input.rootRoleId);
      const next = input.capabilityKeys.map((capabilityKey) => {
        const entry = ROOT_AUTHZ_CAPABILITY_CATALOG.find((item) => item.capabilityKey === capabilityKey)!;
        return {
          capabilityKey: entry.capabilityKey,
          description: entry.description,
          mandatory:
            role?.roleKey === ROOT_USER_ADMIN_ROLE_KEY ? entry.mandatoryForRootUserAdmin : false,
          protected:
            role?.roleKey === ROOT_USER_ADMIN_ROLE_KEY ? entry.protectedForRootUserAdmin : false,
        };
      });
      roleGrants.set(input.rootRoleId, next);
      return {
        items: next,
        totalSearchableRecords: next.length,
        totalMatchingRecords: next.length,
      };
    },
    async createRoleAssignment(input) {
      const role = roles.get(input.rootRoleId)!;
      const assignment = createAssignment({
        rootRoleAssignmentId: input.assignmentId,
        rootUserId: input.rootUserId,
        rootRoleId: input.rootRoleId,
        roleKey: role.roleKey,
        displayName: role.displayName,
        protected: role.protected,
      });
      assignments.set(assignment.rootRoleAssignmentId, assignment);
      return assignment;
    },
    async unassignRoleAssignment(input) {
      const current = [...assignments.values()].find(
        (assignment) =>
          assignment.rootUserId === input.rootUserId &&
          assignment.rootRoleAssignmentId === input.rootRoleAssignmentId &&
          assignment.unassignedAt === null,
      );
      if (!current) {
        return null;
      }
      const next = {
        ...current,
        unassignedAt: new Date("2026-03-30T04:00:00.000Z"),
      };
      assignments.set(next.rootRoleAssignmentId, next);
      return next;
    },
    async listRootUserAssignments(input) {
      const items = [...assignments.values()].filter(
        (assignment) =>
          assignment.rootUserId === input.rootUserId && assignment.unassignedAt === null,
      );
      return {
        items: items.slice((input.page - 1) * input.pageSize, input.page * input.pageSize),
        totalSearchableRecords: items.length,
        totalMatchingRecords: items.length,
      };
    },
    async replaceRoleAssignment(input) {
      const source = [...assignments.values()].find(
        (assignment) =>
          assignment.rootUserId === input.rootUserId &&
          assignment.unassignedAt === null &&
          (assignment.rootRoleAssignmentId === input.sourceRootRoleAssignmentId ||
            assignment.rootRoleId === input.sourceRootRoleId),
      );
      if (!source) {
        throw new Error("Missing source assignment");
      }
      assignments.set(source.rootRoleAssignmentId, {
        ...source,
        unassignedAt: new Date("2026-03-30T05:00:00.000Z"),
      });
      const role = roles.get(input.targetRootRoleId)!;
      assignments.set(
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        createAssignment({
          rootRoleAssignmentId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
          rootUserId: input.rootUserId,
          rootRoleId: input.targetRootRoleId,
          roleKey: role.roleKey,
          displayName: role.displayName,
          protected: role.protected,
          assignedAt: new Date("2026-03-30T05:00:00.000Z"),
        }),
      );
      return this.getEffectivePermissions(input.rootUserId);
    },
    async getEffectivePermissions(rootUserId) {
      const activeAssignments = [...assignments.values()].filter(
        (assignment) => assignment.rootUserId === rootUserId && assignment.unassignedAt === null,
      );
      const byCapability = new Map<string, string[]>();
      for (const assignment of activeAssignments) {
        for (const grant of roleGrants.get(assignment.rootRoleId) ?? []) {
          const grantedByRoleKeys = byCapability.get(grant.capabilityKey) ?? [];
          if (!grantedByRoleKeys.includes(assignment.roleKey)) {
            grantedByRoleKeys.push(assignment.roleKey);
          }
          byCapability.set(grant.capabilityKey, grantedByRoleKeys);
        }
      }
      return {
        rootUserId,
        roles: activeAssignments,
        permissions: [...byCapability.entries()].map(([capabilityKey, grantedByRoleKeys]) => ({
          capabilityKey,
          grantedByRoleKeys,
        })),
      } satisfies EffectiveRootUserPermissionsData;
    },
    async countActiveAssignmentsForRoleKey(roleKey) {
      return [...assignments.values()].filter(
        (assignment) => assignment.roleKey === roleKey && assignment.unassignedAt === null,
      ).length;
    },
    async countActiveAssignmentsForRootUser(rootUserId) {
      return [...assignments.values()].filter(
        (assignment) => assignment.rootUserId === rootUserId && assignment.unassignedAt === null,
      ).length;
    },
    async findActiveAssignmentByRole(rootUserId, rootRoleId) {
      return (
        [...assignments.values()].find(
          (assignment) =>
            assignment.rootUserId === rootUserId &&
            assignment.rootRoleId === rootRoleId &&
            assignment.unassignedAt === null,
        ) ?? null
      );
    },
    async findActiveAssignmentById(rootUserId, rootRoleAssignmentId) {
      return (
        [...assignments.values()].find(
          (assignment) =>
            assignment.rootUserId === rootUserId &&
            assignment.rootRoleAssignmentId === rootRoleAssignmentId &&
            assignment.unassignedAt === null,
        ) ?? null
      );
    },
  };

  const rootUsersAuthStateReader = {
    async findAuthStateById(rootUserId: string) {
      return rootUsers.get(rootUserId) ?? null;
    },
  };

  return {
    repository,
    rootUsers,
    roles,
    roleGrants,
    assignments,
    service: createRootRolesService(repository, rootUsersAuthStateReader),
  };
}

describe("rootRoles service", () => {
  it("TC-ROOT-ROLES-UNIT-001 creates system root roles and rejects duplicate active normalized role keys", async () => {
    const harness = createRootRolesHarness();

    await expect(
      harness.service.createSystemRootRole({
        roleKey: ROOT_USER_ADMIN_ROLE_KEY.toLowerCase(),
        displayName: "Duplicate",
        description: "Duplicate",
        actorRootUserId: "11111111-1111-1111-1111-111111111111",
      }),
    ).rejects.toMatchObject({ code: "ROOT_ROLE_KEY_ALREADY_EXISTS" });

    const created = await harness.service.createSystemRootRole({
      roleKey: "RootUserReadOnly",
      displayName: "Root User Read Only",
      description: "Read-only root role.",
      actorRootUserId: "11111111-1111-1111-1111-111111111111",
    });

    expect(created.roleKey).toBe("RootUserReadOnly");
    expect(created.rootRoleId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it("TC-ROOT-ROLES-UNIT-002, TC-ROOT-ROLES-UNIT-003, TC-ROOT-ROLES-UNIT-004, TC-ROOT-ROLES-UNIT-005, TC-ROOT-ROLES-UNIT-006, TC-ROOT-ROLES-EDGE-002, and TC-ROOT-ROLES-EDGE-004 return stable read models and deterministic lifecycle errors", async () => {
    const harness = createRootRolesHarness();
    harness.roles.set(
      "22222222-2222-2222-2222-222222222222",
      createRole({
        rootRoleId: "22222222-2222-2222-2222-222222222222",
        roleKey: "RootUserReadOnly",
        displayName: "Root User Read Only",
        description: "Read-only root role.",
        protected: false,
        activeGrantCount: 1,
      }),
    );

    const fetched = await harness.service.getSystemRootRole({
      rootRoleId: "00000000-0000-0000-0000-000000000001",
    });
    expect(fetched.assignable).toBe(true);
    expect(fetched.activeGrantCount).toBeGreaterThan(0);

    const listedBefore = await harness.service.listSystemRootRoles({
      page: 1,
      pageSize: 25,
      includeInactive: false,
    });
    expect(listedBefore.page).toBe(1);
    expect(listedBefore.pageSize).toBe(25);
    expect(listedBefore.items.map((item) => item.roleKey)).toEqual(
      expect.arrayContaining([ROOT_USER_ADMIN_ROLE_KEY, "RootUserReadOnly"]),
    );

    const updated = await harness.service.updateSystemRootRole({
      rootRoleId: "22222222-2222-2222-2222-222222222222",
      displayName: "Read Only Updated",
      description: "Updated description",
      actorRootUserId: "11111111-1111-1111-1111-111111111111",
    });
    expect(updated.displayName).toBe("Read Only Updated");

    const deactivated = await harness.service.deleteSystemRootRole({
      rootRoleId: "22222222-2222-2222-2222-222222222222",
      actorRootUserId: "11111111-1111-1111-1111-111111111111",
    });
    expect(deactivated.assignable).toBe(false);
    expect(deactivated.deactivatedAt).not.toBeNull();

    const listedAfter = await harness.service.listSystemRootRoles({
      page: 1,
      pageSize: 25,
      includeInactive: false,
    });
    expect(listedAfter.items.map((item) => item.roleKey)).not.toContain("RootUserReadOnly");

    await expect(
      harness.service.deleteSystemRootRole({
        rootRoleId: "22222222-2222-2222-2222-222222222222",
        actorRootUserId: "11111111-1111-1111-1111-111111111111",
      }),
    ).rejects.toMatchObject({ code: "ROOT_ROLE_ALREADY_DEACTIVATED" });

    const reactivated = await harness.service.reactivateSystemRootRole({
      rootRoleId: "22222222-2222-2222-2222-222222222222",
      actorRootUserId: "11111111-1111-1111-1111-111111111111",
    });
    expect(reactivated.assignable).toBe(true);

    await expect(
      harness.service.reactivateSystemRootRole({
        rootRoleId: "22222222-2222-2222-2222-222222222222",
        actorRootUserId: "11111111-1111-1111-1111-111111111111",
      }),
    ).rejects.toMatchObject({ code: "ROOT_ROLE_NOT_DEACTIVATED" });

    await expect(
      harness.service.replaceRootUserSystemRootRole({
        rootUserId: "11111111-1111-1111-1111-111111111111",
        sourceRootRoleAssignmentId: "missing-assignment",
        targetRootRoleId: "22222222-2222-2222-2222-222222222222",
        actorRootUserId: "11111111-1111-1111-1111-111111111111",
      }),
    ).rejects.toMatchObject({ code: "ROOT_ROLE_ASSIGNMENT_NOT_FOUND" });
  });

  it("TC-ROOT-ROLES-UNIT-007, TC-ROOT-ROLES-UNIT-008, and TC-ROOT-ROLES-UNIT-012 expose eligible capabilities, assigned grants, and active assignment lists coherently", async () => {
    const harness = createRootRolesHarness();
    harness.roles.set(
      "33333333-3333-3333-3333-333333333333",
      createRole({
        rootRoleId: "33333333-3333-3333-3333-333333333333",
        roleKey: "RootUserReadOnly",
        displayName: "Root User Read Only",
        description: "Read-only root role.",
        protected: false,
        activeGrantCount: 2,
      }),
    );
    harness.roleGrants.set("33333333-3333-3333-3333-333333333333", [
      {
        capabilityKey: "root-user.read.visible",
        description: "Read visible root users and exact visible root-user lookups.",
        mandatory: false,
        protected: false,
      },
    ]);
    harness.assignments.set(
      "historical-assignment",
      createAssignment({
        rootRoleAssignmentId: "historical-assignment",
        rootUserId: "11111111-1111-1111-1111-111111111111",
        rootRoleId: "33333333-3333-3333-3333-333333333333",
        roleKey: "RootUserReadOnly",
        displayName: "Root User Read Only",
        protected: false,
        unassignedAt: new Date("2026-03-30T08:00:00.000Z"),
      }),
    );

    const eligible = await harness.service.listSystemRootRoleEligibleAuthzCapabilities({
      rootRoleId: "33333333-3333-3333-3333-333333333333",
      page: 1,
      pageSize: 25,
    });
    expect(eligible.items.length).toBeGreaterThan(0);
    expect(eligible.items[0]).toHaveProperty("description");

    const assigned = await harness.service.listSystemRootRoleCapabilityAssignments({
      rootRoleId: "33333333-3333-3333-3333-333333333333",
      page: 1,
      pageSize: 25,
    });
    expect(assigned.items).toEqual([
      expect.objectContaining({
        capabilityKey: "root-user.read.visible",
        protected: false,
      }),
    ]);

    const listedAssignments = await harness.service.listRootUserAssignedSystemRootRoles({
      rootUserId: "11111111-1111-1111-1111-111111111111",
      page: 1,
      pageSize: 25,
    });
    expect(listedAssignments.items).toEqual([
      expect.objectContaining({
        rootRoleAssignmentId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        roleKey: ROOT_USER_ADMIN_ROLE_KEY,
      }),
    ]);
  });

  it("TC-ROOT-ROLES-UNIT-009 preserves protected mandatory grants on RootUserAdmin", async () => {
    const harness = createRootRolesHarness();

    await expect(
      harness.service.updateSystemRootRoleCapabilityGrants({
        rootRoleId: "00000000-0000-0000-0000-000000000001",
        capabilityKeys: ["root-user.read.active"],
        actorRootUserId: "11111111-1111-1111-1111-111111111111",
      }),
    ).rejects.toMatchObject({ code: "ROOT_ROLE_PROTECTED" });
  });

  it("TC-ROOT-ROLES-UNIT-010 rejects inactive-role assignment and duplicate active assignment", async () => {
    const harness = createRootRolesHarness();
    harness.roles.set(
      "22222222-2222-2222-2222-222222222222",
      createRole({
        rootRoleId: "22222222-2222-2222-2222-222222222222",
        roleKey: "InactiveRole",
        displayName: "Inactive Role",
        protected: false,
        deactivatedAt: new Date("2026-03-30T06:00:00.000Z"),
      }),
    );

    await expect(
      harness.service.assignSystemRootRoleToRootUser({
        rootUserId: "11111111-1111-1111-1111-111111111111",
        rootRoleId: "22222222-2222-2222-2222-222222222222",
        actorRootUserId: "11111111-1111-1111-1111-111111111111",
      }),
    ).rejects.toMatchObject({ code: "ROOT_ROLE_INACTIVE" });

    await expect(
      harness.service.assignSystemRootRoleToRootUser({
        rootUserId: "11111111-1111-1111-1111-111111111111",
        rootRoleId: "00000000-0000-0000-0000-000000000001",
        actorRootUserId: "11111111-1111-1111-1111-111111111111",
      }),
    ).rejects.toMatchObject({ code: "ROOT_ROLE_ASSIGNMENT_ALREADY_EXISTS" });
  });

  it("TC-ROOT-ROLES-UNIT-011 rejects unassignment that would leave the target root user with zero roles or the platform with zero RootUserAdmin assignments", async () => {
    const harness = createRootRolesHarness();

    await expect(
      harness.service.unassignSystemRootRoleFromRootUser({
        rootUserId: "11111111-1111-1111-1111-111111111111",
        rootRoleAssignmentId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        actorRootUserId: "11111111-1111-1111-1111-111111111111",
      }),
    ).rejects.toMatchObject({ code: "ROOT_USER_ROLE_REQUIRED" });
  });

  it("TC-ROOT-ROLES-UNIT-013 atomically replaces one assignment with another and TC-ROOT-ROLES-UNIT-014 returns the flattened effective permission union", async () => {
    const harness = createRootRolesHarness();
    harness.roles.set(
      "33333333-3333-3333-3333-333333333333",
      createRole({
        rootRoleId: "33333333-3333-3333-3333-333333333333",
        roleKey: "RootUserReadOnly",
        displayName: "Root User Read Only",
        description: "Read-only root role.",
        protected: false,
        activeGrantCount: 2,
      }),
    );
    harness.roleGrants.set("33333333-3333-3333-3333-333333333333", [
      {
        capabilityKey: "root-user.read.visible",
        description: "Read visible root users and exact visible root-user lookups.",
        mandatory: false,
        protected: false,
      },
      {
        capabilityKey: "root-role.read",
        description: "Read one system root role.",
        mandatory: false,
        protected: false,
      },
    ]);
    harness.rootUsers.set(
      "22222222-2222-2222-2222-222222222222",
      createRootUserState({ rootUserId: "22222222-2222-2222-2222-222222222222" }),
    );
    harness.assignments.set(
      "cccccccc-cccc-cccc-cccc-cccccccccccc",
      createAssignment({
        rootRoleAssignmentId: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        rootUserId: "22222222-2222-2222-2222-222222222222",
        rootRoleId: "33333333-3333-3333-3333-333333333333",
        roleKey: "RootUserReadOnly",
        displayName: "Root User Read Only",
        protected: false,
      }),
    );

    const effectiveBefore = await harness.service.getEffectiveRootUserPermissions({
      rootUserId: "22222222-2222-2222-2222-222222222222",
    });
    expect(effectiveBefore.permissions).toEqual([
      {
        capabilityKey: "root-user.read.visible",
        grantedByRoleKeys: ["RootUserReadOnly"],
      },
      {
        capabilityKey: "root-role.read",
        grantedByRoleKeys: ["RootUserReadOnly"],
      },
    ]);

    const replaced = await harness.service.replaceRootUserSystemRootRole({
      rootUserId: "22222222-2222-2222-2222-222222222222",
      sourceRootRoleAssignmentId: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      targetRootRoleId: "00000000-0000-0000-0000-000000000001",
      actorRootUserId: "11111111-1111-1111-1111-111111111111",
    });

    expect(replaced.roles).toHaveLength(1);
    expect(replaced.roles[0]?.roleKey).toBe(ROOT_USER_ADMIN_ROLE_KEY);
    expect(replaced.permissions.some((permission) => permission.capabilityKey === "root-role.create")).toBe(
      true,
    );
  });

});
