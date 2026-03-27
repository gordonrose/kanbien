import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createRateLimitMiddleware } from "../../../src/lib/security/rateLimit";
import { createPostgresPlatformSecurityRepository } from "../../../src/lib/security/postgresRepository";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

interface AuthAuditEventRow {
  event_id: string;
  auth_principal_id: string | null;
  root_user_id: string | null;
  event_type: string;
  event_outcome: string;
  ip_address: string | null;
  user_agent: string | null;
  occurred_at: Date;
}

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

describeIfPostgres("platformSecurity postgres-backed audit visibility", () => {
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

  it("TC-PLATFORM-SEC-AUD-005 keeps plaintext passwords, raw tokens, and raw signatures out of durable security audit rows", async () => {
    await applyPostgresTestMigrations(pool, ["rootUsers", "platformSecurity", "rootAuth"]);

    const repository = createPostgresPlatformSecurityRepository(pool);
    const middleware = createRateLimitMiddleware({
      enabled: true,
      repository,
      policy: {
        endpointClass: "public-auth",
        windowSeconds: 300,
        maxAttempts: 1,
        responseCode: "AUTH_THROTTLED",
        responseMessage: "Too many authentication attempts. Please wait and try again.",
      },
      subjectScope: "ip",
      getSubjectKey: () => "127.0.0.1",
      createAuditEvent: () => ({
        eventType: "auth_rate_limited",
        eventOutcome: "failure",
        ipAddress: "127.0.0.1",
        userAgent: "audit-persistence-test",
      }),
    });
    const rawToken = "Bearer top-secret-token";
    const rawPassword = "PlaintextPass1!";
    const rawSignature = "raw-signature-value";

    await middleware(
      {
        ip: "127.0.0.1",
        header(name: string) {
          return name.toLowerCase() === "authorization" ? rawToken : undefined;
        },
        get(name: string) {
          return name.toLowerCase() === "authorization" ? rawToken : undefined;
        },
        body: {
          password: rawPassword,
          signature: rawSignature,
        },
      } as any,
      createResponseRecorder() as any,
      () => undefined,
    );

    await middleware(
      {
        ip: "127.0.0.1",
        header(name: string) {
          return name.toLowerCase() === "authorization" ? rawToken : undefined;
        },
        get(name: string) {
          return name.toLowerCase() === "authorization" ? rawToken : undefined;
        },
        body: {
          password: rawPassword,
          signature: rawSignature,
        },
      } as any,
      createResponseRecorder() as any,
      () => undefined,
    );

    const auditEvents = await pool.query<AuthAuditEventRow>(
      `
        SELECT *
        FROM auth_audit_events
        WHERE event_type = 'auth_rate_limited'
        ORDER BY occurred_at ASC
      `,
    );

    expect(auditEvents.rowCount).toBe(1);
    expect(auditEvents.rows[0]).toMatchObject({
      event_type: "auth_rate_limited",
      event_outcome: "failure",
      ip_address: "127.0.0.1",
      user_agent: "audit-persistence-test",
    });

    const serialized = JSON.stringify(auditEvents.rows[0]);
    expect(serialized).not.toContain(rawToken);
    expect(serialized).not.toContain(rawPassword);
    expect(serialized).not.toContain(rawSignature);
  });
});
