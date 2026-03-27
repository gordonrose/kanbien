import { describe, expect, it, vi } from "vitest";
import { createRootAuthAbuseProtection } from "../../../src/lib/security/rootAuthAbuse";
import type { PlatformSecurityRepository } from "../../../src/lib/security/repository";
import type { CounterInput, CreateLockdownInput, LockdownLookup, SecurityAuditEventInput } from "../../../src/lib/security/types";

function createPlatformSecurityRepositoryMock(): PlatformSecurityRepository {
  return {
    incrementCounter: vi.fn(async () => 0),
    clearCounters: vi.fn(async () => undefined),
    findActiveLockdowns: vi.fn(async (_lookups: LockdownLookup[], _signal: string, _now: Date) => []),
    createLockdown: vi.fn(async (_input: CreateLockdownInput) => false),
    createSecurityAuditEvent: vi.fn(async (_input: SecurityAuditEventInput) => undefined),
  };
}

describe("platformSecurity rootAuth abuse protection", () => {
  it("TC-PLATFORM-SEC-UNIT-005 creates scoped lockdowns and avoids duplicate active lockdowns", async () => {
    const repository = createPlatformSecurityRepositoryMock();
    vi.mocked(repository.incrementCounter).mockImplementation(async (input: CounterInput) => {
      if (input.namespace === "security_summary") {
        return 1;
      }
      if (input.subjectScope === "ip") {
        return 25;
      }
      if (input.subjectScope === "account") {
        return 8;
      }
      return 5;
    });
    vi.mocked(repository.createLockdown)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false);

    const abuseProtection = createRootAuthAbuseProtection(
      repository,
      {
        enabled: true,
        failureWindowSeconds: 900,
        ipLockdownThreshold: 25,
        accountLockdownThreshold: 8,
        ipAccountLockdownThreshold: 5,
        lockdownDurationSeconds: 900,
      },
      () => new Error("AUTH_LOCKED_DOWN"),
    );

    await abuseProtection.recordPasswordAttemptFailure({
      normalizedEmail: "root@example.test",
      authPrincipalId: "ap_123",
      rootUserId: "ru_123",
      ipAddress: "127.0.0.1",
      userAgent: "vitest",
    });
    await abuseProtection.recordPasswordAttemptFailure({
      normalizedEmail: "root@example.test",
      authPrincipalId: "ap_123",
      rootUserId: "ru_123",
      ipAddress: "127.0.0.1",
      userAgent: "vitest",
    });

    expect(repository.createLockdown).toHaveBeenCalledTimes(6);
    expect(repository.createSecurityAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "login_password_lockdown_started",
      }),
    );
    expect(repository.createLockdown).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        subjectScope: "ip",
        subjectKey: "127.0.0.1",
        signal: "login_password",
        reason: "repeated_password_failures_ip",
      }),
    );
    expect(repository.createLockdown).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        subjectScope: "account",
        subjectKey: "root@example.test",
        signal: "login_password",
        reason: "repeated_password_failures_account",
      }),
    );
    expect(repository.createLockdown).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        subjectScope: "ip_account",
        subjectKey: "127.0.0.1|root@example.test",
        signal: "login_password",
        reason: "repeated_password_failures_ip_account",
      }),
    );
  });

  it("TC-PLATFORM-SEC-EDGE-003 avoids duplicate active lockdown rows for the same scope", async () => {
    const repository = createPlatformSecurityRepositoryMock();
    vi.mocked(repository.incrementCounter).mockImplementation(async (input: CounterInput) =>
      input.namespace === "security_summary" ? 1 : 25,
    );
    vi.mocked(repository.createLockdown)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    const abuseProtection = createRootAuthAbuseProtection(
      repository,
      {
        enabled: true,
        failureWindowSeconds: 900,
        ipLockdownThreshold: 25,
        accountLockdownThreshold: 999,
        ipAccountLockdownThreshold: 999,
        lockdownDurationSeconds: 900,
      },
      () => new Error("AUTH_LOCKED_DOWN"),
    );

    await abuseProtection.recordPasswordAttemptFailure({
      normalizedEmail: "root@example.test",
      ipAddress: "127.0.0.1",
      userAgent: "vitest",
    });
    await abuseProtection.recordPasswordAttemptFailure({
      normalizedEmail: "root@example.test",
      ipAddress: "127.0.0.1",
      userAgent: "vitest",
    });

    expect(repository.createLockdown).toHaveBeenCalledTimes(2);
    expect(repository.createSecurityAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "login_password_lockdown_started",
      }),
    );
    expect(repository.createLockdown).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        subjectScope: "ip",
        subjectKey: "127.0.0.1",
        signal: "login_password",
      }),
    );
  });

  it("TC-PLATFORM-SEC-UNIT-006 clears account-scoped counters while preserving broader IP history", async () => {
    const repository = createPlatformSecurityRepositoryMock();
    const abuseProtection = createRootAuthAbuseProtection(
      repository,
      {
        enabled: true,
        failureWindowSeconds: 900,
        ipLockdownThreshold: 25,
        accountLockdownThreshold: 8,
        ipAccountLockdownThreshold: 5,
        lockdownDurationSeconds: 900,
      },
      () => new Error("AUTH_LOCKED_DOWN"),
    );

    await abuseProtection.clearAccountFailureState({
      normalizedEmail: "root@example.test",
      authPrincipalId: "ap_123",
      ipAddress: "127.0.0.1",
    });

    expect(repository.clearCounters).toHaveBeenCalledTimes(4);
    expect(repository.clearCounters).toHaveBeenCalledWith(
      "auth_failure",
      "account",
      "root@example.test",
      "login_password",
    );
    expect(repository.clearCounters).toHaveBeenCalledWith(
      "auth_failure",
      "account",
      "ap_123",
      "login_ssh",
    );
    expect(repository.clearCounters).toHaveBeenCalledWith(
      "auth_failure",
      "ip_account",
      "127.0.0.1|root@example.test",
      "login_password",
    );
    expect(repository.clearCounters).toHaveBeenCalledWith(
      "auth_failure",
      "ip_account",
      "127.0.0.1|ap_123",
      "login_ssh",
    );
    expect(repository.clearCounters).not.toHaveBeenCalledWith(
      "auth_failure",
      "ip",
      "127.0.0.1",
      expect.any(String),
    );
  });
});
