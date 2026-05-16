import type { Express } from "express";
import { env } from "../../src/config/env";
import { createOrganizationCoreService } from "../../src/features/organizationCore/domain/service";
import type { OrganizationCoreRepository } from "../../src/features/organizationCore/persistence/repository";
import { createOrganizationLegalDetailsService } from "../../src/features/organizationLegalDetails/domain/service";
import type { OrganizationLegalProfileData } from "../../src/features/organizationLegalDetails/domain/types";
import type { OrganizationLegalDetailsRepository } from "../../src/features/organizationLegalDetails/persistence/repository";
import type {
  CreateLegalProfileRecordInput,
  LegalProfileAuditEventInput,
  LegalProfileRepositoryListInput,
  LegalProfileRepositoryListResult,
  UpdateLegalProfileRecordInput,
} from "../../src/features/organizationLegalDetails/persistence/types";
import { createRootOrganizationLegalDetailsRouter } from "../../src/features/organizationLegalDetails/transport/router";
import { createRequireRootSession } from "../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../src/lib/security/rateLimit";
import type { RootAuthIntegrationHarness } from "../harness/rootAuth/integrationHarness";

function now(offset = 0): Date {
  return new Date(Date.UTC(2026, 4, 15, 10, offset, 0));
}

function clone(profile: OrganizationLegalProfileData): OrganizationLegalProfileData {
  return { ...profile };
}

export class MemoryLegalProfileRepository implements OrganizationLegalDetailsRepository {
  public readonly profiles: OrganizationLegalProfileData[] = [];
  public readonly auditEvents: LegalProfileAuditEventInput[] = [];

  async create(input: CreateLegalProfileRecordInput): Promise<OrganizationLegalProfileData> {
    const profile: OrganizationLegalProfileData = {
      legalProfileId: input.legalProfileId,
      tenantId: input.tenantId,
      organizationId: input.organizationId,
      legalName: input.legalName,
      registrationIdentifier: input.registrationIdentifier,
      taxVatNumber: input.taxVatNumber,
      registeredAddress: input.registeredAddress,
      lifecycleStatus: "active",
      archivedAt: null,
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    };
    this.profiles.push(profile);
    return clone(profile);
  }

  async findActiveByOrganization(tenantId: string, organizationId: string): Promise<OrganizationLegalProfileData | null> {
    const profile = this.profiles.find(
      (item) =>
        item.tenantId === tenantId &&
        item.organizationId === organizationId &&
        item.lifecycleStatus === "active" &&
        item.deletedAt === null,
    );
    return profile ? clone(profile) : null;
  }

  async findVisibleById(
    tenantId: string,
    organizationId: string,
    legalProfileId: string,
  ): Promise<OrganizationLegalProfileData | null> {
    const profile = this.profiles.find(
      (item) =>
        item.tenantId === tenantId &&
        item.organizationId === organizationId &&
        item.legalProfileId === legalProfileId &&
        item.lifecycleStatus === "active" &&
        item.deletedAt === null,
    );
    return profile ? clone(profile) : null;
  }

  async findNonDeletedById(
    tenantId: string,
    organizationId: string,
    legalProfileId: string,
  ): Promise<OrganizationLegalProfileData | null> {
    const profile = this.profiles.find(
      (item) =>
        item.tenantId === tenantId &&
        item.organizationId === organizationId &&
        item.legalProfileId === legalProfileId &&
        item.deletedAt === null,
    );
    return profile ? clone(profile) : null;
  }

  async list(input: LegalProfileRepositoryListInput): Promise<LegalProfileRepositoryListResult> {
    const items = this.profiles.filter(
      (profile) =>
        profile.tenantId === input.tenantId &&
        profile.organizationId === input.organizationId &&
        profile.deletedAt === null &&
        (input.includeArchived || profile.lifecycleStatus === "active") &&
        (!input.lifecycleStatus || profile.lifecycleStatus === input.lifecycleStatus),
    );
    return {
      items: items.map(clone),
      totalSearchableRecords: items.length,
      totalMatchingRecords: items.length,
    };
  }

