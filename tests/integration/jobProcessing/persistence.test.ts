import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresJobProcessingRepository } from "../../../src/features/jobProcessing";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

const shouldRun = process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig();
const describePostgres = shouldRun ? describe : describe.skip;

describePostgres("jobProcessing persistence", () => {
  let pool: Pool;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    pool = createPostgresTestDatabasePool();
    await resetPostgresTestDatabaseForRoutineIsolation(pool);
    await applyPostgresTestMigrations(pool, ["jobProcessing"]);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-JOB-PROC-INT-001 persists durable job and outbox rows atomically with idempotency", async () => {
    const repository = createPostgresJobProcessingRepository(pool);
    const job = await repository.createJobRequest({
      jobId: randomUUID(),
      outboxId: randomUUID(),
      queueName: "default",
      priority: 50,
      runAt: new Date(),
      maxAttempts: 5,
      payloadJson: { entityId: "entity-1" },
      executionScope: "platform-internal",
      retryPolicy: {
        maxAttempts: 5,
        initialDelayMs: 30_000,
        maxDelayMs: 1_800_000,
        jitterRatio: 0.2,
      },
      request: {
        jobType: "test.persist",
        payloadVersion: 1,
        payload: { entityId: "entity-1" },
        executionScope: "platform-internal",
        idempotencyKey: "persist-key",
      },
    });
    const replay = await repository.createJobRequest({
      jobId: randomUUID(),
      outboxId: randomUUID(),
      queueName: "default",
      priority: 50,
      runAt: new Date(),
      maxAttempts: 5,
      payloadJson: { entityId: "entity-1" },
      executionScope: "platform-internal",
      retryPolicy: {
        maxAttempts: 5,
        initialDelayMs: 30_000,
        maxDelayMs: 1_800_000,
        jitterRatio: 0.2,
      },
      request: {
        jobType: "test.persist",
        payloadVersion: 1,
        payload: { entityId: "entity-1" },
        executionScope: "platform-internal",
        idempotencyKey: "persist-key",
      },
    });
    const outbox = await repository.getOutboxByJobId(job.jobId);

    expect(replay.jobId).toBe(job.jobId);
    expect(outbox?.dispatchStatus).toBe("pending");
  });
});
