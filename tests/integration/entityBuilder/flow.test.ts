import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createEntityAttributeInput,
  createEntityDefinitionVersionRecord,
  createInMemoryEntityBuilderRepository,
  mountEntityBuilderFeature,
} from "../../helpers/entityBuilderHarness";
import { loginViaPasswordAndSsh } from "../../helpers/webAppHierarchyBuilderHarness";

interface EntityDefinitionVersionResponse {
  entityDefinitionId: string;
  entityKey: string;
  entityName: string;
  description: string;
  entityDefinitionVersionId: string;
  versionNumber: number;
  status: "draft" | "active" | "superseded" | "archived";
  attributes: Array<{
    attributeKey: string;
    helpText: string | null;
    placeholderText: string | null;
    defaultFormPatternKey: string | null;
  }>;
}

interface EntityDefinitionListResponse {
  items: Array<{
    entityKey: string;
    status: string;
    exportable: boolean;
  }>;
}

interface ValidationResponse {
  passFailState: "pass" | "fail";
  activationEligibility: boolean;
  exportEligibility: boolean;
  blockingIssues: Array<{ reason: string }>;
}

interface ExportResponse {
  exportFormatVersion: 1;
  items: Array<{
    entityKey: string;
    status: string;
    attributes: Array<{
      attributeKey: string;
      helpText: string | null;
      placeholderText: string | null;
      effectiveValidationRules: Array<{ ruleKey: string; stringValue: string | null }>;
    }>;
  }>;
}

