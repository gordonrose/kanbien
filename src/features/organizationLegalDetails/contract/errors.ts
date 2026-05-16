export class OrganizationLegalProfileError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "OrganizationLegalProfileError";
  }
}

export class InvalidLegalProfileRequestError extends OrganizationLegalProfileError {
  constructor(message = "Legal profile request is invalid.", details?: Record<string, unknown>) {
    super("ORGANIZATION_LEGAL_PROFILE_INVALID_REQUEST", message, 400, details);
  }
}

export class LegalProfileNotFoundError extends OrganizationLegalProfileError {
  constructor() {
    super("ORGANIZATION_LEGAL_PROFILE_NOT_FOUND", "Legal profile cannot be found for the authorized context.", 404);
  }
}

export class DuplicateActiveLegalProfileError extends OrganizationLegalProfileError {
  constructor() {
    super(
      "ORGANIZATION_LEGAL_PROFILE_DUPLICATE_ACTIVE",
      "Organization already has an active legal profile.",
      409,
    );
  }
}
