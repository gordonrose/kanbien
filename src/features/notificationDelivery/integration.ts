import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import { env } from "../../config/env";
import { createNotificationDeliveryService } from "./domain/service";
import { createPostgresNotificationDeliveryRepository } from "./persistence/postgresRepository";
import { createNotificationDeliveryRouter } from "./transport/router";
import type { NotificationEmailProvider, ProviderSendResult } from "./domain/provider";

class ResendEmailProvider implements NotificationEmailProvider {
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
  }): Promise<ProviderSendResult> {
    if (!this.options.apiKey) {
      return {
        success: false,
        failureType: "misconfigured",
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
          success: false,
          failureType: response.status >= 500 ? "provider_unavailable" : "send_failed",
          providerResponseCode: String(response.status),
          providerErrorSummary: body?.message ?? body?.name ?? "provider_send_failed",
        };
      }

      return {
        success: true,
        providerMessageId: body?.id ?? null,
        providerResponseCode: String(response.status),
      };
    } catch {
      return {
        success: false,
        failureType: "provider_unavailable",
        providerResponseCode: null,
        providerErrorSummary: "network_error",
      };
    }
  }
}

export function createNotificationDeliveryFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const repository = createPostgresNotificationDeliveryRepository(dbPool);
  const provider = new ResendEmailProvider({
    apiKey: env.notificationDelivery.providers.resend.apiKey,
    fromEmail: env.notificationDelivery.providers.resend.fromEmail,
  });
  const service = createNotificationDeliveryService(repository, provider);

  return createNotificationDeliveryRouter(service, capabilityChecker, platformSecurityRepository);
}
