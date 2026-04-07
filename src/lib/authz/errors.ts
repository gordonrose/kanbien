export interface RootAuthorizationErrorDetails {
  reason?: string;
}

export class RootAuthorizationError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: RootAuthorizationErrorDetails;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: RootAuthorizationErrorDetails,
  ) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ForbiddenError extends RootAuthorizationError {
  constructor() {
    super(
      403,
      "FORBIDDEN",
      "You do not have permission to perform that action.",
      { reason: "missing_capability" },
    );
  }
}
