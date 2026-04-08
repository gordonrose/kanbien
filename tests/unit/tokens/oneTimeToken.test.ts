import { describe, expect, it } from "vitest";
import {
  InvalidOneTimeTokenTtlError,
  createOneTimeTokenMaterial,
  parseOneTimeToken,
  verifyOneTimeTokenAgainstRecord,
  type OneTimeTokenPurpose,
  type StoredOneTimeTokenRecord,
} from "../../../src/lib/tokens";

function createStoredRecord(
  purpose: OneTimeTokenPurpose,
  overrides: Partial<StoredOneTimeTokenRecord> = {},
) {
  const token = createOneTimeTokenMaterial({
    purpose,
    ttlSeconds: 900,
    now: new Date("2026-04-08T10:00:00.000Z"),
  });

  const record: StoredOneTimeTokenRecord = {
    tokenId: token.tokenId,
    purpose,
    secretHash: token.secretHash,
    expiresAt: token.expiresAt,
    usedAt: null,
    ...overrides,
  };

  return { token, record };
}

describe("shared one-time token library", () => {
  it("TC-TOKENS-UNIT-001 and TC-TOKENS-EDGE-001 create opaque email-verification token material with storage-safe hashed output", () => {
    const now = new Date("2026-04-08T12:00:00.000Z");

    const result = createOneTimeTokenMaterial({
      purpose: "email_verification",
      ttlSeconds: 300,
      now,
    });

    expect(result.createdAt.toISOString()).toBe("2026-04-08T12:00:00.000Z");
    expect(result.expiresAt.toISOString()).toBe("2026-04-08T12:05:00.000Z");
    expect(result.tokenId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(result.rawToken.startsWith(`${result.tokenId}.`)).toBe(true);
    expect(result.secretHash).toMatch(/^[a-f0-9]{64}$/);
    expect(result.secretHash).not.toBe(result.rawToken);
    expect(result).not.toHaveProperty("secret");
  });

  it("TC-TOKENS-UNIT-002 creates password-reset token material without changing the token wire format", () => {
    const result = createOneTimeTokenMaterial({
      purpose: "password_reset",
      ttlSeconds: 600,
      now: new Date("2026-04-08T12:00:00.000Z"),
    });

    const parsed = parseOneTimeToken(result.rawToken);

    expect(parsed).toEqual({
      ok: true,
      value: expect.objectContaining({
        tokenId: result.tokenId,
      }),
    });
    expect(result.secretHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("TC-TOKENS-UNIT-003 parses the approved token format into lookup-ready parts", () => {
    expect(parseOneTimeToken("token-lookup-id.opaque-secret_123-XYZ")).toEqual({
      ok: true,
      value: {
        tokenId: "token-lookup-id",
        secret: "opaque-secret_123-XYZ",
      },
    });
  });

  it("TC-TOKENS-UNIT-004 verifies a valid token against caller-supplied stored metadata", () => {
    const { token, record } = createStoredRecord("email_verification");

    expect(
      verifyOneTimeTokenAgainstRecord({
        rawToken: token.rawToken,
        record,
        expectedPurpose: "email_verification",
        now: new Date("2026-04-08T10:05:00.000Z"),
      }),
    ).toEqual({
      ok: true,
      tokenId: token.tokenId,
      purpose: "email_verification",
      expiresAt: record.expiresAt,
    });
  });

  it("TC-TOKENS-SEC-001 rejects zero, negative, and non-integer TTL input", () => {
    expect(() =>
      createOneTimeTokenMaterial({
        purpose: "email_verification",
        ttlSeconds: 0,
      }),
    ).toThrowError(InvalidOneTimeTokenTtlError);
    expect(() =>
      createOneTimeTokenMaterial({
        purpose: "email_verification",
        ttlSeconds: -60,
      }),
    ).toThrowError(InvalidOneTimeTokenTtlError);
    expect(() =>
      createOneTimeTokenMaterial({
        purpose: "email_verification",
        ttlSeconds: 1.5,
      }),
    ).toThrowError(InvalidOneTimeTokenTtlError);
  });

  it("TC-TOKENS-SEC-002 rejects malformed token shapes deterministically", () => {
    expect(parseOneTimeToken("missing-delimiter")).toEqual({
      ok: false,
      code: "TOKEN_MALFORMED",
    });
    expect(parseOneTimeToken(".secret-only")).toEqual({
      ok: false,
      code: "TOKEN_MALFORMED",
    });
    expect(parseOneTimeToken("token-id.")).toEqual({
      ok: false,
      code: "TOKEN_MALFORMED",
    });
    expect(parseOneTimeToken("token.id.with.extra.delimiters")).toEqual({
      ok: false,
      code: "TOKEN_MALFORMED",
    });
  });

  it("TC-TOKENS-SEC-003 rejects purpose mismatch, used records, expired records, token-ID mismatch, and secret mismatch", () => {
    const { token, record } = createStoredRecord("password_reset");

    expect(
      verifyOneTimeTokenAgainstRecord({
        rawToken: token.rawToken,
        record,
        expectedPurpose: "email_verification",
        now: new Date("2026-04-08T10:05:00.000Z"),
      }),
    ).toEqual({
      ok: false,
      code: "TOKEN_PURPOSE_MISMATCH",
    });

    expect(
      verifyOneTimeTokenAgainstRecord({
        rawToken: token.rawToken,
        record: {
          ...record,
          usedAt: new Date("2026-04-08T10:01:00.000Z"),
        },
        expectedPurpose: "password_reset",
        now: new Date("2026-04-08T10:05:00.000Z"),
      }),
    ).toEqual({
      ok: false,
      code: "TOKEN_USED",
    });

    expect(
      verifyOneTimeTokenAgainstRecord({
        rawToken: token.rawToken,
        record,
        expectedPurpose: "password_reset",
        now: record.expiresAt,
      }),
    ).toEqual({
      ok: false,
      code: "TOKEN_EXPIRED",
    });

    expect(
      verifyOneTimeTokenAgainstRecord({
        rawToken: token.rawToken,
        record: {
          ...record,
          tokenId: "different-token-id",
        },
        expectedPurpose: "password_reset",
        now: new Date("2026-04-08T10:05:00.000Z"),
      }),
    ).toEqual({
      ok: false,
      code: "TOKEN_ID_MISMATCH",
    });

    expect(
      verifyOneTimeTokenAgainstRecord({
        rawToken: `${token.tokenId}.wrong-secret`,
        record,
        expectedPurpose: "password_reset",
        now: new Date("2026-04-08T10:05:00.000Z"),
      }),
    ).toEqual({
      ok: false,
      code: "TOKEN_SECRET_MISMATCH",
    });
  });

  it("TC-TOKENS-SEC-004 and TC-TOKENS-AUD-001 keep verification side-effect free and outside direct audit ownership", () => {
    const { token, record } = createStoredRecord("email_verification");
    const before = {
      tokenId: record.tokenId,
      purpose: record.purpose,
      secretHash: record.secretHash,
      expiresAt: new Date(record.expiresAt.getTime()),
      usedAt: record.usedAt,
    };

    verifyOneTimeTokenAgainstRecord({
      rawToken: token.rawToken,
      record,
      expectedPurpose: "email_verification",
      now: new Date("2026-04-08T10:05:00.000Z"),
    });

    expect(record).toEqual(before);
  });

  it("TC-TOKENS-EDGE-002 treats expiry as a strict boundary with deterministic time injection", () => {
    const { token, record } = createStoredRecord("password_reset");

    expect(
      verifyOneTimeTokenAgainstRecord({
        rawToken: token.rawToken,
        record,
        expectedPurpose: "password_reset",
        now: new Date(record.expiresAt.getTime() - 1),
      }),
    ).toEqual({
      ok: true,
      tokenId: token.tokenId,
      purpose: "password_reset",
      expiresAt: record.expiresAt,
    });

    expect(
      verifyOneTimeTokenAgainstRecord({
        rawToken: token.rawToken,
        record,
        expectedPurpose: "password_reset",
        now: record.expiresAt,
      }),
    ).toEqual({
      ok: false,
      code: "TOKEN_EXPIRED",
    });
  });
});
