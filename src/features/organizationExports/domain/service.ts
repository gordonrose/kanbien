import { randomBytes, randomUUID } from "node:crypto";
import type { ObjectStorageAdapter } from "../../../lib/storage/types";
import {
  createPasswordProtectedZipBundle,
  type ExportZipEntry,
} from "../../../lib/exportBundles/passwordProtectedZip";
import type { AssetsService } from "../../assets";
import type { NotificationEmailWriter } from "../../notificationDelivery";
import type { OrganizationBrandingReferencesService } from "../../organizationBrandingReferences";
import type { OrganizationBusinessUnitMembershipsService } from "../../organizationBusinessUnitMemberships";
import type { OrganizationBusinessUnitsService } from "../../organizationBusinessUnits";
import {
  JOB_LIFECYCLE_FAILURE_CATEGORIES,
  classifyJobLifecycleTimeout,
  type EnqueueJobRequest,
} from "../../jobProcessing";
import type { OrganizationCoreService } from "../../organizationCore";
import type { OrganizationLegalDetailsService } from "../../organizationLegalDetails";
import type { OrganizationLocationsService } from "../../organizationLocations";
import type { OrganizationOpeningHoursService } from "../../organizationOpeningHours";
import type { OrganizationReferenceCataloguesService } from "../../organizationReferenceCatalogues";
import {
  OrganizationExportExpiredError,
  OrganizationExportForbiddenError,
  OrganizationExportNotFoundError,
  OrganizationExportNotReadyError,
} from "../contract/errors";
import type { OrganizationExportRepository } from "../persistence/types";
import { toOrganizationExport } from "./presenters";
import { decryptExportPin, encryptExportPin } from "./secretBox";
import {
  ORGANIZATION_EXPORT_GENERATE_JOB_TYPE,
  ORGANIZATION_EXPORT_GENERATE_PAYLOAD_VERSION,
} from "./jobTypes";
import type {
  CreateOrganizationExportInput,
  ExportIdentityInput,
  OrganizationExportRecord,
  RetryOrganizationExportInput,
} from "./types";

export interface OrganizationExportJobEnqueuer {
  enqueueTransactionalJobRequest(request: EnqueueJobRequest): Promise<{ jobId?: string } | unknown>;
}

export interface OrganizationExportsService {
  createExport(input: CreateOrganizationExportInput): Promise<ReturnType<typeof toOrganizationExport>>;
  listExports(input: {
    tenantId: string;
    actorId: string;
    status?: OrganizationExportRecord["status"];
    page: number;
    pageSize: number;
  }): Promise<{ items: ReturnType<typeof toOrganizationExport>[]; page: number; pageSize: number; totalMatchingRecords: number }>;
  getExport(input: ExportIdentityInput): Promise<ReturnType<typeof toOrganizationExport>>;
  viewPin(input: ExportIdentityInput): Promise<{ pin: string; viewedAt: string | null }>;
  downloadExport(input: ExportIdentityInput): Promise<{ stream: NodeJS.ReadableStream; headers: Record<string, string> }>;
  cancelExport(input: ExportIdentityInput): Promise<ReturnType<typeof toOrganizationExport>>;
  retryExport(input: RetryOrganizationExportInput): Promise<ReturnType<typeof toOrganizationExport>>;
  deleteExport(input: ExportIdentityInput): Promise<ReturnType<typeof toOrganizationExport>>;
  generateExport(input: { tenantId: string; organizationExportId: string; jobId?: string | null }): Promise<void>;
  cleanupExpiredExports(input?: {
    now?: Date;
    limit?: number;
    maxAttempts?: number;
  }): Promise<{
    inspected: number;
    deletedObjects: number;
    failedDeletes: number;
    operatorReviewRequired: number;
  }>;
  failTimedOutExports(input?: {
    now?: Date;
    timeoutMs?: number;
    limit?: number;
  }): Promise<{
    inspected: number;
    timedOut: number;
  }>;
}

function pin(): string {
  return randomBytes(9).toString("base64url");
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }
  return Buffer.concat(chunks);
}

function assertRequester(record: OrganizationExportRecord, input: ExportIdentityInput): void {
  if (record.actorId !== input.actorId || record.tenantId !== input.tenantId) {
    throw new OrganizationExportForbiddenError({ field: "exportId", reason: "requester_mismatch" });
  }
}

