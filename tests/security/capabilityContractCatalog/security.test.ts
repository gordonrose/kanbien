import { afterEach, describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { mountCapabilityContractCatalogFeature } from "../../helpers/capabilityContractCatalogHarness";
import { loginViaPasswordAndSsh } from "../../helpers/webAppHierarchyBuilderHarness";

interface ErrorResponse {
  code: string;
  details?: { field?: string; reason?: string };
}

interface ExactCapabilityResponse {
  access: {
    runtimeContextRequirements: string[];
  };
}

afterEach(() => {
  delete process.env.CAPABILITY_CATALOG_ARTIFACT_PATH;
});

describe("capabilityContractCatalog security flows", () => {
  it("TC-CAP-CATALOG-SEC-001 rejects missing authenticated sessions on protected catalog routes", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountCapabilityContractCatalogFeature(harness.app, harness);

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/capability-contract-catalog/capabilities?page=1&pageSize=25&orderDirection=asc",
    });

    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");
  });

  it("TC-CAP-CATALOG-SEC-001 denies stronger operations when the authenticated root actor lacks the required capability and keeps the denial audit-visible", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountCapabilityContractCatalogFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, ["capability-contract-catalog.read"]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/capability-contract-catalog/materialize",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });

    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "root_capability_denied",
          eventOutcome: "failure",
          rootUserId: identity.rootUserId,
          authPrincipalId: identity.authPrincipalId,
        }),
      ]),
    );
  });

  it("TC-CAP-CATALOG-SEC-003 surfaces runtime-context requirements without treating them as authorization grants", async () => {
    const harness = createRootAuthIntegrationHarness();
    const reader = harness.seedAuthIdentity({
      rootUser: {
        rootUserId: "22222222-2222-2222-2222-222222222222",
        email: "reader@example.test",
      },
      loginEmail: "reader@example.test",
    });
    const outsider = harness.seedAuthIdentity({
      rootUser: {
        rootUserId: "33333333-3333-3333-3333-333333333333",
        email: "outsider@example.test",
      },
      loginEmail: "outsider@example.test",
    });

    mountCapabilityContractCatalogFeature(harness.app, harness, undefined, {
      capabilityChecker: {
        hasCapability: async ({ rootUserId, capabilityKey }) => {
          if (rootUserId === reader.rootUserId) {
            return [
              "capability-contract-catalog.read",
              "capability-contract-catalog.materialize",
            ].includes(capabilityKey);
          }
          return false;
        },
      },
    });

    const readerSession = await loginViaPasswordAndSsh(harness, reader);
    const outsiderSession = await loginViaPasswordAndSsh(harness, outsider);

    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/capability-contract-catalog/materialize",
      headers: { authorization: `Bearer ${readerSession.sessionId}` },
      body: {},
    });

    const exact = await invokeJson<ExactCapabilityResponse>(harness.app, {
      method: "GET",
      path: "/v1/capability-contract-catalog/capabilities/notificationDelivery.resendEmail",
      headers: { authorization: `Bearer ${readerSession.sessionId}` },
    });

    expect(exact.status).toBe(200);
    expect(exact.body.access.runtimeContextRequirements).toEqual([
      "root-session-context",
      "future-tenant-and-entity-relationship-omission-rules-remain-server-enforced",
    ]);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/capability-contract-catalog/capabilities/notificationDelivery.resendEmail",
      headers: { authorization: `Bearer ${outsiderSession.sessionId}` },
    });

    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
  });

  it("TC-CAP-CATALOG-SEC-002 rejects unexpected system-managed fields on materialization requests", async () => {
    process.env.CAPABILITY_CATALOG_ARTIFACT_PATH =
      "/tmp/capability-contract-catalog-security.generated.json";
    const harness = createRootAuthIntegrationHarness();
    mountCapabilityContractCatalogFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, [
      "capability-contract-catalog.materialize",
    ]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const invalid = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/capability-contract-catalog/materialize",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        includeFeatures: ["notificationDelivery"],
        lastMaterializedAt: "2026-04-22T12:00:00.000Z",
      },
    });

    expect(invalid.status).toBe(400);
    expect(invalid.body).toMatchObject({
      code: "INVALID_REQUEST",
      details: {
        field: "lastMaterializedAt",
        reason: "unexpected_field",
      },
    });
  });
});
