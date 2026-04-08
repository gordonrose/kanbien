export type OneTimeTokenPurpose = "email_verification" | "password_reset";

export interface CreateOneTimeTokenMaterialInput {
  purpose: OneTimeTokenPurpose;
  ttlSeconds: number;
  now?: Date;
}

export interface OneTimeTokenMaterial {
  tokenId: string;
  rawToken: string;
  secretHash: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface ParsedOneTimeToken {
  tokenId: string;
  secret: string;
}

export type ParseOneTimeTokenResult =
  | {
      ok: true;
      value: ParsedOneTimeToken;
    }
  | {
      ok: false;
      code: "TOKEN_MALFORMED";
    };

export interface StoredOneTimeTokenRecord {
  tokenId: string;
  purpose: OneTimeTokenPurpose;
  secretHash: string;
  expiresAt: Date;
  usedAt: Date | null;
}

export interface VerifyOneTimeTokenAgainstRecordInput {
  rawToken: string;
  record: StoredOneTimeTokenRecord;
  expectedPurpose?: OneTimeTokenPurpose;
  now?: Date;
}

export type VerifyOneTimeTokenFailureCode =
  | "TOKEN_MALFORMED"
  | "TOKEN_ID_MISMATCH"
  | "TOKEN_PURPOSE_MISMATCH"
  | "TOKEN_USED"
  | "TOKEN_EXPIRED"
  | "TOKEN_SECRET_MISMATCH";

export type VerifyOneTimeTokenAgainstRecordResult =
  | {
      ok: true;
      tokenId: string;
      purpose: OneTimeTokenPurpose;
      expiresAt: Date;
    }
  | {
      ok: false;
      code: VerifyOneTimeTokenFailureCode;
    };

export class InvalidOneTimeTokenTtlError extends Error {
  readonly code = "TOKEN_INVALID_TTL";

  constructor(ttlSeconds: number) {
    super(`One-time token TTL must be a positive integer. Received: ${ttlSeconds}`);
    this.name = "InvalidOneTimeTokenTtlError";
  }
}
