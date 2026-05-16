import {
  InvalidJobRequestError,
  type JobTypeDefinition,
  type RecurringScheduleRegistryDefinition,
} from "../../jobProcessing";
import type { OrganizationExportsService } from "./service";

export const ORGANIZATION_EXPORT_GENERATE_JOB_TYPE = "organization.export.generate";
export const ORGANIZATION_EXPORT_GENERATE_PAYLOAD_VERSION = 1;
export const ORGANIZATION_EXPORT_CLEANUP_JOB_TYPE = "organization.export.cleanup";
export const ORGANIZATION_EXPORT_CLEANUP_PAYLOAD_VERSION = 1;
export const ORGANIZATION_EXPORT_TIMEOUT_SWEEP_JOB_TYPE = "organization.export.timeout_sweep";
export const ORGANIZATION_EXPORT_TIMEOUT_SWEEP_PAYLOAD_VERSION = 1;

export interface OrganizationExportGenerateJobPayload {
  organizationExportId: string;
  tenantId: string;
}

export interface OrganizationExportCleanupJobPayload {
  limit?: number;
  maxAttempts?: number;
}

export interface OrganizationExportTimeoutSweepJobPayload {
  limit?: number;
  timeoutMs?: number;
}

export function assertOrganizationExportGenerateJobPayload(
  payload: unknown,
): asserts payload is OrganizationExportGenerateJobPayload {
  if (!payload || typeof payload !== "object") {
    throw new InvalidJobRequestError("organization export payload must be an object");
  }
  const record = payload as OrganizationExportGenerateJobPayload;
  if (typeof record.organizationExportId !== "string" || record.organizationExportId.trim() === "") {
    throw new InvalidJobRequestError("organizationExportId is required", {
      field: "organizationExportId",
      reason: "required",
    });
  }
  if (typeof record.tenantId !== "string" || record.tenantId.trim() === "") {
    throw new InvalidJobRequestError("tenantId is required", {
      field: "tenantId",
      reason: "required",
    });
  }
}

export function assertOrganizationExportCleanupJobPayload(
  payload: unknown,
): asserts payload is OrganizationExportCleanupJobPayload {
  if (!payload || typeof payload !== "object") {
    throw new InvalidJobRequestError("organization export cleanup payload must be an object");
  }
  const record = payload as OrganizationExportCleanupJobPayload;
  if (record.limit !== undefined && (!Number.isInteger(record.limit) || record.limit < 1 || record.limit > 500)) {
    throw new InvalidJobRequestError("cleanup limit must be between 1 and 500", {
      field: "limit",
      reason: "invalid_range",
    });
  }
  if (
    record.maxAttempts !== undefined &&
    (!Number.isInteger(record.maxAttempts) || record.maxAttempts < 1 || record.maxAttempts > 30)
  ) {
    throw new InvalidJobRequestError("cleanup maxAttempts must be between 1 and 30", {
      field: "maxAttempts",
      reason: "invalid_range",
    });
  }
}

export function assertOrganizationExportTimeoutSweepJobPayload(
  payload: unknown,
): asserts payload is OrganizationExportTimeoutSweepJobPayload {
  if (!payload || typeof payload !== "object") {
    throw new InvalidJobRequestError("organization export timeout sweep payload must be an object");
  }
  const record = payload as OrganizationExportTimeoutSweepJobPayload;
  if (record.limit !== undefined && (!Number.isInteger(record.limit) || record.limit < 1 || record.limit > 500)) {
    throw new InvalidJobRequestError("timeout sweep limit must be between 1 and 500", {
      field: "limit",
      reason: "invalid_range",
    });
  }
  if (
    record.timeoutMs !== undefined &&
    (!Number.isInteger(record.timeoutMs) || record.timeoutMs < 60_000 || record.timeoutMs > 24 * 60 * 60 * 1000)
  ) {
    throw new InvalidJobRequestError("timeoutMs must be between 60000 and 86400000.", {
      field: "timeoutMs",
      reason: "invalid_range",
    });
  }
}

