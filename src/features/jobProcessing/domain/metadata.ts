import { buildSafePayloadSummary } from "./payloadSafety";
import type { DurableJobRecord, JobMetadataProjection } from "./types";

export function buildJobMetadataProjection(job: DurableJobRecord): JobMetadataProjection {
  return {
    jobId: job.jobId,
    jobType: job.jobType,
    queueName: job.queueName,
    payloadVersion: job.payloadVersion,
    status: job.status,
    priority: job.priority,
    runAt: job.runAt,
    attemptCount: job.attemptCount,
    maxAttempts: job.maxAttempts,
    idempotencyKey: job.idempotencyKey,
    tenantId: job.tenantId,
    relatedEntityType: job.relatedEntityType,
    relatedEntityId: job.relatedEntityId,
    deadLetterReason: job.deadLetterReason,
    payloadSummary: buildSafePayloadSummary(job.payloadJson),
  };
}
