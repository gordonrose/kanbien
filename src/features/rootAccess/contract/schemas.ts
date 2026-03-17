import type {
  BeginRootAuthenticationRequest,
  CompleteRootAuthenticationRequest,
  CreateRootUserRequest,
  DeleteRootUserRequest,
  GetRootUserProfileQuery,
  UpdateRootUserPasswordRequest,
  UpdateRootUserProfileRequest,
  UpdateRootUserSshKeysRequest,
} from "./types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isOptionalString(value: unknown): value is string | undefined {
  return typeof value === "undefined" || typeof value === "string";
}

function hasExactlyOneIdentifier(input: {
  rootUserId?: unknown;
  email?: unknown;
}): boolean {
  const hasRootUserId = isNonEmptyString(input.rootUserId);
  const hasEmail = isNonEmptyString(input.email);
  return Number(hasRootUserId) + Number(hasEmail) === 1;
}

export function parseCreateRootUserRequest(input: unknown): CreateRootUserRequest {
  const body = input as Record<string, unknown>;

  if (
    !body ||
    !isNonEmptyString(body.email) ||
    !isNonEmptyString(body.password) ||
    !isNonEmptyString(body.firstName) ||
    !isNonEmptyString(body.lastName) ||
    !Array.isArray(body.sshPublicKeys) ||
    body.sshPublicKeys.length === 0 ||
    !body.sshPublicKeys.every(isNonEmptyString)
  ) {
    throw new Error("Invalid createRootUser request");
  }

  return {
    email: body.email,
    password: body.password,
    firstName: body.firstName,
    lastName: body.lastName,
    sshPublicKeys: body.sshPublicKeys,
  };
}

export function parseGetRootUserProfileQuery(input: unknown): GetRootUserProfileQuery {
  const query = (input ?? {}) as Record<string, unknown>;

  if (!hasExactlyOneIdentifier(query)) {
    throw new Error("Invalid getRootUserProfile query");
  }

  return {
    rootUserId: isNonEmptyString(query.rootUserId) ? query.rootUserId : undefined,
    email: isNonEmptyString(query.email) ? query.email : undefined,
  };
}

export function parseUpdateRootUserProfileRequest(input: unknown): UpdateRootUserProfileRequest {
  const body = input as Record<string, unknown>;
  const updates = (body?.updates ?? {}) as Record<string, unknown>;

  if (!body || !hasExactlyOneIdentifier(body)) {
    throw new Error("Invalid updateRootUserProfile identifier");
  }

  if (
    !isOptionalString(updates.email) ||
    !isOptionalString(updates.firstName) ||
    !isOptionalString(updates.lastName)
  ) {
    throw new Error("Invalid updateRootUserProfile updates");
  }

  if (
    !isNonEmptyString(updates.email) &&
    !isNonEmptyString(updates.firstName) &&
    !isNonEmptyString(updates.lastName)
  ) {
    throw new Error("At least one profile update field is required");
  }

  return {
    rootUserId: isNonEmptyString(body.rootUserId) ? body.rootUserId : undefined,
    email: isNonEmptyString(body.email) ? body.email : undefined,
    updates: {
      email: isNonEmptyString(updates.email) ? updates.email : undefined,
      firstName: isNonEmptyString(updates.firstName) ? updates.firstName : undefined,
      lastName: isNonEmptyString(updates.lastName) ? updates.lastName : undefined,
    },
  };
}

export function parseUpdateRootUserPasswordRequest(input: unknown): UpdateRootUserPasswordRequest {
  const body = input as Record<string, unknown>;

  if (!body || !hasExactlyOneIdentifier(body) || !isNonEmptyString(body.newPassword)) {
    throw new Error("Invalid updateRootUserPassword request");
  }

  return {
    rootUserId: isNonEmptyString(body.rootUserId) ? body.rootUserId : undefined,
    email: isNonEmptyString(body.email) ? body.email : undefined,
    newPassword: body.newPassword,
  };
}

export function parseUpdateRootUserSshKeysRequest(input: unknown): UpdateRootUserSshKeysRequest {
  const body = input as Record<string, unknown>;

  if (
    !body ||
    !hasExactlyOneIdentifier(body) ||
    !Array.isArray(body.sshPublicKeys) ||
    body.sshPublicKeys.length === 0 ||
    !body.sshPublicKeys.every(isNonEmptyString)
  ) {
    throw new Error("Invalid updateRootUserSshKeys request");
  }

  return {
    rootUserId: isNonEmptyString(body.rootUserId) ? body.rootUserId : undefined,
    email: isNonEmptyString(body.email) ? body.email : undefined,
    sshPublicKeys: body.sshPublicKeys,
  };
}

export function parseDeleteRootUserRequest(input: unknown): DeleteRootUserRequest {
  const body = input as Record<string, unknown>;

  if (!body || !hasExactlyOneIdentifier(body)) {
    throw new Error("Invalid deleteRootUser request");
  }

  return {
    rootUserId: isNonEmptyString(body.rootUserId) ? body.rootUserId : undefined,
    email: isNonEmptyString(body.email) ? body.email : undefined,
  };
}

export function parseBeginRootAuthenticationRequest(
  input: unknown,
): BeginRootAuthenticationRequest {
  const body = input as Record<string, unknown>;

  if (!body || !isNonEmptyString(body.email) || !isNonEmptyString(body.password)) {
    throw new Error("Invalid beginRootAuthentication request");
  }

  return {
    email: body.email,
    password: body.password,
  };
}

export function parseCompleteRootAuthenticationRequest(
  input: unknown,
): CompleteRootAuthenticationRequest {
  const body = input as Record<string, unknown>;

  if (!body || !isNonEmptyString(body.challengeId) || !isNonEmptyString(body.signedChallenge)) {
    throw new Error("Invalid completeRootAuthentication request");
  }

  return {
    challengeId: body.challengeId,
    signedChallenge: body.signedChallenge,
  };
}
