import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  createJobTypeRegistry,
  dispatchOutboxToQueue,
  enqueueTransactionalJobRequest,
  executeRegisteredJob,
} from "../../../src/features/jobProcessing";
import { InvalidJobRequestError } from "../../../src/features/jobProcessing/contract/errors";
import { createBullMqQueueProviderAdapter } from "../../../src/features/jobProcessing/domain/bullmqQueueProviderAdapter";
import {
  InMemoryJobProcessingRepository,
  createTestJobRequest,
} from "../../helpers/jobProcessingHarness";

const describeRedis =
  process.env.RUN_REDIS_JOB_PROVIDER_TESTS === "true" ? describe : describe.skip;

async function waitFor(assertion: () => void | Promise<void>): Promise<void> {
  const startedAt = Date.now();
  let lastError: unknown;

  while (Date.now() - startedAt < 5_000) {
    try {
      await assertion();
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  throw lastError;
}

function createRedisProvider() {
  return createBullMqQueueProviderAdapter({
    redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
    queueNamePrefix: `kanbien-test-${randomUUID()}`,
    removeOnComplete: { count: 0 },
    removeOnFail: { count: 0 },
  });
}

function createTestRegistry(handler: () => Promise<void>) {
  return createJobTypeRegistry([
    {
      jobType: "test.echo",
      ownerFeature: "jobProcessingTest",
      supportedPayloadVersions: {
        1: (payload) => {
          if (!payload || typeof payload !== "object") {
            throw new InvalidJobRequestError("payload object required");
          }
        },
      },
      executionScope: "platform-internal",
      defaultQueue: "default",
      defaultPriority: 50,
      retryPolicy: { maxAttempts: 2, initialDelayMs: 10, maxDelayMs: 20, jitterRatio: 0 },
      handler,
    },
  ]);
}

describeRedis("jobProcessing BullMQ provider adapter", () => {
  it("TC-JOB-PROC-INT-002 and TC-JOB-PROC-COMPAT-001 publishes durable job references without leaking payloads into worker data", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createTestRegistry(async () => undefined);
    const provider = createRedisProvider();
    const handledJobIds: string[] = [];

    try {
      const enqueued = await enqueueTransactionalJobRequest({
        repository,
        registry,
        request: createTestJobRequest({ payload: { entityId: "entity-1", secret: "keep-local" } }),
      });
      const outbox = await repository.getOutboxByJobId(enqueued.jobId);
      const job = await repository.findJobById(enqueued.jobId);

      await provider.publish({ job: job!, providerJobId: outbox!.outboxId });
      await provider.publish({ job: job!, providerJobId: outbox!.outboxId });
      const worker = await provider.createWorker({
        queueNames: ["default"],
        workerId: "bullmq-test-worker",
        handler: async (jobId) => {
          handledJobIds.push(jobId);
        },
      });

      try {
        await waitFor(() => expect(handledJobIds).toEqual([enqueued.jobId]));
      } finally {
        await worker.close();
      }
    } finally {
      await provider.obliterateQueuesForTests().catch(() => undefined);
      await provider.close();
    }
  });

  it("TC-JOB-PROC-RESILIENCE-002 preserves durable retry and dead-letter semantics through BullMQ worker retries", async () => {
    const repository = new InMemoryJobProcessingRepository();
    let handlerCalls = 0;
    const registry = createTestRegistry(async () => {
      handlerCalls += 1;
      const error = new Error("temporary provider-safe failure");
      Object.assign(error, { code: "TEMPORARY" });
      throw error;
    });
    const provider = createRedisProvider();

    try {
      const enqueued = await enqueueTransactionalJobRequest({
        repository,
        registry,
        request: createTestJobRequest(),
      });
      await dispatchOutboxToQueue({
        repository,
        provider,
        dispatcherId: "bullmq-test-dispatcher",
      });
      const worker = await provider.createWorker({
        queueNames: ["default"],
        workerId: "bullmq-test-worker",
        handler: async (jobId) => {
          const result = await executeRegisteredJob({
            repository,
            registry,
            jobId,
            workerId: "bullmq-test-worker",
          });
          if (result === "retryable") {
            throw new Error("Durable job remains retryable.");
          }
        },
      });

      try {
        await waitFor(() => {
          expect(repository.jobs.get(enqueued.jobId)?.status).toBe("dead");
          expect(repository.jobs.get(enqueued.jobId)?.deadLetterReason).toBe("TEMPORARY");
          expect(repository.attempts.size).toBe(2);
          expect(handlerCalls).toBe(2);
        });
      } finally {
        await worker.close();
      }
    } finally {
      await provider.obliterateQueuesForTests().catch(() => undefined);
      await provider.close();
    }
  });
});
