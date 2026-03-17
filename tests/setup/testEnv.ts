import { beforeEach, afterEach, vi } from "vitest";

const FIXED_NOW = new Date("2026-01-01T00:00:00.000Z");

export function installDeterministicTestEnv(): void {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
}
