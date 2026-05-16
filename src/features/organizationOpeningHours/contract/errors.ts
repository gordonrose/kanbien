export class OrganizationOpeningHoursError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "OrganizationOpeningHoursError";
  }
}

export class InvalidOpeningHoursRequestError extends OrganizationOpeningHoursError {
  constructor(message = "Opening hours request is invalid.", details?: Record<string, unknown>) {
    super("ORGANIZATION_OPENING_HOURS_INVALID", message, 400, details);
  }
}

export class WeeklyOpeningHoursOverlapError extends OrganizationOpeningHoursError {
  constructor(details?: Record<string, unknown>) {
    super("ORGANIZATION_WEEKLY_HOURS_OVERLAP", "Weekly opening-hour slots overlap.", 409, details);
  }
}

export class WeeklyOpeningHoursNotFoundError extends OrganizationOpeningHoursError {
  constructor() {
    super("ORGANIZATION_WEEKLY_HOURS_NOT_FOUND", "Weekly opening-hour slot cannot be found.", 404);
  }
}

export class OpeningHoursExceptionNotFoundError extends OrganizationOpeningHoursError {
  constructor() {
    super("ORGANIZATION_OPENING_HOURS_EXCEPTION_NOT_FOUND", "Opening-hours exception cannot be found.", 404);
  }
}
