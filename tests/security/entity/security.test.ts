import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { loginViaPasswordAndSsh } from "../../helpers/webAppHierarchyBuilderHarness";

interface ErrorResponse {
  code: string;
  details?: { field?: string; reason?: string };
}

describe("entity security flows", () => {
  it("TC-ENTITY-SEC-001 rejects missing authenticated sessions on protected Entity routes", async () => {
    const harness = createRootAuthIntegrationHarness();

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/entity",
    });

    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");
  });

  it("TC-ENTITY-SEC-002 denies create without the required root capability and records denial evidence", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, ["entity.read"]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/entity",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        name: "Organization",
        description: "Organization instruction seed.",
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

  it("TC-ENTITY-SEC-003 rejects system-managed fields supplied by clients", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const invalid = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/entity",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        entityId: "11111111-1111-4111-8111-111111111111",
        name: "Organization",
        description: "Organization instruction seed.",
      },
    });

    expect(invalid.status).toBe(400);
    expect(invalid.body).toMatchObject({
      code: "INVALID_REQUEST",
      details: {
        field: "entityId",
        reason: "unexpected_field",
      },
    });
  });
});
