import { randomUUID } from "node:crypto";
import type { PlatformSecurityRepository } from "./repository";
import type { EndpointClass, LockdownLookup, SubjectScope } from "./types";

interface BaseInput {
  ipAddress?: string;
  userAgent?: string;
  authPrincipalId?: string;
  rootUserId?: string;
}

interface PasswordAttemptInput extends BaseInput {
  normalizedEmail: string;
}

interface SshAttemptInput extends BaseInput {
  authPrincipalId: string;
}

export interface RootAuthAbuseProtection {
  assertPasswordAttemptAllowed(input: PasswordAttemptInput): Promise<void>;
  recordPasswordAttemptFailure(input: PasswordAttemptInput): Promise<void>;
  assertSshAttemptAllowed(input: SshAttemptInput): Promise<void>;
  recordSshAttemptFailure(input: SshAttemptInput): Promise<void>;
  clearAccountFailureState(input: {
    normalizedEmail: string;
    authPrincipalId: string;
    ipAddress?: string;
  }): Promise<void>;
}

function eventId(): string {
  return `evt_${randomUUID().replace(/-/g, "")}`;
}

function lockdownId(): string {
  return `lock_${randomUUID().replace(/-/g, "")}`;
}

function scopedKey(scope: SubjectScope, ipAddress: string | undefined, accountKey: string): string | null {
  if (scope === "account") {
    return accountKey;
  }
  if (!ipAddress) {
    return null;
  }
  if (scope === "ip") {
    return ipAddress;
  }
  if (scope === "ip_account") {
    return `${ipAddress}|${accountKey}`;
  }
  return null;
}

function compactLookups(values: Array<LockdownLookup | null>): LockdownLookup[] {
  return values.filter((value): value is LockdownLookup => value !== null);
}

