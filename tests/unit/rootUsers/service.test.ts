import { describe, expect, it } from "vitest";
import { createRootUsersService } from "../../../src/features/rootUsers/domain/service";
import type {
  RootUserAuthState,
  RootUserData,
  RootUserListInput,
} from "../../../src/features/rootUsers/domain/types";
import type { RootUsersRepository } from "../../../src/features/rootUsers/persistence/repository";
import type { AssetsService } from "../../../src/features/assets";
import type { ValidateAssetForSubjectInput } from "../../../src/features/assets/domain/types";

function createRootUserRecord(overrides: Partial<RootUserData> = {}): RootUserData {
  const now = new Date("2026-03-29T00:00:00.000Z");
  return {
    rootUserId: "11111111-1111-1111-1111-111111111111",
    email: "root@example.test",
    firstName: "Root",
    lastName: "User",
    profilePictureAssetId: null,
    profilePictureAltText: null,
    profilePictureDecorative: false,
    anonymized: false,
    status: "active",
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
  };
}

function createRootUsersRepositoryHarness(initialRecords: RootUserData[] = []) {
  const store = new Map(initialRecords.map((record) => [record.rootUserId, record]));

  const repository: RootUsersRepository = {
    async create(input) {
      const record = createRootUserRecord({
        rootUserId: input.rootUserId,
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        profilePictureAssetId: input.profilePictureAssetId ?? null,
        profilePictureAltText: input.profilePictureAssetId ? input.profilePictureAltText ?? null : null,
        profilePictureDecorative: input.profilePictureAssetId
          ? input.profilePictureDecorative ?? false
          : false,
      });
      store.set(record.rootUserId, record);
      return record;
    },
    async findAuthStateById(rootUserId) {
      const record = store.get(rootUserId);
      if (!record) {
        return null;
      }

      const state: RootUserAuthState = {
        rootUserId: record.rootUserId,
        email: record.email,
        status: record.status,
        anonymized: record.anonymized,
        deletedAt: record.deletedAt,
      };

      return state;
    },
    async findVisibleById(rootUserId) {
      const record = store.get(rootUserId);
      if (!record || record.deletedAt || record.anonymized) {
        return null;
      }
      return record;
    },
    async findVisibleByEmail(email) {
      return (
        [...store.values()].find(
          (record) => record.email === email && !record.deletedAt && !record.anonymized,
        ) ?? null
      );
    },
    async findAnyById(rootUserId) {
      return store.get(rootUserId) ?? null;
    },
    async findNonDeletedByEmail(email) {
      return [...store.values()].find((record) => record.email === email && !record.deletedAt) ?? null;
    },
    async listAll(_input: RootUserListInput) {
      const items = [...store.values()].filter((record) => !record.anonymized);
      return {
        items,
        totalSearchableRecords: items.length,
        totalMatchingRecords: items.filter((record) => !record.deletedAt).length,
      };
    },
    async listActive(_input: RootUserListInput) {
      const visible = [...store.values()].filter((record) => !record.deletedAt && !record.anonymized);
      const items = visible.filter((record) => record.status === "active");
      return {
        items,
        totalSearchableRecords: visible.length,
        totalMatchingRecords: items.length,
      };
    },
    async listDeleted(_input: RootUserListInput) {
      const deleted = [...store.values()].filter((record) => record.deletedAt);
      return {
        items: deleted,
        totalSearchableRecords: store.size,
        totalMatchingRecords: deleted.length,
      };
    },
    async update(input) {
      const current = store.get(input.rootUserId);
      if (!current) {
        throw new Error("Missing root user");
      }
      const next: RootUserData = {
        ...current,
        email: input.email ?? current.email,
        firstName: input.firstName ?? current.firstName,
        lastName: input.lastName ?? current.lastName,
        profilePictureAssetId:
          input.profilePictureAssetId !== undefined
            ? input.profilePictureAssetId
            : current.profilePictureAssetId,
        profilePictureAltText:
          input.profilePictureAltText !== undefined
            ? input.profilePictureAltText
            : current.profilePictureAltText,
        profilePictureDecorative:
          input.profilePictureDecorative !== undefined
            ? input.profilePictureDecorative
            : current.profilePictureDecorative,
        status: input.status ?? current.status,
        updatedAt: new Date("2026-03-30T00:00:00.000Z"),
      };
      store.set(next.rootUserId, next);
      return next;
    },
    async softDelete(rootUserId) {
      const current = store.get(rootUserId);
      if (!current) {
        throw new Error("Missing root user");
      }
      const next: RootUserData = {
        ...current,
        status: "inactive",
        deletedAt: new Date("2026-03-30T00:00:00.000Z"),
        updatedAt: new Date("2026-03-30T00:00:00.000Z"),
      };
      store.set(rootUserId, next);
      return next;
    },
    async remove(rootUserId, anonymizedEmail, anonymizedFirstName, anonymizedLastName) {
      const current = store.get(rootUserId);
      if (!current) {
        throw new Error("Missing root user");
      }
      const next: RootUserData = {
        ...current,
        email: anonymizedEmail,
        firstName: anonymizedFirstName,
        lastName: anonymizedLastName,
        profilePictureAssetId: null,
        profilePictureAltText: null,
        profilePictureDecorative: false,
        anonymized: true,
        status: "inactive",
        deletedAt: new Date("2026-03-30T00:00:00.000Z"),
        updatedAt: new Date("2026-03-30T00:00:00.000Z"),
      };
      store.set(rootUserId, next);
      return next;
    },
    async reactivate(rootUserId) {
      const current = store.get(rootUserId);
      if (!current) {
        throw new Error("Missing root user");
      }
      const next: RootUserData = {
        ...current,
        status: "active",
        deletedAt: null,
        updatedAt: new Date("2026-03-30T00:00:00.000Z"),
      };
      store.set(rootUserId, next);
      return next;
    },
  };

  return {
    repository,
    store,
    service: createRootUsersService(repository),
  };
}

