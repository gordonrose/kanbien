import { OutboundEmailNotFoundError } from "../contract/errors";
import { toOutboundEmail } from "./presenters";
import type { NotificationDeliveryRepository } from "../persistence/repository";
import type { GetOutboundEmailInput } from "./types";

export async function getOutboundEmail(
  repository: NotificationDeliveryRepository,
  input: GetOutboundEmailInput,
) {
  const record = await repository.findById(input.emailId);
  if (!record) {
    throw new OutboundEmailNotFoundError();
  }
  return toOutboundEmail(record);
}
