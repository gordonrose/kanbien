export class OrganizationSearchError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "OrganizationSearchError";
  }
}

export class InvalidOrganizationSearchRequestError extends OrganizationSearchError {
  constructor(message = "Invalid organization search request.", details?: Record<string, unknown>) {
    super("ORGANIZATION_SEARCH_INVALID_REQUEST", message, 400, details);
  }
}

