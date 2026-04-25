import { randomUUID } from "node:crypto";
import type { JobProcessingRepository } from "../persistence/repository";
import { sanitizeErrorSummary } from "./payloadSafety";
import type { QueueProviderAdapter } from "./provider";

export interface DispatchOutboxResult {
  claimed: number;
  dispatched: number;
  failed: number;
}

export async function dispatchOutboxToQueue(input: {
  repository: JobProcessingRepository;
  provider: QueueProviderAdapter;
  dispatcherId: string;
  batchSize?: number;
  leaseMs?: number;
  now?: Date;
}): Promise<DispatchOutboxResult> {
  const now = input.now ?? new Date();
  const claimed = await input.repository.claimPendingOutbox({
    dispatcherId: input.dispatcherId,
    limit: input.batchSize ?? 25,
    leaseUntil: new Date(now.getTime() + (input.leaseMs ?? 60_000)),
    now,
  });
  let dispatched = 0;
  let failed = 0;

  for (const item of claimed) {
    try {
      const result = await input.provider.publish({
        job: item.job,
        providerJobId: item.outbox.providerJobId ?? randomUUID(),
      });
      await input.repository.markOutboxDispatched({
        outboxId: item.outbox.outboxId,
        providerJobId: result.providerJobId,
        dispatchedAt: new Date(),
      });
      dispatched += 1;
    } catch (error) {
      await input.repository.markOutboxDispatchFailed({
        outboxId: item.outbox.outboxId,
        errorSummary: sanitizeErrorSummary(error),
        failedAt: new Date(),
      });
      failed += 1;
    }
  }

  return { claimed: claimed.length, dispatched, failed };
}
