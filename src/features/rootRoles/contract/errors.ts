export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class RootRoleError extends Error {
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

export class InvalidRequestError extends RootRoleError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class RootRoleNotFoundError extends RootRoleError {
  constructor(message = "We could not find a system root role with that ID.", details?: ErrorDetails) {
    super(404, "ROOT_ROLE_NOT_FOUND", message, details);
  }
}

export class RootRoleAssignmentNotFoundError extends RootRoleError {
  constructor() {
    super(
      404,
      "ROOT_ROLE_ASSIGNMENT_NOT_FOUND",
      "We could not find a root-role assignment with that ID for the target root user.",
      { field: "rootRoleAssignmentId", reason: "not_found" },
    );
  }
}

export class RootRoleKeyAlreadyExistsError extends RootRoleError {
  constructor() {
    super(
      409,
      "ROOT_ROLE_KEY_ALREADY_EXISTS",
      "That system root role key is already in use by another active role.",
      { field: "roleKey", reason: "duplicate_active_role_key" },
    );
  }
}

export class RootRoleAlreadyDeactivatedError extends RootRoleError {
  constructor() {
    super(
      409,
      "ROOT_ROLE_ALREADY_DEACTIVATED",
      "That system root role is already deactivated.",
      { field: "rootRoleId", reason: "already_deactivated" },
    );
  }
}

export class RootRoleNotDeactivatedError extends RootRoleError {
  constructor() {
    super(
      409,
      "ROOT_ROLE_NOT_DEACTIVATED",
      "That system root role is not currently deactivated.",
      { field: "rootRoleId", reason: "not_deactivated" },
    );
  }
}

export class RootRoleProtectedError extends RootRoleError {
  constructor(message = "That protected system root role cannot be changed in that way.", details?: ErrorDetails) {
    super(409, "ROOT_ROLE_PROTECTED", message, details);
  }
}

export class RootRoleCapabilityUnknownError extends RootRoleError {
  constructor(capabilityKey: string) {
    super(
      400,
      "ROOT_ROLE_CAPABILITY_UNKNOWN",
      "One or more requested authz capability keys are not eligible for system root roles.",
      { field: capabilityKey, reason: "unknown_authz_capability" },
    );
  }
}

export class RootRoleInactiveError extends RootRoleError {
  constructor() {
    super(
      409,
      "ROOT_ROLE_INACTIVE",
      "That system root role is inactive and cannot be assigned in this way.",
      { field: "rootRoleId", reason: "inactive_role" },
    );
  }
}

export class RootRoleAssignmentAlreadyExistsError extends RootRoleError {
  constructor() {
    super(
      409,
      "ROOT_ROLE_ASSIGNMENT_ALREADY_EXISTS",
      "That root user already has an active assignment for the requested role.",
      { field: "rootRoleId", reason: "duplicate_active_assignment" },
    );
  }
}

export class RootUserRoleRequiredError extends RootRoleError {
  constructor() {
    super(
      409,
      "ROOT_USER_ROLE_REQUIRED",
      "A root user must always retain at least one active system root role.",
      { field: "rootUserId", reason: "last_role_required" },
    );
  }
}

export class RootUserAdminRoleRequiredError extends RootRoleError {
  constructor() {
    super(
      409,
      "ROOT_USER_ADMIN_ROLE_REQUIRED",
      "At least one active RootUserAdmin assignment must always remain in the platform.",
      { field: "rootRoleId", reason: "last_root_user_admin_required" },
    );
  }
}

export class RootUserNotFoundError extends RootRoleError {
  constructor(message = "We could not find an eligible root user with that ID.", details?: ErrorDetails) {
    super(404, "ROOT_USER_NOT_FOUND", message, details);
  }
}
