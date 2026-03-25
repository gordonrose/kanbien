import type { Pool } from "pg";
import type { PlatformSecurityRepository } from "./repository";
import type {
  ActiveLockdownRecord,
  CounterInput,
  CreateLockdownInput,
  LockdownLookup,
  SecurityAuditEventInput,
  SubjectScope,
} from "./types";

function floorToWindow(now: Date, windowSeconds: number): Date {
  const windowMs = windowSeconds * 1000;
  return new Date(Math.floor(now.getTime() / windowMs) * windowMs);
}

export function createPostgresPlatformSecurityRepository(
  dbPool: Pool,
): PlatformSecurityRepository {
  return {
    async incrementCounter(input: CounterInput) {
      const windowStartedAt = floorToWindow(input.now, input.windowSeconds);
      const expiresAt = new Date(windowStartedAt.getTime() + input.windowSeconds * 1000);
      const result = await dbPool.query<{ attempt_count: number }>(
        `
          INSERT INTO platform_security_counters (
            counter_namespace,
            subject_scope,
            subject_key,
            signal,
            window_started_at,
            attempt_count,
            expires_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, 1, $6, NOW())
          ON CONFLICT (
            counter_namespace,
            subject_scope,
            subject_key,
            signal,
            window_started_at
          )
          DO UPDATE
          SET attempt_count = platform_security_counters.attempt_count + 1,
              expires_at = EXCLUDED.expires_at,
              updated_at = NOW()
          RETURNING attempt_count
        `,
        [
          input.namespace,
          input.subjectScope,
          input.subjectKey,
          input.signal,
          windowStartedAt,
          expiresAt,
        ],
      );

      return Number(result.rows[0]?.attempt_count ?? 0);
    },
    async clearCounters(namespace, subjectScope, subjectKey, signal) {
      await dbPool.query(
        `
          DELETE FROM platform_security_counters
          WHERE counter_namespace = $1
            AND subject_scope = $2
            AND subject_key = $3
            AND signal = $4
        `,
        [namespace, subjectScope, subjectKey, signal],
      );
    },
    async findActiveLockdowns(lookups: LockdownLookup[], signal: string, now: Date) {
      if (lookups.length === 0) {
        return [];
      }

      const scopes: SubjectScope[] = [];
      const keys: string[] = [];
      const pairs = lookups
        .map((lookup) => {
          scopes.push(lookup.subjectScope);
          keys.push(lookup.subjectKey);
          return `($${scopes.length * 2 - 1}, $${scopes.length * 2})`;
        })
        .join(", ");

      const result = await dbPool.query<ActiveLockdownRecord>(
        `
          SELECT *
          FROM platform_security_lockdowns
          WHERE (subject_scope, subject_key) IN (${pairs})
            AND signal = $${scopes.length * 2 + 1}
            AND expires_at > $${scopes.length * 2 + 2}
        `,
        [...scopes.flatMap((scope, index) => [scope, keys[index]]), signal, now],
      );

      return result.rows;
    },
    async createLockdown(input: CreateLockdownInput) {
      const existing = await dbPool.query(
        `
          SELECT lockdown_id
          FROM platform_security_lockdowns
          WHERE subject_scope = $1
            AND subject_key = $2
            AND signal = $3
            AND expires_at > $4
          LIMIT 1
        `,
        [input.subjectScope, input.subjectKey, input.signal, input.startedAt],
      );

      if ((existing.rowCount ?? 0) > 0) {
        return false;
      }

      await dbPool.query(
        `
          INSERT INTO platform_security_lockdowns (
            lockdown_id,
            subject_scope,
            subject_key,
            signal,
            reason,
            endpoint_class,
            started_at,
            expires_at,
            created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        `,
        [
          input.lockdownId,
          input.subjectScope,
          input.subjectKey,
          input.signal,
          input.reason,
          input.endpointClass,
          input.startedAt,
          input.expiresAt,
        ],
      );

      return true;
    },
    async createSecurityAuditEvent(input: SecurityAuditEventInput) {
      await dbPool.query(
        `
          INSERT INTO auth_audit_events (
            event_id,
            auth_principal_id,
            root_user_id,
            event_type,
            event_outcome,
            ip_address,
            user_agent,
            occurred_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          input.eventId,
          input.authPrincipalId ?? null,
          input.rootUserId ?? null,
          input.eventType,
          input.eventOutcome,
          input.ipAddress ?? null,
          input.userAgent ?? null,
          input.occurredAt,
        ],
      );
    },
  };
}
