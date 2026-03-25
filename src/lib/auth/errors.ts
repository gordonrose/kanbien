export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class AuthMiddlewareError extends Error {
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

export class UnauthorizedError extends AuthMiddlewareError {
  constructor(message = "Authentication is required to access this resource.") {
    super(401, "UNAUTHORIZED", message);
  }
}

export class InvalidSessionError extends AuthMiddlewareError {
  constructor(message = "Your session is invalid or has expired.") {
    super(401, "INVALID_SESSION", message);
  }
}
