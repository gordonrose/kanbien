import { randomUUID } from "node:crypto";
import { createOneTimeTokenMaterial, parseOneTimeToken, verifyOneTimeTokenAgainstRecord } from "../../../lib/tokens";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { NotificationEmailWriter } from "../../notificationDelivery";
import type { VisibleTenantsReader } from "../../tenants";
import {
  TenantAdminAlreadyDeletedError,
  TenantAdminAlreadyVerifiedError,
  TenantAdminEmailAlreadyExistsError,
  TenantAdminNotDeletedError,
  TenantAdminNotFoundError,
  TenantAdminVerificationNotEligibleError,
  TenantAdminVerificationTokenExpiredError,
  TenantAdminVerificationTokenInvalidError,
} from "../contract/errors";
import { toTenantAdminListResult, toTenantAdminSummary } from "./presenters";
import type { TenantAdminListResult } from "./types";
import type { TenantAdminsRepository } from "../persistence/repository";

const VERIFICATION_TTL_SECONDS = 60 * 60 * 24;

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function buildVerificationLink(rawToken: string): string {
  return `https://kanbien.invalid/tenant-admin-verification?token=${encodeURIComponent(rawToken)}`;
}

function buildVerificationEmailBody(input: {
  firstName: string | null;
  tenantName: string;
  verificationLink: string;
}): string {
  const greeting = input.firstName ? `Hi ${input.firstName},` : "Hello,";
  return `${greeting}

You have been added as a tenant admin for ${input.tenantName}.

Use the verification link below to confirm this email address:
${input.verificationLink}
`;
}

async function writeAuditEvent(
  platformSecurityRepository: PlatformSecurityRepository | undefined,
  input: {
    eventType: string;
    eventOutcome: "success" | "failure";
    authPrincipalId?: string;
    rootUserId?: string;
    ipAddress?: string;
    userAgent?: string;
  },
) {
  if (!platformSecurityRepository) {
    return;
  }

  await platformSecurityRepository.createSecurityAuditEvent({
    eventId: randomUUID(),
    eventType: input.eventType,
    eventOutcome: input.eventOutcome,
    authPrincipalId: input.authPrincipalId,
    rootUserId: input.rootUserId,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    occurredAt: new Date(),
  });
}

