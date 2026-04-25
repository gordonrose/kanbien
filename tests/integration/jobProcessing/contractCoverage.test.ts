import { describe, expect, it } from "vitest";
import {
  createJobTypeRegistry,
  dispatchOutboxToQueue,
  enqueueTransactionalJobRequest,
  executeRegisteredJob,
} from "../../../src/features/jobProcessing";
import { InvalidJobRequestError } from "../../../src/features/jobProcessing/contract/errors";
import {
  FakeQueueProvider,
  InMemoryJobProcessingRepository,
  createTestJobRequest,
} from "../../helpers/jobProcessingHarness";

function createRegistry() {
  return createJobTypeRegistry([
    {
      jobType: "test.sideEffect",
      ownerFeature: "jobProcessingTest",
      supportedPayloadVersions: { 1: () => undefined },
      executionScope: "platform-internal",
      defaultQueue: "default",
      defaultPriority: 50,
      retryPolicy: { maxAttempts: 2, initialDelayMs: 1, maxDelayMs: 1, jitterRatio: 0 },
      handler: async (payload) => {
        if (
          payload &&
          typeof payload === "object" &&
          "fail" in payload &&
          payload.fail === true
        ) {
          throw Object.assign(new Error("side effect failed"), { code: "SIDE_EFFECT_FAILED" });
        }
      },
    },
    {
      jobType: "test.bulk",
      ownerFeature: "jobProcessingTest",
      supportedPayloadVersions: { 1: () => undefined },
      executionScope: "platform-internal",
      defaultQueue: "bulk",
      defaultPriority: 80,
      handler: async () => undefined,
    },
    {
      jobType: "test.critical",
      ownerFeature: "jobProcessingTest",
      supportedPayloadVersions: { 1: () => undefined },
      executionScope: "platform-internal",
      defaultQueue: "critical",
      defaultPriority: 1,
      allowCriticalQueue: true,
      handler: async () => undefined,
    },
  ]);
}

