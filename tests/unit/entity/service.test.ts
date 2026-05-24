import { describe, expect, it } from "vitest";
import { createEntityService } from "../../../src/features/entity/domain/service";
import type {
  EntityData,
  EntityListInput,
} from "../../../src/features/entity/domain/types";
import type { EntityRepository } from "../../../src/features/entity/persistence/repository";

function createEntityRecord(overrides: Partial<EntityData> = {}): EntityData {
  const now = new Date("2026-05-24T00:00:00.000Z");
  const name = overrides.name ?? "Organization";
  return {
    entityId: overrides.entityId ?? "11111111-1111-4111-8111-111111111111",
    name,
    normalizedName: overrides.normalizedName ?? name.trim().toLowerCase(),
    description: overrides.description ?? "Organization instruction seed.",
    status: overrides.status ?? "draft",
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    archivedAt: overrides.archivedAt ?? null,
  };
}

function createRepositoryHarness(initialRecords: EntityData[] = []) {
  const records = new Map(initialRecords.map((record) => [record.entityId, record]));

  const repository: EntityRepository = {
    async create(input) {
      const record = createEntityRecord({
        entityId: input.entityId,
        name: input.name,
        normalizedName: input.name.trim().toLowerCase(),
        description: input.description,
        status: input.status,
      });
      records.set(record.entityId, record);
      return record;
    },
    async findVisibleById(entityId) {
      const record = records.get(entityId);
      return record && !record.archivedAt ? record : null;
    },
    async findAnyById(entityId) {
      return records.get(entityId) ?? null;
    },
    async findCurrentByName(name) {
      const normalized = name.trim().toLowerCase();
      return [...records.values()].find((record) => record.normalizedName === normalized && !record.archivedAt) ?? null;
    },
    async list(input: EntityListInput) {
      const visible = [...records.values()].filter((record) => input.filters.includeArchived || !record.archivedAt);
      const items = visible.filter((record) => !input.filters.status || record.status === input.filters.status);
      return {
        items,
        totalSearchableRecords: visible.length,
        totalMatchingRecords: items.length,
      };
    },
    async update(input) {
      const current = records.get(input.entityId);
      if (!current || current.archivedAt) {
        throw new Error("Missing current entity");
      }
      const next = createEntityRecord({
        ...current,
        name: input.name ?? current.name,
        normalizedName: input.name ? input.name.trim().toLowerCase() : current.normalizedName,
        description: input.description ?? current.description,
        status: input.status ?? current.status,
        updatedAt: new Date("2026-05-24T00:01:00.000Z"),
        archivedAt: input.status === "archived" ? new Date("2026-05-24T00:01:00.000Z") : current.archivedAt,
      });
      records.set(next.entityId, next);
      return next;
    },
    async archive(entityId) {
      const current = records.get(entityId);
      if (!current || current.archivedAt) {
        throw new Error("Missing current entity");
      }
      const next = createEntityRecord({
        ...current,
        status: "archived",
        archivedAt: new Date("2026-05-24T00:02:00.000Z"),
        updatedAt: new Date("2026-05-24T00:02:00.000Z"),
      });
      records.set(entityId, next);
      return next;
    },
  };

  return {
    service: createEntityService(repository),
    records,
  };
}

describe("entity service", () => {
  it("TC-ENTITY-UNIT-001 creates a draft Entity with system-managed identifiers and timestamps", async () => {
    const harness = createRepositoryHarness();

    const created = await harness.service.createEntity({
      name: "Organization",
      description: "Organization instruction seed.",
    });

    expect(created.entityId).toEqual(expect.any(String));
    expect(created.status).toBe("draft");
    expect(created.createdAt).toBe("2026-05-24T00:00:00.000Z");
    expect(created.archivedAt).toBeNull();
  });

  it("TC-ENTITY-UNIT-002 rejects duplicate current normalized names while allowing archived history", async () => {
    const existing = createEntityRecord({
      entityId: "11111111-1111-4111-8111-111111111111",
      name: "Organization",
    });
    const archived = createEntityRecord({
      entityId: "22222222-2222-4222-8222-222222222222",
      name: "Archived Entity",
      status: "archived",
      archivedAt: new Date("2026-05-24T00:00:00.000Z"),
    });
    const harness = createRepositoryHarness([existing, archived]);

    await expect(
      harness.service.createEntity({
        name: " organization ",
        description: "Duplicate current name.",
      }),
    ).rejects.toMatchObject({ code: "ENTITY_NAME_ALREADY_EXISTS" });

    await expect(
      harness.service.createEntity({
        name: "Archived Entity",
        description: "Name can be reused after archive.",
      }),
    ).resolves.toMatchObject({ name: "Archived Entity" });
  });

  it("TC-ENTITY-UNIT-003 archives delete requests and hides archived records from normal exact reads", async () => {
    const entity = createEntityRecord();
    const harness = createRepositoryHarness([entity]);

    const archived = await harness.service.deleteEntity({ entityId: entity.entityId });
    expect(archived.status).toBe("archived");
    expect(archived.archivedAt).toBe("2026-05-24T00:02:00.000Z");

    await expect(harness.service.getEntity({ entityId: entity.entityId })).rejects.toMatchObject({
      code: "ENTITY_NOT_FOUND",
    });
    await expect(
      harness.service.getEntity({ entityId: entity.entityId, includeArchived: true }),
    ).resolves.toMatchObject({ status: "archived" });
  });
});
