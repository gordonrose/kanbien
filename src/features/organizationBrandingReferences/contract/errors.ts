export class OrganizationLogoError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "OrganizationLogoError";
  }
}

export class InvalidOrganizationLogoRequestError extends OrganizationLogoError {
  constructor(message = "Invalid organization logo request.", details?: Record<string, unknown>) {
    super("ORGANIZATION_LOGO_INVALID", message, 400, details);
  }
}

export class OrganizationLogoNotFoundError extends OrganizationLogoError {
  constructor(details?: Record<string, unknown>) {
    super("ORGANIZATION_LOGO_NOT_FOUND", "Organization logo relationship was not found.", 404, details);
  }
}

export class OrganizationLogoNotReadyError extends OrganizationLogoError {
  constructor(details?: Record<string, unknown>) {
    super("ORGANIZATION_LOGO_NOT_READY", "Logo asset is not ready for public relationship.", 409, details);
  }
}

export class OrganizationLogoTenantMismatchError extends OrganizationLogoError {
  constructor(details?: Record<string, unknown>) {
    super("ORGANIZATION_LOGO_TENANT_MISMATCH", "Logo asset does not belong to the organization tenant.", 403, details);
  }
}

