import { describe, expect, it } from "vitest";
import { RootAccessError } from "../../../src/features/rootAccess/contract/errors";
import { RootAccessService } from "../../../src/features/rootAccess/domain/service";

describe("rootAccess domain service baseline", () => {
  it("exposes createRootUser as a feature-owned service capability", async () => {
    const service = new RootAccessService();

    await expect(
      service.createRootUser({
        email: "root@example.com",
        password: "StrongPassword123!",
        firstName: "Root",
        lastName: "User",
        sshPublicKeys: ["ssh-ed25519 AAAAC3NzaTest root@example.com"],
      }),
    ).rejects.toBeInstanceOf(RootAccessError);
  });

  it("exposes getRootUserProfile as a feature-owned service capability", async () => {
    const service = new RootAccessService();

    await expect(
      service.getRootUserProfile({
        email: "root@example.com",
      }),
    ).rejects.toBeInstanceOf(RootAccessError);
  });

  it("exposes beginRootAuthentication as a feature-owned service capability", async () => {
    const service = new RootAccessService();

    await expect(
      service.beginRootAuthentication({
        email: "root@example.com",
        password: "StrongPassword123!",
      }),
    ).rejects.toBeInstanceOf(RootAccessError);
  });

  it("exposes completeRootAuthentication as a feature-owned service capability", async () => {
    const service = new RootAccessService();

    await expect(
      service.completeRootAuthentication({
        challengeId: "challenge-1",
        signedChallenge: "signed-value",
      }),
    ).rejects.toBeInstanceOf(RootAccessError);
  });

  it("exposes refreshRootSession as a feature-owned service capability", async () => {
    const service = new RootAccessService();

    await expect(service.refreshRootSession()).rejects.toBeInstanceOf(RootAccessError);
  });

  it("exposes revokeRootSession as a feature-owned service capability", async () => {
    const service = new RootAccessService();

    await expect(service.revokeRootSession()).rejects.toBeInstanceOf(RootAccessError);
  });
});
