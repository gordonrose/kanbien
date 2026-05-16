export type OrganizationLogoActorType = "root-user" | "tenant-admin";
export type OrganizationLogoType = "primary";
export type OrganizationLogoReadinessStatus = "ready" | "removed" | "superseded";
export type OrganizationLogoCacheInvalidationStatus = "not_required" | "pending" | "recorded" | "failed_retryable";

export interface OrganizationLogoActorInput {
  actorType: OrganizationLogoActorType;
  actorId: string;
  authPrincipalId?: string | null;
}

export interface OrganizationLogoRelationshipData {
  organizationLogoRelationshipId: string;
  tenantId: string;
  organizationId: string;
  assetId: string;
  logoType: OrganizationLogoType;
  altText: string;
  publicReadinessStatus: OrganizationLogoReadinessStatus;
  publishedAt: Date | null;
  replacedAt: Date | null;
  cacheInvalidationStatus: OrganizationLogoCacheInvalidationStatus;
  cacheInvalidationRequestedAt: Date | null;
  cleanupEligibleAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface OrganizationLogoRelationship {
  organizationLogoRelationshipId: string;
  tenantId: string;
  organizationId: string;
  assetId: string;
  logoType: OrganizationLogoType;
  altText: string;
  publicReadinessStatus: OrganizationLogoReadinessStatus;
  publicUrl: string;
  publishedAt: string | null;
  replacedAt: string | null;
  cacheInvalidationStatus: OrganizationLogoCacheInvalidationStatus;
  cleanupEligibleAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OrganizationLogoPlaceholder {
  organizationId: string;
  logoType: OrganizationLogoType;
  placeholder: true;
  initials: string;
  altText: string;
  publicUrl: string;
}

export interface OrganizationLogoAuditEventInput {
  eventId: string;
  organizationLogoRelationshipId?: string | null;
  tenantId: string;
  organizationId: string;
  actorType: OrganizationLogoActorType | "public" | "system";
  actorId: string;
  eventType: string;
  eventOutcome: "success" | "failure";
  eventDetails: Record<string, unknown>;
  occurredAt: Date;
}

export interface CreateLogoUploadIntentInput extends OrganizationLogoActorInput {
  tenantId: string;
  organizationId: string;
  contentType: "image/png" | "image/jpeg" | "image/webp";
  byteSize: number;
  originalFilename?: string | null;
  expectedChecksumSha256?: string | null;
  piiPosture?: "unknown" | "none" | "possible" | "contains";
}

export interface CompleteLogoUploadInput extends OrganizationLogoActorInput {
  tenantId: string;
  organizationId: string;
  assetId: string;
  uploadIntentId: string;
  checksumSha256?: string | null;
}

export interface UploadLogoBytesInput extends OrganizationLogoActorInput {
  tenantId: string;
  organizationId: string;
  assetId: string;
  uploadIntentId: string;
  content: Buffer;
  contentType: string;
}

export interface ReplaceLogoInput extends OrganizationLogoActorInput {
  tenantId: string;
  organizationId: string;
  assetId: string;
  altText?: string | null;
}

export interface ReadLogoInput {
  tenantId: string;
  organizationId: string;
}

export interface DeleteLogoInput extends OrganizationLogoActorInput {
  tenantId: string;
  organizationId: string;
}

