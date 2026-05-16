import { describe, expect, it } from "vitest";
import { createOrganizationCoreService } from "../../../src/features/organizationCore/domain/service";
import {
  OrganizationHierarchyConflictError,
  OrganizationLifecycleConflictError,
  OrganizationNameAlreadyExistsError,
} from "../../../src/features/organizationCore/contract/errors";
import {
  createInMemoryOrganizationCoreRepository,
  createOrganizationRecord,
} from "../../helpers/organizationCoreHarness";

const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const actor = {
  actorType: "root-user" as const,
  actorId: "11111111-1111-4111-8111-111111111111",
};

describe("organizationCore domain", () => {
  it("TC-ORG-S004-UNIT-001 enforces tenant-level active organization name uniqueness", async () => {
    const repository = createInMemoryOrganizationCoreRepository([
      createOrganizationRecord({ tenantId, name: "Alpha", normalizedName: "alpha" }),
      createOrganizationRecord({
        organizationId: "22222222-2222-4222-8222-222222222222",
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        name: "Alpha",
        normalizedName: "alpha",
      }),
    ]);
    const service = createOrganizationCoreService(repository);

    await expect(
      service.createOrganization({
        tenantId,
        name: " alpha ",
        ...actor,
      }),
    ).rejects.toBeInstanceOf(OrganizationNameAlreadyExistsError);

    await expect(
      service.createOrganization({
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        name: "Beta",
        ...actor,
      }),
    ).resolves.toMatchObject({ name: "Beta" });
  });

  it("TC-ORG-S004-UNIT-002 rejects cycles and hierarchy depth greater than ten", async () => {
    const ids = [
      "11111111-1111-4111-8111-111111111111",
      "22222222-2222-4222-8222-222222222222",
      "33333333-3333-4333-8333-333333333333",
      "44444444-4444-4444-8444-444444444444",
      "55555555-5555-4555-8555-555555555555",
      "66666666-6666-4666-8666-666666666666",
      "77777777-7777-4777-8777-777777777777",
      "88888888-8888-4888-8888-888888888888",
      "99999999-9999-4999-8999-999999999999",
      "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa",
    ];
    const records = ids.map((organizationId, index) =>
      createOrganizationRecord({
        organizationId,
        tenantId,
        parentOrganizationId: index === 0 ? null : ids[index - 1],
        name: `Level ${index + 1}`,
        normalizedName: `level ${index + 1}`,
      }),
    );
    const repository = createInMemoryOrganizationCoreRepository(records);
    const service = createOrganizationCoreService(repository);

    await expect(
      service.moveOrganization({
        tenantId,
        organizationId: records[0].organizationId,
        parentOrganizationId: records[9].organizationId,
        ...actor,
      }),
    ).rejects.toBeInstanceOf(OrganizationHierarchyConflictError);

    await expect(
      service.createOrganization({
        tenantId,
        name: "Level 11",
        parentOrganizationId: records[9].organizationId,
        ...actor,
      }),
    ).rejects.toBeInstanceOf(OrganizationHierarchyConflictError);
  });

  it("TC-ORG-S004-UNIT-003 archives a branch and records audit evidence", async () => {
    const parent = createOrganizationRecord({ tenantId, name: "Parent", normalizedName: "parent" });
    const child = createOrganizationRecord({
      organizationId: "22222222-2222-4222-8222-222222222222",
      tenantId,
      parentOrganizationId: parent.organizationId,
      name: "Child",
      normalizedName: "child",
    });
    const repository = createInMemoryOrganizationCoreRepository([parent, child]);
    const service = createOrganizationCoreService(repository);

    const archived = await service.archiveOrganization({
      tenantId,
      organizationId: parent.organizationId,
      childHandling: "archiveBranch",
      ...actor,
    });

    expect(archived.lifecycleStatus).toBe("archived");
    expect(repository.records.get(child.organizationId)?.lifecycleStatus).toBe("archived");
    expect(repository.auditEvents[repository.auditEvents.length - 1]).toMatchObject({
      eventType: "organization_archived",
      eventOutcome: "success",
    });
  });

  it("TC-ORG-S004-UNIT-004 moves children only to a parent outside the archived branch", async () => {
    const parent = createOrganizationRecord({ tenantId, name: "Parent", normalizedName: "parent" });
    const child = createOrganizationRecord({
      organizationId: "22222222-2222-4222-8222-222222222222",
      tenantId,
      parentOrganizationId: parent.organizationId,
      name: "Child",
      normalizedName: "child",
    });
    const replacement = createOrganizationRecord({
      organizationId: "33333333-3333-4333-8333-333333333333",
      tenantId,
      name: "Replacement",
      normalizedName: "replacement",
    });
    const repository = createInMemoryOrganizationCoreRepository([parent, child, replacement]);
    const service = createOrganizationCoreService(repository);

    await expect(
      service.archiveOrganization({
        tenantId,
        organizationId: parent.organizationId,
        childHandling: "moveChildren",
        replacementParentOrganizationId: child.organizationId,
        ...actor,
      }),
    ).rejects.toBeInstanceOf(OrganizationLifecycleConflictError);

    await service.archiveOrganization({
      tenantId,
      organizationId: parent.organizationId,
      childHandling: "moveChildren",
      replacementParentOrganizationId: replacement.organizationId,
      ...actor,
    });

    expect(repository.records.get(parent.organizationId)?.lifecycleStatus).toBe("archived");
    expect(repository.records.get(child.organizationId)?.parentOrganizationId).toBe(
      replacement.organizationId,
    );
    expect(repository.records.get(child.organizationId)?.lifecycleStatus).toBe("active");
  });
});
