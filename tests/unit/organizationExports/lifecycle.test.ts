import { describe, expect, it, vi } from "vitest";
import { Readable } from "node:stream";

import { createOrganizationExportsService } from "../../../src/features/organizationExports/domain/service";
import {
  ORGANIZATION_EXPORT_CLEANUP_JOB_TYPE,
  ORGANIZATION_EXPORT_TIMEOUT_SWEEP_JOB_TYPE,
  createOrganizationExportJobTypes,
  createOrganizationExportRecurringSchedules,
} from "../../../src/features/organizationExports/domain/jobTypes";
import {
  createJobTypeRegistry,
  createRecurringScheduleRegistry,
} from "../../../src/features/jobProcessing";
import { decryptExportPin, encryptExportPin } from "../../../src/features/organizationExports/domain/secretBox";
import type { OrganizationExportRecord } from "../../../src/features/organizationExports";
import type { OrganizationExportRepository } from "../../../src/features/organizationExports/persistence/types";
import { readPasswordProtectedZipTextEntry } from "../../../src/lib/exportBundles/passwordProtectedZip";
import type { ObjectStorageAdapter } from "../../../src/lib/storage/types";

const baseRecord: OrganizationExportRecord = {
  organizationExportId: "11111111-1111-4111-8111-111111111111",
  tenantId: "22222222-2222-4222-8222-222222222222",
  sourceOrganizationId: "33333333-3333-4333-8333-333333333333",
  actorType: "root-user",
  actorId: "44444444-4444-4444-8444-444444444444",
  authPrincipalId: "44444444-4444-4444-8444-444444444444",
  authorityWorld: "root",
  selectedSections: ["organizations"],
  visibilityScope: "current_only",
  organizationScope: "selected_organization_only",
  status: "ready",
  jobId: null,
  storageKey: "tenant/222/export.zip",
  pinSecretEncrypted: encryptExportPin("1234567890", "test-secret"),
  pinViewedAt: null,
  downloadAttemptCount: 0,
  notificationStatus: "pending",
  sizeBytes: 128,
  checksumSha256: "a".repeat(64),
  failureCategory: null,
  generatedAt: new Date("2026-05-16T00:00:00.000Z"),
  expiresAt: new Date("2026-05-16T01:00:00.000Z"),
  cleanupEligibleAt: null,
  cleanupFailureCategory: null,
  cleanupAttemptCount: 0,
  createdAt: new Date("2026-05-16T00:00:00.000Z"),
  updatedAt: new Date("2026-05-16T00:00:00.000Z"),
  deletedAt: null,
};

function createRepository(record: OrganizationExportRecord): OrganizationExportRepository {
  return {
    create: vi.fn(),
    list: vi.fn(),
    findById: vi.fn(async () => record),
    listCleanupEligible: vi.fn(async () => []),
    listRunningOlderThan: vi.fn(async () => []),
    updateJobId: vi.fn(),
    markRunning: vi.fn(),
    markReady: vi.fn(),
    markFailed: vi.fn(),
    markCancelRequested: vi.fn(),
    markCancelled: vi.fn(),
    markRetrying: vi.fn(),
    markDeleted: vi.fn(async () => ({ ...record, status: "deleted" as const, deletedAt: new Date() })),
    markExpired: vi.fn(async () => ({ ...record, status: "expired" as const })),
    markNotificationStatus: vi.fn(async (_exportId, status) => ({ ...record, notificationStatus: status })),
    markCleanupFailed: vi.fn(async () => ({
      ...record,
      status: "cleanup_failed" as const,
      cleanupFailureCategory: "delete_failed",
      cleanupAttemptCount: 1,
    })),
    markCleanupRetry: vi.fn(async (_input) => ({
      ...record,
      status: "cleanup_failed" as const,
      cleanupFailureCategory: "delete_failed",
      cleanupAttemptCount: record.cleanupAttemptCount + 1,
    })),
    markCleanupOperatorReview: vi.fn(async () => ({
      ...record,
      status: "cleanup_failed" as const,
      cleanupFailureCategory: "operator_review_required",
      cleanupAttemptCount: record.cleanupAttemptCount + 1,
      cleanupEligibleAt: null,
    })),
    markCleanupComplete: vi.fn(async () => ({
      ...record,
      storageKey: null,
      pinSecretEncrypted: null,
      cleanupEligibleAt: null,
      cleanupFailureCategory: null,
    })),
    recordPinViewed: vi.fn(async () => ({ ...record, pinViewedAt: new Date() })),
    incrementDownloadCount: vi.fn(),
    recordAttempt: vi.fn(),
    recordAuditEvent: vi.fn(),
  };
}

