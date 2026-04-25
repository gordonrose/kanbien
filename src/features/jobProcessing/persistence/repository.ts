import type {
  ClaimedOutboxJob,
  DurableAttemptRecord,
  DurableJobRecord,
  DurableOutboxRecord,
  EnqueueJobRequest,
  JobAttemptStatus,
  JobRetryPolicy,
  JobStatus,
} from "../domain/types";

export interface CreateJobRecordInput {
  request: EnqueueJobRequest;
  jobId: string;
  outboxId: string;
  queueName: DurableJobRecord["queueName"];
  priority: number;
  runAt: Date;
  maxAttempts: number;
  payloadJson: unknown;
  executionScope: DurableJobRecord["executionScope"];
  retryPolicy: JobRetryPolicy;
}

export interface RecordAttemptStartInput {
  attemptId: string;
  jobId: string;
  attemptNumber: number;
  workerId: string;
  startedAt: Date;
}

export interface RecordAttemptFinishInput {
  attemptId: string;
  jobId: string;
  status: JobAttemptStatus;
  finishedAt: Date;
  errorCode?: string | null;
  errorSummary?: string | null;
  jobStatus: JobStatus;
  nextRunAt?: Date | null;
  deadLetterReason?: string | null;
}

export interface JobProcessingRepository {
  createJobRequest(input: CreateJobRecordInput): Promise<DurableJobRecord>;
  findJobById(jobId: string): Promise<DurableJobRecord | null>;
  findJobByIdempotencyKey(jobType: string, idempotencyKey: string): Promise<DurableJobRecord | null>;
  claimPendingOutbox(input: {
    dispatcherId: string;
    limit: number;
    leaseUntil: Date;
    now: Date;
  }): Promise<ClaimedOutboxJob[]>;
  markOutboxDispatched(input: {
    outboxId: string;
    providerJobId: string;
    dispatchedAt: Date;
  }): Promise<void>;
  markOutboxDispatchFailed(input: {
    outboxId: string;
    errorSummary: string;
    failedAt: Date;
  }): Promise<void>;
  recordAttemptStart(input: RecordAttemptStartInput): Promise<DurableAttemptRecord>;
  recordAttemptFinish(input: RecordAttemptFinishInput): Promise<DurableAttemptRecord>;
  listAttempts(jobId: string): Promise<DurableAttemptRecord[]>;
  getOutboxByJobId(jobId: string): Promise<DurableOutboxRecord | null>;
}
