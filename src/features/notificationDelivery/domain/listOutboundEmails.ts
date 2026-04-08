import { toOutboundEmailListResult } from "./presenters";
import type { NotificationDeliveryRepository } from "../persistence/repository";
import type { ListOutboundEmailsInput } from "./types";

export async function listOutboundEmails(
  repository: NotificationDeliveryRepository,
  input: ListOutboundEmailsInput,
) {
  const result = await repository.list(input);
  const latestAttemptsByEmailId = new Map(
    result.items.map((item) => [item.emailId, item.latestAttempt ?? null]),
  );
  return toOutboundEmailListResult(
    {
      items: result.items,
      page: input.page,
      pageSize: input.pageSize,
      totalPages: Math.ceil(Math.min(result.totalMatchingRecords, 10000) / input.pageSize),
      totalSearchableRecords: result.totalSearchableRecords,
      totalMatchingRecords: result.totalMatchingRecords,
    },
    latestAttemptsByEmailId,
  );
}
