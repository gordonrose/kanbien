export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class WebAppHierarchyError extends Error {
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

export class InvalidRequestError extends WebAppHierarchyError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class RootFamilyNotFoundError extends WebAppHierarchyError {
  constructor() {
    super(404, "WEB_APP_ROOT_FAMILY_NOT_FOUND", "We could not find that web-app root family.", {
      field: "rootFamilyId",
      reason: "not_found",
    });
  }
}

export class ModuleNotFoundError extends WebAppHierarchyError {
  constructor() {
    super(404, "WEB_APP_MODULE_NOT_FOUND", "We could not find that web-app module.", {
      field: "webAppModuleId",
      reason: "not_found",
    });
  }
}

export class InvalidModuleLandingPageError extends WebAppHierarchyError {
  constructor(details?: ErrorDetails) {
    super(
      409,
      "WEB_APP_INVALID_MODULE_LANDING_PAGE",
      "That page cannot be used as the landing page for the selected module.",
      details,
    );
  }
}

export class PageNotFoundError extends WebAppHierarchyError {
  constructor() {
    super(404, "WEB_APP_PAGE_NOT_FOUND", "We could not find that web-app page.", {
      field: "webAppPageId",
      reason: "not_found",
    });
  }
}

export class ModuleKeyAlreadyExistsError extends WebAppHierarchyError {
  constructor() {
    super(
      409,
      "WEB_APP_MODULE_KEY_ALREADY_EXISTS",
      "That module key is already in use by another module.",
      { field: "moduleKey", reason: "duplicate_module_key" },
    );
  }
}

export class PageKeyAlreadyExistsError extends WebAppHierarchyError {
  constructor() {
    super(409, "WEB_APP_PAGE_KEY_ALREADY_EXISTS", "That page key is already in use by another page.", {
      field: "pageKey",
      reason: "duplicate_page_key",
    });
  }
}

export class RouteSegmentAlreadyExistsError extends WebAppHierarchyError {
  constructor() {
    super(
      409,
      "WEB_APP_ROUTE_SEGMENT_ALREADY_EXISTS",
      "That route segment is already in use for the requested parent scope.",
      { field: "routeSegment", reason: "duplicate_route_segment" },
    );
  }
}

export class InvalidPlacementError extends WebAppHierarchyError {
  constructor(details?: ErrorDetails) {
    super(
      409,
      "WEB_APP_INVALID_PLACEMENT",
      "That placement change is not allowed for the requested hierarchy shape.",
      details,
    );
  }
}

export class HierarchyCycleError extends WebAppHierarchyError {
  constructor() {
    super(
      409,
      "WEB_APP_HIERARCHY_CYCLE",
      "That move would create a page-parent cycle in the hierarchy.",
      { field: "targetParentPageId", reason: "cycle_detected" },
    );
  }
}

export class LiveRouteChangeBlockedError extends WebAppHierarchyError {
  constructor() {
    super(
      409,
      "WEB_APP_LIVE_ROUTE_CHANGE_BLOCKED",
      "That change would affect a live page route and is blocked until a compatibility path exists.",
      { field: "routeSegment", reason: "live_route_change_blocked" },
    );
  }
}

export class DiscoverySyncConflictError extends WebAppHierarchyError {
  constructor(details?: ErrorDetails) {
    super(
      409,
      "WEB_APP_DISCOVERY_SYNC_CONFLICT",
      "The requested discovery-backed hierarchy sync could not safely apply all selected changes.",
      details,
    );
  }
}

export class PageLocatorConflictError extends WebAppHierarchyError {
  constructor(details?: ErrorDetails) {
    super(
      409,
      "WEB_APP_PAGE_LOCATOR_CONFLICT",
      "The requested page-locator change conflicts with an existing active locator.",
      details,
    );
  }
}

export class DiscoveryLinkConflictError extends WebAppHierarchyError {
  constructor(details?: ErrorDetails) {
    super(
      409,
      "WEB_APP_DISCOVERY_LINK_CONFLICT",
      "The requested discovery-link change conflicts with an existing curated mapping.",
      details,
    );
  }
}

export class UnsupportedDesignSystemTemplateError extends WebAppHierarchyError {
  constructor() {
    super(
      400,
      "WEB_APP_UNSUPPORTED_DESIGN_SYSTEM_TEMPLATE",
      "That design-system template key is not supported in this slice.",
      { field: "templateKey", reason: "unsupported_template_key" },
    );
  }
}

export class DesignSystemMaterializationPreviewMismatchError extends WebAppHierarchyError {
  constructor() {
    super(
      409,
      "WEB_APP_DESIGN_SYSTEM_PREVIEW_MISMATCH",
      "That apply request no longer matches the current preview for the selected proposals.",
      { field: "previewHash", reason: "preview_mismatch" },
    );
  }
}

export class DesignSystemMaterializationBlockedError extends WebAppHierarchyError {
  constructor(details?: ErrorDetails) {
    super(
      409,
      "WEB_APP_DESIGN_SYSTEM_MATERIALIZATION_BLOCKED",
      "That design-system materialization cannot be applied safely in this slice.",
      details,
    );
  }
}
