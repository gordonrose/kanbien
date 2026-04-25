import { randomUUID } from "node:crypto";
import { InvalidJobRequestError } from "../contract/errors";
import type { JobProcessingRepository } from "../persistence/repository";
import { assertSafeJobPayload, sanitizeErrorSummary } from "./payloadSafety";
import { computeRetryDecision, normalizeRetryPolicy } from "./retryPolicy";
import type { JobTypeRegistry } from "./jobRegistry";

function getErrorCode(error: unknown): string {
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string") {
    return error.code;
  }
  return "JOB_HANDLER_FAILED";
}

export async function executeRegisteredJob(input: {
  jobId: string;
  registry: JobTypeRegistry;
  repository: JobProcessingRepository;
  workerId: string;
  now?: Date;
  random?: () => number;
}): Promise<"succeeded" | "retryable" | "dead" | "skipped"> {
  const job = await input.repository.findJobById(input.jobId);
  if (!job) {
    throw new InvalidJobRequestError("Durable job was not found.", {
      field: "jobId",
      reason: "not_found",
    });
  }
  if (job.status === "dead" || job.status === "canceled" || job.status === "succeeded") {
    return "skipped";
  }

  const definition = input.registry.require(job.jobType);
  const validator = definition.supportedPayloadVersions[job.payloadVersion];
  if (!validator) {
    throw new InvalidJobRequestError("Unsupported queued payload version.", {
      field: "payloadVersion",
      reason: String(job.payloadVersion),
    });
  }
  validator(job.payloadJson);
  assertSafeJobPayload(job.payloadJson);

  const attemptNumber = job.attemptCount + 1;
  const attempt = await input.repository.recordAttemptStart({
    attemptId: randomUUID(),
    jobId: job.jobId,
    attemptNumber,
    workerId: input.workerId,
    startedAt: input.now ?? new Date(),
  });

  try {
    await definition.handler(job.payloadJson, {
      jobId: job.jobId,
      jobType: job.jobType,
      payloadVersion: job.payloadVersion,
      tenantId: job.tenantId,
      executionScope: job.executionScope,
      workerId: input.workerId,
      attemptNumber,
      idempotencyKey: job.idempotencyKey,
    });
    await input.repository.recordAttemptFinish({
      attemptId: attempt.attemptId,
      jobId: job.jobId,
      status: "succeeded",
      finishedAt: new Date(),
      jobStatus: "succeeded",
    });
    return "succeeded";
  } catch (error) {
    const errorCode = getErrorCode(error);
    const retryPolicy = normalizeRetryPolicy(definition.retryPolicy);
    const decision = computeRetryDecision({
      attemptNumber,
      errorCode,
      retryPolicy,
      random: input.random,
    });
    const finishedAt = new Date();
    const nextRunAt =
      decision.nextDelayMs === null ? null : new Date(finishedAt.getTime() + decision.nextDelayMs);
    await input.repository.recordAttemptFinish({
      attemptId: attempt.attemptId,
      jobId: job.jobId,
      status: decision.terminalStatus === "dead" ? "dead" : "failed",
      finishedAt,
      errorCode,
      errorSummary: sanitizeErrorSummary(error),
      jobStatus: decision.terminalStatus,
      nextRunAt,
      deadLetterReason: decision.exhausted ? errorCode : null,
    });
    return decision.terminalStatus;
  }
}
