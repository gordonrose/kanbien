import { describe, expect, it } from "vitest";
import { env } from "../../../src/config/env";
import type { OrganizationOpeningHoursService } from "../../../src/features/organizationOpeningHours/domain/service";
import { createRootOrganizationOpeningHoursRouter } from "../../../src/features/organizationOpeningHours/transport/router";
import { createRequireRootSession } from "../../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../../src/lib/security/rateLimit";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";

interface ErrorResponse {
  code: string;
  details?: {
    field?: string;
    reason?: string;
  };
}

function createStubService(): OrganizationOpeningHoursService {
  return {
    async createWeeklySlot(input) {
      return {
        weeklyOpeningHoursId: "11111111-1111-4111-8111-111111111111",
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        locationId: input.locationId,
        weekday: input.weekday,
        slotOrder: input.slotOrder,
        opensAtLocalTime: input.opensAtLocalTime,
        closesAtLocalTime: input.closesAtLocalTime,
        lifecycleStatus: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
    },
    async listWeeklySlots(input) {
      return {
        items: [],
        page: input.page,
        pageSize: input.pageSize,
        totalPages: 1,
        totalMatchingRecords: 0,
        totalSearchableRecords: 0,
      };
    },
    async updateWeeklySlot(input) {
      return {
        weeklyOpeningHoursId: input.weeklyOpeningHoursId,
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        locationId: input.locationId,
        weekday: input.weekday ?? 1,
        slotOrder: input.slotOrder ?? 1,
        opensAtLocalTime: input.opensAtLocalTime ?? "09:00",
        closesAtLocalTime: input.closesAtLocalTime ?? "17:00",
        lifecycleStatus: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
    },
    async deleteWeeklySlot(input) {
      return {
        weeklyOpeningHoursId: input.weeklyOpeningHoursId,
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        locationId: input.locationId,
        weekday: 1,
        slotOrder: 1,
        opensAtLocalTime: "09:00",
        closesAtLocalTime: "17:00",
        lifecycleStatus: "deleted",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
      };
    },
    async createException(input) {
      return {
        openingHoursExceptionId: "22222222-2222-4222-8222-222222222222",
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        locationId: input.locationId,
        exceptionType: input.exceptionType,
        startsOnLocalDate: input.startsOnLocalDate,
        endsOnLocalDate: input.endsOnLocalDate ?? null,
        startsAtLocalTime: input.startsAtLocalTime ?? null,
        endsAtLocalTime: input.endsAtLocalTime ?? null,
        replacementSlots: input.replacementSlots ?? [],
        reason: input.reason ?? null,
        lifecycleStatus: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
    },
    async listExceptions(input) {
      return {
        items: [],
        page: input.page,
        pageSize: input.pageSize,
        totalPages: 1,
        totalMatchingRecords: 0,
        totalSearchableRecords: 0,
      };
    },
    async updateException(input) {
      return {
        openingHoursExceptionId: input.openingHoursExceptionId,
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        locationId: input.locationId,
        exceptionType: input.exceptionType ?? "closed_day",
        startsOnLocalDate: input.startsOnLocalDate ?? "2026-05-18",
        endsOnLocalDate: input.endsOnLocalDate ?? null,
        startsAtLocalTime: input.startsAtLocalTime ?? null,
        endsAtLocalTime: input.endsAtLocalTime ?? null,
        replacementSlots: input.replacementSlots ?? [],
        reason: input.reason ?? null,
        lifecycleStatus: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
    },
    async deleteException(input) {
      return {
        openingHoursExceptionId: input.openingHoursExceptionId,
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        locationId: input.locationId,
        exceptionType: "closed_day",
        startsOnLocalDate: "2026-05-18",
        endsOnLocalDate: null,
        startsAtLocalTime: null,
        endsAtLocalTime: null,
        replacementSlots: [],
        reason: null,
        lifecycleStatus: "deleted",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
      };
    },
    async getEffectiveOpeningHours(input) {
      return { ...input, slots: [], appliedExceptionType: "closed_by_absence" };
    },
  };
}

describe("organizationOpeningHours security", () => {
  it("TC-ORG-S007-SEC-001 requires root authentication and opening-hours read capabilities", async () => {
    const harness = createRootAuthIntegrationHarness();
    const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    const organizationId = "22222222-2222-4222-8222-222222222222";
    const locationId = "33333333-3333-4333-8333-333333333333";
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
    harness.app.use(
      "/v1/root-admin/tenants/:tenantId/organizations",
      requireRootSession,
      authenticatedGeneralRateLimit,
      createRootOrganizationOpeningHoursRouter(
        createStubService(),
        capabilityChecker,
        harness.platformSecurityRepository,
      ),
    );

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: `/v1/root-admin/tenants/${tenantId}/organizations/${organizationId}/locations/${locationId}/weekly-opening-hours`,
    });
    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");

    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);
    const allowed = await invokeJson<{ items: unknown[] }>(harness.app, {
      method: "GET",
      path: `/v1/root-admin/tenants/${tenantId}/organizations/${organizationId}/locations/${locationId}/weekly-opening-hours`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(allowed.status).toBe(200);

    harness.setRootUserCapabilities(identity.rootUserId, ["organization.weekly-hours-slot.manage"]);
    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: `/v1/root-admin/tenants/${tenantId}/organizations/${organizationId}/locations/${locationId}/weekly-opening-hours`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
  });

  it("TC-ORG-S007-SEC-002 rejects system-managed weekly slot fields", async () => {
    const harness = createRootAuthIntegrationHarness();
    const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    const organizationId = "22222222-2222-4222-8222-222222222222";
    const locationId = "33333333-3333-4333-8333-333333333333";
    const requireRootSession = createRequireRootSession(harness.authRepository, {
      allowBrowserCookie: true,
    });
    harness.app.use(
      "/v1/root-admin/tenants/:tenantId/organizations",
      requireRootSession,
      createRootOrganizationOpeningHoursRouter(
        createStubService(),
        {
          async hasCapability() {
            return true;
          },
        },
        harness.platformSecurityRepository,
      ),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const response = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: `/v1/root-admin/tenants/${tenantId}/organizations/${organizationId}/locations/${locationId}/weekly-opening-hours`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        weeklyOpeningHoursId: "11111111-1111-4111-8111-111111111111",
        weekday: 1,
        slotOrder: 1,
        opensAtLocalTime: "09:00",
        closesAtLocalTime: "17:00",
      },
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      code: "ORGANIZATION_OPENING_HOURS_INVALID",
      details: {
        field: "weeklyOpeningHoursId",
        reason: "unexpected_field",
      },
    });
  });
});
