export class OrganizationLocationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "OrganizationLocationError";
  }
}

export class InvalidLocationRequestError extends OrganizationLocationError {
  constructor(message = "Location request is invalid.", details?: Record<string, unknown>) {
    super("ORGANIZATION_LOCATION_INVALID_REQUEST", message, 400, details);
  }
}

export class LocationNotFoundError extends OrganizationLocationError {
  constructor() {
    super("ORGANIZATION_LOCATION_NOT_FOUND", "Location cannot be found for the authorized context.", 404);
  }
}
