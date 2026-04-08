import { createHash, randomUUID } from "node:crypto";
import {
  DuplicateEmailRequestError,
  NotificationProviderMisconfiguredError,
  NotificationProviderUnavailableError,
  NotificationSendFailedError,
} from "../contract/errors";
import { toOutboundEmail } from "./presenters";
import { sanitizeNotificationContent } from "./sanitizeContent";
import type { SendEmailInput } from "./types";
import type { NotificationDeliveryRepository } from "../persistence/repository";
import type { NotificationEmailProvider } from "./provider";

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function buildDuplicateGuardFingerprint(input: SendEmailInput): string {
  const normalized = JSON.stringify({
    notificationType: normalizeText(input.notificationType),
    recipientEmail: normalizeText(input.recipientEmail),
    subject: normalizeText(input.subject),
    bodyText: input.bodyText.trim(),
    tenantId: input.tenantId ?? null,
    relatedEntityType: input.relatedEntityType ?? null,
    relatedEntityId: input.relatedEntityId ?? null,
  });

  return createHash("sha256").update(normalized).digest("hex");
}

export async function sendEmail(
  repository: NotificationDeliveryRepository,
  provider: NotificationEmailProvider,
  input: SendEmailInput,
) {
  const fingerprint = buildDuplicateGuardFingerprint(input);
  const duplicate = await repository.findRecentDuplicateRequest({
    normalizedRecipientEmail: input.recipientEmail.trim().toLowerCase(),
    duplicateGuardFingerprint: fingerprint,
    requestedAfter: new Date(Date.now() - 5000),
  });

  if (duplicate) {
    throw new DuplicateEmailRequestError();
  }

  const emailId = randomUUID();
  const sanitizedContent = sanitizeNotificationContent({
    subject: input.subject,
    bodyText: input.bodyText,
    redactions: input.redactions,
  });

  await repository.createLogicalEmail({
    emailId,
    channel: "email",
    notificationType: input.notificationType.trim(),
    templateKey: input.templateKey ?? null,
    tenantId: input.tenantId ?? null,
    relatedEntityType: input.relatedEntityType ?? null,
    relatedEntityId: input.relatedEntityId ?? null,
    recipientEmail: input.recipientEmail.trim().toLowerCase(),
    subject: input.subject.trim(),
    status: "pending",
    provider: provider.providerName,
    createdByActorType: input.createdByActorType,
    createdByActorId: input.createdByActorId,
    requestedAt: new Date(),
    duplicateGuardFingerprint: fingerprint,
  });

  const contentSnapshot = await repository.createContentSnapshot({
    contentSnapshotId: randomUUID(),
    emailId,
    subject: sanitizedContent.subject,
    bodyText: sanitizedContent.bodyText,
    containsRedactedVerificationLink: sanitizedContent.containsRedactedVerificationLink,
    containsRedactedResetLink: sanitizedContent.containsRedactedResetLink,
  });

  const providerResult = await provider.send({
    recipientEmail: input.recipientEmail.trim().toLowerCase(),
    subject: input.subject.trim(),
    bodyText: input.bodyText.trim(),
  });

  const details = await repository.recordAttempt({
    attemptId: randomUUID(),
    emailId,
    contentSnapshotId: contentSnapshot.contentSnapshotId,
    status: providerResult.success ? "sent" : "failed",
    providerMessageId: providerResult.success ? providerResult.providerMessageId : null,
    providerResponseCode: providerResult.providerResponseCode,
    providerErrorSummary: providerResult.success ? null : providerResult.providerErrorSummary,
    resentByActorType: null,
    resentByActorId: null,
    resendReason: null,
  });

  if (!providerResult.success) {
    if (providerResult.failureType === "misconfigured") {
      throw new NotificationProviderMisconfiguredError();
    }
    if (providerResult.failureType === "provider_unavailable") {
      throw new NotificationProviderUnavailableError();
    }
    throw new NotificationSendFailedError();
  }

  return toOutboundEmail(details);
}
