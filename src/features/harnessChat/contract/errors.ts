export class HarnessChatError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

export class HarnessChatInvalidRequestError extends HarnessChatError {
  constructor(details?: Record<string, unknown>) {
    super("HARNESS_CHAT_INVALID_REQUEST", "Invalid harness chat request.", 400, details);
  }
}

export class HarnessChatNotFoundError extends HarnessChatError {
  constructor() {
    super("HARNESS_CHAT_CONVERSATION_NOT_FOUND", "Harness chat conversation was not found.", 404);
  }
}

export class HarnessChatPacketNotFoundError extends HarnessChatError {
  constructor() {
    super("HARNESS_CHAT_PACKET_NOT_FOUND", "Harness chat packet revision was not found.", 404);
  }
}
