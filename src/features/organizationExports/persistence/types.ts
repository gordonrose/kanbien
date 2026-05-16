import type {
  CreateOrganizationExportInput,
  OrganizationExportAttemptInput,
  OrganizationExportAuditEventInput,
  OrganizationExportRecord,
  OrganizationExportStatus,
} from "../domain/types";

export interface OrganizationExportRepository {
  create(input: CreateOrganizationExportInput & { organizationExportId: string }): Promise<OrganizationExportRecord>;
  list(input: {
    tenantId: string;
    actorId: string;
    status?: OrganizationExportStatus;
    page: number;
    pageSize: number;
  }): Promise<{ items: OrganizationExportRecord[]; totalMatchingRecords: number }>;
  findById(tenantId: string, exportId: string): Promise<OrganizationExportRecord | null>;
  listCleanupEligible(input: {
    now: Date;
    limit: number;
  }): Promise<OrganizationExportRecord[]>;
  listRunningOlderThan(input: {
    olderThan: Date;
    limit: number;
  }): Promise<OrganizationExportRecord[]>;
  updateJobId(exportId: string, jobId: string): Promise<void>;
  markRunning(exportId: string, jobId: string | null): Promise<OrganizationExportRecord | null>;
  markReady(input: {
    exportId: string;
    storageKey: string;
    pinSecretEncrypted: string;
    sizeBytes: number;
    checksumSha256: string;
    generatedAt: Date;
    expiresAt: Date;
  }): Promise<OrganizationExportRecord | null>;
  markFailed(exportId: string, failureCategory: string): Promise<OrganizationExportRecord | null>;
  markCancelRequested(exportId: string): Promise<OrganizationExportRecord | null>;
  markCancelled(exportId: string): Promise<OrganizationExportRecord | null>;
  markRetrying(input: {
    exportId: string;
    selectedSections: string[];
    visibilityScope: string;
    organizationScope: string;
  }): Promise<OrganizationExportRecord | null>;
  markDeleted(exportId: string): Promise<OrganizationExportRecord | null>;
  markExpired(exportId: string): Promise<OrganizationExportRecord | null>;
  markCleanupFailed(exportId: string, failureCategory: string): Promise<OrganizationExportRecord | null>;
  markCleanupRetry(input: {
    exportId: string;
    failureCategory: string;
    nextEligibleAt: Date;
  }): Promise<OrganizationExportRecord | null>;
  markCleanupOperatorReview(exportId: string, failureCategory: string): Promise<OrganizationExportRecord | null>;
  markCleanupComplete(exportId: string): Promise<OrganizationExportRecord | null>;
  markNotificationStatus(exportId: string, status: "sent" | "failed" | "not_applicable"): Promise<OrganizationExportRecord | null>;
  recordPinViewed(exportId: string): Promise<OrganizationExportRecord | null>;
  incrementDownloadCount(exportId: string): Promise<void>;
  recordAttempt(input: OrganizationExportAttemptInput): Promise<void>;
  recordAuditEvent(input: OrganizationExportAuditEventInput): Promise<void>;
}
