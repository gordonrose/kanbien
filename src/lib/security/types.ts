export type EndpointClass =
  | "public-read"
  | "public-auth"
  | "public-write"
  | "authenticated-general"
  | "authenticated-sensitive";

export type CounterNamespace = "rate_limit" | "auth_failure" | "security_summary";
export type SubjectScope = "ip" | "account" | "ip_account" | "auth_user";

export interface RateLimitPolicy {
  endpointClass: EndpointClass;
  windowSeconds: number;
  maxAttempts: number;
  responseCode: "RATE_LIMITED" | "AUTH_THROTTLED";
  responseMessage: string;
}

export interface CounterInput {
  namespace: CounterNamespace;
  subjectScope: SubjectScope;
  subjectKey: string;
  signal: string;
  windowSeconds: number;
  now: Date;
}

export interface LockdownLookup {
  subjectScope: SubjectScope;
  subjectKey: string;
}

export interface CreateLockdownInput {
  lockdownId: string;
  subjectScope: SubjectScope;
  subjectKey: string;
  signal: string;
  reason: string;
  endpointClass: EndpointClass;
  startedAt: Date;
  expiresAt: Date;
}

export interface ActiveLockdownRecord {
  lockdown_id: string;
  subject_scope: SubjectScope;
  subject_key: string;
  signal: string;
  reason: string;
  endpoint_class: EndpointClass;
  started_at: Date;
  expires_at: Date;
  created_at: Date;
}

export interface SecurityAuditEventInput {
  eventId: string;
  authPrincipalId?: string;
  rootUserId?: string;
  eventType: string;
  eventOutcome: "success" | "failure";
  ipAddress?: string;
  userAgent?: string;
  occurredAt: Date;
}
