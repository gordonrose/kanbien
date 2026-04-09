import type { Pool } from "pg";
import {
  parseOneTimeToken,
  verifyOneTimeTokenAgainstRecord,
} from "../../lib/tokens";
import {
  TenantAdminAlreadyVerifiedError,
  TenantAdminVerificationTokenExpiredError,
  TenantAdminVerificationTokenInvalidError,
} from "./contract/errors";
import type { TenantAdminData } from "./domain/types";
import { createPostgresTenantAdminsRepository } from "./persistence/postgresRepository";
import type { TenantAdminsRepository } from "./persistence/repository";

export interface TenantAdminAuthBootstrapSubject {
  tenantAdminId: string;
  tenantId: string;
  email: string;
  normalizedEmail: string;
  firstName: string | null;
  lastName: string | null;
}

export interface TenantAdminsAuthBootstrapReader {
  consumeVerificationProof(rawToken: string): Promise<TenantAdminAuthBootstrapSubject>;
  listVerifiedActiveByNormalizedEmail(normalizedEmail: string): Promise<TenantAdminAuthBootstrapSubject[]>;
  findVerifiedActiveById(tenantAdminId: string): Promise<TenantAdminAuthBootstrapSubject | null>;
}

function toBootstrapSubject(data: TenantAdminData): TenantAdminAuthBootstrapSubject {
  return {
    tenantAdminId: data.tenantAdminId,
    tenantId: data.tenantId,
    email: data.email,
    normalizedEmail: data.normalizedEmail,
    firstName: data.firstName,
    lastName: data.lastName,
  };
}

export function createTenantAdminsAuthBootstrapReader(
  dbPoolOrRepository: Pool | TenantAdminsRepository,
): TenantAdminsAuthBootstrapReader {
  const repository =
    "query" in dbPoolOrRepository
      ? createPostgresTenantAdminsRepository(dbPoolOrRepository)
      : dbPoolOrRepository;

  return {
    async consumeVerificationProof(rawToken) {
      const parsed = parseOneTimeToken(rawToken);

      if (!parsed.ok) {
        throw new TenantAdminVerificationTokenInvalidError();
      }

      const record = await repository.findVerificationTokenByTokenId(parsed.value.tokenId);
      if (!record || record.invalidatedAt) {
        throw new TenantAdminVerificationTokenInvalidError();
      }

      const verificationResult = verifyOneTimeTokenAgainstRecord({
        rawToken,
        record: {
          tokenId: record.tokenId,
          purpose: record.purpose,
          secretHash: record.secretHash,
          expiresAt: record.expiresAt,
          usedAt: record.usedAt,
        },
        expectedPurpose: "email_verification",
      });

      if (!verificationResult.ok) {
        if (verificationResult.code === "TOKEN_EXPIRED") {
          throw new TenantAdminVerificationTokenExpiredError();
        }
        throw new TenantAdminVerificationTokenInvalidError();
      }

      const tenantAdmin = await repository.findAnyById(record.tenantAdminId);
      if (!tenantAdmin || tenantAdmin.deletedAt) {
        throw new TenantAdminVerificationTokenInvalidError();
      }

      await repository.markVerificationTokenUsed(record.tokenId);
      const verified =
        tenantAdmin.emailVerificationStatus === "verified"
          ? tenantAdmin
          : await repository.markVerified(record.tenantAdminId);

      if (verified.emailVerificationStatus !== "verified") {
        throw new TenantAdminAlreadyVerifiedError();
      }

      return toBootstrapSubject(verified);
    },
    async listVerifiedActiveByNormalizedEmail(normalizedEmail) {
      const records = await repository.findVerifiedActiveByNormalizedEmail(normalizedEmail);
      return records.map(toBootstrapSubject);
    },
    async findVerifiedActiveById(tenantAdminId) {
      const record = await repository.findVerifiedActiveById(tenantAdminId);
      return record ? toBootstrapSubject(record) : null;
    },
  };
}
