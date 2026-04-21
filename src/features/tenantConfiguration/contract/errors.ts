export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class TenantConfigurationError extends Error {
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

export class InvalidRequestError extends TenantConfigurationError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class TenantAuthPolicyNotFoundError extends TenantConfigurationError {
  constructor() {
    super(404, "TENANT_AUTH_POLICY_TENANT_NOT_FOUND", "We could not find that tenant.", {
      field: "tenantId",
      reason: "not_found",
    });
  }
}

export class TenantAuthPolicyCurrentTenantRequiredError extends TenantConfigurationError {
  constructor() {
    super(
      409,
      "TENANT_AUTH_POLICY_CURRENT_TENANT_REQUIRED",
      "A current tenant context is required before that tenant auth policy can be read.",
      { field: "tenantId", reason: "current_tenant_required" },
    );
  }
}

export class TenantAuthPolicyValidationError extends TenantConfigurationError {
  constructor(details: ErrorDetails) {
    super(
      400,
      "TENANT_AUTH_POLICY_INVALID",
      "The tenant auth policy is missing one or more required bounds or violates the platform policy rules.",
      details,
    );
  }
}
