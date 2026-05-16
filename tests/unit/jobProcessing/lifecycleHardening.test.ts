import { describe, expect, it } from "vitest";

import {
  JOB_LIFECYCLE_FAILURE_CATEGORIES,
  classifyJobLifecycleTimeout,
} from "../../../src/features/jobProcessing";

describe("job lifecycle hardening", () => {
  it("classifies stale running work with a safe timeout category", () => {
    const result = classifyJobLifecycleTimeout({
      observedAt: new Date("2026-05-16T10:00:00.000Z"),
      now: new Date("2026-05-16T10:31:00.000Z"),
      timeoutMs: 30 * 60 * 1000,
    });

    expect(result).toEqual({
      timedOut: true,
      failureCategory: JOB_LIFECYCLE_FAILURE_CATEGORIES.workerTimeout,
      elapsedMs: 31 * 60 * 1000,
    });
  });

  it("keeps active running work out of timeout failure handling", () => {
    const result = classifyJobLifecycleTimeout({
      observedAt: "2026-05-16T10:00:00.000Z",
      now: new Date("2026-05-16T10:29:59.000Z"),
      timeoutMs: 30 * 60 * 1000,
    });

    expect(result.timedOut).toBe(false);
    expect(result.failureCategory).toBeNull();
  });
});
