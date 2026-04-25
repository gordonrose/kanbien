import { InvalidJobRequestError } from "../contract/errors";
import type { JobQueueName } from "./types";

export const JOB_QUEUE_NAMES: JobQueueName[] = ["critical", "default", "bulk", "maintenance"];

export const DEFAULT_QUEUE_CONCURRENCY: Record<JobQueueName, number> = {
  critical: 4,
  default: 8,
  bulk: 2,
  maintenance: 1,
};

export function assertJobQueueName(value: string): asserts value is JobQueueName {
  if (!JOB_QUEUE_NAMES.includes(value as JobQueueName)) {
    throw new InvalidJobRequestError("Unsupported job queue.", {
      field: "queueName",
      reason: value,
    });
  }
}

export function normalizePriority(value: number): number {
  if (!Number.isInteger(value) || value < 1 || value > 100) {
    throw new InvalidJobRequestError("Job priority must be an integer from 1 through 100.", {
      field: "priority",
      reason: String(value),
    });
  }

  return value;
}

export function assertCriticalQueueAllowed(queueName: JobQueueName, allowCriticalQueue: boolean): void {
  if (queueName === "critical" && !allowCriticalQueue) {
    throw new InvalidJobRequestError("Critical queue usage requires explicit job-type approval.", {
      field: "queueName",
      reason: "critical_requires_approval",
    });
  }
}
