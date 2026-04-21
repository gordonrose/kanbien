export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class EntityBuilderError extends Error {
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

export class InvalidRequestError extends EntityBuilderError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class EntityDefinitionNotFoundError extends EntityBuilderError {
  constructor(field: "entityKey" | "entityDefinitionVersionId" = "entityKey") {
    super(404, "ENTITY_DEFINITION_NOT_FOUND", "We could not find that entity definition.", {
      field,
      reason: "not_found",
    });
  }
}

export class EntityDefinitionVersionNotFoundError extends EntityBuilderError {
  constructor() {
    super(
      404,
      "ENTITY_DEFINITION_VERSION_NOT_FOUND",
      "We could not find that entity-definition version.",
      { field: "entityDefinitionVersionId", reason: "not_found" },
    );
  }
}

export class EntityDefinitionDuplicateKeyError extends EntityBuilderError {
  constructor() {
    super(
      409,
      "ENTITY_DEFINITION_DUPLICATE_KEY",
      "That entity key is already in use.",
      { field: "entityKey", reason: "duplicate_entity_key" },
    );
  }
}

export class EntityDefinitionVersionNotDraftError extends EntityBuilderError {
  constructor() {
    super(
      409,
      "ENTITY_DEFINITION_VERSION_NOT_DRAFT",
      "Only draft entity-definition versions may be updated.",
      { field: "status", reason: "non_draft_version" },
    );
  }
}

export class EntityDefinitionValidationFailedError extends EntityBuilderError {
  constructor() {
    super(
      409,
      "ENTITY_DEFINITION_VALIDATION_FAILED",
      "The entity-definition version is not valid for the requested lifecycle transition or export.",
      { field: "status", reason: "validation_failed" },
    );
  }
}

export class EntityAttributeDuplicateKeyError extends EntityBuilderError {
  constructor() {
    super(
      409,
      "ENTITY_ATTRIBUTE_DUPLICATE_KEY",
      "That attribute key is already in use in this version.",
      { field: "attributeKey", reason: "duplicate_attribute_key" },
    );
  }
}

export class EntityAttributeInvalidShapeError extends EntityBuilderError {
  constructor(details: ErrorDetails) {
    super(
      409,
      "ENTITY_ATTRIBUTE_INVALID_SHAPE",
      "That attribute shape is not valid for the declared entity-definition contract.",
      details,
    );
  }
}
