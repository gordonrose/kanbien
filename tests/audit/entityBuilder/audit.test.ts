import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createEntityAttributeInput,
  createInMemoryEntityBuilderRepository,
  mountEntityBuilderFeature,
} from "../../helpers/entityBuilderHarness";
import { loginViaPasswordAndSsh } from "../../helpers/webAppHierarchyBuilderHarness";

interface EntityDefinitionVersionResponse {
  entityDefinitionVersionId: string;
  status: string;
}

interface ErrorResponse {
  code: string;
}

describe("entityBuilder audit visibility", () => {
  it("TC-ENTITY-BUILDER-AUD-001 keeps successful lifecycle mutations operator-visible through deterministic version responses", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountEntityBuilderFeature(harness.app, harness, createInMemoryEntityBuilderRepository());
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<EntityDefinitionVersionResponse>(harness.app, {
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

    expect(created.status).toBe(201);
    expect(created.body.status).toBe("active");
    expect(created.body.entityDefinitionVersionId).toEqual(expect.any(String));
  });

  it("TC-ENTITY-BUILDER-AUD-002 keeps denied privileged actions visible through platform security audit events", async () => {
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
          authPrincipalId: identity.authPrincipalId,
        }),
      ]),
    );
  });
});
