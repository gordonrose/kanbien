export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class WebAppPageSettingsError extends Error {
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

export class InvalidRequestError extends WebAppPageSettingsError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class WebAppPageNotFoundError extends WebAppPageSettingsError {
  constructor(field: "webAppPageId" | "contextNavTargetPageIds" = "webAppPageId") {
    super(404, "WEB_APP_PAGE_NOT_FOUND", "We could not find that web-app page.", {
      field,
      reason: "not_found",
    });
  }
}

export class InvalidIconKeyError extends WebAppPageSettingsError {
  constructor() {
    super(409, "WEB_APP_PAGE_SETTINGS_INVALID_ICON_KEY", "That icon key is not approved.", {
      field: "iconKey",
      reason: "invalid_icon_key",
    });
  }
}

export class InvalidPageTemplateKeyError extends WebAppPageSettingsError {
  constructor() {
    super(
      409,
      "WEB_APP_PAGE_SETTINGS_INVALID_TEMPLATE_KEY",
      "That page template key is not approved.",
      { field: "pageTemplateKey", reason: "invalid_template_key" },
    );
  }
}

export class DuplicateContextNavTargetError extends WebAppPageSettingsError {
  constructor() {
    super(
      409,
      "WEB_APP_PAGE_SETTINGS_DUPLICATE_CONTEXT_NAV_TARGET",
      "That page is duplicated in the requested context navigation.",
      { field: "contextNavTargetPageIds", reason: "duplicate_target_page" },
    );
  }
}

export class InvalidContextNavTargetError extends WebAppPageSettingsError {
  constructor(details?: ErrorDetails) {
    super(
      409,
      "WEB_APP_PAGE_SETTINGS_INVALID_CONTEXT_NAV_TARGET",
      "That page cannot be used as a context-navigation target for the selected page.",
      details,
    );
  }
}
