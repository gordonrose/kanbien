export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class WebAppSurfaceDiscoveryError extends Error {
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

export class InvalidRequestError extends WebAppSurfaceDiscoveryError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class DiscoveryScopeInvalidError extends WebAppSurfaceDiscoveryError {
  constructor() {
    super(
      400,
      "WEB_APP_DISCOVERY_SCOPE_INVALID",
      "That discovery scope is not supported.",
      { field: "scopeKey", reason: "invalid_scope" },
    );
  }
}

export class DiscoveryRunNotFoundError extends WebAppSurfaceDiscoveryError {
  constructor() {
    super(
      404,
      "WEB_APP_DISCOVERY_RUN_NOT_FOUND",
      "We could not find that web-app discovery run.",
      { field: "webAppDiscoveryRunId", reason: "not_found" },
    );
  }
}

export class DiscoveredWebAppSurfaceNotFoundError extends WebAppSurfaceDiscoveryError {
  constructor() {
    super(
      404,
      "DISCOVERED_WEB_APP_SURFACE_NOT_FOUND",
      "We could not find that discovered web-app surface.",
      { field: "discoveredWebAppSurfaceId", reason: "not_found" },
    );
  }
}

export class DiscoveredWebAppStructureNodeNotFoundError extends WebAppSurfaceDiscoveryError {
  constructor() {
    super(
      404,
      "DISCOVERED_WEB_APP_STRUCTURE_NODE_NOT_FOUND",
      "We could not find that discovered web-app structure node.",
      { field: "discoveredWebAppStructureNodeId", reason: "not_found" },
    );
  }
}

export class DiscoveredWebAppSurfaceLocatorInvalidError extends WebAppSurfaceDiscoveryError {
  constructor(details: ErrorDetails) {
    super(
      409,
      "DISCOVERED_WEB_APP_SURFACE_LOCATOR_INVALID",
      "That discovered web-app surface locator shape is not valid.",
      details,
    );
  }
}

export class DiscoveryStructureGraphInvalidError extends WebAppSurfaceDiscoveryError {
  constructor(details: ErrorDetails) {
    super(
      409,
      "DISCOVERED_WEB_APP_STRUCTURE_GRAPH_INVALID",
      "The discovery provider returned structure output that does not form a valid tree.",
      details,
    );
  }
}

export class DiscoveryStructureNodeLinkInvalidError extends WebAppSurfaceDiscoveryError {
  constructor(details: ErrorDetails) {
    super(
      409,
      "DISCOVERED_WEB_APP_STRUCTURE_NODE_LINK_INVALID",
      "The discovery provider returned a structure node with an invalid linked leaf posture.",
      details,
    );
  }
}

export class DiscoveryProviderOutputInvalidError extends WebAppSurfaceDiscoveryError {
  constructor(details: ErrorDetails) {
    super(
      409,
      "WEB_APP_DISCOVERY_PROVIDER_OUTPUT_INVALID",
      "The discovery provider returned output that does not match the approved contract.",
      details,
    );
  }
}
