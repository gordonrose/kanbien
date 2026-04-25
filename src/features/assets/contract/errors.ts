export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class AssetError extends Error {
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

export class InvalidAssetRequestError extends AssetError {
  constructor(
    message = "Your asset request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_ASSET_REQUEST", message, details);
  }
}

export class AssetUnauthorizedError extends AssetError {
  constructor() {
    super(401, "ASSET_UNAUTHORIZED", "Authentication is required for this asset action.");
  }
}

export class AssetForbiddenError extends AssetError {
  constructor(details?: ErrorDetails) {
    super(403, "ASSET_FORBIDDEN", "You are not allowed to perform this asset action.", details);
  }
}

export class AssetNotFoundError extends AssetError {
  constructor(details?: ErrorDetails) {
    super(404, "ASSET_NOT_FOUND", "We could not find a usable asset with that ID.", details);
  }
}

export class AssetConflictError extends AssetError {
  constructor(message: string, details?: ErrorDetails) {
    super(409, "ASSET_CONFLICT", message, details);
  }
}

export class AssetStorageVerificationError extends AssetError {
  constructor(message: string, details?: ErrorDetails) {
    super(422, "ASSET_STORAGE_VERIFICATION_FAILED", message, details);
  }
}
