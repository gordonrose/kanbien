export class OrganizationExportError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "OrganizationExportError";
  }
}

export class InvalidOrganizationExportRequestError extends OrganizationExportError {
  constructor(message = "Invalid organization export request.", details?: Record<string, unknown>) {
    super("ORGANIZATION_EXPORT_INVALID_REQUEST", message, 400, details);
  }
}

export class OrganizationExportNotFoundError extends OrganizationExportError {
  constructor(details?: Record<string, unknown>) {
    super("ORGANIZATION_EXPORT_NOT_FOUND", "Organization export was not found.", 404, details);
  }
}

export class OrganizationExportForbiddenError extends OrganizationExportError {
  constructor(details?: Record<string, unknown>) {
    super("ORGANIZATION_EXPORT_FORBIDDEN", "Organization export access is forbidden.", 403, details);
  }
}

export class OrganizationExportNotReadyError extends OrganizationExportError {
  constructor(details?: Record<string, unknown>) {
    super("ORGANIZATION_EXPORT_NOT_READY", "Organization export is not ready for download.", 409, details);
  }
}

export class OrganizationExportExpiredError extends OrganizationExportError {
  constructor(details?: Record<string, unknown>) {
    super("ORGANIZATION_EXPORT_EXPIRED", "Organization export is no longer available.", 410, details);
  }
}
