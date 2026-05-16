export const JOB_LIFECYCLE_FAILURE_CATEGORIES = {
  workerTimeout: "worker_timeout",
} as const;

export type JobLifecycleFailureCategory =
  (typeof JOB_LIFECYCLE_FAILURE_CATEGORIES)[keyof typeof JOB_LIFECYCLE_FAILURE_CATEGORIES];

export interface TimeoutClassificationInput {
  observedAt: Date | string;
  now?: Date;
  timeoutMs: number;
}

export interface TimeoutClassification {
  timedOut: boolean;
  failureCategory: JobLifecycleFailureCategory | null;
  elapsedMs: number;
}

export function classifyJobLifecycleTimeout(input: TimeoutClassificationInput): TimeoutClassification {
  if (!Number.isFinite(input.timeoutMs) || input.timeoutMs <= 0) {
    throw new Error("timeoutMs must be a positive finite number.");
  }
  const observedAt = input.observedAt instanceof Date ? input.observedAt : new Date(input.observedAt);
  if (Number.isNaN(observedAt.getTime())) {
    throw new Error("observedAt must be a valid timestamp.");
  }
  const now = input.now ?? new Date();
  const elapsedMs = Math.max(0, now.getTime() - observedAt.getTime());
  const timedOut = elapsedMs >= input.timeoutMs;
  return {
    timedOut,
    failureCategory: timedOut ? JOB_LIFECYCLE_FAILURE_CATEGORIES.workerTimeout : null,
    elapsedMs,
  };
}
