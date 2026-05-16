import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import type { AssetsService } from "../../assets";
import type { OrganizationCoreService } from "../../organizationCore";
import type { OrganizationLogoRepository } from "../persistence/types";
import {
  InvalidOrganizationLogoRequestError,
  OrganizationLogoNotFoundError,
  OrganizationLogoNotReadyError,
  OrganizationLogoTenantMismatchError,
} from "../contract/errors";
import {
  defaultLogoAltText,
  initialsForOrganizationName,
  toLogoPlaceholder,
  toLogoRelationship,
} from "./presenters";
import type {
  CompleteLogoUploadInput,
  CreateLogoUploadIntentInput,
  DeleteLogoInput,
  OrganizationLogoActorInput,
  OrganizationLogoPlaceholder,
  OrganizationLogoRelationship,
  ReadLogoInput,
  ReplaceLogoInput,
  UploadLogoBytesInput,
} from "./types";

export interface PublicLogoDeliveryResult {
  status: "asset" | "placeholder";
  stream?: NodeJS.ReadableStream;
  body?: string;
  headers: Record<string, string>;
}

export interface OrganizationBrandingReferencesService {
  createLogoUploadIntent(input: CreateLogoUploadIntentInput): ReturnType<AssetsService["createUploadIntent"]>;
  uploadLogoBytes(input: UploadLogoBytesInput): ReturnType<AssetsService["uploadAssetBytes"]>;
  completeLogoUpload(input: CompleteLogoUploadInput): ReturnType<AssetsService["completeUpload"]>;
  replacePrimaryLogo(input: ReplaceLogoInput): Promise<OrganizationLogoRelationship>;
  getPrimaryLogo(input: ReadLogoInput): Promise<OrganizationLogoRelationship | OrganizationLogoPlaceholder>;
  deletePrimaryLogo(input: DeleteLogoInput): Promise<OrganizationLogoPlaceholder>;
  readPublicPrimaryLogo(organizationId: string): Promise<PublicLogoDeliveryResult>;
}

function assetActor(input: OrganizationLogoActorInput, tenantId: string) {
  if (input.actorType === "root-user") {
    return {
      actorType: "root" as const,
      actorId: input.actorId,
      authPrincipalId: input.authPrincipalId,
    };
  }
  return {
    actorType: "tenant" as const,
    actorId: input.actorId,
    authPrincipalId: input.authPrincipalId,
    tenantId,
  };
}

function assertRasterContentType(contentType: string): void {
  const normalized = contentType.split(";")[0]?.trim().toLowerCase();
  if (!normalized || !["image/png", "image/jpeg", "image/webp"].includes(normalized)) {
    throw new InvalidOrganizationLogoRequestError("Only PNG, JPEG, and WebP primary logos are supported.", {
      field: "contentType",
      reason: "unsupported_logo_content_type",
    });
  }
}

function placeholderSvg(organizationName: string): string {
  const initials = initialsForOrganizationName(organizationName)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" role="img">',
    '<rect width="256" height="256" fill="#283847"/>',
    '<circle cx="128" cy="128" r="96" fill="#f2f5f7" opacity="0.12"/>',
    `<text x="128" y="146" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="#ffffff">${initials}</text>`,
    "</svg>",
  ].join("");
}

async function audit(
  repository: OrganizationLogoRepository,
  input: {
    relationshipId?: string | null;
    tenantId: string;
    organizationId: string;
    actorType: OrganizationLogoActorInput["actorType"] | "public" | "system";
    actorId: string;
    eventType: string;
    eventOutcome?: "success" | "failure";
    eventDetails?: Record<string, unknown>;
  },
): Promise<void> {
  await repository.recordAuditEvent({
    eventId: randomUUID(),
    organizationLogoRelationshipId: input.relationshipId ?? null,
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: input.eventType,
    eventOutcome: input.eventOutcome ?? "success",
    eventDetails: input.eventDetails ?? {},
    occurredAt: new Date(),
  });
}

