import type {
  ActiveLockdownRecord,
  CounterInput,
  CreateLockdownInput,
  LockdownLookup,
  SecurityAuditEventInput,
  SubjectScope,
} from "./types";

export interface PlatformSecurityRepository {
  incrementCounter(input: CounterInput): Promise<number>;
  clearCounters(
    namespace: CounterInput["namespace"],
    subjectScope: SubjectScope,
    subjectKey: string,
    signal: string,
  ): Promise<void>;
  findActiveLockdowns(
    lookups: LockdownLookup[],
    signal: string,
    now: Date,
  ): Promise<ActiveLockdownRecord[]>;
  createLockdown(input: CreateLockdownInput): Promise<boolean>;
  createSecurityAuditEvent(input: SecurityAuditEventInput): Promise<void>;
}
