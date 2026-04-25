export interface JobProcessingErrorDetails {
  field?: string;
  reason?: string;
}

export class JobProcessingError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: JobProcessingErrorDetails;

  constructor(status: number, code: string, message: string, details?: JobProcessingErrorDetails) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class InvalidJobRequestError extends JobProcessingError {
  constructor(message: string, details?: JobProcessingErrorDetails) {
    super(400, "INVALID_JOB_REQUEST", message, details);
  }
}

export class UnknownJobTypeError extends JobProcessingError {
  constructor(jobType: string) {
    super(400, "UNKNOWN_JOB_TYPE", "That job type is not registered.", {
      field: "jobType",
      reason: jobType,
    });
  }
}

export class DuplicateJobTypeError extends JobProcessingError {
  constructor(jobType: string) {
    super(409, "DUPLICATE_JOB_TYPE", "That job type is already registered.", {
      field: "jobType",
      reason: jobType,
    });
  }
}

export class DuplicateJobRequestError extends JobProcessingError {
  constructor() {
    super(409, "DUPLICATE_JOB_REQUEST", "That idempotent job request already exists.", {
      field: "idempotencyKey",
      reason: "duplicate",
    });
  }
}

export class JobProviderUnavailableError extends JobProcessingError {
  constructor() {
    super(503, "JOB_PROVIDER_UNAVAILABLE", "The job queue provider is unavailable.");
  }
}
