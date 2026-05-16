import { describe, expect, it } from "vitest";
import {
  createJobTypeRegistry,
  createRecurringScheduleRegistry,
  runRecurringSchedulerOnce,
} from "../../../src/features/jobProcessing";
import { InvalidJobRequestError } from "../../../src/features/jobProcessing/contract/errors";
import {
  createTestJobRequest,
  InMemoryJobProcessingRepository,
} from "../../helpers/jobProcessingHarness";

function createRegistry() {
  return createJobTypeRegistry([
    {
      jobType: "test.recurring",
      ownerFeature: "jobProcessingTest",
      supportedPayloadVersions: {
        1: (payload) => {
          if (!payload || typeof payload !== "object") {
            throw new InvalidJobRequestError("payload must be an object");
          }
        },
      },
      executionScope: "platform-internal",
      defaultQueue: "maintenance",
      defaultPriority: 20,
      handler: async () => undefined,
    },
  ]);
}

describe("recurring scheduler registry and runtime", () => {
  it("TC-SCHED-UNIT-001 rejects duplicate, invalid, and unsupported schedule definitions", () => {
    const jobRegistry = createRegistry();

    expect(() =>
      createRecurringScheduleRegistry({
        jobRegistry,
        definitions: [
          {
            scheduleKey: "duplicate",
            jobType: "test.recurring",
            payloadVersion: 1,
            cadenceSeconds: 60,
            payloadFactory: () => ({}),
          },
          {
            scheduleKey: "duplicate",
            jobType: "test.recurring",
            payloadVersion: 1,
            cadenceSeconds: 60,
            payloadFactory: () => ({}),
          },
        ],
      }),
    ).toThrow(InvalidJobRequestError);

    expect(() =>
      createRecurringScheduleRegistry({
        jobRegistry,
        definitions: [
          {
            scheduleKey: "bad-cadence",
            jobType: "test.recurring",
            payloadVersion: 1,
            cadenceSeconds: 30,
            payloadFactory: () => ({}),
          },
        ],
      }),
    ).toThrow(InvalidJobRequestError);

    expect(() =>
      createRecurringScheduleRegistry({
        jobRegistry,
        definitions: [
          {
            scheduleKey: "bad-version",
            jobType: "test.recurring",
            payloadVersion: 2,
            cadenceSeconds: 60,
            payloadFactory: () => ({}),
          },
        ],
      }),
    ).toThrow(InvalidJobRequestError);
  });

  it("TC-SCHED-UNIT-002 enqueues one due recurring job with deterministic idempotency", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const jobRegistry = createRegistry();
    const dueSlotAt = new Date("2026-05-16T10:00:00.000Z");
    const now = new Date("2026-05-16T10:05:00.000Z");
    const scheduleRegistry = createRecurringScheduleRegistry({
      jobRegistry,
      definitions: [
        {
          scheduleKey: "test-recurring",
          jobType: "test.recurring",
          payloadVersion: 1,
          cadenceSeconds: 3600,
          initialNextRunAt: dueSlotAt,
          payloadFactory: ({ dueSlotAt }) => ({ dueSlotAt: dueSlotAt.toISOString() }),
          queueName: "maintenance",
        },
      ],
    });

    const result = await runRecurringSchedulerOnce({
      repository,
      jobRegistry,
      scheduleRegistry,
      schedulerId: "scheduler-a",
      now,
    });

    expect(result).toMatchObject({ inspected: 1, enqueued: 1 });
    const job = [...repository.jobs.values()][0]!;
    expect(job.idempotencyKey).toBe("recurring-schedule:test-recurring:2026-05-16T10:00:00.000Z");
    expect(job.requestedByActorType).toBe("system");
    expect(repository.recurringSchedules.get("test-recurring")?.nextRunAt.toISOString()).toBe(
      "2026-05-16T11:00:00.000Z",
    );
    expect([...repository.recurringRuns.values()][0]?.status).toBe("enqueued");
  });

  it("TC-SCHED-UNIT-003 prevents duplicate due-slot enqueue on idempotent replay", async () => {
    const repository = new InMemoryJobProcessingRepository();
    const jobRegistry = createRegistry();
    const dueSlotAt = new Date("2026-05-16T10:00:00.000Z");
    const now = new Date("2026-05-16T10:05:00.000Z");
    const scheduleRegistry = createRecurringScheduleRegistry({
      jobRegistry,
      definitions: [
        {
          scheduleKey: "test-recurring",
          jobType: "test.recurring",
          payloadVersion: 1,
          cadenceSeconds: 3600,
          initialNextRunAt: dueSlotAt,
          payloadFactory: () => ({}),
        },
      ],
    });

    await repository.createJobRequest({
      request: createTestJobRequest({
        jobType: "test.recurring",
        payloadVersion: 1,
        idempotencyKey: "recurring-schedule:test-recurring:2026-05-16T10:00:00.000Z",
      }),
      jobId: "existing-job",
      outboxId: "existing-outbox",
      queueName: "maintenance",
      priority: 20,
      runAt: dueSlotAt,
      maxAttempts: 1,
      payloadJson: {},
      executionScope: "platform-internal",
      retryPolicy: { maxAttempts: 1, initialDelayMs: 0, maxDelayMs: 0, jitterRatio: 0 },
    });

    const result = await runRecurringSchedulerOnce({
      repository,
      jobRegistry,
      scheduleRegistry,
      schedulerId: "scheduler-a",
      now,
    });

    expect(result).toMatchObject({ inspected: 1, skippedOverlap: 1, enqueued: 0 });
    expect(repository.jobs.size).toBe(1);
    expect([...repository.recurringRuns.values()][0]?.status).toBe("skipped_overlap");
  });

  it("TC-SCHED-UNIT-004 registers code-declared platform maintenance schedules", () => {
    const scheduleRegistry = createRecurringScheduleRegistry({
      jobRegistry: createRegistry(),
      definitions: [
        {
          scheduleKey: "example.maintenance-one-v1",
          jobType: "test.recurring",
          payloadVersion: 1,
          cadenceSeconds: 60 * 60,
          payloadFactory: () => ({ ok: true }),
          queueName: "maintenance",
          priority: 20,
        },
        {
          scheduleKey: "example.maintenance-two-v1",
          jobType: "test.recurring",
          payloadVersion: 1,
          cadenceSeconds: 2 * 60 * 60,
          payloadFactory: () => ({ ok: true }),
          queueName: "maintenance",
          priority: 20,
        },
      ],
    });

    expect(scheduleRegistry.list().map((definition) => definition.scheduleKey)).toEqual([
      "example.maintenance-one-v1",
      "example.maintenance-two-v1",
    ]);
    expect(
      scheduleRegistry.buildEnqueueRequest({
        scheduleKey: "example.maintenance-one-v1",
        dueSlotAt: new Date("2026-05-16T10:00:00.000Z"),
      }),
    ).toMatchObject({
      jobType: "test.recurring",
      executionScope: "platform-internal",
      requestedByActorType: "system",
      payload: { ok: true },
    });
  });
});