export function createOrganizationBrandingReferencesService(
  repository: OrganizationLogoRepository,
  organizationCoreService: OrganizationCoreService,
  assetsService: AssetsService,
): OrganizationBrandingReferencesService {
  async function getOrganization(tenantId: string, organizationId: string) {
    return organizationCoreService.getOrganization({ tenantId, organizationId });
  }

  return {
    async createLogoUploadIntent(input) {
      await getOrganization(input.tenantId, input.organizationId);
      return assetsService.createUploadIntent({
        actor: assetActor(input, input.tenantId),
        scope: { scopeType: "tenant", tenantId: input.tenantId },
        kind: "image",
        contentType: input.contentType,
        byteSize: input.byteSize,
        visibility: "private",
        originalFilename: input.originalFilename,
        expectedChecksumSha256: input.expectedChecksumSha256,
        piiPosture: input.piiPosture,
      });
    },
    async uploadLogoBytes(input) {
      await getOrganization(input.tenantId, input.organizationId);
      assertRasterContentType(input.contentType);
      return assetsService.uploadAssetBytes({
        actor: assetActor(input, input.tenantId),
        assetId: input.assetId,
        uploadIntentId: input.uploadIntentId,
        content: input.content,
        contentType: input.contentType,
      });
    },
    async completeLogoUpload(input) {
      await getOrganization(input.tenantId, input.organizationId);
      return assetsService.completeUpload({
        actor: assetActor(input, input.tenantId),
        assetId: input.assetId,
        uploadIntentId: input.uploadIntentId,
        checksumSha256: input.checksumSha256,
      });
    },
    async replacePrimaryLogo(input) {
      const organization = await getOrganization(input.tenantId, input.organizationId);
      const asset = await assetsService.validateAssetForSubject({
        actor: assetActor(input, input.tenantId),
        assetId: input.assetId,
        scope: { scopeType: "tenant", tenantId: input.tenantId },
        acceptedKinds: ["image"],
        contextualAccessibility: {
          altText: input.altText ?? defaultLogoAltText(organization.name),
        },
      });
      if (asset.tenantId !== input.tenantId || asset.scopeType !== "tenant") {
        throw new OrganizationLogoTenantMismatchError({ field: "assetId", reason: "asset_scope_mismatch" });
      }
      if (!["image/png", "image/jpeg", "image/webp"].includes(asset.verifiedContentType ?? asset.claimedContentType)) {
        throw new OrganizationLogoNotReadyError({ field: "assetId", reason: "unsupported_verified_content_type" });
      }
      const record = await repository.replaceCurrent({
        organizationLogoRelationshipId: randomUUID(),
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        assetId: input.assetId,
        altText: input.altText?.trim() || defaultLogoAltText(organization.name),
      });
      await audit(repository, {
        relationshipId: record.organizationLogoRelationshipId,
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        actorType: input.actorType,
        actorId: input.actorId,
        eventType: "organization_logo_replaced",
        eventDetails: { assetId: input.assetId, logoType: "primary", publicUrl: `/v1/public/organizations/${input.organizationId}/logos/primary` },
      });
      return toLogoRelationship(record);
    },
    async getPrimaryLogo(input) {
      const organization = await getOrganization(input.tenantId, input.organizationId);
      const current = await repository.findCurrent(input.tenantId, input.organizationId);
      return current ? toLogoRelationship(current) : toLogoPlaceholder({
        organizationId: input.organizationId,
        organizationName: organization.name,
      });
    },
    async deletePrimaryLogo(input) {
      const organization = await getOrganization(input.tenantId, input.organizationId);
      const removed = await repository.removeCurrent(input.tenantId, input.organizationId);
      if (removed) {
        await audit(repository, {
          relationshipId: removed.organizationLogoRelationshipId,
          tenantId: input.tenantId,
          organizationId: input.organizationId,
          actorType: input.actorType,
          actorId: input.actorId,
          eventType: "organization_logo_removed",
          eventDetails: { logoType: "primary" },
        });
      }
      return toLogoPlaceholder({ organizationId: input.organizationId, organizationName: organization.name });
    },
    async readPublicPrimaryLogo(organizationId) {
      const current = await repository.findCurrentByOrganizationId(organizationId);
      if (current) {
        const content = await assetsService.readAssetContent({
          actor: { actorType: "internal", actorId: "organization-logo-public-delivery" },
          assetId: current.assetId,
        });
        return {
          status: "asset",
          stream: content.stream,
          headers: {
            ...content.headers,
            "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
            ETag: `"${current.organizationLogoRelationshipId}:${current.updatedAt.toISOString()}"`,
            "Last-Modified": current.updatedAt.toUTCString(),
          },
        };
      }

      const organization = await repository.findOrganizationSummaryById(organizationId);
      if (!organization) {
        throw new OrganizationLogoNotFoundError({ field: "organizationId", reason: "missing_organization" });
      }
      return createPlaceholderDelivery({
        organizationId: organization.organizationId,
        organizationName: organization.name,
      });
    },
  };
}

export function createPlaceholderDelivery(input: {
  organizationName: string;
  organizationId: string;
}): PublicLogoDeliveryResult {
  const body = placeholderSvg(input.organizationName);
  const readable = Readable.from(Buffer.from(body, "utf8"));
  return {
    status: "placeholder",
    stream: readable,
    body,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Length": String(Buffer.byteLength(body)),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
      ETag: `"placeholder:${input.organizationId}:${initialsForOrganizationName(input.organizationName)}"`,
    },
  };
}
