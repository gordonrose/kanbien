import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import {
  InvalidOneTimeTokenTtlError,
  type CreateOneTimeTokenMaterialInput,
  type OneTimeTokenMaterial,
  type ParseOneTimeTokenResult,
  type VerifyOneTimeTokenAgainstRecordInput,
  type VerifyOneTimeTokenAgainstRecordResult,
} from "./types";

const RAW_TOKEN_DELIMITER = ".";
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
const EMPTY_SHA256_HEX_BUFFER = Buffer.alloc(32, 0);

function toNow(input?: Date): Date {
  return input ? new Date(input.getTime()) : new Date();
}

function hashTokenSecret(secret: string): string {
  return createHash("sha256").update(secret, "utf8").digest("hex");
}

function toSha256Buffer(hash: string): Buffer {
  if (!SHA256_HEX_PATTERN.test(hash)) {
    return EMPTY_SHA256_HEX_BUFFER;
  }

  return Buffer.from(hash, "hex");
}

function hasPositiveIntegerTtl(ttlSeconds: number): boolean {
  return Number.isInteger(ttlSeconds) && ttlSeconds > 0;
}

function verifySecretHash(secret: string, storedHash: string): boolean {
  const presentedHash = hashTokenSecret(secret);
  const presentedBuffer = toSha256Buffer(presentedHash);
  const storedBuffer = toSha256Buffer(storedHash);
  const hashesMatch = timingSafeEqual(presentedBuffer, storedBuffer);

  return SHA256_HEX_PATTERN.test(storedHash) && hashesMatch;
}

export function createOneTimeTokenMaterial(
  input: CreateOneTimeTokenMaterialInput,
): OneTimeTokenMaterial {
  if (!hasPositiveIntegerTtl(input.ttlSeconds)) {
    throw new InvalidOneTimeTokenTtlError(input.ttlSeconds);
  }

  const createdAt = toNow(input.now);
  const expiresAt = new Date(createdAt.getTime() + input.ttlSeconds * 1000);
  const tokenId = randomUUID();
  const secret = randomBytes(32).toString("base64url");

  return {
    tokenId,
    rawToken: `${tokenId}${RAW_TOKEN_DELIMITER}${secret}`,
    secretHash: hashTokenSecret(secret),
    createdAt,
    expiresAt,
  };
}

export function parseOneTimeToken(rawToken: string): ParseOneTimeTokenResult {
  if (typeof rawToken !== "string") {
    return { ok: false, code: "TOKEN_MALFORMED" };
  }

  const delimiterIndex = rawToken.indexOf(RAW_TOKEN_DELIMITER);

  if (
    delimiterIndex <= 0 ||
    delimiterIndex !== rawToken.lastIndexOf(RAW_TOKEN_DELIMITER) ||
    delimiterIndex === rawToken.length - 1
  ) {
    return { ok: false, code: "TOKEN_MALFORMED" };
  }

  return {
    ok: true,
    value: {
      tokenId: rawToken.slice(0, delimiterIndex),
      secret: rawToken.slice(delimiterIndex + RAW_TOKEN_DELIMITER.length),
    },
  };
}

export function verifyOneTimeTokenAgainstRecord(
  input: VerifyOneTimeTokenAgainstRecordInput,
): VerifyOneTimeTokenAgainstRecordResult {
  const parsed = parseOneTimeToken(input.rawToken);

  if (!parsed.ok) {
    return { ok: false, code: "TOKEN_MALFORMED" };
  }

  if (parsed.value.tokenId !== input.record.tokenId) {
    return { ok: false, code: "TOKEN_ID_MISMATCH" };
  }

  if (input.expectedPurpose && input.record.purpose !== input.expectedPurpose) {
    return { ok: false, code: "TOKEN_PURPOSE_MISMATCH" };
  }

  if (input.record.usedAt) {
    return { ok: false, code: "TOKEN_USED" };
  }

  if (toNow(input.now).getTime() >= input.record.expiresAt.getTime()) {
    return { ok: false, code: "TOKEN_EXPIRED" };
  }

  if (!verifySecretHash(parsed.value.secret, input.record.secretHash)) {
    return { ok: false, code: "TOKEN_SECRET_MISMATCH" };
  }

  return {
    ok: true,
    tokenId: input.record.tokenId,
    purpose: input.record.purpose,
    expiresAt: new Date(input.record.expiresAt.getTime()),
  };
}
