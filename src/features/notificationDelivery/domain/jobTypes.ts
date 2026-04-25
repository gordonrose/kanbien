import { InvalidJobRequestError, type JobTypeDefinition } from "../../jobProcessing";
import type { NotificationDeliveryRepository } from "../persistence/repository";
import { deliverStoredEmail } from "./deliverStoredEmail";
import type { NotificationEmailProvider } from "./provider";

export const NOTIFICATION_EMAIL_SEND_JOB_TYPE = "notification.email.send";
export const NOTIFICATION_EMAIL_SEND_PAYLOAD_VERSION = 1;

export interface NotificationEmailSendJobPayload {
  outboundEmailId: string;
}

export function assertNotificationEmailSendJobPayload(
  payload: unknown,
): asserts payload is NotificationEmailSendJobPayload {
  if (!payload || typeof payload !== "object") {
    throw new InvalidJobRequestError("notification email job payload must be an object");
  }
  const outboundEmailId = (payload as NotificationEmailSendJobPayload).outboundEmailId;
  if (typeof outboundEmailId !== "string" || outboundEmailId.trim() === "") {
    throw new InvalidJobRequestError("outboundEmailId is required", {
      field: "outboundEmailId",
      reason: "required",
    });
  }
}

export function createNotificationDeliveryJobTypes(input: {
  repository: NotificationDeliveryRepository;
  provider: NotificationEmailProvider;
}): JobTypeDefinition[] {
  return [
    {
      jobType: NOTIFICATION_EMAIL_SEND_JOB_TYPE,
      ownerFeature: "notificationDelivery",
      supportedPayloadVersions: {
        [NOTIFICATION_EMAIL_SEND_PAYLOAD_VERSION]: assertNotificationEmailSendJobPayload,
      },
      executionScope: "platform-internal",
      defaultQueue: "default",
      defaultPriority: 50,
      retryPolicy: {
        maxAttempts: 5,
        initialDelayMs: 30_000,
        maxDelayMs: 30 * 60_000,
        jitterRatio: 0.2,
        retryableErrorCodes: [
          "NOTIFICATION_PROVIDER_UNAVAILABLE",
          "NOTIFICATION_SEND_FAILED",
        ],
        nonRetryableErrorCodes: [
          "INVALID_REQUEST",
          "OUTBOUND_EMAIL_NOT_FOUND",
          "NOTIFICATION_PROVIDER_MISCONFIGURED",
        ],
      },
      handler: async (payload) => {
        assertNotificationEmailSendJobPayload(payload);
        await deliverStoredEmail(input.repository, input.provider, {
          emailId: payload.outboundEmailId,
        });
      },
    },
  ];
}
