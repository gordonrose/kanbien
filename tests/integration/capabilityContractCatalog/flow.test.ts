import { afterEach, describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryCapabilityContractCatalogRepository,
  mountCapabilityContractCatalogFeature,
} from "../../helpers/capabilityContractCatalogHarness";
import { loginViaPasswordAndSsh } from "../../helpers/webAppHierarchyBuilderHarness";

interface MaterializeResponse {
  insertedCount: number;
  updatedCount: number;
  generatedCapabilityCount: number;
  generatedArtifactPath: string;
}

interface ListResponse {
  items: Array<{
    capabilityId: string;
    featureName: string;
    freshnessStatus: string;
    supportsFilters: boolean;
  }>;
  totalMatchingRecords: number;
}

interface ExactResponse {
  capabilityId: string;
  access: {
    governingAuthzCapabilities: string[];
    allowedRoles: string[];
  };
  request: {
    params: Array<{ path: string; format: string | null }>;
    constraints: Array<{ constraintKind: string }>;
  };
  response: {
    body: Array<{ path: string }>;
  };
  freshness: {
    status: string;
  };
}

interface DriftResponse {
  items: Array<{
    capabilityId: string;
    freshnessStatus: string;
    rematerializationRequired: boolean;
  }>;
}

interface ExportResponse {
  formatVersion: string;
  items: Array<{ capabilityId: string }>;
}

afterEach(() => {
  delete process.env.CAPABILITY_CATALOG_ARTIFACT_PATH;
});

function grantCatalogCapabilities(
  harness: ReturnType<typeof createRootAuthIntegrationHarness>,
  rootUserId: string,
) {
  harness.setRootUserCapabilities(rootUserId, [
    "capability-contract-catalog.read",
    "capability-contract-catalog.export",
    "capability-contract-catalog.materialize",
    "capability-contract-catalog.audit-drift",
  ]);
}

describe("capabilityContractCatalog feature flows", () => {
  it("TC-CAP-CATALOG-INT-001 and TC-CAP-CATALOG-EDGE-004 lists filtered picker summaries with visible freshness posture and deterministic selector ordering after materialization", async () => {
    process.env.CAPABILITY_CATALOG_ARTIFACT_PATH =
      "/tmp/capability-contract-catalog-flow-list.generated.json";
    const harness = createRootAuthIntegrationHarness();
    mountCapabilityContractCatalogFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    grantCatalogCapabilities(harness, identity.rootUserId);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const materialized = await invokeJson<MaterializeResponse>(harness.app, {
      method: "POST",
      path: "/v1/capability-contract-catalog/materialize",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });

    expect(materialized.status).toBe(200);
    expect(materialized.body.generatedCapabilityCount).toBe(4);

    const listed = await invokeJson<ListResponse>(harness.app, {
      method: "GET",
      path: "/v1/capability-contract-catalog/capabilities?featureName=notificationDelivery&supportsFilters=true&page=1&pageSize=10&orderDirection=asc",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(listed.status).toBe(200);
    expect(listed.body.totalMatchingRecords).toBe(1);
    expect(listed.body.items).toEqual([
      expect.objectContaining({
        capabilityId: "notificationDelivery.listOutboundEmails",
        featureName: "notificationDelivery",
        freshnessStatus: "fresh",
        supportsFilters: true,
      }),
    ]);
  });

  it("TC-CAP-CATALOG-INT-002 returns exact normalized contract detail with access, validation-facing metadata, and constraints", async () => {
    process.env.CAPABILITY_CATALOG_ARTIFACT_PATH =
      "/tmp/capability-contract-catalog-flow-exact.generated.json";
    const harness = createRootAuthIntegrationHarness();
    mountCapabilityContractCatalogFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    grantCatalogCapabilities(harness, identity.rootUserId);
    const session = await loginViaPasswordAndSsh(harness, identity);

    await invokeJson<MaterializeResponse>(harness.app, {
      method: "POST",
      path: "/v1/capability-contract-catalog/materialize",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });

    const exact = await invokeJson<ExactResponse>(harness.app, {
      method: "GET",
      path: "/v1/capability-contract-catalog/capabilities/notificationDelivery.resendEmail",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(exact.status).toBe(200);
    expect(exact.body.capabilityId).toBe("notificationDelivery.resendEmail");
    expect(exact.body.access.governingAuthzCapabilities).toEqual(["notification.email.resend"]);
    expect(exact.body.access.allowedRoles).toEqual(["RootUserAdmin"]);
    expect(exact.body.request.params).toEqual([
      expect.objectContaining({
        path: "params.emailId",
        format: "uuid",
      }),
    ]);
    expect(exact.body.request.constraints).toEqual([
      expect.objectContaining({
        constraintKind: "at-least-one",
      }),
    ]);
    expect(exact.body.response.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: "response.status" })]),
    );
    expect(exact.body.freshness.status).toBe("fresh");
  });

  it("TC-CAP-CATALOG-INT-004 and TC-CAP-CATALOG-INT-005 expose drift honestly and block strict export when persisted truth diverges", async () => {
    process.env.CAPABILITY_CATALOG_ARTIFACT_PATH =
      "/tmp/capability-contract-catalog-flow-drift.generated.json";
    const harness = createRootAuthIntegrationHarness();
    const repository = createInMemoryCapabilityContractCatalogRepository();
    mountCapabilityContractCatalogFeature(harness.app, harness, repository);
    const identity = harness.seedAuthIdentity();
    grantCatalogCapabilities(harness, identity.rootUserId);
    const session = await loginViaPasswordAndSsh(harness, identity);

    await invokeJson<MaterializeResponse>(harness.app, {
      method: "POST",
      path: "/v1/capability-contract-catalog/materialize",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });

    repository.records[0] = {
      ...repository.records[0],
      normalizedHash: "drifted-hash",
      updatedAt: new Date("2026-04-22T12:30:00.000Z"),
    };

    const drift = await invokeJson<DriftResponse>(harness.app, {
      method: "GET",
      path: "/v1/capability-contract-catalog/drift",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(drift.status).toBe(200);
    expect(drift.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          capabilityId: repository.records[0].capabilityId,
          freshnessStatus: "drifted",
          rematerializationRequired: true,
        }),
      ]),
    );

    const blockedExport = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/capability-contract-catalog/export",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { formatVersion: "v1" },
    });

    expect(blockedExport.status).toBe(409);
    expect(blockedExport.body.code).toBe("CAPABILITY_CATALOG_EXPORT_BLOCKED");

    const allowedExport = await invokeJson<ExportResponse>(harness.app, {
      method: "POST",
      path: "/v1/capability-contract-catalog/export",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { formatVersion: "v1", allowStale: true },
    });

    expect(allowedExport.status).toBe(200);
    expect(allowedExport.body.formatVersion).toBe("v1");
    expect(allowedExport.body.items[0]?.capabilityId).toBe(
      "notificationDelivery.getOutboundEmail",
    );
  });
});
