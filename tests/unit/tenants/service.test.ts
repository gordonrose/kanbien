import { describe, expect, it } from "vitest";
import { createTenantsService } from "../../../src/features/tenants/domain/service";
import {
  TenantBizIdAlreadyExistsError,
  TenantNotFoundError,
} from "../../../src/features/tenants/contract/errors";
import {
  createInMemoryTenantsRepository,
  createTenantRecord,
} from "../../helpers/tenantsHarness";

describe("tenants service", () => {
  it("TC-TENANTS-UNIT-001 creates a tenant with default draft status and creator attribution", async () => {
    const repository = createInMemoryTenantsRepository();
    const service = createTenantsService(repository);

    const created = await service.createTenant({
      bizId: "Tenant-Alpha",
      name: "Tenant Alpha",
      category: "customer",
      createdByRootAdminUserId: "11111111-1111-1111-1111-111111111111",
    });

    expect(created.bizId).toBe("tenant-alpha");
    expect(created.status).toBe("draft");
    expect(created.createdByRootAdminUserId).toBe("11111111-1111-1111-1111-111111111111");
  });

  it("TC-TENANTS-UNIT-007 soft-deletes and TC-TENANTS-UNIT-008 reactivates by restoring pre-delete status", async () => {
    const repository = createInMemoryTenantsRepository([
      createTenantRecord({
        tenantId: "22222222-2222-4222-8222-222222222222",
        status: "live",
      }),
    ]);
    const service = createTenantsService(repository);

    const deleted = await service.softDeleteTenant({
      tenantId: "22222222-2222-4222-8222-222222222222",
    });
    expect(deleted.status).toBe("inactive");
    expect(deleted.deletedAt).not.toBeNull();

    const reactivated = await service.reactivateTenant({
      tenantId: "22222222-2222-4222-8222-222222222222",
    });
    expect(reactivated.status).toBe("live");
    expect(reactivated.deletedAt).toBeNull();
  });

  it("TC-TENANTS-EDGE-001 rejects reactivation when another active tenant owns the normalized bizId", async () => {
    const repository = createInMemoryTenantsRepository([
      createTenantRecord({
        tenantId: "33333333-3333-4333-8333-333333333333",
        bizId: "tenant-shared",
        status: "inactive",
        deletedAt: new Date("2026-04-07T05:00:00.000Z"),
        preDeleteStatus: "live",
      }),
      createTenantRecord({
        tenantId: "44444444-4444-4444-8444-444444444444",
        bizId: "tenant-shared",
        name: "Replacement Tenant",
      }),
    ]);
    const service = createTenantsService(repository);

    await expect(
      service.reactivateTenant({ tenantId: "33333333-3333-4333-8333-333333333333" }),
    ).rejects.toBeInstanceOf(TenantBizIdAlreadyExistsError);
  });

  it("TC-TENANTS-UNIT-002 and TC-TENANTS-UNIT-005 read visible and deleted tenants through the correct service paths", async () => {
    const repository = createInMemoryTenantsRepository([
      createTenantRecord({
        tenantId: "55555555-5555-4555-8555-555555555555",
      }),
      createTenantRecord({
        tenantId: "66666666-6666-4666-8666-666666666666",
        bizId: "tenant-deleted",
        deletedAt: new Date("2026-04-07T05:00:00.000Z"),
        status: "inactive",
        preDeleteStatus: "live",
      }),
    ]);
    const service = createTenantsService(repository);

    const visible = await service.getTenant({
      tenantId: "55555555-5555-4555-8555-555555555555",
    });
    expect(visible.tenantId).toBe("55555555-5555-4555-8555-555555555555");

    const deleted = await service.getDeletedTenant({
      tenantId: "66666666-6666-4666-8666-666666666666",
    });
    expect(deleted.tenantId).toBe("66666666-6666-4666-8666-666666666666");

    await expect(
      service.getTenant({ tenantId: "66666666-6666-4666-8666-666666666666" }),
    ).rejects.toBeInstanceOf(TenantNotFoundError);
  });

  it("TC-TENANTS-UNIT-003 and TC-TENANTS-UNIT-006 list visible and deleted tenants with separate scopes", async () => {
    const repository = createInMemoryTenantsRepository([
      createTenantRecord({
        tenantId: "77777777-7777-4777-8777-777777777777",
        bizId: "customer-live",
        name: "Customer Live",
        category: "customer",
        status: "live",
      }),
      createTenantRecord({
        tenantId: "88888888-8888-4888-8888-888888888888",
        bizId: "demo-deleted",
        name: "Demo Deleted",
        category: "demo",
        status: "inactive",
        deletedAt: new Date("2026-04-07T06:00:00.000Z"),
        preDeleteStatus: "disabled",
      }),
    ]);
    const service = createTenantsService(repository);

    const visible = await service.listTenants({
      page: 1,
      pageSize: 25,
      orderBy: "updatedAt",
      orderDirection: "desc",
      filters: { category: "customer", status: "live" },
    });
    expect(visible.items.map((item) => item.tenantId)).toEqual([
      "77777777-7777-4777-8777-777777777777",
    ]);

    const deleted = await service.listDeletedTenants({
      page: 1,
      pageSize: 25,
      orderBy: "updatedAt",
      orderDirection: "desc",
      filters: { category: "demo", status: "inactive" },
    });
    expect(deleted.items.map((item) => item.tenantId)).toEqual([
      "88888888-8888-4888-8888-888888888888",
    ]);
  });

  it("TC-TENANTS-UNIT-004 updates editable tenant metadata and rejects updates to missing active tenants", async () => {
    const repository = createInMemoryTenantsRepository([
      createTenantRecord({
        tenantId: "99999999-9999-4999-8999-999999999999",
      }),
    ]);
    const service = createTenantsService(repository);

    const updated = await service.updateTenant({
      tenantId: "99999999-9999-4999-8999-999999999999",
      name: "Tenant Updated",
      category: "demo",
      status: "disabled",
    });
    expect(updated).toMatchObject({
      name: "Tenant Updated",
      category: "demo",
      status: "disabled",
    });

    await expect(
      service.updateTenant({
        tenantId: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
        name: "Missing",
      }),
    ).rejects.toBeInstanceOf(TenantNotFoundError);
  });

  it("TC-TENANTS-UNIT-009 removes a tenant irreversibly once found", async () => {
    const repository = createInMemoryTenantsRepository([
      createTenantRecord({
        tenantId: "12121212-1212-4212-8212-121212121212",
      }),
    ]);
    const service = createTenantsService(repository);

    const removed = await service.removeTenant({
      tenantId: "12121212-1212-4212-8212-121212121212",
      confirm: true,
      reason: "cleanup",
    });
    expect(removed.tenantId).toBe("12121212-1212-4212-8212-121212121212");

    await expect(
      service.getTenant({ tenantId: "12121212-1212-4212-8212-121212121212" }),
    ).rejects.toBeInstanceOf(TenantNotFoundError);
  });
});
