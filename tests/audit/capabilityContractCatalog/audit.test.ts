import { afterEach, describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { mountCapabilityContractCatalogFeature } from "../../helpers/capabilityContractCatalogHarness";
import { loginViaPasswordAndSsh } from "../../helpers/webAppHierarchyBuilderHarness";

interface ErrorResponse {
  code: string;
}

afterEach(() => {
  delete process.env.CAPABILITY_CATALOG_ARTIFACT_PATH;
});

function findSecurityEvents(
  harness: ReturnType<typeof createRootAuthIntegrationHarness>,
  eventType: string,
) {
  return harness.getSecurityAuditEvents().filter((event) => event.eventType === eventType);
}

describe("capabilityContractCatalog audit visibility", () => {
  it("TC-CAP-CATALOG-AUD-001 keeps denied privileged actions visible through platform security audit events", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountCapabilityContractCatalogFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, ["capability-contract-catalog.read"]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/capability-contract-catalog/export",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { formatVersion: "v1" },
    });

    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
    expect(findSecurityEvents(harness, "root_capability_denied")).toEqual([
      expect.objectContaining({
        eventType: "root_capability_denied",
        eventOutcome: "failure",
        rootUserId: identity.rootUserId,
        authPrincipalId: identity.authPrincipalId,
      }),
    ]);
  });

  it("TC-CAP-CATALOG-AUD-002 keeps successful materialize, export, and drift-audit actions operator-visible", async () => {
    process.env.CAPABILITY_CATALOG_ARTIFACT_PATH =
      "/tmp/capability-contract-catalog-audit.generated.json";
    const harness = createRootAuthIntegrationHarness();
    mountCapabilityContractCatalogFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, [
      "capability-contract-catalog.read",
      "capability-contract-catalog.export",
      "capability-contract-catalog.materialize",
      "capability-contract-catalog.audit-drift",
    ]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const materialized = await invokeJson<{ generatedCapabilityCount: number }>(harness.app, {
      method: "POST",
      path: "/v1/capability-contract-catalog/materialize",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    const exported = await invokeJson<{ formatVersion: string }>(harness.app, {
      method: "POST",
      path: "/v1/capability-contract-catalog/export",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { formatVersion: "v1" },
    });
    const drift = await invokeJson<{ items: unknown[] }>(harness.app, {
      method: "GET",
      path: "/v1/capability-contract-catalog/drift",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(materialized.status).toBe(200);
    expect(materialized.body.generatedCapabilityCount).toBe(4);
    expect(exported.status).toBe(200);
    expect(exported.body.formatVersion).toBe("v1");
    expect(drift.status).toBe(200);
    expect(drift.body.items).toHaveLength(4);

    expect(findSecurityEvents(harness, "capability_contract_catalog_materialized")).toEqual([
      expect.objectContaining({
        eventOutcome: "success",
        rootUserId: identity.rootUserId,
        authPrincipalId: identity.authPrincipalId,
      }),
    ]);
    expect(findSecurityEvents(harness, "capability_contract_catalog_exported")).toEqual([
      expect.objectContaining({
        eventOutcome: "success",
        rootUserId: identity.rootUserId,
        authPrincipalId: identity.authPrincipalId,
      }),
    ]);
    expect(findSecurityEvents(harness, "capability_contract_catalog_drift_audited")).toEqual([
      expect.objectContaining({
        eventOutcome: "success",
        rootUserId: identity.rootUserId,
        authPrincipalId: identity.authPrincipalId,
      }),
    ]);
  });
});
