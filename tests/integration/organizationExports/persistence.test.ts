import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { Pool } from "pg";
import { createLocalStorageAdapter } from "../../../src/lib/storage/localStorageAdapter";
import { readPasswordProtectedZipTextEntry } from "../../../src/lib/exportBundles/passwordProtectedZip";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";
import { createPostgresTenantsRepository } from "../../../src/features/tenants/persistence/postgresRepository";
import { createOrganizationCoreService } from "../../../src/features/organizationCore/domain/service";
import { createPostgresOrganizationCoreRepository } from "../../../src/features/organizationCore/persistence/postgresRepository";
import { createPostgresOrganizationExportRepository } from "../../../src/features/organizationExports/persistence/postgresRepository";
import { createOrganizationExportsService } from "../../../src/features/organizationExports/domain/service";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }
  return Buffer.concat(chunks);
}

describeIfPostgres("organizationExports postgres persistence", () => {
  let pool: Pool;
  let storageRoot: string;
  const rootUserId = "11111111-1111-4111-8111-111111111111";
  const otherRootUserId = "22222222-2222-4222-8222-222222222222";
  const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const actor = { actorType: "root-user" as const, actorId: rootUserId, authPrincipalId: rootUserId };

  beforeAll(async () => {
    pool = createPostgresTestDatabasePool();
    storageRoot = await mkdtemp(path.join(tmpdir(), "organization-exports-"));
  });

  beforeEach(async () => {
    await resetPostgresTestDatabaseForRoutineIsolation(pool);
    await applyPostgresTestMigrations(pool, [
      "rootUsers",
      "platformSecurity",
      "rootAuth",
      "rootRoles",
      "tenants",
      "organizationCore",
      "organizationExports",
    ]);

    await createPostgresRootUsersRepository(pool).create({
      rootUserId,
      email: "organization-export@example.test",
      firstName: "Organization",
      lastName: "Export",
    });
    await createPostgresRootUsersRepository(pool).create({
      rootUserId: otherRootUserId,
      email: "organization-export-other@example.test",
      firstName: "Other",
      lastName: "Export",
    });
    await createPostgresTenantsRepository(pool).create({
      tenantId,
      bizId: "tenant-export",
      name: "Tenant Export",
      category: "customer",
      status: "live",
      createdByRootAdminUserId: rootUserId,
    });
  });

  afterAll(async () => {
    await pool.end();
    await rm(storageRoot, { recursive: true, force: true });
  });

  function createService() {
    const organizationCoreService = createOrganizationCoreService(createPostgresOrganizationCoreRepository(pool));
    const repository = createPostgresOrganizationExportRepository(pool);
    const storage = createLocalStorageAdapter(storageRoot);
    return {
      organizationCoreService,
      repository,
      storage,
      service: createOrganizationExportsService({
        repository,
        storage,
        secret: "test-secret",
        organizationCoreService,
      }),
    };
  }

  it("TC-ORG-S015-INT-001 persists requester-bound lifecycle actions", async () => {
    const { organizationCoreService, service, repository } = createService();
    const organization = await organizationCoreService.createOrganization({
      tenantId,
      name: "Export Root",
      actorType: "root-user",
      actorId: rootUserId,
    });

    const created = await service.createExport({
      tenantId,
      sourceOrganizationId: organization.organizationId,
      selectedSections: ["organizations"],
      visibilityScope: "current_only",
      organizationScope: "selected_organization_only",
      ...actor,
    });
    expect(created).toMatchObject({
      status: "queued",
      downloadAvailable: false,
      pinAvailable: false,
    });

    await expect(
      service.getExport({
        tenantId,
        organizationExportId: created.organizationExportId,
        actorType: "root-user",
        actorId: otherRootUserId,
        authPrincipalId: otherRootUserId,
      }),
    ).rejects.toThrow(/forbidden/i);

    const cancelled = await service.cancelExport({
      tenantId,
      organizationExportId: created.organizationExportId,
      ...actor,
    });
    expect(cancelled.status).toBe("cancelled");

    const failed = await repository.create({
      tenantId,
      sourceOrganizationId: organization.organizationId,
      selectedSections: ["organizations"],
      visibilityScope: "current_only",
      organizationScope: "selected_organization_only",
      organizationExportId: "33333333-3333-4333-8333-333333333333",
      ...actor,
    });
    await repository.markFailed(failed.organizationExportId, "generation_failed");
    const retried = await service.retryExport({
      tenantId,
      organizationExportId: failed.organizationExportId,
      selectedSections: ["organizations", "locations"],
      ...actor,
    });
    expect(retried.status).toBe("retrying");
    expect(retried.selectedSections).toEqual(["organizations", "locations"]);

    const deleted = await service.deleteExport({
      tenantId,
      organizationExportId: failed.organizationExportId,
      ...actor,
    });
    expect(deleted.status).toBe("deleted");

    const list = await service.listExports({
      tenantId,
      actorId: rootUserId,
      page: 1,
      pageSize: 25,
    });
    expect(list.items.map((item) => item.organizationExportId)).toEqual([created.organizationExportId]);
  });

  it("TC-ORG-S015-INT-002 generates a private password-protected ZIP with manifest and download evidence", async () => {
    const { organizationCoreService, service, repository } = createService();
    const organization = await organizationCoreService.createOrganization({
      tenantId,
      name: "Exported Organization",
      actorType: "root-user",
      actorId: rootUserId,
    });
    const created = await service.createExport({
      tenantId,
      sourceOrganizationId: organization.organizationId,
      selectedSections: ["organizations"],
      visibilityScope: "current_only",
      organizationScope: "selected_organization_only",
      ...actor,
    });

    await service.generateExport({
      tenantId,
      organizationExportId: created.organizationExportId,
      jobId: "44444444-4444-4444-8444-444444444444",
    });

    const ready = await service.getExport({
      tenantId,
      organizationExportId: created.organizationExportId,
      ...actor,
    });
    expect(ready).toMatchObject({
      status: "ready",
      pinAvailable: true,
      downloadAvailable: true,
    });
    expect(ready.checksumSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(ready.expiresAt).not.toBeNull();

    const pin = await service.viewPin({
      tenantId,
      organizationExportId: created.organizationExportId,
      ...actor,
    });
    expect(pin.pin).toHaveLength(12);

    const download = await service.downloadExport({
      tenantId,
      organizationExportId: created.organizationExportId,
      ...actor,
    });
    expect(download.headers["Content-Type"]).toBe("application/zip");
    expect(download.headers["Cache-Control"]).toBe("private, no-store");
    expect(Object.values(download.headers).join(" ")).not.toContain("tenant/");
    const zipBytes = await streamToBuffer(download.stream);
    const manifest = await readPasswordProtectedZipTextEntry({
      content: zipBytes,
      password: pin.pin,
      path: "manifest.json",
    });
    expect(manifest).toContain(created.organizationExportId);
    const organizations = await readPasswordProtectedZipTextEntry({
      content: zipBytes,
      password: pin.pin,
      path: "organizations/organizations.json",
    });
    expect(organizations).toContain("Exported Organization");

    const persisted = await repository.findById(tenantId, created.organizationExportId);
    expect(persisted?.downloadAttemptCount).toBe(1);
    expect(persisted?.pinViewedAt).not.toBeNull();
  });
});
