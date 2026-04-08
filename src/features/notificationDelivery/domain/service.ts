import type { NotificationDeliveryRepository } from "../persistence/repository";
import { getOutboundEmail } from "./getOutboundEmail";
import { listOutboundEmails } from "./listOutboundEmails";
import type { NotificationEmailProvider } from "./provider";
import { resendEmail } from "./resendEmail";
import { sendEmail } from "./sendEmail";
import type {
  GetOutboundEmailInput,
  ListOutboundEmailsInput,
  ResendEmailInput,
  SendEmailInput,
} from "./types";
import type {
  OutboundEmailResponse,
  PaginatedOutboundEmailsResponse,
} from "../contract/types";

export interface NotificationDeliveryService {
  sendEmail(input: SendEmailInput): Promise<OutboundEmailResponse>;
  resendEmail(input: ResendEmailInput): Promise<OutboundEmailResponse>;
  getOutboundEmail(input: GetOutboundEmailInput): Promise<OutboundEmailResponse>;
  listOutboundEmails(input: ListOutboundEmailsInput): Promise<PaginatedOutboundEmailsResponse>;
}

export function createNotificationDeliveryService(
  repository: NotificationDeliveryRepository,
  provider: NotificationEmailProvider,
): NotificationDeliveryService {
  return {
    sendEmail: (input) => sendEmail(repository, provider, input),
    resendEmail: (input) => resendEmail(repository, provider, input),
    getOutboundEmail: (input) => getOutboundEmail(repository, input),
    listOutboundEmails: (input) => listOutboundEmails(repository, input),
  };
}
