import { randomUUID } from "node:crypto";

export function createDesignSystemCanonicalId() {
  return randomUUID();
}

