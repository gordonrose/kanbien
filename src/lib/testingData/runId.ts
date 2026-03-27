const testRunIdPattern = /^tr_\d{8}_[a-z0-9]+$/;

function formatUtcDate(date: Date): string {
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export function createTestRunId(date = new Date(), suffix?: string): string {
  const safeSuffix = (suffix ?? Math.random().toString(36).slice(2, 8)).toLowerCase();
  return `tr_${formatUtcDate(date)}_${safeSuffix}`;
}

export function isValidTestRunId(value: string): boolean {
  return testRunIdPattern.test(value);
}
