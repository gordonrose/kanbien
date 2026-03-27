import { describe, expect, it } from "vitest";

describe("root admin shell state logic", () => {
  it("TC-ROOT-ADMIN-SHELL-UNIT-003 and TC-ROOT-ADMIN-SHELL-EDGE-003 blur the shell and show the expiry modal when the session expires", async () => {
    const stateModule = await import("../../../src/frontend/rootAdminShell/assets/state.mjs");
    const initial = stateModule.createInitialState();
    const authenticated = {
      ...initial,
      phase: "authenticated",
      session: {
        rootUserId: "ru_123",
        authPrincipalId: "ap_123",
        displayName: "Root Admin",
        email: "root@example.test",
        expiresAt: "2026-03-27T10:00:00.000Z",
      },
    };

    const expired = stateModule.markSessionExpired(authenticated);
    const flags = stateModule.deriveViewFlags(expired);

    expect(expired.sessionExpired).toBe(true);
    expect(flags.showShellView).toBe(true);
    expect(flags.showExpiryOverlay).toBe(true);
  });
});
