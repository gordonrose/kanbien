export type OrganizationExportActorType = "root-user" | "tenant-admin" | "system";
export type OrganizationExportAuthorityWorld = "root" | "tenant";
export type OrganizationExportSection =
  | "organizations"
  | "legalProfiles"
  | "locations"
  | "openingHours"
  | "businessUnits"
  | "memberships"
  | "referenceValues"
  | "branding"
  | "logos";
export type OrganizationExportVisibilityScope = "current_only" | "include_retained";
export type OrganizationExportOrganizationScope = "selected_organization_only" | "include_child_branch";
export type OrganizationExportStatus =
  | "queued"
  | "running"
  | "cancel_requested"
  | "cancelled"
  | "ready"
  | "failed"
  | "retrying"
  | "expired"
  | "delete_requested"
  | "deleted"
  | "cleanup_failed";
export type OrganizationExportNotificationStatus = "pending" | "sent" | "failed" | "not_applicable";

export interface OrganizationExportActorInput {
  actorType: Exclude<OrganizationExportActorType, "system">;
  actorId: string;
  authPrincipalId?: string | null;
}

export interface OrganizationExportRecord {
  organizationExportId: string;
  tenantId: string;
  sourceOrganizationId: string;
  actorType: OrganizationExportActorType;
  actorId: string;
  authPrincipalId: string | null;
  authorityWorld: OrganizationExportAuthorityWorld;
  selectedSections: OrganizationExportSection[];
  visibilityScope: OrganizationExportVisibilityScope;
  organizationScope: OrganizationExportOrganizationScope;
  status: OrganizationExportStatus;
  jobId: string | null;
  storageKey: string | null;
  pinSecretEncrypted: string | null;
  pinViewedAt: Date | null;
  downloadAttemptCount: number;
  notificationStatus: OrganizationExportNotificationStatus;
  sizeBytes: number | null;
  checksumSha256: string | null;
  failureCategory: string | null;
  generatedAt: Date | null;
  expiresAt: Date | null;
  cleanupEligibleAt: Date | null;
  cleanupFailureCategory: string | null;
  cleanupAttemptCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface OrganizationExportAttemptInput {
  attemptId: string;
  organizationExportId: string;
  jobId: string | null;
  status: "running" | "succeeded" | "failed";
  failureCategory?: string | null;
  failureSummary?: string | null;
}

export interface OrganizationExportAuditEventInput {
  eventId: string;
  organizationExportId: string | null;
  tenantId: string;
  actorType: OrganizationExportActorType;
  actorId: string;
  eventType: string;
  eventOutcome: "success" | "failure";
  eventDetails: Record<string, unknown>;
  occurredAt: Date;
}

export interface CreateOrganizationExportInput extends OrganizationExportActorInput {
  tenantId: string;
  sourceOrganizationId: string;
  selectedSections: OrganizationExportSection[];
  visibilityScope: OrganizationExportVisibilityScope;
  organizationScope: OrganizationExportOrganizationScope;
}

export interface ExportIdentityInput extends OrganizationExportActorInput {
  tenantId: string;
  organizationExportId: string;
}

export interface RetryOrganizationExportInput extends ExportIdentityInput {
  selectedSections?: OrganizationExportSection[];
  visibilityScope?: OrganizationExportVisibilityScope;
  organizationScope?: OrganizationExportOrganizationScope;
}
