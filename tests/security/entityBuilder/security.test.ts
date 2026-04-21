import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createEntityAttributeInput,
  createInMemoryEntityBuilderRepository,
  mountEntityBuilderFeature,
} from "../../helpers/entityBuilderHarness";
import { loginViaPasswordAndSsh } from "../../helpers/webAppHierarchyBuilderHarness";

interface ErrorResponse {
  code: string;
  details?: { field?: string; reason?: string };
}

describe("entityBuilder security flows", () => {
  it("TC-ENTITY-BUILDER-SEC-001 rejects missing authenticated sessions on protected entity-definition routes", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountEntityBuilderFeature(harness.app, harness, createInMemoryEntityBuilderRepository());

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/entity-definitions",
    });

    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");
  });

  it("TC-ENTITY-BUILDER-SEC-002 denies create without the required capability and keeps the denial audit-visible", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountEntityBuilderFeature(harness.app, harness, createInMemoryEntityBuilderRepository());
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, ["entity-builder.read"]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/entity-definitions",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        entityKey: "customer_profile",
        entityName: "Customer Profile",
        description: "Customer profile durable truth.",
        status: "active",
        attributes: [createEntityAttributeInput()],
      },
    });

    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "root_capability_denied",
          eventOutcome: "failure",
          rootUserId: identity.rootUserId,
        }),
      ]),
    );
  });

  it("TC-ENTITY-BUILDER-SEC-003 rejects system-managed fields supplied by clients", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountEntityBuilderFeature(harness.app, harness, createInMemoryEntityBuilderRepository());
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const invalid = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/entity-definitions",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        entityKey: "customer_profile",
        entityName: "Customer Profile",
        description: "Customer profile durable truth.",
        status: "draft",
        entityDefinitionId: "11111111-1111-4111-8111-111111111111",
        attributes: [createEntityAttributeInput()],
      },
    });

    expect(invalid.status).toBe(400);
    expect(invalid.body).toMatchObject({
      code: "INVALID_REQUEST",
      details: {
        field: "entityDefinitionId",
        reason: "unexpected_field",
      },
    });
  });
});