function sampleListInput(overrides: Partial<RootUserListInput> = {}): RootUserListInput {
  return {
    page: 1,
    pageSize: 25,
    orderBy: "updatedAt",
    orderDirection: "desc",
    filters: {},
    ...overrides,
  };
}

describe("rootUsers service", () => {
  it("TC-ROOT-USERS-UNIT-001 creates root users and rejects duplicate active normalized emails", async () => {
    const existing = createRootUserRecord();
    const harness = createRootUsersRepositoryHarness([existing]);

    await expect(
      harness.service.createRootUser({
        email: existing.email,
        firstName: "Another",
        lastName: "User",
      }),
    ).rejects.toMatchObject({ code: "ROOT_USER_EMAIL_ALREADY_EXISTS" });

    const created = await harness.service.createRootUser({
      email: "new-root@example.test",
      firstName: "New",
      lastName: "Root",
    });

    expect(created.rootUserId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(created.email).toBe("new-root@example.test");
  });

  it("TC-ROOT-USERS-UNIT-002 and TC-ROOT-USERS-UNIT-003 return visible rows only for id and email lookups", async () => {
    const visible = createRootUserRecord();
    const deleted = createRootUserRecord({
      rootUserId: "22222222-2222-2222-2222-222222222222",
      email: "deleted@example.test",
      deletedAt: new Date("2026-03-28T00:00:00.000Z"),
      status: "inactive",
    });
    const anonymized = createRootUserRecord({
      rootUserId: "33333333-3333-3333-3333-333333333333",
      email: "anon@example.test",
      anonymized: true,
    });
    const harness = createRootUsersRepositoryHarness([visible, deleted, anonymized]);

    await expect(harness.service.getRootUser({ rootUserId: visible.rootUserId })).resolves.toMatchObject({
      rootUserId: visible.rootUserId,
    });
    await expect(harness.service.getRootUser({ rootUserId: deleted.rootUserId })).rejects.toMatchObject({
      code: "ROOT_USER_NOT_FOUND",
    });
    await expect(harness.service.getRootUserByEmail({ email: visible.email })).resolves.toMatchObject({
      email: visible.email,
    });
    await expect(harness.service.getRootUserByEmail({ email: anonymized.email })).rejects.toMatchObject({
      code: "ROOT_USER_NOT_FOUND",
    });
  });

  it("TC-ROOT-USERS-UNIT-004, TC-ROOT-USERS-UNIT-005, and TC-ROOT-USERS-EDGE-003 list visible, active, and capped totals deterministically", async () => {
    const active = createRootUserRecord();
    const inactive = createRootUserRecord({
      rootUserId: "22222222-2222-2222-2222-222222222222",
      email: "inactive@example.test",
      status: "inactive",
    });
    const harness = createRootUsersRepositoryHarness([active, inactive]);

    harness.repository.listAll = async () => ({
      items: [active, inactive],
      totalSearchableRecords: 10001,
      totalMatchingRecords: 10005,
    });
    harness.repository.listActive = async () => ({
      items: [active],
      totalSearchableRecords: 10001,
      totalMatchingRecords: 10001,
    });

    const listed = await harness.service.listRootUsers(sampleListInput());
    const activeListed = await harness.service.listActiveRootUsers(sampleListInput());

    expect(listed.items).toHaveLength(2);
    expect(listed.totalSearchableRecords).toBe("10000+");
    expect(listed.totalMatchingRecords).toBe("10000+");
    expect(activeListed.items).toHaveLength(1);
    expect(activeListed.items[0].status).toBe("active");
    expect(activeListed.totalMatchingRecords).toBe("10000+");
  });

  it("TC-ROOT-USERS-UNIT-006 updates visible rows, refreshes updatedAt, and rejects duplicate email collisions", async () => {
    const current = createRootUserRecord();
    const collision = createRootUserRecord({
      rootUserId: "22222222-2222-2222-2222-222222222222",
      email: "collision@example.test",
    });
    const harness = createRootUsersRepositoryHarness([current, collision]);

    await expect(
      harness.service.updateRootUser({
        rootUserId: current.rootUserId,
        email: collision.email,
      }),
    ).rejects.toMatchObject({ code: "ROOT_USER_EMAIL_ALREADY_EXISTS" });

    const updated = await harness.service.updateRootUser({
      rootUserId: current.rootUserId,
      firstName: "Updated",
      status: "inactive",
    });

    expect(updated.firstName).toBe("Updated");
    expect(updated.status).toBe("inactive");
    expect(updated.updatedAt).toBe("2026-03-30T00:00:00.000Z");
  });

  it("TC-ROOT-USERS-ASSET-001 links a root-scoped profile picture only after asset validation and returns a display URL", async () => {
    const validations: ValidateAssetForSubjectInput[] = [];
    const assetsService = {
      async validateAssetForSubject(input: ValidateAssetForSubjectInput) {
        validations.push(input);
        return {} as Awaited<ReturnType<AssetsService["validateAssetForSubject"]>>;
      },
    } as unknown as AssetsService;
    const harness = createRootUsersRepositoryHarness([createRootUserRecord()]);
    const service = createRootUsersService(harness.repository, assetsService);

    const updated = await service.updateRootUser({
      rootUserId: "11111111-1111-1111-1111-111111111111",
      profilePictureAssetId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      profilePictureAltText: "Root user profile photo",
      requestedByActorId: "99999999-9999-4999-8999-999999999999",
    });

    expect(validations).toHaveLength(1);
    expect(validations[0]).toMatchObject({
      actor: {
        actorType: "root",
        actorId: "99999999-9999-4999-8999-999999999999",
      },
      assetId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      scope: {
        scopeType: "root",
      },
      acceptedKinds: ["image"],
      requiredVisibility: "private",
      contextualAccessibility: {
        altText: "Root user profile photo",
      },
    });
    expect(updated.profilePictureAssetId).toBe("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    expect(updated.profilePictureUrl).toBe("/v1/assets/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/content");
  });

  it("TC-ROOT-USERS-UNIT-007 soft deletes visible rows and rejects repeat delete or anonymized delete", async () => {
    const active = createRootUserRecord();
    const deleted = createRootUserRecord({
      rootUserId: "22222222-2222-2222-2222-222222222222",
      email: "deleted@example.test",
      deletedAt: new Date("2026-03-28T00:00:00.000Z"),
      status: "inactive",
    });
    const anonymized = createRootUserRecord({
      rootUserId: "33333333-3333-3333-3333-333333333333",
      email: "anon@example.test",
      anonymized: true,
    });
    const harness = createRootUsersRepositoryHarness([active, deleted, anonymized]);

    const softDeleted = await harness.service.deleteRootUser({ rootUserId: active.rootUserId });
    expect(softDeleted.deletedAt).toBe("2026-03-30T00:00:00.000Z");
    expect(softDeleted.status).toBe("inactive");

    await expect(harness.service.deleteRootUser({ rootUserId: deleted.rootUserId })).rejects.toMatchObject({
      code: "ROOT_USER_ALREADY_DELETED",
    });
    await expect(
      harness.service.deleteRootUser({ rootUserId: anonymized.rootUserId }),
    ).rejects.toMatchObject({ code: "ROOT_USER_ALREADY_ANONYMIZED" });
  });

  it("TC-ROOT-USERS-UNIT-008 lists deleted rows and TC-ROOT-USERS-UNIT-009 reactivates only eligible deleted rows", async () => {
    const deleted = createRootUserRecord({
      rootUserId: "22222222-2222-2222-2222-222222222222",
      email: "deleted@example.test",
      deletedAt: new Date("2026-03-28T00:00:00.000Z"),
      status: "inactive",
    });
    const anonymized = createRootUserRecord({
      rootUserId: "33333333-3333-3333-3333-333333333333",
      email: "anon@example.test",
      anonymized: true,
      deletedAt: new Date("2026-03-28T00:00:00.000Z"),
      status: "inactive",
    });
    const collision = createRootUserRecord({
      rootUserId: "44444444-4444-4444-4444-444444444444",
      email: deleted.email,
    });
    const harness = createRootUsersRepositoryHarness([deleted, anonymized, collision]);

    const deletedList = await harness.service.listDeletedRootUsers(sampleListInput());
    expect(deletedList.items).toHaveLength(2);

    await expect(
      harness.service.reActivateRootUser({ rootUserId: anonymized.rootUserId }),
    ).rejects.toMatchObject({ code: "ROOT_USER_ALREADY_ANONYMIZED" });
    await expect(
      harness.service.reActivateRootUser({ rootUserId: deleted.rootUserId }),
    ).rejects.toMatchObject({ code: "ROOT_USER_EMAIL_ALREADY_EXISTS" });

    harness.store.delete(collision.rootUserId);
    const reactivated = await harness.service.reActivateRootUser({ rootUserId: deleted.rootUserId });
    expect(reactivated.deletedAt).toBeNull();
    expect(reactivated.status).toBe("active");
  });

  it("TC-ROOT-USERS-UNIT-010 irreversibly anonymizes rows and TC-ROOT-USERS-UNIT-011 preserves a narrow auth-state seam shape", async () => {
    const current = createRootUserRecord();
    const harness = createRootUsersRepositoryHarness([current]);

    const removed = await harness.service.removeRootUser({ rootUserId: current.rootUserId });
    expect(removed.anonymized).toBe(true);
    expect(removed.status).toBe("inactive");
    expect(removed.email).not.toBe(current.email);

    const authState = await harness.repository.findAuthStateById(current.rootUserId);
    expect(authState).toEqual({
      rootUserId: current.rootUserId,
      email: removed.email,
      status: "inactive",
      anonymized: true,
      deletedAt: new Date("2026-03-30T00:00:00.000Z"),
    });
  });
});
