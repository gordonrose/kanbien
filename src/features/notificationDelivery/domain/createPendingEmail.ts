import { createHash, randomUUID } from "node:crypto";
import { DuplicateEmailRequestError } from "../contract/errors";
import { toOutboundEmail } from "./presenters";
import { sanitizeNotificationContent } from "./sanitizeContent";
import type { NotificationDeliveryRepository } from "../persistence/repository";
import type { SendEmailInput } from "./types";

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function buildDuplicateGuardFingerprint(input: SendEmailInput): string {
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

export async function createPendingEmail(
  repository: NotificationDeliveryRepository,
  providerName: string,
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
    provider: providerName,
    createdByActorType: input.createdByActorType,
    createdByActorId: input.createdByActorId,
    requestedAt: new Date(),
    duplicateGuardFingerprint: fingerprint,
  });

  await repository.createContentSnapshot({
    contentSnapshotId: randomUUID(),
    emailId,
    subject: sanitizedContent.subject,
    bodyText: sanitizedContent.bodyText,
    containsRedactedVerificationLink: sanitizedContent.containsRedactedVerificationLink,
    containsRedactedResetLink: sanitizedContent.containsRedactedResetLink,
  });

  const details = await repository.findById(emailId);
  if (!details) {
    throw new Error("Expected outbound email to exist after creating pending email.");
  }

  return toOutboundEmail(details);
}
