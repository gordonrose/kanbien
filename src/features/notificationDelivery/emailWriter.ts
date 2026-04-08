import type { Pool } from "pg";
import { env } from "../../config/env";
import { createNotificationDeliveryService } from "./domain/service";
import type { NotificationDeliveryService } from "./domain/service";
import type {
  ResendEmailInput,
  SendEmailInput,
} from "./domain/types";
import { createPostgresNotificationDeliveryRepository } from "./persistence/postgresRepository";

class ResendEmailProvider {
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

export function createNotificationEmailWriter(dbPool: Pool): NotificationDeliveryService {
  const repository = createPostgresNotificationDeliveryRepository(dbPool);
  const provider = new ResendEmailProvider({
    apiKey: env.notificationDelivery.providers.resend.apiKey,
    fromEmail: env.notificationDelivery.providers.resend.fromEmail,
  });

  return createNotificationDeliveryService(repository, provider);
}
