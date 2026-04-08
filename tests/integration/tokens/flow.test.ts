import { describe, expect, it } from "vitest";
import {
  createOneTimeTokenMaterial,
  verifyOneTimeTokenAgainstRecord,
} from "../../../src/lib/tokens";

describe("shared token seam integration", () => {
  it("TC-TOKENS-INT-001 and TC-TOKENS-EDGE-003 let a caller persist hashed metadata and later verify without changing the wire format", () => {
    const issuedAt = new Date("2026-04-08T15:00:00.000Z");
    const token = createOneTimeTokenMaterial({
      purpose: "email_verification",
      ttlSeconds: 900,
      now: issuedAt,
    });

    const callerOwnedRecord = {
      tokenId: token.tokenId,
      purpose: "email_verification" as const,
      secretHash: token.secretHash,
      expiresAt: token.expiresAt,
      usedAt: null,
      subjectType: "principal",
      subjectId: "pr_123",
      tenantId: "11111111-1111-4111-8111-111111111111",
      targetEmail: "admin@example.com",
    };

    const result = verifyOneTimeTokenAgainstRecord({
      rawToken: token.rawToken,
      record: callerOwnedRecord,
      expectedPurpose: "email_verification",
      now: new Date("2026-04-08T15:05:00.000Z"),
    });

    expect(result).toEqual({
      ok: true,
      tokenId: token.tokenId,
      purpose: "email_verification",
      expiresAt: token.expiresAt,
    });
    expect(callerOwnedRecord.subjectType).toBe("principal");
    expect(callerOwnedRecord.targetEmail).toBe("admin@example.com");
  });
});
