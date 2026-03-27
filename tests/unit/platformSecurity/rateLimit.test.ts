import { describe, expect, it, vi } from "vitest";
import { createRateLimitMiddleware } from "../../../src/lib/security/rateLimit";
import type { PlatformSecurityRepository } from "../../../src/lib/security/repository";

interface MockResponse {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
}

function createPlatformSecurityRepositoryMock(): PlatformSecurityRepository {
  return {
    incrementCounter: vi.fn(async () => 0),
    clearCounters: vi.fn(async () => undefined),
    findActiveLockdowns: vi.fn(async () => []),
    createLockdown: vi.fn(async () => false),
    createSecurityAuditEvent: vi.fn(async () => undefined),
  };
}

function createResponseMock(): MockResponse {
  const response: MockResponse = {
    status: vi.fn(),
    json: vi.fn(),
  };

  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);

  return response;
}

describe("platformSecurity rate-limit middleware", () => {
  it("TC-PLATFORM-SEC-UNIT-002 allows requests while attempts remain at or below threshold", async () => {
    const repository = createPlatformSecurityRepositoryMock();
    vi.mocked(repository.incrementCounter)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(2);
    const middleware = createRateLimitMiddleware({
      enabled: true,
      repository,
      policy: {
        endpointClass: "public-read",
        windowSeconds: 60,
        maxAttempts: 2,
        responseCode: "RATE_LIMITED",
        responseMessage: "Too many requests. Please wait and try again.",
      },
      subjectScope: "ip",
      getSubjectKey: () => "127.0.0.1",
    });
    const next = vi.fn();

    await middleware({ ip: "127.0.0.1" } as any, createResponseMock() as any, next);
    await middleware({ ip: "127.0.0.1" } as any, createResponseMock() as any, next);

    expect(repository.incrementCounter).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it("TC-PLATFORM-SEC-EDGE-001 allows the exact-threshold request and rejects the next one", async () => {
    const repository = createPlatformSecurityRepositoryMock();
    vi.mocked(repository.incrementCounter)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(3);
    const middleware = createRateLimitMiddleware({
      enabled: true,
      repository,
      policy: {
        endpointClass: "public-read",
        windowSeconds: 60,
        maxAttempts: 2,
        responseCode: "RATE_LIMITED",
        responseMessage: "Too many requests. Please wait and try again.",
      },
      subjectScope: "ip",
      getSubjectKey: () => "127.0.0.1",
    });
    const next = vi.fn();
    const overLimitResponse = createResponseMock();

    await middleware({ ip: "127.0.0.1" } as any, createResponseMock() as any, next);
    await middleware({ ip: "127.0.0.1" } as any, overLimitResponse as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(overLimitResponse.status).toHaveBeenCalledWith(429);
    expect(overLimitResponse.json).toHaveBeenCalledWith({
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait and try again.",
    });
  });

  it("TC-PLATFORM-SEC-UNIT-003 returns explicit 429 JSON after threshold breach", async () => {
    const repository = createPlatformSecurityRepositoryMock();
    vi.mocked(repository.incrementCounter).mockResolvedValue(3);
    const middleware = createRateLimitMiddleware({
      enabled: true,
      repository,
      policy: {
        endpointClass: "authenticated-general",
        windowSeconds: 60,
        maxAttempts: 2,
        responseCode: "RATE_LIMITED",
        responseMessage: "Too many requests. Please wait and try again.",
      },
      subjectScope: "auth_user",
      getSubjectKey: () => "127.0.0.1|ru_123",
    });
    const response = createResponseMock();
    const next = vi.fn();

    await middleware(
      { ip: "127.0.0.1", rootSession: { rootUserId: "ru_123" } } as any,
      response as any,
      next,
    );

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(429);
    expect(response.json).toHaveBeenCalledWith({
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait and try again.",
    });
  });

  it("TC-PLATFORM-SEC-UNIT-004 writes an audit event when threshold visibility is configured", async () => {
    const repository = createPlatformSecurityRepositoryMock();
    vi.mocked(repository.incrementCounter).mockResolvedValue(2);
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
        userAgent: "vitest",
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
      }),
    });
    const response = createResponseMock();

    await middleware(
      {
        ip: "127.0.0.1",
        get: () => "vitest",
      } as any,
      response as any,
      vi.fn(),
    );

    expect(repository.createSecurityAuditEvent).toHaveBeenCalledTimes(1);
    expect(repository.createSecurityAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "auth_rate_limited",
        eventOutcome: "failure",
        ipAddress: "127.0.0.1",
        userAgent: "vitest",
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
      }),
    );
    expect(response.status).toHaveBeenCalledWith(429);
    expect(response.json).toHaveBeenCalledWith({
      code: "AUTH_THROTTLED",
      message: "Too many authentication attempts. Please wait and try again.",
    });
  });

  it("TC-PLATFORM-SEC-EDGE-002 fails open safely when no subject key is available", async () => {
    const repository = createPlatformSecurityRepositoryMock();
    const middleware = createRateLimitMiddleware({
      enabled: true,
      repository,
      policy: {
        endpointClass: "authenticated-general",
        windowSeconds: 60,
        maxAttempts: 1,
        responseCode: "RATE_LIMITED",
        responseMessage: "Too many requests. Please wait and try again.",
      },
      subjectScope: "auth_user",
      getSubjectKey: () => null,
    });
    const next = vi.fn();

    await middleware({ ip: "127.0.0.1" } as any, createResponseMock() as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(repository.incrementCounter).not.toHaveBeenCalled();
    expect(repository.createSecurityAuditEvent).not.toHaveBeenCalled();
  });

  it("TC-PLATFORM-SEC-EDGE-004 supports the public-write class even before a live route uses it", async () => {
    const repository = createPlatformSecurityRepositoryMock();
    vi.mocked(repository.incrementCounter)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(2);
    const middleware = createRateLimitMiddleware({
      enabled: true,
      repository,
      policy: {
        endpointClass: "public-write",
        windowSeconds: 60,
        maxAttempts: 1,
        responseCode: "RATE_LIMITED",
        responseMessage: "Too many requests. Please wait and try again.",
      },
      subjectScope: "ip",
      getSubjectKey: () => "127.0.0.1",
    });
    const next = vi.fn();
    const throttledResponse = createResponseMock();

    await middleware({ ip: "127.0.0.1" } as any, createResponseMock() as any, next);
    await middleware({ ip: "127.0.0.1" } as any, throttledResponse as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(repository.incrementCounter).toHaveBeenCalledTimes(2);
    expect(throttledResponse.status).toHaveBeenCalledWith(429);
    expect(throttledResponse.json).toHaveBeenCalledWith({
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait and try again.",
    });
  });
});
