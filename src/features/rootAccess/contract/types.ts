export type RootUserId = string;
export type RootSessionId = string;
export type RootChallengeId = string;

export type CreateRootUserRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  sshPublicKeys: string[];
};

export type CreateRootUserResponse = {
  rootUserId: RootUserId;
  email: string;
  firstName: string;
  lastName: string;
  sshPublicKeys: string[];
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
  deletedAt: null;
};

export type GetRootUserProfileQuery = {
  rootUserId?: RootUserId;
  email?: string;
};

export type RootUserProfileResponse = {
  rootUserId: RootUserId;
  email: string;
  firstName: string;
  lastName: string;
  sshPublicKeys: string[];
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
  deletedAt: string | null;
};

export type UpdateRootUserProfileRequest = {
  rootUserId?: RootUserId;
  email?: string;
  updates: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
};

export type UpdateRootUserPasswordRequest = {
  rootUserId?: RootUserId;
  email?: string;
  newPassword: string;
};

export type UpdateRootUserPasswordResponse = {
  rootUserId: RootUserId;
  email: string;
  updatedAt: string;
};

export type UpdateRootUserSshKeysRequest = {
  rootUserId?: RootUserId;
  email?: string;
  sshPublicKeys: string[];
};

export type UpdateRootUserSshKeysResponse = {
  rootUserId: RootUserId;
  email: string;
  sshPublicKeys: string[];
  updatedAt: string;
};

export type DeleteRootUserRequest = {
  rootUserId?: RootUserId;
  email?: string;
};

export type DeleteRootUserResponse = {
  rootUserId: RootUserId;
  email: string;
  deletedAt: string;
  result: "deleted";
};

export type BeginRootAuthenticationRequest = {
  email: string;
  password: string;
};

export type BeginRootAuthenticationResponse = {
  challengeId: RootChallengeId;
  sshChallenge: string;
  expiresAt: string;
};

export type CompleteRootAuthenticationRequest = {
  challengeId: RootChallengeId;
  signedChallenge: string;
};

export type CompleteRootAuthenticationResponse = {
  accessToken: string;
  sessionId: RootSessionId;
  issuedAt: string;
  expiresAt: string;
  lastActivityAt: string;
};

export type RefreshRootSessionResponse = {
  accessToken: string;
  sessionId: RootSessionId;
  issuedAt: string;
  expiresAt: string;
  lastActivityAt: string;
};

export type RevokeRootSessionResponse = {
  sessionId: RootSessionId;
  revokedAt: string;
  result: "revoked";
};