export interface TenantAdminsService {
  createTenantAdmin(input: {
    tenantId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdByRootAdminUserId: string;
  }): Promise<ReturnType<typeof toTenantAdminSummary>>;
  getTenantAdmin(input: { tenantId: string; tenantAdminId: string }): Promise<ReturnType<typeof toTenantAdminSummary>>;
  listTenantAdmins(input: Parameters<TenantAdminsRepository["listVisible"]>[0]): Promise<TenantAdminListResult>;
  updateTenantAdminProfile(input: {
    tenantId: string;
    tenantAdminId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<ReturnType<typeof toTenantAdminSummary>>;
  sendTenantAdminVerificationEmail(input: {
    tenantId: string;
    tenantAdminId: string;
    requestedByActorId: string;
  }): Promise<ReturnType<typeof toTenantAdminSummary>>;
  resendTenantAdminVerificationEmail(input: {
    tenantId: string;
    tenantAdminId: string;
    requestedByActorId: string;
    resendReason?: string;
  }): Promise<ReturnType<typeof toTenantAdminSummary>>;
  redeemTenantAdminVerificationToken(input: { token: string }): Promise<ReturnType<typeof toTenantAdminSummary>>;
  softDeleteTenantAdmin(input: { tenantId: string; tenantAdminId: string }): Promise<ReturnType<typeof toTenantAdminSummary>>;
  reactivateTenantAdmin(input: { tenantId: string; tenantAdminId: string }): Promise<ReturnType<typeof toTenantAdminSummary>>;
  writeAuditEvent(input: {
    eventType: string;
    eventOutcome: "success" | "failure";
    authPrincipalId?: string;
    rootUserId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void>;
}

export function createTenantAdminsService(
  repository: TenantAdminsRepository,
  visibleTenantsReader: VisibleTenantsReader,
  notificationEmailWriter: NotificationEmailWriter,
  platformSecurityRepository?: PlatformSecurityRepository,
): TenantAdminsService {
  async function requireVisibleTenant(tenantId: string) {
    const tenant = await visibleTenantsReader.findVisibleTenantById(tenantId);
    if (!tenant) {
      throw new TenantAdminNotFoundError();
    }
    return tenant;
  }

  async function requireVisibleTenantAdmin(tenantId: string, tenantAdminId: string) {
    await requireVisibleTenant(tenantId);
    const tenantAdmin = await repository.findVisibleById(tenantId, tenantAdminId);
    if (!tenantAdmin) {
      throw new TenantAdminNotFoundError();
    }
    return tenantAdmin;
  }

  async function ensureUniqueActiveEmail(
    tenantId: string,
    email: string,
    currentTenantAdminId?: string,
  ) {
    const existing = await repository.findActiveByNormalizedEmail(tenantId, normalizeEmail(email));
    if (existing && existing.tenantAdminId !== currentTenantAdminId) {
      throw new TenantAdminEmailAlreadyExistsError();
    }
  }

  async function issueVerificationEmail(input: {
    tenantId: string;
    tenantAdminId: string;
    requestedByActorId: string;
    resendReason?: string;
  }) {
    const tenant = await requireVisibleTenant(input.tenantId);
    const tenantAdmin = await requireVisibleTenantAdmin(input.tenantId, input.tenantAdminId);
    if (tenantAdmin.deletedAt) {
      throw new TenantAdminVerificationNotEligibleError();
    }
    if (tenantAdmin.emailVerificationStatus === "verified") {
      throw new TenantAdminAlreadyVerifiedError();
    }

    const previousToken = await repository.findLatestActiveVerificationTokenByTenantAdminId(
      tenantAdmin.tenantAdminId,
    );
    await repository.invalidateActiveVerificationTokens(tenantAdmin.tenantAdminId);

    const tokenMaterial = createOneTimeTokenMaterial({
      purpose: "email_verification",
      ttlSeconds: VERIFICATION_TTL_SECONDS,
    });
    await repository.createVerificationToken({
      tenantAdminVerificationTokenId: randomUUID(),
      tenantAdminId: tenantAdmin.tenantAdminId,
      tokenId: tokenMaterial.tokenId,
      secretHash: tokenMaterial.secretHash,
      expiresAt: tokenMaterial.expiresAt,
      requestedByActorType: "root_user",
      requestedByActorId: input.requestedByActorId,
    });

    const verificationLink = buildVerificationLink(tokenMaterial.rawToken);
    const subject = `Verify your ${tenant.name} tenant-admin email`;
    const bodyText = buildVerificationEmailBody({
      firstName: tenantAdmin.firstName,
      tenantName: tenant.name,
      verificationLink,
    });

    const outboundEmail =
      previousToken?.outboundEmailId && input.resendReason !== undefined
        ? await notificationEmailWriter.resendEmail({
            emailId: previousToken.outboundEmailId,
            resentByActorType: "root_user",
            resentByActorId: input.requestedByActorId,
            resendReason: input.resendReason,
            subject,
            bodyText,
            redactions: [{ rawValue: verificationLink, placeholder: "[VERIFICATION LINK]" }],
          })
        : await notificationEmailWriter.sendEmail({
            recipientEmail: tenantAdmin.email,
            subject,
            bodyText,
            notificationType: "tenant_admin_email_verification",
            tenantId: tenant.tenantId,
            relatedEntityType: "tenant_admin",
            relatedEntityId: tenantAdmin.tenantAdminId,
            templateKey: "tenant-admin-email-verification",
            createdByActorType: "root_user",
            createdByActorId: input.requestedByActorId,
            redactions: [{ rawValue: verificationLink, placeholder: "[VERIFICATION LINK]" }],
          });

    await repository.attachOutboundEmailToVerificationToken(tokenMaterial.tokenId, outboundEmail.emailId);

    const refreshed = await repository.markVerificationEmailRequested(
      tenantAdmin.tenantAdminId,
      new Date(outboundEmail.requestedAt),
    );
    return toTenantAdminSummary(refreshed);
  }

  return {
    async createTenantAdmin(input) {
      await requireVisibleTenant(input.tenantId);
      await ensureUniqueActiveEmail(input.tenantId, input.email);
      const created = await repository.create({
        tenantAdminId: randomUUID(),
        tenantId: input.tenantId,
        email: input.email,
        firstName: input.firstName?.trim() ?? null,
        lastName: input.lastName?.trim() ?? null,
        createdByRootAdminUserId: input.createdByRootAdminUserId,
      });
      return toTenantAdminSummary(created);
    },
    async getTenantAdmin(input) {
      return toTenantAdminSummary(await requireVisibleTenantAdmin(input.tenantId, input.tenantAdminId));
    },
    async listTenantAdmins(input) {
      await requireVisibleTenant(input.tenantId);
      const result = await repository.listVisible(input);
      return toTenantAdminListResult({
        items: result.items.map(toTenantAdminSummary),
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.max(1, Math.ceil(result.totalMatchingRecords / input.pageSize)),
        totalSearchableRecords: result.totalSearchableRecords,
        totalMatchingRecords: result.totalMatchingRecords,
      });
    },
    async updateTenantAdminProfile(input) {
      const current = await requireVisibleTenantAdmin(input.tenantId, input.tenantAdminId);
      const nextEmail = input.email !== undefined ? normalizeEmail(input.email) : current.email;
      await ensureUniqueActiveEmail(input.tenantId, nextEmail, current.tenantAdminId);
      const emailChanged = input.email !== undefined && normalizeEmail(input.email) !== current.email;
      if (emailChanged) {
        await repository.invalidateActiveVerificationTokens(current.tenantAdminId);
      }
      const updated = await repository.update({
        tenantId: input.tenantId,
        tenantAdminId: input.tenantAdminId,
        email: input.email,
        firstName: input.firstName?.trim(),
        lastName: input.lastName?.trim(),
        resetVerification: emailChanged,
      });
      return toTenantAdminSummary(updated);
    },
    async sendTenantAdminVerificationEmail(input) {
      return issueVerificationEmail(input);
    },
    async resendTenantAdminVerificationEmail(input) {
      return issueVerificationEmail(input);
    },
    async redeemTenantAdminVerificationToken(input) {
      const parsed = parseOneTimeToken(input.token);
      if (!parsed.ok) {
        throw new TenantAdminVerificationTokenInvalidError();
      }
      const record = await repository.findVerificationTokenByTokenId(parsed.value.tokenId);
      if (!record || record.invalidatedAt) {
        throw new TenantAdminVerificationTokenInvalidError();
      }
      const verificationResult = verifyOneTimeTokenAgainstRecord({
        rawToken: input.token,
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
      if (tenantAdmin.emailVerificationStatus === "verified") {
        throw new TenantAdminAlreadyVerifiedError();
      }
      await repository.markVerificationTokenUsed(record.tokenId);
      const verified = await repository.markVerified(record.tenantAdminId);
      return toTenantAdminSummary(verified);
    },
    async softDeleteTenantAdmin(input) {
      const current = await repository.findVisibleById(input.tenantId, input.tenantAdminId);
      if (!current) {
        if (await repository.findDeletedById(input.tenantId, input.tenantAdminId)) {
          throw new TenantAdminAlreadyDeletedError();
        }
        throw new TenantAdminNotFoundError();
      }
      await repository.invalidateActiveVerificationTokens(current.tenantAdminId);
      return toTenantAdminSummary(await repository.softDelete(input.tenantId, input.tenantAdminId));
    },
    async reactivateTenantAdmin(input) {
      const current = await repository.findDeletedById(input.tenantId, input.tenantAdminId);
      if (!current) {
        if (await repository.findVisibleById(input.tenantId, input.tenantAdminId)) {
          throw new TenantAdminNotDeletedError();
        }
        throw new TenantAdminNotFoundError();
      }
      await ensureUniqueActiveEmail(input.tenantId, current.email, current.tenantAdminId);
      await repository.invalidateActiveVerificationTokens(current.tenantAdminId);
      return toTenantAdminSummary(await repository.reactivate(input.tenantId, input.tenantAdminId));
    },
    async writeAuditEvent(input) {
      await writeAuditEvent(platformSecurityRepository, input);
    },
  };
}