export function createRootAuthAbuseProtection(
  repository: PlatformSecurityRepository,
  config: {
    enabled: boolean;
    failureWindowSeconds: number;
    ipLockdownThreshold: number;
    accountLockdownThreshold: number;
    ipAccountLockdownThreshold: number;
    lockdownDurationSeconds: number;
  },
  createLockedDownError: () => Error,
): RootAuthAbuseProtection {
  const createLockdownIfNeeded = async (input: {
    signal: "login_password" | "login_ssh";
    endpointClass: EndpointClass;
    subjectScope: SubjectScope;
    subjectKey: string | null;
    threshold: number;
    attempts: number;
    reason: string;
    eventType: string;
    authPrincipalId?: string;
    rootUserId?: string;
    ipAddress?: string;
    userAgent?: string;
  }) => {
    if (!input.subjectKey || input.attempts < input.threshold) {
      return;
    }

    const now = new Date();
    const created = await repository.createLockdown({
      lockdownId: lockdownId(),
      subjectScope: input.subjectScope,
      subjectKey: input.subjectKey,
      signal: input.signal,
      reason: input.reason,
      endpointClass: input.endpointClass,
      startedAt: now,
      expiresAt: new Date(now.getTime() + config.lockdownDurationSeconds * 1000),
    });

    if (!created) {
      return;
    }

    await repository.createSecurityAuditEvent({
      eventId: eventId(),
      authPrincipalId: input.authPrincipalId,
      rootUserId: input.rootUserId,
      eventType: input.eventType,
      eventOutcome: "failure",
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      occurredAt: now,
    });
  };

  return {
    async assertPasswordAttemptAllowed(input) {
      if (!config.enabled) {
        return;
      }

      const lookups = compactLookups([
        input.ipAddress ? { subjectScope: "ip" as const, subjectKey: input.ipAddress } : null,
        { subjectScope: "account" as const, subjectKey: input.normalizedEmail },
        input.ipAddress
          ? {
              subjectScope: "ip_account" as const,
              subjectKey: `${input.ipAddress}|${input.normalizedEmail}`,
            }
          : null,
      ]);

      const active = await repository.findActiveLockdowns(lookups, "login_password", new Date());

      if (active.length > 0) {
        throw createLockedDownError();
      }
    },
    async recordPasswordAttemptFailure(input) {
      if (!config.enabled) {
        return;
      }

      const now = new Date();
      const ipAttempts = input.ipAddress
        ? await repository.incrementCounter({
            namespace: "auth_failure",
            subjectScope: "ip",
            subjectKey: input.ipAddress,
            signal: "login_password",
            windowSeconds: config.failureWindowSeconds,
            now,
          })
        : 0;
      const accountAttempts = await repository.incrementCounter({
        namespace: "auth_failure",
        subjectScope: "account",
        subjectKey: input.normalizedEmail,
        signal: "login_password",
        windowSeconds: config.failureWindowSeconds,
        now,
      });
      const ipAccountKey = scopedKey("ip_account", input.ipAddress, input.normalizedEmail);
      const ipAccountAttempts = ipAccountKey
        ? await repository.incrementCounter({
            namespace: "auth_failure",
            subjectScope: "ip_account",
            subjectKey: ipAccountKey,
            signal: "login_password",
            windowSeconds: config.failureWindowSeconds,
            now,
          })
        : 0;

      await createLockdownIfNeeded({
        signal: "login_password",
        endpointClass: "public-auth",
        subjectScope: "ip",
        subjectKey: input.ipAddress ?? null,
        threshold: config.ipLockdownThreshold,
        attempts: ipAttempts,
        reason: "repeated_password_failures_ip",
        eventType: "login_password_lockdown_started",
        authPrincipalId: input.authPrincipalId,
        rootUserId: input.rootUserId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });
      await createLockdownIfNeeded({
        signal: "login_password",
        endpointClass: "public-auth",
        subjectScope: "account",
        subjectKey: input.normalizedEmail,
        threshold: config.accountLockdownThreshold,
        attempts: accountAttempts,
        reason: "repeated_password_failures_account",
        eventType: "login_password_lockdown_started",
        authPrincipalId: input.authPrincipalId,
        rootUserId: input.rootUserId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });
      await createLockdownIfNeeded({
        signal: "login_password",
        endpointClass: "public-auth",
        subjectScope: "ip_account",
        subjectKey: ipAccountKey,
        threshold: config.ipAccountLockdownThreshold,
        attempts: ipAccountAttempts,
        reason: "repeated_password_failures_ip_account",
        eventType: "login_password_lockdown_started",
        authPrincipalId: input.authPrincipalId,
        rootUserId: input.rootUserId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });
    },
    async assertSshAttemptAllowed(input) {
      if (!config.enabled) {
        return;
      }

      const lookups = compactLookups([
        input.ipAddress ? { subjectScope: "ip" as const, subjectKey: input.ipAddress } : null,
        { subjectScope: "account" as const, subjectKey: input.authPrincipalId },
        input.ipAddress
          ? {
              subjectScope: "ip_account" as const,
              subjectKey: `${input.ipAddress}|${input.authPrincipalId}`,
            }
          : null,
      ]);

      const active = await repository.findActiveLockdowns(lookups, "login_ssh", new Date());

      if (active.length > 0) {
        throw createLockedDownError();
      }
    },
    async recordSshAttemptFailure(input) {
      if (!config.enabled) {
        return;
      }

      const now = new Date();
      const ipAttempts = input.ipAddress
        ? await repository.incrementCounter({
            namespace: "auth_failure",
            subjectScope: "ip",
            subjectKey: input.ipAddress,
            signal: "login_ssh",
            windowSeconds: config.failureWindowSeconds,
            now,
          })
        : 0;
      const accountAttempts = await repository.incrementCounter({
        namespace: "auth_failure",
        subjectScope: "account",
        subjectKey: input.authPrincipalId,
        signal: "login_ssh",
        windowSeconds: config.failureWindowSeconds,
        now,
      });
      const ipAccountKey = scopedKey("ip_account", input.ipAddress, input.authPrincipalId);
      const ipAccountAttempts = ipAccountKey
        ? await repository.incrementCounter({
            namespace: "auth_failure",
            subjectScope: "ip_account",
            subjectKey: ipAccountKey,
            signal: "login_ssh",
            windowSeconds: config.failureWindowSeconds,
            now,
          })
        : 0;

      await createLockdownIfNeeded({
        signal: "login_ssh",
        endpointClass: "public-auth",
        subjectScope: "ip",
        subjectKey: input.ipAddress ?? null,
        threshold: config.ipLockdownThreshold,
        attempts: ipAttempts,
        reason: "repeated_ssh_failures_ip",
        eventType: "login_ssh_lockdown_started",
        authPrincipalId: input.authPrincipalId,
        rootUserId: input.rootUserId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });
      await createLockdownIfNeeded({
        signal: "login_ssh",
        endpointClass: "public-auth",
        subjectScope: "account",
        subjectKey: input.authPrincipalId,
        threshold: config.accountLockdownThreshold,
        attempts: accountAttempts,
        reason: "repeated_ssh_failures_account",
        eventType: "login_ssh_lockdown_started",
        authPrincipalId: input.authPrincipalId,
        rootUserId: input.rootUserId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });
      await createLockdownIfNeeded({
        signal: "login_ssh",
        endpointClass: "public-auth",
        subjectScope: "ip_account",
        subjectKey: ipAccountKey,
        threshold: config.ipAccountLockdownThreshold,
        attempts: ipAccountAttempts,
        reason: "repeated_ssh_failures_ip_account",
        eventType: "login_ssh_lockdown_started",
        authPrincipalId: input.authPrincipalId,
        rootUserId: input.rootUserId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });
    },
    async clearAccountFailureState(input) {
      if (!config.enabled) {
        return;
      }

      await repository.clearCounters(
        "auth_failure",
        "account",
        input.normalizedEmail,
        "login_password",
      );
      await repository.clearCounters(
        "auth_failure",
        "account",
        input.authPrincipalId,
        "login_ssh",
      );

      if (input.ipAddress) {
        await repository.clearCounters(
          "auth_failure",
          "ip_account",
          `${input.ipAddress}|${input.normalizedEmail}`,
          "login_password",
        );
        await repository.clearCounters(
          "auth_failure",
          "ip_account",
          `${input.ipAddress}|${input.authPrincipalId}`,
          "login_ssh",
        );
      }
    },
  };
}
