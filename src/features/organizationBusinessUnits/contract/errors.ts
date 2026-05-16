export class OrganizationBusinessUnitError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "OrganizationBusinessUnitError";
  }
}

export class InvalidBusinessUnitRequestError extends OrganizationBusinessUnitError {
  constructor(message = "Business-unit request is invalid.", details?: Record<string, unknown>) {
    super("ORGANIZATION_BUSINESS_UNIT_INVALID_REQUEST", message, 400, details);
  }
}

export class BusinessUnitNotFoundError extends OrganizationBusinessUnitError {
  constructor() {
    super("ORGANIZATION_BUSINESS_UNIT_NOT_FOUND", "Business unit cannot be found for the authorized context.", 404);
  }
}

export class BusinessUnitHierarchyError extends OrganizationBusinessUnitError {
  constructor(message = "Business-unit hierarchy is invalid.", details?: Record<string, unknown>) {
    super("ORGANIZATION_BUSINESS_UNIT_HIERARCHY_INVALID", message, 409, details);
  }
}
