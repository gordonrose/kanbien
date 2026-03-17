import { describe, expect, it } from "vitest";
import {
  parseBeginRootAuthenticationRequest,
  parseCompleteRootAuthenticationRequest,
  parseCreateRootUserRequest,
  parseDeleteRootUserRequest,
  parseGetRootUserProfileQuery,
  parseUpdateRootUserPasswordRequest,
  parseUpdateRootUserProfileRequest,
  parseUpdateRootUserSshKeysRequest,
} from "../../../src/features/rootAccess/contract/schemas";

describe("rootAccess contract validation", () => {
  it("accepts a valid createRootUser request", () => {
    const parsed = parseCreateRootUserRequest({
      email: "root@example.com",
      password: "StrongPassword123!",
      firstName: "Root",
      lastName: "User",
      sshPublicKeys: ["ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAITestKey root@example.com"],
    });

    expect(parsed.email).toBe("root@example.com");
    expect(parsed.sshPublicKeys).toHaveLength(1);
  });

  it("rejects createRootUser when sshPublicKeys is empty", () => {
    expect(() =>
      parseCreateRootUserRequest({
        email: "root@example.com",
        password: "StrongPassword123!",
        firstName: "Root",
        lastName: "User",
        sshPublicKeys: [],
      }),
    ).toThrow("Invalid createRootUser request");
  });

  it("requires exactly one identifier for getRootUserProfile", () => {
    expect(() =>
      parseGetRootUserProfileQuery({
        rootUserId: "user-1",
        email: "root@example.com",
      }),
    ).toThrow("Invalid getRootUserProfile query");
  });

  it("requires at least one update field for updateRootUserProfile", () => {
    expect(() =>
      parseUpdateRootUserProfileRequest({
        rootUserId: "user-1",
        updates: {},
      }),
    ).toThrow("At least one profile update field is required");
  });

  it("requires exactly one identifier for updateRootUserPassword", () => {
    expect(() =>
      parseUpdateRootUserPasswordRequest({
        rootUserId: "user-1",
        email: "root@example.com",
        newPassword: "NextPassword123!",
      }),
    ).toThrow("Invalid updateRootUserPassword request");
  });

  it("requires a non-empty sshPublicKeys array for updateRootUserSshKeys", () => {
    expect(() =>
      parseUpdateRootUserSshKeysRequest({
        email: "root@example.com",
        sshPublicKeys: [],
      }),
    ).toThrow("Invalid updateRootUserSshKeys request");
  });

  it("requires exactly one identifier for deleteRootUser", () => {
    expect(() =>
      parseDeleteRootUserRequest({
        rootUserId: "user-1",
        email: "root@example.com",
      }),
    ).toThrow("Invalid deleteRootUser request");
  });

  it("requires email and password for beginRootAuthentication", () => {
    expect(() =>
      parseBeginRootAuthenticationRequest({
        email: "root@example.com",
      }),
    ).toThrow("Invalid beginRootAuthentication request");
  });

  it("requires challengeId and signedChallenge for completeRootAuthentication", () => {
    expect(() =>
      parseCompleteRootAuthenticationRequest({
        challengeId: "challenge-1",
      }),
    ).toThrow("Invalid completeRootAuthentication request");
  });
});
