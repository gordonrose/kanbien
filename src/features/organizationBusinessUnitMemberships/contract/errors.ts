export class OrganizationBusinessUnitMembershipError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "OrganizationBusinessUnitMembershipError";
  }
}

export class InvalidBusinessUnitMembershipRequestError extends OrganizationBusinessUnitMembershipError {
  constructor(message = "Business-unit membership request is invalid.", details?: Record<string, unknown>) {
    super("ORGANIZATION_BUSINESS_UNIT_MEMBERSHIP_INVALID_REQUEST", message, 400, details);
  }
}

export class BusinessUnitMembershipNotFoundError extends OrganizationBusinessUnitMembershipError {
  constructor() {
    super("ORGANIZATION_BUSINESS_UNIT_MEMBERSHIP_NOT_FOUND", "Business-unit membership cannot be found.", 404);
  }
}

export class IndividualMembershipDeferredError extends OrganizationBusinessUnitMembershipError {
  constructor() {
    super(
      "ORGANIZATION_BUSINESS_UNIT_MEMBERSHIP_INDIVIDUAL_TARGET_DEFERRED",
      "Individual membership targets require an approved individual/person record seam.",
      409,
      { reason: "individual_target_seam_deferred" },
    );
  }
}
