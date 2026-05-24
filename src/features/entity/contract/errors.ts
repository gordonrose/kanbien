export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class EntityError extends Error {
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

export class InvalidRequestError extends EntityError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class EntityNotFoundError extends EntityError {
  constructor(message = "We could not find an entity with that ID.", details?: ErrorDetails) {
    super(404, "ENTITY_NOT_FOUND", message, details);
  }
}

export class EntityNameAlreadyExistsError extends EntityError {
  constructor() {
    super(409, "ENTITY_NAME_ALREADY_EXISTS", "That entity name is already in use by another current entity.", {
      field: "name",
      reason: "duplicate_current_name",
    });
  }
}

export class EntityAlreadyArchivedError extends EntityError {
  constructor() {
    super(409, "ENTITY_ALREADY_ARCHIVED", "That entity has already been archived.", {
      field: "entityId",
      reason: "already_archived",
    });
  }
}
