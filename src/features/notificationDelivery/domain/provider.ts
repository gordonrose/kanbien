export interface SendProviderEmailInput {
  recipientEmail: string;
  subject: string;
  bodyText: string;
}

export interface ProviderSendSuccess {
  success: true;
  providerMessageId: string | null;
  providerResponseCode: string | null;
}

export interface ProviderSendFailure {
  success: false;
  failureType: "provider_unavailable" | "send_failed" | "misconfigured";
  providerResponseCode: string | null;
  providerErrorSummary: string | null;
}

export type ProviderSendResult = ProviderSendSuccess | ProviderSendFailure;

export interface NotificationEmailProvider {
  readonly providerName: string;
  send(input: SendProviderEmailInput): Promise<ProviderSendResult>;
}
