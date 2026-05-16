import type { OrganizationExportRecord } from "./types";

export function toOrganizationExport(record: OrganizationExportRecord) {
  return {
    organizationExportId: record.organizationExportId,
    tenantId: record.tenantId,
    sourceOrganizationId: record.sourceOrganizationId,
    actorType: record.actorType,
    authorityWorld: record.authorityWorld,
    selectedSections: record.selectedSections,
    visibilityScope: record.visibilityScope,
    organizationScope: record.organizationScope,
    status: record.status,
    pinAvailable: record.status === "ready" && Boolean(record.pinSecretEncrypted),
    downloadAvailable: record.status === "ready" && Boolean(record.storageKey),
    downloadAttemptCount: record.downloadAttemptCount,
    notificationStatus: record.notificationStatus,
    sizeBytes: record.sizeBytes,
    checksumSha256: record.checksumSha256,
    failureCategory: record.failureCategory,
    generatedAt: record.generatedAt?.toISOString() ?? null,
    expiresAt: record.expiresAt?.toISOString() ?? null,
    cleanupEligibleAt: record.cleanupEligibleAt?.toISOString() ?? null,
    cleanupFailureCategory: record.cleanupFailureCategory,
    cleanupAttemptCount: record.cleanupAttemptCount,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    deletedAt: record.deletedAt?.toISOString() ?? null,
  };
}
