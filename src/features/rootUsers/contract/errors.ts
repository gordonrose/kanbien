export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class RootUserError extends Error {
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

export class InvalidRequestError extends RootUserError {
  constructor(message = "Your request could not be accepted because one or more fields are missing or invalid.", details?: ErrorDetails) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class RootUserNotFoundError extends RootUserError {
  constructor(message = "We could not find a root user with that ID.", details?: ErrorDetails) {
    super(404, "ROOT_USER_NOT_FOUND", message, details);
  }
}

export class RootUserEmailAlreadyExistsError extends RootUserError {
  constructor() {
    super(409, "ROOT_USER_EMAIL_ALREADY_EXISTS", "That email address is already in use by another active root user.", {
      field: "email",
      reason: "duplicate_active_email",
    });
  }
}

export class RootUserAlreadyDeletedError extends RootUserError {
  constructor() {
    super(409, "ROOT_USER_ALREADY_DELETED", "That root user has already been deleted.", {
      field: "rootUserId",
      reason: "already_deleted",
    });
  }
}

export class RootUserNotDeletedError extends RootUserError {
  constructor() {
    super(409, "ROOT_USER_NOT_DELETED", "That root user is not currently deleted.", {
      field: "rootUserId",
      reason: "not_deleted",
    });
  }
}

export class RootUserAlreadyAnonymizedError extends RootUserError {
  constructor(message = "That root user has already been anonymized and cannot be changed in this way.") {
    super(409, "ROOT_USER_ALREADY_ANONYMIZED", message, {
      field: "rootUserId",
      reason: "already_anonymized",
    });
  }
}
