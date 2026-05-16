import { describe, expect, it } from "vitest";

import {
  decryptExportPin,
  encryptExportPin,
} from "../../../src/features/organizationExports/domain/secretBox";

describe("organization export PIN secret box", () => {
  it("stores the generated PIN as encrypted material and decrypts only with the same secret", () => {
    const encrypted = encryptExportPin("1234567890", "test-secret");

    expect(encrypted).not.toContain("1234567890");
    expect(decryptExportPin(encrypted, "test-secret")).toBe("1234567890");
    expect(() => decryptExportPin(encrypted, "wrong-secret")).toThrow();
  });
});
