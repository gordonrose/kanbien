export type JobQueueName = "critical" | "default" | "bulk" | "maintenance";
export type JobExecutionScope = "root" | "tenant" | "platform-internal" | "shared-cross-tenant";
export type JobStatus =
  | "queued"
  | "dispatched"
  | "running"
  | "succeeded"
  | "retryable"
  | "dead"
  | "canceled";
export type JobDispatchStatus = "pending" | "dispatched" | "failed";
export type JobAttemptStatus = "running" | "succeeded" | "failed" | "dead";
export type JobActorType = "root_user" | "tenant_user" | "system";

export interface JobRetryPolicy {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  jitterRatio: number;
  retryableErrorCodes?: string[];
  nonRetryableErrorCodes?: string[];
}

export interface JobHandlerContext {
  jobId: string;
  jobType: string;
  payloadVersion: number;
  tenantId: string | null;
  executionScope: JobExecutionScope;
  workerId: string;
  attemptNumber: number;
  idempotencyKey: string | null;
}

export type JobPayloadValidator = (payload: unknown) => void;
export type JobHandler = (payload: unknown, context: JobHandlerContext) => Promise<void>;

export interface JobTypeDefinition {
  jobType: string;
  ownerFeature: string;
  supportedPayloadVersions: Record<number, JobPayloadValidator>;
  executionScope: JobExecutionScope;
  defaultQueue: JobQueueName;
  defaultPriority: number;
  retryPolicy?: Partial<JobRetryPolicy>;
  handler: JobHandler;
  allowCriticalQueue?: boolean;
  sharedCrossTenantApproved?: boolean;
  sensitivePayloadFields?: string[];
}

export interface EnqueueJobRequest {
  jobType: string;
  payloadVersion: number;
  payload: unknown;
  executionScope?: JobExecutionScope;
  tenantId?: string | null;
  queueName?: JobQueueName;
  priority?: number;
  runAt?: Date | string | null;
  idempotencyKey?: string | null;
  requestedByActorType?: JobActorType | null;
  requestedByActorId?: string | null;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
  recurringSchedule?: unknown;
}

export interface EnqueuedJob {
  jobId: string;
  jobType: string;
  queueName: JobQueueName;
  payloadVersion: number;
  status: JobStatus;
  priority: number;
  runAt: Date;
  idempotencyKey: string | null;
  idempotentReplay: boolean;
}

export interface DurableJobRecord {
  jobId: string;
  jobType: string;
  queueName: JobQueueName;
  payloadVersion: number;
  payloadJson: unknown;
  executionScope: JobExecutionScope;
  tenantId: string | null;
  requestedByActorType: JobActorType | null;
  requestedByActorId: string | null;
  idempotencyKey: string | null;
  status: JobStatus;
  priority: number;
  runAt: Date;
  attemptCount: number;
  maxAttempts: number;
  deadLetterReason: string | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export interface DurableOutboxRecord {
  outboxId: string;
  jobId: string;
  dispatchStatus: JobDispatchStatus;
  providerJobId: string | null;
  dispatchAttemptCount: number;
  lockedBy: string | null;
  lockedUntil: Date | null;
  lastErrorSummary: string | null;
  dispatchedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DurableAttemptRecord {
  attemptId: string;
  jobId: string;
  attemptNumber: number;
  workerId: string;
  status: JobAttemptStatus;
  startedAt: Date;
  finishedAt: Date | null;
  errorCode: string | null;
  errorSummary: string | null;
}

export interface ClaimedOutboxJob {
  outbox: DurableOutboxRecord;
  job: DurableJobRecord;
}

export interface JobMetadataProjection {
  jobId: string;
  jobType: string;
  queueName: JobQueueName;
  payloadVersion: number;
  status: JobStatus;
  priority: number;
  runAt: Date;
  attemptCount: number;
  maxAttempts: number;
  idempotencyKey: string | null;
  tenantId: string | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  deadLetterReason: string | null;
  payloadSummary: Record<string, string>;
}
