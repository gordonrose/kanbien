export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class DesignSystemCanonicalsError extends Error {
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

export class InvalidRequestError extends DesignSystemCanonicalsError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class CanonicalFamilyNotFoundError extends DesignSystemCanonicalsError {
  constructor(field: "canonicalFamilyId" | "familyKey" = "canonicalFamilyId") {
    super(404, "CANONICAL_FAMILY_NOT_FOUND", "We could not find that canonical family.", {
      field,
      reason: "not_found",
    });
  }
}

export class CanonicalReferenceNotFoundError extends DesignSystemCanonicalsError {
  constructor(field: "canonicalReferenceId" | "referenceId" = "canonicalReferenceId") {
    super(404, "CANONICAL_REFERENCE_NOT_FOUND", "We could not find that canonical reference.", {
      field,
      reason: "not_found",
    });
  }
}

export class CanonicalFamilyConflictError extends DesignSystemCanonicalsError {
  constructor(field: "familyKey" | "generatedLauncherRoutePath") {
    super(409, "CANONICAL_FAMILY_CONFLICT", "That canonical family conflicts with an existing record.", {
      field,
      reason: "duplicate",
    });
  }
}

export class CanonicalReferenceConflictError extends DesignSystemCanonicalsError {
  constructor(field: "referenceId" | "renderRoutePath") {
    super(409, "CANONICAL_REFERENCE_CONFLICT", "That canonical reference conflicts with an existing record.", {
      field,
      reason: "duplicate",
    });
  }
}

