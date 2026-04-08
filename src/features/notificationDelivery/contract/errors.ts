export interface ErrorDetails {
  field?: string;
  reason?: string;
}

export class NotificationDeliveryError extends Error {
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

export class InvalidRequestError extends NotificationDeliveryError {
  constructor(
    message = "Your request could not be accepted because one or more fields are missing or invalid.",
    details?: ErrorDetails,
  ) {
    super(400, "INVALID_REQUEST", message, details);
  }
}

export class OutboundEmailNotFoundError extends NotificationDeliveryError {
  constructor() {
    super(404, "OUTBOUND_EMAIL_NOT_FOUND", "We could not find an outbound email with that ID.", {
      field: "emailId",
      reason: "not_found",
    });
  }
}

export class DuplicateEmailRequestError extends NotificationDeliveryError {
  constructor() {
    super(
      409,
      "DUPLICATE_EMAIL_REQUEST",
      "That email payload was already requested very recently for the same recipient.",
      { field: "recipientEmail", reason: "duplicate_recent_request" },
    );
  }
}

export class NotificationProviderMisconfiguredError extends NotificationDeliveryError {
  constructor() {
    super(
      503,
      "NOTIFICATION_PROVIDER_MISCONFIGURED",
      "Notification delivery is not configured correctly right now.",
    );
  }
}

export class NotificationProviderUnavailableError extends NotificationDeliveryError {
  constructor() {
    super(
      503,
      "NOTIFICATION_PROVIDER_UNAVAILABLE",
      "Notification delivery is temporarily unavailable. Please try again later.",
    );
  }
}

export class NotificationSendFailedError extends NotificationDeliveryError {
  constructor() {
    super(
      502,
      "NOTIFICATION_SEND_FAILED",
      "The email provider could not accept that outbound email request.",
    );
  }
}
