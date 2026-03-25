export interface LoginRootUserWithPasswordRequest {
  body: {
    email: string;
    password: string;
  };
}

export interface CreateRootUserAuthPrincipalRequest {
  body: {
    rootUserId: string;
    loginEmail: string;
    password: string;
  };
}

export interface CompleteRootUserSshChallengeRequest {
  body: {
    challengeId: string;
    signature: string;
    publicKeyFingerprint: string;
  };
}

export interface ChangeRootUserPasswordRequest {
  body: {
    currentPassword: string;
    newPassword: string;
  };
}

export interface AddRootUserSshPublicKeyRequest {
  body: {
    label: string;
    publicKey: string;
  };
}

export interface RevokeRootUserSshPublicKeyRequest {
  params: {
    keyId: string;
  };
}

export interface RevokeRootUserSessionRequest {
  params: {
    sessionId: string;
  };
}
