import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { loginViaPasswordAndSsh } from "../../helpers/webAppHierarchyBuilderHarness";

interface EntityResponse {
  entityId: string;
  name: string;
  description: string;
  entityKey: string;
  featureName: string;
  tableName: string;
  idField: string;
  idColumn: string;
  scope: "root" | "tenant" | "shared-cross-tenant";
  routeBase: string;
  status: "draft" | "active" | "superseded" | "archived";
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

interface EntityListResponse {
  items: EntityResponse[];
  page: number;
  pageSize: number;
}

describe("entity integration flows", () => {
  it("TC-ENTITY-INT-001 creates, reads, lists, updates, and archives root-only Entity records", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<EntityResponse>(harness.app, {
      method: "POST",
      path: "/v1/entity",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        name: "Organization",
        description: "Organization is the first platform self-definition seed.",
        featureName: "organizations",
        scope: "root",
        status: "active",
      },
    });

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      name: "Organization",
      entityKey: "organization",
      featureName: "organizations",
      tableName: "organization",
      idField: "organizationId",
      idColumn: "organization_id",
      scope: "root",
      routeBase: "/organizations",
      status: "active",
      archivedAt: null,
    });

    const exact = await invokeJson<EntityResponse>(harness.app, {
      method: "GET",
      path: `/v1/entity/${created.body.entityId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(exact.status).toBe(200);
    expect(exact.body.entityId).toBe(created.body.entityId);

    const listed = await invokeJson<EntityListResponse>(harness.app, {
      method: "GET",
      path: "/v1/entity?status=active&namePrefix=Org",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(listed.status).toBe(200);
    expect(listed.body.items.map((item) => item.entityId)).toEqual([created.body.entityId]);

    const updated = await invokeJson<EntityResponse>(harness.app, {
      method: "PATCH",
      path: `/v1/entity/${created.body.entityId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        description: "Organization remains the first platform self-definition seed.",
        tableName: "organization_record",
        status: "draft",
      },
    });
    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({
      description: "Organization remains the first platform self-definition seed.",
      tableName: "organization_record",
      status: "draft",
    });

    const archived = await invokeJson<EntityResponse>(harness.app, {
      method: "DELETE",
      path: `/v1/entity/${created.body.entityId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(archived.status).toBe(200);
    expect(archived.body.status).toBe("archived");
    expect(archived.body.archivedAt).not.toBeNull();

    const hidden = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: `/v1/entity/${created.body.entityId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(hidden.status).toBe(404);

    const archivedExact = await invokeJson<EntityResponse>(harness.app, {
      method: "GET",
      path: `/v1/entity/${created.body.entityId}?includeArchived=true`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(archivedExact.status).toBe(200);
    expect(archivedExact.body.status).toBe("archived");
  });
});
