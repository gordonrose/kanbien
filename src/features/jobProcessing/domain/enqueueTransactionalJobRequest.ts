import { randomUUID } from "node:crypto";
import { InvalidJobRequestError } from "../contract/errors";
import type { JobProcessingRepository } from "../persistence/repository";
import { assertSafeJobPayload } from "./payloadSafety";
import { assertCriticalQueueAllowed, assertJobQueueName, normalizePriority } from "./queueConfig";
import { normalizeRetryPolicy } from "./retryPolicy";
import type { EnqueueJobRequest, EnqueuedJob, JobExecutionScope } from "./types";
import type { JobTypeRegistry } from "./jobRegistry";

function parseRunAt(value: Date | string | null | undefined): Date {
  if (value === null || value === undefined) {
    return new Date();
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new InvalidJobRequestError("runAt must be an ISO-8601 timestamp when supplied.", {
      field: "runAt",
      reason: "invalid_timestamp",
    });
  }
  return date;
}

function validateScope(input: {
  declaredScope: JobExecutionScope;
  requestedScope: JobExecutionScope | undefined;
  tenantId: string | null | undefined;
}): JobExecutionScope {
  const effectiveScope = input.requestedScope ?? input.declaredScope;
  if (effectiveScope !== input.declaredScope) {
    throw new InvalidJobRequestError("Requested execution scope does not match registered job scope.", {
      field: "executionScope",
      reason: "scope_mismatch",
    });
  }
  if (effectiveScope === "tenant" && !input.tenantId) {
    throw new InvalidJobRequestError("Tenant-scoped jobs require exactly one tenant ID.", {
      field: "tenantId",
      reason: "missing",
    });
  }
  if (effectiveScope !== "tenant" && input.tenantId) {
    throw new InvalidJobRequestError("Only tenant-scoped jobs may carry a tenant ID.", {
      field: "tenantId",
      reason: "unexpected",
    });
  }
  return effectiveScope;
}

export async function enqueueTransactionalJobRequest(input: {
  request: EnqueueJobRequest;
  registry: JobTypeRegistry;
  repository: JobProcessingRepository;
  now?: Date;
}): Promise<EnqueuedJob> {
  if (input.request.recurringSchedule !== undefined) {
    throw new InvalidJobRequestError("Recurring job schedules are deferred in v1.", {
      field: "recurringSchedule",
      reason: "deferred",
    });
  }

  const definition = input.registry.require(input.request.jobType);
  const validator = definition.supportedPayloadVersions[input.request.payloadVersion];
  if (!validator) {
    throw new InvalidJobRequestError("Unsupported payload version for job type.", {
      field: "payloadVersion",
      reason: String(input.request.payloadVersion),
    });
  }
  validator(input.request.payload);
  assertSafeJobPayload(input.request.payload);

  const executionScope = validateScope({
    declaredScope: definition.executionScope,
    requestedScope: input.request.executionScope,
    tenantId: input.request.tenantId,
  });
  const queueName = input.request.queueName ?? definition.defaultQueue;
  assertJobQueueName(queueName);
  assertCriticalQueueAllowed(queueName, definition.allowCriticalQueue === true);
  const priority = normalizePriority(input.request.priority ?? definition.defaultPriority);
  const retryPolicy = normalizeRetryPolicy(definition.retryPolicy);

  const existing =
    input.request.idempotencyKey === null || input.request.idempotencyKey === undefined
      ? null
      : await input.repository.findJobByIdempotencyKey(
          input.request.jobType,
          input.request.idempotencyKey,
        );
  if (existing) {
    return {
      jobId: existing.jobId,
      jobType: existing.jobType,
      queueName: existing.queueName,
      payloadVersion: existing.payloadVersion,
      status: existing.status,
      priority: existing.priority,
      runAt: existing.runAt,
      idempotencyKey: existing.idempotencyKey,
      idempotentReplay: true,
    };
  }

  const job = await input.repository.createJobRequest({
    request: input.request,
    jobId: randomUUID(),
    outboxId: randomUUID(),
    queueName,
    priority,
    runAt: parseRunAt(input.request.runAt),
    maxAttempts: retryPolicy.maxAttempts,
    payloadJson: input.request.payload,
    executionScope,
    retryPolicy,
  });

  return {
    jobId: job.jobId,
    jobType: job.jobType,
    queueName: job.queueName,
    payloadVersion: job.payloadVersion,
    status: job.status,
    priority: job.priority,
    runAt: job.runAt,
    idempotencyKey: job.idempotencyKey,
    idempotentReplay: false,
  };
}
