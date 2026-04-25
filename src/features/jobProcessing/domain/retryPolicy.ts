import type { JobRetryPolicy } from "./types";

export const DEFAULT_JOB_RETRY_POLICY: JobRetryPolicy = {
  maxAttempts: 5,
  initialDelayMs: 30_000,
  maxDelayMs: 30 * 60_000,
  jitterRatio: 0.2,
};

export function normalizeRetryPolicy(policy: Partial<JobRetryPolicy> | undefined): JobRetryPolicy {
  return {
    ...DEFAULT_JOB_RETRY_POLICY,
    ...policy,
  };
}

export interface RetryDecision {
  retryable: boolean;
  exhausted: boolean;
  nextDelayMs: number | null;
  terminalStatus: "retryable" | "dead";
}

export function computeRetryDecision(input: {
  attemptNumber: number;
  errorCode?: string | null;
  retryPolicy: JobRetryPolicy;
  random?: () => number;
}): RetryDecision {
  const errorCode = input.errorCode ?? null;
  const nonRetryable = errorCode
    ? input.retryPolicy.nonRetryableErrorCodes?.includes(errorCode) === true
    : false;
  const retryableAllowList = input.retryPolicy.retryableErrorCodes;
  const retryableByCode =
    !retryableAllowList || !errorCode || retryableAllowList.includes(errorCode);
  const exhausted = input.attemptNumber >= input.retryPolicy.maxAttempts;

  if (nonRetryable || !retryableByCode || exhausted) {
    return {
      retryable: false,
      exhausted: true,
      nextDelayMs: null,
      terminalStatus: "dead",
    };
  }

  const exponent = Math.max(input.attemptNumber - 1, 0);
  const rawDelay = input.retryPolicy.initialDelayMs * 2 ** exponent;
  const cappedDelay = Math.min(rawDelay, input.retryPolicy.maxDelayMs);
  const random = input.random ?? Math.random;
  const jitter = cappedDelay * input.retryPolicy.jitterRatio * random();

  return {
    retryable: true,
    exhausted: false,
    nextDelayMs: Math.round(Math.min(cappedDelay + jitter, input.retryPolicy.maxDelayMs)),
    terminalStatus: "retryable",
  };
}
