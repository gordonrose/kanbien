import { InvalidJobRequestError } from "../contract/errors";

const FORBIDDEN_KEY_PATTERNS = [
  /token/i,
  /session/i,
  /password/i,
  /credential/i,
  /secret/i,
  /private.*key/i,
  /bearer/i,
  /permission/i,
  /role.*claim/i,
  /authorit/i,
];

const MAX_PAYLOAD_BYTES = 32 * 1024;

function assertPlainJson(value: unknown, path: string): void {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertPlainJson(item, `${path}[${index}]`));
    return;
  }

  if (typeof value === "object") {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (FORBIDDEN_KEY_PATTERNS.some((pattern) => pattern.test(key))) {
        throw new InvalidJobRequestError("Job payload contains a forbidden secret or authority field.", {
          field: `${path}.${key}`,
          reason: "forbidden_payload_field",
        });
      }
      assertPlainJson(child, `${path}.${key}`);
    }
    return;
  }

  throw new InvalidJobRequestError("Job payload must be JSON-serializable.", {
    field: path,
    reason: typeof value,
  });
}

export function assertSafeJobPayload(payload: unknown): void {
  assertPlainJson(payload, "payload");

  const bytes = Buffer.byteLength(JSON.stringify(payload), "utf8");
  if (bytes > MAX_PAYLOAD_BYTES) {
    throw new InvalidJobRequestError("Job payload is too large for the foundation queue contract.", {
      field: "payload",
      reason: "payload_too_large",
    });
  }
}

export function sanitizeErrorSummary(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  return raw
    .replace(/bearer\s+[a-z0-9._~+/=-]+/gi, "bearer [REDACTED]")
    .replace(/token[=:]\s*[^,\s]+/gi, "token=[REDACTED]")
    .replace(/password[=:]\s*[^,\s]+/gi, "password=[REDACTED]")
    .slice(0, 500);
}

export function buildSafePayloadSummary(payload: unknown): Record<string, string> {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { kind: typeof payload };
  }

  const summary: Record<string, string> = {};
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    summary[key] = FORBIDDEN_KEY_PATTERNS.some((pattern) => pattern.test(key))
      ? "[REDACTED]"
      : Array.isArray(value)
        ? "array"
        : value === null
          ? "null"
          : typeof value;
  }
  return summary;
}
