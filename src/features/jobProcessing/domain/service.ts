import type { JobProcessingRepository } from "../persistence/repository";
import { dispatchOutboxToQueue } from "./dispatchOutboxToQueue";
import { enqueueTransactionalJobRequest } from "./enqueueTransactionalJobRequest";
import { executeRegisteredJob } from "./executeRegisteredJob";
import type { JobTypeRegistry } from "./jobRegistry";
import type { QueueProviderAdapter } from "./provider";

export function createJobProcessingService(input: {
  registry: JobTypeRegistry;
  repository: JobProcessingRepository;
  provider?: QueueProviderAdapter;
}) {
  return {
    enqueueTransactionalJobRequest: (request: Parameters<typeof enqueueTransactionalJobRequest>[0]["request"]) =>
      enqueueTransactionalJobRequest({
        request,
        registry: input.registry,
        repository: input.repository,
      }),
    dispatchOutboxToQueue: (dispatcherId: string) => {
      if (!input.provider) {
        throw new Error("Job queue provider adapter is not configured.");
      }
      return dispatchOutboxToQueue({
        repository: input.repository,
        provider: input.provider,
        dispatcherId,
      });
    },
    executeRegisteredJob: (jobId: string, workerId: string) =>
      executeRegisteredJob({
        jobId,
        workerId,
        registry: input.registry,
        repository: input.repository,
      }),
  };
}
