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
  forceJobStatus,
} from "../../helpers/jobProcessingHarness";

function registryWithHandler(handler: () => Promise<void> = async () => undefined) {
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
        2: () => undefined,
      },
      executionScope: "platform-internal",
      defaultQueue: "default",
      defaultPriority: 50,
      retryPolicy: { maxAttempts: 2, initialDelayMs: 10, maxDelayMs: 20, jitterRatio: 0 },
      handler,
    },
    {
      jobType: "notification.email.send",
      ownerFeature: "notificationDelivery",
      supportedPayloadVersions: {
        1: (payload) => {
          if (!payload || typeof payload !== "object" || !("outboundEmailId" in payload)) {
            throw new InvalidJobRequestError("outboundEmailId required");
          }
        },
      },
      executionScope: "platform-internal",
      defaultQueue: "default",
      defaultPriority: 50,
      handler: async () => undefined,
    },
  ]);
}

describe("jobProcessing provider-neutral foundation flows", () => {
  // TC-JOB-PROC-E2E-001 is documented as not required for this backend-only foundation slice.
  it("TC-JOB-PROC-INT-002, TC-JOB-PROC-INT-006, and TC-JOB-PROC-COMPAT-001 dispatches outbox through fake provider without provider type leakage", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = registryWithHandler();
    const provider = new FakeQueueProvider();
    const enqueued = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest(),
    });

    const result = await dispatchOutboxToQueue({
      repository,
      provider,
      dispatcherId: "dispatcher-1",
      now: new Date(),
    });

    expect(result).toMatchObject({ claimed: 1, dispatched: 1, failed: 0 });
    expect(provider.published[0]?.job.jobId).toBe(enqueued.jobId);
    expect(repository.jobs.get(enqueued.jobId)?.status).toBe("dispatched");
  });

  it("TC-JOB-PROC-RESILIENCE-001 and TC-JOB-PROC-AUD-003 keeps failed dispatch durable and retryable", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = registryWithHandler();
    const provider = new FakeQueueProvider();
    provider.failNextPublish = new Error("provider token=secret went away");
    await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest(),
    });

    const result = await dispatchOutboxToQueue({
      repository,
      provider,
      dispatcherId: "dispatcher-1",
      now: new Date(),
    });

    const outbox = [...repository.outboxes.values()][0]!;
    expect(result.failed).toBe(1);
    expect(outbox.dispatchStatus).toBe("failed");
    expect(outbox.lastErrorSummary).toContain("[REDACTED]");
  });

  it("TC-JOB-PROC-INT-003 and TC-JOB-PROC-AUD-002 executes handler and records successful attempt identity", async () => {
    const repository = new InMemoryJobProcessingRepository();
    let called = 0;
    const registry = registryWithHandler(async () => {
      called += 1;
    });
    const enqueued = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest(),
    });

    const result = await executeRegisteredJob({
      repository,
      registry,
      jobId: enqueued.jobId,
      workerId: "worker-1",
    });

    expect(result).toBe("succeeded");
    expect(called).toBe(1);
    expect(repository.attempts.values().next().value).toMatchObject({
      workerId: "worker-1",
      status: "succeeded",
    });
  });

  it("TC-JOB-PROC-INT-004, TC-JOB-PROC-INT-005, and TC-JOB-PROC-EDGE-003 records retries then dead letter", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = registryWithHandler(async () => {
      const error = new Error("temporary failure");
      Object.assign(error, { code: "TEMPORARY" });
      throw error;
    });
    const enqueued = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest(),
    });

    const first = await executeRegisteredJob({
      repository,
      registry,
      jobId: enqueued.jobId,
      workerId: "worker-1",
      random: () => 0,
    });
    const second = await executeRegisteredJob({
      repository,
      registry,
      jobId: enqueued.jobId,
      workerId: "worker-1",
      random: () => 0,
    });

    expect(first).toBe("retryable");
    expect(second).toBe("dead");
    expect(repository.jobs.get(enqueued.jobId)?.deadLetterReason).toBe("TEMPORARY");
    expect(await repository.listAttempts(enqueued.jobId)).toHaveLength(2);
  });

  it("TC-JOB-PROC-EDGE-004 skips terminal jobs without invoking the handler", async () => {
    const repository = new InMemoryJobProcessingRepository();
    let called = 0;
    const registry = registryWithHandler(async () => {
      called += 1;
    });
    const enqueued = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest(),
    });
    forceJobStatus(repository, enqueued.jobId, "dead");

    const result = await executeRegisteredJob({
      repository,
      registry,
      jobId: enqueued.jobId,
      workerId: "worker-1",
    });

    expect(result).toBe("skipped");
    expect(called).toBe(0);
  });

  it("TC-JOB-PROC-INT-007 keeps notificationDelivery retry adoption deferred but seam-compatible", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = registryWithHandler();
    const enqueued = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: {
        jobType: "notification.email.send",
        payloadVersion: 1,
        payload: { outboundEmailId: "email-1" },
        executionScope: "platform-internal",
      },
    });

    expect(repository.jobs.get(enqueued.jobId)?.payloadJson).toEqual({ outboundEmailId: "email-1" });
  });

  it("TC-JOB-PROC-COMPAT-002 executes older queued payload versions after newer registration exists", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = registryWithHandler();
    const enqueued = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({ payloadVersion: 1 }),
    });

    await expect(
      executeRegisteredJob({ repository, registry, jobId: enqueued.jobId, workerId: "worker-1" }),
    ).resolves.toBe("succeeded");
  });
});
