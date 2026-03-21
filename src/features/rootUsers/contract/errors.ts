export class RootUsersError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    code: string,
    status: number,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class InvalidRequestError extends RootUsersError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("INVALID_REQUEST", 400, message, details);
  }
}

export class RootUserNotFoundError extends RootUsersError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("ROOT_USER_NOT_FOUND", 404, message, details);
  }
}

export class RootUserEmailAlreadyExistsError extends RootUsersError {
  constructor(details?: Record<string, unknown>) {
    super(
      "ROOT_USER_EMAIL_ALREADY_EXISTS",
      409,
      "That email address is already in use by another active root user.",
      details ?? { field: "email", reason: "duplicate_active_email" },
    );
  }
}

export class RootUserAlreadyDeletedError extends RootUsersError {
  constructor(details?: Record<string, unknown>) {
    super(
      "ROOT_USER_ALREADY_DELETED",
      409,
      "That root user has already been deleted.",
      details ?? { field: "rootUserId", reason: "already_deleted" },
    );
  }
}

export class RootUserNotDeletedError extends RootUsersError {
  constructor(details?: Record<string, unknown>) {
    super(
      "ROOT_USER_NOT_DELETED",
      409,
      "That root user is not currently deleted.",
      details ?? { field: "rootUserId", reason: "not_deleted" },
    );
  }
}

export class RootUserAlreadyAnonymizedError extends RootUsersError {
  constructor(message?: string, details?: Record<string, unknown>) {
    super(
      "ROOT_USER_ALREADY_ANONYMIZED",
      409,
      message ??
        "That root user has already been anonymized and cannot be reactivated.",
      details ?? { field: "rootUserId", reason: "already_anonymized" },
    );
  }
}