function assertAvailable(record: OrganizationExportRecord): void {
  if (
    record.status === "expired" ||
    record.status === "deleted" ||
    record.deletedAt ||
    (record.expiresAt && record.expiresAt.getTime() <= Date.now())
  ) {
    throw new OrganizationExportExpiredError({ field: "exportId", reason: record.status });
  }
}

function cleanupRetryDelayMs(attemptCount: number): number {
  const baseMs = 60 * 60 * 1000;
  const multiplier = Math.min(Math.max(attemptCount, 1), 24);
  return baseMs * multiplier;
}

const DEFAULT_EXPORT_WORKER_TIMEOUT_MS = 30 * 60 * 1000;

async function collectPages<T>(
  loader: (page: number) => Promise<{ items: T[]; totalPages: number }>,
): Promise<T[]> {
  const collected: T[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const result = await loader(page);
    collected.push(...result.items);
    totalPages = result.totalPages;
    page += 1;
  } while (page <= totalPages);
  return collected;
}

export function createOrganizationExportsService(input: {
  repository: OrganizationExportRepository;
  storage: ObjectStorageAdapter;
  secret: string;
  organizationCoreService: OrganizationCoreService;
  legalDetailsService?: OrganizationLegalDetailsService;
  locationsService?: OrganizationLocationsService;
  openingHoursService?: OrganizationOpeningHoursService;
  businessUnitsService?: OrganizationBusinessUnitsService;
  membershipsService?: OrganizationBusinessUnitMembershipsService;
  referenceCataloguesService?: OrganizationReferenceCataloguesService;
  brandingService?: OrganizationBrandingReferencesService;
  assetsService?: AssetsService;
  jobEnqueuer?: OrganizationExportJobEnqueuer;
  notificationService?: NotificationEmailWriter;
  notificationRecipientResolver?: (record: OrganizationExportRecord) => Promise<string | null>;
}): OrganizationExportsService {
  const { repository, storage } = input;

  async function audit(record: OrganizationExportRecord | null, eventType: string, actorId: string, details: Record<string, unknown> = {}) {
    await repository.recordAuditEvent({
      eventId: randomUUID(),
      organizationExportId: record?.organizationExportId ?? null,
      tenantId: record?.tenantId ?? String(details.tenantId ?? "00000000-0000-0000-0000-000000000000"),
      actorType: record?.actorType ?? "system",
      actorId,
      eventType,
      eventOutcome: "success",
      eventDetails: details,
      occurredAt: new Date(),
    });
  }

  async function loadForRequester(inputRecord: ExportIdentityInput): Promise<OrganizationExportRecord> {
    const record = await repository.findById(inputRecord.tenantId, inputRecord.organizationExportId);
    if (!record) throw new OrganizationExportNotFoundError();
    assertRequester(record, inputRecord);
    return record;
  }

  async function enqueue(record: OrganizationExportRecord): Promise<void> {
    if (!input.jobEnqueuer) return;
    const enqueued = await input.jobEnqueuer.enqueueTransactionalJobRequest({
      jobType: ORGANIZATION_EXPORT_GENERATE_JOB_TYPE,
      payloadVersion: ORGANIZATION_EXPORT_GENERATE_PAYLOAD_VERSION,
      payload: { organizationExportId: record.organizationExportId, tenantId: record.tenantId },
      executionScope: "tenant",
      tenantId: record.tenantId,
      queueName: "bulk",
      idempotencyKey: `organization-export:${record.organizationExportId}:${record.updatedAt.toISOString()}`,
      requestedByActorType: record.actorType === "root-user" ? "root_user" : "tenant_user",
      requestedByActorId: record.actorId,
      relatedEntityType: "organization_export",
      relatedEntityId: record.organizationExportId,
    });
    const jobId = typeof enqueued === "object" && enqueued && "jobId" in enqueued ? String(enqueued.jobId) : null;
    if (jobId) await repository.updateJobId(record.organizationExportId, jobId);
  }

  async function sendNotification(inputNotification: {
    record: OrganizationExportRecord;
    type: "ready" | "failed";
    pin?: string;
    failureCategory?: string | null;
  }): Promise<void> {
    if (!input.notificationService || !input.notificationRecipientResolver) {
      await repository.markNotificationStatus(inputNotification.record.organizationExportId, "not_applicable");
      return;
    }
    const recipientEmail = await input.notificationRecipientResolver(inputNotification.record);
    if (!recipientEmail) {
      await repository.markNotificationStatus(inputNotification.record.organizationExportId, "not_applicable");
      return;
    }
    const subject =
      inputNotification.type === "ready"
        ? "Your Organization export is ready"
        : "Your Organization export could not be generated";
    const bodyText =
      inputNotification.type === "ready"
        ? [
            "Your Organization export is ready.",
            `Export ID: ${inputNotification.record.organizationExportId}`,
            `PIN: ${inputNotification.pin}`,
            "You must be logged in as the requesting admin to download it.",
          ].join("\n")
        : [
            "Your Organization export could not be generated.",
            `Export ID: ${inputNotification.record.organizationExportId}`,
            `Reason: ${inputNotification.failureCategory ?? "generation_failed"}`,
            "You can retry the export from the export status view.",
          ].join("\n");
    try {
      await input.notificationService.sendEmail({
        recipientEmail,
        subject,
        bodyText,
        notificationType: inputNotification.type === "ready" ? "organization_export_ready" : "organization_export_failed",
        tenantId: inputNotification.record.tenantId,
        relatedEntityType: "organization_export",
        relatedEntityId: inputNotification.record.organizationExportId,
        templateKey: inputNotification.type === "ready" ? "organization-export-ready-v1" : "organization-export-failed-v1",
        createdByActorType: "system",
        createdByActorId: "organization-export-worker",
      });
      await repository.markNotificationStatus(inputNotification.record.organizationExportId, "sent");
    } catch {
      await repository.markNotificationStatus(inputNotification.record.organizationExportId, "failed");
      await audit(inputNotification.record, "organization_export_notification_failed", "organization-export-worker", {
        notificationType: inputNotification.type,
      });
    }
  }

  return {
    async createExport(createInput) {
      await input.organizationCoreService.getOrganization({
        tenantId: createInput.tenantId,
        organizationId: createInput.sourceOrganizationId,
      });
      const record = await repository.create({
        ...createInput,
        organizationExportId: randomUUID(),
      });
      await audit(record, "organization_export_created", createInput.actorId, {
        selectedSections: createInput.selectedSections,
      });
      await enqueue(record);
      return toOrganizationExport(record);
    },
    async listExports(listInput) {
      const result = await repository.list(listInput);
      return {
        items: result.items.map(toOrganizationExport),
        page: listInput.page,
        pageSize: listInput.pageSize,
        totalMatchingRecords: result.totalMatchingRecords,
      };
    },
    async getExport(identity) {
      return toOrganizationExport(await loadForRequester(identity));
    },
    async viewPin(identity) {
      const record = await loadForRequester(identity);
      if (record.expiresAt && record.expiresAt.getTime() <= Date.now()) {
        await repository.markExpired(record.organizationExportId);
        throw new OrganizationExportExpiredError({ field: "exportId", reason: "expired" });
      }
      assertAvailable(record);
      if (record.status !== "ready" || !record.pinSecretEncrypted) {
        throw new OrganizationExportNotReadyError({ field: "exportId", reason: "pin_unavailable" });
      }
      const updated = await repository.recordPinViewed(record.organizationExportId);
      await audit(record, "organization_export_pin_viewed", identity.actorId);
      return {
        pin: decryptExportPin(record.pinSecretEncrypted, input.secret),
        viewedAt: updated?.pinViewedAt?.toISOString() ?? null,
      };
    },
    async downloadExport(identity) {
      const record = await loadForRequester(identity);
      assertAvailable(record);
      if (record.status !== "ready" || !record.storageKey) {
        throw new OrganizationExportNotReadyError({ field: "exportId", reason: "download_unavailable" });
      }
      if (record.expiresAt && record.expiresAt.getTime() <= Date.now()) {
        await repository.markExpired(record.organizationExportId);
        throw new OrganizationExportExpiredError({ field: "exportId", reason: "expired" });
      }
      const object = await storage.readObject(record.storageKey);
      await repository.incrementDownloadCount(record.organizationExportId);
      await audit(record, "organization_export_downloaded", identity.actorId);
      return {
        stream: object.stream,
        headers: {
          "Content-Type": "application/zip",
          "Content-Length": String(object.metadata.byteSize),
          "Content-Disposition": `attachment; filename="organization-export-${record.organizationExportId}.zip"`,
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "private, no-store",
        },
      };
    },
    async cancelExport(identity) {
      const record = await loadForRequester(identity);
      if (!["queued", "running", "retrying"].includes(record.status)) {
        throw new OrganizationExportNotReadyError({ field: "exportId", reason: "not_cancelable" });
      }
      const updated = record.status === "queued"
        ? await repository.markCancelled(record.organizationExportId)
        : await repository.markCancelRequested(record.organizationExportId);
      await audit(record, "organization_export_cancel_requested", identity.actorId);
      return toOrganizationExport(updated ?? record);
    },
    async retryExport(retryInput) {
      const record = await loadForRequester(retryInput);
      if (record.status !== "failed") {
        throw new OrganizationExportNotReadyError({ field: "exportId", reason: "not_retryable" });
      }
      const updated = await repository.markRetrying({
        exportId: record.organizationExportId,
        selectedSections: retryInput.selectedSections ?? record.selectedSections,
        visibilityScope: retryInput.visibilityScope ?? record.visibilityScope,
        organizationScope: retryInput.organizationScope ?? record.organizationScope,
      });
      await audit(record, "organization_export_retry_requested", retryInput.actorId);
      await enqueue(updated ?? record);
      return toOrganizationExport(updated ?? record);
    },
    async deleteExport(identity) {
      const record = await loadForRequester(identity);
      const updated = await repository.markDeleted(record.organizationExportId);
      if (record.storageKey) {
        try {
          await storage.deleteObject(record.storageKey);
        } catch {
          const cleanupFailed = await repository.markCleanupFailed(record.organizationExportId, "delete_failed");
          await audit(cleanupFailed ?? record, "organization_export_cleanup_failed", identity.actorId, {
            failureCategory: "delete_failed",
          });
          return toOrganizationExport(cleanupFailed ?? updated ?? record);
        }
      }
      await audit(record, "organization_export_deleted", identity.actorId);
      return toOrganizationExport(updated ?? record);
    },
    async generateExport(generateInput) {
      const record = await repository.findById(generateInput.tenantId, generateInput.organizationExportId);
      if (!record) return;
      if (record.status === "cancel_requested" || record.status === "cancelled" || record.status === "deleted") return;
      await repository.recordAttempt({
        attemptId: randomUUID(),
        organizationExportId: record.organizationExportId,
        jobId: generateInput.jobId ?? null,
        status: "running",
      });
      await repository.markRunning(record.organizationExportId, generateInput.jobId ?? null);
      try {
        const organization = await input.organizationCoreService.getOrganization({
          tenantId: record.tenantId,
          organizationId: record.sourceOrganizationId,
        });
        const data: Record<string, unknown> = {
          manifest: {
            schemaVersion: 1,
            exportId: record.organizationExportId,
            generatedAt: new Date().toISOString(),
            tenantId: record.tenantId,
            sourceOrganizationId: record.sourceOrganizationId,
            selectedSections: record.selectedSections,
            visibilityScope: record.visibilityScope,
            organizationScope: record.organizationScope,
          },
        };
        data.organizations = [organization];
        if (record.selectedSections.includes("legalProfiles") && input.legalDetailsService) {
          data.legalProfiles = await input.legalDetailsService.listLegalProfilesForExport({
            tenantId: record.tenantId,
            organizationId: record.sourceOrganizationId,
            includeArchived: record.visibilityScope === "include_retained",
          });
        }
        if (record.selectedSections.includes("locations") && input.locationsService) {
          data.locations = await input.locationsService.listLocationsForExport({
            tenantId: record.tenantId,
            organizationId: record.sourceOrganizationId,
            includeArchived: record.visibilityScope === "include_retained",
          });
        }
        if (record.selectedSections.includes("openingHours") && input.openingHoursService && input.locationsService) {
          const locations = (data.locations as Array<{ locationId: string }> | undefined)
            ?? await input.locationsService.listLocationsForExport({
              tenantId: record.tenantId,
              organizationId: record.sourceOrganizationId,
              includeArchived: record.visibilityScope === "include_retained",
            });
          data.openingHours = {
            weeklySlots: (
              await Promise.all(locations.map((location) =>
                collectPages((page) => input.openingHoursService!.listWeeklySlots({
                  tenantId: record.tenantId,
                  organizationId: record.sourceOrganizationId,
                  locationId: location.locationId,
                  page,
                  pageSize: 100,
                  orderBy: "updatedAt",
                  orderDirection: "desc",
                })),
              ))
            ).flat(),
            exceptions: (
              await Promise.all(locations.map((location) =>
                collectPages((page) => input.openingHoursService!.listExceptions({
                  tenantId: record.tenantId,
                  organizationId: record.sourceOrganizationId,
                  locationId: location.locationId,
                  page,
                  pageSize: 100,
                  orderBy: "updatedAt",
                  orderDirection: "desc",
                })),
              ))
            ).flat(),
          };
        }
        if (record.selectedSections.includes("businessUnits") && input.businessUnitsService) {
          data.businessUnits = await collectPages((page) => input.businessUnitsService!.listBusinessUnits({
            tenantId: record.tenantId,
            organizationId: record.sourceOrganizationId,
            page,
            pageSize: 100,
            orderBy: "updatedAt",
            orderDirection: "desc",
            includeArchived: record.visibilityScope === "include_retained",
          }));
        }
        if (record.selectedSections.includes("memberships") && input.membershipsService) {
          data.memberships = await collectPages((page) => input.membershipsService!.listMembershipsForExport({
            tenantId: record.tenantId,
            organizationId: record.sourceOrganizationId,
            page,
            pageSize: 100,
            orderBy: "updatedAt",
            orderDirection: "desc",
            includeArchived: record.visibilityScope === "include_retained",
          }));
        }
        if (record.selectedSections.includes("referenceValues") && input.referenceCataloguesService) {
          data.referenceValues = await collectPages((page) => input.referenceCataloguesService!.listReferenceValues({
            page,
            pageSize: 100,
            orderBy: "updatedAt",
            orderDirection: "desc",
            includeRetained: record.visibilityScope === "include_retained",
          }));
        }
        if ((record.selectedSections.includes("branding") || record.selectedSections.includes("logos")) && input.brandingService) {
          data.branding = {
            primaryLogo: await input.brandingService.getPrimaryLogo({
              tenantId: record.tenantId,
              organizationId: record.sourceOrganizationId,
            }),
          };
        }

        const entries: ExportZipEntry[] = [
          { path: "manifest.json", content: JSON.stringify(data.manifest, null, 2) },
          { path: "organizations/organizations.json", content: JSON.stringify(data.organizations, null, 2) },
        ];
        if (data.legalProfiles) entries.push({ path: "legal-details/legal-profiles.json", content: JSON.stringify(data.legalProfiles, null, 2) });
        if (data.locations) entries.push({ path: "locations/locations.json", content: JSON.stringify(data.locations, null, 2) });
        if (data.openingHours) {
          const openingHours = data.openingHours as { weeklySlots: unknown[]; exceptions: unknown[] };
          entries.push({ path: "opening-hours/weekly-slots.json", content: JSON.stringify(openingHours.weeklySlots, null, 2) });
          entries.push({ path: "opening-hours/exceptions.json", content: JSON.stringify(openingHours.exceptions, null, 2) });
        }
        if (data.businessUnits) entries.push({ path: "business-units/business-units.json", content: JSON.stringify(data.businessUnits, null, 2) });
        if (data.memberships) entries.push({ path: "business-units/memberships.json", content: JSON.stringify(data.memberships, null, 2) });
        if (data.referenceValues) entries.push({ path: "reference-values/reference-values.json", content: JSON.stringify(data.referenceValues, null, 2) });
        if (data.branding) entries.push({ path: "branding/primary-logo.json", content: JSON.stringify(data.branding, null, 2) });

        if (record.selectedSections.includes("logos") && input.assetsService) {
          // Actual uploaded logo files are included when a ready relationship exists.
          const logo = await input.brandingService?.getPrimaryLogo({
            tenantId: record.tenantId,
            organizationId: record.sourceOrganizationId,
          });
          if (logo && typeof logo === "object" && "assetId" in logo && typeof logo.assetId === "string") {
            const content = await input.assetsService.readAssetContent({
              actor: { actorType: "internal", actorId: "organization-export-worker" },
              assetId: logo.assetId,
            });
            entries.push({
              path: `logos/primary-${logo.assetId}`,
              content: await streamToBuffer(content.stream),
            });
          }
        }

        const password = pin();
        const bundle = await createPasswordProtectedZipBundle({ entries, password });
        const storageKey = `tenant/${record.tenantId}/organization-exports/${record.organizationExportId}.zip`;
        const metadata = await storage.writeObject({
          storageKey,
          content: bundle.content,
          contentType: bundle.contentType,
          checksumSha256: bundle.checksumSha256,
        });
        const now = new Date();
        const latest = await repository.findById(record.tenantId, record.organizationExportId);
        if (latest?.status === "cancel_requested" || latest?.status === "cancelled" || latest?.status === "deleted") {
          await storage.deleteObject(storageKey).catch(async () => {
            await repository.markCleanupFailed(record.organizationExportId, "cancelled_output_delete_failed");
          });
          await repository.markCancelled(record.organizationExportId);
          return;
        }
        const ready = await repository.markReady({
          exportId: record.organizationExportId,
          storageKey,
          pinSecretEncrypted: encryptExportPin(password, input.secret),
          sizeBytes: metadata.byteSize,
          checksumSha256: metadata.checksumSha256 ?? bundle.checksumSha256,
          generatedAt: now,
          expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        });
        if (ready) {
          await sendNotification({ record: ready, type: "ready", pin: password });
        }
        await repository.recordAttempt({
          attemptId: randomUUID(),
          organizationExportId: record.organizationExportId,
          jobId: generateInput.jobId ?? null,
          status: "succeeded",
        });
      } catch (error) {
        const failed = await repository.markFailed(record.organizationExportId, "generation_failed");
        if (failed) {
          await sendNotification({
            record: failed,
            type: "failed",
            failureCategory: "generation_failed",
          });
        }
        await repository.recordAttempt({
          attemptId: randomUUID(),
          organizationExportId: record.organizationExportId,
          jobId: generateInput.jobId ?? null,
          status: "failed",
          failureCategory: "generation_failed",
          failureSummary: error instanceof Error ? error.message.slice(0, 500) : "unknown_error",
        });
        throw error;
      }
    },
    async cleanupExpiredExports(cleanupInput = {}) {
      const now = cleanupInput.now ?? new Date();
      const limit = cleanupInput.limit ?? 50;
      const maxAttempts = cleanupInput.maxAttempts ?? 7;
      const records = await repository.listCleanupEligible({ now, limit });
      let deletedObjects = 0;
      let failedDeletes = 0;
      let operatorReviewRequired = 0;

      for (const record of records) {
        if (!record.storageKey) continue;
        try {
          await storage.deleteObject(record.storageKey);
          const cleaned = await repository.markCleanupComplete(record.organizationExportId);
          await audit(cleaned ?? record, "organization_export_cleanup_completed", "organization-export-cleanup-worker", {
            cleanupReason: record.status,
          });
          deletedObjects += 1;
        } catch {
          const nextAttemptCount = record.cleanupAttemptCount + 1;
          failedDeletes += 1;
          if (nextAttemptCount >= maxAttempts) {
            const review = await repository.markCleanupOperatorReview(
              record.organizationExportId,
              "operator_review_required",
            );
            await audit(review ?? record, "organization_export_cleanup_operator_review_required", "organization-export-cleanup-worker", {
              previousFailureCategory: record.cleanupFailureCategory,
              attemptCount: nextAttemptCount,
            });
            operatorReviewRequired += 1;
            continue;
          }
          const retry = await repository.markCleanupRetry({
            exportId: record.organizationExportId,
            failureCategory: "delete_failed",
            nextEligibleAt: new Date(now.getTime() + cleanupRetryDelayMs(nextAttemptCount)),
          });
          await audit(retry ?? record, "organization_export_cleanup_retry_scheduled", "organization-export-cleanup-worker", {
            attemptCount: nextAttemptCount,
          });
        }
      }

      return {
        inspected: records.length,
        deletedObjects,
        failedDeletes,
        operatorReviewRequired,
      };
    },
    async failTimedOutExports(timeoutInput = {}) {
      const now = timeoutInput.now ?? new Date();
      const timeoutMs = timeoutInput.timeoutMs ?? DEFAULT_EXPORT_WORKER_TIMEOUT_MS;
      const limit = timeoutInput.limit ?? 50;
      const olderThan = new Date(now.getTime() - timeoutMs);
      const records = await repository.listRunningOlderThan({ olderThan, limit });
      let timedOut = 0;

      for (const record of records) {
        const classification = classifyJobLifecycleTimeout({
          observedAt: record.updatedAt,
          now,
          timeoutMs,
        });
        if (!classification.timedOut || !classification.failureCategory) {
          continue;
        }
        const failed = await repository.markFailed(record.organizationExportId, classification.failureCategory);
        await repository.recordAttempt({
          attemptId: randomUUID(),
          organizationExportId: record.organizationExportId,
          jobId: record.jobId,
          status: "failed",
          failureCategory: classification.failureCategory,
          failureSummary: `running export exceeded ${timeoutMs}ms worker timeout`,
        });
        await audit(failed ?? record, "organization_export_worker_timeout", "organization-export-timeout-worker", {
          failureCategory: JOB_LIFECYCLE_FAILURE_CATEGORIES.workerTimeout,
          elapsedMs: classification.elapsedMs,
          timeoutMs,
        });
        timedOut += 1;
      }

      return {
        inspected: records.length,
        timedOut,
      };
    },
  };
}