describe("entityBuilder integration flows", () => {
  it("TC-ENTITY-BUILDER-INT-001 creates an active entity-definition version and exposes current exact and list reads through protected routes", async () => {
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
    expect(created.body.attributes[0]).toMatchObject({
      attributeKey: "support_email",
      helpText: "Used in governed forms.",
      placeholderText: "support@example.com",
      defaultFormPatternKey: "form-template.text-input",
    });

    const current = await invokeJson<EntityDefinitionVersionResponse>(harness.app, {
      method: "GET",
      path: "/v1/entity-definitions/by-key/customer_profile",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(current.status).toBe(200);
    expect(current.body.entityDefinitionVersionId).toBe(created.body.entityDefinitionVersionId);

    const exact = await invokeJson<EntityDefinitionVersionResponse>(harness.app, {
      method: "GET",
      path: `/v1/entity-definitions/versions/${created.body.entityDefinitionVersionId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(exact.status).toBe(200);
    expect(exact.body.entityKey).toBe("customer_profile");

    const listed = await invokeJson<EntityDefinitionListResponse>(harness.app, {
      method: "GET",
      path: "/v1/entity-definitions",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(listed.status).toBe(200);
    expect(listed.body.items).toEqual([
      expect.objectContaining({
        entityKey: "customer_profile",
        status: "active",
        exportable: true,
      }),
    ]);
  });

  it("TC-ENTITY-BUILDER-INT-002 preserves draft-update rules while keeping current reads anchored to the active version", async () => {
    const harness = createRootAuthIntegrationHarness();
    const seed = createEntityDefinitionVersionRecord();
    const repository = createInMemoryEntityBuilderRepository([seed]);
    mountEntityBuilderFeature(harness.app, harness, repository);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const replacement = await invokeJson<EntityDefinitionVersionResponse>(harness.app, {
      method: "POST",
      path: "/v1/entity-definitions",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        entityKey: "customer_profile",
        entityName: "Customer Profile",
        description: "Customer profile durable truth v2.",
        status: "draft",
        attributes: [
          createEntityAttributeInput({
            attributeKey: "billing_email",
            label: "Billing Email",
            description: "Billing email address.",
          }),
        ],
      },
    });
    expect(replacement.status).toBe(201);
    expect(replacement.body.status).toBe("draft");
    expect(replacement.body.versionNumber).toBe(2);

    const currentBeforeActivation = await invokeJson<EntityDefinitionVersionResponse>(harness.app, {
      method: "GET",
      path: "/v1/entity-definitions/by-key/customer_profile",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(currentBeforeActivation.status).toBe(200);
    expect(currentBeforeActivation.body.entityDefinitionVersionId).toBe(
      seed.entityDefinitionVersionId,
    );

    const deniedUpdate = await invokeJson<{ code: string }>(harness.app, {
      method: "PATCH",
      path: `/v1/entity-definitions/${seed.entityDefinitionVersionId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        entityName: "Should Not Mutate Active Version",
      },
    });
    expect(deniedUpdate.status).toBe(409);
    expect(deniedUpdate.body.code).toBe("ENTITY_DEFINITION_VERSION_NOT_DRAFT");

    const activatedReplacement = await invokeJson<EntityDefinitionVersionResponse>(harness.app, {
      method: "PATCH",
      path: `/v1/entity-definitions/${replacement.body.entityDefinitionVersionId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        status: "active",
      },
    });
    expect(activatedReplacement.status).toBe(200);
    expect(activatedReplacement.body.status).toBe("active");

    const currentAfterActivation = await invokeJson<EntityDefinitionVersionResponse>(harness.app, {
      method: "GET",
      path: "/v1/entity-definitions/by-key/customer_profile",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(currentAfterActivation.status).toBe(200);
    expect(currentAfterActivation.body.entityDefinitionVersionId).toBe(
      replacement.body.entityDefinitionVersionId,
    );

    const historical = await invokeJson<EntityDefinitionVersionResponse>(harness.app, {
      method: "GET",
      path: `/v1/entity-definitions/versions/${seed.entityDefinitionVersionId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(historical.status).toBe(200);
    expect(historical.body.status).toBe("superseded");
  });

  it("TC-ENTITY-BUILDER-INT-003 keeps validation activation and export aligned for incomplete and complete versions", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountEntityBuilderFeature(harness.app, harness, createInMemoryEntityBuilderRepository());
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const createdDraft = await invokeJson<EntityDefinitionVersionResponse>(harness.app, {
      method: "POST",
      path: "/v1/entity-definitions",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        entityKey: "invoice_profile",
        entityName: "Invoice Profile",
        description: "Invoice profile durable truth.",
        status: "draft",
        attributes: [],
      },
    });
    expect(createdDraft.status).toBe(201);
    expect(createdDraft.body.status).toBe("draft");

    const invalidValidation = await invokeJson<ValidationResponse>(harness.app, {
      method: "POST",
      path: `/v1/entity-definitions/versions/${createdDraft.body.entityDefinitionVersionId}/validate`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(invalidValidation.status).toBe(200);
    expect(invalidValidation.body.passFailState).toBe("fail");
    expect(invalidValidation.body.blockingIssues.map((item) => item.reason)).toContain(
      "empty_version",
    );

    const updated = await invokeJson<EntityDefinitionVersionResponse>(harness.app, {
      method: "PATCH",
      path: `/v1/entity-definitions/${createdDraft.body.entityDefinitionVersionId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        status: "active",
        attributes: [createEntityAttributeInput({ attributeKey: "billing_email" })],
      },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe("active");

    const validValidation = await invokeJson<ValidationResponse>(harness.app, {
      method: "POST",
      path: `/v1/entity-definitions/versions/${createdDraft.body.entityDefinitionVersionId}/validate`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(validValidation.status).toBe(200);
    expect(validValidation.body).toMatchObject({
      passFailState: "pass",
      activationEligibility: true,
      exportEligibility: true,
    });

    const exported = await invokeJson<ExportResponse>(harness.app, {
      method: "POST",
      path: "/v1/entity-definitions/export",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        entityKeys: ["invoice_profile"],
      },
    });
    expect(exported.status).toBe(200);
    expect(exported.body.exportFormatVersion).toBe(1);
    expect(exported.body.items[0]).toMatchObject({
      entityKey: "invoice_profile",
      status: "active",
    });
    expect(exported.body.items[0]?.attributes[0]?.effectiveValidationRules).toEqual([
      expect.objectContaining({
        ruleKey: "type_format",
        stringValue: "email",
      }),
    ]);
  });

  it("TC-ENTITY-BUILDER-INT-004 returns catalogs that stay aligned with accepted enum defaults", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountEntityBuilderFeature(harness.app, harness, createInMemoryEntityBuilderRepository());
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const typeCatalog = await invokeJson<Array<{ attributeType: string; valueCardinality: string; suggestedDefaultFormPatternKey: string | null }>>(
      harness.app,
      {
        method: "GET",
        path: "/v1/entity-definitions/catalogs/attribute-types",
        headers: { authorization: `Bearer ${session.sessionId}` },
      },
    );
    expect(typeCatalog.status).toBe(200);
    expect(typeCatalog.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attributeType: "enum",
          valueCardinality: "single",
          suggestedDefaultFormPatternKey: "simple-select.single",
        }),
        expect.objectContaining({
          attributeType: "enum",
          valueCardinality: "multiple",
          suggestedDefaultFormPatternKey: "drawer-select.multi-select",
        }),
      ]),
    );

    const formCatalog = await invokeJson<Array<{ patternKey: string }>>(harness.app, {
      method: "GET",
      path: "/v1/entity-definitions/catalogs/form-patterns",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(formCatalog.status).toBe(200);
    expect(formCatalog.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ patternKey: "simple-select.single" }),
        expect.objectContaining({ patternKey: "drawer-select.multi-select" }),
      ]),
    );
  });
});
