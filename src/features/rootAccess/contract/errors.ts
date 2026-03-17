export const ROOT_ACCESS_ERROR_CODES = [
  "INVALID_REQUEST",
  "MISSING_AUTHORIZATION_SECRET",
  "INVALID_AUTHORIZATION_SECRET",
  "EMAIL_ALREADY_IN_USE",
  "INVALID_EMAIL_FORMAT",
  "WEAK_PASSWORD",
  "INVALID_SSH_PUBLIC_KEY",
  "ROOT_USER_NOT_FOUND",
  "INVALID_CREDENTIALS",
  "ROOT_USER_DELETED",
  "AUTH_CHALLENGE_NOT_FOUND",
  "AUTH_CHALLENGE_EXPIRED",
  "AUTH_CHALLENGE_ALREADY_USED",
  "INVALID_CHALLENGE_SIGNATURE",
  "ACTIVE_SESSION_ALREADY_EXISTS",
  "MISSING_ACCESS_TOKEN",
  "INVALID_ACCESS_TOKEN",
  "SESSION_NOT_FOUND",
  "SESSION_EXPIRED",
  "SESSION_REVOKED",
] as const;

export type RootAccessErrorCode = (typeof ROOT_ACCESS_ERROR_CODES)[number];

export class RootAccessError extends Error {
  public readonly code: RootAccessErrorCode;
  public readonly status: number;

  constructor(code: RootAccessErrorCode, status: number, message: string) {
    super(message);
    this.name = "RootAccessError";
    this.code = code;
    this.status = status;
  }
}
