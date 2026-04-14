export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class TenantAdminError extends Error {
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

export class InvalidRequestError extends TenantAdminError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class TenantAdminNotFoundError extends TenantAdminError {
  constructor() {
    super(404, "TENANT_ADMIN_NOT_FOUND", "We could not find a tenant admin with that ID.", {
      field: "tenantAdminId",
      reason: "not_found",
    });
  }
}

export class TenantAdminEmailAlreadyExistsError extends TenantAdminError {
  constructor() {
    super(
      409,
      "TENANT_ADMIN_EMAIL_ALREADY_EXISTS",
      "That email address is already in use by another active tenant admin in this tenant.",
      { field: "email", reason: "duplicate_active_email" },
    );
  }
}

export class TenantAdminAlreadyVerifiedError extends TenantAdminError {
  constructor() {
    super(
      409,
      "TENANT_ADMIN_ALREADY_VERIFIED",
      "That tenant admin email address has already been verified.",
      { field: "tenantAdminId", reason: "already_verified" },
    );
  }
}

export class TenantAdminVerificationNotEligibleError extends TenantAdminError {
  constructor(message = "That tenant admin is not eligible for email verification right now.") {
    super(409, "TENANT_ADMIN_VERIFICATION_NOT_ELIGIBLE", message, {
      field: "tenantAdminId",
      reason: "verification_not_eligible",
    });
  }
}

export class TenantAdminOnboardingRestartNotEligibleError extends TenantAdminError {
  constructor(
    message = "That tenant admin is not eligible for onboarding restart right now.",
  ) {
    super(409, "TENANT_ADMIN_ONBOARDING_RESTART_NOT_ELIGIBLE", message, {
      field: "tenantAdminId",
      reason: "onboarding_restart_not_eligible",
    });
  }
}

export class TenantAdminVerificationTokenInvalidError extends TenantAdminError {
  constructor() {
    super(
      400,
      "TENANT_ADMIN_VERIFICATION_TOKEN_INVALID",
      "That tenant-admin verification token is missing, invalid, or no longer accepted.",
      { field: "token", reason: "invalid" },
    );
  }
}

export class TenantAdminVerificationTokenExpiredError extends TenantAdminError {
  constructor() {
    super(
      410,
      "TENANT_ADMIN_VERIFICATION_TOKEN_EXPIRED",
      "That tenant-admin verification token has expired.",
      { field: "token", reason: "expired" },
    );
  }
}

export class TenantAdminAlreadyDeletedError extends TenantAdminError {
  constructor() {
    super(409, "TENANT_ADMIN_ALREADY_DELETED", "That tenant admin has already been deleted.", {
      field: "tenantAdminId",
      reason: "already_deleted",
    });
  }
}

export class TenantAdminNotDeletedError extends TenantAdminError {
  constructor() {
    super(409, "TENANT_ADMIN_NOT_DELETED", "That tenant admin is not currently deleted.", {
      field: "tenantAdminId",
      reason: "not_deleted",
    });
  }
}
