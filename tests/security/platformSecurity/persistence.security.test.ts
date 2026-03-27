import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Pool } from "pg";
import { createRateLimitMiddleware } from "../../../src/lib/security/rateLimit";
import { createPostgresPlatformSecurityRepository } from "../../../src/lib/security/postgresRepository";
import { createRootAuthAbuseProtection } from "../../../src/lib/security/rootAuthAbuse";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

function createResponseRecorder() {
  const response = {
    statusCode: 200,
    body: null as unknown,
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(payload: unknown) {
      response.body = payload;
      return response;
    },
  };

  return response;
}

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("platformSecurity postgres-backed durability", () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = createPostgresTestDatabasePool();
  });

  beforeEach(async () => {
    await resetPostgresTestDatabaseForRoutineIsolation(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-PLATFORM-SEC-SEC-005 preserves counter and lockdown enforcement across new repository or middleware instances", async () => {
    // TC-PLATFORM-SEC-EDGE-005 is intentionally traced here because the same
    // Postgres-backed proof covers persistence across new app or middleware instances.
    await applyPostgresTestMigrations(pool, ["rootUsers", "platformSecurity", "rootAuth"]);

    const repositoryOne = createPostgresPlatformSecurityRepository(pool);
    const repositoryTwo = createPostgresPlatformSecurityRepository(pool);
    const middlewareOne = createRateLimitMiddleware({
      enabled: true,
      repository: repositoryOne,
      policy: {
        endpointClass: "public-read",
        windowSeconds: 60,
        maxAttempts: 1,
        responseCode: "RATE_LIMITED",
        responseMessage: "Too many requests. Please wait and try again.",
      },
      subjectScope: "ip",
      getSubjectKey: () => "127.0.0.1",
    });
    const middlewareTwo = createRateLimitMiddleware({
      enabled: true,
      repository: repositoryTwo,
      policy: {
        endpointClass: "public-read",
        windowSeconds: 60,
        maxAttempts: 1,
        responseCode: "RATE_LIMITED",
        responseMessage: "Too many requests. Please wait and try again.",
      },
      subjectScope: "ip",
      getSubjectKey: () => "127.0.0.1",
    });
    const nextOne = vi.fn();
    const nextTwo = vi.fn();

    await middlewareOne({ ip: "127.0.0.1" } as any, createResponseRecorder() as any, nextOne);

    const secondResponse = createResponseRecorder();
    await middlewareTwo({ ip: "127.0.0.1" } as any, secondResponse as any, nextTwo);

    expect(nextOne).toHaveBeenCalledTimes(1);
    expect(nextTwo).not.toHaveBeenCalled();
    expect(secondResponse.statusCode).toBe(429);
    expect(secondResponse.body).toEqual({
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait and try again.",
    });

    const abuseProtectionOne = createRootAuthAbuseProtection(
      repositoryOne,
      {
        enabled: true,
        failureWindowSeconds: 900,
        ipLockdownThreshold: 2,
        accountLockdownThreshold: 99,
        ipAccountLockdownThreshold: 99,
        lockdownDurationSeconds: 900,
      },
      () => new Error("AUTH_LOCKED_DOWN"),
    );
    await abuseProtectionOne.recordPasswordAttemptFailure({
      normalizedEmail: "root@example.test",
      ipAddress: "127.0.0.1",
      userAgent: "vitest-postgres",
    });
    await abuseProtectionOne.recordPasswordAttemptFailure({
      normalizedEmail: "root@example.test",
      ipAddress: "127.0.0.1",
      userAgent: "vitest-postgres",
    });

    const abuseProtectionTwo = createRootAuthAbuseProtection(
      repositoryTwo,
      {
        enabled: true,
        failureWindowSeconds: 900,
        ipLockdownThreshold: 2,
        accountLockdownThreshold: 99,
        ipAccountLockdownThreshold: 99,
        lockdownDurationSeconds: 900,
      },
      () => new Error("AUTH_LOCKED_DOWN"),
    );

    await expect(
      abuseProtectionTwo.assertPasswordAttemptAllowed({
        normalizedEmail: "root@example.test",
        ipAddress: "127.0.0.1",
      }),
    ).rejects.toThrow("AUTH_LOCKED_DOWN");
  });
});
