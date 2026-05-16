export class OrganizationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "OrganizationError";
  }
}

export class InvalidRequestError extends OrganizationError {
  constructor(message = "Invalid request.", details?: Record<string, unknown>) {
    super("INVALID_REQUEST", message, 400, details);
  }
}

export class OrganizationNotFoundError extends OrganizationError {
  constructor() {
    super("ORGANIZATION_NOT_FOUND", "Organization was not found.", 404);
  }
}

export class OrganizationNameAlreadyExistsError extends OrganizationError {
  constructor() {
    super(
      "ORGANIZATION_NAME_ALREADY_EXISTS",
      "An active organization with this name already exists in this tenant.",
      409,
    );
  }
}

export class OrganizationHierarchyConflictError extends OrganizationError {
  constructor(message = "Organization hierarchy rule was violated.", details?: Record<string, unknown>) {
    super("ORGANIZATION_HIERARCHY_CONFLICT", message, 409, details);
  }
}

export class OrganizationLifecycleConflictError extends OrganizationError {
  constructor(message = "Organization lifecycle rule was violated.", details?: Record<string, unknown>) {
    super("ORGANIZATION_LIFECYCLE_CONFLICT", message, 409, details);
  }
}
