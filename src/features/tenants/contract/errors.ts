export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class TenantError extends Error {
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

export class InvalidRequestError extends TenantError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class TenantNotFoundError extends TenantError {
  constructor(
    message = "We could not find a tenant with that ID.",
    details?: ErrorDetails,
  ) {
    super(404, "TENANT_NOT_FOUND", message, details);
  }
}

export class TenantBizIdAlreadyExistsError extends TenantError {
  constructor(details: ErrorDetails = { field: "bizId", reason: "duplicate_active_biz_id" }) {
    super(
      409,
      "TENANT_BIZ_ID_ALREADY_EXISTS",
      "That business identifier is already in use by another active tenant.",
      details,
    );
  }
}

export class TenantAlreadyDeletedError extends TenantError {
  constructor() {
    super(409, "TENANT_ALREADY_DELETED", "That tenant has already been deleted.", {
      field: "tenantId",
      reason: "already_deleted",
    });
  }
}

export class TenantNotDeletedError extends TenantError {
  constructor() {
    super(409, "TENANT_NOT_DELETED", "That tenant is not currently deleted.", {
      field: "tenantId",
      reason: "not_deleted",
    });
  }
}
