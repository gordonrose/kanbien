import { describe, expect, it } from "vitest";
import {
  buildJobMetadataProjection,
  computeRetryDecision,
  createJobTypeRegistry,
  enqueueTransactionalJobRequest,
} from "../../../src/features/jobProcessing";
import { InvalidJobRequestError } from "../../../src/features/jobProcessing/contract/errors";
import { DEFAULT_QUEUE_CONCURRENCY } from "../../../src/features/jobProcessing/domain/queueConfig";
import { createJobWorkerRuntime } from "../../../src/features/jobProcessing/domain/workerRuntime";
import {
  InMemoryJobProcessingRepository,
  createTestJobRequest,
} from "../../helpers/jobProcessingHarness";

function createRegistry() {
  return createJobTypeRegistry([
    {
      jobType: "test.echo",
      ownerFeature: "jobProcessingTest",
      supportedPayloadVersions: {
        1: (payload) => {
          if (!payload || typeof payload !== "object" || !("entityId" in payload)) {
            throw new InvalidJobRequestError("entityId is required.");
          }
        },
        2: () => undefined,
      },
      executionScope: "platform-internal",
      defaultQueue: "default",
      defaultPriority: 50,
      handler: async () => undefined,
    },
    {
      jobType: "test.tenant",
      ownerFeature: "jobProcessingTest",
      supportedPayloadVersions: { 1: () => undefined },
      executionScope: "tenant",
      defaultQueue: "bulk",
      defaultPriority: 60,
      handler: async () => undefined,
    },
  ]);
}