  async update(input: UpdateLegalProfileRecordInput): Promise<OrganizationLegalProfileData | null> {
    const index = this.profiles.findIndex(
      (item) =>
        item.tenantId === input.tenantId &&
        item.organizationId === input.organizationId &&
        item.legalProfileId === input.legalProfileId &&
        item.lifecycleStatus === "active" &&
        item.deletedAt === null,
    );
    if (index < 0) return null;
    const current = this.profiles[index];
    const next = {
      ...current,
      legalName: input.legalName ?? current.legalName,
      registrationIdentifier: Object.prototype.hasOwnProperty.call(input, "registrationIdentifier")
        ? input.registrationIdentifier ?? null
        : current.registrationIdentifier,
      taxVatNumber: Object.prototype.hasOwnProperty.call(input, "taxVatNumber")
        ? input.taxVatNumber ?? null
        : current.taxVatNumber,
      registeredAddress: Object.prototype.hasOwnProperty.call(input, "registeredAddress")
        ? input.registeredAddress ?? null
        : current.registeredAddress,
      updatedAt: now(5),
    };
    this.profiles[index] = next;
    return clone(next);
  }

  async archive(tenantId: string, organizationId: string, legalProfileId: string) {
    return this.changeLifecycle(tenantId, organizationId, legalProfileId, "archived");
  }

  async restore(tenantId: string, organizationId: string, legalProfileId: string) {
    return this.changeLifecycle(tenantId, organizationId, legalProfileId, "active");
  }

  async softDelete(tenantId: string, organizationId: string, legalProfileId: string) {
    const index = this.profiles.findIndex(
      (item) =>
        item.tenantId === tenantId &&
        item.organizationId === organizationId &&
        item.legalProfileId === legalProfileId &&
        item.deletedAt === null,
    );
    if (index < 0) return null;
    const next = { ...this.profiles[index], deletedAt: now(10), updatedAt: now(10) };
    this.profiles[index] = next;
    return clone(next);
  }

  async recordAuditEvent(input: LegalProfileAuditEventInput): Promise<void> {
    this.auditEvents.push(input);
  }

  private async changeLifecycle(
    tenantId: string,
    organizationId: string,
    legalProfileId: string,
    lifecycleStatus: "active" | "archived",
  ) {
    const index = this.profiles.findIndex(
      (item) =>
        item.tenantId === tenantId &&
        item.organizationId === organizationId &&
        item.legalProfileId === legalProfileId &&
        item.deletedAt === null,
    );
    if (index < 0) return null;
    const next = {
      ...this.profiles[index],
      lifecycleStatus,
      archivedAt: lifecycleStatus === "archived" ? now(8) : null,
      updatedAt: now(8),
    };
    this.profiles[index] = next;
    return clone(next);
  }
}

export function mountRootOrganizationLegalDetailsFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  organizationCoreRepository: OrganizationCoreRepository,
  legalDetailsRepository: OrganizationLegalDetailsRepository,
) {
  const requireRootSession = createRequireRootSession(harness.authRepository, {
    allowBrowserCookie: true,
  });
  const authenticatedGeneralRateLimit = createRateLimitMiddleware({
    enabled: env.platformSecurity.enabled,
    repository: harness.platformSecurityRepository,
    policy: {
      endpointClass: "authenticated-general",
      windowSeconds: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.windowSeconds,
      maxAttempts: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts,
      responseCode: "RATE_LIMITED",
      responseMessage: "Too many requests. Please wait and try again.",
    },
    subjectScope: "auth_user",
    getSubjectKey: (request) =>
      request.rootSession ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}` : null,
  });
  const capabilityChecker = {
    async hasCapability(input: { rootUserId: string; capabilityKey: string }) {
      return harness.getRootUserCapabilities(input.rootUserId).includes(input.capabilityKey);
    },
  };
  const router = createRootOrganizationLegalDetailsRouter(
    createOrganizationLegalDetailsService(
      legalDetailsRepository,
      createOrganizationCoreService(organizationCoreRepository),
    ),
    capabilityChecker,
    harness.platformSecurityRepository,
  );

  app.use("/v1/tenants/:tenantId/organizations", requireRootSession, authenticatedGeneralRateLimit, router);
  app.use(
    "/v1/root-admin/tenants/:tenantId/organizations",
    requireRootSession,
    authenticatedGeneralRateLimit,
    router,
  );
}
