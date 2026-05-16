import type { Express } from "express";
import { env } from "../../src/config/env";
import { createOrganizationCoreService } from "../../src/features/organizationCore/domain/service";
import type { OrganizationCoreRepository } from "../../src/features/organizationCore/persistence/repository";
import { createOrganizationLocationsService } from "../../src/features/organizationLocations/domain/service";
import type { OrganizationLocationData } from "../../src/features/organizationLocations/domain/types";
import type { OrganizationLocationsRepository } from "../../src/features/organizationLocations/persistence/repository";
import type {
  CreateLocationRecordInput,
  LocationAuditEventInput,
  LocationRepositoryListInput,
  LocationRepositoryListResult,
  UpdateLocationRecordInput,
} from "../../src/features/organizationLocations/persistence/types";
import { createRootOrganizationLocationsRouter } from "../../src/features/organizationLocations/transport/router";
import { createRequireRootSession } from "../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../src/lib/security/rateLimit";
import type { RootAuthIntegrationHarness } from "../harness/rootAuth/integrationHarness";

function now(offset = 0): Date {
  return new Date(Date.UTC(2026, 4, 15, 10, offset, 0));
}

function clone(location: OrganizationLocationData): OrganizationLocationData {
  return { ...location };
}

export class MemoryLocationRepository implements OrganizationLocationsRepository {
  public readonly locations: OrganizationLocationData[] = [];
  public readonly auditEvents: LocationAuditEventInput[] = [];

  async create(input: CreateLocationRecordInput): Promise<OrganizationLocationData> {
    const location: OrganizationLocationData = {
      locationId: input.locationId,
      tenantId: input.tenantId,
      organizationId: input.organizationId,
      locationName: input.locationName,
      addressSummary: input.addressSummary,
      latitude: input.latitude,
      longitude: input.longitude,
      isHeadOffice: input.isHeadOffice,
      isRegisteredOffice: input.isRegisteredOffice,
      lifecycleStatus: "active",
      archivedAt: null,
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    };
    this.locations.push(location);
    return clone(location);
  }

  async findVisibleById(
    tenantId: string,
    organizationId: string,
    locationId: string,
  ): Promise<OrganizationLocationData | null> {
    const location = this.locations.find(
      (item) =>
        item.tenantId === tenantId &&
        item.organizationId === organizationId &&
        item.locationId === locationId &&
        item.lifecycleStatus === "active" &&
        item.deletedAt === null,
    );
    return location ? clone(location) : null;
  }

  async findNonDeletedById(
    tenantId: string,
    organizationId: string,
    locationId: string,
  ): Promise<OrganizationLocationData | null> {
    const location = this.locations.find(
      (item) =>
        item.tenantId === tenantId &&
        item.organizationId === organizationId &&
        item.locationId === locationId &&
        item.deletedAt === null,
    );
    return location ? clone(location) : null;
  }

  async list(input: LocationRepositoryListInput): Promise<LocationRepositoryListResult> {
    const items = this.locations.filter(
      (location) =>
        location.tenantId === input.tenantId &&
        location.organizationId === input.organizationId &&
        location.deletedAt === null &&
        (input.includeArchived || location.lifecycleStatus === "active") &&
        (!input.lifecycleStatus || location.lifecycleStatus === input.lifecycleStatus),
    );
    return {
      items: items.map(clone),
      totalSearchableRecords: items.length,
      totalMatchingRecords: items.length,
    };
  }

  async update(input: UpdateLocationRecordInput): Promise<OrganizationLocationData | null> {
    const index = this.locations.findIndex(
      (item) =>
        item.tenantId === input.tenantId &&
        item.organizationId === input.organizationId &&
        item.locationId === input.locationId &&
        item.lifecycleStatus === "active" &&
        item.deletedAt === null,
    );
    if (index < 0) return null;
    const current = this.locations[index];
    const next = {
      ...current,
      locationName: input.locationName ?? current.locationName,
      addressSummary: Object.prototype.hasOwnProperty.call(input, "addressSummary")
        ? input.addressSummary ?? null
        : current.addressSummary,
      latitude: Object.prototype.hasOwnProperty.call(input, "latitude")
        ? input.latitude ?? null
        : current.latitude,
      longitude: Object.prototype.hasOwnProperty.call(input, "longitude")
        ? input.longitude ?? null
        : current.longitude,
      isHeadOffice: Object.prototype.hasOwnProperty.call(input, "isHeadOffice")
        ? input.isHeadOffice ?? current.isHeadOffice
        : current.isHeadOffice,
      isRegisteredOffice: Object.prototype.hasOwnProperty.call(input, "isRegisteredOffice")
        ? input.isRegisteredOffice ?? current.isRegisteredOffice
        : current.isRegisteredOffice,
      updatedAt: now(5),
    };
    this.locations[index] = next;
    return clone(next);
  }

  async archive(tenantId: string, organizationId: string, locationId: string) {
    return this.changeLifecycle(tenantId, organizationId, locationId, "archived");
  }

  async restore(tenantId: string, organizationId: string, locationId: string) {
    return this.changeLifecycle(tenantId, organizationId, locationId, "active");
  }

  async softDelete(tenantId: string, organizationId: string, locationId: string) {
    const index = this.locations.findIndex(
      (item) =>
        item.tenantId === tenantId &&
        item.organizationId === organizationId &&
        item.locationId === locationId &&
        item.deletedAt === null,
    );
    if (index < 0) return null;
    const next = { ...this.locations[index], deletedAt: now(10), updatedAt: now(10) };
    this.locations[index] = next;
    return clone(next);
  }

  async recordAuditEvent(input: LocationAuditEventInput): Promise<void> {
    this.auditEvents.push(input);
  }

  private async changeLifecycle(
    tenantId: string,
    organizationId: string,
    locationId: string,
    lifecycleStatus: "active" | "archived",
  ) {
    const index = this.locations.findIndex(
      (item) =>
        item.tenantId === tenantId &&
        item.organizationId === organizationId &&
        item.locationId === locationId &&
        item.deletedAt === null,
    );
    if (index < 0) return null;
    const next = {
      ...this.locations[index],
      lifecycleStatus,
      archivedAt: lifecycleStatus === "archived" ? now(8) : null,
      updatedAt: now(8),
    };
    this.locations[index] = next;
    return clone(next);
  }
}

export function mountRootOrganizationLocationsFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  organizationCoreRepository: OrganizationCoreRepository,
  locationsRepository: OrganizationLocationsRepository,
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
  const router = createRootOrganizationLocationsRouter(
    createOrganizationLocationsService(
      locationsRepository,
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
