export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class TenantAuthError extends Error {
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

export class InvalidRequestError extends TenantAuthError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class TenantAuthBootstrapInvalidError extends TenantAuthError {
  constructor() {
    super(
      401,
      "TENANT_AUTH_BOOTSTRAP_INVALID",
      "That tenant-auth bootstrap proof is missing, invalid, or no longer accepted.",
      { field: "verificationToken", reason: "invalid" },
    );
  }
}

export class TenantAuthBootstrapExpiredError extends TenantAuthError {
  constructor() {
    super(
      410,
      "TENANT_AUTH_BOOTSTRAP_EXPIRED",
      "That tenant-auth bootstrap proof has expired.",
      { field: "verificationToken", reason: "expired" },
    );
  }
}

export class TenantAuthPasswordSetupInvalidError extends TenantAuthError {
  constructor() {
    super(
      401,
      "TENANT_AUTH_PASSWORD_SETUP_INVALID",
      "That password-setup proof is missing, invalid, or no longer accepted.",
      { field: "bootstrapToken", reason: "invalid" },
    );
  }
}

export class TenantAuthPasswordSetupExpiredError extends TenantAuthError {
  constructor() {
    super(
      410,
      "TENANT_AUTH_PASSWORD_SETUP_EXPIRED",
      "That password-setup proof has expired.",
      { field: "bootstrapToken", reason: "expired" },
    );
  }
}

export class TenantAuthPasswordAlreadySetError extends TenantAuthError {
  constructor() {
    super(
      409,
      "TENANT_AUTH_PASSWORD_ALREADY_SET",
      "A password has already been set for that tenant-auth principal.",
      { field: "bootstrapToken", reason: "password_already_set" },
    );
  }
}

export class TenantAuthInvalidCredentialsError extends TenantAuthError {
  constructor() {
    super(
      401,
      "TENANT_AUTH_INVALID_CREDENTIALS",
      "The email address or password was not accepted.",
      { field: "email", reason: "invalid_credentials" },
    );
  }
}

export class TenantAuthNoTenantAccessError extends TenantAuthError {
  constructor() {
    super(
      403,
      "TENANT_AUTH_NO_TENANT_ACCESS",
      "That account does not currently have access to any active tenant context.",
      { field: "authPrincipalId", reason: "no_tenant_access" },
    );
  }
}

export class TenantAuthTenantNotAccessibleError extends TenantAuthError {
  constructor() {
    super(
      403,
      "TENANT_AUTH_TENANT_NOT_ACCESSIBLE",
      "That tenant is not accessible to the current authenticated principal.",
      { field: "tenantId", reason: "tenant_not_accessible" },
    );
  }
}
