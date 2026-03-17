export type RootUser = {
  rootUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  sshPublicKeys: string[];
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
  deletedAt: string | null;
};

export type RootAuthChallenge = {
  challengeId: string;
  rootUserId: string;
  challengeValue: string;
  expiresAt: string;
  consumedAt: string | null;
  createdAt: string;
};

export type RootSession = {
  sessionId: string;
  rootUserId: string;
  issuedAt: string;
  expiresAt: string;
  lastActivityAt: string;
  revokedAt: string | null;
};