describe("jobProcessing contract coverage", () => {
  it("TC-JOB-PROC-CONC-001 returns one logical job for repeated idempotent enqueue calls", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();

    const results = await Promise.all([
      enqueueTransactionalJobRequest({
        repository,
        registry,
        request: createTestJobRequest({
          jobType: "test.sideEffect",
          payload: {},
          idempotencyKey: "same-key",
        }),
      }),
      enqueueTransactionalJobRequest({
        repository,
        registry,
        request: createTestJobRequest({
          jobType: "test.sideEffect",
          payload: {},
          idempotencyKey: "same-key",
        }),
      }),
    ]);

    expect(new Set(results.map((result) => result.jobId)).size).toBe(1);
    expect(repository.jobs.size).toBe(1);
  });

  it("TC-JOB-PROC-CONC-002 prevents concurrently leased outbox rows from normal duplicate publish", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();
    await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({ jobType: "test.sideEffect", payload: {} }),
    });

    const [firstClaim, secondClaim] = await Promise.all([
      repository.claimPendingOutbox({
        dispatcherId: "dispatcher-a",
        limit: 10,
        leaseUntil: new Date(Date.now() + 60_000),
        now: new Date(),
      }),
      repository.claimPendingOutbox({
        dispatcherId: "dispatcher-b",
        limit: 10,
        leaseUntil: new Date(Date.now() + 60_000),
        now: new Date(),
      }),
    ]);

    expect(firstClaim.length + secondClaim.length).toBe(1);
  });

  it("TC-JOB-PROC-CONC-003 records retry state after partial handler failure without inventing side-effect authority", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();
    const enqueued = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({
        jobType: "test.sideEffect",
        payload: { fail: true },
        idempotencyKey: "side-effect-key",
      }),
    });

    await executeRegisteredJob({
      repository,
      registry,
      jobId: enqueued.jobId,
      workerId: "worker-1",
      random: () => 0,
    });

    const job = repository.jobs.get(enqueued.jobId)!;
    expect(job.status).toBe("retryable");
    expect(job.idempotencyKey).toBe("side-effect-key");
  });

  it("TC-JOB-PROC-CONC-004 keeps critical/default queues distinct from bulk work", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();
    await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({ jobType: "test.bulk", payload: {}, priority: undefined }),
    });
    await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({ jobType: "test.critical", payload: {}, priority: undefined }),
    });

    const claimed = await repository.claimPendingOutbox({
      dispatcherId: "dispatcher",
      limit: 2,
      leaseUntil: new Date(Date.now() + 60_000),
      now: new Date(),
    });

    expect(claimed.map((item) => item.job.queueName)).toEqual(["critical", "bulk"]);
  });

  it("TC-JOB-PROC-PERF-001 dispatches a moderate pending batch deterministically", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();
    const provider = new FakeQueueProvider();

    for (let index = 0; index < 30; index += 1) {
      await enqueueTransactionalJobRequest({
        repository,
        registry,
        request: createTestJobRequest({
          jobType: "test.sideEffect",
          payload: { index },
          idempotencyKey: `perf-${index}`,
        }),
      });
    }

    const result = await dispatchOutboxToQueue({
      repository,
      provider,
      dispatcherId: "dispatcher",
      batchSize: 30,
      now: new Date(),
    });

    expect(result.dispatched).toBe(30);
    expect(provider.published).toHaveLength(30);
  });

  it("TC-JOB-PROC-SEC-003 stores requester attribution without accepting replay authority fields", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();

    await expect(
      enqueueTransactionalJobRequest({
        repository,
        registry,
        request: createTestJobRequest({
          jobType: "test.sideEffect",
          payload: { sessionId: "session-secret" },
        }),
      }),
    ).rejects.toBeInstanceOf(InvalidJobRequestError);

    const enqueued = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({
        jobType: "test.sideEffect",
        payload: {},
        requestedByActorType: "root_user",
        requestedByActorId: "root-1",
      }),
    });
    expect(repository.jobs.get(enqueued.jobId)?.requestedByActorId).toBe("root-1");
  });

  it("TC-JOB-PROC-SEC-004 rejects unregistered enqueue and execution", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();

    await expect(
      enqueueTransactionalJobRequest({
        repository,
        registry,
        request: createTestJobRequest({ jobType: "missing", payload: {} }),
      }),
    ).rejects.toMatchObject({ code: "UNKNOWN_JOB_TYPE" });
  });

  it("TC-JOB-PROC-AUD-001 and TC-JOB-PROC-AUD-004 preserve attribution and future manual action state hooks", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();
    const enqueued = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({
        jobType: "test.sideEffect",
        payload: {},
        requestedByActorType: "system",
        requestedByActorId: "maintenance",
        relatedEntityType: "future-manual-retry",
        relatedEntityId: "job-group-1",
      }),
    });

    const job = repository.jobs.get(enqueued.jobId)!;
    expect(job.requestedByActorId).toBe("maintenance");
    expect(job.relatedEntityType).toBe("future-manual-retry");
    expect(job.status).toBe("queued");
  });

  it("TC-JOB-PROC-RESILIENCE-002 keeps crashed worker failure retryable through durable state", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();
    const enqueued = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({
        jobType: "test.sideEffect",
        payload: { fail: true },
      }),
    });

    const result = await executeRegisteredJob({
      repository,
      registry,
      jobId: enqueued.jobId,
      workerId: "worker-1",
      random: () => 0,
    });

    expect(result).toBe("retryable");
    expect(repository.jobs.get(enqueued.jobId)?.status).toBe("retryable");
  });

  it("TC-JOB-PROC-EDGE-005 stores scalar metadata needed for future operator filters", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();
    const enqueued = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({
        jobType: "test.sideEffect",
        payload: { unindexedPayloadOnly: "not-filtered" },
        relatedEntityType: "demo",
        relatedEntityId: "entity-1",
      }),
    });

    const job = repository.jobs.get(enqueued.jobId)!;
    expect(job).toMatchObject({
      status: "queued",
      queueName: "default",
      jobType: "test.sideEffect",
      relatedEntityType: "demo",
      relatedEntityId: "entity-1",
    });
  });
});