export function createOrganizationExportJobTypes(service: OrganizationExportsService): JobTypeDefinition[] {
  return [
    {
      jobType: ORGANIZATION_EXPORT_GENERATE_JOB_TYPE,
      ownerFeature: "organizationExports",
      supportedPayloadVersions: {
        [ORGANIZATION_EXPORT_GENERATE_PAYLOAD_VERSION]: assertOrganizationExportGenerateJobPayload,
      },
      executionScope: "tenant",
      defaultQueue: "bulk",
      defaultPriority: 25,
      retryPolicy: {
        maxAttempts: 3,
        initialDelayMs: 60_000,
        maxDelayMs: 10 * 60_000,
        jitterRatio: 0.2,
      },
      handler: async (payload, context) => {
        assertOrganizationExportGenerateJobPayload(payload);
        await service.generateExport({
          tenantId: payload.tenantId,
          organizationExportId: payload.organizationExportId,
          jobId: context.jobId,
        });
      },
    },
    {
      jobType: ORGANIZATION_EXPORT_CLEANUP_JOB_TYPE,
      ownerFeature: "organizationExports",
      supportedPayloadVersions: {
        [ORGANIZATION_EXPORT_CLEANUP_PAYLOAD_VERSION]: assertOrganizationExportCleanupJobPayload,
      },
      executionScope: "platform-internal",
      defaultQueue: "bulk",
      defaultPriority: 10,
      retryPolicy: {
        maxAttempts: 1,
        initialDelayMs: 60_000,
        maxDelayMs: 60_000,
        jitterRatio: 0,
      },
      handler: async (payload) => {
        assertOrganizationExportCleanupJobPayload(payload);
        await service.cleanupExpiredExports({
          limit: payload.limit,
          maxAttempts: payload.maxAttempts,
        });
      },
    },
    {
      jobType: ORGANIZATION_EXPORT_TIMEOUT_SWEEP_JOB_TYPE,
      ownerFeature: "organizationExports",
      supportedPayloadVersions: {
        [ORGANIZATION_EXPORT_TIMEOUT_SWEEP_PAYLOAD_VERSION]: assertOrganizationExportTimeoutSweepJobPayload,
      },
      executionScope: "platform-internal",
      defaultQueue: "bulk",
      defaultPriority: 10,
      retryPolicy: {
        maxAttempts: 1,
        initialDelayMs: 60_000,
        maxDelayMs: 60_000,
        jitterRatio: 0,
      },
      handler: async (payload) => {
        assertOrganizationExportTimeoutSweepJobPayload(payload);
        await service.failTimedOutExports({
          limit: payload.limit,
          timeoutMs: payload.timeoutMs,
        });
      },
    },
  ];
}

export function createOrganizationExportRecurringSchedules(): RecurringScheduleRegistryDefinition[] {
  return [
    {
      scheduleKey: "organization-export.cleanup-expired-v1",
      jobType: ORGANIZATION_EXPORT_CLEANUP_JOB_TYPE,
      payloadVersion: ORGANIZATION_EXPORT_CLEANUP_PAYLOAD_VERSION,
      cadenceSeconds: 60 * 60,
      payloadFactory: () => ({ limit: 50, maxAttempts: 7 }),
      queueName: "bulk",
      priority: 10,
      relatedEntityType: "organization_export",
      relatedEntityId: "cleanup-expired",
    },
    {
      scheduleKey: "organization-export.timeout-sweep-v1",
      jobType: ORGANIZATION_EXPORT_TIMEOUT_SWEEP_JOB_TYPE,
      payloadVersion: ORGANIZATION_EXPORT_TIMEOUT_SWEEP_PAYLOAD_VERSION,
      cadenceSeconds: 60 * 60,
      payloadFactory: () => ({ limit: 50, timeoutMs: 30 * 60 * 1000 }),
      queueName: "bulk",
      priority: 10,
      relatedEntityType: "organization_export",
      relatedEntityId: "timeout-sweep",
    },
  ];
}