function createStorage(deleteObject: ObjectStorageAdapter["deleteObject"]): ObjectStorageAdapter {
  return {
    provider: "test",
    createUploadTarget: vi.fn(),
    writeObject: vi.fn(),
    headObject: vi.fn(),
    readObject: vi.fn(async () => ({
      stream: Readable.from(["zip"]),
      metadata: {
        storageKey: "tenant/222/export.zip",
        byteSize: 3,
        contentType: "application/zip",
        checksumSha256: "a".repeat(64),
      },
    })),
    readObjectBytes: vi.fn(),
    deleteObject,
  };
}

describe("organization export lifecycle hardening", () => {
  it("TC-ORG-S015-UNIT-001 marks expired exports when PIN view is attempted after expiry", async () => {
    const repository = createRepository({
      ...baseRecord,
      expiresAt: new Date(Date.now() - 1_000),
    });
    const service = createOrganizationExportsService({
      repository,
      storage: createStorage(vi.fn()),
      secret: "test-secret",
      organizationCoreService: { getOrganization: vi.fn() } as never,
    });

    await expect(
      service.viewPin({
        tenantId: baseRecord.tenantId,
        organizationExportId: baseRecord.organizationExportId,
        actorType: "root-user",
        actorId: baseRecord.actorId,
      }),
    ).rejects.toThrow(/no longer available/i);
    expect(repository.markExpired).toHaveBeenCalledWith(baseRecord.organizationExportId);
  });

  it("TC-ORG-S015-UNIT-002 records cleanup failure when generated bytes cannot be deleted", async () => {
    const repository = createRepository(baseRecord);
    const service = createOrganizationExportsService({
      repository,
      storage: createStorage(vi.fn(async () => {
        throw new Error("storage unavailable");
      })),
      secret: "test-secret",
      organizationCoreService: { getOrganization: vi.fn() } as never,
    });

    const deleted = await service.deleteExport({
      tenantId: baseRecord.tenantId,
      organizationExportId: baseRecord.organizationExportId,
      actorType: "root-user",
      actorId: baseRecord.actorId,
    });

    expect(deleted.status).toBe("cleanup_failed");
    expect(deleted.cleanupFailureCategory).toBe("delete_failed");
    expect(repository.markCleanupFailed).toHaveBeenCalledWith(baseRecord.organizationExportId, "delete_failed");
  });

  it("TC-ORG-S015-UNIT-003 records notification failure without invalidating a ready export or auditing PIN material", async () => {
    const queued = { ...baseRecord, status: "queued" as const, storageKey: null, pinSecretEncrypted: null };
    const ready = {
      ...baseRecord,
      status: "ready" as const,
      storageKey: "tenant/222/export.zip",
      pinSecretEncrypted: encryptExportPin("1234567890", "test-secret"),
    };
    const repository = createRepository(queued);
    repository.markReady = vi.fn(async () => ready);
    const notificationStatus = vi.fn(async () => ({ ...ready, notificationStatus: "failed" as const }));
    repository.markNotificationStatus = notificationStatus;
    const audit = vi.fn(async () => undefined);
    repository.recordAuditEvent = audit;
    const sendEmail = vi.fn(async () => {
      throw new Error("provider down");
    });
    const service = createOrganizationExportsService({
      repository,
      storage: {
        ...createStorage(vi.fn()),
        writeObject: vi.fn(async () => ({
          storageKey: "tenant/222/export.zip",
          byteSize: 128,
          contentType: "application/zip",
          checksumSha256: "a".repeat(64),
        })),
      },
      secret: "test-secret",
      organizationCoreService: {
        getOrganization: vi.fn(async () => ({
          organizationId: queued.sourceOrganizationId,
          tenantId: queued.tenantId,
          name: "Export Org",
        })),
      } as never,
      notificationRecipientResolver: vi.fn(async () => "requester@example.test"),
      notificationService: {
        sendEmail,
        resendEmail: vi.fn(),
      },
    });

    await service.generateExport({
      tenantId: queued.tenantId,
      organizationExportId: queued.organizationExportId,
      jobId: null,
    });

    expect(repository.markReady).toHaveBeenCalled();
    expect(notificationStatus).toHaveBeenCalledWith(queued.organizationExportId, "failed");
    const emailCalls = sendEmail.mock.calls as unknown as Array<[{ bodyText?: string }]>;
    const bodyText = String(emailCalls[0]?.[0]?.bodyText ?? "");
    const generatedPin = /^PIN: (.+)$/m.exec(bodyText)?.[1];
    expect(generatedPin).toBeTruthy();
    expect(JSON.stringify(audit.mock.calls)).not.toContain(generatedPin);
  });

  it("TC-ORG-S015-UNIT-004 cleans expired export bytes and scrubs PIN material after storage delete succeeds", async () => {
    const expired = {
      ...baseRecord,
      status: "expired" as const,
      cleanupEligibleAt: new Date("2026-05-16T01:00:00.000Z"),
    };
    const repository = createRepository(expired);
    repository.listCleanupEligible = vi.fn(async () => [expired]);
    const deleteObject = vi.fn(async () => "deleted" as const);
    const service = createOrganizationExportsService({
      repository,
      storage: createStorage(deleteObject),
      secret: "test-secret",
      organizationCoreService: { getOrganization: vi.fn() } as never,
    });

    const result = await service.cleanupExpiredExports({
      now: new Date("2026-05-16T02:00:00.000Z"),
    });

    expect(result).toMatchObject({
      inspected: 1,
      deletedObjects: 1,
      failedDeletes: 0,
      operatorReviewRequired: 0,
    });
    expect(deleteObject).toHaveBeenCalledWith(expired.storageKey);
    expect(repository.markCleanupComplete).toHaveBeenCalledWith(expired.organizationExportId);
  });

  it("TC-ORG-S015-UNIT-005 schedules cleanup retry before max attempts and requires operator review at the cap", async () => {
    const retryable = {
      ...baseRecord,
      status: "cleanup_failed" as const,
      cleanupAttemptCount: 1,
      cleanupEligibleAt: new Date("2026-05-16T01:00:00.000Z"),
    };
    const reviewRequired = {
      ...baseRecord,
      organizationExportId: "55555555-5555-4555-8555-555555555555",
      status: "cleanup_failed" as const,
      cleanupAttemptCount: 6,
      cleanupEligibleAt: new Date("2026-05-16T01:00:00.000Z"),
    };
    const repository = createRepository(retryable);
    repository.listCleanupEligible = vi.fn(async () => [retryable, reviewRequired]);
    const service = createOrganizationExportsService({
      repository,
      storage: createStorage(vi.fn(async () => {
        throw new Error("delete failed");
      })),
      secret: "test-secret",
      organizationCoreService: { getOrganization: vi.fn() } as never,
    });

    const result = await service.cleanupExpiredExports({
      now: new Date("2026-05-16T02:00:00.000Z"),
      maxAttempts: 7,
    });

    expect(result).toMatchObject({
      inspected: 2,
      deletedObjects: 0,
      failedDeletes: 2,
      operatorReviewRequired: 1,
    });
    expect(repository.markCleanupRetry).toHaveBeenCalledWith(expect.objectContaining({
      exportId: retryable.organizationExportId,
      failureCategory: "delete_failed",
    }));
    expect(repository.markCleanupOperatorReview).toHaveBeenCalledWith(
      reviewRequired.organizationExportId,
      "operator_review_required",
    );
  });

  it("TC-ORG-S015-UNIT-006 registers cleanup as a platform-internal maintenance job", async () => {
    const cleanupExpiredExports = vi.fn(async () => ({
      inspected: 0,
      deletedObjects: 0,
      failedDeletes: 0,
      operatorReviewRequired: 0,
    }));
    const jobs = createOrganizationExportJobTypes({
      generateExport: vi.fn(),
      cleanupExpiredExports,
    } as never);
    const cleanupJob = jobs.find((job) => job.jobType === ORGANIZATION_EXPORT_CLEANUP_JOB_TYPE);

    expect(cleanupJob).toMatchObject({
      ownerFeature: "organizationExports",
      executionScope: "platform-internal",
      defaultQueue: "bulk",
    });
    await cleanupJob?.handler({ limit: 25, maxAttempts: 7 }, {
      jobId: "job-1",
      jobType: ORGANIZATION_EXPORT_CLEANUP_JOB_TYPE,
      payloadVersion: 1,
      tenantId: null,
      executionScope: "platform-internal",
      workerId: "worker-1",
      attemptNumber: 1,
      idempotencyKey: null,
    });
    expect(cleanupExpiredExports).toHaveBeenCalledWith({
      limit: 25,
      maxAttempts: 7,
    });
  });

  it("TC-ORG-S015-UNIT-007 marks stale running exports failed with the reusable worker timeout category", async () => {
    const running = {
      ...baseRecord,
      status: "running" as const,
      jobId: "66666666-6666-4666-8666-666666666666",
      updatedAt: new Date("2026-05-16T10:00:00.000Z"),
    };
    const repository = createRepository(running);
    repository.listRunningOlderThan = vi.fn(async () => [running]);
    repository.markFailed = vi.fn(async (_exportId, failureCategory) => ({
      ...running,
      status: "failed" as const,
      failureCategory,
    }));
    const service = createOrganizationExportsService({
      repository,
      storage: createStorage(vi.fn()),
      secret: "test-secret",
      organizationCoreService: { getOrganization: vi.fn() } as never,
    });

    const result = await service.failTimedOutExports({
      now: new Date("2026-05-16T10:31:00.000Z"),
      timeoutMs: 30 * 60 * 1000,
    });

    expect(result).toEqual({ inspected: 1, timedOut: 1 });
    expect(repository.markFailed).toHaveBeenCalledWith(running.organizationExportId, "worker_timeout");
    expect(repository.recordAttempt).toHaveBeenCalledWith(expect.objectContaining({
      organizationExportId: running.organizationExportId,
      jobId: running.jobId,
      status: "failed",
      failureCategory: "worker_timeout",
    }));
    expect(repository.recordAuditEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventType: "organization_export_worker_timeout",
      eventDetails: expect.objectContaining({
        failureCategory: "worker_timeout",
      }),
    }));
  });

  it("TC-ORG-S015-UNIT-008 registers timeout sweep as a platform-internal maintenance job", async () => {
    const failTimedOutExports = vi.fn(async () => ({ inspected: 0, timedOut: 0 }));
    const jobs = createOrganizationExportJobTypes({
      generateExport: vi.fn(),
      cleanupExpiredExports: vi.fn(),
      failTimedOutExports,
    } as never);
    const timeoutJob = jobs.find((job) => job.jobType === ORGANIZATION_EXPORT_TIMEOUT_SWEEP_JOB_TYPE);

    expect(timeoutJob).toMatchObject({
      ownerFeature: "organizationExports",
      executionScope: "platform-internal",
      defaultQueue: "bulk",
    });
    await timeoutJob?.handler({ limit: 10, timeoutMs: 1_800_000 }, {
      jobId: "job-2",
      jobType: ORGANIZATION_EXPORT_TIMEOUT_SWEEP_JOB_TYPE,
      payloadVersion: 1,
      tenantId: null,
      executionScope: "platform-internal",
      workerId: "worker-1",
      attemptNumber: 1,
      idempotencyKey: null,
    });
    expect(failTimedOutExports).toHaveBeenCalledWith({
      limit: 10,
      timeoutMs: 1_800_000,
    });
  });

  it("TC-ORG-S015-UNIT-006 and TC-ORG-S015-UNIT-008 expose recurring export maintenance schedules", () => {
    const jobs = createOrganizationExportJobTypes({
      cleanupExpiredExports: vi.fn(),
      failTimedOutExports: vi.fn(),
    } as never);
    const jobRegistry = createJobTypeRegistry(jobs);
    const scheduleRegistry = createRecurringScheduleRegistry({
      jobRegistry,
      definitions: createOrganizationExportRecurringSchedules(),
    });

    expect(scheduleRegistry.list()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          scheduleKey: "organization-export.cleanup-expired-v1",
          jobType: ORGANIZATION_EXPORT_CLEANUP_JOB_TYPE,
          cadenceSeconds: 60 * 60,
          queueName: "bulk",
        }),
        expect.objectContaining({
          scheduleKey: "organization-export.timeout-sweep-v1",
          jobType: ORGANIZATION_EXPORT_TIMEOUT_SWEEP_JOB_TYPE,
          cadenceSeconds: 60 * 60,
          queueName: "bulk",
        }),
      ]),
    );
    expect(scheduleRegistry.buildEnqueueRequest({
      scheduleKey: "organization-export.cleanup-expired-v1",
      dueSlotAt: new Date("2026-05-16T10:00:00.000Z"),
    })).toMatchObject({
      jobType: ORGANIZATION_EXPORT_CLEANUP_JOB_TYPE,
      executionScope: "platform-internal",
      idempotencyKey: "recurring-schedule:organization-export.cleanup-expired-v1:2026-05-16T10:00:00.000Z",
      requestedByActorType: "system",
    });
  });

  it("TC-ORG-S015-UNIT-009 writes implemented Organization sections into the generated export bundle", async () => {
    const queued: OrganizationExportRecord = {
      ...baseRecord,
      status: "queued" as const,
      selectedSections: [
        "organizations",
        "legalProfiles",
        "locations",
        "openingHours",
        "businessUnits",
        "memberships",
        "referenceValues",
        "branding",
        "logos",
      ],
      storageKey: null,
      pinSecretEncrypted: null,
    };
    const repository = createRepository(queued);
    let encryptedPin = "";
    repository.markReady = vi.fn(async (input) => {
      encryptedPin = input.pinSecretEncrypted;
      return {
        ...queued,
        status: "ready" as const,
        storageKey: input.storageKey,
        pinSecretEncrypted: input.pinSecretEncrypted,
        sizeBytes: input.sizeBytes,
        checksumSha256: input.checksumSha256,
        generatedAt: input.generatedAt,
        expiresAt: input.expiresAt,
      };
    });
    let zipContent = Buffer.alloc(0);
    const service = createOrganizationExportsService({
      repository,
      storage: {
        ...createStorage(vi.fn()),
        writeObject: vi.fn(async (input) => {
          zipContent = Buffer.isBuffer(input.content) ? input.content : Buffer.from(input.content);
          return {
            storageKey: input.storageKey,
            byteSize: zipContent.byteLength,
            contentType: input.contentType,
            checksumSha256: "b".repeat(64),
          };
        }),
      },
      secret: "test-secret",
      organizationCoreService: {
        getOrganization: vi.fn(async () => ({
          organizationId: queued.sourceOrganizationId,
          tenantId: queued.tenantId,
          name: "Export Org",
        })),
      } as never,
      legalDetailsService: {
        listLegalProfilesForExport: vi.fn(async () => [{ legalName: "Export Org Ltd" }]),
      } as never,
      locationsService: {
        listLocationsForExport: vi.fn(async () => [{ locationId: "loc-1", locationName: "HQ" }]),
      } as never,
      openingHoursService: {
        listWeeklySlots: vi.fn(async () => ({
          items: [{ weeklyOpeningHoursId: "slot-1", locationId: "loc-1" }],
          page: 1,
          pageSize: 100,
          totalPages: 1,
          totalMatchingRecords: 1,
          totalSearchableRecords: 1,
        })),
        listExceptions: vi.fn(async () => ({
          items: [{ openingHoursExceptionId: "exception-1", locationId: "loc-1" }],
          page: 1,
          pageSize: 100,
          totalPages: 1,
          totalMatchingRecords: 1,
          totalSearchableRecords: 1,
        })),
      } as never,
      businessUnitsService: {
        listBusinessUnits: vi.fn(async () => ({
          items: [{ businessUnitId: "unit-1", name: "Operations" }],
          page: 1,
          pageSize: 100,
          totalPages: 1,
          totalMatchingRecords: 1,
          totalSearchableRecords: 1,
        })),
      } as never,
      membershipsService: {
        listMembershipsForExport: vi.fn(async () => ({
          items: [{ membershipId: "membership-1", businessUnitId: "unit-1" }],
          page: 1,
          pageSize: 100,
          totalPages: 1,
          totalMatchingRecords: 1,
          totalSearchableRecords: 1,
        })),
      } as never,
      referenceCataloguesService: {
        listReferenceValues: vi.fn(async () => ({
          items: [{ referenceValueId: "ref-1", referenceType: "organization_type" }],
          page: 1,
          pageSize: 100,
          totalPages: 1,
          totalMatchingRecords: 1,
          totalSearchableRecords: 1,
        })),
      } as never,
      brandingService: {
        getPrimaryLogo: vi.fn(async () => ({
          status: "placeholder",
          organizationId: queued.sourceOrganizationId,
          logoType: "primary",
        })),
      } as never,
    });

    await service.generateExport({
      tenantId: queued.tenantId,
      organizationExportId: queued.organizationExportId,
      jobId: null,
    });

    const password = decryptExportPin(encryptedPin, "test-secret");
    await expect(readPasswordProtectedZipTextEntry({ content: zipContent, password, path: "opening-hours/weekly-slots.json" })).resolves.toContain("slot-1");
    await expect(readPasswordProtectedZipTextEntry({ content: zipContent, password, path: "opening-hours/exceptions.json" })).resolves.toContain("exception-1");
    await expect(readPasswordProtectedZipTextEntry({ content: zipContent, password, path: "business-units/business-units.json" })).resolves.toContain("Operations");
    await expect(readPasswordProtectedZipTextEntry({ content: zipContent, password, path: "business-units/memberships.json" })).resolves.toContain("membership-1");
    await expect(readPasswordProtectedZipTextEntry({ content: zipContent, password, path: "reference-values/reference-values.json" })).resolves.toContain("organization_type");
    await expect(readPasswordProtectedZipTextEntry({ content: zipContent, password, path: "branding/primary-logo.json" })).resolves.toContain("primary");
  });
});
