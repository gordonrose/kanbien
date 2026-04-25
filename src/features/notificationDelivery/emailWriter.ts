import type { Pool } from "pg";
import { env } from "../../config/env";
import type { EnqueueJobRequest } from "../jobProcessing";
import { createNotificationDeliveryService } from "./domain/service";
import type { NotificationDeliveryService } from "./domain/service";
import { createPendingEmail } from "./domain/createPendingEmail";
import {
  NOTIFICATION_EMAIL_SEND_JOB_TYPE,
  NOTIFICATION_EMAIL_SEND_PAYLOAD_VERSION,
  createNotificationDeliveryJobTypes,
} from "./domain/jobTypes";
import type { SendEmailInput } from "./domain/types";
import { createPostgresNotificationDeliveryRepository } from "./persistence/postgresRepository";

export class ResendEmailProvider {
  public readonly providerName = "resend";

  constructor(
    private readonly options: {
      apiKey?: string;
      fromEmail: string;
    },
  ) {}

  async send(input: {
    recipientEmail: string;
    subject: string;
    bodyText: string;
  }) {
    if (!this.options.apiKey) {
      return {
        success: false as const,
        failureType: "misconfigured" as const,
        providerResponseCode: null,
        providerErrorSummary: "missing_resend_api_key",
      };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${this.options.apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from: this.options.fromEmail,
          to: [input.recipientEmail],
          subject: input.subject,
          text: input.bodyText,
        }),
      });
      const body = (await response.json().catch(() => null)) as
        | { id?: string; message?: string; name?: string }
        | null;

      if (!response.ok) {
        return {
          success: false as const,
          failureType: response.status >= 500 ? ("provider_unavailable" as const) : ("send_failed" as const),
          providerResponseCode: String(response.status),
          providerErrorSummary: body?.message ?? body?.name ?? "provider_send_failed",
        };
      }

      return {
        success: true as const,
        providerMessageId: body?.id ?? null,
        providerResponseCode: String(response.status),
      };
    } catch {
      return {
        success: false as const,
        failureType: "provider_unavailable" as const,
        providerResponseCode: null,
        providerErrorSummary: "network_error",
      };
    }
  }
}

export type NotificationEmailWriter = Pick<
  NotificationDeliveryService,
  "sendEmail" | "resendEmail"
>;

export interface NotificationEmailJobEnqueuer {
  enqueueTransactionalJobRequest(request: EnqueueJobRequest): Promise<unknown>;
}

function normalizeJobActorType(value: string): EnqueueJobRequest["requestedByActorType"] {
  if (value === "root_user" || value === "tenant_user" || value === "system") {
    return value;
  }
  return null;
}

export function createNotificationEmailProvider(): ResendEmailProvider {
  return new ResendEmailProvider({
    apiKey: env.notificationDelivery.providers.resend.apiKey,
    fromEmail: env.notificationDelivery.providers.resend.fromEmail,
  });
}

export function createNotificationEmailWriter(dbPool: Pool): NotificationDeliveryService {
  const repository = createPostgresNotificationDeliveryRepository(dbPool);
  const provider = createNotificationEmailProvider();

  return createNotificationDeliveryService(repository, provider);
}

export function createQueuedNotificationEmailWriter(
  dbPool: Pool,
  jobEnqueuer: NotificationEmailJobEnqueuer,
): NotificationDeliveryService {
  const repository = createPostgresNotificationDeliveryRepository(dbPool);
  const provider = createNotificationEmailProvider();
  const syncService = createNotificationDeliveryService(repository, provider);

  return {
    ...syncService,
    sendEmail: async (input: SendEmailInput) => {
      const pending = await createPendingEmail(repository, provider.providerName, input);
      await jobEnqueuer.enqueueTransactionalJobRequest({
        jobType: NOTIFICATION_EMAIL_SEND_JOB_TYPE,
        payloadVersion: NOTIFICATION_EMAIL_SEND_PAYLOAD_VERSION,
        payload: { outboundEmailId: pending.emailId },
        executionScope: "platform-internal",
        idempotencyKey: `notification-email-send:${pending.emailId}`,
        requestedByActorType: normalizeJobActorType(input.createdByActorType),
        requestedByActorId: input.createdByActorId,
        relatedEntityType: input.relatedEntityType,
        relatedEntityId: input.relatedEntityId,
      });
      return pending;
    },
  };
}

export function createNotificationDeliveryJobTypesForRuntime(dbPool: Pool) {
  const repository = createPostgresNotificationDeliveryRepository(dbPool);
  const provider = createNotificationEmailProvider();
  return createNotificationDeliveryJobTypes({ repository, provider });
}
