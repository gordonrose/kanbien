export interface AuthPrincipal {
  authPrincipalId: string;
  loginEmail: string;
  authStatus: "active" | "disabled";
  passwordChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RootAuthChallengeResult {
  status: "SSH_CHALLENGE_REQUIRED";
  challengeId: string;
  challengeText: string;
  availableSshKeys: RootAuthLoginSshKeyOption[];
}

export interface RootAuthSessionSummary {
  status?: "AUTHENTICATED";
  sessionId: string;
  authPrincipalId?: string;
  rootUserId: string;
  authenticatedAt: string;
  expiresAt: string;
}

export interface RootAuthSshKeySummary {
  keyId: string;
  label: string;
  algorithm: string;
  fingerprint: string;
  status: "active" | "revoked";
  createdAt: string;
  revokedAt: string | null;
}

export interface RootAuthLoginSshKeyOption {
  keyId: string;
  label: string;
  fingerprint: string;
}

export interface RootAuthBrowserSessionSummary {
  rootUserId: string;
  authPrincipalId: string;
  displayName: string;
  email: string;
  expiresAt: string;
}

export interface LoginRootUserWithPasswordInput {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface CompleteRootUserSshChallengeInput {
  challengeId: string;
  signature: string;
  publicKeyFingerprint: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ChangeRootUserPasswordInput {
  authPrincipalId: string;
  rootUserId: string;
  currentSessionId: string;
  currentPassword: string;
  newPassword: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AddRootUserSshPublicKeyInput {
  authPrincipalId: string;
  rootUserId: string;
  label: string;
  publicKey: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RevokeRootUserSshPublicKeyInput {
  authPrincipalId: string;
  rootUserId: string;
  keyId: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LogoutRootUserSessionInput {
  authPrincipalId: string;
  rootUserId: string;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RevokeRootUserSessionInput {
  authPrincipalId: string;
  rootUserId: string;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
}
