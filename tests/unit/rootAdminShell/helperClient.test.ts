import { describe, expect, it } from "vitest";

describe("root admin shell helper client", () => {
  it("TC-ROOT-ADMIN-SHELL-UNIT-001 builds the fixed localhost signing request correctly", async () => {
    const helperClient = await import(
      "../../../src/frontend/rootAdminShell/assets/helperClient.mjs"
    );

    expect(
      helperClient.createHelperRequest("challenge", "SHA256:abc123"),
    ).toEqual({
      url: "http://127.0.0.1:8787/v1/root-auth/sign-login-challenge",
      body: {
        challengeText: "challenge",
        publicKeyFingerprint: "SHA256:abc123",
      },
    });
  });

  it("TC-ROOT-ADMIN-SHELL-UNIT-002 rejects malformed helper responses", async () => {
    const helperClient = await import(
      "../../../src/frontend/rootAdminShell/assets/helperClient.mjs"
    );

    expect(
      helperClient.validateHelperResponse({
        signature: "-----BEGIN SSH SIGNATURE-----\nabc\n-----END SSH SIGNATURE-----\n",
        publicKeyFingerprint: "SHA256:abc123",
      }),
    ).toEqual({
      signature: "-----BEGIN SSH SIGNATURE-----\nabc\n-----END SSH SIGNATURE-----",
      publicKeyFingerprint: "SHA256:abc123",
    });
    expect(() => helperClient.validateHelperResponse({ publicKeyFingerprint: "SHA256:abc123" })).toThrow(
      "signature",
    );
    expect(() => helperClient.validateHelperResponse({ signature: "sig" })).toThrow("fingerprint");
  });
});