describe("jobProcessing foundation unit coverage", () => {
  it("TC-JOB-PROC-UNIT-001 enqueues registered provider-neutral jobs with durable metadata and idempotency", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();

    const first = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({ idempotencyKey: "job-key-1" }),
    });
    const replay = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({ idempotencyKey: "job-key-1" }),
    });

    expect(first.idempotentReplay).toBe(false);
    expect(replay.idempotentReplay).toBe(true);
    expect(replay.jobId).toBe(first.jobId);
    expect(repository.outboxes.size).toBe(1);
  });

  it("TC-JOB-PROC-UNIT-002 and TC-JOB-PROC-SEC-001 reject unsafe or unsupported payloads", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();

    await expect(
      enqueueTransactionalJobRequest({
        repository,
        registry,
        request: createTestJobRequest({ payloadVersion: 99 }),
      }),
    ).rejects.toMatchObject({ code: "INVALID_JOB_REQUEST" });
    await expect(
      enqueueTransactionalJobRequest({
        repository,
        registry,
        request: createTestJobRequest({ payload: { entityId: "1", bearerToken: "secret" } }),
      }),
    ).rejects.toMatchObject({ code: "INVALID_JOB_REQUEST" });
  });

  it("TC-JOB-PROC-UNIT-003 rejects duplicate or invalid job-type registrations", () => {
    const registry = createRegistry();

    expect(() =>
      registry.register({
        jobType: "test.echo",
        ownerFeature: "jobProcessingTest",
        supportedPayloadVersions: { 1: () => undefined },
        executionScope: "platform-internal",
        defaultQueue: "default",
        defaultPriority: 50,
        handler: async () => undefined,
      }),
    ).toThrow(/already registered/);
    expect(() =>
      createJobTypeRegistry([
        {
          jobType: "test.cross",
          ownerFeature: "jobProcessingTest",
          supportedPayloadVersions: { 1: () => undefined },
          executionScope: "shared-cross-tenant",
          defaultQueue: "default",
          defaultPriority: 50,
          handler: async () => undefined,
        },
      ]),
    ).toThrow(/Shared cross-tenant/);
  });

  it("TC-JOB-PROC-UNIT-004 and TC-JOB-PROC-PERF-002 applies retry backoff, jitter, caps, and exhaustion", () => {
    const retry = computeRetryDecision({
      attemptNumber: 2,
      retryPolicy: {
        maxAttempts: 5,
        initialDelayMs: 30_000,
        maxDelayMs: 60_000,
        jitterRatio: 0.2,
      },
      random: () => 0.5,
    });
    const exhausted = computeRetryDecision({
      attemptNumber: 5,
      retryPolicy: {
        maxAttempts: 5,
        initialDelayMs: 30_000,
        maxDelayMs: 60_000,
        jitterRatio: 0.2,
      },
      random: () => 0,
    });

    expect(retry.nextDelayMs).toBe(60_000);
    expect(retry.terminalStatus).toBe("retryable");
    expect(exhausted.terminalStatus).toBe("dead");
  });

  it("TC-JOB-PROC-UNIT-005 and TC-JOB-PROC-EDGE-001 validates queues and priorities", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();

    expect(DEFAULT_QUEUE_CONCURRENCY.bulk).toBeGreaterThan(0);
    await expect(
      enqueueTransactionalJobRequest({
        repository,
        registry,
        request: createTestJobRequest({ priority: 101 }),
      }),
    ).rejects.toMatchObject({ code: "INVALID_JOB_REQUEST" });
    await expect(
      enqueueTransactionalJobRequest({
        repository,
        registry,
        request: createTestJobRequest({ queueName: "critical" }),
      }),
    ).rejects.toMatchObject({ code: "INVALID_JOB_REQUEST" });
  });

  it("TC-JOB-PROC-UNIT-006 and TC-JOB-PROC-SEC-002 preserves tenant boundary rules", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();

    await expect(
      enqueueTransactionalJobRequest({
        repository,
        registry,
        request: createTestJobRequest({
          jobType: "test.tenant",
          executionScope: "tenant",
          payload: {},
        }),
      }),
    ).rejects.toMatchObject({ code: "INVALID_JOB_REQUEST" });

    const tenantJob = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({
        jobType: "test.tenant",
        executionScope: "tenant",
        payload: {},
        tenantId: "11111111-1111-4111-8111-111111111111",
      }),
    });
    expect(repository.jobs.get(tenantJob.jobId)?.tenantId).toBe(
      "11111111-1111-4111-8111-111111111111",
    );
  });

  it("TC-JOB-PROC-UNIT-007 and TC-JOB-PROC-SEC-005 builds redacted operator metadata", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();
    const enqueued = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({ payload: { entityId: "1", stableReference: "ok" } }),
    });

    const metadata = buildJobMetadataProjection(repository.jobs.get(enqueued.jobId)!);
    expect(metadata.payloadSummary).toMatchObject({
      entityId: "string",
      stableReference: "string",
    });
  });

  it("TC-JOB-PROC-UNIT-008 and TC-JOB-PROC-EDGE-002 accepts one-off runAt and rejects recurring schedules", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const registry = createRegistry();
    const runAt = "2026-05-01T00:00:00.000Z";

    const enqueued = await enqueueTransactionalJobRequest({
      repository,
      registry,
      request: createTestJobRequest({ runAt }),
    });
    await expect(
      enqueueTransactionalJobRequest({
        repository,
        registry,
        request: createTestJobRequest({ recurringSchedule: { cron: "* * * * *" } }),
      }),
    ).rejects.toMatchObject({ code: "INVALID_JOB_REQUEST" });
    expect(enqueued.runAt.toISOString()).toBe(runAt);
  });

  it("TC-JOB-PROC-RESILIENCE-003 wires provider-neutral worker shutdown", async () => {
    let closed = false;
    const runtime = createJobWorkerRuntime({
      provider: {
        async publish() {
          return { providerJobId: "unused" };
        },
        async createWorker() {
          return {
            async close() {
              closed = true;
            },
          };
        },
      },
      queueNames: ["default"],
      handler: async () => undefined,
    });

    await runtime.start();
    await runtime.stop();
    expect(runtime.workerId).toContain("job-worker");
    expect(closed).toBe(true);
  });
});
