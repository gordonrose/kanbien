import { describe, expect, it } from "vitest";

describe("root admin shell state logic", () => {
  it("TC-ROOT-ADMIN-SHELL-UNIT-003 and TC-ROOT-ADMIN-SHELL-EDGE-003 resets authenticated shell state back to login when the session expires", async () => {
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

    const reset = stateModule.resetToLoginState(authenticated);
    const flags = stateModule.deriveViewFlags(reset);

    expect(reset.session).toBeNull();
    expect(reset.phase).toBe("login");
    expect(flags.showAuthView).toBe(true);
    expect(flags.showShellView).toBe(false);
  });
});
