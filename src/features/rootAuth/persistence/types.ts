export interface AuthPrincipalRecord {
  auth_principal_id: string;
  login_email: string;
  login_email_normalized: string;
  auth_status: "active" | "disabled";
  password_changed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface AuthPrincipalWithRootUserRecord extends AuthPrincipalRecord {
  root_user_id: string;
}

export interface AuthSshPublicKeyRecord {
  auth_ssh_public_key_id: string;
  auth_principal_id: string;
  label: string;
  algorithm: string;
  public_key_openssh: string;
  fingerprint: string;
  status: "active" | "revoked";
  created_at: Date;
  revoked_at: Date | null;
}

export interface AuthLoginChallengeRecord {
  challenge_id: string;
  auth_principal_id: string;
  purpose: string;
  challenge_text: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}

export interface AuthSessionRecord {
  session_id: string;
  auth_principal_id: string;
  root_user_id: string;
  authenticated_at: Date;
  expires_at: Date;
  revoked_at: Date | null;
  created_at: Date;
}

export interface ActiveAuthSessionRecord extends AuthSessionRecord {}

export interface CreateAuthPrincipalInput {
  authPrincipalId: string;
  loginEmail: string;
  loginEmailNormalized: string;
  password: string;
}

export interface CreateAuthLinkInput {
  linkId: string;
  authPrincipalId: string;
  rootUserId: string;
}

export interface CreateAuthChallengeInput {
  challengeId: string;
  authPrincipalId: string;
  purpose: string;
  challengeText: string;
  expiresAt: Date;
}

export interface CreateAuthSessionInput {
  sessionId: string;
  authPrincipalId: string;
  rootUserId: string;
  authenticatedAt: Date;
  expiresAt: Date;
}

export interface AddAuthSshPublicKeyInput {
  keyId: string;
  authPrincipalId: string;
  label: string;
  algorithm: string;
  publicKeyOpenSsh: string;
  fingerprint: string;
}

export interface CreateAuthAuditEventInput {
  eventId: string;
  authPrincipalId?: string;
  rootUserId?: string;
  eventType: string;
  eventOutcome: "success" | "failure";
  ipAddress?: string;
  userAgent?: string;
  occurredAt: Date;
}
