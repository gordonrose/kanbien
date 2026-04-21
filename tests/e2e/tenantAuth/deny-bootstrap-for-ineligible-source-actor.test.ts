import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createOneTimeTokenMaterial } from "../../../src/lib/tokens";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryTenantAdminsRepository,
  createTenantAdminRecord,
} from "../../helpers/tenantAdminsHarness";
import { mountTenantAuthFeature } from "../../helpers/tenantAuthHarness";
import type { ErrorResponse } from "./helpers";

describe("tenantAuth e2e verification redemption denial for ineligible source actor", () => {
  it("JY-TENANT-AUTH-008 denies verification redemption when a previously eligible tenant-admin source actor is deleted before the proof is consumed", async () => {
    const harness = createRootAuthIntegrationHarness();
    const tenantAdminsRepository = createInMemoryTenantAdminsRepository();
    const mounted = mountTenantAuthFeature(harness.app, harness, {
      tenantAdminsRepository,
    });

    tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "journey-bootstrap-deny@example.com",
        normalizedEmail: "journey-bootstrap-deny@example.com",
        emailVerificationStatus: "verified",
      }),
    );

    const tokenMaterial = createOneTimeTokenMaterial({
      purpose: "email_verification",
      ttlSeconds: 60 * 60,
    });
    await tenantAdminsRepository.createVerificationToken({
      tenantAdminVerificationTokenId: randomUUID(),
      tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      tokenId: tokenMaterial.tokenId,
      secretHash: tokenMaterial.secretHash,
      expiresAt: tokenMaterial.expiresAt,
      requestedByActorType: "root_user",
      requestedByActorId: "11111111-1111-1111-1111-111111111111",
    });
    await tenantAdminsRepository.softDelete(
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    );

    const bootstrap = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenant-admin-verification/redeem",
      body: { token: tokenMaterial.rawToken },
    });

    expect(bootstrap.status).toBe(400);
    expect(bootstrap.body.code).toBe("TENANT_ADMIN_VERIFICATION_TOKEN_INVALID");
    expect(mounted.tenantAuthRepository.principals.size).toBe(0);
    expect(mounted.tenantAuthRepository.accessGrants.size).toBe(0);
  });
});
