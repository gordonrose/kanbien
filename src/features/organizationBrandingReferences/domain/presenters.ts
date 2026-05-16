import type {
  OrganizationLogoPlaceholder,
  OrganizationLogoRelationship,
  OrganizationLogoRelationshipData,
} from "./types";

function publicLogoUrl(organizationId: string): string {
  return `/v1/public/organizations/${organizationId}/logos/primary`;
}

export function defaultLogoAltText(organizationName: string): string {
  return `${organizationName.trim()} logo`;
}

export function initialsForOrganizationName(organizationName: string): string {
  const words = organizationName
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join("");
  return initials || "ORG";
}

export function toLogoRelationship(record: OrganizationLogoRelationshipData): OrganizationLogoRelationship {
  return {
    organizationLogoRelationshipId: record.organizationLogoRelationshipId,
    tenantId: record.tenantId,
    organizationId: record.organizationId,
    assetId: record.assetId,
    logoType: record.logoType,
    altText: record.altText,
    publicReadinessStatus: record.publicReadinessStatus,
    publicUrl: publicLogoUrl(record.organizationId),
    publishedAt: record.publishedAt?.toISOString() ?? null,
    replacedAt: record.replacedAt?.toISOString() ?? null,
    cacheInvalidationStatus: record.cacheInvalidationStatus,
    cleanupEligibleAt: record.cleanupEligibleAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    deletedAt: record.deletedAt?.toISOString() ?? null,
  };
}

export function toLogoPlaceholder(input: {
  organizationId: string;
  organizationName: string;
}): OrganizationLogoPlaceholder {
  return {
    organizationId: input.organizationId,
    logoType: "primary",
    placeholder: true,
    initials: initialsForOrganizationName(input.organizationName),
    altText: defaultLogoAltText(input.organizationName),
    publicUrl: publicLogoUrl(input.organizationId),
  };
}

