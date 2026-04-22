export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class CapabilityContractCatalogError extends Error {
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

export class InvalidRequestError extends CapabilityContractCatalogError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class CapabilityCatalogNotFoundError extends CapabilityContractCatalogError {
  constructor() {
    super(
      404,
      "CAPABILITY_CATALOG_NOT_FOUND",
      "We could not find a capability catalog record with that identifier.",
      { field: "capabilityId", reason: "not_found" },
    );
  }
}

export class MaterializationBlockedError extends CapabilityContractCatalogError {
  constructor(message = "Capability catalog materialization is blocked by unsupported or contradictory source truth.") {
    super(409, "CAPABILITY_CATALOG_MATERIALIZATION_BLOCKED", message);
  }
}

export class ExportBlockedError extends CapabilityContractCatalogError {
  constructor(message = "Capability catalog export is blocked because the requested records are stale or drifted.") {
    super(409, "CAPABILITY_CATALOG_EXPORT_BLOCKED", message);
  }
}
