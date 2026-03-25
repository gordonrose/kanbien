export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class RootAuthError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: ErrorDetails;

  constructor(status: number, code: string, message: string, details?: ErrorDetails) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class InvalidRequestError extends RootAuthError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class InvalidCredentialsError extends RootAuthError {
  constructor() {
    super(401, "INVALID_CREDENTIALS", "The supplied credentials were not accepted.");
  }
}

export class AuthPrincipalEmailAlreadyExistsError extends RootAuthError {
  constructor() {
    super(409, "AUTH_PRINCIPAL_EMAIL_ALREADY_EXISTS", "That login email is already registered for root auth.", {
      field: "loginEmail",
      reason: "duplicate_email",
    });
  }
}

export class RootUserNotFoundError extends RootAuthError {
  constructor() {
    super(404, "ROOT_USER_NOT_FOUND", "We could not find that root user.", {
      field: "rootUserId",
      reason: "not_found",
    });
  }
}

export class RootUserSignInBlockedError extends RootAuthError {
  constructor(reason: string) {
    super(403, "ROOT_USER_SIGN_IN_BLOCKED", "This root user is not allowed to sign in.", {
      field: "rootUserId",
      reason,
    });
  }
}

export class UnsupportedSshKeyAlgorithmError extends RootAuthError {
  constructor() {
    super(400, "UNSUPPORTED_SSH_KEY_ALGORITHM", "Only ssh-ed25519 public keys are supported in phase 1.", {
      field: "publicKey",
      reason: "unsupported_algorithm",
    });
  }
}

export class DuplicateSshPublicKeyError extends RootAuthError {
  constructor() {
    super(409, "DUPLICATE_SSH_PUBLIC_KEY", "That SSH public key is already registered.", {
      field: "publicKey",
      reason: "duplicate_key",
    });
  }
}

export class InvalidSshPublicKeyError extends RootAuthError {
  constructor() {
    super(400, "INVALID_SSH_PUBLIC_KEY", "The SSH public key could not be parsed.", {
      field: "publicKey",
      reason: "invalid_format",
    });
  }
}

export class SshChallengeNotFoundError extends RootAuthError {
  constructor() {
    super(404, "SSH_CHALLENGE_NOT_FOUND", "We could not find that SSH challenge.", {
      field: "challengeId",
      reason: "not_found",
    });
  }
}

export class SshChallengeExpiredError extends RootAuthError {
  constructor() {
    super(409, "SSH_CHALLENGE_EXPIRED", "That SSH challenge has expired.", {
      field: "challengeId",
      reason: "expired",
    });
  }
}

export class SshChallengeAlreadyUsedError extends RootAuthError {
  constructor() {
    super(409, "SSH_CHALLENGE_ALREADY_USED", "That SSH challenge has already been used.", {
      field: "challengeId",
      reason: "already_used",
    });
  }
}

export class InvalidSshSignatureError extends RootAuthError {
  constructor() {
    super(401, "INVALID_SSH_SIGNATURE", "The SSH signature was not accepted.", {
      field: "signature",
      reason: "invalid_signature",
    });
  }
}

export class InvalidCurrentPasswordError extends RootAuthError {
  constructor() {
    super(401, "INVALID_CURRENT_PASSWORD", "The current password was not accepted.", {
      field: "currentPassword",
      reason: "invalid_current_password",
    });
  }
}

export class InvalidNewPasswordError extends RootAuthError {
  constructor(reason: string) {
    super(400, "INVALID_NEW_PASSWORD", "The new password does not meet the required policy.", {
      field: "newPassword",
      reason,
    });
  }
}

export class SessionNotFoundError extends RootAuthError {
  constructor() {
    super(404, "SESSION_NOT_FOUND", "We could not find that session.", {
      field: "sessionId",
      reason: "not_found",
    });
  }
}

export class SshPublicKeyNotFoundError extends RootAuthError {
  constructor() {
    super(404, "SSH_PUBLIC_KEY_NOT_FOUND", "We could not find that SSH public key.", {
      field: "keyId",
      reason: "not_found",
    });
  }
}
