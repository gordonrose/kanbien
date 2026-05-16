export class OrganizationReferenceValueError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "OrganizationReferenceValueError";
  }
}

export class InvalidOrganizationReferenceValueRequestError extends OrganizationReferenceValueError {
  constructor(message = "Organization reference value request is invalid.", details?: Record<string, unknown>) {
    super("ORGANIZATION_REFERENCE_VALUE_INVALID_REQUEST", message, 400, details);
  }
}

export class OrganizationReferenceValueNotFoundError extends OrganizationReferenceValueError {
  constructor() {
    super("ORGANIZATION_REFERENCE_VALUE_NOT_FOUND", "Organization reference value cannot be found.", 404);
  }
}

export class OrganizationReferenceValueInUseError extends OrganizationReferenceValueError {
  constructor() {
    super("ORGANIZATION_REFERENCE_VALUE_IN_USE", "Organization reference value is already used.", 409);
  }
}

export class OrganizationReferenceReplacementInvalidError extends OrganizationReferenceValueError {
  constructor(message = "Replacement reference value is invalid.", details?: Record<string, unknown>) {
    super("ORGANIZATION_REFERENCE_REPLACEMENT_INVALID", message, 400, details);
  }
}
